use ollama_rs::Ollama;
use tauri::Emitter;
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

    let mut res = ollama
        .pull_model_stream(format!("{}:{}", model_id, parameter_size), true)
        .await
        .map_err(|e| format!("Failed to download model: {}", e))?;

    let mut last_percentage = 0;

    while let Some(res) = res.next().await {
        let res = res.unwrap();

        let downloaded_percentage =
            if let (Some(completed), Some(total)) = (res.completed, res.total) {
                ((completed as f64 / total as f64) * 100.0) as u64
            } else {
                0
            };

        if downloaded_percentage != last_percentage {
            handle
                .emit(
                    "model-download-progress",
                    (&model_id, &parameter_size, downloaded_percentage),
                )
                .unwrap();
            last_percentage = downloaded_percentage;
        }
    }

    handle
        .emit("model-download-progress", (&model_id, &parameter_size, 100))
        .unwrap();

    Ok(())
}
