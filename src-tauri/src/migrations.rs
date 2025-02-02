use tauri_plugin_sql::{Migration, MigrationKind};

pub fn list_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_chat_tables",
        sql: "
        CREATE TABLE chats (
            id UUID PRIMARY KEY,
            title TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE messages (
            id UUID PRIMARY KEY,
            chat_id UUID NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
            content TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
        );
    ",
        kind: MigrationKind::Up,
    }]
}
