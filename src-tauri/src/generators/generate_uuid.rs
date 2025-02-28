use serde::{Deserialize, Serialize};
use uuid::{ContextV7, Timestamp, Uuid};

#[derive(Debug, Deserialize, Serialize)]
pub enum UuidVersion {
    V4,
    V7,
}

/// Generates one or more UUIDs based on the specified parameters.
///
/// This function creates UUIDs in either version 4 (random) or version 7 (time-based) format.
/// It allows customizing the output format with options for uppercase letters and hyphen inclusion.
///
/// # Arguments
/// * `number_of_uuids` - The number of UUIDs to generate
/// * `version` - The UUID version to use (V4 or V7)
/// * `uppercase` - Whether to format the UUID in uppercase
/// * `hyphens` - Whether to include hyphens in the UUID string
///
/// # Returns
/// A vector of UUID strings formatted according to the specified parameters
///
/// ```
#[tauri::command]
pub fn generate_uuid(
    number_of_uuids: u16,
    version: UuidVersion,
    uppercase: bool,
    hyphens: bool,
) -> Vec<String> {
    let mut uuids = Vec::with_capacity(number_of_uuids as usize);

    for _ in 0..number_of_uuids {
        let uuid = match version {
            UuidVersion::V4 => Uuid::new_v4(),
            UuidVersion::V7 => Uuid::new_v7(Timestamp::now(&ContextV7::new())),
        };

        let mut builder = Uuid::encode_buffer();

        let uuid_str = if hyphens {
            uuid.hyphenated().encode_lower(&mut builder)
        } else {
            uuid.simple().encode_lower(&mut builder)
        };

        let uuid_str = if uppercase {
            uuid_str.to_uppercase()
        } else {
            uuid_str.to_string()
        };

        uuids.push(uuid_str);
    }

    uuids
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;
    use std::time::{SystemTime, UNIX_EPOCH};

    #[test]
    fn test_generates_one_uuid() {
        let uuids = generate_uuid(1, UuidVersion::V4, false, true);
        assert_eq!(uuids.len(), 1);
    }

    #[test]
    fn test_generates_multiple_unique_uuids() {
        let uuids = generate_uuid(100, UuidVersion::V4, false, true);
        let unique_uuids: Vec<&String> = uuids
            .iter()
            .collect::<HashSet<&String>>()
            .into_iter()
            .collect();
        assert_eq!(uuids.len(), 100);
        assert_eq!(unique_uuids.len(), 100);
    }

    #[test]
    fn test_generates_uuid_v4() {
        let uuids = generate_uuid(1, UuidVersion::V4, false, false);
        assert_eq!(uuids.len(), 1);
        assert_eq!(uuids[0].len(), 32);

        let parsed = Uuid::parse_str(&uuids[0]).unwrap();
        assert_eq!(parsed.get_version_num(), 4);
        assert_eq!(parsed.get_version(), Some(uuid::Version::Random));
        assert_eq!(parsed.get_variant(), uuid::Variant::RFC4122);
    }

    #[test]
    fn test_generates_uuid_v7() {
        let uuids = generate_uuid(1, UuidVersion::V7, false, false);
        assert_eq!(uuids.len(), 1);
        assert_eq!(uuids[0].len(), 32);

        let parsed = Uuid::parse_str(&uuids[0]).unwrap();
        assert_eq!(parsed.get_version_num(), 7);
        assert_eq!(parsed.get_version(), Some(uuid::Version::SortRand));
        assert_eq!(parsed.get_variant(), uuid::Variant::RFC4122);

        // Check that UUID timestamp is within the last minute
        let timestamp = parsed.get_timestamp().unwrap();
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        let (timestamp_secs, _) = timestamp.to_unix();
        assert!(timestamp_secs <= now);
        assert!(timestamp_secs > now - 60);
    }

    #[test]
    fn test_format_with_hyphens() {
        let uuids = generate_uuid(1, UuidVersion::V7, false, true);
        let uuid = &uuids[0];

        // Count the number of hyphens in the UUID
        assert_eq!(uuid.chars().filter(|&c| c == '-').count(), 4);

        // Verify the positions of hyphens (8-4-4-4-12 format)
        assert_eq!(uuid.chars().nth(8), Some('-'));
        assert_eq!(uuid.chars().nth(13), Some('-'));
        assert_eq!(uuid.chars().nth(18), Some('-'));
        assert_eq!(uuid.chars().nth(23), Some('-'));
    }

    #[test]
    fn test_format_without_hyphens() {
        let uuids = generate_uuid(1, UuidVersion::V7, false, false);
        let uuid = &uuids[0];

        assert_eq!(uuid.len(), 32);
        assert!(!uuid.contains('-'));
    }

    #[test]
    fn test_format_uppercase() {
        let uuids = generate_uuid(1, UuidVersion::V7, true, false);
        let uuid = &uuids[0];

        assert!(uuid.chars().all(|c| !c.is_alphabetic() || c.is_uppercase()));
        assert!(uuid.chars().any(|c| c.is_uppercase()));
    }

    #[test]
    fn test_format_lowercase() {
        let uuids = generate_uuid(1, UuidVersion::V7, false, false);
        let uuid = &uuids[0];

        assert_eq!(uuid.len(), 32);
        assert!(uuid.chars().all(|c| !c.is_alphabetic() || c.is_lowercase()));
        assert!(uuid.chars().any(|c| c.is_lowercase()));
    }
}
