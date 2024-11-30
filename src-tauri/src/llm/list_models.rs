use crate::llm::Model;

#[tauri::command]
pub fn list_models() -> Result<Vec<Model>, ()> {
    let models = Model::list_models();

    Ok(models)
}
