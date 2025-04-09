use rand::prelude::IndexedRandom;
use rand::Rng;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum LipsumType {
    Words,
    Sentences,
    Paragraphs,
}

// cspell:disable
#[rustfmt::skip]
const LIPSUM_WORDS: [&str; 68] = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim",
    "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
    "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit",
    "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat",
    "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];
// cspell:enable

/// Returns a random punctuation mark with weighted distribution:
/// 70% period, 15% question mark, 15% exclamation mark
fn get_random_punctuation() -> String {
    let mut rng = rand::rng();
    let random_value = rng.random_range(0..10);

    match random_value {
        0..=6 => ".".to_string(),
        7..=8 => "?".to_string(),
        _ => "!".to_string(),
    }
}

/// Generates a random word from the LIPSUM_WORDS list with the first letter capitalized
fn generate_random_word() -> String {
    let mut rng = rand::rng();
    let word = LIPSUM_WORDS.choose(&mut rng).unwrap().to_string();
    let first_char = word.chars().next().unwrap_or(' ');

    if !first_char.is_whitespace() {
        let capitalized =
            first_char.to_uppercase().collect::<String>() + &word[first_char.len_utf8()..];
        capitalized
    } else {
        word
    }
}

/// Generates a specified number of random capitalized words
fn generate_words(count: usize) -> Vec<String> {
    (0..count).map(|_| generate_random_word()).collect()
}

/// Generates a specified number of random sentences with varying word counts
fn generate_sentences(count: usize) -> Vec<String> {
    let mut rng = rand::rng();
    (0..count)
        .map(|_| {
            let words = generate_words(rng.random_range(5..16));
            words.join(" ") + &get_random_punctuation()
        })
        .collect()
}

/// Generates lorem ipsum text based on the specified count and type.
///
/// # Arguments
/// * `count` - The number of words, sentences, or paragraphs to generate
/// * `lipsum_type` - The type of lorem ipsum text to generate (Words, Sentences, or Paragraphs)
///
/// # Returns
/// A string containing the generated lorem ipsum text
#[tauri::command]
pub fn generate_lipsum(count: usize, lipsum_type: LipsumType) -> String {
    if count == 0 {
        return String::new();
    }

    match lipsum_type {
        LipsumType::Words => {
            let words = generate_words(count);
            words.join(" ") + &get_random_punctuation()
        }
        LipsumType::Sentences => {
            let sentences = generate_sentences(count);
            sentences.join(" ")
        }
        LipsumType::Paragraphs => {
            let mut rng = rand::rng();
            let paragraphs = (0..count)
                .map(|_| {
                    let sentences_per_paragraph = rng.random_range(3..9);
                    let sentences = generate_sentences(sentences_per_paragraph);
                    sentences.join(" ")
                })
                .collect::<Vec<String>>();

            paragraphs.join("\n\n")
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_empty_when_count_is_zero() {
        let lipsum = generate_lipsum(0, LipsumType::Words);
        assert_eq!(lipsum, "");
    }

    #[test]
    fn test_word_generation_format_and_count() {
        let lipsum = generate_lipsum(10, LipsumType::Words);

        // Check that the lipsum is not empty
        assert!(!lipsum.is_empty(), "Generated lipsum should not be empty");

        // Check that the first character is uppercase
        assert!(
            lipsum.chars().next().unwrap().is_uppercase(),
            "First character should be uppercase"
        );

        // Check that the last character is a punctuation mark
        let last_char = lipsum.chars().last().unwrap();
        assert!(
            last_char == '.' || last_char == '?' || last_char == '!',
            "Last character should be a punctuation mark"
        );

        // Check that the number of words is correct
        let words = lipsum.split_whitespace().collect::<Vec<&str>>();
        assert_eq!(words.len(), 10, "Should generate exactly 10 words");
    }

    #[test]
    fn test_sentence_generation_format_and_count() {
        let lipsum = generate_lipsum(10, LipsumType::Sentences);

        // Check that the lipsum is not empty
        assert!(!lipsum.is_empty(), "Generated lipsum should not be empty");

        // Check that the number of sentences is correct
        let sentences = lipsum
            .split(|c| c == '.' || c == '?' || c == '!')
            .map(|s| s.trim())
            .filter(|s| !s.trim().is_empty())
            .collect::<Vec<&str>>();

        // Check that the number of sentences is correct
        assert_eq!(sentences.len(), 10, "Should generate exactly 10 sentences");

        // Check each sentence is not empty and starts with an uppercase letter
        for (i, sentence) in sentences.iter().enumerate() {
            assert!(!sentence.is_empty(), "Sentence {} should not be empty", i);
            assert!(
                sentence.chars().next().unwrap().is_uppercase(),
                "Sentence {} should start with uppercase letter",
                i
            );
        }
    }

    #[test]
    fn test_paragraph_generation_format_and_count() {
        let lipsum = generate_lipsum(10, LipsumType::Paragraphs);

        // Check that the lipsum is not empty
        assert!(!lipsum.is_empty(), "Generated lipsum should not be empty");

        // Check that the number of paragraphs is correct
        let paragraphs = lipsum.split("\n\n").collect::<Vec<&str>>();
        assert_eq!(
            paragraphs.len(),
            10,
            "Should generate exactly 10 paragraphs"
        );

        // Check each paragraph is not empty and starts with an uppercase letter
        for (i, paragraph) in paragraphs.iter().enumerate() {
            assert!(!paragraph.is_empty(), "Paragraph {} should not be empty", i);
            assert!(
                paragraph.chars().next().unwrap().is_uppercase(),
                "Paragraph {} should start with uppercase letter",
                i
            );

            // Check that each paragraph ends with proper punctuation
            let last_char = paragraph.chars().last().unwrap();
            assert!(
                last_char == '.' || last_char == '?' || last_char == '!',
                "Paragraph {} should end with punctuation",
                i
            );

            // Verify paragraph contains at least one sentence
            assert!(
                paragraph.contains('.') || paragraph.contains('?') || paragraph.contains('!'),
                "Paragraph {} should contain at least one sentence",
                i
            );
        }
    }
}
