use crate::llm::{Model, ModelSource};
use futures::stream::StreamExt;
use reqwest::Client;
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;
use tauri::{AppHandle, Emitter};
use tokio::time::{timeout, Duration};

/// Downloads a model from Hugging Face (or uses a cached version) with progress updates.
///
/// # Arguments
///
/// * `app` - The Tauri application handle.
/// * `model` - The model to download.
///
/// # Returns
///
/// A `Result` containing the path to the downloaded model if successful, or a `String` error message if an error occurs.
#[tauri::command]
pub async fn download_model(app: AppHandle, model: Model) -> Result<PathBuf, String> {
    let file_path = model.get_model_path(&app);

    // Helper function to clean up file on error
    let cleanup = |file_path: &PathBuf| {
        if file_path.exists() {
            let _ = fs::remove_file(file_path);
        }
    };

    let model_path = match &model.source {
        ModelSource::HuggingFace { repo, tensor_path } => {
            let url = format!(
                "https://huggingface.co/{}/resolve/main/{}",
                repo, tensor_path
            );

            let client = Client::builder()
                .build()
                .map_err(|e| format!("Failed to create HTTP client: {e}"))?;

            let response = client.get(url).send().await.map_err(|e| {
                cleanup(&file_path);
                format!("HTTP request failed: {e}")
            })?;

            if !response.status().is_success() {
                cleanup(&file_path);
                return Err(format!(
                    "Failed to download model: HTTP {}",
                    response.status()
                ));
            }

            let total_size = response.content_length().unwrap_or(0);
            let mut downloaded = 0u64;
            let mut last_percentage = 0;

            fs::create_dir_all(&file_path.parent().unwrap())
                .map_err(|e| format!("Failed to create models directory: {e}"))?;

            let mut file = match File::create(&file_path) {
                Ok(f) => f,
                Err(e) => {
                    cleanup(&file_path);
                    return Err(format!("Failed to create model file: {e}"));
                }
            };

            let mut stream = response.bytes_stream();
            while let Some(chunk_result) =
                match timeout(Duration::from_secs(30), stream.next()).await {
                    Ok(chunk) => chunk,
                    Err(_) => {
                        cleanup(&file_path);
                        return Err("Download chunk timed out - possible network issue".to_string());
                    }
                }
            {
                let chunk = match chunk_result {
                    Ok(c) => c,
                    Err(e) => {
                        cleanup(&file_path);
                        return Err(format!("Error while downloading: {e}"));
                    }
                };

                if let Err(e) = file.write_all(&chunk) {
                    cleanup(&file_path);
                    return Err(format!("Failed to write to file: {e}"));
                }

                downloaded += chunk.len() as u64;
                let current_percentage = ((downloaded as f64 / total_size as f64) * 100.0) as i32;

                if current_percentage > last_percentage {
                    app.emit(
                        "model-download-progress",
                        &(model.name.clone(), current_percentage as f64),
                    )
                    .unwrap();
                    last_percentage = current_percentage;
                }
            }

            file_path
        }
    };

    Ok(model_path)
}
