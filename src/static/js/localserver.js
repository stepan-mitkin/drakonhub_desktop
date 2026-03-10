function localserver(utils) {
  const ROOTID = "1";
  const NODES = "nodes";
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

  var gPunctuation = {};
  gPunctuation["{"] = true;
  gPunctuation["}"] = true;
  gPunctuation["-"] = true;
  gPunctuation["_"] = true;
  gPunctuation["/"] = true;
  gPunctuation["+"] = true;
  gPunctuation["*"] = true;
  gPunctuation["\\"] = true;
  gPunctuation["%"] = true;
  gPunctuation["&"] = true;
  gPunctuation["^"] = true;
  gPunctuation["="] = true;
  gPunctuation["?"] = true;
  gPunctuation["!"] = true;
  gPunctuation['"'] = true;
  gPunctuation["'"] = true;
  gPunctuation["."] = true;
  gPunctuation[","] = true;
  gPunctuation[";"] = true;
  gPunctuation[":"] = true;
  gPunctuation["="] = true;
  gPunctuation["("] = true;
  gPunctuation[")"] = true;
  gPunctuation["["] = true;
  gPunctuation["]"] = true;
  gPunctuation["<"] = true;
  gPunctuation[">"] = true;
  gPunctuation["|"] = true;
  var unit = {};

  var gSearch = undefined;
  var gDeleteTimeout = undefined;

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
          responseRaw = await getRecent();
        } else if (url === "/api/theme") {
          responseRaw = await getTheme();
        } else if (url.startsWith("/api/visit/")) {
          responseRaw = await getFolder(url);
        } else if (url.startsWith("/api/tag/")) {
          responseRaw = await getTag(url);
        } else if (url === "/api/search") {
          responseRaw = await getSearch(url);
        } else if (url.startsWith("/api/backup")) {
          responseRaw = await startBackup(bodyObj);
        }
      } else if (method === "POST") {
        if (url === "/api/theme") {
          responseRaw = await saveTheme(bodyObj);
        } else if (url.startsWith("/api/folder/")) {
          responseRaw = await createFolder(bodyObj);
        } else if (url.startsWith("/api/edit/")) {
          responseRaw = await editDiagram(url, bodyObj);
        } else if (url === "/api/find_folders") {
          responseRaw = await findFolders(bodyObj);
        } else if (url === "/api/search") {
          if (bodyObj.type === "folders") {
            responseRaw = await findFoldersByName(bodyObj);
          } else if (bodyObj.type === "items") {
            responseRaw = startItemSearch(bodyObj);
          } else {
            return createError(400, "Unsupported type");
          }
        } else if (url === "/api/many") {
          if (bodyObj.operation === "copy") {
            responseRaw = await copyPaste(bodyObj);
          } else if (bodyObj.operation === "move") {
            responseRaw = await cutPaste(bodyObj);
          } else if (bodyObj.operation === "delete") {
            responseRaw = await deleteMany(bodyObj);
          }
        } else if (url === "/api/restore_many") {
          responseRaw = await restoreMany(bodyObj);
        } else if (url === "/api/feedback") {
          console.error(bodyObj);
          responseRaw = create200();
        }
      } else if (method === "PUT") {
        if (url.startsWith("/api/folder/")) {
          responseRaw = await updateFolder(url, bodyObj);
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

  async function uploadFileToServer(arg1, arg2, file) {
    var zip = await loadZipFromFile(file);
    await removeAllDataForever();
    await unzipAll(zip);
    return true;
  }

  async function removeAllDataForever() {
    var rootChildren = (await getChildrenRecord(ROOTID)) || [];
    for (var childId of rootChildren) {
      await deleteSubtree(childId);
    }
    await removeChildrenRecord(ROOTID);

    var rubbish = (await getChildrenRecord(RUBBISH)) || [];
    for (var childId of rubbish) {
      await deleteSubtree(childId);
    }

    await writeRecentRecord([]);
    await removeChildrenRecord(ROOTID);
    await removeChildrenRecord(RUBBISH);
  }

  function extractNameAndType(filename) {
    if (!filename) {
      return undefined;
    }

    var trimmed = filename.trim();
    const dot = trimmed.lastIndexOf(".");

    if (dot <= 0 || dot === trimmed.length - 1) {
      return undefined;
    }

    return {
      name: trimmed.substring(0, dot),
      type: trimmed.substring(dot + 1),
    };
  }

  async function unzipFile(folders, path, entry) {
    try {
      var parts = path.split("/");
      var name = parts.pop();
      var folderPath = parts.join("/");
      var parentId = await getOrCreateFolder(folders, folderPath);

      var info = extractNameAndType(name);
      if (!info) {
        return;
      }
      var supported = ["drakon", "free", "graf"];
      if (supported.indexOf(info.type) === -1) {
        return;
      }
      const content = await entry.async("string");
      var body = JSON.parse(content);
      body.items = objectToArray(body.items, "id");
      delete body.name;
      delete body.type;
      var id = makeHandle();
      var node = createNode(id, "document", parentId, info.name, info.type);
      await writeNode(node);
      await writeBody(id, body);
      await addChild(parentId, id);
    } catch (ex) {
      console.error("unzipFile error", ex);
    }
  }

  async function getOrCreateFolder(folders, path) {
    if (path === "") {
      return ROOTID;
    }
    var folderId = ROOTID;
    var partial = [];
    var parts = path.split("/");
    for (var part of parts) {
      partial.push(part);
      var subname = partial.join("/");
      if (subname in folders) {
        folderId = folders[subname];
      } else {
        var body = {
          parent: folderId,
          name: part,
          type: "folder",
        };
        var res = await createFolder(body);
        folderId = res[1].folder_id;
        folders[subname] = folderId;
      }
    }
    return folderId;
  }

  async function unzipAll(zip) {
    var folders = {};
    for (var name in zip.files) {
      var entry = zip.files[name];
      if (!entry.dir) {
        await unzipFile(folders, name, entry);
      }
    }
  }

  async function loadZipFromFile(file) {
    var buffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);
    return zip;
  }

  async function startBackup(body) {
    var zip = new JSZip();
    var rootChildren = await getChildrenRecord(ROOTID);
    if (rootChildren) {
      for (var childId of rootChildren) {
        await zipSubfolder(zip, childId);
      }
    }
    const base64 = await zip.generateAsync({ type: "base64" });

    return create200({
      filename: makeZipFilename(),
      base64: base64,
    });
  }

  function blobToDownloadUrl(blob) {
    return URL.createObjectURL(blob);
  }

  async function zipSubfolder(zip, id) {
    var node = await getNode(id);
    if (node.type === "folder") {
      var folder = zip.folder(node.name);
      var children = await getChildrenRecord(id);
      if (children) {
        for (var childId of children) {
          await zipSubfolder(folder, childId);
        }
      }
    } else {
      var body = (await getBody(id)) || {};
      body.name = node.name;
      body.type = node.mime;
      body.items = arrayToObject(body.items, "id");
      var name = node.name + "." + node.mime;
      var json = JSON.stringify(body, null, 4);
      zip.file(name, json);
    }
  }

  function arrayToObject(array, keyProp) {
    var obj = {};
    if (array) {
      for (var item of array) {
        var key = item[keyProp];
        delete item[keyProp];
        obj[key] = item;
      }
    }
    return obj;
  }

  function objectToArray(obj, keyProp) {
    var array = [];
    if (obj) {
      for (var key in obj) {
        var item = obj[key];
        item[keyProp] = key;
        array.push(item);
      }
    }
    return array;
  }

  function makeZipFilename() {
    const now = new Date();

    const pad = (n) => n.toString().padStart(2, "0");

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());

    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());

    return `drakonhub_${year}-${month}-${day}_${hours}-${minutes}.zip`;
  }

  async function restoreMany(body) {
    if (gDeleteTimeout) {
      clearTimeout(gDeleteTimeout);
      gDeleteTimeout = undefined;
    }
    for (var item of body.items) {
      var node = await getNode(item.id);
      var parent = await getNode(node.parent);
      var target = ROOTID;
      if (parent) {
        target = parent.id;
      }
      await removeChild(RUBBISH, node.id);
      await addChild(target, node.id);
      await touchWhenUpdated(node.id);
    }
    return create200({});
  }

  async function deleteMany(body) {
    for (var item of body.items) {
      await removeFromRecentRecursive(item.id);
      var node = await getNode(item.id);
      await removeChild(node.parent, node.id);
      await touchWhenUpdated(node.id);
      await addChild(RUBBISH, node.id);
    }
    gDeleteTimeout = setTimeout(function () {
      deleteForGood(body);
    }, DELETE_TIMEOUT);
    return create200({});
  }

  async function deleteForGood(body) {
    console.log("deleteForGood", body);
    gDeleteTimeout = undefined;
    for (var item of body.items) {
      await removeChild(RUBBISH, item.id);
      await deleteSubtree(item.id);
    }
  }

  async function cutPaste(body) {
    var ok = await checkCycle(body.target, body.items);
    if (!ok) {
      return createError(400, "ERR_CYCLE");
    }
    for (var item of body.items) {
      await moveSubfolder(item, body.target.folder_id);
    }
    return create200({});
  }

  async function copyPaste(body) {
    var ok = await checkCycle(body.target, body.items);
    if (!ok) {
      return createError(400, "ERR_CYCLE");
    }
    for (var item of body.items) {
      await copySubfolder(item, body.target.folder_id);
    }
    return create200({});
  }

  async function checkCycle(target, items) {
    for (var item of items) {
      var ok = await checkOneCycle(target.folder_id, item.id);
      if (!ok) {
        return false;
      }
    }
    return true;
  }

  async function deleteSubtree(id) {
    var node = await getNode(id);
    if (!node) {
      return;
    }
    await removeNode(id);
    if (node.type === "folder") {
      var children = await getChildrenRecord(id);
      if (children) {
        for (var childId of children) {
          await deleteSubtree(childId);
        }
        await removeChildrenRecord(id);
      }
    } else {
      await removeBody(id);
    }
  }

  async function copySubfolder(item, targetId) {
    var node = await getNode(item.id);
    if (item.new_name) {
      node.name = item.new_name;
    }
    node.parent = targetId;
    var now = getUtcNowZulu();
    node.whenCreated = now;
    node.whenUpdated = now;
    node.id = makeHandle();
    await writeNode(node);
    await addChild(targetId, node.id);
    if (node.type === "folder") {
      var children = await getChildrenRecord(item.id);
      if (children) {
        for (var childId of children) {
          await copySubfolder({ id: childId }, node.id);
        }
      }
    } else {
      var body = await getBody(item.id);
      if (body) {
        await writeBody(node.id, body);
      }
    }
  }

  async function moveSubfolder(item, targetId) {
    var node = await getNode(item.id);
    if (item.new_name) {
      node.name = item.new_name;
    }
    var oldParent = node.parent;
    node.parent = targetId;
    var now = getUtcNowZulu();
    node.whenUpdated = now;
    await removeChild(oldParent, node.id);
    await addChild(targetId, node.id);
    await writeNode(node);
  }

  async function checkOneCycle(targetId, folderId) {
    if (targetId == folderId) {
      return false;
    }
    var node = await getNode(targetId);
    if (!node.parent) {
      return true;
    }
    return await checkOneCycle(node.parent, folderId);
  }

  async function findFoldersByName(body) {
    var found = [];
    var needle = body.needle.toLowerCase();
    await traverseFolders(ROOTID, function (node) {
      return folderMatches(node, needle, found);
    });

    return create200({ folders: found });
  }

  async function folderMatches(node, needle, found) {
    var lowName = node.name.toLowerCase();
    if (lowName.indexOf(needle) !== -1) {
      var foundItem = await makeFoundFolder(node);
      found.push(foundItem);
    }
  }

  async function makeFoundFolder(node) {
    var path = await getShortPath(node);
    return {
      space_id: SPACEID,
      folder_id: node.id,
      name: node.name,
      type: getType(node),
      path: path,
    };
  }

  function startItemSearch(body) {
    if (gSearch) {
      gSearch.stop();
    }
    startItemSearchRunner(body.needle, body.accurate);
    return create200({});
  }

  async function getSearch() {
    if (!gSearch) {
      return create200({ completed: true, items: [] });
    }
    await pause(100);
    var searchResult = gSearch.getSearchResult();
    return create200(searchResult);
  }

  async function startItemSearchRunner(needle, accurate) {
    console.log("startItemSearchRunner", needle, accurate);
    try {
      gSearch = createItemSearch(needle, accurate);
      await gSearch.start();
    } catch (ex) {
      console.error("Item search error", ex);
      gSearch.stop();
    }
  }

  function createItemSearch(needleRaw, accurate) {
    var needle = needleRaw.toLowerCase();

    var state = "reading-folders";
    var completed = false;
    var items = [];
    var nodes = [];

    async function runItemSearch() {
      console.log("Item search started", needle, accurate);
      await traverseFolders(ROOTID, addDiagramNode);
      if (!state) {
        console.log(
          "Item search stopped during folder reading",
          needle,
          accurate
        );
        return;
      }
      console.log("Built node list", nodes.length, needle, accurate);

      state = "scanning-diagrams";

      for (var node of nodes) {
        await scanDiagram(node);
        if (!state) {
          return;
        }
      }

      console.log("Item search completed", items.length, needle, accurate);

      completed = true;
      state = undefined;
    }

    function stopItemSearch() {
      console.log("Item search stopped", needle, accurate);
      state = undefined;
      completed = false;
      items = [];
    }

    async function scanDiagram(node) {
      var found = [];
      var body = await getBody(node.id);
      if (!body) {
        return;
      }
      if (!accurate) {
        if (body.params) {
          searchTextChunk("params", body.params, needle, found, false);
        }
        if (body.description) {
          searchTextChunk(
            "description",
            body.description,
            needle,
            found,
            false
          );
        }
      }
      if (body.items) {
        for (var item of body.items) {
          if (item.type !== "image") {
            searchTextChunk(item.id, item.text, needle, found, accurate);
            searchTextChunk(item.id, item.secondary, needle, found, accurate);
          }
        }
      }
      if (found.length > 0) {
        var path = await getShortPath(node);
        for (var item of found) {
          item.space_id = SPACEID;
          item.folder_id = node.id;
          item.path = path.slice();
          item.type = getType(node);
          item.name = node.name;
          items.push(item);
        }
      }
    }

    function searchTextChunk(itemId, text, needle, found, accurate) {
      if (!text) {
        return;
      }

      var plainText = htmlToString(text).join(" ");
      var contains = textContainsNeedle(plainText, needle, accurate);
      if (contains) {
        found.push({
          item_id: itemId,
          text: plainText,
        });
      }
    }

    async function addDiagramNode(node) {
      if (node.type !== "folder") {
        nodes.push(node);
      }
    }

    function getSearchResult() {
      var itemsCopy = items;
      items = [];
      return {
        completed: completed,
        items: itemsCopy,
      };
    }

    return {
      start: runItemSearch,
      stop: stopItemSearch,
      getSearchResult: getSearchResult,
    };
  }

  function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function textContainsNeedle(text, needle, accurate) {
    var lowText = text.toLowerCase();
    if (accurate) {
      return lineContainsName(lowText, needle);
    }
    return lowText.indexOf(needle) !== -1;
  }

  function htmlToString(html) {
    if (!html) return [];
    if (!html.startsWith("<") || !html.endsWith(">")) {
      return html.split("\n");
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const root = doc.body;
    const output = [];

    root.childNodes.forEach((node) => {
      if (node.tagName === "P") {
        output.push(node.textContent.trim());
      } else if (node.tagName === "UL") {
        node.childNodes.forEach((item) => {
          if (item.tagName === "LI") {
            output.push(`- ${item.textContent.trim()}`);
          }
        });
      } else if (node.tagName === "OL") {
        node.childNodes.forEach((item, index) => {
          if (item.tagName === "LI") {
            output.push(`${index + 1}. ${item.textContent.trim()}`);
          }
        });
      }
    });

    return output;
  }

  async function getShortPath(node) {
    var path = await getPath(node);
    var shortPath = path.map(function (step) {
      return step.name;
    });
    return shortPath;
  }

  function createError(status, message) {
    return [status, { error: message }];
  }

  function create200(payload) {
    return [200, payload];
  }

  function getNode(id) {
    return drakonStorage.read(NODES, id);
  }

  function removeNode(id) {
    return drakonStorage.remove(NODES, id);
  }

  function getChildrenRecord(id) {
    return drakonStorage.read(CHIDLREN, id);
  }

  function removeChildrenRecord(id) {
    return drakonStorage.remove(CHIDLREN, id);
  }

  function writeChildrenRecord(id, children) {
    return drakonStorage.write(CHIDLREN, id, children);
  }

  function getRecentRecord() {
    return drakonStorage.read(USER, RECENT);
  }

  function writeRecentRecord(recent) {
    return drakonStorage.write(USER, RECENT, recent);
  }

  function getThemeRecord(id) {
    return drakonStorage.read(USER, THEME);
  }

  function getBody(id) {
    return drakonStorage.read(BODY, id);
  }

  function removeBody(id) {
    return drakonStorage.remove(BODY, id);
  }

  function writeBody(id, diagram) {
    return drakonStorage.write(BODY, id, diagram);
  }

  async function editDiagram(url, body) {
    var id = getIdFromUrl(url);
    var node = await getNode(id);
    if (!node) {
      return createNotFound();
    }
    if (body.oldTag !== node.tag) {
      return createError(400, "ERR_MODIFIED");
    }
    if ("name" in body) {
      if (!body.name) {
        return createError(400, "Name is empty");
      }
      var nameOk = await checkNameIsUnique(node.parent, body.name, id);
      if (!nameOk) {
        return createNotUnique();
      }
      node.name = body.name;
    }

    updateWhenUpdated(node);
    node.tag = body.tag;
    await writeNode(node);

    var diagram = (await getBody(id)) || {};
    utils.copyNotNull(diagram, body, ["params", "style", "description"]);

    var itemList = diagram.items || [];
    var items = {};
    for (var item of itemList) {
      var copy = utils.clone(item);
      var itemId = item.id;
      delete copy.id;
      items[itemId] = copy;
    }
    if (body.added) {
      for (var change of body.added) {
        var itemId = change.id;
        delete change.id;
        items[itemId] = change;
      }
    }
    if (body.updated) {
      for (var change of body.updated) {
        var itemId = change.id;
        delete change.id;
        var existing = items[itemId];
        Object.assign(existing, change);
      }
    }
    if (body.removed) {
      for (var itemId of body.removed) {
        delete items[itemId];
      }
    }
    var newItems = [];
    for (var itemId in items) {
      var item = items[itemId];
      item.id = itemId;
      newItems.push(item);
    }
    diagram.items = newItems;
    await writeBody(id, diagram);
    return [204, ""];
  }

  function createNotUnique() {
    return createError(400, "ERR_NAME_NOT_UNIQUE");
  }

  async function findFolders(body) {
    var found = [];
    var lines = body.lines.map(function (line) {
      return line.toLowerCase();
    });
    await traverseFolders(ROOTID, function (node) {
      return folderIsMentioned(node, lines, found);
    });
    return [200, { folders: found }];
  }

  async function traverseFolders(id, visitor) {
    var node = await getNode(id);
    await visitor(node);
    var children = await getChildrenRecord(id);
    if (children) {
      for (var childId of children) {
        await traverseFolders(childId, visitor);
      }
    }
  }

  function lineContainsName(line, name) {
    var start = line.indexOf(name);
    if (start === -1) {
      return false;
    }
    var before = "";
    var after = "";
    if (start > 0) {
      before = line[start - 1];
    }
    var afterIndex = start + name.length;
    if (afterIndex < line.length) {
      after = line[afterIndex];
    }
    if (isEmptyOrSeparator(before) && isEmptyOrSeparator(after)) {
      return true;
    }
    return false;
  }

  function isEmptyOrSeparator(text) {
    if (!text) {
      return true;
    }
    if (text === " " || text === "\t" || text === "\r" || text === "\n") {
      return true;
    }
    return text in gPunctuation;
  }

  async function folderIsMentioned(node, lines, found) {
    var lowName = node.name.toLowerCase();
    for (var line of lines) {
      if (lineContainsName(line, lowName)) {
        found.push({
          id: node.id,
          name: node.name,
        });
      }
    }
  }

  async function createFolder(body) {
    if (!body.name) {
      return createError(400, "name is empty");
    }
    var id = makeHandle();
    var type = body.type;
    var mime = undefined;
    if (type !== "folder") {
      type = "document";
      mime = body.type;
    }
    var nameOk = await checkNameIsUnique(body.parent, body.name, undefined);
    if (!nameOk) {
      return createNotUnique();
    }
    var node = createNode(id, type, body.parent, body.name, mime);
    await writeNode(node);
    await addChild(body.parent, id);
    return create200({ folder_id: id });
  }

  function updateFolder(url, body) {
    var id = getIdFromUrl(url);
    if ("name" in body) {
      return renameFolder(id, body.name);
    }
    return createError(400, "Unknown update");
  }

  async function renameFolder(id, name) {
    if (!name) {
      return createError(400, "Name is empty");
    }
    var node = await getNode(id);
    if (!node) {
      return createNotFound();
    }
    if (node.name === name) {
      return [204, ""];
    }
    var nameOk = await checkNameIsUnique(node.parent, name, id);
    if (!nameOk) {
      return createNotUnique();
    }

    node.name = name;
    updateWhenUpdated(node);
    await writeNode(node);

    return [204, ""];
  }

  async function checkNameIsUnique(parentId, name, childId) {
    var children = await getChildren(parentId);
    var low = name.toLowerCase();
    for (var child of children) {
      if (child.id === childId) {
        continue;
      }
      var lowChild = child.name.toLowerCase();
      if (lowChild === low) {
        return false;
      }
    }
    return true;
  }

  function getIdFromUrl(url) {
    var parts = url.split("/");
    var id = parts[parts.length - 1];
    return id;
  }

  async function getTag(url) {
    var parts = url.split("/");
    var time = parts[parts.length - 1];
    var id = parts[parts.length - 2];
    var node = await getNode(id);
    if (!node) {
      return createNotFound();
    }
    return [
      200,
      {
        time: time,
        tag: node.tag,
      },
    ];
  }

  function createNotFound() {
    return createError(404, "ERR_NOT_FOUND");
  }

  async function getFolder(url) {
    var id = getIdFromUrl(url);
    var node = await getNode(id);
    if (!node) {
      return createError(404, "Not found");
    }
    var path = await getPath(node);
    var result = {
      id: id,
      name: node.name,
      tag: node.tag,
      type: getType(node),
      children: [],
      items: [],
      access: "admin",
      parent: node.parent,
      space_id: SPACEID,
      user_name: USERID,
      path: path,
    };
    if (node.type === "folder") {
      result.children = await getChildren(id);
    } else {
      var body = (await getBody(id)) || {};
      Object.assign(result, body);
      await addToRecent(id);
    }
    return create200(result);
  }

  function removeFromRecentRecord(recent, id) {
    var index = utils.findIndex(recent, "id", id);
    if (index !== -1) {
      recent.splice(index, 1);
    }
  }

  async function removeFromRecent(id) {
    var recent = (await getRecentRecord()) || [];
    removeFromRecentRecord(recent, id);
    await writeRecentRecord(recent);
  }

  async function removeFromRecentRecursive(id) {
    await removeFromRecent(id);
    var children = await getChildrenRecord(id);
    if (children) {
      for (var childId of children) {
        await removeFromRecentRecursive(childId);
      }
    }
  }

  async function addToRecent(id) {
    var now = getUtcNowZulu();
    var recent = (await getRecentRecord()) || [];
    removeFromRecentRecord(recent, id);
    recent.push({
      when: now,
      id: id,
    });
    while (recent.length > MAX_RECENT) {
      recent.shift();
    }
    await writeRecentRecord(recent);
  }

  async function getChildren(id) {
    var children = await getChildrenRecord(id);
    if (!children) {
      return [];
    }
    var result = [];
    for (var childId of children) {
      var childNode = await getNode(childId);
      var child = {
        space_id: SPACEID,
        id: childId,
        name: childNode.name,
        type: getType(childNode),
      };
      result.push(child);
    }
    return result;
  }

  async function getPath(node) {
    var current = node;
    var path = [];
    while (true) {
      var step = {
        space_id: SPACEID,
        id: current.id,
        name: current.name,
      };
      path.push(step);
      var parent = current.parent;
      if (!parent) {
        break;
      }
      current = await getNode(parent);
    }
    path.reverse();
    return path;
  }

  function getType(node) {
    if (node.type === "folder") {
      return node.type;
    }
    return node.mime;
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

  async function getRecent() {
    var recentRaw = (await getRecentRecord()) || [];
    var recent = [];
    for (var record of recentRaw) {
      var node = await getNode(record.id);
      var item = {
        space_id: SPACEID,
        folder_id: record.id,
        name: node.name,
        when: record.when,
        type: getType(node),
        path: await getPath(node),
      };
      recent.push(item);
    }
    recent.reverse();
    var responseBody = {
      recent: recent,
    };
    return create200(responseBody);
  }

  async function getTheme() {
    var theme = (await getThemeRecord()) || {};
    return create200(theme);
  }

  async function saveTheme(body) {
    await drakonStorage.write(USER, THEME, body);
    return [204, ""];
  }

  function writeNode(node) {
    return drakonStorage.write(NODES, node.id, node);
  }

  async function addChild(parentId, childId) {
    var children = (await getChildrenRecord(parentId)) || [];
    children.push(childId);
    await writeChildrenRecord(parentId, children);
    await touchWhenUpdated(parentId);
  }

  async function removeChild(parentId, childId) {
    var children = (await getChildrenRecord(parentId)) || [];
    var index = children.indexOf(childId);
    children.splice(index, 1);
    await writeChildrenRecord(parentId, children);
    await touchWhenUpdated(parentId);
  }

  async function touchWhenUpdated(id) {
    var node = await getNode(id);
    if (node) {
      updateWhenUpdated(node);
      await writeNode(node);
    }
  }

  function updateWhenUpdated(node) {
    node.whenUpdated = getUtcNowZulu();
  }

  async function main() {
    var rootNode = await drakonStorage.read(NODES, ROOTID);
    if (!rootNode) {
      rootNode = createNode(
        ROOTID,
        "folder",
        undefined,
        "my-diagrams",
        undefined
      );
      await writeNode(rootNode);
    }
  }

  function pad(num, width) {
    const s = String(num);
    return s.length >= width ? s : "0".repeat(width - s.length) + s;
  }

  function randomDigits(count) {
    // cryptographically strong randomness
    const bytes = new Uint8Array(count);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < count; i++) {
      out += String(bytes[i] % 10);
    }
    return out;
  }

  function makeHandle() {
    const d = new Date(); // UTC fields below

    const ts =
      pad(d.getUTCFullYear(), 4) +
      pad(d.getUTCMonth() + 1, 2) +
      pad(d.getUTCDate(), 2) +
      pad(d.getUTCHours(), 2) +
      pad(d.getUTCMinutes(), 2) +
      pad(d.getUTCSeconds(), 2) +
      pad(d.getUTCMilliseconds(), 3);

    // 6 random digits is plenty for most apps; can increase if you want
    return ts + "-" + randomDigits(6);
  }

  function getUtcNowZulu() {
    return new Date().toISOString();
  }

  function createNode(id, type, parent, name, mime) {
    var now = getUtcNowZulu();
    return {
      id: id,
      type: type,
      parent: parent,
      name: name,
      mime: mime,
      whenCreated: now,
      whenUpdated: now,
      tag: "",
    };
  }

  unit.sendRequest = sendRequest;
  unit.main = main;
  unit.uploadFileToServer = uploadFileToServer;
  return unit;
}
