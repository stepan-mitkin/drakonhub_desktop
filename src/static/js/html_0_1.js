function html_0_1() {
var unit = {};

function add(parent, child) {
    parent.appendChild(child);
}
function addAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function addOption(select, value, text) {
    var option;
    option = createElement('option', { value: value });
    addText(option, text);
    add(select, option);
}
function addText(element, text) {
    var newNode;
    newNode = document.createTextNode(text);
    add(element, newNode);
}
function clear(element) {
    element.innerHTML = '';
}
function createElement(tagName, properties, args) {
    var arg, className, element, key, style, value;
    args = args || [];
    element = document.createElement(tagName);
    if (properties) {
        for (key in properties) {
            value = properties[key];
            element.setAttribute(key, value);
        }
    }
    className = '';
    style = {};
    for (arg of args) {
        if (typeof arg === 'string') {
            className = arg;
        } else {
            if (arg.tagName) {
                add(element, arg);
            } else {
                style = arg;
            }
        }
    }
    for (key in style) {
        value = style[key];
        if (key === 'text') {
            addText(element, value);
        } else {
            if (key !== 'tid') {
                element.style.setProperty(key, value);
            }
        }
    }
    if (className) {
        element.className = className;
    }
    return element;
}
function get(id) {
    var element;
    element = document.getElementById(id);
    if (element) {
        return element;
    } else {
        throw new Error('get: Element with id not found: ' + id);
    }
}
function goTo(url) {
    window.location.href = url;
}
function openTab(url) {
    window.open(url, '_blank');
}
function reload() {
    window.location.reload();
}
function remove(element) {
    element.parentNode.removeChild(element);
}
function setText(element, text) {
    clear(element);
    addText(element, text);
}
function setTitle(title) {
    document.title = title;
}
function addClass() {
    var body, content, i, lines, name, style;
    if (!unit.styleElement) {
        unit.styleElement = createStyle();
    }
    style = unit.styleElement;
    name = arguments[0];
    lines = [];
    for (i = 1; i < arguments.length; i++) {
        lines.push(arguments[i]);
    }
    body = lines.map(addSemi).join('\n');
    content = '\n' + name + ' {\n' + body + '\n}\n';
    style.innerHTML += content;
}
function addClassToStyle() {
    var body, content, i, lines, name, style;
    style = arguments[0];
    name = arguments[1];
    lines = [];
    for (i = 2; i < arguments.length; i++) {
        lines.push(arguments[i]);
    }
    body = lines.map(addSemi).join('\n');
    content = '\n' + name + ' {\n' + body + '\n}\n';
    style.innerHTML += content;
}
function addSemi(line) {
    return '    ' + line.trim() + ';';
}
function createStyle() {
    var styleSheet;
    styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    document.head.appendChild(styleSheet);
    return styleSheet;
}
function resetStyle() {
    if (unit.styleElement) {
        removeElement(unit.styleElement);
    }
    unit.styleElement = createStyle();
    return unit.styleElement;
}
function getRetinaFactor() {
    if (window.devicePixelRatio) {
        return window.devicePixelRatio;
    } else {
        return 1;
    }
}
unit.add = add;
unit.addAfter = addAfter;
unit.addOption = addOption;
unit.addText = addText;
unit.clear = clear;
unit.createElement = createElement;
unit.get = get;
unit.goTo = goTo;
unit.openTab = openTab;
unit.reload = reload;
unit.remove = remove;
unit.setText = setText;
unit.setTitle = setTitle;
unit.addClass = addClass;
unit.addClassToStyle = addClassToStyle;
unit.createStyle = createStyle;
unit.resetStyle = resetStyle;
unit.getRetinaFactor = getRetinaFactor;
return unit;
}