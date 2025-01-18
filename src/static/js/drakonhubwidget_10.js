function drakonhubwidget_10() {
    var unit = {};
    var utils, widgets, drakon_canvas, html, tracing, gconfig;
    function getQuillContent(contentDiv) {
        var first, serializer, rawHtml, _var2;
        first = contentDiv.childNodes[0];
        trimEnd(first);
        serializer = new XMLSerializer();
        rawHtml = serializer.serializeToString(first);
        _var2 = stripRootNode(rawHtml);
        return _var2;
    }
    function buildFontCode(font) {
        var style, weight;
        style = font.style || 'normal';
        weight = font.weight || 'normal';
        return font.family + '/' + style + '/' + weight;
    }
    function addColorIcon(container, color, action) {
        var icon;
        icon = buildColorIcon(color);
        icon.style.marginRight = '2px';
        registerEvent(icon, 'click', action);
        html.add(container, icon);
        return;
    }
    function checkCanBeGoodFilename(name, tr) {
        var error, sanitized;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                name = name.trim();
                error = nameNotEmpty(name, tr);
                if (error) {
                    __state = '6';
                } else {
                    sanitized = utils.sanitizeFilename(name);
                    if (sanitized) {
                        return undefined;
                    } else {
                        error = tr('A name must contain normal characters, too');
                        __state = '6';
                    }
                }
                break;
            case '6':
                return error;
            default:
                return;
            }
        }
    }
    function DrakonHubWidget_hasUnsavedChanges(self) {
        if (self.quill) {
            return self.quillDirty;
        } else {
            return false;
        }
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
    function registerEvent(element, eventName, action) {
        tracing.registerEvent(element, eventName, action);
        return;
    }
    function createQuillEditor(container, ro) {
        var toolbarOptions, quill, options;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                container.style.userSelect = 'auto';
                toolbarOptions = [
                    [
                        'bold',
                        'italic'
                    ],
                    [
                        { 'list': 'ordered' },
                        { 'list': 'bullet' }
                    ],
                    ['clean']
                ];
                options = {
                    theme: 'snow',
                    formats: [
                        'bold',
                        'italic',
                        'list'
                    ],
                    modules: { toolbar: toolbarOptions }
                };
                if (ro) {
                    options.readOnly = true;
                    __state = '4';
                } else {
                    __state = '4';
                }
                break;
            case '4':
                quill = new Quill(container, options);
                return quill;
            default:
                return;
            }
        }
    }
    function editHtmlKeyEvents(machine, event) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (event.key === 'Escape') {
                    machine.cancel();
                    __state = '1';
                } else {
                    if (event.key === 'Enter') {
                        if (event.ctrlKey) {
                            __state = '9';
                        } else {
                            if (event.metaKey) {
                                __state = '9';
                            } else {
                                __state = '1';
                            }
                        }
                    } else {
                        __state = '1';
                    }
                }
                break;
            case '9':
                event.stopPropagation();
                machine.save();
                __state = '1';
                break;
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
    function editHtml_create(left, top, header, oldContent, ro, path, tr) {
        var dialog, contentDiv, quill, result, buttonsDiv, cancel, ok, hint, popup, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9;
        var me = {
            state: '2',
            type: 'editHtml'
        };
        function _main_editHtml(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        _var7 = widgets.isMobileDevice();
                        if (_var7) {
                            popup = div('shadow', { background: 'white' });
                            popup.style.border = 'solid 1px ' + unit.darkColor;
                            widgets.pushSemiModalPopup(popup, 0, 0, undefined, true);
                            dialog = {
                                popup: popup,
                                client: popup
                            };
                            me.state = '4';
                        } else {
                            _var2 = tr(header);
                            dialog = widgets.createMovablePopup(_var2, left, top, path, true);
                            me.state = '4';
                        }
                        break;
                    case '4':
                        contentDiv = div('quill_editor', {
                            width: '400px',
                            'max-width': '100vw',
                            height: '300px',
                            'overflow-y': 'auto',
                            'line-height': 1.3
                        });
                        _var9 = widgets.isMobileDevice();
                        if (_var9) {
                            contentDiv.style.height = '200px';
                            me.state = '14';
                        } else {
                            me.state = '14';
                        }
                        break;
                    case '14':
                        html.add(dialog.client, contentDiv);
                        me.state = '41';
                        break;
                    case '27':
                        me.state = '34';
                        return;
                    case '28':
                        registerEvent(dialog.popup, 'keydown', function (evt) {
                            editHtmlKeyEvents(me, evt);
                        }, true);
                        drakon_canvas.addHtmltoDom(oldContent, contentDiv);
                        quill = createQuillEditor(contentDiv, ro);
                        _var8 = widgets.isMobileDevice();
                        if (_var8) {
                            me.state = '53';
                        } else {
                            widgets.positionPopup(dialog.popup, left, top - 80);
                            me.state = '53';
                        }
                        break;
                    case '35':
                        result = getQuillContent(contentDiv);
                        if (result.length > 2000) {
                            _var6 = tr('Text is too long');
                            widgets.showErrorSnack(_var6);
                            me.state = '27';
                        } else {
                            widgets.removePopups();
                            me.state = undefined;
                            __resolve(result);
                            return;
                        }
                        break;
                    case '39':
                        widgets.removePopups();
                        me.state = undefined;
                        __resolve(undefined);
                        return;
                    case '41':
                        buttonsDiv = div({
                            'text-align': 'right',
                            'padding-bottom': '5px',
                            'padding-top': '5px',
                            'position': 'relative'
                        });
                        html.add(dialog.client, buttonsDiv);
                        if (ro) {
                            me.state = '_item3';
                        } else {
                            _var5 = tr('Ctrl+Enter to save');
                            hint = div('middle-v', {
                                left: '10px',
                                color: 'gray',
                                text: _var5
                            });
                            html.add(buttonsDiv, hint);
                            _var4 = tr('Save');
                            ok = widgets.createDefaultButton(_var4, me.save);
                            html.add(buttonsDiv, ok);
                            me.state = '_item3';
                        }
                        break;
                    case '53':
                        quill.focus();
                        if (ro) {
                            me.state = '54';
                            return;
                        } else {
                            me.state = '27';
                        }
                        break;
                    case '55':
                        widgets.removePopups();
                        me.state = undefined;
                        __resolve(undefined);
                        return;
                    case '_item3':
                        _var3 = tr('Cancel');
                        cancel = widgets.createSimpleButton(_var3, me.cancel);
                        html.add(buttonsDiv, cancel);
                        me.state = '28';
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
                me.save = function () {
                    switch (me.state) {
                    case '34':
                        me.state = '35';
                        _main_editHtml(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '34':
                        me.state = '39';
                        _main_editHtml(__resolve, __reject);
                        break;
                    case '54':
                        me.state = '55';
                        _main_editHtml(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_editHtml(__resolve, __reject);
            });
        };
        return me;
    }
    function editHtml(left, top, header, oldContent, ro, path, tr) {
        var __obj = editHtml_create(left, top, header, oldContent, ro, path, tr);
        return __obj.run();
    }
    function setTimeout(action, delay, notrace) {
        var _var2;
        _var2 = tracing.setTimeout(action, delay, notrace);
        return _var2;
    }
    function getHeader2Size() {
        return gconfig.fontSize + 2 + 'px';
    }
    function trimEnd(node) {
        var last, content;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                __state = '9';
                break;
            case '8':
                html.remove(last);
                __state = '9';
                break;
            case '9':
                if (node.childNodes.length === 0) {
                    __state = '1';
                } else {
                    last = node.childNodes[node.childNodes.length - 1];
                    content = last.innerHTML.trim();
                    if (content) {
                        if (content === '<br>') {
                            __state = '8';
                        } else {
                            __state = '1';
                        }
                    } else {
                        __state = '8';
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function createStyles() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.stylesInitialized) {
                    __state = '11';
                } else {
                    unit.stylesInitialized = true;
                    html.addClass('.drakonhubwidget-buttons-container', 'display:inline-block', 'height:100%', 'width: 100px', 'left:0px', 'top:0px', 'user-select: none', 'cursor: default', 'white-space: nowrap', 'background: white', 'vertical-align:top', 'padding-left:3px', 'padding-top:2px', 'scrollbar-width: thin', 'overflow-y: auto', 'overflow-x: hidden', 'border-right: solid 1px #c0c0c0');
                    html.addClass('.drakonhubwidget-diagram-container', 'display:inline-block', 'position:absolute', 'height:100%', 'width: calc(100% - 100px)', 'left:100px', 'top:0px', 'user-select: none', 'cursor: default', 'white-space: nowrap', 'background: orange');
                    html.addClass('.drakonhubwidget-buttons-container::-webkit-scrollbar', 'width: 8px');
                    html.addClass('.drakonhubwidget-buttons-container::-webkit-scrollbar-track', 'display: none');
                    html.addClass('.drakonhubwidget-buttons-container::-webkit-scrollbar-thumb', 'background: #97D3E1', 'border-radius:4px');
                    __state = '12';
                }
                break;
            case '11':
                return;
            case '12':
                html.addClass('.quill_editor, .quill_editor *', 'user-select: auto');
                html.addClass('.quill_editor strong', 'font-weight: bold');
                html.addClass('.quill_editor em', 'font-style: italic');
                html.addClass('.quill_editor ul', 'list-style-type: disc', 'list-style-position: inside');
                html.addClass('.quill_editor ol', 'list-style-type: decimal', 'list-style-position: inside');
                __state = '11';
                break;
            default:
                return;
            }
        }
    }
    function copyFieldsIfMissing(dst, src) {
        var _var3, _var2, _var4, key, value, _var5;
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
                    key = _var2[_var4];
                    value = _var3[key];
                    _var5 = utils.hasValue(dst[key]);
                    if (_var5) {
                        __state = '4';
                    } else {
                        dst[key] = value;
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
    function stripRootNode(html) {
        var first, last, _var2;
        first = html.indexOf('<', 1);
        last = utils.findFromEnd(html, '>', 1);
        _var2 = html.substring(first, last + 1);
        return _var2;
    }
    function DrakonHubWidget_setDiagram_create(self, diagram, userSettings) {
        var fonts, originalPushEdit, _var2;
        var me = {
            state: '2',
            type: 'DrakonHubWidget_setDiagram'
        };
        function _main_DrakonHubWidget_setDiagram(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        tracing.trace('setDiagram', [
                            diagram.id,
                            diagram.tag,
                            diagram.type,
                            diagram.name
                        ], diagram);
                        stopEditSender(self);
                        self.diagramId = diagram.id;
                        self.diagram = diagram;
                        self.type = diagram.type;
                        self.userSettings = userSettings;
                        self.sender = self.widgetSettings.createEditSender(diagram, self.indicator);
                        originalPushEdit = self.sender.pushEdit;
                        self.sender.pushEdit = function (edit) {
                            _var2 = detectDescChange(self, edit);
                            originalPushEdit(_var2);
                        };
                        rebuildToolbar(self);
                        layoutView(self);
                        me.state = '48';
                        self.drakon.setDiagram(diagram.id, diagram, self.sender).then(function (__returnee) {
                            fonts = __returnee;
                            _main_DrakonHubWidget_setDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '48':
                        me.state = '51';
                        loadFonts(self, fonts).then(function () {
                            _main_DrakonHubWidget_setDiagram(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '51':
                        if (self.showDesc) {
                            fillDesc(self);
                            me.state = '1';
                        } else {
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
                _main_DrakonHubWidget_setDiagram(__resolve, __reject);
            });
        };
        return me;
    }
    function DrakonHubWidget_setDiagram(self, diagram, userSettings) {
        var __obj = DrakonHubWidget_setDiagram_create(self, diagram, userSettings);
        return __obj.run();
    }
    function ComplexButton_enable(self) {
        self.enabledButton.style.display = 'inline-block';
        self.disabledButton.style.display = 'none';
        return;
    }
    function ComplexButton_disable(self) {
        self.enabledButton.style.display = 'none';
        self.disabledButton.style.display = 'inline-block';
        return;
    }
    function createComplexButton(parent, text, action, color, background) {
        var button, container;
        button = ComplexButton();
        container = div({
            display: 'inline-block',
            'vertical-align': 'bottom'
        });
        html.add(parent, container);
        button.enabledButton = widgets.createSimpleButton(text, action, color, background);
        button.disabledButton = div({
            display: 'inline-block',
            text: text,
            'padding-left': '10px',
            'padding-right': '10px',
            'border-radius': '3px',
            'line-height': '34px',
            'border': 'solid 1px grey',
            cursor: 'default',
            color: 'white',
            background: 'grey'
        });
        html.add(container, button.disabledButton);
        html.add(container, button.enabledButton);
        button.enable();
        return button;
    }
    function DrakonHubWidget_onResize(self) {
        layoutRedraw(self);
        return;
    }
    function DrakonHubWidget_onHide(self) {
        stopEditSender(self);
        self.diagram = undefined;
        return;
    }
    function DrakonHubWidget_cutSelection(self) {
        self.drakon.cutSelection();
        return;
    }
    function DrakonHubWidget_onChange(self, change) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (self.diagram) {
                    if (self.diagram.id === change.id) {
                        self.drakon.onChange(change);
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
    function DrakonHubWidget_showPaste(self) {
        self.drakon.showPaste();
        return;
    }
    function saveDescription(widget) {
        var desc, canwidget, tr, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                tr = widget.widgetSettings.translate;
                desc = getQuillContent(widget.editorDiv);
                if (desc.length > 5000) {
                    _var2 = tr('Text is too long');
                    widgets.showErrorSnack(_var2);
                    __state = '1';
                } else {
                    canwidget = getCanvasWidget(widget);
                    canwidget.setDiagramProperty('description', desc);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function toggleDescription(widget) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (widget.showDesc) {
                    hideDescription(widget);
                    __state = '1';
                } else {
                    showDescription(widget);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function hideDescription(widget) {
        widget.showDesc = false;
        layoutRedraw(widget);
        return;
    }
    function fillDesc(widget) {
        var props, canwidget;
        canwidget = getCanvasWidget(widget);
        props = canwidget.getDiagramProperties();
        fillDescCore(widget, props.description);
        return;
    }
    function fillDescCore(widget, desc) {
        var edit, close, face, font, tr, path, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                html.clear(widget.descBottom);
                html.clear(widget.descButtons);
                if (widget.diagram) {
                    if (widget.diagram.access === 'read') {
                        __state = '_item3';
                    } else {
                        _var2 = tr('Edit');
                        edit = widgets.createIconButton(path + 'description.png', function () {
                            startEditDescription(widget);
                        }, _var2);
                        edit.style.marginTop = '5px';
                        edit.style.marginRight = '5px';
                        html.add(widget.descButtons, edit);
                        __state = '_item3';
                    }
                } else {
                    __state = '11';
                }
                break;
            case '11':
                return;
            case '12':
                widget.descBottom.style.padding = '10px';
                widget.descBottom.style.overflowY = 'auto';
                if (desc) {
                    face = getFontFace();
                    font = gconfig.fontSize + 'px ' + face;
                    drakon_canvas.addHtmltoDom(desc, widget.descBottom, {}, font, true);
                    __state = '25';
                } else {
                    __state = '25';
                }
                break;
            case '25':
                widget.quill = undefined;
                __state = '11';
                break;
            case '_item3':
                _var3 = tr('Close');
                close = widgets.createSimpleButton(_var3, function () {
                    hideDescription(widget);
                });
                close.style.marginTop = '5px';
                close.style.lineHeight = '38px';
                html.add(widget.descButtons, close);
                __state = '12';
                break;
            default:
                return;
            }
        }
    }
    function showDescPopup_create(widget) {
        var newDesc, props, canwidget, ro, tr, path;
        var me = {
            state: '2',
            type: 'showDescPopup'
        };
        function _main_showDescPopup(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        tr = widget.widgetSettings.translate;
                        path = widget.widgetSettings.imagePath;
                        canwidget = getCanvasWidget(widget);
                        props = canwidget.getDiagramProperties();
                        ro = canwidget.isReadonly();
                        me.state = '8';
                        editHtml(0, 0, '', props.description, ro, path, tr).then(function (__returnee) {
                            newDesc = __returnee;
                            _main_showDescPopup(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '8':
                        if (newDesc === undefined) {
                            me.state = '1';
                        } else {
                            canwidget.setDiagramProperty('description', newDesc);
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
                _main_showDescPopup(__resolve, __reject);
            });
        };
        return me;
    }
    function showDescPopup(widget) {
        var __obj = showDescPopup_create(widget);
        return __obj.run();
    }
    function buildDescDiv(widget, width) {
        var container, top, bottom, tr, path, buttons, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                container = div({
                    display: 'inline-block',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: width + 'px',
                    height: '100%',
                    background: 'white',
                    'border-right': 'solid 1px #a0a0a0'
                });
                _var3 = tr('Description');
                _var2 = div({
                    text: _var3,
                    'font-weight': 'bold',
                    'line-height': '49px',
                    'margin-left': '10px'
                });
                top = div({
                    'position': 'relative',
                    'border-bottom': 'solid 1px #a0a0a0',
                    'height': '50px'
                }, _var2);
                buttons = div({
                    display: 'inline-block',
                    position: 'absolute',
                    'height': '49px',
                    'right': '0px',
                    'top': '0px'
                });
                bottom = div('quill_editor', {
                    'height': 'calc(100% - 50px)',
                    'user-select': 'text',
                    'white-space': 'normal',
                    'cursor': 'auto'
                });
                html.add(top, buttons);
                html.add(container, top);
                html.add(container, bottom);
                __state = '5';
                break;
            case '4':
                return container;
            case '5':
                widget.descButtons = buttons;
                widget.descBottom = bottom;
                __state = '4';
                break;
            default:
                return;
            }
        }
    }
    function showDescription(widget) {
        var _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                _var2 = widgets.isNarrowScreen();
                if (_var2) {
                    showDescPopup(widget);
                    __state = '1';
                } else {
                    widget.showDesc = true;
                    layoutRedraw(widget);
                    fillDesc(widget);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function detectDescChange(widget, edit) {
        var desc, _var2, _var3, change;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = edit.changes;
                _var3 = 0;
                __state = '6';
                break;
            case '5':
                _var3++;
                __state = '6';
                break;
            case '6':
                if (_var3 < _var2.length) {
                    change = _var2[_var3];
                    if (change.id) {
                        __state = '5';
                    } else {
                        if ('description' in change.fields) {
                            desc = change.fields.description;
                            __state = '10';
                        } else {
                            __state = '5';
                        }
                    }
                } else {
                    __state = '9';
                }
                break;
            case '9':
                return edit;
            case '10':
                if (widget.showDesc) {
                    fillDescCore(widget, desc);
                    __state = '9';
                } else {
                    __state = '9';
                }
                break;
            default:
                return;
            }
        }
    }
    function startEditDescription(widget) {
        var save, cancel, tr, path, canwidget, props, desc, quill, face, font, editorDiv, _var2, _var3;
        var __state = '6';
        while (true) {
            switch (__state) {
            case '4':
                return;
            case '6':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                html.clear(widget.descButtons);
                _var2 = tr('Save');
                save = widgets.createDefaultButton(_var2, function () {
                    saveDescription(widget);
                });
                save.style.marginTop = '5px';
                save.style.marginRight = '5px';
                save.style.lineHeight = '38px';
                html.add(widget.descButtons, save);
                _var3 = tr('Cancel');
                cancel = widgets.createSimpleButton(_var3, function () {
                    fillDesc(widget);
                });
                cancel.style.marginTop = '5px';
                cancel.style.lineHeight = '38px';
                html.add(widget.descButtons, cancel);
                __state = '16';
                break;
            case '16':
                html.clear(widget.descBottom);
                widget.descBottom.style.padding = '0px';
                widget.descBottom.style.overflowY = 'hidden';
                editorDiv = div({ height: '100%' });
                widget.editorDiv = editorDiv;
                html.add(widget.descBottom, editorDiv);
                canwidget = getCanvasWidget(widget);
                props = canwidget.getDiagramProperties();
                desc = props.description || '';
                face = getFontFace();
                font = gconfig.fontSize + 'px ' + face;
                drakon_canvas.addHtmltoDom(desc, editorDiv, {}, font);
                quill = createQuillEditor(editorDiv, false);
                quill.focus();
                widget.quill = quill;
                quill.on('text-change', function () {
                    widget.quillDirty = true;
                });
                __state = '4';
                break;
            default:
                return;
            }
        }
    }
    function DrakonHubWidget_exportJson(self) {
        var json;
        json = self.drakon.exportJson();
        return json;
    }
    function makeGroupStart(icon) {
        var style;
        style = icon.style;
        style.marginLeft = '5px';
        style.borderRadius = '3px 0px 0px 3px';
        return;
    }
    function makeGroupEnd(icon) {
        var style;
        style = icon.style;
        style.borderRadius = '0px 3px 3px 0px';
        style.borderRight = 'solid 1px grey';
        return;
    }
    function addBoolIcon(parent, image, value, onChange) {
        var icon, background, cssStyle;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value) {
                    background = 'grey';
                    __state = '8';
                } else {
                    background = 'white';
                    __state = '8';
                }
                break;
            case '8':
                cssStyle = {
                    display: 'inline-block',
                    width: '32px',
                    height: '32px',
                    border: 'solid 1px grey',
                    background: background,
                    'border-right': 'none',
                    'vertical-align': 'bottom',
                    'user-select': 'none',
                    'cursor': 'pointer'
                };
                icon = html.createElement('img', {
                    src: image,
                    draggable: false
                }, [cssStyle]);
                html.add(parent, icon);
                registerEvent(icon, 'click', function () {
                    onChange(!value);
                });
                return icon;
            default:
                return;
            }
        }
    }
    function setItalicFont(context, prop, value) {
        var style, font;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value) {
                    style = 'italic';
                    __state = '6';
                } else {
                    style = '';
                    __state = '6';
                }
                break;
            case '6':
                context[prop].style = style;
                font = drakon_canvas.cssFontToString(context[prop]);
                changeStyleProperty(context, prop, font);
                return;
            default:
                return;
            }
        }
    }
    function setFontFamily(context, prop, family) {
        var font;
        context[prop].family = family;
        font = drakon_canvas.cssFontToString(context[prop]);
        changeStyleProperty(context, prop, font);
        return;
    }
    function getThicknessValues() {
        return [
            '0 px',
            '1 px',
            '2 px',
            '3 px',
            '4 px',
            '5 px'
        ];
    }
    function setBorderThickness(context, value, align) {
        var borderWidth;
        borderWidth = parseInt(value);
        changeStyleProperty(context, 'borderWidth', borderWidth);
        return;
    }
    function addBoolControl(context, section, prop, header) {
        var checked;
        checked = !!context.oldStyle[prop];
        addBoolControlGeneric(section, header, checked, function (checked) {
            changeStyleProperty(context, 'centerContent', checked);
        });
        return;
    }
    function onColorInput(currentContainer, input, apply, chooseColor) {
        var value, decoded, _var2, _var3, _var4, _var5;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                value = input.value.trim();
                if (value) {
                    value = value.toLowerCase();
                    decoded = unit.webColors[value];
                    if (decoded) {
                        value = '#' + decoded;
                        __state = '13';
                    } else {
                        if (value.length === 7) {
                            if (value[0] === '#') {
                                _var5 = isHex(value, 1);
                                if (_var5) {
                                    __state = '13';
                                } else {
                                    __state = '16';
                                }
                            } else {
                                __state = '16';
                            }
                        } else {
                            __state = '16';
                        }
                    }
                } else {
                    html.clear(currentContainer);
                    _var2 = chooseColor('');
                    addColorIcon(currentContainer, '', _var2);
                    apply.enable();
                    __state = '1';
                }
                break;
            case '13':
                html.clear(currentContainer);
                _var3 = chooseColor(value);
                addColorIcon(currentContainer, value, _var3);
                apply.enable();
                __state = '1';
                break;
            case '16':
                html.clear(currentContainer);
                _var4 = chooseColor('');
                addColorIcon(currentContainer, '', _var4);
                apply.disable();
                __state = '1';
                break;
            default:
                return;
            }
        }
    }
    function addEmptyIcon(container) {
        var icon;
        icon = buildColorIcon('');
        icon.style.marginRight = '2px';
        html.add(container, icon);
        icon.style.cursor = 'default';
        return;
    }
    function getColorPaletteData() {
        var palette, colors;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.palette) {
                    __state = '12';
                } else {
                    palette = {
                        recent: [],
                        lines: []
                    };
                    palette.lines.push([
                        '#ff0000',
                        'orange',
                        'yellow',
                        '#B6FF00',
                        '#00ff00',
                        'green',
                        '#0000FF',
                        '#4800FF',
                        '#FF00ff'
                    ]);
                    palette.lines.push([
                        '#ffffff',
                        '#f5f5f5',
                        '#ebebeb',
                        '#e1e1e1',
                        '#d7d7d7',
                        '#cdcdcd',
                        '#c3c3c3',
                        '#bababa',
                        '#b0b0b0'
                    ]);
                    palette.lines.push([
                        '#b0b0b0',
                        '#989898',
                        '#818181',
                        '#6a6a6a',
                        '#545454',
                        '#404040',
                        '#2c2c2c',
                        '#191919',
                        '#000000'
                    ]);
                    palette.lines.push([
                        '#cfd8dc',
                        '#b5c2c8',
                        '#9cacb4',
                        '#8496a0',
                        '#6e818b',
                        '#5a6d76',
                        '#475861',
                        '#36454d',
                        '#273238'
                    ]);
                    palette.lines.push([
                        '#ffccbd',
                        '#ffb8a0',
                        '#ffa384',
                        '#ff8d67',
                        '#f8784f',
                        '#ee653a',
                        '#e15327',
                        '#d24317',
                        '#bf360c'
                    ]);
                    palette.lines.push([
                        '#fff9c5',
                        '#fff196',
                        '#ffe875',
                        '#ffdd5d',
                        '#ffd34a',
                        '#fec83c',
                        '#fcbe31',
                        '#fbb32a',
                        '#f9a825'
                    ]);
                    palette.lines.push([
                        '#f0f4c3',
                        '#e2e599',
                        '#d3d679',
                        '#c4c65e',
                        '#b5b648',
                        '#a7a637',
                        '#9a9629',
                        '#8d871e',
                        '#817717'
                    ]);
                    palette.lines.push([
                        '#c8e7c9',
                        '#add9ab',
                        '#93ca90',
                        '#7cbb77',
                        '#68ab61',
                        '#569b4d',
                        '#478a3b',
                        '#3b7a2b',
                        '#33691e'
                    ]);
                    palette.lines.push([
                        '#00ff00',
                        '#1adb10',
                        '#22b917',
                        '#259819',
                        '#247719',
                        '#205917',
                        '#1b3c14',
                        '#13210e',
                        '#000000'
                    ]);
                    palette.lines.push([
                        '#b2ebf2',
                        '#97dfea',
                        '#7dd2e0',
                        '#64c5d6',
                        '#4cb8ca',
                        '#35abbd',
                        '#1f9eae',
                        '#0a919f',
                        '#00838f'
                    ]);
                    palette.lines.push([
                        '#bbdffb',
                        '#9fcef5',
                        '#85bded',
                        '#6babe4',
                        '#529ad8',
                        '#3b89cb',
                        '#2478bd',
                        '#0f67ad',
                        '#02569b'
                    ]);
                    palette.lines.push([
                        '#0026ff',
                        '#1a23db',
                        '#2220b9',
                        '#251d98',
                        '#241a77',
                        '#201659',
                        '#1b123c',
                        '#140b21',
                        '#000000'
                    ]);
                    palette.lines.push([
                        '#ff0000',
                        '#dc1205',
                        '#bb1909',
                        '#9a1b0b',
                        '#7a1b0c',
                        '#5c190b',
                        '#3f1508',
                        '#250f04',
                        '#000000'
                    ]);
                    palette.lines.push([
                        '#ff4500',
                        '#dc3e07',
                        '#ba370b',
                        '#9a300d',
                        '#7a290e',
                        '#5c220e',
                        '#3f1a0b',
                        '#241106',
                        '#000000'
                    ]);
                    palette.lines.push([
                        '#ffa500',
                        '#dc8f0c',
                        '#ba7912',
                        '#996414',
                        '#795014',
                        '#5a3c13',
                        '#3d2a11',
                        '#23180a',
                        '#000000'
                    ]);
                    palette.lines.push([
                        '#DFFF00',
                        '#FFBF00',
                        '#FF7F50',
                        '#DE3163',
                        '#9FE2BF',
                        '#40E0D0',
                        '#6495ED',
                        '#CCCCFF',
                        '#b3d9de'
                    ]);
                    palette.lines.push([
                        '#006400',
                        '#347c17',
                        '#8ac209',
                        '#b8ea85',
                        '#00237a',
                        '#fae6b1',
                        '#79a2b3',
                        '#968770',
                        '#7c6a5a'
                    ]);
                    palette.lines.push([
                        '#ffa101',
                        '#ff6400',
                        '#b3dee5',
                        '#31525b',
                        '#d8daf3',
                        '#a7b2ed',
                        '#7588d9',
                        '#525288',
                        '#2c254a'
                    ]);
                    unit.palette = palette;
                    __state = '12';
                }
                break;
            case '11':
                unit.webColors = colors;
                return unit.palette;
            case '12':
                colors = {};
                addWebColor(colors, 'AliceBlue', 'F0F8FF');
                addWebColor(colors, 'AntiqueWhite', 'FAEBD7');
                addWebColor(colors, 'Aqua', '00FFFF');
                addWebColor(colors, 'Aquamarine', '7FFFD4');
                addWebColor(colors, 'Azure', 'F0FFFF');
                addWebColor(colors, 'Beige', 'F5F5DC');
                addWebColor(colors, 'Bisque', 'FFE4C4');
                addWebColor(colors, 'Black', '000000');
                addWebColor(colors, 'BlanchedAlmond', 'FFEBCD');
                addWebColor(colors, 'Blue', '0000FF');
                addWebColor(colors, 'BlueViolet', '8A2BE2');
                addWebColor(colors, 'Brown', 'A52A2A');
                addWebColor(colors, 'BurlyWood', 'DEB887');
                addWebColor(colors, 'CadetBlue', '5F9EA0');
                addWebColor(colors, 'Chartreuse', '7FFF00');
                addWebColor(colors, 'Chocolate', 'D2691E');
                addWebColor(colors, 'Coral', 'FF7F50');
                addWebColor(colors, 'CornflowerBlue', '6495ED');
                addWebColor(colors, 'Cornsilk', 'FFF8DC');
                addWebColor(colors, 'Crimson', 'DC143C');
                addWebColor(colors, 'Cyan', '00FFFF');
                addWebColor(colors, 'DarkBlue', '00008B');
                addWebColor(colors, 'DarkCyan', '008B8B');
                addWebColor(colors, 'DarkGoldenrod', 'B8860B');
                addWebColor(colors, 'DarkGray', 'A9A9A9');
                addWebColor(colors, 'DarkGreen', '006400');
                addWebColor(colors, 'DarkGrey', 'A9A9A9');
                addWebColor(colors, 'DarkKhaki', 'BDB76B');
                addWebColor(colors, 'DarkMagenta', '8B008B');
                addWebColor(colors, 'DarkOliveGreen', '556B2F');
                addWebColor(colors, 'DarkOrange', 'FF8C00');
                addWebColor(colors, 'DarkRed', '8B0000');
                addWebColor(colors, 'DarkSalmon', 'E9967A');
                addWebColor(colors, 'DarkSeaGreen', '8FBC8F');
                addWebColor(colors, 'DarkSlateBlue', '483D8B');
                addWebColor(colors, 'DarkSlateGray', '2F4F4F');
                addWebColor(colors, 'DarkSlateGrey', '2F4F4F');
                addWebColor(colors, 'DarkTurquoise', '00CED1');
                addWebColor(colors, 'DarkViolet', '9400D3');
                addWebColor(colors, 'DeepPink', 'FF1493');
                addWebColor(colors, 'DeepSkyBlue', '00BFFF');
                addWebColor(colors, 'DimGray', '696969');
                addWebColor(colors, 'DimGrey', '696969');
                addWebColor(colors, 'DodgerBlue', '1E90FF');
                __state = '15';
                break;
            case '15':
                addWebColor(colors, 'FireBrick', 'B22222');
                addWebColor(colors, 'FloralWhite', 'FFFAF0');
                addWebColor(colors, 'ForestGreen', '228B22');
                addWebColor(colors, 'Fuchsia', 'FF00FF');
                addWebColor(colors, 'Gainsboro', 'DCDCDC');
                addWebColor(colors, 'GhostWhite', 'F8F8FF');
                addWebColor(colors, 'Gold', 'FFD700');
                addWebColor(colors, 'Goldenrod', 'DAA520');
                addWebColor(colors, 'Gray', '808080');
                addWebColor(colors, 'Grey', '808080');
                addWebColor(colors, 'Green', '008000');
                addWebColor(colors, 'GreenYellow', 'ADFF2F');
                addWebColor(colors, 'HoneyDew', 'F0FFF0');
                addWebColor(colors, 'HotPink', 'FF69B4');
                addWebColor(colors, 'IndianRed', 'CD5C5C');
                addWebColor(colors, 'Indigo', '4B0082');
                addWebColor(colors, 'Ivory', 'FFFFF0');
                addWebColor(colors, 'Khaki', 'F0E68C');
                addWebColor(colors, 'Lavender', 'E6E6FA');
                addWebColor(colors, 'LavenderBlush', 'FFF0F5');
                addWebColor(colors, 'LawnGreen', '7CFC00');
                addWebColor(colors, 'LemonChiffon', 'FFFACD');
                addWebColor(colors, 'LightBlue', 'ADD8E6');
                addWebColor(colors, 'LightCoral', 'F08080');
                addWebColor(colors, 'LightCyan', 'E0FFFF');
                addWebColor(colors, 'LightGoldenrodYellow', 'FAFAD2');
                addWebColor(colors, 'LightGray', 'D3D3D3');
                addWebColor(colors, 'LightGreen', '90EE90');
                addWebColor(colors, 'LightGrey', 'D3D3D3');
                addWebColor(colors, 'LightPink', 'FFB6C1');
                addWebColor(colors, 'LightSalmon', 'FFA07A');
                addWebColor(colors, 'LightSeaGreen', '20B2AA');
                addWebColor(colors, 'LightSkyBlue', '87CEFA');
                addWebColor(colors, 'LightSlateGray', '778899');
                addWebColor(colors, 'LightSlateGrey', '778899');
                addWebColor(colors, 'LightSteelBlue', 'B0C4DE');
                addWebColor(colors, 'LightYellow', 'FFFFE0');
                addWebColor(colors, 'Lime', '00FF00');
                addWebColor(colors, 'LimeGreen', '32CD32');
                addWebColor(colors, 'Linen', 'FAF0E6');
                addWebColor(colors, 'Magenta', 'FF00FF');
                addWebColor(colors, 'Maroon', '800000');
                addWebColor(colors, 'MediumAquamarine', '66CDAA');
                addWebColor(colors, 'MediumBlue', '0000CD');
                addWebColor(colors, 'MediumOrchid', 'BA55F3');
                addWebColor(colors, 'MediumPurple', '9370DB');
                addWebColor(colors, 'MediumSeaGreen', '3CB371');
                addWebColor(colors, 'MediumSlateBlue', '7B68EE');
                addWebColor(colors, 'MediumSpringGreen', '00FA9A');
                addWebColor(colors, 'MediumTurquoise', '48D1CC');
                addWebColor(colors, 'MediumVioletRed', 'C71585');
                addWebColor(colors, 'MidnightBlue', '191970');
                addWebColor(colors, 'MintCream', 'F5FFFA');
                addWebColor(colors, 'MistyRose', 'FFE4E1');
                addWebColor(colors, 'Moccasin', 'FFE4B5');
                addWebColor(colors, 'NavajoWhite', 'FFDEAD');
                addWebColor(colors, 'Navy', '000080');
                addWebColor(colors, 'OldLace', 'FDF5E6');
                addWebColor(colors, 'Olive', '808000');
                addWebColor(colors, 'OliveDrab', '6B8E23');
                addWebColor(colors, 'Orange', 'FFA500');
                addWebColor(colors, 'OrangeRed', 'FF4500');
                addWebColor(colors, 'Orchid', 'DA70D6');
                addWebColor(colors, 'PaleGoldenrod', 'EEE8AA');
                addWebColor(colors, 'PaleGreen', '98FB98');
                addWebColor(colors, 'PaleTurquoise', 'AFEEEE');
                addWebColor(colors, 'PaleVioletRed', 'DB7093');
                addWebColor(colors, 'PapayaWhip', 'FFEFD5');
                addWebColor(colors, 'PeachPuff', 'FFDAB9');
                __state = '17';
                break;
            case '17':
                addWebColor(colors, 'Peru', 'CD853F');
                addWebColor(colors, 'Pink', 'FFC0CB');
                addWebColor(colors, 'Plum', 'DDA0DD');
                addWebColor(colors, 'PowderBlue', 'B0E0E6');
                addWebColor(colors, 'Purple', '800080');
                addWebColor(colors, 'RebeccaPurple', '663399');
                addWebColor(colors, 'Red', 'FF0000');
                addWebColor(colors, 'RosyBrown', 'BC8F8F');
                addWebColor(colors, 'RoyalBlue', '4169E1');
                addWebColor(colors, 'SaddleBrown', '8B4513');
                addWebColor(colors, 'Salmon', 'FA8072');
                addWebColor(colors, 'SandyBrown', 'F4A460');
                addWebColor(colors, 'SeaGreen', '2E8B57');
                addWebColor(colors, 'SeaShell', 'FFF5EE');
                addWebColor(colors, 'Sienna', 'A0522D');
                addWebColor(colors, 'Silver', 'C0C0C0');
                addWebColor(colors, 'SkyBlue', '87CEEB');
                addWebColor(colors, 'SlateBlue', '6A5ACD');
                addWebColor(colors, 'SlateGray', '708090');
                addWebColor(colors, 'SlateGrey', '708090');
                addWebColor(colors, 'Snow', 'FFFAFA');
                addWebColor(colors, 'SpringGreen', '00FF7F');
                addWebColor(colors, 'SteelBlue', '4682B4');
                addWebColor(colors, 'Tan', 'D2B48C');
                addWebColor(colors, 'Teal', '008080');
                addWebColor(colors, 'Thistle', 'D8BFD8');
                addWebColor(colors, 'Tomato', 'FF6347');
                addWebColor(colors, 'Turquoise', '40E0D0');
                addWebColor(colors, 'Violet', 'EE82EE');
                addWebColor(colors, 'Wheat', 'F5DEB3');
                addWebColor(colors, 'White', 'FFFFFF');
                addWebColor(colors, 'WhiteSmoke', 'F5F5F5');
                addWebColor(colors, 'Yellow', 'FFFF00');
                addWebColor(colors, 'YellowGreen', '9ACD32');
                __state = '11';
                break;
            default:
                return;
            }
        }
    }
    function addWebColor(colors, name, value) {
        var _var2;
        _var2 = name.toLowerCase();
        colors[_var2] = value;
        return;
    }
    function isHex(text, start) {
        var a, f, zero, nine, code, i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                a = 'a'.codePointAt(0);
                f = 'f'.codePointAt(0);
                zero = '0'.codePointAt(0);
                nine = '9'.codePointAt(0);
                start = start || 0;
                i = start;
                __state = '5';
                break;
            case '4':
                i++;
                __state = '5';
                break;
            case '5':
                if (i < text.length) {
                    code = text.codePointAt(i);
                    if (code >= a) {
                        if (code <= f) {
                            __state = '4';
                        } else {
                            __state = '16';
                        }
                    } else {
                        __state = '16';
                    }
                } else {
                    return true;
                }
                break;
            case '13':
                return false;
            case '16':
                if (code >= zero) {
                    if (code <= nine) {
                        __state = '4';
                    } else {
                        __state = '13';
                    }
                } else {
                    __state = '13';
                }
                break;
            default:
                return;
            }
        }
    }
    function showPalette(context, launcher, value, onColorChosen) {
        var paletteWindow, recent, lines, bottom, rect, color, data, chooseColor, chooseColorLight, lineContainer, input, apply, closeAndUse, currentContainer, i, _var4, _var5, line, _var2, _var3, lineColor, _var6, _var7, _var8, _var9, _var10;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                data = getColorPaletteData();
                paletteWindow = div('shadow', {
                    background: 'white',
                    border: 'solid 1px ' + unit.darkColor,
                    width: '340px',
                    'max-width': '100vw',
                    display: 'inline-block',
                    position: 'absolute'
                });
                recent = div({ padding: '5px' });
                html.add(paletteWindow, recent);
                lines = div({
                    'overflow': 'auto',
                    height: '300px'
                });
                html.add(paletteWindow, lines);
                bottom = div({ padding: '5px' });
                html.add(paletteWindow, bottom);
                __state = '27';
                break;
            case '9':
                rect = launcher.getBoundingClientRect();
                widgets.pushSemiModalPopup(paletteWindow, rect.left, rect.bottom);
                return;
            case '10':
                i = 0;
                __state = '14';
                break;
            case '14':
                if (i < data.recent.length && i < 6) {
                    color = data.recent[i];
                    _var6 = chooseColorLight(color);
                    addColorIcon(recent, color, _var6);
                    i++;
                    __state = '14';
                } else {
                    __state = '25';
                }
                break;
            case '25':
                if (i < 6) {
                    addEmptyIcon(recent);
                    i++;
                    __state = '25';
                } else {
                    __state = '31';
                }
                break;
            case '27':
                closeAndUse = function (color) {
                    widgets.closePopup();
                    onColorChosen(color);
                };
                chooseColor = function (color) {
                    return function () {
                        rememberColor(data, color);
                        closeAndUse(color);
                    };
                };
                chooseColorLight = function (color) {
                    return function () {
                        closeAndUse(color);
                    };
                };
                __state = '10';
                break;
            case '31':
                _var4 = data.lines;
                _var5 = 0;
                __state = '33';
                break;
            case '33':
                if (_var5 < _var4.length) {
                    line = _var4[_var5];
                    lineContainer = div({
                        'padding-left': '5px',
                        'padding-top': '1px',
                        'padding-bottom': '1px',
                        'padding-right': '4px'
                    });
                    html.add(lines, lineContainer);
                    _var2 = line;
                    _var3 = 0;
                    __state = '36';
                } else {
                    __state = '38';
                }
                break;
            case '36':
                if (_var3 < _var2.length) {
                    lineColor = _var2[_var3];
                    _var7 = chooseColor(lineColor);
                    addColorIcon(lineContainer, lineColor, _var7);
                    _var3++;
                    __state = '36';
                } else {
                    _var5++;
                    __state = '33';
                }
                break;
            case '38':
                currentContainer = div({
                    display: 'inline-block',
                    'vertical-align': 'bottom'
                });
                html.add(bottom, currentContainer);
                input = html.createElement('input', {
                    type: 'text',
                    value: value
                }, [{
                        width: '70px',
                        'margin-left': '5px',
                        'margin-right': '5px'
                    }]);
                html.add(bottom, input);
                _var8 = context.tr('Apply');
                apply = createComplexButton(bottom, _var8, function () {
                    _var9 = input.value.trim();
                    rememberColor(data, _var9);
                    _var10 = input.value.trim();
                    closeAndUse(_var10);
                }, 'white', unit.darkColor);
                apply.enabledButton.style.lineHeight = '29px';
                apply.disabledButton.style.lineHeight = '29px';
                registerEvent(input, 'input', function () {
                    onColorInput(currentContainer, input, apply, chooseColor);
                });
                onColorInput(currentContainer, input, apply, chooseColor);
                __state = '9';
                break;
            default:
                return;
            }
        }
    }
    function closeAndUseColor(context, color) {
        return;
    }
    function rememberColor(data, color) {
        data.recent.unshift(color);
        return;
    }
    function addVerticalAlign(context) {
        var section, top, center, bottom, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Vertical align');
                section = addFormatSection(_var2, context.client);
                __state = '10';
                break;
            case '8':
                return;
            case '10':
                top = addBoolIcon(section, context.path + 'valign-top.png', context.oldStyle.verticalAlign === 'top', function (value) {
                    setVerticalAlign(context, value, 'top');
                });
                center = addBoolIcon(section, context.path + 'valign-middle.png', context.oldStyle.verticalAlign === 'middle', function (value) {
                    setVerticalAlign(context, value, 'middle');
                });
                bottom = addBoolIcon(section, context.path + 'valign-bottom.png', context.oldStyle.verticalAlign === 'bottom', function (value) {
                    setVerticalAlign(context, value, 'bottom');
                });
                makeGroupStart(top);
                makeGroupEnd(bottom);
                __state = '8';
                break;
            default:
                return;
            }
        }
    }
    function clearIconFormat(context) {
        context.canwidget.setStyle(context.ids, '');
        widgets.removePopups();
        return;
    }
    function getShadowTypes(tr) {
        var _var2, _var3, _var4;
        _var2 = tr('No shadow');
        _var3 = tr('Subtle');
        _var4 = tr('Strong');
        return [
            _var2,
            _var3,
            _var4
        ];
    }
    function addCombo(path, parent, name, value, values, onChange) {
        var container, text, tri, oldValue, img;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                container = div('generic-button', {
                    padding: '0px',
                    margin: '0px',
                    display: 'inline-block',
                    'vertical-align': 'bottom',
                    'background': 'white',
                    border: 'solid 1px grey',
                    'border-radius': '5px',
                    'user-select': 'none',
                    'cursor': 'pointer',
                    'position': 'relative',
                    'height': '34px'
                });
                if (typeof value === 'string') {
                    text = div({
                        display: 'inline-block',
                        width: 'calc(100% - 20px)',
                        'overflow': 'hidden',
                        'line-height': '32px',
                        'padding-left': '5px',
                        'white-space': 'nowrap',
                        'vertical-align': 'bottom',
                        position: 'absolute',
                        left: '0px',
                        top: '0px',
                        text: value
                    });
                    tri = html.createElement('img', {
                        src: path + 'tri-down.png',
                        draggable: false
                    }, [{
                            display: 'inline-block',
                            'vertical-align': 'bottom',
                            height: '32px',
                            position: 'absolute',
                            top: '0px',
                            right: '3px'
                        }]);
                    oldValue = value;
                    html.add(parent, container);
                    html.add(container, text);
                    html.add(container, tri);
                    __state = '9';
                } else {
                    img = html.createElement('img', {
                        draggable: false,
                        src: value.img
                    }, [{
                            display: 'inline-block',
                            width: value.width + 'px',
                            height: value.height + 'px',
                            'vertical-align': 'middle'
                        }]);
                    oldValue = value.value;
                    html.add(parent, container);
                    html.add(container, img);
                    __state = '9';
                }
                break;
            case '8':
                return container;
            case '9':
                registerEvent(container, 'click', function () {
                    showComboValues(container, path, name, values, oldValue, onChange);
                });
                __state = '8';
                break;
            default:
                return;
            }
        }
    }
    function showComboValues(control, path, name, values, value, onChange) {
        var container, header, rect, table, _var2, _var3, valueItem;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                rect = control.getBoundingClientRect();
                container = div('shadow', {
                    display: 'inline-block',
                    position: 'absolute',
                    border: 'solid 1px ' + unit.darkColor,
                    'max-width': '250px',
                    'max-height': '300px',
                    'min-width': rect.width + 'px',
                    background: 'white',
                    'overflow-y': 'auto'
                });
                header = div({
                    color: 'black',
                    background: 'rgb(220, 220, 220)',
                    padding: '5px',
                    text: name
                });
                html.add(container, header);
                __state = '5';
                break;
            case '4':
                widgets.pushSemiModalPopup(container, rect.left, rect.bottom);
                return;
            case '5':
                table = html.createElement('table', {}, [{ 'min-width': 'calc(100% - 2px)' }]);
                html.add(container, table);
                _var2 = values;
                _var3 = 0;
                __state = '10';
                break;
            case '10':
                if (_var3 < _var2.length) {
                    valueItem = _var2[_var3];
                    addComboValue(table, path, valueItem, value, onChange);
                    _var3++;
                    __state = '10';
                } else {
                    __state = '4';
                }
                break;
            default:
                return;
            }
        }
    }
    function addComboValue(table, path, valueItem, value, onChange) {
        var line, img, left, currentValue, valueImg, right;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                line = html.createElement('tr', {}, ['context-menu-item']);
                html.add(table, line);
                left = html.createElement('td', {}, [{ width: '12px' }]);
                html.add(line, left);
                right = html.createElement('td', {}, [{ 'padding-right': '5px' }]);
                html.add(line, right);
                if (typeof valueItem === 'string') {
                    html.setText(right, valueItem);
                    currentValue = valueItem;
                    __state = '11';
                } else {
                    valueImg = html.createElement('img', {
                        draggable: false,
                        src: valueItem.img
                    }, [{
                            'vertical-align': 'middle',
                            'width': valueItem.width + 'px',
                            'height': valueItem.height + 'px'
                        }]);
                    html.add(right, valueImg);
                    currentValue = valueItem.value;
                    __state = '11';
                }
                break;
            case '10':
                registerEvent(line, 'click', function () {
                    widgets.closePopup();
                    onChange(currentValue);
                });
                return;
            case '11':
                if (value === currentValue) {
                    img = html.createElement('img', {
                        draggable: false,
                        src: path + 'item-pointer.png'
                    }, [{
                            'vertical-align': 'middle',
                            'width': '10px'
                        }]);
                    html.add(left, img);
                    __state = '10';
                } else {
                    __state = '10';
                }
                break;
            default:
                return;
            }
        }
    }
    function createFormatDialog(widget, title, x, y) {
        var dialog, tr, path;
        tr = widget.widgetSettings.translate;
        path = widget.widgetSettings.imagePath;
        dialog = widgets.createMovablePopup(title, x, y, path, false);
        dialog.popup.style.width = '280px';
        dialog.client.style.maxHeight = 'calc(100vh - 40px)';
        dialog.client.style.overflowY = 'auto';
        return dialog;
    }
    function addFillSection(context) {
        var section, size, padding, paddingStr, shadow, shadowValue, _var2, _var3, _var4, _var5, _var6, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                _var2 = context.tr('Fill');
                section = addFormatSection(_var2, context.client);
                addColorControl(context, section, 'iconBack');
                if (context.accepted.padding) {
                    padding = parseInt(context.oldStyle.padding);
                    _var5 = isNaN(padding);
                    if (_var5) {
                        paddingStr = context.tr('Default');
                        __state = '_item3';
                    } else {
                        paddingStr = padding + ' px';
                        __state = '_item3';
                    }
                } else {
                    __state = '22';
                }
                break;
            case '22':
                if (context.accepted.shadowColor) {
                    if (context.oldStyle.shadowColor) {
                        if (context.oldStyle.shadowOffsetX === 0) {
                            shadowValue = context.tr('Subtle');
                            __state = '_item5';
                        } else {
                            shadowValue = context.tr('Strong');
                            __state = '_item5';
                        }
                    } else {
                        shadowValue = context.tr('No shadow');
                        __state = '_item5';
                    }
                } else {
                    __state = '1';
                }
                break;
            case '_item3':
                _var3 = context.tr('Padding');
                _var4 = getPaddingSizes(context.tr);
                size = addCombo(context.path, section, _var3, paddingStr, _var4, function (value) {
                    setPadding(context, value);
                });
                size.style.width = '80px';
                size.style.marginLeft = '5px';
                __state = '22';
                break;
            case '_item5':
                _var6 = context.tr('Shadow');
                _var7 = getShadowTypes(context.tr);
                shadow = addCombo(context.path, section, _var6, shadowValue, _var7, function (value) {
                    setShadow(context, value);
                });
                shadow.style.width = '110px';
                shadow.style.marginLeft = '5px';
                __state = '1';
                break;
            default:
                return;
            }
        }
    }
    function getFontSizes() {
        var result, i, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                result = [];
                i = 8;
                __state = '5';
                break;
            case '5':
                if (i <= 16) {
                    _var2 = i.toString();
                    result.push(_var2);
                    i++;
                    __state = '5';
                } else {
                    result.push('17');
                    result.push('18');
                    result.push('19');
                    result.push('20');
                    result.push('24');
                    result.push('28');
                    result.push('32');
                    result.push('36');
                    result.push('48');
                    result.push('64');
                    result.push('72');
                    result.push('96');
                    result.push('120');
                    result.push('144');
                    _var3 = result.map(function (size) {
                        return size + ' px';
                    });
                    return _var3;
                }
                break;
            default:
                return;
            }
        }
    }
    function setBoldFont(context, prop, value) {
        var weight, font;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value) {
                    weight = 'bold';
                    __state = '6';
                } else {
                    weight = '';
                    __state = '6';
                }
                break;
            case '6':
                context[prop].weight = weight;
                font = drakon_canvas.cssFontToString(context[prop]);
                changeStyleProperty(context, prop, font);
                return;
            default:
                return;
            }
        }
    }
    function getLineStyleValues(path) {
        return [
            {
                value: 'solid',
                img: path + 'ls-solid.png',
                width: 120,
                height: 30
            },
            {
                value: 'dash1',
                img: path + 'ls-style-1.png',
                width: 120,
                height: 30
            },
            {
                value: 'dash2',
                img: path + 'ls-style-2.png',
                width: 120,
                height: 30
            },
            {
                value: 'dash3',
                img: path + 'ls-style-3.png',
                width: 120,
                height: 30
            },
            {
                value: 'dash4',
                img: path + 'ls-style-4.png',
                width: 120,
                height: 30
            }
        ];
    }
    function getTailStyles(path) {
        return [
            {
                value: 'none',
                img: path + 'cap-solid.png',
                width: 120,
                height: 30
            },
            {
                value: 'arrow',
                img: path + 'cap-arrow-left.png',
                width: 120,
                height: 30
            },
            {
                value: 'sarrow',
                img: path + 'cap-sarrow-left.png',
                width: 120,
                height: 30
            },
            {
                value: 'warrow',
                img: path + 'cap-warrow-left.png',
                width: 120,
                height: 30
            },
            {
                value: 'paw',
                img: path + 'cap-paw-left.png',
                width: 120,
                height: 30
            }
        ];
    }
    function addTextSection(context) {
        var section, bold, italic, left, center, right, br, family, size, _var2, _var3, _var4, _var5, _var6, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Text');
                section = addFormatSection(_var2, context.client);
                addColorControl(context, section, 'color');
                __state = '9';
                break;
            case '8':
                return;
            case '9':
                bold = addBoolIcon(section, context.path + 'bold.png', context.font.weight === 'bold', function (value) {
                    setBoldFont(context, 'font', value);
                });
                italic = addBoolIcon(section, context.path + 'italics.png', context.font.style === 'italic', function (value) {
                    setItalicFont(context, 'font', value);
                });
                makeGroupStart(bold);
                makeGroupEnd(italic);
                __state = '10';
                break;
            case '10':
                left = addBoolIcon(section, context.path + 'align-left.png', context.oldStyle.textAlign === 'left', function (value) {
                    setTextAlign(context, value, 'left');
                });
                center = addBoolIcon(section, context.path + 'align-center.png', context.oldStyle.textAlign === 'center', function (value) {
                    setTextAlign(context, value, 'center');
                });
                right = addBoolIcon(section, context.path + 'align-right.png', context.oldStyle.textAlign === 'right', function (value) {
                    setTextAlign(context, value, 'right');
                });
                makeGroupStart(left);
                makeGroupEnd(right);
                br = div({ height: '5px' });
                html.add(section, br);
                __state = '19';
                break;
            case '19':
                _var3 = context.tr('Font family');
                _var4 = getFontFamilies();
                family = addCombo(context.path, section, _var3, context.font.family, _var4, function (value) {
                    setFontFamily(context, 'font', value);
                });
                _var5 = context.tr('Font size');
                _var6 = context.font.size.toString();
                _var7 = getFontSizes();
                size = addCombo(context.path, section, _var5, _var6 + ' px', _var7, function (value) {
                    setFontSize(context, 'font', value);
                });
                family.style.width = '160px';
                size.style.width = '70px';
                size.style.marginLeft = '5px';
                __state = '8';
                break;
            default:
                return;
            }
        }
    }
    function addFormatSection(text, parent) {
        var banner, client;
        banner = div({
            background: unit.middleColor,
            padding: '5px'
        });
        html.setText(banner, text);
        html.add(parent, banner);
        client = div({
            background: 'white',
            padding: '5px',
            'border-bottom': 'solid 1px ' + unit.darkColor
        });
        html.add(parent, client);
        return client;
    }
    function IconStyleWindow_rebuild(self) {
        var _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                html.clear(self.client);
                if ('iconBack' in self.accepted) {
                    addFillSection(self);
                    __state = '11';
                } else {
                    __state = '11';
                }
                break;
            case '11':
                if ('font' in self.accepted) {
                    addTextSection(self);
                    __state = '19';
                } else {
                    __state = '19';
                }
                break;
            case '12':
                if ('iconBorder' in self.accepted) {
                    addBorderSection(self);
                    __state = '14';
                } else {
                    __state = '14';
                }
                break;
            case '14':
                if ('internalLine' in self.accepted) {
                    addInternalLineSection(self);
                    __state = '16';
                } else {
                    __state = '16';
                }
                break;
            case '16':
                if ('lines' in self.accepted) {
                    addLinesSection(self, false);
                    __state = '_item2';
                } else {
                    __state = '_item2';
                }
                break;
            case '19':
                if ('verticalAlign' in self.accepted) {
                    addVerticalAlign(self);
                    __state = '12';
                } else {
                    __state = '12';
                }
                break;
            case '_item2':
                _var2 = self.tr('Clear format');
                addWideButton(self.client, _var2, function () {
                    clearIconFormat(self);
                });
                return;
            default:
                return;
            }
        }
    }
    function IconStyleWindow_applyFormat_create(self) {
        var fonts;
        var me = {
            state: '2',
            type: 'IconStyleWindow_applyFormat'
        };
        function _main_IconStyleWindow_applyFormat(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        fonts = self.canwidget.setStyle(self.ids, self.style);
                        me.state = '5';
                        setTimeout(function () {
                            _main_IconStyleWindow_applyFormat(__resolve, __reject);
                        }, 10);
                        return;
                    case '5':
                        loadFonts(self.widget, fonts);
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
                _main_IconStyleWindow_applyFormat(__resolve, __reject);
            });
        };
        return me;
    }
    function IconStyleWindow_applyFormat(self) {
        var __obj = IconStyleWindow_applyFormat_create(self);
        return __obj.run();
    }
    function addColorControl(context, section, prop) {
        var value, img, onColorChosen;
        value = context.oldStyle[prop];
        img = buildColorIcon(value);
        onColorChosen = function (color) {
            changeStyleProperty(context, prop, color);
        };
        registerEvent(img, 'click', function () {
            showPalette(context, img, value, onColorChosen);
        });
        html.add(section, img);
        return img;
    }
    function addBorderSection(context) {
        var section, thickness, oldThickness, value, style, valueStyle, _var2, _var3, _var4, _var5, _var6, _var7, _var8;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Border');
                section = addFormatSection(_var2, context.client);
                addColorControl(context, section, 'iconBorder');
                if (context.oldStyle.borderWidth === '') {
                    oldThickness = '';
                    __state = '14';
                } else {
                    _var5 = context.oldStyle.borderWidth.toString();
                    oldThickness = _var5 + ' px';
                    __state = '14';
                }
                break;
            case '14':
                value = {
                    img: context.path + 'thickness.png',
                    height: 30,
                    width: 40,
                    value: oldThickness
                };
                _var3 = context.tr('Border width');
                _var4 = getThicknessValues();
                thickness = addCombo(context.path, section, _var3, value, _var4, function (value) {
                    setBorderThickness(context, value);
                });
                thickness.style.marginLeft = '5px';
                _var8 = context.oldStyle.borderWidth.toString();
                oldThickness = _var8 + ' px';
                valueStyle = {
                    img: context.path + 'style.png',
                    height: 30,
                    width: 40,
                    value: context.oldStyle.borderStyle
                };
                _var6 = context.tr('Border style');
                _var7 = getLineStyleValues(context.path);
                style = addCombo(context.path, section, _var6, valueStyle, _var7, function (value) {
                    changeStyleProperty(context, 'borderStyle', value);
                });
                style.style.marginLeft = '5px';
                return;
            default:
                return;
            }
        }
    }
    function createCanvas(width, height) {
        var canvas, factor, ctx;
        canvas = document.createElement('canvas');
        factor = html.getRetinaFactor();
        canvas.width = width * factor;
        canvas.height = height * factor;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx = canvas.getContext('2d');
        ctx.scale(factor, factor);
        return {
            canvas: canvas,
            ctx: ctx
        };
    }
    function setTextAlign(context, value, align) {
        var newValue;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value) {
                    newValue = align;
                    __state = '10';
                } else {
                    newValue = '';
                    __state = '10';
                }
                break;
            case '10':
                changeStyleProperty(context, 'textAlign', newValue);
                return;
            default:
                return;
            }
        }
    }
    function setLineThickness(context, value, align) {
        var borderWidth;
        borderWidth = parseInt(value);
        changeStyleProperty(context, 'lineWidth', borderWidth);
        return;
    }
    function addLinesSection(context, backText) {
        var section, backColor, backLabel, thickness, oldThickness, value, style, valueStyle, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Lines');
                section = addFormatSection(_var2, context.client);
                addColorControl(context, section, 'lines');
                __state = '22';
                break;
            case '20':
                return;
            case '21':
                if (context.accepted.lineStyle) {
                    valueStyle = {
                        img: context.path + 'style.png',
                        height: 30,
                        width: 40,
                        value: context.oldStyle.lineStyle
                    };
                    _var8 = context.tr('Line style');
                    _var9 = getLineStyleValues(context.path);
                    style = addCombo(context.path, section, _var8, valueStyle, _var9, function (value) {
                        changeStyleProperty(context, 'lineStyle', value);
                    });
                    style.style.marginLeft = '5px';
                    __state = '24';
                } else {
                    __state = '24';
                }
                break;
            case '22':
                _var7 = utils.hasValue(context.oldStyle.lineWidth);
                if (_var7) {
                    _var6 = context.oldStyle.lineWidth.toString();
                    oldThickness = _var6 + ' px';
                    __state = '36';
                } else {
                    oldThickness = '';
                    __state = '36';
                }
                break;
            case '23':
                if (backText) {
                    backColor = addColorControl(context, section, 'backText');
                    backColor.style.marginLeft = '5px';
                    _var3 = context.tr('Text');
                    backLabel = div({
                        display: 'inline-block',
                        text: _var3,
                        'margin-left': '5px',
                        'line-height': '30px'
                    });
                    html.add(section, backLabel);
                    __state = '21';
                } else {
                    __state = '21';
                }
                break;
            case '24':
                if (context.accepted.tailStyle) {
                    valueStyle = {
                        img: context.path + 'arrow-left.png',
                        height: 30,
                        width: 40,
                        value: context.oldStyle.tailStyle
                    };
                    _var10 = context.tr('Tail style');
                    _var11 = getTailStyles(context.path);
                    style = addCombo(context.path, section, _var10, valueStyle, _var11, function (value) {
                        changeStyleProperty(context, 'tailStyle', value);
                    });
                    style.style.marginLeft = '5px';
                    __state = '25';
                } else {
                    __state = '25';
                }
                break;
            case '25':
                if (context.accepted.headStyle) {
                    valueStyle = {
                        img: context.path + 'arrow-right.png',
                        height: 30,
                        width: 40,
                        value: context.oldStyle.headStyle
                    };
                    _var12 = context.tr('Head style');
                    _var13 = getHeadStyles(context.path);
                    style = addCombo(context.path, section, _var12, valueStyle, _var13, function (value) {
                        changeStyleProperty(context, 'headStyle', value);
                    });
                    style.style.marginLeft = '5px';
                    __state = '20';
                } else {
                    __state = '20';
                }
                break;
            case '36':
                value = {
                    img: context.path + 'thickness.png',
                    height: 30,
                    width: 40,
                    value: oldThickness
                };
                _var4 = context.tr('Line width');
                _var5 = getLineWidthValues();
                thickness = addCombo(context.path, section, _var4, value, _var5, function (value) {
                    setLineThickness(context, value);
                });
                thickness.style.marginLeft = '5px';
                __state = '23';
                break;
            default:
                return;
            }
        }
    }
    function getLineWidthValues() {
        return [
            '1 px',
            '2 px',
            '3 px',
            '4 px',
            '5 px'
        ];
    }
    function addBranchHeaderSection(context) {
        var section, bold, italic, family, size, br, _var2, _var3, _var4, _var5, _var6, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Branch header');
                section = addFormatSection(_var2, context.client);
                __state = '9';
                break;
            case '8':
                return;
            case '9':
                bold = addBoolIcon(section, context.path + 'bold.png', context.branchFont.weight === 'bold', function (value) {
                    setBoldFont(context, 'branchFont', value);
                });
                italic = addBoolIcon(section, context.path + 'italics.png', context.branchFont.style === 'italic', function (value) {
                    setItalicFont(context, 'branchFont', value);
                });
                makeGroupStart(bold);
                makeGroupEnd(italic);
                bold.style.marginLeft = '0px';
                __state = '19';
                break;
            case '19':
                br = div({ height: '5px' });
                html.add(section, br);
                _var3 = context.tr('Font family');
                _var4 = getFontFamilies();
                family = addCombo(context.path, section, _var3, context.branchFont.family, _var4, function (value) {
                    setFontFamily(context, 'branchFont', value);
                });
                _var5 = context.tr('Font size');
                _var6 = context.branchFont.size.toString();
                _var7 = getFontSizes();
                size = addCombo(context.path, section, _var5, _var6 + ' px', _var7, function (value) {
                    setFontSize(context, 'branchFont', value);
                });
                family.style.width = '160px';
                size.style.width = '70px';
                size.style.marginLeft = '5px';
                __state = '8';
                break;
            default:
                return;
            }
        }
    }
    function setVerticalAlign(context, value, align) {
        var newValue;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value) {
                    newValue = align;
                    __state = '10';
                } else {
                    newValue = '';
                    __state = '10';
                }
                break;
            case '10':
                changeStyleProperty(context, 'verticalAlign', newValue);
                return;
            default:
                return;
            }
        }
    }
    function addBoolControlGeneric(section, header, value, onChange) {
        var label, check;
        label = html.createElement('label', {}, [{
                'line-height': '30px',
                'margin-left': '5px',
                'display': 'inline-block',
                'white-space': 'nowrap'
            }]);
        html.add(section, label);
        check = html.createElement('input', { type: 'checkbox' }, [{
                width: '20px',
                height: '20px',
                'vertical-align': 'middle'
            }]);
        check.checked = value;
        html.add(label, check);
        html.addText(label, header);
        registerEvent(check, 'click', function () {
            onChange(check.checked);
        });
        return;
    }
    function buildColorIcon(value) {
        var result, canv, ctx, size, start, end;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                size = 32;
                if (value) {
                    result = div({ background: value });
                    __state = '5';
                } else {
                    canv = createCanvas(size, size);
                    ctx = canv.ctx;
                    result = canv.canvas;
                    start = 0;
                    end = size;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, size, size);
                    ctx.strokeStyle = 'grey';
                    ctx.lineWidth = 1;
                    ctx.moveTo(start, start);
                    ctx.lineTo(end, end);
                    ctx.stroke();
                    ctx.moveTo(end, start);
                    ctx.lineTo(start, end);
                    ctx.stroke();
                    __state = '5';
                }
                break;
            case '5':
                result.style.width = size + 'px';
                result.style.height = size + 'px';
                result.style.borderRadius = '5px';
                result.style.border = 'solid 1px rgb(160, 160, 160)';
                result.style.display = 'inline-block';
                result.style.cursor = 'pointer';
                result.style.userSelect = 'none';
                result.style.verticalAlign = 'bottom';
                return result;
            default:
                return;
            }
        }
    }
    function getPaddingSizes(tr) {
        var _var2;
        _var2 = tr('Default');
        return [
            _var2,
            '0 px',
            '2 px',
            '4 px',
            '5 px',
            '8 px',
            '10 px',
            '12 px',
            '15 px',
            '20 px',
            '25 px',
            '30 px',
            '40 px'
        ];
    }
    function DiagramStyleWindow_rebuild(self) {
        var _var2;
        html.clear(self.client);
        addBackgroundSection(self);
        addLinesSection(self, true);
        addFillSection(self);
        addTextSection(self);
        addBorderSection(self);
        addInternalLineSection(self);
        addBranchHeaderSection(self);
        _var2 = self.tr('Clear format');
        addWideButton(self.client, _var2, function () {
            clearDiagramFormat(self);
        });
        return;
    }
    function DiagramStyleWindow_applyFormat_create(self) {
        var fonts;
        var me = {
            state: '2',
            type: 'DiagramStyleWindow_applyFormat'
        };
        function _main_DiagramStyleWindow_applyFormat(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        fonts = self.canwidget.patchDiagramStyle(self.style);
                        me.state = '5';
                        setTimeout(function () {
                            _main_DiagramStyleWindow_applyFormat(__resolve, __reject);
                        }, 10);
                        return;
                    case '5':
                        loadFonts(self.widget, fonts);
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
                _main_DiagramStyleWindow_applyFormat(__resolve, __reject);
            });
        };
        return me;
    }
    function DiagramStyleWindow_applyFormat(self) {
        var __obj = DiagramStyleWindow_applyFormat_create(self);
        return __obj.run();
    }
    function getFontFamilies() {
        return [
            'Arimo',
            'PTSans',
            'Roboto Condensed',
            'Roboto Mono',
            'Tinos',
            'Ubuntu',
            'Ubuntu Mono'
        ];
    }
    function changeStyleProperty(context, prop, value) {
        context.style[prop] = value;
        context.oldStyle[prop] = value;
        context.rebuild();
        context.applyFormat();
        return;
    }
    function setShadow(context, value) {
        var shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, _var2, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = value;
                _var3 = context.tr('Subtle');
                if (_var2 === _var3) {
                    shadowColor = 'rgba(0, 0, 0, 0.4)';
                    shadowBlur = 10;
                    shadowOffsetX = 0;
                    shadowOffsetY = 0;
                    __state = '20';
                } else {
                    _var4 = context.tr('Strong');
                    if (_var2 === _var4) {
                        shadowColor = 'rgba(0, 0, 0, 0.5)';
                        shadowBlur = 2;
                        shadowOffsetX = 6;
                        shadowOffsetY = 8;
                        __state = '20';
                    } else {
                        shadowColor = '';
                        shadowBlur = 0;
                        shadowOffsetX = 0;
                        shadowOffsetY = 0;
                        __state = '20';
                    }
                }
                break;
            case '20':
                context.style.shadowColor = shadowColor;
                context.style.shadowBlur = shadowBlur;
                context.style.shadowOffsetX = shadowOffsetX;
                context.style.shadowOffsetY = shadowOffsetY;
                context.oldStyle.shadowColor = shadowColor;
                context.oldStyle.shadowBlur = shadowBlur;
                context.oldStyle.shadowOffsetX = shadowOffsetX;
                context.oldStyle.shadowOffsetY = shadowOffsetY;
                context.rebuild();
                context.applyFormat();
                return;
            default:
                return;
            }
        }
    }
    function clearDiagramFormat(context) {
        context.canwidget.setDiagramStyle('');
        widgets.removePopups();
        return;
    }
    function getHeadStyles(path) {
        return [
            {
                value: 'none',
                img: path + 'cap-solid.png',
                width: 120,
                height: 30
            },
            {
                value: 'arrow',
                img: path + 'cap-arrow-right.png',
                width: 120,
                height: 30
            },
            {
                value: 'sarrow',
                img: path + 'cap-sarrow-right.png',
                width: 120,
                height: 30
            },
            {
                value: 'warrow',
                img: path + 'cap-warrow-right.png',
                width: 120,
                height: 30
            },
            {
                value: 'paw',
                img: path + 'cap-paw-right.png',
                width: 120,
                height: 30
            }
        ];
    }
    function addHeaderSection(context) {
        var section, bold, italic, family, size, br, _var2, _var3, _var4, _var5, _var6, _var7;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Header');
                section = addFormatSection(_var2, context.client);
                __state = '9';
                break;
            case '8':
                return;
            case '9':
                bold = addBoolIcon(section, context.path + 'bold.png', context.headerFont.weight === 'bold', function (value) {
                    setBoldFont(context, 'headerFont', value);
                });
                italic = addBoolIcon(section, context.path + 'italics.png', context.headerFont.style === 'italic', function (value) {
                    setItalicFont(context, 'headerFont', value);
                });
                makeGroupStart(bold);
                makeGroupEnd(italic);
                bold.style.marginLeft = '0px';
                __state = '19';
                break;
            case '19':
                br = div({ height: '5px' });
                html.add(section, br);
                _var3 = context.tr('Font family');
                _var4 = getFontFamilies();
                family = addCombo(context.path, section, _var3, context.headerFont.family, _var4, function (value) {
                    setFontFamily(context, 'headerFont', value);
                });
                _var5 = context.tr('Font size');
                _var6 = context.headerFont.size.toString();
                _var7 = getFontSizes();
                size = addCombo(context.path, section, _var5, _var6 + ' px', _var7, function (value) {
                    setFontSize(context, 'headerFont', value);
                });
                family.style.width = '160px';
                size.style.width = '70px';
                size.style.marginLeft = '5px';
                __state = '8';
                break;
            default:
                return;
            }
        }
    }
    function setPadding(context, value, align) {
        var padding, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = context.tr('Default');
                if (value === _var2) {
                    padding = '';
                    __state = '10';
                } else {
                    padding = parseInt(value);
                    __state = '10';
                }
                break;
            case '10':
                changeStyleProperty(context, 'padding', padding);
                return;
            default:
                return;
            }
        }
    }
    function addWideButton(parent, text, action) {
        var clear, container;
        container = div({ padding: '5px' });
        clear = widgets.createSimpleButton(text, action, 'white', unit.darkColor);
        clear.style.margin = '0px';
        clear.style.display = 'block';
        html.add(parent, container);
        html.add(container, clear);
        return;
    }
    function setFontSize(context, prop, size) {
        var font;
        context[prop].size = parseFloat(size);
        font = drakon_canvas.cssFontToString(context[prop]);
        changeStyleProperty(context, prop, font);
        return;
    }
    function addInternalLineSection(context) {
        var section, _var2;
        _var2 = context.tr('Internal line');
        section = addFormatSection(_var2, context.client);
        addColorControl(context, section, 'internalLine');
        return;
    }
    function addBackgroundSection(context) {
        var section, _var2, _var3;
        _var2 = context.tr('Background');
        section = addFormatSection(_var2, context.client);
        addColorControl(context, section, 'background');
        _var3 = context.tr('Recenter');
        addBoolControl(context, section, 'centerContent', _var3);
        return;
    }
    function DrakonHubWidget_copySelection(self) {
        self.drakon.copySelection();
        return;
    }
    function DrakonHubWidget_deleteSelection(self) {
        self.drakon.deleteSelection();
        return;
    }
    function DrakonHubWidget_redo(self) {
        performRedo(self);
        return;
    }
    function DrakonHubWidget_editContent(self) {
        self.drakon.editContent();
        return;
    }
    function readFileAsBase64_create(file) {
        var fileReader, error, _var2;
        var me = {
            state: '2',
            type: 'readFileAsBase64'
        };
        function _main_readFileAsBase64(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        fileReader = new FileReader();
                        fileReader.onload = me.onFileLoaded;
                        fileReader.onerror = me.onError;
                        fileReader.readAsDataURL(file);
                        me.state = '12';
                        return;
                    case '13':
                        me.state = undefined;
                        __resolve(fileReader.result);
                        return;
                    case '14':
                        _var2 = error;
                        me.state = undefined;
                        __reject(_var2);
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
                me.onFileLoaded = function () {
                    switch (me.state) {
                    case '12':
                        me.state = '13';
                        _main_readFileAsBase64(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.onError = function (_error_) {
                    error = _error_;
                    switch (me.state) {
                    case '12':
                        me.state = '14';
                        _main_readFileAsBase64(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_readFileAsBase64(__resolve, __reject);
            });
        };
        return me;
    }
    function readFileAsBase64(file) {
        var __obj = readFileAsBase64_create(file);
        return __obj.run();
    }
    function addLoadedImageButton_create(parent, id, imageData, onClick, current) {
        var image, container, style;
        var me = {
            state: '2',
            type: 'addLoadedImageButton'
        };
        function _main_addLoadedImageButton(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        image = new Image();
                        image.onload = me.loaded;
                        image.src = imageData.content;
                        me.state = '5';
                        return;
                    case '6':
                        container = div('active-border', style, image);
                        html.add(parent, container);
                        if (id === current) {
                            container.style.cursor = 'auto';
                            me.state = '1';
                        } else {
                            registerEvent(container, 'click', function () {
                                onClick(id);
                            });
                            me.state = '1';
                        }
                        break;
                    case '7':
                        if (image.width > image.height) {
                            image.style.position = 'absolute';
                            image.style.left = '0px';
                            image.style.top = '50%';
                            image.style.transform = 'translate(0px, -50%)';
                            image.style.width = '96px';
                            me.state = '10';
                        } else {
                            image.style.height = '96px';
                            me.state = '10';
                        }
                        break;
                    case '10':
                        image.style.display = 'inline-block';
                        style = {
                            display: 'inline-block',
                            position: 'relative',
                            margin: '5px',
                            width: '100px',
                            height: '100px',
                            'text-align': 'center',
                            'vertical-align': 'middle'
                        };
                        if (id === current) {
                            style.border = 'solid 2px darkgreen';
                            me.state = '6';
                        } else {
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
                me.loaded = function () {
                    switch (me.state) {
                    case '5':
                        me.state = '7';
                        _main_addLoadedImageButton(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_addLoadedImageButton(__resolve, __reject);
            });
        };
        return me;
    }
    function addLoadedImageButton(parent, id, imageData, onClick, current) {
        var __obj = addLoadedImageButton_create(parent, id, imageData, onClick, current);
        return __obj.run();
    }
    function calculateImageStorage(existing) {
        var result, _var3, _var2, _var4, id, image;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                result = 0;
                _var3 = existing;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '6';
                break;
            case '6':
                if (_var4 < _var2.length) {
                    id = _var2[_var4];
                    image = _var3[id];
                    result += image.content.length;
                    _var4++;
                    __state = '6';
                } else {
                    return result;
                }
                break;
            default:
                return;
            }
        }
    }
    function uploadImage_create(widget, output, total) {
        var imageContent, client, buttons, input, imp, file, tr, limitTotal, limitBytes, limitText, storage, evt, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9;
        var me = {
            state: '6',
            type: 'uploadImage'
        };
        function _main_uploadImage(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '30';
                        readFileAsBase64(file).then(function (__returnee) {
                            imageContent = __returnee;
                            _main_uploadImage(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '4':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '6':
                        limitTotal = 1000000;
                        limitBytes = 560000;
                        limitText = '400kb';
                        tr = widget.widgetSettings.translate;
                        client = widgets.createMiddleWindow();
                        _var3 = tr('Choose a an image file. ' + 'Max file size is');
                        _var2 = div({
                            text: _var3 + ' ' + limitText,
                            padding: '5px'
                        });
                        html.add(client, _var2);
                        input = html.createElement('input', {
                            type: 'file',
                            accept: '.png,.gif,.webp,.jpg,.jpeg'
                        }, [{
                                padding: '10px',
                                width: '100%'
                            }]);
                        html.add(client, input);
                        _var6 = tr('Upload');
                        imp = widgets.createDefaultButton(_var6, me.imp);
                        imp.style.display = 'none';
                        _var5 = tr('Cancel');
                        _var4 = widgets.createSimpleButton(_var5, me.cancel);
                        buttons = div({
                            'text-align': 'right',
                            'padding-bottom': '5px'
                        }, imp, _var4);
                        html.add(client, buttons);
                        me.state = '15';
                        break;
                    case '15':
                        registerEvent(input, 'change', me.chosen);
                        me.state = '19';
                        return;
                    case '20':
                        widgets.removeQuestions();
                        me.state = '4';
                        break;
                    case '21':
                        imp.style.display = 'inline-block';
                        file = evt.target.files[0];
                        me.state = '23';
                        break;
                    case '23':
                        me.state = '26';
                        return;
                    case '27':
                        widgets.removeQuestions();
                        me.state = '4';
                        break;
                    case '30':
                        if (imageContent) {
                            if (imageContent.length > limitBytes) {
                                _var8 = tr('The image file is too large');
                                widgets.showErrorSnack(_var8);
                                me.state = '31';
                            } else {
                                storage = imageContent.length + total;
                                if (storage > limitTotal) {
                                    _var9 = tr('All images take up too much storage');
                                    widgets.showErrorSnack(_var9);
                                    me.state = '31';
                                } else {
                                    widgets.removeQuestions();
                                    output.uploaded(imageContent);
                                    me.state = '4';
                                }
                            }
                        } else {
                            _var7 = tr('An error has occurred');
                            widgets.showErrorSnack(_var7);
                            me.state = '31';
                        }
                        break;
                    case '31':
                        imp.style.display = 'none';
                        me.state = '15';
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
                    case '19':
                        me.state = '21';
                        _main_uploadImage(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '19':
                        me.state = '20';
                        _main_uploadImage(__resolve, __reject);
                        break;
                    case '26':
                        me.state = '27';
                        _main_uploadImage(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.imp = function () {
                    switch (me.state) {
                    case '26':
                        me.state = '2';
                        _main_uploadImage(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_uploadImage(__resolve, __reject);
            });
        };
        return me;
    }
    function uploadImage(widget, output, total) {
        var __obj = uploadImage_create(widget, output, total);
        return __obj.run();
    }
    function insertPicture_create(widget, type) {
        var existing, imageData;
        var me = {
            state: '2',
            type: 'insertPicture'
        };
        function _main_insertPicture(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        tracing.trace('insertPicture', type);
                        existing = widget.drakon.getLoadedImages();
                        me.state = '5';
                        showChooseImage(widget, existing, undefined).then(function (__returnee) {
                            imageData = __returnee;
                            _main_insertPicture(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        if (imageData) {
                            widget.drakon.showInsertionSockets(type, imageData);
                            me.state = '1';
                        } else {
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
                _main_insertPicture(__resolve, __reject);
            });
        };
        return me;
    }
    function insertPicture(widget, type) {
        var __obj = insertPicture_create(widget, type);
        return __obj.run();
    }
    function showChooseImage_create(widget, existing, current) {
        var dialog, cancel, buttons, upload, existingContainer, tr, total, _var3, _var2, _var4, id, imageData, existingId, imageContent, _var5, _var6, _var7, _var8, _var9, _var10, _var11;
        var me = {
            state: '6',
            type: 'showChooseImage'
        };
        function _main_showChooseImage(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '6':
                        tracing.trace('showChooseImage', undefined);
                        tr = widget.widgetSettings.translate;
                        dialog = widgets.createMiddleWindow();
                        _var7 = tr('Choose an image');
                        _var8 = getHeader2Size();
                        _var6 = div({
                            text: _var7,
                            'font-size': _var8
                        });
                        _var5 = div({
                            'text-align': 'center',
                            'line-height': 1.3,
                            'padding-bottom': '10px',
                            'position': 'relative'
                        }, _var6);
                        html.add(dialog, _var5);
                        total = calculateImageStorage(existing);
                        _var11 = tr('Upload image');
                        upload = widgets.createSimpleButton(_var11, function () {
                            uploadImage(widget, me, total);
                        });
                        _var10 = div(upload);
                        html.add(dialog, _var10);
                        existingContainer = div({
                            'max-height': '300px',
                            'overflow-y': 'auto'
                        });
                        html.add(dialog, existingContainer);
                        _var3 = existing;
                        _var2 = Object.keys(_var3);
                        _var4 = 0;
                        me.state = '25';
                        break;
                    case '16':
                        me.state = '19';
                        return;
                    case '20':
                        widgets.removeQuestions();
                        me.state = undefined;
                        __resolve(undefined);
                        return;
                    case '24':
                        _var4++;
                        me.state = '25';
                        break;
                    case '25':
                        if (_var4 < _var2.length) {
                            id = _var2[_var4];
                            imageData = _var3[id];
                            me.state = '24';
                            addLoadedImageButton(existingContainer, id, imageData, function (id) {
                                me.chooseExisting(id);
                            }, current).then(function () {
                                _main_showChooseImage(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            _var9 = tr('Cancel');
                            cancel = widgets.createSimpleButton(_var9, me.cancel);
                            cancel.style.marginRight = '0px';
                            buttons = div({
                                'text-align': 'right',
                                'padding-top': '20px'
                            }, cancel);
                            html.add(dialog, buttons);
                            me.state = '16';
                        }
                        break;
                    case '35':
                        tracing.trace('chooseExisting', existingId);
                        widgets.removeQuestions();
                        me.state = undefined;
                        __resolve({ id: existingId });
                        return;
                    case '36':
                        tracing.trace('uploaded', imageContent.length);
                        widgets.removeQuestions();
                        me.state = undefined;
                        __resolve({ content: imageContent });
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
                me.chooseExisting = function (_existingId_) {
                    existingId = _existingId_;
                    switch (me.state) {
                    case '19':
                        me.state = '35';
                        _main_showChooseImage(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.uploaded = function (_imageContent_) {
                    imageContent = _imageContent_;
                    switch (me.state) {
                    case '19':
                        me.state = '36';
                        _main_showChooseImage(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.cancel = function () {
                    switch (me.state) {
                    case '19':
                        me.state = '20';
                        _main_showChooseImage(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_showChooseImage(__resolve, __reject);
            });
        };
        return me;
    }
    function showChooseImage(widget, existing, current) {
        var __obj = showChooseImage_create(widget, existing, current);
        return __obj.run();
    }
    function insertFreePicture_create(widget, evt) {
        var existing, imageData;
        var me = {
            state: '2',
            type: 'insertFreePicture'
        };
        function _main_insertFreePicture(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        tracing.trace('insertFreePicture', undefined);
                        existing = widget.drakon.getLoadedImages();
                        me.state = '5';
                        showChooseImage(widget, existing, undefined).then(function (__returnee) {
                            imageData = __returnee;
                            _main_insertFreePicture(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '5':
                        if (imageData) {
                            widget.drakon.insertFree('free-image', evt, imageData);
                            me.state = '1';
                        } else {
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
                _main_insertFreePicture(__resolve, __reject);
            });
        };
        return me;
    }
    function insertFreePicture(widget, evt) {
        var __obj = insertFreePicture_create(widget, evt);
        return __obj.run();
    }
    function DrakonHubWidget_arrowLeft(self) {
        self.drakon.arrowLeft();
        return;
    }
    function startEditStyle(widget, ids, oldStyle, x, y, accepted) {
        var dialog, tr, path, context, _var2;
        tr = widget.widgetSettings.translate;
        path = widget.widgetSettings.imagePath;
        _var2 = tr('Format');
        dialog = createFormatDialog(widget, _var2, x, y);
        context = IconStyleWindow();
        context.canwidget = getCanvasWidget(widget);
        context.widget = widget;
        context.client = dialog.client;
        context.oldStyle = oldStyle;
        context.style = utils.clone(oldStyle);
        context.ids = ids;
        context.path = path;
        context.tr = tr;
        context.accepted = accepted;
        context.font = drakon_canvas.parseCssFont(oldStyle.font, {});
        context.rebuild();
        widgets.positionPopup(dialog.popup, x, y);
        return;
    }
    function startEditDiagramStyle(widget, oldStyle, x, y) {
        var tr, path, context, face, size, dialog, icon, branch, header, _var2;
        tr = widget.widgetSettings.translate;
        path = widget.widgetSettings.imagePath;
        face = gconfig.fontFamily;
        size = gconfig.fontSize;
        icon = size + 'px ' + face;
        branch = 'bold ' + (size + 2) + 'px ' + face;
        header = 'bold ' + (size + 4) + 'px ' + face;
        oldStyle.font = oldStyle.font || icon;
        oldStyle.headerFont = oldStyle.headerFont || header;
        oldStyle.branchFont = oldStyle.branchFont || branch;
        _var2 = tr('Diagram format');
        dialog = createFormatDialog(widget, _var2, x, y);
        context = DiagramStyleWindow();
        context.canwidget = getCanvasWidget(widget);
        context.widget = widget;
        context.client = dialog.client;
        context.oldStyle = oldStyle;
        context.style = {};
        context.path = path;
        context.tr = tr;
        context.accepted = {
            shadowColor: true,
            padding: true
        };
        context.font = drakon_canvas.parseCssFont(oldStyle.font, {});
        context.headerFont = drakon_canvas.parseCssFont(oldStyle.headerFont, {});
        context.branchFont = drakon_canvas.parseCssFont(oldStyle.branchFont, {});
        context.rebuild();
        widgets.positionPopup(dialog.popup, x, y);
        return;
    }
    function startEditContent_create(widget, prim, ro) {
        var newContent, fonts, tr, path, canwidget, nameChecker, _var2, _var3, _var4;
        var me = {
            state: '2',
            type: 'startEditContent'
        };
        function _main_startEditContent(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        tr = widget.widgetSettings.translate;
                        path = widget.widgetSettings.imagePath;
                        _var2 = prim.type;
                        if (_var2 === 'header') {
                            if (ro) {
                                _var4 = tr('Name');
                                widgets.inputBoxRo(prim.left, prim.top, _var4, prim.content);
                                me.state = '27';
                            } else {
                                nameChecker = getNameChecker(widget);
                                _var3 = tr('Rename');
                                me.state = '25';
                                widgets.inputBox(prim.left, prim.top, _var3, prim.content, nameChecker).then(function (__returnee) {
                                    newContent = __returnee;
                                    _main_startEditContent(__resolve, __reject);
                                }, function (error) {
                                    me.state = undefined;
                                    __reject(error);
                                });
                                return;
                            }
                        } else {
                            if (ro) {
                                editHtml(prim.left, prim.top, 'Edit content', prim.content, true, path, tr);
                                me.state = '27';
                            } else {
                                me.state = '26';
                                editHtml(prim.left, prim.top, 'Edit content', prim.content, false, path, tr).then(function (__returnee) {
                                    newContent = __returnee;
                                    _main_startEditContent(__resolve, __reject);
                                }, function (error) {
                                    me.state = undefined;
                                    __reject(error);
                                });
                                return;
                            }
                        }
                        break;
                    case '25':
                        if (newContent) {
                            if (newContent === prim.content) {
                                me.state = '27';
                            } else {
                                me.state = '28';
                            }
                        } else {
                            me.state = '27';
                        }
                        break;
                    case '26':
                        if (newContent === undefined) {
                            me.state = '27';
                        } else {
                            if (newContent === prim.content) {
                                me.state = '27';
                            } else {
                                me.state = '28';
                            }
                        }
                        break;
                    case '27':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '28':
                        canwidget = getCanvasWidget(widget);
                        fonts = canwidget.setContent(prim.id, newContent);
                        loadFonts(widget, fonts);
                        me.state = '27';
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
                _main_startEditContent(__resolve, __reject);
            });
        };
        return me;
    }
    function startEditContent(widget, prim, ro) {
        var __obj = startEditContent_create(widget, prim, ro);
        return __obj.run();
    }
    function onZoomChanged(zoom) {
        var value;
        value = zoom / 100 + '%';
        localStorage.setItem('drakonhubwidget-zoom', value);
        return;
    }
    function startEditSecondary_create(widget, prim, ro) {
        var fonts, tr, path, newContent, canwidget;
        var me = {
            state: '2',
            type: 'startEditSecondary'
        };
        function _main_startEditSecondary(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        tr = widget.widgetSettings.translate;
                        path = widget.widgetSettings.imagePath;
                        if (ro) {
                            editHtml(prim.left, prim.top, 'Upper text', prim.secondary, true, path, tr);
                            me.state = '27';
                        } else {
                            me.state = '39';
                            editHtml(prim.left, prim.top, 'Edit upper text', prim.secondary, false, path, tr).then(function (__returnee) {
                                newContent = __returnee;
                                _main_startEditSecondary(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '27':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '28':
                        canwidget = getCanvasWidget(widget);
                        fonts = canwidget.setSecondary(prim.id, newContent);
                        loadFonts(widget, fonts);
                        me.state = '27';
                        break;
                    case '39':
                        if (newContent === undefined) {
                            me.state = '27';
                        } else {
                            if (newContent === prim.secondary) {
                                me.state = '27';
                            } else {
                                me.state = '28';
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
                _main_startEditSecondary(__resolve, __reject);
            });
        };
        return me;
    }
    function startEditSecondary(widget, prim, ro) {
        var __obj = startEditSecondary_create(widget, prim, ro);
        return __obj.run();
    }
    function startChangeImage_create(widget, prim) {
        var existing, imageData;
        var me = {
            state: '2',
            type: 'startChangeImage'
        };
        function _main_startChangeImage(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        tracing.trace('startChangeImage', prim.id + ' ' + prim.image);
                        existing = widget.drakon.getLoadedImages();
                        me.state = '6';
                        showChooseImage(widget, existing, prim.image).then(function (__returnee) {
                            imageData = __returnee;
                            _main_startChangeImage(__resolve, __reject);
                        }, function (error) {
                            me.state = undefined;
                            __reject(error);
                        });
                        return;
                    case '6':
                        if (imageData) {
                            widget.drakon.setImage(prim.id, imageData);
                            me.state = '1';
                        } else {
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
                _main_startChangeImage(__resolve, __reject);
            });
        };
        return me;
    }
    function startChangeImage(widget, prim) {
        var __obj = startChangeImage_create(widget, prim);
        return __obj.run();
    }
    function startEditLink_create(widget, prim, ro) {
        var newContent, tr, path, canwidget, _var2, _var3, _var4;
        var me = {
            state: '2',
            type: 'startEditLink'
        };
        function _main_startEditLink(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        tr = widget.widgetSettings.translate;
                        path = widget.widgetSettings.imagePath;
                        if (ro) {
                            _var3 = tr('Link');
                            widgets.inputBoxRo(prim.left, prim.top, _var3, prim.link);
                            me.state = '27';
                        } else {
                            _var2 = tr('Edit link');
                            me.state = '25';
                            widgets.inputBox(prim.left, prim.top, _var2, prim.link).then(function (__returnee) {
                                newContent = __returnee;
                                _main_startEditLink(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '25':
                        if (newContent === undefined) {
                            me.state = '27';
                        } else {
                            if (newContent === prim.link) {
                                me.state = '27';
                            } else {
                                if (newContent.length > 300) {
                                    _var4 = tr('Text is too long');
                                    widgets.showErrorSnack(_var4);
                                    me.state = '27';
                                } else {
                                    me.state = '28';
                                }
                            }
                        }
                        break;
                    case '27':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '28':
                        canwidget = getCanvasWidget(widget);
                        canwidget.setLink(prim.id, newContent);
                        me.state = '27';
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
                _main_startEditLink(__resolve, __reject);
            });
        };
        return me;
    }
    function startEditLink(widget, prim, ro) {
        var __obj = startEditLink_create(widget, prim, ro);
        return __obj.run();
    }
    function checkGoodFilename(name, tr) {
        var error, ch, checker, i, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                name = name.trim();
                error = nameNotEmpty(name, tr);
                if (error) {
                    return error;
                } else {
                    checker = utils.createFilenameChecker();
                    i = 0;
                    __state = '12';
                }
                break;
            case '12':
                if (i < name.length) {
                    ch = name[i];
                    _var2 = checker.isGoodChar(ch);
                    if (_var2) {
                        i++;
                        __state = '12';
                    } else {
                        _var3 = tr('Unsupported characters');
                        return _var3;
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
    function startEditAux2_create(widget, prim, ro) {
        var tr, path, newContent, canwidget, oldContent, _var2, _var3;
        var me = {
            state: '2',
            type: 'startEditAux2'
        };
        function _main_startEditAux2(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        tr = widget.widgetSettings.translate;
                        path = widget.widgetSettings.imagePath;
                        oldContent = prim.aux2 || '';
                        if (ro) {
                            _var3 = tr('Aux info');
                            me.state = '27';
                            widgets.largeBoxRo(prim.left, prim.top, _var3, oldContent).then(function (__returnee) {
                                newContent = __returnee;
                                _main_startEditAux2(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        } else {
                            _var2 = tr('Edit aux info');
                            me.state = '39';
                            widgets.largeBox(prim.left, prim.top, _var2, oldContent).then(function (__returnee) {
                                newContent = __returnee;
                                _main_startEditAux2(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                    case '27':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '28':
                        canwidget = getCanvasWidget(widget);
                        canwidget.setAux2(prim.id, newContent);
                        me.state = '27';
                        break;
                    case '39':
                        if (newContent === undefined) {
                            me.state = '27';
                        } else {
                            if (newContent === oldContent) {
                                me.state = '27';
                            } else {
                                me.state = '28';
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
                _main_startEditAux2(__resolve, __reject);
            });
        };
        return me;
    }
    function startEditAux2(widget, prim, ro) {
        var __obj = startEditAux2_create(widget, prim, ro);
        return __obj.run();
    }
    function getNameChecker(widget) {
        var tr, _var2, _var3;
        tr = widget.widgetSettings.translate;
        if (widget.widgetSettings.strictName) {
            return function (value) {
                _var3 = checkGoodFilename(value, tr);
                return _var3;
            };
        } else {
            return function (value) {
                _var2 = nameNotEmpty(value, tr);
                return _var2;
            };
        }
    }
    function onToolbarTypeChanged(widget) {
        updateIconButtons(widget);
        layoutRedraw(widget);
        return;
    }
    function performUndo(widget) {
        var canwidget;
        canwidget = getCanvasWidget(widget);
        canwidget.undo();
        return;
    }
    function onFreeToolbarTypeChanged(widget) {
        updateFreeIconButtons(widget);
        layoutRedraw(widget);
        return;
    }
    function showToolbar(widget) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widget.widgetSettings.onShowToolbar) {
                    widget.widgetSettings.onShowToolbar();
                    __state = '8';
                } else {
                    __state = '8';
                }
                break;
            case '8':
                widget.hideToolbar = false;
                layoutRedraw(widget);
                return;
            default:
                return;
            }
        }
    }
    function toggleSilhouette(widget) {
        var canwidget;
        canwidget = getCanvasWidget(widget);
        canwidget.toggleSilhouette();
        return;
    }
    function chooseZoom(widget, evt) {
        var onChange, tr, path, value, values, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                value = getZoom();
                values = [
                    '33%',
                    '50%',
                    '67%',
                    '75%',
                    '90%',
                    '100%',
                    '110%',
                    '120%',
                    '150%',
                    '200%',
                    '250%',
                    '300%'
                ];
                onChange = function (value) {
                    setZoom(widget, value);
                };
                __state = '5';
                break;
            case '4':
                return;
            case '5':
                _var2 = tr('Zoom');
                showComboValues(evt.target, path, _var2, values, value, onChange);
                __state = '4';
                break;
            default:
                return;
            }
        }
    }
    function setRoundedLines(widget, rounded) {
        var theme;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                theme = widget.userSettings.theme2 || {};
                if (rounded) {
                    widget.lineRadius = 6;
                    __state = '10';
                } else {
                    widget.lineRadius = 0;
                    __state = '10';
                }
                break;
            case '10':
                setTheme(widget, theme);
                return;
            default:
                return;
            }
        }
    }
    function setRoundedIcons(widget, rounded) {
        var theme;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                theme = widget.userSettings.theme2 || {};
                if (rounded) {
                    widget.iconRadius = 3;
                    __state = '10';
                } else {
                    widget.iconRadius = 0;
                    __state = '10';
                }
                break;
            case '10':
                setTheme(widget, theme);
                return;
            default:
                return;
            }
        }
    }
    function chooseTheme(widget, evt) {
        var dialog, tr, path, rect, classic, white, light, greys, paleGreen, raisin, deepBlue, rtimer, wtimer, egg, tegg, grayBlue, deepGreen, gblue, coolGreen, cgreen, grayBlue2, gblue2, grayGrey, raisinGreen, gg, brown, bt, redBlue, rb, rg, black, blt, darkRed, dr, darkGreen, darkBlue, roundSection, linesRound, theme, config, iconRound, cln, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14, _var15, _var16, _var17, _var18, _var19, _var20, _var21, _var22, _var23, _var24, _var25, _var26, _var27, _var28, _var29, _var30, _var31, _var32, _var33, _var34, _var35, _var36, _var37, _var38, _var39, _var40, _var41, _var42, _var43, _var44, _var45, _var46, _var47, _var48, _var49, _var50, _var51, _var52, _var53, _var54, _var55, _var56, _var57, _var58, _var59, _var60, _var61, _var62, _var63, _var64, _var65, _var66, _var67, _var68, _var69, _var70, _var71, _var72, _var73, _var74, _var75, _var76, _var77, _var78, _var79, _var80, _var81;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                cln = utils.clone;
                theme = widget.userSettings.theme2 || {};
                config = buildDwConfig(widget);
                _var78 = utils.hasValue(theme.lineRadius);
                if (_var78) {
                    widget.lineRadius = theme.lineRadius;
                    __state = '_item19';
                } else {
                    widget.lineRadius = config.lineRadius;
                    __state = '_item19';
                }
                break;
            case '5':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                rect = evt.target.getBoundingClientRect();
                _var2 = tr('Theme');
                dialog = widgets.createMovablePopup(_var2, rect.left, rect.bottom, path, false);
                dialog.client.style.maxHeight = 'calc(100vh - 40px)';
                dialog.client.style.overflowY = 'auto';
                __state = '17';
                break;
            case '16':
                widgets.positionPopup(dialog.popup, rect.left, rect.bottom);
                return;
            case '17':
                classic = {
                    name: 'Classic',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: '#97D3E1',
                        iconBorder: 'black',
                        iconBack: 'white',
                        borderWidth: 1,
                        shadowColor: ''
                    }
                };
                wtimer = {
                    iconBack: 'white',
                    color: 'black'
                };
                _var3 = cln(wtimer);
                _var4 = cln(wtimer);
                _var5 = cln(wtimer);
                _var6 = cln(wtimer);
                _var7 = cln(wtimer);
                _var8 = cln(wtimer);
                white = {
                    name: 'White',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: 'white',
                        iconBorder: 'black',
                        iconBack: 'white',
                        borderWidth: 1,
                        shadowColor: '',
                        commentBack: 'white',
                        icons: {
                            'duration': wtimer,
                            'callout': _var3,
                            'ctrlstart': _var4,
                            'ctrlend': _var5,
                            'pause': _var6,
                            'timer': _var7,
                            'group-duration': _var8
                        }
                    }
                };
                light = {
                    name: 'Light blue',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: '#afddfa',
                        iconBorder: '#b0c0e0',
                        iconBack: 'white',
                        borderWidth: 1,
                        shadowColor: 'rgba(0, 0, 50, 0.15)',
                        icons: { comment: { internalLine: 'white' } }
                    }
                };
                greys = {
                    name: 'Greys',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: '#dfdfdf',
                        iconBorder: '#C0C0C0',
                        iconBack: 'white',
                        icons: { comment: { internalLine: 'white' } },
                        borderWidth: 1,
                        shadowColor: 'rgba(0, 0, 0, 0.15)'
                    }
                };
                addThemeRow(widget, dialog.client, classic, white, light, greys);
                __state = '31';
                break;
            case '31':
                paleGreen = {
                    name: 'Pale green',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: '#77BFA3',
                        iconBorder: 'black',
                        iconBack: 'white',
                        borderWidth: 1,
                        shadowColor: '',
                        commentBack: '#4D9174',
                        icons: { question: { iconBack: '#BFD8BD' } }
                    }
                };
                rtimer = { iconBack: 'white' };
                _var9 = cln(rtimer);
                _var10 = cln(rtimer);
                _var11 = cln(rtimer);
                _var12 = cln(rtimer);
                _var13 = cln(rtimer);
                raisin = {
                    name: 'Raisin black',
                    'theme': {
                        'lineWidth': 2,
                        'borderWidth': 2,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#5C9CCB',
                        'iconBack': '#C4E2F8',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': '#5C9CCB',
                        'commentBack': '#80BFEF',
                        'icons': {
                            'question': { 'iconBack': '#96CBF3' },
                            loopbegin: { iconBack: '#80BFEF' },
                            loopend: { iconBack: '#80BFEF' },
                            'duration': rtimer,
                            'ctrlstart': _var9,
                            'ctrlend': _var10,
                            'pause': _var11,
                            'timer': _var12,
                            'group-duration': _var13
                        }
                    }
                };
                tegg = {
                    iconBack: '#FFA849',
                    color: 'black',
                    'internalLine': 'black'
                };
                _var14 = cln(tegg);
                _var15 = cln(tegg);
                _var16 = cln(tegg);
                _var17 = cln(tegg);
                _var18 = cln(tegg);
                egg = {
                    name: 'Egg',
                    'theme': {
                        'lineWidth': 1,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#FFA849',
                        commentBack: '#FFA849',
                        'borderWidth': 1,
                        'iconBack': '#FFE26C',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': 'black',
                        'icons': {
                            'question': { 'iconBack': '#FFA849' },
                            comment: { internalLine: '#FFA849' },
                            'duration': tegg,
                            'ctrlstart': _var14,
                            'ctrlend': _var15,
                            'pause': _var16,
                            'timer': _var17,
                            'group-duration': _var18
                        }
                    }
                };
                deepBlue = {
                    name: 'Deep blue',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: '#0094FF',
                        iconBorder: '',
                        iconBack: 'white',
                        commentBack: '#7FC9FF',
                        borderWidth: 0,
                        shadowColor: '',
                        icons: {
                            question: {
                                color: 'white',
                                iconBack: '#12279F'
                            },
                            comment: { internalLine: 'white' },
                            loopbegin: { iconBack: '#7FC9FF' },
                            loopend: { iconBack: '#7FC9FF' }
                        }
                    }
                };
                addThemeRow(widget, dialog.client, paleGreen, raisin, egg, deepBlue);
                __state = '42';
                break;
            case '42':
                gblue2 = { iconBack: '#e0f8ff' };
                _var29 = cln(gblue2);
                _var30 = cln(gblue2);
                _var31 = cln(gblue2);
                _var32 = cln(gblue2);
                _var33 = cln(gblue2);
                grayBlue2 = {
                    name: 'Subtle gray blue',
                    'theme': {
                        'lineWidth': 1,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#85bded',
                        'iconBack': '#e0f8ff',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': '#A0A0A0',
                        commentBack: '#bbdffb',
                        'icons': {
                            'question': {
                                'iconBack': '#bbdffb',
                                'iconBorder': '529ad8'
                            },
                            'comment': { internalLine: '#85bded' },
                            'loopbegin': { 'iconBack': '#d0e5fB' },
                            'loopend': { 'iconBack': '#d0e5fB' },
                            'duration': gblue2,
                            'ctrlstart': _var29,
                            'ctrlend': _var30,
                            'pause': _var31,
                            'timer': _var32,
                            'group-duration': _var33
                        }
                    }
                };
                gblue = {
                    iconBack: '#7393CE',
                    'iconBorder': '#7393CE',
                    'internalLine': 'black',
                    color: 'white'
                };
                _var19 = cln(gblue);
                _var20 = cln(gblue);
                _var21 = cln(gblue);
                _var22 = cln(gblue);
                _var23 = cln(gblue);
                grayBlue = {
                    name: 'Gray blue',
                    'theme': {
                        'lineWidth': 1,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#A0A0A0',
                        'iconBack': '#EDEEF0',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': '#A0A0A0',
                        commentBack: '#7393CE',
                        'icons': {
                            'question': {
                                'iconBack': '#305399',
                                'iconBorder': '#305399',
                                color: 'white'
                            },
                            'loopbegin': {
                                'iconBack': '#7393CE',
                                'iconBorder': '#7393CE',
                                color: 'white'
                            },
                            'loopend': {
                                'iconBack': '#7393CE',
                                'iconBorder': '#7393CE',
                                color: 'white'
                            },
                            'duration': gblue,
                            'ctrlstart': _var19,
                            'ctrlend': _var20,
                            'pause': _var21,
                            'timer': _var22,
                            'group-duration': _var23
                        }
                    }
                };
                cgreen = {
                    iconBack: '#EDEEC9',
                    'internalLine': 'black'
                };
                _var24 = cln(cgreen);
                _var25 = cln(cgreen);
                _var26 = cln(cgreen);
                _var27 = cln(cgreen);
                _var28 = cln(cgreen);
                coolGreen = {
                    name: 'Cool green',
                    'theme': {
                        'lineWidth': 1,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#597A62',
                        commentBack: '#70B070',
                        'borderWidth': 1,
                        'iconBack': '#BFD8BD',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': '#597A62',
                        'icons': {
                            'question': { 'iconBack': '#EDEEC9' },
                            comment: { internalLine: '#BFD8BD' },
                            'duration': cgreen,
                            'ctrlstart': _var24,
                            'ctrlend': _var25,
                            'pause': _var26,
                            'timer': _var27,
                            'group-duration': _var28
                        }
                    }
                };
                deepGreen = {
                    name: 'Deep green',
                    theme: {
                        lineWidth: 1,
                        lines: 'black',
                        background: '#3BAD4D',
                        iconBorder: '',
                        iconBack: 'white',
                        commentBack: '#9EC85C',
                        borderWidth: 0,
                        shadowColor: '',
                        icons: {
                            question: {
                                color: 'white',
                                iconBack: '#215B2A'
                            },
                            comment: { internalLine: 'white' },
                            loopbegin: { iconBack: '#9EC85C' },
                            loopend: { iconBack: '#9EC85C' }
                        }
                    }
                };
                addThemeRow(widget, dialog.client, grayBlue2, grayBlue, coolGreen, deepGreen);
                __state = '52';
                break;
            case '52':
                rb = { iconBack: '#5050b0' };
                _var49 = cln(rb);
                _var50 = cln(rb);
                _var51 = cln(rb);
                _var52 = cln(rb);
                _var53 = cln(rb);
                redBlue = {
                    name: 'Red blue',
                    'theme': {
                        'lineWidth': 1,
                        'borderWidth': 0,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '',
                        'iconBack': '#000090',
                        'lines': 'black',
                        'color': 'white',
                        'internalLine': 'white',
                        commentBack: '#7070b0',
                        'icons': {
                            'question': { 'iconBack': '#a00000' },
                            'comment': { internalLine: '#000090' },
                            loopbegin: { iconBack: '#7070b0' },
                            loopend: { iconBack: '#7070b0' },
                            'duration': rb,
                            'ctrlstart': _var49,
                            'ctrlend': _var50,
                            'pause': _var51,
                            'timer': _var52,
                            'group-duration': _var53
                        }
                    }
                };
                gg = { iconBack: '#EDEEF0' };
                _var34 = cln(gg);
                _var35 = cln(gg);
                _var36 = cln(gg);
                _var37 = cln(gg);
                _var38 = cln(gg);
                grayGrey = {
                    name: 'Gray blue',
                    'theme': {
                        'lineWidth': 1,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#A0A0A0',
                        'iconBack': '#EDEEF0',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': '#A0A0A0',
                        commentBack: '#cdcdcd',
                        'icons': {
                            'duration': gg,
                            'ctrlstart': _var34,
                            'ctrlend': _var35,
                            'pause': _var36,
                            'timer': _var37,
                            'group-duration': _var38
                        }
                    }
                };
                bt = {
                    iconBack: '#EDEEC9',
                    'internalLine': 'black'
                };
                _var44 = cln(bt);
                _var45 = cln(bt);
                _var46 = cln(bt);
                _var47 = cln(bt);
                _var48 = cln(bt);
                brown = {
                    name: 'Brown',
                    'theme': {
                        'lineWidth': 1,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': 'black',
                        commentBack: '#89b0ae',
                        'borderWidth': 1,
                        'iconBack': '#bee3db',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': 'black',
                        'icons': {
                            'question': { 'iconBack': '#ffd6ba' },
                            comment: { internalLine: '#89b0ae' },
                            'duration': cgreen,
                            'ctrlstart': _var44,
                            'ctrlend': _var45,
                            'pause': _var46,
                            'timer': _var47,
                            'group-duration': _var48
                        }
                    }
                };
                rg = { iconBack: 'white' };
                _var39 = cln(rg);
                _var40 = cln(rg);
                _var41 = cln(rg);
                _var42 = cln(rg);
                _var43 = cln(rg);
                raisinGreen = {
                    name: 'Deep green',
                    'theme': {
                        'lineWidth': 2,
                        'borderWidth': 2,
                        'backText': 'black',
                        'background': 'white',
                        'iconBorder': '#00987E',
                        'iconBack': '#AFF0DD',
                        'lines': 'black',
                        'color': 'black',
                        'internalLine': '#00987E',
                        'commentBack': '#8FD6C2',
                        'icons': {
                            'question': { 'iconBack': '#8FD6C2' },
                            loopbegin: { iconBack: '#85C2C5' },
                            loopend: { iconBack: '#85C2C5' },
                            'duration': rg,
                            'ctrlstart': _var39,
                            'ctrlend': _var40,
                            'pause': _var41,
                            'timer': _var42,
                            'group-duration': _var43
                        }
                    }
                };
                addThemeRow(widget, dialog.client, redBlue, grayGrey, brown, raisinGreen);
                __state = '62';
                break;
            case '62':
                blt = { iconBack: 'black' };
                _var54 = cln(blt);
                _var55 = cln(blt);
                _var56 = cln(blt);
                _var57 = cln(blt);
                _var58 = cln(blt);
                black = {
                    name: 'Black',
                    'theme': {
                        'lineWidth': 1,
                        'borderWidth': 1,
                        'backText': 'white',
                        'background': 'black',
                        'iconBorder': '#a0a0a0',
                        'iconBack': 'black',
                        'lines': '#c0c0c0',
                        'color': 'white',
                        'internalLine': '#a0a0a0',
                        'commentBack': '#404040',
                        'scrollBar': 'rgba(200, 200, 200, 0.3)',
                        'scrollBarHover': '#909090',
                        'icons': {
                            'duration': blt,
                            'ctrlstart': _var54,
                            'ctrlend': _var55,
                            'pause': _var56,
                            'timer': _var57,
                            'group-duration': _var58
                        }
                    }
                };
                dr = { iconBack: 'black' };
                _var59 = cln(dr);
                _var60 = cln(dr);
                _var61 = cln(dr);
                _var62 = cln(dr);
                _var63 = cln(dr);
                _var64 = cln(dr);
                darkRed = {
                    name: 'Dark red',
                    'theme': {
                        'lineWidth': 1,
                        'borderWidth': 1,
                        'backText': '#fff0bd',
                        'background': 'black',
                        'iconBorder': 'red',
                        'iconBack': 'black',
                        'lines': 'red',
                        'color': '#fff0bd',
                        'internalLine': 'red',
                        commentBack: '#500000',
                        'scrollBar': 'rgba(255, 0, 0, 0.3)',
                        'scrollBarHover': 'darkred',
                        'icons': {
                            'duration': _var59,
                            'ctrlstart': _var60,
                            'ctrlend': _var61,
                            'pause': _var62,
                            'timer': _var63,
                            'group-duration': _var64
                        }
                    }
                };
                _var65 = cln(dr);
                _var66 = cln(dr);
                _var67 = cln(dr);
                _var68 = cln(dr);
                _var69 = cln(dr);
                _var70 = cln(dr);
                darkGreen = {
                    name: 'Dark green',
                    'theme': {
                        'lineWidth': 1,
                        'borderWidth': 1,
                        'backText': '#d8ffd9',
                        'background': 'black',
                        'iconBorder': '#00d000',
                        'iconBack': 'black',
                        'lines': '#00ff00',
                        'color': '#d8ffd9',
                        'internalLine': '#00d000',
                        commentBack: '#004000',
                        'scrollBar': 'rgba(0, 255, 0, 0.3)',
                        'scrollBarHover': 'green',
                        'icons': {
                            'duration': _var65,
                            'ctrlstart': _var66,
                            'ctrlend': _var67,
                            'pause': _var68,
                            'timer': _var69,
                            'group-duration': _var70
                        }
                    }
                };
                _var71 = cln(dr);
                _var72 = cln(dr);
                _var73 = cln(dr);
                _var74 = cln(dr);
                _var75 = cln(dr);
                _var76 = cln(dr);
                darkBlue = {
                    name: 'Dark blue',
                    'theme': {
                        'lineWidth': 2,
                        'borderWidth': 2,
                        'backText': '#c8c8ff',
                        'background': 'black',
                        'iconBorder': '#0000ff',
                        'iconBack': 'black',
                        'lines': '#0000ff',
                        'color': '#c8c8ff',
                        'internalLine': '#0000ff',
                        commentBack: '#000040',
                        'scrollBar': 'rgba(0, 0, 255, 0.3)',
                        'scrollBarHover': 'blue',
                        'icons': {
                            'duration': _var71,
                            'ctrlstart': _var72,
                            'ctrlend': _var73,
                            'pause': _var74,
                            'timer': _var75,
                            'group-duration': _var76
                        }
                    }
                };
                addThemeRow(widget, dialog.client, black, darkRed, darkGreen, darkBlue);
                __state = '78';
                break;
            case '78':
                roundSection = div({
                    background: 'white',
                    padding: '5px',
                    'border-top': 'solid 1px ' + unit.darkColor
                });
                html.add(dialog.client, roundSection);
                linesRound = !(widget.lineRadius === 0);
                _var77 = tr('Round line corners');
                addBoolControlGeneric(roundSection, _var77, linesRound, function (checked) {
                    setRoundedLines(widget, checked);
                });
                iconRound = !(widget.iconRadius === 0);
                _var81 = html.createElement('br');
                html.add(roundSection, _var81);
                _var80 = tr('Round element corners');
                addBoolControlGeneric(roundSection, _var80, iconRound, function (checked) {
                    setRoundedIcons(widget, checked);
                });
                __state = '16';
                break;
            case '_item19':
                _var79 = utils.hasValue(theme.iconRadius);
                if (_var79) {
                    widget.iconRadius = theme.iconRadius;
                    __state = '5';
                } else {
                    widget.iconRadius = config.iconRadius;
                    __state = '5';
                }
                break;
            default:
                return;
            }
        }
    }
    function insertGroupDuration(widget, direction, evt) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (direction === 'left') {
                    widget.drakon.insertFree('group-duration-left', evt);
                    __state = '1';
                } else {
                    widget.drakon.insertFree('group-duration-right', evt);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function performRedo(widget) {
        var canwidget;
        canwidget = getCanvasWidget(widget);
        canwidget.redo();
        return;
    }
    function hideToolbar(widget) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widget.widgetSettings.onHideToolbar) {
                    widget.widgetSettings.onHideToolbar();
                    __state = '9';
                } else {
                    __state = '9';
                }
                break;
            case '9':
                widget.hideToolbar = true;
                widget.showDesc = false;
                layoutRedraw(widget);
                return;
            default:
                return;
            }
        }
    }
    function goHome(widget) {
        var canwidget;
        canwidget = getCanvasWidget(widget);
        canwidget.goHome();
        return;
    }
    function setPseudoLanguage(language) {
        localStorage.setItem('pseudo-language', language);
        return;
    }
    function getPseudoLanguage() {
        var _var2;
        _var2 = localStorage.getItem('pseudo-language');
        return _var2 || 'en';
    }
    function generateCore(widget, language) {
        var content, result, message, json, obj, name;
        json = widget.drakon.exportJson();
        obj = JSON.parse(json);
        name = obj.name;
        try {
            content = drakongen.toPseudocode(json, name, name + '.drakon', language);
            result = {
                ok: true,
                content: content
            };
        } catch (ex) {
            message = ex.message + '\n' + (ex.filename || '') + '\n' + (ex.nodeId || '');
            result = {
                ok: false,
                content: message
            };
        }
        return result;
    }
    function copyTextToClipboard(text, tr) {
        var _var2;
        navigator.clipboard.writeText(text);
        _var2 = tr('Copied');
        widgets.showGoodSnack(_var2);
        return;
    }
    function showPseudocode(widget, generated) {
        var dialog, tr, cancel, buttons, headerSize, pre, copy, language, regenerate, combo, options, generate, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                language = getPseudoLanguage();
                tr = widget.widgetSettings.translate;
                dialog = widgets.createWideMiddleWindow();
                __state = '12';
                break;
            case '4':
                return;
            case '5':
                headerSize = gconfig.fontSize + 2 + 'px';
                _var5 = tr('Pseudocode');
                _var4 = div({
                    text: _var5,
                    'font-weight': 'bold',
                    'font-size': headerSize
                });
                _var3 = div({
                    'text-align': 'center',
                    'line-height': 1.3,
                    'padding-bottom': '10px',
                    'position': 'relative'
                }, _var4);
                html.add(dialog, _var3);
                pre = html.createElement('pre');
                html.setText(pre, generated.content);
                pre.style.padding = '20px';
                pre.style.background = '#dbdbdb';
                html.add(dialog, pre);
                __state = '4';
                break;
            case '12':
                _var2 = tr('Close');
                cancel = widgets.createSimpleButton(_var2, widgets.removeQuestions);
                cancel.style.marginRight = '0px';
                if (generated.ok) {
                    _var6 = tr('Copy');
                    copy = widgets.createDefaultButton(_var6, function () {
                        copyTextToClipboard(generated.content, tr);
                    });
                    buttons = div({
                        'padding-top': '10px',
                        position: 'relative',
                        'text-align': 'right'
                    }, copy, cancel);
                    __state = '16';
                } else {
                    buttons = div({
                        'padding-top': '10px',
                        position: 'relative',
                        'text-align': 'right'
                    }, cancel);
                    __state = '16';
                }
                break;
            case '16':
                html.add(dialog, buttons);
                __state = '27';
                break;
            case '27':
                regenerate = div({
                    display: 'inline-block',
                    position: 'absolute',
                    left: '10px',
                    top: '10px'
                });
                html.add(buttons, regenerate);
                _var8 = tr('Language');
                _var7 = div({
                    text: _var8,
                    display: 'inline-block'
                });
                html.add(regenerate, _var7);
                options = [
                    {
                        id: 'en',
                        text: 'English'
                    },
                    {
                        id: 'no',
                        text: 'Norsk'
                    },
                    {
                        id: 'ru',
                        text: 'Русский'
                    }
                ];
                combo = html.createElement('select');
                combo.style.padding = '5px';
                combo.style.marginLeft = '5px';
                html.addOption(combo, 'en', 'English');
                html.addOption(combo, 'no', 'Norsk');
                html.addOption(combo, 'ru', 'Русский');
                combo.value = language;
                html.add(regenerate, combo);
                __state = '37';
                break;
            case '37':
                _var9 = tr('Generate');
                generate = widgets.createSimpleButton(_var9, function () {
                    regeneratePseudocode(widget, combo.value);
                });
                generate.style.marginLeft = '5px';
                generate.style.verticalAlign = 'middle';
                html.add(regenerate, generate);
                __state = '5';
                break;
            default:
                return;
            }
        }
    }
    function regeneratePseudocode(widget, language) {
        var generated;
        generated = generateCore(widget, language);
        setPseudoLanguage(language);
        showPseudocode(widget, generated);
        return;
    }
    function generateCode_create(widget) {
        var generated, language;
        var me = {
            state: '11',
            type: 'generateCode'
        };
        function _main_generateCode(__resolve, __reject) {
            try {
                language = getPseudoLanguage();
                generated = generateCore(widget, language);
                showPseudocode(widget, generated);
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
                _main_generateCode(__resolve, __reject);
            });
        };
        return me;
    }
    function generateCode(widget) {
        var __obj = generateCode_create(widget);
        return __obj.run();
    }
    function isRounded(widget) {
        var theme;
        theme = widget.userSettings.theme2;
        if (theme.lineRadius === 0) {
            return false;
        } else {
            return true;
        }
    }
    function DrakonHubWidget_arrowRight(self) {
        self.drakon.arrowRight();
        return;
    }
    function DrakonHubWidget_showItem(self, itemId) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (itemId === 'description') {
                    showDescription(self);
                    __state = '1';
                } else {
                    self.drakon.showItem(itemId);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function addIndicator(widget, config) {
        var color;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (config.theme) {
                    if (config.theme.lines) {
                        color = config.theme.lines;
                        __state = '3';
                    } else {
                        __state = '9';
                    }
                } else {
                    __state = '9';
                }
                break;
            case '3':
                widget.indicator.element = div({
                    display: 'inline-block',
                    position: 'absolute',
                    left: '10px',
                    bottom: '20px',
                    'pointer-events': 'none',
                    'user-select': 'none',
                    color: color
                });
                html.add(widget.view, widget.indicator.element);
                widget.indicator.tr = widget.widgetSettings.translate;
                return;
            case '9':
                color = 'black';
                __state = '3';
                break;
            default:
                return;
            }
        }
    }
    function Indicator_saving(self) {
        var _var2;
        _var2 = self.tr('Saving...');
        html.setText(self.element, _var2);
        return;
    }
    function Indicator_saved(self) {
        var _var2;
        _var2 = self.tr('Saved');
        html.setText(self.element, _var2);
        return;
    }
    function Indicator_showReadonly(self) {
        var _var2;
        _var2 = self.tr('Read-only');
        html.setText(self.element, _var2);
        return;
    }
    function DrakonHubWidget_exportImage(self, res, watermark) {
        var canvas, json, image, obj, zoom;
        zoom = 10000 * res;
        canvas = self.drakon.exportCanvas(zoom, watermark);
        json = self.drakon.exportJson();
        obj = JSON.parse(json);
        image = canvas.toDataURL('image/png');
        return {
            name: obj.name,
            image: image,
            type: 'drakon'
        };
    }
    function DrakonHubWidget_insertDrakonPicture_create(self) {
        var me = {
            state: '2',
            type: 'DrakonHubWidget_insertDrakonPicture'
        };
        function _main_DrakonHubWidget_insertDrakonPicture(__resolve, __reject) {
            try {
                insertPicture(self, 'drakon-image');
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
                _main_DrakonHubWidget_insertDrakonPicture(__resolve, __reject);
            });
        };
        return me;
    }
    function DrakonHubWidget_insertDrakonPicture(self) {
        var __obj = DrakonHubWidget_insertDrakonPicture_create(self);
        return __obj.run();
    }
    function DrakonHubWidget_redraw(self, container) {
        var tr, path, _var2;
        self.buttonsBar = div('drakonhubwidget-buttons-container');
        html.add(container, self.buttonsBar);
        self.view = div('drakonhubwidget-diagram-container');
        html.add(container, self.view);
        tr = self.widgetSettings.translate;
        path = self.widgetSettings.imagePath;
        _var2 = tr('Show toolbar');
        self.showToolbar = widgets.createIconButton(path + 'right-angle2.png', function () {
            showToolbar(self);
        }, _var2);
        html.add(container, self.showToolbar);
        rebuildToolbar(self);
        layoutRedraw(self);
        return;
    }
    function DrakonHubWidget_undo(self) {
        performUndo(self);
        return;
    }
    function DrakonHubWidget_arrowDown(self) {
        self.drakon.arrowDown();
        return;
    }
    function DrakonHubWidget_arrowUp(self) {
        self.drakon.arrowUp();
        return;
    }
    function buildDwConfig(widget) {
        var face, config, size, icon, branch, header;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widget.userSettings) {
                    if (widget.userSettings.theme2) {
                        config = utils.deepClone(widget.userSettings.theme2);
                        __state = '16';
                    } else {
                        __state = '13';
                    }
                } else {
                    __state = '13';
                }
                break;
            case '10':
                config.showContextMenu = widget.widgetSettings.showContextMenu;
                config.translate = widget.widgetSettings.translate;
                config.watermark = widget.widgetSettings.watermark;
                config.editorWatermark = widget.widgetSettings.editorWatermark;
                config.setClipboard = widget.widgetSettings.setClipboard;
                config.getClipboard = widget.widgetSettings.getClipboard;
                config.onItemClick = widget.widgetSettings.onItemClick;
                config.getCursorForItem = widget.widgetSettings.getCursorForItem;
                config.hasPopup = widgets.hasPopup;
                config.removePopups = widgets.removePopups;
                config.onZoomChanged = onZoomChanged;
                config.startEditContent = function (prim, ro) {
                    startEditContent(widget, prim, ro);
                };
                config.startEditSecondary = function (prim, ro) {
                    startEditSecondary(widget, prim, ro);
                };
                config.startEditLink = function (prim, ro) {
                    startEditLink(widget, prim, ro);
                };
                config.startEditStyle = function (ids, oldStyle, x, y, accepted) {
                    startEditStyle(widget, ids, oldStyle, x, y, accepted);
                };
                config.startEditDiagramStyle = function (oldStyle, x, y) {
                    startEditDiagramStyle(widget, oldStyle, x, y);
                };
                config.startEditAux2 = function (prim, ro) {
                    startEditAux2(widget, prim, ro);
                };
                config.startChangeImage = function (prim) {
                    startChangeImage(widget, prim);
                };
                return config;
            case '13':
                config = {};
                __state = '16';
                break;
            case '16':
                copyFieldsIfMissing(config, {
                    lineRadius: 6,
                    iconRadius: 0
                });
                utils.copyFieldsWithValue(config, widget.userSettings, [
                    'yes',
                    'no',
                    'end',
                    'exit',
                    'branch'
                ]);
                face = getFontFace();
                face = gconfig.fontFamily;
                size = gconfig.fontSize;
                icon = size + 'px ' + face;
                branch = 'bold ' + (size + 2) + 'px ' + face;
                header = 'bold ' + (size + 4) + 'px ' + face;
                config.font = icon;
                config.headerFont = header;
                config.branchFont = branch;
                config.drawZones = false;
                config.canvasIcons = true;
                config.canSelect = true;
                config.allowResize = true;
                config.textFormat = 'html';
                config.maxWidth = widget.iconWidth;
                config.imagePath = widget.widgetSettings.imagePath;
                config.showLog = gconfig.showLog;
                if ('padding' in gconfig) {
                    config.padding = gconfig.padding;
                    __state = '10';
                } else {
                    __state = '10';
                }
                break;
            default:
                return;
            }
        }
    }
    function updateIconButtons(widget) {
        var tr, path, row2, row3, row, row4, _var2, _var3, _var4, _var5, _var6, _var7, _var8, _var9, _var10, _var11, _var12, _var13, _var14, _var15;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                html.clear(widget.iconButtons);
                __state = '14';
                break;
            case '9':
                _var10 = div({ height: '10px' });
                html.add(widget.iconButtons, _var10);
                return;
            case '10':
                addIconRow(widget, widget.iconButtons, 'foreach.png', 'foreach', 'FOR Loop', 'L', 'insertion.png', 'insertion', 'Insertion', 'N');
                row2 = addRowToToolbar(widget.iconButtons);
                _var3 = tr('Comment');
                addIconButton(widget, row2, 'comment.png', function () {
                    widget.showInsertionSockets('comment');
                }, _var3, undefined);
                _var13 = tr('Picture');
                addIconButton(widget, row2, 'picture.png', function () {
                    widget.insertDrakonPicture();
                }, _var13, undefined);
                __state = '9';
                break;
            case '11':
                addIconRow(widget, widget.iconButtons, 'parblock.png', 'parblock', 'Concurrent processes', '', 'par.png', 'par', 'Add path', '');
                addIconRow(widget, widget.iconButtons, 'ctrl-start.png', 'ctrlstart', 'Start of control period', '', 'ctrl-end.png', 'ctrlend', 'End of control period', '');
                addIconRow(widget, widget.iconButtons, 'pause.png', 'pause', 'Pause', '', 'duration.png', 'duration', 'Duration', '');
                addIconRow(widget, widget.iconButtons, 'shelf.png', 'shelf', 'Shelf', '', 'insertion.png', 'insertion', 'Insertion', 'N');
                row2 = addRowToToolbar(widget.iconButtons);
                _var4 = tr('Group duration - left');
                addIconButton(widget, row2, 'group-duration.png', function (evt) {
                    insertGroupDuration(widget, 'left', evt);
                }, _var4, undefined);
                _var5 = tr('Group duration - right');
                addIconButton(widget, row2, 'group-duration-r.png', function (evt) {
                    insertGroupDuration(widget, 'right', evt);
                }, _var5, undefined);
                row3 = addRowToToolbar(widget.iconButtons);
                _var6 = tr('Comment');
                addIconButton(widget, row3, 'comment.png', function () {
                    widget.showInsertionSockets('comment');
                }, _var6, undefined);
                _var14 = tr('Picture');
                addIconButton(widget, row3, 'picture.png', function () {
                    widget.insertDrakonPicture();
                }, _var14, undefined);
                __state = '9';
                break;
            case '12':
                addIconRow(widget, widget.iconButtons, 'foreach.png', 'foreach', 'FOR Loop', 'L', 'timer.png', 'timer', 'Timer', '');
                addIconRow(widget, widget.iconButtons, 'sinput.png', 'simpleinput', 'Simple input', '', 'soutput.png', 'simpleoutput', 'Simple output', '');
                addIconRow(widget, widget.iconButtons, 'input.png', 'input', 'Input', '', 'output.png', 'output', 'Output', '');
                __state = '45';
                break;
            case '14':
                addIconRow(widget, widget.iconButtons, 'action.png', 'action', 'Action', 'A', 'question.png', 'question', 'Question', 'Q');
                addIconRow(widget, widget.iconButtons, 'select.png', 'select', 'Choice', 'S', 'case.png', 'case', 'Case', 'C');
                row = addRowToToolbar(widget.iconButtons);
                addIconButton(widget, row, 'branch.png', function () {
                    widget.showInsertionSockets('branch');
                }, 'Silhouette branch', 'B');
                _var12 = tr('Silhouette / primitive');
                addIconButton(widget, row, 'silhouette.png', function () {
                    toggleSilhouette(widget);
                }, _var12, undefined);
                localStorage.setItem('drakonhubwidget-toolbar-type', widget.typeCombo.value);
                _var2 = widget.typeCombo.value;
                if (_var2 === 'basic') {
                    __state = '10';
                } else {
                    if (_var2 === 'medic') {
                        __state = '11';
                    } else {
                        if (_var2 === 'all') {
                            __state = '12';
                        } else {
                            throw new Error('Unexpected case value: ' + _var2);
                        }
                    }
                }
                break;
            case '45':
                addIconRow(widget, widget.iconButtons, 'parblock.png', 'parblock', 'Concurrent processes', '', 'par.png', 'par', 'Add path', '');
                addIconRow(widget, widget.iconButtons, 'ctrl-start.png', 'ctrlstart', 'Start of control period', '', 'ctrl-end.png', 'ctrlend', 'End of control period', '');
                addIconRow(widget, widget.iconButtons, 'pause.png', 'pause', 'Pause', '', 'duration.png', 'duration', 'Duration', '');
                addIconRow(widget, widget.iconButtons, 'shelf.png', 'shelf', 'Shelf', '', 'insertion.png', 'insertion', 'Insertion', 'N');
                row2 = addRowToToolbar(widget.iconButtons);
                _var7 = tr('Group duration - left');
                addIconButton(widget, row2, 'group-duration.png', function (evt) {
                    insertGroupDuration(widget, 'left', evt);
                }, _var7, undefined);
                _var8 = tr('Group duration - right');
                addIconButton(widget, row2, 'group-duration-r.png', function (evt) {
                    insertGroupDuration(widget, 'right', evt);
                }, _var8, undefined);
                row3 = addRowToToolbar(widget.iconButtons);
                _var9 = tr('Comment');
                addIconButton(widget, row3, 'comment.png', function () {
                    widget.showInsertionSockets('comment');
                }, _var9, undefined);
                _var11 = tr('Parallel process');
                addIconButton(widget, row3, 'process.png', function () {
                    widget.showInsertionSockets('process');
                }, _var11, undefined);
                if (gconfig.free) {
                    addIconRowFree(widget, widget.iconButtons, 'rectangle.png', 'rectangle', 'Free rectangle', '', 'callout.png', 'callout', 'Callout', '');
                    __state = '65';
                } else {
                    __state = '65';
                }
                break;
            case '65':
                row4 = addRowToToolbar(widget.iconButtons);
                _var15 = tr('Picture');
                addIconButton(widget, row4, 'picture.png', function () {
                    widget.insertDrakonPicture();
                }, _var15, undefined);
                __state = '9';
                break;
            default:
                return;
            }
        }
    }
    function getZoom() {
        var value, _var2;
        _var2 = localStorage.getItem('drakonhubwidget-zoom');
        value = _var2 || '100%';
        return value;
    }
    function addIconButton(widget, row, icon, action, tip, key) {
        var tr, path, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                tip = tr(tip);
                if (key) {
                    _var2 = tr('Key');
                    tip += '. ' + _var2 + ': ' + key;
                    __state = '_item3';
                } else {
                    __state = '_item3';
                }
                break;
            case '_item3':
                _var3 = widgets.createIconButton(path + icon, action, tip);
                html.add(row, _var3);
                return;
            default:
                return;
            }
        }
    }
    function setZoom(widget, value) {
        localStorage.setItem('drakonhubwidget-zoom', value);
        setZoomCore(widget, value);
        return;
    }
    function buildQuestionPath(ctx, x, y, w, h, padding) {
        var x0, x1, x3, x2, top, bottom, middle, _var2, _var3;
        padding = Math.round(padding);
        _var2 = Math.round(h);
        _var3 = Math.round(h / 2);
        x0 = Math.round(x);
        x1 = x0 + padding;
        x3 = Math.round(x + w);
        x2 = x3 - padding;
        top = Math.round(y);
        bottom = top + _var2;
        middle = top + _var3;
        ctx.beginPath();
        ctx.moveTo(x0, middle);
        ctx.lineTo(x1, top);
        ctx.lineTo(x2, top);
        ctx.lineTo(x3, middle);
        ctx.lineTo(x2, bottom);
        ctx.lineTo(x1, bottom);
        ctx.closePath();
        return;
    }
    function rectangle(ctx, x, y, width, height, color, lineWidth, background) {
        x = Math.round(x);
        y = Math.round(y);
        width = Math.round(width);
        height = Math.round(height);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = background;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x + 0.5, y + 0.5, width, height);
        return;
    }
    function updateToolbarVisibility(widget) {
        var showToolbar;
        showToolbar = localStorage.getItem('drakonhub-showtoolbar');
        return;
    }
    function updateMindButtons(widget) {
        var tr, path, row2, row3, _var2, _var3, _var4;
        tr = widget.widgetSettings.translate;
        path = widget.widgetSettings.imagePath;
        html.clear(widget.iconButtons);
        addIconRow(widget, widget.iconButtons, 'rectangle.png', 'idea', 'Idea', 'A', 'rounded.png', 'ridea', 'Idea - rounded', 'R');
        row2 = addRowToToolbar(widget.iconButtons);
        _var2 = tr('Conclusion');
        addIconButton(widget, row2, 'comment.png', function () {
            widget.showInsertionSockets('conclusion');
        }, _var2, 'C');
        _var3 = tr('Callout');
        addIconButton(widget, row2, 'callout.png', function (evt) {
            widget.drakon.insertFree('callout', evt);
        }, _var3, undefined);
        addIconRowFree(widget, widget.iconButtons, 'line.png', 'line', 'Line', 'L', 'arrow.png', 'arrow', 'Arrow', 'W');
        addIconRowFree(widget, widget.iconButtons, 'frame.png', 'frame', 'Frame', '', 'polyline.png', 'polyline', 'Polyline', '');
        row3 = addRowToToolbar(widget.iconButtons);
        _var4 = tr('Picture');
        addIconButton(widget, row3, 'picture.png', function () {
            insertPicture(widget, 'graf-image');
        }, _var4, undefined);
        return;
    }
    function addIconRow(widget, container, icon1, type1, tip1, key1, icon2, type2, tip2, key2) {
        var action1, action2, row;
        action1 = function () {
            widget.showInsertionSockets(type1);
        };
        action2 = function () {
            widget.showInsertionSockets(type2);
        };
        row = addRowToToolbar(container);
        addIconButton(widget, row, icon1, action1, tip1, key1);
        addIconButton(widget, row, icon2, action2, tip2, key2);
        return;
    }
    function rebuildToolbar(widget) {
        var typeCombo, tr, type, _var2, _var3, _var4, _var5, _var6, _var7, _var8;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                html.clear(widget.buttonsBar);
                if (widget.widgetSettings.mainMenuButton) {
                    addMainMenuButton(widget, widget.buttonsBar, widget.widgetSettings.mainMenuButton);
                    __state = '38';
                } else {
                    __state = '38';
                }
                break;
            case '10':
                return;
            case '11':
                if (widget.diagram.access === 'read') {
                    __state = '10';
                } else {
                    if (widget.widgetSettings.showUndo) {
                        addToolbarRow(widget, widget.commonButtons, 'undo.png', performUndo, 'Undo', 'redo.png', performRedo, 'Redo');
                        __state = '_item2';
                    } else {
                        __state = '_item2';
                    }
                }
                break;
            case '14':
                addToolbarRow(widget, widget.commonButtons, 'left-angle2.png', hideToolbar, 'Hide toolbar', 'home.png', goHome, 'To diagram home');
                addToolbarRow(widget, widget.commonButtons, 'theme.png', chooseTheme, 'Color theme', 'zoom.png', chooseZoom, 'Zoom');
                if (widget.diagram.type === 'drakon') {
                    addToolbarRow(widget, widget.commonButtons, 'description.png', showDescription, 'Description', 'code.png', generateCode, 'Pseudocode');
                    __state = '11';
                } else {
                    addToolbarRow(widget, widget.commonButtons, 'description.png', showDescription, 'Description', undefined, undefined, undefined);
                    __state = '11';
                }
                break;
            case '19':
                typeCombo = html.createElement('select');
                typeCombo.style.width = '82px';
                typeCombo.style.marginTop = '3px';
                typeCombo.style.marginBottom = '3px';
                typeCombo.style.paddingTop = '5px';
                typeCombo.style.paddingBottom = '5px';
                typeCombo.style.border = 'solid 1px #c0c0c0';
                html.add(widget.commonButtons, typeCombo);
                _var3 = tr('Basic');
                html.addOption(typeCombo, 'basic', _var3);
                _var4 = tr('Medic');
                html.addOption(typeCombo, 'medic', _var4);
                _var5 = tr('All');
                html.addOption(typeCombo, 'all', _var5);
                type = localStorage.getItem('drakonhubwidget-toolbar-type');
                type = type || 'basic';
                typeCombo.value = type;
                widget.typeCombo = typeCombo;
                registerEvent(typeCombo, 'change', function () {
                    onToolbarTypeChanged(widget);
                });
                updateIconButtons(widget);
                __state = '10';
                break;
            case '38':
                widget.commonButtons = div();
                html.add(widget.buttonsBar, widget.commonButtons);
                widget.iconButtons = div();
                html.add(widget.buttonsBar, widget.iconButtons);
                if (widget.diagram) {
                    __state = '14';
                } else {
                    __state = '10';
                }
                break;
            case '47':
                typeCombo = html.createElement('select');
                typeCombo.style.width = '82px';
                typeCombo.style.marginTop = '3px';
                typeCombo.style.marginBottom = '3px';
                typeCombo.style.paddingTop = '5px';
                typeCombo.style.paddingBottom = '5px';
                typeCombo.style.border = 'solid 1px #c0c0c0';
                html.add(widget.commonButtons, typeCombo);
                _var6 = tr('Basic');
                html.addOption(typeCombo, 'basic', _var6);
                _var7 = tr('UI');
                html.addOption(typeCombo, 'ui', _var7);
                _var8 = tr('Architect');
                html.addOption(typeCombo, 'architect', _var8);
                type = localStorage.getItem('drakonhubwidget-free-toolbar-type');
                type = type || 'basic';
                typeCombo.value = type;
                widget.typeCombo = typeCombo;
                registerEvent(typeCombo, 'change', function () {
                    onFreeToolbarTypeChanged(widget);
                });
                updateFreeIconButtons(widget);
                __state = '10';
                break;
            case '61':
                updateMindButtons(widget);
                __state = '10';
                break;
            case '_item2':
                _var2 = widget.diagram.type;
                if (_var2 === 'drakon') {
                    __state = '19';
                } else {
                    if (_var2 === 'graf') {
                        __state = '61';
                    } else {
                        if (_var2 === 'free') {
                            __state = '47';
                        } else {
                            throw new Error('Unexpected case value: ' + _var2);
                        }
                    }
                }
                break;
            default:
                return;
            }
        }
    }
    function layoutView(widget) {
        var viewRect, iconRect, commonRect, toolbarHeight, containerRect, toolbarWidth, canvas, config, canwidget, diaDiv, descDiv, dwidth;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (widget.hideToolbar) {
                    widget.buttonsBar.style.display = 'none';
                    widget.view.style.width = '100%';
                    widget.view.style.left = '0px';
                    widget.showToolbar.style.display = 'inline-block';
                    widget.showToolbar.style.position = 'absolute';
                    widget.showToolbar.style.left = '3px';
                    widget.showToolbar.style.top = '3px';
                    __state = '38';
                } else {
                    widget.buttonsBar.style.display = 'inline-block';
                    widget.showToolbar.style.display = 'none';
                    __state = '16';
                }
                break;
            case '12':
                return;
            case '13':
                viewRect = diaDiv.getBoundingClientRect();
                config = buildDwConfig(widget);
                canwidget = getCanvasWidget(widget);
                canvas = canwidget.render(viewRect.width, viewRect.height, config);
                html.add(diaDiv, canvas);
                addIndicator(widget, config);
                if (widget.diagram) {
                    if (widget.diagram.access === 'read') {
                        widget.indicator.showReadonly();
                        __state = '12';
                    } else {
                        __state = '12';
                    }
                } else {
                    __state = '12';
                }
                break;
            case '16':
                iconRect = widget.iconButtons.getBoundingClientRect();
                commonRect = widget.commonButtons.getBoundingClientRect();
                toolbarHeight = iconRect.height + commonRect.height;
                containerRect = widget.container.getBoundingClientRect();
                if (toolbarHeight > containerRect.height) {
                    toolbarWidth = 98;
                    __state = '24';
                } else {
                    toolbarWidth = 90;
                    __state = '24';
                }
                break;
            case '24':
                widget.buttonsBar.style.width = toolbarWidth + 'px';
                widget.view.style.width = 'calc(100% - ' + toolbarWidth + 'px)';
                widget.view.style.left = toolbarWidth + 'px';
                __state = '38';
                break;
            case '38':
                html.clear(widget.view);
                if (widget.type) {
                    if (widget.showDesc) {
                        dwidth = 400;
                        descDiv = buildDescDiv(widget, dwidth);
                        diaDiv = div({
                            display: 'inline-block',
                            height: '100%',
                            width: 'calc(100% - ' + dwidth + 'px)',
                            position: 'absolute',
                            left: dwidth + 'px',
                            top: '0px'
                        });
                        html.add(widget.view, descDiv);
                        html.add(widget.view, diaDiv);
                        __state = '13';
                    } else {
                        diaDiv = widget.view;
                        __state = '13';
                    }
                } else {
                    __state = '12';
                }
                break;
            default:
                return;
            }
        }
    }
    function addToolbarRow(widget, container, icon1, command1, tip1, icon2, command2, tip2) {
        var row, tr, path, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                tip1 = tr(tip1);
                tip2 = tr(tip2);
                row = addRowToToolbar(container);
                _var2 = widgets.createIconButton(path + icon1, function (evt) {
                    command1(widget, evt);
                }, tip1);
                html.add(row, _var2);
                if (icon2) {
                    _var3 = widgets.createIconButton(path + icon2, function (evt) {
                        command2(widget, evt);
                    }, tip2);
                    html.add(row, _var3);
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
    function mergeUserSettings(config, userSettings) {
        return;
    }
    function setTheme(widget, theme) {
        theme.lineRadius = widget.lineRadius;
        theme.iconRadius = widget.iconRadius;
        widget.userSettings.theme2 = theme;
        layoutRedraw(widget);
        widget.widgetSettings.saveUserSettings({ theme2: widget.userSettings.theme2 });
        return;
    }
    function line(ctx, x1, y1, x2, y2, color, width) {
        var _var2, _var3, _var4, _var5;
        _var2 = Math.round(x1);
        _var3 = Math.round(y1);
        _var4 = Math.round(x2);
        _var5 = Math.round(y2);
        x1 = _var2 + 0.5;
        y1 = _var3 + 0.5;
        x2 = _var4 + 0.5;
        y2 = _var5 + 0.5;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return;
    }
    function layoutRedraw(widget) {
        var canwidget;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                layoutView(widget);
                if (widget.showDesc) {
                    fillDesc(widget);
                    __state = '4';
                } else {
                    __state = '4';
                }
                break;
            case '4':
                if (widget.diagram) {
                    canwidget = getCanvasWidget(widget);
                    canwidget.redraw();
                    __state = '9';
                } else {
                    __state = '9';
                }
                break;
            case '9':
                widget.quill = undefined;
                return;
            default:
                return;
            }
        }
    }
    function getCanvasWidget(widget) {
        return widget.drakon;
    }
    function addRowToToolbar(container) {
        var row;
        row = div({
            'white-space': 'nowrap',
            'padding-top': '1px',
            'padding-bottom': '1px'
        });
        html.add(container, row);
        return row;
    }
    function stopEditSender(widget) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (widget.sender) {
                    widget.sender.stop();
                    widget.sender = undefined;
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
    function getFontFace() {
        return gconfig.fontFamily;
    }
    function addThemeButton(widget, parent, theme) {
        var canv, ctx, size, clickAction, padding, iconWidth, config, skX1, iconHeight, question, skX2, foreach;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                size = 50;
                canv = createCanvas(size, size);
                ctx = canv.ctx;
                canv.canvas.className = 'generic-button simple-button';
                canv.canvas.style.padding = '0px';
                canv.canvas.style.border = '0px';
                canv.canvas.style.marginRight = '3px';
                html.add(parent, canv.canvas);
                __state = '13';
                break;
            case '12':
                clickAction = function () {
                    setTheme(widget, theme);
                };
                registerEvent(canv.canvas, 'click', clickAction);
                return;
            case '13':
                config = theme.theme;
                ctx.fillStyle = config.background;
                ctx.fillRect(0, 0, size, size);
                padding = 5;
                iconWidth = Math.round((size - padding * 3) / 2);
                iconHeight = Math.round((size - padding * 6) / 3);
                skX1 = Math.round(padding + iconWidth / 2);
                skX2 = Math.round(size - padding - iconWidth / 2);
                line(ctx, skX1, padding, skX1, size - padding, config.lines, config.lineWidth);
                line(ctx, skX1, size / 2, skX2, size / 2, config.lines, config.lineWidth);
                line(ctx, skX2, size / 2, skX2, size - padding, config.lines, config.lineWidth);
                __state = '20';
                break;
            case '20':
                skX1 = Math.round(padding + iconWidth / 2);
                line(ctx, skX1, padding, skX1, size - padding, config.lines, config.lineWidth);
                rectangle(ctx, skX1 - iconWidth / 2, padding * 2, iconWidth, iconHeight, config.iconBorder, config.borderWidth, config.iconBack);
                if (config.icons) {
                    if (config.icons.question) {
                        if (config.icons.question.iconBack) {
                            question = config.icons.question.iconBack;
                            __state = '34';
                        } else {
                            __state = '32';
                        }
                    } else {
                        __state = '32';
                    }
                } else {
                    __state = '32';
                }
                break;
            case '32':
                question = config.iconBack;
                __state = '34';
                break;
            case '34':
                hexagon(ctx, skX1 - iconWidth / 2, padding * 3 + iconHeight, iconWidth, iconHeight, config.iconBorder, config.borderWidth, question);
                rectangle(ctx, skX1 - iconWidth / 2, padding * 4 + iconHeight * 2, iconWidth, iconHeight, config.iconBorder, config.borderWidth, config.iconBack);
                __state = '40';
                break;
            case '40':
                if (config.icons) {
                    if (config.icons.foreach) {
                        if (config.icons.foreach.iconBack) {
                            foreach = config.icons.foreach.iconBack;
                            __state = '46';
                        } else {
                            __state = '45';
                        }
                    } else {
                        __state = '45';
                    }
                } else {
                    __state = '45';
                }
                break;
            case '45':
                foreach = config.iconBack;
                __state = '46';
                break;
            case '46':
                rectangle(ctx, skX2 - iconWidth / 2, padding * 4 + iconHeight * 2, iconWidth, iconHeight, config.iconBorder, config.borderWidth, foreach);
                __state = '47';
                break;
            case '47':
                if (theme.lineRadius === 0) {
                    rectangle(ctx, size - padding - 10, padding, 10, 10, config.lines, config.lineWidth, config.background);
                    __state = '12';
                } else {
                    __state = '12';
                }
                break;
            default:
                return;
            }
        }
    }
    function updateFreeIconButtons(widget) {
        var tr, path, row3, _var2, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                tr = widget.widgetSettings.translate;
                path = widget.widgetSettings.imagePath;
                html.clear(widget.iconButtons);
                __state = '64';
                break;
            case '9':
                row3 = addRowToToolbar(widget.iconButtons);
                _var4 = tr('Picture');
                addIconButton(widget, row3, 'picture.png', function (evt) {
                    insertFreePicture(widget, evt);
                }, _var4, undefined);
                _var3 = div({ height: '10px' });
                html.add(widget.iconButtons, _var3);
                return;
            case '10':
                addIconRowFree(widget, widget.iconButtons, 'cloud.png', 'cloud', 'Cloud', '', 'db.png', 'database', 'Database', '');
                addIconRowFree(widget, widget.iconButtons, 'human.png', 'human', 'Person 1', '', 'portrait.png', 'portrait', 'Person 2', '');
                addIconRowFree(widget, widget.iconButtons, 'pc.png', 'computer', 'Computer', '', 'notebook.png', 'notebook', 'Notebook', '');
                addIconRowFree(widget, widget.iconButtons, 'server1.png', 'server1', 'Server 1', '', 'server2.png', 'server2', 'Server 2', '');
                addIconRowFree(widget, widget.iconButtons, 'phone.png', 'phone', 'Phone', '', 'tablet.png', 'tablet', 'Tablet', '');
                __state = '9';
                break;
            case '11':
                addIconRowFree(widget, widget.iconButtons, 'combobox.png', 'combobox', 'Combo box', '', 'placeholder.png', 'placeholder', 'Placeholder', '');
                addIconRowFree(widget, widget.iconButtons, 'f_ui_hscroll.png', 'hscroll', 'Horizontal scrollbar', '', 'f_ui_vscroll.png', 'vscroll', 'Vertical scrollbar', '');
                addIconRowFree(widget, widget.iconButtons, 'check_true.png', 'check_true', 'Checkbox, checked', '', 'check_false.png', 'check_false', 'Checkbox, unchecked', '');
                addIconRowFree(widget, widget.iconButtons, 'radio_true.png', 'radio_true', 'Radiobutton, checked', '', 'radio_false.png', 'radio_false', 'Radiobutton, unchecked', '');
                addIconRowFree(widget, widget.iconButtons, 'f_cross.png', 'cross', 'Cross', '', 'check.png', 'check', 'Checkmark', '');
                __state = '82';
                break;
            case '14':
                addIconRowFree(widget, widget.iconButtons, 'callout.png', 'callout', 'Callout', '', 'circle.png', 'f_circle', 'Ellipse', 'E');
                addIconRowFree(widget, widget.iconButtons, 'frame.png', 'frame', 'Frame', '', 'triangle.png', 'triangle', 'Triangle', '');
                localStorage.setItem('drakonhubwidget-free-toolbar-type', widget.typeCombo.value);
                _var2 = widget.typeCombo.value;
                if (_var2 === 'basic') {
                    __state = '9';
                } else {
                    if (_var2 === 'ui') {
                        __state = '11';
                    } else {
                        if (_var2 === 'architect') {
                            __state = '10';
                        } else {
                            throw new Error('Unexpected case value: ' + _var2);
                        }
                    }
                }
                break;
            case '64':
                addIconRowFree(widget, widget.iconButtons, 'rectangle.png', 'rectangle', 'Free rectangle', 'A', 'text.png', 'text', 'Text', 'T');
                addIconRowFree(widget, widget.iconButtons, 'line.png', 'line', 'Line', 'L', 'arrow.png', 'arrow', 'Arrow', 'W');
                addIconRowFree(widget, widget.iconButtons, 'poly.png', 'polygon', 'Polygon', '', 'polyline.png', 'polyline', 'Polyline', '');
                addIconRowFree(widget, widget.iconButtons, 'f_begin.png', 'f_begin', 'Soap', '', 'rounded.png', 'rounded', 'Rounded rectangle', 'R');
                addIconRowFree(widget, widget.iconButtons, 'ptr-left.png', 'f_ptr_left', 'Left pointer', '', 'ptr-right.png', 'f_ptr_right', 'Right pointer', '');
                __state = '14';
                break;
            case '82':
                addIconRowFree(widget, widget.iconButtons, 'left-angle.png', 'left-angle', 'Move left', '', 'right-angle.png', 'right-angle', 'Move right', '');
                addIconRowFree(widget, widget.iconButtons, 'up-angle.png', 'up-angle', 'Move up', '', 'down-angle.png', 'down-angle', 'Move down', '');
                addIconRowFree(widget, widget.iconButtons, 'left-angle2.png', 'left-angle2', 'Fast left', '', 'right-angle2.png', 'right-angle2', 'Fast right', '');
                addIconRowFree(widget, widget.iconButtons, 'f_menu.png', 'menu', 'Menu', '', 'f_tab.png', 'tab', 'Tab', '');
                addIconRowFree(widget, widget.iconButtons, 'dots3h.png', 'dots3h', 'Horizontal dots', '', 'dots3v.png', 'dots3v', 'Vertical dots', '');
                __state = '9';
                break;
            default:
                return;
            }
        }
    }
    function addThemeRow(widget, parent, theme1, theme2, theme3, theme4) {
        var row;
        row = div({
            'padding': '3px',
            'padding-right': '0px'
        });
        html.add(parent, row);
        addThemeButton(widget, row, theme1);
        addThemeButton(widget, row, theme2);
        addThemeButton(widget, row, theme3);
        addThemeButton(widget, row, theme4);
        return;
    }
    function setZoomCore(widget, value) {
        var percent, zoom, canwidget;
        percent = parseInt(value);
        zoom = percent * 100;
        canwidget = getCanvasWidget(widget);
        canwidget.setZoom(zoom);
        return;
    }
    function hexagon(ctx, x, y, width, height, color, lineWidth, background) {
        x = Math.round(x);
        y = Math.round(y);
        width = Math.round(width);
        height = Math.round(height);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.fillStyle = background;
        buildQuestionPath(ctx, x, y, width, height, height / 2);
        ctx.fill();
        buildQuestionPath(ctx, x, y, width, height, height / 2);
        ctx.stroke();
        return;
    }
    function nameNotEmpty(value, tr) {
        var _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value) {
                    value = value.trim();
                    if (value) {
                        return undefined;
                    } else {
                        __state = '_item2';
                    }
                } else {
                    __state = '_item2';
                }
                break;
            case '_item2':
                _var2 = tr('Name cannot be empty');
                return _var2;
            default:
                return;
            }
        }
    }
    function addIconRowFree(widget, container, icon1, type1, tip1, key1, icon2, type2, tip2, key2) {
        var action1, action2, row;
        action1 = function (evt) {
            widget.drakon.insertFree(type1, evt);
        };
        action2 = function (evt) {
            widget.drakon.insertFree(type2, evt);
        };
        row = addRowToToolbar(container);
        addIconButton(widget, row, icon1, action1, tip1, key1);
        addIconButton(widget, row, icon2, action2, tip2, key2);
        return;
    }
    function loadFonts_create(widget, fonts) {
        var parsed, codes, face, fontCodes, mustRedraw, canwidget, _var2, _var3, font;
        var me = {
            state: '2',
            type: 'loadFonts'
        };
        function _main_loadFonts(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '1':
                        me.state = undefined;
                        __resolve({ ok: true });
                        return;
                    case '2':
                        codes = {};
                        _var2 = fonts;
                        _var3 = 0;
                        me.state = '5';
                        break;
                    case '5':
                        if (_var3 < _var2.length) {
                            font = _var2[_var3];
                            parsed = drakon_canvas.parseCssFont(font, {});
                            face = buildFontCode(parsed);
                            codes[face] = true;
                            _var3++;
                            me.state = '5';
                        } else {
                            fontCodes = Object.keys(codes);
                            me.state = '12';
                            widget.widgetSettings.loadFonts(fontCodes).then(function (__returnee) {
                                mustRedraw = __returnee;
                                _main_loadFonts(__resolve, __reject);
                            }, function (error) {
                                me.state = undefined;
                                __reject(error);
                            });
                            return;
                        }
                        break;
                    case '12':
                        if (mustRedraw) {
                            canwidget = getCanvasWidget(widget);
                            canwidget.redraw();
                            me.state = '1';
                        } else {
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
                _main_loadFonts(__resolve, __reject);
            });
        };
        return me;
    }
    function loadFonts(widget, fonts) {
        var __obj = loadFonts_create(widget, fonts);
        return __obj.run();
    }
    function addMainMenuButton(widget, container, buttonInfo) {
        var row, tr, tip1, button;
        tr = widget.widgetSettings.translate;
        tip1 = tr(buttonInfo.tooltip);
        row = addRowToToolbar(container);
        button = widgets.createIconButton(buttonInfo.image, buttonInfo.callback, tip1);
        button.style.width = '82px';
        button.style.height = '42px';
        html.add(row, button);
        return;
    }
    function DrakonHubWidget_init(self, widgetSettings) {
        var zoom, _var2;
        unit.darkColor = 'green';
        unit.middleColor = 'rgb(226, 237, 245)';
        self.iconWidth = 250;
        createStyles();
        self.widgetSettings = widgetSettings;
        self.userSettings = {};
        _var2 = drakon_canvas.DrakonCanvas();
        self.drakon = createWidget(_var2);
        zoom = getZoom();
        setZoomCore(self, zoom);
        self.indicator = Indicator();
        return;
    }
    function DrakonHubWidget_onShow(self) {
        return;
    }
    function DrakonHubWidget_showInsertionSockets(self, type) {
        var _var2, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                _var2 = self.type;
                if (_var2 === 'drakon') {
                    self.drakon.showInsertionSockets(type);
                    __state = '1';
                } else {
                    if (_var2 === 'graf') {
                        _var4 = type;
                        if (_var4 === 'action') {
                            self.drakon.showInsertionSockets('idea');
                            __state = '1';
                        } else {
                            if (_var4 === 'case') {
                                self.drakon.showInsertionSockets('conclusion');
                                __state = '1';
                            } else {
                                if (_var4 === 'rounded') {
                                    self.drakon.showInsertionSockets('ridea');
                                    __state = '1';
                                } else {
                                    if (_var4 === 'foreach') {
                                        self.drakon.insertFree('line');
                                        __state = '1';
                                    } else {
                                        if (_var4 === 'arrow') {
                                            self.drakon.insertFree(type);
                                            __state = '1';
                                        } else {
                                            self.drakon.showInsertionSockets(type);
                                            __state = '1';
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        if (_var2 === 'free') {
                            _var3 = type;
                            if (_var3 === 'action') {
                                self.drakon.insertFree('rectangle');
                                __state = '1';
                            } else {
                                if (_var3 === 'case') {
                                    self.drakon.insertFree('circle');
                                    __state = '1';
                                } else {
                                    if (_var3 === 'foreach') {
                                        self.drakon.insertFree('line');
                                        __state = '1';
                                    } else {
                                        if (_var3 === 'text') {
                                            __state = '19';
                                        } else {
                                            if (_var3 === 'arrow') {
                                                __state = '19';
                                            } else {
                                                if (_var3 === 'rounded') {
                                                    __state = '19';
                                                } else {
                                                    if (_var3 === 'f_circle') {
                                                        __state = '19';
                                                    } else {
                                                        __state = '1';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            __state = '1';
                        }
                    }
                }
                break;
            case '19':
                self.drakon.insertFree(type);
                __state = '1';
                break;
            default:
                return;
            }
        }
    }
    function DrakonHubWidget_getDiagramType(self) {
        var props;
        props = self.drakon.getDiagramProperties();
        return props.type;
    }
    function DrakonHubWidget() {
        var self = {};
        self.setDiagram = function (diagram, userSettings) {
            return DrakonHubWidget_setDiagram(self, diagram, userSettings);
        };
        self.setDiagram_create = function (diagram, userSettings) {
            return DrakonHubWidget_setDiagram_create(self, diagram, userSettings);
        };
        self.onResize = function () {
            return DrakonHubWidget_onResize(self);
        };
        self.onHide = function () {
            return DrakonHubWidget_onHide(self);
        };
        self.cutSelection = function () {
            return DrakonHubWidget_cutSelection(self);
        };
        self.onChange = function (change) {
            return DrakonHubWidget_onChange(self, change);
        };
        self.showPaste = function () {
            return DrakonHubWidget_showPaste(self);
        };
        self.exportJson = function () {
            return DrakonHubWidget_exportJson(self);
        };
        self.copySelection = function () {
            return DrakonHubWidget_copySelection(self);
        };
        self.deleteSelection = function () {
            return DrakonHubWidget_deleteSelection(self);
        };
        self.redo = function () {
            return DrakonHubWidget_redo(self);
        };
        self.hasUnsavedChanges = function () {
            return DrakonHubWidget_hasUnsavedChanges(self);
        };
        self.editContent = function () {
            return DrakonHubWidget_editContent(self);
        };
        self.arrowLeft = function () {
            return DrakonHubWidget_arrowLeft(self);
        };
        self.arrowRight = function () {
            return DrakonHubWidget_arrowRight(self);
        };
        self.showItem = function (itemId) {
            return DrakonHubWidget_showItem(self, itemId);
        };
        self.exportImage = function (res, watermark) {
            return DrakonHubWidget_exportImage(self, res, watermark);
        };
        self.insertDrakonPicture = function () {
            return DrakonHubWidget_insertDrakonPicture(self);
        };
        self.insertDrakonPicture_create = function () {
            return DrakonHubWidget_insertDrakonPicture_create(self);
        };
        self.redraw = function (container) {
            return DrakonHubWidget_redraw(self, container);
        };
        self.undo = function () {
            return DrakonHubWidget_undo(self);
        };
        self.arrowDown = function () {
            return DrakonHubWidget_arrowDown(self);
        };
        self.arrowUp = function () {
            return DrakonHubWidget_arrowUp(self);
        };
        self.init = function (widgetSettings) {
            return DrakonHubWidget_init(self, widgetSettings);
        };
        self.onShow = function () {
            return DrakonHubWidget_onShow(self);
        };
        self.showInsertionSockets = function (type) {
            return DrakonHubWidget_showInsertionSockets(self, type);
        };
        self.getDiagramType = function () {
            return DrakonHubWidget_getDiagramType(self);
        };
        return self;
    }
    function ComplexButton() {
        var self = {};
        self.enable = function () {
            return ComplexButton_enable(self);
        };
        self.disable = function () {
            return ComplexButton_disable(self);
        };
        return self;
    }
    function IconStyleWindow() {
        var self = {};
        self.rebuild = function () {
            return IconStyleWindow_rebuild(self);
        };
        self.applyFormat = function () {
            return IconStyleWindow_applyFormat(self);
        };
        self.applyFormat_create = function () {
            return IconStyleWindow_applyFormat_create(self);
        };
        return self;
    }
    function DiagramStyleWindow() {
        var self = {};
        self.rebuild = function () {
            return DiagramStyleWindow_rebuild(self);
        };
        self.applyFormat = function () {
            return DiagramStyleWindow_applyFormat(self);
        };
        self.applyFormat_create = function () {
            return DiagramStyleWindow_applyFormat_create(self);
        };
        return self;
    }
    function Indicator() {
        var self = {};
        self.saving = function () {
            return Indicator_saving(self);
        };
        self.saved = function () {
            return Indicator_saved(self);
        };
        self.showReadonly = function () {
            return Indicator_showReadonly(self);
        };
        return self;
    }
    unit.DrakonHubWidget = DrakonHubWidget;
    unit.ComplexButton = ComplexButton;
    unit.IconStyleWindow = IconStyleWindow;
    unit.DiagramStyleWindow = DiagramStyleWindow;
    unit.Indicator = Indicator;
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
    module.exports = drakonhubwidget_10;
}