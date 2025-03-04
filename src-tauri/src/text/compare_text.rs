use serde::{Deserialize, Serialize};
use similar::{ChangeTag, TextDiff};

#[derive(Debug, Serialize, Deserialize)]
pub struct TextDiffLine {
    content: String,
    change_type: String,
}

#[tauri::command]
pub fn compare_text(original: String, modified: String) -> Vec<TextDiffLine> {
    // Return empty result for identical texts
    if original == modified {
        return Vec::new();
    }

    let diff = TextDiff::from_lines(&original, &modified);

    diff.iter_all_changes()
        .map(|change| {
            let change_type = match change.tag() {
                ChangeTag::Delete => "delete",
                ChangeTag::Insert => "insert",
                ChangeTag::Equal => "unchanged",
            };

            TextDiffLine {
                content: change.value().to_string(),
                change_type: change_type.to_string(),
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_identical_texts_return_empty_result() {
        let input = "Hello, world!";
        let diff = compare_text(input.to_string(), input.to_string());
        assert!(diff.is_empty());
    }

    #[test]
    fn test_empty_original_shows_as_insertion() {
        let original = "";
        let modified = "Hello, world!";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 1);
        assert_eq!(diff[0].content, modified);
        assert_eq!(diff[0].change_type, "insert");
    }

    #[test]
    fn test_empty_modified_shows_as_deletion() {
        let original = "Hello, world!";
        let modified = "";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 1);
        assert_eq!(diff[0].content, original);
        assert_eq!(diff[0].change_type, "delete");
    }

    #[test]
    fn test_simple_text_replacement() {
        let original = "Hello, world!";
        let modified = "Hello, there!";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 2);
        assert_eq!(diff[0].content, "Hello, world!");
        assert_eq!(diff[0].change_type, "delete");
        assert_eq!(diff[1].content, "Hello, there!");
        assert_eq!(diff[1].change_type, "insert");
    }

    #[test]
    fn test_multiline_text_with_middle_line_change() {
        let original = "Line 1\nLine 2\nLine 3";
        let modified = "Line 1\nModified Line\nLine 3";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 4);
        assert_eq!(diff[0].content, "Line 1\n");
        assert_eq!(diff[0].change_type, "unchanged");
        assert_eq!(diff[1].content, "Line 2\n");
        assert_eq!(diff[1].change_type, "delete");
        assert_eq!(diff[2].content, "Modified Line\n");
        assert_eq!(diff[2].change_type, "insert");
        assert_eq!(diff[3].content, "Line 3");
        assert_eq!(diff[3].change_type, "unchanged");
    }

    #[test]
    fn test_line_insertion_in_middle() {
        let original = "First line\nLast line";
        let modified = "First line\nMiddle line\nLast line";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 3);
        assert_eq!(diff[0].content, "First line\n");
        assert_eq!(diff[0].change_type, "unchanged");
        assert_eq!(diff[1].content, "Middle line\n");
        assert_eq!(diff[1].change_type, "insert");
        assert_eq!(diff[2].content, "Last line");
        assert_eq!(diff[2].change_type, "unchanged");
    }

    #[test]
    fn test_line_deletion_in_middle() {
        let original = "First line\nMiddle line\nLast line";
        let modified = "First line\nLast line";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 3);
        assert_eq!(diff[0].content, "First line\n");
        assert_eq!(diff[0].change_type, "unchanged");
        assert_eq!(diff[1].content, "Middle line\n");
        assert_eq!(diff[1].change_type, "delete");
        assert_eq!(diff[2].content, "Last line");
        assert_eq!(diff[2].change_type, "unchanged");
    }

    #[test]
    fn test_completely_different_texts() {
        let original = "This is the original text.";
        let modified = "Is completely different.";
        let diff = compare_text(original.to_string(), modified.to_string());

        assert_eq!(diff.len(), 2);
        assert_eq!(diff[0].content, "This is the original text.");
        assert_eq!(diff[0].change_type, "delete");
        assert_eq!(diff[1].content, "Is completely different.");
        assert_eq!(diff[1].change_type, "insert");
    }
}
