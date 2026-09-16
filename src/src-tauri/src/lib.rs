use serde::Serialize;
use std::fs;
use std::path::Path;
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use base64::Engine;
use tauri_plugin_opener::OpenerExt;
use std::sync::atomic::{AtomicUsize, Ordering};
use tauri::{WebviewUrl, WebviewWindowBuilder};
use notify::RecommendedWatcher;
use std::sync::Mutex;
use notify::{
    EventKind,
    RecursiveMode,
    Watcher,
};
use notify::event::ModifyKind;
use tauri::Emitter;


static WINDOW_COUNTER: AtomicUsize = AtomicUsize::new(1);

struct WatcherState {
    watcher: Mutex<Option<RecommendedWatcher>>,
}

#[derive(Clone, Serialize)]
struct FolderChange {
    r#type: String,
    paths: Vec<String>,
}

#[derive(Serialize)]
struct FolderEntry {
    path: String,
    r#type: String,
}

#[tauri::command]
fn watch_folder(
    app: tauri::AppHandle,
    state: tauri::State<WatcherState>,
    path: String,
) -> Result<(), String> {

    let app_handle = app.clone();

    let mut watcher = notify::recommended_watcher(
        move |result: notify::Result<notify::Event>| {

            let event = match result {
                Ok(event) => event,
                Err(err) => {
                    eprintln!("watch error: {}", err);
                    return;
                }
            };

            let event_type = match event.kind {
                EventKind::Create(_) => "create",

                EventKind::Remove(_) => "remove",

                EventKind::Modify(ModifyKind::Name(_)) => "rename",

                EventKind::Modify(_) => "modify",

                _ => return,
            };

            let paths = event.paths
                .iter()
                .map(|path| path.to_string_lossy().into_owned())
                .collect();

            let payload = FolderChange {
                r#type: event_type.to_string(),
                paths: paths,
            };

            let _ = app_handle.emit(
                "folder-changed",
                payload
            );
        }
    )
    .map_err(|err| err.to_string())?;

    watcher
        .watch(
            Path::new(&path),
            RecursiveMode::Recursive,
        )
        .map_err(|err| err.to_string())?;

    let mut current = state.watcher
        .lock()
        .map_err(|err| err.to_string())?;

    *current = Some(watcher);

    Ok(())
}

