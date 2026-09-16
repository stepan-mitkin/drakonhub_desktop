window.FileBackend = FileBackend;
function FileBackend(utils) {
    var self = { _type: 'FileBackend' };
    const invoke = window.__TAURI__.core.invoke;
    const listen = window.__TAURI__.event.listen;
    const ROOTID = '1';
    const SPACEID = 'my-diagrams';
    const USERID = 'local-user';
    const DELETE_TIMEOUT = 3000;
    const FOLDER_DEBOUNCE_MS = 200;
    var gAccess = 'admin';
    var gRootPath = '';
    var gProjectName = '';
    var gNextId = 2;
    var gNodesById = {};
    var gIdsByPath = {};
    var gDeleteTimer = undefined;
    var gDeleteItems = [];
    var gPunctuation = {};
    var gSearch = undefined;
    var gUnlistenFolder = undefined;
    var gFolderDebounce = undefined;
    var gFolderEvents = [];
    var gLatestEdits = {};
    var gFolderListener = undefined;
    function addChangedNode(output, id) {
        var node;
        node = getNode(id);
        if (node) {
            output.push({
                id: node.id,
                type: node.type,
                parent: node.parent,
                name: node.name
            });
        }
    }
    function addToChildren(parent, id) {
        parent.children.push(id);
    }
    async function addToRecent(id) {
    }
    function buildPath(parentPath, name, type) {
        var last, parts;
        if (type === 'folder') {
            last = name;
        } else {
            last = name + '.' + type;
        }
        parts = parentPath.split('/');
        parts.push(last);
        return parts.join('/');
    }
    function buildPunctuation() {
        var result, symbol, symbols;
        symbols = [
            '{',
            '}',
            '-',
            '_',
            '/',
            '+',
            '*',
            '\\',
            '%',
            '&',
            '^',
            '=',
            '?',
            '!',
            '"',
            '\'',
            '.',
            ',',
            ';',
            ':',
            '=',
            '(',
            ')',
            '[',
            ']',
            '<',
            '>',
            '|'
        ];
        result = {};
        for (symbol of symbols) {
            result[symbol] = true;
        }
        return result;
    }
    function checkCachedAgainstFresh(children, newChildren, toDelete, toInsert) {
        var newByPath, newChild, oldByPath, oldChild, oldChildren, path;
        oldChildren = children.map(getNode);
        oldByPath = mapBy(oldChildren, 'path');
        newByPath = mapBy(newChildren, 'path');
        for (path in oldByPath) {
            oldChild = oldByPath[path];
            if (!(path in newByPath)) {
                toDelete[oldChild.id] = true;
            }
        }
        for (path in newByPath) {
            newChild = newByPath[path];
            if (!(path in oldByPath)) {
                toInsert.push(newChild);
            }
        }
    }
    function checkCycle(target, items) {
        var item, ok;
        for (item of items) {
            ok = checkOneCycle(target.folder_id, item.id);
            if (!ok) {
                return false;
            }
        }
        return true;
    }
    async function checkNameIsUnique(parentId, name, id) {
        var needle, node, parent, sibling, siblings, sname;
        if (name) {
            parent = getNode(parentId);
            if (parent) {
                needle = normalizeStringForSearch(name);
                siblings = await readFolder(parent.path);
                if (siblings) {
                    for (sibling of siblings) {
                        sname = normalizeStringForSearch(sibling.name);
                        if (sname === needle) {
                            if (id) {
                                node = getNode(id);
                                if (!(node && sibling.path === node.path)) {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    function checkOneCycle(targetId, folderId) {
        var node;
        if (targetId === folderId) {
            return false;
        } else {
            node = getNode(targetId);
            if (node && node.parent) {
                return checkOneCycle(node.parent, folderId);
            } else {
                return true;
            }
        }
    }
    async function collectChanges(id, changes) {
        var _collection_2, _collection_4, _collection_6, change, childId, node, refresh;
        node = getNode(id);
        if (node && node.type === 'folder') {
            refresh = await refreshChildren(node);
            if (refresh.ok) {
                _collection_2 = refresh.added;
                for (change of _collection_2) {
                    change.op = 'add';
                    changes.push(change);
                }
                _collection_4 = refresh.removed;
                for (change of _collection_4) {
                    change.op = 'remove';
                    changes.push(change);
                }
                _collection_6 = node.children;
                for (childId of _collection_6) {
                    await collectChanges(childId, changes);
                }
            }
        }
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
    async function copyPaste(body) {
        var _collection_2, item, ok;
        ok = checkCycle(body.target, body.items);
        if (ok) {
            _collection_2 = body.items;
            for (item of _collection_2) {
                await copySubfolder(item, body.target.folder_id);
            }
            return create200({});
        } else {
            return createError(400, 'ERR_CYCLE');
        }
    }
    async function copySubfolder(item, targetId) {
        var id, name, node, ok, parent, path;
        node = getNode(item.id);
        if (node) {
            parent = getNode(targetId);
            if (parent) {
                if (item.new_name) {
                    name = item.new_name;
                } else {
                    name = node.name;
                }
                path = buildPath(parent.path, name, node.type);
                ok = await copyFile(node.path, path);
                if (ok) {
                    id = nextId();
                    createNode(targetId, id, name, path, node.type);
                    addToChildren(parent, id);
                }
            }
        }
    }
    function create200(payload) {
        return [
            200,
            payload
        ];
    }
    function createError(status, message) {
        return [
            status,
            { error: message }
        ];
    }
    async function createFolder(body) {
        var id, name, nameOk, node, ok, parent, path, type;
        if (body.name) {
            parent = getNode(body.parent);
            if (parent) {
                type = body.type;
                name = body.name;
                nameOk = await checkNameIsUnique(body.parent, name, undefined);
                if (nameOk) {
                    path = buildPath(parent.path, name, type);
                    if (type === 'folder') {
                        ok = await createFsFolder(path);
                    } else {
                        ok = await writeTextFile(path, '{}');
                    }
                    if (ok) {
                        id = nextId();
                        node = createNode(body.parent, id, name, path, type);
                        addToChildren(parent, id);
                        registerEdit(node.path);
                        return create200({ folder_id: id });
                    } else {
                        return createNotUnique();
                    }
                } else {
                    return createNotUnique();
                }
            } else {
                return createError(400, 'bad parent');
            }
        } else {
            return createError(400, 'name is empty');
        }
    }
    function createFolderNode(parent, id, name, path) {
        var node;
        node = createNode(parent, id, name, path, 'folder');
        return node;
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
    function createItemSearch(needleRaw, accurate) {
        var needle, self;
        needle = normalizeStringForSearch(needleRaw);
        self = {
            needle: needle,
            state: 'reading-folders',
            completed: false,
            items: [],
            nodes: []
        };
        self.getSearchResult = function () {
            return getSearchResult(self);
        };
        self.runSearch = function () {
            return runSearch(self);
        };
        self.stopItemSearch = function () {
            return stopItemSearch(self);
        };
        return self;
    }
    function createNode(parent, id, name, path, type) {
        var node;
        node = {
            parent: parent,
            id: id,
            name: name,
            path: path,
            type: type,
            tag: 'LOADED'
        };
        if (node.type === 'folder') {
            node.children = [];
        }
        gNodesById[id] = node;
        gIdsByPath[path] = id;
        return node;
    }
    function createNotFound() {
        return createError(404, 'Not found');
    }
    function createNotUnique() {
        return createError(400, 'ERR_NAME_NOT_UNIQUE');
    }
    async function cutPaste(body) {
        var _collection_2, item, ok;
        ok = checkCycle(body.target, body.items);
        if (ok) {
            _collection_2 = body.items;
            for (item of _collection_2) {
                await moveSubfolder(item, body.target.folder_id);
            }
            return create200({});
        } else {
            return createError(400, 'ERR_CYCLE');
        }
    }
    function deleteChildrenFromCache(node) {
        var _collection_2, childId;
        if (node.children) {
            _collection_2 = node.children;
            for (childId of _collection_2) {
                deleteSubtreeFromCache(childId);
            }
            node.children = [];
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
    function deleteFromChildren(parent, childId) {
        parent.children = parent.children.filter(id => id !== childId);
    }
    function deleteFromParent(node) {
        var parent;
        parent = getNode(node.parent);
        deleteFromChildren(parent, node.id);
    }
    async function deleteMany(body) {
        if (gDeleteTimer) {
            clearTimeout(gDeleteTimer);
        }
        await doDelete();
        gDeleteItems = body.items;
        gDeleteTimer = setTimeout(doDelete, DELETE_TIMEOUT);
        return create200({});
    }
    function deleteSubtreeFromCache(id) {
        var _collection_2, childId, node;
        node = getNode(id);
        if (node) {
            delete gNodesById[id];
            delete gIdsByPath[node.path];
            if (node.children) {
                _collection_2 = node.children;
                for (childId of _collection_2) {
                    deleteSubtreeFromCache(childId);
                }
            }
        }
    }
    function disconnectFolder() {
        gNodesById = {};
        gIdsByPath = {};
        gRootPath = undefined;
        gProjectName = undefined;
        if (gUnlistenFolder) {
            gUnlistenFolder();
            gUnlistenFolder = undefined;
            gFolderEvents = [];
        }
        if (gFolderDebounce) {
            gFolderDebounce.stop();
            gFolderDebounce = undefined;
        }
    }
    async function doDelete() {
        var item, node, ok;
        for (item of gDeleteItems) {
            node = getNode(item.id);
            if (node) {
                ok = await deleteFile(node.path);
            }
        }
        gDeleteTimer = undefined;
        gDeleteItems = [];
    }
    async function editDiagram(url, body) {
        var _collection_2, _collection_4, _collection_6, change, diagram, existing, id, itemId, items, json, nameOk, node, ok, oldPath;
        id = getIdFromUrl(url);
        node = getNode(id);
        if (node) {
            if (body.oldTag === node.tag) {
                if ('name' in body) {
                    if (body.name) {
                        nameOk = await checkNameIsUnique(node.parent, body.name, id);
                        if (nameOk) {
                            diagram = await readJson(node.path);
                            diagram = diagram || {};
                            items = diagram.items || {};
                            diagram.items = items;
                            if (body.added) {
                                _collection_2 = body.added;
                                for (change of _collection_2) {
                                    itemId = change.id;
                                    delete change.id;
                                    items[itemId] = change;
                                }
                            }
                            if (body.updated) {
                                _collection_4 = body.updated;
                                for (change of _collection_4) {
                                    itemId = change.id;
                                    delete change.id;
                                    existing = items[itemId];
                                    Object.assign(existing, change);
                                }
                            }
                            if (body.removed) {
                                _collection_6 = body.removed;
                                for (itemId of _collection_6) {
                                    delete items[itemId];
                                }
                            }
                            utils.copyNotNull(diagram, body, [
                                'params',
                                'style',
                                'description'
                            ]);
                            json = JSON.stringify(diagram, null, 4);
                            ok = await writeTextFile(node.path, json);
                            if (ok) {
                                node.tag = body.tag;
                                if (body.name) {
                                    oldPath = node.path;
                                    registerEdit(oldPath);
                                    ok = await renameCore(id, node, body.name);
                                    if (ok) {
                                        registerEdit(node.path);
                                        return [
                                            204,
                                            ''
                                        ];
                                    } else {
                                        return createNotUnique();
                                    }
                                } else {
                                    registerEdit(node.path);
                                    return [
                                        204,
                                        ''
                                    ];
                                }
                            } else {
                                return createNotUnique();
                            }
                        } else {
                            return createNotUnique();
                        }
                    } else {
                        return createError(400, 'Name is empty');
                    }
                } else {
                    diagram = await readJson(node.path);
                    diagram = diagram || {};
                    items = diagram.items || {};
                    diagram.items = items;
                    if (body.added) {
                        _collection_2 = body.added;
                        for (change of _collection_2) {
                            itemId = change.id;
                            delete change.id;
                            items[itemId] = change;
                        }
                    }
                    if (body.updated) {
                        _collection_4 = body.updated;
                        for (change of _collection_4) {
                            itemId = change.id;
                            delete change.id;
                            existing = items[itemId];
                            Object.assign(existing, change);
                        }
                    }
                    if (body.removed) {
                        _collection_6 = body.removed;
                        for (itemId of _collection_6) {
                            delete items[itemId];
                        }
                    }
                    utils.copyNotNull(diagram, body, [
                        'params',
                        'style',
                        'description'
                    ]);
                    json = JSON.stringify(diagram, null, 4);
                    ok = await writeTextFile(node.path, json);
                    if (ok) {
                        node.tag = body.tag;
                        if (body.name) {
                            oldPath = node.path;
                            registerEdit(oldPath);
                            ok = await renameCore(id, node, body.name);
                            if (ok) {
                                registerEdit(node.path);
                                return [
                                    204,
                                    ''
                                ];
                            } else {
                                return createNotUnique();
                            }
                        } else {
                            registerEdit(node.path);
                            return [
                                204,
                                ''
                            ];
                        }
                    } else {
                        return createNotUnique();
                    }
                }
            } else {
                return createError(400, 'ERR_MODIFIED');
            }
        } else {
            return createNotFound();
        }
    }
    function extractNumberedItem(item, index, output) {
        if (item.tagName === 'LI') {
            output.push(`${ index + 1 }. ${ item.textContent.trim() }`);
        }
    }
    function extractUnnumberedItem(item, output) {
        if (item.tagName === 'LI') {
            output.push(`- ${ item.textContent.trim() }`);
        }
    }
    async function findFolders(body) {
        var found, lines;
        found = [];
        lines = body.lines.map(normalizeStringForSearch);
        await traverseFolders(ROOTID, function (node) {
            return folderIsMentioned(node, lines, found);
        });
        return [
            200,
            { folders: found }
        ];
    }
    async function findFoldersByName(body) {
        var found, needle;
        found = [];
        needle = normalizeStringForSearch(body.needle);
        await traverseFolders(ROOTID, function (node) {
            return folderMatches(node, needle, found);
        });
        return create200({ folders: found });
    }
    async function folderIsMentioned(node, lines, found) {
        var line, lowName;
        lowName = normalizeStringForSearch(node.name);
        for (line of lines) {
            if (lineContainsName(line, lowName)) {
                found.push({
                    id: node.id,
                    name: node.name
                });
            }
        }
        return false;
    }
    async function folderMatches(node, needle, found) {
        var foundItem, lowName;
        lowName = normalizeStringForSearch(node.name);
        if (!(lowName.indexOf(needle) === -1)) {
            foundItem = makeFoundFolder(node);
            found.push(foundItem);
        }
        return false;
    }
    function fsMapChildToInternal(fsEntry) {
        var parsed, path;
        path = utils.normalizePath(fsEntry.path);
        parsed = getNameFromPath(path);
        if (fsEntry.type === 'folder') {
            return {
                name: parsed.last,
                type: 'folder',
                path: path
            };
        } else {
            return {
                name: parsed.name,
                type: parsed.type,
                path: path
            };
        }
    }
    async function getFolder(url) {
        var _branch_, diagram, id, node, path, refresh, result;
        _branch_ = 'Branch1';
        while (true) {
            switch (_branch_) {
            case 'Branch1':
                id = getIdFromUrl(url);
                node = getNode(id);
                if (node) {
                    path = getPath(id);
                    result = {
                        id: id,
                        name: node.name,
                        tag: node.tag,
                        type: node.type,
                        children: [],
                        items: [],
                        access: gAccess,
                        parent: node.parent,
                        space_id: SPACEID,
                        user_name: USERID,
                        path: path
                    };
                    if (node.type === 'folder') {
                        refresh = await refreshChildren(node);
                        if (refresh.ok) {
                            result.children = node.children.map(idToOutputChild);
                            _branch_ = 'Success';
                        } else {
                            deleteSubtreeFromCache(id);
                            _branch_ = 'Error';
                        }
                    } else {
                        diagram = await readJson(node.path);
                        if (diagram) {
                            normalizeDiagram(diagram);
                            Object.assign(result, diagram);
                            await addToRecent(id);
                            return create200(result);
                        } else {
                            deleteSubtreeFromCache(id);
                            _branch_ = 'Error';
                        }
                    }
                } else {
                    _branch_ = 'Error';
                }
                break;
            case 'Error':
                return createNotFound();
            case 'Success':
                return create200(result);
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                return;
            }
        }
    }
    function getIdFromUrl(url) {
        var id, parts;
        parts = url.split('/');
        id = parts[parts.length - 1];
        return id;
    }
    function getListOfModifiedFiles() {
        var evt, modifiedSet, otherSet, path, paths;
        modifiedSet = {};
        otherSet = {};
        for (evt of gFolderEvents) {
            paths = getPaths(evt);
            if (evt.type === 'modify') {
                for (path of paths) {
                    modifiedSet[path] = true;
                }
            } else {
                for (path of paths) {
                    otherSet[path] = true;
                }
            }
        }
        gFolderEvents = [];
        gLatestEdits = {};
        return {
            modified: Object.keys(modifiedSet),
            other: Object.keys(otherSet)
        };
    }
    function getNameFromPath(path) {
        var last, lastParts, parts, type;
        parts = path.split('/');
        last = parts[parts.length - 1];
        lastParts = last.split('.');
        if (lastParts.length === 1) {
            return {
                last: last,
                filename: last,
                name: last,
                type: undefined
            };
        } else {
            type = lastParts.pop();
            return {
                last: last,
                filename: last,
                name: lastParts.join('.'),
                type: type
            };
        }
    }
    function getNode(folderId) {
        return gNodesById[folderId];
    }
    function getNodeByPath(path) {
        var id;
        id = gIdsByPath[path];
        if (id) {
            return gNodesById[id];
        } else {
            return undefined;
        }
    }
    function getPath(id) {
        var current, currentId, path, step;
        currentId = id;
        path = [];
        while (true) {
            current = getNode(currentId);
            step = {
                space_id: SPACEID,
                id: current.id,
                name: current.name
            };
            path.push(step);
            currentId = current.parent;
            if (!currentId) {
                break;
            }
        }
        path.reverse();
        return path;
    }
    function getPaths(evt) {
        var _collection_2, path, paths, rawPath;
        paths = [];
        _collection_2 = evt.paths;
        for (rawPath of _collection_2) {
            path = utils.normalizePath(rawPath);
            if (path.startsWith(gRootPath) && !isEditedRecently(path)) {
                paths.push(path);
            }
        }
        return paths;
    }
    async function getRecent() {
        return [];
    }
    async function getSearch() {
        var searchResult;
        await pause(50);
        if (gSearch) {
            searchResult = gSearch.getSearchResult();
        } else {
            searchResult = {
                completed: true,
                items: []
            };
        }
        return create200(searchResult);
    }
    function getSearchResult(self) {
        var completed, items;
        items = self.items;
        completed = self.completed;
        self.items = [];
        return {
            completed: completed,
            items: items
        };
    }
    function getShortPath(node) {
        var path, shortPath;
        path = getPath(node.id);
        shortPath = path.map(step => step.name);
        return shortPath;
    }
    async function getTag(url) {
        var id, node, parts, time;
        parts = url.split('/');
        time = parts[parts.length - 1];
        id = parts[parts.length - 2];
        node = getNode(id);
        if (node) {
            return create200({
                time: time,
                tag: node.tag
            });
        } else {
            return createError(404, 'Not found');
        }
    }
    function getUnixMsNow() {
        return new Date().getTime();
    }
    function handleHtmlNode(node, output) {
        var _selectValue_2;
        _selectValue_2 = node.tagName;
        if (_selectValue_2 === 'P') {
            output.push(node.textContent.trim());
        } else {
            if (_selectValue_2 === 'UL') {
                node.childNodes.forEach(item => extractUnnumberedItem(item, output));
            } else {
                if (_selectValue_2 === 'OL') {
                    node.childNodes.forEach((item, index) => extractNumberedItem(item, index, output));
                }
            }
        }
    }
    function htmlToString(html) {
        var doc, output, parser, root;
        if (html) {
            if (html.startsWith('<') && html.endsWith('>')) {
                parser = new DOMParser();
                doc = parser.parseFromString(html, 'text/html');
                root = doc.body;
                output = [];
                root.childNodes.forEach(node => handleHtmlNode(node, output));
                return output;
            } else {
                return html.split('\n');
            }
        } else {
            return [];
        }
    }
    function idToOutputChild(id) {
        var node;
        node = getNode(id);
        return {
            id: id,
            name: node.name,
            type: node.type,
            space_id: SPACEID
        };
    }
    async function initFolder(folder) {
        var changes, parts;
        gRootPath = folder;
        parts = folder.split('/');
        gProjectName = parts[parts.length - 1];
        gNodesById = {};
        gIdsByPath = {};
        gPunctuation = buildPunctuation();
        gNextId = 2;
        createFolderNode(undefined, ROOTID, gProjectName, folder);
        changes = [];
        await collectChanges(ROOTID, changes);
        gFolderEvents = [];
        gFolderDebounce = utils.debounce_create(processFolderChanged, FOLDER_DEBOUNCE_MS);
        gFolderDebounce.run();
        gUnlistenFolder = await watchFolder(gRootPath, onFolderChanged);
        gLatestEdits = {};
    }
    function isEditedRecently(path) {
        var diff, modified, nowMs;
        modified = gLatestEdits[path];
        if (modified) {
            nowMs = getUnixMsNow();
            diff = nowMs - modified;
            if (diff > FOLDER_DEBOUNCE_MS * 3) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    function isEmptyOrSeparator(text) {
        if (text && !(text === ' ') && !(text === String.fromCodePoint(160)) && !(text === '\t') && !(text === '\r') && !(text === '\n')) {
            return text in gPunctuation;
        } else {
            return true;
        }
    }
    function isTypeAllowed(item) {
        var _selectValue_2;
        _selectValue_2 = item.type;
        if (_selectValue_2 === 'folder' || (_selectValue_2 === 'drakon' || (_selectValue_2 === 'graf' || _selectValue_2 === 'free'))) {
            return true;
        } else {
            return false;
        }
    }
    function lineContainsName(line, name) {
        var after, afterIndex, before, start;
        start = line.indexOf(name);
        if (start === -1) {
            return false;
        } else {
            before = '';
            after = '';
            if (start > 0) {
                before = line[start - 1];
            }
            afterIndex = start + name.length;
            if (afterIndex < line.length) {
                after = line[afterIndex];
            }
            if (isEmptyOrSeparator(before) && isEmptyOrSeparator(after)) {
                return true;
            } else {
                return false;
            }
        }
    }
    function makeFoundFolder(node) {
        var path;
        path = getShortPath(node);
        return {
            space_id: SPACEID,
            folder_id: node.id,
            name: node.name,
            type: node.type,
            path: path
        };
    }
    function mapBy(array, property) {
        var element, key, map;
        map = {};
        for (element of array) {
            key = element[property];
            map[key] = element;
        }
        return map;
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
    async function moveSubfolder(item, targetId) {
        var id, name, newParent, node, ok, oldParent, path;
        id = item.id;
        node = getNode(id);
        if (node) {
            newParent = getNode(targetId);
            if (newParent) {
                oldParent = getNode(node.parent);
                if (oldParent) {
                    if (item.new_name) {
                        name = item.new_name;
                    } else {
                        name = node.name;
                    }
                    path = buildPath(newParent.path, name, node.type);
                    ok = await moveFile(node.path, path);
                    if (ok) {
                        addToChildren(newParent, id);
                        deleteFromChildren(oldParent, id);
                        renameInCache(id, name, path);
                        deleteChildrenFromCache(node);
                    } else {
                    }
                } else {
                }
            } else {
            }
        } else {
        }
    }
    function nextId() {
        var id;
        id = gNextId;
        gNextId++;
        return id.toString();
    }
    function normalizeDiagram(diagram) {
        var id, item, items, items2;
        items = diagram.items || {};
        items2 = [];
        for (id in items) {
            item = items[id];
            item.id = id;
            if ('text' in item) {
                item.content = item.text;
                delete item.text;
            }
            items2.push(item);
        }
        diagram.items = items2;
    }
    function normalizeStringForSearch(str) {
        if (str) {
            return str.toLowerCase().trim().normalize('NFC');
        } else {
            return '';
        }
    }
    function onFolderChanged(evt) {
        gFolderEvents.push(evt);
        gFolderDebounce.onInput();
    }
    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function processFolderChanged() {
        var _collection_2, changes, path;
        changes = getListOfModifiedFiles();
        _collection_2 = changes.modified;
        for (path of _collection_2) {
            resetTag(path);
        }
        if (!(changes.other.length === 0)) {
            await refreshCache();
        }
    }
    async function readFolder(path) {
        var children, result;
        try {
            children = await invoke('read_folder', { path: path });
            result = children.map(fsMapChildToInternal);
            return result.filter(isTypeAllowed);
        } catch (_handlerData_) {
            console.error(_handlerData_);
            return undefined;
        }
    }
    async function readJson(path) {
        var body;
        body = await readTextFile(path);
        if (body === undefined) {
            return undefined;
        } else {
            if (body.trim() === '') {
                return {};
            } else {
                try {
                    return JSON.parse(body);
                } catch (ex) {
                    console.error('readJson', ex);
                    return undefined;
                }
            }
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
    async function refreshCache() {
        var changes;
        changes = [];
        await collectChanges(ROOTID, changes);
        if (gFolderListener) {
            gFolderListener(changes);
        }
    }
    async function refreshChildren(node) {
        var _, _collection_3, added, childId, children2, created, fchildren, id, nodeInfo, removed, toDelete, toInsert;
        fchildren = await readFolder(node.path);
        if (fchildren) {
            toDelete = {};
            toInsert = [];
            added = [];
            removed = [];
            checkCachedAgainstFresh(node.children, fchildren, toDelete, toInsert);
            for (id in toDelete) {
                _ = toDelete[id];
                addChangedNode(removed, id);
                deleteSubtreeFromCache(id);
            }
            children2 = [];
            for (nodeInfo of toInsert) {
                created = createNode(node.id, nextId(), nodeInfo.name, nodeInfo.path, nodeInfo.type);
                addChangedNode(added, created.id);
                children2.push(created.id);
            }
            _collection_3 = node.children;
            for (childId of _collection_3) {
                if (!toDelete[childId]) {
                    children2.push(childId);
                }
            }
            node.children = children2;
            return {
                ok: true,
                added: added,
                removed: removed
            };
        } else {
            return { ok: false };
        }
    }
    function registerEdit(path) {
        gLatestEdits[path] = getUnixMsNow();
    }
    async function renameCore(id, node, newName) {
        var newPath, ok;
        newPath = renamePath(node.path, newName, node.type);
        ok = await renameFile(node.path, newPath);
        if (ok) {
            renameInCache(id, newName, newPath);
            return true;
        } else {
            return false;
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
    function renameInCache(id, newName, newPath) {
        var changedPart, node, parts, renameOrdinal;
        node = getNode(id);
        node.name = newName;
        parts = newPath.split('/');
        renameOrdinal = parts.length - 1;
        changedPart = parts[renameOrdinal];
        replacePathPart(id, renameOrdinal, changedPart);
    }
    function renamePath(path, name, type) {
        var last, parts;
        parts = path.split('/');
        parts.pop();
        if (type === 'folder') {
            last = name;
        } else {
            last = name + '.' + type;
        }
        parts.push(last);
        return parts.join('/');
    }
    function replacePathPart(id, renameOrdinal, changedPart) {
        var _collection_2, childId, newPath, node, parts;
        node = getNode(id);
        parts = node.path.split('/');
        parts[renameOrdinal] = changedPart;
        newPath = parts.join('/');
        updateByPathIndex(node, newPath);
        if (node.children) {
            _collection_2 = node.children;
            for (childId of _collection_2) {
                replacePathPart(childId, renameOrdinal, changedPart);
            }
        }
    }
    function resetTag(path) {
        var node;
        node = getNodeByPath(path);
        if (node) {
            node.tag = new Date().toISOString();
        }
    }
    async function restoreMany() {
        if (gDeleteTimer) {
            clearTimeout(gDeleteTimer);
        }
        gDeleteTimer = undefined;
        gDeleteItems = [];
        return create200({});
    }
    async function runSearch(self) {
        await traverseFolders(ROOTID, function (node) {
            return scanDiagram(self, node);
        });
        self.completed = true;
        console.log('runSearch', 'completed');
    }
    async function scanDiagram(self, node) {
        var diagram, found, id, item, items, path;
        if (self.state) {
            if (node.type === 'folder') {
                return false;
            } else {
                diagram = await readJson(node.path);
                if (diagram) {
                    items = diagram.items || {};
                    found = [];
                    if (!self.accurate) {
                        searchTextChunk('params', diagram.params, self.needle, found, false);
                        searchTextChunk('description', diagram.description, self.needle, found, false);
                    }
                    for (id in items) {
                        item = items[id];
                        if (!(item.type === 'image')) {
                            searchTextChunk(id, item.content, self.needle, found, self.accurate);
                            searchTextChunk(id, item.text, self.needle, found, self.accurate);
                            searchTextChunk(id, item.secondary, self.needle, found, self.accurate);
                        }
                    }
                    if (found.length > 0) {
                        path = getShortPath(node);
                        for (item of found) {
                            item.space_id = SPACEID;
                            item.folder_id = node.id;
                            item.path = path.slice();
                            item.type = node.type;
                            item.name = node.name;
                            self.items.push(item);
                        }
                    }
                    return false;
                } else {
                    return false;
                }
            }
        } else {
            return true;
        }
    }
    function searchTextChunk(itemId, text, needle, found, accurate) {
        var contains, plainText;
        if (text) {
            plainText = htmlToString(text).join(' ');
            contains = textContainsNeedle(plainText, needle, accurate);
            if (contains) {
                found.push({
                    item_id: itemId,
                    text: plainText
                });
            }
        }
    }
    async function startItemSearch(body) {
        startItemSearchRunner(body.needle, body.accurate);
        return create200({});
    }
    async function startItemSearchRunner(needle, accurate) {
        try {
            console.log('startItemSearchRunner', needle, accurate);
            stopCurrentSearch();
            gSearch = createItemSearch(needle, accurate);
            await gSearch.runSearch();
        } catch (_handlerData_) {
            stopCurrentSearch();
            console.error(_handlerData_);
        }
    }
    function stopCurrentSearch() {
        if (gSearch) {
            gSearch.stopItemSearch();
            gSearch = undefined;
        }
    }
    function stopItemSearch(self) {
        console.log('Item search stopped', self.needle, self.accurate);
        self.state = undefined;
        self.completed = true;
        self.items = [];
    }
    function subscribeForFolderChanges(listener) {
        gFolderListener = listener;
    }
    function textContainsNeedle(text, needle, accurate) {
        var lowText;
        lowText = normalizeStringForSearch(text);
        if (accurate) {
            return lineContainsName(lowText, needle);
        } else {
            return lowText.indexOf(needle) !== -1;
        }
    }
    async function traverseFolders(id, visitor) {
        var _collection_2, childId, node, refresh, stop, stopChild;
        stop = false;
        node = getNode(id);
        if (node) {
            stop = await visitor(node);
            if (!stop && node.type === 'folder') {
                refresh = await refreshChildren(node);
                if (refresh.ok) {
                    _collection_2 = node.children;
                    for (childId of _collection_2) {
                        stopChild = await traverseFolders(childId, visitor);
                        if (stopChild) {
                            stop = true;
                            break;
                        }
                    }
                }
            }
        }
        return stop;
    }
    function updateByPathIndex(node, newPath) {
        delete gIdsByPath[node.path];
        node.path = newPath;
        gIdsByPath[newPath] = node.id;
    }
    async function updateFolder(url, body) {
        var id, name, nameOk, node, ok, oldPath;
        id = getIdFromUrl(url);
        if ('name' in body) {
            name = body.name;
            if (name) {
                node = getNode(id);
                if (node) {
                    if (node.name === name) {
                        return [
                            204,
                            ''
                        ];
                    } else {
                        nameOk = await checkNameIsUnique(node.parent, name, id);
                        if (nameOk) {
                            oldPath = node.path;
                            ok = await renameCore(id, node, name);
                            if (ok) {
                                registerEdit(node.path);
                                registerEdit(oldPath);
                                return [
                                    204,
                                    ''
                                ];
                            } else {
                                return createNotUnique();
                            }
                        } else {
                            return createNotUnique();
                        }
                    }
                } else {
                    return createNotFound();
                }
            } else {
                return createError(400, 'Name is empty');
            }
        } else {
            createError(400, 'Unknown update');
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
    self.copyPaste = copyPaste;
    self.createFolder = createFolder;
    self.cutPaste = cutPaste;
    self.deleteMany = deleteMany;
    self.disconnectFolder = disconnectFolder;
    self.editDiagram = editDiagram;
    self.findFolders = findFolders;
    self.findFoldersByName = findFoldersByName;
    self.getFolder = getFolder;
    self.getRecent = getRecent;
    self.getSearch = getSearch;
    self.getSearchResult = getSearchResult;
    self.getTag = getTag;
    self.initFolder = initFolder;
    self.restoreMany = restoreMany;
    self.runSearch = runSearch;
    self.startItemSearch = startItemSearch;
    self.stopItemSearch = stopItemSearch;
    self.subscribeForFolderChanges = subscribeForFolderChanges;
    self.updateFolder = updateFolder;
    return self;
}