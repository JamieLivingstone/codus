use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Deserialize, Serialize)]
#[serde(tag = "type")]
pub enum ModelSource {
    HuggingFace { repo: String, tensor_path: String },
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Model {
    pub name: String,
    pub source: ModelSource,
}

impl Model {
    pub fn get_model_path(&self, app: &AppHandle) -> PathBuf {
        let models_dir = app.path().app_data_dir().unwrap().join("models");
        models_dir.join(format!("{}.gguf", &self.name))
    }
}