#[tauri::command]
async fn open_new_window(app: tauri::AppHandle) -> Result<(), String> {
    let id = WINDOW_COUNTER.fetch_add(1, Ordering::Relaxed);
    let label = format!("window-{}", id);

    WebviewWindowBuilder::new(
        &app,
        label,
        WebviewUrl::App("index.html".into()),
    )
    .title("DrakonHub")
    .build()
    .map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
fn open_link(app: tauri::AppHandle, url: String) -> Result<(), String> {
    app.opener()
        .open_url(&url, None::<&str>)
        .map_err(|err| err.to_string())
}

#[tauri::command]
async fn export_svg(
    app: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<(), String> {
    let full_path = app
        .dialog()
        .file()
        .set_file_name(&filename)
        .add_filter("SVG image", &["svg"])
        .blocking_save_file();

    if let Some(full_path) = full_path {
        let path = full_path
            .as_path()
            .ok_or("Invalid file path")?;

        std::fs::write(path, content)
            .map_err(|err| err.to_string())?;
    }

    Ok(())
}

#[tauri::command]
async fn export_png(
    app: tauri::AppHandle,
    filename: String,
    image_str: String,
) -> Result<(), String> {
    let full_path = app
        .dialog()
        .file()
        .set_file_name(&filename)
        .add_filter("PNG image", &["png"])
        .blocking_save_file();

    if let Some(full_path) = full_path {
        let path = full_path
            .as_path()
            .ok_or("Invalid file path")?;

        save_png_to_disk(&image_str, path)?;
    }

    Ok(())
}

fn save_png_to_disk(
    image_str: &str,
    path: &std::path::Path,
) -> Result<(), String> {
    let base64_data = image_str
        .strip_prefix("data:image/png;base64,")
        .unwrap_or(image_str);

    let data = base64::engine::general_purpose::STANDARD
        .decode(base64_data)
        .map_err(|err| err.to_string())?;

    std::fs::write(path, data)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn set_title(window: tauri::WebviewWindow, title: String) -> Result<(), String> {
    window
        .set_title(&title)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn move_file(old_path: String, new_path: String) -> Result<(), String> {
    std::fs::rename(old_path, new_path)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn copy_file(old_path: String, new_path: String) -> Result<(), String> {
    copy_path(
        Path::new(&old_path),
        Path::new(&new_path)
    )
    .map_err(|err| err.to_string())
}

fn copy_path(old_path: &Path, new_path: &Path) -> std::io::Result<()> {
    let metadata = fs::metadata(old_path)?;

    if metadata.is_dir() {
        copy_directory(old_path, new_path)
    } else {
        fs::copy(old_path, new_path)?;
        Ok(())
    }
}

fn copy_directory(old_path: &Path, new_path: &Path) -> std::io::Result<()> {
    fs::create_dir(new_path)?;

    for entry in fs::read_dir(old_path)? {
        let entry = entry?;

        let source = entry.path();
        let destination = new_path.join(entry.file_name());

        if entry.file_type()?.is_dir() {
            copy_directory(&source, &destination)?;
        } else {
            fs::copy(&source, &destination)?;
        }
    }

    Ok(())
}

#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
    let metadata = std::fs::metadata(&path)
        .map_err(|err| err.to_string())?;

    if metadata.is_dir() {
        std::fs::remove_dir_all(path)
            .map_err(|err| err.to_string())
    } else {
        std::fs::remove_file(path)
            .map_err(|err| err.to_string())
    }
}

#[tauri::command]
fn create_folder(path: String) -> Result<(), String> {
    std::fs::create_dir(path)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn rename_file(old_path: String, new_path: String) -> Result<(), String> {
    std::fs::rename(old_path, new_path)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn write_text_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(path, content)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    std::fs::read_to_string(path)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn read_folder(path: String) -> Result<Vec<FolderEntry>, String> {
    let mut result = Vec::new();

    let entries = fs::read_dir(Path::new(&path))
        .map_err(|err| err.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|err| err.to_string())?;
        let path = entry.path();
        let file_type = entry.file_type()
            .map_err(|err| err.to_string())?;

        let entry_type = if file_type.is_dir() {
            "folder"
        } else if file_type.is_file() {
            "file"
        } else {
            continue;
        };

        result.push(FolderEntry {
            path: path.to_string_lossy().into_owned(),
            r#type: entry_type.to_string(),
        });
    }

    Ok(result)
}

#[tauri::command]
async fn open_folder(app: tauri::AppHandle) -> Option<String> {
    let folder = app
        .dialog()
        .file()
        .blocking_pick_folder();

    match folder {
        Some(path) => Some(path.to_string()),
        None => None,
    }
}

#[tauri::command]
fn read_settings(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|err| err.to_string())?;

    let path = config_dir.join("settings.json");

    if !path.exists() {
        return Ok(serde_json::json!({}));
    }

    let text = fs::read_to_string(path)
        .map_err(|err| err.to_string())?;

    serde_json::from_str(&text)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn write_settings(
    app: tauri::AppHandle,
    settings: serde_json::Value,
) -> Result<(), String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|err| err.to_string())?;

    fs::create_dir_all(&config_dir)
        .map_err(|err| err.to_string())?;

    let path = config_dir.join("settings.json");

    let text = serde_json::to_string_pretty(&settings)
        .map_err(|err| err.to_string())?;

    fs::write(path, text)
        .map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
fn read_recent(app: tauri::AppHandle) -> Result<serde_json::Value, String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|err| err.to_string())?;

    let path = config_dir.join("recent.json");

    if !path.exists() {
        return Ok(serde_json::json!([]));
    }

    let text = fs::read_to_string(path)
        .map_err(|err| err.to_string())?;

    serde_json::from_str(&text)
        .map_err(|err| err.to_string())
}

#[tauri::command]
fn write_recent(
    app: tauri::AppHandle,
    recent: serde_json::Value,
) -> Result<(), String> {
    let config_dir = app
        .path()
        .app_config_dir()
        .map_err(|err| err.to_string())?;

    fs::create_dir_all(&config_dir)
        .map_err(|err| err.to_string())?;

    let path = config_dir.join("recent.json");

    let text = serde_json::to_string_pretty(&recent)
        .map_err(|err| err.to_string())?;

    fs::write(path, text)
        .map_err(|err| err.to_string())?;

    Ok(())
}


// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()   
        .manage(WatcherState {
            watcher: Mutex::new(None),
        })      
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            watch_folder,
            open_new_window,
            open_link,
            export_svg,
            export_png,
            set_title,
            move_file,
            copy_file,
            delete_file,
            create_folder,
            rename_file,
            write_text_file,
            read_text_file,
            read_folder,
            open_folder,
            read_settings,
            write_settings,
            read_recent,
            write_recent])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
