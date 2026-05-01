function dh2common() {
var unit = {};
var drakon_canvas;
var gconfig;
var html;
var http;
var utils;
var widgets;
function ClickerTapper() {
    var _obj_;
    _obj_ = ClickerTapper_create();
    return _obj_.run();
}
function ClickerTapper_create() {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'ClickerTapper',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* ClickerTapper_main() {
        var _branch_, _eventType_, _event_, dist, dx, dy, evt, faraway, id, longTimer, startX, startY, tapped;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '27';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'pointerdown') {
                    evt = _event_[1];
                    id = _event_[2];
                    startX = evt.clientX;
                    startY = evt.clientY;
                    longTimer = setTimeout(me.timeout, 500);
                    faraway = false;
                    tapped = false;
                } else {
                    if (!(_eventType_ === 'pointermove')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    evt = _event_[1];
                    if (tapped) {
                        evt.preventDefault();
                    }
                }
                _branch_ = 'Drag';
                break;
            case 'Drag':
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'pointermove') {
                    evt = _event_[1];
                    clearTimeout(longTimer);
                    dx = evt.clientX - startX;
                    dy = evt.clientY - startY;
                    dist = Math.hypot(dx, dy);
                    if (dist > 4) {
                        faraway = true;
                    }
                    _branch_ = 'Drag';
                } else {
                    if (_eventType_ === 'pointerup') {
                        evt = _event_[1];
                        clearTimeout(longTimer);
                        me.target.click(evt, id);
                    } else {
                        if (_eventType_ === 'pointercancel') {
                            clearTimeout(longTimer);
                        } else {
                            if (!(_eventType_ === 'timeout')) {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            if (!faraway) {
                                me.target.longTap(evt, id);
                            }
                        }
                    }
                    _branch_ = 'Idle';
                }
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function ClickerTapper_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = ClickerTapper_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = ClickerTapper_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.pointermove = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '27':
            _args_ = [];
            _args_.push('pointermove');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.pointerup = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('pointerup');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.pointercancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('pointercancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.timeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('timeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.pointerdown = function (evt, id) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '27':
            _args_ = [];
            _args_.push('pointerdown');
            _args_.push(evt);
            _args_.push(id);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function DoubleClick() {
    var _obj_;
    _obj_ = DoubleClick_create();
    return _obj_.run();
}
function DoubleClick_create() {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'DoubleClick',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* DoubleClick_main() {
        var _branch_, _eventType_, _event_, doubleTimer, evt, id;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '9';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'click') {
                    evt = _event_[1];
                    id = _event_[2];
                    me.target.click(evt, id);
                    doubleTimer = setTimeout(me.timeout, 400);
                    _branch_ = 'Waiting';
                } else {
                    if (!(_eventType_ === 'longTap')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    evt = _event_[1];
                    id = _event_[2];
                    me.target.longTap(evt, id);
                    _branch_ = 'Idle';
                }
                break;
            case 'Waiting':
                me.state = '14';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'click') {
                    evt = _event_[1];
                    id = _event_[2];
                    clearTimeout(doubleTimer);
                    setTimeout(function () {
                        me.target.doubleClick(evt, id);
                    }, 0);
                } else {
                    if (!(_eventType_ === 'timeout')) {
                        if (!(_eventType_ === 'longTap')) {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                        id = _event_[2];
                        clearTimeout(doubleTimer);
                        me.target.longTap(evt, id);
                    }
                }
                _branch_ = 'Idle';
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function DoubleClick_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = DoubleClick_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = DoubleClick_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.click = function (evt, id) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '9':
        case '14':
            _args_ = [];
            _args_.push('click');
            _args_.push(evt);
            _args_.push(id);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.longTap = function (evt, id) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '9':
        case '14':
            _args_ = [];
            _args_.push('longTap');
            _args_.push(evt);
            _args_.push(id);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.timeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '14':
            _args_ = [];
            _args_.push('timeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function MultiWidget() {
    var self = { _type: 'MultiWidget' };
    function getCurrent() {
        var _collection_170, child, id;
        _collection_170 = self.children;
        for (id in _collection_170) {
            child = _collection_170[id];
            if (id === self.current) {
                return child.widget;
            }
        }
        throw new Error('getCurrent: current not found');
    }
    function init(content) {
        var _collection_173, child, id;
        self.children = {};
        self.current = content.current;
        _collection_173 = content.children;
        for (id in _collection_173) {
            child = _collection_173[id];
            self.children[id] = {
                widget: child,
                container: undefined,
                visible: false
            };
        }
    }
    function onHide() {
        var current;
        current = self.children[self.current];
        onHideChildWidget(current);
    }
    function onShow() {
        var current;
        current = self.children[self.current];
        onShowChildWidget(current);
    }
    function redraw(container) {
        var _collection_176, child, id;
        _collection_176 = self.children;
        for (id in _collection_176) {
            child = _collection_176[id];
            child.container = buildWidgetDom(container, child.widget);
            stretchElement(child.container);
        }
        self.setCurrent(self.current);
    }
    function setCurrent(childId) {
        var _collection_179, child, id;
        self.current = childId;
        _collection_179 = self.children;
        for (id in _collection_179) {
            child = _collection_179[id];
            if (id === self.current) {
                if (!child.visible) {
                    display(child.container, 'inline-block');
                    onShowChildWidget(child);
                    child.visible = true;
                }
            } else {
                display(child.container, 'none');
                if (child.visible) {
                    onHideChildWidget(child);
                    child.visible = false;
                }
            }
        }
    }
    self.getCurrent = getCurrent;
    self.init = init;
    self.onHide = onHide;
    self.onShow = onShow;
    self.redraw = redraw;
    self.setCurrent = setCurrent;
    return self;
}
function PanicScreen() {
    var self = { _type: 'PanicScreen' };
    function redraw(container) {
    }
    function showPanicMessage(message, ex) {
        var central, details, exDetails, home;
        if (gconfig.debug) {
            if (ex) {
                exDetails = ex.message + ' stack: ' + ex.stack;
            } else {
                exDetails = '';
            }
            details = div({ text: exDetails });
        } else {
            details = div();
        }
        if (gconfig.pad) {
            central = div('middle', div('header1', { text: message }), details, div({
                'padding-top': '20px',
                'text-align': 'center'
            }, widgets.createDefaultButton(translate('Restart app'), html.reload)));
        } else {
            home = function () {
                html.goTo(getAppRoot());
            };
            central = div('middle', div('header1', { text: message }), details, div({
                'padding-top': '20px',
                'text-align': 'center'
            }, widgets.createDefaultButton(translate('Reload'), html.reload), widgets.createSimpleButton(translate('Home'), home)));
        }
        html.clear(self.container);
        html.add(self.container, central);
    }
    self.redraw = redraw;
    self.showPanicMessage = showPanicMessage;
    return self;
}
function addChangeLanguageBlock(form) {
    var changeLanguage;
    if (getSettingsObj().language === 'en-us') {
        changeLanguage = widgets.createSimpleButton('Русский', function () {
            saveLanguage('ru');
        });
    } else {
        changeLanguage = widgets.createSimpleButton('English', function () {
            saveLanguage('en-us');
        });
    }
    html.add(form, div({ height: '30px' }));
    html.add(form, changeLanguage);
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
        text: translate(header)
    });
    descDiv = div({
        'text-align': 'center',
        'white-space': 'normal',
        text: translate(description),
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
function addLabelsToSettings(settings) {
    var bucket, language;
    language = settings.language || 'en-us';
    bucket = getLabelsByCode(language);
    copyIfMissing(settings, bucket, 'yes');
    copyIfMissing(settings, bucket, 'no');
    copyIfMissing(settings, bucket, 'end');
    copyIfMissing(settings, bucket, 'branch');
    copyIfMissing(settings, bucket, 'exit');
}
function addMainMenuItem(parent, text, action) {
    var callback, contClass, line;
    contClass = 'grid-item';
    line = div(contClass, {
        text: text,
        padding: '5px',
        cursor: 'pointer'
    });
    callback = function (evt) {
        widgets.removePopups();
        action(evt);
    };
    registerEvent(line, 'click', callback);
    html.add(parent, line);
}
function buildBaseUrl() {
    return window.location.origin + window.location.pathname;
}
function buildShowConfirmUi(email, allowResend, allowCancel, target) {
    var buttons, buttons2, cancel, change, client, input, resend, send;
    client = widgets.createMiddleWindow();
    html.add(client, div({
        text: translate('Enter the PIN code sent by email to'),
        padding: '10px'
    }));
    html.add(client, div({
        text: email,
        padding: '10px',
        'padding-top': '0px',
        'font-weight': 'bold'
    }));
    html.add(client, div({
        text: translate('If the email with the PIN is not ' + 'in your inbox, check the "Spam" folder'),
        padding: '10px'
    }));
    input = html.createElement('input', {
        type: 'text',
        placeholder: translate('PIN-code, 6 digits')
    }, [{
            margin: '10px',
            width: 'calc(100% - 20px)'
        }]);
    html.add(client, input);
    buttons = div({
        'position': 'relative',
        'text-align': 'right',
        'padding-bottom': '5px',
        'padding-right': '10px',
        'height': '42px'
    });
    html.add(client, buttons);
    send = widgets.createDefaultButton(translate('Confirm email'), function () {
        target.sendPin(input.value.trim());
    });
    send.style.marginRight = '0px';
    send.style.display = 'none';
    html.add(buttons, send);
    registerEvent(input, 'input', function () {
        onShowConfirmInputChange(input, send);
    });
    if (allowResend) {
        resend = widgets.createSimpleButton(translate('Resend email'), target.resendPin);
        resend.style.position = 'absolute';
        resend.style.left = '10px';
        resend.style.top = '0px';
        html.add(buttons, resend);
    }
    buttons2 = div({
        'position': 'relative',
        'text-align': 'left',
        'padding': '10px'
    });
    html.add(client, buttons2);
    if (allowCancel) {
        cancel = widgets.createSimpleButton(translate('Cancel'), target.cancel);
        html.add(buttons2, cancel);
    } else {
        html.add(buttons2, div({ text: translate('Wrong email?') }));
        change = widgets.createSimpleButton(translate('Change email'), target.changeEmail);
        html.add(buttons2, change);
    }
    input.focus();
}
function buildUrlForFolder(id) {
    var parsed, root;
    root = gconfig.appRoot;
    parsed = parseId(id);
    if (parsed.spaceId && parsed.folderId) {
        return root + '?proj=' + parsed.spaceId + '&doc=' + parsed.folderId;
    } else {
        throw new Error('Incorrect folder id: ' + id);
    }
}
function buildWidgetDom(parentElement, widget) {
    var container;
    container = div();
    widget.container = container;
    html.add(parentElement, container);
    widget.redraw(widget.container);
    return container;
}
function callHook(widget, name) {
    var hook;
    hook = widget[name];
    if (hook) {
        hook();
    }
}
function checkDiagram(jsonString) {
    var error, parsed;
    parsed = checkJsonContent(jsonString);
    if (parsed.error) {
        return parsed;
    } else {
        error = checkDrakonIntegrity(parsed.diagram);
        if (error) {
            return { error: error };
        } else {
            return parsed;
        }
    }
}
function checkDrakonIntegrity(diagram) {
    var canvas, config, fakeSender, ok, tmpContainer, tmpDrakon;
    tmpContainer = div({ display: 'none' });
    html.add(document.body, tmpContainer);
    config = {};
    tmpDrakon = createWidget(drakon_canvas.DrakonCanvas());
    canvas = tmpDrakon.render(100, 100, config);
    html.add(tmpContainer, canvas);
    fakeSender = {
        pushEdit: function () {
        },
        stop: function () {
        }
    };
    ok = false;
    try {
        tmpDrakon.setDiagram('hello', diagram, fakeSender);
        ok = true;
    } catch (ex) {
        console.error(ex);
    }
    html.remove(tmpContainer);
    if (ok) {
        return undefined;
    } else {
        return translate('Error in diagram structure');
    }
}
function checkEmail(email) {
    var parts;
    if (email && !(email.length > 100)) {
        parts = email.split('@');
        if (parts.length === 2 && checkUserName(parts[0]) && checkUserName(parts[1])) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function checkJsonContent(jsonString) {
    var _collection_151, diagram, error, id, item, limit, limitBytes, obj;
    if (gconfig.maxImageSizeMb) {
        limitBytes = gconfig.maxImageSizeMb * 1024 * 1014;
        limit = limitBytes * 3;
    } else {
        limit = 1000000;
    }
    error = '';
    diagram = undefined;
    if (jsonString.length > limit) {
        error = translate('File is too large');
        return {
            diagram: diagram,
            error: error
        };
    } else {
        diagram = { items: {} };
        try {
            obj = JSON.parse(jsonString);
        } catch (ex) {
            error = translate('Error in JSON') + ': ' + ex.message;
        }
        if (obj) {
            if (obj.access) {
                diagram.access = obj.access;
            }
            if (ensureOptionalString(obj, 'name')) {
                if (typeof obj.items === 'object') {
                    if (ensureOptionalJsonString(obj, 'style')) {
                        if (ensureOptionalString(obj, 'params')) {
                            if (ensureOptionalString(obj, 'type')) {
                                if (ensureOptionalString(obj, 'description')) {
                                    utils.copyFieldsWithValue(diagram, obj, [
                                        'name',
                                        'params',
                                        'type',
                                        'style',
                                        'description'
                                    ]);
                                    _collection_151 = obj.items;
                                    for (id in _collection_151) {
                                        item = _collection_151[id];
                                        if (id) {
                                            if (item && typeof item === 'object') {
                                                if (ensureOptionalString(item, 'content')) {
                                                    if (ensureOptionalString(item, 'secondary')) {
                                                        if (ensureOptionalJsonString(item, 'style')) {
                                                            diagram.items[id] = item;
                                                        } else {
                                                            error = translate('"style" must be a JSON string') + ', id=' + id;
                                                            break;
                                                        }
                                                    } else {
                                                        error = translate('"secondary" must be a string') + ', id=' + id;
                                                        break;
                                                    }
                                                } else {
                                                    error = translate('"content" must be a string') + ', id=' + id;
                                                    break;
                                                }
                                            } else {
                                                error = translate('Item is not an object') + ', id=' + id;
                                                break;
                                            }
                                        } else {
                                            error = translate('Item id must not be empty string');
                                            break;
                                        }
                                    }
                                    return {
                                        diagram: diagram,
                                        error: error
                                    };
                                } else {
                                    error = translate('"description" must by a string');
                                    return {
                                        diagram: diagram,
                                        error: error
                                    };
                                }
                            } else {
                                error = translate('"type" must by a string');
                                return {
                                    diagram: diagram,
                                    error: error
                                };
                            }
                        } else {
                            error = translate('"params" must by a string');
                            return {
                                diagram: diagram,
                                error: error
                            };
                        }
                    } else {
                        error = translate('"style" must by a JSON string');
                        return {
                            diagram: diagram,
                            error: error
                        };
                    }
                } else {
                    error = translate('Missing "items" property');
                    return {
                        diagram: diagram,
                        error: error
                    };
                }
            } else {
                error = translate('"name" must be a string');
                return {
                    diagram: diagram,
                    error: error
                };
            }
        } else {
            return {
                diagram: diagram,
                error: error
            };
        }
    }
}
function checkProjectName(name, maxLength) {
    var ch, code, first, i, last, length;
    maxLength = maxLength || 50;
    if (name) {
        name = name.trim();
        if (name) {
            length = name.length;
            first = name[0];
            last = name[length - 1];
            if (first === '.' || first === '-' || last === '.' || last === '-') {
                return translate('Name must start and end with a digit or letter');
            } else {
                if (name.length < 2) {
                    return translate('Name is too short');
                } else {
                    if (name.length > maxLength) {
                        return translate('Name is too long');
                    } else {
                        for (i = 0; i < length; i++) {
                            ch = name[i];
                            if (unit.forbiddenCharacters[ch]) {
                                return translate('Unsupported characters');
                            } else {
                                code = ch.codePointAt(0);
                                if (code < 32) {
                                    return translate('Unsupported characters');
                                }
                            }
                        }
                        return undefined;
                    }
                }
            }
        } else {
            return translate('Name cannot be empty');
        }
    } else {
        return translate('Name cannot be empty');
    }
}
function checkUserName(name) {
    var aCode, code, dot, first, i, last, minus, nineCode, prev, under, zCode, zeroCode;
    if (name) {
        aCode = 'a'.charCodeAt(0);
        zCode = 'z'.charCodeAt(0);
        zeroCode = '0'.charCodeAt(0);
        nineCode = '9'.charCodeAt(0);
        dot = '.'.charCodeAt(0);
        under = '_'.charCodeAt(0);
        minus = '-'.charCodeAt(0);
        name = name.toLowerCase();
        prev = 0;
        for (i = 0; i < name.length; i++) {
            code = name.charCodeAt(i);
            if (code === dot || (code === under || code === minus)) {
                if (prev === code) {
                    return false;
                }
            } else {
                if (!(code >= aCode && code <= zCode || code >= zeroCode && code <= nineCode)) {
                    return false;
                }
            }
            prev = code;
        }
        first = name.charCodeAt(0);
        last = name.charCodeAt(name.length - 1);
        if (first === dot || last === dot || first === under || last === under || first === minus || last === minus) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
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
            text: translate('Choose diagram type'),
            'font-size': getHeader1Size(),
            'font-weight': 'bold',
            'padding-bottom': '10px'
        }));
        addDiagramType(dialog, ipath('logo-drakon.png'), translate('Drakon flowchart'), translate('A process, procedure, algorithm, behavior, HOW the system works'), me.drakon);
        addDiagramType(dialog, ipath('logo-graf.png'), translate('Mind map'), translate('Structure, composition, hierarchy, ' + 'ordered notes, what the system CONSISTS OF'), me.graf);
        addDiagramType(dialog, ipath('logo-free.png'), translate('Free-form diagram'), translate('Boxes and arrows, network diagrams, GUI sketches, GNOME diagrams, no limits'), me.free);
        cancel = widgets.createSimpleButton(translate('Cancel'), me.cancel);
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
function copyAllFieldsWithValue(dst, src) {
    var field, value;
    for (field in src) {
        value = src[field];
        if (utils.hasValue(value)) {
            dst[field] = value;
        }
    }
}
function copyIfMissing(target, source, name) {
    if (!target[name]) {
        target[name] = source[name];
    }
}
function createLogonScreen(widget, onSuccessCallback, goToRegisterCallback, onCancel, accountUrl) {
    var createAccountButton, error, forgotLab, form, formClass, formStyle, inputStyle, logonButt, noAccountLab, passLab, password, reset, spacer, spacer2, title, user, userLab;
    inputStyle = {
        width: 'calc(100% - 20px)',
        'margin-bottom': '10px'
    };
    inputStyle = { 'margin-bottom': '10px' };
    user = html.createElement('input', {
        type: 'text',
        autocomplete: 'username'
    }, [inputStyle]);
    user.id = 'user';
    password = html.createElement('input', {
        type: 'password',
        autocomplete: 'current-password'
    }, [inputStyle]);
    password.id = 'password';
    widget.user = user;
    widget.password = password;
    title = div({
        text: translate('Login to') + ' ' + gconfig.appName,
        'font-weight': 'bold',
        'font-size': getHeader1Size(),
        'text-align': 'center',
        'margin': '10px'
    });
    userLab = div({ text: translate('User name') });
    noAccountLab = div({ text: translate('No account?') });
    forgotLab = div({ text: translate('Forgot password?') });
    passLab = div({ text: translate('Password') });
    spacer = div({ height: '20px' });
    spacer2 = div({ height: '10px' });
    error = div({
        color: 'darkred',
        'margin-top': '10px'
    });
    widget.error = error;
    logonButt = widgets.createDefaultButton(translate('Login'), function () {
        doLogon(widget, onSuccessCallback);
    });
    logonButt.style.width = '100%';
    logonButt.style.textAlign = 'center';
    createAccountButton = widgets.createSimpleButton(translate('Create account'), goToRegisterCallback);
    reset = div({ 'margin-top': '20px' }, html.createElement('a', { href: accountUrl }, [{ text: translate('Forgot password?') }]));
    registerEvent(password, 'keydown', function (evt) {
        logonOnEnter(widget, evt, onSuccessCallback);
    });
    formClass = 'middle-h';
    formStyle = {
        position: 'relative',
        padding: '10px',
        width: '300px',
        'max-width': '100vw'
    };
    form = html.createElement('form', {}, [
        formClass,
        formStyle,
        title,
        userLab,
        user,
        passLab,
        password,
        spacer2,
        logonButt,
        error,
        spacer,
        noAccountLab,
        createAccountButton,
        reset
    ]);
    addChangeLanguageBlock(form);
    widget.form = form;
    user.focus();
    return form;
}
function createLongClicker(target) {
    var clicker, tapper;
    tapper = ClickerTapper_create();
    clicker = DoubleClick_create();
    tapper.target = clicker;
    clicker.target = target;
    tapper.run();
    clicker.run();
    return {
        stop: function () {
            tapper.state = undefined;
            clicker.state = undefined;
        },
        registerEvents: function (element, id) {
            registerClickerEvents(tapper, element, id);
        }
    };
}
function createMenuSection(name, lines, forceNarrow) {
    var body, container, header, line, sep;
    name = name || '';
    header = div('main-menu-section-header', { text: name });
    body = div();
    for (line of lines) {
        if (line === 'separator') {
            sep = div({ 'border-bottom': 'solid 1px green' });
            html.add(body, sep);
        } else {
            addMainMenuItem(body, line[0], line[1]);
        }
    }
    container = div('main-menu-section', header, body);
    if (widgets.isNarrowScreen() || forceNarrow) {
        container.style.display = 'block';
        container.style.marginRight = '5px';
    }
    return container;
}
function createRegisterScreen(widget, signupSource, onSuccessCallback, goToLogonCallback, onCancel, hideCheckbox) {
    var buttons, cancel, check, checkDiv, email, emailLab, error, form, formClass, formStyle, hasAccount, inputStyle, label, logon, signupButt, spacer, spacer2, title, user, userLab;
    inputStyle = {
        width: 'calc(100% - 20px)',
        'margin-bottom': '10px'
    };
    inputStyle = { 'margin-bottom': '10px' };
    user = html.createElement('input', { type: 'text' }, [inputStyle]);
    user.id = 'user-reg';
    email = html.createElement('input', { type: 'email' }, [inputStyle]);
    email.id = 'email-reg';
    widget.user = user;
    widget.email = email;
    title = div({
        text: translate('Create account in') + ' ' + gconfig.appName,
        'font-weight': 'bold',
        'font-size': getHeader1Size(),
        'text-align': 'center',
        'margin': '10px'
    });
    userLab = div({ text: translate('User name') });
    emailLab = div({ text: translate('Email') });
    spacer = div({ height: '20px' });
    spacer2 = div({ height: '10px' });
    error = div({
        color: 'darkred',
        'margin-top': '10px'
    });
    widget.error = error;
    checkDiv = div();
    if (gconfig.privacy && !hideCheckbox) {
        label = html.createElement('label', {}, [{
                'line-height': '30px',
                'margin-left': '5px',
                'display': 'inline-block',
                'white-space': 'normal'
            }]);
        html.add(checkDiv, label);
        check = html.createElement('input', { type: 'checkbox' }, [{
                width: '20px',
                height: '20px',
                'margin-right': '5px',
                'vertical-align': 'middle'
            }]);
        check.checked = false;
        html.add(label, check);
        html.addText(label, translate('I agree to') + ' ');
        html.add(label, widgets.makeLink(gconfig.privacy, translate('the privacy policy'), true));
        widget.privacyCheck = check;
    }
    buttons = div();
    signupButt = widgets.createDefaultButton(translate('Create account'), function () {
        doRegister(widget, signupSource, onSuccessCallback);
    });
    html.add(buttons, signupButt);
    if (onCancel) {
        cancel = widgets.createSimpleButton(translate('Cancel'), onCancel);
        html.add(buttons, cancel);
    } else {
        signupButt.style.width = '100%';
        signupButt.style.textAlign = 'center';
    }
    formClass = 'middle-h';
    formStyle = {
        position: 'relative',
        padding: '10px',
        width: '300px',
        'max-width': '100vw'
    };
    form = html.createElement('form', {}, [
        formClass,
        formStyle,
        title,
        userLab,
        user,
        emailLab,
        email,
        checkDiv,
        spacer2,
        buttons,
        error,
        spacer
    ]);
    if (goToLogonCallback) {
        hasAccount = div({ text: translate('Already have an account?') });
        logon = widgets.createSimpleButton(translate('Login'), goToLogonCallback);
        html.add(form, hasAccount);
        html.add(form, logon);
    }
    addChangeLanguageBlock(form);
    widget.form = form;
    user.focus();
    return form;
}
function createRootElement() {
    var main, rootElement;
    if (unit.rootElement) {
        html.remove(unit.rootElement);
        unit.rootElement = undefined;
    }
    rootElement = div();
    main = html.get('main');
    html.add(main, rootElement);
    unit.rootElement = rootElement;
    setRootStyle();
    return rootElement;
}
function createSpecialStyles() {
    html.addClass('*', '-webkit-tap-highlight-color: transparent');
    html.addClass('.top-bar', 'position: relative', 'white-space: nowrap', 'height:50px', 'border-bottom: solid 1px #a0a0a0');
    html.addClass('.top-bar-padding', 'height:2px', 'background:red');
    html.addClass('.top-bar-logo', 'display: inline-block');
    html.addClass('.top-bar-logo img', 'height:40px', 'width:40px', 'display:inline-block');
    html.addClass('.top-bar-stripe', 'display:inline-block', 'width:calc(100% - 40px)', 'height:40px', 'vertical-align: top');
    html.addClass('.top-bar-below', 'display:inline-block', 'position:relative', 'width:100%', 'height:calc(100% - 50px)');
    html.addClass('.top-text', 'display: inline-block', 'line-height: 50px', 'padding-left: 5px', 'padding-right: 5px', 'vertical-align: top');
    html.addClass('.top-right', 'display: inline-block', 'line-height: 50px', 'padding-left: 5px', 'padding-right: 5px', 'vertical-align: top', 'position: absolute', 'right: 0px', 'top: 0px');
    html.addClass('.generic-button', 'display:inline-block', 'vertical-align: top', 'padding-left: 10px', 'padding-right: 10px', 'cursor: pointer', 'border-radius: 3px', 'margin-right: 5px', 'line-height:34px', 'user-select: none');
    html.addClass('.generic-button:active', 'transform: translateY(2px)');
    html.addClass('.simple-button', 'background: white', 'border: solid 1px #a0a0a0');
    html.addClass('.simple-button:hover', 'background: #9fd694');
    html.addClass('.default-button', 'border: solid 1px #038009', 'background: #038009', 'color: white');
    html.addClass('.default-button:hover', 'border: solid 1px #004a04', 'background: #004a04');
    html.addClass('.bad-button', 'border: solid 1px darkred', 'background: darkred', 'color: white');
    html.addClass('.bad-button:hover', 'border: solid 1px red', 'background: red');
    html.addClass('.icon-button', 'height: 34px', 'width: 34px');
    html.addClass('img.icon-button', 'display: inline-block', 'vertical-align: top', 'padding:0px', 'margin:0px');
    html.addClass('.question-back', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh', 'background: rgba(0, 0, 0, 0.2)', 'z-index: 2000');
    html.addClass('.question-body', 'display: inline-block', 'position: fixed', 'left: 50%', 'transform: translateX(-50%)', 'top: 0px', 'max-width: 100vw', 'width: 400px', 'background: white', 'z-index: 2001');
    html.addClass('.context-menu', 'display: inline-block', 'position: absolute', 'background: white', 'max-width: 100vw', 'min-width: 200px', 'border: solid 1px #a0a0a0', 'padding: 10px');
    html.addClass('.context-menu-separator', 'background: #a0a0a0', 'height: 1px', 'margin-top:5px', 'margin-bottom:5px');
    html.addClass('.snack-container', 'display: inline-block', 'position: fixed', 'left: 20px', 'top: 20px', 'width: 400px', 'max-width: calc(100vw - 20px)', 'height: 80px', 'background: white', 'z-index: 500', 'border: solid 1px #a0a0a0', 'transition: opacity 500ms');
    html.addClass('.snack-field-back', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: darkred');
    html.addClass('.snack-field-text', 'display: inline-block', 'position: absolute', 'left: 30px', 'top: 0px', 'width: 370px', 'height: 80px');
    html.addClass('.main-menu', 'display: inline-block', 'background: white', 'border: solid 1px #a0a0a0', 'min-width: 300px', 'max-width: 100vw', 'max-height: calc(100vh - 10px)', 'overflow: auto', 'opacity: 0', 'transform: translateY(-30px)', 'transition: transform 300ms, opacity 300ms');
    html.addClass('.main-menu-title', 'display: inline-block', 'vertical-align: top', 'font-weight: bold', 'font-size: 20px', 'line-height: 49px', 'padding-left: 10px', 'padding-right: 10px');
    html.addClass('.main-menu-top', 'position: relative', 'background: white');
    html.addClass('.main-menu-bottom', 'white-space: nowrap', 'padding-right: 5px');
    html.addClass('.main-menu-section', 'display: inline-block', 'margin: 5px', 'margin-right: 0px', 'vertical-align: top', 'white-space: normal');
    html.addClass('.main-menu-section-header', 'color: green', 'font-weight: bold', 'font-size: ' + getHeader2Size(), 'text-align: center', 'border-bottom: solid 2px green');
    html.addClass('.active-border', 'background: white', 'border: solid 2px #d0d0d0', 'margin-bottom: 5px', 'border-radius: 5px');
    html.addClass('.active-border:hover, .active-border:active', 'background: white', 'border: solid 2px green', 'cursor: pointer', 'user-select: none');
    html.addClass('.common-table th', 'padding: 5px', 'font-weight: bold', 'text-align: center');
    html.addClass('.common-table td', 'padding: 5px');
    html.addClass('table.common-table, table.common-table th, table.common-table td', 'padding: 5px', 'border: solid 1px #e0e0e0');
}
function createWidget(widget, data) {
    if (widget.createStyles) {
        widget.createStyles();
    }
    if (widget.init) {
        widget.init(data);
    }
    return widget;
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
async function doLogon(widget, onSuccessCallback) {
    var password, payload, response, user;
    html.clear(widget.error);
    user = widget.user.value.trim();
    password = widget.password.value;
    if (user) {
        if (password) {
            showWaitBlock();
            payload = {
                user: user,
                password: password
            };
            response = await sendRequestRaw('POST', '/api/logon', payload);
            hideWaitBlock();
            if (response.status === 200) {
                if (widget.remain) {
                    html.reload();
                } else {
                    onSuccessCallback();
                }
            } else {
                html.addText(widget.error, translate('Wrong user name or password'));
            }
        } else {
            html.addText(widget.error, translate('Password is empty'));
            widget.password.focus();
        }
    } else {
        html.addText(widget.error, translate('User name is empty'));
        widget.user.focus();
    }
}
async function doRegister(widget, signupSource, onSuccessCallback) {
    var email, error, payload, response, settings, user;
    html.clear(widget.error);
    user = widget.user.value.trim();
    email = widget.email.value.trim();
    if (user) {
        if (email) {
            error = checkProjectName(user);
            if (error) {
                html.addText(widget.error, error);
                widget.user.focus();
            } else {
                if (checkEmail(email)) {
                    if (!widget.privacyCheck || widget.privacyCheck.checked) {
                        settings = getSettingsObj();
                        showWaitBlock();
                        payload = {
                            name: user,
                            email: email,
                            language: settings.language,
                            signup_url: window.location.href,
                            signup_source: signupSource
                        };
                        response = await sendRequestRaw('POST', '/api/create_user_email', payload);
                        hideWaitBlock();
                        if (response.status === 200) {
                            onSuccessCallback();
                        } else {
                            html.addText(widget.error, translate('Could not create account. ' + 'This user name or email are already in use.'));
                        }
                    } else {
                        html.addText(widget.error, translate('Please agree to the privacy policy'));
                    }
                } else {
                    html.addText(widget.error, translate('Wrong email format'));
                    widget.email.focus();
                }
            }
        } else {
            html.addText(widget.error, translate('Email cannot be empty'));
            widget.email.focus();
        }
    } else {
        html.addText(widget.error, translate('User name cannot be empty'));
        widget.user.focus();
    }
}
function downloadImageDataAsFile(filename, data) {
    var link;
    link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function downloadTextDataAsFile(filename, data, mime) {
    var file, link, url;
    file = new File([data], filename, { type: mime });
    link = document.createElement('a');
    url = window.URL.createObjectURL(file);
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
function drakonToInternal(diagram) {
    var _collection_154, diagram2, id, item;
    diagram2 = {
        items: [],
        type: diagram.type
    };
    utils.copyFieldsWithValue(diagram2, diagram, [
        'name',
        'params',
        'style',
        'description'
    ]);
    _collection_154 = diagram.items;
    for (id in _collection_154) {
        item = _collection_154[id];
        item.id = id;
        if (item.content) {
            item.text = item.content;
        }
        delete item.content;
        diagram2.items.push(item);
    }
    return diagram2;
}
function ensureOptionalJsonString(obj, prop) {
    var parsed;
    if (prop in obj) {
        if (typeof obj[prop] === 'string') {
            if (obj[prop] === '') {
                return true;
            } else {
                try {
                    parsed = JSON.parse(obj[prop]);
                } catch (ex) {
                }
                if (parsed) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    } else {
        return true;
    }
}
function ensureOptionalString(obj, prop) {
    if (!(prop in obj) || typeof obj[prop] === 'string') {
        return true;
    } else {
        return false;
    }
}
async function fetchAccount() {
    var account;
    account = await sendRequestRaw('GET', '/api/account');
    if (account.status === 401) {
        account = {};
    } else {
        account = JSON.parse(account.responseText);
    }
    unit.globals.account = account;
    return account;
}
async function fetchUserSettings() {
    var response, settings;
    if (isLoggedOn()) {
        response = await sendRequestRaw('GET', '/api/theme');
        if (response.status === 401) {
            settings = {};
        } else {
            settings = JSON.parse(response.responseText);
        }
    } else {
        settings = getSettingsFromLocalStorage();
    }
    if (!settings.language) {
        settings.language = guessLanguage();
    }
    unit.globals.userSettings = settings;
    return settings;
}
function generateRandomString() {
    var number;
    number = Math.floor(Math.random() * 10000000);
    return number.toString();
}
function getAccountObj() {
    return unit.globals.account;
}
function getAppRoot() {
    return gconfig.appRoot;
}
function getAppVersion() {
    return '2026.04.29';
}
function getBaseUrl() {
    return gconfig.baseUrl;
}
function getDiagramLabels() {
    return unit.globals.labels;
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
function getLabelsByCode(code) {
    return unit.globals.labelsByCode[code];
}
function getLargeObj() {
    return unit.largeObj;
}
function getQuery() {
    var noQuestion, parts, query, result, step, steps;
    query = window.location.search;
    result = {};
    if (query) {
        noQuestion = query.substring(1);
        steps = noQuestion.split('&');
        for (step of steps) {
            parts = step.split('=');
            result[parts[0]] = parts[1];
        }
    }
    return result;
}
function getSettingsFromLocalStorage() {
    var settings, settingsStr;
    settingsStr = localStorage.getItem('userSetting');
    if (settingsStr) {
        settings = JSON.parse(settingsStr);
    } else {
        settings = {};
    }
    return settings;
}
function getSettingsObj() {
    var settings;
    settings = unit.globals.userSettings;
    addLabelsToSettings(settings);
    return settings;
}
function getTraces() {
    return unit.traces;
}
function guessLanguage() {
    return gconfig.defaultLanguage;
}
function hasDialog() {
    if (widgets.questionVisible || widgets.hasPopup()) {
        return true;
    } else {
        return false;
    }
}
function hideWaitBlock() {
    if (unit.wait) {
        html.remove(unit.wait);
        unit.wait = undefined;
    }
}
function img(src, className) {
    className = className || '';
    return html.createElement('img', {
        src: src,
        draggable: false
    }, [className]);
}
async function importDiagram(jsonString, filename, parentId, tr) {
    var _selectValue_157, folder, id, internal, parsed, parsedFilename, payload, url;
    parsed = checkDiagram(jsonString);
    if (parsed.error) {
        widgets.showErrorSnack(parsed.error);
        return undefined;
    } else {
        internal = drakonToInternal(parsed.diagram);
        parsedFilename = stripExtension(filename);
        internal.name = parsedFilename.name;
        internal.type = parsedFilename.extension;
        _selectValue_157 = internal.type;
        if (_selectValue_157 === 'drakon' || (_selectValue_157 === 'free' || _selectValue_157 === 'graf')) {
            folder = await sendCreateFolder(parentId, internal.type, internal.name);
            id = folder.id;
            payload = {
                editType: 'edit',
                oldTag: '',
                added: internal.items,
                removed: [],
                updated: []
            };
            utils.copyFieldsWithValue(payload, internal, [
                'params',
                'style',
                'description'
            ]);
            url = '/api/edit/' + id.split(' ').join('/');
            await sendRequestRaw('POST', url, payload);
            return id;
        } else {
            widgets.showErrorSnack(translate('Unknown document type'));
            return undefined;
        }
    }
}
function initDiagramLabels() {
    var bucket, code, item, labels, labelsByCode;
    labels = [];
    labels.push([
        'de',
        'Deutsch',
        'Ja',
        'Nein',
        'Ende',
        'Zweig',
        'Abschluss'
    ]);
    labels.push([
        'en-us',
        'English',
        'Yes',
        'No',
        'End',
        'Branch',
        'Completion'
    ]);
    labels.push([
        'es',
        'Español',
        'Sí',
        'No',
        'Final',
        'Rama',
        'Finalización'
    ]);
    labels.push([
        'fr',
        'Français',
        'Oui',
        'Non',
        'Fin',
        'Branche',
        'Terminaison'
    ]);
    labels.push([
        'lv',
        'Latviešu',
        'Jā',
        'Nē',
        'Beigas',
        'Zars',
        'Pabeigšana'
    ]);
    labels.push([
        'lt',
        'Lietuvių',
        'Taip',
        'Ne',
        'Pabaiga',
        'Šaka',
        'Užbaigimas'
    ]);
    labels.push([
        'nl',
        'Nederlands',
        'Ja',
        'Nee',
        'Einde',
        'Tak',
        'Voltooiing'
    ]);
    labels.push([
        'no',
        'Norsk',
        'Ja',
        'Nei',
        'Slutt',
        'Gren',
        'Fullføring'
    ]);
    labels.push([
        'pl',
        'Polski',
        'Tak',
        'Nie',
        'Koniec',
        'Gałąź',
        'Zakończenie'
    ]);
    labels.push([
        'ro',
        'Român',
        'Da',
        'Nu',
        'Sfârșit',
        'Ramură',
        'Finalizare'
    ]);
    labels.push([
        'fi',
        'Suomi',
        'Kyllä',
        'Ei',
        'Loppu',
        'Haara',
        'Suorittaminen'
    ]);
    labels.push([
        'sv',
        'Svenska',
        'Ja',
        'Nej',
        'Slut',
        'Gren',
        'Slutförande'
    ]);
    labels.push([
        'ru',
        'Русский',
        'Да',
        'Нет',
        'Конец',
        'Ветка',
        'Завершение'
    ]);
    labels.push([
        'uk',
        'Українська',
        'Так',
        'Ні',
        'Кінець',
        'Гілка',
        'Завершення'
    ]);
    labels.push([
        'zh',
        '中文',
        '是',
        '否',
        '结束',
        '分支',
        '完成'
    ]);
    labelsByCode = {};
    for (item of labels) {
        code = item[0];
        bucket = {
            yes: item[2],
            no: item[3],
            end: item[4],
            branch: item[5] || 'Branch',
            exit: item[6] || 'Exit'
        };
        labelsByCode[code] = bucket;
    }
    unit.globals.labels = labels;
    unit.globals.labelsByCode = labelsByCode;
}
function initLoadedFonts() {
    var fonts;
    if (!(unit.loadedFonts && unit.fontPaths)) {
        unit.loadedFonts = {};
        unit.fontPaths = {};
    }
    fonts = unit.fontPaths;
    fonts['Roboto Condensed/normal/normal'] = 'RobotoCondensed-Regular.ttf';
    fonts['Roboto Condensed/italic/normal'] = 'RobotoCondensed-Italic.ttf';
    fonts['Roboto Condensed/normal/bold'] = 'RobotoCondensed-Bold.ttf';
    fonts['Roboto Condensed/italic/bold'] = 'RobotoCondensed-BoldItalic.ttf';
    fonts['Roboto Mono/normal/normal'] = 'RobotoMono-Regular.ttf';
    fonts['Roboto Mono/italic/normal'] = 'RobotoMono-Italic.ttf';
    fonts['Roboto Mono/normal/bold'] = 'RobotoMono-Bold.ttf';
    fonts['Roboto Mono/italic/bold'] = 'RobotoMono-BoldItalic.ttf';
    fonts['Ubuntu/normal/normal'] = 'Ubuntu-Regular.ttf';
    fonts['Ubuntu/italic/normal'] = 'Ubuntu-Italic.ttf';
    fonts['Ubuntu/normal/bold'] = 'Ubuntu-Bold.ttf';
    fonts['Ubuntu/italic/bold'] = 'Ubuntu-BoldItalic.ttf';
    fonts['Ubuntu Mono/normal/normal'] = 'UbuntuMono-Regular.ttf';
    fonts['Ubuntu Mono/italic/normal'] = 'UbuntuMono-Italic.ttf';
    fonts['Ubuntu Mono/normal/bold'] = 'UbuntuMono-Bold.ttf';
    fonts['Ubuntu Mono/italic/bold'] = 'UbuntuMono-BoldItalic.ttf';
    fonts['Arimo/normal/normal'] = 'Arimo-Regular.ttf';
    fonts['Arimo/italic/normal'] = 'Arimo-Italic.ttf';
    fonts['Arimo/normal/bold'] = 'LiberationSans-Bold.ttf';
    fonts['Arimo/italic/bold'] = 'Arimo-BoldItalic.ttf';
    fonts['Arimo, Arial/normal/normal'] = 'Arimo-Regular.ttf';
    fonts['Arimo, Arial/italic/normal'] = 'Arimo-Italic.ttf';
    fonts['Arimo, Arial/normal/bold'] = 'LiberationSans-Bold.ttf';
    fonts['Arimo, Arial/italic/bold'] = 'Arimo-BoldItalic.ttf';
    fonts['PTSans/normal/normal'] = 'PTSans-Regular.ttf';
    fonts['PTSans/italic/normal'] = 'PTSans-Italic.ttf';
    fonts['PTSans/normal/bold'] = 'PTSans-Bold.ttf';
    fonts['PTSans/italic/bold'] = 'PTSans-BoldItalic.ttf';
    fonts['Tinos/normal/normal'] = 'Tinos-Regular.ttf';
    fonts['Tinos/italic/normal'] = 'Tinos-Italic.ttf';
    fonts['Tinos/normal/bold'] = 'Tinos-Bold.ttf';
    fonts['Tinos/italic/bold'] = 'Tinos-BoldItalic.ttf';
    fonts['Tinos, Times New Roman, Times/normal/normal'] = 'Tinos-Regular.ttf';
    fonts['Tinos, Times New Roman, Times/italic/normal'] = 'Tinos-Italic.ttf';
    fonts['Tinos, Times New Roman, Times/normal/bold'] = 'Tinos-Bold.ttf';
    fonts['Tinos, Times New Roman, Times/italic/bold'] = 'Tinos-BoldItalic.ttf';
    fonts['Liberation Sans/normal/normal'] = 'LiberationSans-Regular.ttf';
    fonts['Liberation Sans/italic/normal'] = 'LiberationSans-Italic.ttf';
    fonts['Liberation Sans/normal/bold'] = 'LiberationSans-Bold.ttf';
    fonts['Liberation Sans/italic/bold'] = 'LiberationSans-BoldItalic.ttf';
}
function initResize() {
    unit.resizables = {};
    unit.resizeDebounce = utils.debounce_create(invokeWindowResize, 400);
    unit.resizeDebounce.run();
    window.onresize = onWindowResize;
    setTimeout(onWindowResize, 500);
}
function initShortcuts(callbacks) {
    registerInsertShortcut('a', 'action', callbacks);
    registerInsertShortcut('q', 'question', callbacks);
    registerInsertShortcut('s', 'select', callbacks);
    registerInsertShortcut('c', 'case', callbacks);
    registerInsertShortcut('b', 'branch', callbacks);
    registerInsertShortcut('n', 'insertion', callbacks);
    registerInsertShortcut('l', 'foreach', callbacks);
    registerInsertShortcut('t', 'text', callbacks);
    registerInsertShortcut('r', 'rounded', callbacks);
    registerInsertShortcut('w', 'arrow', callbacks);
    registerInsertShortcut('e', 'f_circle', callbacks);
    registerWriteDrakonShortcut('enter', function () {
        callbacks.getWidget().editContent();
    }, callbacks);
    registerWriteDrakonShortcut('del', function () {
        callbacks.getWidget().deleteSelection();
    }, callbacks);
    registerWriteDrakonShortcut('backspace', function () {
        callbacks.getWidget().deleteSelection();
    }, callbacks);
    registerWriteDrakonShortcut('mod+x', function () {
        callbacks.getWidget().cutSelection();
    }, callbacks);
    registerWriteDrakonShortcut('mod+v', function () {
        callbacks.getWidget().showPaste();
    }, callbacks);
    registerWriteDrakonShortcut('mod+z', function () {
        callbacks.getWidget().undo();
    }, callbacks);
    registerWriteDrakonShortcut('mod+y', function () {
        callbacks.getWidget().redo();
    }, callbacks);
    registerReadDrakonShortcut('mod+c', function () {
        callbacks.getWidget().copySelection();
    }, callbacks);
    registerReadDrakonShortcut('up', function () {
        callbacks.getWidget().arrowUp();
    }, callbacks);
    registerReadDrakonShortcut('down', function () {
        callbacks.getWidget().arrowDown();
    }, callbacks);
    registerReadDrakonShortcut('left', function () {
        callbacks.getWidget().arrowLeft();
    }, callbacks);
    registerReadDrakonShortcut('right', function () {
        callbacks.getWidget().arrowRight();
    }, callbacks);
}
async function invokeWindowResize() {
    var _collection_148, action, id;
    if (window.padBridge && window.padBridge.setUpStatusBar) {
        await window.padBridge.setUpStatusBar();
        await pause(200);
    }
    setRootStyle();
    _collection_148 = unit.resizables;
    for (id in _collection_148) {
        action = _collection_148[id];
        action();
    }
}
function ipath(image) {
    return gconfig.imagePath + image;
}
function isLoggedOn() {
    var account;
    account = getAccountObj();
    if (account && account.user_id) {
        return true;
    } else {
        return false;
    }
}
function isMobile() {
    var isAndroid, isIOS, ua;
    ua = navigator.userAgent || '';
    isAndroid = /Android/i.test(ua);
    isIOS = /iPhone|iPad|iPod/i.test(ua);
    return isAndroid || isIOS;
}
function isNetworkError(ex) {
    var str;
    if (ex) {
        str = ex.toString();
        if (str.indexOf('NetworkError') === -1 && str.indexOf('HTTP error') === -1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
function isSuccess(response) {
    if (response.status === 200 || response.status === 204) {
        return true;
    } else {
        return false;
    }
}
async function loadFonts(fonts) {
    var family, familyParts, ff, file, font, loaded, mustRedraw, parts, path, style, url, weight;
    mustRedraw = false;
    path = gconfig.fontPath;
    initLoadedFonts();
    showWaitBlock();
    for (font of fonts) {
        if (!unit.loadedFonts[font]) {
            file = unit.fontPaths[font];
            if (file) {
                mustRedraw = true;
                parts = font.split('/');
                familyParts = parts[0];
                style = parts[1];
                weight = parts[2];
                family = familyParts.split(',')[0];
                url = 'url(' + path + file + ')';
                ff = new FontFace(family, url, {
                    style: style,
                    weight: weight
                });
                trace('Loading font', url);
                loaded = await ff.load();
                document.fonts.add(loaded);
                unit.loadedFonts[font] = true;
            } else {
                console.error('Unknown font', font);
            }
        }
    }
    hideWaitBlock();
    return mustRedraw;
}
async function loadStringsForLanguage(language) {
    var strings;
    strings = getLocalizedStrings(language);
    setStrings(strings);
}
function logonOnEnter(widget, evt, onSuccessCallback) {
    if (evt.key === 'Enter') {
        doLogon(widget, onSuccessCallback);
    }
}
function main() {
    unit.traces = [];
    unit.globals = {};
    unit.forbiddenCharacters = {
        '<': true,
        '>': true,
        ':': true,
        '"': true,
        '/': true,
        '\\': true,
        '|': true,
        '?': true,
        '*': true
    };
    initDiagramLabels();
    initResize();
}
function makeId(spaceId, folderId) {
    return spaceId + ' ' + folderId;
}
function makeLogo(onClick) {
    var image;
    image = img(ipath(gconfig.logo));
    image.style.width = '49px';
    image.style.height = '49px';
    image.style.cursor = 'pointer';
    registerEvent(image, 'click', onClick);
    return image;
}
function makeTopBar(top, bottom) {
    top.className = 'top-bar';
    bottom.className = 'top-bar-below';
}
function onHideChildWidget(bucket) {
    callHook(bucket.widget, 'onHide');
    if (bucket.resizeId) {
        unsubscribeFromResize(bucket.resizeId);
    }
}
function onShowChildWidget(bucket) {
    var onResize;
    callHook(bucket.widget, 'onShow');
    onResize = bucket.widget.onResize;
    if (onResize) {
        bucket.resizeId = subscribeOnResize(onResize);
    }
}
function onShowConfirmInputChange(input, send) {
    var pin;
    pin = input.value.trim();
    if (pin.length === 6) {
        send.style.display = 'inline-block';
    } else {
        send.style.display = 'none';
    }
}
function onWindowResize() {
    unit.resizeDebounce.onInput();
}
function parseId(id) {
    var parts;
    parts = id.split(' ');
    return {
        spaceId: parts[0],
        folderId: parts[1]
    };
}
function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function prepareFonts() {
    var face;
    face = gconfig.fontFamily;
    await loadFonts([
        face + '/normal/normal',
        face + '/normal/bold'
    ]);
}
function redrawWidgetDom(widget) {
    html.clear(widget.container);
    widget.redraw(widget.container);
}
function registerClickerEvents(tapper, element, id) {
    registerLeftButtonEvent(element, tapper, 'pointerdown', id);
    registerLeftButtonEvent(element, tapper, 'pointermove', id);
    registerLeftButtonEvent(element, tapper, 'pointerup', id);
    registerLeftButtonEvent(element, tapper, 'pointercancel', id);
}
function registerEvent(element, eventName, action, options) {
    var callback;
    callback = action;
    element.addEventListener(eventName, callback, options);
}
function registerInsertShortcut(keys, type, callbacks) {
    var action;
    action = function () {
        var drakon;
        drakon = callbacks.getWidget();
        drakon.showInsertionSockets(type);
    };
    registerWriteDrakonShortcut(keys, action, callbacks);
}
function registerLeftButtonEvent(element, tapper, name, id) {
    element.addEventListener(name, function (evt) {
        runLeftButtonEvent(tapper, name, id, evt);
    });
}
function registerReadDrakonShortcut(keys, action, callbacks) {
    var callback;
    callback = function () {
        runReadDrakonAction(action, callbacks);
    };
    Mousetrap.bind(keys, callback, 'keydown');
}
function registerWriteDrakonShortcut(keys, action, callbacks) {
    var callback;
    callback = function () {
        runWriteDrakonAction(action, callbacks);
    };
    Mousetrap.bind(keys, callback, 'keydown');
}
function removeLoading() {
    var loading;
    loading = document.getElementById('loading');
    if (loading) {
        html.remove(loading);
    }
}
function removeTagsFromRedirect(item) {
    if (item.hint === 'redirect') {
        item.text = stripTags(item.text);
    }
}
function runLeftButtonEvent(tapper, name, id, evt) {
    var callback;
    if (evt.button === 0) {
        callback = tapper[name];
        callback(evt, id);
    }
}
function runReadDrakonAction(action, callbacks) {
    if (!hasDialog() && callbacks.isDrakon()) {
        action();
    }
}
function runWriteDrakonAction(action, callbacks) {
    if (!hasDialog() && (callbacks.isDrakon() && !callbacks.isReadonly())) {
        action();
    }
}
function saveAsJson(widget) {
    var dia;
    dia = saveAsJsonCore(widget);
    if (window.padBridge && window.padBridge.exportJson) {
        window.padBridge.exportJson(dia.filename, dia.exported, dia.mime);
    } else {
        downloadTextDataAsFile(dia.filename, dia.exported, dia.mime);
    }
}
function saveAsJsonCore(widget) {
    var exported, extension, filename, mime, obj, type;
    exported = widget.exportJson();
    obj = JSON.parse(exported);
    type = widget.getDiagramType();
    extension = '.' + type;
    filename = utils.sanitizeFilename(obj.name) + extension;
    mime = 'application/x-' + type;
    return {
        filename: filename,
        exported: exported,
        mime: mime
    };
}
async function saveAsPng(widget, res) {
    var exported, filename;
    exported = widget.exportImage(res, '');
    filename = utils.sanitizeFilename(exported.name) + '.png';
    if (window.padBridge && window.padBridge.exportPng) {
        await window.padBridge.exportPng(filename, exported.image);
        widgets.showGoodSnack(translate('Saved') + ': ' + filename);
    } else {
        downloadImageDataAsFile(filename, exported.image);
    }
}
function saveAsSvg(widget) {
    var box, ctx, filename, height, image, json, mime, obj, width, zoom100;
    trace('saveAsSvg');
    zoom100 = 10000;
    box = widget.drakon.getDiagramBox();
    width = box.right - box.left;
    height = box.bottom - box.top;
    ctx = new C2S(width, height);
    widget.drakon.exportToContext(box, zoom100, ctx);
    json = widget.drakon.exportJson();
    obj = JSON.parse(json);
    filename = utils.sanitizeFilename(obj.name) + '.svg';
    image = ctx.getSerializedSvg(true);
    mime = 'image/svg+xml';
    if (window.padBridge && window.padBridge.exportSvg) {
        window.padBridge.exportSvg(filename, image, mime);
    } else {
        downloadTextDataAsFile(filename, image, mime);
    }
}
function saveLanguage(language) {
    var settings;
    settings = getSettingsFromLocalStorage();
    setLabelsForLanguage(settings, language);
    saveUserSettings(settings);
    location.reload();
}
function saveUserSettings(userSettings) {
    var existingSettings;
    existingSettings = getSettingsObj();
    copyAllFieldsWithValue(existingSettings, userSettings);
    if (isLoggedOn()) {
        return sendRequestRaw('POST', '/api/theme', existingSettings);
    } else {
        localStorage.setItem('userSetting', JSON.stringify(existingSettings));
    }
}
async function sendCreateFolder(parentId, type, name) {
    var id, parsed, payload, response, responseRaw, url;
    parsed = parseId(parentId);
    payload = {
        name: name,
        parent: parsed.folderId,
        type: type
    };
    url = '/api/folder/' + parsed.spaceId;
    responseRaw = await sendRequestRaw('POST', url, payload);
    response = JSON.parse(responseRaw.responseText);
    id = makeId(parsed.spaceId, response.folder_id);
    return {
        id: id,
        name: name,
        type: type,
        parent: parentId
    };
}
async function sendRequestRaw(method, url, payload) {
    var body, error, fullUrl, headers, response;
    if (payload) {
        body = JSON.stringify(payload);
    } else {
        body = '';
    }
    fullUrl = getBaseUrl() + url;
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
async function sendRequestWithCheck(method, url, payload) {
    var error, response;
    response = await sendRequestRaw(method, url, payload);
    if (isSuccess(response)) {
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
function setLabelsForLanguage(settings, language) {
    var bucket;
    bucket = getLabelsByCode(language);
    settings.language = language;
    settings.yes = bucket.yes;
    settings.no = bucket.no;
    settings.end = bucket.end;
    settings.branch = bucket.branch;
    settings.exit = bucket.exit;
}
function setRootStyle() {
    var area, style;
    widgets.calculateSafeArea();
    if (unit.rootElement) {
        area = widgets.getSafeArea();
        style = unit.rootElement.style;
        style.display = 'inline-block';
        style.position = 'fixed';
        style.left = area.left + 'px';
        style.top = area.top + 'px';
        style.overflow = 'hidden';
        style.width = area.width + 'px';
        style.height = area.height + 'px';
        style.borderBottom = 'solid 1px #a0a0a0';
    }
}
function setStrings(strings) {
    unit.globals.strings = strings;
}
function setTimeout(action, delay, notrace) {
    var callback, id, start, timeoutId;
    if (notrace) {
        callback = action;
    } else {
        id = utils.random(1000, 10000);
        start = 'timeout-' + id;
        callback = function (evt) {
            trace(start, delay);
            action(evt);
        };
    }
    timeoutId = window.setTimeout(callback, delay);
    return timeoutId;
}
function setTitle(title) {
    if (title) {
        html.setTitle(title + ' | ' + gconfig.appName);
    } else {
        html.setTitle(gconfig.appName);
    }
}
function showConfirmEmail(email, allowCancel, changeEmail) {
    var _obj_;
    _obj_ = showConfirmEmail_create(email, allowCancel, changeEmail);
    return _obj_.run();
}
function showConfirmEmail_create(email, allowCancel, changeEmail) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'showConfirmEmail',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* showConfirmEmail_main() {
        var _branch_, _eventType_, _event_, allowResend, confirmPayload, pin, response;
        _branch_ = 'Init';
        while (true) {
            switch (_branch_) {
            case 'Init':
                allowResend = true;
                _branch_ = 'Ask for PIN';
                break;
            case 'Ask for PIN':
                buildShowConfirmUi(email, allowResend, allowCancel, me);
                me.state = '10';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'sendPin') {
                    pin = _event_[1];
                    widgets.removeQuestions();
                    _branch_ = 'Send pin';
                } else {
                    if (_eventType_ === 'resendPin') {
                        widgets.removeQuestions();
                        _branch_ = 'Resend email';
                    } else {
                        if (_eventType_ === 'cancel') {
                            widgets.removeQuestions();
                        } else {
                            if (!(_eventType_ === 'changeEmail')) {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            widgets.removeQuestions();
                            changeEmail();
                        }
                        _topResolve_(false);
                        return;
                    }
                }
                break;
            case 'Send pin':
                confirmPayload = { pin: pin };
                showWaitBlock();
                sendRequestRaw('POST', '/api/confirm_email', confirmPayload).then(onResponse);
                me.state = '48';
                me._busy = false;
                _event_ = yield;
                response = _event_[1];
                hideWaitBlock();
                if (isSuccess(response)) {
                    widgets.removeQuestions();
                    widgets.showGoodSnack(translate('Email confirmed'));
                    _topResolve_(true);
                    return;
                } else {
                    widgets.showErrorSnack(translate('Bad PIN'));
                    _branch_ = 'Ask for PIN';
                }
                break;
            case 'Resend email':
                allowResend = false;
                showWaitBlock();
                setTimeout(me.onTimeout, 2000);
                onTimeout();
                sendRequestRaw('POST', '/api/resend_confirm_email', {}).then(onResponse);
                me.state = '51';
                me._busy = false;
                _event_ = yield;
                response = _event_[1];
                hideWaitBlock();
                if (isSuccess(response)) {
                    widgets.showGoodSnack(translate('A new PIN has been sent'));
                } else {
                    widgets.showErrorSnack(translate('Could not resend PIN'));
                }
                _branch_ = 'Ask for PIN';
                break;
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function showConfirmEmail_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = showConfirmEmail_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = showConfirmEmail_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.sendPin = function (pin) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
            _args_ = [];
            _args_.push('sendPin');
            _args_.push(pin);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.resendPin = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
            _args_ = [];
            _args_.push('resendPin');
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
        case '10':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.changeEmail = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
            _args_ = [];
            _args_.push('changeEmail');
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
        case '48':
        case '51':
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
function showMainMenu(client) {
    var area, close, container, image;
    image = img(ipath(gconfig.wideLogo));
    image.style.height = '49px';
    close = widgets.createIconButton(ipath('delete.png'), widgets.removePopups);
    close.style.position = 'absolute';
    close.style.right = '5px';
    close.style.top = '5px';
    close.style.margin = '0px';
    container = div('shadow main-menu', div('main-menu-top', image, close), div('main-menu-bottom', client));
    area = widgets.getSafeArea();
    container.style.left = area.left + 'px';
    container.style.top = area.top + 'px';
    container.style.maxHeight = area.height + 'px';
    widgets.pushSemiModalPopup(container, area.left, area.top);
    container.style.transform = 'translateY(0px)';
    container.style.opacity = 1;
}
function showWaitBlock() {
    var messageStyle, root, wait;
    hideWaitBlock();
    root = html.get('popup-root');
    messageStyle = {
        text: translate('Wait a minute'),
        background: 'white',
        padding: '20px',
        'user-select': 'none'
    };
    wait = div('full-screen', { 'z-index': 1000 }, div('middle', messageStyle));
    html.add(root, wait);
    unit.wait = wait;
}
function stretchElement(element) {
    display(element, 'inline-block');
    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.width = '100%';
    element.style.height = '100%';
}
function stripExtension(filename) {
    var ch, ext, i, result;
    ext = [];
    for (i = filename.length - 1; i >= 0; i--) {
        ch = filename[i];
        if (ch === '.') {
            break;
        } else {
            ext.push(ch);
        }
    }
    ext.reverse();
    result = {
        name: filename.substring(0, i),
        extension: ext.join('')
    };
    return result;
}
function stripTags(html) {
    var ch, code, i, space, state, tag, text;
    html = html || '';
    if (html.length >= 3 && html[0] === '<' && html[html.length - 1] === '>') {
        text = '';
        state = 'content';
        tag = '';
        space = false;
        for (i = 0; i < html.length; i++) {
            ch = html[i];
            code = html.charCodeAt(i);
            if (state === 'content') {
                if (ch === '<') {
                    tag = ch;
                    state = 'tag';
                } else {
                    if (utils.isSpace(code)) {
                        if (space) {
                            space = true;
                        } else {
                            space = true;
                            text += ' ';
                        }
                    } else {
                        space = false;
                        text += ch;
                    }
                }
            } else {
                if (!(state === 'tag')) {
                    throw new Error('Unexpected case value: ' + state);
                }
                tag += ch;
                if (ch === '>') {
                    if ((tag === '</p>' || tag === '</li>' || tag === '<br>' || tag === '<br/>') && !space) {
                        space = true;
                        text += '\n';
                    }
                    state = 'content';
                }
            }
        }
    } else {
        text = html;
    }
    return text.trim();
}
function subscribeOnResize(action) {
    var id;
    id = generateRandomString();
    unit.resizables[id] = action;
    return id;
}
function td() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('td', properties, args);
}
function trace(name, value, largeObj) {
    try {
        traceCore(name, value, largeObj);
    } catch (ex) {
        console.error('Error in tracing', ex);
    }
}
function traceCore(name, value, largeObj) {
    var bucket, maxTrace;
    console.log('trace', name, value);
    maxTrace = 40;
    if (name) {
        if (largeObj) {
            unit.largeObj = largeObj;
        }
        bucket = {
            name: name,
            value: value
        };
        unit.traces.push(bucket);
        if (unit.traces.length > 40) {
            unit.traces.shift();
        }
    }
}
function translate(text) {
    var strings;
    strings = unit.globals.strings;
    if (strings && text in strings) {
        return strings[text];
    } else {
        return text;
    }
}
function unsubscribeFromResize(id) {
    delete unit.resizables[id];
}
unit.MultiWidget = MultiWidget;
unit.PanicScreen = PanicScreen;
unit.addLabelsToSettings = addLabelsToSettings;
unit.buildUrlForFolder = buildUrlForFolder;
unit.buildWidgetDom = buildWidgetDom;
unit.checkDiagram = checkDiagram;
unit.checkEmail = checkEmail;
unit.checkProjectName = checkProjectName;
unit.chooseDocumentType = chooseDocumentType;
unit.chooseDocumentType_create = chooseDocumentType_create;
unit.copyIfMissing = copyIfMissing;
unit.createLogonScreen = createLogonScreen;
unit.createLongClicker = createLongClicker;
unit.createMenuSection = createMenuSection;
unit.createRegisterScreen = createRegisterScreen;
unit.createRootElement = createRootElement;
unit.createSpecialStyles = createSpecialStyles;
unit.createWidget = createWidget;
unit.downloadImageDataAsFile = downloadImageDataAsFile;
unit.downloadTextDataAsFile = downloadTextDataAsFile;
unit.fetchAccount = fetchAccount;
unit.fetchUserSettings = fetchUserSettings;
unit.generateRandomString = generateRandomString;
unit.getAccountObj = getAccountObj;
unit.getAppRoot = getAppRoot;
unit.getAppVersion = getAppVersion;
unit.getDiagramLabels = getDiagramLabels;
unit.getLabelsByCode = getLabelsByCode;
unit.getLargeObj = getLargeObj;
unit.getQuery = getQuery;
unit.getSettingsObj = getSettingsObj;
unit.getTraces = getTraces;
unit.hideWaitBlock = hideWaitBlock;
unit.importDiagram = importDiagram;
unit.initDiagramLabels = initDiagramLabels;
unit.initShortcuts = initShortcuts;
unit.invokeWindowResize = invokeWindowResize;
unit.ipath = ipath;
unit.isLoggedOn = isLoggedOn;
unit.isNetworkError = isNetworkError;
unit.isSuccess = isSuccess;
unit.loadFonts = loadFonts;
unit.loadStringsForLanguage = loadStringsForLanguage;
unit.main = main;
unit.makeLogo = makeLogo;
unit.makeTopBar = makeTopBar;
unit.prepareFonts = prepareFonts;
unit.redrawWidgetDom = redrawWidgetDom;
unit.registerEvent = registerEvent;
unit.removeLoading = removeLoading;
unit.removeTagsFromRedirect = removeTagsFromRedirect;
unit.saveAsJson = saveAsJson;
unit.saveAsJsonCore = saveAsJsonCore;
unit.saveAsPng = saveAsPng;
unit.saveAsSvg = saveAsSvg;
unit.saveUserSettings = saveUserSettings;
unit.sendRequestRaw = sendRequestRaw;
unit.sendRequestWithCheck = sendRequestWithCheck;
unit.setLabelsForLanguage = setLabelsForLanguage;
unit.setStrings = setStrings;
unit.setTimeout = setTimeout;
unit.setTitle = setTitle;
unit.showConfirmEmail = showConfirmEmail;
unit.showConfirmEmail_create = showConfirmEmail_create;
unit.showMainMenu = showMainMenu;
unit.showWaitBlock = showWaitBlock;
unit.stretchElement = stretchElement;
unit.stripExtension = stripExtension;
unit.stripTags = stripTags;
unit.subscribeOnResize = subscribeOnResize;
unit.trace = trace;
unit.translate = translate;
unit.unsubscribeFromResize = unsubscribeFromResize;
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