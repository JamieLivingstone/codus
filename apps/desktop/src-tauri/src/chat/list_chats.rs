use crate::chat::state::ChatStateType;
use crate::chat::types::Chat;
use tauri::State;

#[tauri::command]
#[specta::specta]
pub async fn list_chats(
    chat_state: State<'_, ChatStateType>,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<Chat>, String> {
    chat_state
        .list_chats(limit.unwrap_or(10), offset.unwrap_or(0))
        .await
}
