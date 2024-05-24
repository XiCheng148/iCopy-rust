use tauri::State;
use rusqlite::Connection;
use crate::db::models::{
    insert_clipboard_data,
    query_clipboard_data,
    del_clipboard_data,
    insert_content_type,
    query_content_types,
    del_content_type,
};

// 定义剪贴板数据的结构体
#[derive(Debug, Clone)]
pub struct ClipboardData {
    pub id: i32,
    pub content: String,
    pub content_type: String,
    pub created_at: String,
}

// 定义内容类型的结构体
#[derive(Debug, Clone)]
pub struct ContentType {
    pub id: i32,
    pub content_type: String,
}

// 插入剪贴板数据
#[tauri::command]
pub fn add_clipboard_data(state: State<'_, Connection>, content: String, content_type: String) -> Result<(), String> {
    let conn = state.inner();
    insert_clipboard_data(conn, &content, &content_type)
        .map_err(|e| e.to_string())
}

// 查询剪贴板数据
#[tauri::command]
pub fn get_clipboard_data(state: State<'_, Connection>) -> Result<Vec<ClipboardData>, String> {
    let conn = state.inner();
    query_clipboard_data(conn)
        .map_err(|e| e.to_string())
}

// 删除剪贴板数据
#[tauri::command]
pub fn remove_clipboard_data(state: State<'_, Connection>, id: i32) -> Result<(), String> {
    let conn = state.inner();
    del_clipboard_data(conn, id)
        .map_err(|e| e.to_string())
}

// 插入内容类型
#[tauri::command]
pub fn add_content_type(state: State<'_, Connection>, content_type: String) -> Result<(), String> {
    let conn = state.inner();
    insert_content_type(conn, &content_type)
        .map_err(|e| e.to_string())
}

// 查询内容类型
#[tauri::command]
pub fn get_content_types(state: State<'_, Connection>) -> Result<Vec<ContentType>, String> {
    let conn = state.inner();
    query_content_types(conn)
        .map_err(|e| e.to_string())
}

// 删除内容类型
#[tauri::command]
pub fn remove_content_type(state: State<'_, Connection>, id: i32) -> Result<(), String> {
    let conn = state.inner();
    del_content_type(conn, id)
        .map_err(|e| e.to_string())
}
