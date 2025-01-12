mod encoding;
mod llm;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            encoding::decode_jwt,
            llm::chat,
            llm::delete_model,
            llm::download_model,
            llm::list_available_models,
            llm::list_downloaded_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
