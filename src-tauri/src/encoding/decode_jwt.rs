use jwt::header::HeaderContentType;
use jwt::{AlgorithmType, Claims, Header, Token, Unverified};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct DecodedJwtHeader {
    alg: AlgorithmType,
    typ: HeaderContentType,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DecodedJwt {
    header: DecodedJwtHeader,
    claims: Claims,
}

/// Decodes a JWT token without verifying its signature.
///
/// This function parses a JWT token string and extracts its header and claims
/// without validating the signature. It's useful for inspecting token contents
/// but should not be used for authentication purposes.
///
/// # Arguments
/// * `token` - A string slice containing the JWT token to decode
///
/// # Returns
/// * `Ok(DecodedJwt)` - A struct containing the decoded header and claims
/// * `Err(String)` - An error message if decoding fails
///
/// ```
#[tauri::command]
pub fn decode_jwt(token: &str) -> Result<DecodedJwt, String> {
    let parsed_token = Token::<Header, Claims, Unverified>::parse_unverified(token)
        .map_err(|e| format!("Failed to decode JWT token. Please check that the token is valid and properly formatted. Error: {}", e.to_string()))?;

    let header = DecodedJwtHeader {
        alg: parsed_token.header().algorithm.into(),
        typ: parsed_token
            .header()
            .content_type
            .unwrap_or(HeaderContentType::JsonWebToken),
    };

    Ok(DecodedJwt {
        header,
        claims: parsed_token.claims().clone(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use hmac::{Hmac, Mac};
    use jwt::header::HeaderType;
    use jwt::{Header, RegisteredClaims, SignWithKey, Token};
    use sha2::Sha256;
    use std::collections::BTreeMap;

    fn create_valid_token() -> String {
        let key: Hmac<Sha256> = Hmac::new_from_slice(b"mock-secret").expect("valid HMAC key");
        let header = Header {
            algorithm: AlgorithmType::Hs256,
            key_id: None,
            type_: Some(HeaderType::JsonWebToken),
            content_type: Some(HeaderContentType::JsonWebToken),
        };
        let claims = Claims {
            registered: RegisteredClaims {
                issuer: Some("example-issuer".to_string()),
                subject: Some("example-subject".to_string()),
                audience: Some("example-audience".to_string()),
                expiration: Some(1609459200),
                not_before: Some(1609455600),
                issued_at: Some(1609372800),
                json_web_token_id: Some("example-jwt-id".to_string()),
            },
            private: {
                let mut private_data = BTreeMap::new();
                private_data.insert(
                    "custom_key".to_string(),
                    serde_json::Value::String("custom_value".to_string()),
                );
                private_data
            },
        };
        Token::new(header, claims)
            .sign_with_key(&key)
            .expect("valid token creation")
            .as_str()
            .to_string()
    }

    #[test]
    fn test_returns_error_for_malformed_token() {
        let result = decode_jwt("invalid.token");
        assert!(result.is_err());
        assert_eq!(result.err().unwrap(), "Failed to decode JWT token. Please check that the token is valid and properly formatted. Error: No signature component found in token string");
    }

    #[test]
    fn test_extracts_header_and_claims_from_valid_token() {
        let token = create_valid_token();
        let decoded = decode_jwt(&token).expect("Invalid JWT");

        assert_eq!(decoded.header.alg, AlgorithmType::Hs256);
        assert_eq!(
            decoded.claims.registered.issuer.as_deref(),
            Some("example-issuer")
        );
        assert_eq!(decoded.claims.registered.issued_at, Some(1609372800));
        assert_eq!(
            decoded
                .claims
                .private
                .get("custom_key")
                .and_then(|v| v.as_str()),
            Some("custom_value")
        );
    }
}
