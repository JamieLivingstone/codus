use crate::llm::Model;
use ollama_rs::Ollama;
use tauri::path::BaseDirectory;
use tauri::Manager;

/// Lists all available LLM models that can be downloaded and used through Ollama.
/// The list of models is maintained in a JSON file and includes popular open models like
/// Llama, Gemma, Mistral, and others. Additional models can be found at https://ollama.com/library
///
/// Reads the available models from available_models.json in the same directory
/// and parses them into a list of Model structs. The JSON file contains model metadata
/// including names, descriptions, parameter sizes and disk space requirements.
///
/// The function also queries Ollama for locally downloaded models and merges this information,
/// marking which model variants are already downloaded and available for use.
///
/// # Arguments
/// * `handle` - Tauri app handle used to resolve resource paths
///
/// # Returns
/// * `Ok(Vec<Model>)` containing the list of available models with download status
/// * `Err(String)` with error message if loading/parsing fails
///
/// ```
#[tauri::command]
pub async fn list_models(handle: tauri::AppHandle) -> Result<Vec<Model>, String> {
    let ollama = Ollama::default();

    let local_models = ollama
        .list_local_models()
        .await
        .map_err(|e| format!("Failed to list local models: {}", e))?;

    let available_models_path = handle
        .path()
        .resolve(
            "resources/llm/available_models.json",
            BaseDirectory::Resource,
        )
        .map_err(|e| format!("Failed to resolve available models path: {}", e))?;

    let mut models: Vec<Model> = Model::from_json(available_models_path)
        .await
        .map_err(|e| format!("Failed to load available models: {}", e))?;

    for model in &mut models {
        for variant in &mut model.variants {
            variant.downloaded = local_models.iter().any(|local_model| {
                local_model.name == format!("{}:{}", model.id, variant.parameter_size)
            });
        }
    }

    Ok(models)
}
