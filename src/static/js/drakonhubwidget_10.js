function drakonhubwidget_10() {
var unit = {};
var drakon_canvas;
var gconfig;
var html;
var tracing;
var utils;
var widgets;
function ComplexButton() {
    var self = { _type: 'ComplexButton' };
    function disable() {
        self.enabledButton.style.display = 'none';
        self.disabledButton.style.display = 'inline-block';
    }
    function enable() {
        self.enabledButton.style.display = 'inline-block';
        self.disabledButton.style.display = 'none';
    }
    self.disable = disable;
    self.enable = enable;
    return self;
}
function DiagramStyleWindow() {
    var self = { _type: 'DiagramStyleWindow' };
    async function applyFormat() {
        var fonts;
        fonts = self.canwidget.patchDiagramStyle(self.style);
        await new Promise(resolve => setTimeout(resolve, 10));
        loadFonts(self.widget, fonts);
    }
    function rebuild() {
        html.clear(self.client);
        addBackgroundSection(self);
        addLinesSection(self, true);
        addFillSection(self);
        addTextSection(self);
        addBorderSection(self);
        addInternalLineSection(self);
        addBranchHeaderSection(self);
        addWideButton(self.client, self.tr('Clear format'), function () {
            clearDiagramFormat(self);
        });
    }
    self.applyFormat = applyFormat;
    self.rebuild = rebuild;
    return self;
}
function DrakonHubWidget() {
    var self = { _type: 'DrakonHubWidget' };
    function arrowDown() {
        self.drakon.arrowDown();
    }
    function arrowLeft() {
        self.drakon.arrowLeft();
    }
    function arrowRight() {
        self.drakon.arrowRight();
    }
    function arrowUp() {
        self.drakon.arrowUp();
    }
    function copySelection() {
        self.drakon.copySelection();
    }
    function cutSelection() {
        self.drakon.cutSelection();
    }
    function deleteSelection() {
        self.drakon.deleteSelection();
    }
    function editContent() {
        self.drakon.editContent();
    }
    function exportImage(res, watermark) {
        var canvas, image, json, obj, zoom;
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
    function exportJson() {
        var json;
        json = self.drakon.exportJson();
        return json;
    }
    function generateMany(docs) {
        var language, prompt;
        language = getPseudoLanguage();
        prompt = regenerateMany(docs, language);
        showPseudocode(self, prompt, docs);
    }
    function getDiagramType() {
        var props;
        props = self.drakon.getDiagramProperties();
        return props.type;
    }
    function hasUnsavedChanges() {
        if (self.quill) {
            return self.quillDirty;
        } else {
            return false;
        }
    }
    function init(widgetSettings) {
        var zoom;
        unit.darkColor = 'green';
        unit.middleColor = 'rgb(226, 237, 245)';
        self.iconWidth = 250;
        createStyles();
        self.widgetSettings = widgetSettings;
        self.userSettings = {};
        self.drakon = createWidget(drakon_canvas.DrakonCanvas());
        zoom = getZoom();
        setZoomCore(self, zoom);
        self.indicator = Indicator();
    }
    async function insertDrakonPicture() {
        insertPicture(self, 'drakon-image');
    }
    function onChange(change) {
        if (self.diagram && self.diagram.id === change.id) {
            self.drakon.onChange(change);
        }
    }
    function onHide() {
        stopEditSender(self);
        self.diagram = undefined;
    }
    function onResize() {
        layoutRedraw(self);
    }
    function onShow() {
    }
    function redo() {
        performRedo(self);
    }
    function redraw(container) {
        var path, tr;
        self.buttonsBar = div('drakonhubwidget-buttons-container');
        html.add(container, self.buttonsBar);
        self.view = div('drakonhubwidget-diagram-container');
        html.add(container, self.view);
        tr = self.widgetSettings.translate;
        path = self.widgetSettings.imagePath;
        self.showToolbar = widgets.createIconButton(path + 'right-angle2.png', function () {
            showToolbar(self);
        }, tr('Show toolbar'));
        html.add(container, self.showToolbar);
        rebuildToolbar(self);
        layoutRedraw(self);
    }
    async function setDiagram(diagram, userSettings) {
        var fonts, originalPushEdit;
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
            originalPushEdit(detectDescChange(self, edit));
        };
        rebuildToolbar(self);
        layoutView(self);
        fonts = await self.drakon.setDiagram(diagram.id, diagram, self.sender);
        await loadFonts(self, fonts);
        if (self.showDesc) {
            fillDesc(self);
        }
    }
    function showInsertionSockets(type) {
        var _selectValue_201;
        _selectValue_201 = self.type;
        if (_selectValue_201 === 'drakon') {
            self.drakon.showInsertionSockets(type);
        } else {
            if (_selectValue_201 === 'graf') {
                if (type === 'action') {
                    self.drakon.showInsertionSockets('idea');
                } else {
                    if (type === 'case') {
                        self.drakon.showInsertionSockets('conclusion');
                    } else {
                        if (type === 'rounded') {
                            self.drakon.showInsertionSockets('ridea');
                        } else {
                            if (type === 'foreach') {
                                self.drakon.insertFree('line');
                            } else {
                                if (type === 'arrow') {
                                    self.drakon.insertFree(type);
                                } else {
                                    self.drakon.showInsertionSockets(type);
                                }
                            }
                        }
                    }
                }
            } else {
                if (_selectValue_201 === 'free') {
                    if (type === 'action') {
                        self.drakon.insertFree('rectangle');
                    } else {
                        if (type === 'case') {
                            self.drakon.insertFree('circle');
                        } else {
                            if (type === 'foreach') {
                                self.drakon.insertFree('line');
                            } else {
                                if (type === 'text' || type === 'arrow' || type === 'rounded' || type === 'f_circle') {
                                    self.drakon.insertFree(type);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function showItem(itemId) {
        if (itemId === 'description') {
            showDescription(self);
        } else {
            self.drakon.showItem(itemId);
        }
    }
    function showPaste() {
        self.drakon.showPaste();
    }
    function undo() {
        performUndo(self);
    }
    self.arrowDown = arrowDown;
    self.arrowLeft = arrowLeft;
    self.arrowRight = arrowRight;
    self.arrowUp = arrowUp;
    self.copySelection = copySelection;
    self.cutSelection = cutSelection;
    self.deleteSelection = deleteSelection;
    self.editContent = editContent;
    self.exportImage = exportImage;
    self.exportJson = exportJson;
    self.generateMany = generateMany;
    self.getDiagramType = getDiagramType;
    self.hasUnsavedChanges = hasUnsavedChanges;
    self.init = init;
    self.insertDrakonPicture = insertDrakonPicture;
    self.onChange = onChange;
    self.onHide = onHide;
    self.onResize = onResize;
    self.onShow = onShow;
    self.redo = redo;
    self.redraw = redraw;
    self.setDiagram = setDiagram;
    self.showInsertionSockets = showInsertionSockets;
    self.showItem = showItem;
    self.showPaste = showPaste;
    self.undo = undo;
    return self;
}
function IconStyleWindow() {
    var self = { _type: 'IconStyleWindow' };
    async function applyFormat() {
        var fonts;
        fonts = self.canwidget.setStyle(self.ids, self.style);
        await new Promise(resolve => setTimeout(resolve, 10));
        loadFonts(self.widget, fonts);
    }
    function rebuild() {
        html.clear(self.client);
        if ('iconBack' in self.accepted) {
            addFillSection(self);
        }
        if ('font' in self.accepted) {
            addTextSection(self);
        }
        if ('verticalAlign' in self.accepted) {
            addVerticalAlign(self);
        }
        if ('iconBorder' in self.accepted) {
            addBorderSection(self);
        }
        if ('internalLine' in self.accepted) {
            addInternalLineSection(self);
        }
        if ('lines' in self.accepted) {
            addLinesSection(self, false);
        }
        addWideButton(self.client, self.tr('Clear format'), function () {
            clearIconFormat(self);
        });
    }
    self.applyFormat = applyFormat;
    self.rebuild = rebuild;
    return self;
}
function Indicator() {
    var self = { _type: 'Indicator' };
    function saved() {
        html.setText(self.element, self.tr('Saved'));
    }
    function saving() {
        html.setText(self.element, self.tr('Saving...'));
    }
    function showReadonly() {
        html.setText(self.element, self.tr('Read-only'));
    }
    self.saved = saved;
    self.saving = saving;
    self.showReadonly = showReadonly;
    return self;
}
function addBackgroundSection(context) {
    var section;
    section = addFormatSection(context.tr('Background'), context.client);
    addColorControl(context, section, 'background');
    addBoolControl(context, section, 'centerContent', context.tr('Recenter'));
}
function addBoolControl(context, section, prop, header) {
    var checked;
    checked = !!context.oldStyle[prop];
    addBoolControlGeneric(section, header, checked, function (checked) {
        changeStyleProperty(context, 'centerContent', checked);
    });
}
function addBoolControlGeneric(section, header, value, onChange) {
    var check, label;
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
}
function addBoolIcon(parent, image, value, onChange) {
    var background, cssStyle, icon;
    if (value) {
        background = 'grey';
    } else {
        background = 'white';
    }
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
}
function addBorderSection(context) {
    var oldThickness, section, style, thickness, value, valueStyle;
    section = addFormatSection(context.tr('Border'), context.client);
    addColorControl(context, section, 'iconBorder');
    if (context.oldStyle.borderWidth === '') {
        oldThickness = '';
    } else {
        oldThickness = context.oldStyle.borderWidth.toString() + ' px';
    }
    value = {
        img: context.path + 'thickness.png',
        height: 30,
        width: 40,
        value: oldThickness
    };
    thickness = addCombo(context.path, section, context.tr('Border width'), value, getThicknessValues(), function (value) {
        setBorderThickness(context, value);
    });
    thickness.style.marginLeft = '5px';
    oldThickness = context.oldStyle.borderWidth.toString() + ' px';
    valueStyle = {
        img: context.path + 'style.png',
        height: 30,
        width: 40,
        value: context.oldStyle.borderStyle
    };
    style = addCombo(context.path, section, context.tr('Border style'), valueStyle, getLineStyleValues(context.path), function (value) {
        changeStyleProperty(context, 'borderStyle', value);
    });
    style.style.marginLeft = '5px';
}
function addBranchHeaderSection(context) {
    var bold, br, family, italic, section, size;
    section = addFormatSection(context.tr('Branch header'), context.client);
    bold = addBoolIcon(section, context.path + 'bold.png', context.branchFont.weight === 'bold', function (value) {
        setBoldFont(context, 'branchFont', value);
    });
    italic = addBoolIcon(section, context.path + 'italics.png', context.branchFont.style === 'italic', function (value) {
        setItalicFont(context, 'branchFont', value);
    });
    makeGroupStart(bold);
    makeGroupEnd(italic);
    bold.style.marginLeft = '0px';
    br = div({ height: '5px' });
    html.add(section, br);
    family = addCombo(context.path, section, context.tr('Font family'), context.branchFont.family, getFontFamilies(), function (value) {
        setFontFamily(context, 'branchFont', value);
    });
    size = addCombo(context.path, section, context.tr('Font size'), context.branchFont.size.toString() + ' px', getFontSizes(), function (value) {
        setFontSize(context, 'branchFont', value);
    });
    family.style.width = '160px';
    size.style.width = '70px';
    size.style.marginLeft = '5px';
}
function addColorControl(context, section, prop) {
    var img, onColorChosen, value;
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
function addColorIcon(container, color, action) {
    var icon;
    icon = buildColorIcon(color);
    icon.style.marginRight = '2px';
    registerEvent(icon, 'click', action);
    html.add(container, icon);
}
function addCombo(path, parent, name, value, values, onChange) {
    var container, img, oldValue, text, tri;
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
    }
    registerEvent(container, 'click', function () {
        showComboValues(container, path, name, values, oldValue, onChange);
    });
    return container;
}
function addComboValue(table, path, valueItem, value, onChange) {
    var currentValue, img, left, line, right, valueImg;
    line = html.createElement('tr', {}, ['context-menu-item']);
    html.add(table, line);
    left = html.createElement('td', {}, [{ width: '12px' }]);
    html.add(line, left);
    right = html.createElement('td', {}, [{ 'padding-right': '5px' }]);
    html.add(line, right);
    if (typeof valueItem === 'string') {
        html.setText(right, valueItem);
        currentValue = valueItem;
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
    }
    if (value === currentValue) {
        img = html.createElement('img', {
            draggable: false,
            src: path + 'item-pointer.png'
        }, [{
                'vertical-align': 'middle',
                'width': '10px'
            }]);
        html.add(left, img);
    }
    registerEvent(line, 'click', function () {
        widgets.closePopup();
        onChange(currentValue);
    });
}
function addEmptyIcon(container) {
    var icon;
    icon = buildColorIcon('');
    icon.style.marginRight = '2px';
    html.add(container, icon);
    icon.style.cursor = 'default';
}
function addFillSection(context) {
    var padding, paddingStr, section, shadow, shadowValue, size;
    section = addFormatSection(context.tr('Fill'), context.client);
    addColorControl(context, section, 'iconBack');
    if (context.accepted.padding) {
        padding = parseInt(context.oldStyle.padding);
        if (isNaN(padding)) {
            paddingStr = context.tr('Default');
        } else {
            paddingStr = padding + ' px';
        }
        size = addCombo(context.path, section, context.tr('Padding'), paddingStr, getPaddingSizes(context.tr), function (value) {
            setPadding(context, value);
        });
        size.style.width = '80px';
        size.style.marginLeft = '5px';
    }
    if (context.accepted.shadowColor) {
        if (context.oldStyle.shadowColor) {
            if (context.oldStyle.shadowOffsetX === 0) {
                shadowValue = context.tr('Subtle');
            } else {
                shadowValue = context.tr('Strong');
            }
        } else {
            shadowValue = context.tr('No shadow');
        }
        shadow = addCombo(context.path, section, context.tr('Shadow'), shadowValue, getShadowTypes(context.tr), function (value) {
            setShadow(context, value);
        });
        shadow.style.width = '110px';
        shadow.style.marginLeft = '5px';
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
function addHeaderSection(context) {
    var bold, br, family, italic, section, size;
    section = addFormatSection(context.tr('Header'), context.client);
    bold = addBoolIcon(section, context.path + 'bold.png', context.headerFont.weight === 'bold', function (value) {
        setBoldFont(context, 'headerFont', value);
    });
    italic = addBoolIcon(section, context.path + 'italics.png', context.headerFont.style === 'italic', function (value) {
        setItalicFont(context, 'headerFont', value);
    });
    makeGroupStart(bold);
    makeGroupEnd(italic);
    bold.style.marginLeft = '0px';
    br = div({ height: '5px' });
    html.add(section, br);
    family = addCombo(context.path, section, context.tr('Font family'), context.headerFont.family, getFontFamilies(), function (value) {
        setFontFamily(context, 'headerFont', value);
    });
    size = addCombo(context.path, section, context.tr('Font size'), context.headerFont.size.toString() + ' px', getFontSizes(), function (value) {
        setFontSize(context, 'headerFont', value);
    });
    family.style.width = '160px';
    size.style.width = '70px';
    size.style.marginLeft = '5px';
}
function addIconButton(widget, row, icon, action, tip, key) {
    var path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    tip = tr(tip);
    if (key) {
        tip += '. ' + tr('Key') + ': ' + key;
    }
    html.add(row, widgets.createIconButton(path + icon, action, tip));
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
}
function addIndicator(widget, config) {
    var color;
    if (config.theme && config.theme.lines) {
        color = config.theme.lines;
    } else {
        color = 'black';
    }
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
}
function addInternalLineSection(context) {
    var section;
    section = addFormatSection(context.tr('Internal line'), context.client);
    addColorControl(context, section, 'internalLine');
}
function addLinesSection(context, backText) {
    var backColor, backLabel, oldThickness, section, style, thickness, value, valueStyle;
    section = addFormatSection(context.tr('Lines'), context.client);
    addColorControl(context, section, 'lines');
    if (utils.hasValue(context.oldStyle.lineWidth)) {
        oldThickness = context.oldStyle.lineWidth.toString() + ' px';
    } else {
        oldThickness = '';
    }
    value = {
        img: context.path + 'thickness.png',
        height: 30,
        width: 40,
        value: oldThickness
    };
    thickness = addCombo(context.path, section, context.tr('Line width'), value, getLineWidthValues(), function (value) {
        setLineThickness(context, value);
    });
    thickness.style.marginLeft = '5px';
    if (backText) {
        backColor = addColorControl(context, section, 'backText');
        backColor.style.marginLeft = '5px';
        backLabel = div({
            display: 'inline-block',
            text: context.tr('Text'),
            'margin-left': '5px',
            'line-height': '30px'
        });
        html.add(section, backLabel);
    }
    if (context.accepted.lineStyle) {
        valueStyle = {
            img: context.path + 'style.png',
            height: 30,
            width: 40,
            value: context.oldStyle.lineStyle
        };
        style = addCombo(context.path, section, context.tr('Line style'), valueStyle, getLineStyleValues(context.path), function (value) {
            changeStyleProperty(context, 'lineStyle', value);
        });
        style.style.marginLeft = '5px';
    }
    if (context.accepted.tailStyle) {
        valueStyle = {
            img: context.path + 'arrow-left.png',
            height: 30,
            width: 40,
            value: context.oldStyle.tailStyle
        };
        style = addCombo(context.path, section, context.tr('Tail style'), valueStyle, getTailStyles(context.path), function (value) {
            changeStyleProperty(context, 'tailStyle', value);
        });
        style.style.marginLeft = '5px';
    }
    if (context.accepted.headStyle) {
        valueStyle = {
            img: context.path + 'arrow-right.png',
            height: 30,
            width: 40,
            value: context.oldStyle.headStyle
        };
        style = addCombo(context.path, section, context.tr('Head style'), valueStyle, getHeadStyles(context.path), function (value) {
            changeStyleProperty(context, 'headStyle', value);
        });
        style.style.marginLeft = '5px';
    }
}
function addLoadedImageButton(parent, id, imageData, onClick, current) {
    var _obj_;
    _obj_ = addLoadedImageButton_create(parent, id, imageData, onClick, current);
    return _obj_.run();
}
function addLoadedImageButton_create(parent, id, imageData, onClick, current) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'addLoadedImageButton',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* addLoadedImageButton_main() {
        var _event_, container, image, style;
        image = new Image();
        image.onload = me.loaded;
        image.src = imageData.content;
        me.state = '5';
        me._busy = false;
        _event_ = yield;
        if (image.width > image.height) {
            image.style.position = 'absolute';
            image.style.left = '0px';
            image.style.top = '50%';
            image.style.transform = 'translate(0px, -50%)';
            image.style.width = '96px';
        } else {
            image.style.height = '96px';
        }
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
        }
        container = div('active-border', style, image);
        html.add(parent, container);
        if (id === current) {
            container.style.cursor = 'auto';
        } else {
            registerEvent(container, 'click', function () {
                onClick(id);
            });
        }
        _topResolve_();
    }
    function addLoadedImageButton_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = addLoadedImageButton_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = addLoadedImageButton_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.loaded = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '5':
            _args_ = [];
            _args_.push('loaded');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function addMainMenuButton(widget, container, buttonInfo) {
    var button, row, tip1, tr;
    tr = widget.widgetSettings.translate;
    tip1 = tr(buttonInfo.tooltip);
    row = addRowToToolbar(container);
    button = widgets.createIconButton(buttonInfo.image, buttonInfo.callback, tip1);
    button.style.width = '82px';
    button.style.height = '42px';
    html.add(row, button);
}
function addNbsp(html) {
    var parts, withNbsp;
    parts = html.split('<p>');
    withNbsp = parts.map(addNbspToText);
    return withNbsp.join('<p>');
}
function addNbspToText(text) {
    var ch, i, result, state;
    result = [];
    state = 'start';
    for (i = 0; i < text.length; i++) {
        ch = text[i];
        if (state === 'start') {
            if (ch === ' ') {
                result.push('\xA0');
            } else {
                if (ch === '\t') {
                    result.push('\xA0\xA0\xA0\xA0');
                } else {
                    state = 'body';
                    result.push(ch);
                }
            }
        } else {
            result.push(ch);
        }
    }
    return result.join('');
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
function addTextSection(context) {
    var bold, br, center, family, italic, left, right, section, size;
    section = addFormatSection(context.tr('Text'), context.client);
    addColorControl(context, section, 'color');
    bold = addBoolIcon(section, context.path + 'bold.png', context.font.weight === 'bold', function (value) {
        setBoldFont(context, 'font', value);
    });
    italic = addBoolIcon(section, context.path + 'italics.png', context.font.style === 'italic', function (value) {
        setItalicFont(context, 'font', value);
    });
    makeGroupStart(bold);
    makeGroupEnd(italic);
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
    family = addCombo(context.path, section, context.tr('Font family'), context.font.family, getFontFamilies(), function (value) {
        setFontFamily(context, 'font', value);
    });
    size = addCombo(context.path, section, context.tr('Font size'), context.font.size.toString() + ' px', getFontSizes(), function (value) {
        setFontSize(context, 'font', value);
    });
    family.style.width = '160px';
    size.style.width = '70px';
    size.style.marginLeft = '5px';
}
function addThemeButton(widget, parent, theme) {
    var canv, clickAction, config, ctx, foreach, iconHeight, iconWidth, padding, question, size, skX1, skX2;
    size = 50;
    canv = createCanvas(size, size);
    ctx = canv.ctx;
    canv.canvas.className = 'generic-button simple-button';
    canv.canvas.style.padding = '0px';
    canv.canvas.style.border = '0px';
    canv.canvas.style.marginRight = '3px';
    html.add(parent, canv.canvas);
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
    skX1 = Math.round(padding + iconWidth / 2);
    line(ctx, skX1, padding, skX1, size - padding, config.lines, config.lineWidth);
    rectangle(ctx, skX1 - iconWidth / 2, padding * 2, iconWidth, iconHeight, config.iconBorder, config.borderWidth, config.iconBack);
    if (config.icons && config.icons.question && config.icons.question.iconBack) {
        question = config.icons.question.iconBack;
    } else {
        question = config.iconBack;
    }
    hexagon(ctx, skX1 - iconWidth / 2, padding * 3 + iconHeight, iconWidth, iconHeight, config.iconBorder, config.borderWidth, question);
    rectangle(ctx, skX1 - iconWidth / 2, padding * 4 + iconHeight * 2, iconWidth, iconHeight, config.iconBorder, config.borderWidth, config.iconBack);
    if (config.icons && config.icons.foreach && config.icons.foreach.iconBack) {
        foreach = config.icons.foreach.iconBack;
    } else {
        foreach = config.iconBack;
    }
    rectangle(ctx, skX2 - iconWidth / 2, padding * 4 + iconHeight * 2, iconWidth, iconHeight, config.iconBorder, config.borderWidth, foreach);
    if (theme.lineRadius === 0) {
        rectangle(ctx, size - padding - 10, padding, 10, 10, config.lines, config.lineWidth, config.background);
    }
    clickAction = function () {
        setTheme(widget, theme);
    };
    registerEvent(canv.canvas, 'click', clickAction);
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
}
function addToolbarRow(widget, container, icon1, command1, tip1, icon2, command2, tip2) {
    var path, row, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    tip1 = tr(tip1);
    tip2 = tr(tip2);
    row = addRowToToolbar(container);
    html.add(row, widgets.createIconButton(path + icon1, function (evt) {
        command1(widget, evt);
    }, tip1));
    if (icon2) {
        html.add(row, widgets.createIconButton(path + icon2, function (evt) {
            command2(widget, evt);
        }, tip2));
    }
}
function addVerticalAlign(context) {
    var bottom, center, section, top;
    section = addFormatSection(context.tr('Vertical align'), context.client);
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
}
function addWebColor(colors, name, value) {
    colors[name.toLowerCase()] = value;
}
function addWideButton(parent, text, action) {
    var clear, container;
    container = div({ padding: '5px' });
    clear = widgets.createSimpleButton(text, action, 'white', unit.darkColor);
    clear.style.margin = '0px';
    clear.style.display = 'block';
    html.add(parent, container);
    html.add(container, clear);
}
function buildColorIcon(value) {
    var canv, ctx, end, result, size, start;
    size = 32;
    if (value) {
        result = div({ background: value });
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
    }
    result.style.width = size + 'px';
    result.style.height = size + 'px';
    result.style.borderRadius = '5px';
    result.style.border = 'solid 1px rgb(160, 160, 160)';
    result.style.display = 'inline-block';
    result.style.cursor = 'pointer';
    result.style.userSelect = 'none';
    result.style.verticalAlign = 'bottom';
    return result;
}
function buildDescDiv(widget, width) {
    var bottom, buttons, container, path, top, tr;
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
    top = div({
        'position': 'relative',
        'border-bottom': 'solid 1px #a0a0a0',
        'height': '50px'
    }, div({
        text: tr('Description'),
        'font-weight': 'bold',
        'line-height': '49px',
        'margin-left': '10px'
    }));
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
    widget.descButtons = buttons;
    widget.descBottom = bottom;
    return container;
}
function buildDwConfig(widget) {
    var branch, config, face, header, icon, size;
    if (widget.userSettings && widget.userSettings.theme2) {
        config = utils.deepClone(widget.userSettings.theme2);
    } else {
        config = {};
    }
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
    }
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
}
function buildFontCode(font) {
    var style, weight;
    style = font.style || 'normal';
    weight = font.weight || 'normal';
    return font.family + '/' + style + '/' + weight;
}
function buildGenError(ex) {
    var filename, message, nodeId;
    filename = ex.filename || '';
    nodeId = ex.nodeId || '';
    message = ex.message + '\n' + filename + '\n' + nodeId;
    return {
        ok: false,
        content: message
    };
}
function buildQuestionPath(ctx, x, y, w, h, padding) {
    var bottom, middle, top, x0, x1, x2, x3;
    padding = Math.round(padding);
    x0 = Math.round(x);
    x1 = x0 + padding;
    x3 = Math.round(x + w);
    x2 = x3 - padding;
    top = Math.round(y);
    bottom = top + Math.round(h);
    middle = top + Math.round(h / 2);
    ctx.beginPath();
    ctx.moveTo(x0, middle);
    ctx.lineTo(x1, top);
    ctx.lineTo(x2, top);
    ctx.lineTo(x3, middle);
    ctx.lineTo(x2, bottom);
    ctx.lineTo(x1, bottom);
    ctx.closePath();
}
function calculateImageStorage(existing) {
    var id, image, result;
    result = 0;
    for (id in existing) {
        image = existing[id];
        result += image.content.length;
    }
    return result;
}
function changeStyleProperty(context, prop, value) {
    context.style[prop] = value;
    context.oldStyle[prop] = value;
    context.rebuild();
    context.applyFormat();
}
function checkCanBeGoodFilename(name, tr) {
    var error, sanitized;
    name = name.trim();
    error = nameNotEmpty(name, tr);
    if (error) {
        return error;
    } else {
        sanitized = utils.sanitizeFilename(name);
        if (sanitized) {
            return undefined;
        } else {
            error = tr('A name must contain normal characters, too');
            return error;
        }
    }
}
function checkGoodFilename(name, tr) {
    var ch, checker, error, i;
    name = name.trim();
    error = nameNotEmpty(name, tr);
    if (error) {
        return error;
    } else {
        checker = utils.createFilenameChecker();
        for (i = 0; i < name.length; i++) {
            ch = name[i];
            if (!checker.isGoodChar(ch)) {
                return tr('Unsupported characters');
            }
        }
        return undefined;
    }
}
function chooseTheme(widget, evt) {
    var black, blt, brown, bt, cgreen, classic, cln, config, coolGreen, darkBlue, darkGreen, darkRed, deepBlue, deepGreen, dialog, dr, egg, gblue, gblue2, gg, grayBlue, grayBlue2, grayGrey, greys, iconRound, light, linesRound, paleGreen, path, raisin, raisinGreen, rb, rect, redBlue, rg, roundSection, rtimer, tegg, theme, tr, white, wtimer;
    cln = utils.clone;
    theme = widget.userSettings.theme2 || {};
    config = buildDwConfig(widget);
    if (utils.hasValue(theme.lineRadius)) {
        widget.lineRadius = theme.lineRadius;
    } else {
        widget.lineRadius = config.lineRadius;
    }
    if (utils.hasValue(theme.iconRadius)) {
        widget.iconRadius = theme.iconRadius;
    } else {
        widget.iconRadius = config.iconRadius;
    }
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    rect = evt.target.getBoundingClientRect();
    dialog = widgets.createMovablePopup(tr('Theme'), rect.left, rect.bottom, path, false);
    dialog.client.style.maxHeight = 'calc(100vh - 40px)';
    dialog.client.style.overflowY = 'auto';
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
                'callout': cln(wtimer),
                'ctrlstart': cln(wtimer),
                'ctrlend': cln(wtimer),
                'pause': cln(wtimer),
                'timer': cln(wtimer),
                'group-duration': cln(wtimer)
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
                'ctrlstart': cln(rtimer),
                'ctrlend': cln(rtimer),
                'pause': cln(rtimer),
                'timer': cln(rtimer),
                'group-duration': cln(rtimer)
            }
        }
    };
    tegg = {
        iconBack: '#FFA849',
        color: 'black',
        'internalLine': 'black'
    };
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
                'ctrlstart': cln(tegg),
                'ctrlend': cln(tegg),
                'pause': cln(tegg),
                'timer': cln(tegg),
                'group-duration': cln(tegg)
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
    gblue2 = { iconBack: '#e0f8ff' };
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
                'ctrlstart': cln(gblue2),
                'ctrlend': cln(gblue2),
                'pause': cln(gblue2),
                'timer': cln(gblue2),
                'group-duration': cln(gblue2)
            }
        }
    };
    gblue = {
        iconBack: '#7393CE',
        'iconBorder': '#7393CE',
        'internalLine': 'black',
        color: 'white'
    };
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
                'ctrlstart': cln(gblue),
                'ctrlend': cln(gblue),
                'pause': cln(gblue),
                'timer': cln(gblue),
                'group-duration': cln(gblue)
            }
        }
    };
    cgreen = {
        iconBack: '#EDEEC9',
        'internalLine': 'black'
    };
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
                'ctrlstart': cln(cgreen),
                'ctrlend': cln(cgreen),
                'pause': cln(cgreen),
                'timer': cln(cgreen),
                'group-duration': cln(cgreen)
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
    rb = { iconBack: '#5050b0' };
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
                'ctrlstart': cln(rb),
                'ctrlend': cln(rb),
                'pause': cln(rb),
                'timer': cln(rb),
                'group-duration': cln(rb)
            }
        }
    };
    gg = { iconBack: '#EDEEF0' };
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
                'ctrlstart': cln(gg),
                'ctrlend': cln(gg),
                'pause': cln(gg),
                'timer': cln(gg),
                'group-duration': cln(gg)
            }
        }
    };
    bt = {
        iconBack: '#EDEEC9',
        'internalLine': 'black'
    };
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
                'ctrlstart': cln(bt),
                'ctrlend': cln(bt),
                'pause': cln(bt),
                'timer': cln(bt),
                'group-duration': cln(bt)
            }
        }
    };
    rg = { iconBack: 'white' };
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
                'ctrlstart': cln(rg),
                'ctrlend': cln(rg),
                'pause': cln(rg),
                'timer': cln(rg),
                'group-duration': cln(rg)
            }
        }
    };
    addThemeRow(widget, dialog.client, redBlue, grayGrey, brown, raisinGreen);
    blt = { iconBack: 'black' };
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
                'ctrlstart': cln(blt),
                'ctrlend': cln(blt),
                'pause': cln(blt),
                'timer': cln(blt),
                'group-duration': cln(blt)
            }
        }
    };
    dr = { iconBack: 'black' };
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
                'duration': cln(dr),
                'ctrlstart': cln(dr),
                'ctrlend': cln(dr),
                'pause': cln(dr),
                'timer': cln(dr),
                'group-duration': cln(dr)
            }
        }
    };
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
                'duration': cln(dr),
                'ctrlstart': cln(dr),
                'ctrlend': cln(dr),
                'pause': cln(dr),
                'timer': cln(dr),
                'group-duration': cln(dr)
            }
        }
    };
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
                'duration': cln(dr),
                'ctrlstart': cln(dr),
                'ctrlend': cln(dr),
                'pause': cln(dr),
                'timer': cln(dr),
                'group-duration': cln(dr)
            }
        }
    };
    addThemeRow(widget, dialog.client, black, darkRed, darkGreen, darkBlue);
    roundSection = div({
        background: 'white',
        padding: '5px',
        'border-top': 'solid 1px ' + unit.darkColor
    });
    html.add(dialog.client, roundSection);
    linesRound = !(widget.lineRadius === 0);
    addBoolControlGeneric(roundSection, tr('Round line corners'), linesRound, function (checked) {
        setRoundedLines(widget, checked);
    });
    iconRound = !(widget.iconRadius === 0);
    html.add(roundSection, html.createElement('br'));
    addBoolControlGeneric(roundSection, tr('Round element corners'), iconRound, function (checked) {
        setRoundedIcons(widget, checked);
    });
    widgets.positionPopup(dialog.popup, rect.left, rect.bottom);
}
function chooseZoom(widget, evt) {
    var onChange, path, tr, value, values;
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
    showComboValues(evt.target, path, tr('Zoom'), values, value, onChange);
}
function clearDiagramFormat(context) {
    context.canwidget.setDiagramStyle('');
    widgets.removePopups();
}
function clearIconFormat(context) {
    context.canwidget.setStyle(context.ids, '');
    widgets.removePopups();
}
function closeAndUseColor(context, color) {
}
function copyFieldsIfMissing(dst, src) {
    var key, value;
    for (key in src) {
        value = src[key];
        if (!utils.hasValue(dst[key])) {
            dst[key] = value;
        }
    }
}
function copyTextToClipboard(text, tr) {
    navigator.clipboard.writeText(text);
    widgets.showGoodSnack(tr('Copied'));
}
function createCanvas(width, height) {
    var canvas, ctx, factor;
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
function createFormatDialog(widget, title, x, y) {
    var dialog, path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    dialog = widgets.createMovablePopup(title, x, y, path, false);
    dialog.popup.style.width = '280px';
    dialog.client.style.maxHeight = 'calc(100vh - 40px)';
    dialog.client.style.overflowY = 'auto';
    return dialog;
}
function createQuillEditor(container, ro) {
    var options, quill, toolbarOptions;
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
    }
    quill = new Quill(container, options);
    return quill;
}
function createStyles() {
    if (unit.stylesInitialized) {
    } else {
        unit.stylesInitialized = true;
        html.addClass('.drakonhubwidget-buttons-container', 'display:inline-block', 'height:100%', 'width: 100px', 'left:0px', 'top:0px', 'user-select: none', 'cursor: default', 'white-space: nowrap', 'background: white', 'vertical-align:top', 'padding-left:3px', 'padding-top:2px', 'scrollbar-width: thin', 'overflow-y: auto', 'overflow-x: hidden', 'border-right: solid 1px #c0c0c0');
        html.addClass('.drakonhubwidget-diagram-container', 'display:inline-block', 'position:absolute', 'height:100%', 'width: calc(100% - 100px)', 'left:100px', 'top:0px', 'user-select: none', 'cursor: default', 'white-space: nowrap', 'background: orange');
        html.addClass('.drakonhubwidget-buttons-container::-webkit-scrollbar', 'width: 8px');
        html.addClass('.drakonhubwidget-buttons-container::-webkit-scrollbar-track', 'display: none');
        html.addClass('.drakonhubwidget-buttons-container::-webkit-scrollbar-thumb', 'background: #97D3E1', 'border-radius:4px');
        html.addClass('.quill_editor, .quill_editor *', 'user-select: auto');
        html.addClass('.quill_editor strong', 'font-weight: bold');
        html.addClass('.quill_editor em', 'font-style: italic');
        html.addClass('.quill_editor ul', 'list-style-type: disc', 'list-style-position: inside');
        html.addClass('.quill_editor ol', 'list-style-type: decimal', 'list-style-position: inside');
    }
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
function detectDescChange(widget, edit) {
    var _collection_205, change, desc;
    desc = undefined;
    _collection_205 = edit.changes;
    for (change of _collection_205) {
        if (!(change.id || !('description' in change.fields))) {
            desc = change.fields.description;
            break;
        }
    }
    if (desc) {
        if (widget.showDesc) {
            fillDescCore(widget, desc);
        }
        return edit;
    } else {
        return edit;
    }
}
function div() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('div', properties, args);
}
function editHtml(left, top, header, oldContent, ro, path, tr) {
    var _obj_;
    _obj_ = editHtml_create(left, top, header, oldContent, ro, path, tr);
    return _obj_.run();
}
function editHtmlKeyEvents(machine, event) {
    if (event.key === 'Escape') {
        machine.cancel();
    } else {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.stopPropagation();
            machine.save();
        }
    }
}
function editHtml_create(left, top, header, oldContent, ro, path, tr) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'editHtml',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* editHtml_main() {
        var _branch_, _eventType_, _event_, buttonsDiv, cancel, columnsDiv, contentDiv, dialog, height, hint, ok, popup, quill, result, safe, wrapper;
        _branch_ = 'Build popup';
        while (true) {
            switch (_branch_) {
            case 'Build popup':
                safe = widgets.getSafeArea();
                if (widgets.isMobileDevice()) {
                    popup = div('shadow', { background: 'white' });
                    popup.style.border = 'solid 1px ' + unit.darkColor;
                    widgets.pushSemiModalPopup(popup, safe.left, safe.top, undefined, true);
                    dialog = {
                        popup: popup,
                        client: popup
                    };
                } else {
                    dialog = widgets.createMovablePopup(tr(header), left, top, path, true);
                }
                contentDiv = div('quill_editor', {
                    width: '600px',
                    'max-width': 'calc(100vw - 48px)',
                    height: '300px',
                    'overflow-y': 'auto',
                    'line-height': 1.3
                });
                if (widgets.isMobileDevice()) {
                    _branch_ = 'Wrap editor';
                } else {
                    _branch_ = 'Buttons';
                }
                break;
            case 'Buttons':
                html.add(dialog.client, contentDiv);
                buttonsDiv = div({
                    'text-align': 'right',
                    'padding-bottom': '5px',
                    'padding-top': '5px',
                    'position': 'relative'
                });
                html.add(dialog.client, buttonsDiv);
                if (!ro) {
                    hint = div('middle-v', {
                        left: '10px',
                        color: 'gray',
                        text: tr('Ctrl+Enter to save')
                    });
                    html.add(buttonsDiv, hint);
                    ok = widgets.createDefaultButton(tr('Save'), me.save);
                    html.add(buttonsDiv, ok);
                }
                cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
                html.add(buttonsDiv, cancel);
                _branch_ = 'Set up Quill editor';
                break;
            case 'Wrap editor':
                height = safe.height / 2 - 45;
                height = Math.min(height, 200);
                contentDiv.style.height = height + 'px';
                wrapper = div({
                    'display': 'inline-block',
                    'vertical-align': 'top'
                });
                html.add(wrapper, contentDiv);
                _branch_ = 'Mobile buttons';
                break;
            case 'Mobile buttons':
                columnsDiv = div({
                    'display': 'block',
                    'white-space': 'nowrap',
                    'position': 'relative'
                });
                html.add(dialog.client, columnsDiv);
                html.add(columnsDiv, wrapper);
                buttonsDiv = div({
                    'display': 'inline-block',
                    'width': '46px',
                    'padding': '3px',
                    'position': 'relative'
                });
                html.add(columnsDiv, buttonsDiv);
                cancel = widgets.createIconButton(path + 'cross-black.png', me.cancel);
                cancel.style.margin = '0px';
                html.add(buttonsDiv, cancel);
                if (!ro) {
                    html.add(buttonsDiv, div());
                    ok = widgets.createIconButton(path + 'check-white.png', me.save);
                    ok.style.background = '#038009';
                    ok.style.margin = '0px';
                    ok.style.marginTop = '3px';
                    html.add(buttonsDiv, ok);
                }
                _branch_ = 'Set up Quill editor';
                break;
            case 'Set up Quill editor':
                registerEvent(dialog.popup, 'keydown', function (evt) {
                    editHtmlKeyEvents(me, evt);
                }, true);
                drakon_canvas.addHtmltoDom(oldContent, contentDiv);
                quill = createQuillEditor(contentDiv, ro);
                if (!widgets.isMobileDevice()) {
                    widgets.positionPopup(dialog.popup, left, top - 80);
                }
                quill.focus();
                if (ro) {
                    me.state = '54';
                    me._busy = false;
                    _event_ = yield;
                    widgets.removePopups();
                    _topResolve_(undefined);
                    return;
                } else {
                    _branch_ = 'Wait for user response';
                }
                break;
            case 'Wait for user response':
                me.state = '34';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'save') {
                    result = getQuillContent(contentDiv);
                    if (result.length > 2000) {
                        widgets.showErrorSnack(tr('Text is too long'));
                        _branch_ = 'Wait for user response';
                    } else {
                        widgets.removePopups();
                        _topResolve_(result);
                        return;
                    }
                } else {
                    if (!(_eventType_ === 'cancel')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    widgets.removePopups();
                    _topResolve_(undefined);
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
        _topResolve_();
    }
    function editHtml_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = editHtml_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = editHtml_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.save = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '34':
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
        case '34':
        case '54':
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
function fillDesc(widget) {
    var canwidget, props;
    canwidget = getCanvasWidget(widget);
    props = canwidget.getDiagramProperties();
    fillDescCore(widget, props.description);
}
function fillDescCore(widget, desc) {
    var close, edit, face, font, path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    html.clear(widget.descBottom);
    html.clear(widget.descButtons);
    if (widget.diagram) {
        if (!(widget.diagram.access === 'read')) {
            edit = widgets.createIconButton(path + 'description.png', function () {
                startEditDescription(widget);
            }, tr('Edit'));
            edit.style.marginTop = '5px';
            edit.style.marginRight = '5px';
            html.add(widget.descButtons, edit);
        }
        close = widgets.createSimpleButton(tr('Close'), function () {
            hideDescription(widget);
        });
        close.style.marginTop = '5px';
        close.style.lineHeight = '38px';
        html.add(widget.descButtons, close);
        widget.descBottom.style.padding = '10px';
        widget.descBottom.style.overflowY = 'auto';
        if (desc) {
            face = getFontFace();
            font = gconfig.fontSize + 'px ' + face;
            drakon_canvas.addHtmltoDom(desc, widget.descBottom, {}, font, true);
        }
        widget.quill = undefined;
    } else {
    }
}
function generateByType(diagram, language) {
    var content, json, name, type;
    json = JSON.stringify(diagram, null, 4);
    json = utils.replace(json, '\xA0', ' ');
    name = diagram.name;
    type = diagram.type;
    if (type === 'drakon') {
        try {
            content = drakongen.toPseudocode(json, name, name + '.drakon', language);
        } catch (ex) {
            return buildGenError(ex);
        }
    } else {
        if (type === 'graf') {
            try {
                content = drakongen.toMindTree(json, name, name + '.graf', language);
            } catch (ex) {
                return buildGenError(ex);
            }
        } else {
            if (type === 'free') {
                try {
                    content = drakongen.freeToText(json, name, name + '.free', language);
                } catch (ex) {
                    return buildGenError(ex);
                }
            } else {
                content = '';
            }
        }
    }
    return {
        ok: true,
        content: content
    };
}
async function generateCode(widget) {
    var generated, language;
    language = getPseudoLanguage();
    generated = generateCore(widget, language);
    showPseudocode(widget, generated);
}
function generateCore(widget, language) {
    var json, obj;
    json = widget.drakon.exportJson();
    obj = JSON.parse(json);
    return generateByType(obj, language);
}
function getCanvasWidget(widget) {
    return widget.drakon;
}
function getColorPaletteData() {
    var colors, palette;
    if (!unit.palette) {
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
    }
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
    unit.webColors = colors;
    return unit.palette;
}
function getFontFace() {
    return gconfig.fontFamily;
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
function getFontSizes() {
    var i, result;
    result = [];
    for (i = 8; i <= 16; i++) {
        result.push(i.toString());
    }
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
    return result.map(function (size) {
        return size + ' px';
    });
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
function getHeader2Size() {
    return gconfig.fontSize + 2 + 'px';
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
function getLineWidthValues() {
    return [
        '1 px',
        '2 px',
        '3 px',
        '4 px',
        '5 px'
    ];
}
function getNameChecker(widget) {
    var tr;
    tr = widget.widgetSettings.translate;
    if (widget.widgetSettings.nameChecker) {
        return widget.widgetSettings.nameChecker;
    } else {
        if (widget.widgetSettings.strictName) {
            return function (value) {
                return checkGoodFilename(value, tr);
            };
        } else {
            return function (value) {
                return nameNotEmpty(value, tr);
            };
        }
    }
}
function getPaddingSizes(tr) {
    return [
        tr('Default'),
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
function getPseudoLanguage() {
    return localStorage.getItem('pseudo-language') || 'en';
}
function getQuillContent(contentDiv) {
    var first, noRoot, rawHtml, serializer;
    first = contentDiv.childNodes[0];
    trimEnd(first);
    serializer = new XMLSerializer();
    rawHtml = serializer.serializeToString(first);
    noRoot = stripRootNode(rawHtml);
    return addNbsp(noRoot);
}
function getShadowTypes(tr) {
    return [
        tr('No shadow'),
        tr('Subtle'),
        tr('Strong')
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
function getZoom() {
    var value;
    value = localStorage.getItem('drakonhubwidget-zoom') || '100%';
    return value;
}
function goHome(widget) {
    var canwidget;
    canwidget = getCanvasWidget(widget);
    canwidget.goHome();
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
}
function hideDescription(widget) {
    widget.showDesc = false;
    layoutRedraw(widget);
}
function hideToolbar(widget) {
    if (widget.widgetSettings.onHideToolbar) {
        widget.widgetSettings.onHideToolbar();
    }
    widget.hideToolbar = true;
    widget.showDesc = false;
    layoutRedraw(widget);
}
async function insertFreePicture(widget, evt) {
    var existing, imageData;
    tracing.trace('insertFreePicture', undefined);
    existing = widget.drakon.getLoadedImages();
    imageData = await showChooseImage(widget, existing, undefined);
    if (imageData) {
        widget.drakon.insertFree('free-image', evt, imageData);
    }
}
function insertGroupDuration(widget, direction, evt) {
    if (direction === 'left') {
        widget.drakon.insertFree('group-duration-left', evt);
    } else {
        widget.drakon.insertFree('group-duration-right', evt);
    }
}
async function insertPicture(widget, type) {
    var existing, imageData;
    tracing.trace('insertPicture', type);
    existing = widget.drakon.getLoadedImages();
    imageData = await showChooseImage(widget, existing, undefined);
    if (imageData) {
        widget.drakon.showInsertionSockets(type, imageData);
    }
}
function isHex(text, start) {
    var a, code, f, i, nine, zero;
    a = 'a'.codePointAt(0);
    f = 'f'.codePointAt(0);
    zero = '0'.codePointAt(0);
    nine = '9'.codePointAt(0);
    start = start || 0;
    for (i = start; i < text.length; i++) {
        code = text.codePointAt(i);
        if (!(code >= a && code <= f || code >= zero && code <= nine)) {
            return false;
        }
    }
    return true;
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
function layoutRedraw(widget) {
    var canwidget;
    layoutView(widget);
    if (widget.showDesc) {
        fillDesc(widget);
    }
    if (widget.diagram) {
        canwidget = getCanvasWidget(widget);
        canwidget.redraw();
    }
    widget.quill = undefined;
}
function layoutView(widget) {
    var _branch_, canvas, canwidget, commonRect, config, containerRect, descDiv, diaDiv, dwidth, iconRect, toolbarHeight, toolbarWidth, viewRect;
    _branch_ = 'Hide/show toolbar';
    while (true) {
        switch (_branch_) {
        case 'Hide/show toolbar':
            if (widget.hideToolbar) {
                widget.buttonsBar.style.display = 'none';
                widget.view.style.width = '100%';
                widget.view.style.left = '0px';
                widget.showToolbar.style.display = 'inline-block';
                widget.showToolbar.style.position = 'absolute';
                widget.showToolbar.style.left = '3px';
                widget.showToolbar.style.top = '3px';
                _branch_ = 'Description';
            } else {
                widget.buttonsBar.style.display = 'inline-block';
                widget.showToolbar.style.display = 'none';
                _branch_ = 'Adjust toolbar width';
            }
            break;
        case 'Adjust toolbar width':
            iconRect = widget.iconButtons.getBoundingClientRect();
            commonRect = widget.commonButtons.getBoundingClientRect();
            toolbarHeight = iconRect.height + commonRect.height;
            containerRect = widget.container.getBoundingClientRect();
            if (toolbarHeight > containerRect.height) {
                toolbarWidth = 98;
            } else {
                toolbarWidth = 90;
            }
            widget.buttonsBar.style.width = toolbarWidth + 'px';
            widget.view.style.width = 'calc(100% - ' + toolbarWidth + 'px)';
            widget.view.style.left = toolbarWidth + 'px';
            _branch_ = 'Description';
            break;
        case 'Description':
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
                } else {
                    diaDiv = widget.view;
                }
                _branch_ = 'Layout diagram view';
            } else {
                _branch_ = 'Exit';
            }
            break;
        case 'Layout diagram view':
            viewRect = diaDiv.getBoundingClientRect();
            config = buildDwConfig(widget);
            canwidget = getCanvasWidget(widget);
            canvas = canwidget.render(viewRect.width, viewRect.height, config);
            html.add(diaDiv, canvas);
            addIndicator(widget, config);
            if (widget.diagram && widget.diagram.access === 'read') {
                widget.indicator.showReadonly();
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
function line(ctx, x1, y1, x2, y2, color, width) {
    x1 = Math.round(x1) + 0.5;
    y1 = Math.round(y1) + 0.5;
    x2 = Math.round(x2) + 0.5;
    y2 = Math.round(y2) + 0.5;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
async function loadFonts(widget, fonts) {
    var canwidget, codes, face, font, fontCodes, mustRedraw, parsed;
    codes = {};
    for (font of fonts) {
        parsed = drakon_canvas.parseCssFont(font, {});
        face = buildFontCode(parsed);
        codes[face] = true;
    }
    fontCodes = Object.keys(codes);
    mustRedraw = await widget.widgetSettings.loadFonts(fontCodes);
    if (mustRedraw) {
        canwidget = getCanvasWidget(widget);
        canwidget.redraw();
    }
}
function makeGroupEnd(icon) {
    var style;
    style = icon.style;
    style.borderRadius = '0px 3px 3px 0px';
    style.borderRight = 'solid 1px grey';
}
function makeGroupStart(icon) {
    var style;
    style = icon.style;
    style.marginLeft = '5px';
    style.borderRadius = '3px 0px 0px 3px';
}
function mergeUserSettings(config, userSettings) {
}
function nameNotEmpty(value, tr) {
    if (value) {
        value = value.trim();
        if (value) {
            return undefined;
        } else {
            return tr('Name cannot be empty');
        }
    } else {
        return tr('Name cannot be empty');
    }
}
function onColorInput(currentContainer, input, apply, chooseColor) {
    var decoded, value;
    value = input.value.trim();
    if (value) {
        value = value.toLowerCase();
        decoded = unit.webColors[value];
        if (decoded) {
            value = '#' + decoded;
            html.clear(currentContainer);
            addColorIcon(currentContainer, value, chooseColor(value));
            apply.enable();
        } else {
            if (value.length === 7 && value[0] === '#' && isHex(value, 1)) {
                html.clear(currentContainer);
                addColorIcon(currentContainer, value, chooseColor(value));
                apply.enable();
            } else {
                html.clear(currentContainer);
                addColorIcon(currentContainer, '', chooseColor(''));
                apply.disable();
            }
        }
    } else {
        html.clear(currentContainer);
        addColorIcon(currentContainer, '', chooseColor(''));
        apply.enable();
    }
}
function onFreeToolbarTypeChanged(widget) {
    updateFreeIconButtons(widget);
    layoutRedraw(widget);
}
function onToolbarTypeChanged(widget) {
    updateIconButtons(widget);
    layoutRedraw(widget);
}
function onZoomChanged(zoom) {
    var value;
    value = zoom / 100 + '%';
    localStorage.setItem('drakonhubwidget-zoom', value);
}
function performRedo(widget) {
    var canwidget;
    canwidget = getCanvasWidget(widget);
    canwidget.redo();
}
function performUndo(widget) {
    var canwidget;
    canwidget = getCanvasWidget(widget);
    canwidget.undo();
}
function readFileAsBase64(file) {
    var _obj_;
    _obj_ = readFileAsBase64_create(file);
    return _obj_.run();
}
function readFileAsBase64_create(file) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'readFileAsBase64',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* readFileAsBase64_main() {
        var _eventType_, _event_, error, fileReader;
        fileReader = new FileReader();
        fileReader.onload = me.onFileLoaded;
        fileReader.onerror = me.onError;
        fileReader.readAsDataURL(file);
        me.state = '12';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'onFileLoaded') {
            _topResolve_(fileReader.result);
            return;
        } else {
            if (!(_eventType_ === 'onError')) {
                throw new Error('Unexpected case value: ' + _eventType_);
            }
            error = _event_[1];
            _topReject_(error);
            return;
        }
        _topResolve_();
    }
    function readFileAsBase64_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = readFileAsBase64_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = readFileAsBase64_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onFileLoaded = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
            _args_ = [];
            _args_.push('onFileLoaded');
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
        case '12':
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
    return me;
}
function rebuildToolbar(widget) {
    var _selectValue_224, tr, type, typeCombo;
    tr = widget.widgetSettings.translate;
    html.clear(widget.buttonsBar);
    if (widget.widgetSettings.mainMenuButton) {
        addMainMenuButton(widget, widget.buttonsBar, widget.widgetSettings.mainMenuButton);
    }
    widget.commonButtons = div();
    html.add(widget.buttonsBar, widget.commonButtons);
    widget.iconButtons = div();
    html.add(widget.buttonsBar, widget.iconButtons);
    if (widget.diagram) {
        addToolbarRow(widget, widget.commonButtons, 'left-angle2.png', hideToolbar, 'Hide toolbar', 'home.png', goHome, 'To diagram home');
        addToolbarRow(widget, widget.commonButtons, 'theme.png', chooseTheme, 'Color theme', 'zoom.png', chooseZoom, 'Zoom');
        addToolbarRow(widget, widget.commonButtons, 'description.png', showDescription, 'Description', 'code.png', generateCode, 'Pseudocode');
        if (widget.diagram.access === 'read') {
        } else {
            if (widget.widgetSettings.showUndo) {
                addToolbarRow(widget, widget.commonButtons, 'undo.png', performUndo, 'Undo', 'redo.png', performRedo, 'Redo');
            }
            _selectValue_224 = widget.diagram.type;
            if (_selectValue_224 === 'drakon') {
                typeCombo = html.createElement('select');
                typeCombo.style.width = '82px';
                typeCombo.style.marginTop = '3px';
                typeCombo.style.marginBottom = '3px';
                typeCombo.style.paddingTop = '5px';
                typeCombo.style.paddingBottom = '5px';
                typeCombo.style.border = 'solid 1px #c0c0c0';
                html.add(widget.commonButtons, typeCombo);
                html.addOption(typeCombo, 'basic', tr('Basic'));
                html.addOption(typeCombo, 'medic', tr('Medic'));
                html.addOption(typeCombo, 'all', tr('All'));
                type = localStorage.getItem('drakonhubwidget-toolbar-type');
                type = type || 'basic';
                typeCombo.value = type;
                widget.typeCombo = typeCombo;
                registerEvent(typeCombo, 'change', function () {
                    onToolbarTypeChanged(widget);
                });
                updateIconButtons(widget);
            } else {
                if (_selectValue_224 === 'graf') {
                    updateMindButtons(widget);
                } else {
                    if (!(_selectValue_224 === 'free')) {
                        throw new Error('Unexpected case value: ' + _selectValue_224);
                    }
                    typeCombo = html.createElement('select');
                    typeCombo.style.width = '82px';
                    typeCombo.style.marginTop = '3px';
                    typeCombo.style.marginBottom = '3px';
                    typeCombo.style.paddingTop = '5px';
                    typeCombo.style.paddingBottom = '5px';
                    typeCombo.style.border = 'solid 1px #c0c0c0';
                    html.add(widget.commonButtons, typeCombo);
                    html.addOption(typeCombo, 'basic', tr('Basic'));
                    html.addOption(typeCombo, 'ui', tr('UI'));
                    html.addOption(typeCombo, 'architect', tr('Architect'));
                    type = localStorage.getItem('drakonhubwidget-free-toolbar-type');
                    type = type || 'basic';
                    typeCombo.value = type;
                    widget.typeCombo = typeCombo;
                    registerEvent(typeCombo, 'change', function () {
                        onFreeToolbarTypeChanged(widget);
                    });
                    updateFreeIconButtons(widget);
                }
            }
        }
    } else {
    }
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
}
function regenerateMany(docs, language) {
    var doc, generated, prompt, pseudo;
    generated = [];
    for (doc of docs) {
        pseudo = generateByType(doc, language);
        generated.push(pseudo.content);
    }
    prompt = generated.join('\n\n\n');
    return {
        ok: true,
        content: prompt
    };
}
function regeneratePseudocode(widget, language, docs) {
    var generated;
    if (docs) {
        generated = regenerateMany(docs, language);
    } else {
        generated = generateCore(widget, language);
    }
    setPseudoLanguage(language);
    showPseudocode(widget, generated, docs);
}
function registerEvent(element, eventName, action) {
    tracing.registerEvent(element, eventName, action);
}
function rememberColor(data, color) {
    data.recent.unshift(color);
}
function saveDescription(widget) {
    var canwidget, desc, tr;
    tr = widget.widgetSettings.translate;
    desc = getQuillContent(widget.editorDiv);
    if (desc.length > 5000) {
        widgets.showErrorSnack(tr('Text is too long'));
    } else {
        canwidget = getCanvasWidget(widget);
        canwidget.setDiagramProperty('description', desc);
    }
}
function setBoldFont(context, prop, value) {
    var font, weight;
    if (value) {
        weight = 'bold';
    } else {
        weight = '';
    }
    context[prop].weight = weight;
    font = drakon_canvas.cssFontToString(context[prop]);
    changeStyleProperty(context, prop, font);
}
function setBorderThickness(context, value, align) {
    var borderWidth;
    borderWidth = parseInt(value);
    changeStyleProperty(context, 'borderWidth', borderWidth);
}
function setFontFamily(context, prop, family) {
    var font;
    context[prop].family = family;
    font = drakon_canvas.cssFontToString(context[prop]);
    changeStyleProperty(context, prop, font);
}
function setFontSize(context, prop, size) {
    var font;
    context[prop].size = parseFloat(size);
    font = drakon_canvas.cssFontToString(context[prop]);
    changeStyleProperty(context, prop, font);
}
function setItalicFont(context, prop, value) {
    var font, style;
    if (value) {
        style = 'italic';
    } else {
        style = '';
    }
    context[prop].style = style;
    font = drakon_canvas.cssFontToString(context[prop]);
    changeStyleProperty(context, prop, font);
}
function setLineThickness(context, value, align) {
    var borderWidth;
    borderWidth = parseInt(value);
    changeStyleProperty(context, 'lineWidth', borderWidth);
}
function setPadding(context, value, align) {
    var padding;
    if (value === context.tr('Default')) {
        padding = '';
    } else {
        padding = parseInt(value);
    }
    changeStyleProperty(context, 'padding', padding);
}
function setPseudoLanguage(language) {
    localStorage.setItem('pseudo-language', language);
}
function setRoundedIcons(widget, rounded) {
    var theme;
    theme = widget.userSettings.theme2 || {};
    if (rounded) {
        widget.iconRadius = 3;
    } else {
        widget.iconRadius = 0;
    }
    setTheme(widget, theme);
}
function setRoundedLines(widget, rounded) {
    var theme;
    theme = widget.userSettings.theme2 || {};
    if (rounded) {
        widget.lineRadius = 6;
    } else {
        widget.lineRadius = 0;
    }
    setTheme(widget, theme);
}
function setShadow(context, value) {
    var shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY;
    if (value === context.tr('Subtle')) {
        shadowColor = 'rgba(0, 0, 0, 0.4)';
        shadowBlur = 10;
        shadowOffsetX = 0;
        shadowOffsetY = 0;
    } else {
        if (value === context.tr('Strong')) {
            shadowColor = 'rgba(0, 0, 0, 0.5)';
            shadowBlur = 2;
            shadowOffsetX = 6;
            shadowOffsetY = 8;
        } else {
            shadowColor = '';
            shadowBlur = 0;
            shadowOffsetX = 0;
            shadowOffsetY = 0;
        }
    }
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
}
function setTextAlign(context, value, align) {
    var newValue;
    if (value) {
        newValue = align;
    } else {
        newValue = '';
    }
    changeStyleProperty(context, 'textAlign', newValue);
}
function setTheme(widget, theme) {
    theme.lineRadius = widget.lineRadius;
    theme.iconRadius = widget.iconRadius;
    widget.userSettings.theme2 = theme;
    layoutRedraw(widget);
    widget.widgetSettings.saveUserSettings({ theme2: widget.userSettings.theme2 });
}
function setTimeout(action, delay, notrace) {
    return tracing.setTimeout(action, delay, notrace);
}
function setVerticalAlign(context, value, align) {
    var newValue;
    if (value) {
        newValue = align;
    } else {
        newValue = '';
    }
    changeStyleProperty(context, 'verticalAlign', newValue);
}
function setZoom(widget, value) {
    localStorage.setItem('drakonhubwidget-zoom', value);
    setZoomCore(widget, value);
}
function setZoomCore(widget, value) {
    var canwidget, percent, zoom;
    percent = parseInt(value);
    zoom = percent * 100;
    canwidget = getCanvasWidget(widget);
    canwidget.setZoom(zoom);
}
function showChooseImage(widget, existing, current) {
    var _obj_;
    _obj_ = showChooseImage_create(widget, existing, current);
    return _obj_.run();
}
function showChooseImage_create(widget, existing, current) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'showChooseImage',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* showChooseImage_main() {
        var _eventType_, _event_, buttons, cancel, dialog, existingContainer, existingId, imageContent, imageData, total, tr, upload;
        tracing.trace('showChooseImage', undefined);
        tr = widget.widgetSettings.translate;
        dialog = widgets.createMiddleWindow();
        html.add(dialog, div({
            'text-align': 'center',
            'line-height': 1.3,
            'padding-bottom': '10px',
            'position': 'relative'
        }, div({
            text: tr('Choose an image'),
            'font-size': getHeader2Size()
        })));
        total = calculateImageStorage(existing);
        upload = widgets.createSimpleButton(tr('Upload image'), function () {
            uploadImage(widget, me, total);
        });
        html.add(dialog, div(upload));
        existingContainer = div({
            'max-height': '300px',
            'overflow-y': 'auto'
        });
        html.add(dialog, existingContainer);
        for (id in existing) {
            imageData = existing[id];
            addLoadedImageButton(existingContainer, id, imageData, function (id) {
                me.chooseExisting(id);
            }, current).then(me.onLoaded);
            me.state = '38';
            me._busy = false;
            _event_ = yield;
        }
        cancel = widgets.createSimpleButton(tr('Cancel'), me.cancel);
        cancel.style.marginRight = '0px';
        buttons = div({
            'text-align': 'right',
            'padding-top': '20px'
        }, cancel);
        html.add(dialog, buttons);
        me.state = '19';
        me._busy = false;
        _event_ = yield;
        _eventType_ = _event_[0];
        if (_eventType_ === 'chooseExisting') {
            existingId = _event_[1];
            tracing.trace('chooseExisting', existingId);
            widgets.removeQuestions();
            _topResolve_({ id: existingId });
            return;
        } else {
            if (_eventType_ === 'uploaded') {
                imageContent = _event_[1];
                tracing.trace('uploaded', imageContent.length);
                widgets.removeQuestions();
                _topResolve_({ content: imageContent });
                return;
            } else {
                if (!(_eventType_ === 'cancel')) {
                    throw new Error('Unexpected case value: ' + _eventType_);
                }
                widgets.removeQuestions();
                _topResolve_(undefined);
                return;
            }
        }
        _topResolve_();
    }
    function showChooseImage_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = showChooseImage_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = showChooseImage_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.chooseExisting = function (existingId) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
            _args_ = [];
            _args_.push('chooseExisting');
            _args_.push(existingId);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.uploaded = function (imageContent) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
            _args_ = [];
            _args_.push('uploaded');
            _args_.push(imageContent);
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
        case '19':
            _args_ = [];
            _args_.push('cancel');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onLoaded = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '38':
            _args_ = [];
            _args_.push('onLoaded');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function showComboValues(control, path, name, values, value, onChange) {
    var container, header, rect, table, valueItem;
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
    table = html.createElement('table', {}, [{ 'min-width': 'calc(100% - 2px)' }]);
    html.add(container, table);
    for (valueItem of values) {
        addComboValue(table, path, valueItem, value, onChange);
    }
    widgets.pushSemiModalPopup(container, rect.left, rect.bottom);
}
async function showDescPopup(widget) {
    var canwidget, newDesc, path, props, ro, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    canwidget = getCanvasWidget(widget);
    props = canwidget.getDiagramProperties();
    ro = canwidget.isReadonly();
    newDesc = await editHtml(0, 0, '', props.description, ro, path, tr);
    if (!(newDesc === undefined)) {
        canwidget.setDiagramProperty('description', newDesc);
    }
}
function showDescription(widget) {
    if (widgets.isNarrowScreen()) {
        showDescPopup(widget);
    } else {
        widget.showDesc = true;
        layoutRedraw(widget);
        fillDesc(widget);
    }
}
function showPalette(context, launcher, value, onColorChosen) {
    var _collection_207, apply, bottom, chooseColor, chooseColorLight, closeAndUse, color, currentContainer, data, i, input, line, lineColor, lineContainer, lines, paletteWindow, recent, rect;
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
    for (i = 0; i < data.recent.length && i < 6; i++) {
        color = data.recent[i];
        addColorIcon(recent, color, chooseColorLight(color));
    }
    while (true) {
        if (i < 6) {
            addEmptyIcon(recent);
            i++;
        } else {
            break;
        }
    }
    _collection_207 = data.lines;
    for (line of _collection_207) {
        lineContainer = div({
            'padding-left': '5px',
            'padding-top': '1px',
            'padding-bottom': '1px',
            'padding-right': '4px'
        });
        html.add(lines, lineContainer);
        for (lineColor of line) {
            addColorIcon(lineContainer, lineColor, chooseColor(lineColor));
        }
    }
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
    apply = createComplexButton(bottom, context.tr('Apply'), function () {
        rememberColor(data, input.value.trim());
        closeAndUse(input.value.trim());
    }, 'white', unit.darkColor);
    apply.enabledButton.style.lineHeight = '29px';
    apply.disabledButton.style.lineHeight = '29px';
    registerEvent(input, 'input', function () {
        onColorInput(currentContainer, input, apply, chooseColor);
    });
    onColorInput(currentContainer, input, apply, chooseColor);
    rect = launcher.getBoundingClientRect();
    widgets.pushSemiModalPopup(paletteWindow, rect.left, rect.bottom);
}
function showPseudocode(widget, generated, docs) {
    var buttonStyle, buttons, close, combo, container, copy, dialog, generate, headerSize, language, options, pre, regenerate, tr;
    language = getPseudoLanguage();
    tr = widget.widgetSettings.translate;
    dialog = widgets.createWideMiddleWindow();
    container = div();
    container.className = 'column-2-container';
    html.add(dialog, container);
    regenerate = div({
        'padding': '10px',
        'position': 'relative',
        'text-align': 'left',
        'white-space': 'nowrap'
    });
    html.add(container, regenerate);
    html.add(regenerate, div({
        text: tr('Language'),
        display: 'inline-block'
    }));
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
    combo.style.maxWidth = '130px';
    html.addOption(combo, 'en', 'English');
    html.addOption(combo, 'no', 'Norsk');
    html.addOption(combo, 'ru', 'Русский');
    combo.value = language;
    html.add(regenerate, combo);
    generate = widgets.createSimpleButton(tr('Generate'), function () {
        regeneratePseudocode(widget, combo.value, docs);
    });
    generate.style.marginLeft = '5px';
    generate.style.verticalAlign = 'middle';
    html.add(regenerate, generate);
    close = widgets.createSimpleButton(tr('Close'), widgets.removeQuestions);
    close.style.marginRight = '0px';
    buttonStyle = {
        'padding': '10px',
        'position': 'relative',
        'text-align': 'right',
        'white-space': 'nowrap'
    };
    if (generated.ok) {
        copy = widgets.createDefaultButton(tr('Copy'), function () {
            copyTextToClipboard(generated.content, tr);
        });
        buttons = div(buttonStyle, copy, close);
    } else {
        buttons = div(buttonStyle, close);
    }
    html.add(container, buttons);
    headerSize = gconfig.fontSize + 2 + 'px';
    html.add(dialog, div({
        'text-align': 'center',
        'line-height': 1.3,
        'padding-bottom': '10px',
        'position': 'relative'
    }, div({
        text: tr('Pseudocode'),
        'font-weight': 'bold',
        'font-size': headerSize
    })));
    pre = html.createElement('pre');
    html.setText(pre, generated.content);
    pre.style.padding = '20px';
    pre.style.background = '#dbdbdb';
    html.add(dialog, pre);
}
function showToolbar(widget) {
    if (widget.widgetSettings.onShowToolbar) {
        widget.widgetSettings.onShowToolbar();
    }
    widget.hideToolbar = false;
    layoutRedraw(widget);
}
async function startChangeImage(widget, prim) {
    var existing, imageData;
    tracing.trace('startChangeImage', prim.id + ' ' + prim.image);
    existing = widget.drakon.getLoadedImages();
    imageData = await showChooseImage(widget, existing, prim.image);
    if (imageData) {
        widget.drakon.setImage(prim.id, imageData);
    }
}
async function startEditAux2(widget, prim, ro) {
    var canwidget, newContent, oldContent, path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    oldContent = prim.aux2 || '';
    if (ro) {
        newContent = await widgets.largeBoxRo(prim.left, prim.top, tr('Aux info'), oldContent);
    } else {
        newContent = await widgets.largeBox(prim.left, prim.top, tr('Edit aux info'), oldContent);
        if (newContent === undefined || newContent === oldContent) {
        } else {
            canwidget = getCanvasWidget(widget);
            canwidget.setAux2(prim.id, newContent);
        }
    }
}
async function startEditContent(widget, prim, ro) {
    var _branch_, _selectValue_203, canwidget, fonts, nameChecker, newContent, path, tr;
    _branch_ = 'Branch1';
    while (true) {
        switch (_branch_) {
        case 'Branch1':
            tr = widget.widgetSettings.translate;
            path = widget.widgetSettings.imagePath;
            _selectValue_203 = prim.type;
            if (_selectValue_203 === 'header') {
                if (ro) {
                    widgets.inputBoxRo(prim.left, prim.top, tr('Name'), prim.content);
                    _branch_ = 'Exit';
                } else {
                    nameChecker = getNameChecker(widget);
                    newContent = await widgets.inputBox(prim.left, prim.top, tr('Rename'), prim.content, nameChecker, widget.widgetSettings.uniqueChecker);
                    if (newContent && !(newContent === prim.content)) {
                        _branch_ = 'Set content';
                    } else {
                        _branch_ = 'Exit';
                    }
                }
            } else {
                if (ro) {
                    editHtml(prim.left, prim.top, 'Edit content', prim.content, true, path, tr);
                    _branch_ = 'Exit';
                } else {
                    newContent = await editHtml(prim.left, prim.top, 'Edit content', prim.content, false, path, tr);
                    if (newContent === undefined || newContent === prim.content) {
                        _branch_ = 'Exit';
                    } else {
                        _branch_ = 'Set content';
                    }
                }
            }
            break;
        case 'Set content':
            canwidget = getCanvasWidget(widget);
            fonts = canwidget.setContent(prim.id, newContent);
            loadFonts(widget, fonts);
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
function startEditDescription(widget) {
    var cancel, canwidget, desc, editorDiv, face, font, path, props, quill, save, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    html.clear(widget.descButtons);
    save = widgets.createDefaultButton(tr('Save'), function () {
        saveDescription(widget);
    });
    save.style.marginTop = '5px';
    save.style.marginRight = '5px';
    save.style.lineHeight = '38px';
    html.add(widget.descButtons, save);
    cancel = widgets.createSimpleButton(tr('Cancel'), function () {
        fillDesc(widget);
    });
    cancel.style.marginTop = '5px';
    cancel.style.lineHeight = '38px';
    html.add(widget.descButtons, cancel);
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
}
function startEditDiagramStyle(widget, oldStyle, x, y) {
    var branch, context, dialog, face, header, icon, path, size, tr;
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
    dialog = createFormatDialog(widget, tr('Diagram format'), x, y);
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
}
async function startEditLink(widget, prim, ro) {
    var canwidget, newContent, path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    if (ro) {
        widgets.inputBoxRo(prim.left, prim.top, tr('Link'), prim.link);
    } else {
        newContent = await widgets.inputBox(prim.left, prim.top, tr('Edit link'), prim.link);
        if (newContent === undefined || newContent === prim.link) {
        } else {
            if (newContent.length > 300) {
                widgets.showErrorSnack(tr('Text is too long'));
            } else {
                canwidget = getCanvasWidget(widget);
                canwidget.setLink(prim.id, newContent);
            }
        }
    }
}
async function startEditSecondary(widget, prim, ro) {
    var canwidget, fonts, newContent, path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    if (ro) {
        editHtml(prim.left, prim.top, 'Upper text', prim.secondary, true, path, tr);
    } else {
        newContent = await editHtml(prim.left, prim.top, 'Edit upper text', prim.secondary, false, path, tr);
        if (newContent === undefined || newContent === prim.secondary) {
        } else {
            canwidget = getCanvasWidget(widget);
            fonts = canwidget.setSecondary(prim.id, newContent);
            loadFonts(widget, fonts);
        }
    }
}
function startEditStyle(widget, ids, oldStyle, x, y, accepted) {
    var context, dialog, path, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    dialog = createFormatDialog(widget, tr('Format'), x, y);
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
}
function stopEditSender(widget) {
    if (widget.sender) {
        widget.sender.stop();
        widget.sender = undefined;
    }
}
function stripRootNode(html) {
    var first, last;
    first = html.indexOf('<', 1);
    last = utils.findFromEnd(html, '>', 1);
    return html.substring(first, last + 1);
}
function toggleDescription(widget) {
    if (widget.showDesc) {
        hideDescription(widget);
    } else {
        showDescription(widget);
    }
}
function toggleSilhouette(widget) {
    var canwidget;
    canwidget = getCanvasWidget(widget);
    canwidget.toggleSilhouette();
}
function trimEnd(node) {
    var content, last;
    while (true) {
        if (node.childNodes.length === 0) {
            break;
        } else {
            last = node.childNodes[node.childNodes.length - 1];
            content = last.innerHTML.trim();
            if (content && !(content === '<br>')) {
                break;
            } else {
                html.remove(last);
            }
        }
    }
}
function updateFreeIconButtons(widget) {
    var _branch_, _selectValue_226, path, row3, tr;
    _branch_ = 'Clear';
    while (true) {
        switch (_branch_) {
        case 'Clear':
            tr = widget.widgetSettings.translate;
            path = widget.widgetSettings.imagePath;
            html.clear(widget.iconButtons);
            _branch_ = 'Common 1';
            break;
        case 'Common 1':
            addIconRowFree(widget, widget.iconButtons, 'rectangle.png', 'rectangle', 'Free rectangle', 'A', 'text.png', 'text', 'Text', 'T');
            addIconRowFree(widget, widget.iconButtons, 'line.png', 'line', 'Line', 'L', 'arrow.png', 'arrow', 'Arrow', 'W');
            addIconRowFree(widget, widget.iconButtons, 'poly.png', 'polygon', 'Polygon', '', 'polyline.png', 'polyline', 'Polyline', '');
            addIconRowFree(widget, widget.iconButtons, 'f_begin.png', 'f_begin', 'Soap', '', 'rounded.png', 'rounded', 'Rounded rectangle', 'R');
            addIconRowFree(widget, widget.iconButtons, 'ptr-left.png', 'f_ptr_left', 'Left pointer', '', 'ptr-right.png', 'f_ptr_right', 'Right pointer', '');
            _branch_ = 'Common 2';
            break;
        case 'Common 2':
            addIconRowFree(widget, widget.iconButtons, 'callout.png', 'callout', 'Callout', '', 'circle.png', 'f_circle', 'Ellipse', 'E');
            addIconRowFree(widget, widget.iconButtons, 'frame.png', 'frame', 'Frame', '', 'triangle.png', 'triangle', 'Triangle', '');
            localStorage.setItem('drakonhubwidget-free-toolbar-type', widget.typeCombo.value);
            _selectValue_226 = widget.typeCombo.value;
            if (_selectValue_226 === 'basic') {
                _branch_ = 'Exit';
            } else {
                if (_selectValue_226 === 'ui') {
                    _branch_ = 'UI';
                } else {
                    if (!(_selectValue_226 === 'architect')) {
                        throw new Error('Unexpected case value: ' + _selectValue_226);
                    }
                    _branch_ = 'Architect';
                }
            }
            break;
        case 'Architect':
            addIconRowFree(widget, widget.iconButtons, 'cloud.png', 'cloud', 'Cloud', '', 'db.png', 'database', 'Database', '');
            addIconRowFree(widget, widget.iconButtons, 'human.png', 'human', 'Person 1', '', 'portrait.png', 'portrait', 'Person 2', '');
            addIconRowFree(widget, widget.iconButtons, 'pc.png', 'computer', 'Computer', '', 'notebook.png', 'notebook', 'Notebook', '');
            addIconRowFree(widget, widget.iconButtons, 'server1.png', 'server1', 'Server 1', '', 'server2.png', 'server2', 'Server 2', '');
            addIconRowFree(widget, widget.iconButtons, 'phone.png', 'phone', 'Phone', '', 'tablet.png', 'tablet', 'Tablet', '');
            _branch_ = 'Exit';
            break;
        case 'UI':
            addIconRowFree(widget, widget.iconButtons, 'combobox.png', 'combobox', 'Combo box', '', 'placeholder.png', 'placeholder', 'Placeholder', '');
            addIconRowFree(widget, widget.iconButtons, 'f_ui_hscroll.png', 'hscroll', 'Horizontal scrollbar', '', 'f_ui_vscroll.png', 'vscroll', 'Vertical scrollbar', '');
            addIconRowFree(widget, widget.iconButtons, 'check_true.png', 'check_true', 'Checkbox, checked', '', 'check_false.png', 'check_false', 'Checkbox, unchecked', '');
            addIconRowFree(widget, widget.iconButtons, 'radio_true.png', 'radio_true', 'Radiobutton, checked', '', 'radio_false.png', 'radio_false', 'Radiobutton, unchecked', '');
            addIconRowFree(widget, widget.iconButtons, 'f_cross.png', 'cross', 'Cross', '', 'check.png', 'check', 'Checkmark', '');
            _branch_ = 'UI 2';
            break;
        case 'UI 2':
            addIconRowFree(widget, widget.iconButtons, 'left-angle.png', 'left-angle', 'Move left', '', 'right-angle.png', 'right-angle', 'Move right', '');
            addIconRowFree(widget, widget.iconButtons, 'up-angle.png', 'up-angle', 'Move up', '', 'down-angle.png', 'down-angle', 'Move down', '');
            addIconRowFree(widget, widget.iconButtons, 'left-angle2.png', 'left-angle2', 'Fast left', '', 'right-angle2.png', 'right-angle2', 'Fast right', '');
            addIconRowFree(widget, widget.iconButtons, 'f_menu.png', 'menu', 'Menu', '', 'f_tab.png', 'tab', 'Tab', '');
            addIconRowFree(widget, widget.iconButtons, 'dots3h.png', 'dots3h', 'Horizontal dots', '', 'dots3v.png', 'dots3v', 'Vertical dots', '');
            _branch_ = 'Exit';
            break;
        case 'Exit':
            _branch_ = undefined;
            row3 = addRowToToolbar(widget.iconButtons);
            addIconButton(widget, row3, 'picture.png', function (evt) {
                insertFreePicture(widget, evt);
            }, tr('Picture'), undefined);
            html.add(widget.iconButtons, div({ height: '10px' }));
            break;
        default:
            return;
        }
    }
}
function updateIconButtons(widget) {
    var _selectValue_228, path, row, row2, row3, row4, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    html.clear(widget.iconButtons);
    addIconRow(widget, widget.iconButtons, 'action.png', 'action', 'Action', 'A', 'question.png', 'question', 'Question', 'Q');
    addIconRow(widget, widget.iconButtons, 'select.png', 'select', 'Choice', 'S', 'case.png', 'case', 'Case', 'C');
    row = addRowToToolbar(widget.iconButtons);
    addIconButton(widget, row, 'branch.png', function () {
        widget.showInsertionSockets('branch');
    }, 'Silhouette branch', 'B');
    addIconButton(widget, row, 'silhouette.png', function () {
        toggleSilhouette(widget);
    }, tr('Silhouette / primitive'), undefined);
    localStorage.setItem('drakonhubwidget-toolbar-type', widget.typeCombo.value);
    _selectValue_228 = widget.typeCombo.value;
    if (_selectValue_228 === 'basic') {
        addIconRow(widget, widget.iconButtons, 'foreach.png', 'foreach', 'FOR Loop', 'L', 'insertion.png', 'insertion', 'Insertion', 'N');
        row2 = addRowToToolbar(widget.iconButtons);
        addIconButton(widget, row2, 'comment.png', function () {
            widget.showInsertionSockets('comment');
        }, tr('Comment'), undefined);
        addIconButton(widget, row2, 'picture.png', function () {
            widget.insertDrakonPicture();
        }, tr('Picture'), undefined);
        html.add(widget.iconButtons, div({ height: '10px' }));
    } else {
        if (_selectValue_228 === 'medic') {
            addIconRow(widget, widget.iconButtons, 'parblock.png', 'parblock', 'Concurrent processes', '', 'par.png', 'par', 'Add path', '');
            addIconRow(widget, widget.iconButtons, 'ctrl-start.png', 'ctrlstart', 'Start of control period', '', 'ctrl-end.png', 'ctrlend', 'End of control period', '');
            addIconRow(widget, widget.iconButtons, 'pause.png', 'pause', 'Pause', '', 'duration.png', 'duration', 'Duration', '');
            addIconRow(widget, widget.iconButtons, 'shelf.png', 'shelf', 'Shelf', '', 'insertion.png', 'insertion', 'Insertion', 'N');
            row2 = addRowToToolbar(widget.iconButtons);
            addIconButton(widget, row2, 'group-duration.png', function (evt) {
                insertGroupDuration(widget, 'left', evt);
            }, tr('Group duration - left'), undefined);
            addIconButton(widget, row2, 'group-duration-r.png', function (evt) {
                insertGroupDuration(widget, 'right', evt);
            }, tr('Group duration - right'), undefined);
            row3 = addRowToToolbar(widget.iconButtons);
            addIconButton(widget, row3, 'comment.png', function () {
                widget.showInsertionSockets('comment');
            }, tr('Comment'), undefined);
            addIconButton(widget, row3, 'picture.png', function () {
                widget.insertDrakonPicture();
            }, tr('Picture'), undefined);
            html.add(widget.iconButtons, div({ height: '10px' }));
        } else {
            if (!(_selectValue_228 === 'all')) {
                throw new Error('Unexpected case value: ' + _selectValue_228);
            }
            addIconRow(widget, widget.iconButtons, 'foreach.png', 'foreach', 'FOR Loop', 'L', 'timer.png', 'timer', 'Timer', '');
            addIconRow(widget, widget.iconButtons, 'sinput.png', 'simpleinput', 'Simple input', '', 'soutput.png', 'simpleoutput', 'Simple output', '');
            addIconRow(widget, widget.iconButtons, 'input.png', 'input', 'Input', '', 'output.png', 'output', 'Output', '');
            addIconRow(widget, widget.iconButtons, 'parblock.png', 'parblock', 'Concurrent processes', '', 'par.png', 'par', 'Add path', '');
            addIconRow(widget, widget.iconButtons, 'ctrl-start.png', 'ctrlstart', 'Start of control period', '', 'ctrl-end.png', 'ctrlend', 'End of control period', '');
            addIconRow(widget, widget.iconButtons, 'pause.png', 'pause', 'Pause', '', 'duration.png', 'duration', 'Duration', '');
            addIconRow(widget, widget.iconButtons, 'shelf.png', 'shelf', 'Shelf', '', 'insertion.png', 'insertion', 'Insertion', 'N');
            row2 = addRowToToolbar(widget.iconButtons);
            addIconButton(widget, row2, 'group-duration.png', function (evt) {
                insertGroupDuration(widget, 'left', evt);
            }, tr('Group duration - left'), undefined);
            addIconButton(widget, row2, 'group-duration-r.png', function (evt) {
                insertGroupDuration(widget, 'right', evt);
            }, tr('Group duration - right'), undefined);
            row3 = addRowToToolbar(widget.iconButtons);
            addIconButton(widget, row3, 'comment.png', function () {
                widget.showInsertionSockets('comment');
            }, tr('Comment'), undefined);
            addIconButton(widget, row3, 'process.png', function () {
                widget.showInsertionSockets('process');
            }, tr('Parallel process'), undefined);
            if (gconfig.free) {
                addIconRowFree(widget, widget.iconButtons, 'rectangle.png', 'rectangle', 'Free rectangle', '', 'callout.png', 'callout', 'Callout', '');
            }
            row4 = addRowToToolbar(widget.iconButtons);
            addIconButton(widget, row4, 'picture.png', function () {
                widget.insertDrakonPicture();
            }, tr('Picture'), undefined);
            html.add(widget.iconButtons, div({ height: '10px' }));
        }
    }
}
function updateMindButtons(widget) {
    var path, row2, row3, tr;
    tr = widget.widgetSettings.translate;
    path = widget.widgetSettings.imagePath;
    html.clear(widget.iconButtons);
    addIconRow(widget, widget.iconButtons, 'rectangle.png', 'idea', 'Idea', 'A', 'rounded.png', 'ridea', 'Idea - rounded', 'R');
    row2 = addRowToToolbar(widget.iconButtons);
    addIconButton(widget, row2, 'comment.png', function () {
        widget.showInsertionSockets('conclusion');
    }, tr('Conclusion'), 'C');
    addIconButton(widget, row2, 'callout.png', function (evt) {
        widget.drakon.insertFree('callout', evt);
    }, tr('Callout'), undefined);
    addIconRowFree(widget, widget.iconButtons, 'line.png', 'line', 'Line', 'L', 'arrow.png', 'arrow', 'Arrow', 'W');
    addIconRowFree(widget, widget.iconButtons, 'frame.png', 'frame', 'Frame', '', 'polyline.png', 'polyline', 'Polyline', '');
    row3 = addRowToToolbar(widget.iconButtons);
    addIconButton(widget, row3, 'picture.png', function () {
        insertPicture(widget, 'graf-image');
    }, tr('Picture'), undefined);
}
function updateToolbarVisibility(widget) {
    var showToolbar;
    showToolbar = localStorage.getItem('drakonhub-showtoolbar');
}
function uploadImage(widget, output, total) {
    var _obj_;
    _obj_ = uploadImage_create(widget, output, total);
    return _obj_.run();
}
function uploadImage_create(widget, output, total) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'uploadImage',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* uploadImage_main() {
        var _branch_, _eventType_, _event_, buttons, client, evt, file, imageContent, imp, input, limitBytes, limitText, limitTotal, storage, tr;
        _branch_ = 'Bridge';
        while (true) {
            switch (_branch_) {
            case 'Bridge':
                if (window.padBridge && window.padBridge.uploadImage) {
                    window.padBridge.uploadImage().then(me.onImageContent);
                    me.state = '50';
                    me._busy = false;
                    _event_ = yield;
                    imageContent = _event_[1];
                    if (imageContent) {
                        _branch_ = 'Read file';
                    } else {
                        _branch_ = 'Exit';
                    }
                } else {
                    _branch_ = 'Create dialog';
                }
                break;
            case 'Create dialog':
                if (gconfig.maxImageSizeMb) {
                    limitBytes = gconfig.maxImageSizeMb * 1024 * 1014 * 4 / 3;
                    limitTotal = limitBytes * 3;
                    limitText = gconfig.maxImageSizeMb + 'Mb';
                } else {
                    limitBytes = 560000;
                    limitTotal = 1000000;
                    limitText = '400kb';
                }
                tr = widget.widgetSettings.translate;
                client = widgets.createMiddleWindow();
                html.add(client, div({
                    text: tr('Choose a an image file. ' + 'Max file size is') + ' ' + limitText,
                    padding: '5px'
                }));
                input = html.createElement('input', {
                    type: 'file',
                    accept: '.png,.gif,.webp,.jpg,.jpeg'
                }, [{
                        padding: '10px',
                        width: '100%'
                    }]);
                html.add(client, input);
                imp = widgets.createDefaultButton(tr('Upload'), me.imp);
                imp.style.display = 'none';
                buttons = div({
                    'text-align': 'right',
                    'padding-bottom': '5px'
                }, imp, widgets.createSimpleButton(tr('Cancel'), me.cancel));
                html.add(client, buttons);
                _branch_ = 'Wait for user to select the file';
                break;
            case 'Wait for user to select the file':
                registerEvent(input, 'change', me.chosen);
                me.state = '19';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'chosen') {
                    evt = _event_[1];
                    imp.style.display = 'inline-block';
                    file = evt.target.files[0];
                    _branch_ = 'Wait for user press Import';
                } else {
                    if (!(_eventType_ === 'cancel')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    widgets.removeQuestions();
                    _branch_ = 'Exit';
                }
                break;
            case 'Wait for user press Import':
                me.state = '26';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'imp') {
                    readFileAsBase64(file).then(me.onImageContent);
                    me.state = '51';
                    me._busy = false;
                    _event_ = yield;
                    imageContent = _event_[1];
                    _branch_ = 'Read file';
                } else {
                    if (!(_eventType_ === 'cancel')) {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    widgets.removeQuestions();
                    _branch_ = 'Exit';
                }
                break;
            case 'Read file':
                if (imageContent) {
                    if (imageContent.length > limitBytes) {
                        widgets.showErrorSnack(tr('The image file is too large'));
                        imp.style.display = 'none';
                        _branch_ = 'Wait for user to select the file';
                    } else {
                        storage = imageContent.length + total;
                        if (storage > limitTotal) {
                            widgets.showErrorSnack(tr('All images take up too much storage'));
                            imp.style.display = 'none';
                            _branch_ = 'Wait for user to select the file';
                        } else {
                            widgets.removeQuestions();
                            output.uploaded(imageContent);
                            _branch_ = 'Exit';
                        }
                    }
                } else {
                    widgets.showErrorSnack(tr('An error has occurred'));
                    imp.style.display = 'none';
                    _branch_ = 'Wait for user to select the file';
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
        _topResolve_();
    }
    function uploadImage_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = uploadImage_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = uploadImage_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.chosen = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
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
        case '19':
        case '26':
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
        case '26':
            _args_ = [];
            _args_.push('imp');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onImageContent = function (imageContent) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '50':
        case '51':
            _args_ = [];
            _args_.push('onImageContent');
            _args_.push(imageContent);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
unit.ComplexButton = ComplexButton;
unit.DiagramStyleWindow = DiagramStyleWindow;
unit.DrakonHubWidget = DrakonHubWidget;
unit.IconStyleWindow = IconStyleWindow;
unit.Indicator = Indicator;
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