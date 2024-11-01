const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
  setClipboard: (type, content) => ipcRenderer.invoke("setClipboard", type, content),
  saveAsPng: (name, data) => ipcRenderer.invoke("saveAsPng", name, data),
  getPath: () => ipcRenderer.invoke("getPath"),
  closeMyFile: () => ipcRenderer.invoke("closeMyFile"),
  confirmRename: (newName) => ipcRenderer.invoke("confirmRename", newName),
  createDiagram: (type, name) => ipcRenderer.invoke("createDiagram", type, name),
  openFile: () => ipcRenderer.invoke("openFile"),
  openFileAt: (newPath, newWindow) => ipcRenderer.invoke("openFileAt", newPath, newWindow),
  readMyFile: () => ipcRenderer.invoke("readMyFile"),
  saveMyFile: (diagram) => ipcRenderer.invoke("saveMyFile", diagram),
  saveMyFileAs: () => ipcRenderer.invoke("saveMyFileAs"),
  clearRecent: () => ipcRenderer.invoke("clearRecent"),
  getRecent: () => ipcRenderer.invoke("getRecent"),
  loadUserSettings: () => ipcRenderer.invoke("loadUserSettings"),
  saveUserSettings: (settings) => ipcRenderer.invoke("saveUserSettings", settings),
  loadTranslations: (language) => ipcRenderer.invoke("loadTranslations", language),
  newWindow: () => ipcRenderer.invoke("newWindow"),
  openLink: (link) => ipcRenderer.invoke("openLink", link),
  restartApp: () => ipcRenderer.invoke("restartApp"),
  closeWindow: () => ipcRenderer.invoke("closeWindow"),
  setMenu: (menu) => ipcRenderer.invoke("setMenu", menu),
  setTitle: (title) => ipcRenderer.invoke("setTitle", title), 
  findDiagram: (name) => ipcRenderer.invoke("findDiagram", name), 

  clipboardUpdated: (callback) => ipcRenderer.on('clipboardUpdated', callback),
  runMenuItem: (callback) => ipcRenderer.on('runMenuItem', callback)
})

