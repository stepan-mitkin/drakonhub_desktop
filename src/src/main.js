const {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    shell
} = require("electron");

const fs = require("fs");
const path = require("path");

var windowCounter = 1;

// webContents.id -> chokidar watcher
var folderWatchers = new Map();


const squirrelEvents = [
    "--squirrel-install",
    "--squirrel-updated",
    "--squirrel-uninstall",
    "--squirrel-obsolete",
    "--squirrel-firstrun"
];

if (squirrelEvents.some(arg => process.argv.includes(arg))) {
    app.quit();
    return;
}

function getConfigDir() {
    return app.getPath("userData");
}


function getSettingsPath() {
    return path.join(getConfigDir(), "settings.json");
}


function getRecentPath() {
    return path.join(getConfigDir(), "recent.json");
}


async function readJsonFile(filename, defaultValue) {
    try {
        var text = await fs.promises.readFile(filename, "utf8");
        return JSON.parse(text);
    } catch (error) {
        if (error.code === "ENOENT") {
            return defaultValue;
        }

        throw error;
    }
}


async function writeJsonFile(filename, value) {
    await fs.promises.mkdir(path.dirname(filename), {
        recursive: true
    });

    var text = JSON.stringify(value, undefined, 2);

    await fs.promises.writeFile(
        filename,
        text,
        "utf8"
    );
}


async function copyPath(oldPath, newPath) {
    var stat = await fs.promises.stat(oldPath);

    if (stat.isDirectory()) {
        await copyDirectory(oldPath, newPath);
    } else {
        await fs.promises.copyFile(oldPath, newPath);
    }
}


async function copyDirectory(oldPath, newPath) {
    // Deliberately NOT recursive, to match Rust create_dir().
    await fs.promises.mkdir(newPath);

    var entries = await fs.promises.readdir(
        oldPath,
        {
            withFileTypes: true
        }
    );

    for (var entry of entries) {
        var source = path.join(oldPath, entry.name);
        var destination = path.join(newPath, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(source, destination);
        } else {
            await fs.promises.copyFile(source, destination);
        }
    }
}

async function stopWatcher(webContentsId) {
    var watcher = folderWatchers.get(webContentsId);

    if (watcher) {
        folderWatchers.delete(webContentsId);

        try {
            watcher.close();
        } catch (error) {
            console.error(
                "Error closing folder watcher:",
                error
            );
        }
    }
}


function sendFolderChanged(webContents, type, paths) {
    if (webContents.isDestroyed()) {
        return;
    }

    webContents.send(
        "folder-changed",
        {
            type: type,
            paths: paths
        }
    );
}


async function watchFolder(event, folderPath) {
    var webContents = event.sender;
    var webContentsId = webContents.id;

    await stopWatcher(webContentsId);

    var watcher = fs.watch(
        folderPath,
        {
            recursive: true
        },
        function (eventType, filename) {
            if (!filename) {
                return;
            }

            var fullPath = path.join(
                folderPath,
                filename
            );

            if (eventType === "change") {
                sendFolderChanged(
                    webContents,
                    "modify",
                    [fullPath]
                );
            } else if (eventType === "rename") {
                handleRenameEvent(
                    webContents,
                    fullPath
                );
            }
        }
    );

    watcher.on(
        "error",
        function (error) {
            console.error(
                "Folder watcher error:",
                error
            );
        }
    );

    folderWatchers.set(
        webContentsId,
        watcher
    );

    webContents.once(
        "destroyed",
        function () {
            stopWatcher(webContentsId);
        }
    );
}


async function handleRenameEvent(webContents, fullPath) {
    try {
        await fs.promises.stat(fullPath);

        // The path exists now. It was created or renamed to this name.
        sendFolderChanged(
            webContents,
            "create",
            [fullPath]
        );
    } catch (error) {
        if (error.code === "ENOENT") {
            // The path no longer exists.
            sendFolderChanged(
                webContents,
                "remove",
                [fullPath]
            );
            return;
        }

        console.error(
            "Error handling filesystem event:",
            error
        );
    }
}


