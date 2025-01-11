use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Model {
    pub id: String,
    pub name: String,
    pub description: String,
    pub author: ModelAuthor,
    pub variants: Vec<ModelVariant>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ModelVariant {
    pub parameter_size: String,
    pub disk_space: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ModelAuthor {
    pub name: String,
    pub url: String,
}
