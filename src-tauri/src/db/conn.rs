use rusqlite::Connection;
use crate::db::schema;

pub fn init_connection() -> Connection {
    let conn = Connection::open("clipboard.db").expect("Failed to open database");
    schema::create_tables(&conn).expect("Failed to create tables");
    conn
}
