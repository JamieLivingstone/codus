use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum ModelSource {
    HuggingFace { repo: String, tensor_path: String },
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Model {
    pub name: String,
    pub source: ModelSource,
}

impl Model {
    pub fn list_models() -> Vec<Model> {
        vec![
            Model {
                name: "Qwen2.5-Coder-7B-Instruct-GGUF".to_string(),
                source: ModelSource::HuggingFace {
                    repo: "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF".to_string(),
                    tensor_path: "qwen2.5-coder-7b-instruct-q5_k_m.gguf".to_string(),
                },
            },
            Model {
                name: "Qwen2.5-1.5B-Instruct-GGUF".to_string(),
                source: ModelSource::HuggingFace {
                    repo: "Qwen/Qwen2.5-1.5B-Instruct-GGUF".to_string(),
                    tensor_path: "qwen2.5-1.5b-instruct-q6_k.gguf".to_string(),
                },
            },
        ]
    }
}
