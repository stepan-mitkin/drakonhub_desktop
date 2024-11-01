const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron')
const path = require('path')
const fs = require('fs').promises;
const config = require("./config.json")

var logg = undefined

var globals = {
    recent: [],
    windows: {},
    defaultImagePath: app.getPath("pictures")
}

async function log(text) {
    if (logg) {
        await logg.writeFile(text || "")
        await logg.writeFile("\n")
    }
}

async function setClipboard(winInfo, type, content) {
    globals.clipboard = {
        type,
        content
    }
    invokeClipboardUpdated()
}

async function findDiagram(winInfo, name) {
    var fullName = buildPath(winInfo.folder, name, "drakon")
    try {
        await readUtf8File(fullName)
        return fullName
    } catch (ex) {
        return undefined
    }
}

async function saveAsPng(winInfo, name, uri) {
    var dialogResult = await dialog.showSaveDialog(
        winInfo.window,
        {
            defaultPath: path.join(globals.defaultImagePath, name + ".png"),
            filters: [
                { name: 'PNG', extensions: ["png"] }
            ] 
        }
    )

    if (dialogResult.canceled) {
        return
    }

    var filename = dialogResult.filePath
    var parsed = parsePath(filename)
    globals.defaultImagePath = parsed.folder

    var data = uri.split(',')[1]; 
    await fs.writeFile(filename, data, "base64")
}

async function getPath(winInfo) {
    return winInfo.path
}

async function closeMyFile(winInfo) {
    if (winInfo.file) {
        await winInfo.file.close()
        winInfo.file = undefined
    }

    winInfo.path = undefined
    winInfo.folder = undefined
    winInfo.filename = undefined
    winInfo.type = undefined
    winInfo.name = undefined
    winInfo.access = undefined
    winInfo.typeFromExtension = undefined
}

async function confirmRename(winInfo, newName) {

    var newPath = buildPath(winInfo.folder, newName, winInfo.type)
    var matching = findWindowByPath(newPath)
    if (matching) {
        if (matching.path === newPath) {
            return false
        }
    }

    return await fileExists(newPath)    
}

async function createDiagram(winInfo, type, name) {    
    var suggestedPath
    if (winInfo.path) {
        suggestedPath = buildPath(winInfo.folder, name, type)
    } else {
        suggestedPath = name + "." + type
    }
    var filters = [
        { name: 'Diagrams', extensions: [type] }
    ]
    var dialogResult = await dialog.showSaveDialog(
        winInfo.window,
        {
            defaultPath: suggestedPath,
            filters: filters
        }
    )

    if (dialogResult.canceled) {
        return undefined
    }

    var newPath = dialogResult.filePath
    
    
    var diagram = {type:type, items:{}}
    var diagramStr = serializeDiagram(diagram)
    try {
        await fs.writeFile(newPath, diagramStr)
    } catch (ex) {
        return {error: "Could not create file"}
    }
    if (winInfo.path) {
        createWindow(newPath)
        return undefined
    } else {
        return openFileAt(winInfo, newPath)
    }
}



async function openFile(winInfo) {
    var filters = [
        { name: 'Diagrams', extensions: ['drakon', 'free', 'graf'] },
        { name: 'All Files', extensions: ['*'] }
    ]
    var dialogResult = await dialog.showOpenDialog(
        winInfo.window,
        {
            properties: ['openFile'],
            filters: filters,
            defaultPath: getDefaultPath(winInfo)
        }
    )

    if (dialogResult.canceled) {
        return undefined
    }

    var newPath = dialogResult.filePaths[0]
    
    return openFileAt(winInfo, newPath)
}



