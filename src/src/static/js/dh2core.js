function dh2core() {
var unit = {};
var dh2common;
var drakon_canvas;
var drakonhubwidget;
var edit_tools;
var gconfig;
var html;
var http;
var utils;
var widgets;
function AccountScreen() {
    var self = { _type: 'AccountScreen' };
    function createStyles() {
        html.addClass('.account-client', 'white-space: nowrap');
        html.addClass('.account-right select', 'font-size: ' + gconfig.fontSize + 'px', 'padding: 5px');
        html.addClass('.account-left', 'display: inline-block', 'vertical-align: top', 'padding: 20px', 'height: 100%', 'border-right: solid 1px #a0a0a0');
        html.addClass('.account-left-mob', 'padding: 20px');
        html.addClass('.account-right', 'white-space: normal', 'display: inline-block', 'vertical-align: top', 'height: 100%', 'overflow-y: auto', 'width: 400px', 'padding: 20px');
        html.addClass('.account-right-mob', 'white-space: normal', 'padding: 20px');
        html.addClass('.account-header', 'font-size: ' + getHeader2Size(), 'font-weight: bold', 'margin-bottom: 10px');
        html.addClass('.account-title', 'font-size: 20px', 'font-weight: normal', 'margin-bottom: 20px');
        html.addClass('.account-control-container', 'margin-bottom: 10px');
        html.addClass('.account-control-container input[type=text]', 'width: 100%');
        html.addClass('.account-good', 'margin-top: 20px', 'color: darkgreen');
        html.addClass('.account-bad', 'margin-top: 20px', 'color: darkred');
    }
    function redraw(container) {
        var _selectValue_2, bottom, home, left, right, top, topRight, user;
        home = widgets.createDefaultButton(tr('Projects'), goHome);
        home.style.marginTop = '5px';
        home.style.lineHeight = '38px';
        user = widgets.createIconButton(ipath('user-s.png'), onUserClickAccount);
        user.style.marginTop = '5px';
        user.style.marginRight = '0px';
        widgets.addTooltip(user, tr('Account'));
        topRight = div('top-right');
        html.add(topRight, home);
        html.add(topRight, user);
        top = div(dh2common.makeLogo(showAccountMenu), div('top-text', {
            text: tr('Account'),
            'font-size': getHeader2Size(),
            'font-weight': 'bold'
        }), topRight);
        bottom = div();
        html.add(container, top);
        html.add(container, bottom);
        dh2common.makeTopBar(top, bottom);
        left = div('account-left');
        right = div('account-right');
        if (widgets.isNarrowScreen()) {
            bottom.style.overflow = 'auto';
            left = div('account-left-mob');
            right = div('account-right-mob');
        } else {
            left = div('account-left');
            right = div('account-right');
        }
        html.add(bottom, left);
        html.add(bottom, right);
        addNavItem(self, left, 'details', tr('Details'));
        addNavItem(self, left, 'language', tr('Language'));
        addNavItem(self, left, 'password', tr('Password'));
        addNavItem(self, left, 'subscription', tr('Subscription'));
        addNavItem(self, left, 'payments', tr('Payments'));
        addNavItem(self, left, 'sessions', tr('Sessions'));
        _selectValue_2 = self.page;
        if (_selectValue_2 === 'details') {
            accountDetails(self, right);
        } else {
            if (_selectValue_2 === 'language') {
                accountLanguage(self, right);
            } else {
                if (_selectValue_2 === 'password') {
                    accountPassword(self, right);
                } else {
                    if (_selectValue_2 === 'subscription') {
                        accountSubscription(self, right);
                    } else {
                        if (_selectValue_2 === 'payments') {
                            accountPayments(self, right);
                        } else {
                            if (_selectValue_2 === 'sessions') {
                                accountSessions(self, right);
                            }
                        }
                    }
                }
            }
        }
    }
    function setAccountData(page, settings, account) {
        var bucket;
        self.page = page;
        self.settings = settings;
        self.account = account;
        setDefaultValue(settings, 'language', gconfig.defaultLanguage);
        bucket = dh2common.getLabelsByCode(settings.language);
        setDefaultValue(settings, 'yes', bucket.yes);
        setDefaultValue(settings, 'no', bucket.no);
        setDefaultValue(settings, 'end', bucket.end);
        setDefaultValue(settings, 'branch', bucket.branch);
        setDefaultValue(settings, 'exit', bucket.exit);
        dh2common.redrawWidgetDom(self);
    }
    self.createStyles = createStyles;
    self.redraw = redraw;
    self.setAccountData = setAccountData;
    return self;
}
function AdminScreen() {
    var self = { _type: 'AdminScreen' };
    function createStyles() {
        html.addClass('.report-table', 'border-collapse:collapse', 'border:1px solid #a0a0a0');
        html.addClass('.report-table td, .report-table th', 'padding: 5px', 'border:1px solid #a0a0a0');
        html.addClass('.report-table th', 'font-weight: bold');
    }
    function redraw(container) {
        var _selectValue_2, bottom, home, left, right, top, topRight, user;
        home = widgets.createDefaultButton(tr('Projects'), goHome);
        home.style.marginTop = '5px';
        home.style.lineHeight = '38px';
        user = widgets.createIconButton(ipath('user-s.png'), onUserClickAccount);
        user.style.marginTop = '5px';
        user.style.marginRight = '0px';
        widgets.addTooltip(user, tr('Account'));
        topRight = div('top-right');
        html.add(topRight, home);
        html.add(topRight, user);
        top = div(dh2common.makeLogo(showAccountMenu), div('top-text', {
            text: tr('Admin console'),
            'font-size': getHeader2Size(),
            'font-weight': 'bold'
        }), topRight);
        bottom = div({ overflow: 'hidden' });
        html.add(container, top);
        html.add(container, bottom);
        dh2common.makeTopBar(top, bottom);
        left = div({
            display: 'inline-block',
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: '250px',
            height: '100%',
            padding: '20px',
            'border-right': 'solid 1px #a0a0a0'
        });
        right = div({
            display: 'inline-block',
            position: 'absolute',
            left: '250px',
            top: '0px',
            width: 'calc(100% - 250px)',
            height: '100%',
            padding: '20px'
        });
        html.add(bottom, left);
        html.add(bottom, right);
        addAdminNavItem(self, left, 'user', tr('User administration'));
        addAdminNavItem(self, left, 'feedback', tr('Feedback'));
        addAdminNavItem(self, left, 'server', tr('Server errors'));
        addAdminNavItem(self, left, 'client', tr('Client errors'));
        addAdminNavItem(self, left, 'diagnostics', tr('Server diagnostics'));
        addAdminNavItem(self, left, 'reports', tr('Reports'));
        addAdminNavItem(self, left, 'funnel', tr('Funnel'));
        addAdminNavItem(self, left, 'payments', tr('Payments'));
        _selectValue_2 = self.page;
        if (_selectValue_2 === 'user') {
            userScreen(self, right);
        } else {
            if (_selectValue_2 === 'feedback') {
                feedbackScreenGeneric(self, right, tr('Feedback'), 'feedback');
            } else {
                if (_selectValue_2 === 'server') {
                    feedbackScreenGeneric(self, right, tr('Server errors'), 'server');
                } else {
                    if (_selectValue_2 === 'client') {
                        feedbackScreenGeneric(self, right, tr('Client errors'), 'crash');
                    } else {
                        if (_selectValue_2 === 'diagnostics') {
                            diagrnosticsScreen(self, right);
                        } else {
                            if (_selectValue_2 === 'reports') {
                                reportsScreen(self, right);
                            } else {
                                if (_selectValue_2 === 'funnel') {
                                    funnelScreen(self, right);
                                } else {
                                    if (_selectValue_2 === 'payments') {
                                        allPaymentsScreen(self, right);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function setPage(page) {
        self.page = page;
        dh2common.redrawWidgetDom(self);
    }
    self.createStyles = createStyles;
    self.redraw = redraw;
    self.setPage = setPage;
    return self;
}
function BreadCrumbs() {
    var self = { _type: 'BreadCrumbs' };
    function createStyles() {
        html.addClass('.bread-container', 'display: inline-block', 'position: relative', 'white-space: nowrap', 'overflow: hidden', 'height: 50px', 'padding-top: 5px');
        html.addClass('.bread-item', 'font-size: ' + getHeader2Size(), 'font-weight: bold', 'display: inline-block', 'line-height:26px', 'padding-left:5px', 'padding-right:5px');
        html.addClass('.bread-slash', 'display: inline-block', 'line-height:' + gconfig.fontSize + 'px', 'padding-left:0px', 'padding-right:0px');
        html.addClass('.bread-item-link', 'display: inline-block', 'line-height:' + gconfig.fontSize + 'px', 'padding-left:5px', 'padding-right:5px', 'cursor:pointer', 'color:darkgreen');
        html.addClass('.bread-item-narrow', 'display: inline-block', 'line-height:1.1', 'padding-left:5px', 'padding-right:5px');
    }
    function init() {
        self.path = [];
    }
    function redraw(container) {
        container.className = 'bread-container';
        self.setPath(self.path);
    }
    function setPath(path) {
        var i, projects;
        self.path = path;
        html.clear(self.container);
        if (!gconfig.pad) {
            projects = div('bread-item-link', { text: tr('Projects') });
            registerEvent(projects, 'click', goHome);
            html.add(self.container, projects);
        }
        for (i = 0; i < path.length; i++) {
            addCrumb(self, path, i);
        }
    }
    function update(change) {
        var _collection_2, step;
        if (change.name) {
            _collection_2 = self.path;
            for (step of _collection_2) {
                if (step.id === change.id) {
                    html.setText(step.element, change.name);
                    break;
                }
            }
        }
    }
    self.createStyles = createStyles;
    self.init = init;
    self.redraw = redraw;
    self.setPath = setPath;
    self.update = update;
    return self;
}
function DeskHome() {
    var self = { _type: 'DeskHome' };
    function addRecentItemDesk(parent, itemPath) {
        var container, filename, folder, parsed;
        parsed = parsePath(itemPath);
        filename = parsed.filename;
        folder = parsed.folder;
        container = div('start-recent-container');
        html.add(parent, container);
        if (folder) {
            html.add(container, div('start-recent-folder', { text: folder }));
        }
        html.add(container, div('start-recent-file', { text: filename }));
        registerEvent(container, 'click', function () {
            openRecentFolder(itemPath);
        });
    }
    function createButton100(text, action) {
        var button;
        button = widgets.createSimpleButton(text, action);
        button.style.display = 'block';
        button.style.margin = '0px';
        button.style.marginBottom = '10px';
        return button;
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
    function createLogoLink(language) {
        var logo, title;
        logo = dh2common.ipath('drakosha98b-wide.png');
        title = img(logo);
        title.style.display = 'inline-block';
        title.style.height = '60px';
        title.style.verticalAlign = 'bottom';
        title.style.cursor = 'pointer';
        registerEvent(title, 'click', function () {
            openLink(gconfig.homeSite);
        });
        return title;
    }
    function createStyles() {
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
    async function deleteRecentFolders() {
        await padBridge.saveRecentFolders([]);
        unit.globals.recentFolders = [];
        dh2common.redrawWidgetDom(self);
    }
    function redraw(container) {
        var canOpen, content, contentLeft, contentRight, header, item, label, langCont, recent, recentItems, recentList, settings, start, title, ui, ver;
        settings = dh2common.getSettingsObj();
        self.container = container;
        content = div('start-content');
        contentLeft = div('start-content-column');
        contentRight = div('start-content-column');
        html.add(content, contentLeft);
        html.add(content, contentRight);
        title = createLogoLink(settings.language);
        header = div('start-section', { 'text-align': 'center' }, title);
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
            setLanguageFromDeskStart(ui.value);
        });
        html.add(langCont, label);
        html.add(langCont, ui);
        html.add(container, langCont);
        start = div('start-section', div({ text: tr('Start') }, 'start-header'), createDefButton100(tr('Open folder'), openFolder));
        canOpen = false;
        if (canOpen) {
            html.add(start, createButton100(tr('Open diagram'), openDiagramFile));
        }
        html.add(contentLeft, start);
        recentItems = getRecentFolders();
        if (!(recentItems.length === 0)) {
            recentList = div();
            for (item of recentItems) {
                addRecentItemDesk(recentList, item);
            }
            recent = div('start-section', div({ text: tr('Recent') }, 'start-header'), createCriticalButton100(tr('Clear recent'), deleteRecentFolders), recentList);
            html.add(contentRight, recent);
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
    async function setLanguageFromDeskStart(language) {
        var settings;
        await dh2common.fetchUserSettings();
        settings = dh2common.getSettingsObj();
        settings.language = language;
        await dh2common.saveUserSettings(settings);
        await dh2common.loadStringsForLanguage(language);
        dh2common.redrawWidgetDom(self);
    }
    self.createStyles = createStyles;
    self.redraw = redraw;
    return self;
}
function EditSender() {
    var self = { _type: 'EditSender' };
    function pushEdit(edit) {
        self.queue.unshift(edit);
        self.sender.onItem();
    }
    function stop() {
        self.sender.state = undefined;
    }
    self.pushEdit = pushEdit;
    self.stop = stop;
    return self;
}
function EditableWidget() {
    var self = { _type: 'EditableWidget' };
    function createStyles() {
        html.addClass('.editable-container', 'display: inline-block');
        html.addClass('.editable-body', 'display: block', 'overflow-y: auto', 'border: solid 1px #a0a0a0', 'padding: 5px', 'background: white', 'cursor: pointer');
    }
    function init(options) {
        self.options = options;
    }
    function redraw(container) {
        var _selectValue_2, body, line, lines, options, title, value;
        container.className = 'editable-container';
        options = self.options;
        value = options.value || '';
        container.style.width = options.width + 'px';
        container.style.height = options.height + 'px';
        if ('left' in options) {
            container.style.position = 'absolute';
            container.style.left = options.left + 'px';
            container.style.top = options.top + 'px';
        }
        title = div({
            text: options.title,
            height: '15px',
            background: 'rgba(255, 255, 255, 0.7)'
        });
        body = div('editable-body', { height: options.height - 15 + 'px' });
        _selectValue_2 = options.style;
        if (_selectValue_2 === 'heading1') {
            body.style.fontSize = gconfig.fontSize + 2 + 'px';
            body.style.fontWeight = 'bold';
        } else {
            if (_selectValue_2 === 'heading2') {
                body.style.fontSize = gconfig.fontSize + 'px';
                body.style.fontWeight = 'bold';
            }
        }
        lines = value.split('\n');
        for (line of lines) {
            html.add(body, div({ text: line }));
        }
        html.add(container, title);
        html.add(container, body);
        registerEvent(body, 'click', function () {
            return showEditableEdit(body, value, options);
        });
    }
    self.createStyles = createStyles;
    self.init = init;
    self.redraw = redraw;
    return self;
}
function EnneWidget() {
    var self = { _type: 'EnneWidget' };
    function changeDiagramType(type) {
        updateEnne(self, 'settings', 'diagramType', type);
    }
    function createDocument(ignore, evt) {
        createDocumentCore(self.diagram.parent, evt);
    }
    function init() {
        self.editDeb = utils.forceDebounce_create(function (msg) {
            updateEnneCore(self, msg[0], msg[1], msg[2]);
        }, 1000);
        self.editDeb.run();
        self.indicator = dh2common.createWidget(Indicator());
    }
    function onChange(change) {
        if (self.diagram && self.diagram.id === change.id) {
            self.edit.forcedChange(change);
            dh2common.redrawWidgetDom(self);
        }
    }
    function onHide() {
        stopSender(self);
        self.diagram = undefined;
    }
    function onShow() {
    }
    function redoEdit() {
        var edit;
        edit = self.edit.redoEdit();
        if (edit) {
            self.editDeb.reset();
            if ('name' in edit) {
                reportNameChanged(self);
            } else {
                dh2common.redrawWidgetDom(self);
            }
        }
    }
    function redraw(container) {
        var _selectValue_2, bcontainer, combo, diagram, diagramTypes, doc, name, top;
        trace('enne.redraw');
        container.style.overflow = 'auto';
        diagram = self.diagram;
        if (diagram) {
            bcontainer = createDiv(container, 'folder-list-buttons-container');
            doc = widgets.createDefaultButton(tr('+Документ'), self.createDocument);
            doc.style.marginLeft = '5px';
            html.add(bcontainer, doc);
            html.add(bcontainer, widgets.createIconButton(ipath('undo.png'), self.undoEdit));
            html.add(bcontainer, widgets.createIconButton(ipath('redo.png'), self.redoEdit));
            dh2common.buildWidgetDom(bcontainer, self.indicator);
            top = 50;
            name = createEditable({
                title: tr('Название'),
                value: diagram.name,
                onSave: self.renameDocument,
                check: nameNotEmpty,
                left: 10,
                top: 10 + top,
                width: 500,
                height: 90,
                style: 'heading1'
            });
            html.add(container, name);
            diagramTypes = [
                {
                    id: 'zt',
                    text: tr('Закон Трёх')
                },
                {
                    id: 'rzt',
                    text: tr('Расширенный Закон Трёх')
                },
                {
                    id: 'zokt',
                    text: tr('Закон Октав')
                },
                {
                    id: 'enne',
                    text: tr('Эннеаграмма')
                }
            ];
            combo = widgets.createComboBox(diagramTypes, diagram.items.settings.diagramType, self.changeDiagramType, '300px');
            placeWithLabel(container, combo, tr('Тип диаграммы'), 10, 120 + top);
            addEditable(self, container, 'Плоскость рассмотрения', 'root', 'plane', 520, 10 + top);
            _selectValue_2 = diagram.items.settings.diagramType;
            if (_selectValue_2 === 'zt') {
                addEditable(self, container, 'Активная сила', 'root', 'pos', 10, 190 + top);
                addEditable(self, container, 'Организующая сила', 'root', 'org', 420, 190 + top);
                addEditable(self, container, 'Пассивная сила', 'root', 'neg', 830, 190 + top);
                addDescription(self, container, 'Описание', 'root', 'desc', 10, 290 + top);
            } else {
                if (_selectValue_2 === 'rzt') {
                    renderRzt(self, top);
                } else {
                    if (_selectValue_2 === 'zokt') {
                        renderOkt(self, top);
                    } else {
                        if (_selectValue_2 === 'enne') {
                            renderEnne(self, top);
                        }
                    }
                }
            }
        } else {
        }
    }
    function renameDocument(newName) {
        updateEnne(self, undefined, 'name', newName);
    }
    function setDocument(diagram) {
        var items;
        self.diagram = diagram;
        startEditor(self);
        items = diagram.items;
        diagram.items = {};
        loadDiagramItems(items, diagram);
        dh2common.redrawWidgetDom(self);
    }
    function undoEdit() {
        var edit;
        edit = self.edit.undoEdit();
        if (edit) {
            self.editDeb.reset();
            if ('name' in edit) {
                reportNameChanged(self);
            } else {
                dh2common.redrawWidgetDom(self);
            }
        }
    }
    self.changeDiagramType = changeDiagramType;
    self.createDocument = createDocument;
    self.init = init;
    self.onChange = onChange;
    self.onHide = onHide;
    self.onShow = onShow;
    self.redoEdit = redoEdit;
    self.redraw = redraw;
    self.renameDocument = renameDocument;
    self.setDocument = setDocument;
    self.undoEdit = undoEdit;
    return self;
}
function ExpandSubtree(widget, id) {
    var _obj_;
    _obj_ = ExpandSubtree_create(widget, id);
    return _obj_.run();
}
function ExpandSubtree_create(widget, id) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'ExpandSubtree',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* ExpandSubtree_main() {
        var _event_, folder, folderRaw;
        fetchFolder(id).then(me.onFolder);
        me.state = '7';
        me._busy = false;
        _event_ = yield;
        folderRaw = _event_[1];
        folder = folderToChange(folderRaw);
        widget.tree.expand(id, folder.children);
        dh2common.redrawWidgetDom(widget.tree);
        _topResolve_();
    }
    function ExpandSubtree_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = ExpandSubtree_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = ExpandSubtree_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onFolder = function (folderRaw) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '7':
            _args_ = [];
            _args_.push('onFolder');
            _args_.push(folderRaw);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function FolderListWidget() {
    var self = { _type: 'FolderListWidget' };
    function copyFolderObject(evt, id) {
        var ids;
        ids = [id];
        copyCore(self, ids);
    }
    async function copySelectedFolders() {
        var ids;
        ids = Object.keys(self.selected);
        if (!(ids.length === 0)) {
            copyCore(self, ids);
        }
    }
    function createDocument(evt) {
        createDocumentCore(self.folder.id, evt);
    }
    async function createFolder(evt) {
        await createFolderGeneric(self, self.folder.id, evt);
    }
    function createStyles() {
        html.addClass('.folder-list-buttons-container', 'white-space: nowrap', 'overflow-x: auto', 'height: 46px', 'padding: 5px', 'padding-left: 0px');
        html.addClass('.folder-list-grid-container', 'height: calc(100% - 46px)', 'position: relative', 'padding-left: 10px', 'padding-right: 10px');
        html.addClass('img.folder-list-grid-icon', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px', 'cursor: pointer');
        html.addClass('img.folder-list-grid-icon:hover', 'background: darkgreen');
        html.addClass('img.folder-list-grid-icon-passive', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px');
        html.addClass('.folder-list-grid-item', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'white-space: nowrap');
        html.addClass('.folder-list-grid-item-selected', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'background:darkgreen', 'white-space: nowrap', 'color:white');
        html.addClass('.folder-list-grid-item-text-cut', 'color: #c0c0c0');
        html.addClass('.folder-list-grid-item-active', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'background:#9fd694', 'white-space: nowrap');
        html.addClass('.folder-list-grid-item-text', 'display: inline-block', 'vertical-align: bottom', 'width: calc(100% - 30px)', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
        html.addClass('.folder-list-grid-item-text2', 'display: inline-block', 'vertical-align: bottom', 'width: calc(100% - 60px)', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
        html.addClass('.folder-list-grid-item-long', 'display: inline-block', 'vertical-align: bottom', 'white-space: nowrap', 'padding-left: 5px');
        html.addClass('.folder-list-grid-item input[type="checkbox"]', 'display: inline-block', 'vertical-align: bottom', 'width: 24px', 'height: 24px', 'margin: 3px');
        html.addClass('.folder-list-grid-item:hover, .grid-item-active:hover', 'background:#9fd694');
    }
    function cutFolderObject(evt, id) {
        cutCore(self, [id]);
    }
    async function cutSelectedFolders() {
        var ids;
        ids = Object.keys(self.selected);
        if (!(ids.length === 0)) {
            cutCore(self, ids);
        }
    }
    async function deleteObject(parent, id) {
        var ok;
        ok = await deleteOneObject(parent, id);
        if (ok) {
            self.selected = {};
        }
    }
    async function deleteSelectedFolders() {
        var ids, ok, parent;
        parent = self.folder.id;
        ids = Object.keys(self.selected);
        if (ids.length === 0) {
        } else {
            ok = await widgets.criticalQuestion(tr('Delete selected objects?'), tr('Delete'), tr('Cancel'));
            if (ok) {
                self.selected = {};
                await deleteCore(ids, parent);
            } else {
            }
        }
    }
    function exists(id) {
        return !!utils.findBy(self.folder.children, 'id', id);
    }
    function init(config) {
        self.folder = { children: [] };
        self.selected = {};
        self.config = config || {};
    }
    function insert(item) {
        var copy;
        if (item.parent === self.folder.id) {
            copy = {};
            Object.assign(copy, item);
            self.folder.children.push(copy);
        }
    }
    function onChange(fields) {
        var id, item;
        id = fields.id;
        if (self.exists(id)) {
            item = getFolderItem(self, id);
            if (fields.name) {
                item.name = fields.name;
            }
            if (fields.type) {
                item.type = fields.type;
            }
        } else {
            if (self.folder.id === id && fields.children) {
                self.folder.children = fields.children;
            }
        }
    }
    function onCheck(evt, id) {
        evt.stopPropagation();
        if (id in self.selected) {
            delete self.selected[id];
        } else {
            self.selected[id] = true;
        }
        dh2common.redrawWidgetDom(self);
    }
    function onCheckAll(evt) {
        var _collection_2, child, selected;
        selected = {};
        if (!isAllChecked(self)) {
            _collection_2 = self.folder.children;
            for (child of _collection_2) {
                selected[child.id] = true;
            }
        }
        self.selected = selected;
        dh2common.redrawWidgetDom(self);
    }
    function onDots(evt, id) {
        var items, rect;
        evt.stopPropagation();
        rect = evt.target.getBoundingClientRect();
        setFolderActive(self.folder.id, id);
        updateFolderList(self);
        items = fillFolderMenu(self, id);
        widgets.showContextMenuExact(rect.left, rect.bottom, items);
    }
    function onFolderBackContext(evt) {
        var container, items, ro;
        container = self.grid;
        if (evt.target === container) {
            evt.preventDefault();
            items = [];
            ro = self.folder.access === 'read';
            if (!ro) {
                if (getFolderClipboard()) {
                    items.push({
                        text: tr('Paste'),
                        action: self.pasteInFolder
                    });
                    items.push({ type: 'separator' });
                }
                addCreateBlock(self, self.folder.id, items);
                if (!(items.length === 0)) {
                    widgets.showContextMenu(evt.clientX, evt.clientY, items);
                }
            }
            return false;
        }
    }
    function onFolderContext(evt, id) {
        var items;
        evt.preventDefault();
        self.setActive(id);
        updateFolderList(self);
        items = fillFolderMenu(self, id);
        widgets.showContextMenu(evt.clientX, evt.clientY, items);
        return false;
    }
    async function pasteInFolder() {
        self.selected = {};
        await pasteFromClipboard(self.folder.id);
    }
    function redraw(container) {
        container.style.paddingLeft = '5px';
        container.style.paddingRight = '5px';
        container.style.overflowY = 'auto';
        self.buttonsBar = div('folder-list-buttons-container');
        html.add(container, self.buttonsBar);
        self.grid = div('folder-list-grid-container');
        self.grid.style.columnFill = '';
        self.grid.style.columnWidth = '';
        html.add(container, self.grid);
        redrawFolderList(self);
    }
    function remove(id) {
        var children, i, item;
        children = self.folder.children;
        for (i = 0; i < children.length; i++) {
            item = children[i];
            if (item.id === id) {
                children.splice(i, 1);
                break;
            }
        }
    }
    function renameObject(evt, id) {
        var child;
        child = getFolderItem(self, id);
        genericRenameObject(self, evt, child);
    }
    function setActive(id) {
        setFolderActive(self.folder.id, id);
    }
    function setFolder(folderData) {
        self.folder = folderData;
        self.selected = {};
        dh2common.redrawWidgetDom(self);
    }
    self.copyFolderObject = copyFolderObject;
    self.copySelectedFolders = copySelectedFolders;
    self.createDocument = createDocument;
    self.createFolder = createFolder;
    self.createStyles = createStyles;
    self.cutFolderObject = cutFolderObject;
    self.cutSelectedFolders = cutSelectedFolders;
    self.deleteObject = deleteObject;
    self.deleteSelectedFolders = deleteSelectedFolders;
    self.exists = exists;
    self.init = init;
    self.insert = insert;
    self.onChange = onChange;
    self.onCheck = onCheck;
    self.onCheckAll = onCheckAll;
    self.onDots = onDots;
    self.onFolderBackContext = onFolderBackContext;
    self.onFolderContext = onFolderContext;
    self.pasteInFolder = pasteInFolder;
    self.redraw = redraw;
    self.remove = remove;
    self.renameObject = renameObject;
    self.setActive = setActive;
    self.setFolder = setFolder;
    return self;
}
function FolderScreen() {
    var self = { _type: 'FolderScreen' };
    function clear() {
        self.search.setSpace('dummy', 'bad-id');
    }
    function expandClient() {
        self.top.style.display = 'none';
        self.bottom.style.top = '0px';
        self.bottom.style.height = '100%';
    }
    function goUp() {
        if (self.parentId) {
            goToFolder(self.parentId);
        } else {
            goHome();
        }
    }
    function init() {
        var notFound, tabs, unknown, useDh;
        self.crumbs = dh2common.createWidget(BreadCrumbs());
        self.tree = dh2common.createWidget(TreeView());
        self.recent = dh2common.createWidget(RecentWidget());
        self.search = dh2common.createWidget(SearchWidget());
        useDh = true;
        if (useDh) {
            self.drakon = dh2common.createWidget(drakonhubwidget.DrakonHubWidget(), createDrakonHubWidgetConfig(self));
        } else {
            self.drakon = dh2common.createWidget(DrakonWidget());
        }
        tabs = [
            {
                id: 'tree',
                widget: self.tree,
                icon: ipath('folder-s2.png'),
                tool: 'Documents'
            },
            {
                id: 'search',
                widget: self.search,
                icon: ipath('search-s.png'),
                tool: 'Search'
            },
            {
                id: 'recent',
                widget: self.recent,
                icon: ipath('recent-s.png'),
                tool: 'Recent'
            }
        ];
        self.nav = dh2common.createWidget(TabWidget(), tabs);
        self.enne = dh2common.createWidget(EnneWidget());
        self.folder = dh2common.createWidget(FolderListWidget());
        self.folder.fetchFolder = fetchFolder;
        unknown = dh2common.createWidget(widgets.DummyWidget(), { background: '#ffffdd' });
        notFound = dh2common.createWidget(NotFound());
        self.client = dh2common.createWidget(dh2common.MultiWidget(), {
            current: 'unknown',
            children: {
                folder: self.folder,
                unknown: unknown,
                notFound: notFound,
                enne: self.enne,
                drakon: self.drakon
            }
        });
        self.splitter = dh2common.createWidget(SplitWidget(), {
            left: self.nav,
            right: self.client
        });
        registerDataListener(self.onFolderChanged);
        self.treeLoader = TreeNavigation_create(self);
        self.treeLoader.run();
        unit.clientStatus.sideBar = self.splitter;
        self.tree.onExpand = self.treeLoader.expand;
        self.tree.onClick = goToFolder;
        self.tree.onDoubleClick = function (evt, item) {
            genericRenameObject(self, evt, item);
        };
        registerDataListener(self.onChange);
    }
    function onChange(change) {
        var _collection_2, changeItem;
        if (change.op === 'update') {
            _collection_2 = change.items;
            for (changeItem of _collection_2) {
                if (changeItem.id === self.folderId && 'name' in changeItem) {
                    dh2common.setTitle(changeItem.name);
                    break;
                }
            }
        }
    }
    function onFolderChanged(changes) {
        var _branch_, _collection_4, _selectValue_2, _selectValue_6, alive, change, op;
        _branch_ = 'Choose function';
        while (true) {
            switch (_branch_) {
            case 'Choose function':
                _selectValue_2 = changes.op;
                if (_selectValue_2 === 'update') {
                    op = onFolderUpdate;
                    _branch_ = 'Run function on items';
                } else {
                    if (_selectValue_2 === 'delete') {
                        op = onFolderDelete;
                        _branch_ = 'Run function on items';
                    } else {
                        if (_selectValue_2 === 'insert') {
                            op = onFolderInsert;
                            _branch_ = 'Run function on items';
                        } else {
                            if (!(_selectValue_2 === 'clip')) {
                                throw new Error('Unexpected case value: ' + _selectValue_2);
                            }
                            _branch_ = 'Update view';
                        }
                    }
                }
                break;
            case 'Run function on items':
                _collection_4 = changes.items;
                for (change of _collection_4) {
                    op(self, change);
                }
                _branch_ = 'Update view';
                break;
            case 'Update view':
                _selectValue_6 = changes.op;
                if (_selectValue_6 === 'update' || _selectValue_6 === 'insert' || _selectValue_6 === 'clip') {
                    dh2common.redrawWidgetDom(self.tree);
                } else {
                    if (!(_selectValue_6 === 'delete')) {
                        throw new Error('Unexpected case value: ' + _selectValue_6);
                    }
                    dh2common.redrawWidgetDom(self.search);
                }
                dh2common.redrawWidgetDom(self.folder);
                _branch_ = 'Jump out of';
                break;
            case 'Jump out of':
                if (changes.op === 'delete') {
                    alive = findAlive(self, changes.items);
                    if (alive) {
                        goToFolder(alive, undefined, true);
                    }
                }
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
    function onHide() {
        self.client.onHide();
    }
    function onShow() {
        self.client.onShow();
    }
    function redraw(container) {
        var bottom, doc, drakonOnly, exp, folderOnly, forward, onlyStyle, prev, prompt, share, top, up, user;
        up = widgets.createIconButton(ipath('arrow-up.png'), self.goUp);
        up.style.marginTop = '5px';
        up.style.marginLeft = '5px';
        self.up = up;
        widgets.addTooltip(up, tr('Go up'));
        prompt = widgets.createSimpleButton(tr('AI prompt'), function (evt) {
            generateAiPrompt(self);
        });
        prompt.style.verticalAlign = 'top';
        prompt.style.height = '40px';
        prompt.style.lineHeight = '40px';
        prompt.style.marginLeft = '5px';
        prompt.style.marginTop = '5px';
        prompt.style.marginRight = '0px';
        widgets.addTooltip(prompt, tr('Generate AI prompt'));
        onlyStyle = {
            'vertical-align': 'top',
            display: 'none'
        };
        drakonOnly = div(onlyStyle);
        self.drakonOnly = drakonOnly;
        doc = widgets.createDefaultButton(tr('+Document'), function (evt) {
            createDocumentFromDiagramScreen(self, evt);
        });
        doc.style.verticalAlign = 'top';
        doc.style.height = '40px';
        doc.style.lineHeight = '40px';
        doc.style.marginLeft = '5px';
        doc.style.marginTop = '5px';
        doc.style.marginRight = '0px';
        html.add(drakonOnly, doc);
        exp = widgets.createIconButton(ipath('export.png'), function (evt) {
            showExportOptions(self, evt);
        });
        exp.style.verticalAlign = 'top';
        exp.style.marginLeft = '5px';
        exp.style.marginTop = '5px';
        exp.style.marginRight = '0px';
        html.add(drakonOnly, exp);
        if (!gconfig.pad) {
            share = widgets.createIconButton(ipath('share.png'), function (evt) {
                shareDiagram(self, evt);
            });
            share.style.verticalAlign = 'top';
            share.style.marginLeft = '5px';
            share.style.marginTop = '5px';
            share.style.marginRight = '0px';
            html.add(drakonOnly, share);
            widgets.addTooltip(share, tr('Share'));
        }
        widgets.addTooltip(exp, tr('Export / Import'));
        self.topCreateDocument = doc;
        folderOnly = div(onlyStyle);
        self.folderOnly = folderOnly;
        if (gconfig.pad) {
            user = widgets.createIconButton(ipath('settings.png'), function (evt) {
                onSettingsClick(evt, self.spaceId);
            });
        } else {
            user = widgets.createIconButton(ipath('settings.png'), function (evt) {
                onSettingsClickWeb(self, evt, self.spaceId);
            });
            widgets.addTooltip(user, tr('Settings'));
        }
        user.style.marginRight = '0px';
        user.style.position = 'absolute';
        user.style.right = '5px';
        user.style.top = '5px';
        if (gconfig.pad) {
            prev = widgets.createIconButton(ipath('left-angle.png'), goBack);
            prev.style.marginTop = '5px';
            prev.style.marginLeft = '5px';
            widgets.addTooltip(prev, tr('Go back'));
            forward = widgets.createIconButton(ipath('right-angle.png'), goForward);
            forward.style.marginTop = '5px';
            widgets.addTooltip(forward, tr('Go forward'));
            top = div(makeMainMenuLogo(function () {
                showFolderMenu(self);
            }), prev, forward, drakonOnly, folderOnly, prompt);
        } else {
            top = div(dh2common.makeLogo(function () {
                showFolderMenu(self);
            }), drakonOnly, folderOnly, prompt);
        }
        html.add(top, up);
        dh2common.buildWidgetDom(top, self.crumbs);
        html.add(top, user);
        html.add(container, top);
        bottom = dh2common.buildWidgetDom(container, self.splitter);
        dh2common.makeTopBar(top, bottom);
        self.top = top;
        self.bottom = bottom;
        return container;
    }
    function restoreClient() {
        self.top.style.display = '';
        self.bottom.style.top = '';
        self.bottom.style.height = '';
    }
    function setFolder(folder, userSettings) {
        var _obj_;
        _obj_ = setFolder_create(folder, userSettings);
        return _obj_.run();
    }
    function setFolder_create(folder, userSettings) {
        var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
        me = {
            _type: 'setFolder',
            _busy: true,
            state: 'created'
        };
        _topResolve_ = function (_value_) {
            _earlyPromise_ = Promise.resolve(_value_);
        };
        _topReject_ = function (_value_) {
            throw _value_;
        };
        function* setFolder_main() {
            var _event_, _selectValue_2, canReuseUndo, folderFolder, prev, title, treeFolder;
            title = getFolderWindowTitle(folder.name);
            dh2common.setTitle(title);
            self.access = folder.access;
            self.path = folder.path;
            self.folderId = folder.id;
            self.access = folder.access;
            self.isPublic = folder.is_public;
            self.spaceId = folder.space_id;
            self.folderType = folder.type;
            self.crumbs.setPath(folder.path);
            if (folder.path.length === 1) {
                self.parentId = undefined;
            } else {
                prev = folder.path[folder.path.length - 2];
                self.parentId = prev.id;
            }
            if (!gconfig.pad || self.parentId) {
                self.up.style.display = '';
            } else {
                self.up.style.display = 'none';
            }
            treeFolder = folderToChange(folder);
            self.treeLoader.onDone = me.onTreeLoaded;
            self.treeLoader.load(treeFolder);
            me.state = '66';
            me._busy = false;
            _event_ = yield;
            self.search.setSpace(treeFolder.spaceId, treeFolder.id);
            _selectValue_2 = folder.type;
            if (_selectValue_2 === 'folder') {
                showOnlyDivs(self, 'folderOnly');
                restoreClientGlobal();
                self.client.setCurrent('folder');
                folderFolder = folderToChange(folder);
                self.recent.clearActive();
                self.folder.setFolder(folderFolder);
            } else {
                if (_selectValue_2 === 'enne') {
                    showOnlyDivs(self, '');
                    restoreClientGlobal();
                    self.client.setCurrent('enne');
                    folderFolder = folderToChange(folder);
                    addToHistory(self, folderFolder);
                    self.enne.setDocument(folderFolder);
                } else {
                    if (_selectValue_2 === 'drakon' || _selectValue_2 === 'free' || _selectValue_2 === 'graf') {
                        showOnlyDivs(self, 'drakonOnly');
                        self.client.setCurrent('drakon');
                        folderFolder = folderToDiagram(folder);
                        canReuseUndo = checkIfCanReuseUndo(folder.id, folder.tag);
                        addToHistory(self, folderFolder);
                        self.drakon.setDiagram(folderFolder, userSettings, canReuseUndo).then(me.onSet);
                        me.state = '68';
                        me._busy = false;
                        _event_ = yield;
                    } else {
                        self.client.setCurrent('unknown');
                    }
                }
            }
            _topResolve_();
        }
        function setFolder_run() {
            if (me.state !== 'created') {
                throw new Error('run() can be called only once');
            }
            me.state = 'started';
            _topGen_ = setFolder_main();
            _topGen_.next();
            if (_earlyPromise_) {
                return _earlyPromise_;
            }
            return new Promise((resolve, reject) => {
                _topResolve_ = resolve;
                _topReject_ = reject;
            });
        }
        me.run = setFolder_run;
        me.stop = function () {
            me.state = undefined;
        };
        me.onTreeLoaded = function () {
            var _args_;
            if (me._busy) {
                throw new Error('Synchronous reentry is not allowed');
            }
            switch (me.state) {
            case '66':
                _args_ = [];
                _args_.push('onTreeLoaded');
                me._busy = true;
                _topGen_.next(_args_);
                break;
            default:
                break;
            }
        };
        me.onSet = function () {
            var _args_;
            if (me._busy) {
                throw new Error('Synchronous reentry is not allowed');
            }
            switch (me.state) {
            case '68':
                _args_ = [];
                _args_.push('onSet');
                me._busy = true;
                _topGen_.next(_args_);
                break;
            default:
                break;
            }
        };
        return me;
    }
    function showItem(itemId) {
        if (itemId && self.client.current === 'drakon') {
            self.drakon.showItem(itemId);
        }
    }
    self.clear = clear;
    self.expandClient = expandClient;
    self.goUp = goUp;
    self.init = init;
    self.onChange = onChange;
    self.onFolderChanged = onFolderChanged;
    self.onHide = onHide;
    self.onShow = onShow;
    self.redraw = redraw;
    self.restoreClient = restoreClient;
    self.setFolder = setFolder;
    self.setFolder_create = setFolder_create;
    self.showItem = showItem;
    return self;
}
function FolderScreenMobile() {
    var self = { _type: 'FolderScreenMobile' };
    function createStyles() {
        html.addClass('.low-header', 'line-height:20px', 'left:5px', 'bottom: 0px', 'display:inline-block', 'position: absolute', 'font-weight: bold');
    }
    function goUp() {
        if (self.parentId) {
            goToFolder(self.parentId);
        } else {
            goHome();
        }
    }
    function init() {
        var config, notFound, unknown;
        config = createDrakonHubWidgetConfig(self);
        config.mainMenuButton = makeNarrowMainButtonInfo(self);
        config.onHideToolbar = undefined;
        config.onShowToolbar = undefined;
        self.drakon = dh2common.createWidget(drakonhubwidget.DrakonHubWidget(), config);
        self.folder = dh2common.createWidget(FolderListWidget(), { mobile: true });
        self.folder.fetchFolder = fetchFolder;
        unknown = dh2common.createWidget(widgets.DummyWidget(), { background: '#ffffdd' });
        notFound = dh2common.createWidget(NotFound());
        self.client = dh2common.createWidget(dh2common.MultiWidget(), {
            current: 'unknown',
            children: {
                folder: self.folder,
                unknown: unknown,
                notFound: notFound,
                drakon: self.drakon
            }
        });
        registerDataListener(self.onFolderChanged);
        registerDataListener(self.onChange);
    }
    function onChange(change) {
        var _collection_2, changeItem;
        if (change.op === 'update') {
            _collection_2 = change.items;
            for (changeItem of _collection_2) {
                if (changeItem.id === self.folderId && 'name' in changeItem) {
                    dh2common.setTitle(changeItem.name);
                    html.setText(self.lowHeader, changeItem.name);
                    break;
                }
            }
        }
    }
    function onFolderChanged(changes) {
        var _branch_, _collection_4, _selectValue_2, change, op;
        _branch_ = 'Choose function';
        while (true) {
            switch (_branch_) {
            case 'Choose function':
                _selectValue_2 = changes.op;
                if (_selectValue_2 === 'update') {
                    op = onFolderUpdateMobile;
                    _branch_ = 'Run function on items';
                } else {
                    if (_selectValue_2 === 'delete') {
                        op = onFolderDeleteMobile;
                        _branch_ = 'Run function on items';
                    } else {
                        if (_selectValue_2 === 'insert') {
                            op = onFolderInsertMobile;
                            _branch_ = 'Run function on items';
                        } else {
                            if (!(_selectValue_2 === 'clip')) {
                                throw new Error('Unexpected case value: ' + _selectValue_2);
                            }
                            _branch_ = 'Update view';
                        }
                    }
                }
                break;
            case 'Run function on items':
                _collection_4 = changes.items;
                for (change of _collection_4) {
                    op(self, change);
                }
                _branch_ = 'Update view';
                break;
            case 'Update view':
                dh2common.redrawWidgetDom(self.folder);
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
    function onHide() {
        self.client.onHide();
    }
    function onShow() {
        self.client.onShow();
    }
    function redraw(container) {
        var bottom, close, doc, drakonOnly, exp, folderOnly, onlyStyle, safe, share, top, up, user;
        up = widgets.createIconButton(ipath('arrow-up.png'), self.goUp);
        up.style.marginTop = '5px';
        up.style.marginLeft = '5px';
        widgets.addTooltip(up, tr('Go up'));
        self.up = up;
        onlyStyle = {
            'vertical-align': 'top',
            display: 'none'
        };
        drakonOnly = div(onlyStyle);
        self.drakonOnly = drakonOnly;
        doc = widgets.createDefaultButton('+', function (evt) {
            createDocumentFromDiagramScreen(self, evt);
        });
        doc.style.verticalAlign = 'top';
        doc.style.height = '40px';
        doc.style.lineHeight = '40px';
        doc.style.marginLeft = '5px';
        doc.style.marginTop = '5px';
        doc.style.marginRight = '0px';
        doc.style.width = '40px';
        doc.style.textAlign = 'center';
        html.add(drakonOnly, doc);
        self.topCreateDocument = doc;
        exp = widgets.createIconButton(ipath('export.png'), function (evt) {
            showExportOptions(self, evt);
        });
        exp.style.verticalAlign = 'top';
        exp.style.marginLeft = '5px';
        exp.style.marginTop = '5px';
        exp.style.marginRight = '0px';
        html.add(drakonOnly, exp);
        share = widgets.createIconButton(ipath('share.png'), function (evt) {
            shareDiagram(self, evt);
        });
        share.style.verticalAlign = 'top';
        share.style.marginLeft = '5px';
        share.style.marginTop = '5px';
        share.style.marginRight = '0px';
        html.add(drakonOnly, share);
        widgets.addTooltip(exp, tr('Export / Import'));
        widgets.addTooltip(share, tr('Share'));
        folderOnly = div(onlyStyle);
        doc = widgets.createDefaultButton(tr('+Document'), function (evt) {
            createDocumentFromDiagramScreen(self, evt);
        });
        doc.style.marginTop = '7px';
        html.add(folderOnly, doc);
        self.folderOnly = folderOnly;
        if (gconfig.pad) {
            user = widgets.createIconButton(ipath('settings.png'), function (evt) {
                onSettingsClick(evt, self.spaceId);
            });
        } else {
            user = widgets.createIconButton(ipath('user-s.png'), onUserClick);
            widgets.addTooltip(user, tr('Account'));
        }
        user.style.marginRight = '0px';
        user.style.position = 'absolute';
        user.style.right = '5px';
        user.style.top = '5px';
        if (gconfig.pad) {
            top = div(makeMainMenuLogo(function () {
                showFolderMenu(self);
            }), drakonOnly, folderOnly);
        } else {
            top = div(dh2common.makeLogo(function () {
                showFolderMenu(self);
            }), drakonOnly, folderOnly);
        }
        html.add(top, up);
        html.add(top, user);
        safe = widgets.getSafeArea();
        close = widgets.createIconButton(ipath('cross.png'), self.goUp);
        close.style.display = 'inline-block';
        close.style.position = 'absolute';
        close.style.margin = '0px';
        close.style.border = '0px';
        close.style.right = '2px';
        close.style.top = '2px';
        close.style.background = 'green';
        self.close = close;
        html.add(container, top);
        bottom = dh2common.buildWidgetDom(container, self.client);
        dh2common.makeTopBar(top, bottom);
        self.top = top;
        self.bottom = bottom;
        self.lowHeader = div('low-header');
        html.add(top, self.lowHeader);
        html.add(container, close);
        return container;
    }
    async function setFolder(folder, userSettings) {
        var _selectValue_2, canReuseUndo, folderFolder, prev;
        dh2common.setTitle(folder.name);
        if (folder.type === 'folder') {
            self.top.style.height = '70px';
            self.bottom.style.height = 'calc(100% - 70px)';
            self.lowHeader.style.display = '';
            html.setText(self.lowHeader, folder.name);
        } else {
            self.top.style.height = '0px';
            self.bottom.style.height = '100%';
            self.lowHeader.style.display = 'none';
        }
        self.access = folder.access;
        self.path = folder.path;
        self.folderId = folder.id;
        self.access = folder.access;
        self.isPublic = folder.is_public;
        self.spaceId = folder.space_id;
        self.folderType = folder.type;
        if (folder.path.length === 1) {
            self.parentId = undefined;
        } else {
            prev = folder.path[folder.path.length - 2];
            self.parentId = prev.id;
        }
        if (!gconfig.pad || self.parentId) {
            self.up.style.display = '';
        } else {
            self.up.style.display = 'none';
        }
        self.close.style.display = 'none';
        _selectValue_2 = folder.type;
        if (_selectValue_2 === 'folder') {
            showOnlyDivs(self, 'folderOnly');
            self.client.setCurrent('folder');
            folderFolder = folderToChange(folder);
            self.folder.setFolder(folderFolder);
        } else {
            if (_selectValue_2 === 'drakon' || _selectValue_2 === 'free' || _selectValue_2 === 'graf') {
                showOnlyDivs(self, 'drakonOnly');
                self.close.style.display = '';
                self.client.setCurrent('drakon');
                folderFolder = folderToDiagram(folder);
                canReuseUndo = checkIfCanReuseUndo(folder.id, folder.tag);
                await self.drakon.setDiagram(folderFolder, userSettings, canReuseUndo);
            } else {
                self.client.setCurrent('unknown');
            }
        }
    }
    function showItem(itemId) {
        if (itemId && self.client.current === 'drakon') {
            self.drakon.showItem(itemId);
        }
    }
    self.createStyles = createStyles;
    self.goUp = goUp;
    self.init = init;
    self.onChange = onChange;
    self.onFolderChanged = onFolderChanged;
    self.onHide = onHide;
    self.onShow = onShow;
    self.redraw = redraw;
    self.setFolder = setFolder;
    self.showItem = showItem;
    return self;
}
function GroupScreen() {
    var self = { _type: 'GroupScreen' };
    function redraw(container) {
        var bottom, create, header, home, remove, rename, top, topRight, user;
        home = widgets.createDefaultButton(tr('Projects'), goHome);
        home.style.marginTop = '5px';
        home.style.lineHeight = '38px';
        user = widgets.createIconButton(ipath('user-s.png'), onUserClick);
        user.style.marginTop = '5px';
        user.style.marginRight = '0px';
        widgets.addTooltip(user, tr('Account'));
        topRight = div('top-right');
        html.add(topRight, home);
        html.add(topRight, user);
        create = widgets.createSimpleButton(tr('Create group'), function () {
            createGroup(self);
        });
        create.style.lineHeight = '38px';
        create.style.marginLeft = '5px';
        create.style.marginTop = '5px';
        header = buildGroupHeader(self.group);
        top = div(dh2common.makeLogo(showAccountMenu), header);
        if (self.group && self.group.membership === 'admin') {
            rename = widgets.createIconButton(ipath('description.png'), function () {
                renameGroup(self);
            }, tr('Rename'));
            rename.style.marginLeft = '5px';
            rename.style.marginTop = '5px';
            html.add(top, rename);
            remove = widgets.createSimpleButton(tr('Delete group'), function () {
                deleteGroup(self);
            });
            remove.style.lineHeight = '38px';
            remove.style.marginLeft = '5px';
            remove.style.marginTop = '5px';
            html.add(top, remove);
        }
        html.add(top, topRight);
        bottom = div();
        html.add(container, top);
        html.add(container, bottom);
        dh2common.makeTopBar(top, bottom);
        bottom.style.background = 'orangered';
        bottom.style.border = 'solid 2px yellow';
    }
    function setGroup(group) {
        self.group = group;
        dh2common.redrawWidgetDom(self);
    }
    self.redraw = redraw;
    self.setGroup = setGroup;
    return self;
}
function GroupsScreen() {
    var self = { _type: 'GroupsScreen' };
    function redraw(container) {
        var bottom, create, home, top, topRight, user;
        home = widgets.createDefaultButton(tr('Projects'), goHome);
        home.style.marginTop = '5px';
        home.style.lineHeight = '38px';
        user = widgets.createIconButton(ipath('user-s.png'), onUserClick);
        user.style.marginTop = '5px';
        user.style.marginRight = '0px';
        widgets.addTooltip(user, tr('Account'));
        topRight = div('top-right');
        html.add(topRight, home);
        html.add(topRight, user);
        create = widgets.createSimpleButton(tr('Create group'), function () {
            createGroup(self);
        });
        create.style.lineHeight = '38px';
        create.style.marginLeft = '5px';
        create.style.marginTop = '5px';
        top = div(dh2common.makeLogo(showAccountMenu), div('top-text', {
            text: tr('Groups'),
            'font-size': getHeader2Size(),
            'font-weight': 'bold'
        }), create, topRight);
        bottom = div();
        html.add(container, top);
        html.add(container, bottom);
        dh2common.makeTopBar(top, bottom);
        bottom.style.background = 'darkred';
        bottom.style.border = 'solid 2px yellow';
    }
    function setGroups(groups) {
        groups = groups || [];
    }
    self.redraw = redraw;
    self.setGroups = setGroups;
    return self;
}
function Indicator() {
    var self = { _type: 'Indicator' };
    function render(container) {
        container.style.display = 'inline-block';
        container.style.lineHeight = '40px';
        container.style.paddingLeft = '10px';
    }
    function saved() {
        self.container.style.color = 'green';
        html.setText(self.container, tr('Saved'));
    }
    function saving() {
        self.container.style.color = '#a0a0a0';
        html.setText(self.container, tr('Saving...'));
    }
    self.render = render;
    self.saved = saved;
    self.saving = saving;
    return self;
}
function LoadPath(widget, folder) {
    var _obj_;
    _obj_ = LoadPath_create(widget, folder);
    return _obj_.run();
}
function LoadPath_create(widget, folder) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'LoadPath',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* LoadPath_main() {
        var _branch_, _event_, access, current, parent, parentRaw, path, tree;
        _branch_ = 'Branch1';
        while (true) {
            switch (_branch_) {
            case 'Branch1':
                access = folder.access;
                tree = widget.tree;
                if (folder.parent) {
                    path = [];
                    current = folder;
                    _branch_ = 'Go up';
                } else {
                    tree.setRoots(access, folder.id, folder.children);
                    _branch_ = 'Exit';
                }
                break;
            case 'Go up':
                if (current.parent) {
                    if (tree.exists(current.id)) {
                        tree.updateItem(current);
                        _branch_ = 'Go down';
                    } else {
                        fetchFolder(current.parent).then(me.onFolder);
                        me.state = '63';
                        me._busy = false;
                        _event_ = yield;
                        parentRaw = _event_[1];
                        parent = folderToChange(parentRaw);
                        path.push(parent);
                        current = parent;
                        _branch_ = 'Go up';
                    }
                } else {
                    _branch_ = 'Go down';
                }
                break;
            case 'Go down':
                path.reverse();
                for (current of path) {
                    if (current.parent) {
                        tree.expand(current.id, current.children);
                    } else {
                        tree.setRoots(access, current.id, current.children);
                    }
                }
                _branch_ = 'Select the leaf';
                break;
            case 'Select the leaf':
                tree.select(folder.id);
                _branch_ = 'Exit';
                break;
            case 'Exit':
                _branch_ = undefined;
                widget.spaceId = folder.spaceId;
                dh2common.redrawWidgetDom(tree);
                tree.scrollToView();
                break;
            default:
                _topResolve_();
                return;
            }
        }
    }
    function LoadPath_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = LoadPath_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = LoadPath_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onFolder = function (parentRaw) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '63':
            _args_ = [];
            _args_.push('onFolder');
            _args_.push(parentRaw);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function LoginScreen() {
    var self = { _type: 'LoginScreen' };
    function redraw(container) {
        var accountUrl, form;
        accountUrl = buildAccountUrl('reset');
        form = dh2common.createLogonScreen(self, function () {
            html.goTo(dh2common.getAppRoot());
        }, goToCreateAccount, undefined, accountUrl);
        createLogonLayout(container, form, tr('Login'));
    }
    function setTarget(remain) {
        self.remain = remain;
    }
    self.redraw = redraw;
    self.setTarget = setTarget;
    return self;
}
function NotFound() {
    var self = { _type: 'NotFound' };
    function redraw(container) {
        container.style.position = 'relative';
        html.add(container, div('middle', { text: tr('Document not found') }));
    }
    self.redraw = redraw;
    return self;
}
function ProjectList() {
    var self = { _type: 'ProjectList' };
    function createStyles() {
        html.addClass('img.grid-icon', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px', 'cursor: pointer');
        html.addClass('img.grid-icon:hover', 'background: darkgreen');
        html.addClass('img.grid-icon-passive', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px');
        html.addClass('.grid-container', 'min-height: calc(100% - 46px)', 'position: relative', 'padding-left: 10px', 'padding-right: 10px');
        html.addClass('.list-subheader', 'margin-top:5px', 'margin-bottom:10px', 'font-size: 18px', 'font-weight: bold', 'break-before: column');
    }
    function redraw(container) {
        container.style.padding = '10px';
        container.style.overflowY = 'auto';
        if (!widgets.isNarrowScreen()) {
            container.style.columnWidth = '450px';
            container.style.columnFill = 'auto';
        }
        fillProjectListItems(self);
    }
    function setData(recent, items, highlighted) {
        self.recent = recent;
        self.items = items;
        self.active = highlighted;
        fillProjectListItems(self);
    }
    self.createStyles = createStyles;
    self.redraw = redraw;
    self.setData = setData;
    return self;
}
function ProjectsScreen() {
    var self = { _type: 'ProjectsScreen' };
    function init() {
        self.projects = [];
        self.list = dh2common.createWidget(ProjectList());
        self.list.onItemClick = self.onProjectClick;
    }
    function onProjectClick(folderId) {
        goToFolder(folderId);
    }
    function redraw(container) {
        var bottom, create, top, topRight, user;
        create = widgets.createSimpleButton(tr('Create project'), createProject);
        user = widgets.createIconButton(ipath('settings.png'), onUserClick);
        user.style.marginTop = '5px';
        user.style.marginRight = '0px';
        create.style.marginTop = '5px';
        create.style.lineHeight = '38px';
        topRight = div('top-right');
        if (dh2common.isLoggedOn()) {
            html.add(topRight, create);
        }
        html.add(topRight, user);
        top = div(dh2common.makeLogo(showProjectsMenu), div('top-text', {
            text: tr('Projects'),
            'font-size': getHeader2Size(),
            'font-weight': 'bold'
        }), topRight);
        html.add(container, top);
        bottom = dh2common.buildWidgetDom(container, self.list);
        dh2common.makeTopBar(top, bottom);
    }
    function setProjects(recent, projects) {
        var account, items, last;
        if (recent) {
            utils.sortBy(recent, 'when', 'desc');
            if (widgets.isNarrowScreen()) {
                recent = utils.take(recent, 10);
            } else {
                recent = utils.take(recent, 20);
            }
        } else {
            recent = [];
        }
        projects = projects.slice();
        utils.sortBy(projects, 'space_id');
        items = projects.map(projectToItem);
        last = recallLastProject();
        if (last) {
            last += ' 1';
        }
        self.list.setData(recent, items, last);
        account = dh2common.getAccountObj();
        if (account.must_confirm_email) {
            confirmEmail(account.email);
        }
    }
    self.init = init;
    self.onProjectClick = onProjectClick;
    self.redraw = redraw;
    self.setProjects = setProjects;
    return self;
}
function RecentWidget() {
    var self = { _type: 'RecentWidget' };
    function add(id, type, name) {
        var items, now;
        removeItemCore(self, id);
        self.active = id;
        items = self.items;
        now = new Date().toISOString();
        items.push({
            id: id,
            type: type,
            name: name,
            when: now
        });
        if (items.length > 300) {
            items.shift();
        }
        dh2common.redrawWidgetDom(self);
    }
    function clearActive() {
        if (self.active) {
            self.active = undefined;
            dh2common.redrawWidgetDom(self);
        }
    }
    function init() {
        self.items = [];
        registerDataListener(self.onChange);
    }
    function onChange(change) {
        var _collection_4, _collection_6, _selectValue_2, changeItem, changed, found, id;
        changed = false;
        _selectValue_2 = change.op;
        if (_selectValue_2 === 'update') {
            _collection_6 = change.items;
            for (changeItem of _collection_6) {
                found = utils.findBy(self.items, 'id', changeItem.id);
                if (found && 'name' in changeItem) {
                    found.name = changeItem.name;
                    changed = true;
                }
            }
        } else {
            if (_selectValue_2 === 'delete') {
                _collection_4 = change.items;
                for (id of _collection_4) {
                    if (removeItemCore(self, id)) {
                        changed = true;
                    }
                }
            }
        }
        if (changed) {
            dh2common.redrawWidgetDom(self);
        }
    }
    function redraw(container) {
        var copy, item;
        container.style.overflow = 'auto';
        copy = self.items.slice();
        utils.sortBy(copy, 'when');
        copy.reverse();
        for (item of copy) {
            addRecentItem(container, self, item);
        }
    }
    function removeItem(id) {
        removeItemCore(self, id);
        dh2common.redrawWidgetDom(self);
    }
    function setItems(items) {
        self.items = utils.take(items, 300);
        self.active = undefined;
        dh2common.redrawWidgetDom(self);
    }
    self.add = add;
    self.clearActive = clearActive;
    self.init = init;
    self.onChange = onChange;
    self.redraw = redraw;
    self.removeItem = removeItem;
    self.setItems = setItems;
    return self;
}
function RegisterScreen() {
    var self = { _type: 'RegisterScreen' };
    function redraw(container) {
        var form;
        form = dh2common.createRegisterScreen(self, 'app', function () {
            showWelcome(self);
        }, goToLogon);
        createLogonLayout(container, form, tr('Create account'));
        self.user.focus();
    }
    self.redraw = redraw;
    return self;
}
function ResetScreen() {
    var self = { _type: 'ResetScreen' };
    function init() {
    }
    function redraw(container) {
        var bad, buttons, cancel, email, form, formClass, formStyle, reset;
        formClass = 'middle-h';
        formStyle = {
            padding: '10px',
            width: '300px',
            'max-width': '100vw'
        };
        form = html.createElement('form', {}, [
            formClass,
            formStyle
        ]);
        html.add(form, div('account-title', { text: tr('Reset password') }));
        html.add(form, div({
            text: tr('We will send you a new password by email.'),
            'margin-bottom': '10px'
        }));
        email = addTextControl(form, tr('Email'), 'email', '');
        html.add(form, div({ height: '20px' }));
        bad = div('account-bad');
        reset = widgets.createDefaultButton(tr('Reset password'), function () {
            resetPassword(form, email, bad);
        });
        cancel = widgets.createSimpleButton(tr('Cancel'), goToLogon);
        cancel.style.marginRight = '0px';
        buttons = div({ 'text-align': 'right' });
        html.add(form, buttons);
        html.add(buttons, reset);
        html.add(buttons, cancel);
        html.add(form, bad);
        createLogonLayout(container, form, tr('Reset password'));
    }
    self.init = init;
    self.redraw = redraw;
    return self;
}
function RootWidget() {
    var self = { _type: 'RootWidget' };
    function init(content) {
        self.content = content;
    }
    function redraw(container) {
        var child;
        child = dh2common.buildWidgetDom(container, self.content);
        dh2common.stretchElement(child);
    }
    self.init = init;
    self.redraw = redraw;
    return self;
}
function ScenariosTitle() {
    var title;
    title = tr('scenarios');
    return utils.capitalize(title);
}
function SearchWidget() {
    var self = { _type: 'SearchWidget' };
    function createStyles() {
        html.addClass('.search-container', 'padding:10px', 'overflow-Y: auto');
        html.addClass('.search-container input', 'width: 100%');
        html.addClass('.search-found-item', 'display:block', 'padding: 5px', 'user-select: none', 'cursor: pointer', 'white-space: normal', 'border-bottom: solid 1px #9fd694');
        html.addClass('.search-found-item-active', 'display:block', 'padding: 5px', 'user-select: none', 'cursor: default', 'background:#9fd694', 'white-space: normal', 'border-bottom: solid 1px #9fd694');
        html.addClass('.search-found-item:hover', 'background:#9fd694');
        html.addClass('.search-item-path', 'display:block', 'padding: 0px', 'user-select: none', 'cursor: pointer', 'white-space: normal', 'font-size: 12px', 'color: darkgreen');
        html.addClass('.search-item-name', 'display:block', 'padding: 0px', 'user-select: none', 'cursor: pointer', 'white-space: normal', 'font-size: ' + getHeader2Size(), 'font-weight: bold');
        html.addClass('.search-item-text', 'display:block', 'padding: 0px', 'user-select: none', 'cursor: pointer', 'white-space: normal', 'line-height:1');
        html.addClass('.search-item-match', 'display:inline', 'background:#bfffb0');
    }
    function findReferences(spaceId, name) {
        self.runner.state = undefined;
        self.debouncer.state = undefined;
        self.init();
        self.runner.findReferences(name, true);
    }
    function init() {
        self.found = [];
        self.runner = searchRunner_create(self);
        self.runner.run();
        self.debouncer = utils.debounce_create(self.runner.onInput, 1000);
        self.debouncer.run();
    }
    function redraw(container) {
        var form, foundContainer, input, scontainer, spacer, title;
        container.style.overflowY = 'auto';
        container.style.padding = '10px';
        scontainer = createDiv(container, 'search-container');
        title = createDiv(scontainer, 'title');
        title.style.marginTop = '0px';
        html.addText(title, tr('Search'));
        form = html.createElement('form', { autocomplete: 'off' });
        form.addEventListener('submit', function (evt) {
            evt.preventDefault();
        });
        html.add(container, form);
        input = html.createElement('input', {
            type: 'text',
            id: 'search_input'
        });
        input.autocomplete = 'off';
        input.autocorrect = 'off';
        input.autocapitalize = 'off';
        input.spellcheck = false;
        html.add(form, input);
        spacer = div({ height: '10px' });
        html.add(container, spacer);
        foundContainer = createDiv(container, 'search-found');
        self.foundContainer = foundContainer;
        self.input = input;
        registerEvent(input, 'input', function () {
            self.debouncer.onInput(input.value.trim());
        });
        redrawSearchItems(self);
    }
    function remove(id) {
        var i, item;
        for (i = 0; i < self.found.length; i++) {
            item = self.found[i];
            if (item.id === id) {
                self.found.splice(i, 1);
                break;
            }
        }
    }
    function setSpace(spaceId, folderId) {
        self.folderId = folderId;
        if (!(spaceId === self.spaceId)) {
            self.spaceId = spaceId;
            self.status = undefined;
            clearSearchWidget(self);
            redrawSearchItems(self);
            self.input.value = '';
        }
    }
    self.createStyles = createStyles;
    self.findReferences = findReferences;
    self.init = init;
    self.redraw = redraw;
    self.remove = remove;
    self.setSpace = setSpace;
    return self;
}
function SenderLoop(sender, diagramId) {
    var _obj_;
    _obj_ = SenderLoop_create(sender, diagramId);
    return _obj_.run();
}
function SenderLoopNoPoll(sender) {
    var _obj_;
    _obj_ = SenderLoopNoPoll_create(sender);
    return _obj_.run();
}
function SenderLoopNoPoll_create(sender) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'SenderLoopNoPoll',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* SenderLoopNoPoll_main() {
        var _branch_, _event_, edit, edit2;
        _branch_ = 'Wait';
        while (true) {
            switch (_branch_) {
            case 'Wait':
                me.state = '52';
                me._busy = false;
                _event_ = yield;
                _branch_ = 'Send';
                break;
            case 'Send':
                if (sender.queue.length === 0) {
                    if (sender.indicator) {
                        sender.indicator.saved();
                    }
                    _branch_ = 'Wait';
                } else {
                    if (sender.indicator) {
                        sender.indicator.saving();
                    }
                    edit = sender.queue.pop();
                    edit2 = enrichPayload(sender, edit);
                    sendEditCore(sender.folderId, edit2).then(me.onResponse);
                    me.state = '53';
                    me._busy = false;
                    _event_ = yield;
                    _branch_ = 'Send';
                }
                break;
            default:
                _topResolve_();
                return;
            }
        }
    }
    function SenderLoopNoPoll_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = SenderLoopNoPoll_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = SenderLoopNoPoll_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onItem = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '52':
            _args_ = [];
            _args_.push('onItem');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '53':
            _args_ = [];
            _args_.push('onResponse');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function SenderLoop_create(sender, diagramId) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'SenderLoop',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* SenderLoop_main() {
        var _branch_, _eventType_, _event_, edit, edit2, id, pollId, response, result, timeoutId, timeoutInterval;
        _branch_ = 'Poll';
        while (true) {
            switch (_branch_) {
            case 'Poll':
                pollId = pollTag(sender.folderId, me.onPoll);
                me.state = '62';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onPoll') {
                    response = _event_[1];
                    id = _event_[2];
                    if (id === pollId && response.status === 200) {
                        result = JSON.parse(response.responseText);
                        if (result.tag === sender.tag) {
                            if (sender.queue.length === 0) {
                                _branch_ = 'Wait';
                            } else {
                                _branch_ = 'Send';
                            }
                        } else {
                            goToFolderCore(sender.folderId);
                            _branch_ = 'Exit';
                        }
                    } else {
                        _branch_ = 'Wait';
                    }
                } else {
                    if (!(_eventType_ === 'onItem')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    pollId = undefined;
                    _branch_ = 'Send';
                }
                break;
            case 'Wait':
                if (document.hidden) {
                    timeoutInterval = 8000;
                } else {
                    timeoutInterval = 1500;
                }
                timeoutId = setTimeout(me.onTimeout, timeoutInterval, true);
                me.state = '44';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onItem') {
                    clearTimeout(timeoutId);
                    _branch_ = 'Send';
                } else {
                    if (!(_eventType_ === 'onTimeout')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    _branch_ = 'Poll';
                }
                break;
            case 'Send':
                if (sender.queue.length === 0) {
                    if (sender.indicator) {
                        sender.indicator.saved();
                    }
                    _branch_ = 'Poll';
                } else {
                    if (sender.indicator) {
                        sender.indicator.saving();
                    }
                    edit = sender.queue.pop();
                    edit2 = enrichPayload(sender, edit);
                    sendEditCore(sender.folderId, edit2).then(me.onResponse);
                    me.state = '65';
                    me._busy = false;
                    _event_ = yield;
                    rememberTag(diagramId, edit2.tag);
                    _branch_ = 'Send';
                }
                break;
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                _topResolve_();
                return;
            }
        }
    }
    function SenderLoop_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = SenderLoop_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = SenderLoop_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onItem = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '44':
        case '62':
            _args_ = [];
            _args_.push('onItem');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '44':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onPoll = function (response, id) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '62':
            _args_ = [];
            _args_.push('onPoll');
            _args_.push(response);
            _args_.push(id);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '65':
            _args_ = [];
            _args_.push('onResponse');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function SimpleList() {
    var self = { _type: 'SimpleList' };
    function createStyles() {
        html.addClass('img.grid-icon', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px', 'cursor: pointer');
        html.addClass('img.grid-icon:hover', 'background: darkgreen');
        html.addClass('img.grid-icon-passive', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px');
        html.addClass('.grid-container', 'min-height: calc(100% - 46px)', 'position: relative', 'padding-left: 10px', 'padding-right: 10px');
    }
    function redraw(container) {
        container.style.padding = '10px';
        container.style.overflowY = 'auto';
        container.style.columnWidth = '450px';
        container.style.columnFill = 'auto';
        fillSimpleListItems(self);
    }
    function setData(items, highlighted) {
        self.items = items;
        self.active = highlighted;
        fillSimpleListItems(self);
    }
    self.createStyles = createStyles;
    self.redraw = redraw;
    self.setData = setData;
    return self;
}
function SplitWidget() {
    var self = { _type: 'SplitWidget' };
    function expandClient() {
        self.leftContainer.style.display = 'none';
        self.divider.style.display = 'none';
        self.grab.style.display = 'none';
        self.rightContainer.style.left = '0px';
        self.rightContainer.style.width = '100%';
    }
    function hideMover(evt) {
        if (self.dummy) {
            html.remove(self.dummy);
            self.dummy = undefined;
        }
        setSplitPositions(self, self.currentX);
        dh2common.invokeWindowResize();
    }
    function init(config) {
        self.left = config.left;
        self.right = config.right;
        self.leftWidth = config.leftWidth || 300;
    }
    function moveMover(evt) {
        var dx, rect;
        if (self.dummy) {
            dx = evt.clientX - self.startMouseX;
            self.currentX = self.startX + dx;
            rect = self.container.getBoundingClientRect();
            self.currentX = Math.max(30, self.currentX);
            self.currentX = Math.min(self.currentX, rect.width - 30);
            self.dummy.style.left = self.currentX + 'px';
        }
    }
    function onGrabDown(evt) {
        var dummy, width;
        if (self.dummy) {
        } else {
            if (evt.preventDefault) {
                evt.preventDefault();
            }
            width = 7;
            self.currentX = self.leftWidth;
            self.startX = self.leftWidth;
            self.startMouseX = evt.clientX;
            self.grab.style.position = 'fixed';
            self.grab.style.top = '0px';
            self.grab.style.left = '0px';
            self.grab.style.height = '100vh';
            self.grab.style.width = '100vw';
            dummy = div({
                display: 'inline-block',
                position: 'absolute',
                background: 'black',
                left: self.currentX + 'px',
                top: '0px',
                width: width + 'px',
                height: '100%',
                'border-left': 'solid 1px yellow',
                'border-right': 'solid 1px yellow',
                'z-index': 9
            });
            html.add(self.container, dummy);
            self.dummy = dummy;
        }
    }
    function redraw(container) {
        var lstyle, rstyle;
        container.style.display = 'inline-block';
        container.style.position = 'relative';
        self.leftContainer = dh2common.buildWidgetDom(container, self.left);
        self.rightContainer = dh2common.buildWidgetDom(container, self.right);
        rstyle = self.rightContainer.style;
        lstyle = self.leftContainer.style;
        lstyle.display = 'inline-block';
        lstyle.position = 'absolute';
        lstyle.left = '0px';
        lstyle.top = '0px';
        lstyle.height = '100%';
        rstyle.display = 'inline-block';
        rstyle.position = 'absolute';
        rstyle.top = '0px';
        rstyle.height = '100%';
        self.divider = div({
            display: 'inline-block',
            position: 'absolute',
            background: 'white',
            top: '0px',
            height: '100%',
            'border-left': 'solid 1px #a0a0a0',
            'border-right': 'solid 1px #a0a0a0'
        });
        self.grab = div({
            display: 'inline-block',
            position: 'absolute',
            top: '0px',
            height: '100%',
            'z-index': 10,
            cursor: 'col-resize',
            'user-select': 'none'
        });
        registerEvent(self.grab, 'mousedown', self.onGrabDown);
        registerEvent(self.grab, 'touchstart', wrapTouchEvent(self.onGrabDown));
        registerEvent(self.grab, 'mousemove', self.moveMover);
        registerEvent(self.grab, 'mouseup', self.hideMover);
        registerEvent(self.grab, 'touchmove', wrapTouchEvent(self.moveMover));
        registerEvent(self.grab, 'touchend', self.hideMover);
        registerEvent(self.grab, 'touchcancel', self.hideMover);
        html.add(container, self.divider);
        html.add(container, self.grab);
        setSplitPositions(self, self.leftWidth);
    }
    function restoreClient() {
        self.leftContainer.style.display = 'inline-block';
        self.divider.style.display = 'inline-block';
        self.grab.style.display = 'inline-block';
        setSplitPositions(self, self.leftWidth);
    }
    self.expandClient = expandClient;
    self.hideMover = hideMover;
    self.init = init;
    self.moveMover = moveMover;
    self.onGrabDown = onGrabDown;
    self.redraw = redraw;
    self.restoreClient = restoreClient;
    return self;
}
function TabWidget() {
    var self = { _type: 'TabWidget' };
    function createStyles() {
        html.addClass('.tabs-top', 'white-space: nowrap', 'height:50px', 'padding: 5px', 'border-bottom: solid 1px #a0a0a0');
        html.addClass('.tabs-bottom', 'white-space: nowrap', 'position: relative', 'height:calc(100% - 50px)');
        html.addClass('.tabs-container-selected', 'display: inline-block', 'vertical-align: bottom', 'padding-top:5px', 'padding-left:5px', 'height:40px', 'width:40px', 'margin-right:10px', 'border-bottom: solid 3px darkgreen');
        html.addClass('.tabs-container', 'display: inline-block', 'vertical-align: bottom', 'padding-top:5px', 'padding-left:5px', 'height:40px', 'width:40px', 'margin-right:10px', 'border-bottom: solid 3px white', 'cursor: pointer');
        html.addClass('.tabs-container:hover', 'background: #9fd694', 'border-bottom: #9fd694');
        html.addClass('.tabs-icon', 'display: inline-block', 'width: 30px', 'heigh: 30px', 'vertical-align: top');
    }
    function init(tabs) {
        var firstId, screensMap, tab;
        self.tabs = tabs;
        firstId = tabs[0].id;
        screensMap = {};
        for (tab of tabs) {
            screensMap[tab.id] = tab.widget;
        }
        self.multi = dh2common.createWidget(dh2common.MultiWidget(), {
            current: firstId,
            children: screensMap
        });
    }
    function onHide() {
        self.multi.onHide();
    }
    function onShow() {
        self.multi.onShow();
    }
    function redraw(container) {
        var bottom, top;
        top = div('tabs-top');
        self.top = top;
        html.add(container, top);
        bottom = dh2common.buildWidgetDom(container, self.multi);
        bottom.style.position = 'relative';
        bottom.style.height = 'calc(100% - 50px)';
        redrawTabs(self);
    }
    function selectTab(current) {
        self.multi.setCurrent(current);
        redrawTabs(self);
    }
    self.createStyles = createStyles;
    self.init = init;
    self.onHide = onHide;
    self.onShow = onShow;
    self.redraw = redraw;
    self.selectTab = selectTab;
    return self;
}
function TreeNavigation(screen) {
    var _obj_;
    _obj_ = TreeNavigation_create(screen);
    return _obj_.run();
}
function TreeNavigation_create(screen) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'TreeNavigation',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* TreeNavigation_main() {
        var _branch_, _eventType_, _event_, folder, id, opId;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '10';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'load') {
                    folder = _event_[1];
                    startProcess(me, LoadPath_create(screen, folder));
                } else {
                    if (!(_eventType_ === 'expand')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    id = _event_[1];
                    startProcess(me, ExpandSubtree_create(screen, id));
                }
                screen.tree.lock();
                _branch_ = 'Buzy';
                break;
            case 'Buzy':
                me.state = '33';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'load') {
                    folder = _event_[1];
                    startProcess(me, LoadPath_create(screen, folder));
                    _branch_ = 'Buzy';
                } else {
                    if (!(_eventType_ === 'done')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    opId = _event_[1];
                    if (me.opId === opId) {
                        screen.tree.unlock();
                        if (me.onDone) {
                            me.onDone();
                            me.onDone = undefined;
                        }
                        _branch_ = 'Idle';
                    } else {
                        _branch_ = 'Buzy';
                    }
                }
                break;
            default:
                _topResolve_();
                return;
            }
        }
    }
    function TreeNavigation_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = TreeNavigation_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = TreeNavigation_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.load = function (folder) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
        case '33':
            _args_ = [];
            _args_.push('load');
            _args_.push(folder);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.expand = function (id) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
            _args_ = [];
            _args_.push('expand');
            _args_.push(id);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.done = function (opId) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '33':
            _args_ = [];
            _args_.push('done');
            _args_.push(opId);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function TreeView() {
    var self = { _type: 'TreeView' };
    function click(evt, id) {
        var item;
        item = getTreeItem(self, id);
        if (!(item.error || (self.selected === id || self.locked))) {
            self.select(id);
            dh2common.redrawWidgetDom(self);
            if (self.onClick) {
                self.onClick(id);
            }
        }
    }
    function collapse(id) {
        var _collection_2, childId, item;
        if (!self.locked) {
            item = getTreeItem(self, id);
            _collection_2 = item.children;
            for (childId of _collection_2) {
                removeTreeNode(self, childId);
            }
            item.expanded = false;
            item.children = [];
        }
    }
    function copyTreeNode(item) {
        copyToFolderClipboard([item]);
        reportClip();
    }
    function createStyles() {
        html.addClass('.tree-background', 'display: inline-block', 'overflow: auto', 'background: white');
        html.addClass('.tree-table', 'width: 100%', 'touch-action: pan-x pan-y', 'user-select: none', '-webkit-user-select: none', '-webkit-touch-callout: none');
        html.addClass('.tree-table td', 'width: 100%', 'user-select: none', 'white-space: nowrap');
        html.addClass('.tree-normal:hover', 'background: #9fd694');
        html.addClass('.tree-item-text', 'display: inline-block', 'line-height: 30px', 'user-select: none', 'cursor: default', 'vertical-align: top', 'padding-left: 5px', 'padding-right: 5px');
        html.addClass('.tree-item-text-cut', 'color: #c0c0c0');
        html.addClass('.tree-active', 'background: #9fd694');
        html.addClass('.tree-selected', 'background: darkgreen', 'color:white');
        html.addClass('img.tree-grid-icon', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px');
    }
    function cutTreeNode(item) {
        cutToFolderClipboard([item]);
        reportClip();
    }
    function doubleClick(evt, id) {
        var item;
        if (self.onDoubleClick) {
            item = getTreeItem(self, id);
            self.onDoubleClick(evt, item);
        }
    }
    function exists(id) {
        return id in self.items;
    }
    function expand(id, children) {
        var _collection_2, child, childId, item;
        item = getTreeItem(self, id);
        _collection_2 = item.children;
        for (childId of _collection_2) {
            removeTreeNode(self, childId);
        }
        item.children = [];
        for (child of children) {
            item.children.push(child.id);
            addTreeItem(self, child);
        }
        item.expanded = true;
    }
    function init() {
        self.roots = [];
        self.items = {};
    }
    function insert(item) {
        var parent;
        if (self.rootId === item.parent) {
            self.roots.push(item.id);
            addTreeItem(self, item);
        } else {
            if (self.exists(item.parent)) {
                parent = getTreeItem(self, item.parent);
                if (parent.expanded) {
                    parent.children.push(item.id);
                    addTreeItem(self, item);
                } else {
                }
            } else {
            }
        }
    }
    function lock() {
        self.locked = true;
    }
    function longTap(evt, id) {
    }
    function onNodeContext(evt, id) {
        var item, items;
        evt.preventDefault();
        self.setActive(id);
        rebuildTreeView(self);
        item = getTreeItem(self, id);
        if (!item.error) {
            items = fillTreeNodeMenu(self, item);
            widgets.showContextMenu(evt.clientX, evt.clientY, items);
        }
        return false;
    }
    function onTreeBackContext(evt) {
        var container, items;
        container = self.innerContainer;
        if (evt.target === container) {
            evt.preventDefault();
            items = [];
            if (!(self.access === 'read')) {
                if (getFolderClipboard()) {
                    items.push({
                        text: tr('Paste'),
                        action: function () {
                            self.pasteInTree(self.rootId);
                        }
                    });
                    items.push({ type: 'separator' });
                }
                addCreateBlock(self, self.rootId, items);
                if (!(items.length === 0)) {
                    widgets.showContextMenu(evt.clientX, evt.clientY, items);
                }
            }
            return false;
        }
    }
    async function pasteInTree(parentId) {
        await pasteFromClipboard(parentId);
    }
    function redraw(container) {
        var innerContainer;
        innerContainer = div('tree-background');
        dh2common.stretchElement(innerContainer);
        self.innerContainer = innerContainer;
        html.add(container, innerContainer);
        self.table = html.createElement('table', {}, ['tree-table']);
        html.add(innerContainer, self.table);
        rebuildTreeView(self);
        innerContainer.scrollTop = self.scrollTop;
        innerContainer.scrollLeft = self.scrollLeft;
        registerEvent(innerContainer, 'contextmenu', self.onTreeBackContext);
        registerEvent(innerContainer, 'scroll', function () {
            recordScroll(self);
        });
    }
    function remove(id) {
        var item, parent;
        if (self.exists(id)) {
            item = getTreeItem(self, id);
            if (self.exists(item.parent)) {
                parent = getTreeItem(self, item.parent);
                utils.remove(parent.children, id);
            } else {
                utils.remove(self.roots, id);
            }
            removeTreeNode(self, id);
        }
    }
    function requestExpand(evt, id) {
        var item;
        if (evt) {
            evt.stopPropagation();
        }
        if (self.onExpand && !self.locked) {
            item = getTreeItem(self, id);
            item.expanded = true;
            renderTreeNode(self, item);
            self.onExpand(id);
        }
    }
    function scrollToView() {
        var item, itemRect, itemTop, newScroll, rect;
        if (self.selected) {
            item = getTreeItem(self, self.selected);
            itemRect = item.container.getBoundingClientRect();
            rect = self.container.getBoundingClientRect();
            if (itemRect.top < 0 || itemRect.top > rect.height - 30) {
                itemTop = itemRect.top + self.container.scrollTop;
                newScroll = Math.floor(itemTop - rect.height / 2);
                self.container.scrollTop = newScroll;
            }
        }
    }
    function select(id) {
        self.selected = id;
        self.active = undefined;
    }
    function set() {
    }
    function setActive(id) {
        self.active = id;
    }
    function setRoots(access, rootId, roots) {
        var root;
        self.scrollTop = 0;
        self.scrollLeft = 0;
        self.items = {};
        self.roots = [];
        self.active = undefined, self.selected = undefined;
        self.scrollTop = 0;
        self.access = access;
        self.rootId = rootId;
        if (self.beh) {
            self.beh.stop();
        }
        self.beh = dh2common.createLongClicker(self);
        for (root of roots) {
            addTreeItem(self, root);
            self.roots.push(root.id);
        }
    }
    function unlock() {
        self.locked = false;
    }
    function update(fields) {
        var id;
        id = fields.id;
        if (self.exists(id)) {
            self.updateItem(fields);
            if (fields.children) {
                self.expand(id, fields.children);
            }
        } else {
            if (self.rootId === id && fields.children) {
                self.setRoots(self.access, id, fields.children);
            }
        }
    }
    function updateItem(fields) {
        var id, item;
        id = fields.id;
        item = getTreeItem(self, id);
        if (fields.name) {
            item.name = fields.name;
        }
        if (fields.type) {
            item.type = fields.type;
        }
    }
    self.click = click;
    self.collapse = collapse;
    self.copyTreeNode = copyTreeNode;
    self.createStyles = createStyles;
    self.cutTreeNode = cutTreeNode;
    self.doubleClick = doubleClick;
    self.exists = exists;
    self.expand = expand;
    self.init = init;
    self.insert = insert;
    self.lock = lock;
    self.longTap = longTap;
    self.onNodeContext = onNodeContext;
    self.onTreeBackContext = onTreeBackContext;
    self.pasteInTree = pasteInTree;
    self.redraw = redraw;
    self.remove = remove;
    self.requestExpand = requestExpand;
    self.scrollToView = scrollToView;
    self.select = select;
    self.set = set;
    self.setActive = setActive;
    self.setRoots = setRoots;
    self.unlock = unlock;
    self.update = update;
    self.updateItem = updateItem;
    return self;
}
function UiChooser() {
    var self = { _type: 'UiChooser' };
    function resize() {
        if (gconfig.pad && (self.id && !(self.narrow === widgets.isNarrowScreen()))) {
            console.log('UiChooser: invoking goToFolderCore');
            cleanupOnMove();
            goToFolderCore(self.id);
        }
    }
    function setCurrentFolder(id) {
        self.id = id;
        self.narrow = widgets.isNarrowScreen();
    }
    self.resize = resize;
    self.setCurrentFolder = setCurrentFolder;
    return self;
}
function accountDetails(widget, parent) {
    var account, bad, email, emailStatus, form, good, save, username;
    account = widget.account;
    setAccountTitle(parent, account, tr('Details'));
    form = html.createElement('form');
    html.add(parent, form);
    username = addTextControl(form, tr('User name'), 'username', account.name);
    email = addTextControl(form, tr('Email'), 'email', account.email);
    emailStatus = div({ 'padding': '10px' });
    html.add(form, emailStatus);
    if (account.must_confirm_email) {
        html.add(emailStatus, widgets.createSimpleButton(tr('Confirm email'), function () {
            confirmEmailFromDetails(account.email);
        }));
    } else {
        html.add(emailStatus, div({ text: tr('Email confirmed') }));
    }
    dh2common.createCheckboxOnForm(widget, form, account.marketing, 'marketingCheck', tr('I agree to receive marketing emails.'));
    good = div('account-good');
    bad = div('account-bad');
    save = widgets.createDefaultButton(tr('Save'), function () {
        saveDetails(widget, username, email, good, bad);
    });
    html.add(parent, div({ height: '20px' }));
    html.add(parent, save);
    html.add(parent, good);
    html.add(parent, bad);
    html.add(parent, div({ height: '20px' }));
    html.add(parent, div({ text: tr('Download all the information we hold about you. Projects can be downloaded separately.') }));
    html.add(parent, div({ height: '10px' }));
    html.add(parent, widgets.createSimpleButton(tr('Download'), downloadMyData));
}
function accountLanguage(widget, parent) {
    var account, form, settings;
    account = widget.account;
    settings = widget.settings;
    setAccountTitle(parent, account, tr('Language'));
    form = html.createElement('form');
    html.add(parent, form);
    fillLanguageForm(form, settings, saveLanguage, undefined);
}
function accountPassword(widget, parent) {
    var account, bad, controls, new1, new2, old, save;
    account = widget.account;
    setAccountTitle(parent, account, tr('Password'));
    controls = html.createElement('form');
    html.add(parent, controls);
    controls = div();
    html.add(parent, controls);
    old = addTextControl(controls, tr('Old password'), 'password', '');
    new1 = addTextControl(controls, tr('New password'), 'password', '');
    new2 = addTextControl(controls, tr('Repeat password'), 'password', '');
    old.id = 'reset_old';
    new1.id = 'reset_new1';
    new2.id = 'reset_new2';
    bad = div('account-bad');
    save = widgets.createDefaultButton(tr('Change password'), function () {
        changePassword(controls, old, new1, new2, bad);
    });
    html.add(controls, div({ height: '20px' }));
    html.add(controls, save);
    html.add(controls, bad);
}
function accountPayments(widget, parent) {
    var account;
    account = widget.account;
    setAccountTitle(parent, account, tr('Payments'));
    loadPayments(parent);
}
function accountSessions(widget, parent) {
    var account;
    account = widget.account;
    setAccountTitle(parent, account, tr('Sessions'));
    loadSessions(parent);
}
function accountSubscription(widget, parent) {
    var account, remove;
    account = widget.account;
    setAccountTitle(parent, account, tr('Subscription'));
    if (gconfig.groups) {
        html.add(parent, div({ 'padding-top': '10px' }, widgets.createSimpleButton(tr('Groups'), goToGroups)));
    }
    if (account.license) {
        showLicense(parent, account.license);
    } else {
        html.add(parent, div({ 'padding-top': '10px' }, widgets.createDefaultButton(tr('Buy license'), gotoBuyFromSubscription)));
    }
    html.add(parent, div({ height: '100px' }));
    remove = widgets.createBadButton(tr('Delete account'), function () {
        deleteAccount(account.user_id, account.name);
    });
    html.add(parent, remove);
}
function addAccessLine(table, access) {
    var link, url;
    url = dh2common.buildUrlForFolder(access.space_id + ' 1');
    link = html.createElement('a', {
        href: url,
        target: '_blank'
    }, [{ text: access.name }]);
    html.add(table, html.createElement('tr', {}, [
        td({ padding: '5px' }, link),
        td({
            padding: '5px',
            text: tr(access.access)
        })
    ]));
}
function addAccountSection(parent) {
    if (dh2common.isLoggedOn()) {
        html.add(parent, dh2common.createMenuSection(tr('Account'), [
            [
                tr('Details'),
                function () {
                    goToAccount('details');
                }
            ],
            [
                tr('Language'),
                function () {
                    goToAccount('language');
                }
            ],
            [
                tr('Password'),
                function () {
                    goToAccount('password');
                }
            ],
            [
                tr('Subscription'),
                function () {
                    goToAccount('subscription');
                }
            ],
            [
                tr('Payments'),
                function () {
                    goToAccount('payments');
                }
            ]
        ]));
    } else {
        html.add(parent, dh2common.createMenuSection(tr('Account'), [
            [
                tr('Login'),
                goToLogon
            ],
            [
                tr('Create account'),
                goToCreateAccount
            ]
        ]));
    }
}
function addAddUser(parent, container, user) {
    var icon, line;
    icon = createIconImg(ipath('user-s.png'), 'grid-icon-passive');
    line = div('grid-item', { cursor: 'pointer' }, icon);
    html.addText(line, user.name);
    registerEvent(line, 'click', function () {
        parent.onUserSelected(user);
    });
    html.add(container, line);
}
function addAdminNavItem(widget, parent, id, label) {
    var item, itemClass;
    if (widget.page === id) {
        itemClass = 'grid-item-active';
    } else {
        itemClass = 'grid-item';
    }
    item = div(itemClass, {
        text: label,
        padding: '10px'
    });
    if (!(widget.page === id)) {
        item.style.cursor = 'pointer';
        registerEvent(item, 'click', function () {
            goToAdmin(id);
        });
    }
    html.add(parent, item);
}
function addAdminSection(parent) {
    var account;
    account = dh2common.getAccountObj();
    if (account.is_admin) {
        html.add(parent, dh2common.createMenuSection(tr('Admin'), [
            [
                tr('User administration'),
                function () {
                    goToAdmin('user');
                }
            ],
            [
                tr('Feedback'),
                function () {
                    goToAdmin('feedback');
                }
            ],
            [
                tr('Server errors'),
                function () {
                    goToAdmin('server');
                }
            ],
            [
                tr('Client errors'),
                function () {
                    goToAdmin('client');
                }
            ],
            [
                tr('Server diagnostics'),
                function () {
                    goToAdmin('diagnostics');
                }
            ],
            [
                tr('Reports'),
                function () {
                    goToAdmin('reports');
                }
            ],
            [
                tr('Payments'),
                function () {
                    goToAdmin('payments');
                }
            ],
            [
                tr('Funnel'),
                function () {
                    goToAdmin('funnel');
                }
            ]
        ]));
    }
}
function addBlocks(output, users, operation, action) {
    var userIds;
    if (!(users.length === 0)) {
        userIds = users.map(function (user) {
            return user.user_id;
        });
        output.blocks.push({
            workspace: output.spaceId,
            operation: operation,
            action: action,
            users: userIds
        });
    }
}
function addCreateBlock(widget, parentId, items) {
    items.push({
        text: tr('Create drakon flowchart'),
        icon: ipath('list-drakon2.png'),
        action: function (evt) {
            return createDocumentCore(parentId, evt, 'drakon');
        }
    });
    items.push({
        text: tr('Create mind map'),
        icon: ipath('list-mind.png'),
        action: function (evt) {
            return createDocumentCore(parentId, evt, 'graf');
        }
    });
    if (gconfig.free) {
        items.push({
            text: tr('Create free diagram'),
            icon: ipath('list-free.png'),
            action: function (evt) {
                return createDocumentCore(parentId, evt, 'free');
            }
        });
    }
    items.push({
        text: tr('Create folder'),
        icon: ipath('folder-s2.png'),
        action: function (evt) {
            return createFolderGeneric(widget, parentId, evt);
        }
    });
}
function addCreateFolderSection(widget, parent) {
    if (dh2common.isLoggedOn() && !isReadonly()) {
        html.add(parent, dh2common.createMenuSection(tr('Create'), [
            [
                tr('Create document'),
                function (evt) {
                    createDocumentFromDiagramScreen(widget, evt);
                }
            ],
            [
                tr('Create folder'),
                function (evt) {
                    createFolderFromDiagramScreen(widget, evt);
                }
            ]
        ]));
    }
}
function addCreateProjectSection(parent) {
    if (dh2common.isLoggedOn()) {
        html.add(parent, dh2common.createMenuSection(tr('Create'), [[
                tr('Create project'),
                createProject
            ]]));
    }
}
function addCrumb(widget, path, index) {
    var callback, element, id, step, text;
    if (!(gconfig.pad && index === 0)) {
        html.add(widget.container, div('bread-slash', { text: '/' }));
    }
    step = path[index];
    id = step.id;
    if (index === widget.path.length - 1) {
        element = div('bread-item');
        if (widget.path.length === 1) {
            element.style.paddingTop = '7px';
        } else {
            html.add(widget.container, html.createElement('br'));
        }
    } else {
        element = div('bread-item-link');
        callback = function () {
            goToFolder(id);
        };
        registerEvent(element, 'click', callback);
    }
    text = step.name;
    html.setText(element, text);
    html.add(widget.container, element);
    step.element = element;
    step.id = id;
}
function addDeleteSpaces(dialog, spaces) {
    var space, ul;
    if (!(spaces.length === 0)) {
        html.add(dialog, div({ text: tr('The following projects will also be deleted forever:') }));
        ul = html.createElement('ul');
        html.add(dialog, ul);
        for (space of spaces) {
            html.add(ul, html.createElement('li', {}, [{ text: space.name }]));
        }
    }
}
function addDescription(widget, container, title, parentId, prop, left, top, style) {
    addEditableCore(widget, container, title, parentId, prop, left, top, style, 810, 200);
}
function addDiagramType(parent, imageSrc, header, description, action) {
    var container, containerStyle, descDiv, headerDiv, icon, textBlock;
    icon = img(imageSrc);
    icon.style.display = 'inline-block';
    icon.style.width = '80px';
    icon.style.verticalAlign = 'middle';
    headerDiv = div({
        'font-weight': 'bold',
        'font-size': getHeader2Size(),
        'text-align': 'center',
        'padding-bottom': '5px',
        text: tr(header)
    });
    descDiv = div({
        'text-align': 'center',
        'white-space': 'normal',
        text: tr(description),
        'font-size': gconfig.fontSize + 'px'
    });
    textBlock = div({
        display: 'inline-block',
        'vertical-align': 'middle',
        'padding-left': '10px',
        width: '240px'
    }, headerDiv, descDiv);
    containerStyle = {
        'white-space': 'nowrap',
        'height': '120px',
        'padding': '10px'
    };
    container = div('active-border', containerStyle, icon, textBlock);
    html.add(parent, container);
    registerEvent(container, 'click', action);
}
function addDownloadTableButton(container, table, filename) {
    var callback;
    callback = function () {
        downloadTable(table, filename);
    };
    html.add(container, div({ 'padding': '10px' }, widgets.createSimpleButton(tr('Download'), callback)));
}
function addEditable(widget, container, title, parentId, prop, left, top, style) {
    addEditableCore(widget, container, title, parentId, prop, left, top, style, 400, 90);
}
function addEditableCore(widget, container, title, parentId, prop, left, top, style, width, height) {
    var diagram, editable, id, item, parent, value;
    diagram = widget.diagram;
    parent = diagram.items[parentId];
    id = parent[prop];
    item = diagram.items[id];
    if (item) {
        value = item.text || '';
        editable = createInlineEdit({
            title: tr(title),
            value: value,
            onInput: function (newValue) {
                enneScheduleChange(widget, id, 'text', newValue);
            },
            left: left,
            top: top,
            width: width,
            height: height,
            style: style
        });
        html.add(container, editable);
    }
}
function addFileSection(widget, parent) {
    var items, parentId;
    items = [];
    parentId = getParent(widget);
    if (isDrakon()) {
        if (!gconfig.desktop) {
            if (!isReadonly()) {
                items.push([
                    tr('Import diagram file'),
                    function () {
                        importJson(parentId);
                    }
                ]);
            }
            items.push([
                tr('Export to diagram file'),
                function () {
                    dh2common.saveAsJson(widget.drakon);
                }
            ]);
        }
        if (isDrakonDrakon()) {
            items.push([
                ScenariosTitle(),
                widget.drakon.showScenarios
            ]);
        }
        items.push('separator');
        items.push([
            tr('Save as picture') + ' \xD74',
            function () {
                dh2common.saveAsPng(widget.drakon, 4);
            }
        ]);
        items.push([
            tr('Save as picture') + ' \xD72',
            function () {
                dh2common.saveAsPng(widget.drakon, 2);
            }
        ]);
        items.push('separator');
        items.push([
            tr('Save as picture') + ': SVG',
            function () {
                dh2common.saveAsSvg(widget.drakon);
            }
        ]);
        items.push([
            tr('Save as picture') + ': PNG',
            function () {
                dh2common.saveAsPng(widget.drakon, 1);
            }
        ]);
        html.add(parent, dh2common.createMenuSection(tr('File'), items));
    } else {
        if (!isReadonly()) {
            items = [[
                    tr('Import diagram file'),
                    function () {
                        importJson(parentId);
                    }
                ]];
            html.add(parent, dh2common.createMenuSection(tr('File'), items));
        }
    }
}
function addFindAllReferences(item, items) {
    var parsed, spaceId;
    parsed = parseId(item.id);
    spaceId = parsed.spaceId;
    items.push({
        text: tr('Find all references'),
        action: function () {
            startReferenceSearch(spaceId, item.name);
        }
    });
    items.push({ type: 'separator' });
}
async function addFolderToRecent(folderPath) {
    var recent, recent2;
    await fetchRecentFolders();
    recent = getRecentFolders();
    recent2 = recent.filter(folder => folder != folderPath);
    recent2.unshift(folderPath);
    await padBridge.saveRecentFolders(recent2);
}
function addGoToGroups(items) {
    if (dh2common.isLoggedOn() && gconfig.groups) {
        items.push([
            tr('Groups'),
            goToGroups
        ]);
    }
}
function addGotoFileSection(parent) {
    var items;
    items = [
        [
            tr('Projects'),
            goHome
        ],
        [
            tr('Home'),
            goToHomePage
        ]
    ];
    addGoToGroups(items);
    html.add(parent, dh2common.createMenuSection(tr('Go to'), items));
}
function addGotoProjectSession(parent) {
    var items;
    items = [[
            tr('Home'),
            goToHomePage
        ]];
    addGoToGroups(items);
    html.add(parent, dh2common.createMenuSection(tr('Go to'), items));
}
function addNavItem(widget, parent, id, label) {
    var item, itemClass;
    if (widget.page === id) {
        itemClass = 'grid-item-active';
    } else {
        itemClass = 'grid-item';
    }
    item = div(itemClass, {
        text: label,
        padding: '10px'
    });
    if (!(widget.page === id)) {
        item.style.cursor = 'pointer';
        registerEvent(item, 'click', function () {
            goToAccount(id);
        });
    }
    html.add(parent, item);
}
function addNoResults(dialog) {
    html.add(dialog, div({
        'line-height': '70px',
        color: '#c0c0c0',
        'text-align': 'center',
        text: tr('No items')
    }));
}
function addNotFound(container, text) {
    var line;
    line = div({
        'padding-top': '20px',
        text: text
    });
    html.add(container, line);
}
function addRecentItem(container, widget, item) {
    var contClass, id, image, itemContainer;
    id = item.id;
    if (widget.active === id) {
        contClass = 'grid-item-active';
    } else {
        contClass = 'grid-item';
    }
    image = getNodeIcon(item.type);
    itemContainer = div(contClass, img(image, 'grid-icon-passive'), div('grid-item-text', { text: item.name }));
    html.add(container, itemContainer);
    if (!(widget.active === id)) {
        registerEvent(itemContainer, 'click', function () {
            goToFolder(id);
        });
    }
}
function addSubHeader(parent, title) {
    html.add(parent, div({
        'font-size': getHeader1Size(),
        'font-weight': 'bold',
        text: title,
        'margin-top': '20px',
        'margin-bottom': '10px'
    }));
}
function addTableRow(table, cells, tag) {
    var cell, td, tr;
    tr = html.createElement('tr');
    html.add(table, tr);
    for (cell of cells) {
        td = html.createElement(tag);
        html.setText(td, cell);
        html.add(tr, td);
    }
}
function addTextControl(parent, label, type, value) {
    var input, labelDiv;
    labelDiv = div('account-control-label', { text: label });
    input = html.createElement('input', { type: type });
    input.value = value;
    html.add(parent, div('account-control-container', labelDiv, input));
    return input;
}
function addToHistory(widget, folder) {
    widget.recent.add(folder.id, folder.type, folder.name);
}
function addTreeItem(widget, item) {
    var children, copy;
    copy = utils.clone(item);
    widget.items[item.id] = copy;
    children = item.children || [];
    copy.children = children.slice();
}
function addUserLine(parent, dialog, prop, user) {
    var line, remove, text;
    remove = createIconImg(ipath('delete.png'));
    registerEvent(remove, 'click', function () {
        parent.removeUser(prop, user.user_id);
    });
    text = div({
        'display': 'inline-block',
        'line-height': '30px',
        text: user.name
    });
    line = div({ 'margin-bottom': '5px' }, remove, text);
    html.add(dialog, line);
}
function addUsersBlock(parent, dialog, title, access, prop) {
    var action, add, text, titleDiv, user, users;
    text = div({
        'font-weight': 'bold',
        'line-height': '40px',
        text: title
    });
    action = function () {
        parent.addUser(prop);
    };
    add = widgets.createSimpleButton(tr('Add user'), action);
    add.style.top = '5px';
    add.style.right = '0px';
    add.style.position = 'absolute';
    titleDiv = div({
        'border-top': 'solid 1px green',
        position: 'relative',
        'padding-top': '5px',
        height: '50px'
    }, text, add);
    html.add(dialog, titleDiv);
    users = access[prop];
    if (users.length === 0) {
        addNoResults(dialog);
    } else {
        users.sort();
        for (user of users) {
            addUserLine(parent, dialog, prop, user);
        }
        html.add(dialog, div({ height: '40px' }));
    }
}
async function allPaymentsScreen(widget, container) {
    var amount, line, payments, response, row, table, th;
    setAdminTitle(container, tr('Payments'));
    showWait();
    response = await sendRequest('GET', '/api/get_all_payments');
    hideWait();
    payments = response.payments;
    console.log(payments);
    if (payments && !(payments.length === 0)) {
        utils.sortBy(payments, 'payment_date', 'desc');
        table = html.createElement('table');
        html.add(container, table);
        table.className = 'common-table';
        th = createTag(table, 'tr');
        createTag(th, 'th', tr('Date'));
        createTag(th, 'th', tr('User id'));
        createTag(th, 'th', tr('User name'));
        createTag(th, 'th', tr('Amount'));
        for (line of payments) {
            row = createTag(table, 'tr');
            createTag(row, 'td', formatDate(line.payment_date));
            createTag(row, 'td', line.user_id);
            createTag(row, 'td', line.user_name);
            amount = createTag(row, 'td', line.amount + ' руб.');
            amount.style.textAlign = 'right';
        }
    } else {
        createTag(container, 'div', tr('No payments'));
    }
}
function appendFoundItems(widget, found) {
    var item;
    for (item of found) {
        renderFoundItem(widget, item);
    }
}
function applyEditBad(widget, change) {
    if ('name' in change) {
        reportUpdate([change]);
    } else {
        updateDiagramCore(widget, change);
    }
}
async function backupProject(spaceId, name) {
    var response, url;
    trace('backupProject', spaceId);
    url = '/api/backup/' + spaceId;
    response = await sendRequest('GET', url);
    if (window.padBridge && window.padBridge.saveBinary) {
        window.padBridge.saveBinary(response.filename, response.base64);
    } else {
        url = response.url;
        if (!url) {
            url = 'data:application/zip;base64,' + response.base64;
        }
        downloadLink(url, response.filename);
    }
}
function baseUrl() {
    return gconfig.baseUrl;
}
function buildAccountUrl(page) {
    var baseUrl;
    baseUrl = buildBaseUrl();
    return baseUrl + '?account=' + page;
}
function buildAdminUrl(page) {
    var baseUrl;
    baseUrl = buildBaseUrl();
    return baseUrl + '?admin=' + page;
}
function buildAppRoot() {
    var account, banner, mainDiv, root;
    root = dh2common.createRootElement();
    html.clear(root);
    account = dh2common.getAccountObj();
    if (gconfig.dead) {
        banner = createTopBanner('Сохраните ваши диаграммы на компьютер! ДраконПро будет отключен 1 октября 2026.', tr('Как сохранить'), gconfig.dead, '#ff9d87');
        mainDiv = div({
            height: 'calc(100% - 50px)',
            position: 'relative'
        });
        html.add(root, banner);
        html.add(root, mainDiv);
        return mainDiv;
    } else {
        if (account.license_expired) {
            banner = createTopBanner(tr('Your license has expired.' + ' To enable editing of diagrams, renew your license.'), tr('Buy license'), gconfig.pricesPage + '?bsource=banner');
            mainDiv = div({
                height: 'calc(100% - 50px)',
                position: 'relative'
            });
            html.add(root, banner);
            html.add(root, mainDiv);
            return mainDiv;
        } else {
            return root;
        }
    }
}
function buildBaseUrl() {
    return window.location.origin + window.location.pathname;
}
function buildCountRow(bucket) {
    var result;
    result = bucket.values.slice();
    result.push(bucket.count);
    return result;
}
function buildCsvFromTable(table) {
    var _collection_2, row, rows;
    rows = [table.columns.join(';')];
    _collection_2 = table.rows;
    for (row of _collection_2) {
        rows.push(row.join(';'));
    }
    return rows.join('\n');
}
function buildGroupHeader(group) {
    var groups, name;
    groups = div('bread-item-link', { text: tr('Groups') });
    registerEvent(groups, 'click', goToGroups);
    if (group) {
        name = group.name;
    } else {
        name = '';
    }
    return div({
        display: 'inline-block',
        'vertical-align': 'top'
    }, groups, html.createElement('br'), div('bread-item', { text: name }));
}
function buildGroupUrl(groupId) {
    var baseUrl;
    baseUrl = buildBaseUrl();
    return baseUrl + '?group=' + groupId;
}
function buildGroupsUrl() {
    var baseUrl;
    baseUrl = buildBaseUrl();
    return baseUrl + '?group=list';
}
function buildHtmlTableFromData(data) {
    var _collection_2, row, table;
    table = html.createElement('table');
    table.className = 'report-table';
    addTableRow(table, data.columns, 'th');
    _collection_2 = data.rows;
    for (row of _collection_2) {
        addTableRow(table, row, 'td');
    }
    return table;
}
async function buildItemsForPaste(folders, parentId) {
    var _collection_2, child, chosenName, folder, item, items, lowName, name, namesInParent, parent;
    namesInParent = {};
    parent = await fetchFolder(parentId);
    if (parent.children) {
        _collection_2 = parent.children;
        for (child of _collection_2) {
            name = child.name.toLowerCase();
            namesInParent[name] = true;
        }
    }
    items = [];
    for (folder of folders) {
        item = makeServerItemFromFolder(folder);
        lowName = folder.name.toLowerCase();
        if (lowName in namesInParent) {
            chosenName = findUniqueName(namesInParent, folder.name);
            item.new_name = chosenName;
        } else {
            chosenName = folder.name;
        }
        namesInParent[chosenName.toLowerCase()] = true;
        items.push(item);
    }
    return items;
}
function buildLanguageSettings(languageControls) {
    var bad, branch, end, exit, good, no, settings, ui, yes;
    ui = languageControls.ui;
    yes = languageControls.yes;
    no = languageControls.no;
    end = languageControls.end;
    branch = languageControls.branch;
    exit = languageControls.exit;
    good = languageControls.good;
    bad = languageControls.bad;
    good.style.display = 'none';
    bad.style.display = 'none';
    if (checkLabelNotEmpty(yes, bad) && checkLabelNotEmpty(no, bad) && checkLabelNotEmpty(end, bad) && checkLabelNotEmpty(branch, bad) && checkLabelNotEmpty(exit, bad)) {
        settings = {
            yes: yes.value.trim(),
            no: no.value.trim(),
            end: end.value.trim(),
            branch: branch.value.trim(),
            exit: exit.value.trim()
        };
        settings.language = ui.value;
        return settings;
    } else {
        return undefined;
    }
}
function buildSpacesList(account) {
    var _collection_2, access, spaceId, spaces;
    if (account && account.spaces_access) {
        spaces = account.spaces_access;
    } else {
        spaces = [];
    }
    _collection_2 = unit.globals.accessToProjects;
    for (spaceId in _collection_2) {
        access = _collection_2[spaceId];
        if (!utils.findBy(spaces, 'space_id', spaceId)) {
            spaces.push(access);
        }
    }
    return spaces;
}
function calculateAccessDifference(oldAccess, newAccess, spaceId) {
    var adminAdd, adminRemove, newPublic, oldPublic, output, readAdd, readRemove, writeAdd, writeRemove;
    readAdd = subtractUserList(newAccess.readers, oldAccess.readers);
    readRemove = subtractUserList(oldAccess.readers, newAccess.readers);
    writeAdd = subtractUserList(newAccess.writers, oldAccess.writers);
    writeRemove = subtractUserList(oldAccess.writers, newAccess.writers);
    adminAdd = subtractUserList(newAccess.admins, oldAccess.admins);
    adminRemove = subtractUserList(oldAccess.admins, newAccess.admins);
    oldPublic = oldAccess['public'];
    newPublic = newAccess['public'];
    output = {
        setPublicAccess: oldPublic !== newPublic,
        publicAccess: newPublic,
        spaceId: spaceId,
        blocks: []
    };
    addBlocks(output, readAdd, 'read', 'grant');
    addBlocks(output, readRemove, 'read', 'revoke');
    addBlocks(output, writeAdd, 'write', 'grant');
    addBlocks(output, writeRemove, 'write', 'revoke');
    addBlocks(output, adminAdd, 'admin', 'grant');
    addBlocks(output, adminRemove, 'admin', 'revoke');
    if (output.setPublicAccess || !(output.blocks.length === 0)) {
        return output;
    } else {
        return undefined;
    }
}
async function changeAccessAndReload(spaceId, name) {
    var changed;
    changed = await showAccessRights(spaceId, name);
    if (changed) {
        window.location.reload();
    }
}
async function changePassword(container, old, new1, new2, bad) {
    var _branch_, message, payload, response;
    _branch_ = 'Check';
    while (true) {
        switch (_branch_) {
        case 'Check':
            if (new1.value.length >= 6) {
                if (new1.value === new2.value) {
                    _branch_ = 'Send to server';
                } else {
                    message = tr('Passwords are not the same');
                    new2.focus();
                    _branch_ = 'Error';
                }
            } else {
                message = tr('New password is too short');
                new1.focus();
                _branch_ = 'Error';
            }
            break;
        case 'Send to server':
            payload = {
                old_password: old.value,
                new_password: new1.value
            };
            showWait();
            response = await sendRequestCheckAuth('POST', '/api/pass', payload);
            hideWait();
            if (dh2common.isSuccess(response)) {
                html.clear(container);
                html.add(container, div('account-good', { text: tr('Password has been changed') }));
                _branch_ = 'Exit';
            } else {
                message = tr('Could not set password');
                _branch_ = 'Error';
            }
            break;
        case 'Error':
            html.setText(bad, message);
            bad.style.display = '';
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
async function checkAndImport(jsonString, originalFilename, parentId) {
    var filename, folders, id, items, newName, parsed;
    parsed = dh2common.stripExtension(originalFilename);
    folders = [{
            id: 'dummy dummy',
            name: parsed.name
        }];
    items = await buildItemsForPaste(folders, parentId);
    newName = items[0].new_name;
    if (!newName) {
        newName = parsed.name;
    }
    filename = newName + '.' + parsed.extension;
    id = await dh2common.importDiagram(jsonString, filename, parentId, tr);
    hideWait();
    if (id) {
        await goToFolder(id);
    }
    return id;
}
function checkForLicenseChange(folder) {
    if (unit.globals.licenseExpired) {
        if (!(folder.access == 'read')) {
            location.reload();
        }
    } else {
        if (folder.access == 'read' && folder.access_reason == 'license_expired') {
            location.reload();
        }
    }
}
function checkIfCanReuseUndo(id, tag) {
    if (tag && unit.globals.tags[id] === tag) {
        return true;
    } else {
        return false;
    }
}
async function checkIfNameIsUnique(widget, name) {
    var _collection_2, child, childName, id, lowname, parent;
    lowname = name.toLowerCase();
    parent = await fetchFolder(widget.parentId);
    if (parent.children) {
        _collection_2 = parent.children;
        for (child of _collection_2) {
            id = makeId(child.space_id, child.id);
            childName = child.name.toLowerCase();
            if (!(!(childName === lowname) || id === widget.folderId)) {
                return tr('Name is not unique');
            }
        }
    }
    return undefined;
}
function checkInputText(text, check) {
    if (check) {
        return check(text);
    } else {
        return undefined;
    }
}
function checkLabelNotEmpty(input, bad) {
    var value;
    value = input.value.trim();
    if (value) {
        return true;
    } else {
        input.focus();
        bad.style.display = '';
        html.setText(bad, tr('Label cannot be empty'));
        return false;
    }
}
function checkName(name) {
    return dh2common.checkProjectName(name, 120);
}
async function checkUnsavedChanges() {
    var ok;
    if (hasUnsavedChanges()) {
        ok = await widgets.criticalQuestion(tr('Are you sure you want to leave this page? Your changes will be lost.'), tr('Leave'), tr('Cancel'));
        return ok;
    } else {
        return true;
    }
}
function chooseDocumentType() {
    var _obj_;
    _obj_ = chooseDocumentType_create();
    return _obj_.run();
}
function chooseDocumentType_create() {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'chooseDocumentType',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* chooseDocumentType_main() {
        var _eventType_, _event_, buttons, cancel, dialog, evt, result;
        dialog = widgets.createMiddleWindow();
        html.add(dialog, div({
            text: tr('Choose diagram type'),
            'font-size': getHeader1Size(),
            'font-weight': 'bold',
            'padding-bottom': '10px'
        }));
        addDiagramType(dialog, ipath('logo-drakon.png'), tr('Drakon flowchart'), tr('A process, procedure, algorithm, behavior, HOW the system works'), me.drakon);
        addDiagramType(dialog, ipath('logo-graf.png'), tr('Mind map'), tr('Structure, composition, hierarchy, ' + 'ordered notes, what the system CONSISTS OF'), me.graf);
        addDiagramType(dialog, ipath('logo-free.png'), tr('Free-form diagram'), tr('Boxes and arrows, network diagrams, GUI sketches, GNOME diagrams, no limits'), me.free);
        cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
        cancel.style.marginRight = '0px';
        buttons = div({
            'text-align': 'right',
            'padding-top': '20px'
        }, cancel);
        html.add(dialog, buttons);
        me.state = '14';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'drakon') {
            evt = _event_[1];
            result = {
                type: 'drakon',
                evt: evt
            };
        } else {
            if (_eventType_ === 'free') {
                evt = _event_[1];
                result = {
                    type: 'free',
                    evt: evt
                };
            } else {
                if (_eventType_ === 'graf') {
                    evt = _event_[1];
                    result = {
                        type: 'graf',
                        evt: evt
                    };
                } else {
                    if (!(_eventType_ === 'cancel')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    result = undefined;
                }
            }
        }
        widgets.removeQuestions();
        _topResolve_(result);
        return;
    }
    function chooseDocumentType_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = chooseDocumentType_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = chooseDocumentType_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.drakon = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '14':
            _args_ = [];
            _args_.push('drakon');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.free = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '14':
            _args_ = [];
            _args_.push('free');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.graf = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '14':
            _args_ = [];
            _args_.push('graf');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '14':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
async function chooseUser(container) {
    var user;
    user = await findUserAdmin();
    if (user) {
        await fillUserInfo(container, user.user_id);
    }
}
function cleanupOnMove() {
    widgets.removeQuestions();
    widgets.removePopups();
    widgets.removeSnack();
}
function clearFolderActive(parentId) {
    if (parentId && unit.globals.active) {
        delete unit.globals.active[parentId];
    }
}
function clearFolderClipboard() {
    localStorage.removeItem('clipboard');
}
function clearSearchWidget(widget) {
    widget.found = [];
    widget.selected = undefined;
}
async function closeFolder() {
    trace('closeFolder');
    await padBridge.disconnectFolder();
    clearFolderClipboard();
    await startupDeskHome();
    unit.globals.rootFolder = undefined;
    clearFolderClipboard();
}
async function closeOtherSessions() {
    try {
        showWait();
        await sendRequestRaw('POST', '/api/logout_others');
        window.location.reload();
    } catch (_handlerData_) {
        widgets.showErrorSnack(_handlerData_);
    }
}
function compareFolders(left, right) {
    if (left.type === right.type) {
        if (left.name.toLowerCase() < right.name.toLowerCase()) {
            return -1;
        } else {
            return 1;
        }
    } else {
        if (left.type === 'folder') {
            return -1;
        } else {
            if (right.type === 'folder') {
                return 1;
            } else {
                if (left.name.toLowerCase() < right.name.toLowerCase()) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
    }
}
function compareSearchItems(left, right) {
    if (left.itemId) {
        if (right.itemId) {
            if (left.fullId < right.fullId) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 1;
        }
    } else {
        if (right.itemId) {
            return -1;
        } else {
            if (left.text < right.text) {
                return -1;
            } else {
                return 1;
            }
        }
    }
}
function compareTreeItems(widget, leftId, rightId) {
    var left, right;
    left = widget.items[leftId];
    right = widget.items[rightId];
    return compareFolders(left, right);
}
async function confirmEmail(email, allowCancel) {
    var changeEmail;
    changeEmail = function () {
        goToAccount('details');
    };
    await dh2common.showConfirmEmail(email, allowCancel, changeEmail);
}
async function confirmEmailFromDetails(email) {
    var confirmed;
    confirmed = await confirmEmail(email, true);
    if (confirmed) {
        location.reload();
    }
}
function convertStatistics(response) {
    var columns, rows;
    columns = [
        'date',
        'users',
        'create_user',
        'delete_user',
        'spaces',
        'drakon',
        'create_session',
        'sessions',
        'on_action'
    ];
    rows = response.summaries.map(function (row) {
        return makeStatsRow(row, columns);
    });
    return {
        columns: columns,
        rows: rows
    };
}
function copyCore(widget, ids) {
    var items;
    items = idsToItems(widget, ids);
    copyToFolderClipboard(items);
    widget.selected = {};
    reportClip();
}
function copyDiagram(source) {
    var diagram, items;
    items = source.items || [];
    diagram = {};
    Object.assign(diagram, source);
    diagram.items = items.map(clone);
    return diagram;
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    widgets.showGoodSnack(tr('Copied'));
}
function copyToFolderClipboard(items) {
    var clipboard;
    clipboard = {
        type: 'copy',
        items: items
    };
    saveInClipboard('folder', clipboard);
}
function copyUrl(input) {
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    widgets.showGoodSnack(tr('Link copied'));
}
function createComboButton(text, items) {
    var button;
    button = widgets.createSimpleButton(text, function (evt) {
        showComboUnder(evt.target, items);
    });
    return button;
}
function createCustomMainMenu(client) {
    var account, buyButton, wrapper;
    account = dh2common.getAccountObj();
    if (account && (!account.license || account.license.type === 'eval')) {
        buyButton = widgets.createDefaultButton(tr('Buy license'), gotoBuyFromMenu);
        wrapper = div(div({ padding: '10px' }, buyButton), div(client));
        dh2common.showMainMenu(wrapper);
    } else {
        dh2common.showMainMenu(client);
    }
}
function createDefButtonWide(text, action) {
    var button;
    button = widgets.createDefaultButton(text, action);
    button.style.display = 'block';
    button.style.margin = '0px';
    button.style.marginBottom = '10px';
    return button;
}
function createDiv(parent, className) {
    var element;
    element = div(className);
    html.add(parent, element);
    return element;
}
async function createDocumentCore(parentId, evt, documentType) {
    var _branch_, chosenType, folder, id;
    _branch_ = 'Choose document type';
    while (true) {
        switch (_branch_) {
        case 'Choose document type':
            trace('createDocumentCore', parentId);
            if (documentType) {
                _branch_ = 'Get name from user';
            } else {
                if (gconfig.free) {
                    chosenType = await dh2common.chooseDocumentType();
                    if (chosenType) {
                        documentType = chosenType.type;
                        evt = chosenType.evt;
                        _branch_ = 'Get name from user';
                    } else {
                        _branch_ = 'Exit';
                    }
                } else {
                    documentType = 'drakon';
                    _branch_ = 'Get name from user';
                }
            }
            break;
        case 'Get name from user':
            folder = await createFolderCore(parentId, evt, documentType, tr('Create document'));
            if (folder) {
                reportInsert([folder]);
                _branch_ = 'Open document';
            } else {
                _branch_ = 'Exit';
            }
            break;
        case 'Open document':
            id = folder.id;
            goToFolder(id);
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
function createDocumentFromDiagramScreen(widget, evt) {
    var parentId;
    parentId = getParent(widget);
    createDocumentCore(parentId, evt);
}
function createDrakonHubWidgetConfig(widget) {
    return {
        uniqueChecker: function (name) {
            return checkIfNameIsUnique(widget, name);
        },
        nameChecker: checkName,
        showUndo: true,
        imagePath: ipath(''),
        saveUserSettings: dh2common.saveUserSettings,
        sendRequest: sendRequest,
        createEditSender: createDwSenderAdapter,
        loadFonts: dh2common.loadFonts,
        translate: tr,
        onHideToolbar: expandClientGlobal,
        onShowToolbar: restoreClientGlobal,
        showContextMenu: function (x, y, items, prim) {
            showContextMenu(widget, x, y, items, prim);
        },
        onItemClick: function (prim, pos, evt) {
            return onItemClick(widget, prim, pos, evt);
        },
        getCursorForItem: getCursorForItem,
        watermark: gconfig.watermark
    };
}
function createDwSenderAdapter(diagram, indicator) {
    var pushEdit, sender;
    sender = createEditSender(diagram.id, diagram.tag, indicator);
    pushEdit = sender.pushEdit;
    sender.pushEdit = function (edit) {
        pushEdit(wrapEdit(edit));
    };
    return sender;
}
function createEditSender(id, tag, indicator) {
    var self;
    self = EditSender();
    self.folderId = id;
    self.indicator = indicator;
    self.queue = [];
    self.tag = tag;
    self.sender = SenderLoop_create(self, id);
    self.sender.run();
    return self;
}
function createEditable(options) {
    var editable;
    editable = dh2common.createWidget(EditableWidget(), options);
    return editable.render();
}
function createFeedbackButton() {
    var feedbackButton, main;
    removeFeedbackButton();
    if (!gconfig.pad && (dh2common.isLoggedOn() && !widgets.isNarrowScreen())) {
        feedbackButton = widgets.createSimpleButton(tr('Feedback'), showFeedbackWindow);
        feedbackButton.style.position = 'fixed';
        feedbackButton.style.right = '5px';
        feedbackButton.style.bottom = '5px';
        feedbackButton.style.zIndex = 2;
        feedbackButton.style.paddingTop = '3px';
        feedbackButton.style.paddingBottom = '3px';
        feedbackButton.style.lineHeight = 1;
        unit.feedbackButton = feedbackButton;
        main = html.get('main');
        html.add(main, feedbackButton);
    }
}
async function createFolderCore(parentId, evt, type, title) {
    var action, name, output;
    trace('createFolderCore', parentId);
    output = {};
    action = function (name) {
        return sendCreateFolder(parentId, type, name, output);
    };
    name = await nameInputBox(evt, title, '', action);
    if (name) {
        return output;
    } else {
        return undefined;
    }
}
async function createFolderFromDiagramScreen(widget, evt) {
    var folder, parentId;
    parentId = getParent(widget);
    folder = await createFolderCore(parentId, evt, 'folder', tr('Create folder'));
    if (folder) {
        reportInsert([folder]);
        await goToFolder(folder.id);
    }
}
async function createFolderGeneric(widget, parentId, evt) {
    var folder;
    folder = await createFolderCore(parentId, evt, 'folder', tr('Create folder'));
    if (folder) {
        setFolderActive(parentId, folder.id);
        if (widget.setActive) {
            widget.setActive(folder.id);
        }
        reportInsert([folder]);
        await goToFolder(folder.id);
    }
}
function createFolderItem(widget, folder, clip) {
    var check, className, dots, dotsIcon, icon, id, line, text, textClass;
    id = folder.id;
    icon = getGridCheck(widget, id, folder.type);
    dotsIcon = ipath('settings.png');
    check = createIconImg(icon);
    dots = createIconImg(dotsIcon);
    if (isItemCut(clip, id)) {
        textClass = 'folder-list-grid-item-text2 ' + 'folder-list-grid-item-text-cut';
    } else {
        textClass = 'folder-list-grid-item-text2';
    }
    text = div(textClass, { text: folder.name });
    if (getFolderActive(widget.folder.id) === id) {
        className = 'folder-list-grid-item-active';
    } else {
        className = 'folder-list-grid-item';
    }
    line = div(className, check, dots, text);
    registerEvent(line, 'click', function () {
        return goToFolder(id);
    });
    registerEvent(check, 'click', function (evt) {
        return widget.onCheck(evt, id);
    });
    registerEvent(dots, 'click', function (evt) {
        return widget.onDots(evt, id);
    });
    registerEvent(line, 'contextmenu', function (evt) {
        return widget.onFolderContext(evt, id);
    });
    folder.container = line;
    return line;
}
function createGoToDefinition(items, folder) {
    items.push({
        text: folder.name,
        action: function () {
            goToFolder(folder.id);
        }
    });
}
function createIconImg(src, className) {
    var element;
    className = className || 'grid-icon';
    element = html.createElement('img', {
        draggable: false,
        src: src
    }, [className]);
    return element;
}
function createInlineEdit(options) {
    var _selectValue_2, container, input, style, title;
    container = div('editable-container');
    container.style.width = options.width + 'px';
    container.style.height = options.height + 'px';
    if ('left' in options) {
        container.style.position = 'absolute';
        container.style.left = options.left + 'px';
        container.style.top = options.top + 'px';
    }
    title = div({
        text: options.title,
        height: '15px',
        background: 'rgba(255, 255, 255, 0.7)'
    });
    style = {
        height: options.height - 15 + 'px',
        width: '100%'
    };
    input = html.createElement('textarea', {}, [style]);
    input.value = options.value || '';
    _selectValue_2 = options.style;
    if (_selectValue_2 === 'heading1') {
        input.style.fontSize = gconfig.fontSize + 2 + 'px';
        input.style.fontWeight = 'bold';
    } else {
        if (_selectValue_2 === 'heading2') {
            input.style.fontSize = gconfig.fontSize + 'px';
            input.style.fontWeight = 'bold';
        }
    }
    html.add(container, title);
    html.add(container, input);
    registerEvent(input, 'input', function () {
        options.onInput(input.value);
    });
    return container;
}
function createInsert(id, item) {
    var fields;
    fields = utils.clone(item);
    return {
        id: id,
        op: 'insert',
        fields: fields
    };
}
function createKeyValue(table, key, value) {
    var left, line, lines, right, tr;
    left = html.createElement('td', {}, [{
            text: key,
            color: 'darkgreen',
            'text-align': 'right',
            'padding': '5px'
        }]);
    right = html.createElement('td', {}, [{
            'text-align': 'left',
            'padding': '5px'
        }]);
    tr = html.createElement('tr');
    html.add(table, tr);
    html.add(tr, left);
    html.add(tr, right);
    if (!utils.hasValue(value)) {
        value = '';
    }
    if (Array.isArray(value)) {
        lines = value.map(function (item) {
            return JSON.stringify(item);
        });
        for (line of lines) {
            html.add(right, div({ text: line }));
        }
    } else {
        if (typeof value === 'object') {
            value = JSON.stringify(value, null, 2);
            lines = value.split('\n');
            for (line of lines) {
                html.add(right, div({ text: line }));
            }
        } else {
            if (typeof value === 'string') {
                value = value.trim();
                lines = value.split('\n');
                if (lines.length > 1) {
                    for (line of lines) {
                        html.add(right, div({ text: line }));
                    }
                } else {
                    html.setText(right, value);
                }
            } else {
                html.setText(right, value);
            }
        }
    }
}
function createLogoLinkPad(language) {
    var logo, title;
    logo = dh2common.ipath(gconfig.wideLogo);
    title = img(logo);
    title.style.display = 'inline-block';
    title.style.height = '60px';
    title.style.verticalAlign = 'bottom';
    title.style.cursor = 'pointer';
    registerEvent(title, 'click', function () {
        openLink(gconfig.homeSite);
    });
    return title;
}
function createLogonLayout(container, form, title) {
    var bottom, top;
    bottom = div({
        'min-width': '100vw',
        'min-height': 'calc(100vh - 50px)',
        'display': 'inline-block',
        'position': 'absolute',
        'overflow-y': 'auto'
    }, form);
    top = div(dh2common.makeLogo(makeLogonMenu), div('top-text', {
        text: title,
        'font-size': getHeader2Size(),
        'font-weight': 'bold'
    }));
    html.add(container, top);
    html.add(container, bottom);
    dh2common.makeTopBar(top, bottom);
}
function createNewWindow() {
    var url;
    if (window.padBridge && window.padBridge.createNewWindow) {
        window.padBridge.createNewWindow();
    } else {
        url = window.location.href;
        window.open(url, '_blank');
    }
}
function createProject() {
    var config;
    config = {
        create: createProjectCore,
        onCreated: onProjectCreated,
        headerSize: getHeader2Size(),
        placeholder: tr('Enter project name'),
        checkName: dh2common.checkProjectName
    };
    config.explain = tr('A project is a container for ' + 'diagrams and folders. ' + 'A project is like a disk ' + 'that stores your documents. ' + 'Access to diagrams is granted ' + 'at the project level.');
    widgets.createSomething(config);
}
async function createProjectCore(name) {
    var errorMessage, payload, rbody, response;
    payload = { name: name };
    showWait();
    response = await sendRequestRaw('POST', '/api/space', payload);
    hideWait();
    if (dh2common.isSuccess(response)) {
        return { result: JSON.parse(response.responseText) };
    } else {
        if (response.status === 400) {
            rbody = JSON.parse(response.responseText);
            if (rbody.error === 'ERR_SPACE_EXISTS') {
                errorMessage = tr('A project with this name already exists');
            } else {
                errorMessage = tr('An error has occurred');
            }
        } else {
            errorMessage = tr('An error has occurred');
        }
        return { error: errorMessage };
    }
}
function createTab(widget, tab) {
    var src, tabDiv;
    src = tab.icon;
    if (tab.id === widget.multi.current) {
        tabDiv = div('tabs-container-selected', img(src, 'tabs-icon'));
    } else {
        tabDiv = div('tabs-container', img(src, 'tabs-icon'));
        registerEvent(tabDiv, 'click', function () {
            widget.selectTab(tab.id);
        });
    }
    if (tab.tool) {
        widgets.addTooltip(tabDiv, tr(tab.tool));
    }
    html.add(widget.top, tabDiv);
}
function createTableFromData(data) {
    var _collection_2, row, table;
    table = html.createElement('table');
    table.className = 'report-table';
    addTableRow(table, data.columns, 'th');
    _collection_2 = data.rows;
    for (row of _collection_2) {
        addTableRow(table, row, 'td');
    }
    return table;
}
function createTableFromGenericData(rows) {
    var cell, column, columns, name, outRow, outRows, row;
    columns = ['date'];
    for (row of rows) {
        for (name in row) {
            cell = row[name];
            if (columns.indexOf(name) === -1) {
                columns.push(name);
            }
        }
    }
    outRows = [];
    for (row of rows) {
        outRow = [];
        for (column of columns) {
            cell = row[column];
            if (cell === undefined || cell === null) {
                cell = '';
            }
            outRow.push(cell);
        }
        outRows.push(outRow);
    }
    return {
        columns: columns,
        rows: outRows
    };
}
function createTag(parent, tag, text) {
    var element;
    element = html.createElement(tag);
    html.add(parent, element);
    if (text) {
        html.setText(element, text);
    }
    return element;
}
function createTimeRandomId() {
    var now, random;
    now = new Date().toISOString();
    random = Math.random().toString(36).slice(2, 10);
    return now + '-' + random;
}
function createTopBanner(prompt, buttonText, url, background) {
    var banner, button, text;
    button = html.createElement('a', { href: url }, [
        'generic-button default-button',
        { text: buttonText }
    ]);
    button.style.height = '39px';
    button.style.width = '140px';
    button.style.textAlign = 'center';
    background = background || '#ffffa0';
    banner = div({
        padding: '5px',
        background: background,
        height: '50px',
        position: 'relative',
        'border-bottom': 'solid 1px #a0a0a0',
        'white-space': 'nowrap'
    });
    text = div({
        display: 'inline-block',
        text: prompt,
        'white-space': 'normal',
        'vertical-align': 'top',
        position: 'absolute',
        left: '150px',
        top: '50%',
        'line-height': 1,
        transform: 'translateY(-50%)'
    });
    html.add(banner, button);
    html.add(banner, text);
    return banner;
}
function createTreeIconImg(src, className) {
    var element;
    className = className || 'tree-grid-icon';
    element = html.createElement('img', {
        draggable: false,
        src: src
    }, [className]);
    return element;
}
function createTreeNode(widget, id, above, level, clip) {
    var div, item;
    div = html.createElement('tr', {}, []);
    if (above) {
        html.addAfter(above, div);
    } else {
        html.add(widget.table, div);
    }
    item = widget.items[id];
    item.level = level;
    item.container = div;
    renderTreeNode(widget, item, clip);
    return div;
}
function createUi(root) {
    var account, admin, deskhome, folder, folderMobile, group, groups, loading, logon, multi, panic, projects, register, reset, rootWidget;
    dh2common.createSpecialStyles();
    initDataChange();
    widgets.init(tr);
    unit.screens = {};
    unit.clientStatus = { expanded: false };
    panic = dh2common.createWidget(dh2common.PanicScreen());
    loading = dh2common.createWidget(widgets.LoadingScreen());
    projects = dh2common.createWidget(ProjectsScreen());
    folder = dh2common.createWidget(FolderScreen());
    logon = dh2common.createWidget(LoginScreen());
    register = dh2common.createWidget(RegisterScreen());
    account = dh2common.createWidget(AccountScreen());
    admin = dh2common.createWidget(AdminScreen());
    reset = dh2common.createWidget(ResetScreen());
    deskhome = dh2common.createWidget(DeskHome());
    groups = dh2common.createWidget(GroupsScreen());
    group = dh2common.createWidget(GroupScreen());
    folderMobile = dh2common.createWidget(FolderScreenMobile());
    unit.clientStatus.topBar = folder;
    unit.screens.projects = projects;
    unit.screens.folder = folder;
    unit.screens.folderMobile = folderMobile;
    unit.screens.loading = loading;
    unit.screens.logon = logon;
    unit.screens.register = register;
    unit.screens.panic = panic;
    unit.screens.account = account;
    unit.screens.admin = admin;
    unit.screens.groups = groups;
    unit.screens.group = group;
    unit.screens.reset = reset;
    unit.screens.deskhome = deskhome;
    multi = dh2common.createWidget(dh2common.MultiWidget(), {
        current: 'loading',
        children: unit.screens
    });
    unit.multi = multi;
    rootWidget = dh2common.createWidget(RootWidget(), multi);
    unit.rootWidget = rootWidget;
}
function createUpdate(id) {
    return {
        id: id,
        op: 'update',
        fields: {}
    };
}
function cutCore(widget, ids) {
    var items;
    items = idsToItems(widget, ids);
    widget.selected = {};
    cutToFolderClipboard(items);
    reportClip();
}
function cutToFolderClipboard(items) {
    var clipboard;
    clipboard = {
        type: 'cut',
        items: items
    };
    saveInClipboard('folder', clipboard);
}
async function deactivateLicense() {
    var ok;
    try {
        ok = await widgets.criticalQuestion(tr('Are you sure you want to deactivate your license? ' + 'Your diagrams will remain intact but they will switch to read-only mode.'), tr('Deactivate'), tr('Cancel'));
        if (ok) {
            showWait();
            await sendDeactivateLicense();
            hideWait();
            location.reload();
        }
    } catch (_handlerData_) {
        hideWait();
        widgets.showErrorSnack(_handlerData_);
    }
}
function deleteAccount(userId, name) {
    var _obj_;
    _obj_ = deleteAccount_create(userId, name);
    return _obj_.run();
}
function deleteAccount_create(userId, name) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'deleteAccount',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* deleteAccount_main() {
        var _eventType_, _event_, body, buttons, cancel, dialog, response, spaces;
        try {
            dialog = widgets.createMiddleWindow();
            html.add(dialog, div({
                'text-align': 'center',
                'line-height': 1.3,
                'padding-bottom': '10px',
                'position': 'relative'
            }, div({
                text: tr('Delete account'),
                'font-size': getHeader2Size()
            }), div({
                text: name,
                'font-weight': 'bold',
                'font-size': getHeader2Size()
            })));
            cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
            cancel.style.marginRight = '0px';
            buttons = div({
                'text-align': 'right',
                'padding-top': '20px'
            }, widgets.createBadButton(tr('Delete account'), me.yes), cancel);
            html.add(dialog, buttons);
            me.state = '23';
            me._busy = false;
            _event_ = yield;
            _eventType_ = _event_[0];
            if (_eventType_ === 'yes') {
                widgets.removeQuestions();
                showWait();
                setTimeout(me.onTimeout, 2000);
                me.state = '66';
                me._busy = false;
                _event_ = yield;
                sendRequestCheckAuth('GET', '/api/own_spaces').then(me.onResponse);
                me.state = '64';
                me._busy = false;
                _event_ = yield;
                response = _event_[1];
                hideWait();
                if (response.status === 200) {
                    body = JSON.parse(response.responseText);
                    spaces = body.spaces;
                    dialog = widgets.createMiddleWindow();
                    html.add(dialog, div({
                        'text-align': 'center',
                        'line-height': 1.3,
                        'padding-bottom': '10px',
                        'position': 'relative'
                    }, div({
                        text: tr('Are your sure you want to delete this user account?'),
                        'font-size': getHeader2Size()
                    }), div({
                        text: name,
                        'font-weight': 'bold',
                        'font-size': getHeader2Size()
                    })));
                    html.add(dialog, div({ text: tr('This action cannot be undone. ' + 'All data and diagrams will be lost forever.') }));
                    addDeleteSpaces(dialog, spaces);
                    cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
                    cancel.style.marginRight = '0px';
                    buttons = div({
                        'text-align': 'right',
                        'padding-top': '20px'
                    }, widgets.createBadButton(tr('Delete account forever'), me.yes), cancel);
                    html.add(dialog, buttons);
                    me.state = '39';
                    me._busy = false;
                    _event_ = yield;
                    _eventType_ = _event_[0];
                    if (_eventType_ === 'yes') {
                        widgets.removeQuestions();
                        showWait();
                        sendRequest('POST', '/api/delete_user', '').then(me.onResponse);
                        me.state = '65';
                        me._busy = false;
                        _event_ = yield;
                        response = _event_[1];
                        hideWait();
                        html.goTo(dh2common.getAppRoot());
                    } else {
                        if (!(_eventType_ === 'cancel')) {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        widgets.removeQuestions();
                    }
                } else {
                    widgets.showErrorSnack(tr('An error has occurred'));
                }
            } else {
                if (!(_eventType_ === 'cancel')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                widgets.removeQuestions();
            }
        } catch (_handlerData_) {
            hideWait();
            widgets.removeQuestions();
            console.error(_handlerData_);
            widgets.showErrorSnack(tr('An error has occurred'));
        }
        _topResolve_();
    }
    function deleteAccount_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = deleteAccount_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = deleteAccount_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.yes = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '23':
        case '39':
            _args_ = [];
            _args_.push('yes');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '23':
        case '39':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function (response) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '64':
        case '65':
            _args_ = [];
            _args_.push('onResponse');
            _args_.push(response);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '66':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
async function deleteCore(ids, parent) {
    var items, payload, response, url;
    items = ids.map(makeServerItem);
    payload = {
        'items': items,
        'operation': 'delete'
    };
    url = '/api/many';
    showWait();
    response = await sendRequestCheckAuth('POST', url, payload);
    hideWait();
    if (dh2common.isSuccess(response)) {
        showDeletedSnack(parent, ids);
        if (gconfig.desktop) {
            setGrey(ids);
            reportClip();
        } else {
            clearFolderActive(parent);
            reportDelete(ids);
            clearFolderClipboard();
        }
        return true;
    } else {
        widgets.showErrorSnack(tr('An error has occurred'));
        return false;
    }
}
async function deleteOneObject(parent, id) {
    var ok;
    ok = await widgets.criticalQuestion(tr('Delete object?'), tr('Delete'), tr('Cancel'));
    if (ok) {
        ok = await deleteCore([id], parent);
        return ok;
    } else {
        return false;
    }
}
function deleteProject(spaceId, name) {
    var _obj_;
    _obj_ = deleteProject_create(spaceId, name);
    return _obj_.run();
}
function deleteProject_create(spaceId, name) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'deleteProject',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* deleteProject_main() {
        var _eventType_, _event_, buttons, cancel, dialog;
        try {
            dialog = widgets.createMiddleWindow();
            html.add(dialog, div({
                'text-align': 'center',
                'line-height': 1.3,
                'padding-bottom': '10px',
                'position': 'relative'
            }, div({
                text: tr('Delete project'),
                'font-size': getHeader2Size()
            }), div({
                text: name,
                'font-weight': 'bold',
                'font-size': getHeader2Size()
            })));
            cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
            cancel.style.marginRight = '0px';
            buttons = div({
                'text-align': 'right',
                'padding-top': '20px'
            }, widgets.createDefaultButton(tr('Delete project'), me.yes), cancel);
            html.add(dialog, buttons);
            me.state = '23';
            me._busy = false;
            _event_ = yield;
            _eventType_ = _event_[0];
            if (_eventType_ === 'yes') {
                widgets.removeQuestions();
                showWait();
                setTimeout(me.onTimeout, 2000);
                me.state = '51';
                me._busy = false;
                _event_ = yield;
                hideWait();
                dialog = widgets.createMiddleWindow();
                html.add(dialog, div({
                    'text-align': 'center',
                    'line-height': 1.3,
                    'padding-bottom': '10px',
                    'position': 'relative'
                }, div({
                    text: tr('Are your sure you want to delete the project?'),
                    'font-size': getHeader2Size()
                }), div({
                    text: name,
                    'font-weight': 'bold',
                    'font-size': getHeader2Size()
                })));
                html.add(dialog, div({ text: tr('All the documents in the project will be destroyed forever.') }));
                cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
                cancel.style.marginRight = '0px';
                buttons = div({
                    'text-align': 'right',
                    'padding-top': '20px'
                }, widgets.createBadButton(tr('Delete project forever'), me.yes), cancel);
                html.add(dialog, buttons);
                me.state = '39';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'yes') {
                    widgets.removeQuestions();
                    showWait();
                    sendRequest('DELETE', '/api/space/' + spaceId, '').then(me.onResponse);
                    me.state = '50';
                    me._busy = false;
                    _event_ = yield;
                    hideWait();
                    window.location.reload();
                } else {
                    if (!(_eventType_ === 'cancel')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    widgets.removeQuestions();
                }
            } else {
                if (!(_eventType_ === 'cancel')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                widgets.removeQuestions();
            }
        } catch (_handlerData_) {
            hideWait();
            widgets.removeQuestions();
            console.error(_handlerData_);
            widgets.showErrorSnack(tr('An error has occurred'));
        }
        _topResolve_();
    }
    function deleteProject_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = deleteProject_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = deleteProject_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.yes = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '23':
        case '39':
            _args_ = [];
            _args_.push('yes');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '23':
        case '39':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '50':
            _args_ = [];
            _args_.push('onResponse');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '51':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
async function diagrnosticsScreen(widget, parent) {
    var pre, status;
    setAdminTitle(parent, tr('Server diagnostics'));
    showWait();
    status = await sendRequest('GET', '/api/status');
    hideWait();
    console.log(status);
    addSubHeader(parent, tr('Tarantool status'));
    showKeyValues(status.status.slab, parent);
    addSubHeader(parent, tr('Disk'));
    pre = html.createElement('pre', {}, [{ 'font-family': 'monospace' }]);
    html.add(parent, pre);
    html.setText(pre, status.status.disk);
}
function display(element, value) {
    element.style.display = value;
}
function div() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('div', properties, args);
}
function downloadLink(url, filename) {
    var link;
    link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
async function downloadMyData() {
    var _collection_2, access, data, response, str;
    try {
        response = await sendRequestRaw('GET', '/api/get_my_data');
        data = JSON.parse(response.responseText);
        if (data.spaces_access) {
            _collection_2 = data.spaces_access;
            for (access of _collection_2) {
                access.url = 'https://' + window.location.hostname + '/app?proj=' + access.space_id + '&doc=1';
            }
        }
        str = JSON.stringify(data, null, 4);
        dh2common.downloadTextDataAsFile('user.json', str);
    } catch (_handlerData_) {
        widgets.showErrorSnack(_handlerData_);
    }
}
function downloadTable(table, filename) {
    var data;
    data = buildCsvFromTable(table);
    dh2common.downloadTextDataAsFile(filename, data);
}
function enneForceChange(self, id, prop, value) {
    self.editDeb.force([
        id,
        prop,
        value
    ]);
}
function enneScheduleChange(self, id, prop, value) {
    self.editDeb.onInput([
        id,
        prop,
        value
    ]);
}
function enrichPayload(self, edit) {
    var _collection_2, _selectValue_4, change, edit2, item, newTag, oldTag, reportedChange;
    newTag = Math.floor(20000000 + Math.random() * 10000000).toString();
    oldTag = self.tag;
    self.tag = newTag;
    edit2 = {
        tag: newTag,
        oldTag: oldTag,
        editType: 'edit',
        removed: [],
        added: [],
        updated: []
    };
    _collection_2 = edit.changes;
    for (change of _collection_2) {
        if (change.id) {
            _selectValue_4 = change.op;
            if (_selectValue_4 === 'insert') {
                item = utils.clone(change.fields);
                item.id = change.id;
                edit2.added.push(item);
            } else {
                if (_selectValue_4 === 'update') {
                    item = utils.clone(change.fields);
                    item.id = change.id;
                    edit2.updated.push(item);
                } else {
                    if (!(_selectValue_4 === 'delete')) {
                        throw new Error('Unexpected case value: ' + _selectValue_4);
                    }
                    edit2.removed.push(change.id);
                }
            }
        } else {
            Object.assign(edit2, change.fields);
            if ('name' in change.fields) {
                reportedChange = utils.clone(change.fields);
                reportedChange.id = self.folderId;
                reportUpdate([reportedChange]);
            }
        }
    }
    return edit2;
}
function ensureTriChildExists(doc, parentId, prop) {
    var id, insert, item, parent, update;
    parent = doc.items[parentId];
    if (parent[prop]) {
        return parent[prop];
    } else {
        id = genNextId(doc);
        item = { type: 'tri' };
        doc.items[id] = item;
        parent[prop] = id;
        insert = createInsert(id, item);
        doc.initial.push(insert);
        update = createUpdate(parentId);
        update.fields[prop] = id;
        doc.initial.push(update);
        return id;
    }
}
function ensureTriItemExists(doc, id, item) {
    var change, copy;
    if (!(id in doc.items)) {
        doc.items[id] = item;
        copy = utils.clone(item);
        copy.id = id;
        change = createInsert(id, item);
        doc.initial.push(change);
    }
}
function expandClientGlobal() {
    if (!unit.clientStatus.expanded) {
        unit.clientStatus.expanded = true;
        unit.clientStatus.topBar.expandClient();
        unit.clientStatus.sideBar.expandClient();
    }
}
function extractFilenameFromUrl(url) {
    var notEmpty, parts, path;
    path = decodeURIComponent(url);
    parts = path.split('/');
    notEmpty = parts.filter(function (part) {
        return Boolean(part);
    });
    return notEmpty[notEmpty.length - 1];
}
function fakeOnBackButton(evt) {
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }
    return onBackButton();
}
async function feedbackScreenGeneric(widget, parent, title, type) {
    var items, left, list, result, right;
    setAdminTitle(parent, title);
    showWait();
    result = await sendRequest('GET', '/api/get_feedback/' + type);
    hideWait();
    items = result.filenames.map(function (filename) {
        return parseFeedbackFilename(type, filename);
    });
    utils.sortBy(items, 'timestamp', 'desc');
    left = div('account-left');
    right = div('account-right');
    left.style.padding = '0px';
    left.style.height = 'calc(100% - 50px)';
    left.style.width = '300px';
    right.style.height = 'calc(100% - 50px)';
    right.style.width = 'calc(100% - 300px)';
    right.style.maxWidth = '700px';
    html.add(parent, left);
    html.add(parent, right);
    list = dh2common.createWidget(widgets.PlainList());
    list.redraw(left);
    list.setItems(items);
    list.onItemClick = function (evt, item) {
        showFeedBackItem(right, item);
    };
}
async function fetchAllDocuments(folderId, output) {
    var _collection_2, child, doc, docBody, docs, folder, folders, id;
    folder = await fetchFolder(folderId);
    if (folder.type === 'folder') {
        if (folder.children) {
            folders = [];
            docs = [];
            _collection_2 = folder.children;
            for (child of _collection_2) {
                if (child.type === 'folder') {
                    folders.push(child);
                } else {
                    docs.push(child);
                }
            }
            utils.sortBy(docs, 'name');
            for (doc of docs) {
                id = doc.space_id + ' ' + doc.id;
                docBody = await fetchFolder(id);
                output.push(docBody);
            }
            utils.sortBy(folders, 'name');
            for (child of folders) {
                id = child.space_id + ' ' + child.id;
                await fetchAllDocuments(id, output);
            }
        } else {
        }
    } else {
        output.push(folder);
    }
}
async function fetchFolder(id) {
    var error, fid, first, folder, parent, response, url;
    fid = parseId(id);
    url = '/api/visit/' + fid.spaceId + '/' + fid.folderId;
    response = await sendRequestCheckAuth('GET', url);
    if (response.status === 200) {
        folder = JSON.parse(response.responseText);
        first = folder.path[0];
        unit.globals.accessToProjects[fid.spaceId] = {
            space_id: fid.spaceId,
            name: first.name,
            access: folder.access
        };
        if (gconfig.pad) {
            if (fid.folderId === '1') {
                folder.name = getRootFolderName();
            }
            first.name = getRootFolderName();
        }
        folder.id = id;
        if (folder.path.length > 1) {
            parent = folder.path[folder.path.length - 2];
            folder.parentId = makeId(folder.space_id, parent.id);
        }
        folder.path.forEach(function (step) {
            step.id = makeId(step.space_id, step.id);
        });
        return folder;
    } else {
        if (response.status === 404) {
            error = new Error('Not found: ' + url);
            error.notFound = id;
        } else {
            error = new Error('Server returned error');
            error.response = response;
        }
        throw error;
    }
}
async function fetchGroup(groupId) {
    return {
        id: groupId,
        name: 'Group-' + groupId,
        membership: 'admin'
    };
}
async function fetchRecentFolders() {
    unit.globals.recentFolders = await padBridge.getRecentFolders();
}
function fillAndChooseLanguage(settings, dia, yes, no, end, branch, exit) {
    var bucket, code, labels, name, row;
    html.addOption(dia, 'custom', tr('Custom'));
    dia.value = 'custom';
    labels = dh2common.getDiagramLabels();
    for (row of labels) {
        code = row[0];
        name = row[1];
        html.addOption(dia, code, name);
        bucket = dh2common.getLabelsByCode(code);
        if (settings.yes === bucket.yes && settings.no === bucket.no && settings.end === bucket.end && settings.branch === bucket.branch && settings.exit === bucket.exit) {
            dia.value = code;
        }
    }
    registerEvent(dia, 'change', function () {
        onDiaLanguage(dia, yes, no, end, branch, exit);
    });
}
function fillFolderMenu(widget, id) {
    var item, items, parsed, refs, ro, spaceId;
    items = [];
    parsed = parseId(id);
    spaceId = parsed.spaceId;
    item = getFolderItem(widget, id);
    refs = {
        text: tr('Find all references'),
        action: function () {
            startReferenceSearch(spaceId, item.name);
        }
    };
    ro = widget.folder.access === 'read';
    if (ro) {
        items.push({
            text: tr('Copy'),
            action: function (evt) {
                return widget.copyFolderObject(evt, id);
            }
        });
        if (shouldShowFindRefs(item)) {
            items.push({ type: 'separator' });
            items.push(refs);
        }
        return items;
    } else {
        if (getFolderClipboard()) {
            items.push({
                text: tr('Paste'),
                action: widget.pasteInFolder
            });
            items.push({ type: 'separator' });
        }
        items.push({
            text: tr('Rename'),
            action: function (evt) {
                return widget.renameObject(evt, id);
            }
        });
        items.push({ type: 'separator' });
        items.push({
            text: tr('Copy'),
            action: function (evt) {
                return widget.copyFolderObject(evt, id);
            }
        });
        items.push({
            text: tr('Cut'),
            action: function (evt) {
                return widget.cutFolderObject(evt, id);
            }
        });
        items.push({ type: 'separator' });
        items.push({
            text: tr('Delete'),
            icon: ipath('delete.png'),
            action: function () {
                return widget.deleteObject(widget.folder.id, id);
            }
        });
        if (shouldShowFindRefs(item)) {
            items.push({ type: 'separator' });
            items.push(refs);
        }
        return items;
    }
}
function fillLanguageForm(form, settings, onSaveLanguage, onCancel) {
    var bad, branch, cancel, dia, end, exit, good, language, languageControls, no, save, ui, yes;
    language = settings.language;
    html.add(form, div('account-header', { text: tr('User interface') }));
    ui = html.createElement('select');
    html.add(form, ui);
    html.addOption(ui, 'en-us', 'English');
    html.addOption(ui, 'de', 'Deutsch');
    html.addOption(ui, 'es', 'Español');
    html.addOption(ui, 'fr', 'Français');
    html.addOption(ui, 'lt', 'Lietuvių');
    html.addOption(ui, 'no', 'Norsk');
    html.addOption(ui, 'ru', 'Русский');
    ui.value = language;
    html.add(form, div({ height: '20px' }));
    html.add(form, div('account-header', { text: tr('Diagram labels') }));
    dia = html.createElement('select');
    html.add(form, dia);
    html.add(form, div({ height: '10px' }));
    yes = addTextControl(form, tr('Yes'), 'text', settings.yes);
    no = addTextControl(form, tr('No'), 'text', settings.no);
    end = addTextControl(form, tr('End'), 'text', settings.end);
    branch = addTextControl(form, tr('Branch'), 'text', settings.branch);
    exit = addTextControl(form, tr('Exit'), 'text', settings.exit);
    fillAndChooseLanguage(settings, dia, yes, no, end, branch, exit);
    good = div('account-good');
    bad = div('account-bad');
    languageControls = {
        ui: ui,
        yes: yes,
        no: no,
        end: end,
        branch: branch,
        exit: exit,
        good: good,
        bad: bad
    };
    save = widgets.createDefaultButton(tr('Save'), function () {
        onSaveLanguage(languageControls);
    });
    html.add(form, div({ height: '20px' }));
    html.add(form, save);
    if (onCancel) {
        cancel = widgets.createSimpleButton(tr('Cancel'), onCancel);
        html.add(form, cancel);
    }
    html.add(form, good);
    html.add(form, bad);
}
function fillNameBanner(nameContainer, name, path, type) {
    var pathParts, pathStr;
    html.clear(nameContainer);
    if (type === 'folder') {
        nameContainer.style.left = '100px';
        nameContainer.style.width = 'calc(100% - 150px)';
    } else {
        nameContainer.style.left = '140px';
        nameContainer.style.width = 'calc(100% - 140px)';
    }
    if (!(path.length === 1)) {
        pathParts = path.map(function (part) {
            return part.name;
        });
        pathParts.pop();
        pathStr = pathParts.join(' / ');
        html.setText(nameContainer, pathStr);
    }
}
function fillProjectListItems(widget) {
    var _collection_2, _collection_4, container, item, line;
    container = widget.container;
    html.clear(container);
    if (widget.items && !(widget.items.length === 0)) {
        html.add(container, div('list-subheader', { text: tr('Projects') }));
        _collection_4 = widget.items;
        for (item of _collection_4) {
            line = makeProjectListLine(widget, item, widget.active);
            html.add(container, line);
        }
    }
    if (widget.recent && !(widget.recent.length === 0)) {
        html.add(container, div('list-subheader', { text: tr('Recent') }));
        _collection_2 = widget.recent;
        for (item of _collection_2) {
            line = makeRecentListLine(widget, item);
            html.add(container, line);
        }
    }
}
function fillSimpleListItems(widget) {
    var _collection_2, container, item, line;
    container = widget.container;
    html.clear(container);
    if (widget.items) {
        _collection_2 = widget.items;
        for (item of _collection_2) {
            line = makeSimpleListLine(widget, item, widget.active);
            html.add(container, line);
        }
    }
}
function fillTreeNodeMenu(widget, item) {
    var items, parent, ro;
    ro = widget.access === 'read';
    items = [];
    if (isExpandable(item.type)) {
        parent = item.id;
    } else {
        parent = item.parent;
    }
    if (item.type === 'drakon') {
        addFindAllReferences(item, items);
    }
    if (getFolderClipboard() && !ro) {
        items.push({
            text: tr('Paste'),
            action: function () {
                widget.pasteInTree(parent);
            }
        });
        items.push({ type: 'separator' });
    }
    items.push({
        text: tr('Copy'),
        action: function (evt) {
            return widget.copyTreeNode(item);
        }
    });
    if (ro) {
        return items;
    } else {
        items.push({
            text: tr('Cut'),
            action: function (evt) {
                return widget.cutTreeNode(item);
            }
        });
        items.push({ type: 'separator' });
        addCreateBlock(widget, parent, items);
        items.push({ type: 'separator' });
        items.push({
            text: tr('Rename'),
            action: function (evt) {
                genericRenameObject(widget, evt, item);
            }
        });
        items.push({ type: 'separator' });
        items.push({
            text: tr('Delete'),
            icon: ipath('delete.png'),
            action: function () {
                deleteOneObject(item.parent, item.id);
            }
        });
        return items;
    }
}
async function fillUserInfo(container, userId) {
    var _collection_2, email, name, passContainer, response, space, table;
    html.clear(container);
    showWait();
    response = await sendRequest('GET', '/api/user_details/' + userId);
    hideWait();
    addSubHeader(container, tr('User details'));
    userId = response.user.user_id;
    name = response.user.name;
    email = response.user.email;
    table = html.createElement('table');
    html.add(container, table);
    showKeyValuesCore({ 'user id': userId }, table);
    showKeyValuesCore({ 'name': name }, table);
    showKeyValuesCore({ 'email': email }, table);
    delete response.user.user_id;
    delete response.user.name;
    delete response.user.email;
    showKeyValuesCore(response.user, table);
    passContainer = div({ padding: '20px' }, widgets.createSimpleButton(tr('New password'), function () {
        generateNewPassword(passContainer, userId);
    }));
    html.add(container, passContainer);
    if (response.user.enabled) {
        html.add(container, div({ padding: '20px' }, widgets.createBadButton(tr('Disable'), function () {
            updateUser(container, userId, 'enabled', false);
        })));
    } else {
        html.add(container, div({ padding: '20px' }, widgets.createSimpleButton(tr('Enable'), function () {
            updateUser(container, userId, 'enabled', true);
        })));
    }
    addSubHeader(container, tr('Projects'));
    table = html.createElement('table');
    html.add(container, table);
    utils.sortBy(response.spaces_access, 'name');
    _collection_2 = response.spaces_access;
    for (space of _collection_2) {
        addAccessLine(table, space);
    }
}
function findAlive(widget, ids) {
    var i, path, step;
    path = widget.path;
    if (path) {
        for (i = path.length - 1; i > 0; i--) {
            step = path[i];
            if (!(ids.indexOf(step.id) === -1)) {
                return path[i - 1].id;
            }
        }
        return undefined;
    } else {
        return undefined;
    }
}
async function findFolder(id, name) {
    var parsed, payload, response, result, targetId;
    if (name) {
        parsed = parseId(id);
        payload = {
            name: name.toLowerCase(),
            space_id: parsed.spaceId
        };
        response = await sendRequestCheckAuth('POST', '/api/find_folder', payload);
        if (response.status === 200) {
            result = JSON.parse(response.responseText);
            targetId = parsed.spaceId + ' ' + result.id;
            return targetId;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
async function findFolders(id, text) {
    var folders, lines, parsed, payload, response, result;
    if (text) {
        text = text.toLowerCase();
        parsed = parseId(id);
        lines = toLines(text);
        if (lines.length === 0) {
            return [];
        } else {
            payload = {
                lines: lines,
                space_id: parsed.spaceId
            };
            response = await sendRequestCheckAuth('POST', '/api/find_folders', payload);
            if (response.status === 200) {
                result = JSON.parse(response.responseText);
                folders = result.folders || [];
                folders = folders.map(function (folder) {
                    return {
                        id: parsed.spaceId + ' ' + folder.id,
                        name: folder.name
                    };
                });
                utils.sortBy(folders, 'name');
                return folders;
            } else {
                return [];
            }
        }
    } else {
        return [];
    }
}
function findStatValueByName(row, column) {
    if (row.events && column in row.events) {
        return row.events[column];
    } else {
        if (row.snapshot && column in row.snapshot) {
            return row.snapshot[column];
        } else {
            return '';
        }
    }
}
function findUniqueName(namesInParent, name) {
    var counter, low, xName;
    counter = 2;
    while (true) {
        xName = name + '_x' + counter;
        low = xName.toLowerCase();
        if (low in namesInParent) {
            counter++;
        } else {
            break;
        }
    }
    return xName;
}
function findUser(dialog, users) {
    var _obj_;
    _obj_ = findUser_create(dialog, users);
    return _obj_.run();
}
function findUserAdmin() {
    var _obj_;
    _obj_ = findUserAdmin_create();
    return _obj_.run();
}
function findUserAdmin_create() {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'findUserAdmin',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* findUserAdmin_main() {
        var _eventType_, _event_, cancel, deb, dialog, input, results, user;
        dialog = widgets.createMiddleWindow();
        dialog.style.padding = '10px';
        cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
        cancel.style.position = 'absolute';
        cancel.style.right = '0px';
        cancel.style.top = '0px';
        cancel.style.marginRight = '0px';
        html.add(dialog, div({
            'text-align': 'center',
            'line-height': 1.3,
            'padding-bottom': '10px',
            'position': 'relative'
        }, div({ 'height': '15px' }), div({
            text: tr('Choose user'),
            'font-weight': 'bold',
            'font-size': getHeader2Size()
        }), cancel));
        input = html.createElement('input', {
            type: 'text',
            placeholder: tr('Search')
        }, [{
                width: '100%',
                'margin-bottom': '10px'
            }]);
        html.add(dialog, input);
        results = div();
        html.add(dialog, results);
        setUserSearchResultsAdmin(me, results, undefined);
        deb = utils.debounce_create(function () {
            userSearchAdmin(me, input.value, results);
        }, 500);
        deb.run();
        registerEvent(input, 'input', function () {
            deb.onInput();
        });
        input.focus();
        me.state = '15';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'onUserSelected') {
            user = _event_[1];
        } else {
            if (!(_eventType_ === 'cancel')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            user = undefined;
        }
        deb.stop();
        if (me.search) {
            me.search.stop();
        }
        widgets.removeQuestions();
        _topResolve_(user);
        return;
    }
    function findUserAdmin_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = findUserAdmin_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = findUserAdmin_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onUserSelected = function (user) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '15':
            _args_ = [];
            _args_.push('onUserSelected');
            _args_.push(user);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '15':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function findUser_create(dialog, users) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'findUser',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* findUser_main() {
        var _eventType_, _event_, cancel, deb, input, results, user;
        html.clear(dialog);
        cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
        cancel.style.position = 'absolute';
        cancel.style.right = '0px';
        cancel.style.top = '0px';
        cancel.style.marginRight = '0px';
        html.add(dialog, div({
            'text-align': 'center',
            'line-height': 1.3,
            'padding-bottom': '10px',
            'position': 'relative'
        }, div({ 'height': '15px' }), div({
            text: tr('Add user'),
            'font-weight': 'bold',
            'font-size': getHeader2Size()
        }), cancel));
        input = html.createElement('input', {
            type: 'text',
            placeholder: tr('Search')
        }, [{
                width: '100%',
                'margin-bottom': '10px'
            }]);
        html.add(dialog, input);
        results = div();
        html.add(dialog, results);
        setUserSearchResults(me, results, []);
        deb = utils.debounce_create(function () {
            userSearch(me, users, input.value, results);
        }, 500);
        deb.run();
        registerEvent(input, 'input', function () {
            deb.onInput();
        });
        input.focus();
        me.state = '15';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'onUserSelected') {
            user = _event_[1];
        } else {
            if (!(_eventType_ === 'cancel')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            user = undefined;
        }
        deb.stop();
        if (me.search) {
            me.search.stop();
        }
        _topResolve_(user);
        return;
    }
    function findUser_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = findUser_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = findUser_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onUserSelected = function (user) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '15':
            _args_ = [];
            _args_.push('onUserSelected');
            _args_.push(user);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '15':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function folderChildToChange(parent, child, access) {
    var result;
    result = {
        id: makeId(child.space_id, child.id),
        name: child.name,
        type: child.type,
        parent: parent.id,
        access: parent.access,
        spaceId: parent.spaceId,
        children: []
    };
    return result;
}
function folderToChange(folder) {
    var result;
    result = {
        id: folder.id,
        name: folder.name,
        type: folder.type,
        parent: folder.parentId,
        spaceId: folder.space_id,
        access: folder.access,
        tag: folder.tag,
        items: folder.items,
        params: folder.params,
        style: folder.style,
        children: []
    };
    if (folder.children) {
        result.children = folder.children.map(function (child) {
            return folderChildToChange(result, child);
        });
    }
    return result;
}
function folderToDiagram(folder) {
    var result;
    result = {
        id: folder.id,
        name: folder.name,
        type: folder.type,
        description: folder.description,
        access: folder.access,
        tag: folder.tag,
        items: {},
        params: folder.params,
        style: folder.style
    };
    if (folder.items) {
        folder.items.forEach(function (item) {
            transformDtItem(item, result.items);
        });
    }
    return result;
}
function folderToFound(item) {
    var fullId;
    fullId = getFullId(item);
    return {
        id: makeId(item.space_id, item.folder_id),
        fullId: fullId,
        text: item.name,
        type: item.type,
        path: item.path
    };
}
function formatDate(unixDate) {
    var date, day, dayStr, month, monthStr, year;
    date = new Date(unixDate * 1000);
    day = date.getDate();
    month = date.getMonth() + 1;
    year = date.getFullYear();
    if (day < 10) {
        dayStr = '0' + day.toString();
    } else {
        dayStr = day.toString();
    }
    if (month < 10) {
        monthStr = '0' + month.toString();
    } else {
        monthStr = month.toString();
    }
    return dayStr + '.' + monthStr + '.' + year;
}
function formatEditableStyle(body, options) {
    var _selectValue_2;
    _selectValue_2 = options.style;
    if (_selectValue_2 === 'heading1') {
        body.style.fontSize = gconfig.fontSize + 'px';
        body.style.fontWeight = 'bold';
    } else {
        if (_selectValue_2 === 'heading2') {
            body.style.fontSize = gconfig.fontSize + 2 + 'px';
            body.style.fontWeight = 'bold';
        }
    }
}
async function funnelScreen(widget, parent) {
    var container, eventData, funnelData, funnelRows, status, summaryData, summaryTable, table;
    container = div({
        'overflow-y': 'auto',
        'height': '100%'
    });
    html.add(parent, container);
    setAdminTitle(container, tr('Funnel'));
    showWait();
    status = await sendRequest('POST', '/api/funnel');
    hideWait();
    console.log(status);
    funnelRows = status.funnel.map(stripTimestamp);
    funnelData = createTableFromGenericData(funnelRows);
    addSubHeader(container, tr('Summary'));
    summaryData = groupBy(funnelData, [
        'date',
        'event_type'
    ]);
    addDownloadTableButton(container, summaryData, 'summary.csv');
    summaryTable = buildHtmlTableFromData(summaryData);
    html.add(container, summaryTable);
    addSubHeader(container, tr('Events'));
    eventData = groupByAll(funnelData);
    addDownloadTableButton(container, eventData, 'events.csv');
    table = buildHtmlTableFromData(eventData);
    html.add(container, table);
}
function genNextId(doc) {
    var id;
    id = doc.nextId.toString();
    doc.nextId++;
    return id;
}
async function generateAiPrompt(widget) {
    var docs, folderId, rawDocuments;
    folderId = widget.folderId;
    trace('generateAiPrompt', folderId);
    rawDocuments = [];
    showWait();
    await fetchAllDocuments(folderId, rawDocuments);
    docs = rawDocuments.map(folderToDiagram);
    hideWait();
    widget.drakon.generateMany(docs);
}
async function generateNewPassword(container, userId) {
    var copy, payload, response;
    payload = { user_id: userId };
    showWait();
    response = await sendRequest('POST', '/api/new_password', payload);
    hideWait();
    html.clear(container);
    html.addText(container, response.password);
    copy = widgets.createSimpleButton(tr('Copy'), function () {
        copyToClipboard(response.password);
    });
    copy.style.marginLeft = '10px';
    html.add(container, copy);
}
async function genericRenameObject(widget, evt, item) {
    var action, newName;
    if (widget.access === 'read') {
        await widgets.inputBoxRo(evt.clientX, evt.clientY, tr('Name'), item.name);
    } else {
        action = function (name) {
            return sendRename(item.id, name);
        };
        newName = await nameInputBox(evt, tr('Rename'), item.name, action);
        if (newName) {
            reportUpdate([{
                    name: newName,
                    id: item.id
                }]);
        } else {
        }
    }
}
function getCurrentClientType() {
    var _selectValue_2;
    _selectValue_2 = unit.multi.current;
    if (_selectValue_2 === 'folder') {
        return unit.screens.folder.client.current;
    } else {
        if (_selectValue_2 === 'folderMobile') {
            return unit.screens.folderMobile.client.current;
        } else {
            return '';
        }
    }
}
function getCursorForItem(prim, pos, evt) {
    var link, nothing;
    link = function () {
        return 'pointer';
    };
    nothing = function () {
        return 'grab';
    };
    return runMouseAction(prim, pos, link, link, nothing);
}
function getDrakonHWidget() {
    if (widgets.isNarrowScreen()) {
        return unit.screens.folderMobile.drakon;
    } else {
        return unit.screens.folder.drakon;
    }
}
function getFolderActive(parent) {
    if (unit.globals.active) {
        return unit.globals.active[parent];
    } else {
        return undefined;
    }
}
function getFolderClipboard() {
    var clip, content, type;
    content = localStorage.getItem('clipboard');
    if (content) {
        type = localStorage.getItem('clipboard-type');
        if (type === 'folder') {
            clip = JSON.parse(content);
            if (clip.rootFolder === unit.globals.rootFolder) {
                return clip;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
function getFolderItem(widget, id) {
    var item;
    item = utils.findBy(widget.folder.children, 'id', id);
    if (item) {
        return item;
    } else {
        throw new Error('getFolderItem: item not found: ' + id);
    }
}
function getFolderWindowTitle(name) {
    if (unit.globals.rootName && !(unit.globals.rootName === name)) {
        return name + ' | ' + unit.globals.rootName;
    } else {
        return name;
    }
}
function getFromServer(url) {
    return sendRequest('GET', url, undefined);
}
function getFullId(item) {
    if (item.item_id) {
        return item.space_id + ' ' + item.folder_id + ' ' + item.item_id;
    } else {
        return item.space_id + ' ' + item.folder_id;
    }
}
function getGridCheck(widget, id, type) {
    var src;
    if (id in widget.selected) {
        src = ipath('checked.png');
    } else {
        src = getNodeIcon(type);
    }
    return src;
}
function getHeader1Size() {
    return gconfig.fontSize + 4 + 'px';
}
function getHeader2Size() {
    return gconfig.fontSize + 2 + 'px';
}
function getHeaders() {
    var csrf;
    csrf = document.body.dataset.csrf;
    if (csrf) {
        return { 'csrf-token': csrf };
    } else {
        return undefined;
    }
}
function getNodeIcon(type) {
    if (type === 'project') {
        return ipath('workspace-s2.png');
    } else {
        if (type === 'folder') {
            return ipath('folder-s2.png');
        } else {
            if (type === 'drakon') {
                return ipath('list-drakon2.png');
            } else {
                if (type === 'free') {
                    return ipath('list-free.png');
                } else {
                    if (type === 'graf') {
                        return ipath('list-mind.png');
                    } else {
                        return ipath('list-scen.png');
                    }
                }
            }
        }
    }
}
function getParent(widget) {
    if (isDrakon()) {
        return widget.parentId;
    } else {
        return widget.folderId;
    }
}
async function getRecent() {
    var body, response;
    response = await sendRequestRaw('GET', '/api/recent');
    if (response.status === 200) {
        body = JSON.parse(response.responseText);
        return body.recent;
    } else {
        return undefined;
    }
}
function getRecentFolders() {
    return unit.globals.recentFolders || [];
}
function getRootFolderName() {
    if (unit.globals.rootName) {
        return unit.globals.rootName;
    } else {
        return tr('My diagrams');
    }
}
function getSpaceName(spaceId) {
    var access;
    access = unit.globals.accessToProjects[spaceId];
    return access.name;
}
function getSubRow(table, row, columns) {
    var column, index, result;
    result = [];
    for (column of columns) {
        index = table.columns.indexOf(column);
        result.push(row[index]);
    }
    return result;
}
function getTreeIcon(item) {
    if (item.error) {
        return ipath('delete.png');
    } else {
        if (item.expanded) {
            return ipath('plus-expand.png');
        } else {
            return ipath('plus-collapse.png');
        }
    }
}
function getTreeItem(widget, id) {
    var item;
    item = widget.items[id];
    if (item) {
        return item;
    } else {
        throw new Error('getTreeItem: id not found: ' + id);
    }
}
async function getUserAdmin(parent, value, results) {
    var payload, response;
    payload = { text: value };
    response = await sendRequest('POST', '/api/find_user_admin', payload);
    setUserSearchResultsAdmin(parent, results, response.user);
}
function getUsers(parent, oldUsers, value, results) {
    var _obj_;
    _obj_ = getUsers_create(parent, oldUsers, value, results);
    return _obj_.run();
}
function getUsers_create(parent, oldUsers, value, results) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'getUsers',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* getUsers_main() {
        var _event_, payload, response, users;
        payload = { text: value };
        sendRequest('POST', '/api/find_users', payload).then(me.onData);
        me.state = '8';
        me._busy = false;
        _event_ = yield;
        response = _event_[1];
        users = subtractUserList(response.found, oldUsers);
        setUserSearchResults(parent, results, users);
        _topResolve_();
    }
    function getUsers_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = getUsers_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = getUsers_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onData = function (response) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '8':
            _args_ = [];
            _args_.push('onData');
            _args_.push(response);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
async function goBack() {
    var current, localHistory, location, locations, ok, wentBack;
    localHistory = unit.localHistory;
    locations = localHistory.locations;
    current = localHistory.current - 1;
    wentBack = false;
    while (true) {
        if (current >= 0) {
            location = locations[current];
            ok = await tryGoToLocation(location);
            if (ok) {
                wentBack = true;
                localHistory.current = current;
                break;
            } else {
                locations.splice(current, 1);
                current--;
            }
        } else {
            break;
        }
    }
    return wentBack;
}
async function goForward() {
    var current, localHistory, location, locations, ok;
    localHistory = unit.localHistory;
    locations = localHistory.locations;
    current = localHistory.current + 1;
    while (true) {
        if (current < locations.length) {
            location = locations[current];
            ok = await tryGoToLocation(location);
            if (ok) {
                localHistory.current = current;
                break;
            } else {
                locations.splice(current, 1);
            }
        } else {
            break;
        }
    }
}
async function goHome() {
    var ok;
    trace('goHome');
    ok = await checkUnsavedChanges();
    if (ok) {
        await dh2common.fetchAccount();
        unit.screens.folder.nav.selectTab('tree');
        cleanupOnMove();
        restoreClientGlobal();
        pushHome();
        await goHomeCore();
    }
}
async function goHomeCore() {
    var account, globals, recent, spaces;
    dh2common.setTitle(tr('Projects'));
    globals = unit.globals;
    account = dh2common.getAccountObj();
    recent = await getRecent();
    spaces = buildSpacesList(account);
    unit.screens.projects.setProjects(recent, spaces);
    setGlobalView('projects', undefined);
}
async function goToAccount(page) {
    var ok;
    trace('goToAccount', page);
    ok = await checkUnsavedChanges();
    if (ok) {
        await dh2common.fetchAccount();
        await dh2common.fetchUserSettings();
        pushAccount(page);
        await goToAccountCore(page);
    }
}
async function goToAccountCore(page) {
    var account, settings;
    cleanupOnMove();
    restoreClientGlobal();
    account = dh2common.getAccountObj();
    if (account.user_id) {
        settings = dh2common.getSettingsObj();
        setGlobalView('account', undefined);
        unit.screens.account.setAccountData(page, settings, account);
    } else {
        goToLogonCore(false);
    }
}
async function goToAdmin(page) {
    var ok;
    trace('goToAdmin', page);
    ok = await checkUnsavedChanges();
    if (ok) {
        pushAdmin(page);
        goToAdminCore(page);
    }
}
function goToAdminCore(page) {
    var account;
    cleanupOnMove();
    restoreClientGlobal();
    account = dh2common.getAccountObj();
    if (account.user_id) {
        setGlobalView('admin', undefined);
        unit.screens.admin.setPage(page);
    } else {
        goToLogonCore(false);
    }
}
function goToCreateAccount() {
    trace('goToCreateAccount');
    pushAccount('signup');
    goToCreateAccountCore();
}
function goToCreateAccountCore() {
    if (dh2common.isLoggedOn()) {
        goHome();
    } else {
        dh2common.setTitle(tr('Create account'));
        cleanupOnMove();
        setGlobalView('register', undefined);
    }
}
async function goToFolder(id, itemId, skipCleanup) {
    var ok;
    trace('goToFolder', id);
    ok = await checkUnsavedChanges();
    if (ok) {
        await dh2common.fetchUserSettings();
        if (!skipCleanup) {
            cleanupOnMove();
        }
        await dh2common.prepareFonts();
        if (!isOnFolder(id)) {
            pushFolder(id);
        }
        await goToFolderCore(id);
        showDocumentItem(itemId);
        rememberLastProject(id);
    }
}
async function goToFolderCore(id) {
    var folder, userSettings;
    folder = await fetchFolder(id);
    setFolderActive(folder.parentId, id);
    userSettings = dh2common.getSettingsObj();
    if (widgets.isNarrowScreen()) {
        setGlobalView('folderMobile', folder);
        await unit.screens.folderMobile.setFolder(folder, userSettings);
    } else {
        setGlobalView('folder', folder);
        await unit.screens.folder.setFolder(folder, userSettings);
    }
    checkForLicenseChange(folder);
    unit.uiChooser.setCurrentFolder(id);
}
async function goToGroup(groupId) {
    var ok;
    trace('goToGroup', groupId);
    ok = await checkUnsavedChanges();
    if (ok) {
        await dh2common.fetchAccount();
        cleanupOnMove();
        pushGroup(groupId);
        goToGroupCore(groupId);
    }
}
async function goToGroupCore(groupId) {
    var account, globals, group;
    globals = unit.globals;
    account = dh2common.getAccountObj();
    if (account.user_id) {
        group = await fetchGroup(groupId);
        dh2common.setTitle(group.name);
        unit.screens.group.setGroup(group);
        setGlobalView('group', undefined);
    } else {
        goToLogonCore(false);
    }
}
async function goToGroups() {
    var ok;
    trace('goToGroups');
    ok = await checkUnsavedChanges();
    if (ok) {
        await dh2common.fetchAccount();
        cleanupOnMove();
        pushGroups();
        goToGroupsCore();
    }
}
function goToGroupsCore() {
    var account, globals;
    dh2common.setTitle(tr('Groups'));
    globals = unit.globals;
    account = dh2common.getAccountObj();
    if (account.user_id) {
        unit.screens.groups.setGroups(account.groups);
        setGlobalView('groups', undefined);
    } else {
        goToLogonCore(false);
    }
}
function goToHomePage() {
    html.goTo(gconfig.siteRoot);
}
function goToLogon() {
    trace('goToLogon');
    pushAccount('logon');
    goToLogonCore(true);
}
function goToLogonCore(remain) {
    if (dh2common.isLoggedOn()) {
        goHome();
    } else {
        dh2common.setTitle(tr('Login'));
        cleanupOnMove();
        setGlobalView('logon', undefined);
        unit.screens.logon.setTarget(remain);
    }
}
function goToReset() {
    trace('goToReset');
    pushAccount('reset');
    goToResetCore();
}
function goToResetCore() {
    if (dh2common.isLoggedOn()) {
        goHome();
    } else {
        dh2common.setTitle(tr('Reset password'));
        cleanupOnMove();
        setGlobalView('reset', undefined);
    }
}
function goToRoot(widget) {
    var rootId;
    rootId = widget.spaceId + ' 1';
    unit.screens.folder.nav.selectTab('tree');
    goToFolder(rootId);
}
function gotoBuyFromMenu() {
    location.href = gconfig.pricesPage + '?bsource=main-menu';
}
function gotoBuyFromSubscription() {
    location.href = gconfig.pricesPage + '?bsource=account-sub';
}
function gotoDocs() {
    html.openTab(gconfig.documentation);
}
function groupBy(table, columns) {
    var _collection_2, bucket, indexed, key, list, newColumns, newRows, row, values;
    indexed = {};
    list = [];
    _collection_2 = table.rows;
    for (row of _collection_2) {
        values = getSubRow(table, row, columns);
        key = values.join('|');
        bucket = indexed[key];
        if (bucket) {
            bucket.count++;
        } else {
            bucket = {
                key: key,
                values: values,
                count: 1
            };
            indexed[key] = bucket;
            list.push(bucket);
        }
    }
    utils.sortBy(list, 'key');
    newColumns = columns.slice();
    newColumns.push('count');
    newRows = list.map(buildCountRow);
    return {
        columns: newColumns,
        rows: newRows
    };
}
function groupByAll(table) {
    return groupBy(table, table.columns);
}
function hasUnsavedChanges() {
    var drakon;
    drakon = getDrakonHWidget();
    if (drakon.hasUnsavedChanges() || widgets.hasUnsavedChanges()) {
        return true;
    } else {
        return false;
    }
}
function hideWait() {
    dh2common.hideWaitBlock();
}
function hieTraverse(byId, id, output) {
    var _collection_2, childId, item;
    item = byId[id];
    output.push(item.item);
    _collection_2 = item.children;
    for (childId of _collection_2) {
        hieTraverse(byId, childId, output);
    }
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
function idsToItems(widget, ids) {
    return ids.map(function (id) {
        return getFolderItem(widget, id);
    });
}
function img(src, className) {
    className = className || '';
    return html.createElement('img', {
        src: src,
        draggable: false
    }, [className]);
}
async function importJson(parentId) {
    var accept, onStartedLoading, prompt, upload;
    try {
        prompt = tr('Choose a diagram file');
        accept = '.drakon,.free,.graf,application/octet-stream,*/*';
        onStartedLoading = showWait;
        if (window.padBridge && window.padBridge.uploadFile) {
            upload = await window.padBridge.uploadFile(prompt, accept);
        } else {
            upload = await widgets.uploadFile(prompt, accept, onStartedLoading);
        }
        if (upload) {
            await checkAndImport(upload.data, upload.file.name, parentId);
        } else {
            hideWait();
        }
    } catch (_handlerData_) {
        hideWait();
        widgets.showErrorSnack(_handlerData_);
    }
}
async function initCapacitorAppLaunch() {
    var url;
    if (window.padBridge) {
        window.padBridge.addListener(onAppUrlOpen);
        url = await window.padBridge.getLaunchUrl();
        console.log('launch url', url);
    }
}
function initData() {
    unit.globals = {
        accessToProjects: {},
        tags: {}
    };
    initLocalHistory();
}
function initDataChange() {
    unit.dataListeners = {};
}
function initHistory() {
    registerEvent(window, 'popstate', onPopState);
}
function initLocalHistory() {
    var backButton;
    unit.localHistory = {
        current: -1,
        locations: []
    };
    if (gconfig.showBackButton) {
        backButton = document.createElement('button');
        html.setText(backButton, 'Go Back');
        document.documentElement.appendChild(backButton);
        backButton.onpointerdown = fakeOnBackButton;
        backButton.style.position = 'fixed';
        backButton.style.padding = '5px';
        backButton.style.bottom = '0px';
        backButton.style.right = '0px';
        backButton.style.zIndex = 2000;
    }
    if (window.padBridge && window.padBridge.addBackButtonListener) {
        window.padBridge.addBackButtonListener(onBackButton);
    }
}
async function initRecent() {
    var items, recent;
    recent = await getRecent();
    recent = recent || [];
    items = recent.map(recentToItem);
    unit.screens.folder.recent.setItems(items.slice());
    return items;
}
function ipath(image) {
    return gconfig.imagePath + image;
}
function isAllChecked(widget) {
    var selected;
    selected = Object.keys(widget.selected);
    if (selected.length === widget.folder.children.length && !(selected.length === 0)) {
        return true;
    } else {
        return false;
    }
}
function isDrakon() {
    var current;
    current = getCurrentClientType();
    if (current === 'drakon') {
        return true;
    } else {
        return false;
    }
}
function isDrakonDrakon() {
    var type, widget;
    widget = getDrakonHWidget();
    type = widget.getDiagramType();
    return type === 'drakon';
}
function isExpandable(type) {
    if (type === 'folder' || type === 'module') {
        return true;
    } else {
        return false;
    }
}
function isFree() {
    var current;
    current = getCurrentClientType();
    if (current === 'free') {
        return true;
    } else {
        return false;
    }
}
function isItemCut(clip, id) {
    var _collection_2, item;
    if (clip && clip.type === 'cut') {
        _collection_2 = clip.items;
        for (item of _collection_2) {
            if (item.id === id) {
                return true;
            }
        }
    }
    if (unit.globals.greyed && unit.globals.greyed[id]) {
        return true;
    }
    return false;
}
function isOnFolder(id) {
    if (unit.multi.current === 'folder' && unit.screens.folder.folderId === id) {
        return true;
    } else {
        return false;
    }
}
function isReadonly() {
    return unit.screens.folder.access === 'read';
}
function itemToFound(item) {
    var fullId;
    fullId = getFullId(item);
    return {
        id: makeId(item.space_id, item.folder_id),
        fullId: fullId,
        itemId: item.item_id,
        text: item.text,
        type: item.type,
        path: item.path
    };
}
function link(src, className, child) {
    var url;
    url = dh2common.getAppRoot() + src;
    return html.createElement('a', { href: url }, [
        className,
        child
    ]);
}
function loadDiagramItems(items, doc) {
    var id, item, neg, nextId, org, pos;
    doc.initial = [];
    nextId = 0;
    if (items) {
        for (item of items) {
            doc.items[item.id] = item;
            id = parseInt(item.id);
            if (!isNaN(id)) {
                nextId = Math.max(id, nextId);
            }
        }
    }
    doc.nextId = nextId + 1;
    ensureTriItemExists(doc, 'root', { type: 'tri' });
    ensureTriItemExists(doc, 'settings', {
        type: 'settings',
        diagramType: 'zt'
    });
    pos = ensureTriChildExists(doc, 'root', 'pos');
    neg = ensureTriChildExists(doc, 'root', 'neg');
    org = ensureTriChildExists(doc, 'root', 'org');
    ensureTriChildExists(doc, 'root', 'plane');
    ensureTriChildExists(doc, 'root', 'desc');
    ensureTriChildExists(doc, 'root', 'doStart');
    ensureTriChildExists(doc, 'root', 'doEnd');
    ensureTriChildExists(doc, 'root', 'shock2');
    ensureTriChildExists(doc, pos, 'pos');
    ensureTriChildExists(doc, pos, 'neg');
    ensureTriChildExists(doc, pos, 'org');
    ensureTriChildExists(doc, org, 'pos');
    ensureTriChildExists(doc, org, 'neg');
    ensureTriChildExists(doc, org, 'org');
    ensureTriChildExists(doc, neg, 'pos');
    ensureTriChildExists(doc, neg, 'neg');
    ensureTriChildExists(doc, neg, 'org');
}
async function loadPayments(container) {
    var _collection_2, amount, line, response, row, table, th, wait;
    wait = createTag(container, 'div', tr('Loading...'));
    response = await sendRequest('GET', '/api/get_payments');
    html.remove(wait);
    if (response.payments) {
        utils.sortBy(response.payments, 'payment_date', 'desc');
        table = html.createElement('table');
        html.add(container, table);
        table.className = 'common-table';
        th = createTag(table, 'tr');
        createTag(th, 'th', tr('Date'));
        createTag(th, 'th', tr('Amount'));
        _collection_2 = response.payments;
        for (line of _collection_2) {
            row = createTag(table, 'tr');
            createTag(row, 'td', formatDate(line.payment_date));
            amount = createTag(row, 'td', line.amount + ' руб.');
            amount.style.textAlign = 'right';
        }
    } else {
        createTag(container, 'div', tr('No payments'));
    }
}
async function loadSessions(container) {
    var _collection_2, line, response, row, table, th, wait;
    wait = createTag(container, 'div', tr('Loading...'));
    response = await sendRequest('GET', '/api/get_my_sessions');
    html.remove(wait);
    if (response.sessions) {
        table = html.createElement('table');
        html.add(container, table);
        table.className = 'common-table';
        th = createTag(table, 'tr');
        createTag(th, 'th', tr('Date'));
        createTag(th, 'th', 'IP');
        createTag(th, 'th', tr('Device'));
        createTag(th, 'th', tr('Current'));
        _collection_2 = response.sessions;
        for (line of _collection_2) {
            row = createTag(table, 'tr');
            createTag(row, 'td', formatDate(line.created));
            createTag(row, 'td', line.ip);
            createTag(row, 'td', line.agent);
            if (line.current) {
                createTag(row, 'td', tr('Yes'));
            }
        }
        html.add(container, div({ height: '20px' }));
        html.add(container, widgets.createSimpleButton(tr('Close sessions'), closeOtherSessions));
    } else {
        createTag(container, 'div', tr('No sessions'));
    }
}
async function logout() {
    trace('logout');
    await sendRequestRaw('POST', '/api/logout', '');
    html.goTo(dh2common.getAppRoot());
}
async function main(query) {
    var id;
    query = query || dh2common.getQuery();
    gconfig.main();
    initData();
    dh2common.main();
    await http.main();
    await dh2common.fetchAccount();
    saveLicenseStatus();
    await dh2common.fetchUserSettings();
    createUi();
    await rebuildUi();
    dh2common.initShortcuts({
        getWidget: getDrakonHWidget,
        isDrakon: isDrakon,
        isReadonly: isReadonly
    });
    registerWindowEvents();
    await dh2common.prepareFonts();
    if (query.account === 'signup') {
        replaceAccount(query.account);
        goToCreateAccountCore();
    } else {
        if (query.account === 'logon') {
            replaceAccount(query.account);
            goToLogonCore(false);
        } else {
            if (query.account === 'reset') {
                replaceAccount(query.account);
                goToResetCore();
            } else {
                if (query.account) {
                    replaceAccount(query.account);
                    await goToAccountCore(query.account);
                } else {
                    if (query.admin) {
                        replaceAdmin(query.admin);
                        goToAdminCore(query.admin);
                    } else {
                        if (query.group) {
                            if (query.group === 'list') {
                                replaceGroups();
                                goToGroupsCore();
                            } else {
                                replaceGroup(query.group);
                                goToGroupCore(query.group);
                            }
                        } else {
                            if (query.proj && query.doc) {
                                id = makeId(query.proj, query.doc);
                                await startupFolder(id);
                            } else {
                                if (gconfig.pad) {
                                    if (gconfig.desktop) {
                                        if (window.padBridge.subscribeForFolderChanges) {
                                            window.padBridge.subscribeForFolderChanges(onFolderChange);
                                        }
                                        await startupDeskHome();
                                    } else {
                                        await startupFolder('my-diagrams 1');
                                        await initCapacitorAppLaunch();
                                    }
                                } else {
                                    await startupHome();
                                    if (!dh2common.isLoggedOn()) {
                                        goToLogonCore(true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    createFeedbackButton();
}
function makeId(spaceId, folderId) {
    return spaceId + ' ' + folderId;
}
function makeLogonMenu() {
    var client;
    client = div();
    addGotoProjectSession(client);
    addAccountSection(client);
    dh2common.showMainMenu(client);
}
function makeMainMenuLogo(onClick) {
    var image;
    image = img(ipath(gconfig.wideMenuIcon));
    image.style.width = '98px';
    image.style.height = '49px';
    image.style.cursor = 'pointer';
    registerEvent(image, 'click', onClick);
    return image;
}
function makeNarrowMainButtonInfo(widget) {
    var buttonImage;
    buttonImage = ipath(gconfig.wideMenuIcon);
    return {
        image: buttonImage,
        callback: function () {
            showFolderMenu(widget);
        },
        tooltip: 'Open menu'
    };
}
function makeProjectListLine(widget, item) {
    var contClass, container, dots, dotsIcon;
    if (widget.active === item.id) {
        contClass = 'grid-item-active';
    } else {
        contClass = 'grid-item';
    }
    if (item.actions) {
        dotsIcon = ipath('settings.png');
        dots = createIconImg(dotsIcon);
        registerEvent(dots, 'click', function (evt) {
            onProjectListDots(widget, item, evt);
        });
    } else {
        dots = div({ display: 'inline-block' });
    }
    container = div(contClass, img(item.image, 'grid-icon-passive'), dots, div('grid-item-text2', { text: item.text }));
    if (item.actions) {
        registerEvent(container, 'contextmenu', function (evt) {
            return onProjectListContext(widget, item, evt);
        });
    } else {
        registerEvent(container, 'contextmenu', function (evt) {
            evt.preventDefault();
            return false;
        });
    }
    if (widget.onItemClick) {
        registerEvent(container, 'click', function () {
            widget.onItemClick(item.id);
        });
    }
    return container;
}
function makeRecentListLine(widget, item) {
    var contClass, id, image, itemContainer;
    id = makeId(item.space_id, item.folder_id);
    contClass = 'grid-item';
    image = getNodeIcon(item.type);
    itemContainer = div(contClass, img(image, 'grid-icon-passive'), div('grid-item-text', { text: item.name }));
    registerEvent(itemContainer, 'click', function () {
        widget.onItemClick(id);
    });
    return itemContainer;
}
function makeServerItem(id) {
    var parsed;
    parsed = parseId(id);
    return {
        space_id: parsed.spaceId,
        id: parsed.folderId
    };
}
function makeServerItemFromFolder(folder) {
    var parsed;
    parsed = parseId(folder.id);
    return {
        space_id: parsed.spaceId,
        id: parsed.folderId
    };
}
function makeSimpleListLine(widget, item) {
    var contClass, container, dots, dotsIcon;
    if (widget.active === item.id) {
        contClass = 'grid-item-active';
    } else {
        contClass = 'grid-item';
    }
    if (item.actions) {
        dotsIcon = ipath('settings.png');
        dots = createIconImg(dotsIcon);
        registerEvent(dots, 'click', function (evt) {
            onSimpleListDots(widget, item, evt);
        });
    } else {
        dots = div({ display: 'inline-block' });
    }
    container = div(contClass, img(item.image, 'grid-icon-passive'), dots, div('grid-item-text', { text: item.text }));
    if (item.actions) {
        registerEvent(container, 'contextmenu', function (evt) {
            return onSimpleListContext(widget, item, evt);
        });
    } else {
        registerEvent(container, 'contextmenu', function (evt) {
            evt.preventDefault();
            return false;
        });
    }
    if (widget.onItemClick) {
        registerEvent(container, 'click', function () {
            widget.onItemClick(item.id);
        });
    }
    return container;
}
function makeStatsRow(row, columns) {
    var column, i, result, value;
    result = [row.date];
    for (i = 1; i < columns.length; i++) {
        column = columns[i];
        value = findStatValueByName(row.data, column);
        result.push(value);
    }
    return result;
}
function mustFindDefinition(type, widget) {
    if (widget.drakon.getDiagramType() === 'free') {
        return true;
    } else {
        if (type === 'action' || type === 'input' || type === 'output' || (type === 'question' || type === 'insertion' || type === 'select' || type === 'case' || type === 'loopbegin' || type === 'loopend' || type === 'idea' || type === 'ridea' || type === 'conclusion')) {
            return true;
        } else {
            return false;
        }
    }
}
function nameInputBox(evt, title, oldName, action) {
    return widgets.inputBox(evt.clientX, evt.clientY, title, oldName, checkName, action);
}
function nameNotEmpty(text) {
    if (text) {
        return undefined;
    } else {
        return tr('Name cannot be empty');
    }
}
function normalizeText(str) {
    if (str) {
        return str.toLowerCase().trim().normalize('NFC');
    } else {
        return '';
    }
}
async function onAppUrlOpen(url) {
    var filename, jsonString, parentId;
    try {
        jsonString = await window.padBridge.readUtf8FileFromDisk(url);
        filename = extractFilenameFromUrl(url);
        parentId = 'my-diagrams 1';
        await checkAndImport(jsonString, filename, parentId);
        dh2common.invokeWindowResize();
    } catch (_handlerData_) {
        hideWait();
        widgets.showErrorSnack(_handlerData_);
    }
}
async function onBackButton() {
    var wentBack;
    console.log('onBackButton');
    if (widgets.hasPopup()) {
        console.log('removePopups');
        widgets.removePopups();
    } else {
        if (widgets.questionVisible) {
            console.log('removeQuestions');
            widgets.removeQuestions();
        } else {
            wentBack = await goBack();
            if (wentBack) {
                console.log('goBack');
            } else {
                console.log('exit');
                if (window.padBridge && window.padBridge.exitApp) {
                    window.padBridge.exitApp();
                }
            }
        }
    }
}
function onBeforeUnload(evt) {
    if (hasUnsavedChanges()) {
        evt.preventDefault();
        return evt.returnValue = '';
    }
}
function onDiaLanguage(dia, yes, no, end, branch, exit) {
    var bucket;
    if (!(dia.value === 'custom')) {
        bucket = dh2common.getLabelsByCode(dia.value);
        yes.value = bucket.yes;
        no.value = bucket.no;
        end.value = bucket.end;
        branch.value = bucket.branch;
        exit.value = bucket.exit;
    }
}
function onEditableKeyDown(self, evt) {
    if (evt.key === 'Enter') {
        if (evt.ctrlKey) {
            self.confirm();
        }
    } else {
        if (evt.key === 'Escape') {
            self.cancel();
        }
    }
}
function onError(evt) {
    panic(evt.error);
}
function onFolderChange(changes) {
    var _selectValue_2, adds, change, id, item, parent, removes, spaceId;
    console.log('onFolderChange', changes);
    adds = [];
    removes = [];
    spaceId = unit.globals.spaceId;
    for (change of changes) {
        id = makeId(spaceId, change.id);
        parent = makeId(spaceId, change.parent);
        _selectValue_2 = change.op;
        if (_selectValue_2 === 'add') {
            item = {
                id: id,
                name: change.name,
                type: change.type,
                parent: parent
            };
            adds.push(item);
        } else {
            if (_selectValue_2 === 'remove') {
                removes.push(id);
            }
        }
    }
    adds = sortByHierarchy(adds);
    console.log('onFolderChange', 'adds', adds);
    console.log('onFolderChange', 'removes', removes);
    reportDelete(removes);
    reportInsert(adds);
}
function onFolderDelete(widget, changeId) {
    widget.tree.remove(changeId);
    widget.folder.remove(changeId);
    widget.search.remove(changeId);
}
function onFolderDeleteMobile(widget, changeId) {
    widget.folder.remove(changeId);
}
function onFolderInsert(widget, change) {
    var tree;
    tree = widget.tree;
    tree.insert(change);
    widget.folder.insert(change);
}
function onFolderInsertMobile(widget, change) {
    widget.folder.insert(change);
}
function onFolderUpdate(widget, change) {
    var current, tree;
    tree = widget.tree;
    tree.update(change);
    current = widget.client.getCurrent();
    if (current.onChange) {
        current.onChange(change);
    }
    widget.crumbs.update(change);
}
function onFolderUpdateMobile(widget, change) {
    var current;
    current = widget.client.getCurrent();
    if (current.onChange) {
        current.onChange(change);
    }
}
function onFoundClick(widget, item) {
    widget.selected = item.fullId;
    redrawSearchItems(widget);
    if (widget.folderId === item.id) {
        showDocumentItem(item.itemId);
    } else {
        goToFolder(item.id, item.itemId);
    }
}
function onItemClick(widget, prim, pos, evt) {
    var id, insertion, link, nothing;
    link = function (prim) {
        openLink(prim.link);
    };
    id = widget.folderId;
    insertion = function (prim) {
        return openInsertion(prim, id);
    };
    nothing = function () {
    };
    return runMouseAction(prim, pos, link, insertion, nothing);
}
function onPopState(evt) {
    var _selectValue_2, _selectValue_4;
    if (evt.state) {
        cleanupOnMove();
        _selectValue_2 = evt.state.type;
        if (_selectValue_2 === 'home') {
            goHomeCore();
        } else {
            if (_selectValue_2 === 'folder') {
                goToFolderCore(evt.state.id);
            } else {
                if (_selectValue_2 === 'groups') {
                    goToGroupsCore();
                } else {
                    if (_selectValue_2 === 'group') {
                        goToGroupCore(evt.state.groupId);
                    } else {
                        if (_selectValue_2 === 'account') {
                            _selectValue_4 = evt.state.page;
                            if (_selectValue_4 === 'signup') {
                                goToCreateAccountCore();
                            } else {
                                if (_selectValue_4 === 'logon') {
                                    goToLogonCore(false);
                                } else {
                                    if (_selectValue_4 === 'reset') {
                                        goToResetCore();
                                    } else {
                                        goToAccountCore(evt.state.page);
                                    }
                                }
                            }
                        } else {
                            if (_selectValue_2 === 'admin') {
                                goToAdminCore(evt.state.page);
                            }
                        }
                    }
                }
            }
        }
    }
}
async function onProjectCreated(result) {
    var id;
    id = result.space_id + ' ' + 1;
    await goToFolder(id);
}
function onProjectListContext(widget, item, evt) {
    evt.preventDefault();
    widget.active = item.id;
    fillProjectListItems(widget);
    widgets.showContextMenu(evt.clientX, evt.clientY, item.actions);
    return false;
}
function onProjectListDots(widget, item, evt) {
    var rect;
    evt.stopPropagation();
    rect = evt.target.getBoundingClientRect();
    widget.active = item.id;
    fillProjectListItems(widget);
    widgets.showContextMenuExact(rect.left, rect.bottom, item.actions);
}
function onRejection(evt) {
    evt.preventDefault();
    panic(evt.reason);
}
function onSettingsClick(evt, spaceId) {
    var items;
    items = [];
    items.push({
        text: tr('Settings'),
        action: function () {
            showInlineSettings();
        }
    });
    if (!gconfig.desktop) {
        items.push({ type: 'separator' });
        items.push({
            text: tr('Restore from file'),
            action: function () {
                restoreProject(spaceId);
            }
        });
        items.push({
            text: tr('Backup to file'),
            action: function () {
                backupProject(spaceId);
            }
        });
    }
    items.push({ type: 'separator' });
    items.push({
        text: tr('About') + ' ' + gconfig.appName,
        action: showAboutPad
    });
    showContextMenuUnder(evt, items);
}
function onSettingsClickWeb(self, evt, spaceId) {
    var items, name;
    items = [];
    if (dh2common.isLoggedOn()) {
        items.push({
            icon: ipath('user-s.png'),
            text: tr('Account'),
            action: function () {
                goToAccount('details');
            }
        });
        items.push({
            text: tr('Settings'),
            action: function () {
                showInlineSettings();
            }
        });
        items.push({ type: 'separator' });
        name = getSpaceName(spaceId);
        if (self.access === 'admin') {
            items.push({
                text: tr('Access rights'),
                action: function () {
                    showAccessRights(spaceId, name);
                }
            });
            items.push({
                text: tr('Restore from file'),
                action: function () {
                    restoreProject(spaceId);
                }
            });
            items.push({
                text: tr('Backup to file'),
                action: function () {
                    backupProject(spaceId);
                }
            });
        } else {
            items.push({
                text: tr('Backup to file'),
                action: function () {
                    backupProject(spaceId, name);
                }
            });
        }
        items.push({ type: 'separator' });
        items.push({
            text: tr('About') + ' ' + gconfig.appName,
            action: showAboutPad
        });
        items.push({ type: 'separator' });
        items.push({
            text: tr('Log out'),
            action: logout
        });
    } else {
        items.push({
            text: tr('Login'),
            action: goToLogon
        });
        items.push({
            text: tr('Create account'),
            action: goToCreateAccount
        });
    }
    showContextMenuUnder(evt, items);
}
function onSimpleListContext(widget, item, evt) {
    evt.preventDefault();
    widget.active = item.id;
    fillSimpleListItems(widget);
    widgets.showContextMenu(evt.clientX, evt.clientY, item.actions);
    return false;
}
function onSimpleListDots(widget, item, evt) {
    var rect;
    evt.stopPropagation();
    rect = evt.target.getBoundingClientRect();
    widget.active = item.id;
    fillSimpleListItems(widget);
    widgets.showContextMenuExact(rect.left, rect.bottom, item.actions);
}
function onUnhandledError(ex) {
    console.log('onUnhandledError');
    console.error(ex);
    try {
        widgets.showErrorSnack(tr('An error has occurred') + ': ' + ex.message);
    } catch (ex) {
    }
}
function onUserClick(evt, spaceId) {
    var items;
    items = [];
    if (dh2common.isLoggedOn()) {
        items.push({
            icon: ipath('user-s.png'),
            text: tr('Account'),
            action: function () {
                goToAccount('details');
            }
        });
        items.push({
            text: tr('Settings'),
            action: function () {
                showInlineSettings();
            }
        });
        items.push({ type: 'separator' });
        items.push({
            text: tr('Log out'),
            action: logout
        });
    } else {
        items.push({
            text: tr('Login'),
            action: goToLogon
        });
        items.push({
            text: tr('Create account'),
            action: goToCreateAccount
        });
    }
    showContextMenuUnder(evt, items);
}
function onUserClickAccount(evt) {
    var items;
    items = [];
    items.push({
        text: tr('Log out'),
        action: logout
    });
    showContextMenuUnder(evt, items);
}
function openDiagramFile() {
}
async function openFolder() {
    var folderPath;
    trace('openFolder');
    folderPath = await padBridge.openFolder();
    if (folderPath) {
        await openFolderCore(folderPath);
    }
}
async function openFolderCore(folderPath) {
    var path;
    try {
        trace('openFolderCore', folderPath);
        await padBridge.initFolder(folderPath);
        path = parsePath(folderPath);
        clearFolderClipboard();
        unit.globals.rootName = path.filename;
        unit.globals.rootFolder = folderPath;
        await http.main();
        await startupFolder('my-diagrams 1');
        await addFolderToRecent(folderPath);
    } catch (_handlerData_) {
        console.log(_handlerData_);
        await startupDeskHome();
        widgets.showErrorSnack(tr('An error has occurred'));
    }
}
async function openInsertion(prim, id) {
    var message, name, targetId;
    name = dh2common.stripTags(prim.content);
    if (name) {
        targetId = await findFolder(id, name);
        if (targetId) {
            await goToFolder(targetId);
        } else {
            message = tr('Diagram not found') + ': ' + name;
            widgets.showErrorSnack(message);
        }
    }
}
function openLink(url) {
    if (window.padBridge && window.padBridge.openLink) {
        window.padBridge.openLink(url);
    } else {
        window.open(url, '_blank');
    }
}
async function openRecentFolder(folderPath) {
    trace('openRecentFolder');
    await openFolderCore(folderPath);
}
function panic(ex) {
    var message;
    hideWait();
    if (ex.mustLogon) {
        goToLogonCore(true);
    } else {
        if (ex.disconnected) {
            message = tr('Connection problem');
        } else {
            if (ex.notFound) {
                message = tr('Document not found');
            } else {
                if (ex.denied) {
                    message = tr('Access denied');
                } else {
                    console.error('panic', ex);
                    if (!(ex.response && ex.response.status === 500)) {
                        try {
                            sendErrorReport(ex);
                        } catch (ex2) {
                            console.error('Error while sending report', ex2);
                        }
                    }
                    message = tr('An error has occurred');
                }
            }
        }
        cleanupOnMove();
        setGlobalView('panic', undefined);
        unit.screens.panic.showPanicMessage(message, ex);
        removeFeedbackButton();
    }
}
function parseFeedbackFilename(prefix, filename) {
    var date, dateStr, day, end, ext, hr, mid, min, month, parts, sec, start, time, user, yyyy, zulu;
    ext = '.json';
    start = prefix.length;
    end = filename.length - ext.length;
    mid = filename.substring(start, end);
    parts = mid.split('-');
    date = parts[0];
    time = parts[1];
    user = parts[2];
    yyyy = date.substring(0, 4);
    month = date.substring(4, 6);
    day = date.substring(6, 8);
    hr = time.substring(0, 2);
    min = time.substring(2, 4);
    sec = time.substring(4, 6);
    dateStr = yyyy + '-' + month + '-' + day;
    zulu = dateStr + 'T' + hr + ':' + min + ':' + sec + 'Z';
    return {
        timestamp: zulu,
        date: dateStr,
        user: user,
        text: dateStr + ' ' + user,
        id: filename
    };
}
function parseId(id) {
    var parts;
    parts = id.split(' ');
    return {
        spaceId: parts[0],
        folderId: parts[1]
    };
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
async function pasteFromClipboard(parentId) {
    var clip, folder, folderRaw, ids, items, parsed, payload, rbody, response, url;
    try {
        clip = getFolderClipboard();
        if (clip) {
            parsed = parseId(parentId);
            items = await buildItemsForPaste(clip.items, parentId);
            payload = {
                items: items,
                target: {
                    space_id: parsed.spaceId,
                    folder_id: parsed.folderId
                }
            };
            if (clip.type === 'copy') {
                payload.operation = 'copy';
            } else {
                payload.operation = 'move';
            }
            url = '/api/many';
            response = await sendRequestCheckAuth('POST', url, payload);
            if (dh2common.isSuccess(response)) {
                clearFolderActive(parentId);
                clearFolderClipboard();
                if (!(clip.type === 'copy')) {
                    ids = clip.items.map(function (item) {
                        return item.id;
                    });
                    reportDelete(ids);
                }
                folderRaw = await fetchFolder(parentId);
                folder = folderToChange(folderRaw);
                reportUpdate([folder]);
                return clip;
            } else {
                if (response.responseText) {
                    rbody = JSON.parse(response.responseText);
                    if (rbody.error === 'ERR_CANT_MOVE_ACROSS') {
                        widgets.showErrorSnack(tr('Use copy/paste to move documents across projects'));
                    } else {
                        widgets.showErrorSnack(tr('Could not paste element'));
                    }
                } else {
                    widgets.showErrorSnack(tr('Could not paste element'));
                }
                return clip;
            }
        } else {
            return clip;
        }
    } catch (_handlerData_) {
        console.error(_handlerData_);
        widgets.showErrorSnack(tr('Could not paste element'));
    }
}
function placeWithLabel(parent, child, text, left, top) {
    var container, label;
    container = div({
        display: 'inline-block',
        position: 'absolute',
        left: left + 'px',
        top: top + 'px'
    });
    html.add(parent, container);
    label = createDiv(container, '');
    label.style.height = '15px';
    html.addText(label, text);
    html.add(container, child);
}
function pollTag(id, onData) {
    var parsed, pollId, timestamp, url;
    pollId = createTimeRandomId();
    timestamp = new Date().getTime();
    parsed = parseId(id);
    url = '/api/tag/' + parsed.spaceId + '/' + parsed.folderId + '/' + timestamp;
    sendRequestRawNoCheck('GET', url, undefined).then(function (response) {
        onData(response, pollId);
    });
    return pollId;
}
function projectToItem(project) {
    var actions, name;
    name = project.name;
    if (project.access === 'admin') {
        actions = [
            {
                text: tr('Rename'),
                action: function (evt) {
                    renameProject(project.space_id, name, evt);
                }
            },
            {
                text: tr('Access rights'),
                action: function () {
                    showAccessRights(project.space_id, name);
                }
            },
            { type: 'separator' },
            {
                icon: ipath('delete.png'),
                text: tr('Delete project'),
                action: function () {
                    deleteProject(project.space_id, name);
                }
            },
            { type: 'separator' },
            {
                text: tr('Restore from file'),
                action: function () {
                    restoreProject(project.space_id, name);
                }
            },
            {
                text: tr('Backup to file'),
                action: function () {
                    backupProject(project.space_id, name);
                }
            }
        ];
    } else {
        actions = [{
                text: tr('Backup to file'),
                action: function () {
                    backupProject(project.space_id, name);
                }
            }];
    }
    return {
        image: ipath('workspace-s2.png'),
        text: name,
        id: project.space_id + ' 1',
        actions: actions
    };
}
function pushAccount(page) {
    var url;
    url = buildAccountUrl(page);
    window.history.pushState({
        type: 'account',
        page: page
    }, '', url);
}
function pushAdmin(page) {
    var url;
    url = buildAdminUrl(page);
    window.history.pushState({
        type: 'admin',
        page: page
    }, '', url);
}
function pushFolder(id) {
    var url;
    registerLocation(id);
    if (!gconfig.pad) {
        url = dh2common.buildUrlForFolder(id);
        window.history.pushState({
            type: 'folder',
            id: id
        }, '', url);
    }
}
function pushGroup(groupId) {
    var url;
    url = buildGroupUrl(groupId);
    window.history.pushState({
        type: 'group',
        groupId: groupId
    }, '', url);
}
function pushGroups() {
    var url;
    url = buildGroupsUrl();
    window.history.pushState({ type: 'groups' }, '', url);
}
function pushHome() {
    var url;
    url = buildBaseUrl();
    window.history.pushState({ type: 'home' }, '', url);
}
function rebuildAccessDialog(parent, dialog, spaceId, name, access, error) {
    var buttons, cancel, errorMessage, publicDiv, save;
    html.clear(dialog);
    save = widgets.createDefaultButton(tr('Save'), parent.save);
    cancel = widgets.createSimpleButton(tr('Cancel'), parent.cancel);
    cancel.style.position = 'absolute';
    cancel.style.right = '0px';
    cancel.style.top = '0px';
    cancel.style.marginRight = '0px';
    buttons = div({
        'padding-bottom': '10px',
        position: 'relative'
    }, save, cancel);
    html.add(dialog, buttons);
    if (error) {
        errorMessage = div({
            'padding-bottom': '10px',
            color: 'darkred',
            text: error
        });
        html.add(dialog, errorMessage);
    }
    html.add(dialog, div({
        'text-align': 'center',
        'line-height': 1.3,
        'padding-bottom': '10px'
    }, div({ text: tr('Access rights to project') }), div({
        text: name,
        'font-weight': 'bold',
        'font-size': getHeader2Size()
    })));
    publicDiv = div({ 'padding-bottom': '10px' });
    html.add(dialog, publicDiv);
    widgets.createCheckBox(publicDiv, tr('Public project'), access['public'], parent.setPublicAccess);
    addUsersBlock(parent, dialog, tr('Read'), access, 'readers');
    addUsersBlock(parent, dialog, tr('Write'), access, 'writers');
    addUsersBlock(parent, dialog, tr('Admin'), access, 'admins');
}
function rebuildTreeView(widget) {
    var clip;
    html.clear(widget.table);
    clip = getFolderClipboard();
    renderTreeNodes(widget, widget.roots, undefined, clip);
}
async function rebuildUi() {
    var root, settings;
    settings = dh2common.getSettingsObj();
    await dh2common.loadStringsForLanguage(settings.language);
    cleanupOnMove();
    dh2common.removeLoading();
    root = buildAppRoot();
    unit.rootWidget.redraw(root);
}
function recallLastProject() {
    return unit.globals.lastProject;
}
function recentToItem(recent) {
    return {
        id: recent.space_id + ' ' + recent.folder_id,
        name: recent.name,
        type: recent.type,
        when: recent.when
    };
}
function recentToPadMenu(item) {
    return [
        item.name,
        function () {
            goToFolder(item.id);
        }
    ];
}
function recordScroll(widget) {
    widget.scrollTop = widget.innerContainer.scrollTop;
    widget.scrollLeft = widget.innerContainer.scrollLeft;
}
function redrawFolderList(widget) {
    trace('redrawFolderList');
    updateFolderListButtons(widget);
    updateFolderList(widget);
}
function redrawSearchItems(widget) {
    var _selectValue_2;
    html.clear(widget.foundContainer);
    if (widget.found.length === 0) {
        _selectValue_2 = widget.status;
        if (_selectValue_2 === 'completed') {
            addNotFound(widget.foundContainer, tr('Nothing found'));
        } else {
            if (_selectValue_2 === 'searching') {
                addNotFound(widget.foundContainer, tr('Searching...'));
            } else {
                if (_selectValue_2 === 'error') {
                    addNotFound(widget.foundContainer, tr('En error has occurred'));
                }
            }
        }
    } else {
        appendFoundItems(widget, widget.found);
    }
}
function redrawTabs(widget) {
    var _collection_2, tab;
    html.clear(widget.top);
    _collection_2 = widget.tabs;
    for (tab of _collection_2) {
        createTab(widget, tab);
    }
}
function registerDataListener(listener) {
    var key;
    while (true) {
        key = dh2common.generateRandomString();
        if (!(key in unit.dataListeners)) {
            break;
        }
    }
    unit.dataListeners[key] = listener;
    return key;
}
function registerEvent(element, eventName, action, options) {
    return dh2common.registerEvent(element, eventName, action, options);
}
function registerLocation(id) {
    var localHistory;
    localHistory = unit.localHistory;
    if (localHistory.current === -1) {
        localHistory.current = 0;
    } else {
        localHistory.current++;
        localHistory.locations = localHistory.locations.slice(0, localHistory.current);
    }
    localHistory.locations.push(id);
}
function registerWindowEvents() {
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    registerEvent(window, 'popstate', onPopState);
    window.addEventListener('beforeunload', onBeforeUnload);
    unit.uiChooser = UiChooser();
    dh2common.subscribeOnResize(unit.uiChooser.resize);
}
async function reloadView(widget) {
    var folderRaw;
    folderRaw = await widget.fetchFolder(widget.folder.id);
    widget.folder = folderToChange(folderRaw);
    updateFolderListButtons(widget);
    updateFolderList(widget);
    return folder;
}
function rememberLastProject(id) {
    var parsed;
    parsed = parseId(id);
    unit.globals.lastProject = parsed.spaceId;
}
function rememberTag(id, tag) {
    if (tag) {
        unit.globals.tags[id] = tag;
    }
}
function removeFeedbackButton() {
    if (unit.feedbackButton) {
        html.remove(unit.feedbackButton);
        unit.feedbackButton = undefined;
    }
}
function removeItemCore(widget, id) {
    var index, items;
    items = widget.items;
    index = utils.findIndex(items, 'id', id);
    if (index === -1) {
        return false;
    } else {
        items.splice(index, 1);
        return true;
    }
}
function removeTreeNode(widget, id) {
    var _collection_2, childId, item;
    item = getTreeItem(widget, id);
    _collection_2 = item.children;
    for (childId of _collection_2) {
        removeTreeNode(widget, childId);
    }
    html.remove(item.container);
    item.container = undefined;
    delete widget.items[id];
}
async function renameProject(spaceId, oldName, evt) {
    var newName;
    try {
        newName = await nameInputBox(evt, tr('Rename'), oldName);
        if (newName && !(newName === oldName)) {
            showWait();
            await sendRenameProject(spaceId, newName);
            hideWait();
            await dh2common.fetchAccount();
            await goHomeCore();
        } else {
        }
    } catch (_handlerData_) {
        hideWait();
        widgets.showErrorSnack(tr('Could not rename'));
    }
}
function renderChange() {
}
function renderEnne(widget, top) {
    var back, backSrc, root;
    backSrc = '/gen/YzfLFqPH0LmOlZ72B5UvRzW6ekaQCLHD/enne-crude.jpg';
    back = html.createElement('img', {
        src: backSrc,
        draggable: false
    }, [{
            display: 'inline-block',
            position: 'absolute',
            width: '600px',
            height: '600px',
            left: '420px',
            top: 210 + top + 'px'
        }]);
    html.add(widget.container, back);
    root = widget.diagram.items.root;
    addEditable(widget, widget.container, 'До, начало октавы', 'root', 'doStart', 320, 120 + top);
    addEditable(widget, widget.container, 'До, конец октавы', 'root', 'doEnd', 730, 120 + top);
    addEditable(widget, widget.container, 'Ля, Венера - пассивная часть активной силы', root.pos, 'neg', 20, 550 + top);
    addEditable(widget, widget.container, 'Ре, Луна - пассивная часть организующей силы', root.org, 'neg', 970, 320 + top);
    addEditable(widget, widget.container, 'Фа, Меркурий - пассивная часть пассивной силы', root.neg, 'neg', 850, 750 + top);
    addEditable(widget, widget.container, '2-й сознательный толчок', 'root', 'shock2', 100, 220 + top);
    addEditable(widget, widget.container, '1-сознательный толчок', root.pos, 'org', 70, 650 + top);
    addEditable(widget, widget.container, 'Механический толчок', root.neg, 'org', 980, 650 + top);
    addEditable(widget, widget.container, 'Соль, Юпитер - активная часть активной силы', root.pos, 'pos', 190, 750 + top);
    addEditable(widget, widget.container, 'Си, Сатурн - активная часть организующей силы', root.org, 'pos', 70, 320 + top);
    addEditable(widget, widget.container, 'Ми, Марс - активная часть пассивной силы', root.neg, 'pos', 1020, 550 + top);
    addDescription(widget, widget.container, 'Описание', 'root', 'desc', 10, 850 + top);
}
function renderEnneChanges(widget, changes) {
    if ('name' in changes) {
        reportNameChanged(widget);
    } else {
        dh2common.redrawWidgetDom(widget);
    }
}
function renderFoundItem(widget, item) {
    var before, line, lineClass, match, matchDiv, name, nameDiv, needle, path, pathDiv, pathText, rest, start, text, textDiv;
    path = item.path.slice();
    name = path[path.length - 1];
    path.pop();
    if (widget.selected === item.fullId) {
        lineClass = 'search-found-item-active';
    } else {
        lineClass = 'search-found-item';
    }
    if (path[0] === 'my-diagrams') {
        path[0] = getRootFolderName();
    }
    pathText = path.join(' / ');
    pathDiv = div('search-item-path', { text: pathText });
    nameDiv = div('search-item-name', { text: name });
    line = div(lineClass, pathDiv, nameDiv);
    html.add(widget.foundContainer, line);
    if (item.itemId) {
        text = normalizeText(item.text);
        needle = normalizeText(widget.needle);
        start = text.indexOf(needle);
        if (!(start === -1)) {
            before = item.text.substring(0, start);
            match = item.text.substring(start, start + widget.needle.length);
            rest = item.text.substring(start + widget.needle.length);
            textDiv = div('search-item-text');
            html.add(line, textDiv);
            if (before) {
                html.addText(textDiv, before);
            }
            matchDiv = div('search-item-match', { text: match });
            html.add(textDiv, matchDiv);
            if (rest) {
                html.addText(textDiv, rest);
            }
        }
    }
    registerEvent(line, 'click', function () {
        return onFoundClick(widget, item);
    });
}
function renderOkt(widget, top) {
    var back, backSrc, root;
    backSrc = '/gen/YzfLFqPH0LmOlZ72B5UvRzW6ekaQCLHD/enne-crude.jpg';
    back = html.createElement('img', {
        src: backSrc,
        draggable: false
    }, [{
            display: 'inline-block',
            position: 'absolute',
            width: '600px',
            height: '600px',
            left: '420px',
            top: 210 + top + 'px'
        }]);
    html.add(widget.container, back);
    root = widget.diagram.items.root;
    addEditable(widget, widget.container, 'До, начало октавы', 'root', 'doStart', 320, 120 + top);
    addEditable(widget, widget.container, 'До, конец октавы', 'root', 'doEnd', 730, 120 + top);
    addEditable(widget, widget.container, 'Ля, Венера - пассивная часть активной силы', root.pos, 'neg', 20, 550 + top);
    addEditable(widget, widget.container, 'Ре', root.org, 'neg', 970, 320 + top);
    addEditable(widget, widget.container, 'Ми', root.neg, 'neg', 850, 750 + top);
    addEditable(widget, widget.container, '2-й сознательный толчок', 'root', 'shock2', 100, 220 + top);
    addEditable(widget, widget.container, '1-сознательный толчок', root.pos, 'org', 70, 650 + top);
    addEditable(widget, widget.container, 'Механический толчок', root.neg, 'org', 980, 650 + top);
    addEditable(widget, widget.container, 'Соль', root.pos, 'pos', 190, 750 + top);
    addEditable(widget, widget.container, 'Си', root.org, 'pos', 70, 320 + top);
    addEditable(widget, widget.container, 'Фа', root.neg, 'pos', 1020, 550 + top);
    addDescription(widget, widget.container, 'Описание', 'root', 'desc', 10, 850 + top);
}
function renderRzt(widget, top) {
    var root;
    root = widget.diagram.items.root;
    addEditable(widget, widget.container, 'Активная сила', 'root', 'pos', 10, 190 + top, 'heading2');
    addEditable(widget, widget.container, 'Организующая сила', 'root', 'org', 420, 190 + top, 'heading2');
    addEditable(widget, widget.container, 'Пассивная сила', 'root', 'neg', 830, 190 + top, 'heading2');
    addEditable(widget, widget.container, 'Венера - пассивная часть активной силы', root.pos, 'neg', 10, 290 + top);
    addEditable(widget, widget.container, 'Луна - пассивная часть организующей силы', root.org, 'neg', 420, 290 + top);
    addEditable(widget, widget.container, 'Меркурий - пассивная часть пассивной силы', root.neg, 'neg', 830, 290 + top);
    addEditable(widget, widget.container, 'Организующая часть активной силы', root.pos, 'org', 10, 390 + top);
    addEditable(widget, widget.container, 'Солнце - организующая часть организующей силы', root.org, 'org', 420, 390 + top);
    addEditable(widget, widget.container, 'Организующая часть пассивной силы', root.neg, 'org', 830, 390 + top);
    addEditable(widget, widget.container, 'Юпитер - активная часть активной силы', root.pos, 'pos', 10, 490 + top);
    addEditable(widget, widget.container, 'Сатурн - активная часть организующей силы', root.org, 'pos', 420, 490 + top);
    addEditable(widget, widget.container, 'Марс - активная часть пассивной силы', root.neg, 'pos', 830, 490 + top);
    addDescription(widget, widget.container, 'Описание', 'root', 'desc', 10, 590 + top);
}
function renderTreeNode(widget, item, clip) {
    var arrow, arrowSrc, callback, icon, iconSrc, spacer, td, text, textClass;
    html.clear(item.container);
    td = html.createElement('td', {}, []);
    html.add(item.container, td);
    if (item.id === widget.selected) {
        td.className = 'tree-selected';
    } else {
        if (item.id === widget.active) {
            td.className = 'tree-active';
        } else {
            td.className = 'tree-normal';
        }
    }
    widget.beh.registerEvents(td, item.id);
    registerEvent(td, 'contextmenu', function (evt) {
        return widget.onNodeContext(evt, item.id);
    });
    spacer = div({
        'width': 30 * item.level + 'px',
        'display': 'inline-block'
    });
    if (isExpandable(item.type)) {
        arrowSrc = getTreeIcon(item);
        arrow = createIconImg(arrowSrc);
        if (item.expanded) {
            callback = function (evt) {
                requestCollapse(evt, widget, item.id);
            };
        } else {
            callback = function (evt) {
                widget.requestExpand(evt, item.id);
            };
        }
        registerEvent(arrow, 'click', callback);
        arrow.addEventListener('pointerdown', function (e) {
            e.stopPropagation();
        });
    } else {
        arrow = div({
            'display': 'inline-block',
            'width': '30px'
        });
    }
    textClass = 'tree-item-text';
    if (isItemCut(clip, item.id)) {
        textClass += ' tree-item-text-cut';
    }
    iconSrc = getNodeIcon(item.type);
    icon = createTreeIconImg(iconSrc);
    text = div(textClass, { text: item.name });
    html.add(td, spacer);
    html.add(td, arrow);
    html.add(td, icon);
    html.add(td, text);
}
function renderTreeNodes(widget, ids, parent, clip) {
    var above, child, id, level;
    ids.sort(function (left, right) {
        return compareTreeItems(widget, left, right);
    });
    if (parent) {
        above = parent.container;
        level = parent.level + 1;
    } else {
        above = undefined;
        level = 0;
    }
    for (id of ids) {
        above = createTreeNode(widget, id, above, level, clip);
    }
    for (id of ids) {
        child = getTreeItem(widget, id);
        renderTreeNodes(widget, child.children, child, clip);
    }
}
function replaceAccount(page) {
    var url;
    url = buildAccountUrl(page);
    window.history.replaceState({
        type: 'account',
        page: page
    }, '', url);
}
function replaceAdmin(page) {
    var url;
    url = buildAdminUrl(page);
    window.history.replaceState({
        type: 'admin',
        page: page
    }, '', url);
}
function replaceFolder(id) {
    var url;
    registerLocation(id);
    if (!gconfig.pad) {
        url = dh2common.buildUrlForFolder(id);
        window.history.replaceState({
            type: 'folder',
            id: id
        }, '', url);
    }
}
function replaceGroup(groupId) {
    var url;
    url = buildGroupUrl(groupId);
    window.history.replaceState({
        type: 'group',
        groupId: groupId
    }, '', url);
}
function replaceGroups() {
    var url;
    url = buildGroupsUrl();
    window.history.replaceState({ type: 'groups' }, '', url);
}
function replaceHome() {
    var url;
    url = buildBaseUrl();
    window.history.replaceState({ type: 'home' }, '', url);
}
function reportChange(op, items) {
    var _collection_2, change, key, listener;
    change = {
        op: op,
        items: items
    };
    _collection_2 = unit.dataListeners;
    for (key in _collection_2) {
        listener = _collection_2[key];
        listener(change);
    }
}
function reportClip() {
    reportChange('clip', []);
}
function reportDelete(ids) {
    reportChange('delete', ids);
}
function reportInsert(items) {
    reportChange('insert', items);
}
function reportUpdate(items) {
    reportChange('update', items);
}
async function reportsScreen(widget, parent) {
    var container, stats, status, table;
    container = div({
        'overflow-y': 'auto',
        'height': '100%'
    });
    html.add(parent, container);
    setAdminTitle(container, tr('Reports'));
    showWait();
    status = await sendRequest('GET', '/api/summary');
    hideWait();
    console.log(status);
    stats = convertStatistics(status);
    console.log(stats);
    addSubHeader(container, tr('Statistics'));
    table = createTableFromData(stats);
    html.add(container, table);
    addSubHeader(container, tr('refs'));
}
function requestCollapse(evt, widget, id) {
    evt.stopPropagation();
    if (!widget.locked) {
        widget.collapse(id);
        rebuildTreeView(widget);
    }
}
async function resetPassword(form, emailInput, bad) {
    var buttons, email, payload, toLogon;
    bad.style.display = 'none';
    email = emailInput.value.trim();
    if (email) {
        if (dh2common.checkEmail(email)) {
            payload = { user_email: email };
            showWait();
            sendRequestRaw('POST', '/api/reset_pass', payload);
            hideWait();
            html.clear(form);
            html.add(form, div({ text: tr('Password has been reset. Check your email.') }));
            toLogon = widgets.createDefaultButton(tr('Go to logon'), goToLogon);
            toLogon.style.marginRight = '0px';
            html.add(form, div({ height: '20px' }));
            buttons = div({ 'text-align': 'right' });
            html.add(form, buttons);
            html.add(buttons, toLogon);
            html.add(form, bad);
        } else {
            html.setText(bad, tr('Wrong email format'));
            bad.style.display = 'block';
            emailInput.focus();
        }
    } else {
        html.setText(bad, tr('Email cannot be empty'));
        bad.style.display = 'block';
        emailInput.focus();
    }
}
function resizeSplit(widget, model) {
    var divider, grab, left, leftContainer, padding, rect, rightContainer, width;
    width = 7;
    padding = 10;
    rect = widget.container.getBoundingClientRect();
    left = Math.min(widget.leftWidth, rect.width - 10);
    widget.leftWidth = left;
    leftContainer = div({
        display: 'inline-block',
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: left + 'px',
        height: '100%'
    });
    html.add(widget.container, leftContainer);
    rightContainer = div({
        display: 'inline-block',
        position: 'absolute',
        left: left + width + 'px',
        top: '0px',
        width: 'calc(100% - ' + (left + width) + 'px)',
        height: '100%'
    });
    html.add(widget.container, rightContainer);
    model.renderChild(leftContainer, widget.left);
    model.renderChild(rightContainer, widget.right);
    divider = div({
        display: 'inline-block',
        position: 'absolute',
        background: 'white',
        left: left + 'px',
        top: '0px',
        width: width + 'px',
        height: '100%',
        'border-left': 'solid 1px #a0a0a0',
        'border-right': 'solid 1px #a0a0a0'
    });
    html.add(widget.container, divider);
    grab = div({
        display: 'inline-block',
        position: 'absolute',
        left: left - padding + 'px',
        top: '0px',
        width: width + padding * 2 + 'px',
        height: '100%',
        'z-index': 10,
        cursor: 'col-resize'
    });
    html.add(widget.container, grab);
    registerEvent(grab, 'mousedown', function () {
        showBackMover(widget);
    });
}
function restoreClientGlobal() {
    if (unit.clientStatus.expanded) {
        unit.clientStatus.expanded = false;
        unit.clientStatus.topBar.restoreClient();
        unit.clientStatus.sideBar.restoreClient();
    }
}
function restoreProject(spaceId, name) {
    var _obj_;
    _obj_ = restoreProject_create(spaceId, name);
    return _obj_.run();
}
function restoreProject_create(spaceId, name) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'restoreProject',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* restoreProject_main() {
        var _eventType_, _event_, accept, buttons, cancel, dialog, fileInfo, headerDiv, id, success, url;
        trace('restoreProject', spaceId);
        dialog = widgets.createMiddleWindow();
        headerDiv = div({
            'text-align': 'center',
            'line-height': 1.3,
            'padding-bottom': '10px',
            'position': 'relative'
        }, div({
            text: tr('Are your sure you want to restore the project?'),
            'font-size': getHeader2Size()
        }));
        if (name) {
            html.add(headerDiv, div({
                text: name,
                'font-weight': 'bold',
                'font-size': getHeader2Size()
            }));
        }
        html.add(dialog, headerDiv);
        html.add(dialog, div({ text: tr('All the existing content of the project will be destroyed forever.') }));
        cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
        cancel.style.marginRight = '0px';
        buttons = div({
            'text-align': 'right',
            'padding-top': '20px'
        }, widgets.createBadButton(tr('Restore from file'), me.yes), cancel);
        html.add(dialog, buttons);
        me.state = '17';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'yes') {
            widgets.removeQuestions();
            accept = '.zip,application/zip,application/x-zip-compressed';
            widgets.uploadFile(tr('Choose a backup file'), accept, showWait, true).then(me.onUploaded);
            me.state = '66';
            me._busy = false;
            _event_ = yield;
            fileInfo = _event_[1];
            url = '/api/restore_backup/' + spaceId;
            showWait();
            trace('uploadFile', url);
            http.uploadFileToServer(url, 'restore', fileInfo.file).then(me.onUploadedToServer);
            me.state = '67';
            me._busy = false;
            _event_ = yield;
            success = _event_[1];
            hideWait();
            if (success) {
                unit.screens.folder.recent.setItems([]);
                id = spaceId + ' 1';
                goToFolder(id, undefined);
            } else {
                widgets.showErrorSnack(tr('An error has occurred'));
            }
        } else {
            if (!(_eventType_ === 'cancel')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            widgets.removeQuestions();
        }
        _topResolve_();
    }
    function restoreProject_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = restoreProject_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = restoreProject_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.yes = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '17':
            _args_ = [];
            _args_.push('yes');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '17':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onUploaded = function (fileInfo) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '66':
            _args_ = [];
            _args_.push('onUploaded');
            _args_.push(fileInfo);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onUploadedToServer = function (success) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '67':
            _args_ = [];
            _args_.push('onUploadedToServer');
            _args_.push(success);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
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
async function saveDetails(widget, usernameInput, emailInput, good, bad) {
    var email, error, errorObj, marketing, message, name, payload, response;
    good.style.display = 'none';
    bad.style.display = 'none';
    name = usernameInput.value || '';
    name = name.trim();
    marketing = dh2common.getFormCheckbox(widget, 'marketingCheck');
    error = dh2common.checkProjectName(name);
    if (error) {
        html.setText(bad, error);
        usernameInput.focus();
        bad.style.display = '';
    } else {
        email = emailInput.value || '';
        email = email.trim();
        if (email) {
            if (dh2common.checkEmail(email)) {
                payload = {
                    email: email,
                    name: name,
                    marketing: marketing
                };
                showWait();
                response = await sendRequestCheckAuth('POST', '/api/update_user', payload);
                hideWait();
                if (dh2common.isSuccess(response)) {
                    html.setText(good, tr('Changes saved'));
                    good.style.display = '';
                    await dh2common.fetchAccount();
                    widget.account = dh2common.getAccountObj();
                    await rebuildUi();
                } else {
                    errorObj = JSON.parse(response.responseText);
                    message = dh2common.getSupportedDomainError(errorObj);
                    if (!message) {
                        message = tr('Could not save changes');
                    }
                    html.setText(bad, message);
                    emailInput.focus();
                    bad.style.display = '';
                }
            } else {
                html.setText(bad, tr('Wrong email format'));
                emailInput.focus();
                bad.style.display = '';
            }
        } else {
            html.setText(bad, tr('Email cannot be empty'));
            emailInput.focus();
            bad.style.display = '';
        }
    }
}
function saveInClipboard(type, obj) {
    var content;
    obj.rootFolder = unit.globals.rootFolder;
    content = JSON.stringify(obj);
    localStorage.setItem('clipboard-type', type);
    localStorage.setItem('clipboard', content);
}
async function saveLanguage(languageControls) {
    var bad, good, response, settings;
    good = languageControls.good;
    bad = languageControls.bad;
    settings = buildLanguageSettings(languageControls);
    if (settings) {
        showWait();
        response = await dh2common.saveUserSettings(settings);
        if (dh2common.isSuccess(response)) {
            html.setText(good, tr('Changes saved'));
            good.style.display = '';
            await rebuildUi();
        } else {
            html.setText(bad, tr('Could not save changes'));
        }
        hideWait();
    } else {
    }
}
function saveLicenseStatus() {
    var account;
    account = dh2common.getAccountObj();
    unit.globals.licenseExpired = account.license_expired;
}
function searchRunner(widget) {
    var _obj_;
    _obj_ = searchRunner_create(widget);
    return _obj_.run();
}
function searchRunner_create(widget) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'searchRunner',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* searchRunner_main() {
        var _branch_, _eventType_, _event_, accurate, converted, error, foundBefore, needle, result, timeoutId;
        try {
            _branch_ = 'Idle';
            while (true) {
                switch (_branch_) {
                case 'Idle':
                    me.state = '78';
                    me._busy = false;
                    _event_ = yield;
                    _eventType_ = _event_[0];
                    if (_eventType_ === 'onInput') {
                        needle = _event_[1];
                        _branch_ = 'Folders';
                    } else {
                        if (!(_eventType_ === 'findReferences')) {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        needle = _event_[1];
                        accurate = _event_[2];
                        widget.status = 'searching';
                        widget.needle = needle;
                        clearSearchWidget(widget);
                        redrawSearchItems(widget);
                        _branch_ = 'Items - start';
                    }
                    break;
                case 'Folders':
                    if (needle) {
                        widget.status = 'searching';
                        widget.needle = needle;
                        clearSearchWidget(widget);
                        redrawSearchItems(widget);
                        sendPostSearch(widget.spaceId, 'folders', needle, me);
                        me.state = '17';
                        me._busy = false;
                        _event_ = yield;
                        _eventType_ = _event_[0];
                        if (_eventType_ === 'onData') {
                            result = _event_[1];
                            widget.found = result.folders.map(folderToFound);
                            redrawSearchItems(widget);
                            _branch_ = 'Items - start';
                        } else {
                            if (_eventType_ === 'onError') {
                                error = _event_[1];
                                _branch_ = 'Wait';
                            } else {
                                if (!(_eventType_ === 'onInput')) {
                                    throw new Error('Unexpected case value: ' + _eventType_);
                                }
                                needle = _event_[1];
                                _branch_ = 'Folders';
                            }
                        }
                    } else {
                        widget.status = 'not started';
                        redrawSearchItems(widget);
                        _branch_ = 'Idle';
                    }
                    break;
                case 'Items - start':
                    sendPostSearch(widget.spaceId, 'items', needle, me, accurate);
                    me.state = '28';
                    me._busy = false;
                    _event_ = yield;
                    _eventType_ = _event_[0];
                    if (_eventType_ === 'onData') {
                        result = _event_[1];
                        _branch_ = 'Items - result';
                    } else {
                        if (_eventType_ === 'onError') {
                            error = _event_[1];
                            _branch_ = 'Wait';
                        } else {
                            if (!(_eventType_ === 'onInput')) {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            needle = _event_[1];
                            _branch_ = 'Folders';
                        }
                    }
                    break;
                case 'Items - result':
                    sendGetSearch(widget.spaceId, me);
                    me.state = '37';
                    me._busy = false;
                    _event_ = yield;
                    _eventType_ = _event_[0];
                    if (_eventType_ === 'onData') {
                        result = _event_[1];
                        foundBefore = widget.found.length;
                        converted = result.items.map(itemToFound);
                        widget.found = widget.found.concat(converted);
                        if (foundBefore === 0) {
                            redrawSearchItems(widget);
                        } else {
                            appendFoundItems(widget, converted);
                        }
                        if (result.completed) {
                            widget.status = 'completed';
                            if (widget.found.length === 0) {
                                redrawSearchItems(widget);
                            }
                        }
                        if (result.completed) {
                            _branch_ = 'Idle';
                        } else {
                            _branch_ = 'Items - result';
                        }
                    } else {
                        if (_eventType_ === 'onError') {
                            error = _event_[1];
                            _branch_ = 'Wait';
                        } else {
                            if (!(_eventType_ === 'onInput')) {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            needle = _event_[1];
                            _branch_ = 'Folders';
                        }
                    }
                    break;
                case 'Wait':
                    timeoutId = setTimeout(me.onTimeout, 200, true);
                    me.state = '90';
                    me._busy = false;
                    _event_ = yield;
                    _eventType_ = _event_[0];
                    if (_eventType_ === 'onInput') {
                        needle = _event_[1];
                        clearTimeout(timeoutId);
                        _branch_ = 'Folders';
                    } else {
                        if (!(_eventType_ === 'onTimeout')) {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        _branch_ = 'Items - start';
                    }
                    break;
                default:
                    _topResolve_();
                    return;
                }
            }
        } catch (_handlerData_) {
            widget.status = 'error';
            clearSearchWidget(widget);
            redrawSearchItems(widget);
        }
    }
    function searchRunner_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = searchRunner_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = searchRunner_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onData = function (result) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '17':
        case '28':
        case '37':
            _args_ = [];
            _args_.push('onData');
            _args_.push(result);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onError = function (error) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '17':
        case '28':
        case '37':
            _args_ = [];
            _args_.push('onError');
            _args_.push(error);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onInput = function (needle) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '17':
        case '28':
        case '37':
        case '78':
        case '90':
            _args_ = [];
            _args_.push('onInput');
            _args_.push(needle);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.findReferences = function (needle, accurate) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '78':
            _args_ = [];
            _args_.push('findReferences');
            _args_.push(needle);
            _args_.push(accurate);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '90':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
async function sendCreateFolder(parentId, type, name, output) {
    var body, id, parsed, payload, response, url;
    parsed = parseId(parentId);
    payload = {
        name: name,
        parent: parsed.folderId,
        type: type
    };
    url = '/api/folder/' + parsed.spaceId;
    response = await sendRequestCheckAuth('POST', url, payload);
    if (response.responseText) {
        body = JSON.parse(response.responseText);
        if (dh2common.isSuccess(response)) {
            id = makeId(parsed.spaceId, body.folder_id);
            output.id = id;
            output.name = name;
            output.type = type;
            output.parent = parentId;
            return undefined;
        } else {
            if (body.error === 'ERR_NAME_NOT_UNIQUE') {
                return tr('Name is not unique');
            } else {
                return tr('An error has occurred');
            }
        }
    } else {
        return tr('An error has occurred');
    }
}
async function sendDeactivateLicense() {
    var payload;
    payload = {};
    await sendRequest('POST', '/api/deactivate_license', payload);
}
async function sendEditCore(id, edit) {
    var parsed, url;
    parsed = parseId(id);
    url = '/api/edit/' + parsed.spaceId + '/' + parsed.folderId;
    await sendRequest('POST', url, edit);
}
async function sendErrorReport(ex) {
    var account, folderId, report, settings, stack;
    try {
        account = dh2common.getAccountObj();
        settings = dh2common.getSettingsObj();
        stack = ex.stack || '';
        if (isDrakon()) {
            folderId = unit.screens.folder.folderId;
        } else {
            folderId = undefined;
        }
        report = {
            type: 'crash',
            url: window.location.href,
            settings: settings,
            folderId: folderId,
            user: account.user_id,
            name: account.name,
            email: account.email,
            section: unit.multi.current,
            message: 'panic',
            errorMsg: ex.name + ' ' + ex.message + ': ' + stack,
            trace: dh2common.getTraces(),
            largeObj: dh2common.getLargeObj()
        };
        if (dh2common.isNetworkError(ex)) {
        } else {
            await sendRequestRaw('POST', '/api/feedback', report);
        }
    } catch (_handlerData_) {
        console.error(_handlerData_);
    }
}
function sendGetSearch(spaceId, parent) {
    var url;
    url = '/api/search';
    sendRequestWithCallback('GET', url, undefined, parent);
}
function sendPostSearch(spaceId, searchType, needle, parent, accurate) {
    var payload, url;
    payload = {
        spaces: [spaceId],
        type: searchType,
        needle: needle,
        accurate: accurate
    };
    url = '/api/search';
    sendRequestWithCallback('POST', url, payload, parent);
}
async function sendRename(id, newName) {
    var body, parsed, payload, response, url;
    showWait();
    parsed = parseId(id);
    payload = { 'name': newName };
    url = '/api/folder/' + parsed.spaceId + '/' + parsed.folderId;
    response = await sendRequestCheckAuth('PUT', url, payload);
    hideWait();
    if (dh2common.isSuccess(response)) {
        return undefined;
    } else {
        if (response.responseText) {
            body = JSON.parse(response.responseText);
            if (body.error === 'ERR_NAME_NOT_UNIQUE') {
                return tr('Name is not unique');
            } else {
                return tr('An error has occurred');
            }
        } else {
            return tr('An error has occurred');
        }
    }
}
async function sendRenameProject(spaceId, newName) {
    var payload, url;
    payload = {
        space_id: spaceId,
        name: newName
    };
    url = '/api/update_space';
    return await sendRequest('POST', url, payload);
}
async function sendRequest(method, url, payload) {
    var error, response;
    response = await sendRequestCheckAuth(method, url, payload);
    if (dh2common.isSuccess(response)) {
        if (response.responseText) {
            return JSON.parse(response.responseText);
        } else {
            return undefined;
        }
    } else {
        console.error(response);
        error = new Error('HTTP error. Status=' + response.status + ' url=' + url);
        error.status = response.status;
        throw error;
    }
}
async function sendRequestCheckAuth(method, url, payload) {
    var error, response;
    response = await sendRequestRaw(method, url, payload);
    if (dh2common.isSuccess(response) || !(response.status === 403)) {
        return response;
    } else {
        await dh2common.fetchAccount();
        if (dh2common.isLoggedOn()) {
            error = new Error('Access denied');
            error.denied = true;
        } else {
            error = new Error('Must log on');
            error.mustLogon = true;
        }
        throw error;
    }
}
async function sendRequestFake(method, url, payload) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        payments: [
            {
                payment_date: 1681719618,
                amount: 456
            },
            {
                payment_date: 1676625618,
                amount: 123
            },
            {
                payment_date: 1679044818,
                amount: 234
            },
            {
                payment_date: 1684311618,
                amount: 567
            }
        ]
    };
}
async function sendRequestRaw(method, url, payload) {
    var body, error, fullUrl, headers, response;
    if (payload) {
        body = JSON.stringify(payload);
    } else {
        body = '';
    }
    fullUrl = baseUrl() + url;
    headers = getHeaders();
    trace('sendRequestRaw', method + ' ' + fullUrl);
    response = await http.sendRequest(method, fullUrl, body, headers);
    if (response.status === 0) {
        error = new Error('No connection');
        error.disconnected = true;
        throw error;
    } else {
        return response;
    }
}
async function sendRequestRawNoCheck(method, url, payload) {
    var body, fullUrl, headers, response;
    if (payload) {
        body = JSON.stringify(payload);
    } else {
        body = '';
    }
    fullUrl = baseUrl() + url;
    headers = getHeaders();
    response = await http.sendRequest(method, fullUrl, body, headers);
    return response;
}
async function sendRequestWithCallback(method, url, payload, parent) {
    var response;
    response = await sendRequest(method, url, payload);
    parent.onData(response);
}
function setAccountTitle(parent, account, title) {
    dh2common.setTitle(tr('Account') + ' / ' + title);
    html.add(parent, div({ text: account.user_id }));
    html.add(parent, div('account-header', { text: account.name }));
    html.add(parent, div('account-title', { text: title }));
}
function setAdminTitle(parent, title) {
    dh2common.setTitle(tr('Admin') + ' / ' + title);
    html.add(parent, div('account-title', { text: title }));
}
function setChosenUser(parent, container, user) {
    var block, obj;
    obj = {
        'user id': user.user_id,
        'name': user.name,
        'email': user.email
    };
    block = div('active-border');
    showKeyValues(obj, block);
    registerEvent(block, 'click', function () {
        parent.onUserSelected(user);
    });
    html.add(container, block);
}
function setDefaultValue(obj, prop, value) {
    if (!utils.hasValue(obj[prop])) {
        obj[prop] = value;
    }
}
function setFolderActive(parent, child) {
    if (parent) {
        if (!unit.globals.active) {
            unit.globals.active = {};
        }
        unit.globals.active[parent] = child;
    }
}
function setGlobalView(view, folder) {
    var globals;
    globals = unit.globals;
    if (folder) {
        if (globals.spaceId === folder.space_id) {
            globals.id = folder.id;
            globals.view = view;
        } else {
            globals.id = folder.id;
            globals.spaceId = folder.space_id;
            globals.view = view;
        }
    } else {
        globals.id = undefined;
        globals.spaceId = undefined;
        globals.view = view;
    }
    unit.multi.setCurrent(view);
}
function setGrey(ids) {
    var id;
    unit.globals.greyed = {};
    for (id of ids) {
        unit.globals.greyed[id] = true;
    }
}
function setSplitPositions(widget, left) {
    var padding, rstyle, width;
    width = 7;
    padding = 5;
    widget.leftWidth = left;
    widget.leftContainer.style.width = left + 'px';
    rstyle = widget.rightContainer.style;
    rstyle.left = left + width + 'px';
    rstyle.width = 'calc(100% - ' + (left + width) + 'px)';
    widget.divider.style.left = left + 'px';
    widget.divider.style.width = width + 'px';
    widget.grab.style.left = left - padding + 'px';
    widget.grab.style.width = width + padding * 2 + 'px';
    widget.grab.style.position = 'absolute';
    widget.grab.style.top = '0px';
    widget.grab.style.height = '100%';
}
function setTimeout(action, delay, notrace) {
    return dh2common.setTimeout(action, delay, notrace);
}
function setUserSearchResults(parent, container, users) {
    var user;
    html.clear(container);
    if (users.length === 0) {
        addNoResults(container);
    } else {
        users.sort();
        for (user of users) {
            addAddUser(parent, container, user);
        }
    }
}
function setUserSearchResultsAdmin(parent, container, user) {
    html.clear(container);
    if (user) {
        setChosenUser(parent, container, user);
    }
}
function shareDiagram(widget) {
    var buttons, client, copy, dia, input, name, spaceId;
    if (window.padBridge && window.padBridge.shareDiagram) {
        dia = dh2common.saveAsJsonCore(widget.drakon);
        window.padBridge.shareDiagram(dia.filename, dia.exported, dia.mime);
    } else {
        client = widgets.createMiddleWindow();
        html.add(client, div({
            text: tr('Link to this document.'),
            padding: '10px'
        }));
        if (!widget.isPublic) {
            html.add(client, div({
                text: tr('This project is not public. ' + 'Users that are not registered on') + ' ' + gconfig.appName + ' ' + tr('and were not granted access will' + ' not be able to open this link.'),
                padding: '10px'
            }));
        }
        input = html.createElement('input', {
            type: 'text',
            readonly: true
        }, [{
                margin: '10px',
                width: 'calc(100% - 70px)'
            }]);
        input.value = window.location.href;
        html.add(client, input);
        copy = widgets.createIconButton(ipath('copy.png'), function () {
            copyUrl(input);
        });
        copy.style.width = '30px';
        copy.style.height = '30px';
        copy.style.marginRight = '0px';
        copy.style.verticalAlign = 'middle';
        html.add(client, copy);
        buttons = div({
            'text-align': 'right',
            'padding-bottom': '5px'
        });
        if (widget.access === 'admin') {
            spaceId = parseId(widget.folderId).spaceId;
            name = getSpaceName(spaceId);
            html.add(buttons, widgets.createSimpleButton(tr('Access rights'), function () {
                changeAccessAndReload(spaceId, name);
            }));
        }
        html.add(buttons, widgets.createDefaultButton(tr('Close'), widgets.removeQuestions));
        html.add(client, buttons);
    }
}
function shouldShowFindRefs(item) {
    if (item.type === 'folder' || widgets.isNarrowScreen()) {
        return false;
    } else {
        return true;
    }
}
function showAboutPad() {
    var dialog, title, ver;
    dialog = widgets.createMiddleWindow();
    title = createLogoLinkPad();
    html.add(dialog, div({ 'text-align': 'center' }, title));
    ver = div({
        'padding': '5px',
        'text': 'v ' + dh2common.getAppVersion()
    });
    html.add(dialog, ver);
    html.add(dialog, widgets.div({
        'padding': '10px',
        'padding-top': '40px'
    }, widgets.createSimpleButton(tr('Close'), widgets.removeQuestions)));
}
function showAccessRights(spaceId, name) {
    var _obj_;
    _obj_ = showAccessRights_create(spaceId, name);
    return _obj_.run();
}
function showAccessRights_create(spaceId, name) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'showAccessRights',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* showAccessRights_main() {
        var _branch_, _eventType_, _event_, access, category, dialog, isPublic, originalAccess, payload, response, url, user, userId;
        _branch_ = 'Fetch access rights from server';
        while (true) {
            switch (_branch_) {
            case 'Fetch access rights from server':
                widgets.removeQuestions();
                showWait();
                url = '/api/access/' + spaceId;
                getFromServer(url).then(me.onAccess);
                me.state = '58';
                me._busy = false;
                _event_ = yield;
                access = _event_[1];
                hideWait();
                originalAccess = utils.deepClone(access);
                dialog = widgets.createMiddleWindow();
                dialog.style.padding = '10px';
                rebuildAccessDialog(me, dialog, spaceId, name, access);
                widgets.markUnsaved();
                _branch_ = 'Wait for user actions';
                break;
            case 'Wait for user actions':
                me.state = '18';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'addUser') {
                    category = _event_[1];
                    findUser(dialog, access[category]).then(me.onUser);
                    me.state = '59';
                    me._busy = false;
                    _event_ = yield;
                    user = _event_[1];
                    if (user) {
                        access[category].push(user);
                    }
                    rebuildAccessDialog(me, dialog, spaceId, name, access);
                    _branch_ = 'Wait for user actions';
                } else {
                    if (_eventType_ === 'removeUser') {
                        category = _event_[1];
                        userId = _event_[2];
                        utils.removeBy(access[category], 'user_id', userId);
                        rebuildAccessDialog(me, dialog, spaceId, name, access);
                        _branch_ = 'Wait for user actions';
                    } else {
                        if (_eventType_ === 'setPublicAccess') {
                            isPublic = _event_[1];
                            access['public'] = isPublic;
                            _branch_ = 'Wait for user actions';
                        } else {
                            if (_eventType_ === 'save') {
                                if (access.admins.length === 0) {
                                    rebuildAccessDialog(me, dialog, spaceId, name, access, tr('Cannot remove last admin'));
                                    _branch_ = 'Wait for user actions';
                                } else {
                                    _branch_ = 'Save access';
                                }
                            } else {
                                if (!(_eventType_ === 'cancel')) {
                                    throw new Error('Unexpected case value: ' + _eventType_);
                                }
                                widgets.removeQuestions();
                                _topResolve_(false);
                                return;
                            }
                        }
                    }
                }
                break;
            case 'Save access':
                payload = calculateAccessDifference(originalAccess, access, spaceId);
                if (payload) {
                    showWait();
                    sendRequestCheckAuth('POST', '/api/multi_access', payload).then(me.onResponse);
                    me.state = '60';
                    me._busy = false;
                    _event_ = yield;
                    response = _event_[1];
                    hideWait();
                    if (dh2common.isSuccess(response)) {
                        widgets.removeQuestions();
                        _topResolve_(true);
                        return;
                    } else {
                        rebuildAccessDialog(me, dialog, spaceId, name, access, tr('Could not save access rights'));
                        _branch_ = 'Wait for user actions';
                    }
                } else {
                    _topResolve_(true);
                    return;
                }
                break;
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                _topResolve_();
                return;
            }
        }
    }
    function showAccessRights_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = showAccessRights_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = showAccessRights_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.addUser = function (category) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('addUser');
            _args_.push(category);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.removeUser = function (category, userId) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('removeUser');
            _args_.push(category);
            _args_.push(userId);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.setPublicAccess = function (isPublic) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('setPublicAccess');
            _args_.push(isPublic);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.save = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('save');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onAccess = function (access) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '58':
            _args_ = [];
            _args_.push('onAccess');
            _args_.push(access);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onUser = function (user) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '59':
            _args_ = [];
            _args_.push('onUser');
            _args_.push(user);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function (response) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '60':
            _args_ = [];
            _args_.push('onResponse');
            _args_.push(response);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function showAccountMenu() {
    var client;
    client = div();
    addGotoFileSection(client);
    addAccountSection(client);
    addAdminSection(client);
    createCustomMainMenu(client);
}
function showComboUnder(element, items) {
    var rect;
    rect = element.getBoundingClientRect();
    widgets.showContextMenuExact(rect.left, rect.bottom, items);
}
async function showContextMenu(widget, x, y, items, prim) {
    var content, folder, folders, id, options;
    options = { movable: true };
    items.forEach(dh2common.removeTagsFromRedirect);
    widgets.showContextMenu(x, y, items, options);
    if (prim && mustFindDefinition(prim.type, widget)) {
        content = dh2common.stripTags(prim.content);
        if (content) {
            id = widget.folderId;
            folders = await findFolders(id, content);
            if (!(folders.length === 0)) {
                items.push({ type: 'separator' });
                for (folder of folders) {
                    createGoToDefinition(items, folder);
                }
                widgets.showContextMenu(x, y, items, options);
            }
        }
    }
}
function showContextMenuUnder(evt, actions) {
    var rect;
    rect = evt.target.getBoundingClientRect();
    evt.stopPropagation();
    widgets.showContextMenuExact(rect.left, rect.bottom, actions);
}
function showDeletedSnack(parent, ids) {
    setTimeout(initRecent, 1000);
    widgets.showUndoSnack(tr('The objects have been deleted'), function () {
        undoObjectDeletion(parent, ids);
    });
}
function showDocumentItem(itemId) {
    trace('showDocumentItem', itemId);
    unit.screens.folder.showItem(itemId);
}
function showEditableEdit(editable, oldText, options) {
    var _obj_;
    _obj_ = showEditableEdit_create(editable, oldText, options);
    return _obj_.run();
}
function showEditableEdit_create(editable, oldText, options) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'showEditableEdit',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* showEditableEdit_main() {
        var _eventType_, _event_, bottom, cancel, dialog, error, errorMessage, input, ok, rect, text, x2, y2;
        input = html.createElement('textarea');
        rect = editable.getBoundingClientRect();
        input.style.width = rect.width + 'px';
        input.style.height = rect.height + 'px';
        formatEditableStyle(input, options);
        ok = widgets.createDefaultButton(tr('Accept'), me.confirm);
        cancel = widgets.createSimpleButton(tr('Cancel'), widgets.removePopups);
        cancel.style.margin = '0px';
        bottom = div({
            'padding-top': '5px',
            'text-align': 'right'
        }, ok, cancel);
        error = div({
            'padding-top': '5px',
            'color': 'dark-red',
            display: 'none'
        });
        registerEvent(input, 'keydown', function () {
            onEditableKeyDown(me, evt);
        });
        dialog = div('shadow', {
            width: rect.width + 10 + 'px',
            'max-width': '100vw',
            padding: '5px',
            background: 'white',
            border: 'solid 1px #a0a0a0'
        }, input, bottom);
        x2 = rect.left - 6;
        y2 = rect.top - 6;
        widgets.removePopups();
        widgets.pushSemiModalPopup(dialog, x2, y2);
        input.value = oldText;
        input.focus();
        while (true) {
            me.state = '30';
            me._busy = false;
            _event_ = yield;
            _eventType_ = _event_[0];
            if (_eventType_ === 'cancel') {
                widgets.removePopups();
                break;
            } else {
                if (!(_eventType_ === 'confirm')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                text = input.value.trim();
                errorMessage = checkInputText(text, options.check);
                if (errorMessage) {
                    error.style.display = 'block';
                    html.setText(error, errorMessage);
                } else {
                    widgets.removePopups();
                    options.onSave(text);
                    break;
                }
            }
        }
        _topResolve_();
    }
    function showEditableEdit_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = showEditableEdit_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = showEditableEdit_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '30':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.confirm = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '30':
            _args_ = [];
            _args_.push('confirm');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function showExportOptions(widget, evt) {
    var drakon, items, rect;
    drakon = widget.drakon;
    items = [];
    if (!gconfig.desktop) {
        if (!(widget.access === 'read')) {
            items.push({
                text: tr('Import diagram file'),
                action: function () {
                    importJson(widget.parentId);
                }
            });
        }
        items.push({
            text: tr('Export to diagram file'),
            action: function () {
                dh2common.saveAsJson(drakon);
            }
        });
    }
    if (isDrakonDrakon()) {
        items.push({
            text: ScenariosTitle(),
            action: widget.drakon.showScenarios
        });
    }
    items.push({ type: 'separator' });
    items.push({
        text: tr('Save as picture') + ' \xD74',
        action: function () {
            dh2common.saveAsPng(drakon, 4);
        }
    });
    items.push({
        text: tr('Save as picture') + ' \xD72',
        action: function () {
            dh2common.saveAsPng(drakon, 2);
        }
    });
    if (!gconfig.pad || gconfig.desktop) {
        items.push({ type: 'separator' });
        items.push({
            text: tr('Save as picture') + ': SVG',
            action: function () {
                dh2common.saveAsSvg(drakon);
            }
        });
    }
    items.push({
        text: tr('Save as picture'),
        action: function () {
            dh2common.saveAsPng(drakon, 1);
        }
    });
    rect = evt.target.getBoundingClientRect();
    widgets.showContextMenuExact(rect.left, rect.bottom, items);
}
async function showFeedBackItem(parent, item) {
    var obj, payload, response;
    showWait();
    payload = { filename: item.id };
    response = await sendRequest('POST', '/api/get_feedback_item', payload);
    hideWait();
    html.clear(parent);
    obj = JSON.parse(response.content);
    obj.timestamp = item.timestamp;
    showKeyValues(obj, parent);
}
function showFeedbackWindow() {
    var _obj_;
    _obj_ = showFeedbackWindow_create();
    return _obj_.run();
}
function showFeedbackWindow_create() {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'showFeedbackWindow',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* showFeedbackWindow_main() {
        var _eventType_, _event_, account, area, buttons, cancel, dialog, message, payload;
        trace('showFeedbackWindow');
        dialog = widgets.createMiddleWindow();
        html.add(dialog, div({
            'text-align': 'center',
            'line-height': 1.3,
            'padding-bottom': '10px',
            'position': 'relative'
        }, div({
            text: tr('Found a bug? Have an idea? Tell us.'),
            'font-size': getHeader2Size()
        })));
        area = html.createElement('textarea', { maxlength: 1000 }, [{
                resize: 'none',
                width: '100%',
                height: '200px'
            }]);
        html.add(dialog, area);
        cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
        cancel.style.marginRight = '0px';
        buttons = div({
            'text-align': 'right',
            'padding-top': '5px'
        }, widgets.createDefaultButton(tr('Send'), me.send), cancel);
        html.add(dialog, buttons);
        area.focus();
        me.state = '18';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'send') {
            widgets.removeQuestions();
            message = area.value;
            account = dh2common.getAccountObj();
            payload = {
                url: window.location.href,
                user: account.user_id,
                name: account.name,
                email: account.email,
                section: unit.multi.current,
                type: 'feedback',
                message: message
            };
            sendRequestRaw('POST', '/api/feedback', payload).then(me.onResponse);
            me.state = '30';
            me._busy = false;
            _event_ = yield;
            widgets.showGoodSnack(tr('Thank you!'));
        } else {
            if (!(_eventType_ === 'cancel')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            widgets.removeQuestions();
        }
        _topResolve_();
    }
    function showFeedbackWindow_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = showFeedbackWindow_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = showFeedbackWindow_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.send = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('send');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '30':
            _args_ = [];
            _args_.push('onResponse');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function showFolderMenu(widget) {
    var client;
    if (gconfig.pad) {
        showPadMainMenu(widget);
    } else {
        client = div();
        addGotoFileSection(client);
        addCreateFolderSection(widget, client);
        addFileSection(widget, client);
        addAccountSection(client);
        addAdminSection(client);
        createCustomMainMenu(client);
    }
}
function showInlineSettings() {
    var _obj_;
    _obj_ = showInlineSettings_create();
    return _obj_.run();
}
function showInlineSettings_create() {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'showInlineSettings',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* showInlineSettings_main() {
        var _branch_, _eventType_, _event_, dialog, form, languageControls, response, settings;
        _branch_ = 'Fetch access rights from server';
        while (true) {
            switch (_branch_) {
            case 'Fetch access rights from server':
                widgets.removeQuestions();
                settings = dh2common.getSettingsObj();
                dialog = widgets.createMiddleWindow();
                dialog.style.padding = '10px';
                html.add(dialog, div({
                    'text-align': 'center',
                    'line-height': 1.3,
                    'padding-bottom': '10px'
                }, div({ text: tr('Settings') })));
                form = html.createElement('form');
                html.add(dialog, form);
                fillLanguageForm(form, settings, me.save, me.cancel);
                _branch_ = 'Wait for user actions';
                break;
            case 'Wait for user actions':
                me.state = '18';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'save') {
                    languageControls = _event_[1];
                    settings = buildLanguageSettings(languageControls);
                    if (settings) {
                        _branch_ = 'Save settings';
                    } else {
                        _branch_ = 'Wait for user actions';
                    }
                } else {
                    if (!(_eventType_ === 'cancel')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    widgets.removeQuestions();
                    _branch_ = 'Exit';
                }
                break;
            case 'Save settings':
                showWait();
                dh2common.saveUserSettings(settings).then(me.onResponse);
                me.state = '78';
                me._busy = false;
                _event_ = yield;
                response = _event_[1];
                hideWait();
                if (dh2common.isSuccess(response)) {
                    widgets.removeQuestions();
                    window.location.reload();
                    _branch_ = 'Exit';
                } else {
                    languageControls.bad.style.display = '';
                    html.setText(languageControls.bad, tr('Could not save changes'));
                    _branch_ = 'Wait for user actions';
                }
                break;
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                _topResolve_();
                return;
            }
        }
    }
    function showInlineSettings_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = showInlineSettings_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = showInlineSettings_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.save = function (languageControls) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('save');
            _args_.push(languageControls);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '18':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onResponse = function (response) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '78':
            _args_ = [];
            _args_.push('onResponse');
            _args_.push(response);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function showKeyValues(obj, container) {
    var table;
    table = html.createElement('table');
    html.add(container, table);
    showKeyValuesCore(obj, table);
}
function showKeyValuesCore(obj, table) {
    var key, keys;
    keys = Object.keys(obj);
    keys.sort();
    for (key of keys) {
        createKeyValue(table, key, obj[key]);
    }
}
function showLicense(container, license) {
    var licenseType, table;
    if (license.type === 'eval') {
        licenseType = tr('Evaluation license');
    } else {
        licenseType = tr('Cloud license');
    }
    table = html.createElement('table');
    html.add(container, table);
    createKeyValue(table, tr('License type'), licenseType);
    createKeyValue(table, tr('Created on'), formatDate(license.when_created));
    if (license.expiry) {
        createKeyValue(table, tr('Valid until'), formatDate(license.expiry));
    }
    if (license.type === 'eval') {
        html.add(container, div({ 'padding-top': '10px' }, widgets.createDefaultButton(tr('Buy license'), gotoBuyFromSubscription)));
    } else {
        html.add(container, div({ height: '100px' }));
        html.add(container, div({ 'padding-top': '10px' }, widgets.createSimpleButton(tr('Deactivate license'), deactivateLicense)));
    }
}
function showOnlyDivs(widget, toShow) {
    widget.drakonOnly.style.display = 'none';
    widget.folderOnly.style.display = 'none';
    if (toShow) {
        widget[toShow].style.display = 'inline-block';
        if (widget.access === 'read') {
            widget.topCreateDocument.style.display = 'none';
        } else {
            widget.topCreateDocument.style.display = 'inline-block';
        }
    }
}
async function showPadMainMenu(widget) {
    var client, createNew, divTopButtons, fitems, ieitems, items, parentId, recent, ritems;
    parentId = getParent(widget);
    client = div();
    divTopButtons = div();
    divTopButtons.style.paddingLeft = '5px';
    html.add(client, divTopButtons);
    createNew = createDefButtonWide(tr('New diagram') + '...', function (evt) {
        widgets.removePopups();
        createDocumentFromDiagramScreen(widget, evt);
    });
    html.add(divTopButtons, createNew);
    fitems = [];
    fitems.push([
        tr('Home'),
        function () {
            goToRoot(widget);
        }
    ]);
    if (gconfig.desktop) {
        fitems.push([
            tr('New window'),
            createNewWindow
        ]);
        fitems.push([
            tr('Close folder'),
            closeFolder
        ]);
    }
    if (isDrakon()) {
        fitems.push([
            tr('Close diagram'),
            widget.goUp
        ]);
    }
    html.add(client, dh2common.createMenuSection(undefined, fitems, true));
    ieitems = [];
    if (!gconfig.desktop) {
        ieitems.push([
            tr('Import diagram file'),
            function () {
                importJson(parentId);
            }
        ]);
    }
    if (isDrakon()) {
        if (!gconfig.desktop) {
            ieitems.push([
                tr('Export to diagram file'),
                function () {
                    dh2common.saveAsJson(widget.drakon);
                }
            ]);
        }
        if (isDrakonDrakon()) {
            ieitems.push([
                ScenariosTitle(),
                widget.drakon.showScenarios
            ]);
        }
    }
    if (!(ieitems.length === 0)) {
        html.add(client, dh2common.createMenuSection(undefined, ieitems, true));
    }
    if (isDrakon()) {
        items = [];
        items.push([
            tr('Save as picture'),
            function () {
                dh2common.saveAsPng(widget.drakon, 1);
            }
        ]);
        items.push([
            tr('Save as picture') + ' \xD72',
            function () {
                dh2common.saveAsPng(widget.drakon, 2);
            }
        ]);
        items.push([
            tr('Save as picture') + ' \xD74',
            function () {
                dh2common.saveAsPng(widget.drakon, 4);
            }
        ]);
        html.add(client, dh2common.createMenuSection(undefined, items, true));
    }
    recent = await initRecent();
    if (recent.length > 1) {
        utils.sortBy(recent, 'when', 'desc');
        if (isDrakon()) {
            recent.shift();
        }
        recent = utils.take(recent, 5);
        ritems = recent.map(recentToPadMenu);
        html.add(client, dh2common.createMenuSection(tr('Recent'), ritems, true));
    }
    dh2common.showMainMenu(client);
}
function showPanic(message) {
    var central, home, main;
    main = html.get('main');
    html.clear(main);
    main.style.display = 'inline-block';
    main.style.position = 'fixed';
    main.style.left = '0px';
    main.style.top = '0px';
    main.style.width = '100vw';
    main.style.height = '100vh';
    home = function () {
        html.goTo(dh2common.getAppRoot());
    };
    central = div('middle', div('header1', { text: message }), div({ height: '20px' }), widgets.createDefaultButton(tr('Reload'), html.reload), widgets.createSimpleButton(tr('Home'), home));
    html.add(main, central);
}
function showProjectsMenu() {
    var client;
    client = div();
    addCreateProjectSection(client);
    addGotoProjectSession(client);
    addAccountSection(client);
    addAdminSection(client);
    createCustomMainMenu(client);
}
function showSearchStatus(widget) {
    var _selectValue_2;
    html.clear(self.foundContainer);
    if (widget.found.length === 0) {
        _selectValue_2 = widget.status;
        if (_selectValue_2 === 'completed') {
            addNotFound(widget.foundContainer, tr('Ничего не найдено'));
        } else {
            if (_selectValue_2 === 'searching') {
                addNotFound(widget.foundContainer, tr('Идёт поиск...'));
            }
        }
    }
}
function showWait() {
    dh2common.showWaitBlock();
}
function showWelcome(widget) {
    var root;
    html.clear(widget.form);
    dh2common.setTitle(tr('Welcome!'));
    root = div(div('account-title', {
        'text-align': 'center',
        text: tr('Welcome to') + ' ' + gconfig.appName + '!'
    }), div({ height: '20px' }));
    html.add(root, div({ 'text-align': 'center' }, widgets.createDefaultButton(tr('Go to my projects'), function () {
        html.goTo(dh2common.getAppRoot());
    })));
    html.add(widget.form, root);
}
function sortByHierarchy(adds) {
    var byId, id, item, output, parent;
    byId = {};
    for (item of adds) {
        byId[item.id] = {
            children: [],
            item: item,
            parent: item.parent
        };
    }
    for (id in byId) {
        item = byId[id];
        if (item.item.parent) {
            parent = byId[item.item.parent];
            if (parent) {
                parent.children.push(id);
            } else {
                item.parent = undefined;
            }
        }
    }
    output = [];
    for (id in byId) {
        item = byId[id];
        if (!item.parent) {
            hieTraverse(byId, id, output);
        }
    }
    return output;
}
function startEditor(widget) {
    var diagram;
    diagram = widget.diagram;
    stopSender(self);
    widget.sender = createEditSender(diagram.id, diagram.tag, widget.indicator);
    widget.edit = edit_tools.createUndoEdit(diagram, widget.sender);
}
function startProcess(obj, process) {
    var opId, promise;
    if (obj.process) {
        obj.process.stop();
    }
    opId = Math.floor(Math.random() * 1000000);
    obj.opId = opId;
    obj.process = process;
    promise = process.run();
    promise.then(function () {
        obj.done(opId);
    });
}
function startReferenceSearch(spaceId, name) {
    unit.screens.folder.nav.selectTab('search');
    unit.screens.folder.search.findReferences(spaceId, name);
}
async function startupDeskHome() {
    trace('startupDeskHome');
    await fetchRecentFolders();
    setGlobalView('deskhome', undefined);
    dh2common.setTitle('');
    unit.screens.folder.clear();
    dh2common.redrawWidgetDom(unit.screens.deskhome);
}
async function startupFolder(id) {
    trace('startupFolder', id);
    replaceFolder(id);
    await initRecent();
    await goToFolderCore(id);
}
async function startupHome() {
    trace('startupHome');
    replaceHome();
    await initRecent();
    await goHomeCore();
}
function stopSender(widget) {
    if (widget.sender) {
        widget.sender.stop();
        widget.sender = undefined;
    }
}
function stripTimestamp(row) {
    var copy, timestamp;
    copy = {};
    Object.assign(copy, row);
    timestamp = copy.timestamp;
    delete copy.timestamp;
    delete copy.funnel;
    delete copy.agent;
    copy.date = timestamp.substring(0, 10);
    return copy;
}
function subtractUserList(left, right) {
    var rightIds;
    rightIds = right.map(function (user) {
        return user.user_id;
    });
    return left.filter(function (user) {
        return rightIds.indexOf(user.user_id) === -1;
    });
}
function td() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('td', properties, args);
}
function toLines(text) {
    var notEmpty, trim;
    if (text) {
        notEmpty = function (text) {
            return !!text;
        };
        trim = function (text) {
            return text.trim();
        };
        return text.split('\n').map(trim).filter(notEmpty);
    } else {
        return [];
    }
}
function tr(text) {
    return dh2common.translate(text);
}
function trace(name, value, largeObj) {
    return dh2common.trace(name, value, largeObj);
}
function transformDtItem(item, items) {
    items[item.id] = item;
    if (item.text) {
        item.content = item.text;
    }
    delete item.text;
    delete item.id;
}
function tryGoToLocation(id) {
    return new Promise(function (resolve, reject) {
        goToFolderCore(id).then(function () {
            resolve(true);
        }).catch(function (ex) {
            if (ex.notFound) {
                resolve(false);
            } else {
                reject(ex);
            }
        });
    });
}
async function undoObjectDeletion(parent, ids) {
    var items, parentItem, payload, url;
    trace('undoObjectDeletion', parent);
    items = ids.map(makeServerItem);
    parentItem = makeServerItem(parent);
    payload = {
        'items': items,
        parent: parentItem
    };
    url = '/api/restore_many';
    await sendRequest('POST', url, payload);
    ungrey();
    await goToFolder(parent);
}
function ungrey() {
    unit.globals.greyed = undefined;
}
function updateEnne(widget, id, prop, value) {
    updateEnneCore(widget, id, prop, value);
    if (id || !(prop === 'name')) {
        dh2common.redrawWidgetDom(widget);
    }
}
function updateEnneCore(widget, id, prop, value) {
    var change;
    change = {
        id: id,
        fields: {},
        op: 'update'
    };
    change.fields[prop] = value;
    widget.edit.updateDocument([change]);
}
function updateFolderList(widget) {
    var _collection_2, clip, folder, item;
    html.clear(widget.grid);
    widget.folder.children.sort(compareFolders);
    clip = getFolderClipboard();
    _collection_2 = widget.folder.children;
    for (folder of _collection_2) {
        item = createFolderItem(widget, folder, clip);
        html.add(widget.grid, item);
    }
    registerEvent(widget.grid, 'contextmenu', widget.onFolderBackContext);
}
function updateFolderListButtons(widget) {
    var _branch_, actions, check, container, copy, cut, doc, items, needSep, paste, remove, ro, src;
    _branch_ = 'Check';
    while (true) {
        switch (_branch_) {
        case 'Check':
            ro = widget.folder.access === 'read';
            container = widget.buttonsBar;
            html.clear(container);
            if (isAllChecked(widget)) {
                src = ipath('checked.png');
            } else {
                src = ipath('unchecked.png');
            }
            check = html.createElement('img', {
                draggable: false,
                src: src
            }, ['grid-icon']);
            html.add(container, check);
            registerEvent(check, 'click', widget.onCheckAll);
            items = [];
            needSep = true;
            _branch_ = 'Create';
            break;
        case 'Create':
            if (ro) {
                _branch_ = 'Modify';
            } else {
                if (widget.config.mobile) {
                    items.push({
                        text: tr('+Document'),
                        action: widget.createDocument
                    });
                    items.push({
                        text: tr('+Folder'),
                        action: widget.createFolder
                    });
                    items.push({ type: 'separator' });
                    items.push({
                        text: tr('Import'),
                        action: function () {
                            importJson(widget.folder.id);
                        }
                    });
                } else {
                    doc = widgets.createDefaultButton(tr('+Document'), widget.createDocument);
                    doc.style.marginLeft = '5px';
                    html.add(container, doc);
                    html.add(container, widgets.createSimpleButton(tr('+Folder'), widget.createFolder));
                    if (!gconfig.desktop) {
                        html.add(container, widgets.createSimpleButton(tr('Import'), function () {
                            importJson(widget.folder.id);
                        }));
                    }
                }
                _branch_ = 'Paste';
            }
            break;
        case 'Paste':
            if (getFolderClipboard()) {
                if (widget.config.mobile) {
                    items.push({ type: 'separator' });
                    items.push({
                        text: tr('Paste'),
                        action: widget.pasteInFolder
                    });
                    needSep = false;
                } else {
                    paste = widgets.createSimpleButton(tr('Paste'), widget.pasteInFolder);
                    html.add(container, paste);
                }
            }
            _branch_ = 'Modify';
            break;
        case 'Modify':
            if (!(Object.keys(widget.selected).length === 0)) {
                if (widget.config.mobile) {
                    if (needSep) {
                        items.push({ type: 'separator' });
                    }
                    items.push({
                        text: tr('Copy'),
                        action: widget.copySelectedFolders
                    });
                    if (!ro) {
                        items.push({
                            text: tr('Cut'),
                            action: widget.cutSelectedFolders
                        });
                        items.push({ type: 'separator' });
                        items.push({
                            text: tr('Delete'),
                            action: widget.deleteSelectedFolders
                        });
                    }
                } else {
                    copy = widgets.createSimpleButton(tr('Copy'), widget.copySelectedFolders);
                    html.add(container, copy);
                    if (!ro) {
                        cut = widgets.createSimpleButton(tr('Cut'), widget.cutSelectedFolders);
                        html.add(container, cut);
                        remove = widgets.createBadButton(tr('Delete'), widget.deleteSelectedFolders);
                        html.add(container, remove);
                    }
                }
            }
            _branch_ = 'Create actions button';
            break;
        case 'Create actions button':
            if (widget.config.mobile) {
                if (!(items.length === 0)) {
                    actions = createComboButton(tr('Actions'), items);
                    actions.style.marginLeft = '10px';
                    html.add(container, actions);
                }
            }
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
async function updateUser(container, userId, property, value) {
    var payload;
    payload = {
        user_id: userId,
        properties: {}
    };
    payload.properties[property] = value;
    showWait();
    await sendRequest('POST', '/api/update_user_admin', payload);
    await fillUserInfo(container, userId);
}
function userScreen(widget, parent) {
    var buttonDiv, detailsDiv;
    setAdminTitle(parent, tr('User administration'));
    detailsDiv = div();
    buttonDiv = div(widgets.createSimpleButton(tr('Choose user') + '...', function () {
        chooseUser(detailsDiv);
    }));
    html.add(parent, buttonDiv);
    html.add(parent, detailsDiv);
}
function userSearch(parent, users, value, results) {
    if (value && value.length > 1) {
        if (parent.search) {
            parent.search.stop();
        }
        parent.search = getUsers_create(parent, users, value, results);
        parent.search.run();
    }
}
function userSearchAdmin(parent, value, results) {
    if (value && value.length > 1) {
        if (parent.search) {
            parent.search.state = undefined;
        }
        parent.search = getUserAdmin_create(parent, value, results);
        parent.search.run();
    }
}
function wrapEdit(edit) {
    var _collection_2, change, change2, changes2;
    changes2 = [];
    _collection_2 = edit.changes;
    for (change of _collection_2) {
        change2 = utils.clone(change);
        change2.fields = utils.clone(change.fields);
        if (change.fields && 'content' in change.fields) {
            change2.fields.text = change2.fields.content;
            delete change2.fields.content;
        }
        changes2.push(change2);
    }
    return { changes: changes2 };
}
function wrapTouchEvent(callback) {
    return function (evt) {
        var evt2, touch;
        touch = evt.touches[0];
        evt2 = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        return callback(evt2);
    };
}
unit.AccountScreen = AccountScreen;
unit.AdminScreen = AdminScreen;
unit.BreadCrumbs = BreadCrumbs;
unit.EditSender = EditSender;
unit.EditableWidget = EditableWidget;
unit.EnneWidget = EnneWidget;
unit.FolderListWidget = FolderListWidget;
unit.FolderScreen = FolderScreen;
unit.FolderScreenMobile = FolderScreenMobile;
unit.GroupScreen = GroupScreen;
unit.GroupsScreen = GroupsScreen;
unit.Indicator = Indicator;
unit.LoginScreen = LoginScreen;
unit.NotFound = NotFound;
unit.ProjectList = ProjectList;
unit.ProjectsScreen = ProjectsScreen;
unit.RecentWidget = RecentWidget;
unit.RegisterScreen = RegisterScreen;
unit.ResetScreen = ResetScreen;
unit.RootWidget = RootWidget;
unit.SearchWidget = SearchWidget;
unit.SimpleList = SimpleList;
unit.SplitWidget = SplitWidget;
unit.TabWidget = TabWidget;
unit.TreeView = TreeView;
unit.UiChooser = UiChooser;
unit.main = main;
unit.panic = panic;
unit.registerEvent = registerEvent;
unit.setTimeout = setTimeout;
unit.trace = trace;
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
Object.defineProperty(unit, 'edit_tools', {
    get: function () {
        return edit_tools;
    },
    set: function (newValue) {
        edit_tools = newValue;
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
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        dh2core
    };
}
