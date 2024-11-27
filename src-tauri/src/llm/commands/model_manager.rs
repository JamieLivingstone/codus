use anyhow::{Context, Result};
use hf_hub::api::sync::ApiBuilder;
use std::path::PathBuf;

enum Model {
    /// Use an already downloaded model
    Local {
        /// The path to the model. e.g. `/home/.cache/huggingface/hub/models`
        path: PathBuf,
    },
    /// Download a model from hugging face (or use a cached version)
    #[clap(name = "hf-model")]
    HuggingFace {
        /// the repo containing the model. e.g. `TheBloke/Llama-2-7B-Chat-GGUF`
        repo: String,
        /// the model name. e.g. `llama-2-7b-chat.Q4_K_M.gguf`
        model: String,
    },
}

impl Model {
    /// Convert the model to a path - may download from hugging face
    fn get_or_load(self) -> Result<PathBuf> {
        match self {
            Model::Local { path } => Ok(path),
            Model::HuggingFace { model, repo } => ApiBuilder::new()
                .with_progress(true)
                .build()
                .with_context(|| "unable to create hugging face api")?
                .model(repo)
                .get(&model)
                .with_context(|| "unable to download model"),
        }
    }
}
// fn main() -> Result<()> {
//     // Create a model from anything that implements `AsRef<Path>`:
//     let model_path = Model::HuggingFace {
//         repo: "Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF".to_string(),
//         model: "qwen2.5-coder-1.5b-instruct-q4_k_m.gguf".to_string(),
//     }
//     .get_or_load()?;
//
//     let model = LlamaModel::load_from_file(model_path, LlamaParams::default())
//         .expect("Could not load model");
//
//     // A `LlamaModel` holds the weights shared across many _sessions_; while your model may be
//     // several gigabytes large, a session is typically a few dozen to a hundred megabytes!
//     let mut ctx = model
//         .create_session(SessionParams::default())
//         .expect("Failed to create session");
//
//     // You can feed anything that implements `AsRef<[u8]>` into the model's context.
//     ctx.advance_context("Write me a script to download liked Spotify songs using Node?")?;
//
//     // LLMs are typically used to predict the next word in a sequence. Let's generate some tokens!
//     let max_tokens = 2048;
//     let mut decoded_tokens = 0;
//
//     // `ctx.start_completing_with` creates a worker thread that generates tokens. When the completion
//     // handle is dropped, tokens stop generating!
//     let completions = ctx
//         .start_completing_with(StandardSampler::default(), 1042)?
//         .into_strings();
//
//     for completion in completions {
//         print!("{completion}");
//         let _ = io::stdout().flush();
//
//         decoded_tokens += 1;
//
//         if decoded_tokens > max_tokens {
//             break;
//         }
//     }
//
//     Ok(())
// }