async function openFileAt(winInfo, newPath, newWindow) {
    var found = findWindowByPathExact(newPath)
    if (found) {
        if (found !== winInfo) {
            raiseWindow(found)
        }
        return undefined
    }

    if (newWindow) {
        createWindow(newPath)
        return undefined
    }
    try {
        await readUtf8File(newPath)
    } catch (ex) {
        return {error: "Could not open file"}
    }    
    await closeMyFile(winInfo)
    winInfo.path = newPath
    var opened = await openFileObject(winInfo)
    if (!opened) {
        return {error: "Could not open file"}
    }

    await addToRecent(winInfo.path)

    return await readMyFile(winInfo)
}

async function readMyFile(winInfo) {
    var content
    try {
        content = await readUtf8File(winInfo.path)
    } catch (ex) {
        return {error: "Could not read file"}
    }
    content = content.trim()
    var diagram
    if (!content) {
        diagram = {}
    } else {
        try {
            diagram = JSON.parse(content)
        } catch (ex) {
            return {error: "Bad JSON"}
        }
    }

    if (!diagram.type) {
        diagram.type = winInfo.typeFromExtension
    }

    if (diagram.type !== "drakon" && diagram.type !== "graf" && diagram.type !== "free") {
        return {error: "Bad diagram type"}
    }

    if (!diagram.items) {
        diagram.items = {}
    }

    diagram.name = winInfo.name
    diagram.access = winInfo.access

    return {content: JSON.stringify(diagram)}
}

async function saveMyFile(winInfo, diagram) {
    var name = diagram.name
    delete diagram.name
    var content = serializeDiagram(diagram)
  
    if (name != winInfo.name) {
        var newPath = buildPath(winInfo.folder, name, winInfo.type)
        var found = findWindowByPathExact(newPath)
        if (found) {
            return false
        }
        var saved = await saveCore(winInfo, content)
        if (!saved) { return false }

        var oldPath = winInfo.path
        await closeMyFile(winInfo)
        try {
            await fs.rename(oldPath, newPath)
            await removeRecent(oldPath)
            await addToRecent(newPath)
        } catch (ex) {
            await openFileObject(winInfo)
            return false
        }
        winInfo.path = newPath
        return await openFileObject(winInfo)
    } else {
        return await saveCore(winInfo, content)
    }
}

async function saveMyFileAs(winInfo) {
    var filters = [
        { name: 'Diagrams', extensions: [winInfo.type] }
    ]    
    var dialogResult = await dialog.showSaveDialog(
        winInfo.window,
        {
            defaultPath: winInfo.path,
            filters: filters
        }
    )

    if (dialogResult.canceled) {
        return undefined
    }

    var newPath = dialogResult.filePath

    var found = findWindowByPath(newPath)
    if (found && found !== winInfo) {
        return {error: "Could not replace file"}
    }

    try {
        await fs.copyFile(winInfo.path, newPath)
    } catch (ex) {
        return {error: "Could not create file"}
    }

    return await openFileAt(winInfo, newPath)
}

async function clearRecent() {
    var userConf = await readUserConf()
    userConf.recent = []
    await saveUserConf(userConf)
}

async function getRecent() {
    var userConf = await readUserConf()
    var recent = userConf.recent.slice()
    recent.reverse()
    globals.recent = recent
    return recent
}

async function loadUserSettings() {
    var userConf = await readUserConf()
    updateContextMenus(userConf.settings.language)
    return userConf.settings
}

function updateContextMenus(language) {
    // var labels
    // if (language === "en-us") {
    //     labels = {}
    // } else {
    //     labels = {
    //         cut: "Вырезать",
    //         copy: "Копировать",
    //         paste: "Вставить",
    //         selectAll: "Выделить всё"
    //     }
    // }
    // contextMenu({
    //     showSearchWithGoogle: false,
    //     showInspectElement: false,
    //     labels: labels
    // });
}

async function saveUserSettings(winInfo, settings) {
    var userConf = await readUserConf()
    userConf.settings = userConf.settings || {}
    Object.assign(userConf.settings, settings)
    updateContextMenus(userConf.settings.language)
    await saveUserConf(userConf)
}

