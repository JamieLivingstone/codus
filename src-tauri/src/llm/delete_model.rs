use ollama_rs::Ollama;

/// Deletes a model from Ollama
///
/// # Arguments
/// * `model_id` - ID of the model (e.g. "llama3.1", "gemma2")
/// * `parameter_size` - Size of the model variant (e.g. "70b", "2b")
///
/// # Returns
/// * `Ok(())` if deletion was successful
/// * `Err(String)` with error message if deletion failed
///
/// ```
#[tauri::command]
pub async fn delete_model(model_id: String, parameter_size: String) -> Result<(), String> {
    let ollama = Ollama::default();

    ollama
        .delete_model(format!("{}:{}", model_id, parameter_size))
        .await
        .map_err(|e| format!("Failed to delete model: {}", e))?;

    Ok(())
}
