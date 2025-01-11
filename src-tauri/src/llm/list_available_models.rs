use crate::llm::Model;
use serde::de::Error;
use tauri::path::BaseDirectory;
use tauri::Manager;
use tokio::fs::read_to_string;

/// Lists all available LLM models that can be downloaded and used through Ollama.
/// The list of models is maintained in a JSON file and includes popular open models like
/// Llama, Gemma, Mistral, and others. Additional models can be found at https://ollama.com/library
///
/// Reads the available models from available_models.json in the same directory
/// and parses them into a list of Model structs. The JSON file contains model metadata
/// including names, descriptions, parameter sizes and disk space requirements.
///
/// # Arguments
/// * `handle` - Tauri app handle used to resolve resource paths
///
/// # Returns
/// * `Ok(Vec<Model>)` containing the list of available models
/// * `Err(String)` with error message if loading/parsing fails
///
/// ```
#[tauri::command]
pub async fn list_available_models(handle: tauri::AppHandle) -> Result<Vec<Model>, String> {
    let available_models_path = handle
        .path()
        .resolve(
            "resources/llm/available_models.json",
            BaseDirectory::Resource,
        )
        .map_err(|e| format!("Failed to resolve available models path: {}", e))?;

    let available_models_json = read_to_string(available_models_path)
        .await
        .map_err(|e| format!("Failed to read available models file: {}", e))?;

    let models: Vec<Model> = serde_json::from_str::<serde_json::Value>(&available_models_json)
        .and_then(|json| {
            json.get("models")
                .ok_or_else(|| serde_json::Error::custom("Missing 'models' key"))
                .and_then(|models| serde_json::from_value(models.to_owned()))
        })
        .map_err(|e| format!("Failed to parse available models JSON: {}", e))?;

    Ok(models)
}
