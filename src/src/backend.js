function localserver(utils, gconfig) {
  var invoke = undefined
  var listen = undefined

  async function main() {
    console.log("tauriserver.main");
    var funs = gconfig.getInvoke();
    invoke = funs.invoke;
    listen = funs.listen;
  }

  async function getAccount() {
    var status = 200;
    var responseBody = {
      email: "no-email",
      user_id: "local-user",
      name: "local-user",
      spaces: ["my-diagrams"],
      spaces_access: [
        {
          space_id: "my-diagrams",
          name: "my-diagrams",
          access: "admin",
        },
      ],
    };
    return [status, responseBody];
  }

  async function getTheme() {
    var theme = await invoke("read_settings");
    return [200, theme];
  }

  async function saveTheme(settings) {
    await invoke("write_settings", {
      settings: settings
    });
    return [204, ""];
  }

  async function getRecentFolders() {
    var response = await invoke("read_recent");
    return response
  }

  async function saveRecentFolders(recent) {
    await invoke("write_recent", {
      recent: recent
    });
  }

  async function openFolder() {
    var path;

    path = await invoke('open_folder');

    if (path) {
      return utils.normalizePath(path);
    }

    return undefined;
  }

  async function setTitle(title) {
    await invoke('set_title', {
      title: title
    });
  }

  async function exportPng(filename, imageStr) {
    await invoke('export_png', {
      filename: filename,
      imageStr: imageStr
    });
  }

  async function exportSvg(filename, content, mime) {
    await invoke('export_svg', {
      filename: filename,
      content: content
    });
  }

  async function openLink(url) {
    await invoke('open_link', {
      url: url
    });
  }

  async function createNewWindow() {
    await invoke('open_new_window');
  }

  async function copyFile(oldPath, newPath) {
    try {
      await invoke('copy_file', {
        oldPath: oldPath,
        newPath: newPath
      });
      return true;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return false;
    }
  }
  async function createFsFolder(path) {
    try {
      await invoke('create_folder', { path: path });
      return true;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return false;
    }
  }
  async function deleteFile(path) {
    try {
      await invoke('delete_file', { path: path });
      return true;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return false;
    }
  }
  async function moveFile(oldPath, newPath) {
    try {
      await invoke('move_file', {
        oldPath: oldPath,
        newPath: newPath
      });
      return true;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return false;
    }
  }
  async function readFolder(path) {
    var children, result;
    try {
      children = await invoke('read_folder', { path: path });
      result = children.map(utils.fsMapChildToInternal);
      return result.filter(utils.isTypeAllowed);
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return undefined;
    }
  }
  async function readTextFile(path) {
    var result;
    try {
      result = await invoke('read_text_file', { path: path });
      return result;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return undefined;
    }
  }
  async function renameFile(oldPath, newPath) {
    try {
      await invoke('rename_file', {
        oldPath: oldPath,
        newPath: newPath
      });
      return true;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return false;
    }
  }
  async function watchFolder(path, callback) {
    var unlisten;
    try {
      console.log('watching folder', path);
      unlisten = await listen('folder-changed', function (event) {
        callback(event.payload);
      });
      await invoke('watch_folder', { path: path });
      return unlisten;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return undefined;
    }
  }
  async function writeTextFile(path, content) {
    try {
      await invoke('write_text_file', {
        path: path,
        content: content
      });
      return true;
    } catch (_handlerData_) {
      console.error(_handlerData_);
      return false;
    }
  }

  var host = {
    main: main,
    getAccount: getAccount,
    getTheme: getTheme,
    saveTheme: saveTheme,
    copyFile: copyFile,
    createFsFolder: createFsFolder,
    deleteFile: deleteFile,
    moveFile: moveFile,
    readFolder: readFolder,
    readTextFile: readTextFile,
    renameFile: renameFile,
    watchFolder: watchFolder,
    writeTextFile: writeTextFile    
  }

  var backend = FileBackend(utils, host);


  window.padBridge = {
    createNewWindow: createNewWindow,
    openLink: openLink,
    exportSvg: exportSvg,
    exportPng: exportPng,
    setTitle: setTitle,
    getRecentFolders: getRecentFolders,
    saveRecentFolders: saveRecentFolders,
    openFolder: openFolder,
    initFolder: backend.initFolder,
    disconnectFolder: backend.disconnectFolder,
    subscribeForFolderChanges: backend.subscribeForFolderChanges,
  }

  return createHttpWrapper(backend, host);
}
