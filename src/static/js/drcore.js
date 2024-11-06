function drcore() {
    var unit = {};
    var utils, html, http, drakon_canvas, widgets, drakonhubwidget, gconfig, dh2common, launcher;
    function closeFile_create() {
        var me = {
            state: '2',
            type: 'closeFile'
        };
        function _main_closeFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        widgets.removePopups();
                        launcher.closeMyFile();
                        me.state = '1';
                        toStart().then(function () {
                            _main_closeFile(__resolve, __reject);
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
                _main_closeFile(__resolve, __reject);
            });
        };
        return me;
    }
    function closeFile() {
        var __obj = closeFile_create();
        return __obj.run();
    }
    function saveAsPictureX4() {
        saveAsPictureCore(4);
        return;
    }
    function sendRequestOff() {
    }
    function downloadJson() {
        dh2common.saveAsJson(unit.screens.editor.drakon);
        return;
    }
    function createEditSenderOff(diagram, indicator) {
        var sender;
        sender = EditSenderOff();
        sender.indicator = indicator;
        sender.saveDebouncer = utils.debounceAsync_create(sender.sendOut, 500);
        sender.saveDebouncer.run();
        return sender;
    }
    function EditSenderOff_pushEdit_create(self, edit) {
        var rename, newName, mustConfirm, ok, _var2;
        var me = {
            state: '26',
            type: 'EditSenderOff_pushEdit'
        };
        function _main_EditSenderOff_pushEdit(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        if (newName) {
                            _var2 = getEditorOff();
                            dh2common.redrawWidgetDom(_var2);
                            launcher.setTitle(newName);
                            me.state = '40';
                        } else {
                            me.state = '40';
                        }
                        break;
                    case '24':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '25':
                        me.state = '24';
                        reloadCurrentFile().then(function () {
                            _main_EditSenderOff_pushEdit(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '26':
                        rename = getRenameEdit(edit);
                        if (rename) {
                            newName = rename.fields.name;
                            me.state = '31';
                            launcher.confirmRename(newName).then(function (__returnee) {
                                mustConfirm = __returnee;
                                _main_EditSenderOff_pushEdit(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            newName = undefined;
                            me.state = '2';
                        }
                        break;
                    case '31':
                        if (mustConfirm) {
                            me.state = '45';
                            confirmReplace().then(function (__returnee) {
                                ok = __returnee;
                                _main_EditSenderOff_pushEdit(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '2';
                        }
                        break;
                    case '40':
                        self.indicator.saving();
                        self.saveDebouncer.onInput();
                        me.state = '24';
                        break;
                    case '45':
                        if (ok) {
                            me.state = '2';
                        } else {
                            me.state = '25';
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
                _main_EditSenderOff_pushEdit(__resolve, __reject);
            });
        };
        return me;
    }
    function EditSenderOff_pushEdit(self, edit) {
        var __obj = EditSenderOff_pushEdit_create(self, edit);
        return __obj.run();
    }
    function EditSenderOff_stop(self) {
        self.saveDebouncer.state = undefined;
        return;
    }
    function EditSenderOff_sendOut_create(self) {
        var saved, copy, _var3, _var2, _var4, id, item, _var5;
        var me = {
            state: '2',
            type: 'EditSenderOff_sendOut'
        };
        function _main_EditSenderOff_sendOut(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        copy = utils.deepClone(unit.diagram);
                        if (copy.items) {
                            _var3 = copy.items;
                            _var2 = Object.keys(_var3);
                            _var4 = 0;
                            me.state = '13';
                        } else {
                            me.state = '8';
                        }
                        break;
                    case '5':
                        if (saved) {
                            self.indicator.saved();
                            me.state = '1';
                        } else {
                            _var5 = tr('Could not save diagram');
                            widgets.showErrorSnack(_var5);
                            self.stop();
                            me.state = '1';
                            reloadCurrentFile().then(function () {
                                _main_EditSenderOff_sendOut(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '8':
                        delete copy.access;
                        delete copy.initial;
                        me.state = '5';
                        launcher.saveMyFile(copy).then(function (__returnee) {
                            saved = __returnee;
                            _main_EditSenderOff_sendOut(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '13':
                        if (_var4 < _var2.length) {
                            id = _var2[_var4];
                            item = _var3[id];
                            delete item.id;
                            _var4++;
                            me.state = '13';
                        } else {
                            me.state = '8';
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
                _main_EditSenderOff_sendOut(__resolve, __reject);
            });
        };
        return me;
    }
    function EditSenderOff_sendOut(self) {
        var __obj = EditSenderOff_sendOut_create(self);
        return __obj.run();
    }
    function getRenameEdit(edit) {
        var _var2, _var3, change;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = edit.changes;
                _var3 = 0;
                __state = '5';
                break;
            case '4':
                _var3++;
                __state = '5';
                break;
            case '5':
                if (_var3 < _var2.length) {
                    change = _var2[_var3];
                    if (change.id) {
                        __state = '4';
                    } else {
                        if ('name' in change.fields) {
                            return change;
                        } else {
                            __state = '4';
                        }
                    }
                } else {
                    return undefined;
                }
                break;
            default:
                return;
            }
        }
    }
    function saveAsFile_create() {
        var file;
        var me = {
            state: '2',
            type: 'saveAsFile'
        };
        function _main_saveAsFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        widgets.removePopups();
                        freezeScreen();
                        me.state = '5';
                        launcher.saveMyFileAs().then(function (__returnee) {
                            file = __returnee;
                            _main_saveAsFile(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        unfreezeScreen();
                        toDiagramCore(file);
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
                _main_saveAsFile(__resolve, __reject);
            });
        };
        return me;
    }
    function saveAsFile() {
        var __obj = saveAsFile_create();
        return __obj.run();
    }
    function newWindow() {
        launcher.newWindow();
        return;
    }
    function runMenuItem(role) {
        var action;
        action = unit.menuItems[role];
        action();
        return;
    }
    function startOpenFile_create() {
        var file;
        var me = {
            state: '2',
            type: 'startOpenFile'
        };
        function _main_startOpenFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        widgets.removePopups();
                        freezeScreen();
                        me.state = '4';
                        reloadSettings().then(function () {
                            _main_startOpenFile(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        me.state = '13';
                        launcher.openFile().then(function (__returnee) {
                            file = __returnee;
                            _main_startOpenFile(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '13':
                        unfreezeScreen();
                        toDiagramCore(file);
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
                _main_startOpenFile(__resolve, __reject);
            });
        };
        return me;
    }
    function startOpenFile() {
        var __obj = startOpenFile_create();
        return __obj.run();
    }
    function openRecent_create(path) {
        var file;
        var me = {
            state: '2',
            type: 'openRecent'
        };
        function _main_openRecent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        freezeScreen();
                        me.state = '3';
                        reloadSettings().then(function () {
                            _main_openRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = '7';
                        launcher.openFileAt(path).then(function (__returnee) {
                            file = __returnee;
                            _main_openRecent(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '7':
                        unfreezeScreen();
                        toDiagramCore(file);
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
                _main_openRecent(__resolve, __reject);
            });
        };
        return me;
    }
    function openRecent(path) {
        var __obj = openRecent_create(path);
        return __obj.run();
    }
    function startCreateNew_create() {
        var file, newInfo;
        var me = {
            state: '2',
            type: 'startCreateNew'
        };
        function _main_startCreateNew(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        widgets.closePopup();
                        me.state = '7';
                        inputDiagramTypeName().then(function (__returnee) {
                            newInfo = __returnee;
                            _main_startCreateNew(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = '15';
                        launcher.createDiagram(newInfo.type, newInfo.name, false).then(function (__returnee) {
                            file = __returnee;
                            _main_startCreateNew(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '7':
                        if (newInfo) {
                            freezeScreen();
                            me.state = '3';
                            reloadSettings().then(function () {
                                _main_startCreateNew(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '1';
                        }
                        break;
                    case '15':
                        unfreezeScreen();
                        toDiagramCore(file);
                        me.state = '1';
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
                _main_startCreateNew(__resolve, __reject);
            });
        };
        return me;
    }
    function startCreateNew() {
        var __obj = startCreateNew_create();
        return __obj.run();
    }
    function clipboardUpdated(type, content) {
        unit.clip = {
            type: type,
            content: content
        };
        return;
    }
    function loadForDiagram_create() {
        var _var2;
        var me = {
            state: '2',
            type: 'loadForDiagram'
        };
        function _main_loadForDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '_item2';
                        reloadSettings().then(function () {
                            _main_loadForDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = undefined;
                        __resolve(_var2);
                        return;
                    case '_item2':
                        me.state = '3';
                        launcher.readMyFile().then(function (__returnee) {
                            _var2 = __returnee;
                            _main_loadForDiagram(__resolve, __reject);
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
                _main_loadForDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function loadForDiagram() {
        var __obj = loadForDiagram_create();
        return __obj.run();
    }
    function confirmReplace_create(newName) {
        var ok, _var2, _var3, _var4;
        var me = {
            state: '2',
            type: 'confirmReplace'
        };
        function _main_confirmReplace(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        _var2 = tr('Replace existing file?');
                        _var3 = tr('Replace');
                        _var4 = tr('Cancel');
                        me.state = '3';
                        widgets.criticalQuestion(_var2, _var3, _var4).then(function (__returnee) {
                            ok = __returnee;
                            _main_confirmReplace(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '3':
                        me.state = undefined;
                        __resolve(ok);
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
                _main_confirmReplace(__resolve, __reject);
            });
        };
        return me;
    }
    function confirmReplace(newName) {
        var __obj = confirmReplace_create(newName);
        return __obj.run();
    }
    function initData() {
        unit.globals = {};
        unit.recent = [];
        unit.menuItems = {};
        registerMenuItem('startCreateNew', startCreateNew);
        registerMenuItem('startOpenFile', startOpenFile);
        registerMenuItem('newWindow', newWindow);
        registerMenuItem('editorCreateNew', editorCreateNew);
        registerMenuItem('saveAsFile', saveAsFile);
        registerMenuItem('closeFile', closeFile);
        registerMenuItem('closeWindow', closeWindow);
        registerMenuItem('saveAsPictureX4', saveAsPictureX4);
        registerMenuItem('saveAsPictureX2', saveAsPictureX2);
        registerMenuItem('saveAsPicture', saveAsPicture);
        registerMenuItem('showHowToEdit', showHowToEdit);
        registerMenuItem('showAbout', showAbout);
        return;
    }
    function registerMenuItem(name, fun) {
        unit.menuItems[name] = fun;
        return;
    }
    function registerErrorHandlers() {
        window.addEventListener('error', onError);
        window.addEventListener('unhandledrejection', onRejection);
        return;
    }
    function loadForStart_create() {
        var me = {
            state: '2',
            type: 'loadForStart'
        };
        function _main_loadForStart(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        me.state = '4';
                        reloadSettings().then(function () {
                            _main_loadForStart(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        me.state = '1';
                        launcher.getRecent().then(function (__returnee) {
                            unit.recent = __returnee;
                            _main_loadForStart(__resolve, __reject);
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
                _main_loadForStart(__resolve, __reject);
            });
        };
        return me;
    }
    function loadForStart() {
        var __obj = loadForStart_create();
        return __obj.run();
    }
    function rebuildUi() {
        var root;
        dh2common.removeLoading();
        root = dh2common.createRootElement();
        root.style.position = 'relative';
        root.style.height = '100%';
        html.clear(root);
        unit.rootWidget.redraw(root);
        return;
    }
    function toStart_create() {
        var me = {
            state: '2',
            type: 'toStart'
        };
        function _main_toStart(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        freezeScreen();
                        me.state = '16';
                        loadForStart().then(function () {
                            _main_toStart(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '16':
                        unfreezeScreen();
                        toStartCore();
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
                _main_toStart(__resolve, __reject);
            });
        };
        return me;
    }
    function toStart() {
        var __obj = toStart_create();
        return __obj.run();
    }
    function enrichSettings_create(settings) {
        var strings;
        var me = {
            state: '2',
            type: 'enrichSettings'
        };
        function _main_enrichSettings(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        if (settings.language) {
                            me.state = '9';
                        } else {
                            settings.language = gconfig.defaultLanguage;
                            me.state = '9';
                        }
                        break;
                    case '9':
                        me.state = '10';
                        launcher.loadTranslations(settings.language).then(function (__returnee) {
                            strings = __returnee;
                            _main_enrichSettings(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '10':
                        dh2common.setStrings(strings);
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
                _main_enrichSettings(__resolve, __reject);
            });
        };
        return me;
    }
    function enrichSettings(settings) {
        var __obj = enrichSettings_create(settings);
        return __obj.run();
    }
    function reloadSettings_create() {
        var settings;
        var me = {
            state: '2',
            type: 'reloadSettings'
        };
        function _main_reloadSettings(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '6';
                        launcher.loadUserSettings().then(function (__returnee) {
                            settings = __returnee;
                            _main_reloadSettings(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        unit.settings = settings;
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '6':
                        me.state = '8';
                        enrichSettings(settings).then(function () {
                            _main_reloadSettings(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '8':
                        if (settings.yes) {
                            me.state = '4';
                        } else {
                            dh2common.setLabelsForLanguage(settings, settings.language);
                            me.state = '4';
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
                _main_reloadSettings(__resolve, __reject);
            });
        };
        return me;
    }
    function reloadSettings() {
        var __obj = reloadSettings_create();
        return __obj.run();
    }
    function toDiagram_create() {
        var diagram, _var2;
        var me = {
            state: '2',
            type: 'toDiagram'
        };
        function _main_toDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        dh2common.showWaitBlock();
                        me.state = '11';
                        loadForDiagram().then(function (__returnee) {
                            diagram = __returnee;
                            _main_toDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '11':
                        dh2common.hideWaitBlock();
                        if (diagram) {
                            toDiagramCore(diagram);
                            me.state = '1';
                        } else {
                            _var2 = tr('Could not load diagram');
                            widgets.showErrorSnack(_var2);
                            me.state = '1';
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
                _main_toDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function toDiagram() {
        var __obj = toDiagram_create();
        return __obj.run();
    }
    function toDiagramCore(file) {
        var diagram, parsed, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (file) {
                    if (file.error) {
                        __state = '_item2';
                    } else {
                        parsed = dh2common.checkDiagram(file.content);
                        if (parsed.error) {
                            __state = '_item2';
                        } else {
                            diagram = parsed.diagram;
                            launcher.setTitle(diagram.name);
                            unit.rootWidget.setCurrent('editor');
                            unit.diagram = diagram;
                            unit.screens.editor.setFolder(unit.diagram, unit.settings);
                            __state = '1';
                        }
                    }
                } else {
                    __state = '1';
                }
                break;
            case '_item2':
                _var2 = tr('Could not load diagram');
                widgets.showErrorSnack(_var2);
                __state = '1';
                break;
            default:
                return;
            }
        }
    }
    function createUi() {
        var start, editor, multi, _var2, _var3, _var4;
        unit.screens = {};
        createOffStyles();
        _var2 = StartScreen();
        _var3 = DesktopEditorScreen();
        start = dh2common.createWidget(_var2);
        editor = dh2common.createWidget(_var3);
        unit.screens.start = start;
        unit.screens.editor = editor;
        _var4 = dh2common.MultiWidget();
        multi = dh2common.createWidget(_var4, {
            current: 'start',
            children: unit.screens
        });
        unit.rootWidget = multi;
        return;
    }
    function toStartCore() {
        var start;
        launcher.setTitle(undefined);
        unit.rootWidget.setCurrent('start');
        start = unit.screens.start;
        html.clear(start.container);
        start.redraw(start.container);
        return;
    }
    function inputDiagramTypeName_create() {
        var chosenType, name, evt, _var2, _var3;
        var me = {
            state: '2',
            type: 'inputDiagramTypeName'
        };
        function _main_inputDiagramTypeName(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '6';
                        dh2common.chooseDocumentType().then(function (__returnee) {
                            chosenType = __returnee;
                            _main_inputDiagramTypeName(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        if (chosenType) {
                            evt = chosenType.evt;
                            _var2 = tr('Create document');
                            me.state = '13';
                            widgets.inputBox(evt.clientX, evt.clientY, _var2, '', function (name) {
                                _var3 = dh2common.checkProjectName(name, 250);
                                return _var3;
                            }).then(function (__returnee) {
                                name = __returnee;
                                _main_inputDiagramTypeName(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '15';
                        }
                        break;
                    case '13':
                        if (name) {
                            me.state = undefined;
                            __resolve({
                                type: chosenType.type,
                                name: name
                            });
                            return;
                        } else {
                            me.state = '15';
                        }
                        break;
                    case '15':
                        me.state = undefined;
                        __resolve(undefined);
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
                _main_inputDiagramTypeName(__resolve, __reject);
            });
        };
        return me;
    }
    function inputDiagramTypeName() {
        var __obj = inputDiagramTypeName_create();
        return __obj.run();
    }
    function reloadCurrentFile_create() {
        var file;
        var me = {
            state: '2',
            type: 'reloadCurrentFile'
        };
        function _main_reloadCurrentFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        freezeScreen();
                        me.state = '9';
                        launcher.readMyFile().then(function (__returnee) {
                            file = __returnee;
                            _main_reloadCurrentFile(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '9':
                        unfreezeScreen();
                        toDiagramCore(file);
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
                _main_reloadCurrentFile(__resolve, __reject);
            });
        };
        return me;
    }
    function reloadCurrentFile() {
        var __obj = reloadCurrentFile_create();
        return __obj.run();
    }
    function start_create() {
        var file, path, _var2;
        var me = {
            state: '2',
            type: 'start'
        };
        function _main_start(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        initData();
                        gconfig.main();
                        dh2common.main();
                        dh2common.createSpecialStyles();
                        widgets.init(tr);
                        createUi();
                        registerErrorHandlers();
                        dh2common.initShortcuts({
                            getWidget: getDrakonWidgetOff,
                            isDrakon: isDrakonOff,
                            isReadonly: isReadonlyOff
                        });
                        me.state = '21';
                        launcher.getPath().then(function (__returnee) {
                            path = __returnee;
                            _main_start(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '19':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '20':
                        me.state = '32';
                        loadForDiagram().then(function (__returnee) {
                            file = __returnee;
                            _main_start(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '21':
                        if (path) {
                            me.state = '20';
                        } else {
                            me.state = '22';
                        }
                        break;
                    case '22':
                        me.state = '28';
                        loadForStart().then(function () {
                            _main_start(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '28':
                        rebuildUi();
                        toStartCore();
                        me.state = '19';
                        break;
                    case '32':
                        if (file.error) {
                            _var2 = tr('Could not load diagram');
                            widgets.showErrorSnack(_var2);
                            me.state = '22';
                        } else {
                            rebuildUi();
                            toDiagramCore(file);
                            me.state = '19';
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
                _main_start(__resolve, __reject);
            });
        };
        return me;
    }
    function start() {
        var __obj = start_create();
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
                        me.state = '9';
                        launcher.loadUserSettings().then(function (__returnee) {
                            settings = __returnee;
                            _main_setLanguage(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '9':
                        settings.language = language;
                        settings.yes = undefined;
                        settings.no = undefined;
                        settings.end = undefined;
                        settings.branch = undefined;
                        settings.exit = undefined;
                        me.state = '12';
                        enrichSettings(settings).then(function () {
                            _main_setLanguage(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '10':
                        toStartCore();
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '12':
                        dh2common.setLabelsForLanguage(settings, settings.language);
                        unit.settings = settings;
                        me.state = '10';
                        launcher.saveUserSettings(settings).then(function () {
                            _main_setLanguage(__resolve, __reject);
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
                _main_setLanguage(__resolve, __reject);
            });
        };
        return me;
    }
    function setLanguage(language) {
        var __obj = setLanguage_create(language);
        return __obj.run();
    }
    function clearRecentList_create() {
        var me = {
            state: '2',
            type: 'clearRecentList'
        };
        function _main_clearRecentList(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        freezeScreen();
                        me.state = '7';
                        launcher.clearRecent().then(function () {
                            _main_clearRecentList(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '7':
                        me.state = '9';
                        loadForStart().then(function () {
                            _main_clearRecentList(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '9':
                        unfreezeScreen();
                        toStartCore();
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
                _main_clearRecentList(__resolve, __reject);
            });
        };
        return me;
    }
    function clearRecentList() {
        var __obj = clearRecentList_create();
        return __obj.run();
    }
    function editorCreateNew_create() {
        var file, newInfo;
        var me = {
            state: '2',
            type: 'editorCreateNew'
        };
        function _main_editorCreateNew(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        me.state = '17';
                        inputDiagramTypeName().then(function (__returnee) {
                            newInfo = __returnee;
                            _main_editorCreateNew(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '16':
                        me.state = '21';
                        launcher.createDiagram(newInfo.type, newInfo.name, true).then(function (__returnee) {
                            file = __returnee;
                            _main_editorCreateNew(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '17':
                        if (newInfo) {
                            freezeScreen();
                            me.state = '16';
                            reloadSettings().then(function () {
                                _main_editorCreateNew(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '1';
                        }
                        break;
                    case '21':
                        unfreezeScreen();
                        toDiagramCore(file);
                        me.state = '1';
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
                _main_editorCreateNew(__resolve, __reject);
            });
        };
        return me;
    }
    function editorCreateNew() {
        var __obj = editorCreateNew_create();
        return __obj.run();
    }
    function closeWindow() {
        launcher.closeWindow();
        return;
    }
    function panic(ex) {
        var main, central, _var2, _var3, _var4, _var5, _var6;
        console.error(ex);
        main = html.get('main');
        html.clear(main);
        _var3 = tr('An error has occurred');
        _var2 = div('header1', { text: _var3 });
        _var6 = tr('Ok');
        _var5 = widgets.createDefaultButton(_var6, launcher.restartApp);
        _var4 = div({
            'padding-top': '20px',
            'text-align': 'center'
        }, _var5);
        central = div('middle', _var2, _var4);
        html.add(main, central);
        return;
    }
    function trace(name, value) {
        var _var2;
        _var2 = dh2common.trace(name, value);
        return _var2;
    }
    function registerEvent(element, eventName, action, options) {
        var _var2;
        _var2 = dh2common.registerEvent(element, eventName, action, options);
        return _var2;
    }
    function setTimeout(action, delay, notrace) {
        var _var2;
        _var2 = dh2common.setTimeout(action, delay, notrace);
        return _var2;
    }
    function initContextMenus() {
        registerEvent(document, 'contextmenu', onGlobalContextMenu, true);
        return;
    }
    function onGlobalContextMenu(evt) {
        console.log(evt, evt.target);
        return;
    }
    function onError(evt) {
        panic(evt.error);
        return;
    }
    function onRejection(evt) {
        evt.preventDefault();
        panic(evt.reason);
        return;
    }
    function setCachedClipboard(type, content) {
        unit.clip = {
            type: type,
            content: content
        };
        launcher.setClipboard(type, content);
        return;
    }
    function getCachedClipboard() {
        return unit.clip;
    }
    function tr(text) {
        var _var2;
        _var2 = dh2common.translate(text);
        return _var2;
    }
    function hitInsertionLink(pos, prim) {
        var padding, _var2;
        padding = 10;
        _var2 = hitBox(pos, prim.diagramLeft + padding * 2, prim.diagramTop + padding, prim.diagramWidth - padding * 4, prim.diagramHeight - padding * 2);
        return _var2;
    }
    function hitLinkArea(pos, prim) {
        var width, _var2;
        width = 50;
        _var2 = hitBox(pos, prim.diagramLeft, prim.diagramTop, width, prim.diagramHeight);
        return _var2;
    }
    function getCursorForItemOff(prim, pos, evt) {
        var link, nothing, _var2;
        link = function () {
            return 'pointer';
        };
        nothing = function () {
            return 'grab';
        };
        _var2 = runMouseAction(prim, pos, link, link, nothing);
        return _var2;
    }
    function onItemClickOff(widget, prim, pos, evt) {
        var link, nothing, insertion, id, _var2, _var3;
        link = function (prim) {
            launcher.openLink(prim.link);
        };
        id = widget.folderId;
        insertion = function (prim) {
            _var3 = openInsertion(prim, id);
            return _var3;
        };
        nothing = function () {
        };
        _var2 = runMouseAction(prim, pos, link, insertion, nothing);
        return _var2;
    }
    function hitBox(pos, left, top, width, height) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (pos.x >= left) {
                    if (pos.x < left + width) {
                        if (pos.y >= top) {
                            if (pos.y < top + height) {
                                return true;
                            } else {
                                __state = '8';
                            }
                        } else {
                            __state = '8';
                        }
                    } else {
                        __state = '8';
                    }
                } else {
                    __state = '8';
                }
                break;
            case '8':
                return false;
            default:
                return;
            }
        }
    }
    function runMouseAction(prim, pos, link, insertion, nothing) {
        var _var2, _var3, _var4, _var5, _var6, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (prim.link) {
                    _var3 = hitLinkArea(pos, prim);
                    if (_var3) {
                        _var2 = link(prim);
                        return _var2;
                    } else {
                        _var5 = nothing();
                        return _var5;
                    }
                } else {
                    if (prim.type === 'insertion') {
                        if (prim.content) {
                            _var4 = hitInsertionLink(pos, prim);
                            if (_var4) {
                                _var7 = insertion(prim);
                                return _var7;
                            } else {
                                __state = '_item6';
                            }
                        } else {
                            __state = '_item6';
                        }
                    } else {
                        __state = '_item6';
                    }
                }
                break;
            case '_item6':
                _var6 = nothing();
                return _var6;
            default:
                return;
            }
        }
    }
    function openInsertion_create(prim, id) {
        var message, path, name, _var2;
        var me = {
            state: '2',
            type: 'openInsertion'
        };
        function _main_openInsertion(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        name = dh2common.stripTags(prim.content);
                        if (name) {
                            me.state = '11';
                            launcher.findDiagram(name).then(function (__returnee) {
                                path = __returnee;
                                _main_openInsertion(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            me.state = '1';
                        }
                        break;
                    case '11':
                        if (path) {
                            me.state = '1';
                            launcher.openFileAt(path, true).then(function () {
                                _main_openInsertion(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            _var2 = tr('Diagram not found');
                            message = _var2 + ': ' + name;
                            widgets.showErrorSnack(message);
                            me.state = '1';
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
                _main_openInsertion(__resolve, __reject);
            });
        };
        return me;
    }
    function openInsertion(prim, id) {
        var __obj = openInsertion_create(prim, id);
        return __obj.run();
    }
    function img(src, className) {
        var _var2;
        className = className || '';
        _var2 = html.createElement('img', {
            src: src,
            draggable: false
        }, [className]);
        return _var2;
    }
    function getHowToDrakonVideoUrl() {
        var _var2;
        _var2 = getUrlSource();
        return 'https://drakonpro.ru/ru/video-kak-redaktirovat-diagrammy-v-drakonpro' + _var2;
    }
    function parsePath(path) {
        var parts, folderParts, filename, folder, separator;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                parts = path.split('/');
                if (parts.length === 1) {
                    separator = '\\';
                    parts = path.split('\\');
                    __state = '7';
                } else {
                    separator = '/';
                    __state = '7';
                }
                break;
            case '7':
                folderParts = parts.slice(0, parts.length - 1);
                filename = parts[parts.length - 1];
                folder = folderParts.join(separator);
                return {
                    filename: filename,
                    folder: folder
                };
            default:
                return;
            }
        }
    }
    function createButton100(text, action) {
        var button;
        button = widgets.createSimpleButton(text, action);
        button.style.display = 'block';
        button.style.margin = '0px';
        button.style.marginBottom = '10px';
        return button;
    }
    function openLink(link) {
        launcher.openLink(link);
        return;
    }
    function getDrakonProUrl() {
        var _var2, _var3;
        _var3 = isDPro();
        if (_var3) {
            _var2 = getUrlSource();
            return 'https://' + gconfig.motherSite + '/' + _var2;
        } else {
            return 'https://github.com/stepan-mitkin/drakonhub_desktop';
        }
    }
    function span(text, className) {
        var span;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                span = document.createElement('span');
                html.setText(span, text);
                if (className) {
                    span.className = className;
                    __state = '7';
                } else {
                    __state = '7';
                }
                break;
            case '7':
                return span;
            default:
                return;
            }
        }
    }
    function div() {
        var args, properties, _var2;
        args = Array.prototype.slice.call(arguments);
        properties = {};
        _var2 = html.createElement('div', properties, args);
        return _var2;
    }
    function getAppVersion() {
        return '2024.11.06';
    }
    function getUrlSource() {
        return '?source=dpro-desktop';
    }
    function isDPro() {
        return gconfig.motherSite === 'drakonpro.ru';
    }
    function getEditorOff() {
        return unit.screens.editor.drakon;
    }
    function createDefButton100(text, action) {
        var button;
        button = widgets.createDefaultButton(text, action);
        button.style.display = 'block';
        button.style.margin = '0px';
        button.style.marginBottom = '10px';
        return button;
    }
    function createHelpItems() {
        var result, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = tr('About');
                result = [{
                        label: _var2 + ' ' + gconfig.appName,
                        code: 'showAbout'
                    }];
                if (gconfig.showLearn) {
                    result.unshift({
                        label: 'Как редактировать дракон-схемы',
                        code: 'showHowToEdit'
                    });
                    __state = '7';
                } else {
                    __state = '7';
                }
                break;
            case '7':
                return result;
            default:
                return;
            }
        }
    }
    function getDrakonWidgetOff() {
        return unit.screens.editor.drakon;
    }
    function setStartMenu() {
        var file, menu, help, _var2, _var3, _var4, _var5, _var6;
        _var2 = tr('New diagram');
        _var3 = tr('Open file');
        _var4 = tr('Close window');
        file = [
            {
                label: _var2 + '...',
                code: 'startCreateNew'
            },
            {
                label: _var3 + '...',
                code: 'startOpenFile'
            },
            { type: 'separator' },
            {
                label: _var4,
                code: 'closeWindow'
            }
        ];
        help = createHelpItems();
        _var5 = tr('File');
        _var6 = tr('Help');
        menu = [
            {
                label: _var5,
                submenu: file
            },
            {
                label: _var6,
                submenu: help
            }
        ];
        launcher.setMenu(menu);
        return;
    }
    function isDrakonOff() {
        return unit.rootWidget.current === 'editor';
    }
    function setFileMenu() {
        var file, menu, help, exp, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13;
        _var2 = tr('New window');
        _var3 = tr('New diagram');
        _var4 = tr('Open file');
        _var5 = tr('Save as');
        _var6 = tr('Close file');
        _var7 = tr('Close window');
        file = [
            {
                label: _var2,
                code: 'newWindow'
            },
            {
                label: _var3 + '...',
                code: 'editorCreateNew'
            },
            {
                label: _var4 + '...',
                code: 'startOpenFile'
            },
            {
                label: _var5 + '...',
                code: 'saveAsFile'
            },
            {
                label: _var6,
                code: 'closeFile'
            },
            { type: 'separator' },
            {
                label: _var7,
                code: 'closeWindow'
            }
        ];
        _var11 = tr('Save as picture');
        _var12 = tr('Save as picture');
        _var13 = tr('Save as picture');
        exp = [
            {
                label: _var11 + ' \xD74...',
                code: 'saveAsPictureX4'
            },
            {
                label: _var12 + ' \xD72...',
                code: 'saveAsPictureX2'
            },
            { type: 'separator' },
            {
                label: _var13 + '...',
                code: 'saveAsPicture'
            }
        ];
        help = createHelpItems();
        _var8 = tr('File');
        _var9 = tr('Export');
        _var10 = tr('Help');
        menu = [
            {
                label: _var8,
                submenu: file
            },
            {
                label: _var9,
                submenu: exp
            },
            {
                label: _var10,
                submenu: help
            }
        ];
        launcher.setMenu(menu);
        return;
    }
    function isReadonlyOff() {
        var widget;
        widget = getDrakonWidgetOff();
        if (widget.diagram) {
            return widget.diagram.access === 'read';
        } else {
            return true;
        }
    }
    function saveAsPictureCore(zoom) {
        var exported, widget;
        widget = getDrakonWidgetOff();
        exported = widget.exportImage(zoom, '');
        launcher.saveAsPng(exported.name, exported.image);
        return;
    }
    function saveAsPicture() {
        saveAsPictureCore(1);
        return;
    }
    function saveAsPictureX2() {
        saveAsPictureCore(2);
        return;
    }
    function reloadDiagram() {
        reloadCurrentFile();
        return;
    }
    function addRecentItem(parent, item) {
        var filename, folder, container, parsed, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                parsed = parsePath(item.path);
                filename = parsed.filename;
                folder = parsed.folder;
                __state = '13';
                break;
            case '12':
                registerEvent(container, 'click', function () {
                    openRecent(item.path);
                });
                return;
            case '13':
                container = div('start-recent-container');
                html.add(parent, container);
                if (folder) {
                    _var2 = div('start-recent-folder', { text: folder });
                    html.add(container, _var2);
                    __state = '_item3';
                } else {
                    __state = '_item3';
                }
                break;
            case '_item3':
                _var3 = div('start-recent-file', { text: filename });
                html.add(container, _var3);
                __state = '12';
                break;
            default:
                return;
            }
        }
    }
    function createLogoLink(language) {
        var logo, title, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (gconfig.motherSite === 'drakonpro.ru') {
                    if (language === 'ru') {
                        logo = dh2common.ipath('dro-text-logo-120-ru.png');
                        __state = '5';
                    } else {
                        logo = dh2common.ipath('dro-text-logo-120-en.png');
                        __state = '5';
                    }
                } else {
                    logo = dh2common.ipath('drakosha98b-wide.png');
                    __state = '5';
                }
                break;
            case '5':
                title = img(logo);
                title.style.display = 'inline-block';
                title.style.height = '60px';
                title.style.verticalAlign = 'bottom';
                title.style.cursor = 'pointer';
                registerEvent(title, 'click', function () {
                    _var2 = getDrakonProUrl();
                    openLink(_var2);
                });
                return title;
            default:
                return;
            }
        }
    }
    function createUrlButton(parent, url, title) {
        var video, _var2;
        _var2 = div('start-recent-file', { text: title });
        video = div('start-recent-container', _var2);
        registerEvent(video, 'click', function () {
            launcher.openLink(url);
        });
        html.add(parent, video);
        return;
    }
    function StartScreen_redraw(self, container) {
        var start, recent, learn, recentItems, recentList, contentLeft, contentRight, content, dpro, label, langCont, ver, settings, title, header, languageOption, _var2, _var3, item, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14, _var15, _var16, _var17, _var18, _var19, _var20, _var21, _var22, _var23, _var24, _var25, _var26, _var27, _var28, _var29, _var30, _var31, _var32;
        var __state = '36';
        while (true) {
            switch (__state) {
            case '2':
                title = createLogoLink(settings.language);
                header = div('start-section', { 'text-align': 'center' }, title);
                if (dpro) {
                    if (settings.language === 'ru') {
                        _var5 = span('ПРО', 'pro');
                        _var6 = span('ЦЕСС ');
                        _var7 = span('ПРО', 'pro');
                        _var8 = span('ГРАММА ');
                        _var9 = span('ПРО', 'pro');
                        _var10 = span('ДУКТ');
                        _var4 = div('slogan', _var5, _var6, _var7, _var8, _var9, _var10);
                        html.add(header, _var4);
                        __state = '6';
                    } else {
                        _var27 = span('PRO', 'pro');
                        _var28 = span('CESS ');
                        _var29 = span('PRO', 'pro');
                        _var30 = span('GRAM ');
                        _var31 = span('PRO', 'pro');
                        _var32 = span('DUCT');
                        _var26 = div('slogan', _var27, _var28, _var29, _var30, _var31, _var32);
                        html.add(header, _var26);
                        __state = '6';
                    }
                } else {
                    __state = '6';
                }
                break;
            case '6':
                html.add(contentLeft, header);
                __state = '47';
                break;
            case '11':
                html.add(container, content);
                return;
            case '12':
                _var12 = tr('Start');
                _var11 = div({ text: _var12 }, 'start-header');
                _var14 = tr('New diagram');
                _var13 = createDefButton100(_var14 + '...', startCreateNew);
                _var16 = tr('Open file');
                _var15 = createButton100(_var16 + '...', startOpenFile);
                start = div('start-section', _var11, _var13, _var15);
                html.add(contentLeft, start);
                __state = '27';
                break;
            case '16':
                recentItems = unit.recent;
                if (recentItems.length === 0) {
                    __state = '41';
                } else {
                    recentList = div();
                    _var2 = recentItems;
                    _var3 = 0;
                    __state = '24';
                }
                break;
            case '24':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    addRecentItem(recentList, item);
                    _var3++;
                    __state = '24';
                } else {
                    _var18 = tr('Recent');
                    _var17 = div({ text: _var18 }, 'start-header');
                    _var20 = tr('Clear recent');
                    _var19 = createButton100(_var20, clearRecentList);
                    recent = div('start-section', _var17, _var19, recentList);
                    html.add(contentRight, recent);
                    __state = '41';
                }
                break;
            case '27':
                if (gconfig.showLearn) {
                    _var22 = tr('Learn');
                    _var21 = div({ text: _var22 }, 'start-header');
                    learn = div('start-section', _var21);
                    _var23 = getHowToDrakonVideoUrl();
                    createUrlButton(learn, _var23, 'Видео \u2014 как редактировать дракон-схемы в ДРАКОНПРО');
                    html.add(contentLeft, learn);
                    __state = '16';
                } else {
                    __state = '16';
                }
                break;
            case '36':
                dpro = isDPro();
                settings = unit.settings;
                self.container = container;
                content = div('start-content');
                contentLeft = div('start-content-column');
                contentRight = div('start-content-column');
                html.add(content, contentLeft);
                html.add(content, contentRight);
                __state = '2';
                break;
            case '41':
                if (dpro) {
                    dpro = div('drakonpro-link', { text: gconfig.motherSite });
                    registerEvent(dpro, 'click', function () {
                        _var24 = getDrakonProUrl();
                        launcher.openLink(_var24);
                    });
                    html.add(container, dpro);
                    __state = '61';
                } else {
                    __state = '61';
                }
                break;
            case '47':
                langCont = div({ padding: '5px' });
                languageOption = html.createElement('select');
                languageOption.style.padding = '5px';
                if (dpro) {
                    label = div({
                        padding: '5px',
                        display: 'inline-block',
                        text: 'Язык/Language'
                    });
                    html.addOption(languageOption, 'ru', 'Русский');
                    html.addOption(languageOption, 'en-us', 'English');
                    __state = '57';
                } else {
                    label = div({
                        padding: '5px',
                        display: 'inline-block',
                        text: 'Language'
                    });
                    html.addOption(languageOption, 'en-us', 'English');
                    html.addOption(languageOption, 'ru', 'Русский');
                    __state = '57';
                }
                break;
            case '57':
                languageOption.value = settings.language;
                languageOption.addEventListener('change', function () {
                    setLanguage(languageOption.value);
                });
                html.add(langCont, label);
                html.add(langCont, languageOption);
                html.add(container, langCont);
                __state = '12';
                break;
            case '61':
                _var25 = getAppVersion();
                ver = div({
                    'display': 'inline-block',
                    'padding': '5px',
                    'position': 'fixed',
                    'right': '0px',
                    'top': '0px',
                    'text': 'v ' + _var25
                });
                html.add(container, ver);
                __state = '11';
                break;
            default:
                return;
            }
        }
    }
    function createOffStyles() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                html.addClass('.slogan', 'padding-top: 10px', 'color: #505050', 'font-weight: bold');
                html.addClass('.pro', 'color: green');
                html.addClass('.start-content', 'width: 850px', 'height: calc(100% - 40px)', 'margin: auto', 'overflow: auto', 'max-width: 100%');
                html.addClass('.start-content-column', 'display: inline-block', 'width: 400px', 'max-width: 100%', 'vertical-align: top');
                html.addClass('.start-section', 'padding: 20px', 'display: inline-block', 'width: 400px', 'max-width: 100%');
                html.addClass('.start-header', 'font-weight: bold', 'margin-bottom: 10px');
                html.addClass('.start-recent-container', 'padding: 10px', 'cursor: pointer');
                html.addClass('.start-recent-container:hover', 'background: #9fd694');
                html.addClass('.start-recent-folder', 'color: #909090');
                html.addClass('.start-recent-file', 'color: black', 'font-weight: bold', 'padding-top: 3px');
                html.addClass('.drakonpro-link', 'color: darkgreen', 'font-weight: bold', 'padding: 10px', 'display: inline-block', 'position: absolute', 'right: 0px', 'top: 0px', 'cursor: pointer', 'font-size: 20px');
                __state = '15';
                break;
            case '14':
                return;
            case '15':
                __state = '14';
                break;
            default:
                return;
            }
        }
    }
    function showHowToEdit() {
        var _var2;
        _var2 = getHowToDrakonVideoUrl();
        launcher.openLink(_var2);
        return;
    }
    function showAbout() {
        var dialog, title, ver, dpro, _var2, _var3, _var4, _var5, _var6, _var7, _var8;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                console.log('showAbout');
                dialog = widgets.createMiddleWindow();
                title = createLogoLink();
                _var2 = div({ 'text-align': 'center' }, title);
                html.add(dialog, _var2);
                _var6 = getAppVersion();
                ver = div({
                    'padding': '5px',
                    'text': 'v ' + _var6
                });
                html.add(dialog, ver);
                _var8 = isDPro();
                if (_var8) {
                    dpro = div('drakonpro-link', {
                        text: gconfig.motherSite,
                        'display': 'block',
                        'position': 'static'
                    });
                    registerEvent(dpro, 'click', function () {
                        _var7 = getDrakonProUrl();
                        launcher.openLink(_var7);
                    });
                    html.add(dialog, dpro);
                    __state = '_item3';
                } else {
                    __state = '_item3';
                }
                break;
            case '_item3':
                _var5 = tr('Close');
                _var4 = widgets.createSimpleButton(_var5, widgets.removeQuestions);
                _var3 = widgets.div({
                    'padding': '10px',
                    'padding-top': '40px'
                }, _var4);
                html.add(dialog, _var3);
                return;
            default:
                return;
            }
        }
    }
    function DesktopEditorScreen_init(self) {
        var _var2, _var3;
        _var2 = drakonhubwidget.DrakonHubWidget();
        _var3 = createConfigOff(self);
        self.drakon = dh2common.createWidget(_var2, _var3);
        dh2common.subscribeOnResize(self.drakon.onResize);
        return;
    }
    function DesktopEditorScreen_onChange(self, change) {
        var _var2, _var3, changeItem;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (change.op === 'update') {
                    _var2 = change.items;
                    _var3 = 0;
                    __state = '5';
                } else {
                    __state = '1';
                }
                break;
            case '5':
                if (_var3 < _var2.length) {
                    changeItem = _var2[_var3];
                    if (changeItem.id === self.folderId) {
                        if ('name' in changeItem) {
                            launcher.setTitle(changeItem.name);
                            __state = '1';
                        } else {
                            __state = '6';
                        }
                    } else {
                        __state = '6';
                    }
                } else {
                    __state = '1';
                }
                break;
            case '6':
                _var3++;
                __state = '5';
                break;
            default:
                return;
            }
        }
    }
    function DesktopEditorScreen_setFolder(self, folder, userSettings) {
        folder.id = folder.name + '.' + folder.type;
        self.drakon.setDiagram(folder, userSettings);
        return;
    }
    function DesktopEditorScreen_showItem(self, itemId) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (itemId) {
                    if (self.client.current === 'drakon') {
                        self.drakon.showItem(itemId);
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                } else {
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function showContextMenuOff(widget, x, y, items, prim) {
        items.forEach(dh2common.removeTagsFromRedirect);
        widgets.showContextMenu(x, y, items);
        return;
    }
    function showTryExportOptions(widget, evt) {
        var items, rect, _var2, _var3, _var4, _var5;
        items = [];
        _var2 = tr('Export to diagram file');
        items.push({
            text: _var2,
            action: function () {
                dh2common.saveAsJson(widget.drakon);
            }
        });
        items.push({ type: 'separator' });
        _var3 = tr('Save as picture');
        items.push({
            text: _var3 + ' \xD74',
            action: function () {
                dh2common.saveAsPng(widget.drakon, 4);
            }
        });
        _var5 = tr('Save as picture');
        items.push({
            text: _var5 + ' \xD72',
            action: function () {
                dh2common.saveAsPng(widget.drakon, 2);
            }
        });
        items.push({ type: 'separator' });
        _var4 = tr('Save as picture');
        items.push({
            text: _var4,
            action: function () {
                dh2common.saveAsPng(widget.drakon, 1);
            }
        });
        rect = evt.target.getBoundingClientRect();
        widgets.showContextMenuExact(rect.left, rect.bottom, items);
        return;
    }
    function showDesktopMainMenu_create(widget) {
        var client, createNew, items, divTopButtons, recentItems, ritems, fitems, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14, _var15;
        var me = {
            state: '2',
            type: 'showDesktopMainMenu'
        };
        function _main_showDesktopMainMenu(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '5';
                        loadForStart().then(function () {
                            _main_showDesktopMainMenu(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        client = div();
                        divTopButtons = div();
                        divTopButtons.style.paddingLeft = '5px';
                        html.add(client, divTopButtons);
                        _var2 = tr('New diagram');
                        createNew = createDefButton100(_var2 + '...', startCreateNew);
                        html.add(divTopButtons, createNew);
                        me.state = '33';
                        break;
                    case '8':
                        dh2common.showMainMenu(client);
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '9':
                        items = [];
                        _var3 = tr('Save as picture');
                        items.push([
                            _var3,
                            saveAsPicture
                        ]);
                        _var4 = tr('Save as picture');
                        items.push([
                            _var4 + ' \xD72',
                            saveAsPictureX2
                        ]);
                        _var5 = tr('Save as picture');
                        items.push([
                            _var5 + ' \xD74',
                            saveAsPictureX4
                        ]);
                        items.push('separator');
                        _var6 = tr('About');
                        items.push([
                            _var6 + ' ' + gconfig.appName,
                            showAbout
                        ]);
                        _var8 = tr('Export');
                        _var7 = dh2common.createMenuSection(_var8, items);
                        addAsBlock(client, _var7);
                        me.state = '23';
                        break;
                    case '23':
                        recentItems = unit.recent;
                        if (recentItems.length === 0) {
                            me.state = '8';
                        } else {
                            ritems = recentItems.map(recentToMenu);
                            _var10 = tr('Recent');
                            _var9 = dh2common.createMenuSection(_var10, ritems);
                            addAsBlock(client, _var9);
                            me.state = '8';
                        }
                        break;
                    case '33':
                        fitems = [];
                        _var11 = tr('New window');
                        fitems.push([
                            _var11,
                            newWindow
                        ]);
                        _var12 = tr('Open file');
                        fitems.push([
                            _var12 + '...',
                            startOpenFile
                        ]);
                        _var13 = tr('Save as');
                        fitems.push([
                            _var13 + '...',
                            saveAsFile
                        ]);
                        _var15 = tr('File');
                        _var14 = dh2common.createMenuSection(_var15, fitems);
                        addAsBlock(client, _var14);
                        me.state = '9';
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
                _main_showDesktopMainMenu(__resolve, __reject);
            });
        };
        return me;
    }
    function showDesktopMainMenu(widget) {
        var __obj = showDesktopMainMenu_create(widget);
        return __obj.run();
    }
    function addAsBlock(container, element) {
        element.style.display = 'block';
        html.add(container, element);
        return;
    }
    function recentToMenu(item) {
        var filename, parsed;
        parsed = parsePath(item.path);
        filename = parsed.filename;
        return [
            filename,
            function () {
                openRecent(item.path);
            }
        ];
    }
    function makeMainMenuButtonInfo(widget) {
        var buttonImage, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = isDPro();
                if (_var2) {
                    buttonImage = dh2common.ipath('start_menu_dpro.png');
                    __state = '3';
                } else {
                    buttonImage = dh2common.ipath('start_menu_drakosha.png');
                    __state = '3';
                }
                break;
            case '3':
                return {
                    image: buttonImage,
                    callback: function () {
                        showDesktopMainMenu(widget);
                    },
                    tooltip: 'Open menu'
                };
            default:
                return;
            }
        }
    }
    function createConfigOff(widget) {
        var watermark, _var2, _var3, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var5 = isDPro();
                if (_var5) {
                    watermark = gconfig.watermark;
                    __state = '_item2';
                } else {
                    watermark = '';
                    __state = '_item2';
                }
                break;
            case '_item2':
                _var2 = dh2common.ipath('');
                _var3 = makeMainMenuButtonInfo(widget);
                return {
                    showUndo: true,
                    imagePath: _var2,
                    saveUserSettings: launcher.saveUserSettings,
                    sendRequest: sendRequestOff,
                    createEditSender: createEditSenderOff,
                    loadFonts: dh2common.loadFonts,
                    getClipboard: getCachedClipboard,
                    setClipboard: setCachedClipboard,
                    watermark: watermark,
                    editorWatermark: true,
                    translate: tr,
                    strictName: true,
                    onHideToolbar: undefined,
                    onShowToolbar: undefined,
                    mainMenuButton: _var3,
                    showContextMenu: function (x, y, items, prim) {
                        showContextMenuOff(widget, x, y, items, prim);
                    },
                    onItemClick: function (prim, pos, evt) {
                        _var4 = onItemClickOff(widget, prim, pos, evt);
                        return _var4;
                    },
                    getCursorForItem: getCursorForItemOff
                };
            default:
                return;
            }
        }
    }
    function DesktopEditorScreen_redraw(self, container) {
        var editorDiv;
        var __state = '10';
        while (true) {
            switch (__state) {
            case '9':
                return;
            case '10':
                container.style.overflow = 'hidden';
                editorDiv = dh2common.buildWidgetDom(container, self.drakon);
                editorDiv.style.width = '100%';
                editorDiv.style.height = '100%';
                __state = '9';
                break;
            default:
                return;
            }
        }
    }
    function unfreezeScreen() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (unit.wait) {
                    html.remove(unit.wait);
                    unit.wait = undefined;
                    __state = '1';
                } else {
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function freezeScreen() {
        var root, wait;
        unfreezeScreen();
        root = html.get('popup-root');
        wait = div('full-screen', { 'z-index': 90 });
        html.add(root, wait);
        unit.wait = wait;
        return;
    }
    function EditSenderOff() {
        var self = {};
        self.pushEdit = function (edit) {
            return EditSenderOff_pushEdit(self, edit);
        };
        self.pushEdit_create = function (edit) {
            return EditSenderOff_pushEdit_create(self, edit);
        };
        self.stop = function () {
            return EditSenderOff_stop(self);
        };
        self.sendOut = function () {
            return EditSenderOff_sendOut(self);
        };
        self.sendOut_create = function () {
            return EditSenderOff_sendOut_create(self);
        };
        return self;
    }
    function StartScreen() {
        var self = {};
        self.redraw = function (container) {
            return StartScreen_redraw(self, container);
        };
        return self;
    }
    function DesktopEditorScreen() {
        var self = {};
        self.init = function () {
            return DesktopEditorScreen_init(self);
        };
        self.onChange = function (change) {
            return DesktopEditorScreen_onChange(self, change);
        };
        self.setFolder = function (folder, userSettings) {
            return DesktopEditorScreen_setFolder(self, folder, userSettings);
        };
        self.showItem = function (itemId) {
            return DesktopEditorScreen_showItem(self, itemId);
        };
        self.redraw = function (container) {
            return DesktopEditorScreen_redraw(self, container);
        };
        return self;
    }
    unit.downloadJson = downloadJson;
    unit.runMenuItem = runMenuItem;
    unit.clipboardUpdated = clipboardUpdated;
    unit.start_create = start_create;
    unit.start = start;
    unit.trace = trace;
    unit.registerEvent = registerEvent;
    unit.setTimeout = setTimeout;
    unit.parsePath = parsePath;
    unit.reloadDiagram = reloadDiagram;
    unit.unfreezeScreen = unfreezeScreen;
    unit.EditSenderOff = EditSenderOff;
    unit.StartScreen = StartScreen;
    unit.DesktopEditorScreen = DesktopEditorScreen;
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
    Object.defineProperty(unit, 'http', {
        get: function () {
            return http;
        },
        set: function (newValue) {
            http = newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(unit, 'drakon_canvas', {
        get: function () {
            return drakon_canvas;
        },
        set: function (newValue) {
            drakon_canvas = newValue;
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
    Object.defineProperty(unit, 'drakonhubwidget', {
        get: function () {
            return drakonhubwidget;
        },
        set: function (newValue) {
            drakonhubwidget = newValue;
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
    Object.defineProperty(unit, 'launcher', {
        get: function () {
            return launcher;
        },
        set: function (newValue) {
            launcher = newValue;
        },
        enumerable: true,
        configurable: true
    });
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = drcore;
}