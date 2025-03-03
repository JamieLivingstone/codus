use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tokio::fs::read_to_string;

#[derive(Debug, Deserialize, Serialize)]
pub struct Model {
    pub id: String,
    pub name: String,
    pub description: String,
    pub author: ModelAuthor,
    pub variants: Vec<ModelVariant>,
}

impl Model {
    pub async fn from_json(models_path: PathBuf) -> Result<Vec<Model>, String> {
        let models_json = read_to_string(models_path)
            .await
            .map_err(|e| format!("Failed to read available models file: {}", e))?;

        let json: serde_json::Value = serde_json::from_str(&models_json)
            .map_err(|e| format!("Failed to parse JSON: {}", e))?;

        let models = json
            .get("models")
            .ok_or_else(|| "Missing 'models' key".to_string())
            .and_then(|models| {
                serde_json::from_value(models.clone())
                    .map_err(|e| format!("Failed to parse models data: {}", e))
            })?;

        Ok(models)
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ModelVariant {
    pub parameter_size: String,
    pub disk_space: String,
    #[serde(default)]
    pub downloaded: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ModelAuthor {
    pub name: String,
    pub url: String,
}
#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::NamedTempFile;

    fn create_test_file(json: &str) -> NamedTempFile {
        let temp_file = NamedTempFile::new().unwrap();
        fs::write(&temp_file, json).unwrap();
        temp_file
    }

    #[tokio::test]
    async fn test_parses_valid_json_successfully() {
        let json = r#"{
            "models": [{
                "id": "llama2",
                "name": "Llama 2",
                "description": "A test model",
                "author": {
                    "name": "Meta",
                    "url": "https://meta.com"
                },
                "variants": [{
                    "parameter_size": "7b",
                    "disk_space": "4.1GB"
                }]
            }]
        }"#;

        let temp_file = create_test_file(json);
        let models = Model::from_json(temp_file.path().to_path_buf())
            .await
            .unwrap();

        assert_eq!(models.len(), 1);
        let model = &models[0];
        assert_eq!(model.id, "llama2");
        assert_eq!(model.variants[0].downloaded, false);
    }

    #[tokio::test]
    async fn test_returns_error_when_models_key_missing() {
        let temp_file = create_test_file(r#"{ "wrong_key": [] }"#);
        let result = Model::from_json(temp_file.path().to_path_buf()).await;

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("Missing 'models' key"));
    }

    #[tokio::test]
    async fn test_returns_error_for_nonexistent_file() {
        let result = Model::from_json(PathBuf::from("nonexistent.json")).await;
        assert!(result.is_err());
        assert!(result
            .unwrap_err()
            .contains("Failed to read available models file"));
    }
}
