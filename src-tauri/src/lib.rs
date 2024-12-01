mod encoding;
mod llm;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            encoding::decode_jwt,
            llm::delete_model,
            llm::download_model,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
