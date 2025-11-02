use crate::chat::state::ChatStateType;
use crate::chat::types::Message;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
#[specta::specta]
pub async fn list_chat_messages(
    chat_state: State<'_, ChatStateType>,
    chat_id: Uuid,
) -> Result<Vec<Message>, String> {
    chat_state
        .list_chats(chat_id)
        .await
}
