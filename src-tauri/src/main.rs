#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

fn main() {
  tauri::Builder::default()
    .setup(|app|{
      let app = app.clone();
      tauri::global_shortcut::register("Ctrl+F3", move || {
        // 这里是当快捷键被按下时你想要执行的操作
        println!("Ctrl + F3 has been pressed");
      })
      .expect("failed to register global shortcut");

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