async function loadTranslations(winInfo, language) {
    var strings = undefined 
    if (language !== "en-us") {
        var fullName = path.normalize(path.join(__dirname, config.strings))

        var content = await readUtf8File(fullName)
        strings = JSON.parse(content)
    }
    globals.language = language
    globals.strings = strings
    await setTitle(winInfo, "")
    return strings
}

async function newWindow() {
    createWindow(undefined)
}

async function openLink(winInfo, link) {
    shell.openExternal(link)
}

async function restartApp(winInfo) {
    createWindow(undefined)    
    winInfo.window.close()
}

async function closeWindow(winInfo) {
    winInfo.window.close()
}

async function setMenu(winInfo, menu) {
    // Do not show the menu
    winInfo.window.setMenu(null)
    // var template = menu.map(
    //     function(item) {
    //         return transformMenu(item, winInfo)
    //     }
    // )
    // const realMenu = Menu.buildFromTemplate(template)
    // winInfo.window.setMenu(realMenu)
}

async function setTitle(winInfo, title) {
    var appName
    if (globals.language === "ru") {
        appName = config.app
    } else {
        appName = config.appEn
    }
    var finalTitle
    if (title) {
        finalTitle = title + " | " + appName
    } else {
        finalTitle = appName
    }
    winInfo.window.setTitle(finalTitle)
}

function getDefaultPath(winInfo) {
    if (winInfo.folder) {
        return winInfo.folder
    }

    if (globals.recent.length !== 0) {
        var parsed = parsePath(globals.recent[0].path)
        return parsed.folder
    }

    return ""
}

function transformMenu(item, winInfo) {
    if (item.type === "separator") {
        return item
    }
    var result = {
        label: item.label
    }

    if (item.code) {
        result.click = function() { 
            winInfo.window.webContents.send("runMenuItem", item.code)
        }
    }

    if (item.submenu) {
        result.submenu = item.submenu.map(
            function(it) {
                return transformMenu(it, winInfo)
            }
        )        
    }

    return result
}

async function saveCore(winInfo, content) {
    try {
        await fs.writeFile(winInfo.path, content, "utf8")
        return true
    } catch (ex) {
        console.error(ex)
        return false
    }      
}

async function openFileObject(winInfo) {
    var handle = undefined
    var access = undefined
    var diagram
    try {
        var content = await readUtf8File(winInfo.path)
        diagram = JSON.parse(content)
    } catch (ex) {
        return false
    }

    try {
        handle = await fs.open(winInfo.path, "a")
        access = "write"
        await handle.close()
    } catch (ex) {
        try {
            handle = await fs.open(winInfo.path, "r")
            access = "read"
            await handle.close()
        } catch (ex) {
            return false
        }
    }
    var parsed = parsePath(winInfo.path)
    winInfo.typeFromExtension = parsed.type
    winInfo.type = diagram.type
    winInfo.name = parsed.name
    winInfo.folder = parsed.folder
    winInfo.filename = parsed.filename
    winInfo.access = access
    return true
}

function serializeDiagram(diagram) {
    return JSON.stringify(diagram, null, 4)
}

function findWindowByPath(path) {
    for (var winId in globals.windows) {
        var winInfo = globals.windows[winId]
        if (winInfo.path && winInfo.path.toLowerCase() === path.toLowerCase()) {
            return winInfo
        }
    }

    return undefined
}

function findWindowByPathExact(path) {
    for (var winId in globals.windows) {
        var winInfo = globals.windows[winId]
        if (winInfo.path && winInfo.path === path) {
            return winInfo
        }
    }

    return undefined
}


async function invokeClipboardUpdated() {
    for (var winId in globals.windows) {
        var winInfo = globals.windows[winId]
        winInfo.window.webContents.send("clipboardUpdated", globals.clipboard.type, globals.clipboard.content)
    }
}

