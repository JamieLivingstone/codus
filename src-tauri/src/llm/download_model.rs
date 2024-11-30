use std::path::PathBuf;

use hf_hub::api::sync::ApiBuilder;
use tauri::{AppHandle, Emitter};

use crate::llm::{Model, ModelSource};

/// Downloads a model from Hugging Face (or uses a cached version).
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
    app.emit("download-started", &model.name).unwrap();

    let model_path = match &model.source {
        ModelSource::HuggingFace { repo, tensor_path } => ApiBuilder::new()
            .with_progress(true)
            .build()
            .map_err(|e| format!("Unable to create hugging face api instance: {e}"))?
            .model(repo.clone())
            .download(&tensor_path)
            .map_err(|e| format!("Unable to download model: {e}")),
    }?;

    app.emit("download-completed", &model.name).unwrap();

    Ok(model_path)
}
