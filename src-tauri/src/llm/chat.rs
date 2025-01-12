use ollama_rs::{
    generation::chat::{request::ChatMessageRequest, ChatMessage, MessageRole},
    Ollama,
};
use tauri::{AppHandle, Emitter};
use tokio_stream::StreamExt;

#[tauri::command]
pub async fn chat(
    app_handle: AppHandle,
    model_id: String,
    parameter_size: String,
    messages: Vec<ChatMessage>,
) -> Result<ChatMessage, String> {
    let model = format!("{}:{}", model_id, parameter_size);
    let request = ChatMessageRequest::new(model, messages);

    let ollama = Ollama::default();
    let mut stream = ollama
        .send_chat_messages_stream(request)
        .await
        .map_err(|e| e.to_string())?;

    let mut response = ChatMessage::new(MessageRole::Assistant, String::new());

    while let Some(Ok(msg)) = stream.next().await {
        if let Some(chat_msg) = msg.message {
            app_handle
                .emit("chat_message", &chat_msg)
                .map_err(|e| e.to_string())?;
            response.content += &chat_msg.content;
        }
    }

    Ok(response)
}