function parsePath(path) {
    var parts, folderParts, filename, folder, separator;

    parts = path.split('/');
    if (parts.length === 1) {
        separator = '\\';
        parts = path.split('\\');
    } else {
        separator = '/';
    }
    folderParts = parts.slice(0, parts.length - 1);
    filename = parts[parts.length - 1];
    folder = folderParts.join(separator);

    var nameParts = filename.split(".")
    var type, name
    if (nameParts.length === 1)
    {
        name = filename
        type = ""
    }
    else
    {
        name = nameParts.slice(0, nameParts.length - 1).join(".")
        type = nameParts[nameParts.length - 1]
    }

    return {
        filename: filename,
        folder: folder,
        name: name,
        type: type
    };
}

function buildPath(folder, name, type) {
    var filename
    if (type) {
        filename = name + "." + type
    } else {
        filename = name
    }
    return path.normalize(path.join(folder, filename))
}

function getWindowFromEvent(evt) {
    var senderId = evt.sender.id
    for (var winId in globals.windows) {
        var winInfo = globals.windows[winId]
        var windowId = winInfo.window.webContents.id
        if (windowId === senderId) {
            return winInfo
        }
    }

    throw new Error("Window not found: " + senderId)
}

function registerMainCallbacks() {
    registerHandler(setClipboard)
    registerHandler(findDiagram)
    registerHandler(saveAsPng)
    registerHandler(getPath)
    registerHandler(closeMyFile)
    registerHandler(confirmRename)
    registerHandler(createDiagram)
    registerHandler(openFile)
    registerHandler(openFileAt)
    registerHandler(readMyFile)
    registerHandler(saveMyFile)
    registerHandler(saveMyFileAs)
    registerHandler(clearRecent)
    registerHandler(getRecent)
    registerHandler(loadUserSettings)
    registerHandler(saveUserSettings)
    registerHandler(loadTranslations)
    registerHandler(newWindow)
    registerHandler(openLink)
    registerHandler(restartApp)
    registerHandler(closeWindow)
    registerHandler(setMenu)
    registerHandler(setTitle)    
}

function registerHandler(fun) {
    ipcMain.handle(fun.name, function(evt, ...args) {
        return wrapper(evt, fun, ...args)
    })
}

function wrapper(evt, fun, ...args) {    
    var winInfo = getWindowFromEvent(evt)
    return fun(winInfo, ...args)
}


function raiseWindow(winInfo) {
    var myWindow = winInfo.window    

    if (myWindow.isMinimized()) {
        myWindow.restore()
    }
    myWindow.show()
    //myWindow.focus()
}

function raiseFirstWindow() {
    var ids = Object.keys(globals.windows)
    if (ids.length === 0) {
        return
    }
    var winInfo = globals.windows[ids[0]]
    raiseWindow(winInfo)
}

async function addToRecent(filename) {
    var userConf = await readUserConf()
    removeBy(userConf.recent, "path", filename)
    userConf.recent.push({path:filename})
    await saveUserConf(userConf)
}

async function removeRecent(oldPath) {
    var userConf = await readUserConf()
    removeBy(userConf.recent, "path", oldPath)    
    await saveUserConf(userConf)
}

function getUserConfigPath() {
    var folder = app.getPath("home")
    var filename = path.join(folder, config.exe + ".settings.json")
    return filename
}

async function readUserConf() {
    var filename = getUserConfigPath()
    var content = ""
    try {
        content = await readUtf8File(filename)
    } catch (ex) {

    }
    content = content.trim()
    var result
    if (content) {
        result = JSON.parse(content)
    } else {
        result = {}
    }

    if (!result.recent) {
        result.recent = []
    }
    
    if (!result.settings) {
        result.settings = {}
    }

    return result
}

async function readUtf8File(filename) {
    return await fs.readFile(filename, "utf8")
}

