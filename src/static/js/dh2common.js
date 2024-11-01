function dh2common() {
    var unit = {};
    var utils, html, http, widgets, gconfig, drakon_canvas;
    function runWriteDrakonAction(action, callbacks) {
        var _var2, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                _var4 = hasDialog();
                if (_var4) {
                    __state = '1';
                } else {
                    _var2 = callbacks.isDrakon();
                    if (_var2) {
                        _var3 = callbacks.isReadonly();
                        if (_var3) {
                            __state = '1';
                        } else {
                            action();
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
    function stretchElement(element) {
        display(element, 'inline-block');
        element.style.position = 'absolute';
        element.style.left = '0px';
        element.style.top = '0px';
        element.style.width = '100%';
        element.style.height = '100%';
        return;
    }
    function registerWriteDrakonShortcut(keys, action, callbacks) {
        var callback;
        callback = function () {
            runWriteDrakonAction(action, callbacks);
        };
        Mousetrap.bind(keys, callback, 'keydown');
        return;
    }
    function sendCreateFolder_create(parentId, type, name) {
        var payload, id, responseRaw, url, parsed, response;
        var me = {
            state: '2',
            type: 'sendCreateFolder'
        };
        function _main_sendCreateFolder(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        parsed = parseId(parentId);
                        payload = {
                            name: name,
                            parent: parsed.folderId,
                            type: type
                        };
                        url = '/api/folder/' + parsed.spaceId;
                        me.state = '11';
                        sendRequestRaw('POST', url, payload).then(function (__returnee) {
                            responseRaw = __returnee;
                            _main_sendCreateFolder(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '11':
                        response = JSON.parse(responseRaw.responseText);
                        id = makeId(parsed.spaceId, response.folder_id);
                        me.state = undefined;
                        __resolve({
                            id: id,
                            name: name,
                            type: type,
                            parent: parentId
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
                _main_sendCreateFolder(__resolve, __reject);
            });
        };
        return me;
    }
    function sendCreateFolder(parentId, type, name) {
        var __obj = sendCreateFolder_create(parentId, type, name);
        return __obj.run();
    }
    function ipath(image) {
        return gconfig.imagePath + image;
    }
    function createLogonScreen(widget, onSuccessCallback, goToRegisterCallback, onCancel, accountUrl) {
        var user, password, inputStyle, title, userLab, passLab, noAccountLab, forgotLab, spacer, spacer2, error, logonButt, createAccountButton, reset, form, formClass, formStyle, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11;
        var __state = '10';
        while (true) {
            switch (__state) {
            case '2':
                widget.form = form;
                user.focus();
                __state = '7';
                break;
            case '7':
                return form;
            case '10':
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
                __state = '22';
                break;
            case '14':
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
                __state = '2';
                break;
            case '22':
                _var2 = translate('Login to');
                _var3 = getHeader1Size();
                title = div({
                    text: _var2 + ' ' + gconfig.appName,
                    'font-weight': 'bold',
                    'font-size': _var3,
                    'text-align': 'center',
                    'margin': '10px'
                });
                _var4 = translate('User name');
                userLab = div({ text: _var4 });
                _var6 = translate('No account?');
                noAccountLab = div({ text: _var6 });
                _var7 = translate('Forgot password?');
                forgotLab = div({ text: _var7 });
                _var5 = translate('Password');
                passLab = div({ text: _var5 });
                spacer = div({ height: '20px' });
                spacer2 = div({ height: '10px' });
                error = div({
                    color: 'darkred',
                    'margin-top': '10px'
                });
                widget.error = error;
                __state = '28';
                break;
            case '28':
                _var8 = translate('Login');
                logonButt = widgets.createDefaultButton(_var8, function () {
                    doLogon(widget, onSuccessCallback);
                });
                logonButt.style.width = '100%';
                logonButt.style.textAlign = 'center';
                _var9 = translate('Create account');
                createAccountButton = widgets.createSimpleButton(_var9, goToRegisterCallback);
                _var11 = translate('Forgot password?');
                _var10 = html.createElement('a', { href: accountUrl }, [{ text: _var11 }]);
                reset = div({ 'margin-top': '20px' }, _var10);
                registerEvent(password, 'keydown', function (evt) {
                    logonOnEnter(widget, evt, onSuccessCallback);
                });
                __state = '14';
                break;
            default:
                return;
            }
        }
    }
    function checkDrakonIntegrity(diagram) {
        var tmpDrakon, tmpContainer, canvas, config, fakeSender, ok, _var2, _var3;
        tmpContainer = div({ display: 'none' });
        html.add(document.body, tmpContainer);
        config = {};
        _var2 = drakon_canvas.DrakonCanvas();
        tmpDrakon = createWidget(_var2);
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
            _var3 = translate('Error in diagram structure');
            return _var3;
        }
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
        return;
    }
    function createSpecialStyles() {
        var _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                html.addClass('*', '-webkit-tap-highlight-color: transparent');
                html.addClass('.top-bar', 'position: relative', 'white-space: nowrap', 'height:50px', 'border-bottom: solid 1px #a0a0a0');
                html.addClass('.top-bar-padding', 'height:2px', 'background:red');
                html.addClass('.top-bar-logo', 'display: inline-block');
                html.addClass('.top-bar-logo img', 'height:40px', 'width:40px', 'display:inline-block');
                html.addClass('.top-bar-stripe', 'display:inline-block', 'width:calc(100% - 40px)', 'height:40px', 'vertical-align: top');
                html.addClass('.top-bar-below', 'display:inline-block', 'position:relative', 'width:100%', 'height:calc(100% - 50px)');
                html.addClass('.top-text', 'display: inline-block', 'line-height: 50px', 'padding-left: 5px', 'padding-right: 5px', 'vertical-align: top');
                html.addClass('.top-right', 'display: inline-block', 'line-height: 50px', 'padding-left: 5px', 'padding-right: 5px', 'vertical-align: top', 'position: absolute', 'right: 0px', 'top: 0px');
                __state = '13';
                break;
            case '4':
                return;
            case '13':
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
                __state = '24';
                break;
            case '24':
                html.addClass('.question-back', 'display: inline-block', 'position: fixed', 'left: 0px', 'top: 0px', 'width: 100vw', 'height: 100vh', 'background: rgba(0, 0, 0, 0.2)', 'z-index: 2000');
                html.addClass('.question-body', 'display: inline-block', 'position: fixed', 'left: 50%', 'transform: translateX(-50%)', 'top: 0px', 'max-width: 100vw', 'width: 400px', 'background: white', 'z-index: 2001');
                __state = '27';
                break;
            case '27':
                html.addClass('.context-menu', 'display: inline-block', 'position: absolute', 'background: white', 'max-width: 100vw', 'min-width: 200px', 'border: solid 1px #a0a0a0', 'padding: 10px');
                html.addClass('.context-menu-separator', 'background: #a0a0a0', 'height: 1px', 'margin-top:5px', 'margin-bottom:5px');
                __state = '32';
                break;
            case '32':
                html.addClass('.snack-container', 'display: inline-block', 'position: fixed', 'left: 20px', 'top: 20px', 'width: 400px', 'max-width: calc(100vw - 20px)', 'height: 80px', 'background: white', 'z-index: 500', 'border: solid 1px #a0a0a0', 'transition: opacity 500ms');
                html.addClass('.snack-field-back', 'display: inline-block', 'position: absolute', 'left: 0px', 'top: 0px', 'width: 30px', 'height: 80px', 'background: darkred');
                html.addClass('.snack-field-text', 'display: inline-block', 'position: absolute', 'left: 30px', 'top: 0px', 'width: 370px', 'height: 80px');
                __state = '37';
                break;
            case '37':
                html.addClass('.main-menu', 'display: inline-block', 'background: white', 'border: solid 1px #a0a0a0', 'min-width: 300px', 'max-width: 100vw', 'max-height: calc(100vh - 100px)', 'overflow: auto', 'opacity: 0', 'transform: translateY(-30px)', 'transition: transform 300ms, opacity 300ms');
                html.addClass('.main-menu-title', 'display: inline-block', 'vertical-align: top', 'font-weight: bold', 'font-size: 20px', 'line-height: 49px', 'padding-left: 10px', 'padding-right: 10px');
                html.addClass('.main-menu-top', 'position: relative', 'background: white');
                html.addClass('.main-menu-bottom', 'white-space: nowrap', 'padding-right: 5px');
                html.addClass('.main-menu-section', 'display: inline-block', 'margin: 5px', 'margin-right: 0px', 'vertical-align: top', 'white-space: normal');
                _var2 = getHeader2Size();
                html.addClass('.main-menu-section-header', 'color: green', 'font-weight: bold', 'font-size: ' + _var2, 'text-align: center', 'border-bottom: solid 2px green');
                __state = '44';
                break;
            case '44':
                html.addClass('.active-border', 'background: white', 'border: solid 2px #d0d0d0', 'margin-bottom: 5px', 'border-radius: 5px');
                html.addClass('.active-border:hover, .active-border:active', 'background: white', 'border: solid 2px green', 'cursor: pointer', 'user-select: none');
                __state = '48';
                break;
            case '48':
                html.addClass('.common-table th', 'padding: 5px', 'font-weight: bold', 'text-align: center');
                html.addClass('.common-table td', 'padding: 5px');
                html.addClass('table.common-table, table.common-table th, table.common-table td', 'padding: 5px', 'border: solid 1px #e0e0e0');
                __state = '4';
                break;
            default:
                return;
            }
        }
    }
    function getDiagramLabels() {
        return unit.globals.labels;
    }
    function initDiagramLabels() {
        var labels, bucket, code, labelsByCode, _var2, _var3, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                labels = [
                    [
                        'de',
                        'Deutsch',
                        'Ja',
                        'Nein',
                        'Ende'
                    ],
                    [
                        'en-us',
                        'English',
                        'Yes',
                        'No',
                        'End'
                    ],
                    [
                        'es',
                        'Español',
                        'Si',
                        'No',
                        'Final'
                    ],
                    [
                        'lv',
                        'Latviešu',
                        'Jā',
                        'Nē',
                        'Beigas'
                    ],
                    [
                        'lt',
                        'Lietuvių',
                        'Taip',
                        'Ne',
                        'Pabaiga'
                    ],
                    [
                        'nl',
                        'Nederlands',
                        'Ja',
                        'Nee',
                        'Einde'
                    ],
                    [
                        'no',
                        'Norsk',
                        'Ja',
                        'Nei',
                        'Slutt',
                        'Gren',
                        'Utgang'
                    ],
                    [
                        'pl',
                        'Polski',
                        'Tak',
                        'Nie',
                        'Koniec',
                        'Gałąź',
                        'Wyjście'
                    ],
                    [
                        'ro',
                        'Român',
                        'Da',
                        'Nu',
                        'Sfârșit'
                    ],
                    [
                        'fi',
                        'Suomi',
                        'Kyllä',
                        'Ei',
                        'Loppu'
                    ],
                    [
                        'sv',
                        'Svenska',
                        'Ja',
                        'Nej',
                        'Slut'
                    ],
                    [
                        'ru',
                        'Русский',
                        'Да',
                        'Нет',
                        'Конец',
                        'Ветка',
                        'Завершение'
                    ],
                    [
                        'uk',
                        'Українська',
                        'Так',
                        'Нi',
                        'Кiнець'
                    ],
                    [
                        'zh',
                        '中文',
                        '是',
                        '否',
                        '结束'
                    ]
                ];
                __state = '5';
                break;
            case '4':
                unit.globals.labels = labels;
                unit.globals.labelsByCode = labelsByCode;
                return;
            case '5':
                labelsByCode = {};
                _var2 = labels;
                _var3 = 0;
                __state = '7';
                break;
            case '7':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    code = item[0];
                    bucket = {
                        yes: item[2],
                        no: item[3],
                        end: item[4],
                        branch: item[5] || 'Branch',
                        exit: item[6] || 'Exit'
                    };
                    labelsByCode[code] = bucket;
                    _var3++;
                    __state = '7';
                } else {
                    __state = '4';
                }
                break;
            default:
                return;
            }
        }
    }
    function getLabelsByCode(code) {
        return unit.globals.labelsByCode[code];
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
        return;
    }
    function loadStringsForLanguage_create(language) {
        var response, strings, url;
        var me = {
            state: '2',
            type: 'loadStringsForLanguage'
        };
        function _main_loadStringsForLanguage(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        if (language === 'en-us') {
                            me.state = '10';
                        } else {
                            url = gconfig.stringsPath + language + '.json';
                            me.state = '4';
                            sendRequestRaw('GET', url).then(function (__returnee) {
                                response = __returnee;
                                _main_loadStringsForLanguage(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '4':
                        if (response.status === 200) {
                            strings = JSON.parse(response.responseText);
                            me.state = '11';
                        } else {
                            me.state = '10';
                        }
                        break;
                    case '10':
                        strings = undefined;
                        me.state = '11';
                        break;
                    case '11':
                        setStrings(strings);
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
                _main_loadStringsForLanguage(__resolve, __reject);
            });
        };
        return me;
    }
    function loadStringsForLanguage(language) {
        var __obj = loadStringsForLanguage_create(language);
        return __obj.run();
    }
    function translate(text) {
        var strings;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                strings = unit.globals.strings;
                if (strings) {
                    if (text in strings) {
                        return strings[text];
                    } else {
                        __state = '7';
                    }
                } else {
                    __state = '7';
                }
                break;
            case '7':
                return text;
            default:
                return;
            }
        }
    }
    function setStrings(strings) {
        unit.globals.strings = strings;
        return;
    }
    function initResize() {
        unit.resizables = {};
        unit.resizeDebounce = utils.debounce_create(invokeWindowResize, 1000);
        unit.resizeDebounce.run();
        window.onresize = onWindowResize;
        return;
    }
    function subscribeOnResize(action) {
        var id;
        id = generateRandomString();
        unit.resizables[id] = action;
        return id;
    }
    function invokeWindowResize() {
        var _var3, _var2, _var4, id, action;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                setRootStyle();
                _var3 = unit.resizables;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '5';
                break;
            case '5':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    action = _var3[id];
                    action();
                    _var4++;
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
    function unsubscribeFromResize(id) {
        delete unit.resizables[id];
        return;
    }
    function onWindowResize() {
        unit.resizeDebounce.onInput();
        return;
    }
    function div() {
        var args, properties, _var2;
        args = Array.prototype.slice.call(arguments);
        properties = {};
        _var2 = html.createElement('div', properties, args);
        return _var2;
    }
    function checkProjectName(name) {
        var length, first, last, ch, code, i, _var2, _var3, _var4, _var5, _var6;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (name) {
                    name = name.trim();
                    if (name) {
                        length = name.length;
                        first = name[0];
                        last = name[length - 1];
                        if (first === '.') {
                            __state = '_item4';
                        } else {
                            if (first === '-') {
                                __state = '_item4';
                            } else {
                                if (last === '.') {
                                    __state = '_item4';
                                } else {
                                    if (last === '-') {
                                        __state = '_item4';
                                    } else {
                                        if (name.length < 2) {
                                            _var4 = translate('Name is too short');
                                            return _var4;
                                        } else {
                                            if (name.length > 50) {
                                                _var5 = translate('Name is too long');
                                                return _var5;
                                            } else {
                                                __state = '11';
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        __state = '_item3';
                    }
                } else {
                    __state = '_item3';
                }
                break;
            case '11':
                i = 0;
                __state = '20';
                break;
            case '20':
                if (i < length) {
                    ch = name[i];
                    if (unit.forbiddenCharacters[ch]) {
                        __state = '_item7';
                    } else {
                        code = ch.codePointAt(0);
                        if (code < 32) {
                            __state = '_item7';
                        } else {
                            i++;
                            __state = '20';
                        }
                    }
                } else {
                    return undefined;
                }
                break;
            case '_item4':
                _var3 = translate('Name must start and end with a digit or letter');
                return _var3;
            case '_item7':
                _var6 = translate('Unsupported characters');
                return _var6;
            case '_item3':
                _var2 = translate('Name cannot be empty');
                return _var2;
            default:
                return;
            }
        }
    }
    function copyIfMissing(target, source, name) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (target[name]) {
                    __state = '1';
                } else {
                    target[name] = source[name];
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function buildUrlForFolder(id) {
        var parsed, root;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                root = gconfig.appRoot;
                parsed = parseId(id);
                if (parsed.spaceId) {
                    if (parsed.folderId) {
                        return root + '?proj=' + parsed.spaceId + '&doc=' + parsed.folderId;
                    } else {
                        __state = '7';
                    }
                } else {
                    __state = '7';
                }
                break;
            case '7':
                throw new Error('Incorrect folder id: ' + id);
            default:
                return;
            }
        }
    }
    function removeTagsFromRedirect(item) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (item.hint === 'redirect') {
                    item.text = stripTags(item.text);
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
    function callHook(widget, name) {
        var hook;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                hook = widget[name];
                if (hook) {
                    hook();
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
    function importDiagram_create(jsonString, filename, parentId, tr) {
        var internal, parsedFilename, folder, payload, id, url, parsed, _var2, _var3, _var4, _var5;
        var me = {
            state: '20',
            type: 'importDiagram'
        };
        function _main_importDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '6':
                        internal = drakonToInternal(parsed.diagram);
                        parsedFilename = stripExtension(filename);
                        if (internal.name) {
                            me.state = '11';
                        } else {
                            internal.name = parsedFilename.name;
                            me.state = '11';
                        }
                        break;
                    case '11':
                        if (internal.type) {
                            me.state = '_item2';
                        } else {
                            internal.type = parsedFilename.extension;
                            me.state = '_item2';
                        }
                        break;
                    case '14':
                        me.state = '27';
                        sendCreateFolder(parentId, internal.type, internal.name).then(function (__returnee) {
                            folder = __returnee;
                            _main_importDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '20':
                        parsed = checkDiagram(jsonString);
                        if (parsed.error) {
                            widgets.showErrorSnack(parsed.error);
                            me.state = undefined;
                            __resolve(undefined);
                            return;
                        } else {
                            me.state = '6';
                        }
                        break;
                    case '27':
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
                        _var5 = id.split(' ');
                        _var4 = _var5.join('/');
                        url = '/api/edit/' + _var4;
                        me.state = '38';
                        sendRequestRaw('POST', url, payload).then(function () {
                            _main_importDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '38':
                        me.state = undefined;
                        __resolve(id);
                        return;
                    case '_item2':
                        _var2 = internal.type;
                        if (_var2 === 'drakon') {
                            me.state = '14';
                        } else {
                            if (_var2 === 'free') {
                                me.state = '14';
                            } else {
                                if (_var2 === 'graf') {
                                    me.state = '14';
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
                _main_importDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function importDiagram(jsonString, filename, parentId, tr) {
        var __obj = importDiagram_create(jsonString, filename, parentId, tr);
        return __obj.run();
    }
    function ensureOptionalString(obj, prop) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (prop in obj) {
                    if (typeof obj[prop] === 'string') {
                        __state = '3';
                    } else {
                        return false;
                    }
                } else {
                    __state = '3';
                }
                break;
            case '3':
                return true;
            default:
                return;
            }
        }
    }
    function drakonToInternal(diagram) {
        var diagram2, _var3, _var2, _var4, id, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
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
                _var3 = diagram.items;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '7';
                break;
            case '7':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    item = _var3[id];
                    item.id = id;
                    if (item.content) {
                        item.text = item.content;
                        __state = '11';
                    } else {
                        __state = '11';
                    }
                } else {
                    return diagram2;
                }
                break;
            case '11':
                delete item.content;
                diagram2.items.push(item);
                _var4++;
                __state = '7';
                break;
            default:
                return;
            }
        }
    }
    function parseId(id) {
        var parts;
        parts = id.split(' ');
        return {
            spaceId: parts[0],
            folderId: parts[1]
        };
    }
    function makeId(spaceId, folderId) {
        return spaceId + ' ' + folderId;
    }
    function checkJsonContent(jsonString) {
        var error, diagram, obj, limit, _var3, _var2, _var4, id, item, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14, _var15, _var16, _var17;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                limit = 1000000;
                error = '';
                diagram = undefined;
                if (jsonString.length > limit) {
                    error = translate('File is too large');
                    __state = '40';
                } else {
                    diagram = { items: {} };
                    try {
                        obj = JSON.parse(jsonString);
                    } catch (ex) {
                        _var5 = translate('Error in JSON');
                        error = _var5 + ': ' + ex.message;
                    }
                    if (obj) {
                        if (obj.access) {
                            diagram.access = obj.access;
                            __state = '42';
                        } else {
                            __state = '42';
                        }
                    } else {
                        __state = '40';
                    }
                }
                break;
            case '40':
                return {
                    diagram: diagram,
                    error: error
                };
            case '41':
                _var3 = obj.items;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '53';
                break;
            case '42':
                _var13 = ensureOptionalString(obj, 'name');
                if (_var13) {
                    if (typeof obj.items === 'object') {
                        _var14 = ensureOptionalJsonString(obj, 'style');
                        if (_var14) {
                            _var15 = ensureOptionalString(obj, 'params');
                            if (_var15) {
                                _var16 = ensureOptionalString(obj, 'type');
                                if (_var16) {
                                    _var17 = ensureOptionalString(obj, 'description');
                                    if (_var17) {
                                        utils.copyFieldsWithValue(diagram, obj, [
                                            'name',
                                            'params',
                                            'type',
                                            'style',
                                            'description'
                                        ]);
                                        __state = '41';
                                    } else {
                                        error = translate('"description" must by a string');
                                        __state = '40';
                                    }
                                } else {
                                    error = translate('"type" must by a string');
                                    __state = '40';
                                }
                            } else {
                                error = translate('"params" must by a string');
                                __state = '40';
                            }
                        } else {
                            error = translate('"style" must by a JSON string');
                            __state = '40';
                        }
                    } else {
                        error = translate('Missing "items" property');
                        __state = '40';
                    }
                } else {
                    error = translate('"name" must be a string');
                    __state = '40';
                }
                break;
            case '53':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    item = _var3[id];
                    if (id) {
                        if (item) {
                            if (typeof item === 'object') {
                                _var7 = ensureOptionalString(item, 'content');
                                if (_var7) {
                                    _var9 = ensureOptionalString(item, 'secondary');
                                    if (_var9) {
                                        _var11 = ensureOptionalJsonString(item, 'style');
                                        if (_var11) {
                                            diagram.items[id] = item;
                                            _var4++;
                                            __state = '53';
                                        } else {
                                            _var12 = translate('"style" must be a JSON string');
                                            error = _var12 + ', id=' + id;
                                            __state = '40';
                                        }
                                    } else {
                                        _var10 = translate('"secondary" must be a string');
                                        error = _var10 + ', id=' + id;
                                        __state = '40';
                                    }
                                } else {
                                    _var8 = translate('"content" must be a string');
                                    error = _var8 + ', id=' + id;
                                    __state = '40';
                                }
                            } else {
                                __state = '_item4';
                            }
                        } else {
                            __state = '_item4';
                        }
                    } else {
                        error = translate('Item id must not be empty string');
                        __state = '40';
                    }
                } else {
                    __state = '40';
                }
                break;
            case '_item4':
                _var6 = translate('Item is not an object');
                error = _var6 + ', id=' + id;
                __state = '40';
                break;
            default:
                return;
            }
        }
    }
    function ensureOptionalJsonString(obj, prop) {
        var parsed;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (prop in obj) {
                    if (typeof obj[prop] === 'string') {
                        if (obj[prop] === '') {
                            __state = '3';
                        } else {
                            try {
                                parsed = JSON.parse(obj[prop]);
                            } catch (ex) {
                            }
                            if (parsed) {
                                __state = '3';
                            } else {
                                __state = '7';
                            }
                        }
                    } else {
                        __state = '7';
                    }
                } else {
                    __state = '3';
                }
                break;
            case '3':
                return true;
            case '7':
                return false;
            default:
                return;
            }
        }
    }
    function stripExtension(filename) {
        var ch, ext, result, i, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                ext = [];
                i = filename.length - 1;
                __state = '5';
                break;
            case '5':
                if (i >= 0) {
                    ch = filename[i];
                    if (ch === '.') {
                        __state = '11';
                    } else {
                        ext.push(ch);
                        i--;
                        __state = '5';
                    }
                } else {
                    __state = '11';
                }
                break;
            case '10':
                return result;
            case '11':
                ext.reverse();
                _var2 = filename.substring(0, i);
                _var3 = ext.join('');
                result = {
                    name: _var2,
                    extension: _var3
                };
                __state = '10';
                break;
            default:
                return;
            }
        }
    }
    function saveAsPng(widget, res) {
        var exported, filename, _var2;
        exported = widget.exportImage(res, '');
        _var2 = utils.sanitizeFilename(exported.name);
        filename = _var2 + '.png';
        downloadImageDataAsFile(filename, exported.image);
        return;
    }
    function saveAsSvg(widget) {
        var filename, width, height, ctx, box, zoom100, json, obj, image, _var2;
        trace('saveAsSvg');
        zoom100 = 10000;
        box = widget.drakon.getDiagramBox();
        width = box.right - box.left;
        height = box.bottom - box.top;
        ctx = new C2S(width, height);
        widget.drakon.exportToContext(box, zoom100, ctx);
        json = widget.drakon.exportJson();
        obj = JSON.parse(json);
        _var2 = utils.sanitizeFilename(obj.name);
        filename = _var2 + '.svg';
        image = ctx.getSerializedSvg(true);
        downloadTextDataAsFile(filename, image);
        return;
    }
    function getHeader1Size() {
        return gconfig.fontSize + 4 + 'px';
    }
    function generateRandomString() {
        var number, _var2, _var3;
        _var2 = Math.random();
        number = Math.floor(_var2 * 10000000);
        _var3 = number.toString();
        return _var3;
    }
    function isNetworkError(ex) {
        var str, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (ex) {
                    str = ex.toString();
                    _var2 = str.indexOf('NetworkError');
                    if (_var2 === -1) {
                        _var3 = str.indexOf('HTTP error');
                        if (_var3 === -1) {
                            __state = '8';
                        } else {
                            __state = '9';
                        }
                    } else {
                        __state = '9';
                    }
                } else {
                    __state = '8';
                }
                break;
            case '8':
                return false;
            case '9':
                return true;
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
    function checkDiagram(jsonString) {
        var parsed, error;
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
    function getQuery() {
        var query, result, noQuestion, steps, parts, _var2, _var3, step;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                query = window.location.search;
                result = {};
                if (query) {
                    noQuestion = query.substring(1);
                    steps = noQuestion.split('&');
                    _var2 = steps;
                    _var3 = 0;
                    __state = '11';
                } else {
                    __state = '6';
                }
                break;
            case '6':
                return result;
            case '11':
                if (_var3 < _var2.length) {
                    step = _var2[_var3];
                    parts = step.split('=');
                    result[parts[0]] = parts[1];
                    _var3++;
                    __state = '11';
                } else {
                    __state = '6';
                }
                break;
            default:
                return;
            }
        }
    }
    function stripTags(html) {
        var text, state, tag, space, ch, code, _var2, i, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                html = html || '';
                if (html.length >= 3) {
                    if (html[0] === '<') {
                        if (html[html.length - 1] === '>') {
                            text = '';
                            state = 'content';
                            tag = '';
                            space = false;
                            i = 0;
                            __state = '13';
                        } else {
                            __state = '10';
                        }
                    } else {
                        __state = '10';
                    }
                } else {
                    __state = '10';
                }
                break;
            case '10':
                text = html;
                __state = '_item7';
                break;
            case '12':
                i++;
                __state = '13';
                break;
            case '13':
                if (i < html.length) {
                    ch = html[i];
                    code = html.charCodeAt(i);
                    _var2 = state;
                    if (_var2 === 'content') {
                        if (ch === '<') {
                            tag = ch;
                            state = 'tag';
                            __state = '12';
                        } else {
                            _var4 = utils.isSpace(code);
                            if (_var4) {
                                if (space) {
                                    space = true;
                                    __state = '12';
                                } else {
                                    space = true;
                                    text += ' ';
                                    __state = '12';
                                }
                            } else {
                                space = false;
                                text += ch;
                                __state = '12';
                            }
                        }
                    } else {
                        if (_var2 === 'tag') {
                            tag += ch;
                            if (ch === '>') {
                                if (tag === '</p>') {
                                    __state = '52';
                                } else {
                                    if (tag === '</li>') {
                                        __state = '52';
                                    } else {
                                        if (tag === '<br>') {
                                            __state = '52';
                                        } else {
                                            if (tag === '<br/>') {
                                                __state = '52';
                                            } else {
                                                __state = '51';
                                            }
                                        }
                                    }
                                }
                            } else {
                                __state = '12';
                            }
                        } else {
                            throw new Error('Unexpected case value: ' + _var2);
                        }
                    }
                } else {
                    __state = '_item7';
                }
                break;
            case '51':
                state = 'content';
                __state = '12';
                break;
            case '52':
                if (space) {
                    __state = '51';
                } else {
                    space = true;
                    text += ' ';
                    __state = '51';
                }
                break;
            case '_item7':
                _var3 = text.trim();
                return _var3;
            default:
                return;
            }
        }
    }
    function td() {
        var args, properties, _var2;
        args = Array.prototype.slice.call(arguments);
        properties = {};
        _var2 = html.createElement('td', properties, args);
        return _var2;
    }
    function saveAsJson(widget) {
        var exported, filename, obj, extension, _var2, _var3;
        exported = widget.exportJson();
        obj = JSON.parse(exported);
        _var3 = widget.getDiagramType();
        extension = '.' + _var3;
        _var2 = utils.sanitizeFilename(obj.name);
        filename = _var2 + extension;
        downloadTextDataAsFile(filename, exported);
        return;
    }
    function buildBaseUrl() {
        return window.location.origin + window.location.pathname;
    }
    function downloadTextDataAsFile(filename, data) {
        var file, link, url;
        file = new File([data], filename, { type: 'text/plain' });
        link = document.createElement('a');
        url = window.URL.createObjectURL(file);
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return;
    }
    function getHeader2Size() {
        return gconfig.fontSize + 2 + 'px';
    }
    function downloadImageDataAsFile(filename, data) {
        var link;
        link = document.createElement('a');
        link.href = data;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }
    function display(element, value) {
        element.style.display = value;
        return;
    }
    function setTitle(title) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (title) {
                    html.setTitle(title + ' | ' + gconfig.appName);
                    __state = '1';
                } else {
                    html.setTitle(gconfig.appName);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function copyAllFieldsWithValue(dst, src) {
        var _var3, _var2, _var4, field, value, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var3 = src;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '5';
                break;
            case '4':
                _var4++;
                __state = '5';
                break;
            case '5':
                if (_var4 < _var2.length) {
                    field = _var2[_var4];
                    value = _var3[field];
                    _var5 = utils.hasValue(value);
                    if (_var5) {
                        dst[field] = value;
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
    function getAppRoot() {
        return gconfig.appRoot;
    }
    function registerReadDrakonShortcut(keys, action, callbacks) {
        var callback;
        callback = function () {
            runReadDrakonAction(action, callbacks);
        };
        Mousetrap.bind(keys, callback, 'keydown');
        return;
    }
    function initShortcuts(callbacks) {
        var _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
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
                    _var2 = callbacks.getWidget();
                    _var2.editContent();
                }, callbacks);
                registerWriteDrakonShortcut('del', function () {
                    _var3 = callbacks.getWidget();
                    _var3.deleteSelection();
                }, callbacks);
                registerWriteDrakonShortcut('backspace', function () {
                    _var4 = callbacks.getWidget();
                    _var4.deleteSelection();
                }, callbacks);
                registerWriteDrakonShortcut('mod+x', function () {
                    _var5 = callbacks.getWidget();
                    _var5.cutSelection();
                }, callbacks);
                registerWriteDrakonShortcut('mod+v', function () {
                    _var6 = callbacks.getWidget();
                    _var6.showPaste();
                }, callbacks);
                registerWriteDrakonShortcut('mod+z', function () {
                    _var12 = callbacks.getWidget();
                    _var12.undo();
                }, callbacks);
                registerWriteDrakonShortcut('mod+y', function () {
                    _var13 = callbacks.getWidget();
                    _var13.redo();
                }, callbacks);
                __state = '11';
                break;
            case '10':
                return;
            case '11':
                registerReadDrakonShortcut('mod+c', function () {
                    _var7 = callbacks.getWidget();
                    _var7.copySelection();
                }, callbacks);
                registerReadDrakonShortcut('up', function () {
                    _var8 = callbacks.getWidget();
                    _var8.arrowUp();
                }, callbacks);
                registerReadDrakonShortcut('down', function () {
                    _var9 = callbacks.getWidget();
                    _var9.arrowDown();
                }, callbacks);
                registerReadDrakonShortcut('left', function () {
                    _var10 = callbacks.getWidget();
                    _var10.arrowLeft();
                }, callbacks);
                registerReadDrakonShortcut('right', function () {
                    _var11 = callbacks.getWidget();
                    _var11.arrowRight();
                }, callbacks);
                __state = '10';
                break;
            default:
                return;
            }
        }
    }
    function registerInsertShortcut(keys, type, callbacks) {
        var action, drakon;
        action = function () {
            drakon = callbacks.getWidget();
            drakon.showInsertionSockets(type);
        };
        registerWriteDrakonShortcut(keys, action, callbacks);
        return;
    }
    function runReadDrakonAction(action, callbacks) {
        var _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                _var3 = hasDialog();
                if (_var3) {
                    __state = '1';
                } else {
                    _var2 = callbacks.isDrakon();
                    if (_var2) {
                        action();
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
    function hasDialog() {
        var _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widgets.questionVisible) {
                    __state = '3';
                } else {
                    _var2 = widgets.hasPopup();
                    if (_var2) {
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
    function main() {
        unit.traces = [];
        unit.globals = {};
        unit.forbiddenCharacters = {
            '<': true,
            '>': true,
            ':': true,
            '"': true,
            '\'': true,
            '/': true,
            '\\': true,
            '|': true,
            '?': true,
            '*': true
        };
        initDiagramLabels();
        initResize();
        return;
    }
    function sendRequestWithCheck_create(method, url, payload) {
        var response, error, _var2, _var3;
        var me = {
            state: '2',
            type: 'sendRequestWithCheck'
        };
        function _main_sendRequestWithCheck(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '6';
                        sendRequestRaw(method, url, payload).then(function (__returnee) {
                            response = __returnee;
                            _main_sendRequestWithCheck(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        if (response.status === 200) {
                            me.state = '26';
                        } else {
                            if (response.status === 204) {
                                me.state = '26';
                            } else {
                                console.error(response);
                                error = new Error('HTTP error. Status=' + response.status + ' url=' + url);
                                error.status = response.status;
                                _var3 = error;
                                me.state = undefined;
                                __reject(_var3);
                                return;
                            }
                        }
                        break;
                    case '26':
                        if (response.responseText) {
                            _var2 = JSON.parse(response.responseText);
                            me.state = undefined;
                            __resolve(_var2);
                            return;
                        } else {
                            me.state = undefined;
                            __resolve(undefined);
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
                _main_sendRequestWithCheck(__resolve, __reject);
            });
        };
        return me;
    }
    function sendRequestWithCheck(method, url, payload) {
        var __obj = sendRequestWithCheck_create(method, url, payload);
        return __obj.run();
    }
    function getSettingsFromLocalStorage() {
        var settingsStr, settings;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                settingsStr = localStorage.getItem('userSetting');
                if (settingsStr) {
                    settings = JSON.parse(settingsStr);
                    __state = '3';
                } else {
                    settings = {};
                    __state = '3';
                }
                break;
            case '3':
                return settings;
            default:
                return;
            }
        }
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
    function getAccountObj() {
        return unit.globals.account;
    }
    function isLoggedOn() {
        var account;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                account = getAccountObj();
                if (account) {
                    if (account.user_id) {
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
    function sendRequestRaw_create(method, url, payload) {
        var response, fullUrl, body, error, headers, _var2, _var3;
        var me = {
            state: '2',
            type: 'sendRequestRaw'
        };
        function _main_sendRequestRaw(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        if (payload) {
                            body = JSON.stringify(payload);
                            me.state = '_item2';
                        } else {
                            body = '';
                            me.state = '_item2';
                        }
                        break;
                    case '29':
                        if (response.status === 0) {
                            error = new Error('No connection');
                            error.disconnected = true;
                            _var3 = error;
                            me.state = undefined;
                            __reject(_var3);
                            return;
                        } else {
                            me.state = undefined;
                            __resolve(response);
                            return;
                        }
                    case '_item2':
                        _var2 = getBaseUrl();
                        fullUrl = _var2 + url;
                        headers = getHeaders();
                        trace('sendRequestRaw', method + ' ' + fullUrl);
                        me.state = '29';
                        http.sendRequest(method, fullUrl, body, headers).then(function (__returnee) {
                            response = __returnee;
                            _main_sendRequestRaw(__resolve, __reject);
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
                _main_sendRequestRaw(__resolve, __reject);
            });
        };
        return me;
    }
    function sendRequestRaw(method, url, payload) {
        var __obj = sendRequestRaw_create(method, url, payload);
        return __obj.run();
    }
    function fetchAccount_create() {
        var account;
        var me = {
            state: '2',
            type: 'fetchAccount'
        };
        function _main_fetchAccount(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '5';
                        sendRequestRaw('GET', '/api/account').then(function (__returnee) {
                            account = __returnee;
                            _main_fetchAccount(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        if (account.status === 401) {
                            account = {};
                            me.state = '7';
                        } else {
                            account = JSON.parse(account.responseText);
                            me.state = '7';
                        }
                        break;
                    case '7':
                        unit.globals.account = account;
                        me.state = undefined;
                        __resolve(account);
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
                _main_fetchAccount(__resolve, __reject);
            });
        };
        return me;
    }
    function fetchAccount() {
        var __obj = fetchAccount_create();
        return __obj.run();
    }
    function getSettingsObj() {
        var settings;
        settings = unit.globals.userSettings;
        addLabelsToSettings(settings);
        return settings;
    }
    function getBaseUrl() {
        return gconfig.baseUrl;
    }
    function saveUserSettings(userSettings) {
        var existingSettings, _var2, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                existingSettings = getSettingsObj();
                copyAllFieldsWithValue(existingSettings, userSettings);
                _var3 = isLoggedOn();
                if (_var3) {
                    _var2 = sendRequestRaw('POST', '/api/theme', existingSettings);
                    return _var2;
                } else {
                    _var4 = JSON.stringify(existingSettings);
                    localStorage.setItem('userSetting', _var4);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function guessLanguage() {
        return gconfig.defaultLanguage;
    }
    function fetchUserSettings_create() {
        var settings, response, _var2;
        var me = {
            state: '2',
            type: 'fetchUserSettings'
        };
        function _main_fetchUserSettings(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        _var2 = isLoggedOn();
                        if (_var2) {
                            me.state = '6';
                            sendRequestRaw('GET', '/api/theme').then(function (__returnee) {
                                response = __returnee;
                                _main_fetchUserSettings(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            settings = getSettingsFromLocalStorage();
                            me.state = '10';
                        }
                        break;
                    case '6':
                        if (response.status === 401) {
                            settings = {};
                            me.state = '10';
                        } else {
                            settings = JSON.parse(response.responseText);
                            me.state = '10';
                        }
                        break;
                    case '8':
                        unit.globals.userSettings = settings;
                        me.state = undefined;
                        __resolve(settings);
                        return;
                    case '10':
                        if (settings.language) {
                            me.state = '8';
                        } else {
                            settings.language = guessLanguage();
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
                _main_fetchUserSettings(__resolve, __reject);
            });
        };
        return me;
    }
    function fetchUserSettings() {
        var __obj = fetchUserSettings_create();
        return __obj.run();
    }
    function removeLoading() {
        var loading;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                loading = document.getElementById('loading');
                if (loading) {
                    html.remove(loading);
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
    function chooseDocumentType_create() {
        var dialog, result, cancel, buttons, evt, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14;
        var me = {
            state: '2',
            type: 'chooseDocumentType'
        };
        function _main_chooseDocumentType(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        dialog = widgets.createMiddleWindow();
                        _var3 = translate('Choose diagram type');
                        _var4 = getHeader1Size();
                        _var2 = div({
                            text: _var3,
                            'font-size': _var4,
                            'font-weight': 'bold',
                            'padding-bottom': '10px'
                        });
                        html.add(dialog, _var2);
                        me.state = '23';
                        break;
                    case '9':
                        me.state = undefined;
                        __resolve(result);
                        return;
                    case '10':
                        me.state = '14';
                        return;
                    case '18':
                        widgets.removeQuestions();
                        me.state = '9';
                        break;
                    case '19':
                        result = {
                            type: 'drakon',
                            evt: evt
                        };
                        me.state = '18';
                        break;
                    case '20':
                        result = {
                            type: 'free',
                            evt: evt
                        };
                        me.state = '18';
                        break;
                    case '21':
                        result = undefined;
                        me.state = '18';
                        break;
                    case '22':
                        _var5 = translate('Cancel');
                        cancel = widgets.createSimpleButton(_var5, me.cancel);
                        cancel.style.marginRight = '0px';
                        buttons = div({
                            'text-align': 'right',
                            'padding-top': '20px'
                        }, cancel);
                        html.add(dialog, buttons);
                        me.state = '10';
                        break;
                    case '23':
                        _var6 = ipath('logo-drakon.png');
                        _var7 = translate('Drakon flowchart');
                        _var8 = translate('A process, procedure, algorithm, behavior, HOW the system works');
                        addDiagramType(dialog, _var6, _var7, _var8, me.drakon);
                        _var12 = ipath('logo-graf.png');
                        _var13 = translate('Mind map');
                        _var14 = translate('Structure, composition, hierarchy, ' + 'ordered notes, what the system CONSISTS OF');
                        addDiagramType(dialog, _var12, _var13, _var14, me.graf);
                        _var9 = ipath('logo-free.png');
                        _var10 = translate('Free-form diagram');
                        _var11 = translate('Boxes and arrows, network diagrams, GUI sketches, GNOME diagrams, no limits');
                        addDiagramType(dialog, _var9, _var10, _var11, me.free);
                        me.state = '22';
                        break;
                    case '32':
                        result = {
                            type: 'graf',
                            evt: evt
                        };
                        me.state = '18';
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
                me.drakon = function (_evt_) {
                    evt = _evt_;
                    switch (me.state) {
                    case '14':
                        me.state = '19';
                        _main_chooseDocumentType(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.free = function (_evt_) {
                    evt = _evt_;
                    switch (me.state) {
                    case '14':
                        me.state = '20';
                        _main_chooseDocumentType(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.graf = function (_evt_) {
                    evt = _evt_;
                    switch (me.state) {
                    case '14':
                        me.state = '32';
                        _main_chooseDocumentType(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '14':
                        me.state = '21';
                        _main_chooseDocumentType(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_chooseDocumentType(__resolve, __reject);
            });
        };
        return me;
    }
    function chooseDocumentType() {
        var __obj = chooseDocumentType_create();
        return __obj.run();
    }
    function addDiagramType(parent, imageSrc, header, description, action) {
        var container, icon, textBlock, containerStyle, headerDiv, descDiv, _var2, _var3, _var4;
        icon = img(imageSrc);
        icon.style.display = 'inline-block';
        icon.style.width = '80px';
        icon.style.verticalAlign = 'middle';
        _var2 = getHeader2Size();
        _var3 = translate(header);
        headerDiv = div({
            'font-weight': 'bold',
            'font-size': _var2,
            'text-align': 'center',
            'padding-bottom': '5px',
            text: _var3
        });
        _var4 = translate(description);
        descDiv = div({
            'text-align': 'center',
            'white-space': 'normal',
            text: _var4,
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
        return;
    }
    function createRegisterScreen(widget, signupSource, onSuccessCallback, goToLogonCallback, onCancel, hideCheckbox) {
        var form, formClass, formStyle, user, email, inputStyle, title, userLab, emailLab, spacer, signupButt, spacer2, error, logon, hasAccount, buttons, cancel, label, check, checkDiv, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12;
        var __state = '10';
        while (true) {
            switch (__state) {
            case '2':
                widget.form = form;
                user.focus();
                __state = '7';
                break;
            case '7':
                return form;
            case '10':
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
                __state = '22';
                break;
            case '14':
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
                __state = '45';
                break;
            case '22':
                _var2 = translate('Create account in');
                _var3 = getHeader1Size();
                title = div({
                    text: _var2 + ' ' + gconfig.appName,
                    'font-weight': 'bold',
                    'font-size': _var3,
                    'text-align': 'center',
                    'margin': '10px'
                });
                _var4 = translate('User name');
                userLab = div({ text: _var4 });
                _var5 = translate('Email');
                emailLab = div({ text: _var5 });
                spacer = div({ height: '20px' });
                spacer2 = div({ height: '10px' });
                error = div({
                    color: 'darkred',
                    'margin-top': '10px'
                });
                widget.error = error;
                __state = '59';
                break;
            case '28':
                buttons = div();
                _var6 = translate('Create account');
                signupButt = widgets.createDefaultButton(_var6, function () {
                    doRegister(widget, signupSource, onSuccessCallback);
                });
                html.add(buttons, signupButt);
                if (onCancel) {
                    _var9 = translate('Cancel');
                    cancel = widgets.createSimpleButton(_var9, onCancel);
                    html.add(buttons, cancel);
                    __state = '14';
                } else {
                    signupButt.style.width = '100%';
                    signupButt.style.textAlign = 'center';
                    __state = '14';
                }
                break;
            case '45':
                if (goToLogonCallback) {
                    _var8 = translate('Already have an account?');
                    hasAccount = div({ text: _var8 });
                    _var7 = translate('Login');
                    logon = widgets.createSimpleButton(_var7, goToLogonCallback);
                    html.add(form, hasAccount);
                    html.add(form, logon);
                    __state = '76';
                } else {
                    __state = '76';
                }
                break;
            case '59':
                checkDiv = div();
                if (gconfig.privacy) {
                    if (hideCheckbox) {
                        __state = '28';
                    } else {
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
                        _var10 = translate('I agree to');
                        html.addText(label, _var10 + ' ');
                        _var12 = translate('the privacy policy');
                        _var11 = widgets.makeLink(gconfig.privacy, _var12, true);
                        html.add(label, _var11);
                        widget.privacyCheck = check;
                        __state = '28';
                    }
                } else {
                    __state = '28';
                }
                break;
            case '76':
                addChangeLanguageBlock(form);
                __state = '2';
                break;
            default:
                return;
            }
        }
    }
    function doRegister_create(widget, signupSource, onSuccessCallback) {
        var user, email, payload, response, settings, error, _var2, _var3, _var4, _var5, _var6, _var7;
        var me = {
            state: '8',
            type: 'doRegister'
        };
        function _main_doRegister(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        settings = getSettingsObj();
                        showWaitBlock();
                        payload = {
                            name: user,
                            email: email,
                            language: settings.language,
                            signup_url: window.location.href,
                            signup_source: signupSource
                        };
                        me.state = '20';
                        sendRequestRaw('POST', '/api/create_user_email', payload).then(function (__returnee) {
                            response = __returnee;
                            _main_doRegister(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '8':
                        html.clear(widget.error);
                        user = widget.user.value.trim();
                        email = widget.email.value.trim();
                        if (user) {
                            if (email) {
                                error = checkProjectName(user);
                                if (error) {
                                    html.addText(widget.error, error);
                                    widget.user.focus();
                                    me.state = '6';
                                } else {
                                    _var5 = checkEmail(email);
                                    if (_var5) {
                                        me.state = '45';
                                    } else {
                                        _var6 = translate('Wrong email format');
                                        html.addText(widget.error, _var6);
                                        widget.email.focus();
                                        me.state = '6';
                                    }
                                }
                            } else {
                                _var3 = translate('Email cannot be empty');
                                html.addText(widget.error, _var3);
                                widget.email.focus();
                                me.state = '6';
                            }
                        } else {
                            _var2 = translate('User name cannot be empty');
                            html.addText(widget.error, _var2);
                            widget.user.focus();
                            me.state = '6';
                        }
                        break;
                    case '20':
                        hideWaitBlock();
                        if (response.status === 200) {
                            onSuccessCallback();
                            me.state = '6';
                        } else {
                            _var4 = translate('Could not create account. ' + 'This user name or email are already in use.');
                            html.addText(widget.error, _var4);
                            me.state = '6';
                        }
                        break;
                    case '45':
                        if (widget.privacyCheck) {
                            if (widget.privacyCheck.checked) {
                                me.state = '2';
                            } else {
                                _var7 = translate('Please agree to the privacy policy');
                                html.addText(widget.error, _var7);
                                me.state = '6';
                            }
                        } else {
                            me.state = '2';
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
                _main_doRegister(__resolve, __reject);
            });
        };
        return me;
    }
    function doRegister(widget, signupSource, onSuccessCallback) {
        var __obj = doRegister_create(widget, signupSource, onSuccessCallback);
        return __obj.run();
    }
    function logonOnEnter(widget, evt, onSuccessCallback) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (evt.key === 'Enter') {
                    doLogon(widget, onSuccessCallback);
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
    function doLogon_create(widget, onSuccessCallback) {
        var user, password, payload, response, _var2, _var3, _var4;
        var me = {
            state: '8',
            type: 'doLogon'
        };
        function _main_doLogon(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        showWaitBlock();
                        payload = {
                            user: user,
                            password: password
                        };
                        me.state = '20';
                        sendRequestRaw('POST', '/api/logon', payload).then(function (__returnee) {
                            response = __returnee;
                            _main_doLogon(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '8':
                        html.clear(widget.error);
                        user = widget.user.value.trim();
                        password = widget.password.value;
                        if (user) {
                            if (password) {
                                me.state = '2';
                            } else {
                                _var3 = translate('Password is empty');
                                html.addText(widget.error, _var3);
                                widget.password.focus();
                                me.state = '6';
                            }
                        } else {
                            _var2 = translate('User name is empty');
                            html.addText(widget.error, _var2);
                            widget.user.focus();
                            me.state = '6';
                        }
                        break;
                    case '20':
                        hideWaitBlock();
                        if (response.status === 200) {
                            if (widget.remain) {
                                html.reload();
                                me.state = '6';
                            } else {
                                onSuccessCallback();
                                me.state = '6';
                            }
                        } else {
                            _var4 = translate('Wrong user name or password');
                            html.addText(widget.error, _var4);
                            me.state = '6';
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
                _main_doLogon(__resolve, __reject);
            });
        };
        return me;
    }
    function doLogon(widget, onSuccessCallback) {
        var __obj = doLogon_create(widget, onSuccessCallback);
        return __obj.run();
    }
    function checkUserName(name) {
        var code, aCode, zCode, zeroCode, nineCode, dot, under, minus, first, last, prev, _var2, i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
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
                    i = 0;
                    __state = '5';
                } else {
                    __state = '17';
                }
                break;
            case '5':
                if (i < name.length) {
                    code = name.charCodeAt(i);
                    _var2 = code;
                    if (_var2 === dot) {
                        __state = '30';
                    } else {
                        if (_var2 === under) {
                            __state = '30';
                        } else {
                            if (_var2 === minus) {
                                __state = '30';
                            } else {
                                if (code >= aCode) {
                                    if (code <= zCode) {
                                        __state = '29';
                                    } else {
                                        __state = '15';
                                    }
                                } else {
                                    __state = '15';
                                }
                            }
                        }
                    }
                } else {
                    __state = '20';
                }
                break;
            case '15':
                if (code >= zeroCode) {
                    if (code <= nineCode) {
                        __state = '29';
                    } else {
                        __state = '17';
                    }
                } else {
                    __state = '17';
                }
                break;
            case '17':
                return false;
            case '20':
                first = name.charCodeAt(0);
                last = name.charCodeAt(name.length - 1);
                if (first === dot) {
                    __state = '27';
                } else {
                    if (last === dot) {
                        __state = '27';
                    } else {
                        if (first === under) {
                            __state = '27';
                        } else {
                            if (last === under) {
                                __state = '27';
                            } else {
                                if (first === minus) {
                                    __state = '27';
                                } else {
                                    if (last === minus) {
                                        __state = '27';
                                    } else {
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case '27':
                return false;
            case '29':
                prev = code;
                i++;
                __state = '5';
                break;
            case '30':
                if (prev === code) {
                    return false;
                } else {
                    __state = '29';
                }
                break;
            default:
                return;
            }
        }
    }
    function checkEmail(email) {
        var parts, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (email) {
                    if (email.length > 100) {
                        __state = '5';
                    } else {
                        parts = email.split('@');
                        if (parts.length === 2) {
                            _var2 = checkUserName(parts[0]);
                            if (_var2) {
                                _var3 = checkUserName(parts[1]);
                                if (_var3) {
                                    return true;
                                } else {
                                    __state = '5';
                                }
                            } else {
                                __state = '5';
                            }
                        } else {
                            __state = '5';
                        }
                    }
                } else {
                    __state = '5';
                }
                break;
            case '5':
                return false;
            default:
                return;
            }
        }
    }
    function onShowConfirmInputChange(input, send) {
        var pin;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                pin = input.value.trim();
                if (pin.length === 6) {
                    send.style.display = 'inline-block';
                    __state = '1';
                } else {
                    send.style.display = 'none';
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function buildShowConfirmUi(email, allowResend, allowCancel, target) {
        var client, input, buttons, send, resend, buttons2, cancel, change, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                client = widgets.createMiddleWindow();
                _var4 = translate('Enter the PIN code sent by email to');
                _var3 = div({
                    text: _var4,
                    padding: '10px'
                });
                html.add(client, _var3);
                _var2 = div({
                    text: email,
                    padding: '10px',
                    'padding-top': '0px',
                    'font-weight': 'bold'
                });
                html.add(client, _var2);
                _var14 = translate('If the email with the PIN is not ' + 'in your inbox, check the "Spam" folder');
                _var13 = div({
                    text: _var14,
                    padding: '10px'
                });
                html.add(client, _var13);
                __state = '20';
                break;
            case '19':
                input.focus();
                return;
            case '20':
                _var5 = translate('PIN-code, 6 digits');
                input = html.createElement('input', {
                    type: 'text',
                    placeholder: _var5
                }, [{
                        margin: '10px',
                        width: 'calc(100% - 20px)'
                    }]);
                html.add(client, input);
                __state = '24';
                break;
            case '24':
                buttons = div({
                    'position': 'relative',
                    'text-align': 'right',
                    'padding-bottom': '5px',
                    'padding-right': '10px',
                    'height': '42px'
                });
                html.add(client, buttons);
                _var6 = translate('Confirm email');
                send = widgets.createDefaultButton(_var6, function () {
                    _var7 = input.value.trim();
                    target.sendPin(_var7);
                });
                send.style.marginRight = '0px';
                send.style.display = 'none';
                html.add(buttons, send);
                registerEvent(input, 'input', function () {
                    onShowConfirmInputChange(input, send);
                });
                __state = '35';
                break;
            case '35':
                if (allowResend) {
                    _var8 = translate('Resend email');
                    resend = widgets.createSimpleButton(_var8, target.resendPin);
                    resend.style.position = 'absolute';
                    resend.style.left = '10px';
                    resend.style.top = '0px';
                    html.add(buttons, resend);
                    __state = '40';
                } else {
                    __state = '40';
                }
                break;
            case '40':
                buttons2 = div({
                    'position': 'relative',
                    'text-align': 'left',
                    'padding': '10px'
                });
                html.add(client, buttons2);
                if (allowCancel) {
                    _var9 = translate('Cancel');
                    cancel = widgets.createSimpleButton(_var9, target.cancel);
                    html.add(buttons2, cancel);
                    __state = '19';
                } else {
                    _var11 = translate('Wrong email?');
                    _var10 = div({ text: _var11 });
                    html.add(buttons2, _var10);
                    _var12 = translate('Change email');
                    change = widgets.createSimpleButton(_var12, target.changeEmail);
                    html.add(buttons2, change);
                    __state = '19';
                }
                break;
            default:
                return;
            }
        }
    }
    function showConfirmEmail_create(email, allowCancel, changeEmail) {
        var response, confirmPayload, allowResend, pin, _var2, _var3, _var4, _var5, _var6, _var7;
        var me = {
            state: '28',
            type: 'showConfirmEmail'
        };
        function _main_showConfirmEmail(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        buildShowConfirmUi(email, allowResend, allowCancel, me);
                        me.state = '10';
                        return;
                    case '18':
                        confirmPayload = { pin: pin };
                        showWaitBlock();
                        me.state = '26';
                        sendRequestRaw('POST', '/api/confirm_email', confirmPayload).then(function (__returnee) {
                            response = __returnee;
                            _main_showConfirmEmail(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '20':
                        allowResend = false;
                        showWaitBlock();
                        me.state = '31';
                        setTimeout(function () {
                            _main_showConfirmEmail(__resolve, __reject);
                        }, 2000);
                        return;
                    case '26':
                        hideWaitBlock();
                        _var2 = http.isSuccess(response);
                        if (_var2) {
                            widgets.removeQuestions();
                            _var7 = translate('Email confirmed');
                            widgets.showGoodSnack(_var7);
                            me.state = undefined;
                            __resolve(true);
                            return;
                        } else {
                            _var3 = translate('Bad PIN');
                            widgets.showErrorSnack(_var3);
                            me.state = '2';
                        }
                        break;
                    case '28':
                        allowResend = true;
                        me.state = '2';
                        break;
                    case '31':
                        me.state = '34';
                        sendRequestRaw('POST', '/api/resend_confirm_email', {}).then(function (__returnee) {
                            response = __returnee;
                            _main_showConfirmEmail(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '34':
                        hideWaitBlock();
                        _var4 = http.isSuccess(response);
                        if (_var4) {
                            _var6 = translate('A new PIN has been sent');
                            widgets.showGoodSnack(_var6);
                            me.state = '2';
                        } else {
                            _var5 = translate('Could not resend PIN');
                            widgets.showErrorSnack(_var5);
                            me.state = '2';
                        }
                        break;
                    case '39':
                        widgets.removeQuestions();
                        me.state = '46';
                        break;
                    case '41':
                        widgets.removeQuestions();
                        me.state = '20';
                        break;
                    case '42':
                        widgets.removeQuestions();
                        me.state = '18';
                        break;
                    case '44':
                        widgets.removeQuestions();
                        changeEmail();
                        me.state = '46';
                        break;
                    case '46':
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
                me.sendPin = function (_pin_) {
                    pin = _pin_;
                    switch (me.state) {
                    case '10':
                        me.state = '42';
                        _main_showConfirmEmail(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.resendPin = function () {
                    switch (me.state) {
                    case '10':
                        me.state = '41';
                        _main_showConfirmEmail(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '10':
                        me.state = '39';
                        _main_showConfirmEmail(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.changeEmail = function () {
                    switch (me.state) {
                    case '10':
                        me.state = '44';
                        _main_showConfirmEmail(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_showConfirmEmail(__resolve, __reject);
            });
        };
        return me;
    }
    function showConfirmEmail(email, allowCancel, changeEmail) {
        var __obj = showConfirmEmail_create(email, allowCancel, changeEmail);
        return __obj.run();
    }
    function createWidget(widget, data) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widget.createStyles) {
                    widget.createStyles();
                    __state = '6';
                } else {
                    __state = '6';
                }
                break;
            case '5':
                return widget;
            case '6':
                if (widget.init) {
                    widget.init(data);
                    __state = '5';
                } else {
                    __state = '5';
                }
                break;
            default:
                return;
            }
        }
    }
    function hideWaitBlock() {
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
    function showWaitBlock() {
        var root, wait, messageStyle, _var2, _var3;
        hideWaitBlock();
        root = html.get('popup-root');
        _var3 = translate('Wait a minute');
        messageStyle = {
            text: _var3,
            background: 'white',
            padding: '20px',
            'user-select': 'none'
        };
        _var2 = div('middle', messageStyle);
        wait = div('full-screen', { 'z-index': 1000 }, _var2);
        html.add(root, wait);
        unit.wait = wait;
        return;
    }
    function createRootElement() {
        var main, rootElement;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.rootElement) {
                    html.remove(unit.rootElement);
                    unit.rootElement = undefined;
                    __state = '5';
                } else {
                    __state = '5';
                }
                break;
            case '5':
                rootElement = div();
                main = html.get('main');
                html.add(main, rootElement);
                unit.rootElement = rootElement;
                setRootStyle();
                return rootElement;
            default:
                return;
            }
        }
    }
    function PanicScreen_redraw(self, container) {
        return;
    }
    function PanicScreen_showPanicMessage(self, message) {
        var central, home, _var2, _var3, _var4, _var5, _var6, _var7, _var8;
        home = function () {
            _var8 = getAppRoot();
            html.goTo(_var8);
        };
        _var2 = div('header1', { text: message });
        _var5 = translate('Reload');
        _var4 = widgets.createDefaultButton(_var5, html.reload);
        _var7 = translate('Home');
        _var6 = widgets.createSimpleButton(_var7, home);
        _var3 = div({
            'padding-top': '20px',
            'text-align': 'center'
        }, _var4, _var6);
        central = div('middle', _var2, _var3);
        html.clear(self.container);
        html.add(self.container, central);
        return;
    }
    function buildWidgetDom(parentElement, widget) {
        var container;
        container = div();
        widget.container = container;
        html.add(parentElement, container);
        widget.redraw(widget.container);
        return container;
    }
    function MultiWidget_init(self, content) {
        var _var3, _var2, _var4, id, child;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                self.children = {};
                self.current = content.current;
                _var3 = content.children;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '9';
                break;
            case '9':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    child = _var3[id];
                    self.children[id] = {
                        widget: child,
                        container: undefined,
                        visible: false
                    };
                    _var4++;
                    __state = '9';
                } else {
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function MultiWidget_onShow(self) {
        var current;
        current = self.children[self.current];
        onShowChildWidget(current);
        return;
    }
    function MultiWidget_onHide(self) {
        var current;
        current = self.children[self.current];
        onHideChildWidget(current);
        return;
    }
    function MultiWidget_getCurrent(self) {
        var _var3, _var2, _var4, id, child;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var3 = self.children;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '6';
                break;
            case '6':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    child = _var3[id];
                    if (id === self.current) {
                        return child.widget;
                    } else {
                        _var4++;
                        __state = '6';
                    }
                } else {
                    throw new Error('getCurrent: current not found');
                }
                break;
            default:
                return;
            }
        }
    }
    function MultiWidget_setCurrent(self, childId) {
        var _var3, _var2, _var4, id, child;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                self.current = childId;
                _var3 = self.children;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '6';
                break;
            case '5':
                _var4++;
                __state = '6';
                break;
            case '6':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    child = _var3[id];
                    if (id === self.current) {
                        if (child.visible) {
                            __state = '5';
                        } else {
                            display(child.container, 'inline-block');
                            onShowChildWidget(child);
                            child.visible = true;
                            __state = '5';
                        }
                    } else {
                        display(child.container, 'none');
                        if (child.visible) {
                            onHideChildWidget(child);
                            child.visible = false;
                            __state = '5';
                        } else {
                            __state = '5';
                        }
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
    function MultiWidget_redraw(self, container) {
        var _var3, _var2, _var4, id, child;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var3 = self.children;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '13';
                break;
            case '13':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    child = _var3[id];
                    child.container = buildWidgetDom(container, child.widget);
                    stretchElement(child.container);
                    _var4++;
                    __state = '13';
                } else {
                    self.setCurrent(self.current);
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function onShowChildWidget(bucket) {
        var onResize;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                callHook(bucket.widget, 'onShow');
                onResize = bucket.widget.onResize;
                if (onResize) {
                    bucket.resizeId = subscribeOnResize(onResize);
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
    function onHideChildWidget(bucket) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                callHook(bucket.widget, 'onHide');
                if (bucket.resizeId) {
                    unsubscribeFromResize(bucket.resizeId);
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
    function makeLogo(onClick) {
        var image, _var2;
        _var2 = ipath(gconfig.logo);
        image = img(_var2);
        image.style.width = '49px';
        image.style.height = '49px';
        image.style.cursor = 'pointer';
        registerEvent(image, 'click', onClick);
        return image;
    }
    function makeTopBar(top, bottom) {
        top.className = 'top-bar';
        bottom.className = 'top-bar-below';
        return;
    }
    function saveLanguage(language) {
        var settings;
        settings = getSettingsFromLocalStorage();
        setLabelsForLanguage(settings, language);
        saveUserSettings(settings);
        location.reload();
        return;
    }
    function addChangeLanguageBlock(form) {
        var changeLanguage, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var3 = getSettingsObj();
                if (_var3.language === 'en-us') {
                    changeLanguage = widgets.createSimpleButton('Русский', function () {
                        saveLanguage('ru');
                    });
                    __state = '_item2';
                } else {
                    changeLanguage = widgets.createSimpleButton('English', function () {
                        saveLanguage('en-us');
                    });
                    __state = '_item2';
                }
                break;
            case '_item2':
                _var2 = div({ height: '30px' });
                html.add(form, _var2);
                html.add(form, changeLanguage);
                return;
            default:
                return;
            }
        }
    }
    function createMenuSection(name, lines) {
        var container, header, body, sep, _var2, _var3, line, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                header = div('main-menu-section-header', { text: name });
                body = div();
                _var2 = lines;
                _var3 = 0;
                __state = '7';
                break;
            case '4':
                return container;
            case '6':
                _var3++;
                __state = '7';
                break;
            case '7':
                if (_var3 < _var2.length) {
                    line = _var2[_var3];
                    if (line === 'separator') {
                        sep = div({ 'border-bottom': 'solid 1px green' });
                        html.add(body, sep);
                        __state = '6';
                    } else {
                        addMainMenuItem(body, line[0], line[1]);
                        __state = '6';
                    }
                } else {
                    container = div('main-menu-section', header, body);
                    _var4 = widgets.isNarrowScreen();
                    if (_var4) {
                        container.style.display = 'block';
                        container.style.marginRight = '5px';
                        __state = '4';
                    } else {
                        __state = '4';
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function addMainMenuItem(parent, text, action) {
        var line, contClass, callback;
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
        return;
    }
    function showMainMenu(client) {
        var container, image, close, _var2, _var3, _var4, _var5;
        _var4 = ipath(gconfig.wideLogo);
        image = img(_var4);
        image.style.height = '49px';
        _var5 = ipath('delete.png');
        close = widgets.createIconButton(_var5, widgets.removePopups);
        close.style.position = 'absolute';
        close.style.right = '5px';
        close.style.top = '5px';
        close.style.margin = '0px';
        _var2 = div('main-menu-top', image, close);
        _var3 = div('main-menu-bottom', client);
        container = div('shadow main-menu', _var2, _var3);
        widgets.pushSemiModalPopup(container, 0, 0);
        container.style.transform = 'translateY(0px)';
        container.style.opacity = 1;
        return;
    }
    function redrawWidgetDom(widget) {
        html.clear(widget.container);
        widget.redraw(widget.container);
        return;
    }
    function setRootStyle() {
        var style;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (unit.rootElement) {
                    style = unit.rootElement.style;
                    style.display = 'inline-block';
                    style.position = 'fixed';
                    style.left = '0px';
                    style.top = '0px';
                    style.overflow = 'hidden';
                    style.width = window.innerWidth + 'px';
                    style.height = window.innerHeight + 'px';
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
    function setTimeout(action, delay, notrace) {
        var timeoutId, callback, id, start;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (notrace) {
                    callback = action;
                    __state = '3';
                } else {
                    id = utils.random(1000, 10000);
                    start = 'timeout-' + id;
                    callback = function (evt) {
                        trace(start, delay);
                        action(evt);
                    };
                    __state = '3';
                }
                break;
            case '3':
                timeoutId = window.setTimeout(callback, delay);
                return timeoutId;
            default:
                return;
            }
        }
    }
    function getTraces() {
        return unit.traces;
    }
    function traceCore(name, value) {
        var bucket, maxTrace;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                console.log('trace', name, value);
                maxTrace = 40;
                if (name) {
                    bucket = {
                        name: name,
                        value: value
                    };
                    unit.traces.push(bucket);
                    if (unit.traces.length > 40) {
                        unit.traces.shift();
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
    function trace(name, value) {
        try {
            traceCore(name, value);
        } catch (ex) {
            console.error('Error in tracing', ex);
        }
        return;
    }
    function registerEvent(element, eventName, action, options) {
        var callback, id, start;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (eventName === 'mousemove') {
                    __state = '10';
                } else {
                    if (eventName === 'touchmove') {
                        __state = '10';
                    } else {
                        if (eventName === 'pointermove') {
                            __state = '10';
                        } else {
                            id = utils.random(1000, 10000);
                            start = 'event-' + id;
                            callback = function (evt) {
                                trace(start, eventName);
                                action(evt);
                            };
                            __state = '6';
                        }
                    }
                }
                break;
            case '6':
                element.addEventListener(eventName, callback, options);
                return;
            case '10':
                callback = action;
                __state = '6';
                break;
            default:
                return;
            }
        }
    }
    function initLoadedFonts() {
        var fonts;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.loadedFonts) {
                    if (unit.fontPaths) {
                        __state = '11';
                    } else {
                        __state = '5';
                    }
                } else {
                    __state = '5';
                }
                break;
            case '5':
                unit.loadedFonts = {};
                unit.fontPaths = {};
                __state = '11';
                break;
            case '11':
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
                return;
            default:
                return;
            }
        }
    }
    function prepareFonts_create() {
        var face;
        var me = {
            state: '2',
            type: 'prepareFonts'
        };
        function _main_prepareFonts(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        face = gconfig.fontFamily;
                        me.state = '1';
                        loadFonts([
                            face + '/normal/normal',
                            face + '/normal/bold'
                        ]).then(function () {
                            _main_prepareFonts(__resolve, __reject);
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
                _main_prepareFonts(__resolve, __reject);
            });
        };
        return me;
    }
    function prepareFonts() {
        var __obj = prepareFonts_create();
        return __obj.run();
    }
    function loadFonts_create(fonts) {
        var path, file, parts, familyParts, style, weight, url, ff, mustRedraw, loaded, family, _var2, _var3, font, _var4;
        var me = {
            state: '2',
            type: 'loadFonts'
        };
        function _main_loadFonts(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        mustRedraw = false;
                        path = gconfig.fontPath;
                        initLoadedFonts();
                        showWaitBlock();
                        _var2 = fonts;
                        _var3 = 0;
                        me.state = '7';
                        break;
                    case '6':
                        _var3++;
                        me.state = '7';
                        break;
                    case '7':
                        if (_var3 < _var2.length) {
                            font = _var2[_var3];
                            if (unit.loadedFonts[font]) {
                                me.state = '6';
                            } else {
                                file = unit.fontPaths[font];
                                if (file) {
                                    mustRedraw = true;
                                    parts = font.split('/');
                                    familyParts = parts[0];
                                    style = parts[1];
                                    weight = parts[2];
                                    _var4 = familyParts.split(',');
                                    family = _var4[0];
                                    url = 'url(' + path + file + ')';
                                    ff = new FontFace(family, url, {
                                        style: style,
                                        weight: weight
                                    });
                                    trace('Loading font', url);
                                    me.state = '33';
                                    ff.load().then(function (__returnee) {
                                        loaded = __returnee;
                                        _main_loadFonts(__resolve, __reject);
                                    }, function (error) {
                                        me.state = undefined;
                                        __reject(error);
                                    });
                                    return;
                                } else {
                                    console.error('Unknown font', font);
                                    me.state = '6';
                                }
                            }
                        } else {
                            hideWaitBlock();
                            me.state = undefined;
                            __resolve(mustRedraw);
                            return;
                        }
                        break;
                    case '33':
                        document.fonts.add(loaded);
                        unit.loadedFonts[font] = true;
                        me.state = '6';
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
                _main_loadFonts(__resolve, __reject);
            });
        };
        return me;
    }
    function loadFonts(fonts) {
        var __obj = loadFonts_create(fonts);
        return __obj.run();
    }
    function PanicScreen() {
        var self = {};
        self.redraw = function (container) {
            return PanicScreen_redraw(self, container);
        };
        self.showPanicMessage = function (message) {
            return PanicScreen_showPanicMessage(self, message);
        };
        return self;
    }
    function MultiWidget() {
        var self = {};
        self.init = function (content) {
            return MultiWidget_init(self, content);
        };
        self.onShow = function () {
            return MultiWidget_onShow(self);
        };
        self.onHide = function () {
            return MultiWidget_onHide(self);
        };
        self.getCurrent = function () {
            return MultiWidget_getCurrent(self);
        };
        self.setCurrent = function (childId) {
            return MultiWidget_setCurrent(self, childId);
        };
        self.redraw = function (container) {
            return MultiWidget_redraw(self, container);
        };
        return self;
    }
    unit.stretchElement = stretchElement;
    unit.ipath = ipath;
    unit.createLogonScreen = createLogonScreen;
    unit.addLabelsToSettings = addLabelsToSettings;
    unit.createSpecialStyles = createSpecialStyles;
    unit.getDiagramLabels = getDiagramLabels;
    unit.initDiagramLabels = initDiagramLabels;
    unit.getLabelsByCode = getLabelsByCode;
    unit.setLabelsForLanguage = setLabelsForLanguage;
    unit.loadStringsForLanguage_create = loadStringsForLanguage_create;
    unit.loadStringsForLanguage = loadStringsForLanguage;
    unit.translate = translate;
    unit.setStrings = setStrings;
    unit.subscribeOnResize = subscribeOnResize;
    unit.invokeWindowResize = invokeWindowResize;
    unit.unsubscribeFromResize = unsubscribeFromResize;
    unit.checkProjectName = checkProjectName;
    unit.copyIfMissing = copyIfMissing;
    unit.buildUrlForFolder = buildUrlForFolder;
    unit.removeTagsFromRedirect = removeTagsFromRedirect;
    unit.importDiagram_create = importDiagram_create;
    unit.importDiagram = importDiagram;
    unit.saveAsPng = saveAsPng;
    unit.saveAsSvg = saveAsSvg;
    unit.generateRandomString = generateRandomString;
    unit.isNetworkError = isNetworkError;
    unit.checkDiagram = checkDiagram;
    unit.getQuery = getQuery;
    unit.stripTags = stripTags;
    unit.saveAsJson = saveAsJson;
    unit.downloadTextDataAsFile = downloadTextDataAsFile;
    unit.downloadImageDataAsFile = downloadImageDataAsFile;
    unit.setTitle = setTitle;
    unit.getAppRoot = getAppRoot;
    unit.initShortcuts = initShortcuts;
    unit.main = main;
    unit.sendRequestWithCheck_create = sendRequestWithCheck_create;
    unit.sendRequestWithCheck = sendRequestWithCheck;
    unit.getAccountObj = getAccountObj;
    unit.isLoggedOn = isLoggedOn;
    unit.sendRequestRaw_create = sendRequestRaw_create;
    unit.sendRequestRaw = sendRequestRaw;
    unit.fetchAccount_create = fetchAccount_create;
    unit.fetchAccount = fetchAccount;
    unit.getSettingsObj = getSettingsObj;
    unit.saveUserSettings = saveUserSettings;
    unit.fetchUserSettings_create = fetchUserSettings_create;
    unit.fetchUserSettings = fetchUserSettings;
    unit.removeLoading = removeLoading;
    unit.chooseDocumentType_create = chooseDocumentType_create;
    unit.chooseDocumentType = chooseDocumentType;
    unit.createRegisterScreen = createRegisterScreen;
    unit.checkEmail = checkEmail;
    unit.showConfirmEmail_create = showConfirmEmail_create;
    unit.showConfirmEmail = showConfirmEmail;
    unit.createWidget = createWidget;
    unit.hideWaitBlock = hideWaitBlock;
    unit.showWaitBlock = showWaitBlock;
    unit.createRootElement = createRootElement;
    unit.buildWidgetDom = buildWidgetDom;
    unit.makeLogo = makeLogo;
    unit.makeTopBar = makeTopBar;
    unit.createMenuSection = createMenuSection;
    unit.showMainMenu = showMainMenu;
    unit.redrawWidgetDom = redrawWidgetDom;
    unit.setTimeout = setTimeout;
    unit.getTraces = getTraces;
    unit.trace = trace;
    unit.registerEvent = registerEvent;
    unit.prepareFonts_create = prepareFonts_create;
    unit.prepareFonts = prepareFonts;
    unit.loadFonts_create = loadFonts_create;
    unit.loadFonts = loadFonts;
    unit.PanicScreen = PanicScreen;
    unit.MultiWidget = MultiWidget;
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
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = dh2common;
}