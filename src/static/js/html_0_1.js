function html_0_1() {
    var unit = {};
    function addClass() {
        var style, name, body, content, lines, i, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.styleElement) {
                    __state = '3';
                } else {
                    unit.styleElement = createStyle();
                    __state = '3';
                }
                break;
            case '3':
                style = unit.styleElement;
                name = arguments[0];
                lines = [];
                i = 1;
                __state = '5';
                break;
            case '5':
                if (i < arguments.length) {
                    lines.push(arguments[i]);
                    i++;
                    __state = '5';
                } else {
                    _var2 = lines.map(addSemi);
                    body = _var2.join('\n');
                    content = '\n' + name + ' {\n' + body + '\n}\n';
                    style.innerHTML += content;
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function resetStyle() {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (unit.styleElement) {
                    removeElement(unit.styleElement);
                    __state = '5';
                } else {
                    __state = '5';
                }
                break;
            case '5':
                unit.styleElement = createStyle();
                return unit.styleElement;
            default:
                return;
            }
        }
    }
    function createStyle() {
        var styleSheet;
        styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        document.head.appendChild(styleSheet);
        return styleSheet;
    }
    function addClassToStyle() {
        var style, name, body, content, lines, i, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                style = arguments[0];
                name = arguments[1];
                lines = [];
                i = 2;
                __state = '5';
                break;
            case '5':
                if (i < arguments.length) {
                    lines.push(arguments[i]);
                    i++;
                    __state = '5';
                } else {
                    _var2 = lines.map(addSemi);
                    body = _var2.join('\n');
                    content = '\n' + name + ' {\n' + body + '\n}\n';
                    style.innerHTML += content;
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function addSemi(line) {
        var _var2;
        _var2 = line.trim();
        return '    ' + _var2 + ';';
    }
    function addText(element, text) {
        var newNode;
        newNode = document.createTextNode(text);
        add(element, newNode);
        return;
    }
    function clear(element) {
        element.innerHTML = '';
        return;
    }
    function reload() {
        window.location.reload();
        return;
    }
    function createElement(tagName, properties, args) {
        var element, className, style, _var5, _var6, arg, _var3, _var2, _var4, key, value, _var8, _var7, _var9;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                args = args || [];
                element = document.createElement(tagName);
                if (properties) {
                    _var3 = properties;
                    _var2 = Object.keys(_var3);
                    _var4 = 0;
                    __state = '42';
                } else {
                    __state = '22';
                }
                break;
            case '13':
                return element;
            case '22':
                className = '';
                style = {};
                _var5 = args;
                _var6 = 0;
                __state = '32';
                break;
            case '31':
                _var6++;
                __state = '32';
                break;
            case '32':
                if (_var6 < _var5.length) {
                    arg = _var5[_var6];
                    if (typeof arg === 'string') {
                        className = arg;
                        __state = '31';
                    } else {
                        if (arg.tagName) {
                            add(element, arg);
                            __state = '31';
                        } else {
                            style = arg;
                            __state = '31';
                        }
                    }
                } else {
                    __state = '48';
                }
                break;
            case '42':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    value = _var3[key];
                    element.setAttribute(key, value);
                    _var4++;
                    __state = '42';
                } else {
                    __state = '22';
                }
                break;
            case '48':
                _var8 = style;
                _var7 = Object.keys(_var8);
                _var9 = 0;
                __state = '50';
                break;
            case '49':
                _var9++;
                __state = '50';
                break;
            case '50':
                if (_var9 < _var7.length) {
                    key = _var7[_var9];
                    value = _var8[key];
                    if (key === 'text') {
                        addText(element, value);
                        __state = '49';
                    } else {
                        if (key === 'tid') {
                            __state = '49';
                        } else {
                            element.style.setProperty(key, value);
                            __state = '49';
                        }
                    }
                } else {
                    __state = '52';
                }
                break;
            case '52':
                if (className) {
                    element.className = className;
                    __state = '13';
                } else {
                    __state = '13';
                }
                break;
            default:
                return;
            }
        }
    }
    function addAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        return;
    }
    function setText(element, text) {
        clear(element);
        addText(element, text);
        return;
    }
    function openTab(url) {
        window.open(url, '_blank');
        return;
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
    function remove(element) {
        element.parentNode.removeChild(element);
        return;
    }
    function addOption(select, value, text) {
        var option;
        option = createElement('option', { value: value });
        addText(option, text);
        add(select, option);
        return;
    }
    function add(parent, child) {
        parent.appendChild(child);
        return;
    }
    function goTo(url) {
        window.location.href = url;
        return;
    }
    function setTitle(title) {
        document.title = title;
        return;
    }
    function getRetinaFactor() {
        if (window.devicePixelRatio) {
            return window.devicePixelRatio;
        } else {
            return 1;
        }
    }
    unit.addClass = addClass;
    unit.resetStyle = resetStyle;
    unit.createStyle = createStyle;
    unit.addClassToStyle = addClassToStyle;
    unit.addText = addText;
    unit.clear = clear;
    unit.reload = reload;
    unit.createElement = createElement;
    unit.addAfter = addAfter;
    unit.setText = setText;
    unit.openTab = openTab;
    unit.get = get;
    unit.remove = remove;
    unit.addOption = addOption;
    unit.add = add;
    unit.goTo = goTo;
    unit.setTitle = setTitle;
    unit.getRetinaFactor = getRetinaFactor;
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = html_0_1;
}