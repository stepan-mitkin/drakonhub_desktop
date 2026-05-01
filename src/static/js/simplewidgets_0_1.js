function simplewidgets_0_1() {
var unit = {};
var gconfig;
var html;
var tracing;
var utils;
function DummyWidget() {
    var self = { _type: 'DummyWidget' };
    function init(config) {
        self.background = config.background;
    }
    function onHide() {
        tracing.trace('DummyWidget.onHide ' + self.background);
    }
    function onShow() {
        tracing.trace('DummyWidget.onShow ' + self.background);
    }
    function redraw(container) {
        setBackgroundColor(self);
    }
    function setBackground(background) {
        self.background = background;
        setBackgroundColor(self);
    }
    self.init = init;
    self.onHide = onHide;
    self.onShow = onShow;
    self.redraw = redraw;
    self.setBackground = setBackground;
    return self;
}
function LoadingScreen() {
    var self = { _type: 'LoadingScreen' };
    function redraw(container) {
        var label;
        label = div('middle', { text: tr('Loading...') });
        html.add(container, label);
    }
    self.redraw = redraw;
    return self;
}
function MoverLogic() {
    var self = { _type: 'MoverLogic' };
    function onMouseMove(evt) {
        evt.preventDefault();
        if (!(evt.pointerType === 'touch')) {
            moveMovable(self, evt);
        }
    }
    function onTouchMove(evt) {
        var evt2;
        evt.preventDefault();
        evt2 = {
            clientX: evt.touches[0].clientX,
            clientY: evt.touches[0].clientY
        };
        moveMovable(self, evt2);
    }
    function onUp(evt) {
        evt.preventDefault();
        if (self.active) {
            setIdleMoverStyle(self.mover);
            self.active = false;
        }
    }
    self.onMouseMove = onMouseMove;
    self.onTouchMove = onTouchMove;
    self.onUp = onUp;
    return self;
}
function PlainList() {
    var self = { _type: 'PlainList' };
    function init() {
        self.items = [];
    }
    function redraw(container) {
        self.container = container;
        container.style.overflowY = 'auto';
        redrawPlainList(self);
    }
    function setItems(items) {
        self.items = items;
        self.current = undefined;
        redrawPlainList(self);
    }
    self.init = init;
    self.redraw = redraw;
    self.setItems = setItems;
    return self;
}
function Tooltip(text) {
    var _obj_;
    _obj_ = Tooltip_create(text);
    return _obj_.run();
}
function Tooltip_create(text) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'Tooltip',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* Tooltip_main() {
        var _branch_, _eventType_, _event_, evt, left, timeoutId, top;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '26';
                me._busy = false;
                _event_ = yield;
                evt = _event_[1];
                if (isSynthetic(evt)) {
                    _branch_ = 'Idle';
                } else {
                    left = evt.clientX;
                    top = evt.clientY;
                    timeoutId = setTimeout(me.onTimeout, 500);
                    _branch_ = 'Hover';
                }
                break;
            case 'Hover':
                me.state = '10';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onTimeout') {
                    timeoutId = setTimeout(me.onTimeout, 3000);
                    showTooltip(left, top, text);
                    _branch_ = 'Showing';
                } else {
                    if (_eventType_ === 'onMove') {
                        evt = _event_[1];
                        left = evt.clientX;
                        top = evt.clientY;
                        _branch_ = 'Hover';
                    } else {
                        if (!(_eventType_ === 'onOut')) {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        clearTimeout(timeoutId);
                        _branch_ = 'Idle';
                    }
                }
                break;
            case 'Showing':
                me.state = '14';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (!(_eventType_ === 'onTimeout')) {
                    if (!(_eventType_ === 'onOut')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    clearTimeout(timeoutId);
                }
                hideTooltip();
                _branch_ = 'Idle';
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function Tooltip_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = Tooltip_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = Tooltip_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
        case '14':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onMove = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
        case '26':
            _args_ = [];
            _args_.push('onMove');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onOut = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
        case '14':
            _args_ = [];
            _args_.push('onOut');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function addTooltip(element, text) {
    var logic;
    if (!gconfig.pad) {
        logic = Tooltip_create(text);
        logic.run();
        registerEvent(element, 'mousemove', logic.onMove);
        registerEvent(element, 'mouseout', logic.onOut);
    }
}
function adjustInputBoxCoords(x, y) {
    var safe, shift, x2, y2;
    if (isMobileDevice()) {
        safe = getSafeArea();
        x2 = safe.left;
        y2 = safe.top;
    } else {
        shift = 10;
        x2 = x + shift;
        y2 = y + shift;
    }
    return [
        x2,
        y2
    ];
}
function adjustQuestionBody(client) {
    var area;
    area = getSafeArea();
    client.style.top = area.top + 'px';
    client.style.maxHeight = area.height + 'px';
}
function adjustSnackPosition(snackDiv) {
    var area, left, top;
    area = getSafeArea();
    left = area.left;
    top = area.top;
    if (isNarrowScreen()) {
        snackDiv.style.maxWidth = '100vw';
    } else {
        left += 5;
        top += 5;
    }
    snackDiv.style.left = left + 'px';
    snackDiv.style.top = top + 'px';
}
function buildComboPopup(cbOptions) {
    var items, rect;
    items = cbOptions.options.map(function (item) {
        return makeComboItem(item, cbOptions.onChange);
    });
    rect = cbOptions.container.getBoundingClientRect();
    showContextMenu(rect.left, rect.bottom, items, {
        shift: 0,
        width: rect.width + 'px',
        modal: true
    });
}
function calculateSafeArea() {
    var height, insets, width;
    insets = readSafeAreaInsets();
    console.log('insets', insets);
    width = window.innerWidth;
    height = window.innerHeight - insets.top - insets.bottom;
    unit.safeArea = {
        left: insets.left,
        top: insets.top,
        width: width,
        height: height
    };
}
function checkInputText(text, check) {
    if (check) {
        return check(text);
    } else {
        return undefined;
    }
}
function closePopup() {
    var top;
    if (!(unit.popups.length === 0)) {
        top = unit.popups.length - 1;
        removePopupsAbove(top - 1);
    }
}
function createArrowDownIcon() {
    var bottom, canvas, ctx, left, middle, padding, right, size, style, top;
    size = 30;
    padding = 8;
    style = {
        display: 'inline-block',
        margin: '0px',
        'vertical-align': 'bottom',
        position: 'absolute',
        top: '0px',
        right: '0px'
    };
    canvas = html.createElement('canvas', {
        width: size,
        height: size
    }, [style]);
    ctx = canvas.getContext('2d');
    left = padding;
    top = padding;
    right = size - padding;
    bottom = size - padding;
    middle = size / 2;
    ctx.fillStyle = 'rgb(69, 90, 100)';
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, top);
    ctx.lineTo(middle, bottom);
    ctx.closePath();
    ctx.fill();
    return canvas;
}
function createBadButton(text, action) {
    var button;
    button = div('generic-button bad-button', { text: text });
    registerEvent(button, 'click', action);
    return button;
}
function createCheckBox(container, name, value, onChange) {
    var check, label;
    label = html.createElement('label', {}, [{
            'line-height': '30px',
            'margin-left': '5px',
            'display': 'inline-block',
            'white-space': 'nowrap'
        }]);
    html.add(container, label);
    check = html.createElement('input', { type: 'checkbox' }, [{
            width: '20px',
            height: '20px',
            'vertical-align': 'middle'
        }]);
    check.checked = value;
    html.add(label, check);
    html.addText(label, name);
    registerEvent(check, 'click', function () {
        onChange(check.checked);
    });
}
function createComboBox(options, value, onChange, width) {
    var cbOptions, className, container, item, valueText;
    valueText = undefined;
    for (item of options) {
        if (item.id === value) {
            valueText = item.text;
            break;
        }
    }
    if (valueText) {
        width = width || '100%';
        className = 'generic-button simple-button';
        container = div(className, {
            width: width,
            'line-height': '30px',
            'position': 'relative'
        });
        html.addText(container, valueText);
        html.add(container, createArrowDownIcon({}));
        cbOptions = {
            container: container,
            options: options,
            value: value,
            onChange: onChange
        };
        registerEvent(container, 'click', function () {
            buildComboPopup(cbOptions);
        });
        return container;
    } else {
        throw new Error('Bad combobox value: ' + value);
    }
}
function createCommonStyles() {
    var font, header, size;
    size = gconfig.fontSize;
    font = size + 'px ' + gconfig.fontFamily;
    header = size + 4 + 'px ' + gconfig.fontFamily;
    html.addClass('textarea', 'resize: none');
    html.addClass('body', 'font: ' + font);
    html.addClass('pre', 'font-family: "Courier New", Courier, monospace;');
    html.addClass('.title', 'font: ' + header, 'margin-top: 10px');
    html.addClass('.shadow', 'box-shadow: 0px 0px 7px 2px rgba(0,0,0,0.27)');
    html.addClass('.full-screen', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh');
    html.addClass('input:not([type=checkbox]), textarea, select', 'font: ' + font, 'width: 100%', 'padding: 5px');
    html.addClass('.screen-container', 'display:inline-block', 'width:100%', 'height:100%');
    html.addClass('.middle', 'display: inline-block', 'position: absolute', 'left: 50%', 'top: 50%', 'transform: translate(-50%, -50%)');
    html.addClass('.middle-v', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 50%', 'transform: translateY(-50%)');
    html.addClass('.middle-h', 'display: inline-block', 'position: absolute', 'left: 50%', 'top: 0px', 'transform: translateX(-50%)');
    html.addClass('.header1', 'font-weight: bold', 'font-size: ' + (size + 4) + 'px', 'text-align: center');
    html.addClass('.grid-item', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'white-space: nowrap');
    html.addClass('.grid-item-text-cut', 'color: #c0c0c0');
    html.addClass('.grid-item-active', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'background:#9fd694', 'white-space: nowrap');
    html.addClass('.grid-item-selected', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'background:darkgreen', 'white-space: nowrap', 'color:white');
    html.addClass('.grid-item:hover, .grid-item-active:hover', 'background:#9fd694');
    html.addClass('.grid-item-text', 'display: inline-block', 'vertical-align: bottom', 'width: calc(100% - 30px)', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
    html.addClass('.grid-item-text2', 'display: inline-block', 'vertical-align: bottom', 'width: calc(100% - 60px)', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
    html.addClass('.grid-item-long', 'display: inline-block', 'vertical-align: bottom', 'white-space: nowrap', 'padding-left: 5px');
    html.addClass('.grid-item input[type="checkbox"]', 'display: inline-block', 'vertical-align: bottom', 'width: 24px', 'height: 24px', 'margin: 3px');
    html.addClass('.question-body ol', 'list-style-type: decimal', 'margin-left:15px');
    html.addClass('.question-body ul', 'list-style-type: disc', 'margin-left:17px');
    html.addClass('.generic-button', 'display:inline-block', 'vertical-align: top', 'padding-left: 10px', 'padding-right: 10px', 'cursor: pointer', 'border-radius: 3px', 'margin-right: 5px', 'line-height:34px', 'user-select: none');
    html.addClass('.generic-button:active', 'transform: translateY(2px)');
    html.addClass('.generic-button:link, .generic-button:visited', 'text-decoration:none');
    html.addClass('.simple-button', 'background: white', 'border: solid 1px #c0c0c0');
    html.addClass('.simple-button:hover', 'background: #9fd694');
    html.addClass('.default-button', 'border: solid 1px #038009', 'background: #038009', 'color: white');
    html.addClass('.default-button:hover', 'border: solid 1px #004a04', 'background: #004a04');
    html.addClass('.bad-button', 'border: solid 1px darkred', 'background: darkred', 'color: white');
    html.addClass('.bad-button:hover', 'border: solid 1px red', 'background: red');
    html.addClass('.icon-button', 'height: 40px', 'width: 40px');
    html.addClass('img.icon-button', 'display: inline-block', 'vertical-align: top', 'padding:0px', 'margin:0px');
    html.addClass('.question-back', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh', 'background: rgba(0, 0, 0, 0.2)', 'z-index: 19');
    html.addClass('.question-body', 'display: inline-block', 'position: fixed', 'left: 50%', 'transform: translateX(-50%)', 'top: 0px', 'max-width: 100vw', 'width: 400px', 'background: white', 'z-index: 20', 'overflow-y: auto', 'max-height: 100vh');
    html.addClass('.context-menu-item', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'white-space: nowrap');
    html.addClass('.context-menu-item:hover', 'background:#9fd694');
    html.addClass('.context-menu', 'display: inline-block', 'position: absolute', 'background: white', 'max-width: 100vw', 'min-width: 200px', 'border: solid 1px #a0a0a0', 'padding: 10px');
    html.addClass('.context-menu-separator', 'background: #a0a0a0', 'height: 1px', 'margin-top:5px', 'margin-bottom:5px');
    html.addClass('.context-menu-item-text', 'display: inline-block', 'vertical-align: bottom', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
    html.addClass('img.context-menu-icon-passive', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px');
    html.addClass('.snack-container', 'display: inline-block', 'position: fixed', 'left: 20px', 'top: 20px', 'width: 400px', 'max-width: calc(100vw - 20px)', 'height: 80px', 'background: white', 'z-index: 3500', 'border: solid 1px #a0a0a0', 'transition: opacity 500ms');
    html.addClass('.snack-field-back-bad', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: darkred');
    html.addClass('.snack-field-back-warning', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: darkgrey');
    html.addClass('.snack-field-back-good', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: green');
    html.addClass('.snack-field-text', 'display: inline-block', 'position: absolute', 'left: 30px', 'top: 0px', 'width: calc(100% - 30px)', 'height: 80px');
    html.addClass(':root', '--safe-area-top: env(safe-area-inset-top)', '--safe-area-bottom: env(safe-area-inset-bottom)');
}
function createDefaultButton(text, action) {
    var button;
    button = div('generic-button default-button', { text: text });
    registerEvent(button, 'click', action);
    return button;
}
function createDiv(parent, className) {
    var element;
    element = div(className);
    html.add(parent, element);
    return element;
}
function createIconButton(image, callback, tooltip) {
    var className, element;
    className = 'generic-button simple-button icon-button';
    element = img(image, className);
    element.style.marginRight = '2px';
    registerEvent(element, 'click', callback);
    if (tooltip) {
        addTooltip(element, tooltip);
    }
    return element;
}
function createMiddleWindow() {
    var client, root;
    removeQuestions();
    unit.questionVisible = true;
    root = html.get('question-root');
    html.add(root, div('question-back'));
    client = div('question-body shadow', { padding: '10px' });
    adjustQuestionBody(client);
    html.add(root, client);
    return client;
}
function createMovablePopup(header, left, top, path, hardcore) {
    var bar, barMover, bucket, client, close, moverLogic, popup;
    popup = div('shadow', { background: unit.darkColor });
    popup.style.border = 'solid 1px ' + unit.darkColor;
    if (hardcore || isMobileDevice()) {
        pushSemiModalPopup(popup, left, top, undefined, hardcore);
    } else {
        pushPopup(popup, left, top);
    }
    bar = div({
        position: 'relative',
        height: '40px',
        background: unit.darkColor,
        'user-select': 'none',
        padding: '13px',
        color: 'white'
    });
    disableContextMenu(bar);
    if (header) {
        html.setText(bar, header);
    }
    html.add(popup, bar);
    client = div({ background: 'white' });
    html.add(popup, client);
    close = createIconButton(path + 'cross.png', removePopups);
    close.style.display = 'inline-block';
    close.style.position = 'absolute';
    close.style.top = '0px';
    close.style.right = '0px';
    close.style.margin = '0px';
    close.style.border = '0px';
    close.style.background = 'rgba(69, 90, 100, 0)';
    html.add(bar, close);
    bucket = {
        popup: popup,
        client: client
    };
    barMover = div();
    setIdleMoverStyle(barMover);
    html.add(bar, barMover);
    moverLogic = MoverLogic();
    registerEvent(barMover, 'pointerdown', function (evt) {
        onMovableBarMouseDown(moverLogic, popup, barMover, evt);
    });
    registerEvent(barMover, 'pointermove', moverLogic.onMouseMove);
    registerEvent(barMover, 'pointerup', moverLogic.onUp);
    registerEvent(barMover, 'pointerout', moverLogic.onUp);
    registerEvent(barMover, 'touchstart', function (evt) {
        onMovableBarTouchStart(moverLogic, popup, barMover, evt);
    });
    registerEvent(barMover, 'touchmove', moverLogic.onTouchMove);
    registerEvent(barMover, 'touchend', moverLogic.onUp);
    registerEvent(barMover, 'touchcancel', moverLogic.onUp);
    return bucket;
}
function createPlainListItem(widget, dataItem) {
    var item, itemClass;
    if (widget.current === dataItem.id) {
        itemClass = 'grid-item-active';
    } else {
        itemClass = 'grid-item';
    }
    item = div(itemClass, {
        text: dataItem.text,
        padding: '10px'
    });
    if (!(widget.current === dataItem.id)) {
        item.style.cursor = 'pointer';
        registerEvent(item, 'click', function (evt) {
            onPlainItemClick(widget, evt, dataItem);
        });
    }
    html.add(widget.container, item);
}
function createSimpleButton(text, action, color, background) {
    var button;
    button = div('generic-button simple-button', { text: text });
    if (color) {
        button.style.color = color;
    }
    if (background) {
        button.style.background = background;
    }
    registerEvent(button, 'click', action);
    return button;
}
function createSomething(config) {
    var _obj_;
    _obj_ = createSomething_create(config);
    return _obj_.run();
}
function createSomethingOnEnter(obj, evt) {
    if (evt.key === 'Enter') {
        obj.create();
    }
}
function createSomething_create(config) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'createSomething',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* createSomething_main() {
        var _branch_, _eventType_, _event_, buttons, cancel, create, dialog, error, errorMessage, explain, input, name, response;
        try {
            _branch_ = 'Build ui';
            while (true) {
                switch (_branch_) {
                case 'Build ui':
                    dialog = createMiddleWindow();
                    html.add(dialog, div({
                        'text-align': 'center',
                        'line-height': 1.3,
                        'padding-bottom': '10px',
                        'position': 'relative'
                    }, div({
                        text: tr('Create project'),
                        'font-weight': 'bold',
                        'font-size': config.headerSize
                    })));
                    _branch_ = 'Error block';
                    break;
                case 'Error block':
                    error = div({
                        color: 'darkred',
                        'padding-bottom': '10px',
                        display: 'none'
                    });
                    _branch_ = 'Input';
                    break;
                case 'Input':
                    input = html.createElement('input', {
                        type: 'text',
                        placeholder: config.placeholder
                    }, [{
                            width: '100%',
                            'margin-bottom': '10px'
                        }]);
                    html.add(dialog, input);
                    html.add(dialog, error);
                    explain = config.explain;
                    html.add(dialog, div({ text: explain }));
                    registerEvent(input, 'keydown', function (evt) {
                        createSomethingOnEnter(me, evt);
                    });
                    _branch_ = 'Buttons';
                    break;
                case 'Buttons':
                    create = createDefaultButton(tr('Create'), me.create);
                    cancel = createSimpleButton(tr('Cancel'), me.cancel);
                    cancel.style.marginRight = '0px';
                    buttons = div({
                        'padding-top': '10px',
                        position: 'relative',
                        'text-align': 'right'
                    }, create, cancel);
                    html.add(dialog, buttons);
                    _branch_ = 'Get name from user';
                    break;
                case 'Get name from user':
                    input.focus();
                    me.state = '40';
                    me._busy = false;
                    _event_ = yield;
                    _eventType_ = _event_[0];
                    if (_eventType_ === 'create') {
                        name = input.value.trim();
                        errorMessage = config.checkName(name);
                        if (errorMessage) {
                            html.setText(error, errorMessage);
                            error.style.display = '';
                            _branch_ = 'Get name from user';
                        } else {
                            _branch_ = 'Send to server';
                        }
                    } else {
                        if (!(_eventType_ === 'cancel')) {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        removeQuestions();
                        _branch_ = 'Exit';
                    }
                    break;
                case 'Send to server':
                    config.create(name).then(me.onResponse);
                    me.state = '64';
                    me._busy = false;
                    _event_ = yield;
                    response = _event_[1];
                    if (response.error) {
                        html.setText(response.error);
                        error.style.display = '';
                        _branch_ = 'Get name from user';
                    } else {
                        removeQuestions();
                        config.onCreated(response.result).then(me.onCreated);
                        me.state = '65';
                        me._busy = false;
                        _event_ = yield;
                        _branch_ = 'Exit';
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
        } catch (_handlerData_) {
            removeQuestions();
            console.error(_handlerData_);
            showErrorSnack(tr('An error has occurred'));
        }
        _topResolve_();
    }
    function createSomething_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = createSomething_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = createSomething_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.create = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '40':
            _args_ = [];
            _args_.push('create');
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
        case '40':
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
    me.onCreated = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '65':
            _args_ = [];
            _args_.push('onCreated');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function createWideMiddleWindow() {
    var client, root;
    removeQuestions();
    unit.questionVisible = true;
    root = html.get('question-root');
    html.add(root, div('question-back'));
    client = div('question-body shadow', {
        padding: '10px',
        width: '1200px'
    });
    adjustQuestionBody(client);
    html.add(root, client);
    return client;
}
function criticalQuestion(title, okText, cancelText) {
    var _obj_;
    _obj_ = criticalQuestion_create(title, okText, cancelText);
    return _obj_.run();
}
function criticalQuestion_create(title, okText, cancelText) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'criticalQuestion',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* criticalQuestion_main() {
        var _eventType_, _event_, buttons, cancel, dialog, message;
        dialog = createMiddleWindow();
        message = div({
            'padding-bottom': '10px',
            text: title
        });
        cancel = createSimpleButton(cancelText, me.no);
        cancel.style.marginRight = '0px';
        buttons = div({ 'text-align': 'right' }, createBadButton(okText, me.yes), cancel);
        html.add(dialog, message);
        html.add(dialog, buttons);
        me.state = '12';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'yes') {
            removeQuestions();
            _topResolve_(true);
            return;
        } else {
            if (!(_eventType_ === 'no')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            removeQuestions();
            _topResolve_(false);
            return;
        }
        _topResolve_();
    }
    function criticalQuestion_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = criticalQuestion_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = criticalQuestion_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.yes = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
            _args_ = [];
            _args_.push('yes');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.no = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
            _args_ = [];
            _args_.push('no');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function disableContextMenu(element) {
    element.addEventListener('contextmenu', noContext);
}
function div() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('div', properties, args);
}
function findHitPopup(evt) {
    var current, index;
    current = evt.target;
    while (true) {
        index = getPopupIndex(current);
        if (index === -1) {
            current = current.parentElement;
            if (!current) {
                break;
            }
        } else {
            break;
        }
    }
    return index;
}
function getPopupIndex(element) {
    var i, popup;
    for (i = 0; i < unit.popups.length; i++) {
        popup = unit.popups[i].element;
        if (popup === element) {
            return i;
        }
    }
    return -1;
}
function getSafeArea() {
    return unit.safeArea;
}
function getSafeAreaBottom() {
    var style, value;
    if (gconfig.safeBottom) {
        return gconfig.safeBottom;
    } else {
        style = getComputedStyle(document.documentElement);
        value = style.getPropertyValue('--safe-area-bottom');
        return parseFloat(value) || 0;
    }
}
function getSafeAreaTop() {
    var style, value;
    if (gconfig.safeTop) {
        return gconfig.safeTop;
    } else {
        style = getComputedStyle(document.documentElement);
        value = style.getPropertyValue('--safe-area-top');
        return parseFloat(value) || 0;
    }
}
function hasPopup() {
    return unit.popups.length > 0;
}
function hasUnsavedChanges() {
    return unit.unsaved;
}
function hideTooltip() {
    if (unit.tooltipElement) {
        html.remove(unit.tooltipElement);
        unit.tooltipElement = undefined;
    }
}
function img(src, className) {
    className = className || '';
    return html.createElement('img', {
        src: src,
        draggable: false
    }, [className]);
}
function init(tr) {
    unit.darkColor = 'green';
    createCommonStyles();
    initPopups();
    unit.tr = tr;
    unit.unsaved = false;
}
function initPopups() {
    unit.popups = [];
    registerEvent(window.document, 'click', popupOnGlobalClick, true);
}
function inputBox(x, y, title, text, check, action) {
    var _obj_;
    _obj_ = inputBox_create(x, y, title, text, check, action);
    return _obj_.run();
}
async function inputBoxRo(x, y, title, text) {
    var bottom, cancel, coords, dialog, input, x2, y2;
    input = html.createElement('input', { type: 'text' });
    input.readOnly = true;
    cancel = createSimpleButton(tr('Close'), removePopups);
    cancel.style.margin = '0px';
    bottom = div({
        'padding-top': '5px',
        'text-align': 'right'
    }, cancel);
    dialog = div('shadow', {
        width: '400px',
        'max-width': '100vw',
        padding: '5px',
        background: 'white',
        border: 'solid 1px #a0a0a0'
    }, div({
        text: title,
        'padding-bottom': '5px'
    }), input, bottom);
    coords = adjustInputBoxCoords(x, y);
    x2 = coords[0];
    y2 = coords[1];
    removePopups();
    pushSemiModalPopup(dialog, x2, y2);
    input.value = text;
    input.setSelectionRange(0, input.value.length);
    input.focus();
}
function inputBox_create(x, y, title, text, check, action) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'inputBox',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* inputBox_main() {
        var _eventType_, _event_, bottom, cancel, coords, dialog, error, errorMessage, form, input, ok, x2, y2;
        input = html.createElement('input', { type: 'text' });
        ok = createDefaultButton(tr('Accept'), me.confirm);
        cancel = createSimpleButton(tr('Cancel'), removePopups);
        cancel.style.margin = '0px';
        bottom = div({
            'padding-top': '5px',
            'text-align': 'right'
        }, ok, cancel);
        error = div({
            'padding-top': '5px',
            'color': 'darkred',
            display: 'none'
        });
        form = html.createElement('form', { autocomplete: 'off' });
        registerEvent(form, 'submit', function (evt) {
            evt.preventDefault();
        });
        html.add(form, input);
        registerEvent(input, 'keydown', function (evt) {
            onInputKeyDown(me, evt);
        });
        dialog = div('shadow', {
            width: '400px',
            'max-width': '100vw',
            padding: '5px',
            background: 'white',
            border: 'solid 1px #a0a0a0'
        }, div({
            text: title,
            'padding-bottom': '5px'
        }), form, error, bottom);
        coords = adjustInputBoxCoords(x, y);
        x2 = coords[0];
        y2 = coords[1];
        removePopups();
        pushSemiModalPopup(dialog, x2, y2, undefined);
        input.value = text;
        input.setSelectionRange(0, input.value.length);
        input.focus();
        while (true) {
            me.state = '49';
            me._busy = false;
            _event_ = yield;
            _eventType_ = _event_[0];
            if (_eventType_ === 'cancel') {
                text = undefined;
                break;
            } else {
                if (!(_eventType_ === 'confirm')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                text = input.value.trim();
                errorMessage = checkInputText(text, check);
                if (errorMessage) {
                    error.style.display = 'block';
                    html.setText(error, errorMessage);
                    setTimeout(me.onTimeout, 1000);
                    me.state = '82';
                    me._busy = false;
                    _event_ = yield;
                } else {
                    if (action) {
                        action(text).then(me.onAction);
                        me.state = '83';
                        me._busy = false;
                        _event_ = yield;
                        errorMessage = _event_[1];
                        if (errorMessage) {
                            error.style.display = 'block';
                            html.setText(error, errorMessage);
                            setTimeout(me.onTimeout, 1000);
                            me.state = '82';
                            me._busy = false;
                            _event_ = yield;
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
        removePopups();
        _topResolve_(text);
        return;
    }
    function inputBox_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = inputBox_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = inputBox_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '49':
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
        case '49':
            _args_ = [];
            _args_.push('confirm');
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
        case '82':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onAction = function (errorMessage) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '83':
            _args_ = [];
            _args_.push('onAction');
            _args_.push(errorMessage);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function isMobileDevice() {
    if (window.padBridge && window.padBridge.setUpStatusBar || (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i))) {
        return true;
    } else {
        return false;
    }
}
function isNarrowScreen() {
    if (window.innerWidth <= 600 || window.innerHeight <= 400) {
        return true;
    } else {
        return false;
    }
}
function isSynthetic(evt) {
    if (evt.sourceCapabilities && evt.sourceCapabilities.firesTouchEvents) {
        return true;
    } else {
        return false;
    }
}
function largeBox(x, y, title, text, check) {
    var _obj_;
    _obj_ = largeBox_create(x, y, title, text, check);
    return _obj_.run();
}
async function largeBoxRo(x, y, title, text) {
    var bottom, cancel, dialog, input, shift, x2, y2;
    input = html.createElement('textarea', {}, [{ height: '300px' }]);
    input.readOnly = true;
    cancel = createSimpleButton(tr('Close'), removePopups);
    cancel.style.margin = '0px';
    bottom = div({
        'padding-top': '5px',
        'text-align': 'right'
    }, cancel);
    dialog = div('shadow', {
        width: '400px',
        'max-width': '100vw',
        padding: '5px',
        background: 'white',
        border: 'solid 1px #a0a0a0'
    }, div({
        text: title,
        'padding-bottom': '5px'
    }), input, bottom);
    shift = 10;
    x2 = x + shift;
    y2 = y + shift;
    removePopups();
    pushSemiModalPopup(dialog, x2, y2);
    input.value = text;
    input.setSelectionRange(0, input.value.length);
    input.focus();
}
function largeBox_create(x, y, title, text, check) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'largeBox',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* largeBox_main() {
        var _eventType_, _event_, bottom, cancel, dialog, error, errorMessage, input, ok, shift, x2, y2;
        input = html.createElement('textarea', {}, [{ height: '300px' }]);
        ok = createDefaultButton(tr('Accept'), me.confirm);
        cancel = createSimpleButton(tr('Cancel'), removePopups);
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
        registerEvent(input, 'keydown', function (evt) {
            onLargeInputKeyDown(me, evt);
        });
        dialog = div('shadow', {
            width: '400px',
            'max-width': '100vw',
            padding: '5px',
            background: 'white',
            border: 'solid 1px #a0a0a0'
        }, div({
            text: title,
            'padding-bottom': '5px'
        }), input, bottom);
        shift = 10;
        x2 = x + shift;
        y2 = y + shift;
        removePopups();
        pushSemiModalPopup(dialog, x2, y2);
        input.value = text;
        input.setSelectionRange(0, input.value.length);
        input.focus();
        while (true) {
            me.state = '49';
            me._busy = false;
            _event_ = yield;
            _eventType_ = _event_[0];
            if (_eventType_ === 'cancel') {
                text = undefined;
                break;
            } else {
                if (!(_eventType_ === 'confirm')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                text = input.value.trim();
                errorMessage = checkInputText(text, check);
                if (errorMessage) {
                    error.style.display = 'block';
                    html.setText(error, errorMessage);
                } else {
                    break;
                }
            }
        }
        removePopups();
        _topResolve_(text);
        return;
    }
    function largeBox_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = largeBox_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = largeBox_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.cancel = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '49':
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
        case '49':
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
function makeComboItem(item, onChange) {
    var id;
    id = item.id;
    return {
        text: item.text,
        action: function () {
            onChange(id);
        },
        arg: item.id
    };
}
function makeContextMenuItem(item) {
    var callback, line;
    if (item.type === 'separator') {
        return div('context-menu-separator');
    } else {
        line = div('context-menu-item');
        if (item.icon) {
            html.add(line, html.createElement('img', {
                draggable: false,
                src: item.icon
            }, ['context-menu-icon-passive']));
        }
        html.add(line, div('context-menu-item-text', { text: item.text }));
        callback = function (evt) {
            removePopups();
            return item.action(evt);
        };
        registerEvent(line, 'click', callback);
        return line;
    }
}
function makeLink(url, text, newTab) {
    var link;
    link = html.createElement('a', { href: url }, [{ text: text }]);
    if (newTab) {
        link.target = '_blank';
    }
    return link;
}
function markUnsaved() {
    unit.unsaved = true;
}
function moveMovable(moverLogic, evt) {
    var dx, dy, left, top;
    if (!(evt.pointerType === 'touch') && moverLogic.active) {
        dx = evt.clientX - moverLogic.startX;
        dy = evt.clientY - moverLogic.startY;
        left = moverLogic.startLeft + dx;
        top = moverLogic.startTop + dy;
        positionPopup(moverLogic.popup, left, top);
    }
}
function neutralQuestion(title, okText, cancelText) {
    var _obj_;
    _obj_ = neutralQuestion_create(title, okText, cancelText);
    return _obj_.run();
}
function neutralQuestion_create(title, okText, cancelText) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'neutralQuestion',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* neutralQuestion_main() {
        var _eventType_, _event_, buttons, cancel, dialog, message;
        dialog = createMiddleWindow();
        message = div({
            'padding-bottom': '10px',
            text: title
        });
        cancel = createSimpleButton(cancelText, me.no);
        cancel.style.marginRight = '0px';
        buttons = div({ 'text-align': 'right' }, createDefaultButton(okText, me.yes), cancel);
        html.add(dialog, message);
        html.add(dialog, buttons);
        me.state = '12';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'yes') {
            removeQuestions();
            _topResolve_(true);
            return;
        } else {
            if (!(_eventType_ === 'no')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            removeQuestions();
            _topResolve_(false);
            return;
        }
        _topResolve_();
    }
    function neutralQuestion_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = neutralQuestion_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = neutralQuestion_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.yes = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
            _args_ = [];
            _args_.push('yes');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.no = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
            _args_ = [];
            _args_.push('no');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function noContext(evt) {
    evt.preventDefault();
    return false;
}
function onInputKeyDown(self, evt) {
    if (evt.key === 'Enter') {
        self.confirm();
    } else {
        if (evt.key === 'Escape') {
            self.cancel();
        }
    }
}
function onLargeInputKeyDown(self, evt) {
    if (evt.key === 'Enter') {
        if (evt.ctrlKey) {
            evt.preventDefault();
            self.confirm();
        }
    } else {
        if (evt.key === 'Escape') {
            evt.preventDefault();
            self.cancel();
        }
    }
}
function onMovableBarMouseDown(moverLogic, popup, barMover, evt) {
    if (!(evt.pointerType === 'touch')) {
        evt.target.setPointerCapture(evt.pointerId);
        evt.preventDefault();
        evt.stopPropagation();
        startMoveMovable(moverLogic, popup, barMover, evt);
    }
}
function onMovableBarTouchStart(moverLogic, popup, barMover, evt) {
    var evt2;
    evt2 = {
        clientX: evt.touches[0].clientX,
        clientY: evt.touches[0].clientY
    };
    evt.preventDefault();
    startMoveMovable(moverLogic, popup, barMover, evt2);
}
function onPlainItemClick(widget, evt, dataItem) {
    widget.current = dataItem.id;
    redrawPlainList(widget);
    widget.onItemClick(evt, dataItem);
}
function onUnhandledError(ex) {
    console.log('onUnhandledError');
    console.error(ex);
    try {
        showErrorSnack(tr('Произошла ошибка') + ': ' + ex.message);
    } catch (ex) {
    }
}
function popPopup(skipCancel) {
    var popup;
    if (!(unit.popups.length === 0)) {
        popup = unit.popups.pop();
        html.remove(popup.element);
        if (popup.onCanceled && !skipCancel) {
            popup.onCanceled();
        }
    }
}
function popupOnGlobalClick(evt) {
    var hitPopup;
    if (!evt.ctrlKey) {
        hitPopup = findHitPopup(evt);
        removePopupsAbove(hitPopup);
    }
}
function positionPopup(element, x, y) {
    var rect;
    x = Math.floor(x);
    y = Math.floor(y);
    element.style.display = 'inline-block';
    element.style.position = 'fixed';
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    rect = element.getBoundingClientRect();
    if (rect.right >= window.innerWidth) {
        x = window.innerWidth - rect.width;
    }
    if (x < 0) {
        x = 0;
    }
    if (rect.bottom >= window.innerHeight) {
        y = window.innerHeight - rect.height;
    }
    if (y < 0) {
        y = 0;
    }
    element.style.left = x + 'px';
    element.style.top = y + 'px';
}
function pushPopup(element, x, y, onCanceled) {
    var root, start;
    start = 100;
    element.style.zIndex = start + unit.popups.length;
    root = html.get('popup-root');
    html.add(root, element);
    positionPopup(element, x, y);
    unit.popups.push({
        element: element,
        onCanceled: onCanceled
    });
}
function pushSemiModalPopup(element, x, y, onCanceled, hardcore) {
    var back, container, ordinal, root, start, zIndex, zIndexBack;
    start = 100;
    ordinal = unit.popups.length;
    zIndex = start + ordinal * 10;
    zIndexBack = zIndex - 1;
    element.style.zIndex = zIndex;
    root = html.get('popup-root');
    container = createDiv(root, '');
    back = createDiv(container, 'full-screen');
    disableContextMenu(back);
    back.style.zIndex = zIndexBack;
    html.add(container, element);
    positionPopup(element, x, y);
    unit.popups.push({
        element: container,
        onCanceled: onCanceled
    });
    if (hardcore) {
        back.style.background = 'rgba(0, 0, 0, 0.2)';
    } else {
        registerEvent(back, 'mousedown', function () {
            removePopupsAbove(ordinal - 1);
        });
    }
}
function readSafeAreaInsets() {
    var cs, el, insets, px;
    el = document.createElement('div');
    el.style.cssText = 'position: fixed; ' + 'left: 0; top: 0; ' + 'width: 0; height: 0; ' + 'padding: env(safe-area-inset-top) env(safe-area-inset-right) ' + '         env(safe-area-inset-bottom) env(safe-area-inset-left); ' + 'visibility: hidden; ' + 'pointer-events: none; ';
    document.body.appendChild(el);
    cs = getComputedStyle(el);
    px = v => {
        var n;
        n = parseFloat(v || '0');
        return Number.isFinite(n) ? n : 0;
    };
    insets = {
        top: px(cs.paddingTop),
        right: px(cs.paddingRight),
        bottom: px(cs.paddingBottom),
        left: px(cs.paddingLeft)
    };
    el.remove();
    return insets;
}
function redrawPlainList(widget) {
    var _collection_134, item;
    html.clear(widget.container);
    _collection_134 = widget.items;
    for (item of _collection_134) {
        createPlainListItem(widget, item);
    }
}
function registerEvent(element, eventName, action, options) {
    tracing.registerEvent(element, eventName, action, options);
}
function removePopups() {
    removePopupsAbove(-1);
}
function removePopupsAbove(index) {
    var i, popup;
    for (i = unit.popups.length - 1; i > index; i--) {
        popup = unit.popups.pop();
        html.remove(popup.element);
        if (popup.onCanceled) {
            popup.onCanceled();
        }
    }
}
function removeQuestions() {
    var root;
    root = html.get('question-root');
    html.clear(root);
    unit.questionVisible = false;
    unit.unsaved = false;
}
function removeSnack() {
    var container;
    if (unit.snack) {
        unit.snack.stop();
        unit.snack = undefined;
    }
    container = html.get('snack-root');
    html.clear(container);
}
function setActiveMoverStyle(mover) {
    mover.style.height = '100vh';
    mover.style.width = '100vw';
    mover.style.left = '0px';
    mover.style.top = '0px';
    mover.style.position = 'fixed';
    mover.style.display = 'inline-block';
    mover.style.zIndex = 5000;
    mover.style.cursor = 'default';
    mover.style.userSelect = 'none';
}
function setBackgroundColor(widget) {
    widget.container.style.background = widget.background;
}
function setIdleMoverStyle(mover) {
    mover.style.height = '100%';
    mover.style.width = 'calc(100% - 40px)';
    mover.style.left = '0px';
    mover.style.top = '0px';
    mover.style.position = 'absolute';
    mover.style.display = 'inline-block';
    mover.style.zIndex = 0;
    mover.style.cursor = 'default';
    mover.style.userSelect = 'none';
}
function setTimeout(action, delay) {
    return tracing.setTimeout(action, delay);
}
function showContextMenu(x, y, items, options) {
    showContextMenuExact(x + 5, y + 5, items, options);
}
function showContextMenuExact(x, y, items, options) {
    var item, menu, movable, mv, shift;
    removePopups();
    if (options && options.movable) {
        mv = createMovablePopup('', x, y, gconfig.imagePath);
        menu = mv.client;
        mv.popup.style.minWidth = '200px';
        mv.client.style.padding = '10px';
        movable = true;
    } else {
        menu = div('context-menu shadow');
        movable = false;
    }
    registerEvent(menu, 'contextmenu', function (evt) {
        evt.preventDefault();
        return false;
    });
    if (options && 'shift' in options) {
        shift = options.shift;
        if ('width' in options) {
            menu.style.width = options.width;
        }
    }
    for (item of items) {
        html.add(menu, makeContextMenuItem(item));
    }
    if (movable) {
        positionPopup(mv.popup, x, y);
    } else {
        if (options && options.modal) {
            pushSemiModalPopup(menu, x, y);
        } else {
            pushPopup(menu, x, y);
        }
    }
}
function showErrorSnack(text) {
    showSnackCore('snack-field-back-bad', text);
}
function showGoodSnack(text) {
    showSnackCore('snack-field-back-good', text);
}
function showSnackCore(style, text) {
    var root, snackDiv;
    removeSnack();
    root = html.get('snack-root');
    snackDiv = div('snack-container shadow', div(style), div('snack-field-text', div('middle-v', {
        text: text,
        'padding-left': '10px'
    })));
    html.add(root, snackDiv);
    adjustSnackPosition(snackDiv);
    unit.snack = snackProc_create(snackDiv);
    unit.snack.run();
}
function showTooltip(left, top, text) {
    hideTooltip();
    unit.tooltipElement = div({
        display: 'inline-block',
        position: 'absolute',
        text: text,
        color: 'black',
        background: '#ffffd0',
        padding: '10px',
        'border-radius': '5px',
        zIndex: 10,
        font: gconfig.fontSize + 'px ' + gconfig.fontFamily
    });
    html.add(document.documentElement, unit.tooltipElement);
    positionPopup(unit.tooltipElement, left + 10, top + 5);
}
function showUndoSnack(text, action) {
    var root, snackDiv, undoButton, wrapped;
    removeSnack();
    root = html.get('snack-root');
    wrapped = function () {
        removeSnack();
        action();
    };
    undoButton = createSimpleButton(tr('Undo'), wrapped);
    undoButton.style.position = 'absolute';
    undoButton.style.right = '10px';
    undoButton.style.bottom = '10px';
    snackDiv = div('snack-container shadow', div('snack-field-back-warning'), div('snack-field-text', div('middle-v', {
        text: text,
        'padding-left': '10px'
    }), undoButton));
    html.add(root, snackDiv);
    adjustSnackPosition(snackDiv);
    unit.snack = snackProcLong_create(snackDiv);
    unit.snack.run();
}
function snackProc(snackDiv) {
    var _obj_;
    _obj_ = snackProc_create(snackDiv);
    return _obj_.run();
}
function snackProcLong(snackDiv) {
    var _obj_;
    _obj_ = snackProcLong_create(snackDiv);
    return _obj_.run();
}
function snackProcLong_create(snackDiv) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'snackProcLong',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* snackProcLong_main() {
        var _event_;
        setTimeout(me.onTimeout, 5000);
        me.state = '8';
        me._busy = false;
        _event_ = yield;
        snackDiv.style.opacity = 0;
        setTimeout(me.onTimeout, 500);
        me.state = '10';
        me._busy = false;
        _event_ = yield;
        removeSnack();
        _topResolve_();
    }
    function snackProcLong_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = snackProcLong_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = snackProcLong_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '8':
        case '10':
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
function snackProc_create(snackDiv) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'snackProc',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* snackProc_main() {
        var _event_;
        setTimeout(me.onTimeout, 2000);
        me.state = '8';
        me._busy = false;
        _event_ = yield;
        snackDiv.style.opacity = 0;
        setTimeout(me.onTimeout, 500);
        me.state = '10';
        me._busy = false;
        _event_ = yield;
        removeSnack();
        _topResolve_();
    }
    function snackProc_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = snackProc_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = snackProc_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '8':
        case '10':
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
function startMoveMovable(moverLogic, popup, barMover, evt) {
    var rect;
    setActiveMoverStyle(barMover);
    rect = popup.getBoundingClientRect();
    moverLogic.startX = evt.clientX;
    moverLogic.startY = evt.clientY;
    moverLogic.startLeft = rect.left;
    moverLogic.startTop = rect.top;
    moverLogic.popup = popup;
    moverLogic.mover = barMover;
    moverLogic.active = true;
}
function tr(text) {
    if (unit.tr) {
        return unit.tr(text);
    } else {
        return text;
    }
}
function uploadFile(prompt, accept, onStartedLoading, skipUpload) {
    var _obj_;
    _obj_ = uploadFile_create(prompt, accept, onStartedLoading, skipUpload);
    return _obj_.run();
}
function uploadFileWithButton(prompt, accept, onStartedLoading) {
    var _obj_;
    _obj_ = uploadFileWithButton_create(prompt, accept, onStartedLoading);
    return _obj_.run();
}
function uploadFileWithButton_create(prompt, accept, onStartedLoading) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'uploadFileWithButton',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* uploadFileWithButton_main() {
        var _eventType_, _event_, buttons, client, evt, file, fileData, imp, input, reader, result;
        result = undefined;
        client = createMiddleWindow();
        html.add(client, div({
            text: prompt,
            padding: '5px'
        }));
        input = html.createElement('input', {
            type: 'file',
            accept: accept
        }, [{
                padding: '10px',
                width: '100%'
            }]);
        html.add(client, input);
        imp = createDefaultButton(tr('Import'), me.imp);
        imp.style.display = 'none';
        buttons = div({
            'text-align': 'right',
            'padding-bottom': '5px'
        }, imp, createSimpleButton(tr('Cancel'), me.cancel));
        html.add(client, buttons);
        registerEvent(input, 'change', me.chosen);
        me.state = '23';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'chosen') {
            evt = _event_[1];
            imp.style.display = 'inline-block';
            file = evt.target.files[0];
            me.state = '28';
            me._busy = false;
            _event_ = yield;
            _eventType_ = _event_[0];
            if (_eventType_ === 'imp') {
                removeQuestions();
                onStartedLoading();
                reader = new FileReader();
                registerEvent(reader, 'load', function (evt) {
                    me.loaded(evt.target.result);
                });
                reader.readAsText(file);
                me.state = '35';
                me._busy = false;
                _event_ = yield;
                fileData = _event_[1];
                result = {
                    file: file,
                    data: fileData
                };
                _topResolve_(result);
                return;
            } else {
                if (!(_eventType_ === 'cancel')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                removeQuestions();
                _topResolve_(result);
                return;
            }
        } else {
            if (!(_eventType_ === 'cancel')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            removeQuestions();
            _topResolve_(result);
            return;
        }
        _topResolve_();
    }
    function uploadFileWithButton_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = uploadFileWithButton_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = uploadFileWithButton_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.chosen = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '23':
            _args_ = [];
            _args_.push('chosen');
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
        case '23':
        case '28':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.imp = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '28':
            _args_ = [];
            _args_.push('imp');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.loaded = function (fileData) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '35':
            _args_ = [];
            _args_.push('loaded');
            _args_.push(fileData);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function uploadFile_create(prompt, accept, onStartedLoading, skipUpload) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'uploadFile',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* uploadFile_main() {
        var _branch_, _event_, data, file, fileData, input, reader, result;
        _branch_ = 'Create input element';
        while (true) {
            switch (_branch_) {
            case 'Create input element':
                input = unit.fileInput;
                if (input) {
                    html.remove(input);
                    unit.fileInput = undefined;
                }
                input = html.createElement('input', { type: 'file' });
                input.hidden = true;
                unit.fileInput = input;
                html.add(document.body, input);
                input.accept = accept;
                input.onchange = me.selected;
                input.click();
                _branch_ = 'Select file';
                break;
            case 'Select file':
                me.state = '19';
                me._busy = false;
                _event_ = yield;
                if (input.files.length > 0) {
                    file = input.files[0];
                    if (skipUpload) {
                        data = undefined;
                        _branch_ = 'Exit';
                    } else {
                        _branch_ = 'Read file';
                    }
                } else {
                    _branch_ = 'Select file';
                }
                break;
            case 'Read file':
                onStartedLoading();
                reader = new FileReader();
                registerEvent(reader, 'load', function (evt) {
                    me.loaded(evt.target.result);
                });
                reader.readAsText(file);
                me.state = '9';
                me._busy = false;
                _event_ = yield;
                fileData = _event_[1];
                _branch_ = 'Exit';
                break;
            case 'Exit':
                _branch_ = undefined;
                result = {
                    file: file,
                    data: fileData
                };
                _topResolve_(result);
                return;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function uploadFile_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = uploadFile_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = uploadFile_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.loaded = function (fileData) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '9':
            _args_ = [];
            _args_.push('loaded');
            _args_.push(fileData);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.selected = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
            _args_ = [];
            _args_.push('selected');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
unit.DummyWidget = DummyWidget;
unit.LoadingScreen = LoadingScreen;
unit.MoverLogic = MoverLogic;
unit.PlainList = PlainList;
unit.addTooltip = addTooltip;
unit.calculateSafeArea = calculateSafeArea;
unit.closePopup = closePopup;
unit.createBadButton = createBadButton;
unit.createCheckBox = createCheckBox;
unit.createComboBox = createComboBox;
unit.createDefaultButton = createDefaultButton;
unit.createIconButton = createIconButton;
unit.createMiddleWindow = createMiddleWindow;
unit.createMovablePopup = createMovablePopup;
unit.createSimpleButton = createSimpleButton;
unit.createSomething = createSomething;
unit.createSomething_create = createSomething_create;
unit.createWideMiddleWindow = createWideMiddleWindow;
unit.criticalQuestion = criticalQuestion;
unit.criticalQuestion_create = criticalQuestion_create;
unit.div = div;
unit.getSafeArea = getSafeArea;
unit.getSafeAreaBottom = getSafeAreaBottom;
unit.getSafeAreaTop = getSafeAreaTop;
unit.hasPopup = hasPopup;
unit.hasUnsavedChanges = hasUnsavedChanges;
unit.init = init;
unit.inputBox = inputBox;
unit.inputBoxRo = inputBoxRo;
unit.inputBox_create = inputBox_create;
unit.isMobileDevice = isMobileDevice;
unit.isNarrowScreen = isNarrowScreen;
unit.largeBox = largeBox;
unit.largeBoxRo = largeBoxRo;
unit.largeBox_create = largeBox_create;
unit.makeLink = makeLink;
unit.markUnsaved = markUnsaved;
unit.neutralQuestion = neutralQuestion;
unit.neutralQuestion_create = neutralQuestion_create;
unit.positionPopup = positionPopup;
unit.pushSemiModalPopup = pushSemiModalPopup;
unit.removePopups = removePopups;
unit.removeQuestions = removeQuestions;
unit.removeSnack = removeSnack;
unit.showContextMenu = showContextMenu;
unit.showContextMenuExact = showContextMenuExact;
unit.showErrorSnack = showErrorSnack;
unit.showGoodSnack = showGoodSnack;
unit.showUndoSnack = showUndoSnack;
unit.uploadFile = uploadFile;
unit.uploadFileWithButton = uploadFileWithButton;
unit.uploadFileWithButton_create = uploadFileWithButton_create;
unit.uploadFile_create = uploadFile_create;
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
Object.defineProperty(unit, 'tracing', {
    get: function () {
        return tracing;
    },
    set: function (newValue) {
        tracing = newValue;
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
return unit;
}