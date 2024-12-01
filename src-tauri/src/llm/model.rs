use serde::{Deserialize, Serialize};

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
