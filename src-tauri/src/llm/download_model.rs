use ollama_rs::Ollama;
use tauri::Emitter;
use tokio::time::{Duration, Instant};
use tokio_stream::StreamExt;

/// Downloads a model from Ollama and emits progress events
///
/// # Arguments
/// * `handle` - Tauri app handle for emitting events
/// * `model_id` - ID of the model (e.g. "llama3.1", "gemma2")
/// * `parameter_size` - Size of the model variant (e.g. "70b", "2b")
///
/// # Events Emitted
/// Emits "model-download-progress" events with a tuple of:
/// * model_id (String)
/// * parameter_size (String)
/// * download percentage (u64)
///
/// # Returns
/// * `Ok(())` if download completed successfully
/// * `Err(String)` with error message if download failed
///
/// ```
#[tauri::command]
pub async fn download_model(
    handle: tauri::AppHandle,
    model_id: String,
    parameter_size: String,
) -> Result<(), String> {
    let ollama = Ollama::default();
    let model_name = format!("{}:{}", model_id, parameter_size);

    let mut stream = ollama
        .pull_model_stream(model_name, true)
        .await
        .map_err(|e| format!("Failed to download model: {}", e))?;

    let mut last_percentage = 0;
    let mut last_activity = Instant::now();
    let timeout = Duration::from_secs(60);

    while let Some(result) = stream.next().await {
        if last_activity.elapsed() > timeout {
            return Err("Download timed out after 60 seconds of inactivity".to_string());
        }

        let progress = result.map_err(|e| format!("Stream error: {}", e))?;
        last_activity = Instant::now();

        let downloaded_percentage = match (progress.completed, progress.total) {
            (Some(completed), Some(total)) => ((completed as f64 / total as f64) * 100.0) as u64,
            _ => last_percentage.max(0),
        };

        if downloaded_percentage != last_percentage && downloaded_percentage < 100 {
            handle
                .emit(
                    "model-download-progress",
                    (&model_id, &parameter_size, downloaded_percentage),
                )
                .unwrap();
            last_percentage = downloaded_percentage;
        }
    }

    Ok(())
}
