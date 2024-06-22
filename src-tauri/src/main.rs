#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::env;
use tauri::{
    CustomMenuItem,
    Manager,
    SystemTray,
    SystemTrayEvent,
    SystemTrayMenu,
    GlobalShortcutManager,
};

fn main() {
    let context = tauri::generate_context!();
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("show".to_string(), "显示"))
        .add_item(CustomMenuItem::new("quit".to_string(), "退出"));

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder
        ::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| {
            match event {
                SystemTrayEvent::MenuItemClick { id, .. } => {
                    if id == "quit" {
                        app.exit(0);
                    }
                    if id == "show" {
                        // 处理显示菜单项
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                _ => {}
            }
        })
        .setup(|app| {
            let _main_window = app.get_window("main").expect("找不到名为 'main' 的窗口");
            let main_window_clone = _main_window.clone(); // Clone the window handle

            // 监听窗口失焦事件
            let app_env = env::var("VITE_NETWORK_PROCESSOR").unwrap_or_else(|_| "production".to_string());
            println!("现在是开发环境: {}", app_env);
            if app_env != "dev" {
                _main_window.on_window_event(move |event| {
                    match event {
                        tauri::WindowEvent::Focused(focused) => {
                            if !focused {
                                main_window_clone.hide().expect("无法隐藏窗口");
                            }
                        }
                        _ => {}
                    }
                });
            }

            let _main_window = app.get_window("main").expect("找不到名为 'main' 的窗口");
            let main_window_clone = _main_window.clone(); // Clone the window handle
            // 注册全局快捷键
            if env::consts::OS == "macos" {
                app.global_shortcut_manager()
                    .register("CmdOrCtrl+F1", move || {
                        // 切换窗口的显示状态
                        let is_visible = main_window_clone.is_visible().unwrap();
                        if is_visible {
                            main_window_clone.hide().unwrap();
                        } else {
                            main_window_clone.show().unwrap();
                            main_window_clone.set_focus().unwrap();
                        }
                    })
                    .unwrap();
            } else {
                app.global_shortcut_manager()
                    .register("Alt+F1", move || {
                        // 切换窗口的显示状态
                        let is_visible = main_window_clone.is_visible().unwrap();
                        if is_visible {
                            main_window_clone.hide().unwrap();
                        } else {
                            main_window_clone.show().unwrap();
                            main_window_clone.set_focus().unwrap();
                        }
                    })
                    .unwrap();
            }
            Ok(())
        })
        .plugin(tauri_plugin_clipboard::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(context)
        .expect("error while running tauri application");
}
