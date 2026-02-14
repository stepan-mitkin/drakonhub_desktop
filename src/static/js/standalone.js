function standalone() {
    var unit = {};
    var core, widgets, utils, gconfig, dh2common, html;
    function main_create() {
        var me = {
            state: '2',
            type: 'main'
        };
        function _main_main(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        initChannel();
                        me.state = '18';
                        initRecent().then(function () {
                            _main_main(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '18':
                        window.addEventListener('storage', onStorage);
                        me.state = '19';
                        core.start().then(function () {
                            _main_main(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '19':
                        onStorage({ key: 'clipboard' });
                        console.log('main completed');
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_main(__resolve, __reject);
            });
        };
        return me;
    }
    function main() {
        var __obj = main_create();
        return __obj.run();
    }
    function onStorage(event) {
        var content, type, obj;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                console.log('onStorage', event.key);
                if (event.key === 'clipboard') {
                    __state = '24';
                } else {
                    __state = '23';
                }
                break;
            case '23':
                return;
            case '24':
                type = localStorage.getItem('clipboard-type');
                content = localStorage.getItem('clipboard');
                if (content) {
                    if (type) {
                        obj = JSON.parse(content);
                        core.clipboardUpdated(type, obj);
                        __state = '23';
                    } else {
                        __state = '23';
                    }
                } else {
                    __state = '23';
                }
                break;
            default:
                return;
            }
        }
    }
    function openFileAt_create(filename) {
        var diagram, _var2;
        var me = {
            state: '2',
            type: 'openFileAt'
        };
        function _main_openFileAt(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        unit.currentFilename = filename;
                        me.state = '13';
                        openFileByPath(filename).then(function (__returnee) {
                            diagram = __returnee;
                            _main_openFileAt(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '13':
                        sendMessageToChannel('save', filename);
                        _var2 = createDiagramResult(diagram);
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_openFileAt(__resolve, __reject);
            });
        };
        return me;
    }
    function openFileAt(filename) {
        var __obj = openFileAt_create(filename);
        return __obj.run();
    }
    function getPath_create() {
        var me = {
            state: '2',
            type: 'getPath'
        };
        function _main_getPath(__resolve, __reject) {
            try {
                me.state = undefined;
                __resolve(unit.currentFilename);
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_getPath(__resolve, __reject);
            });
        };
        return me;
    }
    function getPath() {
        var __obj = getPath_create();
        return __obj.run();
    }
    function saveMyFile_create(diagramOrig) {
        var sanitized, newPath, parsed, newFilename, diagram;
        var me = {
            state: '2',
            type: 'saveMyFile'
        };
        function _main_saveMyFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        diagram = utils.clone(diagramOrig);
                        sanitized = utils.sanitizeFilename(diagram.name);
                        delete diagram.name;
                        newFilename = sanitized + '.' + diagram.type;
                        parsed = core.parsePath(unit.currentFilename);
                        if (parsed.folder) {
                            newPath = parsed.folder + '/' + newFilename;
                            me.state = '5';
                        } else {
                            newPath = newFilename;
                            me.state = '5';
                        }
                        break;
                    case '3':
                        me.state = '4';
                        saveDiagram(newPath, diagram).then(function () {
                            _main_saveMyFile(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        me.state = undefined;
                        __resolve(true);
                        return;
                    case '5':
                        if (newPath === unit.currentFilename) {
                            me.state = '3';
                        } else {
                            me.state = '3';
                            removeFromRecent(unit.currentFilename).then(function () {
                                _main_saveMyFile(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveMyFile(__resolve, __reject);
            });
        };
        return me;
    }
    function saveMyFile(diagramOrig) {
        var __obj = saveMyFile_create(diagramOrig);
        return __obj.run();
    }
    function confirmRename_create(newName) {
        var drakon, graf, free;
        var me = {
            state: '2',
            type: 'confirmRename'
        };
        function _main_confirmRename(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '5';
                        loadKeyValue(newName + '.drakon').then(function (__returnee) {
                            drakon = __returnee;
                            _main_confirmRename(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        if (drakon) {
                            me.state = '8';
                        } else {
                            me.state = '6';
                            loadKeyValue(newName + '.graf').then(function (__returnee) {
                                graf = __returnee;
                                _main_confirmRename(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '6':
                        if (graf) {
                            me.state = '8';
                        } else {
                            me.state = '7';
                            loadKeyValue(newName + '.free').then(function (__returnee) {
                                free = __returnee;
                                _main_confirmRename(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '7':
                        if (free) {
                            me.state = '8';
                        } else {
                            me.state = undefined;
                            __resolve(false);
                            return;
                        }
                        break;
                    case '8':
                        me.state = undefined;
                        __resolve(true);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_confirmRename(__resolve, __reject);
            });
        };
        return me;
    }
    function confirmRename(newName) {
        var __obj = confirmRename_create(newName);
        return __obj.run();
    }
    function readMyFile_create() {
        var file, _var2;
        var me = {
            state: '2',
            type: 'readMyFile'
        };
        function _main_readMyFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '_item2';
                        openFileByPath(unit.currentFilename).then(function (__returnee) {
                            file = __returnee;
                            _main_readMyFile(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '_item2':
                        _var2 = createDiagramResult(file);
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_readMyFile(__resolve, __reject);
            });
        };
        return me;
    }
    function readMyFile() {
        var __obj = readMyFile_create();
        return __obj.run();
    }
    function findDiagram_create(name) {
        var filenames, diagram, _var2, _var3, filename;
        var me = {
            state: '2',
            type: 'findDiagram'
        };
        function _main_findDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        filenames = [
                            name + '.drakon',
                            name + '.free',
                            name + '.graf'
                        ];
                        _var2 = filenames;
                        _var3 = 0;
                        me.state = '9';
                        break;
                    case '9':
                        if (_var3 < _var2.length) {
                            filename = _var2[_var3];
                            me.state = '10';
                            loadKeyValue(filename).then(function (__returnee) {
                                diagram = __returnee;
                                _main_findDiagram(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = undefined;
                            __resolve(undefined);
                            return;
                        }
                    case '10':
                        if (diagram) {
                            me.state = undefined;
                            __resolve(filename);
                            return;
                        } else {
                            _var3++;
                            me.state = '9';
                        }
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_findDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function findDiagram(name) {
        var __obj = findDiagram_create(name);
        return __obj.run();
    }
    function saveMyFileAs_create() {
        var me = {
            state: '2',
            type: 'saveMyFileAs'
        };
        function _main_saveMyFileAs(__resolve, __reject) {
            try {
                core.downloadJson();
                me.state = undefined;
                __resolve(undefined);
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveMyFileAs(__resolve, __reject);
            });
        };
        return me;
    }
    function saveMyFileAs() {
        var __obj = saveMyFileAs_create();
        return __obj.run();
    }
    function createDiagramResult(diagram) {
        var _var2;
        _var2 = JSON.stringify(diagram);
        return { content: _var2 };
    }
    function closeMyFile_create() {
        var me = {
            state: '2',
            type: 'closeMyFile'
        };
        function _main_closeMyFile(__resolve, __reject) {
            try {
                unit.currentFilename = undefined;
                me.state = undefined;
                __resolve({ ok: true });
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_closeMyFile(__resolve, __reject);
            });
        };
        return me;
    }
    function closeMyFile() {
        var __obj = closeMyFile_create();
        return __obj.run();
    }
    function createDiagram_create(type, name, inNewWindow) {
        var diagram, parsed, fullPath, _var2;
        var me = {
            state: '2',
            type: 'createDiagram'
        };
        function _main_createDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        fullPath = name + '.' + type;
                        parsed = core.parsePath(fullPath);
                        diagram = {
                            name: name,
                            items: {},
                            type: type
                        };
                        me.state = '14';
                        saveDiagram(fullPath, diagram).then(function () {
                            _main_createDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '14':
                        unit.currentFilename = fullPath;
                        _var2 = createDiagramResult(diagram);
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_createDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function createDiagram(type, name, inNewWindow) {
        var __obj = createDiagram_create(type, name, inNewWindow);
        return __obj.run();
    }
    function openFile_create() {
        var prompt, accept, upload, parsedFilename, parsed, diagram, jsonString, filename, error, content, _var2, _var3, _var4;
        var __handlerData = undefined, __inHandler = false;
        var me = {
            state: '2',
            type: 'openFile'
        };
        function _main_openFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        core.unfreezeScreen();
                        prompt = tr('Choose a diagram file');
                        accept = '.drakon,.free,.graf';
                        me.state = '203';
                        widgets.uploadFile(prompt, accept, function () {
                        }).then(function (__returnee) {
                            upload = __returnee;
                            _main_openFile(__resolve, __reject);
                        }, function (error) {
                            __handlerData = error;
                            me.state = '119';
                            _main_openFile(__resolve, __reject);
                        });
                        return;
                    case '119':
                        __inHandler = true;
                        error = __handlerData;
                        console.error(error);
                        me.state = undefined;
                        __resolve({ error: error });
                        return;
                    case '171':
                        parsedFilename = dh2common.stripExtension(filename);
                        _var2 = parsedFilename.extension;
                        if (_var2 === 'drakon') {
                            me.state = '198';
                        } else {
                            if (_var2 === 'free') {
                                me.state = '198';
                            } else {
                                if (_var2 === 'graf') {
                                    me.state = '198';
                                } else {
                                    _var3 = translate('Unknown document type');
                                    widgets.showErrorSnack(_var3);
                                    me.state = undefined;
                                    __resolve(undefined);
                                    return;
                                }
                            }
                        }
                        break;
                    case '185':
                        parsed = dh2common.checkDiagram(jsonString);
                        if (parsed.error) {
                            widgets.showErrorSnack(parsed.error);
                            me.state = undefined;
                            __resolve(undefined);
                            return;
                        } else {
                            diagram = parsed.diagram;
                            me.state = '171';
                        }
                        break;
                    case '192':
                        content = JSON.stringify(diagram);
                        me.state = '_item7';
                        saveKeyValue(filename, content).then(function () {
                            _main_openFile(__resolve, __reject);
                        }, function (error) {
                            __handlerData = error;
                            me.state = '119';
                            _main_openFile(__resolve, __reject);
                        });
                        return;
                    case '198':
                        diagram.type = parsedFilename.extension;
                        diagram.name = parsedFilename.name;
                        me.state = '192';
                        break;
                    case '203':
                        console.log(upload);
                        if (upload) {
                            jsonString = upload.data;
                            filename = upload.file.name;
                            me.state = '185';
                        } else {
                            me.state = undefined;
                            __resolve(undefined);
                            return;
                        }
                        break;
                    case '210':
                        me.state = undefined;
                        __resolve(_var4);
                        return;
                    case '_item7':
                        me.state = '210';
                        openFileAt(filename).then(function (__returnee) {
                            _var4 = __returnee;
                            _main_openFile(__resolve, __reject);
                        }, function (error) {
                            __handlerData = error;
                            me.state = '119';
                            _main_openFile(__resolve, __reject);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                if (__inHandler) {
                    me.state = undefined;
                    __reject(ex);
                } else {
                    me.state = '119';
                    __handlerData = ex;
                    _main_openFile(__resolve, __reject);
                }
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_openFile(__resolve, __reject);
            });
        };
        return me;
    }
    function openFile() {
        var __obj = openFile_create();
        return __obj.run();
    }
    function saveAsPng(name, data) {
        var filename;
        filename = name + '.png';
        dh2common.downloadImageDataAsFile(filename, data);
        return;
    }
    function loadUserSettings_create() {
        var _var2;
        var me = {
            state: '2',
            type: 'loadUserSettings'
        };
        function _main_loadUserSettings(__resolve, __reject) {
            try {
                _var2 = loadUserSettingsCore();
                me.state = undefined;
                __resolve(_var2);
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_loadUserSettings(__resolve, __reject);
            });
        };
        return me;
    }
    function loadUserSettings() {
        var __obj = loadUserSettings_create();
        return __obj.run();
    }
    function saveUserSettings_create(settings) {
        var settingsStr, existing;
        var me = {
            state: '2',
            type: 'saveUserSettings'
        };
        function _main_saveUserSettings(__resolve, __reject) {
            try {
                existing = loadUserSettingsCore();
                Object.assign(existing, settings);
                settingsStr = JSON.stringify(existing);
                localStorage.setItem('dprod-user-settings', settingsStr);
                me.state = undefined;
                __resolve({ ok: true });
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveUserSettings(__resolve, __reject);
            });
        };
        return me;
    }
    function saveUserSettings(settings) {
        var __obj = saveUserSettings_create(settings);
        return __obj.run();
    }
    function setClipboard_create(type, obj) {
        var content;
        var me = {
            state: '2',
            type: 'setClipboard'
        };
        function _main_setClipboard(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        content = JSON.stringify(obj);
                        localStorage.setItem('clipboard-type', type);
                        localStorage.setItem('clipboard', content);
                        me.state = '7';
                        setTimeout(function () {
                            _main_setClipboard(__resolve, __reject);
                        }, 10);
                        return;
                    case '7':
                        core.clipboardUpdated(type, obj);
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_setClipboard(__resolve, __reject);
            });
        };
        return me;
    }
    function setClipboard(type, obj) {
        var __obj = setClipboard_create(type, obj);
        return __obj.run();
    }
    function clearRecent_create() {
        var copy, _var2, _var3, item;
        var me = {
            state: '2',
            type: 'clearRecent'
        };
        function _main_clearRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        copy = unit.recent.slice();
                        _var2 = copy;
                        _var3 = 0;
                        me.state = '6';
                        break;
                    case '5':
                        _var3++;
                        me.state = '6';
                        break;
                    case '6':
                        if (_var3 < _var2.length) {
                            item = _var2[_var3];
                            me.state = '5';
                            removeKeyValue(item.path).then(function () {
                                _main_clearRecent(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            unit.recent = [];
                            me.state = '10';
                            saveRecent().then(function () {
                                _main_clearRecent(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                    case '10':
                        sendMessageToChannel('delete_all');
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_clearRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function clearRecent() {
        var __obj = clearRecent_create();
        return __obj.run();
    }
    function getRecent_create() {
        var copy;
        var me = {
            state: '2',
            type: 'getRecent'
        };
        function _main_getRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '5';
                        initRecent().then(function () {
                            _main_getRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        copy = unit.recent.slice();
                        copy.reverse();
                        me.state = undefined;
                        __resolve(copy);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_getRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function getRecent() {
        var __obj = getRecent_create();
        return __obj.run();
    }
    function restartApp() {
        console.log('restartApp');
        location.reload();
        return;
    }
    function setTitle_create(title) {
        var me = {
            state: '2',
            type: 'setTitle'
        };
        function _main_setTitle(__resolve, __reject) {
            try {
                dh2common.setTitle(title);
                me.state = undefined;
                __resolve({ ok: true });
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_setTitle(__resolve, __reject);
            });
        };
        return me;
    }
    function setTitle(title) {
        var __obj = setTitle_create(title);
        return __obj.run();
    }
    function openLink_create(link) {
        var me = {
            state: '2',
            type: 'openLink'
        };
        function _main_openLink(__resolve, __reject) {
            try {
                window.open(link, '_blank');
                me.state = undefined;
                __resolve({ ok: true });
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_openLink(__resolve, __reject);
            });
        };
        return me;
    }
    function openLink(link) {
        var __obj = openLink_create(link);
        return __obj.run();
    }
    function newWindow_create() {
        var url;
        var me = {
            state: '2',
            type: 'newWindow'
        };
        function _main_newWindow(__resolve, __reject) {
            try {
                url = window.location.href;
                window.open(url, '_blank');
                me.state = undefined;
                __resolve({ ok: true });
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_newWindow(__resolve, __reject);
            });
        };
        return me;
    }
    function newWindow() {
        var __obj = newWindow_create();
        return __obj.run();
    }
    function closeWindow_create() {
        var me = {
            state: '2',
            type: 'closeWindow'
        };
        function _main_closeWindow(__resolve, __reject) {
            try {
                window.close();
                me.state = undefined;
                __resolve({ ok: true });
                return;
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_closeWindow(__resolve, __reject);
            });
        };
        return me;
    }
    function closeWindow() {
        var __obj = closeWindow_create();
        return __obj.run();
    }
    function initRecent_create() {
        var recentStr, recent;
        var me = {
            state: '2',
            type: 'initRecent'
        };
        function _main_initRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '4';
                        loadKeyValue('drlauncher-recent').then(function (__returnee) {
                            recentStr = __returnee;
                            _main_initRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        if (recentStr) {
                            recent = JSON.parse(recentStr);
                            me.state = '7';
                        } else {
                            recent = [];
                            me.state = '7';
                        }
                        break;
                    case '7':
                        unit.recent = recent;
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_initRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function initRecent() {
        var __obj = initRecent_create();
        return __obj.run();
    }
    function loadKeyValue_create(key) {
        var _var2;
        var me = {
            state: '2',
            type: 'loadKeyValue'
        };
        function _main_loadKeyValue(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '4';
                        loadStringFromDb(key).then(function (__returnee) {
                            _var2 = __returnee;
                            _main_loadKeyValue(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_loadKeyValue(__resolve, __reject);
            });
        };
        return me;
    }
    function loadKeyValue(key) {
        var __obj = loadKeyValue_create(key);
        return __obj.run();
    }
    function openDb() {
        var request, db2;
        return new Promise(function (resolve, reject) {
            request = indexedDB.open('drakonhub_kv', 1);
            request.onupgradeneeded = function (event) {
                db2 = event.target.result;
                db2.createObjectStore('kv');
            };
            request.onsuccess = function () {
                resolve(request.result);
            };
            request.onerror = function () {
                reject(request.error);
            };
        });
    }
    function removeStringFromDb_create(key) {
        var tx, store, request, db;
        var me = {
            state: '2',
            type: 'removeStringFromDb'
        };
        function _main_removeStringFromDb(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '3';
                        openDb().then(function (__returnee) {
                            db = __returnee;
                            _main_removeStringFromDb(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = undefined;
                        __resolve(new Promise(function (resolve, reject) {
                            tx = db.transaction('kv', 'readwrite');
                            store = tx.objectStore('kv');
                            request = store.delete(key);
                            request.onsuccess = function () {
                                resolve();
                            };
                            request.onerror = function () {
                                reject(request.error);
                            };
                        }));
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_removeStringFromDb(__resolve, __reject);
            });
        };
        return me;
    }
    function removeStringFromDb(key) {
        var __obj = removeStringFromDb_create(key);
        return __obj.run();
    }
    function removeKeyValue_create(key) {
        var me = {
            state: '2',
            type: 'removeKeyValue'
        };
        function _main_removeKeyValue(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        me.state = '1';
                        removeStringFromDb(key).then(function () {
                            _main_removeKeyValue(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_removeKeyValue(__resolve, __reject);
            });
        };
        return me;
    }
    function removeKeyValue(key) {
        var __obj = removeKeyValue_create(key);
        return __obj.run();
    }
    function saveStringToDb_create(key, value) {
        var tx, store, request, db;
        var me = {
            state: '2',
            type: 'saveStringToDb'
        };
        function _main_saveStringToDb(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '3';
                        openDb().then(function (__returnee) {
                            db = __returnee;
                            _main_saveStringToDb(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = undefined;
                        __resolve(new Promise(function (resolve, reject) {
                            tx = db.transaction('kv', 'readwrite');
                            store = tx.objectStore('kv');
                            request = store.put(value, key);
                            request.onsuccess = function () {
                                resolve();
                            };
                            request.onerror = function () {
                                reject(request.error);
                            };
                        }));
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveStringToDb(__resolve, __reject);
            });
        };
        return me;
    }
    function saveStringToDb(key, value) {
        var __obj = saveStringToDb_create(key, value);
        return __obj.run();
    }
    function saveKeyValue_create(key, value) {
        var me = {
            state: '2',
            type: 'saveKeyValue'
        };
        function _main_saveKeyValue(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        me.state = '1';
                        saveStringToDb(key, value).then(function () {
                            _main_saveKeyValue(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveKeyValue(__resolve, __reject);
            });
        };
        return me;
    }
    function saveKeyValue(key, value) {
        var __obj = saveKeyValue_create(key, value);
        return __obj.run();
    }
    function loadStringFromDb_create(key) {
        var tx, store, request, db;
        var me = {
            state: '2',
            type: 'loadStringFromDb'
        };
        function _main_loadStringFromDb(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '3';
                        openDb().then(function (__returnee) {
                            db = __returnee;
                            _main_loadStringFromDb(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = undefined;
                        __resolve(new Promise(function (resolve, reject) {
                            tx = db.transaction('kv', 'readonly');
                            store = tx.objectStore('kv');
                            request = store.get(key);
                            request.onsuccess = function () {
                                resolve(request.result || '');
                            };
                            request.onerror = function () {
                                reject(request.error);
                            };
                        }));
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_loadStringFromDb(__resolve, __reject);
            });
        };
        return me;
    }
    function loadStringFromDb(key) {
        var __obj = loadStringFromDb_create(key);
        return __obj.run();
    }
    function deriveNameFromPath(filepath) {
        var parsed, parts, _var2, _var3;
        parsed = core.parsePath(filepath);
        parts = parsed.filename.split('.');
        if (parts.length === 1) {
            return parsed.filename;
        } else {
            _var3 = parts.slice(0, parts.length - 1);
            _var2 = _var3.join('.');
            return _var2;
        }
    }
    function getUserSettings() {
        return unit.userSettings;
    }
    function loadUserSettingsCore() {
        var settingsStr, settings;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                settingsStr = localStorage.getItem('dprod-user-settings');
                if (settingsStr) {
                    settings = JSON.parse(settingsStr);
                    __state = '7';
                } else {
                    settings = {};
                    __state = '7';
                }
                break;
            case '7':
                if (settings.language) {
                    __state = '9';
                } else {
                    settings.language = gconfig.defaultLanguage;
                    __state = '9';
                }
                break;
            case '9':
                return settings;
            default:
                return;
            }
        }
    }
    function removeFromRecent_create(path) {
        var me = {
            state: '2',
            type: 'removeFromRecent'
        };
        function _main_removeFromRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        utils.removeBy(unit.recent, 'path', path);
                        me.state = '3';
                        removeKeyValue(path).then(function () {
                            _main_removeFromRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = '1';
                        saveRecent().then(function () {
                            _main_removeFromRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_removeFromRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function removeFromRecent(path) {
        var __obj = removeFromRecent_create(path);
        return __obj.run();
    }
    function tr(message) {
        var _var2;
        _var2 = dh2common.translate(message);
        return _var2;
    }
    function showSubmenu(parent, items) {
        var rect, items2;
        rect = parent.getBoundingClientRect();
        items2 = items.map(function (item) {
            return {
                action: function () {
                    core.runMenuItem(item.code);
                },
                text: item.label
            };
        });
        widgets.showContextMenuExact(rect.left, rect.bottom, items2);
        return;
    }
    function addOpenItem(parent, path, target) {
        var container;
        container = widgets.div('grid-item', {
            padding: '10px',
            text: path
        });
        container.addEventListener('click', function () {
            openItemInTarget(target, path);
        });
        parent.appendChild(container);
        return;
    }
    function saveDiagram_create(path, diagram) {
        var _var2;
        var me = {
            state: '2',
            type: 'saveDiagram'
        };
        function _main_saveDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        _var2 = JSON.stringify(diagram);
                        me.state = '10';
                        saveKeyValue(path, _var2).then(function () {
                            _main_saveDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '10':
                        me.state = '11';
                        addToRecent(path).then(function () {
                            _main_saveDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '11':
                        unit.currentFilename = path;
                        sendMessageToChannel('save', path);
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function saveDiagram(path, diagram) {
        var __obj = saveDiagram_create(path, diagram);
        return __obj.run();
    }
    function sendMessageToChannel(type, key) {
        var message;
        message = {
            type: type,
            key: key,
            tabId: unit.tabId
        };
        console.log('sendMessageToChannel', message);
        unit.channel.postMessage(message);
        return;
    }
    function getDiagram_create(filename) {
        var diagram, diagramStr, derived;
        var me = {
            state: '2',
            type: 'getDiagram'
        };
        function _main_getDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '4';
                        loadKeyValue(filename).then(function (__returnee) {
                            diagramStr = __returnee;
                            _main_getDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        diagram = JSON.parse(diagramStr);
                        derived = deriveNameFromPath(filename);
                        diagram.name = derived;
                        diagram.access = 'write';
                        me.state = undefined;
                        __resolve(diagram);
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_getDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function getDiagram(filename) {
        var __obj = getDiagram_create(filename);
        return __obj.run();
    }
    function initTranslations_create() {
        var settings;
        var me = {
            state: '2',
            type: 'initTranslations'
        };
        function _main_initTranslations(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        settings = loadUserSettingsCore();
                        me.state = '1';
                        dh2common.loadStringsForLanguage(settings.language).then(function () {
                            _main_initTranslations(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_initTranslations(__resolve, __reject);
            });
        };
        return me;
    }
    function initTranslations() {
        var __obj = initTranslations_create();
        return __obj.run();
    }
    function openItemInTarget_create(path, target) {
        var diagram;
        var me = {
            state: '2',
            type: 'openItemInTarget'
        };
        function _main_openItemInTarget(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '4';
                        getDiagram(path).then(function (__returnee) {
                            diagram = __returnee;
                            _main_openItemInTarget(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        target.open(diagram);
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_openItemInTarget(__resolve, __reject);
            });
        };
        return me;
    }
    function openItemInTarget(path, target) {
        var __obj = openItemInTarget_create(path, target);
        return __obj.run();
    }
    function openFileByPath_create(filename) {
        var _var2;
        var me = {
            state: '2',
            type: 'openFileByPath'
        };
        function _main_openFileByPath(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '_item2';
                        addToRecent(filename).then(function () {
                            _main_openFileByPath(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '7':
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    case '_item2':
                        me.state = '7';
                        getDiagram(filename).then(function (__returnee) {
                            _var2 = __returnee;
                            _main_openFileByPath(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_openFileByPath(__resolve, __reject);
            });
        };
        return me;
    }
    function openFileByPath(filename) {
        var __obj = openFileByPath_create(filename);
        return __obj.run();
    }
    function initChannel() {
        var _var2, _var3, _var4;
        unit.channel = new BroadcastChannel('drakonhub');
        _var3 = Date.now();
        _var2 = String(_var3);
        _var4 = Math.random();
        unit.tabId = _var2 + '-' + _var4;
        unit.channel.onmessage = onMessage;
        sendMessageToChannel('init');
        return;
    }
    function saveRecent_create() {
        var _var2;
        var me = {
            state: '2',
            type: 'saveRecent'
        };
        function _main_saveRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        _var2 = JSON.stringify(unit.recent);
                        me.state = '1';
                        saveKeyValue('drlauncher-recent', _var2).then(function () {
                            _main_saveRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_saveRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function saveRecent() {
        var __obj = saveRecent_create();
        return __obj.run();
    }
    function createTopMenuItem(parent, item) {
        var container;
        container = div('grid-item', {
            'display': 'inline-block',
            'padding': '10px',
            'text': item.label
        });
        container.addEventListener('click', function () {
            showSubmenu(container, item.submenu);
        });
        html.add(parent, container);
        return;
    }
    function div() {
        var args, properties, _var2;
        args = Array.prototype.slice.call(arguments);
        properties = {};
        _var2 = html.createElement('div', properties, args);
        return _var2;
    }
    function addToRecent_create(path) {
        var item, maxRecent, oldest;
        var me = {
            state: '2',
            type: 'addToRecent'
        };
        function _main_addToRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        maxRecent = 2000;
                        utils.removeBy(unit.recent, 'path', path);
                        item = { path: path };
                        unit.recent.push(item);
                        me.state = '10';
                        break;
                    case '10':
                        if (unit.recent.length > maxRecent) {
                            oldest = unit.recent.shift();
                            me.state = '10';
                            removeKeyValue(oldest.path).then(function () {
                                _main_addToRecent(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '1';
                            saveRecent().then(function () {
                                _main_addToRecent(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_addToRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function addToRecent(path) {
        var __obj = addToRecent_create(path);
        return __obj.run();
    }
    function setLanguage_create(language) {
        var settings;
        var me = {
            state: '2',
            type: 'setLanguage'
        };
        function _main_setLanguage(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '4';
                        dh2common.loadStringsForLanguage(language).then(function () {
                            _main_setLanguage(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        settings = loadUserSettingsCore();
                        dh2common.setLabelsForLanguage(settings, language);
                        saveUserSettings(settings);
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_setLanguage(__resolve, __reject);
            });
        };
        return me;
    }
    function setLanguage(language) {
        var __obj = setLanguage_create(language);
        return __obj.run();
    }
    function onMessage_create(event) {
        var data, diagram;
        var me = {
            state: '2',
            type: 'onMessage'
        };
        function _main_onMessage(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        data = event.data;
                        console.log('onMessage', data);
                        if (data.tabId === unit.tabId) {
                            me.state = '23';
                        } else {
                            if (data.type === 'save') {
                                me.state = '25';
                            } else {
                                if (data.type === 'delete_all') {
                                    me.state = '24';
                                } else {
                                    me.state = '23';
                                }
                            }
                        }
                        break;
                    case '23':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '24':
                        window.location.reload();
                        me.state = '23';
                        break;
                    case '25':
                        if (unit.currentFilename) {
                            if (unit.currentFilename === data.key) {
                                core.reloadDiagram();
                                me.state = '23';
                            } else {
                                me.state = '51';
                                loadKeyValue(unit.currentFilename).then(function (__returnee) {
                                    diagram = __returnee;
                                    _main_onMessage(__resolve, __reject);
                                }, function (error) {
                                    me.state = undefined;
                                    __reject(error);
                                });
                                return;
                            }
                        } else {
                            me.state = '53';
                        }
                        break;
                    case '51':
                        if (diagram) {
                            me.state = '23';
                        } else {
                            me.state = '53';
                        }
                        break;
                    case '53':
                        window.location.reload();
                        me.state = '23';
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                me.state = undefined;
                __reject(ex);
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                _main_onMessage(__resolve, __reject);
            });
        };
        return me;
    }
    function onMessage(event) {
        var __obj = onMessage_create(event);
        return __obj.run();
    }
    unit.main_create = main_create;
    unit.main = main;
    unit.openFileAt_create = openFileAt_create;
    unit.openFileAt = openFileAt;
    unit.getPath_create = getPath_create;
    unit.getPath = getPath;
    unit.saveMyFile_create = saveMyFile_create;
    unit.saveMyFile = saveMyFile;
    unit.confirmRename_create = confirmRename_create;
    unit.confirmRename = confirmRename;
    unit.readMyFile_create = readMyFile_create;
    unit.readMyFile = readMyFile;
    unit.findDiagram_create = findDiagram_create;
    unit.findDiagram = findDiagram;
    unit.saveMyFileAs_create = saveMyFileAs_create;
    unit.saveMyFileAs = saveMyFileAs;
    unit.closeMyFile_create = closeMyFile_create;
    unit.closeMyFile = closeMyFile;
    unit.createDiagram_create = createDiagram_create;
    unit.createDiagram = createDiagram;
    unit.openFile_create = openFile_create;
    unit.openFile = openFile;
    unit.saveAsPng = saveAsPng;
    unit.loadUserSettings_create = loadUserSettings_create;
    unit.loadUserSettings = loadUserSettings;
    unit.saveUserSettings_create = saveUserSettings_create;
    unit.saveUserSettings = saveUserSettings;
    unit.setClipboard_create = setClipboard_create;
    unit.setClipboard = setClipboard;
    unit.clearRecent_create = clearRecent_create;
    unit.clearRecent = clearRecent;
    unit.getRecent_create = getRecent_create;
    unit.getRecent = getRecent;
    unit.restartApp = restartApp;
    unit.setTitle_create = setTitle_create;
    unit.setTitle = setTitle;
    unit.openLink_create = openLink_create;
    unit.openLink = openLink;
    unit.newWindow_create = newWindow_create;
    unit.newWindow = newWindow;
    unit.closeWindow_create = closeWindow_create;
    unit.closeWindow = closeWindow;
    unit.loadKeyValue_create = loadKeyValue_create;
    unit.loadKeyValue = loadKeyValue;
    unit.saveKeyValue_create = saveKeyValue_create;
    unit.saveKeyValue = saveKeyValue;
    unit.setLanguage_create = setLanguage_create;
    unit.setLanguage = setLanguage;
    Object.defineProperty(unit, 'core', {
        get: function () {
            return core;
        },
        set: function (newValue) {
            core = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, 'widgets', {
        get: function () {
            return widgets;
        },
        set: function (newValue) {
            widgets = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, 'utils', {
        get: function () {
            return utils;
        },
        set: function (newValue) {
            utils = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, 'gconfig', {
        get: function () {
            return gconfig;
        },
        set: function (newValue) {
            gconfig = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, 'dh2common', {
        get: function () {
            return dh2common;
        },
        set: function (newValue) {
            dh2common = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, 'html', {
        get: function () {
            return html;
        },
        set: function (newValue) {
            html = newValue;
        },
        enumerable: true,
        configurable: true
    });
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = standalone;
}