use rusqlite::{params, Connection, Result, ToSql};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};

#[derive(Deserialize)]
pub struct InsertRequest {
    pub content: String,
    pub item_type: i32,
}

#[derive(Deserialize)]
pub struct UpdateRequest {
    pub id: i32,
    pub content: String,
}

#[derive(Deserialize)]
pub struct DeleteRequest {
    pub id: i32,
}

#[derive(Deserialize)]
pub struct SelectRequest {
    pub id: Option<i32>,
}

#[derive(Serialize)]
pub struct Item {
    pub id: i32,
    pub content: String,
    pub item_type: i32,
    pub time: String,
}

pub fn initialize_database(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            content TEXT NOT NULL,
            type INTEGER NOT NULL,
            time DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )?;
    Ok(())
}

#[tauri::command]
pub fn insert(conn: tauri::State<Arc<Mutex<Connection>>>, request: InsertRequest) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO items (content, type) VALUES (?, ?)",
        params![request.content, request.item_type],
    ).map_err(|e| e.to_string())?;
    Ok("Insert Success".to_string())
}

#[tauri::command]
pub fn update(conn: tauri::State<Arc<Mutex<Connection>>>, request: UpdateRequest) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "UPDATE items SET content = ? WHERE id = ?",
        params![request.content, request.id],
    ).map_err(|e| e.to_string())?;
    Ok("Update Success".to_string())
}

#[tauri::command]
pub fn delete(conn: tauri::State<Arc<Mutex<Connection>>>, request: DeleteRequest) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM items WHERE id = ?",
        params![request.id],
    ).map_err(|e| e.to_string())?;
    Ok("Delete Success".to_string())
}

#[tauri::command]
pub fn query(conn: tauri::State<Arc<Mutex<Connection>>>, request: SelectRequest) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = if let Some(id) = request.id {
        conn.prepare("SELECT * FROM items WHERE id = ?").map_err(|e| e.to_string())?
    } else {
        conn.prepare("SELECT * FROM items").map_err(|e| e.to_string())?
    };

    let mut rows = if let Some(id) = request.id {
        stmt.query(params![id]).map_err(|e| e.to_string())?
    } else {
        stmt.query([]).map_err(|e| e.to_string())?
    };

    let mut results = Vec::new();

    while let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let item = Item {
            id: row.get(0).map_err(|e| e.to_string())?,
            content: row.get(1).map_err(|e| e.to_string())?,
            item_type: row.get(2).map_err(|e| e.to_string())?,
            time: row.get(3).map_err(|e| e.to_string())?,
        };
        results.push(item);
    }

    Ok(serde_json::to_string(&results).map_err(|e| e.to_string())?)
}
