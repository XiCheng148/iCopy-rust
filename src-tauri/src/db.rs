extern crate chrono;
use chrono::{ Local, NaiveDateTime, DateTime, TimeZone };
use rusqlite::{ params, Connection, Result };
use serde::{ Deserialize, Serialize };
use std::sync::{ Arc, Mutex };

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
    pub time: String, // Keep this as String for JSON serialization
}

#[derive(Deserialize)]
pub struct SearchRequest {
    pub keyword: String,
}

pub fn initialize_database(conn: &Connection) -> Result<()> {
    // FTS5搜索表
    conn.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS contents_fts USING fts5(content, type, time)",
        []
    )?;
    // 历史记录表
    conn.execute(
        "CREATE TABLE IF NOT EXISTS contents (
            id INTEGER PRIMARY KEY,
            content TEXT NOT NULL,
            type INTEGER NOT NULL,
            time DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        []
    )?;
    Ok(())
}

#[tauri::command]
pub fn search(
    conn: tauri::State<Arc<Mutex<Connection>>>,
    request: SearchRequest
) -> Result<Vec<Item>, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT rowid, content, type, time FROM contents_fts WHERE contents_fts MATCH ? ORDER BY rank"
        )
        .map_err(|e| e.to_string())?;

    let mut rows = stmt.query(params![request.keyword]).map_err(|e| e.to_string())?;
    let mut results = Vec::new();

    while let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let utc_time: String = row.get(3).map_err(|e| e.to_string())?;
        let naive_utc_time = NaiveDateTime::parse_from_str(&utc_time, "%Y-%m-%d %H:%M:%S").map_err(
            |e| e.to_string()
        )?;
        let local_time: DateTime<Local> = Local.from_utc_datetime(&naive_utc_time);

        let item = Item {
            id: row.get(0).map_err(|e| e.to_string())?,
            content: row.get(1).map_err(|e| e.to_string())?,
            item_type: row.get(2).map_err(|e| e.to_string())?,
            time: local_time.format("%Y-%m-%d %H:%M:%S").to_string(),
        };
        results.push(item);
    }

    Ok(results)
}

#[tauri::command]
pub fn insert(
    conn: tauri::State<Arc<Mutex<Connection>>>,
    request: InsertRequest
) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    conn
        .execute(
            "INSERT INTO contents (content, type) VALUES (?, ?)",
            params![request.content, request.item_type]
        )
        .map_err(|e| e.to_string())?;

    conn
        .execute(
            "INSERT INTO contents_fts (content, type, time) VALUES (?, ?, CURRENT_TIMESTAMP)",
            params![request.content, request.item_type]
        )
        .map_err(|e| e.to_string())?;

    Ok("Insert Success".to_string())
}

#[tauri::command]
pub fn update(
    conn: tauri::State<Arc<Mutex<Connection>>>,
    request: UpdateRequest
) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    conn
        .execute(
            "UPDATE contents SET content = ? WHERE id = ?",
            params![request.content, request.id]
        )
        .map_err(|e| e.to_string())?;

    conn
        .execute(
            "UPDATE contents_fts SET content = ? WHERE rowid = ?",
            params![request.content, request.id]
        )
        .map_err(|e| e.to_string())?;

    Ok("Update Success".to_string())
}

#[tauri::command]
pub fn delete(
    conn: tauri::State<Arc<Mutex<Connection>>>,
    request: DeleteRequest
) -> Result<String, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    conn
        .execute("DELETE FROM contents WHERE id = ?", params![request.id])
        .map_err(|e| e.to_string())?;

    conn
        .execute("DELETE FROM contents_fts WHERE rowid = ?", params![request.id])
        .map_err(|e| e.to_string())?;

    Ok("Delete Success".to_string())
}

#[tauri::command]
pub fn query(
    conn: tauri::State<Arc<Mutex<Connection>>>,
    request: SelectRequest
) -> Result<Vec<Item>, String> {
    let conn = conn.lock().map_err(|e| e.to_string())?;
    let mut stmt = if let Some(id) = request.id {
        conn.prepare("SELECT * FROM contents WHERE id = ?").map_err(|e| e.to_string())?
    } else {
        conn.prepare("SELECT * FROM contents").map_err(|e| e.to_string())?
    };

    let mut rows = if let Some(id) = request.id {
        stmt.query(params![id]).map_err(|e| e.to_string())?
    } else {
        stmt.query([]).map_err(|e| e.to_string())?
    };

    let mut results = Vec::new();

    while let Some(row) = rows.next().map_err(|e| e.to_string())? {
        let utc_time: String = row.get(3).map_err(|e| e.to_string())?;
        let naive_utc_time = NaiveDateTime::parse_from_str(&utc_time, "%Y-%m-%d %H:%M:%S").map_err(
            |e| e.to_string()
        )?;
        let local_time: DateTime<Local> = Local.from_utc_datetime(&naive_utc_time);

        let item = Item {
            id: row.get(0).map_err(|e| e.to_string())?,
            content: row.get(1).map_err(|e| e.to_string())?,
            item_type: row.get(2).map_err(|e| e.to_string())?,
            time: local_time.format("%Y-%m-%d %H:%M:%S").to_string(),
        };
        results.push(item);
    }
    results.reverse();

    Ok(results)
}
