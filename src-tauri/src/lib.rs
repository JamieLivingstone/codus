mod encoding;
mod generators;
mod llm;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            encoding::decode_jwt,
            generators::generate_uuid,
            llm::chat::send_message,
            llm::manage_models::delete_model,
            llm::manage_models::download_model,
            llm::manage_models::list_models,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
