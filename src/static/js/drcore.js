function drcore() {
var unit = {};
var dh2common;
var drakon_canvas;
var drakonhubwidget;
var gconfig;
var html;
var http;
var launcher;
var utils;
var widgets;
function DesktopEditorScreen() {
    var self = { _type: 'DesktopEditorScreen' };
    function init() {
        self.drakon = dh2common.createWidget(drakonhubwidget.DrakonHubWidget(), createConfigOff(self));
        dh2common.subscribeOnResize(self.drakon.onResize);
    }
    function onChange(change) {
        var _collection_111, changeItem;
        if (change.op === 'update') {
            _collection_111 = change.items;
            for (changeItem of _collection_111) {
                if (changeItem.id === self.folderId && 'name' in changeItem) {
                    launcher.setTitle(changeItem.name);
                    break;
                }
            }
        }
    }
    function redraw(container) {
        var editorDiv;
        container.style.overflow = 'hidden';
        editorDiv = dh2common.buildWidgetDom(container, self.drakon);
        editorDiv.style.width = '100%';
        editorDiv.style.height = '100%';
    }
    async function setFolder(folder, userSettings) {
        folder.id = folder.name + '.' + folder.type;
        await self.drakon.setDiagram(folder, userSettings);
    }
    function showItem(itemId) {
        if (itemId && self.client.current === 'drakon') {
            self.drakon.showItem(itemId);
        }
    }
    self.init = init;
    self.onChange = onChange;
    self.redraw = redraw;
    self.setFolder = setFolder;
    self.showItem = showItem;
    return self;
}
function EditSenderOff() {
    var self = { _type: 'EditSenderOff' };
    async function pushEdit(edit) {
        var mustConfirm, newName, ok, rename;
        rename = getRenameEdit(edit);
        if (rename) {
            newName = rename.fields.name;
            mustConfirm = await launcher.confirmRename(newName);
            if (mustConfirm) {
                ok = await confirmReplace();
                if (ok) {
                    if (newName) {
                        dh2common.redrawWidgetDom(getEditorOff());
                        launcher.setTitle(newName);
                    }
                    self.indicator.saving();
                    self.saveDebouncer.onInput();
                } else {
                    await reloadCurrentFile();
                }
            } else {
                if (newName) {
                    dh2common.redrawWidgetDom(getEditorOff());
                    launcher.setTitle(newName);
                }
                self.indicator.saving();
                self.saveDebouncer.onInput();
            }
        } else {
            newName = undefined;
            if (newName) {
                dh2common.redrawWidgetDom(getEditorOff());
                launcher.setTitle(newName);
            }
            self.indicator.saving();
            self.saveDebouncer.onInput();
        }
    }
    async function sendOut() {
        var _collection_106, copy, id, item, saved;
        copy = utils.deepClone(unit.diagram);
        if (copy.items) {
            _collection_106 = copy.items;
            for (id in _collection_106) {
                item = _collection_106[id];
                delete item.id;
            }
        }
        delete copy.access;
        delete copy.initial;
        saved = await launcher.saveMyFile(copy);
        if (saved) {
            self.indicator.saved();
        } else {
            widgets.showErrorSnack(tr('Could not save diagram'));
            self.stop();
            await reloadCurrentFile();
        }
    }
    function stop() {
        self.saveDebouncer.state = undefined;
    }
    self.pushEdit = pushEdit;
    self.sendOut = sendOut;
    self.stop = stop;
    return self;
}
function StartScreen() {
    var self = { _type: 'StartScreen' };
    function redraw(container) {
        var content, contentLeft, contentRight, dpro, header, item, label, langCont, learn, recent, recentItems, recentList, settings, start, title, ui, ver;
        dpro = isDPro();
        settings = unit.settings;
        self.container = container;
        content = div('start-content');
        contentLeft = div('start-content-column');
        contentRight = div('start-content-column');
        html.add(content, contentLeft);
        html.add(content, contentRight);
        title = createLogoLink(settings.language);
        header = div('start-section', { 'text-align': 'center' }, title);
        if (dpro) {
            if (settings.language === 'ru') {
                html.add(header, div('slogan', span('ПРО', 'pro'), span('ЦЕСС '), span('ПРО', 'pro'), span('ГРАММА '), span('ПРО', 'pro'), span('ДУКТ')));
            } else {
                html.add(header, div('slogan', span('PRO', 'pro'), span('CESS '), span('PRO', 'pro'), span('GRAM '), span('PRO', 'pro'), span('DUCT')));
            }
        }
        html.add(contentLeft, header);
        langCont = div({ padding: '5px' });
        ui = html.createElement('select');
        ui.style.padding = '5px';
        ui.style.width = '150px';
        label = div({
            padding: '5px',
            display: 'inline-block',
            text: 'Language'
        });
        html.addOption(ui, 'en-us', 'English');
        html.addOption(ui, 'de', 'Deutsch');
        html.addOption(ui, 'es', 'Español');
        html.addOption(ui, 'fr', 'Français');
        html.addOption(ui, 'lt', 'Lietuvių');
        html.addOption(ui, 'no', 'Norsk');
        html.addOption(ui, 'ru', 'Русский');
        ui.value = settings.language;
        ui.addEventListener('change', function () {
            setLanguage(ui.value);
        });
        html.add(langCont, label);
        html.add(langCont, ui);
        html.add(container, langCont);
        start = div('start-section', div({ text: tr('Start') }, 'start-header'), createDefButton100(tr('New diagram'), startCreateNew), createButton100(getOperationName('import'), startOpenFile));
        html.add(contentLeft, start);
        if (gconfig.showLearn) {
            learn = div('start-section', div({ text: tr('Learn') }, 'start-header'));
            createUrlButton(learn, getHowToDrakonVideoUrl(), 'Видео \u2014 как редактировать дракон-схемы в ДРАКОНПРО');
            html.add(contentLeft, learn);
        }
        recentItems = unit.recent;
        if (!(recentItems.length === 0)) {
            recentList = div();
            for (item of recentItems) {
                addRecentItem(recentList, item);
            }
            recent = div('start-section', div({ text: tr('Diagrams') }, 'start-header'), createCriticalButton100(getOperationName('clear'), clearRecentList), recentList);
            html.add(contentRight, recent);
        }
        if (dpro) {
            dpro = div('drakonpro-link', { text: gconfig.motherSite });
            registerEvent(dpro, 'click', function () {
                launcher.openLink(getDrakonProUrl());
            });
            html.add(container, dpro);
        }
        ver = div({
            'display': 'inline-block',
            'padding': '5px',
            'position': 'fixed',
            'right': '0px',
            'top': '0px',
            'text': 'v ' + dh2common.getAppVersion()
        });
        html.add(container, ver);
        html.add(container, content);
    }
    self.redraw = redraw;
    return self;
}
function addAsBlock(container, element) {
    element.style.display = 'block';
    html.add(container, element);
}
function addRecentItem(parent, item) {
    var container, filename, folder, parsed;
    parsed = parsePath(item.path);
    filename = parsed.filename;
    folder = parsed.folder;
    container = div('start-recent-container');
    html.add(parent, container);
    if (folder) {
        html.add(container, div('start-recent-folder', { text: folder }));
    }
    html.add(container, div('start-recent-file', { text: filename }));
    registerEvent(container, 'click', function () {
        openRecent(item.path);
    });
}
async function clearRecentList() {
    var ok;
    if (gconfig.isDesktop) {
        ok = true;
    } else {
        ok = await widgets.criticalQuestion(tr('This action cannot be undone. Are you sure you want to delete all these diagrams?'), tr('Delete'), tr('Cancel'));
    }
    if (ok) {
        freezeScreen();
        await launcher.clearRecent();
        await loadForStart();
        unfreezeScreen();
        toStartCore();
    }
}
function clipboardUpdated(type, content) {
    unit.clip = {
        type: type,
        content: content
    };
}
async function closeFile() {
    widgets.removePopups();
    launcher.closeMyFile();
    await toStart();
}
function closeWindow() {
    launcher.closeWindow();
}
async function confirmReplace(newName) {
    var ok;
    ok = await widgets.criticalQuestion(tr('Replace existing file?'), tr('Replace'), tr('Cancel'));
    return ok;
}
function createButton100(text, action) {
    var button;
    button = widgets.createSimpleButton(text, action);
    button.style.display = 'block';
    button.style.margin = '0px';
    button.style.marginBottom = '10px';
    return button;
}
function createConfigOff(widget) {
    var watermark;
    if (isDPro()) {
        watermark = gconfig.watermark;
    } else {
        watermark = '';
    }
    return {
        showUndo: true,
        imagePath: dh2common.ipath(''),
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
        mainMenuButton: makeMainMenuButtonInfo(widget),
        showContextMenu: function (x, y, items, prim) {
            showContextMenuOff(widget, x, y, items, prim);
        },
        onItemClick: function (prim, pos, evt) {
            return onItemClickOff(widget, prim, pos, evt);
        },
        getCursorForItem: getCursorForItemOff
    };
}
function createCriticalButton100(text, action) {
    var button;
    button = widgets.createBadButton(text, action);
    button.style.display = 'block';
    button.style.margin = '0px';
    button.style.marginBottom = '10px';
    return button;
}
function createDefButton100(text, action) {
    var button;
    button = widgets.createDefaultButton(text, action);
    button.style.display = 'block';
    button.style.margin = '0px';
    button.style.marginBottom = '10px';
    return button;
}
function createEditSenderOff(diagram, indicator) {
    var sender;
    sender = EditSenderOff();
    sender.indicator = indicator;
    sender.saveDebouncer = utils.debounceAsync_create(sender.sendOut, 500);
    sender.saveDebouncer.run();
    return sender;
}
function createHelpItems() {
    var result;
    result = [{
            label: tr('About') + ' ' + gconfig.appName,
            code: 'showAbout'
        }];
    if (gconfig.showLearn) {
        result.unshift({
            label: 'Как редактировать дракон-схемы',
            code: 'showHowToEdit'
        });
    }
    return result;
}
function createLogoLink(language) {
    var logo, title;
    if (gconfig.motherSite === 'drakonpro.ru') {
        if (language === 'ru') {
            logo = dh2common.ipath('dro-text-logo-120-ru.png');
        } else {
            logo = dh2common.ipath('dro-text-logo-120-en.png');
        }
    } else {
        logo = dh2common.ipath('drakosha98b-wide.png');
    }
    title = img(logo);
    title.style.display = 'inline-block';
    title.style.height = '60px';
    title.style.verticalAlign = 'bottom';
    title.style.cursor = 'pointer';
    registerEvent(title, 'click', function () {
        openLink(getDrakonProUrl());
    });
    return title;
}
function createOffStyles() {
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
}
function createUi() {
    var editor, multi, start;
    unit.screens = {};
    createOffStyles();
    start = dh2common.createWidget(StartScreen());
    editor = dh2common.createWidget(DesktopEditorScreen());
    unit.screens.start = start;
    unit.screens.editor = editor;
    multi = dh2common.createWidget(dh2common.MultiWidget(), {
        current: 'start',
        children: unit.screens
    });
    unit.rootWidget = multi;
}
function createUrlButton(parent, url, title) {
    var video;
    video = div('start-recent-container', div('start-recent-file', { text: title }));
    registerEvent(video, 'click', function () {
        launcher.openLink(url);
    });
    html.add(parent, video);
}
function div() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('div', properties, args);
}
function downloadJson() {
    dh2common.saveAsJson(unit.screens.editor.drakon);
}
async function editorCreateNew() {
    var file, newInfo;
    newInfo = await inputDiagramTypeName();
    if (newInfo) {
        freezeScreen();
        await reloadSettings();
        file = await launcher.createDiagram(newInfo.type, newInfo.name, true);
        unfreezeScreen();
        await toDiagramCore(file);
    }
}
async function enrichSettings(settings) {
    var strings;
    if (!settings.language) {
        settings.language = gconfig.defaultLanguage;
    }
    strings = getLocalizedStrings(settings.language);
    dh2common.setStrings(strings);
}
function freezeScreen() {
    var root, wait;
    unfreezeScreen();
    root = html.get('popup-root');
    wait = div('full-screen', { 'z-index': 90 });
    html.add(root, wait);
    unit.wait = wait;
}
function getCachedClipboard() {
    return unit.clip;
}
function getCursorForItemOff(prim, pos, evt) {
    var link, nothing;
    link = function () {
        return 'pointer';
    };
    nothing = function () {
        return 'grab';
    };
    return runMouseAction(prim, pos, link, link, nothing);
}
function getDrakonProUrl() {
    return 'https://' + gconfig.motherSite + '/' + getUrlSource();
}
function getDrakonWidgetOff() {
    return unit.screens.editor.drakon;
}
function getEditorOff() {
    return unit.screens.editor.drakon;
}
function getHowToDrakonVideoUrl() {
    return 'https://drakonpro.ru/ru/video-kak-redaktirovat-diagrammy-v-drakonpro' + getUrlSource();
}
function getOperationName(operation) {
    var desktop;
    desktop = Boolean(gconfig.isDesktop);
    if (operation === 'import') {
        if (desktop) {
            return tr('Open file');
        } else {
            return tr('Import diagram file');
        }
    } else {
        if (operation === 'export') {
            if (desktop) {
                return tr('Save as');
            } else {
                return tr('Export to diagram file');
            }
        } else {
            if (!(operation === 'clear')) {
                throw new Error('Unexpected case value: ' + operation);
            }
            if (desktop) {
                return tr('Clear recent');
            } else {
                return tr('Delete diagrams');
            }
        }
    }
}
function getRenameEdit(edit) {
    var _collection_109, change;
    _collection_109 = edit.changes;
    for (change of _collection_109) {
        if (!(change.id || !('name' in change.fields))) {
            return change;
        }
    }
    return undefined;
}
function getUrlSource() {
    return '?source=dpro-desktop';
}
function hitBox(pos, left, top, width, height) {
    if (pos.x >= left && pos.x < left + width && pos.y >= top && pos.y < top + height) {
        return true;
    } else {
        return false;
    }
}
function hitInsertionLink(pos, prim) {
    var padding;
    padding = 10;
    return hitBox(pos, prim.diagramLeft + padding * 2, prim.diagramTop + padding, prim.diagramWidth - padding * 4, prim.diagramHeight - padding * 2);
}
function hitLinkArea(pos, prim) {
    var width;
    width = 50;
    return hitBox(pos, prim.diagramLeft, prim.diagramTop, width, prim.diagramHeight);
}
function img(src, className) {
    className = className || '';
    return html.createElement('img', {
        src: src,
        draggable: false
    }, [className]);
}
function initContextMenus() {
    registerEvent(document, 'contextmenu', onGlobalContextMenu, true);
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
}
async function inputDiagramTypeName() {
    var chosenType, evt, name;
    chosenType = await dh2common.chooseDocumentType();
    if (chosenType) {
        evt = chosenType.evt;
        name = await widgets.inputBox(evt.clientX, evt.clientY, tr('Create document'), '', function (name) {
            return dh2common.checkProjectName(name, 250);
        });
        if (name) {
            return {
                type: chosenType.type,
                name: name
            };
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
function isDPro() {
    return gconfig.motherSite === 'drakonpro.ru';
}
function isDrakonOff() {
    return unit.rootWidget.current === 'editor';
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
async function loadForDiagram() {
    await reloadSettings();
    return await launcher.readMyFile();
}
async function loadForStart() {
    await reloadSettings();
    unit.recent = await launcher.getRecent();
}
function makeMainMenuButtonInfo(widget) {
    var buttonImage;
    if (isDPro()) {
        buttonImage = dh2common.ipath('start_menu_dpro.png');
    } else {
        buttonImage = dh2common.ipath('start_menu_drakosha.png');
    }
    return {
        image: buttonImage,
        callback: function () {
            showDesktopMainMenu(widget);
        },
        tooltip: 'Open menu'
    };
}
function newWindow() {
    launcher.newWindow();
}
function onError(evt) {
    panic(evt.error);
}
function onGlobalContextMenu(evt) {
    console.log(evt, evt.target);
}
function onItemClickOff(widget, prim, pos, evt) {
    var id, insertion, link, nothing;
    link = function (prim) {
        launcher.openLink(prim.link);
    };
    id = widget.folderId;
    insertion = function (prim) {
        return openInsertion(prim, id);
    };
    nothing = function () {
    };
    return runMouseAction(prim, pos, link, insertion, nothing);
}
function onRejection(evt) {
    evt.preventDefault();
    panic(evt.reason);
}
async function openInsertion(prim, id) {
    var message, name, path;
    name = dh2common.stripTags(prim.content);
    if (name) {
        path = await launcher.findDiagram(name);
        if (path) {
            await launcher.openFileAt(path, true);
        } else {
            message = tr('Diagram not found') + ': ' + name;
            widgets.showErrorSnack(message);
        }
    }
}
function openLink(link) {
    launcher.openLink(link);
}
async function openRecent(path) {
    var file;
    freezeScreen();
    await reloadSettings();
    file = await launcher.openFileAt(path);
    unfreezeScreen();
    await toDiagramCore(file);
}
function panic(ex) {
    var central, main;
    console.error(ex);
    main = html.get('main');
    html.clear(main);
    central = div('middle', div('header1', { text: tr('An error has occurred') }), div({
        'padding-top': '20px',
        'text-align': 'center'
    }, widgets.createDefaultButton(tr('Ok'), launcher.restartApp)));
    html.add(main, central);
}
function parsePath(path) {
    var filename, folder, folderParts, parts, separator;
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
    return {
        filename: filename,
        folder: folder
    };
}
function rebuildUi() {
    var root;
    dh2common.removeLoading();
    root = dh2common.createRootElement();
    root.style.position = 'relative';
    root.style.height = '100%';
    html.clear(root);
    unit.rootWidget.redraw(root);
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
function registerErrorHandlers() {
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
}
function registerEvent(element, eventName, action, options) {
    return dh2common.registerEvent(element, eventName, action, options);
}
function registerMenuItem(name, fun) {
    unit.menuItems[name] = fun;
}
async function reloadCurrentFile() {
    var file;
    freezeScreen();
    file = await launcher.readMyFile();
    unfreezeScreen();
    await toDiagramCore(file);
}
function reloadDiagram() {
    reloadCurrentFile();
}
async function reloadSettings() {
    var settings;
    settings = await launcher.loadUserSettings();
    await enrichSettings(settings);
    if (!settings.yes) {
        dh2common.setLabelsForLanguage(settings, settings.language);
    }
    unit.settings = settings;
}
function runMenuItem(role) {
    var action;
    action = unit.menuItems[role];
    action();
}
function runMouseAction(prim, pos, link, insertion, nothing) {
    if (prim.link) {
        if (hitLinkArea(pos, prim)) {
            return link(prim);
        } else {
            return nothing();
        }
    } else {
        return nothing();
    }
}
async function saveAsFile() {
    var file;
    widgets.removePopups();
    freezeScreen();
    file = await launcher.saveMyFileAs();
    unfreezeScreen();
    await toDiagramCore(file);
}
function saveAsPicture() {
    saveAsPictureCore(1);
}
function saveAsPictureCore(zoom) {
    var exported, widget;
    widget = getDrakonWidgetOff();
    exported = widget.exportImage(zoom, '');
    launcher.saveAsPng(exported.name, exported.image);
}
function saveAsPictureX2() {
    saveAsPictureCore(2);
}
function saveAsPictureX4() {
    saveAsPictureCore(4);
}
function sendRequestOff() {
}
function setCachedClipboard(type, content) {
    unit.clip = {
        type: type,
        content: content
    };
    launcher.setClipboard(type, content);
}
function setFileMenu() {
    var exp, file, help, menu;
    file = [
        {
            label: tr('New window'),
            code: 'newWindow'
        },
        {
            label: tr('New diagram') + '...',
            code: 'editorCreateNew'
        },
        {
            label: tr('Open file') + '...',
            code: 'startOpenFile'
        },
        {
            label: tr('Save as') + '...',
            code: 'saveAsFile'
        },
        {
            label: tr('Close file'),
            code: 'closeFile'
        },
        { type: 'separator' },
        {
            label: tr('Close window'),
            code: 'closeWindow'
        }
    ];
    exp = [
        {
            label: tr('Save as picture') + ' \xD74...',
            code: 'saveAsPictureX4'
        },
        {
            label: tr('Save as picture') + ' \xD72...',
            code: 'saveAsPictureX2'
        },
        { type: 'separator' },
        {
            label: tr('Save as picture') + '...',
            code: 'saveAsPicture'
        }
    ];
    help = createHelpItems();
    menu = [
        {
            label: tr('File'),
            submenu: file
        },
        {
            label: tr('Export'),
            submenu: exp
        },
        {
            label: tr('Help'),
            submenu: help
        }
    ];
    launcher.setMenu(menu);
}
async function setLanguage(language) {
    var settings;
    settings = await launcher.loadUserSettings();
    settings.language = language;
    settings.yes = undefined;
    settings.no = undefined;
    settings.end = undefined;
    settings.branch = undefined;
    settings.exit = undefined;
    await enrichSettings(settings);
    dh2common.setLabelsForLanguage(settings, settings.language);
    unit.settings = settings;
    await launcher.saveUserSettings(settings);
    toStartCore();
}
function setStartMenu() {
    var file, help, menu;
    file = [
        {
            label: tr('New diagram') + '...',
            code: 'startCreateNew'
        },
        {
            label: tr('Open file') + '...',
            code: 'startOpenFile'
        },
        { type: 'separator' },
        {
            label: tr('Close window'),
            code: 'closeWindow'
        }
    ];
    help = createHelpItems();
    menu = [
        {
            label: tr('File'),
            submenu: file
        },
        {
            label: tr('Help'),
            submenu: help
        }
    ];
    launcher.setMenu(menu);
}
function setTimeout(action, delay, notrace) {
    return dh2common.setTimeout(action, delay, notrace);
}
function showAbout() {
    var dialog, dpro, title, ver;
    console.log('showAbout');
    dialog = widgets.createMiddleWindow();
    title = createLogoLink();
    html.add(dialog, div({ 'text-align': 'center' }, title));
    ver = div({
        'padding': '5px',
        'text': 'v ' + dh2common.getAppVersion()
    });
    html.add(dialog, ver);
    if (isDPro()) {
        dpro = div('drakonpro-link', {
            text: gconfig.motherSite,
            'display': 'block',
            'position': 'static'
        });
        registerEvent(dpro, 'click', function () {
            launcher.openLink(getDrakonProUrl());
        });
        html.add(dialog, dpro);
    }
    html.add(dialog, widgets.div({
        'padding': '10px',
        'padding-top': '40px'
    }, widgets.createSimpleButton(tr('Close'), widgets.removeQuestions)));
}
function showContextMenuOff(widget, x, y, items, prim) {
    var options;
    items.forEach(dh2common.removeTagsFromRedirect);
    options = { movable: true };
    widgets.showContextMenu(x, y, items, options);
}
async function showDesktopMainMenu(widget) {
    var client, createNew, divTopButtons, fitems, items, recentItems, ritems;
    await loadForStart();
    client = div();
    divTopButtons = div();
    divTopButtons.style.paddingLeft = '5px';
    html.add(client, divTopButtons);
    createNew = createDefButton100(tr('New diagram') + '...', startCreateNew);
    html.add(divTopButtons, createNew);
    fitems = [];
    fitems.push([
        tr('New window'),
        newWindow
    ]);
    fitems.push([
        getOperationName('import'),
        startOpenFile
    ]);
    fitems.push([
        getOperationName('export'),
        saveAsFile
    ]);
    fitems.push([
        tr('Close diagram'),
        closeFile
    ]);
    addAsBlock(client, dh2common.createMenuSection(tr('File'), fitems));
    items = [];
    items.push([
        tr('Save as picture'),
        saveAsPicture
    ]);
    items.push([
        tr('Save as picture') + ' \xD72',
        saveAsPictureX2
    ]);
    items.push([
        tr('Save as picture') + ' \xD74',
        saveAsPictureX4
    ]);
    items.push('separator');
    items.push([
        tr('About') + ' ' + gconfig.appName,
        showAbout
    ]);
    addAsBlock(client, dh2common.createMenuSection(tr('Export'), items));
    recentItems = unit.recent;
    ritems = recentItems.map(recentToMenu).filter(function (item) {
        return item[0] !== unit.diagram.id;
    });
    if (!(ritems.length === 0)) {
        addAsBlock(client, dh2common.createMenuSection(tr('Recent'), ritems));
    }
    dh2common.showMainMenu(client);
}
function showHowToEdit() {
    launcher.openLink(getHowToDrakonVideoUrl());
}
function showTryExportOptions(widget, evt) {
    var items, rect;
    items = [];
    items.push({
        text: tr('Export to diagram file'),
        action: function () {
            dh2common.saveAsJson(widget.drakon);
        }
    });
    items.push({ type: 'separator' });
    items.push({
        text: tr('Save as picture') + ' \xD74',
        action: function () {
            dh2common.saveAsPng(widget.drakon, 4);
        }
    });
    items.push({
        text: tr('Save as picture') + ' \xD72',
        action: function () {
            dh2common.saveAsPng(widget.drakon, 2);
        }
    });
    items.push({ type: 'separator' });
    items.push({
        text: tr('Save as picture'),
        action: function () {
            dh2common.saveAsPng(widget.drakon, 1);
        }
    });
    rect = evt.target.getBoundingClientRect();
    widgets.showContextMenuExact(rect.left, rect.bottom, items);
}
function span(text, className) {
    var span;
    span = document.createElement('span');
    html.setText(span, text);
    if (className) {
        span.className = className;
    }
    return span;
}
async function start() {
    var _branch_, file, path;
    _branch_ = 'Common init';
    while (true) {
        switch (_branch_) {
        case 'Common init':
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
            path = await launcher.getPath();
            if (path) {
                _branch_ = 'Open file';
            } else {
                _branch_ = 'Show start page';
            }
            break;
        case 'Open file':
            file = await loadForDiagram();
            if (file.error) {
                widgets.showErrorSnack(tr('Could not load diagram'));
                _branch_ = 'Show start page';
            } else {
                rebuildUi();
                await toDiagramCore(file);
                _branch_ = 'Exit';
            }
            break;
        case 'Show start page':
            await loadForStart();
            rebuildUi();
            toStartCore();
            _branch_ = 'Exit';
            break;
        case 'Exit':
            _branch_ = undefined;
            break;
        default:
            return;
        }
    }
}
async function startCreateNew() {
    var file, newInfo;
    widgets.closePopup();
    newInfo = await inputDiagramTypeName();
    if (newInfo) {
        freezeScreen();
        await reloadSettings();
        file = await launcher.createDiagram(newInfo.type, newInfo.name, false);
        unfreezeScreen();
        await toDiagramCore(file);
    }
}
async function startOpenFile() {
    var file;
    widgets.removePopups();
    freezeScreen();
    await reloadSettings();
    file = await launcher.openFile();
    unfreezeScreen();
    await toDiagramCore(file);
}
async function toDiagram() {
    var diagram;
    dh2common.showWaitBlock();
    diagram = await loadForDiagram();
    dh2common.hideWaitBlock();
    if (diagram) {
        await toDiagramCore(diagram);
    } else {
        widgets.showErrorSnack(tr('Could not load diagram'));
    }
}
async function toDiagramCore(file) {
    var diagram, parsed;
    if (file) {
        if (file.error) {
            widgets.showErrorSnack(tr('Could not load diagram'));
        } else {
            parsed = dh2common.checkDiagram(file.content);
            if (parsed.error) {
                widgets.showErrorSnack(tr('Could not load diagram'));
            } else {
                diagram = parsed.diagram;
                launcher.setTitle(diagram.name);
                unit.rootWidget.setCurrent('editor');
                unit.diagram = diagram;
                await unit.screens.editor.setFolder(unit.diagram, unit.settings);
            }
        }
    }
}
async function toStart() {
    freezeScreen();
    await loadForStart();
    unfreezeScreen();
    toStartCore();
}
function toStartCore() {
    var start;
    launcher.setTitle(undefined);
    unit.rootWidget.setCurrent('start');
    start = unit.screens.start;
    html.clear(start.container);
    start.redraw(start.container);
}
function tr(text) {
    return dh2common.translate(text);
}
function trace(name, value) {
    return dh2common.trace(name, value);
}
function unfreezeScreen() {
    if (unit.wait) {
        html.remove(unit.wait);
        unit.wait = undefined;
    }
}
unit.DesktopEditorScreen = DesktopEditorScreen;
unit.EditSenderOff = EditSenderOff;
unit.StartScreen = StartScreen;
unit.clipboardUpdated = clipboardUpdated;
unit.downloadJson = downloadJson;
unit.parsePath = parsePath;
unit.registerEvent = registerEvent;
unit.reloadDiagram = reloadDiagram;
unit.runMenuItem = runMenuItem;
unit.setTimeout = setTimeout;
unit.start = start;
unit.trace = trace;
unit.unfreezeScreen = unfreezeScreen;
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
return unit;
}