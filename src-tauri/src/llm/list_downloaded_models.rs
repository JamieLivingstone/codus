use ollama_rs::{models::LocalModel, Ollama};

/// Lists all LLM models that have been downloaded locally through Ollama.
/// Uses the Ollama API to retrieve information about installed models.
///
/// # Returns
/// * `Ok(Vec<LocalModel>)` containing the list of downloaded models
/// * `Err(String)` with error message if listing fails
///
/// ```
#[tauri::command]
pub async fn list_downloaded_models() -> Result<Vec<LocalModel>, String> {
    let ollama = Ollama::default();

    let local_models = ollama
        .list_local_models()
        .await
        .map_err(|e| format!("Failed to list local models: {}", e))?;

    Ok(local_models)
}
