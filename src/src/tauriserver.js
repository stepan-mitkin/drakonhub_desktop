


function localserver(utils) {
  const invoke = window.__TAURI__.core.invoke;

  const ROOTID = "1";
  const SPACEID = "my-diagrams";
  const USERID = "local-user";
  const BODY = "body";
  const USER = "user";
  const CHIDLREN = "children";
  const RECENT = "recent";
  const MAX_RECENT = 200;
  const THEME = "theme";
  const RUBBISH = "rubbish";
  const DELETE_TIMEOUT = 6000;

  const SETTINGS_FILE = 'settings.json';

  var unit = {};

  var gSearch = undefined;
  var gDeleteTimeout = undefined;
  var backend = FileBackend(utils);

  async function sendRequest(method, url, body) {
    var responseRaw = undefined;
    var bodyObj = {};
    if (body) {
      bodyObj = JSON.parse(body);
    }
    try {
      if (method === "GET") {
        if (url === "/api/account") {
          responseRaw = await getAccount();
        } else if (url === "/api/recent") {
          responseRaw = await backend.getRecent();
        } else if (url === "/api/theme") {
          responseRaw = await getTheme();
        } else if (url.startsWith("/api/visit/")) {
          responseRaw = await backend.getFolder(url);
        } else if (url.startsWith("/api/tag/")) {
          responseRaw = await backend.getTag(url);
        } else if (url === "/api/search") {
          responseRaw = await backend.getSearch(url);
        } else if (url.startsWith("/api/backup")) {
          responseRaw = await backend.startBackup(bodyObj);
        }
      } else if (method === "POST") {
        if (url === "/api/theme") {
          responseRaw = await saveTheme(bodyObj);
        } else if (url.startsWith("/api/folder/")) {
          responseRaw = await backend.createFolder(bodyObj);
        } else if (url.startsWith("/api/edit/")) {
          responseRaw = await backend.editDiagram(url, bodyObj);
        } else if (url === "/api/find_folders") {
          responseRaw = await backend.findFolders(bodyObj);
        } else if (url === "/api/search") {
          if (bodyObj.type === "folders") {
            responseRaw = await backend.findFoldersByName(bodyObj);
          } else if (bodyObj.type === "items") {
            responseRaw = await backend.startItemSearch(bodyObj);
          } else {
            return createError(400, "Unsupported type");
          }
        } else if (url === "/api/many") {
          if (bodyObj.operation === "copy") {
            responseRaw = await backend.copyPaste(bodyObj);
          } else if (bodyObj.operation === "move") {
            responseRaw = await backend.cutPaste(bodyObj);
          } else if (bodyObj.operation === "delete") {
            responseRaw = await backend.deleteMany(bodyObj);
          }
        } else if (url === "/api/restore_many") {
          responseRaw = await backend.restoreMany(bodyObj);
        } else if (url === "/api/feedback") {
          console.error(bodyObj);
          responseRaw = create200();
        }
      } else if (method === "PUT") {
        if (url.startsWith("/api/folder/")) {
          responseRaw = await backend.updateFolder(url, bodyObj);
        }
      }
      console.log("sendRequest reply", method, url, bodyObj, responseRaw[0]);
    } catch (ex) {
      console.error("sendRequest", method, url, body, ex);
      responseRaw = [500, { error: "Server error" }];
    }
    if (!responseRaw) {
      throw new Error(method + " " + url);
    }
    var response = {
      status: responseRaw[0],
      responseText: JSON.stringify(responseRaw[1]),
    };
    return response;
  }

  function createError(status, message) {
    return [status, { error: message }];
  }

  function create200(payload) {
    return [200, payload];
  }

  async function main() {
    console.log("tauriserver.main");

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
    return create200(theme);
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

    path = await window.__TAURI__.core.invoke('open_folder');

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

  unit.sendRequest = sendRequest;
  unit.main = main;

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
  return unit;
}
