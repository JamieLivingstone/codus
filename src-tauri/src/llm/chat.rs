use crate::llm::Model;
use llama_cpp::standard_sampler::StandardSampler;
use llama_cpp::{LlamaModel, LlamaParams, SessionParams};
use std::path::PathBuf;
use tauri::AppHandle;

/// Sends a message to the LLM model and gets a response.
///
/// # Arguments
///
/// * `app` - The Tauri application handle.
/// * `model` - The model to use for generating the response.
/// * `message` - The input message to send to the model.
///
/// # Returns
///
/// A `Result` containing the model's response as a `String` if successful,
/// or a `String` error message if an error occurs.
#[tauri::command]
pub async fn send_message(
    app: AppHandle,
    model: Model,
    messages: Vec<String>,
) -> Result<String, String> {
    let model_path = model.get_model_path(&app);

    // Validate model path exists
    if !PathBuf::from(&model_path).exists() {
        return Err("Model file not found".to_string());
    }

    let model = LlamaModel::load_from_file(&model_path, LlamaParams::default())
        .map_err(|e| format!("Failed to load model: {}", e))?;

    let mut ctx = model
        .create_session(SessionParams::default())
        .map_err(|e| format!("Failed to create session: {}", e))?;

    ctx.advance_context(messages.last().unwrap()).unwrap();

    let mut output = String::new();

    let sampler = StandardSampler::default();

    let completions = ctx
        .start_completing_with(sampler, 6000)
        .map_err(|e| format!("Failed to generate completion: {}", e))?
        .into_strings();

    for completion in completions {
        println!("{}", &completion);
        output.push_str(&completion);
    }

    Ok(output)
}
