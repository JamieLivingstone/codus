use crate::chat::repository::ChatRepository;
use crate::chat::types::Chat;
use std::sync::Arc;
use tauri::AppHandle;
use tokio::sync::RwLock;

pub struct ChatState {
    repository: ChatRepository,
    chats: RwLock<Vec<Chat>>,
}

impl ChatState {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            repository: ChatRepository::new(app_handle),
            chats: RwLock::new(Vec::new()),
        }
    }

    pub async fn initialise(&self) -> Result<(), String> {
        let chats = self.repository.load_chats().await?;
        let mut state_chats = self.chats.write().await;
        *state_chats = chats;
        Ok(())
    }

    pub async fn list_chats(&self, limit: u32, offset: u32) -> Result<Vec<Chat>, String> {
        let chats = self.chats.read().await;
        let offset = offset as usize;
        let limit = limit.max(1) as usize; // Ensure at least 1 item per page

        let start = offset;
        let end = (start + limit).min(chats.len());

        if start >= chats.len() {
            return Ok(Vec::new());
        }

        Ok(chats[start..end].to_vec())
    }
}

pub type ChatStateType = Arc<ChatState>;
