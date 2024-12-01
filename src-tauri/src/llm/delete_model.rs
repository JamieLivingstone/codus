use crate::llm::Model;
use std::fs;
use tauri::{AppHandle, Manager};

/// Deletes a model file and removes it from the saved models store.
///
/// # Arguments
///
/// * `app` - The Tauri application handle.
/// * `model_name` - Name of the model to delete.
///
/// # Returns
///
/// A `Result` containing `()` if successful, or a `String` error message if an error occurs.
#[tauri::command]
pub async fn delete_model(app: AppHandle, model: Model) -> Result<(), String> {
    let models_dir = app.path().app_data_dir().unwrap().join("models");
    let model_path = models_dir.join(&model.name);

    if model_path.exists() {
        fs::remove_file(&model_path).map_err(|e| format!("Failed to delete model file: {e}"))?;
    }

    Ok(())
}
