// src/db/schema.rs
use rusqlite::{ Connection, Result };

pub fn create_tables(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS ClipboardContentTypes (
            typeId INTEGER PRIMARY KEY AUTOINCREMENT,
            type VARCHAR(50) NOT NULL
        )",
        []
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS ClipboardData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            typeId INTEGER,
            content BLOB,
            FOREIGN KEY (typeId) REFERENCES ClipboardContentTypes(typeId)
        )",
        []
    )?;
    Ok(())
}