async function fileExists(filename)     {
    try {
        await readUtf8File(filename)
        return true
    } catch (ex) {
        return false
    }
}

async function saveUserConf(userConf) {
    var content = JSON.stringify(userConf, null, 4)
    var filename = getUserConfigPath()
    await fs.writeFile(filename, content)
}

function removeBy(array, prop, value) {
    for (var i = 0; i < array.length; i++) {
        var element = array[i]
        if (element[prop] === value) {
            array.splice(i, 1)
            return
        }
    }
}

const createWindow = async (filePath) => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    var id = win.webContents.id.toString()
    var winInfo = {
        id: id,
        path: filePath
    }
    globals.windows[id] = winInfo
    winInfo.window = win

    var opened = await openFileObject(winInfo)
    if (opened) {
        await addToRecent(winInfo.path)
    } else {
        winInfo.path = undefined
    }

    win.webContents.on('context-menu', (evt, props) => { handleContextMenu(winInfo, evt, props) })

    win.loadFile('index.html')
    
    if (process.argv.indexOf("--dev") !== -1) {
        win.webContents.openDevTools()
    }

    win.on("closed", () => {
        onClose(winInfo)
    })
}

function getFilenameFromCommandLine(argv) {
    for (var i = argv.length - 1; i > 0; i--) {
        var part = argv[i]
        if (part && part.substring(0, 2) !== "--") {
            var result = path.normalize(part)
            log("getFilenameFromCommandLine: " + result)
            return result
        }
    }

    log("getFilenameFromCommandLine: undefined")
    return undefined
}

function onSecondInstance(evt, argv) {
    var filename = getFilenameFromCommandLine(argv)
    if (filename) {
        log("onSecondInstance: got filename: " + filename)
        var found = findWindowByPathExact(filename)
        if (found) {
            log("onSecondInstance: found instance: " + found.id)
            raiseWindow(found)            
        } else {
            log("onSecondInstance: did not find instance")
            createWindow(filename)
        }
    } else {
            log("onSecondInstance: no filename, raising first window")
            raiseFirstWindow()
    }    
}

async function onClose(winInfo) {
    delete globals.windows[winInfo.id]
    await closeMyFile(winInfo)
}

function createWindowIfNoWindows() {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow(undefined)
    } else {
        raiseFirstWindow()
    }
}

function quitApp() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
}

function handleContextMenu(winInfo, event, props) {
    var window = winInfo.window
    var target = window.webContents
    var template = []
    if (props.editFlags.canCut && props.selectionText) {
        template.push({
            label: tr("Cut"),
            click: () => { target.cut() }
        })
    }
    if (props.editFlags.canCopy && props.selectionText) {
        template.push({
            label: tr("Copy"),
            click: () => { target.copy() }
        })
    }
    if (props.editFlags.canPaste) {
        template.push({
            label: tr("Paste"),
            click: () => { target.paste() }
        })
    }

    if (template.length !== 0) {
        const menu = Menu.buildFromTemplate(template)        
	    menu.popup(window)
    }

}

function tr(text) {
    if (globals.strings && text in globals.strings) {
        return globals.strings[text]
    }

    return text
}

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
      return false;
    }
  
    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
      case '--squirrel-install':
      case '--squirrel-updated':
        return true;  
      case '--squirrel-uninstall':
        return true;  
      case '--squirrel-obsolete':
        return true;
    }

    return false
}
  

async function main() {
    if (handleSquirrelEvent()) {
        app.quit()
        return;
    }

    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
        app.quit()
        return
    }

    //logg = await fs.open(path.join(app.getPath("home"), "log.txt"), "a")

    await log("main: started")

    app.on('second-instance', onSecondInstance)
    app.on('window-all-closed', quitApp)
    app.on('activate', createWindowIfNoWindows)
    await app.whenReady()
    registerMainCallbacks()
    var filename = getFilenameFromCommandLine(process.argv)
    createWindow(filename)
}

main()