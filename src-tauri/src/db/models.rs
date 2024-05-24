use rusqlite::{params, Connection, Result};
// 插入粘贴板内容
pub fn insert_clipboard_data(conn: &Connection, type_name: &str, content: &[u8]) -> Result<usize> {
    let type_id = conn.query_row(
        "SELECT typeId FROM ClipboardContentTypes WHERE type = ?1",
        params![type_name],
        |row| row.get(0),
    ).unwrap_or_else(|_| {
        insert_content_type(conn, type_name).expect("Failed to insert content type");
        conn.last_insert_rowid() as i64
    });

    conn.execute(
        "INSERT INTO ClipboardData (typeId, content) VALUES (?1, ?2)",
        params![type_id, content],
    )
}
// 查询所有粘贴板内容
pub fn query_clipboard_data(conn: &Connection) -> Result<Vec<(String, Vec<u8>)>> {
  let mut stmt = conn.prepare(
      "SELECT t.type, d.content
       FROM ClipboardData d
       JOIN ClipboardContentTypes t ON d.typeId = t.typeId",
  )?;

  let data_iter = stmt.query_map([], |row| {
      Ok((row.get(0)?, row.get(1)?))
  })?;

  data_iter.collect()
}
// 删除粘贴板内容
pub fn del_clipboard_data(conn: &Connection, id: i32) -> Result<usize> {
    conn.execute(
        "DELETE FROM ClipboardData WHERE id = ?1",
        params![id],
    )
}
// 插入内容类型
pub fn insert_content_type(conn: &Connection, type_name: &str) -> Result<usize> {
    conn.execute(
        "INSERT INTO ClipboardContentTypes (type) VALUES (?1)",
        params![type_name],
    )
}
// 查询所有内容类型
pub fn query_content_types(conn: &Connection) -> Result<Vec<String>> {
    let mut stmt = conn.prepare("SELECT type FROM ClipboardContentTypes")?;
    let types_iter = stmt.query_map([], |row| row.get(0))?;
    types_iter.collect()
}
// 删除内容类型
pub fn del_content_type(conn: &Connection, type_name: &str) -> Result<usize> {
    conn.execute(
        "DELETE FROM ClipboardContentTypes WHERE type = ?1",
        params![type_name],
    )
}
