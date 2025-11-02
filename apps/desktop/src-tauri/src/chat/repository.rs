use crate::chat::types::{Chat, Message, MessageRole};
use std::sync::Arc;
use tauri::AppHandle;
use tauri_plugin_store::{Store, StoreExt};

/// Simple repository for chat data access
pub struct ChatRepository {
    app_handle: AppHandle,
}

impl ChatRepository {
    pub fn new(app_handle: AppHandle) -> Self {
        Self { app_handle }
    }

    pub async fn load_chats(&self) -> Result<Vec<Chat>, String> {
        Ok(self.seed_chats())
    }

    /// Get the store instance
    fn get_store(&self) -> Result<Arc<Store<tauri::Wry>>, String> {
        self.app_handle
            .store("chat_store.json")
            .map_err(|e| format!("Failed to get store: {}", e))
    }

    /// Create seed data for development/testing
    fn seed_chats(&self) -> Vec<Chat> {
        let now = chrono::Utc::now().to_rfc3339();

        vec![
            Chat {
                id: "1".to_string(),
                title: "React Components".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "2".to_string(),
                title: "API Integration".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "3".to_string(),
                title: "Database Design".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "4".to_string(),
                title: "Rust & Tauri Development".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "5".to_string(),
                title: "State Management Patterns".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "6".to_string(),
                title: "Authentication Flows".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "7".to_string(),
                title: "GraphQL vs REST".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "8".to_string(),
                title: "Next.js Routing Strategies".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "9".to_string(),
                title: "Dockerizing Applications".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "10".to_string(),
                title: "CI/CD Pipeline Setup".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "11".to_string(),
                title: "Unit Testing in Rust".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "12".to_string(),
                title: "TypeScript Generics Deep Dive".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "13".to_string(),
                title: "WebSocket Implementation".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "14".to_string(),
                title: "Performance Optimization".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "15".to_string(),
                title: "Server-Side Rendering".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "16".to_string(),
                title: "Responsive UI Design".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "17".to_string(),
                title: "Error Handling in Async Rust".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "18".to_string(),
                title: "Custom React Hooks".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "19".to_string(),
                title: "Working with JSON APIs".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "20".to_string(),
                title: "User Authentication with JWT".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "21".to_string(),
                title: "Microservices Architecture".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "22".to_string(),
                title: "Cross-Platform Desktop Apps".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "23".to_string(),
                title: "UI Animations with Framer Motion".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "24".to_string(),
                title: "Web Security Essentials".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "25".to_string(),
                title: "Rust Error Propagation Patterns".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "26".to_string(),
                title: "Integrating TailwindCSS".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "27".to_string(),
                title: "AI Integration in Apps".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "28".to_string(),
                title: "Local Storage vs IndexedDB".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "29".to_string(),
                title: "Version Control Best Practices".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "30".to_string(),
                title: "Error Boundaries in React".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "31".to_string(),
                title: "Async/Await in JavaScript".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "32".to_string(),
                title: "WebAssembly Experiments".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "33".to_string(),
                title: "GitHub Actions Automation".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "34".to_string(),
                title: "Building REST APIs with Axum".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "35".to_string(),
                title: "Deploying on Vercel".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "36".to_string(),
                title: "Handling Large File Uploads".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "37".to_string(),
                title: "Dependency Injection in Rust".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "38".to_string(),
                title: "Dark Mode Implementation".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "39".to_string(),
                title: "Optimizing Bundle Size".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "40".to_string(),
                title: "Mobile Responsiveness Testing".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "41".to_string(),
                title: "Local Development Setup".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "42".to_string(),
                title: "Cross-Origin Resource Sharing".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "43".to_string(),
                title: "Logging and Monitoring".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "44".to_string(),
                title: "Debugging Rust Async Code".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "45".to_string(),
                title: "Custom Build Scripts".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "46".to_string(),
                title: "Secure Token Storage".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "47".to_string(),
                title: "Error Reporting Tools".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "48".to_string(),
                title: "Accessibility in Web Apps".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "49".to_string(),
                title: "Improving Build Times".to_string(),
                created_at: now.clone(),
                updated_at: now.clone(),
            },
            Chat {
                id: "50".to_string(),
                title: "End-to-End Testing Strategies".to_string(),
                created_at: now.clone(),
                updated_at: now,
            },
        ]
    }

    fn seed_messages(&self) -> Vec<Message> {
        vec![
            Message {
                id: "1".to_string(),
                chat_id: "1".to_string(),
                role: MessageRole::User,
                content: "Hello, how are you?".to_string(),
                created_at: chrono::Utc::now().to_rfc3339(),
                updated_at: chrono::Utc::now().to_rfc3339(),
            },
            Message {
                id: "2".to_string(),
                chat_id: "1".to_string(),
                role: "assistant".to_string(),
                content: "I'm fine, thank you!".to_string(),
                created_at: chrono::Utc::now().to_rfc3339(),
                updated_at: chrono::Utc::now().to_rfc3339(),
            },
        ]
    }
}
