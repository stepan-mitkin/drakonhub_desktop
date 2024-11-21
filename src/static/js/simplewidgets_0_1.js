function simplewidgets_0_1() {
    var unit = {};
    var utils, html, tracing, gconfig;
    function createIconButton(image, callback, tooltip) {
        var className, element;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                className = 'generic-button simple-button icon-button';
                element = img(image, className);
                element.style.marginRight = '2px';
                registerEvent(element, 'click', callback);
                if (tooltip) {
                    addTooltip(element, tooltip);
                    __state = '6';
                } else {
                    __state = '6';
                }
                break;
            case '6':
                return element;
            default:
                return;
            }
        }
    }
    function onPlainItemClick(widget, evt, dataItem) {
        widget.current = dataItem.id;
        redrawPlainList(widget);
        widget.onItemClick(evt, dataItem);
        return;
    }
    function addTooltip(element, text) {
        var logic;
        logic = Tooltip_create(text);
        logic.run();
        registerEvent(element, 'mousemove', logic.onMove);
        registerEvent(element, 'mouseout', logic.onOut);
        return;
    }
    function Tooltip_create(text) {
        var timeoutId, left, top, evt, _var2;
        var me = {
            state: '2',
            type: 'Tooltip'
        };
        function _main_Tooltip(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '26';
                        return;
                    case '5':
                        me.state = '10';
                        return;
                    case '12':
                        me.state = '14';
                        return;
                    case '18':
                        clearTimeout(timeoutId);
                        me.state = '25';
                        break;
                    case '19':
                        timeoutId = setTimeout(me.onTimeout, 3000);
                        showTooltip(left, top, text);
                        me.state = '12';
                        break;
                    case '21':
                        left = evt.clientX;
                        top = evt.clientY;
                        me.state = '5';
                        break;
                    case '24':
                        clearTimeout(timeoutId);
                        me.state = '2';
                        break;
                    case '25':
                        hideTooltip();
                        me.state = '2';
                        break;
                    case '_item2':
                        _var2 = isSynthetic(evt);
                        if (_var2) {
                            me.state = '2';
                        } else {
                            left = evt.clientX;
                            top = evt.clientY;
                            timeoutId = setTimeout(me.onTimeout, 500);
                            me.state = '5';
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
                me.onTimeout = function () {
                    switch (me.state) {
                    case '10':
                        me.state = '19';
                        _main_Tooltip(__resolve, __reject);
                        break;
                    case '14':
                        me.state = '25';
                        _main_Tooltip(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.onMove = function (_evt_) {
                    evt = _evt_;
                    switch (me.state) {
                    case '10':
                        me.state = '21';
                        _main_Tooltip(__resolve, __reject);
                        break;
                    case '26':
                        me.state = '_item2';
                        _main_Tooltip(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.onOut = function () {
                    switch (me.state) {
                    case '10':
                        me.state = '24';
                        _main_Tooltip(__resolve, __reject);
                        break;
                    case '14':
                        me.state = '18';
                        _main_Tooltip(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_Tooltip(__resolve, __reject);
            });
        };
        return me;
    }
    function Tooltip(text) {
        var __obj = Tooltip_create(text);
        return __obj.run();
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
        return;
    }
    function hideTooltip() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (unit.tooltipElement) {
                    html.remove(unit.tooltipElement);
                    unit.tooltipElement = undefined;
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
    function createWideMiddleWindow() {
        var root, client, _var2;
        removeQuestions();
        unit.questionVisible = true;
        root = html.get('question-root');
        _var2 = div('question-back');
        html.add(root, _var2);
        client = div('question-body shadow', {
            padding: '10px',
            width: '1200px'
        });
        html.add(root, client);
        return client;
    }
    function removeQuestions() {
        var root;
        root = html.get('question-root');
        html.clear(root);
        unit.questionVisible = false;
        unit.unsaved = false;
        return;
    }
    function criticalQuestion_create(title, okText, cancelText) {
        var buttons, message, dialog, cancel, _var2;
        var me = {
            state: '2',
            type: 'criticalQuestion'
        };
        function _main_criticalQuestion(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        dialog = createMiddleWindow();
                        message = div({
                            'padding-bottom': '10px',
                            text: title
                        });
                        cancel = createSimpleButton(cancelText, me.no);
                        cancel.style.marginRight = '0px';
                        _var2 = createBadButton(okText, me.yes);
                        buttons = div({ 'text-align': 'right' }, _var2, cancel);
                        html.add(dialog, message);
                        html.add(dialog, buttons);
                        me.state = '12';
                        return;
                    case '13':
                        removeQuestions();
                        me.state = undefined;
                        __resolve(true);
                        return;
                    case '17':
                        removeQuestions();
                        me.state = undefined;
                        __resolve(false);
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
                me.yes = function () {
                    switch (me.state) {
                    case '12':
                        me.state = '13';
                        _main_criticalQuestion(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.no = function () {
                    switch (me.state) {
                    case '12':
                        me.state = '17';
                        _main_criticalQuestion(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_criticalQuestion(__resolve, __reject);
            });
        };
        return me;
    }
    function criticalQuestion(title, okText, cancelText) {
        var __obj = criticalQuestion_create(title, okText, cancelText);
        return __obj.run();
    }
    function neutralQuestion_create(title, okText, cancelText) {
        var buttons, message, dialog, cancel, _var2;
        var me = {
            state: '2',
            type: 'neutralQuestion'
        };
        function _main_neutralQuestion(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        dialog = createMiddleWindow();
                        message = div({
                            'padding-bottom': '10px',
                            text: title
                        });
                        cancel = createSimpleButton(cancelText, me.no);
                        cancel.style.marginRight = '0px';
                        _var2 = createDefaultButton(okText, me.yes);
                        buttons = div({ 'text-align': 'right' }, _var2, cancel);
                        html.add(dialog, message);
                        html.add(dialog, buttons);
                        me.state = '12';
                        return;
                    case '13':
                        removeQuestions();
                        me.state = undefined;
                        __resolve(true);
                        return;
                    case '17':
                        removeQuestions();
                        me.state = undefined;
                        __resolve(false);
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
                me.yes = function () {
                    switch (me.state) {
                    case '12':
                        me.state = '13';
                        _main_neutralQuestion(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.no = function () {
                    switch (me.state) {
                    case '12':
                        me.state = '17';
                        _main_neutralQuestion(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_neutralQuestion(__resolve, __reject);
            });
        };
        return me;
    }
    function neutralQuestion(title, okText, cancelText) {
        var __obj = neutralQuestion_create(title, okText, cancelText);
        return __obj.run();
    }
    function createMiddleWindow() {
        var root, client, _var2;
        removeQuestions();
        unit.questionVisible = true;
        root = html.get('question-root');
        _var2 = div('question-back');
        html.add(root, _var2);
        client = div('question-body shadow', { padding: '10px' });
        html.add(root, client);
        return client;
    }
    function uploadFile_create(prompt, accept, onStartedLoading) {
        var client, buttons, input, imp, reader, file, result, evt, fileData, _var2, _var3, _var4, _var5;
        var me = {
            state: '2',
            type: 'uploadFile'
        };
        function _main_uploadFile(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        result = undefined;
                        client = createMiddleWindow();
                        _var2 = div({
                            text: prompt,
                            padding: '5px'
                        });
                        html.add(client, _var2);
                        input = html.createElement('input', {
                            type: 'file',
                            accept: accept
                        }, [{
                                padding: '10px',
                                width: '100%'
                            }]);
                        html.add(client, input);
                        _var5 = tr('Import');
                        imp = createDefaultButton(_var5, me.imp);
                        imp.style.display = 'none';
                        _var4 = tr('Cancel');
                        _var3 = createSimpleButton(_var4, me.cancel);
                        buttons = div({
                            'text-align': 'right',
                            'padding-bottom': '5px'
                        }, imp, _var3);
                        html.add(client, buttons);
                        me.state = '19';
                        break;
                    case '17':
                        me.state = undefined;
                        __resolve(result);
                        return;
                    case '18':
                        me.state = '28';
                        return;
                    case '19':
                        registerEvent(input, 'change', me.chosen);
                        me.state = '23';
                        return;
                    case '24':
                        removeQuestions();
                        me.state = '17';
                        break;
                    case '25':
                        imp.style.display = 'inline-block';
                        file = evt.target.files[0];
                        me.state = '18';
                        break;
                    case '29':
                        removeQuestions();
                        me.state = '17';
                        break;
                    case '31':
                        reader = new FileReader();
                        registerEvent(reader, 'load', function (evt) {
                            me.loaded(evt.target.result);
                        });
                        reader.readAsText(file);
                        me.state = '35';
                        return;
                    case '32':
                        removeQuestions();
                        onStartedLoading();
                        me.state = '31';
                        break;
                    case '168':
                        result = {
                            file: file,
                            data: fileData
                        };
                        me.state = '17';
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
                me.chosen = function (_evt_) {
                    evt = _evt_;
                    switch (me.state) {
                    case '23':
                        me.state = '25';
                        _main_uploadFile(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '23':
                        me.state = '24';
                        _main_uploadFile(__resolve, __reject);
                        break;
                    case '28':
                        me.state = '29';
                        _main_uploadFile(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.imp = function () {
                    switch (me.state) {
                    case '28':
                        me.state = '32';
                        _main_uploadFile(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.loaded = function (_fileData_) {
                    fileData = _fileData_;
                    switch (me.state) {
                    case '35':
                        me.state = '168';
                        _main_uploadFile(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_uploadFile(__resolve, __reject);
            });
        };
        return me;
    }
    function uploadFile(prompt, accept, onStartedLoading) {
        var __obj = uploadFile_create(prompt, accept, onStartedLoading);
        return __obj.run();
    }
    function moveMovable(moverLogic, evt) {
        var dx, dy, left, top;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.pointerType === 'touch') {
                    __state = '1';
                } else {
                    if (moverLogic.active) {
                        dx = evt.clientX - moverLogic.startX;
                        dy = evt.clientY - moverLogic.startY;
                        left = moverLogic.startLeft + dx;
                        top = moverLogic.startTop + dy;
                        positionPopup(moverLogic.popup, left, top);
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                }
                break;
            default:
                return;
            }
        }
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
        return;
    }
    function onMovableBarMouseDown(moverLogic, popup, barMover, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.pointerType === 'touch') {
                    __state = '1';
                } else {
                    evt.target.setPointerCapture(evt.pointerId);
                    evt.preventDefault();
                    evt.stopPropagation();
                    startMoveMovable(moverLogic, popup, barMover, evt);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
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
        return;
    }
    function onMovableBarTouchStart(moverLogic, popup, barMover, evt) {
        var evt2;
        evt2 = {
            clientX: evt.touches[0].clientX,
            clientY: evt.touches[0].clientY
        };
        evt.preventDefault();
        startMoveMovable(moverLogic, popup, barMover, evt2);
        return;
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
        return;
    }
    function MoverLogic_onMouseMove(self, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                evt.preventDefault();
                if (evt.pointerType === 'touch') {
                    __state = '1';
                } else {
                    moveMovable(self, evt);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function MoverLogic_onUp(self, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                evt.preventDefault();
                if (self.active) {
                    setIdleMoverStyle(self.mover);
                    self.active = false;
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
    function MoverLogic_onTouchMove(self, evt) {
        var evt2;
        evt.preventDefault();
        evt2 = {
            clientX: evt.touches[0].clientX,
            clientY: evt.touches[0].clientY
        };
        moveMovable(self, evt2);
        return;
    }
    function createMovablePopup(header, left, top, path, hardcore) {
        var popup, bar, client, close, bucket, barMover, moverLogic, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                popup = div('shadow', { background: unit.darkColor });
                popup.style.border = 'solid 1px ' + unit.darkColor;
                if (hardcore) {
                    __state = '3';
                } else {
                    _var2 = isMobileDevice();
                    if (_var2) {
                        __state = '3';
                    } else {
                        pushPopup(popup, left, top);
                        __state = '5';
                    }
                }
                break;
            case '3':
                pushSemiModalPopup(popup, left, top, undefined, hardcore);
                __state = '5';
                break;
            case '5':
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
                    __state = '6';
                } else {
                    __state = '6';
                }
                break;
            case '6':
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
                __state = '19';
                break;
            case '18':
                return bucket;
            case '19':
                moverLogic = MoverLogic();
                registerEvent(barMover, 'pointerdown', function (evt) {
                    onMovableBarMouseDown(moverLogic, popup, barMover, evt);
                });
                registerEvent(barMover, 'pointermove', moverLogic.onMouseMove);
                registerEvent(barMover, 'pointerup', moverLogic.onUp);
                registerEvent(barMover, 'pointerout', moverLogic.onUp);
                __state = '20';
                break;
            case '20':
                registerEvent(barMover, 'touchstart', function (evt) {
                    onMovableBarTouchStart(moverLogic, popup, barMover, evt);
                });
                registerEvent(barMover, 'touchmove', moverLogic.onTouchMove);
                registerEvent(barMover, 'touchend', moverLogic.onUp);
                registerEvent(barMover, 'touchcancel', moverLogic.onUp);
                __state = '18';
                break;
            default:
                return;
            }
        }
    }
    function hasPopup() {
        return unit.popups.length > 0;
    }
    function closePopup() {
        var top;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (unit.popups.length === 0) {
                    __state = '1';
                } else {
                    top = unit.popups.length - 1;
                    removePopupsAbove(top - 1);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function popPopup(skipCancel) {
        var popup;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (unit.popups.length === 0) {
                    __state = '1';
                } else {
                    popup = unit.popups.pop();
                    html.remove(popup.element);
                    if (popup.onCanceled) {
                        if (skipCancel) {
                            __state = '1';
                        } else {
                            popup.onCanceled();
                            __state = '1';
                        }
                    } else {
                        __state = '1';
                    }
                }
                break;
            default:
                return;
            }
        }
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
        return;
    }
    function popupOnGlobalClick(evt) {
        var hitPopup;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.ctrlKey) {
                    __state = '1';
                } else {
                    hitPopup = findHitPopup(evt);
                    removePopupsAbove(hitPopup);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function positionPopup(element, x, y) {
        var rect;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                x = Math.floor(x);
                y = Math.floor(y);
                element.style.display = 'inline-block';
                element.style.position = 'fixed';
                element.style.left = x + 'px';
                element.style.top = y + 'px';
                __state = '16';
                break;
            case '15':
                element.style.left = x + 'px';
                element.style.top = y + 'px';
                return;
            case '16':
                rect = element.getBoundingClientRect();
                if (rect.right >= window.innerWidth) {
                    x = window.innerWidth - rect.width;
                    __state = '20';
                } else {
                    __state = '20';
                }
                break;
            case '20':
                if (x < 0) {
                    x = 0;
                    __state = '22';
                } else {
                    __state = '22';
                }
                break;
            case '22':
                if (rect.bottom >= window.innerHeight) {
                    y = window.innerHeight - rect.height;
                    __state = '24';
                } else {
                    __state = '24';
                }
                break;
            case '24':
                if (y < 0) {
                    y = 0;
                    __state = '15';
                } else {
                    __state = '15';
                }
                break;
            default:
                return;
            }
        }
    }
    function removePopups() {
        removePopupsAbove(-1);
        return;
    }
    function getPopupIndex(element) {
        var popup, i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                i = 0;
                __state = '5';
                break;
            case '5':
                if (i < unit.popups.length) {
                    popup = unit.popups[i].element;
                    if (popup === element) {
                        return i;
                    } else {
                        i++;
                        __state = '5';
                    }
                } else {
                    return -1;
                }
                break;
            default:
                return;
            }
        }
    }
    function findHitPopup(evt) {
        var current, index;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                current = evt.target;
                __state = '9';
                break;
            case '6':
                return index;
            case '9':
                index = getPopupIndex(current);
                if (index === -1) {
                    current = current.parentElement;
                    if (current) {
                        __state = '9';
                    } else {
                        __state = '6';
                    }
                } else {
                    __state = '6';
                }
                break;
            default:
                return;
            }
        }
    }
    function removePopupsAbove(index) {
        var popup, i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                i = unit.popups.length - 1;
                __state = '5';
                break;
            case '4':
                i--;
                __state = '5';
                break;
            case '5':
                if (i > index) {
                    popup = unit.popups.pop();
                    html.remove(popup.element);
                    if (popup.onCanceled) {
                        popup.onCanceled();
                        __state = '4';
                    } else {
                        __state = '4';
                    }
                } else {
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function pushSemiModalPopup(element, x, y, onCanceled, hardcore) {
        var root, start, container, back, zIndex, zIndexBack, ordinal;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
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
                    __state = '1';
                } else {
                    registerEvent(back, 'mousedown', function () {
                        removePopupsAbove(ordinal - 1);
                    });
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function initPopups() {
        unit.popups = [];
        registerEvent(window.document, 'click', popupOnGlobalClick, true);
        return;
    }
    function DummyWidget_init(self, config) {
        self.background = config.background;
        return;
    }
    function DummyWidget_onShow(self) {
        tracing.trace('DummyWidget.onShow ' + self.background);
        return;
    }
    function DummyWidget_setBackground(self, background) {
        self.background = background;
        setBackgroundColor(self);
        return;
    }
    function DummyWidget_onHide(self) {
        tracing.trace('DummyWidget.onHide ' + self.background);
        return;
    }
    function setBackgroundColor(widget) {
        widget.container.style.background = widget.background;
        return;
    }
    function DummyWidget_redraw(self, container) {
        setBackgroundColor(self);
        return;
    }
    function createComboBox(options, value, onChange, width) {
        var container, valueText, className, cbOptions, _var2, _var3, item, _var4;
        var __state = '7';
        while (true) {
            switch (__state) {
            case '2':
                width = width || '100%';
                className = 'generic-button simple-button';
                container = div(className, {
                    width: width,
                    'line-height': '30px',
                    'position': 'relative'
                });
                html.addText(container, valueText);
                _var4 = createArrowDownIcon({});
                html.add(container, _var4);
                cbOptions = {
                    container: container,
                    options: options,
                    value: value,
                    onChange: onChange
                };
                registerEvent(container, 'click', function () {
                    buildComboPopup(cbOptions);
                });
                __state = '5';
                break;
            case '5':
                return container;
            case '7':
                _var2 = options;
                _var3 = 0;
                __state = '11';
                break;
            case '11':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    if (item.id === value) {
                        valueText = item.text;
                        __state = '2';
                    } else {
                        _var3++;
                        __state = '11';
                    }
                } else {
                    throw new Error('Bad combobox value: ' + value);
                }
                break;
            default:
                return;
            }
        }
    }
    function buildComboPopup(cbOptions) {
        var items, rect, _var2;
        items = cbOptions.options.map(function (item) {
            _var2 = makeComboItem(item, cbOptions.onChange);
            return _var2;
        });
        rect = cbOptions.container.getBoundingClientRect();
        showContextMenu(rect.left, rect.bottom, items, {
            shift: 0,
            width: rect.width + 'px',
            modal: true
        });
        return;
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
    function createArrowDownIcon() {
        var canvas, style, ctx, left, top, right, bottom, middle, size, padding;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
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
                __state = '7';
                break;
            case '6':
                return canvas;
            case '7':
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
                __state = '6';
                break;
            default:
                return;
            }
        }
    }
    function showErrorSnack(text) {
        showSnackCore('snack-field-back-bad', text);
        return;
    }
    function showSnackCore(style, text) {
        var snackDiv, root, _var2, _var3, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                removeSnack();
                __state = '5';
                break;
            case '4':
                return;
            case '5':
                root = html.get('snack-root');
                _var2 = div(style);
                _var4 = div('middle-v', {
                    text: text,
                    'padding-left': '10px'
                });
                _var3 = div('snack-field-text', _var4);
                snackDiv = div('snack-container shadow', _var2, _var3);
                html.add(root, snackDiv);
                _var5 = isNarrowScreen();
                if (_var5) {
                    snackDiv.style.left = '0px';
                    snackDiv.style.top = '0px';
                    snackDiv.style.maxWidth = '100vw';
                    __state = '7';
                } else {
                    __state = '7';
                }
                break;
            case '7':
                unit.snack = snackProc_create(snackDiv);
                unit.snack.run();
                __state = '4';
                break;
            default:
                return;
            }
        }
    }
    function snackProc_create(snackDiv) {
        var me = {
            state: '2',
            type: 'snackProc'
        };
        function _main_snackProc(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '3';
                        setTimeout(function () {
                            _main_snackProc(__resolve, __reject);
                        }, 2000);
                        return;
                    case '3':
                        snackDiv.style.opacity = 0;
                        me.state = '6';
                        setTimeout(function () {
                            _main_snackProc(__resolve, __reject);
                        }, 500);
                        return;
                    case '6':
                        removeSnack();
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
                _main_snackProc(__resolve, __reject);
            });
        };
        return me;
    }
    function snackProc(snackDiv) {
        var __obj = snackProc_create(snackDiv);
        return __obj.run();
    }
    function snackProcLong_create(snackDiv) {
        var me = {
            state: '2',
            type: 'snackProcLong'
        };
        function _main_snackProcLong(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '3';
                        setTimeout(function () {
                            _main_snackProcLong(__resolve, __reject);
                        }, 5000);
                        return;
                    case '3':
                        snackDiv.style.opacity = 0;
                        me.state = '6';
                        setTimeout(function () {
                            _main_snackProcLong(__resolve, __reject);
                        }, 500);
                        return;
                    case '6':
                        removeSnack();
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
                _main_snackProcLong(__resolve, __reject);
            });
        };
        return me;
    }
    function snackProcLong(snackDiv) {
        var __obj = snackProcLong_create(snackDiv);
        return __obj.run();
    }
    function removeSnack() {
        var container;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.snack) {
                    unit.snack.state = undefined;
                    unit.snack = undefined;
                    __state = '3';
                } else {
                    __state = '3';
                }
                break;
            case '3':
                container = html.get('snack-root');
                html.clear(container);
                return;
            default:
                return;
            }
        }
    }
    function showGoodSnack(text) {
        showSnackCore('snack-field-back-good', text);
        return;
    }
    function showUndoSnack(text, action) {
        var snackDiv, root, undoButton, wrapped, _var2, _var3, _var4, _var5, _var6;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                removeSnack();
                __state = '5';
                break;
            case '4':
                return;
            case '5':
                root = html.get('snack-root');
                wrapped = function () {
                    removeSnack();
                    action();
                };
                _var5 = tr('Undo');
                undoButton = createSimpleButton(_var5, wrapped);
                undoButton.style.position = 'absolute';
                undoButton.style.right = '10px';
                undoButton.style.bottom = '10px';
                _var2 = div('snack-field-back-warning');
                _var4 = div('middle-v', {
                    text: text,
                    'padding-left': '10px'
                });
                _var3 = div('snack-field-text', _var4, undoButton);
                snackDiv = div('snack-container shadow', _var2, _var3);
                html.add(root, snackDiv);
                _var6 = isNarrowScreen();
                if (_var6) {
                    snackDiv.style.left = '0px';
                    snackDiv.style.top = '0px';
                    snackDiv.style.maxWidth = '100vw';
                    __state = '7';
                } else {
                    __state = '7';
                }
                break;
            case '7':
                unit.snack = snackProcLong_create(snackDiv);
                unit.snack.run();
                __state = '4';
                break;
            default:
                return;
            }
        }
    }
    function showContextMenu(x, y, items, options) {
        showContextMenuExact(x + 5, y + 5, items, options);
        return;
    }
    function showContextMenuExact(x, y, items, options) {
        var shift, menu, movable, mv, _var2, _var3, item, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                removePopups();
                if (options) {
                    if (options.movable) {
                        mv = createMovablePopup('', x, y, gconfig.imagePath);
                        menu = mv.client;
                        mv.popup.style.minWidth = '200px';
                        mv.client.style.padding = '10px';
                        movable = true;
                        __state = '26';
                    } else {
                        __state = '29';
                    }
                } else {
                    __state = '29';
                }
                break;
            case '5':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    _var4 = makeContextMenuItem(item);
                    html.add(menu, _var4);
                    _var3++;
                    __state = '5';
                } else {
                    if (movable) {
                        positionPopup(mv.popup, x, y);
                        __state = '1';
                    } else {
                        if (options) {
                            if (options.modal) {
                                pushSemiModalPopup(menu, x, y);
                                __state = '1';
                            } else {
                                __state = '23';
                            }
                        } else {
                            __state = '23';
                        }
                    }
                }
                break;
            case '23':
                pushPopup(menu, x, y);
                __state = '1';
                break;
            case '26':
                registerEvent(menu, 'contextmenu', function (evt) {
                    evt.preventDefault();
                    return false;
                });
                if (options) {
                    if ('shift' in options) {
                        shift = options.shift;
                        if ('width' in options) {
                            menu.style.width = options.width;
                            __state = '_item2';
                        } else {
                            __state = '_item2';
                        }
                    } else {
                        __state = '_item2';
                    }
                } else {
                    __state = '_item2';
                }
                break;
            case '29':
                menu = div('context-menu shadow');
                movable = false;
                __state = '26';
                break;
            case '_item2':
                _var2 = items;
                _var3 = 0;
                __state = '5';
                break;
            default:
                return;
            }
        }
    }
    function makeContextMenuItem(item) {
        var line, callback, _var2, _var3, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (item.type === 'separator') {
                    _var4 = div('context-menu-separator');
                    return _var4;
                } else {
                    line = div('context-menu-item');
                    if (item.icon) {
                        _var2 = html.createElement('img', {
                            draggable: false,
                            src: item.icon
                        }, ['context-menu-icon-passive']);
                        html.add(line, _var2);
                        __state = '_item3';
                    } else {
                        __state = '_item3';
                    }
                }
                break;
            case '_item3':
                _var3 = div('context-menu-item-text', { text: item.text });
                html.add(line, _var3);
                callback = function (evt) {
                    removePopups();
                    _var5 = item.action(evt);
                    return _var5;
                };
                registerEvent(line, 'click', callback);
                return line;
            default:
                return;
            }
        }
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
    function registerEvent(element, eventName, action, options) {
        tracing.registerEvent(element, eventName, action, options);
        return;
    }
    function div() {
        var args, properties, _var2;
        args = Array.prototype.slice.call(arguments);
        properties = {};
        _var2 = html.createElement('div', properties, args);
        return _var2;
    }
    function onUnhandledError(ex) {
        var _var2;
        console.log('onUnhandledError');
        console.error(ex);
        try {
            _var2 = tr('Произошла ошибка');
            showErrorSnack(_var2 + ': ' + ex.message);
        } catch (ex) {
        }
        return;
    }
    function disableContextMenu(element) {
        element.addEventListener('contextmenu', noContext);
        return;
    }
    function createDiv(parent, className) {
        var element;
        element = div(className);
        html.add(parent, element);
        return element;
    }
    function makeLink(url, text, newTab) {
        var link;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                link = html.createElement('a', { href: url }, [{ text: text }]);
                if (newTab) {
                    link.target = '_blank';
                    __state = '4';
                } else {
                    __state = '4';
                }
                break;
            case '4':
                return link;
            default:
                return;
            }
        }
    }
    function tr(text) {
        var _var2;
        if (unit.tr) {
            _var2 = unit.tr(text);
            return _var2;
        } else {
            return text;
        }
    }
    function noContext(evt) {
        evt.preventDefault();
        return false;
    }
    function setTimeout(action, delay) {
        var _var2;
        _var2 = tracing.setTimeout(action, delay);
        return _var2;
    }
    function isSynthetic(evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (evt.sourceCapabilities) {
                    if (evt.sourceCapabilities.firesTouchEvents) {
                        return true;
                    } else {
                        __state = '6';
                    }
                } else {
                    __state = '6';
                }
                break;
            case '6':
                return false;
            default:
                return;
            }
        }
    }
    function createCheckBox(container, name, value, onChange) {
        var label, check;
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
        return;
    }
    function createSimpleButton(text, action, color, background) {
        var button;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                button = div('generic-button simple-button', { text: text });
                if (color) {
                    button.style.color = color;
                    __state = '9';
                } else {
                    __state = '9';
                }
                break;
            case '6':
                registerEvent(button, 'click', action);
                return button;
            case '9':
                if (background) {
                    button.style.background = background;
                    __state = '6';
                } else {
                    __state = '6';
                }
                break;
            default:
                return;
            }
        }
    }
    function createBadButton(text, action) {
        var button;
        button = div('generic-button bad-button', { text: text });
        registerEvent(button, 'click', action);
        return button;
    }
    function createDefaultButton(text, action) {
        var button;
        button = div('generic-button default-button', { text: text });
        registerEvent(button, 'click', action);
        return button;
    }
    function LoadingScreen_redraw(self, container) {
        var label, _var2;
        _var2 = tr('Loading...');
        label = div('middle', { text: _var2 });
        html.add(container, label);
        return;
    }
    function createCommonStyles() {
        var size, font, header;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                size = gconfig.fontSize;
                font = size + 'px ' + gconfig.fontFamily;
                header = size + 4 + 'px ' + gconfig.fontFamily;
                html.addClass('textarea', 'resize: none');
                html.addClass('body', 'font: ' + font);
                html.addClass('.title', 'font: ' + header, 'margin-top: 10px');
                html.addClass('.shadow', 'box-shadow: 0px 0px 7px 2px rgba(0,0,0,0.27)');
                html.addClass('.full-screen', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh');
                html.addClass('input:not([type=checkbox]), textarea', 'font: ' + font, 'width: 100%', 'padding: 5px');
                html.addClass('.screen-container', 'display:inline-block', 'width:100%', 'height:100%');
                html.addClass('.middle', 'display: inline-block', 'position: absolute', 'left: 50%', 'top: 50%', 'transform: translate(-50%, -50%)');
                html.addClass('.middle-v', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 50%', 'transform: translateY(-50%)');
                html.addClass('.middle-h', 'display: inline-block', 'position: absolute', 'left: 50%', 'top: 0px', 'transform: translateX(-50%)');
                html.addClass('.header1', 'font-weight: bold', 'font-size: ' + (size + 4) + 'px', 'text-align: center');
                __state = '86';
                break;
            case '54':
                return;
            case '56':
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
                __state = '67';
                break;
            case '67':
                html.addClass('.question-back', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh', 'background: rgba(0, 0, 0, 0.2)', 'z-index: 19');
                html.addClass('.question-body', 'display: inline-block', 'position: fixed', 'left: 50%', 'transform: translateX(-50%)', 'top: 0px', 'max-width: 100vw', 'width: 400px', 'background: white', 'z-index: 20', 'overflow-y: auto', 'max-height: 100vh');
                __state = '70';
                break;
            case '70':
                html.addClass('.context-menu-item', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'white-space: nowrap');
                html.addClass('.context-menu-item:hover', 'background:#9fd694');
                html.addClass('.context-menu', 'display: inline-block', 'position: absolute', 'background: white', 'max-width: 100vw', 'min-width: 200px', 'border: solid 1px #a0a0a0', 'padding: 10px');
                html.addClass('.context-menu-separator', 'background: #a0a0a0', 'height: 1px', 'margin-top:5px', 'margin-bottom:5px');
                html.addClass('.context-menu-item-text', 'display: inline-block', 'vertical-align: bottom', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
                html.addClass('img.context-menu-icon-passive', 'display: inline-block', 'vertical-align: bottom', 'width: 30px', 'height: 30px');
                __state = '73';
                break;
            case '73':
                html.addClass('.snack-container', 'display: inline-block', 'position: fixed', 'left: 20px', 'top: 20px', 'width: 400px', 'max-width: calc(100vw - 20px)', 'height: 80px', 'background: white', 'z-index: 3500', 'border: solid 1px #a0a0a0', 'transition: opacity 500ms');
                html.addClass('.snack-field-back-bad', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: darkred');
                html.addClass('.snack-field-back-warning', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: darkgrey');
                html.addClass('.snack-field-back-good', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: green');
                html.addClass('.snack-field-text', 'display: inline-block', 'position: absolute', 'left: 30px', 'top: 0px', 'width: calc(100% - 30px)', 'height: 80px');
                __state = '54';
                break;
            case '82':
                html.addClass('.question-body ol', 'list-style-type: decimal', 'margin-left:15px');
                html.addClass('.question-body ul', 'list-style-type: disc', 'margin-left:17px');
                __state = '56';
                break;
            case '86':
                html.addClass('.grid-item', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'white-space: nowrap');
                html.addClass('.grid-item-text-cut', 'color: #c0c0c0');
                html.addClass('.grid-item-active', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'background:#9fd694', 'white-space: nowrap');
                html.addClass('.grid-item-selected', 'display:block', 'line-height:30px', 'margin: 0px', 'user-select: none', 'cursor: default', 'background:darkgreen', 'white-space: nowrap', 'color:white');
                html.addClass('.grid-item:hover, .grid-item-active:hover', 'background:#9fd694');
                html.addClass('.grid-item-text', 'display: inline-block', 'vertical-align: bottom', 'width: calc(100% - 30px)', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
                html.addClass('.grid-item-text2', 'display: inline-block', 'vertical-align: bottom', 'width: calc(100% - 60px)', 'white-space: nowrap', 'overflow: hidden', 'padding-left: 5px');
                html.addClass('.grid-item-long', 'display: inline-block', 'vertical-align: bottom', 'white-space: nowrap', 'padding-left: 5px');
                html.addClass('.grid-item input[type="checkbox"]', 'display: inline-block', 'vertical-align: bottom', 'width: 24px', 'height: 24px', 'margin: 3px');
                __state = '82';
                break;
            default:
                return;
            }
        }
    }
    function isMobileDevice() {
        var _var2, _var3, _var4, _var5, _var6, _var7, _var8;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = navigator.userAgent.match(/Android/i);
                if (_var2) {
                    __state = '5';
                } else {
                    _var3 = navigator.userAgent.match(/webOS/i);
                    if (_var3) {
                        __state = '5';
                    } else {
                        _var4 = navigator.userAgent.match(/iPhone/i);
                        if (_var4) {
                            __state = '5';
                        } else {
                            _var5 = navigator.userAgent.match(/iPad/i);
                            if (_var5) {
                                __state = '5';
                            } else {
                                _var6 = navigator.userAgent.match(/iPod/i);
                                if (_var6) {
                                    __state = '5';
                                } else {
                                    _var7 = navigator.userAgent.match(/BlackBerry/i);
                                    if (_var7) {
                                        __state = '5';
                                    } else {
                                        _var8 = navigator.userAgent.match(/Windows Phone/i);
                                        if (_var8) {
                                            __state = '5';
                                        } else {
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case '5':
                return true;
            default:
                return;
            }
        }
    }
    function isNarrowScreen() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (window.innerWidth <= 600) {
                    __state = '3';
                } else {
                    if (window.innerHeight <= 400) {
                        __state = '3';
                    } else {
                        return false;
                    }
                }
                break;
            case '3':
                return true;
            default:
                return;
            }
        }
    }
    function init(tr) {
        unit.darkColor = 'green';
        createCommonStyles();
        initPopups();
        unit.tr = tr;
        unit.unsaved = false;
        return;
    }
    function inputBox_create(x, y, title, text, check) {
        var input, ok, cancel, bottom, dialog, error, errorMessage, shift, x2, y2, form, _var2, _var3, _var4, _var5;
        var me = {
            state: '2',
            type: 'inputBox'
        };
        function _main_inputBox(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        input = html.createElement('input', { type: 'text' });
                        _var2 = tr('Accept');
                        ok = createDefaultButton(_var2, me.confirm);
                        _var3 = tr('Cancel');
                        cancel = createSimpleButton(_var3, removePopups);
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
                        me.state = '32';
                        break;
                    case '20':
                        removePopups();
                        me.state = undefined;
                        __resolve(text);
                        return;
                    case '21':
                        me.state = '43';
                        break;
                    case '22':
                        _var5 = isMobileDevice();
                        if (_var5) {
                            x2 = 0;
                            y2 = 0;
                            me.state = '28';
                        } else {
                            shift = 10;
                            x2 = x + shift;
                            y2 = y + shift;
                            me.state = '28';
                        }
                        break;
                    case '28':
                        removePopups();
                        pushSemiModalPopup(dialog, x2, y2, me.cancel);
                        input.value = text;
                        input.setSelectionRange(0, input.value.length);
                        input.focus();
                        me.state = '21';
                        break;
                    case '32':
                        form = html.createElement('form', { autocomplete: 'off' });
                        registerEvent(form, 'submit', function (evt) {
                            evt.preventDefault();
                        });
                        html.add(form, input);
                        registerEvent(input, 'keydown', function (evt) {
                            onInputKeyDown(me, evt);
                        });
                        _var4 = div({
                            text: title,
                            'padding-bottom': '5px'
                        });
                        dialog = div('shadow', {
                            width: '400px',
                            'max-width': '100vw',
                            padding: '5px',
                            background: 'white',
                            border: 'solid 1px #a0a0a0'
                        }, _var4, form, error, bottom);
                        me.state = '22';
                        break;
                    case '43':
                        me.state = '49';
                        return;
                    case '51':
                        text = input.value.trim();
                        errorMessage = checkInputText(text, check);
                        if (errorMessage) {
                            error.style.display = 'block';
                            html.setText(error, errorMessage);
                            me.state = '43';
                            setTimeout(function () {
                                _main_inputBox(__resolve, __reject);
                            }, 1000);
                            return;
                        } else {
                            me.state = '20';
                        }
                        break;
                    case '63':
                        text = undefined;
                        me.state = '20';
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
                me.cancel = function () {
                    switch (me.state) {
                    case '49':
                        me.state = '63';
                        _main_inputBox(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.confirm = function () {
                    switch (me.state) {
                    case '49':
                        me.state = '51';
                        _main_inputBox(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_inputBox(__resolve, __reject);
            });
        };
        return me;
    }
    function inputBox(x, y, title, text, check) {
        var __obj = inputBox_create(x, y, title, text, check);
        return __obj.run();
    }
    function onLargeInputKeyDown(self, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.key === 'Enter') {
                    if (evt.ctrlKey) {
                        evt.preventDefault();
                        self.confirm();
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                } else {
                    if (evt.key === 'Escape') {
                        evt.preventDefault();
                        self.cancel();
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function checkInputText(text, check) {
        var _var2;
        if (check) {
            _var2 = check(text);
            return _var2;
        } else {
            return undefined;
        }
    }
    function onInputKeyDown(self, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.key === 'Enter') {
                    self.confirm();
                    __state = '1';
                } else {
                    if (evt.key === 'Escape') {
                        self.cancel();
                        __state = '1';
                    } else {
                        __state = '1';
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function largeBox_create(x, y, title, text, check) {
        var input, ok, cancel, bottom, dialog, error, errorMessage, shift, x2, y2, _var2, _var3, _var4;
        var me = {
            state: '2',
            type: 'largeBox'
        };
        function _main_largeBox(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        input = html.createElement('textarea', {}, [{ height: '300px' }]);
                        _var2 = tr('Accept');
                        ok = createDefaultButton(_var2, me.confirm);
                        _var3 = tr('Cancel');
                        cancel = createSimpleButton(_var3, removePopups);
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
                        me.state = '32';
                        break;
                    case '20':
                        removePopups();
                        me.state = undefined;
                        __resolve(text);
                        return;
                    case '21':
                        me.state = '43';
                        break;
                    case '22':
                        shift = 10;
                        x2 = x + shift;
                        y2 = y + shift;
                        removePopups();
                        pushSemiModalPopup(dialog, x2, y2);
                        input.value = text;
                        input.setSelectionRange(0, input.value.length);
                        input.focus();
                        me.state = '21';
                        break;
                    case '32':
                        registerEvent(input, 'keydown', function () {
                            onLargeInputKeyDown(me, evt);
                        });
                        _var4 = div({
                            text: title,
                            'padding-bottom': '5px'
                        });
                        dialog = div('shadow', {
                            width: '400px',
                            'max-width': '100vw',
                            padding: '5px',
                            background: 'white',
                            border: 'solid 1px #a0a0a0'
                        }, _var4, input, bottom);
                        me.state = '22';
                        break;
                    case '43':
                        me.state = '49';
                        return;
                    case '51':
                        text = input.value.trim();
                        errorMessage = checkInputText(text, check);
                        if (errorMessage) {
                            error.style.display = 'block';
                            html.setText(error, errorMessage);
                            me.state = '43';
                        } else {
                            me.state = '20';
                        }
                        break;
                    case '63':
                        text = undefined;
                        me.state = '20';
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
                me.cancel = function () {
                    switch (me.state) {
                    case '49':
                        me.state = '63';
                        _main_largeBox(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.confirm = function () {
                    switch (me.state) {
                    case '49':
                        me.state = '51';
                        _main_largeBox(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_largeBox(__resolve, __reject);
            });
        };
        return me;
    }
    function largeBox(x, y, title, text, check) {
        var __obj = largeBox_create(x, y, title, text, check);
        return __obj.run();
    }
    function inputBoxRo_create(x, y, title, text) {
        var input, cancel, bottom, dialog, shift, x2, y2, _var2, _var3, _var4;
        var me = {
            state: '2',
            type: 'inputBoxRo'
        };
        function _main_inputBoxRo(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        input = html.createElement('input', { type: 'text' });
                        input.readOnly = true;
                        _var2 = tr('Close');
                        cancel = createSimpleButton(_var2, removePopups);
                        cancel.style.margin = '0px';
                        bottom = div({
                            'padding-top': '5px',
                            'text-align': 'right'
                        }, cancel);
                        me.state = '32';
                        break;
                    case '20':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '22':
                        _var4 = isMobileDevice();
                        if (_var4) {
                            x2 = 0;
                            y2 = 0;
                            me.state = '28';
                        } else {
                            shift = 10;
                            x2 = x + shift;
                            y2 = y + shift;
                            me.state = '28';
                        }
                        break;
                    case '28':
                        removePopups();
                        pushSemiModalPopup(dialog, x2, y2);
                        input.value = text;
                        input.setSelectionRange(0, input.value.length);
                        input.focus();
                        me.state = '20';
                        break;
                    case '32':
                        _var3 = div({
                            text: title,
                            'padding-bottom': '5px'
                        });
                        dialog = div('shadow', {
                            width: '400px',
                            'max-width': '100vw',
                            padding: '5px',
                            background: 'white',
                            border: 'solid 1px #a0a0a0'
                        }, _var3, input, bottom);
                        me.state = '22';
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
                _main_inputBoxRo(__resolve, __reject);
            });
        };
        return me;
    }
    function inputBoxRo(x, y, title, text) {
        var __obj = inputBoxRo_create(x, y, title, text);
        return __obj.run();
    }
    function largeBoxRo_create(x, y, title, text) {
        var input, cancel, bottom, dialog, shift, x2, y2, _var2, _var3;
        var me = {
            state: '2',
            type: 'largeBoxRo'
        };
        function _main_largeBoxRo(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        input = html.createElement('textarea', {}, [{ height: '300px' }]);
                        input.readOnly = true;
                        _var2 = tr('Close');
                        cancel = createSimpleButton(_var2, removePopups);
                        cancel.style.margin = '0px';
                        bottom = div({
                            'padding-top': '5px',
                            'text-align': 'right'
                        }, cancel);
                        me.state = '32';
                        break;
                    case '20':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '22':
                        shift = 10;
                        x2 = x + shift;
                        y2 = y + shift;
                        removePopups();
                        pushSemiModalPopup(dialog, x2, y2);
                        input.value = text;
                        input.setSelectionRange(0, input.value.length);
                        input.focus();
                        me.state = '20';
                        break;
                    case '32':
                        _var3 = div({
                            text: title,
                            'padding-bottom': '5px'
                        });
                        dialog = div('shadow', {
                            width: '400px',
                            'max-width': '100vw',
                            padding: '5px',
                            background: 'white',
                            border: 'solid 1px #a0a0a0'
                        }, _var3, input, bottom);
                        me.state = '22';
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
                _main_largeBoxRo(__resolve, __reject);
            });
        };
        return me;
    }
    function largeBoxRo(x, y, title, text) {
        var __obj = largeBoxRo_create(x, y, title, text);
        return __obj.run();
    }
    function PlainList_redraw(self, container) {
        self.container = container;
        container.style.overflowY = 'auto';
        redrawPlainList(self);
        return;
    }
    function redrawPlainList(widget) {
        var _var2, _var3, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                html.clear(widget.container);
                _var2 = widget.items;
                _var3 = 0;
                __state = '5';
                break;
            case '5':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    createPlainListItem(widget, item);
                    _var3++;
                    __state = '5';
                } else {
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function createPlainListItem(widget, dataItem) {
        var itemClass, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widget.current === dataItem.id) {
                    itemClass = 'grid-item-active';
                    __state = '7';
                } else {
                    itemClass = 'grid-item';
                    __state = '7';
                }
                break;
            case '7':
                item = div(itemClass, {
                    text: dataItem.text,
                    padding: '10px'
                });
                if (widget.current === dataItem.id) {
                    __state = '10';
                } else {
                    item.style.cursor = 'pointer';
                    registerEvent(item, 'click', function (evt) {
                        onPlainItemClick(widget, evt, dataItem);
                    });
                    __state = '10';
                }
                break;
            case '10':
                html.add(widget.container, item);
                return;
            default:
                return;
            }
        }
    }
    function PlainList_setItems(self, items) {
        self.items = items;
        self.current = undefined;
        redrawPlainList(self);
        return;
    }
    function PlainList_init(self) {
        self.items = [];
        return;
    }
    function createSomething_create(config) {
        var errorMessage, response, dialog, create, cancel, buttons, input, explain, error, name, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9;
        var __handlerData = undefined, __inHandler = false;
        var me = {
            state: '18',
            type: 'createSomething'
        };
        function _main_createSomething(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        input.focus();
                        me.state = '40';
                        return;
                    case '6':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '7':
                        me.state = '62';
                        config.create(name).then(function (__returnee) {
                            response = __returnee;
                            _main_createSomething(__resolve, __reject);
                        }, function (error) {
                            __handlerData = error;
                            me.state = '9';
                            _main_createSomething(__resolve, __reject);
                        });
                        return;
                    case '9':
                        __inHandler = true;
                        removeQuestions();
                        _var2 = __handlerData;
                        console.error(_var2);
                        _var3 = tr('An error has occurred');
                        showErrorSnack(_var3);
                        __inHandler = false;
                        me.state = '6';
                        break;
                    case '18':
                        dialog = createMiddleWindow();
                        _var8 = tr('Create project');
                        _var7 = div({
                            text: _var8,
                            'font-weight': 'bold',
                            'font-size': config.headerSize
                        });
                        _var6 = div({
                            'text-align': 'center',
                            'line-height': 1.3,
                            'padding-bottom': '10px',
                            'position': 'relative'
                        }, _var7);
                        html.add(dialog, _var6);
                        me.state = '34';
                        break;
                    case '21':
                        _var4 = tr('Create');
                        create = createDefaultButton(_var4, me.create);
                        _var5 = tr('Cancel');
                        cancel = createSimpleButton(_var5, me.cancel);
                        cancel.style.marginRight = '0px';
                        buttons = div({
                            'padding-top': '10px',
                            position: 'relative',
                            'text-align': 'right'
                        }, create, cancel);
                        html.add(dialog, buttons);
                        me.state = '2';
                        break;
                    case '27':
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
                        _var9 = div({ text: explain });
                        html.add(dialog, _var9);
                        registerEvent(input, 'keydown', function (evt) {
                            createSomethingOnEnter(me, evt);
                        });
                        me.state = '21';
                        break;
                    case '34':
                        error = div({
                            color: 'darkred',
                            'padding-bottom': '10px',
                            display: 'none'
                        });
                        me.state = '27';
                        break;
                    case '41':
                        name = input.value.trim();
                        errorMessage = config.checkName(name);
                        if (errorMessage) {
                            html.setText(error, errorMessage);
                            error.style.display = '';
                            me.state = '2';
                        } else {
                            me.state = '7';
                        }
                        break;
                    case '43':
                        removeQuestions();
                        me.state = '6';
                        break;
                    case '62':
                        if (response.error) {
                            html.setText(response.error);
                            error.style.display = '';
                            me.state = '2';
                        } else {
                            removeQuestions();
                            me.state = '6';
                            config.onCreated(response.result).then(function () {
                                _main_createSomething(__resolve, __reject);
                            }, function (error) {
                                __handlerData = error;
                                me.state = '9';
                                _main_createSomething(__resolve, __reject);
                            });
                            return;
                        }
                        break;
                    default:
                        return;
                    }
                }
            } catch (ex) {
                if (__inHandler) {
                    me.state = undefined;
                    __reject(ex);
                } else {
                    me.state = '9';
                    __handlerData = ex;
                    _main_createSomething(__resolve, __reject);
                }
            }
        }
        me.run = function () {
            me.run = undefined;
            return new Promise(function (__resolve, __reject) {
                me.create = function () {
                    switch (me.state) {
                    case '40':
                        me.state = '41';
                        _main_createSomething(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '40':
                        me.state = '43';
                        _main_createSomething(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_createSomething(__resolve, __reject);
            });
        };
        return me;
    }
    function createSomething(config) {
        var __obj = createSomething_create(config);
        return __obj.run();
    }
    function createSomethingOnEnter(obj, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.key === 'Enter') {
                    obj.create();
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
    function hasUnsavedChanges() {
        return unit.unsaved;
    }
    function markUnsaved() {
        unit.unsaved = true;
        return;
    }
    function MoverLogic() {
        var self = {};
        self.onMouseMove = function (evt) {
            return MoverLogic_onMouseMove(self, evt);
        };
        self.onUp = function (evt) {
            return MoverLogic_onUp(self, evt);
        };
        self.onTouchMove = function (evt) {
            return MoverLogic_onTouchMove(self, evt);
        };
        return self;
    }
    function DummyWidget() {
        var self = {};
        self.init = function (config) {
            return DummyWidget_init(self, config);
        };
        self.onShow = function () {
            return DummyWidget_onShow(self);
        };
        self.setBackground = function (background) {
            return DummyWidget_setBackground(self, background);
        };
        self.onHide = function () {
            return DummyWidget_onHide(self);
        };
        self.redraw = function (container) {
            return DummyWidget_redraw(self, container);
        };
        return self;
    }
    function LoadingScreen() {
        var self = {};
        self.redraw = function (container) {
            return LoadingScreen_redraw(self, container);
        };
        return self;
    }
    function PlainList() {
        var self = {};
        self.redraw = function (container) {
            return PlainList_redraw(self, container);
        };
        self.setItems = function (items) {
            return PlainList_setItems(self, items);
        };
        self.init = function () {
            return PlainList_init(self);
        };
        return self;
    }
    unit.createIconButton = createIconButton;
    unit.addTooltip = addTooltip;
    unit.createWideMiddleWindow = createWideMiddleWindow;
    unit.removeQuestions = removeQuestions;
    unit.criticalQuestion_create = criticalQuestion_create;
    unit.criticalQuestion = criticalQuestion;
    unit.neutralQuestion_create = neutralQuestion_create;
    unit.neutralQuestion = neutralQuestion;
    unit.createMiddleWindow = createMiddleWindow;
    unit.uploadFile_create = uploadFile_create;
    unit.uploadFile = uploadFile;
    unit.createMovablePopup = createMovablePopup;
    unit.hasPopup = hasPopup;
    unit.closePopup = closePopup;
    unit.positionPopup = positionPopup;
    unit.removePopups = removePopups;
    unit.pushSemiModalPopup = pushSemiModalPopup;
    unit.createComboBox = createComboBox;
    unit.showErrorSnack = showErrorSnack;
    unit.removeSnack = removeSnack;
    unit.showGoodSnack = showGoodSnack;
    unit.showUndoSnack = showUndoSnack;
    unit.showContextMenu = showContextMenu;
    unit.showContextMenuExact = showContextMenuExact;
    unit.div = div;
    unit.makeLink = makeLink;
    unit.createCheckBox = createCheckBox;
    unit.createSimpleButton = createSimpleButton;
    unit.createBadButton = createBadButton;
    unit.createDefaultButton = createDefaultButton;
    unit.isMobileDevice = isMobileDevice;
    unit.isNarrowScreen = isNarrowScreen;
    unit.init = init;
    unit.inputBox_create = inputBox_create;
    unit.inputBox = inputBox;
    unit.largeBox_create = largeBox_create;
    unit.largeBox = largeBox;
    unit.inputBoxRo_create = inputBoxRo_create;
    unit.inputBoxRo = inputBoxRo;
    unit.largeBoxRo_create = largeBoxRo_create;
    unit.largeBoxRo = largeBoxRo;
    unit.createSomething_create = createSomething_create;
    unit.createSomething = createSomething;
    unit.hasUnsavedChanges = hasUnsavedChanges;
    unit.markUnsaved = markUnsaved;
    unit.MoverLogic = MoverLogic;
    unit.DummyWidget = DummyWidget;
    unit.LoadingScreen = LoadingScreen;
    unit.PlainList = PlainList;
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
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = simplewidgets_0_1;
}