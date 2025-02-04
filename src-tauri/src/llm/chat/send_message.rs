use ollama_rs::{
    generation::chat::{request::ChatMessageRequest, ChatMessage, MessageRole},
    Ollama,
};
use tauri::{AppHandle, Emitter};
use tokio_stream::StreamExt;

/// Streams a chat response from Ollama back to the frontend
///
/// # Arguments
/// * `app_handle` - Tauri app handle for emitting events
/// * `model_id` - Model name (e.g. "llama2")
/// * `parameter_size` - Model size (e.g. "7b")
/// * `message_id` - Unique ID for the message
/// * `messages` - Previous chat messages for context
///
/// # Events Emitted
/// * "chat-message-chunk" with (message_id, chunk)
///
/// # Returns
/// * `Result<ChatMessage, String>` - Complete response or error
#[tauri::command]
pub async fn send_message(
    app_handle: AppHandle,
    model_id: String,
    parameter_size: String,
    message_id: String,
    messages: Vec<ChatMessage>,
) -> Result<ChatMessage, String> {
    let model_name = format!("{}:{}", model_id, parameter_size);
    let request = ChatMessageRequest::new(model_name, messages);
    let ollama = Ollama::default();

    let mut stream = ollama
        .send_chat_messages_stream(request)
        .await
        .map_err(|e| e.to_string())?;

    let mut response = ChatMessage::new(MessageRole::Assistant, String::new());

    while let Some(Ok(chunk)) = stream.next().await {
        if let Some(message_chunk) = chunk.message {
            app_handle
                .emit("chat-message-chunk", (&message_id, &message_chunk.content))
                .map_err(|e| e.to_string())?;
            response.content += &message_chunk.content;
        }
    }

    Ok(response)
}
