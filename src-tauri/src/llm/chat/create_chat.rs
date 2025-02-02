use chrono::Utc;
use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Chat {
    id: String,
    title: String,
    created_at: String,
    updated_at: String,
}

#[tauri::command]
pub async fn create_chat(chat_id: String) -> Result<Chat, String> {
    let now = Utc::now().to_rfc3339();

    let chat = Chat {
        id: chat_id,
        title: "New Chat".to_string(),
        created_at: now.clone(),
        updated_at: now.clone(),
    };

    Ok(chat)
}
