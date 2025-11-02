mod chat;

use chat::state::{ChatState, ChatStateType};
use specta_typescript::Typescript;
use std::sync::Arc;
use tauri::Manager;
use tauri_specta::{collect_commands, Builder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder =
        Builder::<tauri::Wry>::new().commands(collect_commands![chat::list_chats::list_chats,]);

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(
            Typescript::default()
                .header("// biome-ignore-all lint: Do not lint generated file")
                .formatter(specta_typescript::formatter::biome),
            "../src/bindings.ts",
        )
        .expect("Failed to export TypeScript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let chat_state: ChatStateType = Arc::new(ChatState::new(app_handle));

            // Store the state in Tauri's state management
            app.manage(chat_state.clone());

            // Initialize the state manager (load chats from storage)
            let state_clone = chat_state.clone();
            tauri::async_runtime::spawn(async move {
                if let Err(e) = state_clone.initialise().await {
                    eprintln!("Failed to initialise chat state: {}", e);
                }
            });

            Ok(())
        })
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