function createWindow() {
    var windowId = windowCounter;
    windowCounter++;

    var win = new BrowserWindow({
        title: "DrakonHub",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    var html = path.join(__dirname, "electron.html")
    win.loadFile(html);
    win.setMenu(null);

    return win;
}


function registerIpcHandlers() {

    ipcMain.handle(
        "read_settings",
        async function () {
            return await readJsonFile(
                getSettingsPath(),
                {}
            );
        }
    );


    ipcMain.handle(
        "write_settings",
        async function (_event, args) {
            await writeJsonFile(
                getSettingsPath(),
                args.settings
            );
        }
    );


    ipcMain.handle(
        "read_recent",
        async function () {
            return await readJsonFile(
                getRecentPath(),
                []
            );
        }
    );


    ipcMain.handle(
        "write_recent",
        async function (_event, args) {
            await writeJsonFile(
                getRecentPath(),
                args.recent
            );
        }
    );


    ipcMain.handle(
        "open_folder",
        async function (event) {
            var parent = BrowserWindow.fromWebContents(
                event.sender
            );

            var result = await dialog.showOpenDialog(
                parent,
                {
                    properties: [
                        "openDirectory"
                    ]
                }
            );

            if (result.canceled ||
                result.filePaths.length === 0) {
                return undefined;
            }

            return result.filePaths[0];
        }
    );


    ipcMain.handle(
        "set_title",
        async function (event, args) {
            var win = BrowserWindow.fromWebContents(
                event.sender
            );

            if (win) {
                win.setTitle(args.title);
            }
        }
    );


    ipcMain.handle(
        "export_png",
        async function (event, args) {
            var win = BrowserWindow.fromWebContents(
                event.sender
            );

            var result = await dialog.showSaveDialog(
                win,
                {
                    defaultPath: args.filename,

                    filters: [
                        {
                            name: "PNG image",
                            extensions: ["png"]
                        }
                    ]
                }
            );

            if (result.canceled || !result.filePath) {
                return;
            }

            var prefix = "data:image/png;base64,";
            var imageStr = args.imageStr;

            if (imageStr.startsWith(prefix)) {
                imageStr = imageStr.substring(
                    prefix.length
                );
            }

            var data = Buffer.from(
                imageStr,
                "base64"
            );

            await fs.promises.writeFile(
                result.filePath,
                data
            );
        }
    );


    ipcMain.handle(
        "export_svg",
        async function (event, args) {
            var win = BrowserWindow.fromWebContents(
                event.sender
            );

            var result = await dialog.showSaveDialog(
                win,
                {
                    defaultPath: args.filename,

                    filters: [
                        {
                            name: "SVG image",
                            extensions: ["svg"]
                        }
                    ]
                }
            );

            if (result.canceled || !result.filePath) {
                return;
            }

            await fs.promises.writeFile(
                result.filePath,
                args.content,
                "utf8"
            );
        }
    );


    ipcMain.handle(
        "open_link",
        async function (_event, args) {
            await shell.openExternal(args.url);
        }
    );


    ipcMain.handle(
        "open_new_window",
        async function () {
            createWindow();
        }
    );


    ipcMain.handle(
        "copy_file",
        async function (_event, args) {
            await copyPath(
                args.oldPath,
                args.newPath
            );
        }
    );


    ipcMain.handle(
        "create_folder",
        async function (_event, args) {
            await fs.promises.mkdir(
                args.path
            );
        }
    );


    ipcMain.handle(
        "delete_file",
        async function (_event, args) {
            var stat = await fs.promises.stat(
                args.path
            );

            if (stat.isDirectory()) {
                await fs.promises.rm(
                    args.path,
                    {
                        recursive: true,
                        force: false
                    }
                );
            } else {
                await fs.promises.unlink(
                    args.path
                );
            }
        }
    );


    ipcMain.handle(
        "move_file",
        async function (_event, args) {
            await fs.promises.rename(
                args.oldPath,
                args.newPath
            );
        }
    );


    ipcMain.handle(
        "rename_file",
        async function (_event, args) {
            await fs.promises.rename(
                args.oldPath,
                args.newPath
            );
        }
    );


    ipcMain.handle(
        "write_text_file",
        async function (_event, args) {
            await fs.promises.writeFile(
                args.path,
                args.content,
                "utf8"
            );
        }
    );


    ipcMain.handle(
        "read_text_file",
        async function (_event, args) {
            return await fs.promises.readFile(
                args.path,
                "utf8"
            );
        }
    );


    ipcMain.handle(
        "read_folder",
        async function (_event, args) {
            var entries = await fs.promises.readdir(
                args.path,
                {
                    withFileTypes: true
                }
            );

            var result = [];

            for (var entry of entries) {
                var type;

                if (entry.isDirectory()) {
                    type = "folder";
                } else if (entry.isFile()) {
                    type = "file";
                } else {
                    continue;
                }

                result.push({
                    path: path.join(
                        args.path,
                        entry.name
                    ),
                    type: type
                });
            }

            return result;
        }
    );


    ipcMain.handle(
        "watch_folder",
        async function (event, args) {
            await watchFolder(
                event,
                args.path
            );
        }
    );
}


app.whenReady().then(function () {
    registerIpcHandlers();
    createWindow();
});


app.on(
    "window-all-closed",
    function () {
        app.quit();
    }
);


app.on(
    "activate",
    function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    }
);