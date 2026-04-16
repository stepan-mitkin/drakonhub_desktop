function drakon_canvas() {
var unit = {};
var edit_tools;
var html;
var tracing;
var utils;
function MarkDown(target) {
    var _obj_;
    _obj_ = MarkDown_create(target);
    return _obj_.run();
}
function SpanBuilder() {
    var _obj_;
    _obj_ = SpanBuilder_create();
    return _obj_.run();
}
function endLine(line, lines) {
    if (line.length !== 0) {
        lines.push(line);
    }
    return { tokens: [] };
}
function endToken(current, line, type) {
    if (current.text) {
        line.tokens.push(current);
    }
    return {
        text: '',
        type: type
    };
}
function finishMdMachine(md) {
}
function parsePxSize(size) {
    var value;
    value = parseInt(size);
    if (isNaN(value) || size.indexOf('px') === -1) {
        return undefined;
    } else {
        return value;
    }
}
function pushSpace(line) {
    line.tokens.push({ type: 'space' });
}
function setFontToToken(token, fontObj) {
    var _selectValue_59, font, font2;
    font = fontObj.font;
    _selectValue_59 = token.type;
    if (_selectValue_59 === 'strong') {
        font2 = {};
        Object.assign(font2, fontObj);
        font2.weight = 'bold';
        token.font = cssFontToString(font2);
    } else {
        if (_selectValue_59 === 'em') {
            font2 = {};
            Object.assign(font2, fontObj);
            font2.style = 'italic';
            token.font = cssFontToString(font2);
        } else {
            if (_selectValue_59 === 'sem') {
                font2 = {};
                Object.assign(font2, fontObj);
                font2.style = 'italic';
                font2.weight = 'bold';
                token.font = cssFontToString(font2);
            } else {
                token.font = font;
            }
        }
    }
}
function splitByWhitespace(text) {
    text = text || '';
    return text.trim().split(/[ \t\r\n]+/);
}
function stringToTokensQuoted(text) {
    var buffer, ch, i, quote, state, tokens, whitespace;
    text = text || '';
    tokens = [];
    whitespace = {};
    whitespace[' '] = true;
    whitespace['\t'] = true;
    whitespace['\r'] = true;
    whitespace['\n'] = true;
    quote = {};
    quote['"'] = true;
    quote['\''] = true;
    state = 'idle';
    buffer = '';
    for (i = 0; i < text.length; i++) {
        ch = text[i];
        if (state === 'idle') {
            if (!whitespace[ch]) {
                if (quote[ch]) {
                    buffer += ch;
                    state = 'quoted';
                } else {
                    buffer += ch;
                    state = 'token';
                }
            }
        } else {
            if (state === 'token') {
                if (whitespace[ch]) {
                    tokens.push(buffer);
                    buffer = '';
                    state = 'idle';
                } else {
                    buffer += ch;
                }
            } else {
                if (state !== 'quoted') {
                    throw new Error('Unexpected case value: ' + state);
                }
                if (quote[ch]) {
                    buffer += ch;
                    tokens.push(buffer);
                    buffer = '';
                    state = 'idle';
                } else {
                    buffer += ch;
                }
            }
        }
    }
    if (buffer) {
        tokens.push(buffer);
    }
    return tokens;
}
function addNodeToLine(node, line, strong, em) {
    var _collection_61, child, name, tokens, type;
    if (strong) {
        if (em) {
            type = 'sem';
        } else {
            type = 'strong';
        }
    } else {
        if (em) {
            type = 'em';
        } else {
            type = 'normal';
        }
    }
    _collection_61 = node.childNodes;
    for (child of _collection_61) {
        name = getNodeName(child);
        if (name === '#text') {
            if (child.nodeValue.trim() === '') {
                line.push({ type: 'space' });
            } else {
                tokens = splitHtmlTextNode(child.nodeValue, type);
                utils.addRange(tokens, line);
            }
        } else {
            if (name === 'strong') {
                addNodeToLine(child, line, true, em);
            } else {
                if (name === 'em') {
                    addNodeToLine(child, line, strong, true);
                } else {
                    if (name !== 'script') {
                        addNodeToLine(child, line, strong, em);
                    }
                }
            }
        }
    }
}
function addSpaceToLine(line) {
    line.push({ type: 'space' });
}
function addToken(line, type, text) {
    line.push({
        text: text,
        type: type
    });
}
function cssFontToString(font) {
    var family, parts;
    parts = [];
    if (font.style) {
        parts.push(font.style);
    }
    if (font.weight) {
        parts.push(font.weight);
    }
    parts.push(font.size + 'px');
    family = font.family;
    parts.push(family);
    return parts.join(' ');
}
function getNodeName(node) {
    return node.nodeName.toLowerCase();
}
function parseCssFont(font, fontCache, fixFamily) {
    var _branch_, current, family, fontObj, next, part, size, style, tokens, weight;
    _branch_ = 'Find in cache';
    while (true) {
        switch (_branch_) {
        case 'Find in cache':
            if (font in fontCache) {
                return fontCache[font];
            } else {
                _branch_ = 'Lex';
            }
            break;
        case 'Lex':
            tokens = stringToTokensQuoted(font);
            style = '';
            weight = '';
            size = '';
            family = '';
            current = 0;
            _branch_ = 'Style';
            break;
        case 'Style':
            if (current < tokens.length) {
                part = tokens[current++];
                if (part === 'italic' || part === 'oblique') {
                    style = part;
                    _branch_ = 'Weight';
                } else {
                    if (part === 'bold') {
                        weight = part;
                        _branch_ = 'Size';
                    } else {
                        if (part === 'normal') {
                            _branch_ = 'Weight';
                        } else {
                            size = parsePxSize(part);
                            if (size === undefined) {
                                _branch_ = 'Size';
                            } else {
                                _branch_ = 'Family';
                            }
                        }
                    }
                }
            } else {
                throw Error('Empty "font" property');
            }
            break;
        case 'Weight':
            if (current < tokens.length) {
                part = tokens[current++];
                if (part === 'bold') {
                    weight = part;
                    _branch_ = 'Size';
                } else {
                    if (part === 'normal') {
                        _branch_ = 'Size';
                    } else {
                        size = parsePxSize(part);
                        if (size === undefined) {
                            throw Error('Expected px size in "font" property');
                        } else {
                            _branch_ = 'Family';
                        }
                    }
                }
            } else {
                throw Error('Unexpected end of "font" property');
            }
            break;
        case 'Size':
            if (current < tokens.length) {
                part = tokens[current++];
                size = parsePxSize(part);
                if (size === undefined) {
                    throw Error('Expected px size in "font" property');
                } else {
                    _branch_ = 'Family';
                }
            } else {
                throw Error('Unexpected end of "font" property');
            }
            break;
        case 'Family':
            if (current < tokens.length) {
                family = tokens[current++];
                _branch_ = 'Build font object';
            } else {
                throw Error('Unexpected end of "font" property');
            }
            break;
        case 'Build font object':
            while (true) {
                if (current < tokens.length) {
                    next = tokens[current++];
                    if (next[0] !== ',') {
                        family += ' ';
                    }
                    family += next;
                } else {
                    break;
                }
            }
            if (fixFamily) {
                family = enrichFamily(family);
            }
            fontObj = {
                style: style,
                weight: weight,
                size: size,
                family: family,
                font: ''
            };
            fontObj.font = cssFontToString(fontObj);
            fontCache[font] = fontObj;
            return fontObj;
        case 'Exit':
            _branch_ = undefined;
            break;
        default:
            return;
        }
    }
}
function processOrdered(nodes, lines) {
    var i, line, name, node;
    i = 1;
    for (node of nodes) {
        name = getNodeName(node);
        if (name === 'li') {
            line = {
                type: 'ul',
                tokens: [{ text: i + '. ' }]
            };
            lines.push(line);
            addNodeToLine(node, line.tokens, false, false);
            i++;
        }
    }
}
function processParagraph(node, lines) {
    var line;
    line = { tokens: [] };
    lines.push(line);
    addNodeToLine(node, line.tokens, false, false);
}
function processUnordered(nodes, lines) {
    var line, name, node;
    for (node of nodes) {
        name = getNodeName(node);
        if (name === 'li') {
            line = {
                type: 'ul',
                tokens: [{ text: '\u2022 ' }]
            };
            lines.push(line);
            addNodeToLine(node, line.tokens, false, false);
        }
    }
}
function setFontToTokens(lines, font, fontCache) {
    var fontObj, line;
    fontObj = parseCssFont(font, fontCache, true);
    for (line of lines) {
        line.tokens.forEach(function (token) {
            setFontToToken(token, fontObj);
        });
    }
}
function splitHtmlTextNode(text, type) {
    var buffer, ch, i, length, line, state, whitespace;
    text = text || '';
    whitespace = {};
    whitespace[' '] = true;
    whitespace['\t'] = true;
    whitespace['\r'] = true;
    whitespace['\n'] = true;
    whitespace[String.fromCharCode(133)] = true;
    whitespace[String.fromCharCode(160)] = true;
    whitespace[String.fromCharCode(11)] = true;
    whitespace[String.fromCharCode(12)] = true;
    state = 'idle';
    buffer = '';
    line = [];
    length = text.length;
    for (i = 0; i < length; i++) {
        ch = text[i];
        if (state === 'idle') {
            if (whitespace[ch]) {
                if (buffer) {
                    addToken(line, type, buffer);
                    buffer = '';
                }
                addSpaceToLine(line);
                state = 'space';
            } else {
                buffer += ch;
            }
        } else {
            if (!whitespace[ch]) {
                buffer += ch;
                state = 'idle';
            }
        }
    }
    if (buffer) {
        addToken(line, type, buffer);
    }
    return line;
}
function splitLineToTokens(line, type) {
    var result, start, token, tokens;
    tokens = splitByWhitespace(line);
    start = true;
    result = [];
    for (token of tokens) {
        if (start) {
            start = false;
        } else {
            result.push({ type: 'space' });
        }
        result.push({
            text: token,
            type: type
        });
    }
    return result;
}
function splitToTokens(text) {
    var lines, notEmtpyLines;
    text = text || '';
    lines = text.split('\n');
    notEmtpyLines = lines.map(function (line) {
        return line.trim();
    }).filter(function (line) {
        return line.length;
    });
    return notEmtpyLines.map(function (line) {
        return splitLineToTokens(line, '');
    });
}
function splitToTokensHtml(html) {
    var _collection_63, body, doc, firstNode, lines, name, node, parser;
    html = html || '';
    lines = [];
    parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
    body = doc.documentElement.childNodes[1];
    if (body.childNodes.length === 1) {
        firstNode = body.childNodes[0];
        name = getNodeName(firstNode);
        if (name === '#text') {
            lines = wrapInLineObjects(splitToTokens(firstNode.nodeValue));
            return lines;
        } else {
            _collection_63 = body.childNodes;
            for (node of _collection_63) {
                name = getNodeName(node);
                if (name === 'ul') {
                    processUnordered(node.childNodes, lines);
                } else {
                    if (name === 'ol') {
                        processOrdered(node.childNodes, lines);
                    } else {
                        if (!(name === 'script' || name === '#text')) {
                            processParagraph(node, lines);
                        }
                    }
                }
            }
            return lines;
        }
    } else {
        _collection_63 = body.childNodes;
        for (node of _collection_63) {
            name = getNodeName(node);
            if (name === 'ul') {
                processUnordered(node.childNodes, lines);
            } else {
                if (name === 'ol') {
                    processOrdered(node.childNodes, lines);
                } else {
                    if (!(name === 'script' || name === '#text')) {
                        processParagraph(node, lines);
                    }
                }
            }
        }
        return lines;
    }
}
function splitToTokensMarkdown(text) {
    var buffer, ch, i, length, lines, md, sb, state, whitespace;
    text = text || '';
    whitespace = {};
    whitespace[' '] = true;
    whitespace['\t'] = true;
    whitespace['\r'] = true;
    state = 'idle';
    buffer = '';
    lines = [];
    length = text.length;
    sb = SpanBuilder_create();
    md = MarkDown_create(sb);
    sb.run();
    md.run();
    for (i = 0; i < length; i++) {
        ch = text[i];
        if (ch === '_') {
            md.under();
        } else {
            if (ch === '\n') {
                md.line();
            } else {
                if (whitespace[ch]) {
                    md.white();
                } else {
                    md.next(ch);
                }
            }
        }
    }
    md.line();
    return sb.lines;
}
function wrapInLineObjects(lines) {
    var line, output;
    output = [];
    for (line of lines) {
        output.push({ tokens: line });
    }
    return output;
}
function addFontVariant(fonts, fontObj, prop, value) {
    var font2, fontObj2;
    fontObj2 = utils.clone(fontObj);
    fontObj2[prop] = value;
    font2 = cssFontToString(fontObj2);
    fonts[font2] = true;
}
function addHtmltoDom(html, parentElement, fonts, font, findLinks) {
    var _branch_, _collection_65, body, cache, doc, firstNode, font2, fontObj, fontObj2, formats, name, node, parser;
    _branch_ = 'Parse HTML';
    while (true) {
        switch (_branch_) {
        case 'Parse HTML':
            formats = {};
            html = html || '';
            parser = new DOMParser();
            doc = parser.parseFromString(html, 'text/html');
            body = doc.documentElement.childNodes[1];
            _branch_ = 'Plain text?';
            break;
        case 'Plain text?':
            if (body.childNodes.length === 1) {
                firstNode = body.childNodes[0];
                name = getNodeName(firstNode);
                if (name === '#text') {
                    splitToParagraphs(parentElement, firstNode.nodeValue);
                    _branch_ = 'Add to fonts';
                } else {
                    _branch_ = 'Scan DOM nodes';
                }
            } else {
                _branch_ = 'Scan DOM nodes';
            }
            break;
        case 'Scan DOM nodes':
            _collection_65 = body.childNodes;
            for (node of _collection_65) {
                addNodeToDom(node, parentElement, false, false, formats, findLinks);
            }
            _branch_ = 'Add to fonts';
            break;
        case 'Add to fonts':
            if (fonts) {
                cache = initFontCache();
                fontObj = parseCssFont(font, cache, true);
                if (formats.bold) {
                    addFontVariant(fonts, fontObj, 'weight', 'bold');
                }
                if (formats.italic) {
                    addFontVariant(fonts, fontObj, 'style', 'italic');
                }
                if (formats.both) {
                    fontObj2 = utils.clone(fontObj);
                    fontObj2.weight = 'bold';
                    fontObj2.style = 'italic';
                    font2 = cssFontToString(fontObj2);
                    fonts[font2] = true;
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
function addNodeToDom(node, parentElement, bold, italic, formats, findLinks) {
    var _collection_67, child, copy, name;
    name = getNodeName(node);
    if (name === '#text') {
        if (bold) {
            if (italic) {
                formats.both = true;
            } else {
                formats.bold = true;
            }
        } else {
            if (italic) {
                formats.italic = true;
            }
        }
        if (findLinks) {
            addTextWithLinksToDom(parentElement, node.nodeValue);
        } else {
            appendTextNode(parentElement, node.nodeValue);
        }
    } else {
        if (name !== 'script') {
            if (name === 'em') {
                italic = true;
            } else {
                if (name === 'strong') {
                    bold = true;
                }
            }
            copy = document.createElement(name);
            parentElement.appendChild(copy);
            _collection_67 = node.childNodes;
            for (child of _collection_67) {
                addNodeToDom(child, copy, bold, italic, formats, findLinks);
            }
        }
    }
}
function addTextWithLinksToDom(parentElement, text) {
    var buffer, link, part, parts;
    parts = splitByWhitespacePreserve(text);
    buffer = '';
    for (part of parts) {
        link = tryCreateLink(part);
        if (link) {
            if (buffer) {
                appendTextNode(parentElement, buffer);
                buffer = '';
            }
            parentElement.appendChild(link);
        } else {
            buffer += part;
        }
    }
    if (buffer) {
        appendTextNode(parentElement, buffer);
    }
}
function addTokenToLine(line, token) {
    if (!(line.tokens.length === 0 && token.type === 'space')) {
        line.right += token.width;
        line.tokens.push(token);
    }
}
function appendTextNode(parentElement, text) {
    var tnode;
    tnode = document.createTextNode(text);
    parentElement.appendChild(tnode);
}
function calcLineWidth(tokens) {
    return tokens.reduce(function (prev, token) {
        return token.width + prev;
    }, 0);
}
function createDummyCanvas(width, height, background) {
    var canvas, ctx;
    canvas = document.createElement('canvas');
    canvas.id = 'dummy-canvas';
    canvas.style.display = 'inline-block';
    canvas.style.position = 'fixed';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    document.documentElement.appendChild(canvas);
    ctx = canvas.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    return ctx;
}
function createLine(flowBlock, left, top, baseLineShift) {
    var baseLine, line;
    baseLine = top + baseLineShift;
    line = {
        top: top,
        bottom: top + flowBlock.lineHeight,
        tokens: [],
        left: left,
        baseLine: baseLine,
        right: left
    };
    flowBlock.lines.push(line);
    return line;
}
function createTextBlock(ctx, text, options, fonts) {
    var _collection_69, _selectValue_71, block, fontCache, fontObj, line, lines, size, token;
    if (options.singleLine) {
        line = splitLineToTokens(text, '');
        lines = wrapInLineObjects([line]);
    } else {
        _selectValue_71 = options.textFormat;
        if (_selectValue_71 === 'html') {
            lines = splitToTokensHtml(text);
        } else {
            if (_selectValue_71 === 'markdown') {
                lines = splitToTokensMarkdown(text);
            } else {
                lines = wrapInLineObjects(splitToTokens(text));
            }
        }
    }
    fontCache = initFontCache();
    setFontToTokens(lines, options.font, fontCache);
    fontObj = parseCssFont(options.font, fontCache, true);
    block = {
        width: 0,
        options: options,
        text: text,
        lineHeight: options.lineHeight * fontObj.size,
        fontSize: fontObj.size,
        lines: lines
    };
    for (line of lines) {
        _collection_69 = line.tokens;
        for (token of _collection_69) {
            ctx.font = token.font;
            if (token.font) {
                fonts[token.font] = true;
            }
            if (token.type === 'space') {
                size = ctx.measureText(' ');
            } else {
                size = ctx.measureText(token.text);
            }
            token.width = size.width;
        }
        block.width = Math.max(calcLineWidth(line.tokens), block.width);
    }
    block.width += options.paddingLeft + options.paddingRight;
    return block;
}
function drawLinkIcon(ctx, x, y) {
    var angle, aradius, m, radius, size, x0, x1, x2, x3, y0, y1, y2, y3;
    size = 24;
    radius = size / 2;
    angle = 3;
    x0 = x - radius;
    x1 = x0 + angle;
    x3 = x + radius;
    x2 = x3 - angle;
    y0 = y - radius;
    y1 = y0 + angle;
    y3 = y + radius;
    y2 = y3 - angle;
    ctx.beginPath();
    ctx.moveTo(x0, y1);
    ctx.lineTo(x1, y0);
    ctx.lineTo(x2, y0);
    ctx.lineTo(x3, y1);
    ctx.lineTo(x3, y2);
    ctx.lineTo(x2, y3);
    ctx.lineTo(x1, y3);
    ctx.lineTo(x0, y2);
    ctx.closePath();
    ctx.fillStyle = '#000090';
    ctx.fill();
    aradius = radius - 7;
    m = aradius * 1;
    x0 = x - aradius;
    x1 = x + aradius - m;
    x2 = x + aradius;
    y0 = y - aradius;
    y1 = y0 + m;
    y2 = y + aradius;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    line1(ctx, x0, y2, x2, y0);
    line2(ctx, x, y0, x2, y0, x2, y);
}
function enrichFamily(fontFamily) {
    if (fontFamily === 'Arimo') {
        return 'Arimo, Arial';
    } else {
        if (fontFamily === 'Tinos') {
            return 'Tinos, Times New Roman, Times';
        } else {
            return fontFamily;
        }
    }
}
function flowLine(inputLine, left, top, right, flowBlock) {
    var _collection_73, _selectValue_75, baseLineShift, line, margin, token;
    margin = (flowBlock.lineHeight - flowBlock.fontSize) / 2;
    baseLineShift = flowBlock.lineHeight - margin;
    line = createLine(flowBlock, left, top, baseLineShift);
    _selectValue_75 = inputLine.type;
    if ((_selectValue_75 === 'ul' || _selectValue_75 === 'ol') && inputLine.tokens.length !== 0) {
        left += inputLine.tokens[0].width;
    }
    _collection_73 = inputLine.tokens;
    for (token of _collection_73) {
        while (true) {
            if (line.right + token.width <= right || line.tokens.length === 0) {
                break;
            } else {
                line = createLine(flowBlock, left, line.bottom, baseLineShift);
            }
        }
        addTokenToLine(line, token);
    }
    return line.bottom;
}
function flowTextBlock(block, width) {
    var _branch_, _collection_77, _collection_81, _collection_83, _collection_85, _collection_87, _selectValue_79, actualWidth, diff, extraPadding, flowBlock, last, left, line, lineWidth, options, right, rightWMargin, size, top;
    _branch_ = 'Prepare';
    while (true) {
        switch (_branch_) {
        case 'Prepare':
            lineWidth = 0;
            options = block.options;
            flowBlock = {
                lines: [],
                text: block.text,
                options: options,
                lineHeight: block.lineHeight,
                fontSize: block.fontSize,
                width: width
            };
            top = options.paddingTop;
            left = options.paddingLeft;
            right = width - options.paddingRight;
            size = 24;
            if (block.options.link) {
                left += size * 1.5;
            }
            if (left >= right) {
                flowBlock.height = flowBlock.lineHeight + top + options.paddingBottom;
                _branch_ = 'Align';
            } else {
                _branch_ = 'Flow lines';
            }
            break;
        case 'Flow lines':
            rightWMargin = right;
            _collection_77 = block.lines;
            for (line of _collection_77) {
                top = flowLine(line, left, top, rightWMargin, flowBlock);
            }
            flowBlock.height = top + options.paddingBottom;
            _branch_ = 'Align';
            break;
        case 'Align':
            _collection_85 = flowBlock.lines;
            for (line of _collection_85) {
                if (line.tokens.length !== 0) {
                    last = line.tokens[line.tokens.length - 1];
                    if (last.type === 'space') {
                        line.tokens.pop();
                        line.right -= last.width;
                    }
                }
                line.width = line.right - line.left;
                lineWidth = Math.max(lineWidth, line.width);
            }
            _selectValue_79 = options.textAlign;
            if (_selectValue_79 === 'right') {
                _branch_ = 'Right';
            } else {
                if (_selectValue_79 === 'center') {
                    _branch_ = 'Center';
                } else {
                    _branch_ = 'Left';
                }
            }
            break;
        case 'Left':
            extraPadding = getExtraPadding(options, width, lineWidth);
            _collection_87 = flowBlock.lines;
            for (line of _collection_87) {
                line.left = line.left + extraPadding;
            }
            _branch_ = 'Exit';
            break;
        case 'Right':
            extraPadding = getExtraPadding(options, width, lineWidth);
            _collection_81 = flowBlock.lines;
            for (line of _collection_81) {
                line.left = right - line.width - extraPadding;
            }
            _branch_ = 'Exit';
            break;
        case 'Center':
            _collection_83 = flowBlock.lines;
            for (line of _collection_83) {
                diff = (right - left - line.width) / 2;
                line.left = left + diff;
            }
            _branch_ = 'Exit';
            break;
        case 'Exit':
            _branch_ = undefined;
            actualWidth = lineWidth + options.paddingLeft + options.paddingRight;
            flowBlock.width = Math.max(options.minWidth, actualWidth);
            return flowBlock;
        default:
            return;
        }
    }
}
function getExtraPadding(options, width, lineWidth) {
    if (options.link || !options.centerContent) {
        return 0;
    } else {
        return Math.round((width - lineWidth - options.paddingLeft - options.paddingRight) / 2);
    }
}
function initFontCache() {
    if (!unit.fontCache) {
        unit.fontCache = {};
    }
    return unit.fontCache;
}
function isUrl(text) {
    var url;
    if (text && (text.substring(0, 7) === 'http://' || text.substring(0, 8) === 'https://')) {
        try {
            url = new URL(text);
        } catch (_) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}
function isWhitespace(ch) {
    return /\s/.test(ch);
}
function line1(ctx, x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}
function line2(ctx, x0, y0, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function prepareTextRender(visuals, ctx, fontSize, top) {
    if (visuals.svg) {
        ctx.textBaseline = 'alphabetic';
        return top - Math.floor(fontSize * 0.3);
    } else {
        ctx.textBaseline = 'bottom';
        return top;
    }
}
function renderFlowBlock(visuals, flowBlock, left, top) {
    var _collection_89, ctx, iconSize, line, x, y;
    ctx = visuals.ctx;
    if (flowBlock.options.link) {
        iconSize = 24;
        y = top + flowBlock.height / 2;
        x = left + flowBlock.options.paddingLeft + iconSize / 2;
        drawLinkIcon(ctx, x, y);
    }
    ctx.fillStyle = flowBlock.options.color;
    top = prepareTextRender(visuals, ctx, flowBlock.fontSize, top);
    _collection_89 = flowBlock.lines;
    for (line of _collection_89) {
        renderFlowBlockLine(ctx, line, left, top);
    }
}
function renderFlowBlockLine(ctx, line, left, top) {
    var _collection_91, baseLine, token, x;
    baseLine = top + line.baseLine + 1;
    x = left + line.left;
    _collection_91 = line.tokens;
    for (token of _collection_91) {
        if (token.type !== 'space') {
            ctx.font = token.font;
            ctx.fillText(token.text, x, baseLine);
        }
        x += token.width;
    }
}
function splitByWhitespacePreserve(text) {
    var buffer, ch, i, result, state;
    result = [];
    if (text) {
        buffer = '';
        state = 'ws';
        for (i = 0; i < text.length; i++) {
            ch = text[i];
            if (state === 'ws') {
                if (isWhitespace(ch)) {
                    buffer += ch;
                } else {
                    if (buffer) {
                        result.push(buffer);
                    }
                    state = 'token';
                    buffer = ch;
                }
            } else {
                if (state !== 'token') {
                    throw new Error('Unexpected case value: ' + state);
                }
                if (isWhitespace(ch)) {
                    if (buffer) {
                        result.push(buffer);
                    }
                    state = 'ws';
                    buffer = ch;
                } else {
                    buffer += ch;
                }
            }
        }
    }
    if (buffer) {
        result.push(buffer);
    }
    return result;
}
function tryCreateLink(text) {
    var link;
    if (isUrl(text)) {
        link = document.createElement('a');
        link.href = text;
        appendTextNode(link, text);
        return link;
    } else {
        return undefined;
    }
}
function addToMultiDict(dict, key, value) {
    var sameType;
    sameType = getCreateList(dict, key);
    sameType.push(value);
}
function boxContains(big, small) {
    var bigBottom, bigRight, smallBottom, smallRight;
    if (big.left <= small.left && big.top <= small.top) {
        bigRight = big.left + big.width;
        smallRight = small.left + small.width;
        if (bigRight >= smallRight) {
            bigBottom = big.top + big.height;
            smallBottom = small.top + small.height;
            if (bigBottom >= smallBottom) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function boxForHorizontalLine(left, top, right, margin) {
    if (left <= right) {
        return createBoxWithMargin(left, top, right - left, 0, margin);
    } else {
        return createBoxWithMargin(right, top, left - right, 0, margin);
    }
}
function boxForVerticalLine(left, top, bottom, margin) {
    if (top <= bottom) {
        return createBoxWithMargin(left, top, 0, bottom - top, margin);
    } else {
        return createBoxWithMargin(left, bottom, 0, top - bottom, margin);
    }
}
function boxFromPoint(x, y, width, height) {
    return createBox(x - width, y - height, width * 2, height * 2);
}
function boxesIntersect(box1, box2) {
    var bottom1, bottom2, right1, right2;
    right1 = box1.left + box1.width;
    if (box2.left > right1) {
        return false;
    } else {
        bottom1 = box1.top + box1.height;
        if (box2.top > bottom1) {
            return false;
        } else {
            right2 = box2.left + box2.width;
            if (box1.left > right2) {
                return false;
            } else {
                bottom2 = box2.top + box2.height;
                if (box1.top > bottom2) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
}
function centerSquare(ctx, x, y, size, fill, border, lineWidth) {
    var left, top;
    left = x - size / 2;
    top = y - size / 2;
    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.fillRect(left, top, size, size);
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(left, top, size, size);
}
function copyFields(dst, src, fields) {
    var field;
    for (field of fields) {
        dst[field] = src[field];
    }
}
function copyFieldsOrDefault(dst, src, fields, defaultValue) {
    var field, value;
    for (field of fields) {
        value = src[field];
        if (!utils.hasValue(value)) {
            value = defaultValue;
        }
        dst[field] = value;
    }
}
function copyFieldsWithValue(dst, src, fields) {
    var field, value;
    for (field of fields) {
        value = src[field];
        if (utils.hasValue(value)) {
            dst[field] = value;
        }
    }
}
function copyNotNull(dst, src) {
    var key, value;
    for (key in src) {
        value = src[key];
        if (!(value === undefined || value === null)) {
            dst[key] = value;
        }
    }
}
function createBox(left, top, width, height) {
    var bottom, right;
    right = left + width;
    bottom = top + height;
    return {
        left: left,
        top: top,
        width: width,
        height: height,
        right: right,
        bottom: bottom,
        centerX: (left + right) / 2,
        centerY: (top + bottom) / 2
    };
}
function createBoxWithMargin(left, top, width, height, margin) {
    var margin2;
    margin2 = margin * 2;
    return createBox(left - margin, top - margin, width + margin2, height + margin2);
}
function distanceLineToPoint(line, x, y) {
    return (line.a * x + line.b * y + line.c) / line.div;
}
function div() {
    var args, properties;
    args = Array.prototype.slice.call(arguments);
    properties = {};
    return html.createElement('div', properties, args);
}
function findAngle(x1, y1, x2, y2) {
    var angle, cos, h, hyp, hypSq, v;
    h = x2 - x1;
    v = y2 - y1;
    hypSq = h * h + v * v;
    if (hypSq === 0) {
        return 0;
    } else {
        hyp = Math.sqrt(hypSq);
        cos = h / hyp;
        angle = Math.acos(cos);
        if (v >= 0) {
            return angle;
        } else {
            return -angle;
        }
    }
}
function getClipboard() {
    var content, type;
    content = localStorage.getItem('clipboard');
    if (content) {
        type = localStorage.getItem('clipboard-type');
        return {
            type: type,
            content: JSON.parse(content)
        };
    } else {
        return undefined;
    }
}
function getCreateList(dict, key) {
    var list;
    list = dict[key];
    if (!list) {
        list = [];
        dict[key] = list;
    }
    return list;
}
function hitBox(box, x, y) {
    if (x >= box.left && y >= box.top && x <= box.left + box.width && y <= box.top + box.height) {
        return true;
    } else {
        return false;
    }
}
function incrementDictionaryValue(dict, prop) {
    if (prop in dict) {
        dict[prop]++;
    } else {
        dict[prop] = 1;
    }
}
function lineFrom2Points(x1, y1, x2, y2) {
    var a, b, c, div;
    a = y1 - y2;
    b = x2 - x1;
    c = x1 * y2 - x2 * y1;
    div = Math.sqrt(a * a + b * b);
    return {
        a: a,
        b: b,
        c: c,
        div: div
    };
}
function registerEvent(element, eventName, action) {
    tracing.registerEvent(element, eventName, action);
}
function removeFromMultiDict(dict, key, value) {
    var sameType;
    sameType = getCreateList(dict, key);
    utils.remove(sameType, value);
}
function setClipboard(type, obj) {
    var content;
    content = JSON.stringify(obj);
    localStorage.setItem('clipboard-type', type);
    localStorage.setItem('clipboard', content);
}
function setCursor(element, cursor) {
    element.style.cursor = cursor;
}
function setNotNull(src, dst, name) {
    if (name in src) {
        dst[name] = src[name];
    }
}
function setTimeout(action, delay, notrace) {
    return tracing.setTimeout(action, delay, notrace);
}
function setc(property, defaultValue, dst, src) {
    if (property in src) {
        dst[property] = src[property];
    } else {
        dst[property] = defaultValue;
    }
}
function stopMachine(obj, property) {
    var machine;
    machine = obj[property];
    if (machine) {
        machine.state = undefined;
        obj[property] = undefined;
    }
}
function getSourceGuideBox(element) {
    if (element.type === 'line') {
        return calculateLineBox(element, 0);
    } else {
        return createBox(element.left, element.top, element.width, element.height);
    }
}
function completeSimpleDrag2Prop(handle, prop1, prop2) {
    var change;
    change = {
        id: handle.element.id,
        fields: {},
        op: 'update'
    };
    change.fields[prop1] = handle.element[prop1];
    change.fields[prop2] = handle.element[prop2];
    updateAndKeepSelection(handle.widget, [change]);
}
function completeDrakonResize(handle) {
    var maxWidth, style;
    maxWidth = handle.element.w;
    style = { maxWidth: maxWidth * 2 };
    handle.widget.patchDiagramStyle(style);
}
function LeftDrakonResizeHandle() {
    var self = { _type: 'LeftDrakonResizeHandle' };
    function LeftDrakonResizeHandle_complete() {
        completeDrakonResize(self);
    }
    function LeftDrakonResizeHandle_dragTo(x, y) {
        self.element.w = self.element.x - x;
    }
    function LeftDrakonResizeHandle_getCursor() {
        return 'ew-resize';
    }
    function LeftDrakonResizeHandle_getMaxX() {
        return self.maxX;
    }
    function LeftDrakonResizeHandle_getMinX() {
        return self.minX;
    }
    function LeftDrakonResizeHandle_xEnabled() {
        return true;
    }
    function LeftDrakonResizeHandle_yEnabled() {
        return false;
    }
    self.complete = LeftDrakonResizeHandle_complete;
    self.dragTo = LeftDrakonResizeHandle_dragTo;
    self.getCursor = LeftDrakonResizeHandle_getCursor;
    self.getMaxX = LeftDrakonResizeHandle_getMaxX;
    self.getMinX = LeftDrakonResizeHandle_getMinX;
    self.xEnabled = LeftDrakonResizeHandle_xEnabled;
    self.yEnabled = LeftDrakonResizeHandle_yEnabled;
    return self;
}
function RightDrakonResizeHandle() {
    var self = { _type: 'RightDrakonResizeHandle' };
    function RightDrakonResizeHandle_complete() {
        completeDrakonResize(self);
    }
    function RightDrakonResizeHandle_dragTo(x, y) {
        self.element.w = x - self.element.x;
    }
    function RightDrakonResizeHandle_getCursor() {
        return 'ew-resize';
    }
    function RightDrakonResizeHandle_getMaxX() {
        return self.maxX;
    }
    function RightDrakonResizeHandle_getMinX() {
        return self.minX;
    }
    function RightDrakonResizeHandle_xEnabled() {
        return true;
    }
    function RightDrakonResizeHandle_yEnabled() {
        return false;
    }
    self.complete = RightDrakonResizeHandle_complete;
    self.dragTo = RightDrakonResizeHandle_dragTo;
    self.getCursor = RightDrakonResizeHandle_getCursor;
    self.getMaxX = RightDrakonResizeHandle_getMaxX;
    self.getMinX = RightDrakonResizeHandle_getMinX;
    self.xEnabled = RightDrakonResizeHandle_xEnabled;
    self.yEnabled = RightDrakonResizeHandle_yEnabled;
    return self;
}
function createLeftDrakonResizeHandle(widget, node, y, ctx) {
    var big, config, handle;
    big = 500;
    config = widget.visuals.config;
    handle = LeftDrakonResizeHandle();
    handle.widget = widget;
    handle.element = node;
    handle.side = 'left';
    handle.x = node.x - node.w;
    handle.y = y;
    handle.id = node.id;
    handle.minX = node.x - big;
    handle.maxX = node.x - config.minWidth / 2;
    handle.primId = 'left-drakon-' + node.id + '-' + y;
    createHandle(widget.visuals, handle, ctx);
}
function createRightDrakonResizeHandle(widget, node, y, ctx) {
    var big, config, handle;
    big = 500;
    config = widget.visuals.config;
    handle = RightDrakonResizeHandle();
    handle.widget = widget;
    handle.element = node;
    handle.side = 'right';
    handle.x = node.x + node.w;
    handle.y = y;
    handle.id = node.id;
    handle.minX = node.x + config.minWidth / 2;
    handle.maxX = node.x + big;
    handle.primId = 'right-drakon-' + node.id + '-' + y;
    createHandle(widget.visuals, handle, ctx);
}
function GroupBottomHandle() {
    var self = { _type: 'GroupBottomHandle' };
    function GroupBottomHandle_complete() {
        completeSimpleDrag2Prop(self, 'loX', 'loY');
    }
    function GroupBottomHandle_dragTo(x, y) {
        self.element.loX = x - self.element.x;
        self.element.loY = y - self.element.y;
    }
    function GroupBottomHandle_getCursor() {
        return 'move';
    }
    function GroupBottomHandle_getMaxX() {
        return self.maxX;
    }
    function GroupBottomHandle_getMaxY() {
        return self.maxY;
    }
    function GroupBottomHandle_getMinX() {
        return self.minX;
    }
    function GroupBottomHandle_getMinY() {
        return self.minY;
    }
    function GroupBottomHandle_xEnabled() {
        return true;
    }
    function GroupBottomHandle_yEnabled() {
        return true;
    }
    self.complete = GroupBottomHandle_complete;
    self.dragTo = GroupBottomHandle_dragTo;
    self.getCursor = GroupBottomHandle_getCursor;
    self.getMaxX = GroupBottomHandle_getMaxX;
    self.getMaxY = GroupBottomHandle_getMaxY;
    self.getMinX = GroupBottomHandle_getMinX;
    self.getMinY = GroupBottomHandle_getMinY;
    self.xEnabled = GroupBottomHandle_xEnabled;
    self.yEnabled = GroupBottomHandle_yEnabled;
    return self;
}
function GroupTopHandle() {
    var self = { _type: 'GroupTopHandle' };
    function GroupTopHandle_complete() {
        completeSimpleDrag2Prop(self, 'hiX', 'hiY');
    }
    function GroupTopHandle_dragTo(x, y) {
        self.element.hiX = x - self.element.x;
        self.element.hiY = y - self.element.y;
    }
    function GroupTopHandle_getCursor() {
        return 'move';
    }
    function GroupTopHandle_getMaxX() {
        return self.maxX;
    }
    function GroupTopHandle_getMaxY() {
        return self.maxY;
    }
    function GroupTopHandle_getMinX() {
        return self.minX;
    }
    function GroupTopHandle_getMinY() {
        return self.minY;
    }
    function GroupTopHandle_xEnabled() {
        return true;
    }
    function GroupTopHandle_yEnabled() {
        return true;
    }
    self.complete = GroupTopHandle_complete;
    self.dragTo = GroupTopHandle_dragTo;
    self.getCursor = GroupTopHandle_getCursor;
    self.getMaxX = GroupTopHandle_getMaxX;
    self.getMaxY = GroupTopHandle_getMaxY;
    self.getMinX = GroupTopHandle_getMinX;
    self.getMinY = GroupTopHandle_getMinY;
    self.xEnabled = GroupTopHandle_xEnabled;
    self.yEnabled = GroupTopHandle_yEnabled;
    return self;
}
function clearMouseHover(widget) {
    widget.visuals.mouseX = undefined;
    widget.visuals.mouseY = undefined;
}
function getHoverPos(widget) {
    var clientX, clientY, rect;
    if (widget.visuals.mouseX && widget.visuals.mouseY) {
        rect = widget.scrollableContainer.getBoundingClientRect();
        clientX = widget.visuals.mouseX - rect.left;
        clientY = widget.visuals.mouseY - rect.top;
    } else {
        clientX = widget.width / 2;
        clientY = widget.height / 2;
    }
    return {
        x: clientX,
        y: clientY
    };
}
function trackMouseHover(widget, evt) {
    widget.visuals.mouseX = evt.clientX;
    widget.visuals.mouseY = evt.clientY;
}
function NoSelectBehavior(widget) {
    var _obj_;
    _obj_ = NoSelectBehavior_create(widget);
    return _obj_.run();
}
function buildMouseEvent(clientX, clientY, button, target) {
    return {
        source: 'touch',
        clientX: clientX,
        clientY: clientY,
        target: target,
        button: button
    };
}
function makeMouseEventFromTouch(evt, index) {
    var x, y;
    x = evt.touches[index].clientX;
    y = evt.touches[index].clientY;
    return buildMouseEvent(x, y, 0, evt.target);
}
function wantedMove(x1, y1, x2, y2) {
    var maxDelta;
    maxDelta = 4;
    if (Math.abs(x1 - x2) > maxDelta || Math.abs(y1 - y2) > maxDelta) {
        return true;
    } else {
        return false;
    }
}
function HScrollDrag() {
    var self = { _type: 'HScrollDrag' };
    function HScrollDrag_complete() {
    }
    function HScrollDrag_onDrag(evt) {
        var deltaX, deltaY, x, y, zoom;
        deltaX = (self.startX - evt.clientX) * self.barToBox;
        deltaY = 0;
        zoom = self.widget.zoomFactor;
        x = self.startScrollX - deltaX / zoom;
        y = self.startScrollY - deltaY / zoom;
        setScrollFromMouseEvent(self.widget, x, y);
    }
    self.complete = HScrollDrag_complete;
    self.onDrag = HScrollDrag_onDrag;
    return self;
}
function VScrollDrag() {
    var self = { _type: 'VScrollDrag' };
    function VScrollDrag_complete() {
    }
    function VScrollDrag_onDrag(evt) {
        var deltaX, deltaY, x, y, zoom;
        deltaX = 0;
        deltaY = (self.startY - evt.clientY) * self.barToBox;
        zoom = self.widget.zoomFactor;
        x = self.startScrollX - deltaX / zoom;
        y = self.startScrollY - deltaY / zoom;
        setScrollFromMouseEvent(self.widget, x, y);
    }
    self.complete = VScrollDrag_complete;
    self.onDrag = VScrollDrag_onDrag;
    return self;
}
function createHScrollDrag(widget, evt, scroll) {
    var obj;
    obj = HScrollDrag();
    obj.barToBox = scroll.barToBox;
    obj.widget = widget;
    obj.startX = evt.clientX;
    obj.startY = evt.clientY;
    obj.startScrollX = widget.visuals.scrollX;
    obj.startScrollY = widget.visuals.scrollY;
    return obj;
}
function createMouseScroll(widget, evt) {
    return {
        startX: evt.clientX,
        startY: evt.clientY,
        startScrollX: widget.visuals.scrollX,
        startScrollY: widget.visuals.scrollY
    };
}
function createVScrollDrag(widget, evt, scroll) {
    var obj;
    obj = VScrollDrag();
    obj.barToBox = scroll.barToBox;
    obj.widget = widget;
    obj.startX = evt.clientX;
    obj.startY = evt.clientY;
    obj.startScrollX = widget.visuals.scrollX;
    obj.startScrollY = widget.visuals.scrollY;
    return obj;
}
function findValueAbove(array, value) {
    var current;
    for (current of array) {
        if (current > value) {
            return current;
        }
    }
    return value;
}
function findValueBelow(array, value) {
    var current, i;
    for (i = array.length - 1; i >= 0; i--) {
        current = array[i];
        if (current < value) {
            return current;
        }
    }
    return value;
}
function onMouseScroll(scroller, widget, evt) {
    var deltaX, deltaY, x, y, zoom;
    deltaX = evt.clientX - scroller.startX;
    deltaY = evt.clientY - scroller.startY;
    zoom = widget.zoomFactor;
    x = scroller.startScrollX - deltaX / zoom;
    y = scroller.startScrollY - deltaY / zoom;
    setScrollFromMouseEvent(widget, x, y);
}
function onMouseWheel(widget, evt) {
    var delta, levels, visuals, x, y, zoom;
    evt.preventDefault();
    zoom = widget.zoomFactor;
    visuals = widget.visuals;
    if (evt.ctrlKey) {
        levels = [
            3300,
            5000,
            6700,
            7500,
            9000,
            10000,
            11000,
            12000,
            15000,
            20000,
            25000,
            30000
        ];
        delta = evt.deltaY;
        if (delta > 0) {
            zoom = findValueBelow(levels, widget.zoom);
        } else {
            zoom = findValueAbove(levels, widget.zoom);
        }
        widget.setZoom(zoom);
        visuals.config.onZoomChanged(zoom);
    } else {
        delta = evt.deltaY / 2;
        if (evt.shiftKey) {
            x = visuals.scrollX + delta / zoom;
            setScrollFromMouseEvent(widget, x, visuals.scrollY);
        } else {
            y = visuals.scrollY + delta / zoom;
            setScrollFromMouseEvent(widget, visuals.scrollX, y);
        }
    }
}
function SelectBehavior(widget) {
    var _obj_;
    _obj_ = SelectBehavior_create(widget);
    return _obj_.run();
}
function createZoomer(widget, startX1, startY1, startX2, startY2) {
    var cx, cy, kx, ky, startDist;
    cx = Math.round((startX1 + startX2) / 2);
    cy = Math.round((startY1 + startY2) / 2);
    kx = startX2 - startX1;
    ky = startY2 - startY1;
    startDist = Math.sqrt(kx * kx + ky * ky);
    return {
        cx: cx,
        cy: cy,
        startDist: startDist,
        startZoom: widget.zoom
    };
}
function isZoom(startX1, startY1, startX2, startY2, evt) {
    var cx1, cx2, cy1, cy2, dDist, delta, dist1, dist2, dx1, dx2, dy1, dy2, minDelta, x1, x2, y1, y2;
    minDelta = 3;
    if (evt.touches.length < 2) {
        return undefined;
    } else {
        x1 = evt.touches[0].clientX;
        y1 = evt.touches[0].clientY;
        x2 = evt.touches[1].clientX;
        y2 = evt.touches[1].clientY;
        dx1 = x1 - startX1;
        dx2 = x2 - startX2;
        dy1 = y1 - startY1;
        dy2 = y2 - startY2;
        delta = 0;
        delta = Math.max(delta, Math.abs(startX1 - x1));
        delta = Math.max(delta, Math.abs(startX2 - x2));
        delta = Math.max(delta, Math.abs(startY1 - y1));
        delta = Math.max(delta, Math.abs(startY2 - y2));
        cx1 = startX2 - startX1;
        cy1 = startY2 - startY1;
        cx2 = x2 - x1;
        cy2 = y2 - y1;
        dist1 = Math.sqrt(cx1 * cx1 + cy1 * cy1);
        dist2 = Math.sqrt(cx2 * cx2 + cy2 * cy2);
        dDist = Math.abs(dist2 - dist1);
        if (delta > dDist && delta > minDelta) {
            return 'scroll';
        } else {
            if (dDist > delta && dDist > minDelta) {
                return 'zoom';
            } else {
                return undefined;
            }
        }
    }
}
function onTouchZoom(zoomer, widget, evt) {
    var dist, kx, ky, startX1, startX2, startY1, startY2, zoom;
    if (!(evt.touches.length < 2)) {
        startX1 = evt.touches[0].clientX;
        startY1 = evt.touches[0].clientY;
        startX2 = evt.touches[1].clientX;
        startY2 = evt.touches[1].clientY;
        kx = startX2 - startX1;
        ky = startY2 - startY1;
        dist = Math.sqrt(kx * kx + ky * ky);
        zoom = Math.round(dist / zoomer.startDist * zoomer.startZoom);
        widget.visuals.mouseX = zoomer.cx;
        widget.visuals.mouseY = zoomer.cy;
        widget.setZoom(zoom);
        widget.visuals.config.onZoomChanged(zoom);
    }
}
function onTouchZoomEnd(widget) {
    widget.visuals.config.onZoomChanged(widget.zoom);
}
function TouchBehavior(widget) {
    var _obj_;
    _obj_ = TouchBehavior_create(widget);
    return _obj_.run();
}
function chooseDragTarget(widget, evt) {
    var ear, element, handle, mover, pos, scroll, selected, visuals;
    visuals = widget.visuals;
    pos = toDiagram(widget, evt);
    scroll = hitScrollBar(visuals, pos);
    if (scroll) {
        if (scroll.elType === 'hscroll') {
            return createHScrollDrag(widget, evt, scroll);
        } else {
            return createVScrollDrag(widget, evt, scroll);
        }
    } else {
        if (isReadonly(widget)) {
            return createFrameDrag(widget, evt);
        } else {
            ear = hitEars(widget.visuals, pos);
            if (ear) {
                visuals.ears.start(ear, evt);
                return visuals.ears;
            } else {
                handle = findHandle(visuals, pos);
                if (handle) {
                    mover = createHandleDrag(widget, handle, evt);
                    visuals.ears = undefined;
                    return mover;
                } else {
                    if (hitNugget(visuals, pos)) {
                        selected = getSelectedFree(widget);
                        mover = createFreeMover(widget, selected, evt);
                        visuals.ears = undefined;
                        return mover;
                    } else {
                        element = findFree(widget, pos);
                        if (element && element.type !== 'connection') {
                            if (isSelected(widget, element.id)) {
                                selected = getSelectedFree(widget);
                                mover = createFreeMover(widget, selected, evt);
                            } else {
                                mover = createFreeMover(widget, [element], evt);
                            }
                            visuals.ears = undefined;
                            return mover;
                        } else {
                            return createFrameDrag(widget, evt);
                        }
                    }
                }
            }
        }
    }
}
function FrameDrag() {
    var self = { _type: 'FrameDrag' };
    function FrameDrag_complete() {
        self.widget.visuals.selectionFrame = undefined;
        paint(self.widget);
    }
    function FrameDrag_onDrag(evt) {
        updateSelectionFrame(self.widget, self.startX, self.startY, evt);
        blockSelect(self.widget);
        paintLater(self.widget);
    }
    self.complete = FrameDrag_complete;
    self.onDrag = FrameDrag_onDrag;
    return self;
}
function FreeMover() {
    var self = { _type: 'FreeMover' };
    function FreeMover_complete() {
        var _collection_145, change, changes, coord;
        changes = [];
        _collection_145 = self.coords;
        for (coord of _collection_145) {
            change = {
                id: coord.element.id,
                fields: {},
                op: 'update'
            };
            if (coord.xy) {
                change.fields.x = coord.element.x;
                change.fields.y = coord.element.y;
            } else {
                change.fields.left = coord.element.left;
                change.fields.top = coord.element.top;
            }
            changes.push(change);
        }
        updateAndKeepSelection(self.widget, changes);
    }
    function FreeMover_onDrag(evt) {
        var _branch_, _collection_147, config, coord, dx, dxDia, dy, dyDia, ebox, element, visuals, x, y, zoom;
        _branch_ = 'Calculate move';
        while (true) {
            switch (_branch_) {
            case 'Calculate move':
                config = self.widget.config;
                visuals = self.widget.visuals;
                zoom = self.widget.zoomFactor;
                dxDia = (evt.clientX - self.startX) / zoom;
                dyDia = (evt.clientY - self.startY) / zoom;
                dx = snapUp(config, dxDia);
                dy = snapUp(config, dyDia);
                if (dx === self.dx && dy === self.dy) {
                    _branch_ = 'Exit';
                } else {
                    self.dx = dx;
                    self.dy = dy;
                    _branch_ = 'Move elements';
                }
                break;
            case 'Move elements':
                _collection_147 = self.coords;
                for (coord of _collection_147) {
                    x = coord.elementX + dx;
                    y = coord.elementY + dy;
                    if (coord.xy) {
                        coord.element.x = x;
                        coord.element.y = y;
                    } else {
                        coord.element.left = x;
                        coord.element.top = y;
                    }
                }
                _branch_ = 'Find horizontal guides';
                break;
            case 'Find horizontal guides':
                if (self.coords.length === 1) {
                    element = self.coords[0].element;
                    if (canGuide(self.widget, element)) {
                        ebox = getSourceGuideBox(element);
                        findHorizontalGuide(self.widget, element.id, ebox, ebox.top);
                        findHorizontalCentralGuide(self.widget, element.id, ebox, ebox.centerY);
                        findHorizontalGuide(self.widget, element.id, ebox, ebox.bottom);
                        _branch_ = 'Find vertical guides';
                    } else {
                        _branch_ = 'Paint';
                    }
                } else {
                    _branch_ = 'Paint';
                }
                break;
            case 'Find vertical guides':
                findVerticalGuide(self.widget, element.id, ebox, ebox.left);
                findVerticalCentralGuide(self.widget, element.id, ebox, ebox.centerX);
                findVerticalGuide(self.widget, element.id, ebox, ebox.right);
                _branch_ = 'Paint';
                break;
            case 'Paint':
                paintLater(self.widget);
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
    self.complete = FreeMover_complete;
    self.onDrag = FreeMover_onDrag;
    return self;
}
function HandleDrag() {
    var self = { _type: 'HandleDrag' };
    function HandleDrag_complete() {
        self.handle.complete();
    }
    function HandleDrag_onDrag(evt) {
        var config, dx, dxDia, dy, dyDia, max, min, x, y, zoom;
        config = self.widget.config;
        zoom = self.widget.zoomFactor;
        if (self.handle.xEnabled()) {
            dxDia = (evt.clientX - self.startX) / zoom;
            dx = snapUp(config, dxDia);
            x = self.handleStartX + dx;
            max = self.handle.getMaxX();
            min = self.handle.getMinX();
            x = Math.min(max, Math.max(min, x));
        } else {
            x = self.handle.x;
        }
        if (self.handle.yEnabled()) {
            dyDia = (evt.clientY - self.startY) / zoom;
            dy = snapUp(config, dyDia);
            y = self.handleStartY + dy;
            max = self.handle.getMaxY();
            min = self.handle.getMinY();
            y = Math.min(max, Math.max(min, y));
        } else {
            y = self.handle.y;
        }
        if (!(x === self.handle.x && y === self.handle.y)) {
            self.handle.x = x;
            self.handle.y = y;
            self.handle.dragTo(x, y);
            paintLater(self.widget);
        }
    }
    self.complete = HandleDrag_complete;
    self.onDrag = HandleDrag_onDrag;
    return self;
}
function createFrameDrag(widget, evt) {
    var obj;
    obj = FrameDrag();
    obj.widget = widget;
    obj.startX = evt.clientX;
    obj.startY = evt.clientY;
    return obj;
}
function createFreeMover(widget, elements, evt) {
    var coord, element, obj;
    obj = FreeMover();
    obj.widget = widget;
    obj.startX = evt.clientX;
    obj.startY = evt.clientY;
    obj.coords = [];
    obj.dx = 0;
    obj.dy = 0;
    for (element of elements) {
        if (element.type === 'group-duration') {
            coord = {
                element: element,
                elementX: element.x,
                elementY: element.y,
                xy: true
            };
        } else {
            coord = {
                element: element,
                elementX: element.left,
                elementY: element.top,
                xy: false
            };
        }
        obj.coords.push(coord);
    }
    return obj;
}
function createHandleDrag(widget, handle, evt) {
    var obj;
    obj = HandleDrag();
    obj.widget = widget;
    obj.startX = evt.clientX;
    obj.startY = evt.clientY;
    obj.handle = handle;
    obj.handleStartX = handle.x;
    obj.handleStartY = handle.y;
    return obj;
}
function addSimpleInsert(widget, type) {
    widget.insertActions[type] = function (widget, socket, images) {
        return simpleInsert(widget, socket, type, images);
    };
}
function branchInsert(widget, socket) {
    var branchId;
    branchId = getSocketBranchId(socket);
    return branchInsertAt(widget, branchId);
}
function branchInsertAt(widget, branchId) {
    var edits, fields, model, name, newId, oldTargets, targetId, visuals;
    model = widget.model;
    visuals = widget.visuals;
    edits = moveBranchIdsRight(visuals, branchId);
    targetId = getBranchItemId(visuals, branchId);
    name = nextBranchName(visuals);
    fields = {
        type: 'branch',
        branchId: branchId,
        content: name,
        one: targetId
    };
    newId = createItem(model, edits, fields);
    oldTargets = {};
    oldTargets[targetId] = true;
    redirectBranch(visuals, model.items, oldTargets, newId, edits);
    return edits;
}
function branchInsertEnd(widget) {
    var branchId, edits, endId, fields, name, visuals;
    edits = [];
    visuals = widget.visuals;
    endId = createItem(widget.model, edits, { type: 'end' });
    branchId = visuals.branches.length + 1;
    name = visuals.config.exit;
    fields = {
        type: 'branch',
        branchId: branchId,
        content: name,
        one: endId
    };
    createItem(widget.model, edits, fields);
    return doEdit(widget, edits);
}
function caseInsert(widget, socket) {
    var existing;
    existing = socket.node;
    return caseInsertCore(widget, existing, undefined);
}
function caseInsertCore(widget, existing, item) {
    var caseId, edits, fields, model, right, targetId;
    edits = [];
    model = widget.model;
    targetId = existing.next[0].itemId;
    item = item || {};
    fields = utils.clone(item);
    fields.one = targetId;
    fields.type = 'case';
    if (existing.next.length === 2) {
        right = existing.next[1];
        fields.two = right.itemId;
    }
    caseId = createItem(model, edits, fields);
    updateItem(edits, existing.itemId, { two: caseId });
    return edits;
}
function checkNotReadonly(widget) {
    if (isReadonly(widget)) {
        throw new Error('Cannot modify a read-only diagram');
    }
}
function clickArrowSocket(widget, socket) {
    var edits, item, newId;
    edits = [];
    item = {
        type: 'arrow-loop',
        one: socket.target
    };
    newId = createItem(widget.model, edits, item);
    redirectUpperItems(edits, socket.links, newId);
    redirectUpperItems(edits, socket.edge.links, newId);
    return edits;
}
function createInsert(item) {
    var fields, id;
    id = item.id;
    fields = utils.clone(item);
    delete fields.id;
    return {
        id: id,
        op: 'insert',
        fields: fields
    };
}
function createItem(model, edits, item) {
    var edit;
    item.id = getNextStorageId(model);
    edit = createInsert(item);
    edits.push(edit);
    return item.id;
}
function createUpdate(id, fields) {
    return {
        id: id,
        op: 'update',
        fields: fields || {}
    };
}
function deleteItem(visuals, edits, node) {
    deleteItemCore(edits, node.id);
    if (node.side) {
        deleteItemCore(edits, node.side);
    }
    decrementImageRefCount(visuals, node.image);
}
function deleteItemCore(edits, itemId) {
    var edit;
    edit = {
        id: itemId,
        op: 'delete'
    };
    edits.push(edit);
}
function doEdit(widget, edits) {
    var after, before, changesToSave, fonts;
    tracing.trace('DrakonCanvas.doEdit', stripEdits(edits));
    deleteOrphanImages(widget, edits);
    before = utils.deepClone(widget.selection);
    after = buildSelectionFromEdits(widget, edits);
    changesToSave = widget.edit.updateDocument(edits, before, after);
    widget.selection = utils.deepClone(after);
    fonts = widget.redraw();
    widget.edit.save(changesToSave);
    reportSelection(widget);
    return fonts;
}
function doEditNoRender(widget, edits) {
    var after, before, changesToSave;
    tracing.trace('DrakonCanvas.doEditNoRender', stripEdits(edits));
    before = utils.deepClone(widget.selection);
    after = utils.deepClone(widget.selection);
    changesToSave = widget.edit.updateDocument(edits, before, after);
    widget.edit.save(changesToSave);
}
function drakonImageInsert(widget, socket, images) {
    var edits, imageData, item, model, newId, tempId;
    model = widget.model;
    imageData = socket.imageData;
    edits = [];
    item = {
        type: 'drakon-image',
        content: '',
        one: socket.target
    };
    if (imageData.id) {
        item.image = imageData.id;
    } else {
        tempId = 'temp-image-id';
        images[tempId] = { content: imageData.content };
        item.image = tempId;
    }
    newId = createItem(model, edits, item);
    redirectUpperItems(edits, socket.links, newId);
    return edits;
}
function durationInsert(widget, socket) {
    var edits, item, model, newId;
    model = widget.model;
    edits = [];
    item = {
        type: 'duration',
        content: ''
    };
    newId = createItem(model, edits, item);
    updateItem(edits, socket.node.id, { side: newId });
    return edits;
}
function firstCaseInsert(widget, socket) {
    var existing;
    existing = socket.node;
    return firstCaseInsertCore(widget, existing, undefined);
}
function firstCaseInsertCore(widget, existing, item) {
    var caseId, edits, fields, model, targetId;
    edits = [];
    model = widget.model;
    targetId = existing.next[0].itemId;
    item = item || {};
    fields = utils.clone(item);
    fields.one = targetId;
    fields.type = 'case';
    fields.two = existing.itemId;
    caseId = createItem(model, edits, fields);
    updateItem(edits, existing.select.itemId, { one: caseId });
    return edits;
}
function firstDigit(text) {
    var c, i, last;
    last = text.length - 1;
    for (i = last; i >= 0; i--) {
        c = text.charCodeAt(i);
        if (!isDigit(c)) {
            if (i === last) {
                return -1;
            } else {
                return i + 1;
            }
        }
    }
    return 0;
}
function firstParInsert(widget, socket) {
    var edits, endparId, item, model, newId;
    model = widget.model;
    edits = [];
    endparId = getParTarget(socket.node);
    item = {
        type: 'parbegin',
        one: endparId,
        two: socket.node.itemId
    };
    newId = createItem(model, edits, item);
    redirectUpperItems(edits, socket.links, newId);
    return edits;
}
function foreachInsert(widget, socket) {
    var beginId, edits, endId, model;
    edits = [];
    model = widget.model;
    endId = createItem(model, edits, {
        type: 'loopend',
        one: socket.target
    });
    beginId = createItem(model, edits, {
        type: 'loopbegin',
        one: endId
    });
    redirectUpperItems(edits, socket.links, beginId);
    return edits;
}
function getBranchById(visuals, branchId) {
    var _collection_149, branch, itemId;
    _collection_149 = visuals.branches;
    for (itemId of _collection_149) {
        branch = getNode(visuals, itemId);
        if (branch.branchId === branchId) {
            return branch;
        }
    }
    return undefined;
}
function getBranchItemId(visuals, branchId) {
    var rightBranch;
    rightBranch = getBranchById(visuals, branchId);
    if (rightBranch) {
        return rightBranch.itemId;
    } else {
        return visuals.branches[0];
    }
}
function getFreePosition(element) {
    if (element.type === 'group-duration') {
        return {
            x: element.x,
            y: element.y
        };
    } else {
        return {
            x: element.left,
            y: element.top
        };
    }
}
function getNextStorageId(model) {
    var id;
    id = model.nextId.toString();
    model.nextId++;
    return id;
}
function getNumberPart(text) {
    var first, tail;
    text = text || '';
    first = firstDigit(text);
    if (first === -1) {
        return 0;
    } else {
        tail = text.substring(first, text.length);
        return parseInt(tail);
    }
}
function getSocketBranchId(socket) {
    var branchId;
    if (socket.left) {
        branchId = socket.node.branchId;
    } else {
        branchId = socket.node.branchId + 1;
    }
    return branchId;
}
function increaseMargin(widget, id) {
    var change, margin, node;
    checkNotReadonly(widget);
    node = getNode(widget.visuals, id);
    margin = getBranchMargin(node);
    change = {
        id: id,
        fields: { margin: margin + 1 },
        op: 'update'
    };
    updateAndKeepSelection(widget, [change]);
}
function initInsertFunctions(widget) {
    widget.insertActions = {};
    addSimpleInsert(widget, 'action');
    addSimpleInsert(widget, 'insertion');
    addSimpleInsert(widget, 'comment');
    addSimpleInsert(widget, 'simpleinput');
    addSimpleInsert(widget, 'simpleoutput');
    addSimpleInsert(widget, 'timer');
    addSimpleInsert(widget, 'pause');
    addSimpleInsert(widget, 'ctrlstart');
    addSimpleInsert(widget, 'ctrlend');
    addSimpleInsert(widget, 'input');
    addSimpleInsert(widget, 'output');
    addSimpleInsert(widget, 'shelf');
    addSimpleInsert(widget, 'process');
    addSimpleInsert(widget, 'drakon-image');
    widget.insertActions.question = questionInsert;
    widget.insertActions.branch = branchInsert;
    widget.insertActions.select = selectInsert;
    widget.insertActions['case'] = caseInsert;
    widget.insertActions['first-case'] = firstCaseInsert;
    widget.insertActions['foreach'] = foreachInsert;
    widget.insertActions['mind-child'] = mindChildInsert;
    widget.insertActions['mind-before'] = mindBeforeInsert;
    widget.insertActions['mind-after'] = mindAfterInsert;
    widget.insertActions['parblock'] = parBlockInsert;
    widget.insertActions['par'] = parInsert;
    widget.insertActions['firstpar'] = firstParInsert;
    widget.insertActions.duration = durationInsert;
}
function isDigit(c) {
    var nine, zero;
    zero = 48;
    nine = 57;
    if (c >= zero && c <= nine) {
        return true;
    } else {
        return false;
    }
}
function isReadonly(widget) {
    return widget.model.doc.access === 'read' || !widget.visuals.config.canSelect;
}
function moveBranchIdsLeft(visuals, branchId) {
    var _collection_151, branch, edits, itemId, newId;
    edits = [];
    _collection_151 = visuals.branches;
    for (itemId of _collection_151) {
        branch = getNode(visuals, itemId);
        if (branch.branchId > branchId) {
            newId = branch.branchId - 1;
            updateItem(edits, itemId, { branchId: newId });
        }
    }
    return edits;
}
function moveBranchIdsRight(visuals, branchId) {
    var _collection_153, branch, edits, itemId, newId;
    edits = [];
    _collection_153 = visuals.branches;
    for (itemId of _collection_153) {
        branch = getNode(visuals, itemId);
        if (branch.branchId >= branchId) {
            newId = branch.branchId + 1;
            updateItem(edits, itemId, { branchId: newId });
        }
    }
    return edits;
}
function nextBranchName(visuals) {
    var _collection_155, branch, id, max, number;
    max = 0;
    _collection_155 = visuals.branches;
    for (id of _collection_155) {
        branch = getNode(visuals, id);
        number = getNumberPart(branch.content);
        max = Math.max(max, number);
    }
    return visuals.config.branch + (max + 1);
}
function onUndoRedo(widget, selection) {
    widget.selection = utils.deepClone(selection);
    widget.redraw();
    reportSelection(widget);
}
function parBlockInsert(widget, socket) {
    var edits, model, par1Id, par2Id, parendId;
    model = widget.model;
    edits = [];
    parendId = createItem(model, edits, {
        type: 'parend',
        one: socket.target
    });
    par2Id = createItem(model, edits, {
        type: 'parbegin',
        one: parendId
    });
    par1Id = createItem(model, edits, {
        type: 'parbegin',
        one: parendId,
        two: par2Id
    });
    redirectUpperItems(edits, socket.links, par1Id);
    return edits;
}
function parInsert(widget, socket) {
    var beginpar, edits, endparId, item, model, newId;
    model = widget.model;
    edits = [];
    if (socket.edge) {
        beginpar = socket.edge.head;
        endparId = getParTarget(beginpar);
        item = {
            type: 'parbegin',
            one: endparId,
            two: socket.edge.tail.itemId
        };
    } else {
        beginpar = socket.node;
        endparId = getParTarget(beginpar);
        item = {
            type: 'parbegin',
            one: endparId
        };
    }
    newId = createItem(model, edits, item);
    updateItem(edits, beginpar.itemId, { two: newId });
    return edits;
}
function pasteDuration(widget, existing, item) {
    var caseId, edits, fields, model;
    edits = [];
    model = widget.model;
    fields = utils.clone(item);
    caseId = createItem(model, edits, fields);
    updateItem(edits, existing.itemId, { side: caseId });
    return edits;
}
async function pasteFree(widget, clipboard, evt) {
    var _collection_157, _collection_159, config, create, currentZ, dx, dy, edits, epos, first, images, item, oldPos, payload, pos, x, y;
    payload = clipboard.content;
    images = payload.images;
    config = widget.visuals.config;
    edits = [];
    replaceIds(widget, undefined, payload.items, '');
    first = payload.items[0];
    epos = getFreePosition(first);
    if (evt) {
        pos = toDiagram(widget, evt);
        dx = pos.x - epos.x;
        dy = pos.y - epos.y;
    } else {
        dx = unit.pasteDX + 20;
        dy = unit.pasteDY + 20;
        unit.pasteDX = dx;
        unit.pasteDY = dy;
    }
    _collection_157 = payload.items;
    for (item of _collection_157) {
        if (item.type !== 'connection') {
            oldPos = getFreePosition(item);
            x = snapUp(config, oldPos.x + dx);
            y = snapUp(config, oldPos.y + dy);
            setFreePosition(item, x, y);
        }
    }
    utils.sortBy(payload.items, 'zIndex');
    currentZ = getNextZIndex(widget);
    _collection_159 = payload.items;
    for (item of _collection_159) {
        if (item.type !== 'connection') {
            item.zIndex = currentZ;
            currentZ++;
        }
    }
    create = function (item) {
        createPastedItem(edits, item);
    };
    payload.items.forEach(create);
    await loadCreatedImages(widget, edits, images);
    return doEdit(widget, edits);
}
function popFromSkewer(widget, node, edits) {
    var dstId, edgeUp;
    dstId = node.one;
    edgeUp = node.up;
    redirectUpperItems(edits, edgeUp.links, dstId);
    deleteItem(widget, edits, node);
}
function questionInsert(widget, socket) {
    var edits, item, model, newId;
    model = widget.model;
    edits = [];
    item = {
        type: 'question',
        content: '',
        one: socket.target,
        two: socket.target,
        flag1: 1
    };
    newId = createItem(model, edits, item);
    redirectUpperItems(edits, socket.links, newId);
    return edits;
}
function redirectPrevItems(edits, node, targetId) {
    var _collection_161, edit, prev, visited;
    visited = {};
    for (edit of edits) {
        if (edit.op === 'delete') {
            visited[edit.id] = true;
        }
    }
    _collection_161 = node.prev;
    for (prev of _collection_161) {
        if (!(prev.id in visited)) {
            visited[prev.id] = true;
            replaceInUpdate(edits, node.id, prev, targetId);
        }
    }
}
function redirectUpperItems(edits, links, newId) {
    var edit, link;
    for (link of links) {
        edit = createUpdate(link.source);
        if (link.index === 0) {
            edit.fields.one = newId;
        } else {
            edit.fields.two = newId;
        }
        edits.push(edit);
    }
}
function replaceInUpdate(edits, id, prev, targetId) {
    var fields, updated;
    updated = false;
    fields = {};
    if (prev.one === id) {
        fields.one = targetId;
        updated = true;
    }
    if (prev.two === id) {
        fields.two = targetId;
        updated = true;
    }
    if (updated) {
        updateItem(edits, prev.id, fields);
    }
}
function resetMargin(widget, id) {
    var change;
    checkNotReadonly(widget);
    change = {
        id: id,
        fields: { margin: 0 },
        op: 'update'
    };
    updateAndKeepSelection(widget, [change]);
}
async function runInsertAction(widget, socket) {
    var _selectValue_163, action, edits, images;
    images = {};
    _selectValue_163 = socket.op;
    if (_selectValue_163 === 'insert') {
        action = widget.insertActions[socket.type];
        edits = action(widget, socket);
        insertImageDataItem(socket.imageData, edits, images);
        await loadCreatedImages(widget, edits, images);
        return doEdit(widget, edits);
    } else {
        if (_selectValue_163 === 'paste') {
            edits = pasteInSocket(widget, socket, images);
            await loadCreatedImages(widget, edits, images);
            return doEdit(widget, edits);
        } else {
            if (_selectValue_163 === 'arrow') {
                edits = clickArrowSocket(widget, socket);
                await loadCreatedImages(widget, edits, images);
                return doEdit(widget, edits);
            } else {
                if (_selectValue_163 === 'liana') {
                    edits = clickLianaSocket(widget, socket);
                    await loadCreatedImages(widget, edits, images);
                    return doEdit(widget, edits);
                } else {
                    if (_selectValue_163 !== 'params') {
                        throw new Error('Unexpected case value: ' + _selectValue_163);
                    }
                }
            }
        }
    }
}
function selectInsert(widget, socket) {
    var case1Id, case2Id, case3Id, edits, model, selectId;
    edits = [];
    model = widget.model;
    case3Id = createItem(model, edits, {
        type: 'case',
        one: socket.target
    });
    case2Id = createItem(model, edits, {
        type: 'case',
        one: socket.target,
        two: case3Id
    });
    case1Id = createItem(model, edits, {
        type: 'case',
        one: socket.target,
        two: case2Id
    });
    selectId = createItem(model, edits, {
        type: 'select',
        one: case1Id
    });
    redirectUpperItems(edits, socket.links, selectId);
    return edits;
}
function setFreePosition(element, x, y) {
    if (element.type === 'group-duration') {
        element.x = x;
        element.y = y;
    } else {
        element.left = x;
        element.top = y;
    }
}
function simpleInsert(widget, socket, type) {
    var edits, item, model, newId;
    model = widget.model;
    edits = [];
    item = {
        type: type,
        content: '',
        one: socket.target
    };
    newId = createItem(model, edits, item);
    redirectUpperItems(edits, socket.links, newId);
    return edits;
}
function stripEdit(edit) {
    if (edit.fields && edit.fields.type === 'image') {
        return {
            fields: {
                type: 'image',
                content: '...'
            },
            id: edit.id,
            op: edit.op
        };
    } else {
        return edit;
    }
}
function stripEdits(edits) {
    return edits.map(stripEdit);
}
function updateAndKeepSelection(widget, edits) {
    var after, before, changesToSave, fonts;
    tracing.trace('DrakonCanvas.updateAndKeepSelection', stripEdits(edits));
    deleteOrphanImages(widget, edits);
    before = utils.deepClone(widget.selection);
    after = utils.deepClone(widget.selection);
    changesToSave = widget.edit.updateDocument(edits, before, after);
    fonts = widget.redraw();
    widget.edit.save(changesToSave);
    return fonts;
}
function updateItem(edits, id, fields) {
    var update;
    update = createUpdate(id, fields);
    edits.push(update);
}
function exportCore(widget, box, zoom, ctx, watermark) {
    var config, factor, height, visuals, width;
    tracing.trace('DrakonCanvas.exportCore', zoom);
    factor = 1;
    visuals = widget.visuals;
    config = visuals.config;
    width = (box.right - box.left) * zoom;
    height = (box.bottom - box.top) * zoom;
    visuals.ctx = ctx;
    paintCore(widget, factor, zoom, -box.left, -box.top, width, height);
    if (watermark && ctx.resetTransform) {
        drawWatermark(widget, ctx, watermark, factor, zoom, width, height);
    }
    visuals.ctx = widget.canvas.getContext('2d');
}
function addConnectionToVisuals(visuals, id, item) {
    var element;
    element = utils.clone(item);
    element.id = id;
    parseStyle(item, element);
    utils.multiMapAdd(visuals.connections, element.begin, element);
    utils.multiMapAdd(visuals.connections, element.end, element);
    visuals.connectionById[id] = element;
}
function areConnected(visuals, id1, id2) {
    var connection, connections;
    connections = visuals.connections[id1];
    if (connections) {
        for (connection of connections) {
            if (connection.begin === id2 || connection.end === id2) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}
function buildConnectionBoxes(visuals, connection) {
    var begin, coord, coords, end, i, margin, prev;
    connection.boxes = [];
    begin = getFree(visuals, connection.begin);
    end = getFree(visuals, connection.end);
    coords = buildConnectionLineCoords(begin, end, connection.role);
    if (coords.length === 0) {
    } else {
        margin = visuals.config.socketTouchRadius;
        prev = coords[0];
        for (i = 1; i < coords.length; i++) {
            coord = coords[i];
            if (prev.x === coord.x) {
                connection.boxes.push(boxForVerticalLine(prev.x, prev.y, coord.y, margin));
            } else {
                connection.boxes.push(boxForHorizontalLine(prev.x, prev.y, coord.x, margin));
            }
            prev = coord;
        }
    }
}
function buildConnectionLineCoords(begin, end, role) {
    var bbottom, bleft, bottom, bright, btop, bx, by, ebottom, eleft, eright, etop, ex, ey, left, midX, midY, minLine, right, top;
    minLine = 40;
    if (role === 'vertical') {
        btop = begin.top;
        bbottom = begin.top + begin.height;
        bx = Math.floor(begin.left + begin.width / 2);
        etop = end.top;
        ebottom = end.top + end.height;
        ex = Math.floor(end.left + end.width / 2);
        if (bx === ex) {
            if (bbottom <= etop) {
                return [
                    {
                        x: bx,
                        y: bbottom
                    },
                    {
                        x: bx,
                        y: etop
                    }
                ];
            } else {
                if (ebottom <= btop) {
                    return [
                        {
                            x: bx,
                            y: btop
                        },
                        {
                            x: bx,
                            y: ebottom
                        }
                    ];
                } else {
                    return [];
                }
            }
        } else {
            if (bbottom + minLine <= etop) {
                midY = Math.floor((bbottom + etop) / 2);
                return [
                    {
                        x: bx,
                        y: bbottom
                    },
                    {
                        x: bx,
                        y: midY
                    },
                    {
                        x: ex,
                        y: midY
                    },
                    {
                        x: ex,
                        y: etop
                    }
                ];
            } else {
                if (ebottom + minLine <= btop) {
                    midY = Math.floor((ebottom + btop) / 2);
                    return [
                        {
                            x: bx,
                            y: btop
                        },
                        {
                            x: bx,
                            y: midY
                        },
                        {
                            x: ex,
                            y: midY
                        },
                        {
                            x: ex,
                            y: ebottom
                        }
                    ];
                } else {
                    if (Math.abs(btop - etop) <= Math.abs(bbottom - ebottom)) {
                        if (btop <= etop) {
                            top = btop - minLine;
                        } else {
                            top = etop - minLine;
                        }
                        return [
                            {
                                x: bx,
                                y: btop
                            },
                            {
                                x: bx,
                                y: top
                            },
                            {
                                x: ex,
                                y: top
                            },
                            {
                                x: ex,
                                y: etop
                            }
                        ];
                    } else {
                        if (bbottom >= ebottom) {
                            bottom = bbottom + minLine;
                        } else {
                            bottom = ebottom + minLine;
                        }
                        return [
                            {
                                x: bx,
                                y: bbottom
                            },
                            {
                                x: bx,
                                y: bottom
                            },
                            {
                                x: ex,
                                y: bottom
                            },
                            {
                                x: ex,
                                y: ebottom
                            }
                        ];
                    }
                }
            }
        }
    } else {
        bleft = begin.left;
        bright = begin.left + begin.width;
        by = Math.floor(begin.top + begin.height / 2);
        eleft = end.left;
        eright = end.left + end.width;
        ey = Math.floor(end.top + end.height / 2);
        if (by === ey) {
            if (bright <= eleft) {
                return [
                    {
                        x: bright,
                        y: by
                    },
                    {
                        x: eleft,
                        y: ey
                    }
                ];
            } else {
                if (eright <= bleft) {
                    return [
                        {
                            x: bleft,
                            y: ey
                        },
                        {
                            x: eright,
                            y: by
                        }
                    ];
                } else {
                    return [];
                }
            }
        } else {
            if (bright + minLine <= eleft) {
                midX = Math.floor((bright + eleft) / 2);
                return [
                    {
                        x: bright,
                        y: by
                    },
                    {
                        x: midX,
                        y: by
                    },
                    {
                        x: midX,
                        y: ey
                    },
                    {
                        x: eleft,
                        y: ey
                    }
                ];
            } else {
                if (eright + minLine <= bleft) {
                    midX = Math.floor((eright + bleft) / 2);
                    return [
                        {
                            x: bleft,
                            y: by
                        },
                        {
                            x: midX,
                            y: by
                        },
                        {
                            x: midX,
                            y: ey
                        },
                        {
                            x: eright,
                            y: ey
                        }
                    ];
                } else {
                    if (Math.abs(bleft - eleft) <= Math.abs(bright - eright)) {
                        if (bleft <= eleft) {
                            left = bleft - minLine;
                        } else {
                            left = eleft - minLine;
                        }
                        return [
                            {
                                x: bleft,
                                y: by
                            },
                            {
                                x: left,
                                y: by
                            },
                            {
                                x: left,
                                y: ey
                            },
                            {
                                x: eleft,
                                y: ey
                            }
                        ];
                    } else {
                        if (bright >= eright) {
                            right = bright + minLine;
                        } else {
                            right = eright + minLine;
                        }
                        return [
                            {
                                x: bright,
                                y: by
                            },
                            {
                                x: right,
                                y: by
                            },
                            {
                                x: right,
                                y: ey
                            },
                            {
                                x: eright,
                                y: ey
                            }
                        ];
                    }
                }
            }
        }
    }
}
function buildConnectionMenu(widget, prim) {
    var menu;
    menu = [];
    if (!isReadonly(widget)) {
        pushMenuItem('delete_connection', menu, tr(widget, 'Delete'), widget.visuals.config.imagePath + 'delete.png', function () {
            deleteSelection(widget);
        });
        menu.push({ type: 'separator' });
        pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
            startEditStyle(widget);
        });
    }
    return menu;
}
function createConnection(widget, begin, end, role) {
    var edits, item, style, styleStr;
    style = { headStyle: widget.userMemory.headStyle };
    styleStr = JSON.stringify(style);
    item = {
        type: 'connection',
        begin: begin,
        end: end,
        role: role,
        style: styleStr
    };
    edits = [];
    insertFreeItem(widget, edits, item);
    return doEdit(widget, edits);
}
function deleteConnection(widget, id) {
    var edits;
    edits = [];
    deleteItemCore(edits, id);
    return doEdit(widget, edits);
}
function drawConnection(widget, connection, ctx) {
    var begin, config, coords, end, iconBack, lineWidth, lines, minLine, style, visuals;
    style = connection.style || {};
    minLine = 40;
    visuals = widget.visuals;
    config = visuals.config;
    begin = getFree(visuals, connection.begin);
    end = getFree(visuals, connection.end);
    lineWidth = getLineWidth(visuals, connection);
    lines = getLineColor(visuals, connection);
    iconBack = getThemeValue(visuals.config, connection, 'iconBack');
    setLineDashFromStyle(config, connection, lineWidth, 'lineStyle', ctx);
    coords = buildConnectionLineCoords(begin, end, connection.role);
    if (coords.length !== 0) {
        if (isSelected(widget, connection.id)) {
            multiline(config, ctx, coords, 'black', lineWidth + 4, undefined, undefined, iconBack);
            multiline(config, ctx, coords, '#00ff00', lineWidth + 2, undefined, undefined, iconBack);
        }
        multiline(config, ctx, coords, lines, lineWidth, style.tailStyle, style.headStyle, iconBack);
    }
    return false;
}
function getConnection(visuals, id) {
    return visuals.connectionById[id];
}
function getConnectionProps() {
    return [
        'lines',
        'lineWidth',
        'tailStyle',
        'lineStyle',
        'headStyle'
    ];
}
function hitConnection(connection, pos) {
    var _collection_165, box;
    _collection_165 = connection.boxes;
    for (box of _collection_165) {
        if (hitBox(box, pos.x, pos.y)) {
            return true;
        }
    }
    return false;
}
function performOnConnections(visuals, id, visited, action) {
    var connection, connections, mustExit;
    connections = visuals.connections[id];
    if (connections) {
        for (connection of connections) {
            if (connection.id in visited) {
                visited[connection.id]++;
            } else {
                visited[connection.id] = 1;
                mustExit = action(connection);
                if (mustExit) {
                    return connection;
                }
            }
        }
        return undefined;
    } else {
        return undefined;
    }
}
function Ears(widget, element) {
    var _obj_;
    _obj_ = Ears_create(widget, element);
    return _obj_.run();
}
function createResetEars(widget) {
    var ears, element, elements, visuals;
    visuals = widget.visuals;
    elements = getSelectedFree(widget);
    if (elements.length === 1) {
        element = elements[0];
        if (canConnect(widget, element)) {
            ears = Ears_create(widget, element);
            ears.run();
            visuals.ears = ears;
        } else {
            visuals.ears = undefined;
        }
    } else {
        visuals.ears = undefined;
    }
}
function drawEar(ctx, key, box, lineWidth, fill, border) {
    var centerX, centerY;
    centerX = box.left + box.width / 2;
    centerY = box.top + box.height / 2;
    ctx.save();
    if (key === 'left') {
        rotateAround(ctx, centerX, centerY, -Math.PI / 2);
    } else {
        if (key === 'right') {
            rotateAround(ctx, centerX, centerY, Math.PI / 2);
        } else {
            if (key === 'down') {
                rotateAround(ctx, centerX, centerY, Math.PI);
            }
        }
    }
    clearShadow(ctx);
    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    earArrowPath(ctx, box.left, box.top, box.width, box.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
function drawEars(visuals, ctx) {
    var _collection_170, border, box, config, ears, fill, key, radius, selectedBox;
    fill = '#00ff00';
    border = 'black';
    ears = visuals.ears;
    config = visuals.config;
    if (ears) {
        drawEarsLine(visuals, ears, ctx);
        radius = visuals.config.socketTouchRadius;
        if (ears.selected) {
            if (!ears.hideEar) {
                selectedBox = ears.boxes[ears.selected];
                drawCircle(ctx, selectedBox.left + radius, selectedBox.top + radius, radius, 2, fill, border);
            }
        } else {
            _collection_170 = ears.boxes;
            for (key in _collection_170) {
                box = _collection_170[key];
                if (visuals.highlight === key) {
                    fill = '#00ff00';
                    border = config.theme.highlight;
                } else {
                    fill = '#00ff00';
                    border = 'black';
                }
                drawEar(ctx, key, box, 2, fill, border);
            }
        }
    }
}
function drawEarsLine(visuals, ears, ctx) {
    var coords, lineWidth, lines, role;
    if (ears.lineTarget) {
        lines = visuals.config.theme.lines;
        lineWidth = visuals.config.theme.lineWidth;
        role = getEarRole(ears);
        coords = buildConnectionLineCoords(ears.element, ears.lineTarget, role);
        if (coords.length !== 0) {
            multiline(visuals.config, ctx, coords, lines, lineWidth, undefined, undefined, undefined);
        }
    }
}
function getEarRole(ears) {
    var _selectValue_173;
    _selectValue_173 = ears.selected;
    if (_selectValue_173 === 'up' || _selectValue_173 === 'down') {
        return 'vertical';
    } else {
        return 'horizontal';
    }
}
function hitEars(visuals, pos) {
    var _collection_175, box, key;
    if (visuals.ears) {
        _collection_175 = visuals.ears.boxes;
        for (key in _collection_175) {
            box = _collection_175[key];
            if (hitBox(box, pos.x, pos.y)) {
                return key;
            }
        }
        return undefined;
    } else {
        return undefined;
    }
}
function recalculateEarsVisuals(widget, evt, ears) {
    var box, pos, target;
    pos = toDiagram(widget, evt);
    if (hitBox(ears.element, pos.x, pos.y)) {
        ears.lineTarget = undefined;
        ears.hideEar = false;
        ears.target = undefined;
    } else {
        target = findFree(widget, pos);
        if (target && (canConnect(widget, target) && !areConnected(widget.visuals, ears.element.id, target.id))) {
            ears.lineTarget = target;
            ears.hideEar = true;
            ears.target = target;
        } else {
            box = ears.boxes[ears.selected];
            ears.lineTarget = box;
            ears.hideEar = false;
            ears.target = undefined;
        }
    }
}
function rotateAround(ctx, cx, cy, angle) {
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.translate(-cx, -cy);
}
function setupEarBoxes(ears, element, radius) {
    var bottom, right, x, y;
    ears.target = undefined;
    ears.lineTarget = undefined;
    ears.hideEar = false;
    ears.selected = undefined;
    x = Math.floor(element.left + element.width / 2);
    y = Math.floor(element.top + element.height / 2);
    right = element.left + element.width;
    bottom = element.top + element.height;
    ears.boxes = {};
    ears.boxes.up = boxFromPoint(x, element.top - radius * 2, radius, radius);
    ears.boxes.left = boxFromPoint(element.left - radius * 2, y, radius, radius);
    ears.boxes.right = boxFromPoint(right + radius * 2, y, radius, radius);
    ears.boxes.down = boxFromPoint(x, bottom + radius * 2, radius, radius);
}
function CalloutPointer() {
    var self = { _type: 'CalloutPointer' };
    function CalloutPointer_complete() {
        var change;
        change = {
            id: self.element.id,
            fields: {
                px: self.element.px,
                py: self.element.py
            },
            op: 'update'
        };
        updateAndKeepSelection(self.widget, [change]);
    }
    function CalloutPointer_dragTo(x, y) {
        if (!hitBox(self.element, x, y)) {
            self.element.px = x - self.left;
            self.element.py = y - self.top;
        }
    }
    function CalloutPointer_getCursor() {
        return 'grab';
    }
    function CalloutPointer_getMaxX() {
        return self.maxX;
    }
    function CalloutPointer_getMaxY() {
        return self.maxY;
    }
    function CalloutPointer_getMinX() {
        return self.minX;
    }
    function CalloutPointer_getMinY() {
        return self.minY;
    }
    function CalloutPointer_xEnabled() {
        return true;
    }
    function CalloutPointer_yEnabled() {
        return true;
    }
    self.complete = CalloutPointer_complete;
    self.dragTo = CalloutPointer_dragTo;
    self.getCursor = CalloutPointer_getCursor;
    self.getMaxX = CalloutPointer_getMaxX;
    self.getMaxY = CalloutPointer_getMaxY;
    self.getMinX = CalloutPointer_getMinX;
    self.getMinY = CalloutPointer_getMinY;
    self.xEnabled = CalloutPointer_xEnabled;
    self.yEnabled = CalloutPointer_yEnabled;
    return self;
}
function HandleEast() {
    var self = { _type: 'HandleEast' };
    function HandleEast_complete() {
        saveRectangleCoords(self);
    }
    function HandleEast_dragTo(x, y) {
        self.element.width = x - self.left;
        findVerticalForHandle(self, self.element, x);
    }
    function HandleEast_getCursor() {
        return 'ew-resize';
    }
    function HandleEast_getMaxX() {
        return self.maxX;
    }
    function HandleEast_getMaxY() {
        return self.maxY;
    }
    function HandleEast_getMinX() {
        return self.minX;
    }
    function HandleEast_getMinY() {
        return self.minY;
    }
    function HandleEast_xEnabled() {
        return true;
    }
    function HandleEast_yEnabled() {
        return false;
    }
    self.complete = HandleEast_complete;
    self.dragTo = HandleEast_dragTo;
    self.getCursor = HandleEast_getCursor;
    self.getMaxX = HandleEast_getMaxX;
    self.getMaxY = HandleEast_getMaxY;
    self.getMinX = HandleEast_getMinX;
    self.getMinY = HandleEast_getMinY;
    self.xEnabled = HandleEast_xEnabled;
    self.yEnabled = HandleEast_yEnabled;
    return self;
}
function HandleNE() {
    var self = { _type: 'HandleNE' };
    function HandleNE_complete() {
        saveRectangleCoords(self);
    }
    function HandleNE_dragTo(x, y) {
        self.element.top = y;
        self.element.width = x - self.left;
        self.element.height = self.bottom - y;
        findHorizontalForHandle(self, self.element, y);
        findVerticalForHandle(self, self.element, x);
    }
    function HandleNE_getCursor() {
        return 'nesw-resize';
    }
    function HandleNE_getMaxX() {
        return self.maxX;
    }
    function HandleNE_getMaxY() {
        return self.maxY;
    }
    function HandleNE_getMinX() {
        return self.minX;
    }
    function HandleNE_getMinY() {
        return self.minY;
    }
    function HandleNE_xEnabled() {
        return true;
    }
    function HandleNE_yEnabled() {
        return true;
    }
    self.complete = HandleNE_complete;
    self.dragTo = HandleNE_dragTo;
    self.getCursor = HandleNE_getCursor;
    self.getMaxX = HandleNE_getMaxX;
    self.getMaxY = HandleNE_getMaxY;
    self.getMinX = HandleNE_getMinX;
    self.getMinY = HandleNE_getMinY;
    self.xEnabled = HandleNE_xEnabled;
    self.yEnabled = HandleNE_yEnabled;
    return self;
}
function HandleNW() {
    var self = { _type: 'HandleNW' };
    function HandleNW_complete() {
        saveRectangleCoords(self);
    }
    function HandleNW_dragTo(x, y) {
        self.element.left = x;
        self.element.top = y;
        self.element.width = self.right - x;
        self.element.height = self.bottom - y;
        findHorizontalForHandle(self, self.element, y);
        findVerticalForHandle(self, self.element, x);
    }
    function HandleNW_getCursor() {
        return 'nwse-resize';
    }
    function HandleNW_getMaxX() {
        return self.maxX;
    }
    function HandleNW_getMaxY() {
        return self.maxY;
    }
    function HandleNW_getMinX() {
        return self.minX;
    }
    function HandleNW_getMinY() {
        return self.minY;
    }
    function HandleNW_xEnabled() {
        return true;
    }
    function HandleNW_yEnabled() {
        return true;
    }
    self.complete = HandleNW_complete;
    self.dragTo = HandleNW_dragTo;
    self.getCursor = HandleNW_getCursor;
    self.getMaxX = HandleNW_getMaxX;
    self.getMaxY = HandleNW_getMaxY;
    self.getMinX = HandleNW_getMinX;
    self.getMinY = HandleNW_getMinY;
    self.xEnabled = HandleNW_xEnabled;
    self.yEnabled = HandleNW_yEnabled;
    return self;
}
function HandleNorth() {
    var self = { _type: 'HandleNorth' };
    function HandleNorth_complete() {
        saveRectangleCoords(self);
    }
    function HandleNorth_dragTo(x, y) {
        var element;
        element = self.element;
        element.top = y;
        element.height = self.bottom - y;
        findHorizontalForHandle(self, element, y);
    }
    function HandleNorth_getCursor() {
        return 'ns-resize';
    }
    function HandleNorth_getMaxX() {
        return self.maxX;
    }
    function HandleNorth_getMaxY() {
        return self.maxY;
    }
    function HandleNorth_getMinX() {
        return self.minX;
    }
    function HandleNorth_getMinY() {
        return self.minY;
    }
    function HandleNorth_xEnabled() {
        return false;
    }
    function HandleNorth_yEnabled() {
        return true;
    }
    self.complete = HandleNorth_complete;
    self.dragTo = HandleNorth_dragTo;
    self.getCursor = HandleNorth_getCursor;
    self.getMaxX = HandleNorth_getMaxX;
    self.getMaxY = HandleNorth_getMaxY;
    self.getMinX = HandleNorth_getMinX;
    self.getMinY = HandleNorth_getMinY;
    self.xEnabled = HandleNorth_xEnabled;
    self.yEnabled = HandleNorth_yEnabled;
    return self;
}
function HandleSE() {
    var self = { _type: 'HandleSE' };
    function HandleSE_complete() {
        saveRectangleCoords(self);
    }
    function HandleSE_dragTo(x, y) {
        self.element.width = x - self.left;
        self.element.height = y - self.top;
        findHorizontalForHandle(self, self.element, y);
        findVerticalForHandle(self, self.element, x);
    }
    function HandleSE_getCursor() {
        return 'nwse-resize';
    }
    function HandleSE_getMaxX() {
        return self.maxX;
    }
    function HandleSE_getMaxY() {
        return self.maxY;
    }
    function HandleSE_getMinX() {
        return self.minX;
    }
    function HandleSE_getMinY() {
        return self.minY;
    }
    function HandleSE_xEnabled() {
        return true;
    }
    function HandleSE_yEnabled() {
        return true;
    }
    self.complete = HandleSE_complete;
    self.dragTo = HandleSE_dragTo;
    self.getCursor = HandleSE_getCursor;
    self.getMaxX = HandleSE_getMaxX;
    self.getMaxY = HandleSE_getMaxY;
    self.getMinX = HandleSE_getMinX;
    self.getMinY = HandleSE_getMinY;
    self.xEnabled = HandleSE_xEnabled;
    self.yEnabled = HandleSE_yEnabled;
    return self;
}
function HandleSW() {
    var self = { _type: 'HandleSW' };
    function HandleSW_complete() {
        saveRectangleCoords(self);
    }
    function HandleSW_dragTo(x, y) {
        self.element.left = x;
        self.element.top = self.top;
        self.element.width = self.right - x;
        self.element.height = y - self.top;
        findHorizontalForHandle(self, self.element, y);
        findVerticalForHandle(self, self.element, x);
    }
    function HandleSW_getCursor() {
        return 'nesw-resize';
    }
    function HandleSW_getMaxX() {
        return self.maxX;
    }
    function HandleSW_getMaxY() {
        return self.maxY;
    }
    function HandleSW_getMinX() {
        return self.minX;
    }
    function HandleSW_getMinY() {
        return self.minY;
    }
    function HandleSW_xEnabled() {
        return true;
    }
    function HandleSW_yEnabled() {
        return true;
    }
    self.complete = HandleSW_complete;
    self.dragTo = HandleSW_dragTo;
    self.getCursor = HandleSW_getCursor;
    self.getMaxX = HandleSW_getMaxX;
    self.getMaxY = HandleSW_getMaxY;
    self.getMinX = HandleSW_getMinX;
    self.getMinY = HandleSW_getMinY;
    self.xEnabled = HandleSW_xEnabled;
    self.yEnabled = HandleSW_yEnabled;
    return self;
}
function HandleSouth() {
    var self = { _type: 'HandleSouth' };
    function HandleSouth_complete() {
        saveRectangleCoords(self);
    }
    function HandleSouth_dragTo(x, y) {
        var element;
        element = self.element;
        self.element.height = y - self.top;
        findHorizontalForHandle(self, element, y);
    }
    function HandleSouth_getCursor() {
        return 'ns-resize';
    }
    function HandleSouth_getMaxX() {
        return self.maxX;
    }
    function HandleSouth_getMaxY() {
        return self.maxY;
    }
    function HandleSouth_getMinX() {
        return self.minX;
    }
    function HandleSouth_getMinY() {
        return self.minY;
    }
    function HandleSouth_xEnabled() {
        return false;
    }
    function HandleSouth_yEnabled() {
        return true;
    }
    self.complete = HandleSouth_complete;
    self.dragTo = HandleSouth_dragTo;
    self.getCursor = HandleSouth_getCursor;
    self.getMaxX = HandleSouth_getMaxX;
    self.getMaxY = HandleSouth_getMaxY;
    self.getMinX = HandleSouth_getMinX;
    self.getMinY = HandleSouth_getMinY;
    self.xEnabled = HandleSouth_xEnabled;
    self.yEnabled = HandleSouth_yEnabled;
    return self;
}
function HandleWest() {
    var self = { _type: 'HandleWest' };
    function HandleWest_complete() {
        saveRectangleCoords(self);
    }
    function HandleWest_dragTo(x, y) {
        self.element.left = x;
        self.element.width = self.right - x;
        findVerticalForHandle(self, self.element, x);
    }
    function HandleWest_getCursor() {
        return 'ew-resize';
    }
    function HandleWest_getMaxX() {
        return self.maxX;
    }
    function HandleWest_getMaxY() {
        return self.maxY;
    }
    function HandleWest_getMinX() {
        return self.minX;
    }
    function HandleWest_getMinY() {
        return self.minY;
    }
    function HandleWest_xEnabled() {
        return true;
    }
    function HandleWest_yEnabled() {
        return false;
    }
    self.complete = HandleWest_complete;
    self.dragTo = HandleWest_dragTo;
    self.getCursor = HandleWest_getCursor;
    self.getMaxX = HandleWest_getMaxX;
    self.getMaxY = HandleWest_getMaxY;
    self.getMinX = HandleWest_getMinX;
    self.getMinY = HandleWest_getMinY;
    self.xEnabled = HandleWest_xEnabled;
    self.yEnabled = HandleWest_yEnabled;
    return self;
}
function LineEnd() {
    var self = { _type: 'LineEnd' };
    function LineEnd_complete() {
        saveLineCoords(self);
    }
    function LineEnd_dragTo(x, y) {
        var x2, y2;
        x2 = x - self.element.left;
        y2 = y - self.element.top;
        if (!(x2 === 0 && y2 === 0)) {
            self.element.x2 = x2;
            self.element.y2 = y2;
            findGuidesForPoint(self, x, y);
        }
    }
    function LineEnd_getCursor() {
        return 'move';
    }
    function LineEnd_getMaxX() {
        return Number.MAX_SAFE_INTEGER;
    }
    function LineEnd_getMaxY() {
        return Number.MAX_SAFE_INTEGER;
    }
    function LineEnd_getMinX() {
        return Number.MIN_SAFE_INTEGER;
    }
    function LineEnd_getMinY() {
        return Number.MIN_SAFE_INTEGER;
    }
    function LineEnd_xEnabled() {
        return true;
    }
    function LineEnd_yEnabled() {
        return true;
    }
    self.complete = LineEnd_complete;
    self.dragTo = LineEnd_dragTo;
    self.getCursor = LineEnd_getCursor;
    self.getMaxX = LineEnd_getMaxX;
    self.getMaxY = LineEnd_getMaxY;
    self.getMinX = LineEnd_getMinX;
    self.getMinY = LineEnd_getMinY;
    self.xEnabled = LineEnd_xEnabled;
    self.yEnabled = LineEnd_yEnabled;
    return self;
}
function LineStart() {
    var self = { _type: 'LineStart' };
    function LineStart_complete() {
        saveLineCoords(self);
    }
    function LineStart_dragTo(x, y) {
        var x2, y2;
        x2 = self.right - x;
        y2 = self.bottom - y;
        if (!(x2 === 0 && y2 === 0)) {
            self.element.left = x;
            self.element.top = y;
            self.element.x2 = x2;
            self.element.y2 = y2;
            findGuidesForPoint(self, x, y);
        }
    }
    function LineStart_getCursor() {
        return 'move';
    }
    function LineStart_getMaxX() {
        return Number.MAX_SAFE_INTEGER;
    }
    function LineStart_getMaxY() {
        return Number.MAX_SAFE_INTEGER;
    }
    function LineStart_getMinX() {
        return Number.MIN_SAFE_INTEGER;
    }
    function LineStart_getMinY() {
        return Number.MIN_SAFE_INTEGER;
    }
    function LineStart_xEnabled() {
        return true;
    }
    function LineStart_yEnabled() {
        return true;
    }
    self.complete = LineStart_complete;
    self.dragTo = LineStart_dragTo;
    self.getCursor = LineStart_getCursor;
    self.getMaxX = LineStart_getMaxX;
    self.getMaxY = LineStart_getMaxY;
    self.getMinX = LineStart_getMinX;
    self.getMinY = LineStart_getMinY;
    self.xEnabled = LineStart_xEnabled;
    self.yEnabled = LineStart_yEnabled;
    return self;
}
function RoundedRadius() {
    var self = { _type: 'RoundedRadius' };
    function RoundedRadius_complete() {
        var change;
        change = {
            id: self.element.id,
            fields: { aux: self.element.aux },
            op: 'update'
        };
        updateAndKeepSelection(self.widget, [change]);
    }
    function RoundedRadius_dragTo(x, y) {
        self.element.aux = self.right - x - self.touch * 2;
    }
    function RoundedRadius_getCursor() {
        return 'ew-resize';
    }
    function RoundedRadius_getMaxX() {
        return self.maxX;
    }
    function RoundedRadius_getMaxY() {
        return self.maxY;
    }
    function RoundedRadius_getMinX() {
        return self.minX;
    }
    function RoundedRadius_getMinY() {
        return self.minY;
    }
    function RoundedRadius_xEnabled() {
        return true;
    }
    function RoundedRadius_yEnabled() {
        return false;
    }
    self.complete = RoundedRadius_complete;
    self.dragTo = RoundedRadius_dragTo;
    self.getCursor = RoundedRadius_getCursor;
    self.getMaxX = RoundedRadius_getMaxX;
    self.getMaxY = RoundedRadius_getMaxY;
    self.getMinX = RoundedRadius_getMinX;
    self.getMinY = RoundedRadius_getMinY;
    self.xEnabled = RoundedRadius_xEnabled;
    self.yEnabled = RoundedRadius_yEnabled;
    return self;
}
function RoundedRadiusLeft() {
    var self = { _type: 'RoundedRadiusLeft' };
    function RoundedRadiusLeft_complete() {
        var change;
        change = {
            id: self.element.id,
            fields: { aux: self.element.aux },
            op: 'update'
        };
        updateAndKeepSelection(self.widget, [change]);
    }
    function RoundedRadiusLeft_dragTo(x, y) {
        self.element.aux = x - self.left - self.touch * 2;
    }
    function RoundedRadiusLeft_getCursor() {
        return 'ew-resize';
    }
    function RoundedRadiusLeft_getMaxX() {
        return self.maxX;
    }
    function RoundedRadiusLeft_getMaxY() {
        return self.maxY;
    }
    function RoundedRadiusLeft_getMinX() {
        return self.minX;
    }
    function RoundedRadiusLeft_getMinY() {
        return self.minY;
    }
    function RoundedRadiusLeft_xEnabled() {
        return true;
    }
    function RoundedRadiusLeft_yEnabled() {
        return false;
    }
    self.complete = RoundedRadiusLeft_complete;
    self.dragTo = RoundedRadiusLeft_dragTo;
    self.getCursor = RoundedRadiusLeft_getCursor;
    self.getMaxX = RoundedRadiusLeft_getMaxX;
    self.getMaxY = RoundedRadiusLeft_getMaxY;
    self.getMinX = RoundedRadiusLeft_getMinX;
    self.getMinY = RoundedRadiusLeft_getMinY;
    self.xEnabled = RoundedRadiusLeft_xEnabled;
    self.yEnabled = RoundedRadiusLeft_yEnabled;
    return self;
}
function VertexHandle() {
    var self = { _type: 'VertexHandle' };
    function VertexHandle_complete() {
        var element;
        element = self.element;
        savePoly(self.widget, element.id, self.left, self.top, element.coords);
    }
    function VertexHandle_dragTo(x, y) {
        var point;
        point = self.element.coords[self.ordinal];
        point.x = x - self.left;
        point.y = y - self.top;
    }
    function VertexHandle_getCursor() {
        return 'move';
    }
    function VertexHandle_getMaxX() {
        return self.maxX;
    }
    function VertexHandle_getMaxY() {
        return self.maxY;
    }
    function VertexHandle_getMinX() {
        return self.minX;
    }
    function VertexHandle_getMinY() {
        return self.minY;
    }
    function VertexHandle_makeContextMenu() {
        var items;
        items = [];
        pushMenuItem('add_vertex', items, tr(self.widget, 'Add vertex'), undefined, function () {
            self.addVertex(self.widget, self.element.id, self.ordinal);
        });
        if (self.element.coords.length !== 3) {
            items.push({ type: 'separator' });
            pushMenuItem('remove_vertex', items, tr(self.widget, 'Remove vertex'), self.widget.visuals.config.imagePath + 'delete.png', function () {
                removeVertex(self.widget, self.element.id, self.ordinal);
            });
        }
        return items;
    }
    function VertexHandle_xEnabled() {
        return true;
    }
    function VertexHandle_yEnabled() {
        return true;
    }
    self.complete = VertexHandle_complete;
    self.dragTo = VertexHandle_dragTo;
    self.getCursor = VertexHandle_getCursor;
    self.getMaxX = VertexHandle_getMaxX;
    self.getMaxY = VertexHandle_getMaxY;
    self.getMinX = VertexHandle_getMinX;
    self.getMinY = VertexHandle_getMinY;
    self.makeContextMenu = VertexHandle_makeContextMenu;
    self.xEnabled = VertexHandle_xEnabled;
    self.yEnabled = VertexHandle_yEnabled;
    return self;
}
function createRadiusHandle(widget, element, ctx) {
    var handle, right, touch, visuals;
    visuals = widget.visuals;
    handle = RoundedRadius();
    setCommonHandleFields(widget, element, handle);
    right = element.left + element.width;
    touch = visuals.config.socketTouchRadius;
    handle.x = right - element.aux - touch * 2;
    handle.y = element.top;
    handle.minX = element.left + touch * 2;
    handle.maxX = right - touch * 2;
    handle.right = right;
    handle.touch = touch;
    handle.color = 'yellow';
    handle.primId = 'radius-' + element.id;
    createHandle(visuals, handle, ctx);
}
function createRadiusHandleLeft(widget, element, ctx) {
    var handle, right, touch, visuals;
    visuals = widget.visuals;
    handle = RoundedRadiusLeft();
    setCommonHandleFields(widget, element, handle);
    touch = visuals.config.socketTouchRadius;
    right = element.left + element.width;
    handle.x = element.left + element.aux + touch * 2;
    handle.y = element.top;
    handle.minX = element.left + touch * 2;
    handle.maxX = right - touch * 2;
    handle.left = element.left;
    handle.touch = touch;
    handle.color = 'yellow';
    handle.primId = 'radius-left-' + element.id;
    createHandle(visuals, handle, ctx);
}
function findGuidesForPoint(handle, x, y) {
    var sourceBox;
    sourceBox = createBox(x, y, 0, 0);
    findHorizontalGuide(handle.widget, handle.element.id, sourceBox, y);
    findVerticalGuide(handle.widget, handle.element.id, sourceBox, x);
    findHorizontalCentralGuide(handle.widget, handle.element.id, sourceBox, y);
    findVerticalCentralGuide(handle.widget, handle.element.id, sourceBox, x);
}
function findHorizontalForHandle(handle, element, y) {
    var ebox;
    ebox = createBox(element.left, element.top, element.width, element.height);
    findHorizontalGuide(handle.widget, element.id, ebox, y);
}
function findVerticalForHandle(handle, element, x) {
    var ebox;
    ebox = createBox(element.left, element.top, element.width, element.height);
    findVerticalGuide(handle.widget, element.id, ebox, x);
}
function saveLineCoords(handle) {
    var change;
    change = {
        id: handle.element.id,
        fields: {
            left: handle.element.left,
            top: handle.element.top,
            x2: handle.element.x2,
            y2: handle.element.y2
        },
        op: 'update'
    };
    updateAndKeepSelection(handle.widget, [change]);
}
function saveRectangleCoords(handle) {
    var change;
    change = {
        id: handle.element.id,
        fields: {
            left: handle.element.left,
            top: handle.element.top,
            width: handle.element.width,
            height: handle.element.height
        },
        op: 'update'
    };
    updateAndKeepSelection(handle.widget, [change]);
}
function drawArrowCap(ctx, color, width) {
    var ARROW_HEIGHT, ARROW_WIDTH;
    ARROW_WIDTH = 14;
    ARROW_HEIGHT = 3;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-ARROW_WIDTH, -ARROW_HEIGHT - width);
    ctx.lineTo(0, 0);
    ctx.lineTo(-ARROW_WIDTH, ARROW_HEIGHT + width);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
function drawCap(ctx, style, x, y, angle, color, fillColor, width) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    if (style === 'arrow') {
        drawArrowCap(ctx, color, width);
    } else {
        if (style === 'sarrow') {
            drawSArrowCap(ctx, color, width);
        } else {
            if (style === 'warrow') {
                drawWArrow(ctx, color, fillColor, width);
            } else {
                if (style === 'paw') {
                    drawPaw(ctx, color, width);
                }
            }
        }
    }
    ctx.restore();
}
function drawPaw(ctx, color, width) {
    var ARROW_HEIGHT, ARROW_WIDTH, height;
    ARROW_WIDTH = 14;
    ARROW_HEIGHT = 3;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    height = ARROW_WIDTH / 2;
    ctx.beginPath();
    ctx.moveTo(0, -height - width);
    ctx.lineTo(-ARROW_WIDTH, 0);
    ctx.lineTo(0, height + width);
    ctx.stroke();
    ctx.stroke();
}
function drawSArrowCap(ctx, color, width) {
    var ARROW_HEIGHT, ARROW_WIDTH;
    ARROW_WIDTH = 14;
    ARROW_HEIGHT = 3;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-ARROW_WIDTH, -ARROW_HEIGHT - width);
    ctx.lineTo(0, 0);
    ctx.lineTo(-ARROW_WIDTH, ARROW_HEIGHT + width);
    ctx.stroke();
}
function drawWArrow(ctx, color, fillColor, width) {
    var ARROW_HEIGHT, ARROW_WIDTH;
    ARROW_WIDTH = 14;
    ARROW_HEIGHT = 3;
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.fillStyle = fillColor;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(-ARROW_WIDTH, -ARROW_HEIGHT - width);
    ctx.lineTo(0, 0);
    ctx.lineTo(-ARROW_WIDTH, ARROW_HEIGHT + width);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}
function buildCoordsPoly() {
    var coords;
    coords = [
        {
            x: 0,
            y: 100,
            radius: 0
        },
        {
            x: 0,
            y: 50,
            radius: 0
        },
        {
            x: 50,
            y: 0,
            radius: 0
        },
        {
            x: 200,
            y: 0,
            radius: 0
        },
        {
            x: 200,
            y: 100,
            radius: 0
        }
    ];
    return JSON.stringify(coords);
}
function buildCoordsTri() {
    var coords;
    coords = [
        {
            x: 0,
            y: 100,
            radius: 0
        },
        {
            x: 100,
            y: 0,
            radius: 0
        },
        {
            x: 200,
            y: 100,
            radius: 0
        }
    ];
    return JSON.stringify(coords);
}
function calculatePolygonRect(item) {
    var bottom, coords, left, point, right, top, x, y;
    coords = JSON.parse(item.coords);
    left = Number.MAX_SAFE_INTEGER, top = Number.MAX_SAFE_INTEGER, right = Number.MIN_SAFE_INTEGER, bottom = Number.MIN_SAFE_INTEGER;
    for (point of coords) {
        x = item.left + point.x;
        y = item.top + point.y;
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
        point.x = x;
        point.y = y;
    }
    item.left = left;
    item.top = top;
    item.width = right - left;
    item.height = bottom - top;
    for (point of coords) {
        point.x = point.x - item.left;
        point.y = point.y - item.top;
    }
    item.coords = JSON.stringify(coords);
}
function hitLine(x1, y1, x2, y2, pos, margin) {
    var box, distance, line;
    box = calculateLineBoxCore(x1, y1, x2, y2, margin);
    if (hitBox(box, pos.x, pos.y)) {
        if (x1 === x2) {
            if (y1 === y2) {
                return true;
            } else {
                return true;
            }
        } else {
            if (y1 === y2) {
                return true;
            } else {
                line = lineFrom2Points(x1, y1, x2, y2);
                distance = distanceLineToPoint(line, pos.x, pos.y);
                if (Math.abs(distance) >= margin) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    } else {
        return false;
    }
}
function savePoly(widget, id, left, top, coords) {
    var change, fields;
    fields = {
        left: left,
        top: top,
        coords: JSON.stringify(coords)
    };
    calculatePolygonRect(fields);
    change = {
        id: id,
        fields: fields,
        op: 'update'
    };
    updateAndKeepSelection(widget, [change]);
}
function getLineColor(visuals, element) {
    var color, config;
    config = visuals.config;
    if (visuals.highlight === element.id) {
        color = config.theme.highlight;
    } else {
        color = getThemeValue(config, element, 'lines');
    }
    return color;
}
function getLineWidth(visuals, element) {
    var config, lineWidth;
    config = visuals.config;
    if (visuals.highlight === element.id) {
        lineWidth = 2;
    } else {
        lineWidth = getThemeValue(config, element, 'lineWidth');
    }
    return lineWidth;
}
function isAboveNESW(bx, by, x, y) {
    x -= bx;
    y -= by;
    return -x > y;
}
function isAboveNWSE(bx, by, x, y) {
    x -= bx;
    y -= by;
    return x > y;
}
function buildPtrLeftCoords(left, top, width, height, aux) {
    var bottom, middle, right, y;
    right = left + width;
    bottom = top + height;
    middle = left + aux;
    y = Math.floor(top + height / 2);
    return [
        {
            x: left,
            y: y
        },
        {
            x: middle,
            y: top
        },
        {
            x: right,
            y: top
        },
        {
            x: right,
            y: bottom
        },
        {
            x: middle,
            y: bottom
        }
    ];
}
function buildPtrRightCoords(left, top, width, height, aux) {
    var bottom, middle, right, y;
    right = left + width;
    bottom = top + height;
    middle = right - aux;
    y = Math.floor(top + height / 2);
    return [
        {
            x: left,
            y: top
        },
        {
            x: middle,
            y: top
        },
        {
            x: right,
            y: y
        },
        {
            x: middle,
            y: bottom
        },
        {
            x: left,
            y: bottom
        }
    ];
}
function buildTabPath(ctx, left, top, width, height, aux) {
    var bottom, right;
    right = left + width;
    bottom = top + height;
    ctx.beginPath();
    if (aux) {
        ctx.arc(left - aux, bottom - aux, aux, Math.PI * 0.5, Math.PI * 0, true);
        ctx.arc(left + aux, top + aux, aux, Math.PI * 1, Math.PI * 1.5);
        ctx.arc(right - aux, top + aux, aux, Math.PI * 1.5, Math.PI * 2);
        ctx.arc(right + aux, bottom - aux, aux, Math.PI * 1, Math.PI * 0.5, true);
    } else {
        ctx.moveTo(left, bottom);
        ctx.lineTo(left, top);
        ctx.lineTo(right, top);
        ctx.lineTo(right, bottom);
    }
}
function calloutPath(ctx, left, top, width, height, px, py) {
    var _branch_, beginX, beginY, bottom, dpx, dpy, endX, endY, ne, nw, pwidth, radius, right, se, sw;
    _branch_ = 'Decide on side';
    while (true) {
        switch (_branch_) {
        case 'Decide on side':
            radius = 10;
            right = left + width;
            bottom = top + height;
            dpx = px + left;
            dpy = py + top;
            nw = isAboveNWSE(left, top, dpx, dpy);
            se = isAboveNWSE(right, bottom, dpx, dpy);
            ne = isAboveNESW(right, top, dpx, dpy);
            sw = isAboveNESW(left, bottom, dpx, dpy);
            ctx.beginPath();
            if (dpx < left) {
                if (nw) {
                    _branch_ = 'Up';
                } else {
                    if (sw) {
                        _branch_ = 'Left';
                    } else {
                        _branch_ = 'Down';
                    }
                }
            } else {
                if (dpx > right) {
                    if (ne) {
                        _branch_ = 'Up';
                    } else {
                        if (se) {
                            _branch_ = 'Right';
                        } else {
                            _branch_ = 'Down';
                        }
                    }
                } else {
                    if (dpy > bottom) {
                        _branch_ = 'Down';
                    } else {
                        _branch_ = 'Up';
                    }
                }
            }
            break;
        case 'Up':
            pwidth = 40;
            leftTopCorner(ctx, left, top, radius);
            beginX = findCalloutRoot(left, right, dpx, pwidth) - pwidth / 2;
            endX = beginX + pwidth;
            ctx.lineTo(beginX, top);
            ctx.lineTo(dpx, dpy);
            ctx.lineTo(endX, top);
            rightTopCorner(ctx, right, top, radius);
            rightBottomCorner(ctx, right, bottom, radius);
            leftBottomCorner(ctx, left, bottom, radius);
            _branch_ = 'Close path';
            break;
        case 'Right':
            pwidth = 20;
            leftTopCorner(ctx, left, top, radius);
            rightTopCorner(ctx, right, top, radius);
            beginY = findCalloutRoot(top, bottom, dpy, pwidth) - pwidth / 2;
            endY = beginY + pwidth;
            ctx.lineTo(right, beginY);
            ctx.lineTo(dpx, dpy);
            ctx.lineTo(right, endY);
            rightBottomCorner(ctx, right, bottom, radius);
            leftBottomCorner(ctx, left, bottom, radius);
            _branch_ = 'Close path';
            break;
        case 'Down':
            pwidth = 40;
            leftTopCorner(ctx, left, top, radius);
            rightTopCorner(ctx, right, top, radius);
            rightBottomCorner(ctx, right, bottom, radius);
            beginX = findCalloutRoot(left, right, dpx, pwidth) + pwidth / 2;
            endX = beginX - pwidth;
            ctx.lineTo(beginX, bottom);
            ctx.lineTo(dpx, dpy);
            ctx.lineTo(endX, bottom);
            leftBottomCorner(ctx, left, bottom, radius);
            _branch_ = 'Close path';
            break;
        case 'Left':
            pwidth = 20;
            leftTopCorner(ctx, left, top, radius);
            rightTopCorner(ctx, right, top, radius);
            rightBottomCorner(ctx, right, bottom, radius);
            leftBottomCorner(ctx, left, bottom, radius);
            beginY = findCalloutRoot(top, bottom, dpy, pwidth) + pwidth / 2;
            endY = beginY - pwidth;
            ctx.lineTo(left, beginY);
            ctx.lineTo(dpx, dpy);
            ctx.lineTo(left, endY);
            _branch_ = 'Close path';
            break;
        case 'Close path':
            _branch_ = undefined;
            ctx.closePath();
            break;
        default:
            return;
        }
    }
}
function circlePath(ctx, x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
}
function cloudPath(ctx, left, top, width, height) {
    var bottom, clbegin, clend, clx, cly, crbegin, crend, crx, cry, h, leftX, midY, r1, rightX, rleft, rright, scale, w, w2, x, x0, x1, x2, x3, y, y0, y1, y2, y3;
    h = height / 2;
    w = width / 2;
    x = left + w;
    y = top + h;
    r1 = Math.round(h * 2 / 3);
    bottom = y + h;
    w2 = Math.round(h * 490 / 260);
    leftX = x - w2 + r1;
    rightX = x + w2 - r1;
    midY = bottom - r1 * 2;
    x0 = x - w2 / 2;
    y0 = y - h;
    x1 = x - w2 / 4;
    y1 = y - h + r1 / 2;
    x2 = x + 0.34 * w2;
    y2 = y - h - r1 * 1.3;
    x3 = rightX;
    y3 = midY;
    rleft = r1 * 0.8;
    rright = r1 * 1.4;
    scale = w / h / 2;
    clx = x - w2 * 0.34;
    cly = midY + h * 0.16;
    clbegin = -0.9 * Math.PI;
    clend = -0.25 * Math.PI;
    crx = x + w2 * 0.2;
    cry = midY;
    crbegin = -0.9 * Math.PI;
    crend = 0;
    rright = r1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, 1);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.moveTo(leftX, bottom);
    ctx.arc(leftX, bottom - r1, r1, Math.PI / 2, Math.PI * 3 / 2);
    ctx.arc(clx, cly, rleft, clbegin, clend);
    ctx.arc(crx, cry, rright, crbegin, crend);
    ctx.arc(rightX, bottom - r1, r1, -Math.PI / 2, Math.PI / 2);
    ctx.closePath();
    ctx.restore();
}
function databaseLidPath(ctx, left, top, width, height) {
    var ctop, h, h2, scale, w, x, y;
    h = height / 2;
    w = width / 2;
    x = left + w;
    y = top + h;
    h2 = makeCylinderHeight(w);
    scale = h / h2;
    ctop = y - h2 + w;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, scale);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.arc(x, ctop, w, 0, Math.PI);
    ctx.restore();
}
function databasePath(ctx, left, top, width, height) {
    var cbottom, ctop, h, h2, scale, w, x, y;
    h = height / 2;
    w = width / 2;
    x = left + w;
    y = top + h;
    h2 = makeCylinderHeight(w);
    scale = h / h2;
    ctop = y - h2 + w;
    cbottom = y + h2 - w;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, scale);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.arc(x, ctop, w, -Math.PI, 0);
    ctx.arc(x, cbottom, w, 0, Math.PI);
    ctx.closePath();
    ctx.restore();
}
function earArrowPath(ctx, left, top, width, height) {
    var arrowHeight, arrowThickness, horIndent, x1, x2, x3, x4, x5, y1, y2, y3;
    arrowThickness = 0.3;
    arrowHeight = 0.6;
    horIndent = width * (1 - arrowThickness) / 2;
    x1 = left;
    x2 = left + horIndent;
    x3 = left + width / 2;
    x4 = left + width - horIndent;
    x5 = left + width;
    y1 = top;
    y2 = top + height * arrowHeight;
    y3 = top + height;
    ctx.beginPath();
    ctx.moveTo(x3, y1);
    ctx.lineTo(x5, y2);
    ctx.lineTo(x4, y2);
    ctx.lineTo(x4, y3);
    ctx.lineTo(x2, y3);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.closePath();
}
function ellipseShape(ctx, left, top, width, height) {
    var cx, cy, rx, ry;
    cx = Math.round(left + width / 2);
    cy = Math.round(top + height / 2);
    rx = Math.round(width / 2);
    ry = Math.round(height / 2);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
}
function findCalloutRoot(min, max, pos, width) {
    var result, size;
    size = max - min;
    if (width * 4 >= size) {
        result = min + size / 2;
    } else {
        if (pos < min + size / 3) {
            result = min + size / 4;
        } else {
            if (pos > max - size / 3) {
                result = max - size / 4;
            } else {
                result = min + size / 2;
            }
        }
    }
    return Math.round(result);
}
function leftAngle(ctx, x, y, w, h) {
    var padding, x0, x1, y0, y1;
    padding = h * 0.3;
    x0 = x - w / 3;
    x1 = x + w / 3;
    y0 = y - h + padding;
    y1 = y + h - padding;
    line2(ctx, x1, y0, x0, y, x1, y1);
}
function leftBottomCorner(ctx, x, y, radius) {
    ctx.arc(x + radius, y - radius, radius, Math.PI * 0.5, Math.PI * 1);
}
function leftTopCorner(ctx, x, y, radius) {
    ctx.arc(x + radius, y + radius, radius, Math.PI * 1, Math.PI * 1.5);
}
function makeCylinderHeight(w) {
    return Math.round(w * 10);
}
function polygonCoords(left, top, coords) {
    return coords.map(function (point) {
        return {
            x: point.x + left,
            y: point.y + top
        };
    });
}
function polygonPath(ctx, left, top, coords, radius) {
    var absCoords;
    absCoords = coords.map(function (point) {
        return {
            x: point.x + left,
            y: point.y + top,
            radius: point.radius
        };
    });
    sharpPoly(ctx, absCoords);
}
function rightAngle(ctx, x, y, w, h) {
    var padding, x0, x1, y0, y1;
    padding = h * 0.3;
    x0 = x - w / 3;
    x1 = x + w / 3;
    y0 = y - h + padding;
    y1 = y + h - padding;
    line2(ctx, x0, y0, x1, y, x0, y1);
}
function rightBottomCorner(ctx, x, y, radius) {
    ctx.arc(x - radius, y - radius, radius, Math.PI * 0, Math.PI * 0.5);
}
function rightTopCorner(ctx, x, y, radius) {
    ctx.arc(x - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 0);
}
function triPath(ctx, x0, y0, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
}
function calculateLineBox(element, margin) {
    var x1, x2, y1, y2;
    x1 = element.left;
    x2 = x1 + element.x2;
    y1 = element.top;
    y2 = y1 + element.y2;
    return calculateLineBoxCore(x1, y1, x2, y2, margin);
}
function calculateLineBoxCore(x1, y1, x2, y2, margin) {
    var bottom, height, left, right, top, width;
    left = Math.min(x1, x2);
    right = Math.max(x1, x2);
    top = Math.min(y1, y2);
    bottom = Math.max(y1, y2);
    width = right - left;
    height = bottom - top;
    return createBoxWithMargin(left, top, width, height, margin);
}
function calculateRectBox(element) {
    element.box = createBox(element.left, element.top, element.width, element.height);
}
function Callout() {
    var self = { _type: 'Callout' };
    function Callout_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Callout_canEditContent() {
        return true;
    }
    function Callout_canEditLink() {
        return true;
    }
    function Callout_canGuide() {
        return false;
    }
    function Callout_create(pos) {
        var item;
        item = {
            type: 'callout',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 50,
            px: -30,
            py: 20
        };
        return item;
    }
    function Callout_drawCandies(widget, element, ctx) {
        var handle, left, top, visuals;
        drawRectCandies(widget, element, ctx);
        visuals = widget.visuals;
        handle = CalloutPointer();
        setCommonHandleFields(widget, element, handle);
        left = element.left;
        top = element.top;
        handle.x = left + element.px;
        handle.y = top + element.py;
        handle.minX = Number.MIN_SAFE_INTEGER;
        handle.maxX = Number.MAX_SAFE_INTEGER;
        handle.minY = Number.MIN_SAFE_INTEGER;
        handle.maxY = Number.MAX_SAFE_INTEGER;
        handle.left = left;
        handle.top = top;
        handle.color = 'yellow';
        handle.primId = 'callout-' + element.id;
        createHandle(visuals, handle, ctx);
    }
    function Callout_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function Callout_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function Callout_hit(element, pos) {
        return true;
    }
    function Callout_render(visuals, element, ctx) {
        var renderCallback;
        renderCallback = function (ctx, left, top) {
            calloutPath(ctx, left, top, element.width, element.height, element.px, element.py);
        };
        renderIconShapeComplex(ctx, visuals, element, renderCallback, element.left, element.top);
        centerContentFree(visuals, element, ctx);
    }
    self.calculateBox = Callout_calculateBox;
    self.canEditContent = Callout_canEditContent;
    self.canEditLink = Callout_canEditLink;
    self.canGuide = Callout_canGuide;
    self.create = Callout_create;
    self.drawCandies = Callout_drawCandies;
    self.flow = Callout_flow;
    self.getAccepted = Callout_getAccepted;
    self.hit = Callout_hit;
    self.render = Callout_render;
    return self;
}
function Cloud() {
    var self = { _type: 'Cloud' };
    function Cloud_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Cloud_canEditContent() {
        return true;
    }
    function Cloud_canEditLink() {
        return true;
    }
    function Cloud_canGuide() {
        return true;
    }
    function Cloud_create(pos) {
        var item;
        item = {
            type: 'cloud',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 100
        };
        return item;
    }
    function Cloud_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function Cloud_flow(visuals, element) {
        var options, padding, width;
        padding = 0.08;
        options = {};
        width = Math.round(element.width * (1 - padding * 2));
        return buildTextContent(visuals, element, options, width);
    }
    function Cloud_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function Cloud_hit(element, pos) {
        return true;
    }
    function Cloud_render(visuals, element, ctx) {
        var centerY, left, padding, top;
        padding = 0.08;
        left = Math.round(element.left + element.width * padding);
        renderFreeIconShapeComplex(ctx, visuals, element, cloudPath, element.aux);
        centerY = element.top + element.height / 3 * 2;
        top = Math.floor(centerY - element.contentHeight / 2);
        renderContentCore(visuals, element, left, top);
    }
    self.calculateBox = Cloud_calculateBox;
    self.canEditContent = Cloud_canEditContent;
    self.canEditLink = Cloud_canEditLink;
    self.canGuide = Cloud_canGuide;
    self.create = Cloud_create;
    self.drawCandies = Cloud_drawCandies;
    self.flow = Cloud_flow;
    self.getAccepted = Cloud_getAccepted;
    self.hit = Cloud_hit;
    self.render = Cloud_render;
    return self;
}
function getComboButtonWidth(element) {
    return Math.round(element.height * 0.8);
}
function Combobox() {
    var self = { _type: 'Combobox' };
    function Combobox_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Combobox_canEditContent() {
        return true;
    }
    function Combobox_canEditLink() {
        return true;
    }
    function Combobox_canGuide() {
        return true;
    }
    function Combobox_create(pos) {
        var item;
        item = {
            type: 'combobox',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 30
        };
        return item;
    }
    function Combobox_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function Combobox_flow(visuals, element) {
        var options;
        options = { centerContent: false };
        return buildTextContent(visuals, element, options, element.width);
    }
    function Combobox_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function Combobox_hit(element, pos) {
        return true;
    }
    function Combobox_render(visuals, element, ctx) {
        var config, h, w, x, x0, x1, xp, y, y0, y1, yp;
        config = visuals.config;
        renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
        centerContentFree(visuals, element, ctx);
        w = Math.round(getComboButtonWidth(element) / 2);
        h = element.height / 2;
        x = element.left + element.width - w;
        y = element.top + h;
        xp = w * 0.5;
        yp = h * 0.6;
        x0 = x - w + xp;
        x1 = x + w - xp;
        y0 = y - h + yp;
        y1 = y + h - yp;
        clearShadow(ctx);
        ctx.fillStyle = getThemeValue(config, element, 'iconBorder');
        triPath(ctx, x0, y0, x1, y0, x, y1);
        ctx.fill();
    }
    self.calculateBox = Combobox_calculateBox;
    self.canEditContent = Combobox_canEditContent;
    self.canEditLink = Combobox_canEditLink;
    self.canGuide = Combobox_canGuide;
    self.create = Combobox_create;
    self.drawCandies = Combobox_drawCandies;
    self.flow = Combobox_flow;
    self.getAccepted = Combobox_getAccepted;
    self.hit = Combobox_hit;
    self.render = Combobox_render;
    return self;
}
function Database() {
    var self = { _type: 'Database' };
    function Database_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Database_canEditContent() {
        return true;
    }
    function Database_canEditLink() {
        return true;
    }
    function Database_canGuide() {
        return true;
    }
    function Database_create(pos) {
        var item;
        item = {
            type: 'database',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 200
        };
        return item;
    }
    function Database_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function Database_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function Database_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function Database_hit(element, pos) {
        return true;
    }
    function Database_render(visuals, element, ctx) {
        var centerY, top;
        renderFreeIconShapeComplex(ctx, visuals, element, databasePath, element.aux);
        databaseLidPath(ctx, element.left, element.top, element.width, element.height);
        ctx.stroke();
        centerY = Math.round(element.top + element.height / 2 + element.height * 0.05);
        top = Math.floor(centerY - element.contentHeight / 2);
        renderContentCore(visuals, element, element.left, top);
    }
    self.calculateBox = Database_calculateBox;
    self.canEditContent = Database_canEditContent;
    self.canEditLink = Database_canEditLink;
    self.canGuide = Database_canGuide;
    self.create = Database_create;
    self.drawCandies = Database_drawCandies;
    self.flow = Database_flow;
    self.getAccepted = Database_getAccepted;
    self.hit = Database_hit;
    self.render = Database_render;
    return self;
}
function Frame() {
    var self = { _type: 'Frame' };
    function Frame_calculateBox(element, config) {
        var bottom, margin, margin2, right;
        margin = config.socketTouchRadius;
        margin2 = config.socketTouchRadius / 2;
        element.innerBox = createBox(element.left, element.top, element.width, element.height);
        element.box = createBoxWithMargin(element.left, element.top, element.width, element.height, margin2);
        element.boxes = [];
        right = element.left + element.width;
        bottom = element.top + element.height;
        element.boxes.push(boxForVerticalLine(element.left, element.top, bottom, margin2));
        element.boxes.push(boxForVerticalLine(right, element.top, bottom, margin2));
        element.boxes.push(boxForHorizontalLine(element.left, element.top, right, margin2));
        element.boxes.push(boxForHorizontalLine(element.left, bottom, right, margin2));
    }
    function Frame_canEditContent() {
        return false;
    }
    function Frame_canEditLink() {
        return false;
    }
    function Frame_canGuide() {
        return true;
    }
    function Frame_create(pos) {
        var item;
        item = {
            type: 'frame',
            left: pos.x,
            top: pos.y,
            width: 300,
            height: 200
        };
        return item;
    }
    function Frame_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function Frame_flow(visuals, element) {
        var options;
        options = {};
        return undefined;
    }
    function Frame_getAccepted() {
        var accepted;
        accepted = [];
        accepted.push('lines');
        accepted.push('lineWidth');
        accepted.push('lineStyle');
        return accepted;
    }
    function Frame_hit(element, pos) {
        var _collection_178, box;
        _collection_178 = element.boxes;
        for (box of _collection_178) {
            if (hitBox(box, pos.x, pos.y)) {
                return true;
            }
        }
        return false;
    }
    function Frame_render(visuals, element, ctx) {
        var color, config, line;
        config = visuals.config;
        line = getLineWidth(visuals, element);
        color = getLineColor(visuals, element);
        ctx.lineWidth = line;
        ctx.strokeStyle = color;
        setLineDashFromStyle(config, element, line, 'lineStyle', ctx);
        renderIconShapeBorder(ctx, visuals, buildRectCoords, line, element.left, element.top, element.width, element.height, undefined);
    }
    self.calculateBox = Frame_calculateBox;
    self.canEditContent = Frame_canEditContent;
    self.canEditLink = Frame_canEditLink;
    self.canGuide = Frame_canGuide;
    self.create = Frame_create;
    self.drawCandies = Frame_drawCandies;
    self.flow = Frame_flow;
    self.getAccepted = Frame_getAccepted;
    self.hit = Frame_hit;
    self.render = Frame_render;
    return self;
}
function FreeImage() {
    var self = { _type: 'FreeImage' };
    function FreeImage_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function FreeImage_canEditContent() {
        return true;
    }
    function FreeImage_canEditLink() {
        return false;
    }
    function FreeImage_canGuide() {
        return true;
    }
    function FreeImage_create(pos) {
        var item;
        item = {
            type: 'free-image',
            left: pos.x,
            top: pos.y,
            width: 300,
            height: 200
        };
        return item;
    }
    function FreeImage_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function FreeImage_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function FreeImage_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function FreeImage_hit(element, pos) {
        return true;
    }
    function FreeImage_render(visuals, element, ctx) {
        var _branch_, bottom, cy, height, image, imageHeight, left, line, middle, textLeft, textTop, top, width;
        _branch_ = 'Fill';
        while (true) {
            switch (_branch_) {
            case 'Fill':
                left = element.left;
                top = element.top;
                width = element.width;
                height = element.height;
                bottom = top + height;
                cy = Math.round(top + height / 2);
                if (element.style) {
                    line = setFillStroke(visuals, element, ctx);
                    if (element.style.iconBack) {
                        renderIconShapeFill(ctx, visuals, buildRectCoords, left, top, width, height, undefined);
                    }
                }
                _branch_ = 'Image';
                break;
            case 'Image':
                image = visuals.images[element.image];
                imageHeight = getImageHeight(image, width);
                if (element.flowBlock && element.flowBlock.lines.length !== 0) {
                    ctx.drawImage(image.imageObj, left, top, width, imageHeight);
                    _branch_ = 'Text content';
                } else {
                    ctx.drawImage(image.imageObj, left, Math.round(cy - imageHeight / 2), width, imageHeight);
                    _branch_ = 'Border';
                }
                break;
            case 'Text content':
                textLeft = left + 1;
                middle = (imageHeight + top + bottom) / 2;
                textTop = Math.ceil(middle - element.flowBlock.height / 2);
                renderContentCore(visuals, element, textLeft, textTop);
                _branch_ = 'Border';
                break;
            case 'Border':
                if (element.style && element.style.iconBorder) {
                    renderIconShapeBorder(ctx, visuals, buildRectCoords, line, left, top, width, height, undefined);
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
    function FreeImage_renderRef(visuals, element, ctx) {
        var renderCallback;
        renderCallback = function (ctx, left, top) {
            calloutPath(ctx, left, top, element.width, element.height, element.px, element.py);
        };
        renderIconShapeComplex(ctx, visuals, element, renderCallback, element.left, element.top);
        centerContentFree(visuals, element, ctx);
    }
    self.calculateBox = FreeImage_calculateBox;
    self.canEditContent = FreeImage_canEditContent;
    self.canEditLink = FreeImage_canEditLink;
    self.canGuide = FreeImage_canGuide;
    self.create = FreeImage_create;
    self.drawCandies = FreeImage_drawCandies;
    self.flow = FreeImage_flow;
    self.getAccepted = FreeImage_getAccepted;
    self.hit = FreeImage_hit;
    self.render = FreeImage_render;
    self.renderRef = FreeImage_renderRef;
    return self;
}
function GlyphIcon() {
    var self = { _type: 'GlyphIcon' };
    function GlyphIcon_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function GlyphIcon_canEditContent() {
        return false;
    }
    function GlyphIcon_canEditLink() {
        return false;
    }
    function GlyphIcon_canGuide() {
        return true;
    }
    function GlyphIcon_create(pos) {
        var item;
        item = {
            type: self.type,
            left: pos.x,
            top: pos.y,
            width: self.width,
            height: self.height
        };
        return item;
    }
    function GlyphIcon_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function GlyphIcon_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function GlyphIcon_getAccepted() {
        var accepted;
        accepted = [];
        accepted.push('lines');
        accepted.push('lineWidth');
        return accepted;
    }
    function GlyphIcon_hit(element, pos) {
        return true;
    }
    self.calculateBox = GlyphIcon_calculateBox;
    self.canEditContent = GlyphIcon_canEditContent;
    self.canEditLink = GlyphIcon_canEditLink;
    self.canGuide = GlyphIcon_canGuide;
    self.create = GlyphIcon_create;
    self.drawCandies = GlyphIcon_drawCandies;
    self.flow = GlyphIcon_flow;
    self.getAccepted = GlyphIcon_getAccepted;
    self.hit = GlyphIcon_hit;
    return self;
}
function GroupDuration() {
    var self = { _type: 'GroupDuration' };
    function GroupDuration_calculateBox(element, config) {
        var bottomX, bottomY, height, innerRight, left, margin, right, topX, topY, width;
        element.innerBox = boxFromPoint(element.x, element.y, element.w, element.h);
        topY = element.y + element.hiY;
        bottomY = element.y + element.loY;
        topX = element.x + element.hiX;
        bottomX = element.x + element.loX;
        innerRight = element.innerBox.left + element.innerBox.width;
        left = Math.min(topX, Math.min(bottomX, element.innerBox.left));
        right = Math.max(topX, Math.max(bottomX, innerRight));
        margin = config.socketTouchRadius;
        width = right - left;
        height = bottomY - topY;
        element.box = createBoxWithMargin(left, topY, width, height, margin);
        element.subboxes = [];
        element.subboxes.push(boxForVerticalLine(element.x, topY, element.y, margin));
        element.subboxes.push(boxForVerticalLine(element.x, element.y, bottomY, margin));
        if (element.flag1) {
            element.subboxes.push(boxForHorizontalLine(element.x + element.hiX, topY, element.x, margin));
            element.subboxes.push(boxForHorizontalLine(element.x + element.loX, bottomY, element.x, margin));
        } else {
            element.subboxes.push(boxForHorizontalLine(element.x, topY, element.x + element.hiX, margin));
            element.subboxes.push(boxForHorizontalLine(element.x, bottomY, element.x + element.loX, margin));
        }
    }
    function GroupDuration_canEditContent() {
        return true;
    }
    function GroupDuration_canEditLink() {
        return true;
    }
    function GroupDuration_canGuide() {
        return false;
    }
    function GroupDuration_create(pos) {
        var item;
        item = {
            type: 'group-duration',
            flag1: self.flag1,
            x: pos.x,
            y: pos.y + 50,
            loX: 200,
            loY: 200,
            hiX: 200,
            hiY: -200
        };
        if (self.flag1 === 1) {
            item.loX = -item.loX;
            item.hiX = -item.hiX;
            item.x += 200;
        }
        return item;
    }
    function GroupDuration_drawCandies(widget, element, ctx) {
        var config;
        config = widget.visuals.config;
        standardCandy(element, ctx, config);
        drawGroupHandles(widget, element, ctx, config);
    }
    function GroupDuration_flow(visuals, element) {
        var size;
        size = contentDuration(visuals, element);
        setNodeSize(visuals.config, element, size);
        element.contentHeight = size.height;
    }
    function GroupDuration_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        accepted.push('lines');
        accepted.push('lineWidth');
        return accepted;
    }
    function GroupDuration_hit(element, pos) {
        var _collection_180, box;
        if (hitBox(element.innerBox, pos.x, pos.y)) {
            return true;
        }
        _collection_180 = element.subboxes;
        for (box of _collection_180) {
            if (hitBox(box, pos.x, pos.y)) {
                return true;
            }
        }
        return false;
    }
    function GroupDuration_render(visuals, element, ctx) {
        var _branch_, bottom, bx, cbottom, color, config, ctop, cx, cx2, dash, lineWidth, radius, top, tx, x, y;
        _branch_ = 'Set up';
        while (true) {
            switch (_branch_) {
            case 'Set up':
                config = visuals.config;
                lineWidth = getLineWidth(visuals, element);
                color = getLineColor(visuals, element);
                if (lineWidth % 2 === 0) {
                    x = element.x;
                    y = element.y;
                } else {
                    x = element.x + 0.5;
                    y = element.y + 0.5;
                }
                radius = 10;
                top = y + element.hiY;
                bottom = y + element.loY;
                ctop = top + radius;
                cbottom = bottom - radius;
                tx = x + element.hiX;
                bx = x + element.loX;
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                dash = [
                    15,
                    5
                ];
                _branch_ = 'Vertical';
                break;
            case 'Vertical':
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, ctop);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, cbottom);
                ctx.stroke();
                if (element.flag1) {
                    _branch_ = 'Right';
                } else {
                    _branch_ = 'Left';
                }
                break;
            case 'Left':
                cx = x + radius;
                cx2 = cx + radius * 2;
                ctx.beginPath();
                ctx.arc(cx, ctop, radius, Math.PI * 1, Math.PI * 1.5);
                ctx.lineTo(cx2, top);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(cx2, bottom);
                ctx.lineTo(cx, bottom);
                ctx.arc(cx, cbottom, radius, Math.PI * 0.5, Math.PI * 1);
                ctx.stroke();
                ctx.beginPath();
                ctx.setLineDash(dash);
                ctx.moveTo(cx2, top);
                ctx.lineTo(tx, top);
                ctx.stroke();
                ctx.beginPath();
                ctx.setLineDash(dash);
                ctx.moveTo(cx2, bottom);
                ctx.lineTo(bx, bottom);
                ctx.stroke();
                _branch_ = 'Icon';
                break;
            case 'Right':
                cx = x - radius;
                cx2 = cx - radius * 2;
                ctx.beginPath();
                ctx.setLineDash(dash);
                ctx.moveTo(tx, top);
                ctx.lineTo(cx2, top);
                ctx.stroke();
                ctx.beginPath();
                ctx.setLineDash([]);
                ctx.moveTo(cx2, top);
                ctx.lineTo(cx, top);
                ctx.arc(cx, ctop, radius, Math.PI * 1.5, Math.PI * 2);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(cx, cbottom, radius, 0, Math.PI * 0.5);
                ctx.lineTo(cx2, bottom);
                ctx.stroke();
                ctx.beginPath();
                ctx.setLineDash(dash);
                ctx.moveTo(bx, bottom);
                ctx.lineTo(cx2, bottom);
                ctx.stroke();
                _branch_ = 'Icon';
                break;
            case 'Icon':
                ctx.setLineDash([]);
                renderDuration(visuals, element, ctx);
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
    self.calculateBox = GroupDuration_calculateBox;
    self.canEditContent = GroupDuration_canEditContent;
    self.canEditLink = GroupDuration_canEditLink;
    self.canGuide = GroupDuration_canGuide;
    self.create = GroupDuration_create;
    self.drawCandies = GroupDuration_drawCandies;
    self.flow = GroupDuration_flow;
    self.getAccepted = GroupDuration_getAccepted;
    self.hit = GroupDuration_hit;
    self.render = GroupDuration_render;
    return self;
}
function Line() {
    var self = { _type: 'Line' };
    function Line_calculateBox(element, config) {
        var margin;
        margin = config.socketTouchRadius;
        element.margin = margin;
        element.innerBox = calculateLineBox(element, 0);
        element.box = createBoxWithMargin(element.innerBox.left, element.innerBox.top, element.innerBox.width, element.innerBox.height, margin);
    }
    function Line_canGuide() {
        return true;
    }
    function Line_create(pos) {
        var item;
        item = {
            type: 'line',
            left: pos.x,
            top: pos.y,
            x2: 100,
            y2: 100
        };
        if (self.style) {
            item.style = self.style;
        }
        return item;
    }
    function Line_drawCandies(widget, element, ctx) {
        var big, config, end, start, visuals;
        big = 4000;
        visuals = widget.visuals;
        config = visuals.config;
        start = LineStart();
        setCommonHandleFields(widget, element, start);
        start.x = element.left;
        start.y = element.top;
        start.right = element.left + element.x2;
        start.bottom = element.top + element.y2;
        start.primId = 'linestart-' + element.id;
        createHandle(visuals, start, ctx);
        end = LineEnd();
        setCommonHandleFields(widget, element, end);
        end.x = element.left + element.x2;
        end.y = element.top + element.y2;
        end.primId = 'lineend-' + element.id;
        createHandle(visuals, end, ctx);
    }
    function Line_flow(visuals, element) {
    }
    function Line_formatArrow() {
        return true;
    }
    function Line_formatLines() {
        return true;
    }
    function Line_getAccepted() {
        var accepted;
        accepted = [];
        accepted.push('lines');
        accepted.push('lineWidth');
        accepted.push('lineStyle');
        accepted.push('headStyle');
        accepted.push('tailStyle');
        return accepted;
    }
    function Line_hit(element, pos) {
        var x1, x2, y1, y2;
        x1 = element.left;
        x2 = x1 + element.x2;
        y1 = element.top;
        y2 = y1 + element.y2;
        return hitLine(x1, y1, x2, y2, pos, element.margin);
    }
    function Line_render(visuals, element, ctx) {
        var angle, color, config, iconBack, lineWidth, x1, x2, y1, y2;
        x1 = element.left;
        x2 = x1 + element.x2;
        y1 = element.top;
        y2 = y1 + element.y2;
        config = visuals.config;
        lineWidth = getLineWidth(visuals, element);
        color = getLineColor(visuals, element);
        setLineDashFromStyle(config, element, lineWidth, 'lineStyle', ctx);
        line(ctx, x1, y1, x2, y2, color, lineWidth);
        ctx.setLineDash([]);
        if (element.style && (element.style.tailStyle || element.style.headStyle)) {
            iconBack = getThemeValue(config, element, 'iconBack');
            angle = findAngle(x1, y1, x2, y2);
            drawCap(ctx, element.style.tailStyle, x1, y1, angle + Math.PI, color, iconBack, lineWidth);
            drawCap(ctx, element.style.headStyle, x2, y2, angle, color, iconBack, lineWidth);
        }
    }
    self.calculateBox = Line_calculateBox;
    self.canGuide = Line_canGuide;
    self.create = Line_create;
    self.drawCandies = Line_drawCandies;
    self.flow = Line_flow;
    self.formatArrow = Line_formatArrow;
    self.formatLines = Line_formatLines;
    self.getAccepted = Line_getAccepted;
    self.hit = Line_hit;
    self.render = Line_render;
    return self;
}
function Polygon() {
    var self = { _type: 'Polygon' };
    function Polygon_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Polygon_canEditContent() {
        return true;
    }
    function Polygon_canEditLink() {
        return true;
    }
    function Polygon_canGuide() {
        return true;
    }
    function Polygon_create(pos) {
        var item;
        item = {
            type: 'polygon',
            left: pos.x,
            top: pos.y,
            coords: self.buildCoords()
        };
        calculatePolygonRect(item);
        return item;
    }
    function Polygon_drawCandies(widget, element, ctx) {
        var handle, i, left, point, top, visuals;
        visuals = widget.visuals;
        for (i = 0; i < element.coords.length; i++) {
            point = element.coords[i];
            handle = VertexHandle();
            setCommonHandleFields(widget, element, handle);
            left = element.left;
            top = element.top;
            handle.addVertex = addVertex;
            handle.x = left + point.x;
            handle.y = top + point.y;
            handle.radius = point.radius;
            handle.minX = Number.MIN_SAFE_INTEGER;
            handle.maxX = Number.MAX_SAFE_INTEGER;
            handle.minY = Number.MIN_SAFE_INTEGER;
            handle.maxY = Number.MAX_SAFE_INTEGER;
            handle.left = left;
            handle.top = top;
            handle.color = 'yellow';
            handle.ordinal = i;
            handle.primId = 'vertex-' + i + '-' + element.id;
            createHandle(visuals, handle, ctx);
        }
    }
    function Polygon_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function Polygon_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function Polygon_hit(element, pos) {
        return true;
    }
    function Polygon_render(visuals, element, ctx) {
        var buildCoords;
        buildCoords = function (left, top) {
            return polygonCoords(left, top, element.coords);
        };
        renderFreeIconShape(ctx, visuals, element, buildCoords);
        centerContentFree(visuals, element, ctx);
    }
    self.calculateBox = Polygon_calculateBox;
    self.canEditContent = Polygon_canEditContent;
    self.canEditLink = Polygon_canEditLink;
    self.canGuide = Polygon_canGuide;
    self.create = Polygon_create;
    self.drawCandies = Polygon_drawCandies;
    self.flow = Polygon_flow;
    self.getAccepted = Polygon_getAccepted;
    self.hit = Polygon_hit;
    self.render = Polygon_render;
    return self;
}
function Polyline() {
    var self = { _type: 'Polyline' };
    function Polyline_calculateBox(element, config) {
        var margin;
        margin = config.socketTouchRadius;
        element.margin = margin;
        element.box = createBoxWithMargin(element.left, element.top, element.width, element.height, margin);
    }
    function Polyline_canEditContent() {
        return false;
    }
    function Polyline_canEditLink() {
        return false;
    }
    function Polyline_canGuide() {
        return false;
    }
    function Polyline_create(pos) {
        var coords, item;
        coords = [
            {
                x: 0,
                y: 100,
                radius: 0
            },
            {
                x: 0,
                y: 50,
                radius: 0
            },
            {
                x: 50,
                y: 0,
                radius: 0
            },
            {
                x: 200,
                y: 0,
                radius: 0
            }
        ];
        item = {
            type: 'polyline',
            left: pos.x,
            top: pos.y,
            coords: JSON.stringify(coords)
        };
        calculatePolygonRect(item);
        return item;
    }
    function Polyline_drawCandies(widget, element, ctx) {
        var handle, i, left, point, top, visuals;
        visuals = widget.visuals;
        for (i = 0; i < element.coords.length; i++) {
            point = element.coords[i];
            handle = VertexHandle();
            setCommonHandleFields(widget, element, handle);
            left = element.left;
            top = element.top;
            handle.addVertex = addLineVertex;
            handle.x = left + point.x;
            handle.y = top + point.y;
            handle.radius = point.radius;
            handle.minX = Number.MIN_SAFE_INTEGER;
            handle.maxX = Number.MAX_SAFE_INTEGER;
            handle.minY = Number.MIN_SAFE_INTEGER;
            handle.maxY = Number.MAX_SAFE_INTEGER;
            handle.left = left;
            handle.top = top;
            handle.color = 'yellow';
            handle.ordinal = i;
            handle.primId = 'vertex-' + i + '-' + element.id;
            createHandle(visuals, handle, ctx);
        }
    }
    function Polyline_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function Polyline_getAccepted() {
        var accepted;
        accepted = [];
        accepted.push('lines');
        accepted.push('lineWidth');
        accepted.push('lineStyle');
        accepted.push('headStyle');
        accepted.push('tailStyle');
        return accepted;
    }
    function Polyline_hit(element, pos) {
        var coords, curr, hit, i, left, prev, top, x1, x2, y1, y2;
        coords = element.coords;
        left = element.left;
        top = element.top;
        for (i = 1; i < coords.length; i++) {
            prev = coords[i - 1];
            curr = coords[i];
            x1 = prev.x + left;
            y1 = prev.y + top;
            x2 = curr.x + left;
            y2 = curr.y + top;
            hit = hitLine(x1, y1, x2, y2, pos, element.margin);
            if (hit) {
                return true;
            }
        }
        return false;
    }
    function Polyline_render(visuals, element, ctx) {
        var config, coords, iconBack, lineWidth, lines, minLine, style;
        style = element.style || {};
        minLine = 40;
        config = visuals.config;
        lineWidth = getLineWidth(visuals, element);
        lines = getLineColor(visuals, element);
        iconBack = getThemeValue(config, element, 'iconBack');
        setLineDashFromStyle(config, element, lineWidth, 'lineStyle', ctx);
        ctx.fillStyle = lines;
        ctx.strokeStyle = lines;
        coords = element.coords.map(function (point) {
            return {
                x: point.x + element.left,
                y: point.y + element.top
            };
        });
        multilineSharp(ctx, coords, line, lineWidth);
        drawTail(ctx, coords, style.tailStyle, line, iconBack, lineWidth);
        drawHead(ctx, coords, style.headStyle, line, iconBack, lineWidth);
    }
    self.calculateBox = Polyline_calculateBox;
    self.canEditContent = Polyline_canEditContent;
    self.canEditLink = Polyline_canEditLink;
    self.canGuide = Polyline_canGuide;
    self.create = Polyline_create;
    self.drawCandies = Polyline_drawCandies;
    self.flow = Polyline_flow;
    self.getAccepted = Polyline_getAccepted;
    self.hit = Polyline_hit;
    self.render = Polyline_render;
    return self;
}
function PtrLeft() {
    var self = { _type: 'PtrLeft' };
    function PtrLeft_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function PtrLeft_canEditContent() {
        return true;
    }
    function PtrLeft_canEditLink() {
        return true;
    }
    function PtrLeft_canGuide() {
        return true;
    }
    function PtrLeft_create(pos) {
        var item;
        item = {
            type: 'f_ptr_left',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 50,
            aux: 30
        };
        return item;
    }
    function PtrLeft_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
        createRadiusHandleLeft(widget, element, ctx);
    }
    function PtrLeft_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width - element.aux);
    }
    function PtrLeft_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function PtrLeft_hit(element, pos) {
        return true;
    }
    function PtrLeft_render(visuals, element, ctx) {
        var centerY, top;
        renderFreeIconShape(ctx, visuals, element, buildPtrLeftCoords, element.aux);
        centerY = element.top + element.height / 2;
        top = Math.floor(centerY - element.contentHeight / 2);
        renderContentCore(visuals, element, element.left + element.aux, top);
    }
    self.calculateBox = PtrLeft_calculateBox;
    self.canEditContent = PtrLeft_canEditContent;
    self.canEditLink = PtrLeft_canEditLink;
    self.canGuide = PtrLeft_canGuide;
    self.create = PtrLeft_create;
    self.drawCandies = PtrLeft_drawCandies;
    self.flow = PtrLeft_flow;
    self.getAccepted = PtrLeft_getAccepted;
    self.hit = PtrLeft_hit;
    self.render = PtrLeft_render;
    return self;
}
function PtrRight() {
    var self = { _type: 'PtrRight' };
    function PtrRight_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function PtrRight_canEditContent() {
        return true;
    }
    function PtrRight_canEditLink() {
        return true;
    }
    function PtrRight_canGuide() {
        return true;
    }
    function PtrRight_create(pos) {
        var item;
        item = {
            type: 'f_ptr_right',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 50,
            aux: 30
        };
        return item;
    }
    function PtrRight_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
        createRadiusHandle(widget, element, ctx);
    }
    function PtrRight_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width - element.aux);
    }
    function PtrRight_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function PtrRight_hit(element, pos) {
        return true;
    }
    function PtrRight_render(visuals, element, ctx) {
        renderFreeIconShape(ctx, visuals, element, buildPtrRightCoords, element.aux);
        centerContentFree(visuals, element, ctx);
    }
    self.calculateBox = PtrRight_calculateBox;
    self.canEditContent = PtrRight_canEditContent;
    self.canEditLink = PtrRight_canEditLink;
    self.canGuide = PtrRight_canGuide;
    self.create = PtrRight_create;
    self.drawCandies = PtrRight_drawCandies;
    self.flow = PtrRight_flow;
    self.getAccepted = PtrRight_getAccepted;
    self.hit = PtrRight_hit;
    self.render = PtrRight_render;
    return self;
}
function Rectangle() {
    var self = { _type: 'Rectangle' };
    function Rectangle_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Rectangle_canEditContent() {
        return true;
    }
    function Rectangle_canEditLink() {
        return true;
    }
    function Rectangle_canGuide() {
        return true;
    }
    function Rectangle_create(pos) {
        var item;
        item = {
            type: self.type,
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 50
        };
        if (self.props) {
            Object.assign(item, self.props);
        }
        return item;
    }
    function Rectangle_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function Rectangle_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function Rectangle_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return accepted;
    }
    function Rectangle_hit(element, pos) {
        return true;
    }
    self.calculateBox = Rectangle_calculateBox;
    self.canEditContent = Rectangle_canEditContent;
    self.canEditLink = Rectangle_canEditLink;
    self.canGuide = Rectangle_canGuide;
    self.create = Rectangle_create;
    self.drawCandies = Rectangle_drawCandies;
    self.flow = Rectangle_flow;
    self.getAccepted = Rectangle_getAccepted;
    self.hit = Rectangle_hit;
    return self;
}
function SimpleFree() {
    var self = { _type: 'SimpleFree' };
    function SimpleFree_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function SimpleFree_canEditContent() {
        return false;
    }
    function SimpleFree_canEditLink() {
        return false;
    }
    function SimpleFree_canGuide() {
        return true;
    }
    function SimpleFree_create(pos) {
        var item;
        item = {
            type: self.type,
            left: pos.x,
            top: pos.y,
            width: self.width,
            height: self.height
        };
        return item;
    }
    function SimpleFree_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function SimpleFree_flow(visuals, element) {
        var options;
        options = {};
        return buildTextContent(visuals, element, options, element.width);
    }
    function SimpleFree_getAccepted() {
        return [
            'iconBack',
            'iconBorder',
            'borderWidth',
            'shadowColor',
            'shadowBlur',
            'shadowOffsetX',
            'shadowOffsetY'
        ];
    }
    function SimpleFree_hit(element, pos) {
        return true;
    }
    self.calculateBox = SimpleFree_calculateBox;
    self.canEditContent = SimpleFree_canEditContent;
    self.canEditLink = SimpleFree_canEditLink;
    self.canGuide = SimpleFree_canGuide;
    self.create = SimpleFree_create;
    self.drawCandies = SimpleFree_drawCandies;
    self.flow = SimpleFree_flow;
    self.getAccepted = SimpleFree_getAccepted;
    self.hit = SimpleFree_hit;
    return self;
}
function Text() {
    var self = { _type: 'Text' };
    function Text_calculateBox(element, config) {
        calculateRectBox(element);
    }
    function Text_canEditContent() {
        return true;
    }
    function Text_canGuide() {
        return true;
    }
    function Text_create(pos) {
        var item;
        item = {
            type: 'text',
            left: pos.x,
            top: pos.y,
            width: 200,
            height: 20,
            content: '<p>Text</p>'
        };
        return item;
    }
    function Text_drawCandies(widget, element, ctx) {
        drawRectCandies(widget, element, ctx);
    }
    function Text_flow(visuals, element) {
        var options;
        options = {
            centerContent: false,
            padding: 0
        };
        return buildTextContent(visuals, element, options, element.width);
    }
    function Text_getAccepted() {
        var accepted;
        accepted = getStandardProps();
        return [
            'iconBack',
            'color',
            'font',
            'verticalAlign',
            'textAlign'
        ];
        return accepted;
    }
    function Text_hit(element, pos) {
        return true;
    }
    function Text_render(visuals, element, ctx) {
        var config, height, left, top, width;
        config = visuals.config;
        left = element.left;
        top = element.top;
        width = element.width;
        height = element.height;
        if (element.style && element.style.iconBack) {
            ctx.fillStyle = element.style.iconBack;
            ctx.fillRect(left, top, width, height);
        }
        centerContentFree(visuals, element, ctx);
    }
    self.calculateBox = Text_calculateBox;
    self.canEditContent = Text_canEditContent;
    self.canGuide = Text_canGuide;
    self.create = Text_create;
    self.drawCandies = Text_drawCandies;
    self.flow = Text_flow;
    self.getAccepted = Text_getAccepted;
    self.hit = Text_hit;
    self.render = Text_render;
    return self;
}
function createRectangular(render, type, props) {
    var self;
    self = Rectangle();
    self.type = type;
    self.render = render;
    self.props = props;
    return self;
}
function drawGroupHandles(widget, element, ctx, config) {
    var big, bottomHandle, topHandle, visuals;
    visuals = widget.visuals;
    big = 1000;
    topHandle = GroupTopHandle();
    topHandle.widget = widget;
    topHandle.element = element;
    topHandle.id = element.id;
    topHandle.x = element.hiX + element.x;
    topHandle.y = element.hiY + element.y;
    topHandle.minY = element.y - big;
    topHandle.maxY = element.y - element.h - config.metre / 2;
    bottomHandle = GroupBottomHandle();
    bottomHandle.widget = widget;
    bottomHandle.element = element;
    bottomHandle.id = element.id;
    bottomHandle.x = element.loX + element.x;
    bottomHandle.y = element.loY + element.y;
    bottomHandle.minY = element.y + element.h + config.metre / 2;
    bottomHandle.maxY = element.y + big;
    if (element.flag1) {
        topHandle.minX = element.x - big;
        topHandle.maxX = element.x - element.w;
    } else {
        topHandle.minX = element.x + element.w;
        topHandle.maxX = element.x + big;
    }
    bottomHandle.minX = topHandle.minX;
    bottomHandle.maxX = topHandle.maxX;
    topHandle.primId = 'top-' + element.id;
    bottomHandle.primId = 'bottom-' + element.id;
    createHandle(visuals, topHandle, ctx);
    createHandle(visuals, bottomHandle, ctx);
}
function drawRectCandies(widget, element, ctx) {
    var big, bottom, config, ea, left, midX, midY, ne, no, nw, right, se, so, sw, top, visuals, we;
    big = 4000;
    visuals = widget.visuals;
    config = visuals.config;
    left = element.left;
    top = element.top;
    right = element.width + left;
    bottom = element.height + top;
    midX = left + element.width / 2;
    midY = top + element.height / 2;
    nw = HandleNW();
    setCommonHandleFields(widget, element, nw);
    nw.x = left;
    nw.y = top;
    nw.minX = left - big;
    nw.maxX = right - config.freeSnap;
    nw.minY = top - big;
    nw.maxY = bottom - config.freeSnap;
    nw.right = right;
    nw.bottom = bottom;
    nw.primId = 'nw-' + element.id;
    createHandle(visuals, nw, ctx);
    we = HandleWest();
    setCommonHandleFields(widget, element, we);
    we.x = left;
    we.y = midY;
    we.minX = left - big;
    we.maxX = right - config.freeSnap;
    we.right = right;
    we.primId = 'we-' + element.id;
    createHandle(visuals, we, ctx);
    sw = HandleSW();
    setCommonHandleFields(widget, element, sw);
    sw.x = left;
    sw.y = bottom;
    sw.minX = left - big;
    sw.maxX = right - config.freeSnap;
    sw.minY = top + config.freeSnap;
    sw.maxY = bottom + big;
    sw.top = top;
    sw.right = right;
    sw.primId = 'sw-' + element.id;
    createHandle(visuals, sw, ctx);
    no = HandleNorth();
    setCommonHandleFields(widget, element, no);
    no.x = midX;
    no.y = top;
    no.minY = top - big;
    no.maxY = bottom - config.freeSnap;
    no.bottom = bottom;
    no.primId = 'no-' + element.id;
    createHandle(visuals, no, ctx);
    so = HandleSouth();
    setCommonHandleFields(widget, element, so);
    so.x = midX;
    so.y = bottom;
    so.minY = top + config.freeSnap;
    so.maxY = bottom + big;
    so.top = top;
    so.primId = 'so-' + element.id;
    createHandle(visuals, so, ctx);
    ne = HandleNE();
    setCommonHandleFields(widget, element, ne);
    ne.x = right;
    ne.y = top;
    ne.minX = left + config.freeSnap;
    ne.maxX = right + big;
    ne.minY = top - big;
    ne.maxY = bottom - config.freeSnap;
    ne.left = left;
    ne.bottom = bottom;
    ne.primId = 'ne-' + element.id;
    createHandle(visuals, ne, ctx);
    ea = HandleEast();
    setCommonHandleFields(widget, element, ea);
    ea.x = right;
    ea.y = midY;
    ea.minX = left + config.freeSnap;
    ea.maxX = right + big;
    ea.left = left;
    ea.primId = 'ea-' + element.id;
    createHandle(visuals, ea, ctx);
    se = HandleSE();
    setCommonHandleFields(widget, element, se);
    se.x = right;
    se.y = bottom;
    se.minX = left + config.freeSnap;
    se.maxX = right + big;
    se.minY = top + config.freeSnap;
    se.maxY = bottom + big;
    se.top = top;
    se.left = left;
    se.primId = 'se-' + element.id;
    createHandle(visuals, se, ctx);
}
function drawRoundedCandies(widget, element, ctx) {
    drawRectCandies(widget, element, ctx);
    createRadiusHandle(widget, element, ctx);
}
function renderCheck(visuals, element, ctx) {
    var h, w, x, x0, x1, x2, xp, y, y0, y1, yp;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    xp = w * 0.3;
    yp = h * 0.3;
    x0 = x - w + xp;
    x1 = x0 + xp;
    x2 = x + w - xp;
    y0 = y - h + yp;
    y1 = y + h - yp;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y0);
    ctx.stroke();
}
function renderCheckFalse(visuals, element, ctx) {
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
}
function renderCheckTrue(visuals, element, ctx) {
    var config, h, line, lineWidth, w, x, x0, x1, xp, y, y0, y1, yp;
    config = visuals.config;
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
    line = ctx.lineWidth || 1;
    clearShadow(ctx);
    lineWidth = getThemeValue(config, element, 'borderWidth');
    if (lineWidth === 0) {
        lineWidth = 1;
    }
    ctx.lineWidth = lineWidth;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    xp = w * 0.6;
    yp = h * 0.6;
    x0 = x - w + xp;
    y0 = y - h + yp;
    x1 = x + w - xp;
    y1 = y + h - yp;
    line2(ctx, x0, y, x, y1, x1, y0);
}
function renderComputer(visuals, element, ctx) {
    var config, h, h2, m, n, p, w, w2, x, x0, y, y0;
    config = visuals.config;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    x0 = x - w;
    y0 = y - h;
    w2 = w * 2;
    h2 = h * 2;
    p = Math.ceil(h / 10);
    m = Math.round(h2 * 0.8);
    n = Math.round(w2 * 0.2);
    setFillStroke(visuals, element, ctx);
    if (visuals.highlight === element.id) {
        ctx.fillStyle = config.theme.highlight;
    } else {
        ctx.fillStyle = getThemeValue(config, element, 'iconBorder');
    }
    ctx.fillRect(x0, y0, w2, m);
    ctx.fillRect(x - n / 2, y0 + m, n, h2 - m - p);
    ctx.fillRect(x - n, y + h - p, n * 2, p);
    clearShadow(ctx);
    ctx.fillStyle = getThemeValue(config, element, 'iconBack');
    ctx.fillRect(x0 + p, y0 + p, w2 - p * 2, m - p * 2);
}
function renderCross(visuals, element, ctx) {
    var h, w, x, x0, x1, xp, y, y0, y1, yp;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    xp = w * 0.3;
    yp = h * 0.3;
    x0 = x - w + xp;
    x1 = x + w - xp;
    y0 = y - h + yp;
    y1 = y + h - yp;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1, y0);
    ctx.lineTo(x0, y1);
    ctx.closePath();
    ctx.stroke();
}
function renderDots3H(visuals, element, ctx) {
    var h, h2, lineWidth, r, w, x, x0, x1, y;
    lineWidth = getLineWidth(visuals, element);
    ctx.fillStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    h2 = h * 0.6;
    x0 = x - h2;
    x1 = x + h2;
    r = lineWidth || 1;
    circlePath(ctx, x0, y, r);
    ctx.fill();
    circlePath(ctx, x, y, r);
    ctx.fill();
    circlePath(ctx, x1, y, r);
    ctx.fill();
}
function renderDots3V(visuals, element, ctx) {
    var h, h2, lineWidth, r, w, x, y, y0, y1;
    lineWidth = getLineWidth(visuals, element);
    ctx.fillStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    h2 = h * 0.6;
    y0 = y - h2;
    y1 = y + h2;
    r = lineWidth || 1;
    circlePath(ctx, x, y0, r);
    ctx.fill();
    circlePath(ctx, x, y, r);
    ctx.fill();
    circlePath(ctx, x, y1, r);
    ctx.fill();
}
function renderDownAngle(visuals, element, ctx) {
    var h, padding, w, x, x0, x1, y, y0, y1;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    padding = w * 0.3;
    y0 = y - h / 3;
    y1 = y + h / 3;
    x0 = x - w + padding;
    x1 = x + w - padding;
    line2(ctx, x0, y0, x, y1, x1, y0);
}
function renderEllipse(visuals, element, ctx) {
    renderFreeIconShapeComplex(ctx, visuals, element, ellipseShape, undefined, true);
    centerContentFree(visuals, element, ctx);
}
function renderHScroll(visuals, element, ctx) {
    var config, h, padding, w, x, x0, x1, x2, x3, y, y0, y1;
    config = visuals.config;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
    clearShadow(ctx);
    ctx.fillStyle = ctx.strokeStyle;
    padding = h / 4;
    y0 = y - h + padding;
    y1 = y + h - padding;
    x0 = x - w + padding;
    x1 = x - w + h * 1.5;
    x2 = x + w - h * 1.5;
    x3 = x + w - padding;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x2, y0);
    ctx.lineTo(x3, y);
    ctx.lineTo(x2, y1);
    ctx.closePath();
    ctx.fill();
}
function renderHuman(visuals, element, ctx) {
    var ar, bottom, h, h2, hx, k, l, lbok, lc, ld, left, lgr, line, ln, lpdm, m, pdm, ph, r, r2, rbok, rc, rgr, right, rpdm, top, ttop, w, w2, x, y;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    line = setFillStroke(visuals, element, ctx);
    if (mustShift(visuals.config, line)) {
        x += 0.5;
        y += 0.5;
    }
    top = y - h;
    bottom = y + h;
    w2 = w * 2;
    h2 = h * 2;
    l = Math.round(h2 * 0.4);
    m = 0;
    r2 = Math.floor((w2 - m * 3) / 8);
    r = Math.round(r2 * 1.5);
    k = Math.round(r * 2.3);
    ar = Math.round(r2 * 0.8);
    right = x + r2 * 2 + ar * 2;
    rpdm = right - ar * 2;
    rbok = rpdm - m;
    rc = rbok - r2;
    rgr = rbok - r2 * 2;
    lgr = rgr - m;
    lc = lgr - r2;
    lbok = lgr - r2 * 2;
    lpdm = lbok - m;
    left = lpdm - ar * 2;
    ln = lpdm - r2;
    hx = Math.round((lgr + rgr) / 2);
    ttop = top + k;
    pdm = ttop + ar * 2;
    ph = bottom - l;
    ld = bottom - r2;
    circlePath(ctx, hx, top + r, r);
    ctx.fill();
    clearShadow(ctx);
    ctx.stroke();
    setFillStroke(visuals, element, ctx);
    ctx.beginPath();
    ctx.moveTo(rpdm, ttop);
    ctx.arc(rpdm, pdm, ar * 2, -Math.PI / 2, 0);
    ctx.lineTo(right, ph);
    ctx.arc(right - ar, ph, ar, 0, Math.PI);
    ctx.lineTo(rpdm, pdm);
    ctx.lineTo(rbok, pdm);
    ctx.lineTo(rbok, ld);
    ctx.arc(rc, ld, r2, 0, Math.PI);
    ctx.lineTo(rgr, ph);
    ctx.lineTo(lgr, ph);
    ctx.lineTo(lgr, ld);
    ctx.arc(lc, ld, r2, 0, Math.PI);
    ctx.lineTo(lbok, pdm);
    ctx.lineTo(lpdm, pdm);
    ctx.lineTo(lpdm, ph);
    ctx.arc(lpdm - ar, ph, ar, 0, Math.PI);
    ctx.lineTo(left, ttop + ar * 2);
    ctx.arc(left + ar * 2, ttop + ar * 2, ar * 2, -Math.PI, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    clearShadow(ctx);
    ctx.stroke();
}
function renderLeftAngle(visuals, element, ctx) {
    var h, w, x, y;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    leftAngle(ctx, x, y, w, h);
}
function renderLeftAngle2(visuals, element, ctx) {
    var dx, h, w, x, y;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    dx = w / 3;
    leftAngle(ctx, x + dx, y, w, h);
    leftAngle(ctx, x - dx, y, w, h);
}
function renderMenu(visuals, element, ctx) {
    var h, line, w, x, x0, x1, xp, y, y0, y1, yp;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    line = ctx.lineWidth || 1;
    if (mustShift(visuals.config, line)) {
        x += 0.5;
        y += 0.5;
    }
    xp = Math.round(w * 0.5);
    yp = Math.round(h * 0.5);
    x0 = x - w + xp;
    x1 = x + w - xp;
    y0 = y - h + yp;
    y1 = y + h - yp;
    line1(ctx, x0, y0, x1, y0);
    line1(ctx, x0, y, x1, y);
    line1(ctx, x0, y1, x1, y1);
}
function renderNotebook(visuals, element, ctx) {
    var border, config, h, r, tp, w, x, y;
    config = visuals.config;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    border = Math.round(h / 5);
    tp = Math.round(w / 5);
    r = border;
    setFillStroke(visuals, element, ctx);
    if (visuals.highlight === element.id) {
        ctx.fillStyle = config.theme.highlight;
    } else {
        ctx.fillStyle = getThemeValue(config, element, 'iconBorder');
    }
    roundedRect(ctx, element.left + border * 2, element.top, element.width - border * 4, element.height, r);
    ctx.fill();
    ctx.fillRect(x - w, y + h - border, w * 2, border);
    clearShadow(ctx);
    ctx.fillStyle = getThemeValue(config, element, 'iconBack');
    ctx.fillRect(x - w + border * 3, y - h + border, w * 2 - border * 6, h * 2 - border * 2);
    ctx.fillRect(x - tp, y + h - border, tp * 2, border / 2);
}
function renderPhone(visuals, element, ctx) {
    var border, config, h, r, w, x, y;
    config = visuals.config;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    r = w / 5;
    border = h / 4;
    setFillStroke(visuals, element, ctx);
    if (visuals.highlight === element.id) {
        ctx.fillStyle = config.theme.highlight;
    } else {
        ctx.fillStyle = getThemeValue(config, element, 'iconBorder');
    }
    roundedRect(ctx, element.left, element.top, element.width, element.height, r);
    ctx.fill();
    clearShadow(ctx);
    ctx.fillStyle = getThemeValue(config, element, 'iconBack');
    ctx.fillRect(x - w + ctx.lineWidth, y - h + border, w * 2 - ctx.lineWidth * 2, h * 2 - border * 2);
    circlePath(ctx, x, y - h + border / 2, border / 4);
    ctx.fill();
}
function renderPlaceholder(visuals, element, ctx) {
    var bottom, config, left, line, radius, right, top;
    config = visuals.config;
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
    line = ctx.lineWidth || 1;
    clearShadow(ctx);
    radius = config.iconRadius || 0;
    left = element.left + radius;
    top = element.top + radius;
    if (mustShift(visuals.config, line)) {
        left += 0.5;
        top += 0.5;
    }
    right = left + element.width - radius * 2;
    bottom = top + element.height - radius * 2;
    line1(ctx, left, top, right, bottom);
    line1(ctx, right, top, left, bottom);
}
function renderPortrait(visuals, element, ctx) {
    var b, bottom, g, h, left, line, mx, nh, r, right, top, ux, uy, vy, w, wy, x, y;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    line = setFillStroke(visuals, element, ctx);
    if (mustShift(visuals.config, line)) {
        x += 0.5;
        y += 0.5;
    }
    left = x - w;
    right = x + w;
    top = y - h;
    bottom = y + h;
    g = 0.3;
    r = h / (2 + g);
    b = r * 0.4;
    nh = r * 0.8;
    ux = x + nh;
    uy = y + 0.2 * h;
    mx = x - nh;
    wy = y + 0.6 * h;
    vy = (uy + wy) / 2;
    ctx.beginPath();
    ctx.moveTo(x - r, top + r);
    ctx.arc(x, top + r, r, -Math.PI, 0);
    ctx.lineTo(x + r, top + r + b);
    ctx.arc(x, top + r + b, r, 0, Math.PI);
    ctx.closePath();
    ctx.fill();
    clearShadow(ctx);
    ctx.stroke();
    setFillStroke(visuals, element, ctx);
    ctx.beginPath();
    ctx.moveTo(x, wy);
    ctx.lineTo(ux, uy);
    ctx.lineTo(right, vy);
    ctx.lineTo(right, bottom);
    ctx.lineTo(left, bottom);
    ctx.lineTo(left, vy);
    ctx.lineTo(mx, uy);
    ctx.closePath();
    ctx.fill();
    clearShadow(ctx);
    ctx.stroke();
}
function renderRadioFalse(visuals, element, ctx) {
    var config, h, w, x, y;
    config = visuals.config;
    setFillStroke(visuals, element, ctx);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    circlePath(ctx, x, y, w);
    ctx.fill();
    clearShadow(ctx);
    ctx.stroke();
}
function renderRadioTrue(visuals, element, ctx) {
    var config, h, r, w, x, y;
    renderRadioFalse(visuals, element, ctx);
    config = visuals.config;
    ctx.fillStyle = getThemeValue(config, element, 'iconBorder');
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    r = w / 3;
    circlePath(ctx, x, y, r);
    ctx.fill();
}
function renderRectangle(visuals, element, ctx) {
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
    centerContentFree(visuals, element, ctx);
}
function renderRightAngle(visuals, element, ctx) {
    var h, w, x, y;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    rightAngle(ctx, x, y, w, h);
}
function renderRightAngle2(visuals, element, ctx) {
    var dx, h, w, x, y;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    dx = w / 3;
    rightAngle(ctx, x - dx, y, w, h);
    rightAngle(ctx, x + dx, y, w, h);
}
function renderRounded(visuals, element, ctx) {
    renderFreeIconShapeComplex(ctx, visuals, element, roundedRect, element.aux);
    centerContentFree(visuals, element, ctx);
}
function renderServer1(visuals, element, ctx) {
    var border, cy, h, left, line, r, right, w, w2, x, y;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    r = w / 5;
    renderFreeIconShapeComplex(ctx, visuals, element, roundedRect, r);
    line = ctx.lineWidth || 1;
    clearShadow(ctx);
    if (mustShift(visuals.config, line)) {
        x += 0.5;
        y += 0.5;
    }
    border = Math.round(h / 6);
    left = x - w + border;
    right = x + w - border;
    cy = y - h + border;
    w2 = w * 2 - border * 2;
    ctx.strokeRect(left, cy, w2, border);
    cy += border * 2;
    line1(ctx, left, cy, right, cy);
    cy += border;
    line1(ctx, left, cy, right, cy);
    cy += border;
    line1(ctx, left, cy, right, cy);
    cy += border;
    cy = y + h - border * 3;
    line1(ctx, left, cy, right, cy);
    circlePath(ctx, x, cy, border);
    ctx.fill();
    ctx.stroke();
}
function renderServer2(visuals, element, ctx) {
    var b, border, cy, h, i, left, line, r, right, top, vx, w, w2, x, y;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    r = w / 5;
    border = Math.round(h / 6);
    left = x - w + border;
    right = x + w - border;
    cy = y - h + border;
    w2 = w * 2 - border * 2;
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
    line = ctx.lineWidth || 1;
    clearShadow(ctx);
    if (mustShift(visuals.config, line)) {
        x += 0.5;
        y += 0.5;
    }
    b = Math.round(w / 8);
    vx = x - w + b * 2;
    for (i = 0; i < 4; i++) {
        line1(ctx, vx, y - h, vx, y + h);
        vx += b;
    }
    top = y - b;
    ctx.strokeRect(x + w - b * 4, top, b, b);
    ctx.strokeRect(x + w - b * 2, top, b, b);
    line1(ctx, x - w, y + b, x + w, y + b);
}
function renderSoap(visuals, element, ctx) {
    renderFreeIconShapeComplex(ctx, visuals, element, buildBeginEndPath, undefined);
    centerContentFree(visuals, element, ctx);
}
function renderTab(visuals, element, ctx) {
    var line, x, y;
    line = setFillStroke(visuals, element, ctx);
    buildTabPath(ctx, element.left, element.top, element.width, element.height, element.aux);
    ctx.closePath();
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        if (mustShift(visuals.config, line)) {
            x = element.left + 0.5;
            y = element.top + 0.5;
        } else {
            x = element.left;
            y = element.top;
        }
        buildTabPath(ctx, x, y, element.width, element.height, element.aux);
        ctx.stroke();
    }
    centerContentFree(visuals, element, ctx);
}
function renderTablet(visuals, element, ctx) {
    var border, config, h, r, w, x, y;
    config = visuals.config;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    r = w / 5;
    border = h / 4;
    setFillStroke(visuals, element, ctx);
    if (visuals.highlight === element.id) {
        ctx.fillStyle = config.theme.highlight;
    } else {
        ctx.fillStyle = getThemeValue(config, element, 'iconBorder');
    }
    roundedRect(ctx, element.left, element.top, element.width, element.height, r);
    ctx.fill();
    clearShadow(ctx);
    ctx.fillStyle = getThemeValue(config, element, 'iconBack');
    ctx.fillRect(x - w + ctx.lineWidth, y - h + border, w * 2 - ctx.lineWidth * 2, h * 2 - border * 2);
    circlePath(ctx, x, y - h + border / 2, border / 4);
    ctx.fill();
}
function renderUpAngle(visuals, element, ctx) {
    var h, padding, w, x, x0, x1, y, y0, y1;
    ctx.lineWidth = getLineWidth(visuals, element);
    ctx.strokeStyle = getLineColor(visuals, element);
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    padding = w * 0.3;
    y0 = y - h / 3;
    y1 = y + h / 3;
    x0 = x - w + padding;
    x1 = x + w - padding;
    line2(ctx, x0, y1, x, y0, x1, y1);
}
function renderVScroll(visuals, element, ctx) {
    var config, h, line, padding, w, x, x0, x1, y, y0, y1, y2, y3;
    config = visuals.config;
    w = element.width / 2;
    h = element.height / 2;
    x = element.left + w;
    y = element.top + h;
    renderFreeIconShape(ctx, visuals, element, buildRectCoords, undefined);
    line = ctx.lineWidth || 1;
    clearShadow(ctx);
    ctx.fillStyle = ctx.strokeStyle;
    padding = w / 4;
    x0 = x - w + padding;
    x1 = x + w - padding;
    y0 = y - h + padding;
    y1 = y - h + w * 1.5;
    y2 = y + h - w * 1.5;
    y3 = y + h - padding;
    ctx.beginPath();
    ctx.moveTo(x0, y1);
    ctx.lineTo(x, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y3);
    ctx.lineTo(x0, y2);
    ctx.lineTo(x1, y2);
    ctx.closePath();
    ctx.fill();
}
function setCommonHandleFields(widget, element, handle) {
    handle.widget = widget;
    handle.element = element;
    handle.id = element.id;
}
function addLineVertex(widget, id, ordinal) {
    var _branch_, _collection_182, _collection_184, _collection_186, _collection_188, cx1, cx2, cy1, cy2, dx, dy, element, len, newVertex, next, old, point, prev, radius, shift, visuals;
    _branch_ = 'Prepare';
    while (true) {
        switch (_branch_) {
        case 'Prepare':
            visuals = widget.visuals;
            radius = visuals.config.socketTouchRadius;
            shift = radius * 2;
            element = getFree(visuals, id);
            old = element.coords[ordinal];
            _branch_ = 'Find direction of shift';
            break;
        case 'Find direction of shift':
            len = element.coords.length;
            if (ordinal === 0) {
                next = element.coords[ordinal + 1];
                cx2 = next.x - old.x;
                cy2 = next.y - old.y;
                if (cx2 > 0) {
                    _branch_ = 'Move vertexes right';
                } else {
                    _branch_ = 'Move vertexes left';
                }
            } else {
                if (ordinal === len - 1) {
                    prev = element.coords[ordinal - 1];
                    cx1 = old.x - prev.x;
                    cy1 = old.y - prev.y;
                    if (cx1 > 0) {
                        _branch_ = 'Move vertexes right';
                    } else {
                        _branch_ = 'Move vertexes left';
                    }
                } else {
                    prev = element.coords[ordinal - 1];
                    next = element.coords[ordinal + 1];
                    cx1 = old.x - prev.x;
                    cx2 = next.x - old.x;
                    cy1 = old.y - prev.y;
                    cy2 = next.y - old.y;
                    if (Math.abs(cx2) > Math.abs(cy2)) {
                        if (cx1 * cx2 >= 0) {
                            if (next.x < old.x) {
                                _branch_ = 'Move vertexes left';
                            } else {
                                _branch_ = 'Move vertexes right';
                            }
                        } else {
                            if (cy2 > 0) {
                                _branch_ = 'Move vertexes up';
                            } else {
                                _branch_ = 'Move vertexes down';
                            }
                        }
                    } else {
                        if (cy1 * cy2 >= 0) {
                            if (next.y < old.y) {
                                _branch_ = 'Move vertexes up';
                            } else {
                                _branch_ = 'Move vertexes down';
                            }
                        } else {
                            if (cx2 > 0) {
                                _branch_ = 'Move vertexes right';
                            } else {
                                _branch_ = 'Move vertexes left';
                            }
                        }
                    }
                }
            }
            break;
        case 'Move vertexes up':
            dx = 0;
            dy = -shift;
            _collection_186 = element.coords;
            for (point of _collection_186) {
                if (point.y < old.y) {
                    point.y -= shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Move vertexes down':
            dx = 0;
            dy = shift;
            _collection_188 = element.coords;
            for (point of _collection_188) {
                if (point.y > old.y) {
                    point.y += shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Move vertexes left':
            dx = -shift;
            dy = 0;
            _collection_182 = element.coords;
            for (point of _collection_182) {
                if (point.x < old.x) {
                    point.x -= shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Move vertexes right':
            dx = shift;
            dy = 0;
            _collection_184 = element.coords;
            for (point of _collection_184) {
                if (point.x > old.x) {
                    point.x += shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Insert vertex':
            newVertex = {
                x: old.x + dx,
                y: old.y + dy,
                radius: 0
            };
            element.coords.splice(ordinal + 1, 0, newVertex);
            _branch_ = 'Perform edit';
            break;
        case 'Perform edit':
            _branch_ = undefined;
            savePoly(widget, id, element.left, element.top, element.coords);
            break;
        default:
            return;
        }
    }
}
function addVertex(widget, id, ordinal) {
    var _branch_, _collection_190, _collection_192, _collection_194, _collection_196, cx1, cx2, cy1, cy2, dx, dy, element, len, newVertex, next, nindex, old, pindex, point, prev, radius, shift, visuals;
    _branch_ = 'Prepare';
    while (true) {
        switch (_branch_) {
        case 'Prepare':
            visuals = widget.visuals;
            radius = visuals.config.socketTouchRadius;
            shift = radius * 2;
            element = getFree(visuals, id);
            old = element.coords[ordinal];
            _branch_ = 'Find direction of shift';
            break;
        case 'Find direction of shift':
            len = element.coords.length;
            pindex = (ordinal + len - 1) % len;
            nindex = (ordinal + 1) % len;
            prev = element.coords[pindex];
            next = element.coords[nindex];
            cx1 = old.x - prev.x;
            cx2 = next.x - old.x;
            cy1 = old.y - prev.y;
            cy2 = next.y - old.y;
            if (Math.abs(cx2) > Math.abs(cy2)) {
                if (cx1 * cx2 >= 0) {
                    if (next.x < old.x) {
                        _branch_ = 'Move vertexes left';
                    } else {
                        _branch_ = 'Move vertexes right';
                    }
                } else {
                    if (cy2 > 0) {
                        _branch_ = 'Move vertexes up';
                    } else {
                        _branch_ = 'Move vertexes down';
                    }
                }
            } else {
                if (cy1 * cy2 >= 0) {
                    if (next.y < old.y) {
                        _branch_ = 'Move vertexes up';
                    } else {
                        _branch_ = 'Move vertexes down';
                    }
                } else {
                    if (cx2 > 0) {
                        _branch_ = 'Move vertexes right';
                    } else {
                        _branch_ = 'Move vertexes left';
                    }
                }
            }
            break;
        case 'Move vertexes up':
            dx = 0;
            dy = -shift;
            _collection_194 = element.coords;
            for (point of _collection_194) {
                if (point.y < old.y) {
                    point.y -= shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Move vertexes down':
            dx = 0;
            dy = shift;
            _collection_196 = element.coords;
            for (point of _collection_196) {
                if (point.y > old.y) {
                    point.y += shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Move vertexes left':
            dx = -shift;
            dy = 0;
            _collection_190 = element.coords;
            for (point of _collection_190) {
                if (point.x < old.x) {
                    point.x -= shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Move vertexes right':
            dx = shift;
            dy = 0;
            _collection_192 = element.coords;
            for (point of _collection_192) {
                if (point.x > old.x) {
                    point.x += shift * 2;
                }
            }
            _branch_ = 'Insert vertex';
            break;
        case 'Insert vertex':
            newVertex = {
                x: old.x + dx,
                y: old.y + dy,
                radius: 0
            };
            element.coords.splice(ordinal + 1, 0, newVertex);
            _branch_ = 'Perform edit';
            break;
        case 'Perform edit':
            _branch_ = undefined;
            savePoly(widget, id, element.left, element.top, element.coords);
            break;
        default:
            return;
        }
    }
}
function bringToFront(widget, id) {
    var _branch_, edits, free, last, newZ, toDelete, toMove;
    _branch_ = 'Find item';
    while (true) {
        switch (_branch_) {
        case 'Find item':
            tracing.trace('bringToFront', id);
            edits = [];
            free = widget.visuals.free;
            last = free[free.length - 1];
            if (last.id === id) {
                if (last.zIndex < 0) {
                    _branch_ = 'Move myself';
                } else {
                    _branch_ = 'Perform edit';
                }
            } else {
                _branch_ = 'Move myself';
            }
            break;
        case 'Move myself':
            toMove = getFree(widget.visuals, id);
            if (toMove.zIndex < 0) {
                newZ = last.zIndex + 1;
            } else {
                newZ = last.zIndex;
            }
            updateItem(edits, id, { zIndex: newZ });
            _branch_ = 'Rearrange others';
            break;
        case 'Rearrange others':
            toDelete = {};
            toDelete[id] = true;
            rearrangeZOnDelete(widget, toDelete, edits);
            _branch_ = 'Perform edit';
            break;
        case 'Perform edit':
            _branch_ = undefined;
            return updateAndKeepSelection(widget, edits);
        default:
            return;
        }
    }
}
function calculateFreeBox(widget, element, config) {
    var elementActions;
    elementActions = widget.freeIcons[element.type];
    if (elementActions) {
        elementActions.calculateBox(element, config);
    } else {
        console.error('calculateFreeBox: callback not found for element of type: ' + element.type);
    }
}
function canConnect(widget, element) {
    return !widget.noConnect[element.type];
}
function canEditContent(widget, element) {
    var elementType;
    elementType = widget.freeIcons[element.type];
    if (elementType.canEditContent) {
        return elementType.canEditContent();
    } else {
        return false;
    }
}
function canEditLink(widget, element) {
    var elementActions;
    elementActions = widget.freeIcons[element.type];
    if (elementActions.canEditLink) {
        return elementActions.canEditLink();
    } else {
        return false;
    }
}
function canGuide(widget, element) {
    var elementType;
    elementType = widget.freeIcons[element.type];
    if (elementType.canGuide) {
        return elementType.canGuide();
    } else {
        return false;
    }
}
function centerContentFree(visuals, element) {
    var centerY, options, top;
    centerY = element.top + element.height / 2;
    if (element.flowBlock && element.flowBlock.options) {
        options = element.flowBlock.options;
        if (options.verticalAlign === 'top') {
            top = element.top;
        } else {
            if (options.verticalAlign === 'bottom') {
                top = element.top + element.height - element.contentHeight;
            } else {
                top = Math.ceil(centerY - element.contentHeight / 2);
            }
        }
    } else {
        top = Math.ceil(centerY - element.contentHeight / 2);
    }
    renderContentCore(visuals, element, element.left + 1, top);
}
function createGlyphIcon(widget, type, render) {
    var obj;
    obj = GlyphIcon();
    obj.type = type;
    obj.width = 20;
    obj.height = 20;
    obj.render = render;
    widget.freeIcons[type] = obj;
}
function createSimpleFree(widget, type, render, width, height) {
    var obj;
    obj = SimpleFree();
    obj.type = type;
    obj.width = width;
    obj.height = height;
    obj.render = render;
    widget.freeIcons[type] = obj;
}
function drawFreeCandies(widget, element, ctx) {
    var elementActions;
    elementActions = widget.freeIcons[element.type];
    elementActions.drawCandies(widget, element, ctx);
}
function drawFreeIcon(widget, element, ctx, visited) {
    var elementActions;
    performOnConnections(widget.visuals, element.id, visited, function (connection) {
        drawConnection(widget, connection, ctx);
    });
    ctx.setLineDash([]);
    elementActions = widget.freeIcons[element.type];
    if (elementActions) {
        elementActions.render(widget.visuals, element, ctx);
    } else {
        console.error('drawFreeIcon: callback not found for element of type: ' + element.type);
    }
}
function findFree(widget, pos) {
    var found;
    found = findFreeFront(widget, pos);
    if (found) {
        return found;
    } else {
        return findFreeBack(widget, pos);
    }
}
function findFreeBack(widget, pos) {
    var element, found, free, i, start, visited, visuals;
    visuals = widget.visuals;
    free = visuals.free;
    visited = {};
    start = undefined;
    for (i = free.length - 1; i >= 0; i--) {
        element = free[i];
        if (element.zIndex < 0) {
            start = i;
            break;
        }
    }
    if (start === undefined) {
        return undefined;
    } else {
        for (i = start; i >= 0; i--) {
            element = free[i];
            found = hitFreeOrConnection(widget, element, pos, visited);
            if (found) {
                return found;
            }
        }
        return undefined;
    }
}
function findFreeFront(widget, pos) {
    var element, found, free, i, visited, visuals;
    visuals = widget.visuals;
    free = visuals.free;
    visited = {};
    for (i = free.length - 1; i >= 0; i--) {
        element = free[i];
        if (element.zIndex < 0) {
            return undefined;
        }
        found = hitFreeOrConnection(widget, element, pos, visited);
        if (found) {
            return found;
        }
    }
    return undefined;
}
function flowFreeElement(visuals, element) {
    var config, flow;
    flow = visuals.config.iconContent[element.type];
    if (!flow) {
        flow = visuals.config.iconContent.action;
        console.error('iconContent callback not found for element of type: ' + element.type);
    }
    element.frame = flow(element, visuals.config, visuals.container);
    config = visuals.config;
    element.width = snapUp(config, element.frame.width);
    element.height = snapUp(config, element.frame.height);
    element.height = Math.max(config.minHeight, element.height);
}
function flowFreeIcon(widget, visuals, element) {
    var elementActions, size;
    elementActions = widget.freeIcons[element.type];
    size = elementActions.flow(visuals, element);
    if (size) {
        element.contentHeight = size.height;
    }
}
function freeFromItem(visuals, id, item) {
    var element;
    element = {};
    Object.assign(element, item);
    element.id = id;
    parseStyle(item, element);
    parseCoords(item, element);
    visuals.free.push(element);
    incrementImageRefCount(visuals, element.image);
    return element;
}
function getDiagramCenter(widget) {
    var metre, pos;
    pos = widgetToDiagram(widget, widget.width / 2, widget.height / 2);
    metre = widget.visuals.config.metre;
    pos.x = snapUpTo(metre, pos.x);
    pos.y = snapUpTo(metre, pos.y);
    return pos;
}
function getFree(visuals, id) {
    var _collection_198, element;
    _collection_198 = visuals.free;
    for (element of _collection_198) {
        if (element.id === id) {
            return element;
        }
    }
    return undefined;
}
function getFreeAccepted(widget, element) {
    var elementActions;
    elementActions = widget.freeIcons[element.type];
    return elementActions.getAccepted();
}
function getNextZIndex(widget) {
    var free, last;
    free = widget.visuals.free;
    if (free.length === 0) {
        return 0;
    } else {
        last = free[free.length - 1];
        return last.zIndex + 1;
    }
}
function hitFreeElement(widget, element, pos) {
    var elementActions;
    if (hitBox(element.box, pos.x, pos.y)) {
        elementActions = widget.freeIcons[element.type];
        return elementActions.hit(element, pos);
    } else {
        return false;
    }
}
function hitFreeOrConnection(widget, element, pos, visited) {
    var connection, visuals;
    visuals = widget.visuals;
    if (hitFreeElement(widget, element, pos)) {
        return element;
    } else {
        connection = performOnConnections(visuals, element.id, visited, function (conn) {
            return hitConnection(conn, pos);
        });
        if (connection) {
            return connection;
        } else {
            return undefined;
        }
    }
}
function initFreeFunctions(widget) {
    var arrow, groupLeft, groupRight, poly, rounded, tab, tri;
    widget.freeIcons = {};
    arrow = Line();
    arrow.style = JSON.stringify({ headStyle: 'arrow' });
    widget.freeIcons['group-duration'] = GroupDuration();
    widget.freeIcons['rectangle'] = createRectangular(renderRectangle, 'rectangle');
    widget.freeIcons['line'] = Line();
    widget.freeIcons['text'] = Text();
    widget.freeIcons['f_begin'] = createRectangular(renderSoap, 'f_begin');
    rounded = createRectangular(renderRounded, 'rounded', { aux: 10 });
    rounded.drawCandies = drawRoundedCandies;
    widget.freeIcons['rounded'] = rounded;
    widget.freeIcons['f_ptr_right'] = PtrRight();
    widget.freeIcons['f_ptr_left'] = PtrLeft();
    widget.freeIcons['callout'] = Callout();
    widget.freeIcons['frame'] = Frame();
    widget.freeIcons['free-image'] = FreeImage();
    widget.freeIcons['f_circle'] = createRectangular(renderEllipse, 'f_circle');
    poly = Polygon();
    poly.buildCoords = buildCoordsPoly;
    widget.freeIcons['polygon'] = poly;
    tri = Polygon();
    tri.buildCoords = buildCoordsTri;
    widget.freeIcons['triangle'] = tri;
    widget.freeIcons['polyline'] = Polyline();
    groupLeft = GroupDuration();
    groupLeft.flag1 = 1;
    groupRight = GroupDuration();
    groupRight.flag1 = 0;
    widget.freeIcons['group-duration-right'] = groupLeft;
    widget.freeIcons['group-duration-left'] = groupRight;
    widget.freeIcons['arrow'] = arrow;
    createSimpleFree(widget, 'human', renderHuman, 60, 140);
    createSimpleFree(widget, 'portrait', renderPortrait, 60, 80);
    createSimpleFree(widget, 'computer', renderComputer, 180, 120);
    createSimpleFree(widget, 'notebook', renderNotebook, 140, 80);
    createSimpleFree(widget, 'server1', renderServer1, 60, 100);
    createSimpleFree(widget, 'server2', renderServer2, 120, 40);
    createSimpleFree(widget, 'tablet', renderTablet, 80, 100);
    createSimpleFree(widget, 'phone', renderPhone, 40, 80);
    widget.freeIcons['cloud'] = Cloud();
    widget.freeIcons['database'] = Database();
    createSimpleFree(widget, 'placeholder', renderPlaceholder, 200, 140);
    widget.freeIcons['combobox'] = Combobox();
    createSimpleFree(widget, 'vscroll', renderVScroll, 20, 160);
    createSimpleFree(widget, 'hscroll', renderHScroll, 160, 20);
    createSimpleFree(widget, 'check_true', renderCheckTrue, 20, 20);
    createSimpleFree(widget, 'check_false', renderCheckFalse, 20, 20);
    createSimpleFree(widget, 'radio_true', renderRadioTrue, 20, 20);
    createSimpleFree(widget, 'radio_false', renderRadioFalse, 20, 20);
    createGlyphIcon(widget, 'check', renderCheck);
    createGlyphIcon(widget, 'cross', renderCross);
    createGlyphIcon(widget, 'left-angle', renderLeftAngle);
    createGlyphIcon(widget, 'left-angle2', renderLeftAngle2);
    createGlyphIcon(widget, 'right-angle', renderRightAngle);
    createGlyphIcon(widget, 'right-angle2', renderRightAngle2);
    createGlyphIcon(widget, 'up-angle', renderUpAngle);
    createGlyphIcon(widget, 'down-angle', renderDownAngle);
    createGlyphIcon(widget, 'menu', renderMenu);
    createGlyphIcon(widget, 'dots3v', renderDots3V);
    createGlyphIcon(widget, 'dots3h', renderDots3H);
    tab = createRectangular(renderTab, 'tab', { aux: 10 });
    tab.drawCandies = drawRoundedCandies;
    widget.freeIcons['tab'] = tab;
    widget.noConnect = {};
    widget.noConnect['line'] = true;
    widget.noConnect['connection'] = true;
    widget.noConnect['callout'] = true;
    widget.noConnect['text'] = true;
    widget.noConnect['frame'] = true;
    widget.noConnect['polyline'] = true;
    widget.noConnect['hscroll'] = true;
    widget.noConnect['vscroll'] = true;
    widget.noConnect['check_true'] = true;
    widget.noConnect['check_false'] = true;
    widget.noConnect['radio_true'] = true;
    widget.noConnect['radio_false'] = true;
    widget.noConnect['cross'] = true;
    widget.noConnect['check'] = true;
    widget.noConnect['left-angle'] = true;
    widget.noConnect['left-angle2'] = true;
    widget.noConnect['up-angle'] = true;
    widget.noConnect['right-angle'] = true;
    widget.noConnect['right-angle2'] = true;
    widget.noConnect['down-angle'] = true;
    widget.noConnect['menu'] = true;
    widget.noConnect['tab'] = true;
    widget.noConnect['dots3v'] = true;
    widget.noConnect['dots3h'] = true;
}
function insertFreeItem(widget, edits, item) {
    item.zIndex = getNextZIndex(widget);
    return createItem(widget.model, edits, item);
}
function intersectBoxes(element, frame) {
    var _collection_200, box;
    _collection_200 = element.boxes;
    for (box of _collection_200) {
        if (boxesIntersect(box, frame)) {
            return true;
        }
    }
    return false;
}
function isFree(widget, item) {
    if (widget.freeIcons[item.type]) {
        return true;
    } else {
        return false;
    }
}
function rearrangeZ(free, id, zets) {
    var element, i, ordinal, toMove;
    ordinal = utils.findIndex(free, 'id', id);
    toMove = free[ordinal];
    if (toMove.zIndex < 0) {
        for (i = 0; i < ordinal; i++) {
            element = free[i];
            element.zIndex = element.zIndex + 1;
            zets[element.id] = element.zIndex;
        }
    } else {
        for (i = ordinal + 1; i < free.length; i++) {
            element = free[i];
            element.zIndex = element.zIndex - 1;
            zets[element.id] = element.zIndex;
        }
    }
}
function rearrangeZOnDelete(widget, toDelete, edits) {
    var _, free, id, zet, zets;
    free = widget.visuals.free.map(function (element) {
        return {
            id: element.id,
            zIndex: element.zIndex
        };
    });
    zets = {};
    for (id in toDelete) {
        _ = toDelete[id];
        rearrangeZ(free, id, zets);
    }
    for (id in zets) {
        zet = zets[id];
        if (!(id in toDelete)) {
            updateItem(edits, id, { zIndex: zet });
        }
    }
}
function removeVertex(widget, id, ordinal) {
    var element, visuals;
    visuals = widget.visuals;
    element = getFree(visuals, id);
    element.coords.splice(ordinal, 1);
    savePoly(widget, id, element.left, element.top, element.coords);
}
function sendToBack(widget, id) {
    var edits, first, free, newZ, toDelete, toMove;
    tracing.trace('sendToBack', id);
    edits = [];
    free = widget.visuals.free;
    first = free[0];
    if (first.id === id && first.zIndex < 0) {
        return updateAndKeepSelection(widget, edits);
    } else {
        toMove = getFree(widget.visuals, id);
        if (toMove.zIndex < 0) {
            newZ = first.zIndex;
        } else {
            newZ = first.zIndex - 1;
        }
        updateItem(edits, id, { zIndex: newZ });
        toDelete = {};
        toDelete[id] = true;
        rearrangeZOnDelete(widget, toDelete, edits);
        return updateAndKeepSelection(widget, edits);
    }
}
function snapUp(config, size) {
    size = Math.round(size);
    return snapUpTo(config.freeSnap, size);
}
function snapUpTo(snap, size) {
    var snappedUp;
    snappedUp = Math.ceil(size / snap) * snap;
    return snappedUp;
}
function sortFreeIcons(visuals) {
    utils.sortBy(visuals.free, 'zIndex');
}
function findHorizontalCentralGuide(widget, id, box, y) {
    var _collection_204, ebox, element, found, guide, left, right;
    left = box.centerX;
    right = box.centerX;
    found = false;
    _collection_204 = widget.visuals.free;
    for (element of _collection_204) {
        if (element.id !== id && canGuide(widget, element)) {
            ebox = getGuideBox(element);
            if (ebox.centerY === y) {
                left = Math.min(left, ebox.centerX);
                right = Math.max(right, ebox.centerX);
                found = true;
            }
        }
    }
    if (found) {
        guide = {
            x1: left,
            y1: Math.round(y),
            x2: right,
            y2: Math.round(y)
        };
        widget.visuals.guides.push(guide);
    }
}
function findHorizontalGuide(widget, id, box, y) {
    var _collection_206, ebox, element, found, guide, left, right;
    left = box.left;
    right = box.right;
    found = false;
    _collection_206 = widget.visuals.free;
    for (element of _collection_206) {
        if (element.id !== id && canGuide(widget, element)) {
            ebox = getGuideBox(element);
            if (ebox.top === y || ebox.bottom === y) {
                left = Math.min(left, ebox.left);
                right = Math.max(right, ebox.right);
                found = true;
            }
        }
    }
    if (found) {
        guide = {
            x1: left,
            y1: y,
            x2: right,
            y2: y
        };
        widget.visuals.guides.push(guide);
    }
}
function findVerticalCentralGuide(widget, id, box, x) {
    var _collection_208, bottom, ebox, element, found, guide, left, right, top;
    top = box.centerY;
    bottom = box.centerY;
    found = false;
    _collection_208 = widget.visuals.free;
    for (element of _collection_208) {
        if (element.id !== id && canGuide(widget, element)) {
            ebox = getGuideBox(element);
            if (ebox.centerX === x) {
                left = Math.min(left, ebox.centerX);
                right = Math.max(right, ebox.centerX);
                top = Math.min(top, ebox.centerY);
                bottom = Math.max(bottom, ebox.centerY);
                found = true;
            }
        }
    }
    if (found) {
        guide = {
            x1: Math.round(x),
            y1: top,
            x2: Math.round(x),
            y2: bottom
        };
        widget.visuals.guides.push(guide);
    }
}
function findVerticalGuide(widget, id, box, x) {
    var _collection_210, bottom, ebox, element, found, guide, top;
    top = box.top;
    bottom = box.bottom;
    found = false;
    _collection_210 = widget.visuals.free;
    for (element of _collection_210) {
        if (element.id !== id && canGuide(widget, element)) {
            ebox = getGuideBox(element);
            if (ebox.left === x || ebox.right === x) {
                top = Math.min(top, ebox.top);
                bottom = Math.max(bottom, ebox.bottom);
                found = true;
            }
        }
    }
    if (found) {
        guide = {
            x1: x,
            y1: top,
            x2: x,
            y2: bottom
        };
        widget.visuals.guides.push(guide);
    }
}
function getGuideBox(element) {
    if (element.innerBox) {
        return element.innerBox;
    } else {
        return element.box;
    }
}
function updateHighlight(widget, prim) {
    var primId, visuals;
    visuals = widget.visuals;
    if (prim) {
        primId = prim.primId;
    } else {
        primId = undefined;
    }
    if (visuals.highlight !== primId) {
        visuals.highlight = primId;
        paintLater(widget);
    }
}
function centerContent(visuals, node) {
    var left, top;
    left = Math.floor(node.x - node.w) + 1;
    top = Math.ceil(node.y - node.contentHeight / 2);
    renderContentCore(visuals, node, left, top);
}
function centerContentBottom(visuals, node) {
    var left, top;
    left = Math.floor(node.x - node.w) + 1;
    top = Math.ceil(node.y + node.h - node.contentHeight);
    renderContentCore(visuals, node, left, top);
}
function centerContentTop(visuals, node) {
    var left, top;
    left = Math.floor(node.x - node.w) + 1;
    top = Math.ceil(node.y - node.h);
    renderContentCore(visuals, node, left, top);
}
function getThemeValue(config, node, name) {
    return getThemeValueCore(config, node.type, node.style, name);
}
function getThemeValueCore(config, type, style, name, defaultValue) {
    var forIcon, icons, theme, value;
    if (style) {
        value = style[name];
        if (utils.hasValue(value)) {
            return value;
        } else {
            theme = config.theme;
            icons = theme.icons;
            if (icons) {
                forIcon = icons[type];
                if (forIcon) {
                    value = forIcon[name];
                    if (utils.hasValue(value)) {
                        return value;
                    } else {
                        value = theme[name];
                        if (utils.hasValue(value)) {
                            return value;
                        } else {
                            value = config[name];
                            if (utils.hasValue(value)) {
                                return value;
                            } else {
                                return defaultValue;
                            }
                        }
                    }
                } else {
                    value = theme[name];
                    if (utils.hasValue(value)) {
                        return value;
                    } else {
                        value = config[name];
                        if (utils.hasValue(value)) {
                            return value;
                        } else {
                            return defaultValue;
                        }
                    }
                }
            } else {
                value = theme[name];
                if (utils.hasValue(value)) {
                    return value;
                } else {
                    value = config[name];
                    if (utils.hasValue(value)) {
                        return value;
                    } else {
                        return defaultValue;
                    }
                }
            }
        }
    } else {
        theme = config.theme;
        icons = theme.icons;
        if (icons) {
            forIcon = icons[type];
            if (forIcon) {
                value = forIcon[name];
                if (utils.hasValue(value)) {
                    return value;
                } else {
                    value = theme[name];
                    if (utils.hasValue(value)) {
                        return value;
                    } else {
                        value = config[name];
                        if (utils.hasValue(value)) {
                            return value;
                        } else {
                            return defaultValue;
                        }
                    }
                }
            } else {
                value = theme[name];
                if (utils.hasValue(value)) {
                    return value;
                } else {
                    value = config[name];
                    if (utils.hasValue(value)) {
                        return value;
                    } else {
                        return defaultValue;
                    }
                }
            }
        } else {
            value = theme[name];
            if (utils.hasValue(value)) {
                return value;
            } else {
                value = config[name];
                if (utils.hasValue(value)) {
                    return value;
                } else {
                    return defaultValue;
                }
            }
        }
    }
}
function mergeConfigs(dst, src, propName, defaultValues) {
    var merged, userValues;
    userValues = src[propName] || {};
    merged = {};
    Object.assign(merged, defaultValues);
    Object.assign(merged, userValues);
    dst[propName] = merged;
}
function getSecondaryHeightDefault(visuals, node) {
    var rect, zoom;
    if (node.topDiv) {
        rect = node.topDiv.getBoundingClientRect();
        zoom = visuals.config.zoom;
        return rect.height / zoom;
    } else {
        if (node.topFlowBlock) {
            return node.topFlowBlock.height;
        } else {
            return 0;
        }
    }
}
function measureDefault(visuals, node) {
    var config, measure;
    config = visuals.config;
    measure = config.iconContent[node.type];
    if (!measure) {
        measure = config.iconContent.action;
        console.error('iconContent callback not found for node of type: ' + node.type);
    }
    return measure(visuals, node);
}
function renderDefault(visuals, node, left, top) {
    var lowerTop;
    if (visuals.config.canvasIcons) {
        if (node.flowBlock) {
            renderFlowBlock(visuals, node.flowBlock, left, top);
        } else {
            if (node.topFlowBlock) {
                renderFlowBlock(visuals, node.topFlowBlock, left, top);
                lowerTop = top + node.topFlowBlock.height;
                renderFlowBlock(visuals, node.bottomFlowBlock, left, lowerTop);
            }
        }
    } else {
        if (node.contentDiv) {
            node.contentDiv.style.left = left + 'px';
            node.contentDiv.style.top = top + 'px';
        }
    }
}
function addDivToDiagram(visuals, mainDiv) {
    var config, rect;
    config = visuals.config;
    html.add(visuals.container, mainDiv);
    mainDiv.style.display = 'inline-block';
    mainDiv.style.position = 'absolute';
    mainDiv.style.left = '0px';
    mainDiv.style.top = '0px';
    mainDiv.style.maxWidth = config.maxWidth + 'px';
    mainDiv.style.maxHeight = config.maxHeight + 'px';
    rect = mainDiv.getBoundingClientRect();
    return {
        width: rect.width,
        height: rect.height
    };
}
function addTextToDiv(options, config, textDiv, text, fonts, font) {
    var textFormat;
    textFormat = options.textFormat || config.textFormat;
    if (textFormat === 'html') {
        addHtmltoDom(text, textDiv, fonts, font);
    } else {
        if (textFormat !== 'markdown') {
            splitToParagraphs(textDiv, text);
        }
    }
}
function buildDoubleTextContent(visuals, node, options) {
    var bottomDiv, bottomLeft, bottomRight, color, config, font, height, lineHeight, mainDiv, maxWidth, minWidth, options2, padding, secondary, text, textAlign, topDiv, topLeft, topRight, width;
    config = visuals.config;
    text = node.content || '';
    secondary = node.secondary || '';
    padding = getFromOptionsOrConfig(config, options, node, 'padding', 0);
    topLeft = padding + getConfigValue(options, 'topLeft', 0);
    topRight = padding + getConfigValue(options, 'topRight', 0);
    bottomLeft = padding + getConfigValue(options, 'bottomLeft', 0);
    bottomRight = padding + getConfigValue(options, 'bottomRight', 0);
    font = getFromOptionsOrConfig(config, options, node, 'font');
    visuals.fonts[font] = true;
    color = getFromOptionsOrConfig(config, options, node, 'color');
    textAlign = getFromOptionsOrConfig(config, options, node, 'textAlign');
    maxWidth = getFromOptionsOrConfig(config, options, node, 'maxWidth');
    minWidth = getFromOptionsOrConfig(config, options, node, 'minWidth');
    lineHeight = getFromOptionsOrConfig(config, options, node, 'lineHeight');
    if (visuals.config.canvasIcons) {
        options2 = {
            paddingLeft: topLeft,
            paddingTop: padding,
            paddingRight: topRight,
            paddingBottom: padding,
            minWidth: minWidth,
            font: font,
            color: color,
            lineHeight: lineHeight,
            textAlign: textAlign,
            centerContent: config.centerContent,
            textFormat: config.textFormat
        };
        node.topTextBlock = createTextBlock(visuals.ctx, secondary, options2, visuals.fonts);
        node.topFlowBlock = measureFlow(node.topTextBlock, minWidth, maxWidth);
        options = {
            paddingLeft: bottomLeft,
            paddingTop: padding,
            paddingRight: bottomRight,
            paddingBottom: padding,
            minWidth: minWidth,
            font: font,
            color: color,
            lineHeight: lineHeight,
            textAlign: textAlign,
            centerContent: config.centerContent,
            textFormat: config.textFormat
        };
        node.bottomTextBlock = createTextBlock(visuals.ctx, text, options, visuals.fonts);
        node.bottomFlowBlock = measureFlow(node.bottomTextBlock, minWidth, maxWidth);
        width = Math.max(node.topFlowBlock.width, node.topFlowBlock.width);
        height = node.topFlowBlock.height + node.bottomFlowBlock.height;
        return {
            width: width,
            height: height
        };
    } else {
        topDiv = div('drakon-icon-content', {
            'padding-left': topLeft + 'px',
            'padding-top': padding + 'px',
            'padding-right': topRight + 'px',
            'padding-bottom': padding + 'px',
            'text-align': textAlign,
            font: font,
            color: color,
            'min-width': minWidth + 'px',
            'max-width': maxWidth + 'px',
            'line-height': lineHeight,
            'user-select': 'none'
        });
        addTextToDiv(options, config, topDiv, secondary, visuals.fonts, font);
        node.topDiv = topDiv;
        bottomDiv = div('drakon-icon-content', {
            'padding-left': bottomLeft + 'px',
            'padding-top': padding + 'px',
            'padding-right': bottomRight + 'px',
            'padding-bottom': padding + 'px',
            'text-align': textAlign,
            font: font,
            color: color,
            'min-width': minWidth + 'px',
            'max-width': maxWidth + 'px',
            'line-height': lineHeight,
            'user-select': 'none'
        });
        addTextToDiv(options, config, bottomDiv, text, visuals.fonts, font);
        mainDiv = div();
        html.add(mainDiv, topDiv);
        html.add(mainDiv, bottomDiv);
        node.contentDiv = mainDiv;
        return addDivToDiagram(visuals, mainDiv);
    }
}
function buildTextContent(visuals, node, options, forceWidth) {
    var centerContent, color, config, font, lineHeight, maxWidth, minWidth, padding, paddingBottom, paddingLeft, paddingRight, paddingTop, text, textAlign, textDiv, toptions, verticalAlign;
    config = visuals.config;
    padding = getFromOptionsOrConfig(config, options, node, 'padding', 0);
    paddingLeft = padding + getConfigValue(options, 'paddingLeft', 0);
    paddingRight = padding + getConfigValue(options, 'paddingRight', 0);
    paddingTop = padding + getConfigValue(options, 'paddingTop', 0);
    paddingBottom = padding + getConfigValue(options, 'paddingBottom', 0);
    centerContent = getFromOptionsOrConfig(config, options, node, 'centerContent');
    font = getFromOptionsOrConfig(config, options, node, 'font');
    visuals.fonts[font] = true;
    color = getFromOptionsOrConfig(config, options, node, 'color');
    textAlign = getFromOptionsOrConfig(config, options, node, 'textAlign');
    maxWidth = getFromOptionsOrConfig(config, options, node, 'maxWidth');
    minWidth = getFromOptionsOrConfig(config, options, node, 'minWidth');
    lineHeight = getFromOptionsOrConfig(config, options, node, 'lineHeight');
    verticalAlign = getFromOptionsOrConfig(config, options, node, 'verticalAlign');
    text = node.content || '';
    if (visuals.config.canvasIcons) {
        toptions = {
            verticalAlign: verticalAlign,
            paddingLeft: paddingLeft,
            paddingTop: paddingTop,
            paddingRight: paddingRight,
            paddingBottom: paddingBottom,
            minWidth: minWidth,
            font: font,
            color: color,
            lineHeight: lineHeight,
            textAlign: textAlign,
            textFormat: config.textFormat,
            centerContent: centerContent,
            singleLine: options.singleLine,
            link: !!node.link
        };
        node.textBlock = createTextBlock(visuals.ctx, text, toptions, visuals.fonts);
        if (forceWidth) {
            node.flowBlock = flowTextBlock(node.textBlock, forceWidth);
        } else {
            node.flowBlock = measureFlow(node.textBlock, minWidth, maxWidth);
        }
        return {
            width: node.flowBlock.width,
            height: node.flowBlock.height
        };
    } else {
        textDiv = div('drakon-icon-content', {
            'padding-left': paddingLeft + 'px',
            'padding-top': paddingTop + 'px',
            'padding-right': paddingRight + 'px',
            'padding-bottom': paddingBottom + 'px',
            'text-align': textAlign,
            font: font,
            color: color,
            'min-width': minWidth + 'px',
            'max-width': maxWidth + 'px',
            'line-height': lineHeight,
            'user-select': 'none'
        });
        node.contentDiv = textDiv;
        if (options.singleLine) {
            html.addText(textDiv, text);
        } else {
            addTextToDiv(options, config, textDiv, text, visuals.fonts, font);
        }
        return addDivToDiagram(visuals, textDiv);
    }
}
function createPar(text) {
    var properties, style;
    properties = {};
    style = { text: text };
    return html.createElement('p', properties, [style]);
}
function getConfigValue(config, name, defaultValue) {
    var value;
    value = config[name];
    if (utils.hasValue(value)) {
        return value;
    } else {
        return defaultValue;
    }
}
function getFromOptionsOrConfig(config, options, node, name, defaultValue) {
    var value;
    if (node.style) {
        value = node.style[name];
        if (utils.hasValue(value)) {
            return value;
        } else {
            if (name in options) {
                return options[name];
            } else {
                return getThemeValueCore(config, node.type, node.style, name, defaultValue);
            }
        }
    } else {
        if (name in options) {
            return options[name];
        } else {
            return getThemeValueCore(config, node.type, node.style, name, defaultValue);
        }
    }
}
function measureFlow(textBlock, minWidth, maxWidth) {
    var width;
    width = Math.min(maxWidth, textBlock.width);
    width = Math.max(minWidth, width);
    return flowTextBlock(textBlock, width);
}
function splitToParagraphs(textDiv, text) {
    var line, lines, p;
    lines = text.split('\n');
    for (line of lines) {
        p = createPar(line.trim());
        html.add(textDiv, p);
    }
}
function buildIconCore(context) {
    var self;
    self = DefaultIconCore();
    Object.assign(self, context);
    return self;
}
function DefaultIconCore() {
    var self = { _type: 'DefaultIconCore' };
    function DefaultIconCore_buildDom() {
        return undefined;
    }
    function DefaultIconCore_commit(width) {
        return undefined;
    }
    function DefaultIconCore_measure(refObject) {
        return undefined;
    }
    function DefaultIconCore_renderContent(left, top, ctx) {
        return undefined;
    }
    self.buildDom = DefaultIconCore_buildDom;
    self.commit = DefaultIconCore_commit;
    self.measure = DefaultIconCore_measure;
    self.renderContent = DefaultIconCore_renderContent;
    return self;
}
function commitCore(visuals, node, width) {
    var rect, size;
    if (visuals.config.canvasIcons) {
        if (node.core && node.core.commit) {
            size = node.core.commit(width);
            if (size) {
                return size;
            } else {
                return defaultCommit(node, width);
            }
        } else {
            return defaultCommit(node, width);
        }
    } else {
        if (node.contentDiv) {
            node.contentDiv.style.width = width + 'px';
            rect = node.contentDiv.getBoundingClientRect();
            return {
                width: rect.width,
                height: rect.height
            };
        } else {
            return {
                width: 0,
                height: 0
            };
        }
    }
}
function defaultCommit(node, width) {
    var extraHeight;
    extraHeight = node.extraHeight || 0;
    if (node.textBlock) {
        node.flowBlock = flowTextBlock(node.textBlock, width);
        return {
            width: width,
            height: node.flowBlock.height + extraHeight
        };
    } else {
        if (node.topTextBlock) {
            node.topFlowBlock = flowTextBlock(node.topTextBlock, width);
            node.bottomFlowBlock = flowTextBlock(node.bottomTextBlock, width);
            return {
                width: width,
                height: node.topFlowBlock.height + node.bottomFlowBlock.height + extraHeight
            };
        } else {
            if (extraHeight) {
                return {
                    width: width,
                    height: extraHeight
                };
            } else {
                return {
                    width: 0,
                    height: 0
                };
            }
        }
    }
}
function getSecondaryHeightCore(visuals, node) {
    var core;
    core = node.core;
    if (core.getSecondaryHeight) {
        return core.getSecondaryHeight(visuals.config);
    } else {
        return getSecondaryHeightDefault(visuals, node);
    }
}
function measureCore(visuals, node) {
    var _branch_, mainDiv, size;
    _branch_ = 'Try user-defined first';
    while (true) {
        switch (_branch_) {
        case 'Try user-defined first':
            if (visuals.config.canvasIcons) {
                if (node.core.measure) {
                    size = node.core.measure(visuals.ctx, visuals.fonts);
                    if (size) {
                        return size;
                    } else {
                        _branch_ = 'Default';
                    }
                } else {
                    _branch_ = 'Default';
                }
            } else {
                mainDiv = node.core.buildDom(visuals.fonts);
                if (mainDiv) {
                    node.contentDiv = mainDiv;
                    return addDivToDiagram(visuals, mainDiv);
                } else {
                    _branch_ = 'Default';
                }
            }
            break;
        case 'Default':
            return measureDefault(visuals, node);
        case 'Exit':
            _branch_ = undefined;
            break;
        default:
            return;
        }
    }
}
function renderContentCore(visuals, node, left, top) {
    var core, implemented;
    core = node.core;
    if (core && core.renderContent) {
        implemented = core.renderContent(left, top, visuals.ctx);
        if (!implemented) {
            renderDefault(visuals, node, left, top);
        }
    } else {
        renderDefault(visuals, node, left, top);
    }
}
function buildMulitlineDiv(type, text, config, font, textAlign, color) {
    var line, lines, p, textDiv;
    text = text || '';
    textDiv = div({
        display: 'inline-block',
        position: 'absolute',
        color: color,
        left: '0px',
        top: '0px',
        font: font,
        'user-select': 'none',
        'text-align': textAlign,
        'max-width': config.width + 'px',
        'min-width': config.minWidth + 'px',
        padding: config.padding + 'px',
        lineHeight: config.lineHeight
    });
    lines = text.split('\n');
    for (line of lines) {
        p = createPar(line.trim());
        html.add(textDiv, p);
    }
    return textDiv;
}
function buildTextDiv(type, text, config, font, textAlign, color) {
    var textDiv;
    text = text || '';
    textDiv = div({
        display: 'inline-block',
        position: 'absolute',
        color: color,
        text: text,
        left: '0px',
        top: '0px',
        font: font,
        'user-select': 'none',
        'text-align': textAlign,
        'max-width': config.width + 'px',
        'min-width': config.minWidth + 'px',
        padding: config.padding + 'px',
        lineHeight: config.lineHeight
    });
    return textDiv;
}
function createLabel(container, text, config) {
    var label;
    label = div({
        display: 'inline-block',
        position: 'absolute',
        text: text,
        'user-select': 'none',
        color: config.backText,
        font: config.font,
        left: '0px',
        top: '0px'
    });
    html.add(container, label);
    return label;
}
function contentAction(visuals, node) {
    var options, width;
    if ('w' in node) {
        width = node.w * 2;
    } else {
        width = undefined;
    }
    options = {};
    return buildTextContent(visuals, node, options, width);
}
function contentAddress(visuals, node) {
    var options;
    options = {
        textAlign: 'center',
        font: visuals.config.branchFont
    };
    return buildTextContent(visuals, node, options);
}
function contentBranch(visuals, node) {
    var options;
    options = { textAlign: 'center' };
    return buildTextContent(visuals, node, options);
}
function contentCase(visuals, node) {
    var options;
    options = { textAlign: 'center' };
    return buildTextContent(visuals, node, options);
}
function contentComment(visuals, node) {
    var options;
    options = { padding: visuals.config.commentPadding + visuals.config.padding };
    return buildTextContent(visuals, node, options);
}
function contentDrImage(visuals, node) {
    var config, image, imageHeight, options, textSize, width;
    config = visuals.config;
    image = visuals.images[node.image];
    if (node.w) {
        width = node.w * 2;
    } else {
        width = getFromOptionsOrConfig(config, {}, node, 'maxWidth');
    }
    imageHeight = getImageHeight(image, width);
    node.extraHeight = imageHeight;
    if (node.content) {
        options = {};
        textSize = buildTextContent(visuals, node, options, width);
        return {
            width: width,
            height: imageHeight + textSize.height
        };
    } else {
        return {
            width: width,
            height: imageHeight
        };
    }
}
function contentDuration(visuals, node) {
    var options, padding;
    padding = visuals.config.padding * 1.5;
    options = {
        paddingLeft: padding,
        paddingRight: padding,
        textAlign: 'center'
    };
    return buildTextContent(visuals, node, options);
}
function contentEnd(visuals, node) {
    var options, padding;
    padding = visuals.config.padding / 2;
    options = {
        paddingTop: padding,
        paddingBottom: padding,
        padding: visuals.config.padding / 2,
        paddingLeft: visuals.config.padding,
        paddingRight: visuals.config.padding,
        minHeight: 0,
        minWidth: 0,
        textAlign: 'center',
        lineHeight: 1,
        singleLine: true
    };
    return buildTextContent(visuals, node, options);
}
function contentHeader(visuals, node) {
    var config, options, padding;
    config = visuals.config;
    padding = config.padding;
    options = {
        paddingLeft: padding,
        paddingRight: padding,
        textAlign: 'center',
        maxWidth: config.maxWidth * 1.4,
        lineHeight: 1,
        singleLine: true
    };
    return buildTextContent(visuals, node, options);
}
function contentInput(visuals, node) {
    var config, extra, options;
    config = visuals.config;
    extra = config.metre / 2;
    options = {
        topLeft: extra,
        topRight: extra,
        bottomLeft: config.padding + extra,
        bottomRight: 0
    };
    return buildDoubleTextContent(visuals, node, options);
}
function contentInsertion(visuals, node) {
    var options, padding;
    padding = visuals.config.insertionPadding;
    options = {
        paddingLeft: padding,
        paddingRight: padding
    };
    return buildTextContent(visuals, node, options);
}
function contentJunction(visuals, node) {
    return {
        width: 0,
        height: 0
    };
}
function contentOutput(visuals, node) {
    var config, extra, options;
    config = visuals.config;
    extra = config.metre / 2;
    options = {
        topLeft: extra,
        topRight: extra,
        bottomRight: config.padding + extra,
        bottomLeft: 0
    };
    return buildDoubleTextContent(visuals, node, options);
}
function contentProcess(visuals, node) {
    var options, padding;
    padding = visuals.config.metre / 2;
    options = {
        topLeft: padding,
        bottomRight: padding
    };
    return buildDoubleTextContent(visuals, node, options);
}
function contentQuestion(visuals, node) {
    var options, padding;
    padding = visuals.config.metre / 2;
    options = {
        paddingLeft: padding,
        paddingRight: padding
    };
    return buildTextContent(visuals, node, options);
}
function contentSelect(visuals, node) {
    var options, padding;
    padding = visuals.config.padding;
    options = {
        paddingLeft: padding,
        paddingRight: padding
    };
    return buildTextContent(visuals, node, options);
}
function contentShelf(visuals, node) {
    var options;
    options = {};
    return buildDoubleTextContent(visuals, node, options);
}
function contentSimpleInput(visuals, node) {
    var options;
    options = { paddingLeft: visuals.config.metre };
    return buildTextContent(visuals, node, options);
}
function contentSimpleOutput(visuals, node) {
    var options;
    options = { paddingRight: visuals.config.metre };
    return buildTextContent(visuals, node, options);
}
function getImageHeight(image, width) {
    var obj;
    obj = image.imageObj;
    return Math.round(width * obj.height / obj.width);
}
function renderDrakonIconShape(ctx, visuals, node, buildCoords, aux) {
    var height, left, top, width;
    left = node.x - node.w;
    top = node.y - node.h;
    width = node.w * 2;
    height = node.h * 2;
    renderIconShape(ctx, visuals, node, buildCoords, left, top, width, height, aux);
}
function renderDrakonIconShapeComplex(ctx, visuals, node, buildPath, aux) {
    var height, left, top, width;
    left = node.x - node.w;
    top = node.y - node.h;
    width = node.w * 2;
    height = node.h * 2;
    renderIconShapeComplex(ctx, visuals, node, buildPath, left, top, width, height, aux);
}
function renderFreeIconShape(ctx, visuals, node, buildCoords, aux) {
    renderIconShape(ctx, visuals, node, buildCoords, node.left, node.top, node.width, node.height, aux);
}
function renderFreeIconShapeComplex(ctx, visuals, node, buildCoords, aux, keepPos) {
    renderIconShapeComplex(ctx, visuals, node, buildCoords, node.left, node.top, node.width, node.height, aux, keepPos);
}
function renderIconShape(ctx, visuals, node, buildCoords, left, top, width, height, aux) {
    var line;
    line = setFillStroke(visuals, node, ctx);
    renderIconShapeFill(ctx, visuals, buildCoords, left, top, width, height, aux);
    renderIconShapeBorder(ctx, visuals, buildCoords, line, left, top, width, height, aux);
}
function renderIconShapeBorder(ctx, visuals, buildCoords, line, left, top, width, height, aux) {
    var coords2, radius, x, y;
    if (line) {
        radius = visuals.config.iconRadius || 0;
        if (mustShift(visuals.config, line)) {
            x = left + 0.5;
            y = top + 0.5;
        } else {
            x = left;
            y = top;
        }
        coords2 = buildCoords(x, y, width, height, aux);
        if (radius) {
            roundedPoly(ctx, coords2, radius);
        } else {
            sharpPoly(ctx, coords2);
        }
        ctx.stroke();
    }
}
function renderIconShapeComplex(ctx, visuals, node, buildPath, left, top, width, height, aux, keepPos) {
    var line, x, y;
    line = setFillStroke(visuals, node, ctx);
    buildPath(ctx, left, top, width, height, aux);
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        if (keepPos || !mustShift(visuals.config, line)) {
            x = left;
            y = top;
        } else {
            x = left + 0.5;
            y = top + 0.5;
        }
        buildPath(ctx, x, y, width, height, aux);
        ctx.stroke();
    }
}
function renderIconShapeFill(ctx, visuals, buildCoords, left, top, width, height, aux) {
    var coords, radius;
    radius = visuals.config.iconRadius || 0;
    coords = buildCoords(left, top, width, height, aux);
    if (radius) {
        roundedPoly(ctx, coords, radius);
    } else {
        sharpPoly(ctx, coords);
    }
    ctx.fill();
    clearShadow(ctx);
}
function sharpPoly(ctx, points) {
    var i, length, p, p0;
    p0 = points[0];
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    length = points.length;
    for (i = 1; i < length; i++) {
        p = points[i];
        ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
}
function buildAddressCoords(left, top, width, height, padding) {
    var bottom, middle, right, x;
    x = left + width / 2;
    right = left + width;
    bottom = top + height;
    middle = top + padding;
    return [
        {
            x: left,
            y: bottom
        },
        {
            x: left,
            y: middle
        },
        {
            x: x,
            y: top
        },
        {
            x: right,
            y: middle
        },
        {
            x: right,
            y: bottom
        }
    ];
}
function buildBeginEndPath(ctx, left, top, width, height) {
    var bottom, h, x0, x1, x2, x3, y;
    h = height / 2;
    y = top + h;
    x0 = left;
    x1 = x0 + h;
    x3 = left + width;
    x2 = x3 - h;
    bottom = top + height;
    ctx.beginPath();
    ctx.arc(x1, y, h, Math.PI * 0.5, Math.PI * 1.5);
    ctx.lineTo(x2, top);
    ctx.arc(x2, y, h, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
}
function buildBranchCoords(left, top, width, height, padding) {
    var bottom, middle, right, x;
    x = left + width / 2;
    right = left + width;
    bottom = top + height;
    middle = bottom - padding;
    return [
        {
            x: left,
            y: top
        },
        {
            x: right,
            y: top
        },
        {
            x: right,
            y: middle
        },
        {
            x: x,
            y: bottom
        },
        {
            x: left,
            y: middle
        }
    ];
}
function buildCtrlEndPath(ctx, x, y, w, h) {
    var bottom, radius, top, x0, x1, x2, x3;
    radius = h * 2;
    x0 = x - w;
    x1 = x0 + radius;
    x3 = x + w;
    x2 = x3 - radius;
    top = y - h;
    bottom = y + h;
    ctx.beginPath();
    ctx.arc(x1, top, radius, Math.PI * 0.5, Math.PI * 1);
    ctx.lineTo(x3, top);
    ctx.arc(x2, top, radius, Math.PI * 0, Math.PI * 0.5);
    ctx.closePath();
}
function buildCtrlStartPath(ctx, x, y, w, h) {
    var bottom, radius, top, x0, x1, x2, x3;
    radius = h * 2;
    x0 = x - w;
    x1 = x0 + radius;
    x3 = x + w;
    x2 = x3 - radius;
    top = y - h;
    bottom = y + h;
    ctx.beginPath();
    ctx.arc(x1, bottom, radius, Math.PI * 1, Math.PI * 1.5);
    ctx.lineTo(x2, top);
    ctx.arc(x2, bottom, radius, Math.PI * 1.5, Math.PI * 0);
    ctx.closePath();
}
function buildDurationCoords(left, top, width, height, padding) {
    var bottom, x0, x1, x2, x3;
    x0 = left;
    x1 = x0 + padding;
    x3 = left + width;
    x2 = x3 - padding;
    bottom = top + height;
    return [
        {
            x: x1,
            y: bottom
        },
        {
            x: x0,
            y: top
        },
        {
            x: x3,
            y: top
        },
        {
            x: x2,
            y: bottom
        }
    ];
}
function buildInputPath(ctx, x, y, w, h, padding, h2) {
    var x0, x1, x2, x3, x4, y0, y1, y2, y3, y4;
    x0 = x - w;
    x1 = x0 + padding;
    x2 = x1 + padding;
    x4 = x + w;
    x3 = x4 - padding;
    y0 = y - h;
    y4 = y + h;
    y3 = y0 + h2 + padding / 2;
    y1 = (y0 + y3) / 2;
    y2 = y0 + h2;
    ctx.beginPath();
    ctx.moveTo(x2, y4);
    ctx.lineTo(x2, y3);
    ctx.lineTo(x0, y3);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x0, y0);
    ctx.lineTo(x3, y0);
    ctx.lineTo(x3, y2);
    ctx.lineTo(x4, y2);
    ctx.lineTo(x4, y4);
    ctx.closePath();
}
function buildLoopBeginCoords(left, top, width, height, padding) {
    var add, bottom, x0, x1, x2, x3, y;
    add = 5;
    x0 = left - add;
    x1 = x0 + padding;
    x3 = left + width + add;
    x2 = x3 - padding;
    bottom = top + height;
    y = top + height / 2;
    return [
        {
            x: x0,
            y: y
        },
        {
            x: x1,
            y: top
        },
        {
            x: x2,
            y: top
        },
        {
            x: x3,
            y: y
        },
        {
            x: x3,
            y: bottom
        },
        {
            x: x0,
            y: bottom
        }
    ];
}
function buildLoopEndCoords(left, top, width, height, padding) {
    var add, bottom, x0, x1, x2, x3, y;
    add = 5;
    x0 = left - add;
    x1 = x0 + padding;
    x3 = left + width + add;
    x2 = x3 - padding;
    bottom = top + height;
    y = top + height / 2;
    return [
        {
            x: x0,
            y: y
        },
        {
            x: x0,
            y: top
        },
        {
            x: x3,
            y: top
        },
        {
            x: x3,
            y: y
        },
        {
            x: x2,
            y: bottom
        },
        {
            x: x1,
            y: bottom
        }
    ];
}
function buildOutputPath(ctx, x, y, w, h, padding, h2) {
    var x0, x1, x2, x3, x4, y0, y1, y2, y3, y4;
    x0 = x - w;
    x1 = x0 + padding;
    x4 = x + w;
    x3 = x4 - padding;
    x2 = x3 - padding;
    y0 = y - h;
    y4 = y + h;
    y3 = y0 + h2 + padding / 2;
    y1 = (y0 + y3) / 2;
    y2 = y0 + h2;
    ctx.beginPath();
    ctx.moveTo(x0, y4);
    ctx.lineTo(x0, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y0);
    ctx.lineTo(x3, y0);
    ctx.lineTo(x4, y1);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x2, y3);
    ctx.lineTo(x2, y4);
    ctx.closePath();
}
function buildProcessPath(ctx, x, y, w, h, padding, h2) {
    var x0, x1, x2, x3, y0, y1, y2, y3;
    x0 = x - w;
    x1 = x0 + padding;
    x3 = x + w;
    x2 = x3 - padding;
    y0 = y - h;
    y3 = y + h;
    y1 = y0 + h2;
    y2 = y0 + h2 + padding / 2;
    ctx.beginPath();
    ctx.moveTo(x0, y3);
    ctx.lineTo(x0, y1);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x1, y0);
    ctx.lineTo(x3, y0);
    ctx.lineTo(x3, y2);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2, y3);
    ctx.closePath();
}
function buildQuestionCoords(left, top, width, height, padding) {
    var bottom, x0, x1, x2, x3, y;
    x0 = left;
    x1 = x0 + padding;
    x3 = left + width;
    x2 = x3 - padding;
    bottom = top + height;
    y = top + height / 2;
    return [
        {
            x: x0,
            y: y
        },
        {
            x: x1,
            y: top
        },
        {
            x: x2,
            y: top
        },
        {
            x: x3,
            y: y
        },
        {
            x: x2,
            y: bottom
        },
        {
            x: x1,
            y: bottom
        }
    ];
}
function buildQuestionPath(ctx, x, y, w, h, padding) {
    var bottom, top, x0, x1, x2, x3;
    x0 = x - w;
    x1 = x0 + padding;
    x3 = x + w;
    x2 = x3 - padding;
    top = y - h;
    bottom = y + h;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.lineTo(x1, top);
    ctx.lineTo(x2, top);
    ctx.lineTo(x3, y);
    ctx.lineTo(x2, bottom);
    ctx.lineTo(x1, bottom);
    ctx.closePath();
}
function buildRectCoords(left, top, width, height) {
    var bottom, right;
    right = left + width;
    bottom = top + height;
    return [
        {
            x: left,
            y: top
        },
        {
            x: right,
            y: top
        },
        {
            x: right,
            y: bottom
        },
        {
            x: left,
            y: bottom
        }
    ];
}
function buildSelectCoords(left, top, width, height, padding) {
    var bottom, x0, x1, x2, x3;
    x0 = left;
    x1 = x0 + padding;
    x3 = left + width;
    x2 = x3 - padding;
    bottom = top + height;
    return [
        {
            x: x0,
            y: bottom
        },
        {
            x: x1,
            y: top
        },
        {
            x: x3,
            y: top
        },
        {
            x: x2,
            y: bottom
        }
    ];
}
function buildSimpleInputCoords(left, top, width, height, padding) {
    var bottom, right, x1, y;
    y = top + height / 2;
    right = left + width;
    bottom = top + height;
    x1 = left + padding;
    return [
        {
            x: left,
            y: top
        },
        {
            x: right,
            y: top
        },
        {
            x: right,
            y: bottom
        },
        {
            x: left,
            y: bottom
        },
        {
            x: x1,
            y: y
        }
    ];
}
function buildSimpleOutputCoords(left, top, width, height, padding) {
    var bottom, right, x1, y;
    y = top + height / 2;
    right = left + width;
    bottom = top + height;
    x1 = right - padding;
    return [
        {
            x: left,
            y: top
        },
        {
            x: x1,
            y: top
        },
        {
            x: right,
            y: y
        },
        {
            x: x1,
            y: bottom
        },
        {
            x: left,
            y: bottom
        }
    ];
}
function clearShadow(ctx) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.shadowBlur = 0;
}
function drawArrowHead(ctx, color, x, y, angle) {
    var arrowHeight, arrowWidth, thick;
    thick = 1;
    arrowWidth = 20;
    arrowHeight = 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.setLineDash([]);
    ctx.strokeStyle = color;
    ctx.lineWidth = thick;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-arrowWidth, -arrowHeight - thick);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowWidth, arrowHeight + thick);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function mustShift(config, line) {
    if (config.zoom === 1 && line % 2 === 1) {
        return true;
    } else {
        return false;
    }
}
function roundedRect(ctx, left, top, width, height, radius) {
    var bottom2, right2, x1, x2, y1, y2;
    x1 = left + radius;
    right2 = left + width;
    x2 = right2 - radius;
    y1 = top + radius;
    bottom2 = top + height;
    y2 = bottom2 - radius;
    ctx.beginPath();
    ctx.arc(x1, y1, radius, Math.PI * 1, Math.PI * 1.5);
    ctx.lineTo(x2, top);
    ctx.arc(x2, y1, radius, Math.PI * 1.5, Math.PI * 0);
    ctx.lineTo(right2, y2);
    ctx.arc(x2, y2, radius, Math.PI * 0, Math.PI * 0.5);
    ctx.lineTo(x1, bottom2);
    ctx.arc(x1, y2, radius, Math.PI * 0.5, Math.PI * 1);
    ctx.closePath();
}
function setFillStroke(visuals, node, ctx) {
    var config, lineWidth, shadowColor, theme;
    config = visuals.config;
    theme = config.theme;
    if (visuals.highlight === node.id) {
        ctx.strokeStyle = theme.highlight;
        lineWidth = 2;
    } else {
        ctx.strokeStyle = getThemeValue(config, node, 'iconBorder');
        lineWidth = getThemeValue(config, node, 'borderWidth');
    }
    ctx.fillStyle = getThemeValue(config, node, 'iconBack');
    ctx.lineWidth = lineWidth;
    shadowColor = getThemeValue(config, node, 'shadowColor');
    if (shadowColor) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = getThemeValue(config, node, 'shadowBlur') * config.zoom;
        ctx.shadowOffsetX = getThemeValue(config, node, 'shadowOffsetX') * config.zoom;
        ctx.shadowOffsetY = getThemeValue(config, node, 'shadowOffsetY') * config.zoom;
    } else {
        ctx.shadowColor = 'rgba(0, 0, 0, 0)';
        ctx.shadowBlur = 0;
    }
    setLineDashFromStyle(config, node, lineWidth, 'borderStyle', ctx);
    return lineWidth;
}
function setLineDashFromStyle(config, node, lineWidth, name, ctx) {
    var segments, style;
    if (lineWidth) {
        style = getThemeValue(config, node, name);
        if (style === 'dash1') {
            segments = [
                1,
                2
            ];
            segments[0] *= lineWidth;
            segments[1] *= lineWidth;
        } else {
            if (style === 'dash2') {
                segments = [
                    3,
                    4
                ];
                segments[0] *= lineWidth;
                segments[1] *= lineWidth;
            } else {
                if (style === 'dash3') {
                    segments = [
                        7,
                        8
                    ];
                    segments[0] *= lineWidth;
                    segments[1] *= lineWidth;
                } else {
                    if (style === 'dash4') {
                        segments = [
                            16,
                            16
                        ];
                        segments[0] *= lineWidth;
                        segments[1] *= lineWidth;
                    } else {
                        segments = [];
                    }
                }
            }
        }
    } else {
        segments = [];
    }
    ctx.setLineDash(segments);
    ctx.lineCap = 'round';
}
function renderAction(visuals, node, ctx) {
    renderDrakonIconShape(ctx, visuals, node, buildRectCoords, undefined);
    centerContent(visuals, node, ctx);
}
function renderAddress(visuals, node, ctx) {
    var h, middle, radius, top, tri, tx0, tx1, ty, w, x, y;
    tri = visuals.config.triangleHeight;
    radius = visuals.config.iconRadius || 0;
    if (radius) {
        tri -= radius;
    }
    middle = node.y - node.h + tri;
    renderDrakonIconShape(ctx, visuals, node, buildAddressCoords, tri);
    centerContentBottom(visuals, node, ctx);
    if (node.mark) {
        x = node.x;
        y = node.y;
        w = node.w;
        h = node.h;
        top = y - h;
        tx0 = x - w / 2;
        tx1 = x + w / 2;
        ty = (top + middle) / 2;
        ctx.fillStyle = visuals.config.theme.internalLine;
        ctx.beginPath();
        ctx.moveTo(tx0, ty);
        ctx.lineTo(x, top);
        ctx.lineTo(tx1, ty);
        ctx.closePath();
        ctx.fill();
    }
}
function renderBranch(visuals, node, ctx) {
    var bottom, h, middle, radius, tri, tx0, tx1, ty, w, x, y;
    tri = visuals.config.triangleHeight;
    radius = visuals.config.iconRadius || 0;
    if (radius) {
        tri -= radius;
    }
    middle = node.y + node.h - tri;
    renderDrakonIconShape(ctx, visuals, node, buildBranchCoords, tri);
    centerContentTop(visuals, node);
    if (node.mark) {
        x = node.x;
        y = node.y;
        w = node.w;
        h = node.h;
        bottom = y + h;
        tx0 = x - w / 2;
        tx1 = x + w / 2;
        ty = (bottom + middle) / 2;
        ctx.fillStyle = visuals.config.theme.internalLine;
        ctx.beginPath();
        ctx.moveTo(tx0, ty);
        ctx.lineTo(x, bottom);
        ctx.lineTo(tx1, ty);
        ctx.closePath();
        ctx.fill();
    }
}
function renderCase(visuals, node, ctx) {
    var bottom, left, middle, thickness;
    renderBranch(visuals, node, ctx);
    left = node.x - node.w;
    bottom = node.y + node.h;
    middle = bottom - visuals.config.metre;
    thickness = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    ctx.fillStyle = getThemeValue(visuals.config, node, 'internalLine');
    ctx.fillRect(left, middle, node.w * 2, thickness);
}
function renderComment(visuals, node, ctx) {
    var config, height, height2, left, left2, lineWidth, padding, theme, top, top2, width, width2;
    left = node.x - node.w;
    top = node.y - node.h;
    width = node.w * 2;
    height = node.h * 2;
    config = visuals.config;
    theme = config.theme;
    padding = config.commentPadding;
    lineWidth = setFillStroke(visuals, node, ctx);
    ctx.fillStyle = theme.commentBack;
    if (theme.shadowColor) {
        ctx.shadowColor = theme.shadowColor;
        ctx.shadowBlur = theme.shadowBlur;
    }
    renderIconShapeFill(ctx, visuals, buildRectCoords, left, top, width, height, undefined);
    renderIconShapeBorder(ctx, visuals, buildRectCoords, lineWidth, left, top, width, height, undefined);
    ctx.fillStyle = getThemeValue(config, node, 'iconBack');
    ctx.strokeStyle = getThemeValue(config, node, 'internalLine');
    left2 = left + padding;
    top2 = top + padding;
    width2 = width - padding * 2;
    height2 = height - padding * 2;
    roundedRect(ctx, left2, top2, width2, height2, padding);
    ctx.fill();
    lineWidth = getThemeValue(config, node, 'borderWidth');
    ctx.lineWidth = lineWidth || 1;
    if (mustShift(visuals.config, lineWidth)) {
        left2 += 0.5;
        top2 += 0.5;
    }
    roundedRect(ctx, left2, top2, width2, height2, padding);
    ctx.stroke();
    centerContent(visuals, node, ctx);
}
function renderCtrlEnd(visuals, node, ctx) {
    var line;
    line = setFillStroke(visuals, node, ctx);
    buildCtrlEndPath(ctx, node.x, node.y, node.w, node.h);
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        buildCtrlEndPath(ctx, node.x + 0.5, node.y + 0.5, node.w, node.h);
        ctx.stroke();
    }
    centerContent(visuals, node, ctx);
}
function renderCtrlStart(visuals, node, ctx) {
    var line;
    line = setFillStroke(visuals, node, ctx);
    buildCtrlStartPath(ctx, node.x, node.y, node.w, node.h);
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        buildCtrlStartPath(ctx, node.x + 0.5, node.y + 0.5, node.w, node.h);
        ctx.stroke();
    }
    centerContent(visuals, node, ctx);
}
function renderDrImage(visuals, node, ctx) {
    var _branch_, bottom, height, image, imageHeight, left, line, middle, textLeft, textTop, top, width;
    _branch_ = 'Fill';
    while (true) {
        switch (_branch_) {
        case 'Fill':
            left = node.x - node.w;
            top = node.y - node.h;
            width = node.w * 2;
            height = node.h * 2;
            bottom = top + height;
            line = setFillStroke(visuals, node, ctx);
            renderIconShapeFill(ctx, visuals, buildRectCoords, left, top, width, height, undefined);
            _branch_ = 'Branch1';
            break;
        case 'Branch1':
            image = visuals.images[node.image];
            imageHeight = node.extraHeight;
            if (node.flowBlock) {
                ctx.drawImage(image.imageObj, left, top, width, imageHeight);
                _branch_ = 'Text content';
            } else {
                ctx.drawImage(image.imageObj, left, Math.round(node.y - imageHeight / 2), width, imageHeight);
                _branch_ = 'Border';
            }
            break;
        case 'Text content':
            textLeft = Math.floor(node.x - node.w) + 1;
            middle = (imageHeight + top + bottom) / 2;
            textTop = Math.ceil(middle - node.flowBlock.height / 2);
            renderContentCore(visuals, node, textLeft, textTop);
            _branch_ = 'Border';
            break;
        case 'Border':
            renderIconShapeBorder(ctx, visuals, buildRectCoords, line, left, top, width, height, undefined);
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
function renderDuration(visuals, node, ctx) {
    var padding;
    padding = visuals.config.metre;
    renderDrakonIconShape(ctx, visuals, node, buildDurationCoords, padding);
    centerContent(visuals, node, ctx);
}
function renderEnd(visuals, node, ctx) {
    renderHeader(visuals, node, ctx);
}
function renderHeader(visuals, node, ctx) {
    renderDrakonIconShapeComplex(ctx, visuals, node, buildBeginEndPath, undefined);
    centerContent(visuals, node, ctx);
}
function renderInput(visuals, node, ctx) {
    var h2, left, line, middle, padding, thickness, top, x0, x1, x2, x3, y0, y1, y2;
    h2 = getSecondaryHeightCore(visuals, node);
    line = setFillStroke(visuals, node, ctx);
    padding = visuals.config.metre / 2;
    buildInputPath(ctx, node.x, node.y, node.w, node.h, padding, h2);
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        buildInputPath(ctx, node.x + 0.5, node.y + 0.5, node.w, node.h, padding, h2);
        ctx.stroke();
    }
    left = node.x - node.w;
    top = node.y - node.h;
    middle = top + h2;
    thickness = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = getThemeValue(visuals.config, node, 'internalLine');
    x0 = node.x - node.w + 0.5;
    x1 = x0 + padding * 2;
    x3 = node.x + node.w + 0.5;
    x2 = x3 - padding;
    y0 = node.y - node.h + 0.5;
    y1 = y0 + h2;
    y2 = y0 + h2 + padding / 2;
    ctx.beginPath();
    ctx.moveTo(x1, y2);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.stroke();
    centerContentTop(visuals, node);
}
function renderInsertion(visuals, node, ctx) {
    var left, right, style, thickness, top, x1, x2;
    renderAction(visuals, node, ctx);
    left = node.x - node.w;
    right = node.x + node.w;
    top = node.y - node.h;
    x1 = left + visuals.config.insertionPadding;
    x2 = right - visuals.config.insertionPadding;
    thickness = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    style = getThemeValue(visuals.config, node, 'iconBorder');
    ctx.fillStyle = getThemeValue(visuals.config, node, 'internalLine');
    ctx.fillRect(x1, top, thickness, node.h * 2);
    ctx.fillRect(x2, top, thickness, node.h * 2);
}
function renderJunction(visuals, node, ctx) {
    var color, radius, thickness, x, y;
    radius = visuals.config.lineRadius || 0;
    if (radius && shouldSmoothJunction(node)) {
        ctx.lineCap = 'butt';
        if (node.up) {
            thickness = node.up.thickness;
            color = node.up.color;
            ctx.lineWidth = thickness;
            ctx.strokeStyle = color;
            if (node.left) {
                if (node.down) {
                    if (node.right) {
                        line(ctx, node.x - radius, node.y, node.x + radius, node.y, node.right.thickness, thickness);
                        line(ctx, node.x, node.y - radius, node.x, node.y + radius, color, thickness);
                    } else {
                        if (node.down.role === 'down') {
                            x = node.x - radius;
                            y = node.y + radius;
                            arc(ctx, x, y, radius, -Math.PI / 2, 0, thickness, color);
                            line(ctx, node.x, node.y - radius, node.x, node.y + radius, color, thickness);
                        } else {
                            x = node.x - radius;
                            y = node.y - radius;
                            arc(ctx, x, y, radius, 0, Math.PI / 2, thickness, color);
                            line(ctx, node.x, node.y - radius, node.x, node.y + radius, color, thickness);
                        }
                    }
                } else {
                    if (node.right) {
                        if (node.sharp) {
                            line(ctx, node.x, node.y - radius, node.x, node.y, color, thickness);
                        } else {
                            if (node.right.role === 'left') {
                                x = node.x - radius;
                                y = node.y - radius;
                                arc(ctx, x, y, radius, 0, Math.PI / 2, thickness, color);
                            } else {
                                x = node.x + radius;
                                y = node.y - radius;
                                arc(ctx, x, y, radius, Math.PI / 2, Math.PI, thickness, color);
                            }
                        }
                        line(ctx, node.x - radius, node.y, node.x + radius, node.y, color, thickness);
                    } else {
                        x = node.x - radius;
                        y = node.y - radius;
                        arc(ctx, x, y, radius, 0, Math.PI / 2, thickness, color);
                    }
                }
            } else {
                if (node.down) {
                    line(ctx, node.x, node.y - radius, node.x, node.y + radius, color, thickness);
                    if (node.sharp) {
                        line(ctx, node.x - radius, node.y, node.x, node.y, color, thickness);
                    } else {
                        x = node.x + radius;
                        y = node.y + radius;
                        arc(ctx, x, y, radius, Math.PI, Math.PI * 3 / 2, node.right.thickness, color);
                    }
                } else {
                    x = node.x + radius;
                    y = node.y - radius;
                    arc(ctx, x, y, radius, Math.PI / 2, Math.PI, thickness, color);
                }
            }
        } else {
            if (node.down) {
                thickness = node.down.thickness;
                color = node.down.color;
                ctx.lineWidth = thickness;
                ctx.strokeStyle = color;
                if (node.right) {
                    x = node.x + radius;
                    y = node.y + radius;
                    arc(ctx, x, y, radius, Math.PI, Math.PI / 2 * 3, thickness, color);
                } else {
                    x = node.x - radius;
                    y = node.y + radius;
                    arc(ctx, x, y, radius, -Math.PI / 2, 0, thickness, color);
                }
            }
        }
    }
}
function renderLoopBegin(visuals, node, ctx) {
    renderDrakonIconShape(ctx, visuals, node, buildLoopBeginCoords, visuals.config.metre);
    centerContent(visuals, node, ctx);
}
function renderLoopEnd(visuals, node, ctx) {
    renderDrakonIconShape(ctx, visuals, node, buildLoopEndCoords, visuals.config.metre);
    centerContent(visuals, node, ctx);
}
function renderMindImage(visuals, node, ctx) {
    renderDrakonIconShapeComplex(ctx, visuals, node, roundedRect, 15);
    centerContent(visuals, node, ctx);
}
function renderOutput(visuals, node, ctx) {
    var h2, left, line, middle, padding, thickness, top, x0, x1, x2, x3, y0, y1, y2;
    h2 = getSecondaryHeightCore(visuals, node);
    line = setFillStroke(visuals, node, ctx);
    padding = visuals.config.metre / 2;
    buildOutputPath(ctx, node.x, node.y, node.w, node.h, padding, h2);
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        buildOutputPath(ctx, node.x + 0.5, node.y + 0.5, node.w, node.h, padding, h2);
        ctx.stroke();
    }
    left = node.x - node.w;
    top = node.y - node.h;
    middle = top + h2;
    thickness = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = getThemeValue(visuals.config, node, 'internalLine');
    x0 = node.x - node.w + 0.5;
    x1 = x0 + padding;
    x3 = node.x + node.w + 0.5;
    x2 = x3 - padding * 2;
    y0 = node.y - node.h + 0.5;
    y1 = y0 + h2;
    y2 = y0 + h2 + padding / 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    centerContentTop(visuals, node);
}
function renderProcess(visuals, node, ctx) {
    var h2, left, line, middle, padding, thickness, top, x0, x1, x2, x3, y0, y1, y2;
    h2 = getSecondaryHeightCore(visuals, node);
    line = setFillStroke(visuals, node, ctx);
    padding = visuals.config.metre / 2;
    buildProcessPath(ctx, node.x, node.y, node.w, node.h, padding, h2);
    ctx.fill();
    clearShadow(ctx);
    if (line) {
        buildProcessPath(ctx, node.x + 0.5, node.y + 0.5, node.w, node.h, padding, h2);
        ctx.stroke();
    }
    left = node.x - node.w;
    top = node.y - node.h;
    middle = top + h2;
    thickness = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    ctx.strokeStyle = getThemeValue(visuals.config, node, 'internalLine');
    x0 = node.x - node.w + 0.5;
    x1 = x0 + padding;
    x3 = node.x + node.w + 0.5;
    x2 = x3 - padding;
    y0 = node.y - node.h + 0.5;
    y1 = y0 + h2;
    y2 = y0 + h2 + padding / 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    centerContentTop(visuals, node);
}
function renderQuestion(visuals, node, ctx) {
    var extra, height, left, leftText, leftWidth, leftX, leftY, noDiv, noRect, rightText, rightX, rightY, thickness, top, width, yesDiv, yesRect;
    extra = 3;
    left = node.x - node.w - extra;
    top = node.y - node.h;
    width = node.w * 2 + extra * 2;
    height = node.h * 2;
    renderIconShape(ctx, visuals, node, buildQuestionCoords, left, top, width, height, visuals.config.metre);
    centerContent(visuals, node, ctx);
    if (visuals.config.canvasLabels) {
        thickness = visuals.config.theme.lineWidth || 1;
        if (node.flag1) {
            leftText = visuals.config.yes;
            rightText = visuals.config.no;
        } else {
            leftText = visuals.config.no;
            rightText = visuals.config.yes;
        }
        ctx.fillStyle = visuals.config.theme.backText;
        ctx.font = visuals.config.canvasLabels;
        leftWidth = ctx.measureText(leftText).width;
        leftX = node.x - 2 - thickness;
        leftY = node.y + node.h + 3;
        rightX = node.x + node.w + 3;
        rightY = node.y - 2 - thickness;
        ctx.textAlign = 'right';
        leftY = prepareTextRender(visuals, ctx, visuals.config.canvasLabelsSize, leftY + visuals.config.canvasLabelsSize * 1.1);
        ctx.fillText(leftText, leftX, leftY);
        ctx.textAlign = 'left';
        rightY = prepareTextRender(visuals, ctx, visuals.config.canvasLabelsSize, rightY);
        ctx.fillText(rightText, rightX, rightY);
    } else {
        if (node.flag1) {
            yesDiv = node.frame.yesDiv;
            noDiv = node.frame.noDiv;
        } else {
            noDiv = node.frame.yesDiv;
            yesDiv = node.frame.noDiv;
        }
        yesRect = yesDiv.getBoundingClientRect();
        noRect = noDiv.getBoundingClientRect();
        yesDiv.style.top = node.y + node.h + 2 + 'px';
        yesDiv.style.left = node.x - yesRect.width - 2 + 'px';
        noDiv.style.top = node.y - noRect.height + 'px';
        noDiv.style.left = node.x + node.w + 'px';
    }
}
function renderRidea(visuals, node, ctx) {
    renderDrakonIconShapeComplex(ctx, visuals, node, roundedRect, 15);
    centerContent(visuals, node, ctx);
}
function renderSelect(visuals, node, ctx) {
    var padding;
    padding = visuals.config.metre / 2;
    renderDrakonIconShape(ctx, visuals, node, buildSelectCoords, padding);
    centerContent(visuals, node, ctx);
}
function renderShelf(visuals, node, ctx) {
    var h2, height, left, middle, thickness, top, width;
    renderDrakonIconShape(ctx, visuals, node, buildRectCoords, undefined);
    left = node.x - node.w;
    top = node.y - node.h;
    width = node.w * 2;
    height = node.h * 2;
    h2 = getSecondaryHeightCore(visuals, node);
    middle = Math.round(top + h2);
    thickness = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    ctx.setLineDash([]);
    ctx.fillStyle = getThemeValue(visuals.config, node, 'internalLine');
    ctx.fillRect(left, middle, node.w * 2, thickness);
    centerContentTop(visuals, node);
}
function renderSimpleInput(visuals, node, ctx) {
    renderDrakonIconShape(ctx, visuals, node, buildSimpleInputCoords, visuals.config.metre);
    centerContent(visuals, node, ctx);
}
function renderSimpleOutput(visuals, node, ctx) {
    renderDrakonIconShape(ctx, visuals, node, buildSimpleOutputCoords, visuals.config.metre);
    centerContent(visuals, node, ctx);
}
function renderTimer(visuals, node, ctx) {
    var bottom, left, padding, right, top, x1, x1low, x2, x2low;
    padding = visuals.config.metre;
    renderDuration(visuals, node, ctx);
    left = node.x - node.w;
    right = node.x + node.w;
    top = node.y - node.h;
    bottom = node.y + node.h;
    x1 = left + visuals.config.insertionPadding;
    x2 = right - visuals.config.insertionPadding;
    x1low = x1 + padding;
    x2low = x2 - padding;
    ctx.lineWidth = getThemeValue(visuals.config, node, 'borderWidth') || 1;
    ctx.strokeStyle = getThemeValue(visuals.config, node, 'internalLine');
    ctx.beginPath();
    ctx.moveTo(x1, top);
    ctx.lineTo(x1low, bottom);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, top);
    ctx.lineTo(x2low, bottom);
    ctx.stroke();
}
function flowIcon(visuals, node) {
    var config, context, existingW, size;
    existingW = node.w;
    config = visuals.config;
    context = {
        type: node.type,
        content: node.content,
        secondary: node.secondary,
        link: node.link,
        style: node.style,
        flag1: node.flag1,
        margin: node.margin || 0,
        config: config
    };
    node.core = config.buildIconCore(context);
    size = measureCore(visuals, node);
    setNodeSize(config, node, size);
    if (existingW) {
        node.w = existingW;
    }
}
function initAlignedNodes(output, input) {
    var defaultValues;
    defaultValues = {
        action: true,
        question: true,
        'case': true,
        select: true,
        branch: true,
        address: true,
        loopbegin: true,
        loopend: true,
        insertion: true,
        comment: true,
        simpleinput: true,
        simpleoutput: true,
        shelf: true,
        input: true,
        output: true,
        process: true,
        'drakon-image': true
    };
    mergeConfigs(output, input, 'alignedNodes', defaultValues);
}
function initIconContent(output, input) {
    var defaultValues;
    defaultValues = {
        action: contentAction,
        idea: contentAction,
        ridea: contentAction,
        question: contentQuestion,
        'case': contentCase,
        select: contentSelect,
        branch: contentBranch,
        address: contentAddress,
        end: contentEnd,
        junction: contentJunction,
        'arrow-loop': contentJunction,
        header: contentHeader,
        loopbegin: contentAction,
        loopend: contentAction,
        params: contentAction,
        comment: contentComment,
        conclusion: contentComment,
        insertion: contentInsertion,
        simpleinput: contentSimpleInput,
        simpleoutput: contentSimpleOutput,
        duration: contentDuration,
        timer: contentDuration,
        pause: contentDuration,
        ctrlstart: contentDuration,
        ctrlend: contentDuration,
        shelf: contentShelf,
        process: contentProcess,
        output: contentOutput,
        input: contentInput,
        'drakon-image': contentDrImage,
        'graf-image': contentDrImage
    };
    mergeConfigs(output, input, 'iconContent', defaultValues);
}
function initIconRender(output, input) {
    var defaultValues;
    defaultValues = {
        action: renderAction,
        idea: renderAction,
        ridea: renderRidea,
        question: renderQuestion,
        'case': renderCase,
        select: renderSelect,
        branch: renderBranch,
        address: renderAddress,
        end: renderEnd,
        junction: renderJunction,
        'arrow-loop': renderJunction,
        header: renderHeader,
        loopbegin: renderLoopBegin,
        loopend: renderLoopEnd,
        params: renderAction,
        comment: renderComment,
        conclusion: renderComment,
        insertion: renderInsertion,
        simpleinput: renderSimpleInput,
        simpleoutput: renderSimpleOutput,
        duration: renderDuration,
        pause: renderDuration,
        timer: renderTimer,
        ctrlstart: renderCtrlStart,
        ctrlend: renderCtrlEnd,
        shelf: renderShelf,
        process: renderProcess,
        output: renderOutput,
        input: renderInput,
        'drakon-image': renderDrImage,
        'graf-image': renderDrImage
    };
    mergeConfigs(output, input, 'iconRender', defaultValues);
}
function reflowIcon(visuals, node) {
    var _selectValue_212, config, size;
    config = visuals.config;
    size = commitCore(visuals, node, node.w * 2);
    setNodeSize(config, node, size);
    node.contentHeight = size.height;
    _selectValue_212 = node.type;
    if (_selectValue_212 === 'branch' || (_selectValue_212 === 'case' || _selectValue_212 === 'address')) {
        node.h += config.triangleHeight / 2;
    }
}
function setNodeSize(config, node, size) {
    if (node.subtype === 'parbegin' && node.two) {
        node.w = config.metre / 2;
        node.h = 0;
    } else {
        if (size.width) {
            node.w = makeHalfSize(config, size.width);
        } else {
            node.w = 0;
        }
        if (size.height) {
            if (node.type === 'end') {
                node.h = Math.floor(size.height / 2);
            } else {
                node.h = makeHalfSizeSoft(config, size.height);
                node.h = Math.max(config.metre, node.h);
            }
        } else {
            node.h = 0;
        }
    }
}
function adjacentToAddress(record, source) {
    if (record.element.noBranch && source.tail.type === 'address') {
        return true;
    } else {
        return false;
    }
}
function canComeBackTo(src, loops) {
    var context;
    context = {
        visited: {},
        finished: false,
        success: false,
        loops: loops
    };
    canComeBackToStep(context, src);
    return context.success;
}
function canComeBackToStep(context, node) {
    var _collection_214, loops, prev, visited;
    loops = context.loops;
    visited = context.visited;
    if (!context.finished) {
        if (node.itemId in loops) {
            context.finished = true;
        } else {
            if (!(node.id in visited)) {
                visited[node.id] = true;
                if (utils.isSubset(node.loops, loops)) {
                    context.finished = true;
                    context.success = true;
                } else {
                    _collection_214 = node.prev;
                    for (prev of _collection_214) {
                        canComeBackToStep(context, prev);
                    }
                }
            }
        }
    }
}
function canOuterToInner(record, source) {
    var sourceBottom, sourceStop, targetNode, targetStop, targetTop;
    if (record.type === 'node') {
        targetNode = record.element;
        targetTop = goUp(targetNode);
        if (targetTop.y <= source.head.y) {
            targetStop = goDown(targetNode);
            sourceBottom = goDown(source.head);
            sourceStop = goLeft(sourceBottom);
            if (sourceStop === targetStop) {
                return false;
            } else {
                if (targetStop.right && targetStop.right.role === 'right-loop' && !canTurnRight(source.head)) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    } else {
        if (record.element.vertical) {
            targetNode = record.element.tail;
            targetTop = goUp(targetNode);
            if (targetTop.y <= source.head.y) {
                targetStop = goDown(targetNode);
                sourceBottom = goDown(source.head);
                sourceStop = goLeft(sourceBottom);
                if (sourceStop === targetStop) {
                    return false;
                } else {
                    if (targetStop.right && targetStop.right.role === 'right-loop' && !canTurnRight(source.head)) {
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}
function canTransplant(visuals, targetId, source) {
    if (source.finalTarget.itemId !== targetId && sameLoop(visuals, source.links, targetId)) {
        return true;
    } else {
        return false;
    }
}
function canTurnRight(node) {
    while (true) {
        if (node.type === 'question' || node.type === 'select') {
            return false;
        } else {
            if (node.up) {
                node = getUp(node);
            } else {
                return true;
            }
        }
    }
}
function clickLianaSocket(widget, socket) {
    var edits;
    edits = [];
    redirectUpperItems(edits, socket.links, socket.target);
    if (socket.arrow) {
        popFromSkewer(widget, socket.arrow.finalTarget, edits);
    }
    return edits;
}
function createArrowSocket(visuals, element, source) {
    var socket, srcLoops, targetId, targetLoops;
    targetId = element.finalTarget.itemId;
    if (!(isArrowLoop(element.head) || isArrowLoop(element.tail)) && canTransplant(visuals, targetId, source)) {
        if (element.tail.x < source.tail.x) {
            targetLoops = element.finalTarget.loops;
            srcLoops = source.finalTarget.loops;
            if (withinSameLoop(visuals, source, element, 0) && !hasOtherEntries(visuals, source, element.tail)) {
                socket = createSocketFromEdge(visuals, element, 'arrow', undefined);
                utils.addRange(source.links, socket.links);
            }
        }
    } else {
    }
}
function createLianaSocket(visuals, record, source, style) {
    var socket;
    if (canTransplant(visuals, record.targetId, source) && !adjacentToAddress(record, source)) {
        if (record.type === 'node') {
            socket = createNodeSocket(visuals, record.element, source);
        } else {
            socket = createSocketFromEdge(visuals, record.element, 'liana', undefined);
        }
        socket.arrow = source.arrow;
        socket.style = style;
        utils.addRange(source.links, socket.links);
    }
}
function createNodeSocket(visuals, node, source) {
    var radius, socket;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, node.x, node.y, 'liana', undefined, radius);
    socket.node = node;
    socket.target = node.finalTarget.itemId;
    return socket;
}
function findLianaSource(visuals, prim) {
    var _selectValue_216, beneath, edge, node;
    _selectValue_216 = prim.elType;
    if (_selectValue_216 === 'node') {
        node = getNode(visuals, prim.id);
        if (node.arrow) {
            return node.arrow;
        } else {
            if (node.type === 'junction') {
                if (isLeftDown(node)) {
                    beneath = getDown(node);
                    if (beneath.type === 'junction' && !isRightT(beneath)) {
                        return node.down;
                    } else {
                        return undefined;
                    }
                } else {
                    if (isRightUp(node)) {
                        if (node.right.role === 'floor') {
                            return undefined;
                        } else {
                            return node.up;
                        }
                    } else {
                        if (!(isCaseJun(node) || isBranchJun(node) || isAddressJun(node)) && node.left && node.up) {
                            if (node.down) {
                                return node.left;
                            } else {
                                return node.up;
                            }
                        } else {
                            return undefined;
                        }
                    }
                }
            } else {
                if (isSimpleItem(node)) {
                    if (node.down) {
                        beneath = getDown(node);
                        if (beneath.type === 'junction' && !isRightT(beneath)) {
                            return node.down;
                        } else {
                            return undefined;
                        }
                    } else {
                        return undefined;
                    }
                } else {
                    if (node.type !== 'address' || node.skewer.main) {
                        return undefined;
                    } else {
                        return node.up;
                    }
                }
            }
        }
    } else {
        if (_selectValue_216 === 'edge') {
            edge = getEdge(visuals, prim.id);
            if (edge.arrow) {
                return edge.arrow;
            } else {
                if (edge.role && edge.role !== 'floor' && edge.role !== 'rarrow') {
                    if (edge.vertical) {
                        if (edge.tail.type === 'junction' && !isRightT(edge.tail)) {
                            return edge;
                        } else {
                            return undefined;
                        }
                    } else {
                        if (isLeftUp(edge.tail)) {
                            return edge.tail.up;
                        } else {
                            if (isRightUp(edge.head)) {
                                return edge.head.up;
                            } else {
                                if (edge.head.type == 'junction') {
                                    return edge;
                                } else {
                                    if (edge.head.type === 'question' && edge.tail.up) {
                                        return edge;
                                    } else {
                                        return undefined;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    return undefined;
                }
            }
        } else {
            return undefined;
        }
    }
}
function firstCase(select) {
    return select.cases[0];
}
function getNodeByItem(visuals, itemId) {
    var nodeId;
    nodeId = visuals.itemsToNodes[itemId];
    return getNode(visuals, nodeId);
}
function hasOtherEntries(visuals, source, higher) {
    var _collection_218, context, link, node;
    context = {
        found: false,
        visited: {}
    };
    _collection_218 = source.links;
    for (link of _collection_218) {
        node = getNodeByItem(visuals, link.source);
        hasOtherEntriesStep(node, higher, context);
    }
    return context.found;
}
function hasOtherEntriesStep(lower, higher, context) {
    var _collection_220, prev;
    if (!(context.found || lower === higher || lower.id in context.visited)) {
        context.visited[lower.id] = true;
        if (lower.prev.length === 0) {
            context.found = true;
        } else {
            _collection_220 = lower.prev;
            for (prev of _collection_220) {
                hasOtherEntriesStep(prev, higher, context);
            }
        }
    }
}
function isAddressJun(node) {
    var above;
    if (node.up) {
        above = getUp(node);
        if (above.type === 'address' || node.right && node.right.role == 'floor') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function isBranchJun(node) {
    var below;
    if (node.down) {
        below = getDown(node);
        if (below.type == 'branch') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function isCaseJun(node) {
    var below;
    if (node.down) {
        below = getDown(node);
        if (below.type == 'case') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function isDegQuestion(edge) {
    if (!edge.vertical && edge.head.type === 'question' && edge.tail.up) {
        return true;
    } else {
        return false;
    }
}
function isLower(record, source) {
    if (record.type === 'node') {
        return record.element.y > source.tail.y;
    } else {
        return record.element.tail.y > source.tail.y;
    }
}
function isSimpleItem(node) {
    var _selectValue_222;
    _selectValue_222 = node.type;
    if (_selectValue_222 === 'header' || (_selectValue_222 === 'end' || (_selectValue_222 === 'junction' || _selectValue_222 === 'select' || _selectValue_222 === 'question' || _selectValue_222 === 'address')) || _selectValue_222 === 'case' && firstCase(node.select) === node) {
        return false;
    } else {
        return true;
    }
}
function sameLoop(visuals, srcLinks, targetId) {
    var link, src, target;
    target = getNodeByItem(visuals, targetId);
    for (link of srcLinks) {
        src = getNodeByItem(visuals, link.source);
        if (!(utils.isSubset(src.loops, target.loops) || canComeBackTo(src, target.loops))) {
            return false;
        }
    }
    return true;
}
function showLianaSockets(widget, prim) {
    var _branch_, _collection_224, _collection_227, _collection_230, _collection_233, _collection_236, downEdge, id, record, source, targetId, visuals;
    _branch_ = 'Liana source';
    while (true) {
        switch (_branch_) {
        case 'Liana source':
            if (isDrakon(widget)) {
                visuals = widget.visuals;
                clearSockets(visuals);
                if (isReadonly(widget)) {
                    _branch_ = 'Exit';
                } else {
                    source = findLianaSource(visuals, prim);
                    if (source) {
                        _branch_ = 'Outer-outer';
                    } else {
                        _branch_ = 'Exit';
                    }
                }
            } else {
                _branch_ = 'Exit';
            }
            break;
        case 'Outer-outer':
            if (source.outer) {
                _collection_236 = source.outer.outer;
                for (targetId in _collection_236) {
                    record = _collection_236[targetId];
                    if (isLower(record, source)) {
                        createLianaSocket(visuals, record, source, 'outer-outer');
                    }
                }
                _branch_ = 'Arrow pads';
            } else {
                _branch_ = 'Inner-outer';
            }
            break;
        case 'Arrow pads':
            if (!source.arrow) {
                _collection_233 = source.outer.outerArrPads;
                for (id in _collection_233) {
                    downEdge = _collection_233[id];
                    createArrowSocket(visuals, downEdge, source);
                }
            }
            _branch_ = 'Outer-inner';
            break;
        case 'Outer-inner':
            _collection_230 = source.outer.inner;
            for (targetId in _collection_230) {
                record = _collection_230[targetId];
                if (canOuterToInner(record, source)) {
                    createLianaSocket(visuals, record, source, 'outer-inner');
                }
            }
            if (source.arrow || source.role === 'up') {
                _branch_ = 'Exit';
            } else {
                _branch_ = 'Inner-outer';
            }
            break;
        case 'Inner-outer':
            if (source.inner) {
                _collection_227 = source.inner.outer;
                for (targetId in _collection_227) {
                    record = _collection_227[targetId];
                    if (source.role !== 'right-loop' && (source.vertical || isLower(record, source))) {
                        createLianaSocket(visuals, record, source, 'inner-outer');
                    }
                }
                _branch_ = 'Inner-inner';
            } else {
                _branch_ = 'Exit';
            }
            break;
        case 'Inner-inner':
            if (isDegQuestion(source)) {
                _collection_224 = source.inner.inner;
                for (targetId in _collection_224) {
                    record = _collection_224[targetId];
                    createLianaSocket(visuals, record, source, 'inner-inner');
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
function withinSameLoop(visuals, src, target) {
    var _collection_239, link, node, targetNode;
    targetNode = target.finalTarget;
    _collection_239 = src.links;
    for (link of _collection_239) {
        node = getNodeByItem(visuals, link.source);
        if (!withinSameLoopCore(node, targetNode, 0)) {
            return false;
        }
    }
    return true;
}
function withinSameLoopCore(node, target, depth) {
    var _collection_243, _selectValue_241, prev;
    _selectValue_241 = node.type;
    if (_selectValue_241 === 'loopbegin') {
        depth--;
    } else {
        if (_selectValue_241 === 'loopend') {
            depth++;
        }
    }
    if (depth < 0) {
        return false;
    } else {
        if (node !== target) {
            _collection_243 = node.prev;
            for (prev of _collection_243) {
                if (!withinSameLoopCore(prev, target, depth)) {
                    return false;
                }
            }
        }
        return true;
    }
}
function addToMindSelection(widget, node) {
    var finalNodes, node2, selected, selection, sibling, subroot, toSelect, visuals;
    selection = widget.selection;
    visuals = widget.visuals;
    selected = Object.keys(selection.prims);
    if (selected.length === 0) {
        toSelect = [node];
        finalNodes = [];
        for (subroot of toSelect) {
            getMindSubtree(subroot, finalNodes);
        }
        for (node2 of finalNodes) {
            selection.prims[node2.id] = 'node';
        }
        return true;
    } else {
        sibling = getWithCommonParent(visuals, node, selected);
        if (sibling) {
            toSelect = getSiblingsBetween(visuals, node, sibling);
            finalNodes = [];
            for (subroot of toSelect) {
                getMindSubtree(subroot, finalNodes);
            }
            for (node2 of finalNodes) {
                selection.prims[node2.id] = 'node';
            }
            return true;
        } else {
            if (isUpperInTree(visuals, node, selected)) {
                toSelect = [node];
                finalNodes = [];
                for (subroot of toSelect) {
                    getMindSubtree(subroot, finalNodes);
                }
                for (node2 of finalNodes) {
                    selection.prims[node2.id] = 'node';
                }
                return true;
            } else {
                return false;
            }
        }
    }
}
function buildMenuByTypeMind(widget, prim, node) {
    var _selectValue_245, menu;
    menu = [];
    pushMenuItem('copy_one', menu, tr(widget, 'Copy'), undefined, function () {
        copy(widget);
    });
    if (!isReadonly(widget) && canDelete(widget.visuals, node)) {
        pushMenuItem('cut_one', menu, tr(widget, 'Cut'), undefined, function () {
            cut(widget);
        });
    }
    menu.push({ type: 'separator' });
    if (prim.type === 'header') {
        pushMenuItem('rename', menu, tr(widget, 'Rename'), undefined, function () {
            startEditContent(widget, prim);
        });
    } else {
        if (canEditNodeText(widget, prim)) {
            if (canEditSecondary(prim)) {
                pushMenuItem('edit_secondary', menu, tr(widget, 'Edit upper text'), undefined, function () {
                    startEditSecondary(widget, prim);
                });
            }
            pushMenuItem('edit_content', menu, tr(widget, 'Edit content'), undefined, function () {
                startEditContent(widget, prim);
            });
            if (prim.type === 'graf-image' && !isReadonly(widget)) {
                pushMenuItem('change_image', menu, tr(widget, 'Change image'), undefined, function () {
                    startChangeImage(widget, prim);
                });
            }
            menu.push({ type: 'separator' });
            pushMenuItem('edit_link', menu, tr(widget, 'Edit link'), undefined, function () {
                startEditLink(widget, prim);
            });
        }
    }
    if (isReadonly(widget)) {
        return menu;
    } else {
        menu.push({ type: 'separator' });
        _selectValue_245 = getTType(prim);
        if (_selectValue_245 === 'horizontal') {
            pushMenuItem('layout_tree', menu, tr(widget, 'Tree-like layout'), widget.visuals.config.imagePath + 'layout_tree.png', function () {
                changeLayout(widget, prim, 'treeview');
            });
            pushMenuItem('layout_ver', menu, tr(widget, 'Vertical layout'), widget.visuals.config.imagePath + 'layout_ver.png', function () {
                changeLayout(widget, prim, 'vertical');
            });
        } else {
            if (_selectValue_245 === 'vertical') {
                pushMenuItem('layout_tree', menu, tr(widget, 'Tree-like layout'), widget.visuals.config.imagePath + 'layout_tree.png', function () {
                    changeLayout(widget, prim, 'treeview');
                });
                pushMenuItem('layout_hor', menu, tr(widget, 'Horizontal layout'), widget.visuals.config.imagePath + 'layout_hor.png', function () {
                    changeLayout(widget, prim, 'horizontal');
                });
            } else {
                if (_selectValue_245 !== 'treeview') {
                    throw new Error('Unexpected case value: ' + _selectValue_245);
                }
                pushMenuItem('layout_ver', menu, tr(widget, 'Vertical layout'), widget.visuals.config.imagePath + 'layout_ver.png', function () {
                    changeLayout(widget, prim, 'vertical');
                });
                pushMenuItem('layout_hor', menu, tr(widget, 'Horizontal layout'), widget.visuals.config.imagePath + 'layout_hor.png', function () {
                    changeLayout(widget, prim, 'horizontal');
                });
            }
        }
        if (node.type !== 'header') {
            menu.push({ type: 'separator' });
            if (node.type !== 'idea') {
                pushMenuItem('transform', menu, '> ' + tr(widget, 'Idea'), widget.visuals.config.imagePath + 'action.png', function () {
                    transformMind(widget, node, 'idea');
                });
            }
            if (node.type !== 'ridea') {
                pushMenuItem('transform', menu, '> ' + tr(widget, 'Idea - rounded'), widget.visuals.config.imagePath + 'rounded.png', function () {
                    transformMind(widget, node, 'ridea');
                });
            }
            if (node.type !== 'conclusion') {
                pushMenuItem('transform', menu, '> ' + tr(widget, 'Conclusion'), widget.visuals.config.imagePath + 'comment.png', function () {
                    transformMind(widget, node, 'conclusion');
                });
            }
        }
        if (canDelete(widget.visuals, node)) {
            menu.push({ type: 'separator' });
            pushMenuItem('delete_one', menu, tr(widget, 'Delete'), widget.visuals.config.imagePath + 'delete.png', function () {
                deleteOne(widget, node);
            });
        }
        if (canEditStyle(node)) {
            menu.push({ type: 'separator' });
            pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
                startEditStyle(widget);
            });
        }
        return menu;
    }
}
function buildMindEdgeMenu(widget, edge) {
    var clipboard, menu;
    menu = [];
    if (!isReadonly(widget)) {
        clipboard = getClipboardClone(widget);
        if (clipboard && clipboard.type === 'mind') {
            pushMenuItem('paste_mind', menu, tr(widget, 'Paste'), undefined, function () {
                pasteIntoMindEdge(widget, edge, clipboard.content);
            });
            menu.push({ type: 'separator' });
        }
        pushMenuItem('insert_idea', menu, tr(widget, 'Idea'), widget.visuals.config.imagePath + 'rectangle.png', function () {
            insertIntoMindEdge(widget, edge, 'idea');
        });
        pushMenuItem('insert_ridea', menu, tr(widget, 'Idea - rounded'), widget.visuals.config.imagePath + 'rounded.png', function () {
            insertIntoMindEdge(widget, edge, 'ridea');
        });
        pushMenuItem('insert_conclusion', menu, tr(widget, 'Conclusion'), widget.visuals.config.imagePath + 'comment.png', function () {
            insertIntoMindEdge(widget, edge, 'conclusion');
        });
    }
    return menu;
}
function buildMindTree(visuals) {
    var _collection_247, _collection_250, _collection_253, id, node;
    _collection_247 = visuals.nodes;
    for (id in _collection_247) {
        node = _collection_247[id];
        node.children = [];
        if (node.parent) {
            node.parent = getNode(visuals, node.parent);
        }
    }
    _collection_250 = visuals.nodes;
    for (id in _collection_250) {
        node = _collection_250[id];
        if (node.parent) {
            node.parent.children.push(node);
        }
    }
    _collection_253 = visuals.nodes;
    for (id in _collection_253) {
        node = _collection_253[id];
        utils.sortBy(node.children, 'ordinal');
    }
}
function calculateHorizontalSubtree(config, node) {
    var _collection_256, _collection_258, child, first, height, last, lastY, left, nBottom, nTop, right, shift, top;
    top = 0;
    left = node.w * 2 + config.metre * 2;
    right = node.subtreeBox.width;
    _collection_256 = node.children;
    for (child of _collection_256) {
        right = Math.max(right, left + child.subtreeBox.width);
        child.subtreeBox.left = left;
        child.subtreeBox.top = top;
        top += child.subtreeBox.height + config.metre;
    }
    node.x = node.w;
    node.subtreeBox.width = right;
    height = top - config.metre;
    first = node.children[0];
    if (node.children.length === 1) {
        node.y = first.y;
    } else {
        node.y = Math.round(height / 2);
        last = node.children[node.children.length - 1];
        lastY = last.y + last.subtreeBox.top;
        if (node.y < first.y) {
            node.y = first.y;
        } else {
            if (node.y > lastY) {
                node.y = lastY;
            }
        }
    }
    nTop = node.y - node.h;
    nBottom = node.y + node.h;
    if (nTop < 0) {
        shift = -nTop;
        _collection_258 = node.children;
        for (child of _collection_258) {
            child.subtreeBox.top += shift;
        }
        height += shift;
        node.y += shift;
        nBottom += shift;
    }
    node.subtreeBox.height = Math.max(nBottom, height);
}
function calculateTvSubtree(config, node) {
    var _collection_260, child, left, right, top;
    if (node.parent) {
        left = config.metre * 2;
    } else {
        left = 0;
    }
    top = node.h * 2 + config.metre;
    right = node.subtreeBox.width;
    _collection_260 = node.children;
    for (child of _collection_260) {
        right = Math.max(right, left + child.subtreeBox.width);
        child.subtreeBox.left = left;
        child.subtreeBox.top = top;
        top += child.subtreeBox.height + config.metre;
    }
    node.x = node.w;
    node.y = node.h;
    node.subtreeBox.width = right;
    node.subtreeBox.height = top - config.metre;
}
function calculateVerticalSubtree(config, node) {
    var _collection_262, _collection_264, bottom, child, first, last, lastX, left, nLeft, nRight, shift, top, width;
    left = 0;
    top = node.h * 2 + config.metre * 2;
    bottom = node.subtreeBox.height;
    _collection_262 = node.children;
    for (child of _collection_262) {
        bottom = Math.max(bottom, top + child.subtreeBox.height);
        child.subtreeBox.left = left;
        child.subtreeBox.top = top;
        left += child.subtreeBox.width + config.metre;
    }
    node.y = node.h;
    node.subtreeBox.height = bottom;
    width = left - config.metre;
    first = node.children[0];
    if (node.children.length === 1) {
        node.x = first.x;
    } else {
        last = node.children[node.children.length - 1];
        node.x = Math.round(width / 2);
        lastX = last.x + last.subtreeBox.left;
        if (node.x < first.x) {
            node.x = first.x;
        } else {
            if (node.x > lastX) {
                node.x = lastX;
            }
        }
    }
    nLeft = node.x - node.w;
    nRight = node.x + node.w;
    if (nLeft < 0) {
        shift = -nLeft;
        _collection_264 = node.children;
        for (child of _collection_264) {
            child.subtreeBox.left += shift;
        }
        width += shift;
        node.x += shift;
        nRight += shift;
    }
    node.subtreeBox.width = Math.max(nRight, width);
}
function LeftMindResizeHandle() {
    var self = { _type: 'LeftMindResizeHandle' };
    function LeftMindResizeHandle_complete() {
        completeMindResize(self);
    }
    function LeftMindResizeHandle_dragTo(x, y) {
        self.element.w = (self.right - x) / 2;
        self.element.x = self.right - self.element.w;
    }
    function LeftMindResizeHandle_getCursor() {
        return 'ew-resize';
    }
    function LeftMindResizeHandle_getMaxX() {
        return self.maxX;
    }
    function LeftMindResizeHandle_getMinX() {
        return self.minX;
    }
    function LeftMindResizeHandle_xEnabled() {
        return true;
    }
    function LeftMindResizeHandle_yEnabled() {
        return false;
    }
    self.complete = LeftMindResizeHandle_complete;
    self.dragTo = LeftMindResizeHandle_dragTo;
    self.getCursor = LeftMindResizeHandle_getCursor;
    self.getMaxX = LeftMindResizeHandle_getMaxX;
    self.getMinX = LeftMindResizeHandle_getMinX;
    self.xEnabled = LeftMindResizeHandle_xEnabled;
    self.yEnabled = LeftMindResizeHandle_yEnabled;
    return self;
}
function RightMindResizeHandle() {
    var self = { _type: 'RightMindResizeHandle' };
    function RightMindResizeHandle_complete() {
        completeMindResize(self);
    }
    function RightMindResizeHandle_dragTo(x, y) {
        self.element.w = (x - self.left) / 2;
        self.element.x = self.left + self.element.w;
    }
    function RightMindResizeHandle_getCursor() {
        return 'ew-resize';
    }
    function RightMindResizeHandle_getMaxX() {
        return self.maxX;
    }
    function RightMindResizeHandle_getMinX() {
        return self.minX;
    }
    function RightMindResizeHandle_xEnabled() {
        return true;
    }
    function RightMindResizeHandle_yEnabled() {
        return false;
    }
    self.complete = RightMindResizeHandle_complete;
    self.dragTo = RightMindResizeHandle_dragTo;
    self.getCursor = RightMindResizeHandle_getCursor;
    self.getMaxX = RightMindResizeHandle_getMaxX;
    self.getMinX = RightMindResizeHandle_getMinX;
    self.xEnabled = RightMindResizeHandle_xEnabled;
    self.yEnabled = RightMindResizeHandle_yEnabled;
    return self;
}
function completeMindResize(handle) {
    var edits, id, ids, w;
    ids = getHorSiblings(handle.element);
    w = snapUp(handle.widget.visuals.config, handle.element.w);
    edits = [];
    for (id of ids) {
        updateItem(edits, id, { w: w });
    }
    updateAndKeepSelection(handle.widget, edits);
}
function copyMind(widget, nodes, images) {
    var ids, item, items, node;
    ids = {};
    items = [];
    images = {};
    for (node of nodes) {
        if (node.id === 'root') {
            item = {
                type: 'header',
                id: node.id
            };
        } else {
            item = copyWholeItem(widget, node.itemId, images);
        }
        items.push(item);
        ids[node.id] = true;
    }
    for (item of items) {
        if (!(item.parent && item.parent in ids)) {
            item.parent = 'target';
        }
        if (item.type === 'header') {
            item.type = 'idea';
            item.content = widget.model.doc.name;
        }
    }
    return copyItemsToClipboard(widget, undefined, items, images, 'mind');
}
function createLeftMindResizeHandle(widget, node, y, ctx) {
    var big, config, handle;
    big = 1000;
    config = widget.visuals.config;
    handle = LeftMindResizeHandle();
    handle.widget = widget;
    handle.element = node;
    handle.x = node.x - node.w;
    handle.y = y;
    handle.id = node.id;
    handle.right = node.x + node.w;
    handle.minX = node.x - big;
    handle.maxX = handle.right - config.minWidth;
    handle.primId = 'left-mind-' + node.id + '-' + y;
    createHandle(widget.visuals, handle, ctx);
}
function createMindEdge(visuals, head, tail, vertical, target) {
    var ed;
    ed = createEdge(visuals, head, tail, vertical);
    ed.role = 'mind-child';
    ed.target = target;
    return ed;
}
function createMindEdges(visuals, node) {
    var _collection_266, _collection_268, _collection_270, child, childJun, config, connector, prev, rootJun, ttype;
    if (node.children.length === 0) {
    } else {
        config = visuals.config;
        ttype = getTType(node);
        if (ttype === 'vertical') {
            if (node.children.length === 1) {
                child = node.children[0];
                createEdge(visuals, node, child, true);
                createMindEdges(visuals, child);
            } else {
                prev = undefined;
                connector = undefined;
                _collection_266 = node.children;
                for (child of _collection_266) {
                    createMindEdges(visuals, child);
                    childJun = createJunction(visuals, undefined);
                    childJun.x = child.x;
                    childJun.y = node.y + node.h + config.metre;
                    createEdge(visuals, childJun, child, true);
                    if (prev) {
                        childJun.sharp = true;
                        if (Math.abs(childJun.x - node.x) <= 5) {
                            node.x = childJun.x;
                            connector = childJun;
                            createMindEdge(visuals, prev, childJun, false, child);
                        } else {
                            if (!connector && prev.x < node.x) {
                                if (child.x > node.x) {
                                    connector = createJunction(visuals, undefined);
                                    connector.x = node.x;
                                    connector.y = childJun.y;
                                    createMindEdge(visuals, prev, connector, false, child);
                                    createMindEdge(visuals, connector, childJun, false, child);
                                } else {
                                    if (child.x === node.x) {
                                        connector = childJun;
                                    }
                                    createMindEdge(visuals, prev, childJun, false, child);
                                }
                            } else {
                                createMindEdge(visuals, prev, childJun, false, child);
                            }
                        }
                    } else {
                        if (child.x === node.x) {
                            connector = childJun;
                        }
                    }
                    prev = childJun;
                }
                prev.sharp = false;
                connector.sharp = true;
                createEdge(visuals, node, connector, true);
            }
        } else {
            if (ttype === 'horizontal') {
                if (node.children.length === 1) {
                    child = node.children[0];
                    createEdge(visuals, node, child, false);
                    createMindEdges(visuals, child);
                } else {
                    prev = undefined;
                    connector = undefined;
                    _collection_268 = node.children;
                    for (child of _collection_268) {
                        createMindEdges(visuals, child);
                        childJun = createJunction(visuals, undefined);
                        childJun.y = child.y;
                        childJun.x = node.x + node.w + config.metre;
                        createEdge(visuals, childJun, child, false);
                        if (prev) {
                            childJun.sharp = true;
                            if (!connector && prev.y < node.y) {
                                if (child.y > node.y) {
                                    connector = createJunction(visuals, undefined);
                                    connector.x = childJun.x;
                                    connector.y = node.y;
                                    createMindEdge(visuals, prev, connector, true, child);
                                    createMindEdge(visuals, connector, childJun, true, child);
                                } else {
                                    if (child.y === node.y) {
                                        connector = childJun;
                                    }
                                    createMindEdge(visuals, prev, childJun, true, child);
                                }
                            } else {
                                createMindEdge(visuals, prev, childJun, true, child);
                            }
                        } else {
                            if (child.y === node.y) {
                                connector = childJun;
                            }
                        }
                        prev = childJun;
                    }
                    prev.sharp = false;
                    connector.sharp = true;
                    createEdge(visuals, node, connector, false);
                }
            } else {
                if (ttype !== 'treeview') {
                    throw new Error('Unexpected case value: ' + ttype);
                }
                rootJun = createJunction(visuals, undefined);
                if (node.parent) {
                    rootJun.x = node.x - node.w + config.metre;
                    rootJun.y = node.y + node.h;
                    rootJun.role = 'root';
                    rootJun.sharp = true;
                } else {
                    rootJun.x = node.x - node.w - config.metre;
                    rootJun.y = node.y;
                    createEdge(visuals, rootJun, node, false);
                }
                prev = rootJun;
                _collection_270 = node.children;
                for (child of _collection_270) {
                    createMindEdges(visuals, child);
                    childJun = createJunction(visuals, undefined);
                    childJun.y = child.y;
                    childJun.x = prev.x;
                    childJun.sharp = true;
                    createEdge(visuals, childJun, child, false);
                    createMindEdge(visuals, prev, childJun, true, child);
                    prev = childJun;
                }
                prev.sharp = false;
            }
        }
    }
}
function createMindIconOrPaste(widget, socket, parent, payload, edits) {
    var _collection_272, citem, edit, id, newItem, oldToNew, roots;
    roots = [];
    if (payload) {
        oldToNew = generateNewIds(widget, payload.items);
        oldToNew['target'] = parent.id;
        _collection_272 = payload.items;
        for (citem of _collection_272) {
            if (citem.parent === 'target') {
                roots.push(citem.id);
            }
            citem.parent = oldToNew[citem.parent];
            edit = createInsert(citem);
            edits.push(edit);
        }
        return roots;
    } else {
        newItem = {
            type: socket.iconType,
            content: '',
            parent: parent.id,
            treeType: getTTypeForChildren(parent)
        };
        id = createItem(widget.model, edits, newItem);
        roots.push(id);
        return roots;
    }
}
function createMindSockets(widget) {
    var after, before, child, config, cpos, node, nodes, r2, radius, selectedNodes, sib, visuals;
    if (isMind(widget) && !isReadonly(widget)) {
        visuals = widget.visuals;
        config = widget.visuals.config;
        radius = config.socketTouchRadius;
        r2 = radius * 1.5;
        selectedNodes = getNodesFromSelection(widget);
        nodes = selectedNodes.filter(function (node) {
            return isMindIcon(widget, node);
        });
        if (nodes.length === 1) {
            node = nodes[0];
            if (node.children.length === 0) {
                cpos = getMindChildSocketPos(r2, node);
                child = createSocket(visuals, cpos.x, cpos.y, 'insert', 'mind-child', radius);
                child.node = node;
                child.iconType = 'idea';
            }
            if (node.parent) {
                sib = getMindSiblingSocketPos(r2, node);
                before = createSocket(visuals, sib.before.x, sib.before.y, 'insert', 'mind-before', radius);
                before.node = node;
                before.iconType = 'idea';
                after = createSocket(visuals, sib.after.x, sib.after.y, 'insert', 'mind-after', radius);
                after.node = node;
                after.iconType = 'idea';
            } else {
            }
        } else {
            clearSockets(visuals);
        }
    } else {
    }
}
function createRightMindResizeHandle(widget, node, y, ctx) {
    var big, config, handle;
    big = 1000;
    config = widget.visuals.config;
    handle = RightMindResizeHandle();
    handle.widget = widget;
    handle.element = node;
    handle.x = node.x + node.w;
    handle.y = y;
    handle.id = node.id;
    handle.left = node.x - node.w;
    handle.minX = node.x - node.w + config.minWidth;
    handle.maxX = node.x + big;
    handle.primId = 'right-mind-' + node.id + '-' + y;
    createHandle(widget.visuals, handle, ctx);
}
function deleteMind(widget, nodes) {
    var child, children, edits, ids, node, ordinal, parent, parents, pids;
    edits = [];
    ids = {};
    for (node of nodes) {
        ids[node.id] = true;
    }
    parents = {};
    for (node of nodes) {
        if (!(node.parent.id in ids)) {
            parents[node.parent.id] = true;
        }
    }
    pids = Object.keys(parents);
    if (pids.length === 1) {
        parent = getNode(widget.visuals, pids[0]);
    } else {
        throw new Error('deleteMind: bad number of parents: ' + pids.length);
    }
    children = parent.children.filter(function (sibling) {
        return !ids[sibling.id];
    });
    ordinal = 0;
    for (child of children) {
        if (child.ordinal != ordinal) {
            updateItem(edits, child.id, { ordinal: ordinal });
        }
        ordinal++;
    }
    for (node of nodes) {
        deleteItemCore(edits, node.id);
        decrementImageRefCount(widget, node.image);
    }
    return edits;
}
function getHorSiblings(node) {
    var parent, ttype;
    parent = node.parent;
    if (parent) {
        ttype = getTType(parent);
        if (ttype === 'vertical') {
            return [node.id];
        } else {
            if (!(ttype === 'horizontal' || ttype === 'treeview')) {
                throw new Error('Unexpected case value: ' + ttype);
            }
            return parent.children.map(function (child) {
                return child.id;
            });
        }
    } else {
        return [];
    }
}
function getMindChildSocketPos(r2, node) {
    var cx, cy, ttype;
    ttype = getTType(node);
    if (ttype === 'vertical') {
        cx = node.x;
        cy = node.y + node.h + r2;
    } else {
        if (ttype === 'horizontal') {
            cx = node.x + node.w + r2;
            cy = node.y;
        } else {
            if (ttype !== 'treeview') {
                throw new Error('Unexpected case value: ' + ttype);
            }
            cx = node.x - node.w + 20;
            cy = node.y + node.h + r2;
        }
    }
    return {
        x: cx,
        y: cy
    };
}
function getMindSiblingSocketPos(r2, node) {
    var ax, ay, bx, by, parenType;
    parenType = getTType(node.parent);
    if (parenType === 'vertical') {
        bx = node.x - node.w - r2;
        by = node.y;
        ax = node.x + node.w + r2;
        ay = node.y;
    } else {
        if (!(parenType === 'horizontal' || parenType === 'treeview')) {
            throw new Error('Unexpected case value: ' + parenType);
        }
        bx = node.x;
        by = node.y - node.h - r2;
        ax = node.x;
        ay = node.y + node.h + r2;
    }
    return {
        before: {
            x: bx,
            y: by
        },
        after: {
            x: ax,
            y: ay
        }
    };
}
function getMindSubtree(node, output) {
    var _collection_274, child;
    output.push(node);
    _collection_274 = node.children;
    for (child of _collection_274) {
        getMindSubtree(child, output);
    }
}
function getSiblingsBetween(visuals, node, sibling) {
    var i, other, parent, result;
    result = [];
    parent = node.parent;
    if (node.ordinal < sibling.ordinal) {
        for (i = node.ordinal; i < sibling.ordinal; i++) {
            other = parent.children[i];
            result.push(other);
        }
    } else {
        for (i = node.ordinal; i > sibling.ordinal; i--) {
            other = parent.children[i];
            result.push(other);
        }
    }
    return result;
}
function getTTypeForChildren(parent) {
    var parentType;
    parentType = getTType(parent);
    if (parent.type === 'header' && parentType === 'vertical') {
        return 'treeview';
    } else {
        return parentType;
    }
}
function getWithCommonParent(visuals, node, ids) {
    var id, other;
    for (id of ids) {
        other = getNode(visuals, id);
        if (other.parent === node.parent) {
            return other;
        }
    }
    return undefined;
}
function insertIntoMindEdge(widget, edge, type) {
    var edits, socket;
    socket = {
        iconType: type,
        node: edge.target
    };
    edits = mindBeforeInsert(widget, socket, undefined);
    return doEdit(widget, edits);
}
function insertMindChildren(edits, parent, ids, ordinal) {
    var exOrdinal, i, id, index, insert, sibling;
    for (i = 0; i < ids.length; i++) {
        id = ids[i];
        index = utils.findIndex(edits, 'id', id);
        insert = edits[index];
        insert.fields.ordinal = ordinal + i;
    }
    exOrdinal = ordinal + ids.length;
    for (i = ordinal; i < parent.children.length; i++) {
        sibling = parent.children[i];
        updateItem(edits, sibling.id, { ordinal: exOrdinal });
        exOrdinal++;
    }
}
function isMind(widget) {
    if (widget.model.type === 'graf') {
        return true;
    } else {
        return false;
    }
}
function isMindIcon(widget, node) {
    return widget.mindIcons[node.type];
}
function isParent(parent, node) {
    while (true) {
        if (parent.id === node.id) {
            return true;
        } else {
            node = node.parent;
            if (!node) {
                return false;
            }
        }
    }
}
function isUpperInTree(visuals, parent, ids) {
    var id, node;
    for (id of ids) {
        node = getNode(visuals, id);
        if (isParent(parent, node)) {
            return true;
        }
    }
    return false;
}
function mindAfterInsert(widget, socket, payload) {
    var model, ordinal, parent;
    model = widget.model;
    parent = socket.node.parent;
    ordinal = socket.node.ordinal + 1;
    return mindInsertCore(widget, socket, parent, ordinal, payload);
}
function mindBeforeInsert(widget, socket, payload) {
    var model, ordinal, parent;
    model = widget.model;
    parent = socket.node.parent;
    ordinal = socket.node.ordinal;
    return mindInsertCore(widget, socket, parent, ordinal, payload);
}
function mindCandy(widget, node, ctx) {
    var border, bottom, config, fill, left, lineWidth, right, size, top, visuals;
    visuals = widget.visuals;
    config = visuals.config;
    left = node.x - node.w;
    top = node.y - node.h;
    right = node.x + node.w;
    bottom = node.y + node.h;
    fill = config.theme.candyFill;
    border = config.theme.candyBorder;
    size = 10;
    lineWidth = 2;
    createLeftMindResizeHandle(widget, node, top, ctx);
    centerSquare(ctx, node.x, top, size, fill, border, lineWidth);
    createRightMindResizeHandle(widget, node, top, ctx);
    createLeftMindResizeHandle(widget, node, node.y, ctx);
    createRightMindResizeHandle(widget, node, node.y, ctx);
    createLeftMindResizeHandle(widget, node, bottom, ctx);
    centerSquare(ctx, node.x, bottom, size, fill, border, lineWidth);
    createRightMindResizeHandle(widget, node, bottom, ctx);
}
function mindChildInsert(widget, socket, payload) {
    var model, ordinal, parent;
    model = widget.model;
    parent = socket.node;
    ordinal = 0;
    return mindInsertCore(widget, socket, parent, ordinal, payload);
}
function mindInsertCore(widget, socket, parent, ordinal, payload) {
    var edits, roots;
    edits = [];
    roots = createMindIconOrPaste(widget, socket, parent, payload, edits);
    insertMindChildren(edits, parent, roots, ordinal);
    return edits;
}
function pasteIntoMindEdge(widget, edge, payload) {
    var edits, socket;
    socket = { node: edge.target };
    edits = mindBeforeInsert(widget, socket, payload);
    return doEdit(widget, edits);
}
function positionMind(visuals) {
    calculateSubtreeBox(visuals.config, visuals.header);
    bakeSubtreeCoords(visuals.header, 0, 0);
    createMindEdges(visuals, visuals.header);
}
function setSameHeightForMindChildren(parent) {
    var _collection_276, _collection_278, height, node;
    height = 0;
    _collection_276 = parent.children;
    for (node of _collection_276) {
        height = Math.max(height, node.h);
    }
    _collection_278 = parent.children;
    for (node of _collection_278) {
        node.h = height;
    }
}
function setSameHeightMind(visuals) {
    var _collection_280, id, node, ttype;
    _collection_280 = visuals.nodes;
    for (id in _collection_280) {
        node = _collection_280[id];
        ttype = getTType(node);
        if (ttype === 'vertical') {
            setSameHeightForMindChildren(node);
        }
    }
}
function setSameWidthForMindChildren(parent) {
    var _collection_283, _collection_285, node, width;
    width = 0;
    _collection_283 = parent.children;
    for (node of _collection_283) {
        width = Math.max(width, node.w);
    }
    _collection_285 = parent.children;
    for (node of _collection_285) {
        node.w = width;
    }
}
function setSameWidthMind(visuals) {
    var _collection_287, id, node, ttype;
    _collection_287 = visuals.nodes;
    for (id in _collection_287) {
        node = _collection_287[id];
        ttype = getTType(node);
        if (ttype === 'treeview' || ttype === 'horizontal') {
            setSameWidthForMindChildren(node);
        }
    }
}
function showMindInsertSockets(widget, op, type, imageData) {
    var _collection_290, id, node, visuals;
    visuals = widget.visuals;
    _collection_290 = visuals.nodes;
    for (id in _collection_290) {
        node = _collection_290[id];
        if (isMindIcon(widget, node)) {
            showMindSocketsForIcon(visuals, node, op, type, imageData);
        }
    }
}
function showMindSocketsForIcon(visuals, node, op, type, imageData) {
    var after, before, child, config, cpos, radius, sib;
    config = visuals.config;
    radius = config.socketTouchRadius;
    if (node.children.length === 0) {
        cpos = getMindChildSocketPos(0, node);
        child = createSocket(visuals, cpos.x, cpos.y, op, 'mind-child', radius);
        child.node = node;
        child.iconType = type;
        child.imageData = imageData;
    }
    if (node.parent) {
        sib = getMindSiblingSocketPos(0, node);
        if (node.ordinal === 0) {
            before = createSocket(visuals, sib.before.x, sib.before.y, op, 'mind-before', radius);
            before.node = node;
            before.iconType = type;
            before.imageData = imageData;
        }
        after = createSocket(visuals, sib.after.x, sib.after.y, op, 'mind-after', radius);
        after.node = node;
        after.iconType = type;
        after.imageData = imageData;
    } else {
    }
}
function transformMind(widget, node, type) {
    var edits;
    edits = [];
    updateItem(edits, node.id, { type: type });
    return updateAndKeepSelection(widget, edits);
}
function createHandle(visuals, handle, ctx) {
    var border, config, fill, lineWidth, size, touch;
    config = visuals.config;
    touch = config.socketTouchRadius;
    handle.box = boxFromPoint(handle.x, handle.y, touch, touch);
    handle.elType = 'handle';
    fill = config.theme.handleFill;
    border = config.theme.candyBorder;
    size = 10;
    lineWidth = 2;
    if (visuals.highlight && visuals.highlight === handle.primId) {
        border = config.theme.highlight;
    }
    if (handle.color) {
        fill = handle.color;
    }
    centerSquare(ctx, handle.x, handle.y, size, fill, border, lineWidth);
    visuals.handles.push(handle);
}
function drawEdgeCandy(visuals, id, ctx, config) {
    var edge;
    edge = visuals.edges[id];
    if (edge.vertical) {
        verticalCandy(edge, ctx, config);
    } else {
        horizontalCandy(edge, ctx, config);
    }
}
function drawNodeCandy(widget, id, ctx, config) {
    var node, visuals;
    visuals = widget.visuals;
    node = visuals.nodes[id];
    if (node.type === 'junction' || node.type === 'arrow-loop') {
        juncCandy(node, ctx, config);
    } else {
        if (node.type === 'header') {
            standardCandy(node, ctx, config);
        } else {
            if (isMindIcon(widget, node)) {
                mindCandy(widget, node, ctx);
            } else {
                if (shouldAlignWidth(visuals, node) && visuals.config.allowResize) {
                    skewerResizeCandy(widget, node, ctx);
                } else {
                    standardCandy(node, ctx, config);
                }
            }
        }
    }
}
function findHandle(visuals, pos) {
    var _collection_293, handle;
    _collection_293 = visuals.handles;
    for (handle of _collection_293) {
        if (hitBox(handle.box, pos.x, pos.y)) {
            return handle;
        }
    }
    return undefined;
}
function horizontalCandy(edge, ctx, config) {
    var head, headX, headY, tail, tailX, w, x, y;
    head = edge.head;
    tail = edge.tail;
    headX = getX(head);
    headY = getY(head);
    tailX = getX(tail);
    x = headX;
    y = headY;
    w = tailX - headX;
    ctx.fillStyle = config.theme.candyBorder;
    ctx.fillRect(x, y - 2, w, 6);
    ctx.fillStyle = config.theme.candyFill;
    ctx.fillRect(x + 2, y, w - 4, 2);
}
function juncCandy(node, ctx, config) {
    var border, fill, lineWidth, size;
    fill = config.theme.candyFill;
    border = config.theme.candyBorder;
    size = 10;
    lineWidth = 2;
    centerSquare(ctx, node.x, node.y, size, fill, border, lineWidth);
}
function skewerResizeCandy(widget, node, ctx) {
    var border, bottom, config, fill, left, lineWidth, right, size, top, visuals;
    visuals = widget.visuals;
    config = visuals.config;
    left = node.x - node.w;
    top = node.y - node.h;
    right = node.x + node.w;
    bottom = node.y + node.h;
    fill = config.theme.candyFill;
    border = config.theme.candyBorder;
    size = 10;
    lineWidth = 2;
    createLeftDrakonResizeHandle(widget, node, top, ctx);
    centerSquare(ctx, node.x, top, size, fill, border, lineWidth);
    createRightDrakonResizeHandle(widget, node, top, ctx);
    createLeftDrakonResizeHandle(widget, node, node.y, ctx);
    createRightDrakonResizeHandle(widget, node, node.y, ctx);
    createLeftDrakonResizeHandle(widget, node, bottom, ctx);
    centerSquare(ctx, node.x, bottom, size, fill, border, lineWidth);
    createRightDrakonResizeHandle(widget, node, bottom, ctx);
}
function standardCandy(node, ctx, config) {
    var border, bottom, fill, left, lineWidth, right, size, top;
    left = node.x - node.w;
    top = node.y - node.h;
    right = node.x + node.w;
    bottom = node.y + node.h;
    fill = config.theme.candyFill;
    border = config.theme.candyBorder;
    size = 10;
    lineWidth = 2;
    centerSquare(ctx, left, top, size, fill, border, lineWidth);
    centerSquare(ctx, node.x, top, size, fill, border, lineWidth);
    centerSquare(ctx, right, top, size, fill, border, lineWidth);
    centerSquare(ctx, left, node.y, size, fill, border, lineWidth);
    centerSquare(ctx, right, node.y, size, fill, border, lineWidth);
    centerSquare(ctx, left, bottom, size, fill, border, lineWidth);
    centerSquare(ctx, node.x, bottom, size, fill, border, lineWidth);
    centerSquare(ctx, right, bottom, size, fill, border, lineWidth);
}
function verticalCandy(edge, ctx, config) {
    var h, head, headX, headY, tail, tailY, x, y;
    head = edge.head;
    tail = edge.tail;
    headX = getX(head);
    headY = getY(head);
    tailY = getY(tail);
    x = headX;
    y = headY;
    h = tailY - headY;
    ctx.fillStyle = config.theme.candyBorder;
    ctx.fillRect(x - 2, y, 6, h);
    ctx.fillStyle = config.theme.candyFill;
    ctx.fillRect(x, y + 2, 2, h - 4);
}
function copy(widget) {
    var copyType;
    copyType = copyCore(widget);
    if (copyType) {
        widget.showPasteSockets(copyType);
    }
}
function copyBlock(widget, startId, items, images) {
    return copyItemsToClipboard(widget, startId, items, images, 'block');
}
function copyBranch(widget, node) {
    var _collection_296, block, bnode, branchNodes, end, images, itemId, items, next, targets;
    images = {};
    branchNodes = {};
    scanBranchItems(node, branchNodes);
    end = widget.visuals.end;
    if (end) {
        delete branchNodes[end.itemId];
    }
    items = [];
    targets = {};
    for (itemId in branchNodes) {
        bnode = branchNodes[itemId];
        _collection_296 = bnode.next;
        for (next of _collection_296) {
            if (!(next.itemId in branchNodes)) {
                targets[next.itemId] = next.content;
            }
        }
        items.push(copyItem(widget, itemId, images));
    }
    block = {
        start: node.itemId,
        items: items,
        targets: targets,
        images: images
    };
    saveCopyInClipboard(widget, 'branch', block);
    return 'branch';
}
function copyCase(widget, node) {
    var copy, images;
    images = {};
    copy = copyItem(widget, node.itemId, images);
    copy.one = 'finish';
    copy.two = undefined;
    return copyItemsToClipboard(widget, node.itemId, [copy], images, 'case');
}
function copyCore(widget) {
    var _selectValue_298, all, elements, nodes;
    nodes = getNodesFromSelection(widget);
    _selectValue_298 = nodes.length;
    if (_selectValue_298 === 0) {
        elements = getSelectedFree(widget);
        if (elements.length === 0) {
            return undefined;
        } else {
            return copyFree(widget, elements);
        }
    } else {
        if (_selectValue_298 === 1) {
            if (isMind(widget)) {
                all = [];
                getMindSubtree(nodes[0], all);
                return copyMind(widget, all);
            } else {
                return copyOneItem(widget, nodes[0]);
            }
        } else {
            if (isMind(widget)) {
                return copyMind(widget, nodes);
            } else {
                return copyManyItems(widget, nodes);
            }
        }
    }
}
function copyDuration(widget, node) {
    var copy, images;
    images = {};
    copy = copyItem(widget, node.itemId, images);
    return copyItemsToClipboard(widget, node.itemId, [copy], images, 'duration');
}
function copyFree(widget, elements) {
    var copy, count, element, id, images, visited;
    unit.pasteDX = 0;
    unit.pasteDY = 0;
    images = {};
    copy = elements.map(function (element) {
        return copyItem(widget, element.id, images);
    });
    visited = {};
    for (element of elements) {
        performOnConnections(widget.visuals, element.id, visited, function () {
            return false;
        });
    }
    for (id in visited) {
        count = visited[id];
        if (count === 2) {
            copy.push(copyItem(widget, id, images));
        }
    }
    copyItemsToClipboard(widget, undefined, copy, images, 'free');
    return undefined;
}
function copyItem(widget, itemId, images) {
    var copy, item;
    item = widget.model.items[itemId];
    copy = utils.clone(item);
    delete copy.side;
    takeImageToClipboard(widget, copy, images);
    return copy;
}
function copyItemsToClipboard(widget, startId, items, images, type) {
    var block;
    block = {
        start: startId,
        items: items,
        images: images
    };
    saveCopyInClipboard(widget, type, block);
    return type;
}
function copyLoop(widget, node) {
    var end, images, loop;
    images = {};
    loop = copyItem(widget, node.itemId, images);
    loop.one = node.loopEnd.itemId;
    end = copyItem(widget, node.loopEnd.itemId, images);
    end.one = 'finish';
    return copyBlock(widget, node.itemId, [
        loop,
        end
    ], images);
}
function copyLoopEnd(widget, node) {
    return copyLoop(widget, node.loopStart);
}
function copyManyItems(widget, nodes) {
    var images, items;
    images = {};
    items = nodes.map(function (node) {
        return copySelectedItem(widget, node, images);
    });
    return copyBlock(widget, widget.selection.head, items, images);
}
function copyOneItem(widget, node) {
    var func;
    func = getCopyFunction(node);
    if (func) {
        return func(widget, node);
    } else {
        return undefined;
    }
}
function copyQuestion(widget, node) {
    var copy, images;
    images = {};
    copy = copyItem(widget, node.itemId, images);
    copy.one = 'finish';
    copy.two = 'finish';
    return copyBlock(widget, node.itemId, [copy], images);
}
function copySelect(widget, node) {
    var _collection_301, caseItem, caseNode, images, items, selectItem;
    images = {};
    items = [];
    selectItem = copyItem(widget, node.itemId, images);
    items.push(selectItem);
    _collection_301 = node.cases;
    for (caseNode of _collection_301) {
        caseItem = copyItem(widget, caseNode.itemId, images);
        caseItem.one = 'finish';
        items.push(caseItem);
    }
    return copyBlock(widget, node.itemId, items, images);
}
function copySelectedItem(widget, node, images) {
    var item;
    item = copyWholeItem(widget, node.itemId, images);
    item.one = getCopyTarget(widget, node, 0);
    item.two = getCopyTarget(widget, node, 1);
    return item;
}
function copySimple(widget, node) {
    var copy, images;
    images = {};
    copy = copyItem(widget, node.itemId, images);
    copy.one = 'finish';
    return copyBlock(widget, node.itemId, [copy], images);
}
function copyWholeItem(widget, itemId, images) {
    var copy, imageId, item;
    item = widget.model.items[itemId];
    copy = utils.clone(item);
    imageId = copy.image;
    takeImageToClipboard(widget, copy, images);
    return copy;
}
function createPastedItem(edits, item) {
    var edit;
    edit = createInsert(item);
    edits.push(edit);
    return item.id;
}
function cut(widget) {
    var elements, nodes, type;
    elements = getSelectedFree(widget);
    if (elements.length === 0) {
        type = copyCore(widget);
        if (type) {
            nodes = getNodesFromSelection(widget);
            deleteSelectionCore(widget, nodes);
            widget.showPasteSockets(type);
        }
    } else {
        copyFree(widget, elements);
        deleteFree(widget, elements);
    }
}
function duration(widget) {
}
function generateNewIds(widget, items) {
    var id, item, oldToNew;
    oldToNew = {};
    for (item of items) {
        id = getNextId(widget.model);
        oldToNew[item.id] = id;
        item.id = id;
    }
    return oldToNew;
}
function getBranchByName(visuals, name) {
    var _collection_303, branch, itemId;
    _collection_303 = visuals.branches;
    for (itemId of _collection_303) {
        branch = getNode(visuals, itemId);
        if (branch.content === name) {
            return branch;
        }
    }
    return undefined;
}
function getCopyFunction(node) {
    var _selectValue_305;
    _selectValue_305 = node.type;
    if (_selectValue_305 === 'header') {
        return undefined;
    } else {
        if (_selectValue_305 === 'question') {
            return copyQuestion;
        } else {
            if (_selectValue_305 === 'case') {
                return copyCase;
            } else {
                if (_selectValue_305 === 'duration') {
                    return copyDuration;
                } else {
                    if (_selectValue_305 === 'address') {
                        return undefined;
                    } else {
                        if (_selectValue_305 === 'params') {
                            return undefined;
                        } else {
                            if (_selectValue_305 === 'junction') {
                                return undefined;
                            } else {
                                if (_selectValue_305 === 'branch') {
                                    return copyBranch;
                                } else {
                                    if (_selectValue_305 === 'select') {
                                        return copySelect;
                                    } else {
                                        if (_selectValue_305 === 'loopbegin') {
                                            return copyLoop;
                                        } else {
                                            if (_selectValue_305 === 'loopend') {
                                                return copyLoopEnd;
                                            } else {
                                                return copySimple;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function getCopyTarget(widget, node, ordinal) {
    var next;
    if (ordinal >= node.next.length) {
        return '';
    } else {
        next = node.next[ordinal];
        if (next.id in widget.selection.prims) {
            return next.itemId;
        } else {
            return 'finish';
        }
    }
}
function insertIntoEdge(widget, edge, type) {
    var action, edits, socket;
    socket = {
        edge: edge,
        links: []
    };
    copyEdgeLinks(socket);
    action = widget.insertActions[type];
    edits = action(widget, socket);
    return doEdit(widget, edits);
}
function pasteBlock(widget, socket, payload) {
    var create, edits, firstId;
    edits = [];
    firstId = replaceIds(widget, payload.start, payload.items, socket.target);
    create = function (item) {
        createPastedItem(edits, item);
    };
    payload.items.forEach(create);
    redirectUpperItems(edits, socket.links, firstId);
    return edits;
}
function pasteBranch(widget, socket, block) {
    var branch, branchId, create, edits, item, items, name, newId, oldId, oldToNew, start, targetId, targets, visuals;
    visuals = widget.visuals;
    items = block.items;
    start = block.start;
    targets = block.targets;
    branchId = getSocketBranchId(socket);
    targetId = getBranchItemId(widget.visuals, branchId);
    edits = moveBranchIdsRight(visuals, branchId);
    for (item of items) {
        if (item.id === start) {
            item.branchId = branchId;
            break;
        }
    }
    oldToNew = generateNewIds(widget, items);
    for (oldId in targets) {
        name = targets[oldId];
        branch = getBranchByName(visuals, name);
        if (branch) {
            newId = branch.itemId;
        } else {
            newId = targetId;
        }
        oldToNew[oldId] = newId;
    }
    replaceTargets(items, oldToNew);
    create = function (item) {
        createPastedItem(edits, item);
    };
    items.forEach(create);
    return edits;
}
function pasteInSocket(widget, socket, images) {
    var _selectValue_308, _selectValue_310, clipboard, ctype, edits, payload;
    edits = [];
    clipboard = getClipboardClone(widget);
    if (clipboard) {
        payload = clipboard.content;
        ctype = clipboard.type;
        Object.assign(images, payload.images);
        if (ctype === 'mind') {
            _selectValue_310 = socket.type;
            if (_selectValue_310 === 'mind-before') {
                edits = mindBeforeInsert(widget, socket, payload);
            } else {
                if (_selectValue_310 === 'mind-after') {
                    edits = mindAfterInsert(widget, socket, payload);
                } else {
                    if (_selectValue_310 === 'mind-child') {
                        edits = mindChildInsert(widget, socket, payload);
                    }
                }
            }
            return edits;
        } else {
            _selectValue_308 = socket.type;
            if (_selectValue_308 === 'block') {
                if (socket.type === ctype) {
                    edits = pasteBlock(widget, socket, payload);
                }
            } else {
                if (_selectValue_308 === 'case') {
                    if (ctype === 'case') {
                        edits = caseInsertCore(widget, socket.node, payload.items[0]);
                    }
                } else {
                    if (_selectValue_308 === 'duration') {
                        if (ctype === 'duration') {
                            edits = pasteDuration(widget, socket.node, payload.items[0]);
                        }
                    } else {
                        if (_selectValue_308 === 'first-case') {
                            if (ctype === 'case') {
                                edits = firstCaseInsertCore(widget, socket.node, payload.items[0]);
                            }
                        } else {
                            if (_selectValue_308 === 'branch' && socket.type === ctype) {
                                edits = pasteBranch(widget, socket, payload);
                            }
                        }
                    }
                }
            }
            return edits;
        }
    } else {
        return edits;
    }
}
async function pasteIntoEdge(widget, edge, payload) {
    var edits, socket;
    socket = {
        edge: edge,
        links: []
    };
    copyEdgeLinks(socket);
    edits = pasteBlock(widget, socket, payload);
    await loadCreatedImages(widget, edits, payload.images);
    return doEdit(widget, edits);
}
function replaceIds(widget, startId, items, targetId) {
    var oldToNew;
    oldToNew = generateNewIds(widget, items);
    oldToNew['finish'] = targetId;
    replaceTargets(items, oldToNew);
    if (startId === undefined) {
        return undefined;
    } else {
        return oldToNew[startId];
    }
}
function replaceTarget(item, oldToNew) {
    if (item.one) {
        item.one = oldToNew[item.one];
    }
    if (item.two) {
        item.two = oldToNew[item.two];
    }
    if (item.side) {
        item.side = oldToNew[item.side];
    }
    if (item.begin) {
        item.begin = oldToNew[item.begin];
    }
    if (item.end) {
        item.end = oldToNew[item.end];
    }
}
function replaceTargets(items, oldToNew) {
    var relink;
    relink = function (item) {
        replaceTarget(item, oldToNew);
    };
    items.forEach(relink);
}
function saveCopyInClipboard(widget, type, content) {
    var copy;
    copy = utils.deepClone(content);
    widget.visuals.config.setClipboard(type, copy);
}
function takeImageToClipboard(widget, item, images) {
    var image, imageId;
    imageId = item.image;
    if (imageId) {
        image = widget.images[imageId];
        images[imageId] = { content: image.content };
    }
}
function isUpstream(visuals, lower, upper) {
    var context;
    context = {
        found: false,
        visited: {},
        nodes: visuals.nodes
    };
    isUpstreamStep(lower, upper, context);
    return context.found;
}
function isUpstreamStep(lower, upper, context) {
    var _collection_312, prev;
    if (!context.found) {
        if (lower.id === upper.id) {
            context.found = true;
        } else {
            context.visited[lower.id] = true;
            _collection_312 = lower.prev;
            for (prev of _collection_312) {
                isUpstreamStep(prev, upper, context);
            }
        }
    }
}
function linkNext(context, node1, nextItemId) {
    var address, node2, prevCount, visuals;
    if (nextItemId) {
        visuals = context.visuals;
        node2 = getNodeForItem(visuals, nextItemId);
        if (node2.type == 'branch') {
            address = utils.last(context.addresses);
            if (!(address && address.branch.id == nextItemId)) {
                address = createNode(visuals, undefined, 'address', node2.content, undefined);
                flowIcon(visuals, address);
                address.branch = node2;
                address.itemId = node2.itemId;
                context.addresses.push(address);
            }
            node1.next.push(address);
            address.prev.push(node1);
        } else {
            if (isArrowLoop(node2) && isUpstream(visuals, node1, node2)) {
                node1.next.push(node2);
                node2.aprev.push(node1);
            } else {
                prevCount = node2.prev.length;
                node1.next.push(node2);
                node2.prev.push(node1);
                if (prevCount === 0) {
                    linkNodeToChildren(context, nextItemId);
                }
            }
        }
    }
}
function linkNodeToChildren(context, itemId) {
    var node;
    node = getNodeForItem(context.visuals, itemId);
    linkNext(context, node, node.one);
    linkNext(context, node, node.two);
}
function addLink(links, link) {
    links.push(link);
}
function buildBoxes(widget, visuals) {
    var _collection_316, bottom, edge, edges, element, height, id, left, node, nodes, right, top, tr, width;
    tr = visuals.config.socketTouchRadius;
    nodes = visuals.nodes;
    for (id in nodes) {
        node = nodes[id];
        if (isDrawableNode(node)) {
            node.x = getX(node);
            node.y = getY(node);
            if (node.type === 'junction' || node.type === 'arrow-loop') {
                node.box = boxFromPoint(node.x, node.y, tr, tr);
            } else {
                node.box = boxFromPoint(node.x, node.y, node.w, node.h);
                node.leftX = node.x - node.w;
                node.rightX = node.x + node.w;
                node.topY = node.y - node.h;
                node.middleY = node.y;
                node.bottomY = node.y + node.h;
            }
        }
    }
    edges = visuals.edges;
    for (id in edges) {
        edge = edges[id];
        if (edge.vertical) {
            left = edge.head.x - tr;
            top = edge.head.y;
            bottom = edge.tail.y;
            width = tr * 2;
            height = bottom - top;
        } else {
            left = edge.head.x;
            top = edge.head.y - tr;
            right = edge.tail.x;
            width = right - left;
            height = tr * 2;
        }
        edge.box = createBox(left, top, width, height);
    }
    _collection_316 = visuals.free;
    for (element of _collection_316) {
        calculateFreeBox(widget, element, visuals.config);
    }
}
function buildSkewers(visuals) {
    var _collection_318, _collection_321, id, node;
    _collection_318 = visuals.nodes;
    for (id in _collection_318) {
        node = _collection_318[id];
        if (!node.up && node.down && !node.skewer) {
            traceSkewer(visuals, node);
        }
    }
    _collection_321 = visuals.nodes;
    for (id in _collection_321) {
        node = _collection_321[id];
        if (!node.left) {
            traceLevel(visuals, node);
        }
    }
}
function calculateSkewerPos(skewers, links, skewer, pos) {
    var _, closest, link, next, nextPos;
    if (skewer.coord < pos) {
        skewer.coord = pos;
        closest = getLinksWithLow(links, skewer.id);
        if (closest) {
            for (_ in closest) {
                link = closest[_];
                nextPos = pos + link.distance;
                next = skewers[link.high];
                calculateSkewerPos(skewers, links, next, nextPos);
            }
        }
    }
}
function collectLevels(visuals, branch) {
    var _, getLevel, levelIds, node, nodeId, visited;
    visited = {};
    visited[branch.id] = true;
    scanManhattan(visited, getDown(branch));
    delete visited[branch.id];
    levelIds = {};
    for (nodeId in visited) {
        _ = visited[nodeId];
        node = visuals.nodes[nodeId];
        levelIds[node.level.id] = true;
    }
    getLevel = function (levelId) {
        return visuals.levels[levelId];
    };
    return Object.keys(levelIds).map(getLevel);
}
function createLevel(visuals) {
    var skewer;
    skewer = createSkewerObj(visuals, false);
    visuals.levels[skewer.id] = skewer;
    return skewer;
}
function createSkewer(visuals) {
    var skewer;
    skewer = createSkewerObj(visuals, true);
    visuals.skewers[skewer.id] = skewer;
    return skewer;
}
function createSkewerObj(visuals, vertical) {
    var id, skewer;
    id = 's' + getNextId(visuals);
    skewer = {
        id: id,
        nodes: [],
        edges: [],
        coord: -1,
        boundary: 0,
        vertical: vertical
    };
    return skewer;
}
function drawParams(visuals) {
    var delta, header, hx, hy, level, metre, params, skewer, x, y;
    metre = visuals.config.metre;
    if (visuals.params) {
        skewer = createSkewer(visuals);
        header = visuals.header;
        params = visuals.params;
        level = header.level;
        hx = getX(header);
        hy = getY(header);
        x = hx + header.w + metre + params.w;
        if (params.h > header.h) {
            delta = params.h - header.h;
            y = hy - delta;
        } else {
            y = hy;
        }
        level.coord = y;
        skewer.coord = x;
        params.level = level;
        params.skewer = skewer;
        createEdge(visuals, header, params, false);
    }
}
function findLeftLinks(visuals, skewer) {
    var _branch_, _selectValue_326, boundary, corner, finish, head, hskewer, left, metre, node, rightJ, start, tail;
    _branch_ = 'Start';
    while (true) {
        switch (_branch_) {
        case 'Start':
            metre = visuals.config.metre;
            head = skewerHead(skewer);
            tail = skewerTail(skewer);
            if (head.left && tail.left) {
                start = getNextDown(head);
                finish = getNextUp(tail);
                linkSkewers(visuals, start.skewer, skewer, start.w + metre);
                node = getDown(start);
                boundary = getBoundary(visuals, skewer);
                linkSkewers(visuals, finish.skewer, skewer, boundary);
                _branch_ = 'Step';
            } else {
                _branch_ = 'Exit';
            }
            break;
        case 'Step':
            if (node === finish) {
                if (node.type === 'question') {
                    linkSkewers(visuals, node.skewer, skewer, node.w + boundary + metre);
                }
                _branch_ = 'Exit';
            } else {
                _selectValue_326 = node.type;
                if (_selectValue_326 === 'question') {
                    rightJ = getRight(node);
                    if (rightJ.up) {
                        linkSkewers(visuals, node.skewer, skewer, node.w + boundary + metre);
                        node = getDown(node);
                    } else {
                        linkSkewers(visuals, rightJ.skewer, skewer, boundary);
                        corner = goRight(node);
                        node = getDown(corner);
                    }
                } else {
                    if (_selectValue_326 === 'arrow-loop') {
                        rightJ = getRight(node);
                        linkSkewers(visuals, rightJ.skewer, skewer, boundary);
                        node = getDown(node);
                    } else {
                        if (_selectValue_326 === 'junction') {
                            linkSkewers(visuals, node.skewer, skewer, node.w + boundary);
                            if (node.subtype === 'parbegin') {
                                corner = goRight(node);
                                node = getDown(corner);
                            } else {
                                if (node.down) {
                                    node = getDown(node);
                                } else {
                                    node = goLeft(node);
                                }
                            }
                        } else {
                            if (_selectValue_326 === 'select') {
                                linkSkewers(visuals, node.skewer, skewer, node.w + boundary);
                                node = lastCase(node);
                            } else {
                                linkSkewers(visuals, node.skewer, skewer, node.w + boundary);
                                node = getDown(node);
                            }
                        }
                    }
                }
                _branch_ = 'Step';
            }
            break;
        case 'Exit':
            _branch_ = undefined;
            if (visuals.branches.length !== 1) {
                left = getSilCorner(visuals);
                hskewer = visuals.header.skewer;
                boundary = getBoundary(visuals, hskewer);
                linkSkewers(visuals, left.skewer, hskewer, boundary);
            }
            break;
        default:
            return;
        }
    }
}
function findLink(links, low, high) {
    var link;
    for (link of links) {
        if (link.low === low && link.high === high) {
            return link;
        }
    }
    return undefined;
}
function getBoundary(visuals, skewer) {
    var boundary, metre;
    metre = visuals.config.metre;
    boundary = skewer.leftWidth + metre;
    if (skewer.main) {
        boundary += metre;
    }
    return skewer.leftWidth + metre;
}
function getDurExtend(visuals, node) {
    var duration;
    if (node.side) {
        duration = getNode(visuals, node.side);
        node.duration = duration;
        return visuals.config.metre + duration.w * 2;
    } else {
        return 0;
    }
}
function getLeftHeight(node) {
    var left;
    if (node.type === 'junction' && node.left) {
        left = getLeft(node);
        if (left.type === 'question') {
            return left.h;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}
function getLinksWithLow(links, low) {
    return links.filter(function (link) {
        return link.low === low;
    });
}
function getLowestLevel(visuals) {
    var bottom;
    if (visuals.end) {
        return visuals.end.level;
    } else {
        bottom = goDown(visuals.header);
        return bottom.level;
    }
}
function getNextDown(node) {
    while (true) {
        node = getLeft(node);
        if (node.down) {
            break;
        }
    }
    return node;
}
function getNextUp(node) {
    while (true) {
        node = getLeft(node);
        if (node.up) {
            break;
        }
    }
    return node;
}
function getSilCorner(visuals) {
    var beneath, left;
    beneath = getDown(visuals.header);
    left = getLeft(beneath);
    return left;
}
function getX(node) {
    if ('x' in node) {
        return node.x;
    } else {
        return node.skewer.coord;
    }
}
function getY(node) {
    if ('y' in node) {
        return node.y;
    } else {
        return node.level.coord;
    }
}
function goLeft(node) {
    while (true) {
        if (hasLeft(node)) {
            node = getLeft(node);
        } else {
            break;
        }
    }
    return node;
}
function goRight(node) {
    while (true) {
        if (node.right) {
            node = getRight(node);
        } else {
            break;
        }
    }
    return node;
}
function isDrawableNode(node) {
    if (node.skewer || 'x' in node) {
        return true;
    } else {
        return false;
    }
}
function lastCase(select) {
    return utils.last(select.cases);
}
function linkLevels(visuals, above, below, distance) {
    linkSkewersGeneric(visuals.levelLinks, above.id, below.id, distance);
}
function linkNodeToLevel(level, node) {
    node.level = level;
    level.nodes.push(node);
}
function linkNodeToSkewer(skewer, node) {
    node.skewer = skewer;
    skewer.nodes.push(node);
}
function linkSkewers(visuals, left, right, distance) {
    linkSkewersGeneric(visuals.skewerLinks, left.id, right.id, distance);
}
function linkSkewersGeneric(links, low, high, distance) {
    var link;
    link = findLink(links, low, high);
    if (!link) {
        link = {
            low: low,
            high: high,
            distance: 0
        };
        addLink(links, link);
    }
    link.distance = Math.max(link.distance, distance);
}
function makeHalfSize(config, size) {
    var snappedUp;
    snappedUp = Math.ceil(size / config.metre) * config.metre;
    return Math.floor(snappedUp / 2);
}
function makeHalfSizeSoft(config, size) {
    var snappedUp;
    snappedUp = Math.round(size / config.metre) * config.metre;
    return Math.floor(snappedUp / 2);
}
function maxHeight(height, node) {
    return Math.max(height, node.h);
}
function moveEndUp(visuals) {
    var below, distance, lastBranch, level, levels, metre;
    metre = visuals.config.metre;
    if (visuals.end) {
        lastBranch = getNode(visuals, utils.last(visuals.branches));
        below = getDown(lastBranch);
        distance = below.level.coord - lastBranch.level.coord - below.h - lastBranch.h - metre;
        if (distance > 0) {
            levels = collectLevels(visuals, lastBranch);
            for (level of levels) {
                level.coord -= distance;
            }
        } else {
        }
    } else {
    }
}
function positionLevels(visuals) {
    var _collection_328, _collection_331, _collection_334, _collection_337, distance, down, h, id, jun, leftHeight, level, lowest, max, metre, node;
    metre = visuals.config.metre;
    _collection_328 = visuals.nodes;
    for (id in _collection_328) {
        node = _collection_328[id];
        if (node.down) {
            down = getDown(node);
            leftHeight = getLeftHeight(node);
            if (leftHeight === 0) {
                h = node.h;
            } else {
                h = leftHeight;
            }
            distance = h + down.h + metre;
            linkLevels(visuals, down.level, node.level, distance);
        }
    }
    lowest = getLowestLevel(visuals);
    calculateSkewerPos(visuals.levels, visuals.levelLinks, lowest, 0);
    max = 0;
    _collection_331 = visuals.levels;
    for (id in _collection_331) {
        level = _collection_331[id];
        max = Math.max(max, level.coord);
    }
    _collection_334 = visuals.levels;
    for (id in _collection_334) {
        level = _collection_334[id];
        level.coord = max - level.coord;
    }
    _collection_337 = visuals.nodes;
    for (id in _collection_337) {
        node = _collection_337[id];
        if (node.type === 'case' || node.type === 'branch' && node.up) {
            jun = getUp(node);
            node.level.coord = jun.level.coord + metre + node.h;
        }
    }
}
function positionSkewers(visuals) {
    var _collection_340, id, left, skewer;
    _collection_340 = visuals.skewers;
    for (id in _collection_340) {
        skewer = _collection_340[id];
        findLeftLinks(visuals, skewer);
    }
    if (visuals.branches.length === 1) {
        calculateSkewerPos(visuals.skewers, visuals.skewerLinks, visuals.header.skewer, 0);
    } else {
        left = getSilCorner(visuals);
        calculateSkewerPos(visuals.skewers, visuals.skewerLinks, left.skewer, 0);
    }
}
function removeTempEdges(visuals) {
    var _collection_343, edgeDown, edgeUp, finalTarget, lower, newLevel, oldLevel, tmpEdge, tmpJun, upper;
    _collection_343 = visuals.tempEdges;
    for (tmpEdge of _collection_343) {
        tmpJun = tmpEdge.head;
        removeEdge(visuals, tmpEdge.id);
        edgeUp = tmpJun.up;
        upper = edgeUp.head;
        edgeDown = tmpJun.down;
        lower = edgeDown.tail;
        finalTarget = edgeUp.finalTarget;
        removeEdge(visuals, edgeUp.id);
        removeEdge(visuals, edgeDown.id);
        removeNode(visuals, tmpJun.id);
        makeDownEdge(visuals, upper, lower, finalTarget);
    }
    visuals.tempEdges = [];
    if (visuals.branches.length !== 1 && visuals.end) {
        oldLevel = visuals.end.level;
        utils.remove(oldLevel.nodes, visuals.end);
        newLevel = createLevel(visuals);
        newLevel.coord = oldLevel.coord;
        newLevel.nodes.push(visuals.end);
        visuals.end.level = newLevel;
        removeEdge(visuals, visuals.end.left.id);
        moveEndUp(visuals);
    }
}
function setSameHeight(visuals) {
    forType(visuals, 'select', setSameHeightForSelect);
    forTypeTogether(visuals, 'branch', setSameHeightForNodes);
    forTypeTogether(visuals, 'address', setSameHeightForNodes);
}
function setSameHeightForNodes(visuals, nodes) {
    var height;
    height = nodes.reduce(maxHeight, 0);
    nodes.forEach(function (node) {
        node.h = height;
    });
}
function setSameHeightForSelect(visuals, select) {
    setSameHeightForNodes(visuals, select.cases);
}
function setSameWidth(visuals, skewer) {
    var _collection_345, _collection_347, config, dur, leftWidth, margin, node, width;
    config = visuals.config;
    width = 0;
    leftWidth = 0;
    margin = 0;
    _collection_345 = skewer.nodes;
    for (node of _collection_345) {
        if (node.type !== 'header') {
            width = Math.max(width, node.w);
        }
        if (node.type === 'branch') {
            margin = getBranchMargin(node);
        }
    }
    width = config.maxWidth / 2;
    skewer.boundary = width;
    _collection_347 = skewer.nodes;
    for (node of _collection_347) {
        if (shouldAlignWidth(visuals, node)) {
            node.w = width;
            dur = getDurExtend(visuals, node);
            leftWidth = Math.max(leftWidth, dur + width);
        }
    }
    skewer.leftWidth = leftWidth + margin * visuals.config.metre;
}
function shouldAlignWidth(visuals, node) {
    if (node.type in visuals.config.alignedNodes) {
        return true;
    } else {
        return false;
    }
}
function skewerHead(skewer) {
    return skewer.nodes[0];
}
function skewerTail(skewer) {
    return utils.last(skewer.nodes);
}
function traceLevel(visuals, node) {
    var level;
    level = createLevel(visuals);
    while (true) {
        linkNodeToLevel(level, node);
        if (node.right) {
            node = getRight(node);
        } else {
            break;
        }
    }
}
function traceSkewer(visuals, node) {
    var beneath, skewer;
    skewer = createSkewer(visuals, true);
    if (node.type === 'header') {
        skewer.main = true;
    } else {
        beneath = getDown(node);
        if (beneath.type == 'branch') {
            skewer.main = true;
        }
    }
    while (true) {
        linkNodeToSkewer(skewer, node);
        if (node.down) {
            node = getDown(node);
        } else {
            break;
        }
    }
}
function hasUntouchedArrows(visited, node) {
    var _collection_349, prev;
    _collection_349 = node.aprev;
    for (prev of _collection_349) {
        if (!(prev.itemId in visited)) {
            return true;
        }
    }
    return false;
}
function hasUntouchedUpstream(visited, node) {
    var _collection_351, prev;
    if (node.type === 'case') {
        return false;
    } else {
        _collection_351 = node.prev;
        for (prev of _collection_351) {
            if (!(prev.itemId in visited)) {
                return true;
            }
        }
        return false;
    }
}
function traverseItem(widget, prev, itemId, visited) {
    var item, node;
    if (!(!itemId || itemId in visited)) {
        visited[itemId] = false;
        node = getNodeByItem(widget.visuals, itemId);
        if (!(node.type === 'branch' || isBackLink(prev, node))) {
            item = widget.model.items[itemId];
            traverseItem(widget, node, item.one, visited);
            traverseItem(widget, node, item.two, visited);
        }
    }
}
function traverseItemToDelete(context, prev, itemId) {
    var item, node, visited;
    visited = context.visited;
    if (!(!itemId || itemId in visited)) {
        node = getNodeByItem(context.visuals, itemId);
        if (node.type !== 'branch') {
            if (isBackLink(prev, node)) {
                if (!hasUntouchedArrows(visited, node)) {
                    visited[itemId] = true;
                    context.deleteList.push(itemId);
                    unlinkArrow(node, visited, context.edits);
                }
            } else {
                if (!hasUntouchedUpstream(visited, node)) {
                    visited[itemId] = true;
                    context.deleteList.push(itemId);
                    item = context.items[itemId];
                    traverseItemToDelete(context, node, item.one);
                    traverseItemToDelete(context, node, item.two);
                }
            }
        }
    }
}
function unlinkArrow(arrowNode, visited, edits) {
    var node;
    node = arrowNode;
    while (true) {
        node = node.next[0];
        if (!visited[node.itemId]) {
            break;
        }
    }
    redirectUpperItems(edits, arrowNode.up.links, node.itemId);
}
function canDelete(visuals, node) {
    var _selectValue_353;
    _selectValue_353 = node.type;
    if (_selectValue_353 === 'junction' || (_selectValue_353 === 'header' || _selectValue_353 === 'arrow-loop' || _selectValue_353 === 'address' || _selectValue_353 === 'end')) {
        return false;
    } else {
        if (_selectValue_353 === 'branch') {
            return canDeleteBranch(visuals);
        } else {
            if (_selectValue_353 === 'case') {
                return canDeleteCase(node);
            } else {
                return true;
            }
        }
    }
}
function canDeleteBranch(visuals) {
    return visuals.branches.length > 2;
}
function canDeleteCase(caseNode) {
    var select;
    select = caseNode.select;
    if (select.cases.length > 2 && select.cases[0] !== caseNode) {
        return true;
    } else {
        return false;
    }
}
function deleteBlock(widget, nodes) {
    var addDeletion, bottomId, edits, head, selection, visuals;
    visuals = widget.visuals;
    selection = widget.selection;
    bottomId = findSelectionBottom(widget);
    head = getNode(visuals, selection.head);
    edits = [];
    redirectUpperItems(edits, head.up.links, bottomId);
    addDeletion = function (node) {
        deleteItemCore(edits, node.id);
        decrementImageRefCount(widget, node.image);
    };
    nodes.forEach(addDeletion);
    return doEdit(widget, edits);
}
function deleteBranch(widget, node) {
    var ditch, edits, next, remaining, toDelete, visuals;
    visuals = widget.visuals;
    edits = moveBranchIdsLeft(visuals, node.branchId);
    next = getBranchById(visuals, node.branchId + 1);
    if (!next) {
        next = getBranchById(visuals, 1);
    }
    toDelete = {};
    scanBranchItems(node, toDelete);
    remaining = utils.subtract(widget.model.items, toDelete);
    redirectBranch(visuals, remaining, toDelete, next.itemId, edits);
    ditch = function (itemId) {
        deleteWithDur(widget, itemId, edits);
    };
    Object.keys(toDelete).forEach(ditch);
    return edits;
}
function deleteCase(widget, node) {
    var below, edits, left, model, right, toKeep;
    model = widget.model;
    edits = [];
    left = node.prev[0];
    if (left === node.select) {
        right = node.next[1];
        updateItem(edits, left.itemId, { one: right.itemId });
    } else {
        if (node.next.length === 2) {
            right = node.next[1];
            updateItem(edits, left.itemId, { two: right.itemId });
        } else {
            updateItem(edits, left.itemId, { two: '' });
        }
    }
    deleteItem(widget, edits, node);
    toKeep = markOtherCasesToStay(widget, node);
    below = node.next[0];
    toKeep[node.itemId] = true;
    markToDelete(widget, toKeep, node, below.itemId, edits);
    return edits;
}
function deleteDuration(widget, node) {
    var edits, host;
    edits = [];
    host = getRight(node);
    updateItem(edits, host.id, { side: '' });
    deleteItem(widget, edits, node);
    return edits;
}
function deleteFree(widget, elements) {
    var edits, element, toDelete, toDeleteConnections;
    edits = [];
    toDelete = {};
    toDeleteConnections = {};
    for (element of elements) {
        deleteItemCore(edits, element.id);
        decrementImageRefCount(widget, element.image);
        performOnConnections(widget.visuals, element.id, toDeleteConnections, function (connection) {
            deleteItemCore(edits, connection.id);
        });
        toDelete[element.id] = true;
    }
    rearrangeZOnDelete(widget, toDelete, edits);
    return doEdit(widget, edits);
}
function deleteIconsOnPath(widget, node, endId, edits) {
    var toKeep;
    toKeep = {};
    toKeep[endId] = true;
    toKeep[node.itemId] = true;
    markToDelete(widget, toKeep, node, node.one, edits);
    return toKeep;
}
function deleteLoop(widget, node) {
    var _branch_, beforeEnd, edgeUp, edgeUp2, edits, end;
    _branch_ = 'Init';
    while (true) {
        switch (_branch_) {
        case 'Init':
            edits = [];
            edgeUp = node.up;
            end = node.loopEnd;
            beforeEnd = getUp(end);
            if (beforeEnd === node) {
                _branch_ = 'Empty loop';
            } else {
                _branch_ = 'Normal loop';
            }
            break;
        case 'Empty loop':
            redirectUpperItems(edits, edgeUp.links, end.one);
            _branch_ = 'Delete items';
            break;
        case 'Normal loop':
            redirectUpperItems(edits, edgeUp.links, node.one);
            edgeUp2 = end.up;
            redirectUpperItems(edits, edgeUp2.links, end.one);
            _branch_ = 'Delete items';
            break;
        case 'Delete items':
            _branch_ = undefined;
            deleteItem(widget, edits, node);
            deleteItem(widget, edits, end);
            return edits;
        default:
            return;
        }
    }
}
function deleteOne(widget, node) {
    var _selectValue_355, edits, nodes;
    edits = [];
    if (canDelete(widget.visuals, node)) {
        if (isMindIcon(widget, node)) {
            nodes = [];
            getMindSubtree(node, nodes);
            edits = deleteMind(widget, nodes);
        } else {
            _selectValue_355 = node.type;
            if (_selectValue_355 === 'question') {
                edits = deleteQuestion(widget, node);
            } else {
                if (_selectValue_355 === 'loopbegin') {
                    edits = deleteLoop(widget, node);
                } else {
                    if (_selectValue_355 === 'loopend') {
                        edits = deleteLoop(widget, node.loopStart);
                    } else {
                        if (_selectValue_355 === 'params') {
                            edits = deleteParams(widget, node);
                        } else {
                            if (_selectValue_355 === 'case') {
                                edits = deleteCase(widget, node);
                            } else {
                                if (_selectValue_355 === 'select') {
                                    edits = deleteSelect(widget, node);
                                } else {
                                    if (_selectValue_355 === 'branch') {
                                        edits = deleteBranch(widget, node);
                                    } else {
                                        if (_selectValue_355 === 'duration') {
                                            edits = deleteDuration(widget, node);
                                        } else {
                                            edits = deleteSimple(widget, node);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return doEdit(widget, edits);
    }
}
function deleteParPath(widget, node) {
    var edits, end, endId, left, model;
    model = widget.model;
    edits = [];
    left = getLeft(node);
    endId = getParTarget(node);
    end = getNode(widget.visuals, endId);
    deleteIconsOnPath(widget, node, endId, edits);
    if (!isFirstPar(left) || node.right) {
        deleteItem(widget, edits, node);
        if (node.two) {
            updateItem(edits, left.itemId, { two: node.two });
        } else {
            updateItem(edits, left.itemId, { two: '' });
        }
        return doEdit(widget, edits);
    } else {
        deleteItem(widget, edits, node);
        deleteItem(widget, edits, end);
        deleteItem(widget, edits, left);
        if (left.one === endId) {
            redirectUpperItems(edits, left.up.links, end.one);
        } else {
            redirectUpperItems(edits, left.up.links, left.one);
            redirectPrevItems(edits, end, end.one);
        }
        return doEdit(widget, edits);
    }
}
function deleteParams(widget, node) {
    var change, edits;
    change = {
        fields: { params: '' },
        op: 'update'
    };
    edits = [change];
    if ('params' in widget.model.items) {
        deleteItemCore(edits, 'params');
    }
    return edits;
}
function deleteQuestion(widget, node) {
    var edits, model, one, toKeep, two;
    model = widget.model;
    edits = [];
    popFromSkewer(widget, node, edits);
    toKeep = {};
    toKeep[node.itemId] = true;
    one = node.next[0];
    markToStay(widget, node, one.itemId, toKeep);
    two = node.next[1];
    markToDelete(widget, toKeep, node, two.itemId, edits);
    return edits;
}
function deleteSelect(widget, node) {
    var below, edgeUp, edits, first, model, one, toKeep;
    model = widget.model;
    edits = [];
    first = firstCase(node);
    below = first.next[0];
    edgeUp = node.up;
    redirectUpperItems(edits, edgeUp.links, below.itemId);
    deleteItem(widget, edits, node);
    toKeep = {};
    toKeep[node.itemId] = true;
    one = node.next[0];
    markToStay(widget, undefined, below.itemId, toKeep);
    markToDelete(widget, toKeep, node, first.itemId, edits);
    return edits;
}
function deleteSelection(widget) {
    var connection, elements, nodes;
    elements = getSelectedFree(widget);
    if (elements.length === 0) {
        nodes = getNodesFromSelection(widget);
        if (nodes.length === 0) {
            connection = getSelectedConnection(widget);
            if (connection) {
                deleteConnection(widget, connection.id);
            }
        } else {
            deleteSelectionCore(widget, nodes);
        }
    } else {
        deleteFree(widget, elements);
    }
}
function deleteSelectionCore(widget, nodes) {
    var _selectValue_357, edits;
    _selectValue_357 = nodes.length;
    if (_selectValue_357 !== 0) {
        if (_selectValue_357 === 1) {
            deleteOne(widget, nodes[0]);
        } else {
            if (isMindIcon(widget, nodes[0])) {
                edits = deleteMind(widget, nodes);
                doEdit(widget, edits);
            } else {
                deleteBlock(widget, nodes);
            }
        }
    }
}
function deleteSimple(widget, node) {
    var edits;
    edits = [];
    popFromSkewer(widget, node, edits);
    return edits;
}
function deleteWithDur(widget, id, edits) {
    var node;
    node = getNode(widget.visuals, id);
    deleteItem(widget, edits, node);
}
function findSelectionBottom(widget) {
    var next, node, selection, visuals;
    visuals = widget.visuals;
    selection = widget.selection;
    node = getNode(visuals, selection.head);
    while (true) {
        next = node.next[0];
        if (next.id in selection.prims) {
            node = next;
        } else {
            break;
        }
    }
    return next.itemId;
}
function markOtherCasesToStay(widget, node) {
    var _collection_359, below, caseNode, toKeep;
    toKeep = {};
    _collection_359 = node.select.cases;
    for (caseNode of _collection_359) {
        if (caseNode !== node) {
            below = caseNode.next[0];
            markToStay(widget, caseNode, below.itemId, toKeep);
        }
    }
    return toKeep;
}
function markToDelete(widget, visited, prev, startItemId, edits) {
    var addDeletion, context;
    context = {
        visuals: widget.visuals,
        items: widget.model.items,
        deleteList: [],
        visited: visited,
        edits: edits
    };
    traverseItemToDelete(context, prev, startItemId);
    addDeletion = function (id) {
        deleteWithDur(widget, id, edits);
    };
    context.deleteList.forEach(addDeletion);
}
function markToStay(widget, prev, startItemId, toKeep) {
    traverseItem(widget, prev, startItemId, toKeep);
}
function createEdge(visuals, head, tail, vertical) {
    var edge, id;
    id = 'e' + getNextId(visuals);
    edge = {
        id: id,
        head: head,
        tail: tail,
        vertical: vertical,
        links: []
    };
    if (vertical) {
        if (head.down) {
            throw Error('head.down is busy');
        } else {
            if (tail.up) {
                throw Error('tail.up is busy');
            } else {
                head.down = edge;
                tail.up = edge;
            }
        }
    } else {
        if (head.right) {
            throw Error('head.right is busy');
        } else {
            if (tail.left) {
                throw Error('tail.left is busy');
            } else {
                head.right = edge;
                tail.left = edge;
            }
        }
    }
    visuals.edges[id] = edge;
    return edge;
}
function createNode(visuals, itemId, type, content, id) {
    var _selectValue_361, node;
    if (!id) {
        id = 'n' + getNextId(visuals);
    }
    node = {
        id: id,
        itemId: itemId,
        type: type,
        content: content,
        w: 0,
        h: 0,
        next: [],
        prev: [],
        aprev: [],
        targets: [],
        sources: [],
        parallelStack: [],
        loops: {}
    };
    visuals.nodes[id] = node;
    if (itemId) {
        visuals.itemsToNodes[itemId] = id;
    }
    addToMultiDict(visuals.byType, node.type, node.id);
    _selectValue_361 = node.type;
    if (_selectValue_361 === 'header') {
        visuals.header = node;
    } else {
        if (_selectValue_361 === 'end') {
            visuals.end = node;
        }
    }
    return node;
}
function getDown(node) {
    return node.down.tail;
}
function getEdge(visuals, edgeId) {
    return visuals.edges[edgeId];
}
function getLeft(node) {
    return node.left.head;
}
function getNode(visuals, nodeId) {
    return visuals.nodes[nodeId];
}
function getRight(node) {
    return node.right.tail;
}
function getUp(node) {
    return node.up.head;
}
function goDown(node) {
    while (true) {
        if (node.down) {
            node = getDown(node);
        } else {
            break;
        }
    }
    return node;
}
function goUp(node) {
    while (true) {
        if (node.up) {
            node = getUp(node);
        } else {
            break;
        }
    }
    return node;
}
function buildArrowUp(visuals, loop) {
    var arrow, next1, top;
    top = createJunction(visuals, loop.id);
    arrow = createEdge(visuals, loop, top, false);
    arrow.role = 'arrow';
    next1 = loop.next[0];
    makeDownEdge(visuals, loop, next1, next1);
    return next1;
}
function buildManhattan(visuals, startNode) {
    var _branch_, bottom, jun2, jun3, mountRight, mountUp, node1, node2, stack, step, top;
    _branch_ = 'Analyze';
    while (true) {
        switch (_branch_) {
        case 'Analyze':
            stack = [];
            planNextSteps(visuals, stack, startNode);
            _branch_ = 'Process node';
            break;
        case 'Process node':
            if (stack.length === 0) {
                _branch_ = 'Exit';
            } else {
                step = stack.pop();
                node1 = step.node1;
                node2 = step.node2;
                if (step.back) {
                    if (step.down) {
                        _branch_ = 'Down to arrow';
                    } else {
                        _branch_ = 'Right to arrow';
                    }
                } else {
                    if (!step.down) {
                        node1 = turnDown(visuals, node1, node2);
                    }
                    if (node2.prev.length === 1 || !node2.up) {
                        _branch_ = 'Simple case';
                    } else {
                        mountUp = node2.mountUp;
                        mountRight = node2.mountRight;
                        _branch_ = 'Join';
                    }
                }
            }
            break;
        case 'Simple case':
            makeDownEdge(visuals, node1, node2, node2);
            _branch_ = 'Next nodes';
            break;
        case 'Join':
            if (mountUp && parallelCompatible(node1, mountUp)) {
                if (isUglyMountUp(node1, node2)) {
                    node2.mountUp = null;
                    jun2 = createLeftUp(visuals, node2, node2);
                    makeDownEdge(visuals, node1, jun2, node2);
                    if (mountRight) {
                        makeLeftEdge(visuals, mountRight, jun2, node2);
                    } else {
                        jun3 = splitVertical(visuals, node2);
                        makeLeftEdge(visuals, jun3, jun2, node2);
                    }
                } else {
                    makeDownEdge(visuals, node1, mountUp, node2);
                    if (mountUp === node2.mountUp) {
                        node2.mountUp = null;
                    }
                }
            } else {
                jun2 = createLeftUp(visuals, node2, node2);
                makeDownEdge(visuals, node1, jun2, node2);
                if (mountRight) {
                    makeLeftEdge(visuals, mountRight, jun2, node2);
                } else {
                    jun3 = splitVertical(visuals, node2);
                    makeLeftEdge(visuals, jun3, jun2, node2);
                }
            }
            _branch_ = 'Process node';
            break;
        case 'Down to arrow':
            if (node2.rightEdge) {
                jun2 = splitRight(visuals, node2.rightEdge);
                makeDownEdge(visuals, node1, jun2, node2);
            } else {
                turn180up(visuals, node1, node2);
            }
            _branch_ = 'Process node';
            break;
        case 'Right to arrow':
            top = getRight(node2);
            if (node2.upEdge) {
                bottom = splitVerticalUp(visuals, node2.upEdge);
            } else {
                bottom = createJunction(visuals, node2);
                makeUpEdge(visuals, top, bottom, node2);
            }
            node2.rightEdge = makeRightEdge(visuals, node1, bottom, node2);
            _branch_ = 'Process node';
            break;
        case 'Next nodes':
            planNextSteps(visuals, stack, node2);
            _branch_ = 'Process node';
            break;
        case 'Exit':
            _branch_ = undefined;
            break;
        default:
            return;
        }
    }
}
function createJunction(visuals, finalTarget) {
    var node;
    node = createNode(visuals, undefined, 'junction', '');
    node.finalTarget = finalTarget;
    return node;
}
function createLeftDown(visuals, finalTarget) {
    var result;
    result = createJunction(visuals, finalTarget);
    return result;
}
function createLeftUp(visuals, node2, finalTarget) {
    var result;
    result = createJunction(visuals, finalTarget);
    node2.mountRight = result;
    if (node2.subtype === 'parend') {
        result.parallelStack = node2.parallelStack;
    } else {
        result.parallelStack = node2.parallelStack.slice();
        result.parallelStack.pop();
    }
    return result;
}
function createTempEdge(visuals, node, leftBottom) {
    var edge, leftTop, parNext, parTop, tmpJun;
    leftTop = goUp(node);
    parTop = getLeft(leftTop);
    parNext = getDown(parTop);
    if (parNext.type == 'case') {
        parNext = getDown(parNext);
    }
    tmpJun = splitVertical(visuals, parNext);
    edge = createEdge(visuals, tmpJun, leftBottom, false);
    visuals.tempEdges.push(edge);
}
function isBackLink(lower, upper) {
    if (isArrowLoop(upper) && utils.contains(upper.aprev, lower)) {
        return true;
    } else {
        return false;
    }
}
function isLeftDown(node) {
    if (node.type === 'junction' && node.left && !node.up && !node.right && node.down) {
        return true;
    } else {
        return false;
    }
}
function isLeftUp(node) {
    if (node.type === 'junction' && node.left && node.up && !node.right && !node.down) {
        return true;
    } else {
        return false;
    }
}
function isRightT(node) {
    if (node.type === 'junction' && !node.left && node.up && node.right && node.down) {
        return true;
    } else {
        return false;
    }
}
function isRightUp(node) {
    if (node.type === 'junction' && !node.left && node.up && node.right && !node.down) {
        return true;
    } else {
        return false;
    }
}
function isUglyMountUp(node1, node2) {
    var below;
    if (node1.type === 'junction') {
        return false;
    } else {
        below = getDown(node2.mountUp);
        if (below.type === 'junction') {
            return true;
        } else {
            return false;
        }
    }
}
function layoutParBlock(visuals, stack, firstPar) {
    var down, edge, i, left, path, right;
    firstPar.paths = [firstPar];
    left = firstPar;
    while (true) {
        right = left.next[1];
        firstPar.paths.push(right);
        edge = createEdge(visuals, left, right, false);
        edge.role = 'parceiling';
        left = right;
        if (!left.two) {
            break;
        }
    }
    for (i = firstPar.paths.length - 1; i >= 0; i--) {
        path = firstPar.paths[i];
        down = path.next[0];
        planStep(stack, path, down);
    }
}
function layoutSelect(visuals, stack, select) {
    var _collection_363, caseNode, edge, i, jun, left, node;
    select.cases = [];
    node = select.next[0];
    while (true) {
        node.select = select;
        select.cases.push(node);
        if (node.next.length === 2) {
            node = node.next[1];
        } else {
            break;
        }
    }
    left = null;
    _collection_363 = select.cases;
    for (caseNode of _collection_363) {
        jun = createJunction(visuals, undefined);
        jun.role = 'case';
        makeDownEdgeCore(visuals, jun, caseNode, undefined);
        if (left) {
            edge = createEdge(visuals, left, jun, false);
            edge.role = 'selectceil';
        }
        left = jun;
    }
    makeDownEdgeCore(visuals, select, getUp(select.cases[0]), undefined);
    for (i = select.cases.length - 1; i >= 0; i--) {
        node = select.cases[i];
        planStep(stack, node, node.next[0]);
    }
}
function makeDownEdge(visuals, head, tail, finalTarget) {
    var edge;
    edge = makeDownEdgeCore(visuals, head, tail, finalTarget);
    if (isLeftDown(head)) {
        finalTarget.mountUp = head;
    }
    edge.role = 'down';
    return edge;
}
function makeDownEdgeCore(visuals, head, tail, finalTarget) {
    var edge;
    edge = createEdge(visuals, head, tail, true);
    edge.finalTarget = finalTarget;
    edge.source = head;
    edge.target = tail;
    head.targets.push(edge);
    tail.sources.push(edge);
    return edge;
}
function makeLeftEdge(visuals, left, right, finalTarget) {
    var edge;
    edge = createEdge(visuals, left, right, false);
    edge.role = 'left';
    edge.finalTarget = finalTarget;
    edge.source = right;
    edge.target = left;
    right.targets.push(edge);
    left.sources.push(edge);
    return edge;
}
function makeRightEdge(visuals, left, right, finalTarget) {
    var edge;
    edge = createEdge(visuals, left, right, false);
    edge.role = 'right';
    edge.finalTarget = finalTarget;
    edge.source = left;
    edge.target = right;
    left.targets.push(edge);
    right.sources.push(edge);
    return edge;
}
function makeRightLoopEdge(visuals, left, right, finalTarget) {
    var edge;
    edge = createEdge(visuals, left, right, false);
    edge.role = 'right-loop';
    edge.finalTarget = finalTarget;
    edge.source = left;
    edge.target = right;
    left.targets.push(edge);
    right.sources.push(edge);
    finalTarget.rightEdge = edge;
    return edge;
}
function makeUpEdge(visuals, head, tail, finalTarget) {
    var edge;
    edge = createEdge(visuals, head, tail, true);
    edge.finalTarget = finalTarget;
    edge.source = tail;
    edge.target = head;
    tail.targets.push(edge);
    head.sources.push(edge);
    edge.role = 'up';
    finalTarget.upEdge = edge;
    return edge;
}
function parallelCompatible(node1, node2) {
    var length1, length2, par1, par2;
    length1 = node1.parallelStack.length;
    length2 = node2.parallelStack.length;
    if (length1 === length2) {
        if (length1) {
            par1 = node1.parallelStack[length1 - 1];
            par2 = node2.parallelStack[length1 - 1];
            return par1 === par2;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
function planNextSteps(visuals, stack, node) {
    var _selectValue_365, next1, next2;
    _selectValue_365 = node.type;
    if (_selectValue_365 === 'select') {
        layoutSelect(visuals, stack, node);
    } else {
        if (_selectValue_365 === 'question') {
            next1 = node.next[0];
            next2 = node.next[1];
            planRightStep(stack, node, next2);
            planStep(stack, node, next1);
        } else {
            if (_selectValue_365 === 'arrow-loop') {
                next1 = buildArrowUp(visuals, node);
                planNextSteps(visuals, stack, next1);
            } else {
                if (_selectValue_365 === 'junction' && node.subtype === 'parbegin') {
                    layoutParBlock(visuals, stack, node);
                } else {
                    if (node.next.length !== 0) {
                        next1 = node.next[0];
                        planStep(stack, node, next1);
                    }
                }
            }
        }
    }
}
function planRightStep(stack, node1, node2) {
    var step;
    step = planStep(stack, node1, node2);
    step.down = false;
    return step;
}
function planStep(stack, node1, node2) {
    var parallelStack, step;
    step = {
        node1: node1,
        node2: node2,
        down: true,
        back: false
    };
    if (node1.subtype === 'parbegin') {
        parallelStack = node1.parallelStack.slice();
        parallelStack.push(node1.id);
        node2.parallelStack = parallelStack;
    } else {
        node2.parallelStack = node1.parallelStack.slice();
    }
    if (node2.subtype === 'parend') {
        node2.parallelStack.pop();
    }
    if (isBackLink(node1, node2)) {
        step.back = true;
    }
    stack.push(step);
    return step;
}
function removeEdge(visuals, id) {
    var edge, head, tail;
    edge = visuals.edges[id];
    head = edge.head;
    tail = edge.tail;
    if (edge.vertical) {
        head.down = null;
        tail.up = null;
    } else {
        head.right = null;
        tail.left = null;
    }
    utils.remove(head.sources, edge);
    utils.remove(head.targets, edge);
    utils.remove(tail.sources, edge);
    utils.remove(tail.targets, edge);
    edge.head = null;
    edge.tail = null;
    edge.source = null;
    edge.target = null;
    edge.finalTarget = null;
    delete visuals.edges[id];
}
function removeNode(visuals, id) {
    var node;
    node = visuals.nodes[id];
    if (node.left || node.up || node.right || node.down) {
        throw new Error('removeNode: Node is connected: ' + id);
    } else {
        node.finalTarget = undefined;
        utils.remove(node.skewer.nodes, node);
        utils.remove(node.level.nodes, node);
        delete visuals.nodes[id];
        removeFromMultiDict(visuals.byType, node.type, node.id);
    }
}
function splitRight(visuals, rightEdge) {
    var finalTarget, jun, leftNode, leftPart, rightNode, role;
    leftNode = rightEdge.head;
    rightNode = rightEdge.tail;
    finalTarget = rightEdge.finalTarget;
    role = rightEdge.role;
    removeEdge(visuals, rightEdge.id);
    jun = createJunction(visuals, finalTarget);
    leftPart = makeRightEdge(visuals, leftNode, jun, finalTarget);
    leftPart.role = role;
    makeRightLoopEdge(visuals, jun, rightNode, finalTarget);
    return jun;
}
function splitVertical(visuals, node) {
    var finalTarget, jun, upEdge, upNode;
    upEdge = node.up;
    upNode = upEdge.head;
    finalTarget = upEdge.finalTarget;
    removeEdge(visuals, upEdge.id);
    jun = createJunction(visuals, finalTarget);
    makeDownEdge(visuals, upNode, jun, finalTarget);
    makeDownEdge(visuals, jun, node, finalTarget);
    return jun;
}
function splitVerticalUp(visuals, upEdge) {
    var downNode, finalTarget, jun, upNode;
    upNode = upEdge.head;
    downNode = upEdge.tail;
    finalTarget = upEdge.finalTarget;
    removeEdge(visuals, upEdge.id);
    jun = createJunction(visuals, finalTarget);
    makeUpEdge(visuals, jun, downNode, finalTarget);
    makeUpEdge(visuals, upNode, jun, finalTarget);
    return jun;
}
function turn180up(visuals, node1, node2) {
    var bottom, left, top;
    top = getRight(node2);
    bottom = createJunction(visuals, node2);
    makeUpEdge(visuals, top, bottom, node2);
    left = createJunction(visuals, node2);
    makeDownEdge(visuals, node1, left, node2);
    makeRightLoopEdge(visuals, left, bottom, node2);
    createTempEdge(visuals, node1, left);
}
function turnDown(visuals, node1, node2) {
    var finalTarget, jun;
    finalTarget = node2;
    jun = createLeftDown(visuals, finalTarget);
    jun.parallelStack = node1.parallelStack.slice();
    makeRightEdge(visuals, node1, jun, finalTarget);
    return jun;
}
async function createImageItem(widget, edits, edit, imageId, content, inserted) {
    var newImage, newImageId, newItem;
    if (imageId in inserted) {
        newImageId = inserted[imageId];
    } else {
        newItem = {
            content: content,
            type: 'image'
        };
        newImageId = createItem(widget.model, edits, newItem);
        newImage = {
            content: content,
            refCount: 0
        };
        await loadImage(newImage);
        widget.images[newImageId] = newImage;
        inserted[imageId] = newImageId;
    }
    edit.fields.image = newImageId;
    incrementImageRefCount(widget, newImageId);
}
function decrementImageRefCount(visuals, imageId) {
    var image;
    if (imageId) {
        image = visuals.images[imageId];
        image.refCount--;
    }
}
function deleteOrphanImages(widget, edits) {
    var _collection_367, id, image, images2;
    images2 = {};
    _collection_367 = widget.images;
    for (id in _collection_367) {
        image = _collection_367[id];
        if (image.refCount === 0) {
            deleteItemCore(edits, id);
        } else {
            images2[id] = image;
        }
    }
    widget.images = images2;
}
function incrementImageRefCount(visuals, imageId) {
    var image;
    if (imageId) {
        image = visuals.images[imageId];
        image.refCount++;
    }
}
function insertImageDataItem(imageData, edits, images) {
    var edit, imageId, tempId;
    if (imageData) {
        if (imageData.id) {
            imageId = imageData.id;
        } else {
            tempId = 'temp-image-id';
            images[tempId] = { content: imageData.content };
            imageId = tempId;
        }
        for (edit of edits) {
            if (edit.op === 'insert') {
                edit.fields.image = imageId;
            }
        }
    }
}
async function loadCreatedImages(widget, edits, images) {
    var edit, editCopy, existingImage, imageId, inserted, item, newImage;
    inserted = {};
    editCopy = edits.slice();
    for (edit of editCopy) {
        if (edit.id && edit.op !== 'delete') {
            imageId = edit.fields.image;
            if (imageId) {
                existingImage = widget.images[imageId];
                newImage = images[imageId];
                if (!(existingImage && (!newImage || existingImage.content === newImage.content))) {
                    await createImageItem(widget, edits, edit, imageId, newImage.content, inserted);
                }
                if (edit.op === 'update') {
                    item = widget.model.items[edit.id];
                    decrementImageRefCount(widget, item.image);
                }
            }
        }
    }
}
function loadImage(image) {
    var _obj_;
    _obj_ = loadImage_create(image);
    return _obj_.run();
}
async function loadImages(widget) {
    var _collection_370, diagram, id, image, item;
    diagram = widget.edit.diagram;
    widget.images = {};
    _collection_370 = diagram.items;
    for (id in _collection_370) {
        item = _collection_370[id];
        if (item.type === 'image') {
            image = {
                content: item.content,
                refCount: 0
            };
            await loadImage(image);
            widget.images[id] = image;
        }
    }
}
function resetImageRefCounts(widget) {
    var _collection_373, id, image;
    _collection_373 = widget.images;
    for (id in _collection_373) {
        image = _collection_373[id];
        image.refCount = 0;
    }
}
function resizeElementToImage(widget, edits) {
    var edit, height, image, imageId;
    for (edit of edits) {
        imageId = edit.fields.image;
        if (imageId) {
            image = widget.images[imageId];
            height = getImageHeight(image, edit.fields.width);
            height = Math.round(height / 10) * 10;
            edit.fields.height = height;
        }
    }
}
function drawEdge(widget, edge, ctx) {
    var _selectValue_376, color, config, endPos, length, low, radius, showMeat, socketY, startPos, thickness, visuals, x1, x2, y1, y2;
    visuals = widget.visuals;
    config = visuals.config;
    x1 = getX(edge.head);
    y1 = getY(edge.head);
    x2 = getX(edge.tail);
    y2 = getY(edge.tail);
    thickness = visuals.config.theme.lineWidth || 1;
    radius = visuals.config.lineRadius || 0;
    color = visuals.config.theme.lines;
    if (visuals.highlight === edge.id) {
        color = visuals.config.theme.highlight;
        thickness = 2;
    }
    ctx.fillStyle = color;
    if (edge.vertical) {
        if (radius) {
            if (shouldSmoothJunction(edge.head)) {
                y1 += radius;
            }
            if (shouldSmoothJunction(edge.tail)) {
                y2 -= radius;
            }
        }
        if (edge.head.skewer && edge.head.skewer.main) {
            thickness *= 3;
        }
        line(ctx, x1, y1, x2, y2, color, thickness);
        showMeat = false;
        if (!(isReadonly(widget) || !(showMeat && edge.role === 'down') || !(visuals.highlight !== edge.id))) {
            startPos = getVerticalStartPos(edge);
            endPos = getVerticalEndPos(edge);
            length = endPos - startPos;
            if (length <= config.socketTouchRadius * 2) {
                socketY = Math.round((startPos + endPos) / 2);
                drawPointSocket(ctx, x1, socketY, config.theme.highlight, 'black', config);
            } else {
                drawVerticalSocket(ctx, x1, startPos, endPos, config.theme.highlight, 'black', config);
            }
        }
        edge.thickness = thickness;
        edge.color = color;
    } else {
        if (edge.role === 'parceiling') {
            line(ctx, x1, y1, x2, y2, color, thickness * 2);
            low = y1 + visuals.config.parallelWidth;
            line(ctx, x1, low, x2, low, color, thickness);
            edge.thickness = thickness;
            edge.color = color;
        } else {
            _selectValue_376 = edge.role;
            if (_selectValue_376 === 'arrow') {
                drawArrowHead(ctx, color, x1 + thickness, y1, Math.PI);
            } else {
                if (_selectValue_376 === 'rarrow') {
                    drawArrowHead(ctx, color, x2 - thickness, y1, 0);
                }
            }
            if (radius) {
                if (!(!shouldSmoothJunction(edge.head) || edge.role === 'arrow')) {
                    x1 += radius;
                }
                if (!(!shouldSmoothJunction(edge.tail) || edge.role === 'rarrow')) {
                    x2 -= radius;
                }
            }
            line(ctx, x1, y1, x2, y2, color, thickness);
            edge.thickness = thickness;
            edge.color = color;
        }
    }
}
function drawIcon(visuals, node, ctx) {
    var render;
    ctx.setLineDash([]);
    render = visuals.config.iconRender[node.type];
    if (render) {
        render(visuals, node, ctx);
    } else {
        console.error('iconRender callback not found for element of type: ' + node.type);
    }
}
function shouldSmoothJunction(node) {
    if (node.type === 'junction' && !node.sharp && !(node.role && node.role in unit.noSmooth) && !(node.subtype === 'parend' || (node.left && (node.left.role === 'left' && node.left.finalTarget && node.left.finalTarget.subtype === 'parend' || node.left.role && node.left.role in unit.noSmooth) || node.right && node.right.role && node.right.role in unit.noSmooth))) {
        return true;
    } else {
        return false;
    }
}
function scanManhattan(visited, node) {
    if (!(node.id in visited)) {
        visited[node.id] = true;
        if (node.left) {
            scanManhattan(visited, getLeft(node));
        }
        if (node.up) {
            scanManhattan(visited, getUp(node));
        }
        if (node.right) {
            scanManhattan(visited, getRight(node));
        }
        if (node.down) {
            scanManhattan(visited, getDown(node));
        }
    }
}
function scanTwoGraph(items, visited, id) {
    var item;
    if (!(!id || id in visited)) {
        visited[id] = true;
        item = items[id];
        scanTwoGraph(items, visited, item.one);
        scanTwoGraph(items, visited, item.two);
    }
}
function addFreedomToBox(box, widgetWidth, widgetHeight) {
    var hor, result, ver;
    result = {};
    hor = Math.floor(widgetWidth / 2);
    ver = Math.floor(widgetHeight / 2);
    if (box.width > hor) {
        result.left = box.left - hor;
        result.right = box.right + hor;
        result.width = box.width + hor * 2;
    } else {
        result.left = box.left;
        result.right = box.right;
        result.width = box.width;
    }
    if (box.height > ver) {
        result.top = box.top - ver;
        result.bottom = box.bottom + ver;
        result.height = box.height + ver * 2;
    } else {
        result.top = box.top;
        result.bottom = box.bottom;
        result.height = box.height;
    }
    return result;
}
function calculateScrollPos(context) {
    var barFreeSpace, bottom, height, maxScroll, minScroll, ratio, top;
    minScroll = context.boxTop;
    maxScroll = context.boxBottom - context.widgetSizeD;
    ratio = (context.scroll - minScroll) / (maxScroll - minScroll);
    top = context.margin / context.zoom;
    bottom = (context.widgetSize - context.barWidth - context.margin * 3) / context.zoom;
    height = bottom - top;
    context.scrollHeight = height * context.widgetSizeD / context.boxHeight;
    barFreeSpace = height - context.scrollHeight;
    context.scrollTop = top + ratio * barFreeSpace;
    context.barToBox = (context.boxHeight - context.widgetSizeD) / barFreeSpace;
}
function drawHorizontalScrollbar(widget, context) {
    var cheight, cleft, config, cradius, ctop, ctx, id, visuals, zoom;
    id = 'hscroll';
    visuals = widget.visuals;
    ctx = visuals.ctx;
    config = visuals.config;
    zoom = widget.zoomFactor;
    clearShadow(ctx);
    ctop = (widget.height - (context.barWidth + context.margin)) / zoom + visuals.scrollY;
    cleft = context.scrollTop + visuals.scrollX;
    cheight = context.barWidth / zoom;
    cradius = cheight / 2;
    if (visuals.highlight === id) {
        ctx.fillStyle = config.theme.scrollBarHover;
    } else {
        ctx.fillStyle = config.theme.scrollBar;
    }
    roundedRect(ctx, cleft, ctop, context.scrollHeight, cheight, cradius);
    ctx.fill();
    visuals.horizontalScrollBar = {
        elType: id,
        primId: id,
        barToBox: context.barToBox,
        box: createBox(cleft, ctop - context.margin, context.scrollHeight, cheight + context.margin * 2)
    };
}
function drawScrollbars(widget) {
    var box, context, margin, visuals, wheight, width, wwidth, zoom;
    visuals = widget.visuals;
    zoom = widget.zoomFactor;
    margin = 5;
    width = 10;
    visuals.verticalScrollBar = undefined;
    visuals.horizontalScrollBar = undefined;
    if (widget.height > 30 && widget.width > 30) {
        wheight = widget.height / zoom;
        wwidth = widget.width / zoom;
        box = visuals.box;
        if (!(wheight >= box.height)) {
            context = {
                boxTop: box.top,
                boxHeight: box.height,
                boxBottom: box.bottom,
                zoom: zoom,
                widgetSizeD: wheight,
                widgetSize: widget.height,
                margin: margin,
                barWidth: width,
                scroll: visuals.scrollY
            };
            calculateScrollPos(context);
            drawVerticalScrollbar(widget, context);
        }
        if (!(wwidth >= box.width)) {
            context = {
                boxTop: box.left,
                boxHeight: box.width,
                boxBottom: box.right,
                zoom: zoom,
                widgetSizeD: wwidth,
                widgetSize: widget.width,
                margin: margin,
                barWidth: width,
                scroll: visuals.scrollX
            };
            calculateScrollPos(context);
            drawHorizontalScrollbar(widget, context);
        }
    } else {
    }
}
function drawVerticalScrollbar(widget, context) {
    var cleft, config, cradius, ctop, ctx, cwidth, id, visuals, zoom;
    id = 'vscroll';
    visuals = widget.visuals;
    ctx = visuals.ctx;
    config = visuals.config;
    zoom = widget.zoomFactor;
    clearShadow(ctx);
    cleft = (widget.width - (context.barWidth + context.margin)) / zoom + visuals.scrollX;
    ctop = context.scrollTop + visuals.scrollY;
    cwidth = context.barWidth / zoom;
    cradius = cwidth / 2;
    if (visuals.highlight === id) {
        ctx.fillStyle = config.theme.scrollBarHover;
    } else {
        ctx.fillStyle = config.theme.scrollBar;
    }
    roundedRect(ctx, cleft, ctop, cwidth, context.scrollHeight, cradius);
    ctx.fill();
    visuals.verticalScrollBar = {
        elType: id,
        primId: id,
        barToBox: context.barToBox,
        box: createBox(cleft - context.margin, ctop, cwidth + context.margin * 2, context.scrollHeight)
    };
}
function hitScrollBar(visuals, pos) {
    if (visuals.verticalScrollBar && hitBox(visuals.verticalScrollBar.box, pos.x, pos.y)) {
        return visuals.verticalScrollBar;
    } else {
        if (visuals.horizontalScrollBar && hitBox(visuals.horizontalScrollBar.box, pos.x, pos.y)) {
            return visuals.horizontalScrollBar;
        } else {
            return undefined;
        }
    }
}
function canHaveDuration(node) {
    var _selectValue_378;
    _selectValue_378 = node.type;
    if ((_selectValue_378 === 'action' || (_selectValue_378 === 'question' || _selectValue_378 === 'select' || _selectValue_378 === 'insertion' || _selectValue_378 === 'simpleinput' || _selectValue_378 === 'simpleoutput' || _selectValue_378 === 'input' || _selectValue_378 === 'output' || _selectValue_378 === 'shelf' || _selectValue_378 === 'process')) && !node.side) {
        return true;
    } else {
        return false;
    }
}
function clearSockets(visuals) {
    visuals.sockets = [];
    visuals.currentSocket = undefined;
    visuals.onSocket = false;
}
function copyEdgeLinks(socket) {
    var edge;
    edge = socket.edge;
    socket.target = edge.finalTarget.itemId;
    utils.addRange(edge.links, socket.links);
}
function createDurationSocket(visuals, node, op) {
    var radius, socket;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, node.x - node.w, node.y, op, 'duration', radius);
    socket.node = node;
}
function createSocket(visuals, x, y, op, type, radius) {
    var self;
    self = {};
    self.id = '';
    self.x = x;
    self.y = y;
    self.type = type;
    self.op = op;
    self.on = false;
    self.id = visuals.sockets.length + 1;
    self.edge = undefined;
    self.node = undefined;
    self.links = [];
    self.finalTarget = undefined;
    self.box = boxFromPoint(x, y, radius, radius);
    visuals.sockets.push(self);
    return self;
}
function createSocketFromEdge(visuals, edge, op, type, imageData) {
    var Min, _selectValue_380, box, endPos, head, hh, hw, length, radius, socket, startPos, tail, th, tw, x, x1, x2, y, y1, y2;
    radius = visuals.config.socketRadius;
    head = edge.head;
    tail = edge.tail;
    Min = 10;
    hw = Math.max(Min, head.w);
    hh = Math.max(Min, head.h);
    tw = Math.max(Min, tail.w);
    th = Math.max(Min, tail.h);
    if (edge.vertical) {
        x1 = getX(head);
        y1 = getY(head) + hh;
        x2 = x1;
        y2 = getY(tail) - th;
        startPos = getVerticalStartPos(edge);
        endPos = getVerticalEndPos(edge);
        length = endPos - startPos;
        box = createBox(x1 - radius, startPos, radius * 2, length);
    } else {
        x1 = getX(head) + hw;
        y1 = getY(head);
        x2 = getX(tail) - tw;
        y2 = y1;
        startPos = edge.head.x + edge.head.w;
        endPos = edge.tail.x - edge.tail.w;
        length = endPos - startPos;
        box = createBox(startPos, y1 - radius, length, radius * 2);
    }
    x = (x1 + x2) / 2;
    y = (y1 + y2) / 2;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, x, y, op, type, radius);
    socket.edge = edge;
    socket.imageData = imageData;
    _selectValue_380 = edge.role;
    if (_selectValue_380 === 'floor') {
        socket.target = getFloorTarget(visuals, edge);
    } else {
        if (_selectValue_380 === 'parceiling') {
            socket.target = getParTarget(edge.head);
        } else {
            socket.target = edge.finalTarget.itemId;
        }
    }
    if (length > radius * 2) {
        socket.box = box;
        socket.startPos = startPos;
        socket.endPos = endPos;
    }
    return socket;
}
function drawCircle(ctx, cx, cy, radius, thickness, fill, border) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = border;
    ctx.stroke();
}
function drawCross(ctx, centerX, centerY, size, thickness, color) {
    var x1, x2, y1, y2;
    x1 = centerX - size;
    x2 = centerX + size;
    y1 = centerY - size;
    y2 = centerY + size;
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, centerY);
    ctx.lineTo(x2, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, y1);
    ctx.lineTo(centerX, y2);
    ctx.stroke();
    ctx.stroke();
}
function drawHorizontalSocket(ctx, leftX, rightX, cy, fill, border, config) {
    var cx;
    ctx.beginPath();
    ctx.arc(leftX + config.socketRadius, cy, config.socketRadius, Math.PI / 2, Math.PI * 3 / 2, false);
    ctx.lineTo(rightX - config.socketRadius, cy - config.socketRadius);
    ctx.arc(rightX - config.socketRadius, cy, config.socketRadius, Math.PI * 3 / 2, Math.PI / 2, false);
    ctx.lineTo(leftX + config.socketRadius, cy + config.socketRadius);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = border;
    ctx.stroke();
    cx = (leftX + rightX) / 2;
    drawCross(ctx, cx, cy, config.socketRadius / 2, 2, border);
}
function drawPointSocket(ctx, x, y, fill, border, config) {
    drawCircle(ctx, x, y, config.socketRadius, 2, fill, border);
    drawCross(ctx, x, y, config.socketRadius / 2, 2, border);
}
function drawSocket(visuals, socket, ctx, config) {
    var border, fill, primId, radius;
    radius = config.socketRadius;
    if (visuals.currentSocket === socket.id && visuals.onSocket) {
        fill = config.socketBorder;
        border = config.socketBody;
    } else {
        primId = 'socket-' + socket.id;
        if (visuals.highlight === primId) {
            fill = config.socketBody;
            border = config.theme.highlight;
        } else {
            fill = config.socketBody;
            border = config.socketBorder;
        }
    }
    if (socket.node) {
        drawPointSocket(ctx, socket.x, socket.y, fill, border, config);
    } else {
        if (socket.edge.vertical) {
            if (socket.startPos === undefined) {
                drawPointSocket(ctx, socket.x, socket.y, fill, border, config);
            } else {
                drawVerticalSocket(ctx, socket.x, socket.startPos, socket.endPos, fill, border, config);
            }
        } else {
            if (socket.startPos === undefined) {
                drawPointSocket(ctx, socket.x, socket.y, fill, border, config);
            } else {
                drawHorizontalSocket(ctx, socket.startPos, socket.endPos, socket.y, fill, border, config);
            }
        }
    }
}
function drawVerticalSocket(ctx, cx, topY, bottomY, fill, border, config) {
    var cy;
    ctx.beginPath();
    ctx.arc(cx, topY + config.socketRadius, config.socketRadius, Math.PI, Math.PI * 2, false);
    ctx.lineTo(cx + config.socketRadius, bottomY - config.socketRadius);
    ctx.arc(cx, bottomY - config.socketRadius, config.socketRadius, 0, Math.PI, false);
    ctx.lineTo(cx - config.socketRadius, topY + config.socketRadius);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = border;
    ctx.stroke();
    cy = (bottomY + topY) / 2;
    drawCross(ctx, cx, cy, config.socketRadius / 2, 2, border);
}
function findForInsertion(visuals) {
    var edge, edges, id, result, targetId;
    edges = visuals.edges;
    result = [];
    for (id in edges) {
        edge = edges[id];
        if (edge.finalTarget && edge.role) {
            targetId = edge.finalTarget.itemId;
            if (edge.role === 'down' || edge.role === 'right' && edge.tail.up) {
                result.push(edge);
            }
        }
    }
    return result;
}
function findSocket(visuals, x, y) {
    var _collection_383, socket;
    _collection_383 = visuals.sockets;
    for (socket of _collection_383) {
        if (hitBox(socket.box, x, y)) {
            return socket.id;
        }
    }
    return undefined;
}
function getFloorTarget(visuals, floorEdge) {
    var _collection_385, itemId, left, leftBranch, right, rightBranch;
    left = getUp(floorEdge.head);
    right = getUp(floorEdge.tail);
    leftBranch = left.branch.itemId;
    rightBranch = right.branch.itemId;
    _collection_385 = visuals.branches;
    for (itemId of _collection_385) {
        if (!(itemId === leftBranch || itemId === rightBranch)) {
            return itemId;
        }
    }
    return rightBranch;
}
function getParTarget(parbegin) {
    var down, left, right;
    right = goRight(parbegin);
    down = goDown(right);
    left = goLeft(down);
    return left.itemId;
}
function getVerticalEndPos(edge) {
    return edge.tail.y - edge.tail.h;
}
function getVerticalStartPos(edge) {
    return edge.head.y + edge.head.h;
}
function isFirstPar(node) {
    var prev;
    if (node.prev.length === 1) {
        prev = node.prev[0];
        if (prev.subtype === 'parbegin' && prev.next[1] === node) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}
function isLastPar(node) {
    if (node.two) {
        return false;
    } else {
        return true;
    }
}
function runCurrentSocket(widget) {
    var socket, visuals;
    visuals = widget.visuals;
    socket = visuals.sockets[visuals.currentSocket - 1];
    tracing.trace('runCurrentSocket', [
        socket.id,
        socket.op,
        socket.type,
        socket.target
    ]);
    runInsertAction(widget, socket);
}
function showAllBranchSockets(visuals, op) {
    var showInsert;
    if (isSilhouette(visuals)) {
        showInsert = function (visuals, node) {
            showBranchSockets(visuals, node, op);
        };
        forType(visuals, 'branch', showInsert);
    }
}
function showAllParSockets(visuals, op) {
    var showInsert;
    showInsert = function (visuals, node) {
        showParSockets(visuals, node, op);
    };
    forType(visuals, 'parbegin', showInsert);
}
function showBlockInsertSockets(visuals, op, type, imageData) {
    var createEdgeSocket, edges, sockets;
    edges = findForInsertion(visuals);
    createEdgeSocket = function (edge) {
        return createSocketFromEdge(visuals, edge, op, type, imageData);
    };
    sockets = edges.map(createEdgeSocket);
    sockets.forEach(copyEdgeLinks);
}
function showBranchSockets(visuals, node, op) {
    var lowest, radius, socket, socket2;
    lowest = goDown(node);
    if (lowest.type !== 'end') {
        radius = visuals.config.socketTouchRadius;
        socket = createSocket(visuals, node.x - node.w, node.y, op, 'branch', radius);
        socket.node = node;
        socket.left = true;
        socket2 = createSocket(visuals, node.x + node.w, node.y, op, 'branch', radius);
        socket2.node = node;
    }
}
function showCaseSockets(visuals, node, op) {
    showRightCaseSocket(visuals, node, op);
    if (node == firstCase(node.select)) {
        showFirstCaseSocket(visuals, node, op);
    }
}
function showDurationSockets(visuals, op) {
    var _collection_387, id, node;
    _collection_387 = visuals.nodes;
    for (id in _collection_387) {
        node = _collection_387[id];
        if (canHaveDuration(node)) {
            createDurationSocket(visuals, node, op);
        }
    }
}
function showFirstCaseSocket(visuals, node, op) {
    var radius, socket;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, node.x - node.w, node.y, op, 'first-case', radius);
    socket.node = node;
}
function showInsertParAfterLast(visuals, node, op) {
    var radius, socket;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, node.x + visuals.config.metre, node.y, op, 'par', radius);
    socket.node = node;
}
function showInsertParBeforeFirst(visuals, node, op) {
    var radius, socket;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, node.x - visuals.config.metre, node.y, op, 'firstpar', radius);
    socket.node = node;
    utils.addRange(node.up.links, socket.links);
}
function showInsertParSocket(visuals, node, op) {
    var socket;
    socket = createSocketFromEdge(visuals, node.right, 'insert', 'par');
}
function showParSockets(visuals, node, op) {
    if (node.subtype === 'parbegin') {
        if (isFirstPar(node)) {
            showInsertParBeforeFirst(visuals, node, op);
        }
        if (isLastPar(node)) {
            showInsertParAfterLast(visuals, node, op);
        } else {
            showInsertParSocket(visuals, node, op);
        }
    }
}
function showRightCaseSocket(visuals, node, op) {
    var radius, socket;
    radius = visuals.config.socketTouchRadius;
    socket = createSocket(visuals, node.x + node.w, node.y, op, 'case', radius);
    socket.node = node;
}
function createStyles(widget) {
    var config, scrollable;
    config = widget.config;
    html.clear(widget.styleTag);
    scrollable = '.drakon-scrollable-container' + widget.myStyleId;
    html.addClassToStyle(widget.styleTag, scrollable, 'display: inline-block', 'position:absolute', 'left:0px', 'top:0px', 'width:100%', 'height:100%', 'overflow: auto');
    html.addClassToStyle(widget.styleTag, '.drakon-scrollable', 'display: inline-block', 'position:absolute', 'left:0px', 'top:0px', 'pointer-events: none');
    html.addClassToStyle(widget.styleTag, scrollable + '::-webkit-scrollbar', 'width:10px', 'height:10px');
    html.addClassToStyle(widget.styleTag, scrollable + '::-webkit-scrollbar-track', 'display: none');
    html.addClassToStyle(widget.styleTag, scrollable + '::-webkit-scrollbar-thumb', 'background: ' + config.theme.scrollBar, 'border-radius:5px');
    html.addClassToStyle(widget.styleTag, scrollable + '::-webkit-scrollbar-thumb:hover', 'background: ' + config.theme.scrollBarHover);
    html.addClassToStyle(widget.styleTag, scrollable + '::-webkit-scrollbar-corner', 'display:none');
    html.addClassToStyle(widget.styleTag, '.drakon-icon-content ol', 'list-style-type: decimal', 'margin-left:15px');
    html.addClassToStyle(widget.styleTag, '.drakon-icon-content', 'white-space: normal');
    html.addClassToStyle(widget.styleTag, '.drakon-icon-content ul', 'list-style-type: disc', 'margin-left:17px');
    html.addClassToStyle(widget.styleTag, '.drakon-icon-content em', 'font-style: italic');
    html.addClassToStyle(widget.styleTag, '.drakon-icon-content strong', 'font-weight: bold');
}
function InnerCrawler(visuals, sub) {
    var _obj_;
    _obj_ = InnerCrawler_create(visuals, sub);
    return _obj_.run();
}
function OuterCrawler(visuals, sub) {
    var _obj_;
    _obj_ = OuterCrawler_create(visuals, sub);
    return _obj_.run();
}
function addArrowPad(sub, edge) {
    var targetId;
    if (edge.role === 'down') {
        targetId = edge.finalTarget.itemId;
        sub.outerArrPads[targetId] = edge;
    }
}
function addEdgeSubRecord(records, edge) {
    var record, targetId;
    targetId = edge.finalTarget.itemId;
    record = {
        type: 'edge',
        element: edge,
        targetId: targetId,
        id: edge.id
    };
    records[targetId] = record;
}
function addEdgeToSub(sub, edge) {
    var existing, targetId;
    targetId = edge.finalTarget.itemId;
    existing = sub.outer[targetId];
    if (!existing || existing.type == 'edge') {
        addEdgeSubRecord(sub.outer, edge);
    }
}
function addInnerEdgeToSub(sub, edge) {
    addEdgeSubRecord(sub.inner, edge);
}
function addLowerCorner(sub, node) {
    var existing, oldNode, targetId;
    targetId = node.finalTarget.itemId;
    existing = sub.outer[targetId];
    if (!existing || existing.type === 'edge') {
        addNodeSubRecord(sub.outer, node);
    } else {
        oldNode = existing.element;
        if (!oldNode.down) {
            addNodeSubRecord(sub.outer, node);
        }
    }
}
function addNodeSubRecord(records, node) {
    var record, targetId;
    targetId = node.finalTarget.itemId;
    record = {
        type: 'node',
        element: node,
        targetId: targetId,
        id: node.id
    };
    records[targetId] = record;
}
function addUpperCorner(sub, node) {
    addNodeSubRecord(sub.outer, node);
}
function crawl(crawler, startEdge) {
    var _collection_395, edge, node, step;
    step = {};
    edge = startEdge;
    while (true) {
        edge[crawler.side] = crawler.sub;
        crawler.onEdge(edge, step);
        edge = step.next;
        if (!edge) {
            break;
        }
    }
    _collection_395 = crawler.plan;
    for (node of _collection_395) {
        createQSubspace(crawler, node);
    }
}
function crawlParallel(visuals, firstPar) {
    var down, outer, par, parend, sub;
    par = firstPar;
    while (true) {
        sub = createSubspace(visuals);
        outer = createOuter(visuals, sub);
        crawl(outer, par.down);
        if (par.two) {
            par = par.next[1];
        } else {
            break;
        }
    }
    down = goDown(par);
    parend = goLeft(down);
    return parend;
}
function crawlSelect(visuals, select) {
    var cases, i, inner, jun, left, outer, right, sub;
    cases = select.cases;
    for (i = 0; i < cases.length - 1; i++) {
        left = cases[i];
        right = cases[i + 1];
        jun = getUp(left);
        if (!jun.zoned) {
            sub = createSubspace(visuals);
            outer = createOuter(visuals, sub);
            inner = createInner(visuals, sub);
            crawl(outer, left.down);
            crawl(inner, right.down);
        }
    }
    return cases[cases.length - 1];
}
function createInner(visuals, sub) {
    var crawler;
    crawler = InnerCrawler_create(visuals, sub);
    crawler.run();
    crawler.down();
    return crawler;
}
function createInnerRight(visuals, sub) {
    var crawler;
    crawler = InnerCrawler_create(visuals, sub);
    crawler.run();
    crawler.right();
    return crawler;
}
function createOuter(visuals, sub) {
    var crawler;
    crawler = OuterCrawler_create(visuals, sub);
    crawler.run();
    return crawler;
}
function createQSubspace(crawler, question) {
    var inner, outer, sub;
    if (!question.zoned) {
        sub = createSubspace(crawler.visuals);
        outer = createOuter(crawler.visuals, sub);
        inner = createInnerRight(crawler.visuals, sub);
        crawl(outer, question.down);
        crawl(inner, question.right);
    }
}
function createSubspace(visuals) {
    var sub;
    sub = {
        id: visuals.subs.length + 1,
        color: makeRandomColor(),
        outer: {},
        inner: {},
        outerArrPads: {}
    };
    visuals.subs.push(sub);
    return sub;
}
function drawHorizontalSubEdge(edge, shift, ctx, color) {
    var size;
    size = 10;
    ctx.fillStyle = color;
    ctx.fillRect(edge.head.x, edge.head.y + shift, edge.tail.x - edge.head.x, size);
}
function drawInnerSubItem(record, ctx, color) {
    var edge;
    if (record.type !== 'node') {
        edge = record.element;
        if (edge.vertical) {
            drawVerticalSubEdge(edge, -10, ctx, color);
        } else {
            drawHorizontalSubEdge(edge, -10, ctx, color);
        }
    }
}
function drawOuterSubItem(record, ctx, color) {
    var edge;
    if (record.type === 'node') {
        drawSubNode(record.element, ctx, color);
    } else {
        edge = record.element;
        if (edge.vertical) {
            drawVerticalSubEdge(edge, 0, ctx, color);
        } else {
            drawHorizontalSubEdge(edge, 0, ctx, color);
        }
    }
}
function drawSubNode(node, ctx, color) {
    var size;
    size = 20;
    ctx.fillStyle = color;
    ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size);
}
function drawSubspaces(visuals, ctx) {
    var _collection_397, _collection_399, _collection_402, itemId, record, sub;
    _collection_397 = visuals.subs;
    for (sub of _collection_397) {
        _collection_399 = sub.inner;
        for (itemId in _collection_399) {
            record = _collection_399[itemId];
            drawInnerSubItem(record, ctx, sub.color);
        }
        _collection_402 = sub.outer;
        for (itemId in _collection_402) {
            record = _collection_402[itemId];
            drawOuterSubItem(record, ctx, sub.color);
        }
    }
}
function drawVerticalSubEdge(edge, shift, ctx, color) {
    var size;
    size = 10;
    ctx.fillStyle = color;
    ctx.fillRect(edge.head.x + shift, edge.head.y, size, edge.tail.y - edge.head.y);
}
function getNextBranch(visuals, branchNode) {
    var branches, index;
    branches = visuals.branches;
    if (branchNode.branchId === branches.length) {
        index = 0;
    } else {
        index = branchNode.branchId;
    }
    return getNode(visuals, branches[index]);
}
function hasDuration(node) {
    return node.left.head.type === 'duration';
}
function hasLeft(node) {
    if (node.left && !hasDuration(node)) {
        return true;
    } else {
        return false;
    }
}
function markFloor(crawler, address) {
    var bottom, floor, next, sub;
    sub = crawler.sub;
    bottom = goDown(address);
    next = getNextBranch(crawler.visuals, address.branch);
    floor = bottom.right;
    if (floor) {
        floor.finalTarget = next;
        floor.outer = sub;
        floor.noBranch = address.itemId;
        addEdgeSubRecord(sub.outer, floor);
    } else {
        bottom.finalTarget = next;
        bottom.noBranch = address.itemId;
        addNodeSubRecord(sub.outer, bottom);
    }
}
function markInnerSide(crawler, lower) {
    var crawler2, leftCase, leftJun, n2, question, result, upper;
    upper = lower;
    while (true) {
        upper = getUp(upper);
        if (hasLeft(upper)) {
            break;
        }
    }
    n2 = getDown(upper);
    crawler2 = createInner(crawler.visuals, crawler.sub);
    if (n2.type === 'case') {
        crawl(crawler2, n2.down);
        leftJun = getLeft(upper);
        leftCase = getDown(leftJun);
        leftJun.zoned = true;
        result = leftCase.down;
        return result;
    } else {
        crawl(crawler2, upper.down);
        if (upper.up) {
            upper.left.inner = crawler.sub;
        }
        question = goLeft(upper);
        question.zoned = true;
        result = question.down;
        return result;
    }
}
function markParFloor(crawler, bottom) {
    var floor, sub;
    sub = crawler.sub;
    floor = bottom.right;
    floor.finalTarget = bottom.up.finalTarget;
    floor.inner = sub;
    addEdgeSubRecord(sub.inner, floor);
}
function planSpace(crawler, node) {
    crawler.plan.push(node);
}
function skipParBlock(node) {
    var _selectValue_405, counter;
    counter = 1;
    while (true) {
        node = getDown(node);
        _selectValue_405 = node.subtype;
        if (_selectValue_405 === 'parend') {
            counter--;
            if (counter === 0) {
                break;
            }
        } else {
            if (_selectValue_405 === 'parbegin') {
                counter++;
            }
        }
    }
    return node.down;
}
function buildStyleFromDiagram(widget) {
    var oldStyle, style;
    oldStyle = widget.model.doc.style;
    oldStyle = oldStyle || {};
    style = {};
    copyFieldsOrDefault(style, oldStyle, configToStyleFields(), '');
    copyFieldsOrDefault(style, widget.visuals.config, configToStyleFields(), '');
    copyFieldsOrDefault(style, oldStyle, themeToStyleFields(), '');
    return style;
}
function buildStyleFromPrims(visuals, prims) {
    var prim, style;
    style = { font: '' };
    for (prim of prims) {
        copyStyleFromPrim(prim, style);
        style.font = getThemeValueCore(visuals.config, prim.type, prim.style, 'font', style.font);
    }
    style.iconBack = style.iconBack || '';
    style.color = style.color || '';
    style.iconBorder = style.iconBorder || '';
    style.internalLine = style.internalLine || '';
    style.lineHeight = style.lineHeight || '';
    style.textAlign = style.textAlign || '';
    style.borderStyle = style.borderStyle || '';
    style.shadowOffsetX = style.shadowOffsetX || 0;
    style.shadowOffsetY = style.shadowOffsetY || 0;
    style.shadowColor = style.shadowColor || '';
    style.shadowBlur = style.shadowBlur || 0;
    if (!('borderWidth' in style)) {
        style.borderWidth = '';
    }
    return style;
}
function configToStyleFields() {
    return [
        'font',
        'headerFont',
        'branchFont',
        'canvasLabels',
        'metre',
        'padding',
        'maxWidth',
        'lineHeight',
        'textAlign',
        'verticalAlign',
        'centerContent'
    ];
}
function copyStyleFromPrim(prim, style) {
    var existing, key, pstyle, value;
    pstyle = prim.style;
    if (pstyle) {
        for (key in pstyle) {
            value = pstyle[key];
            existing = style[key];
            if (existing === undefined) {
                style[key] = value;
            } else {
                if (existing !== '') {
                    if (value !== existing) {
                        style[key] = '';
                    }
                }
            }
        }
    }
}
function getAcceptedStyleProps(widget, prims) {
    var accepted, common, count, name, prim;
    common = { count: 0 };
    for (prim of prims) {
        getAcceptedStylePropsForPrim(widget, prim, common);
    }
    accepted = {};
    for (name in common) {
        count = common[name];
        if (name !== 'count' && count === common.count) {
            accepted[name] = true;
        }
    }
    return accepted;
}
function getAcceptedStylePropsForPrim(widget, prim, common) {
    var accepted, prop;
    incrementDictionaryValue(common, 'count');
    if (prim.type === 'connection') {
        accepted = getConnectionProps();
    } else {
        if (isFree(widget, prim)) {
            accepted = getFreeAccepted(widget, prim);
        } else {
            if (canEditSecondary(prim)) {
                incrementDictionaryValue(common, 'internalLine');
            }
            accepted = getStandardDrakonProps();
        }
    }
    for (prop of accepted) {
        incrementDictionaryValue(common, prop);
    }
}
function getStandardDrakonProps() {
    return [
        'iconBack',
        'iconBorder',
        'borderWidth',
        'shadowColor',
        'shadowBlur',
        'shadowOffsetX',
        'shadowOffsetY',
        'padding',
        'color',
        'font',
        'textAlign'
    ];
}
function getStandardProps() {
    return [
        'iconBack',
        'iconBorder',
        'borderWidth',
        'shadowColor',
        'shadowBlur',
        'shadowOffsetX',
        'shadowOffsetY',
        'color',
        'font',
        'padding',
        'verticalAlign',
        'textAlign'
    ];
}
function mergeStyleIntoConfig(diagramStyle, config) {
    var result;
    config = utils.deepClone(config);
    diagramStyle = diagramStyle || {};
    result = {};
    Object.assign(result, config);
    copyFieldsWithValue(result, diagramStyle, configToStyleFields());
    result.theme = { icons: {} };
    Object.assign(result.theme, config.theme);
    copyFieldsWithValue(result.theme, diagramStyle, themeToStyleFields());
    if (diagramStyle.headerFont) {
        setIconProps(result.theme.icons, ['header'], { font: diagramStyle.headerFont });
    }
    if (diagramStyle.branchFont) {
        setIconProps(result.theme.icons, ['branch'], { font: diagramStyle.branchFont });
    }
    return result;
}
function themeToStyleFields() {
    return [
        'background',
        'color',
        'iconBack',
        'lines',
        'backText',
        'iconBorder',
        'internalLine',
        'shadowColor',
        'shadowBlur',
        'lineWidth',
        'borderWidth',
        'borderStyle',
        'shadowOffsetX',
        'shadowOffsetY'
    ];
}
function addItemToModel(model, item) {
    model.items[item.id] = item;
    if (item.type === 'branch') {
        model.branches.push(item.id);
    }
}
function addressDestinations(widget, address, menu) {
    var makeItem, notCurrent, selected;
    notCurrent = function (itemId) {
        return itemId != address.branch.itemId;
    };
    selected = widget.visuals.branches.filter(notCurrent);
    if (selected.length !== 0) {
        makeItem = function (itemId) {
            var target;
            target = getNode(widget.visuals, itemId);
            makePointToItem(widget, address, target, menu);
        };
        selected.forEach(makeItem);
    }
}
function arc(ctx, x, y, radius, begin, end, thickness, color) {
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    if (thickness % 2 !== 0) {
        x += 0.5;
        y += 0.5;
    }
    ctx.beginPath();
    ctx.arc(x, y, radius, begin, end);
    ctx.stroke();
}
function bakeSubtreeCoords(node, parentX, parentY) {
    var _collection_409, child, subtreeX, subtreeY;
    subtreeX = node.subtreeBox.left + parentX;
    subtreeY = node.subtreeBox.top + parentY;
    node.x += subtreeX;
    node.y += subtreeY;
    _collection_409 = node.children;
    for (child of _collection_409) {
        bakeSubtreeCoords(child, subtreeX, subtreeY);
    }
}
function buildBackgroundMenu(widget, x, y) {
    var _selectValue_411, clipboard, menu;
    menu = [];
    if (!isReadonly(widget)) {
        clipboard = getClipboardClone(widget);
        if (clipboard) {
            _selectValue_411 = clipboard.type;
            if (_selectValue_411 === 'case' || _selectValue_411 === 'branch' || _selectValue_411 === 'block') {
                pushMenuItem('paste', menu, tr(widget, 'Paste'), undefined, function () {
                    widget.showPasteSockets(clipboard.type);
                });
                menu.push({ type: 'separator' });
            } else {
                if (_selectValue_411 === 'mind') {
                    if (isMind(widget)) {
                        pushMenuItem('paste', menu, tr(widget, 'Paste'), undefined, function () {
                            widget.showPasteSockets(clipboard.type);
                        });
                        menu.push({ type: 'separator' });
                    }
                } else {
                    if (_selectValue_411 === 'free') {
                        pushMenuItem('paste', menu, tr(widget, 'Paste'), undefined, function (evt) {
                            pasteFree(widget, clipboard, evt);
                        });
                        menu.push({ type: 'separator' });
                    }
                }
            }
        }
        pushMenuItem('diagram_format', menu, tr(widget, 'Diagram format'), undefined, function () {
            startEditDiagramStyle(widget, x, y);
        });
    }
    return menu;
}
function buildBeginParMenu(widget, node) {
    var menu;
    menu = [];
    if (!isReadonly(widget)) {
        pushMenuItem('add_path_left', menu, tr(widget, 'Add path to the left'), widget.visuals.config.imagePath + 'par.png', function () {
            insertPath(widget, node, true);
        });
        pushMenuItem('add_path_right', menu, tr(widget, 'Add path to the right'), widget.visuals.config.imagePath + 'par.png', function () {
            insertPath(widget, node, false);
        });
        if (!isFirstPar(node)) {
            menu.push({ type: 'separator' });
            pushMenuItem('delete_path', menu, tr(widget, 'Delete path'), widget.visuals.config.imagePath + 'delete.png', function () {
                deleteParPath(widget, node);
            });
        }
    }
    return menu;
}
function buildBlockMenu(widget) {
    var menu;
    menu = [];
    pushMenuItem('copy_block', menu, tr(widget, 'Copy'), undefined, function () {
        copy(widget);
    });
    if (!isReadonly(widget)) {
        pushMenuItem('cut_block', menu, tr(widget, 'Cut'), undefined, function () {
            cut(widget);
        });
        menu.push({ type: 'separator' });
        pushMenuItem('delete_block', menu, tr(widget, 'Delete'), widget.visuals.config.imagePath + 'delete.png', function () {
            deleteSelection(widget);
        });
        menu.push({ type: 'separator' });
        pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
            startEditStyle(widget);
        });
    }
    return menu;
}
function buildCeilEdgeMenu(widget, edge) {
    var branchNode, clipboard, menu;
    menu = [];
    if (!isReadonly(widget)) {
        branchNode = edge.tail.down.tail;
        clipboard = getClipboardClone(widget);
        if (clipboard && clipboard.type === 'branch') {
            pushMenuItem('paste_branch', menu, tr(widget, 'Paste'), undefined, function () {
                pasteBranchBefore(widget, branchNode);
            });
            menu.push({ type: 'separator' });
        }
        pushMenuItem('insert_branch', menu, tr(widget, 'Insert Branch'), widget.visuals.config.imagePath + 'branch.png', function () {
            insertBranch(widget, branchNode, true);
        });
    }
    return menu;
}
function buildConfig(userConfig) {
    var config, face;
    userConfig = userConfig || {};
    face = 'Arial';
    config = {
        'font': '14px ' + face,
        'headerFont': 'bold 18px ' + face,
        'branchFont': 'bold 14px ' + face,
        'imagePath': '',
        'metre': 20,
        'lineRadius': 0,
        'iconRadius': 0,
        'freeSnap': 5,
        'triangleHeight': 20,
        'padding': 10,
        'maxWidth': 400,
        'lineHeight': 1.3,
        'maxHeight': 600,
        'minHeight': 40,
        'minWidth': 100,
        'touchRadius': 5,
        'socketTouchRadius': 15,
        'yes': 'Yes',
        'no': 'No',
        'end': 'End',
        'exit': 'Exit',
        'branch': 'Branch',
        'canSelect': true,
        'drawZones': false,
        'socketRadius': 10,
        'socketBody': 'yellow',
        'socketBorder': 'black',
        'canvasLabels': '14px ' + face,
        'insertionPadding': 10,
        'commentPadding': 10,
        'parallelWidth': 5,
        'canvasIcons': false,
        'textFormat': 'plain',
        'allowResize': true,
        'showLog': false,
        'buildIconCore': buildIconCore,
        'getClipboard': getClipboard,
        'setClipboard': setClipboard,
        'hasPopup': function () {
            return false;
        },
        'removePopups': function () {
        },
        'onZoomChanged': function () {
        }
    };
    copyNotNull(config, userConfig);
    config.theme = copyTheme(userConfig.theme, config);
    initAlignedNodes(config, userConfig);
    initIconRender(config, userConfig);
    initIconContent(config, userConfig);
    return config;
}
function buildContextMenuForPrim(widget, prim, evt) {
    var _selectValue_413, _selectValue_415, edge, menu, node, selected, underlying, visuals;
    visuals = widget.visuals;
    if (prim) {
        _selectValue_413 = prim.elType;
        if (_selectValue_413 === 'node') {
            node = getNode(visuals, prim.id);
            if (node.type == 'end') {
                menu = [];
                selectPrim(widget, prim.id);
                pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
                    startEditStyle(widget);
                });
            } else {
                if (node.type == 'junction') {
                    if (node.subtype === 'parbegin') {
                        if (ensureSelectedOne(widget, prim)) {
                            menu = buildBeginParMenu(widget, node);
                        } else {
                            menu = buildBlockMenu(widget);
                        }
                    } else {
                        menu = [];
                    }
                } else {
                    if (ensureSelectedOne(widget, prim)) {
                        if (isMind(widget)) {
                            menu = buildMenuByTypeMind(widget, prim, node);
                        } else {
                            menu = buildMenuByType(widget, prim, node);
                        }
                    } else {
                        menu = buildBlockMenu(widget);
                    }
                }
            }
        } else {
            if (_selectValue_413 === 'edge') {
                edge = getEdge(visuals, prim.id);
                _selectValue_415 = edge.role;
                if (_selectValue_415 === 'parceiling') {
                    selectPrim(widget, prim.id);
                    menu = buildParCeilMenu(widget, edge);
                } else {
                    if (_selectValue_415 === 'down') {
                        ensureSelectedOne(widget, prim);
                        menu = buildDownEdgeMenu(widget, edge);
                    } else {
                        if (_selectValue_415 === 'mind-child') {
                            selectPrim(widget, prim.id);
                            menu = buildMindEdgeMenu(widget, edge);
                        } else {
                            if (_selectValue_415 === 'ceil') {
                                selectPrim(widget, prim.id);
                                menu = buildCeilEdgeMenu(widget, edge);
                            } else {
                                if (_selectValue_415 === 'selectceil') {
                                    selectPrim(widget, prim.id);
                                    menu = buildSelectCeilEdgeMenu(widget, edge);
                                } else {
                                    ensureSelectedOne(widget, prim);
                                    menu = [];
                                }
                            }
                        }
                    }
                }
            } else {
                if (_selectValue_413 === 'free') {
                    if (isSelected(widget, prim.id)) {
                        selected = getSelectedFree(widget);
                        if (selected.length > 1) {
                            menu = buildBlockMenu(widget);
                        } else {
                            prim = freeToVisualItem(widget, selected[0]);
                            menu = buildFreeMenu(widget, prim);
                        }
                    } else {
                        selectPrim(widget, prim.id);
                        menu = buildFreeMenu(widget, prim);
                    }
                } else {
                    if (_selectValue_413 === 'nugget') {
                        selected = getSelectedFree(widget);
                        if (selected.length > 1) {
                            menu = buildBlockMenu(widget);
                        } else {
                            prim = freeToVisualItem(widget, selected[0]);
                            menu = buildFreeMenu(widget, prim);
                        }
                    } else {
                        if (_selectValue_413 === 'connection') {
                            if (!isSelected(widget, prim.id)) {
                                selectPrim(widget, prim.id);
                            }
                            menu = buildConnectionMenu(widget, prim);
                        } else {
                            if (_selectValue_413 === 'handle') {
                                if (prim.makeContextMenu) {
                                    menu = prim.makeContextMenu();
                                } else {
                                    underlying = getPrimById(widget, prim.id);
                                    menu = buildContextMenuForPrim(widget, underlying, evt);
                                }
                            } else {
                                menu = [];
                            }
                        }
                    }
                }
            }
        }
    } else {
        menu = buildBackgroundMenu(widget, evt.clientX, evt.clientY);
    }
    return menu;
}
function buildDiagramModel(widget, diagram) {
    var _collection_417, branch, end, idNum, item, itemId, model, nextId, type;
    diagram.initial = [];
    type = diagram.type || 'drakon';
    model = {
        items: {},
        doc: {},
        branches: [],
        edits: [],
        type: type
    };
    model.doc.access = diagram.access || 'write';
    model.doc.name = diagram.name || '';
    model.doc.keywords = utils.clone(diagram.keywords || {});
    model.doc.params = diagram.params || '';
    model.doc.description = diagram.description || '';
    if (diagram.style) {
        model.doc.style = JSON.parse(diagram.style);
    }
    nextId = 0;
    _collection_417 = diagram.items;
    for (itemId in _collection_417) {
        item = _collection_417[itemId];
        item.id = itemId;
        addItemToModel(model, item);
        idNum = parseInt(item.id);
        if (!isNaN(idNum)) {
            nextId = Math.max(nextId, idNum);
        }
    }
    model.nextId = nextId + 1;
    if (model.branches.length === 0) {
        if (type === 'drakon') {
            end = createNewItem(model, 'end');
            branch = createNewItem(model, 'branch');
            branch.branchId = 0;
            branch.one = end.id;
            diagram.initial.push(createInsert(end));
            diagram.initial.push(createInsert(branch));
        }
    } else {
        model.branches.sort(function (a, b) {
            return compareBranches(a, b, model.items);
        });
    }
    widget.model = model;
}
function buildDownEdgeMenu(widget, edge) {
    var clipboard, menu;
    menu = [];
    if (!isReadonly(widget)) {
        clipboard = getClipboardClone(widget);
        if (clipboard && clipboard.type === 'block') {
            pushMenuItem('paste_block', menu, tr(widget, 'Paste'), undefined, function () {
                pasteIntoEdge(widget, edge, clipboard.content);
            });
            menu.push({ type: 'separator' });
        }
        pushMenuItem('insert_action', menu, tr(widget, 'Action'), widget.visuals.config.imagePath + 'action.png', function () {
            insertIntoEdge(widget, edge, 'action');
        });
        pushMenuItem('insert_question', menu, tr(widget, 'Question'), widget.visuals.config.imagePath + 'question.png', function () {
            insertIntoEdge(widget, edge, 'question');
        });
        pushMenuItem('insert_choice', menu, tr(widget, 'Choice'), widget.visuals.config.imagePath + 'select.png', function () {
            insertIntoEdge(widget, edge, 'select');
        });
        pushMenuItem('insert_loop', menu, tr(widget, 'FOR Loop'), widget.visuals.config.imagePath + 'foreach.png', function () {
            insertIntoEdge(widget, edge, 'foreach');
        });
        pushMenuItem('insert_comment', menu, tr(widget, 'Comment'), widget.visuals.config.imagePath + 'comment.png', function () {
            insertIntoEdge(widget, edge, 'comment');
        });
        pushMenuItem('insert_insertion', menu, tr(widget, 'Insertion'), widget.visuals.config.imagePath + 'insertion.png', function () {
            insertIntoEdge(widget, edge, 'insertion');
        });
    }
    return menu;
}
function buildDrakonHeader(visuals, model) {
    var header, headerContent, headerItem, params, paramsContent, paramsItem;
    headerContent = model.doc.name;
    headerItem = model.items['header'];
    if (headerItem) {
        header = nodeFromItem(visuals, headerItem);
        header.content = headerContent;
    } else {
        header = createNode(visuals, undefined, 'header', headerContent, 'header');
    }
    flowIcon(visuals, visuals.header);
    paramsContent = model.doc.params;
    if (paramsContent) {
        paramsItem = model.items['params'];
        if (paramsItem) {
            params = nodeFromItem(visuals, paramsItem);
            params.content = paramsContent;
        } else {
            params = createNode(visuals, undefined, 'params', paramsContent, 'params');
        }
        flowIcon(visuals, params);
        visuals.params = params;
    }
}
function buildFinalConfig(widget) {
    var config, fontObj, model, wconfig;
    model = widget.model;
    wconfig = utils.clone(widget.config);
    if (!('centerContent' in wconfig)) {
        if (model.type === 'drakon') {
            wconfig.centerContent = true;
        } else {
            wconfig.centerContent = false;
        }
    }
    config = mergeStyleIntoConfig(model.doc.style, wconfig);
    fontObj = parseCssFont(config.canvasLabels, {}, true);
    config.canvasLabelsSize = fontObj.size;
    return config;
}
function buildFreeMenu(widget, prim) {
    var menu;
    menu = [];
    pushMenuItem('copy_free', menu, tr(widget, 'Copy'), undefined, function () {
        copy(widget);
    });
    if (isReadonly(widget)) {
        menu.push({ type: 'separator' });
        pushMenuItem('edit_content', menu, tr(widget, 'Edit content'), undefined, function () {
            startEditContent(widget, prim);
        });
    } else {
        pushMenuItem('cut_free', menu, tr(widget, 'Cut'), undefined, function () {
            cut(widget);
        });
        menu.push({ type: 'separator' });
        if (prim.type === 'group-duration') {
            pushMenuItem('flip', menu, tr(widget, 'Flip'), undefined, function () {
                flipGroup(widget, prim);
            });
        }
        if (canEditContent(widget, prim)) {
            pushMenuItem('edit_content', menu, tr(widget, 'Edit content'), undefined, function () {
                startEditContent(widget, prim);
            });
            if (prim.type === 'free-image' && !isReadonly(widget)) {
                pushMenuItem('change_image', menu, tr(widget, 'Change image'), undefined, function () {
                    startChangeImage(widget, prim);
                });
            }
            if (canEditLink(widget, prim)) {
                pushMenuItem('edit_link', menu, tr(widget, 'Edit link'), undefined, function () {
                    startEditLink(widget, prim);
                });
            }
            menu.push({ type: 'separator' });
        }
        if (isFree(widget, prim)) {
            pushMenuItem('edit_aux', menu, tr(widget, 'Edit aux info'), undefined, function () {
                startEditAux2(widget, prim);
            });
        }
        pushMenuItem('bring_to_front', menu, tr(widget, 'Bring to front'), undefined, function () {
            bringToFront(widget, prim.id);
        });
        pushMenuItem('send_to_back', menu, tr(widget, 'Send to back'), undefined, function () {
            sendToBack(widget, prim.id);
        });
        menu.push({ type: 'separator' });
        pushMenuItem('delete_free', menu, tr(widget, 'Delete'), widget.visuals.config.imagePath + 'delete.png', function () {
            deleteSelection(widget);
        });
        menu.push({ type: 'separator' });
        pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
            startEditStyle(widget);
        });
    }
    return menu;
}
function buildGrafHeader(visuals, model) {
    var header, headerContent, root;
    headerContent = model.doc.name;
    root = model.items['root'];
    if (root) {
        header = nodeFromItem(visuals, root);
        header.content = headerContent;
    } else {
        header = createNode(visuals, undefined, 'header', headerContent, 'root');
    }
    flowIcon(visuals, visuals.header);
}
function buildMenuByType(widget, prim, node) {
    var _selectValue_420, func, menu;
    menu = [];
    if (prim.type === 'params') {
        pushMenuItem('edit_content', menu, tr(widget, 'Edit content'), undefined, function () {
            startEditContent(widget, prim);
        });
        if (!isReadonly(widget)) {
            menu.push({ type: 'separator' });
            pushMenuItem('delete_one', menu, tr(widget, 'Delete'), widget.visuals.config.imagePath + 'delete.png', function () {
                deleteOne(widget, node);
            });
            menu.push({ type: 'separator' });
            pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
                startEditStyle(widget);
            });
        }
        return menu;
    } else {
        func = getCopyFunction(node);
        if (func) {
            pushMenuItem('copy_one', menu, tr(widget, 'Copy'), undefined, function () {
                copy(widget);
            });
            if (!isReadonly(widget) && canDelete(widget.visuals, node)) {
                pushMenuItem('cut_one', menu, tr(widget, 'Cut'), undefined, function () {
                    cut(widget);
                });
            }
            menu.push({ type: 'separator' });
        }
        if (prim.type === 'header') {
            pushMenuItem('rename', menu, tr(widget, 'Rename'), undefined, function () {
                startEditContent(widget, prim);
            });
            if (!(widget.visuals.params || isReadonly(widget))) {
                pushMenuItem('add_params', menu, tr(widget, 'Add parameters'), undefined, function () {
                    addParameters(widget, prim);
                });
            }
        } else {
            if (canEditNodeText(widget, prim)) {
                if (canEditSecondary(prim)) {
                    pushMenuItem('edit_secondary', menu, tr(widget, 'Edit upper text'), undefined, function () {
                        startEditSecondary(widget, prim);
                    });
                }
                pushMenuItem('edit_content', menu, tr(widget, 'Edit content'), undefined, function () {
                    startEditContent(widget, prim);
                });
                if (prim.type === 'drakon-image' && !isReadonly(widget)) {
                    pushMenuItem('change_image', menu, tr(widget, 'Change image'), undefined, function () {
                        startChangeImage(widget, prim);
                    });
                }
                menu.push({ type: 'separator' });
                pushMenuItem('edit_link', menu, tr(widget, 'Edit link'), undefined, function () {
                    startEditLink(widget, prim);
                });
            }
            if (isFree(widget, prim)) {
                pushMenuItem('edit_aux', menu, tr(widget, 'Edit aux info'), undefined, function () {
                    startEditAux2(widget, prim);
                });
            }
        }
        if (isReadonly(widget)) {
            return menu;
        } else {
            _selectValue_420 = prim.type;
            if (_selectValue_420 === 'question') {
                pushMenuItem('swap_yes_no', menu, tr(widget, 'Swap "Yes" and "No"'), undefined, function () {
                    widget.swapYesNo(prim.id);
                });
            } else {
                if (_selectValue_420 === 'address') {
                    pushMenuItem('go_to_target_branch', menu, tr(widget, 'Go to branch'), undefined, function () {
                        widget.showItem(node.branch.id);
                    });
                    menu.push({ type: 'separator' });
                    addressDestinations(widget, node, menu);
                } else {
                    if (_selectValue_420 === 'branch') {
                        if (getBranchMargin(node) !== 0) {
                            pushMenuItem('reset_margin', menu, tr(widget, 'Reset margin'), undefined, function () {
                                resetMargin(widget, node.id);
                            });
                        }
                        pushMenuItem('increase_margin', menu, tr(widget, 'Increase margin'), undefined, function () {
                            increaseMargin(widget, node.id);
                        });
                        pushMenuItem('insert_branch_left', menu, tr(widget, 'Insert Branch to the left'), widget.visuals.config.imagePath + 'branch.png', function () {
                            insertBranch(widget, node, true);
                        });
                        if (widget.visuals.end) {
                            if (!isLastBranch(widget, node)) {
                                pushMenuItem('insert_branch_right', menu, tr(widget, 'Insert Branch to the right'), widget.visuals.config.imagePath + 'branch.png', function () {
                                    insertBranch(widget, node, false);
                                });
                            }
                        } else {
                            if (isLastBranch(widget, node)) {
                                pushMenuItem('insert_end_branch', menu, tr(widget, 'Insert Branch with End'), widget.visuals.config.imagePath + 'end.png', function () {
                                    branchInsertEnd(widget);
                                });
                            }
                            pushMenuItem('insert_branch_right', menu, tr(widget, 'Insert Branch to the right'), widget.visuals.config.imagePath + 'branch.png', function () {
                                insertBranch(widget, node, false);
                            });
                        }
                    } else {
                        if (_selectValue_420 === 'case') {
                            pushMenuItem('insert_case_left', menu, tr(widget, 'Insert Case to the left'), widget.visuals.config.imagePath + 'case.png', function () {
                                insertCase(widget, node, true);
                            });
                            pushMenuItem('insert_case_right', menu, tr(widget, 'Insert Case to the right'), widget.visuals.config.imagePath + 'case.png', function () {
                                insertCase(widget, node, false);
                            });
                        }
                    }
                }
            }
            if (canDelete(widget.visuals, node)) {
                menu.push({ type: 'separator' });
                pushMenuItem('delete_one', menu, tr(widget, 'Delete'), widget.visuals.config.imagePath + 'delete.png', function () {
                    deleteOne(widget, node);
                });
            }
            if (canEditStyle(node)) {
                menu.push({ type: 'separator' });
                pushMenuItem('format', menu, tr(widget, 'Format'), undefined, function () {
                    startEditStyle(widget);
                });
            }
            return menu;
        }
    }
}
function buildParCeilMenu(widget, edge) {
    var menu;
    menu = [];
    if (!isReadonly(widget)) {
        if (!edge.head.left) {
            pushMenuItem('add_path_left', menu, tr(widget, 'Add path to the left'), widget.visuals.config.imagePath + 'par.png', function () {
                insertPath(widget, edge.head, true);
            });
        }
        pushMenuItem('add_path', menu, tr(widget, 'Add path'), widget.visuals.config.imagePath + 'par.png', function () {
            insertPath(widget, edge.head, false);
        });
        menu.push({ type: 'separator' });
        pushMenuItem('delete_path', menu, tr(widget, 'Delete path'), widget.visuals.config.imagePath + 'delete.png', function () {
            deleteParPath(widget, edge.tail);
        });
    }
    return menu;
}
function buildSelectCeilEdgeMenu(widget, edge) {
    var caseNode, clipboard, menu;
    menu = [];
    if (!isReadonly(widget)) {
        caseNode = edge.head.down.tail;
        clipboard = getClipboardClone(widget);
        if (clipboard && clipboard.type === 'case') {
            pushMenuItem('paste_case', menu, tr(widget, 'Paste'), undefined, function () {
                pasteCaseAfter(widget, caseNode);
            });
            menu.push({ type: 'separator' });
        }
        pushMenuItem('insert_case', menu, tr(widget, 'Insert Case'), widget.visuals.config.imagePath + 'case.png', function () {
            insertCase(widget, caseNode, false);
        });
    }
    return menu;
}
function buildSubspaces(visuals) {
    var _collection_422, branch, branchNode;
    if (visuals.branches.length === 1) {
        crawlSubdiagram(visuals, visuals.header.down);
    } else {
        _collection_422 = visuals.branches;
        for (branch of _collection_422) {
            branchNode = getNode(visuals, branch);
            crawlSubdiagram(visuals, branchNode.down);
        }
    }
}
function buildVisuals(widget) {
    var _branch_, _collection_424, _collection_426, _collection_429, _selectValue_432, _selectValue_434, bItemId, branch, config, context, ctx, element, id, item, model, node, skewer, visuals;
    _branch_ = 'Create visuals object';
    while (true) {
        switch (_branch_) {
        case 'Create visuals object':
            resetImageRefCounts(widget);
            model = widget.model;
            config = buildFinalConfig(widget);
            ctx = widget.canvas.getContext('2d');
            config.zoom = widget.zoomFactor;
            visuals = {
                ctx: ctx,
                nextId: 1,
                nodes: {},
                edges: {},
                skewers: {},
                levels: {},
                byType: {},
                skewerLinks: [],
                levelLinks: [],
                itemsToNodes: {},
                branches: model.branches.slice(),
                tempEdges: [],
                blocks: [],
                sockets: [],
                subs: [],
                free: [],
                handles: [],
                guides: [],
                fonts: {},
                images: widget.images,
                connections: {},
                connectionById: {},
                ears: undefined,
                type: model.type,
                config: config,
                container: widget.contentContainer
            };
            _branch_ = 'Header and params';
            break;
        case 'Header and params':
            _selectValue_434 = model.type;
            if (_selectValue_434 === 'drakon') {
                buildDrakonHeader(visuals, model);
            } else {
                if (_selectValue_434 === 'graf') {
                    buildGrafHeader(visuals, model);
                } else {
                    if (_selectValue_434 !== 'free') {
                        throw new Error('Unexpected case value: ' + _selectValue_434);
                    }
                }
            }
            _branch_ = 'Create nodes';
            break;
        case 'Create nodes':
            _collection_426 = model.items;
            for (id in _collection_426) {
                item = _collection_426[id];
                if (item.type === 'connection') {
                    addConnectionToVisuals(visuals, id, item);
                } else {
                    if (isFree(widget, item)) {
                        element = freeFromItem(visuals, id, item);
                        flowFreeIcon(widget, visuals, element);
                    } else {
                        if (!(item.type === 'header' || item.type === 'params' || item.type === 'image')) {
                            node = nodeFromItem(visuals, item);
                            flowIcon(visuals, node);
                        }
                    }
                }
            }
            sortFreeIcons(visuals);
            _selectValue_432 = model.type;
            if (_selectValue_432 === 'drakon') {
                _branch_ = 'Link nodes';
            } else {
                if (_selectValue_432 === 'graf') {
                    _branch_ = 'Graf';
                } else {
                    if (_selectValue_432 !== 'free') {
                        throw new Error('Unexpected case value: ' + _selectValue_432);
                    }
                    _branch_ = 'Free';
                }
            }
            break;
        case 'Link nodes':
            _collection_424 = visuals.branches;
            for (bItemId of _collection_424) {
                context = {
                    visuals: visuals,
                    addresses: []
                };
                linkNodeToChildren(context, bItemId);
                branch = getNode(visuals, bItemId);
                branch.addresses = context.addresses;
            }
            _branch_ = 'Visual graph';
            break;
        case 'Visual graph':
            if (model.branches.length !== 0) {
                if (model.branches.length > 1) {
                    layoutSilhouette(visuals);
                } else {
                    layoutPrimitive(visuals);
                }
            }
            _branch_ = 'Calculate coords';
            break;
        case 'Calculate coords':
            buildSkewers(visuals);
            _collection_429 = visuals.skewers;
            for (id in _collection_429) {
                skewer = _collection_429[id];
                setSameWidth(visuals, skewer);
            }
            reflowContent(visuals);
            setSameHeight(visuals);
            positionSkewers(visuals);
            positionLevels(visuals);
            drawParams(visuals);
            _branch_ = 'Post process drakon';
            break;
        case 'Post process drakon':
            removeTempEdges(visuals);
            positionDurations(visuals);
            connectLoops(visuals);
            traceLoops(visuals);
            forType(visuals, 'arrow-loop', markArrow);
            _branch_ = 'Exit';
            break;
        case 'Graf':
            buildMindTree(visuals);
            setSameWidthMind(visuals);
            reflowContent(visuals);
            setSameHeightMind(visuals);
            positionMind(visuals);
            _branch_ = 'Exit';
            break;
        case 'Free':
            _branch_ = 'Exit';
            break;
        case 'Exit':
            _branch_ = undefined;
            buildBoxes(widget, visuals);
            forType(visuals, 'address', putCycleMark);
            calculateDiagramBoxForEdit(widget, visuals);
            return visuals;
        default:
            return;
        }
    }
}
function buildVisualsForEdit(widget) {
    var visuals;
    resetContainer(widget);
    visuals = buildVisuals(widget);
    if (widget.model.type === 'drakon') {
        precacheEdgesLinks(visuals);
        buildSubspaces(visuals);
    }
    widget.visuals = visuals;
    createResetEars(widget);
    initScrollPos(widget);
    return Object.keys(visuals.fonts);
}
function calculateBoxFromFree(elementBox, box) {
    var bottom, left, right, top;
    left = elementBox.left;
    top = elementBox.top;
    if ('width' in elementBox) {
        right = left + elementBox.width;
        bottom = top + elementBox.height;
    } else {
        right = left;
        bottom = top;
    }
    nextBox(box, left, top, right, bottom);
}
function calculateBoxIter(node, box) {
    var bottom, left, right, top;
    left = node.x - node.w;
    top = node.y - node.h;
    right = node.x + node.w;
    bottom = node.y + node.h;
    if (!isNaN(left)) {
        box.left = Math.min(box.left, left);
    }
    if (!isNaN(top)) {
        box.top = Math.min(box.top, top);
    }
    if (!isNaN(right)) {
        box.right = Math.max(box.right, right);
    }
    if (!isNaN(bottom)) {
        box.bottom = Math.max(box.bottom, bottom);
    }
}
function calculateDiagramBox(visuals) {
    var _collection_436, _collection_439, _collection_441, _collection_444, bottom, box, conbox, connection, element, id, metre, node, padding, right;
    box = {
        left: Number.MAX_SAFE_INTEGER,
        right: Number.MIN_SAFE_INTEGER,
        top: Number.MAX_SAFE_INTEGER,
        bottom: Number.MIN_SAFE_INTEGER
    };
    metre = visuals.config.metre;
    _collection_436 = visuals.nodes;
    for (id in _collection_436) {
        node = _collection_436[id];
        calculateBoxIter(node, box);
    }
    _collection_439 = visuals.free;
    for (element of _collection_439) {
        calculateBoxFromFree(element.box, box);
    }
    _collection_441 = visuals.connectionById;
    for (id in _collection_441) {
        connection = _collection_441[id];
        buildConnectionBoxes(visuals, connection);
        _collection_444 = connection.boxes;
        for (conbox of _collection_444) {
            right = conbox.left + conbox.width;
            bottom = conbox.top + conbox.height;
            nextBox(box, conbox.left, conbox.top, right, bottom);
        }
    }
    if (box.left === Number.MAX_SAFE_INTEGER) {
        box.left = 0;
        box.right = 100;
        box.top = 0;
        box.bottom = 100;
    }
    padding = metre;
    box.left -= padding;
    box.top -= padding;
    box.right += padding;
    box.bottom += padding;
    box.width = box.right - box.left;
    box.height = box.bottom - box.top;
    return box;
}
function calculateDiagramBoxForEdit(widget, visuals) {
    visuals.smallBox = calculateDiagramBox(visuals);
    updateExpandedBox(widget, visuals);
}
function calculateScrollableHeight(widget) {
    var boxHeight, visuals, zoom;
    visuals = widget.visuals;
    zoom = widget.zoomFactor;
    boxHeight = visuals.box.height * zoom;
    return Math.max(boxHeight, widget.height);
}
function calculateScrollableWidth(widget) {
    var boxWidth, visuals, zoom;
    visuals = widget.visuals;
    zoom = widget.zoomFactor;
    boxWidth = visuals.box.width * zoom;
    return Math.max(boxWidth, widget.width);
}
function calculateSubtreeBox(config, node) {
    var _collection_446, child, subtreeBox, ttype;
    subtreeBox = createBox(0, 0, node.w * 2, node.h * 2);
    node.subtreeBox = subtreeBox;
    if (node.children.length === 0) {
        node.x = node.w;
        node.y = node.h;
    } else {
        _collection_446 = node.children;
        for (child of _collection_446) {
            calculateSubtreeBox(config, child);
        }
        ttype = getTType(node);
        if (ttype === 'vertical') {
            calculateVerticalSubtree(config, node);
        } else {
            if (ttype === 'horizontal') {
                calculateHorizontalSubtree(config, node);
            } else {
                if (ttype !== 'treeview') {
                    throw new Error('Unexpected case value: ' + ttype);
                }
                calculateTvSubtree(config, node);
            }
        }
    }
}
function canEditNodeText(widget, node) {
    var noText;
    if (isFree(widget, node)) {
        return canEditContent(widget, node);
    } else {
        noText = {
            junction: true,
            end: true,
            'arrow-loop': true,
            address: true
        };
        if (node.type in noText) {
            return false;
        } else {
            return true;
        }
    }
}
function canEditSecondary(node) {
    var can;
    can = {
        shelf: true,
        process: true,
        input: true,
        output: true
    };
    return node.type in can;
}
function canEditStyle(node) {
    var noStyle;
    noStyle = {
        junction: true,
        'arrow-loop': true,
        'address': true
    };
    if (node.type in noStyle) {
        return false;
    } else {
        return true;
    }
}
function compareBranches(leftId, rightId, items) {
    var left, right;
    left = items[leftId];
    right = items[rightId];
    return left.branchId - right.branchId;
}
function connectBranch(visuals, branch, upper, lower) {
    var _branch_, _collection_448, address, branchLower, ceil, floor;
    _branch_ = 'Top';
    while (true) {
        switch (_branch_) {
        case 'Top':
            branch.topNode = createJunction(visuals, undefined);
            ceil = createEdge(visuals, upper, branch.topNode, false);
            ceil.role = 'ceil';
            createEdge(visuals, branch.topNode, branch, true);
            if (branch.addresses.length === 0) {
                _branch_ = 'Technical edge';
            } else {
                _branch_ = 'Bottom';
            }
            break;
        case 'Technical edge':
            createEdge(visuals, lower, visuals.end, false);
            _branch_ = 'Bottom';
            break;
        case 'Bottom':
            _collection_448 = branch.addresses;
            for (address of _collection_448) {
                branchLower = createJunction(visuals, undefined);
                floor = createEdge(visuals, lower, branchLower, false);
                floor.role = 'floor';
                createEdge(visuals, address, branchLower, true);
                lower = branchLower;
            }
            _branch_ = 'Exit';
            break;
        case 'Exit':
            _branch_ = undefined;
            branch.bottomNode = lower;
            break;
        default:
            return;
        }
    }
}
function connectLoops(visuals) {
    forType(visuals, 'loopend', findLoopStart);
}
function copyScrollToScrollable(widget, scrollX, scrollY) {
    var oldLeft, oldTop, scroll, scrollLeft, scrollTop, visuals, zoom;
    visuals = widget.visuals;
    scroll = widget.scrollableContainer;
    zoom = widget.zoomFactor;
    scrollLeft = (scrollX - visuals.box.left) * zoom;
    scrollTop = (scrollY - visuals.box.top) * zoom;
    oldLeft = scroll.scrollLeft;
    oldTop = scroll.scrollTop;
    scroll.scrollLeft = scrollLeft;
    scroll.scrollTop = scrollTop;
    if (scroll.scrollLeft === oldLeft && scroll.scrollTop === oldTop) {
        return false;
    } else {
        return true;
    }
}
function copyTheme(userTheme, config) {
    var theme;
    userTheme = userTheme || {};
    theme = {
        'icons': {},
        'background': '#97D3E1',
        'color': 'black',
        'iconBack': 'white',
        'lines': 'black',
        'backText': 'black',
        'iconBorder': 'black',
        'candyFill': '#00ff00',
        'handleFill': '#d0ff00',
        'candyBorder': 'black',
        'valFill': 'yellow',
        'internalLine': 'black',
        'valBorder': 'black',
        'scrollBar': 'rgba(0, 0, 0, 0.3)',
        'scrollBarHover': 'black',
        'shadowColor': '',
        'shadowBlur': 6,
        'shadowOffsetX': 0,
        'shadowOffsetY': 0,
        'lineWidth': 1,
        'borderWidth': 1,
        'guides': 'darkred',
        'highlight': 'magenta',
        'commentBack': '#2293bb'
    };
    Object.assign(theme, userTheme);
    setIconDefaultProps(theme.icons, [
        'duration',
        'ctrlstart',
        'ctrlend',
        'pause',
        'timer',
        'group-duration',
        'callout'
    ], { iconBack: '#fffdbd' });
    setIconDefaultProps(theme.icons, ['header'], { font: config.headerFont });
    setIconDefaultProps(theme.icons, ['branch'], { font: config.branchFont });
    return theme;
}
function crawlSubdiagram(visuals, startEdge) {
    var innerCrawler, innerSub, outerCrawler, outerSub;
    outerSub = createSubspace(visuals);
    innerSub = createSubspace(visuals);
    outerCrawler = createOuter(visuals, outerSub);
    innerCrawler = createInner(visuals, innerSub);
    crawl(outerCrawler, startEdge);
    crawl(innerCrawler, startEdge);
}
function createEventBehavior(widget) {
    stopMachine(widget, 'mouseEvents');
    if (widget.config.canSelect) {
        widget.mouseEvents = SelectBehavior_create(widget);
    } else {
        widget.mouseEvents = NoSelectBehavior_create(widget);
    }
    widget.touchEvents = TouchBehavior_create(widget);
    widget.touchEvents.run();
    widget.mouseEvents.run();
}
function createLink(source, index) {
    return {
        source: source,
        index: index
    };
}
function createNewItem(model, type) {
    var id, item;
    id = getNextId(model);
    item = {
        id: id,
        type: type
    };
    addItemToModel(model, item);
    return item;
}
function createParamsNode(visuals, params) {
    var node;
    if (params) {
        node = createNode(visuals, undefined, 'params', params, 'params');
        flowIcon(visuals, node);
        return node;
    } else {
        return undefined;
    }
}
function debugLog(text) {
    var _collection_450, element, line;
    if (unit.debugLog) {
        unit.debugLog.push(text);
        if (unit.debugLog.length > 20) {
            unit.debugLog.shift();
        }
        html.clear(unit.logDiv);
        _collection_450 = unit.debugLog;
        for (line of _collection_450) {
            element = div({ text: line });
            html.add(unit.logDiv, element);
        }
    }
}
function drawBackPlane(widget, ctx) {
    var _collection_452, element, visited, visuals;
    visuals = widget.visuals;
    visited = {};
    _collection_452 = visuals.free;
    for (element of _collection_452) {
        if (element.zIndex >= 0) {
            break;
        } else {
            drawFreeIcon(widget, element, ctx, visited);
        }
    }
    ctx.setLineDash([]);
    clearShadow(ctx);
}
function drawFreeNuggetAndHandles(widget, ctx) {
    var _collection_454, _collection_457, common, element, id, showNugget, type, visuals, x, y;
    showNugget = false;
    visuals = widget.visuals;
    ctx.setLineDash([]);
    clearShadow(ctx);
    common = {
        left: Number.MAX_SAFE_INTEGER,
        top: Number.MAX_SAFE_INTEGER,
        right: Number.MIN_SAFE_INTEGER,
        bottom: Number.MIN_SAFE_INTEGER
    };
    _collection_454 = widget.selection.prims;
    for (id in _collection_454) {
        type = _collection_454[id];
        if (type === 'free') {
            element = getFree(visuals, id);
            if (element.type !== 'group-duration') {
                calculateBoxFromFree(element, common);
                showNugget = true;
            }
        }
    }
    if (showNugget) {
        x = Math.floor((common.right + common.left) / 2 + 20);
        y = Math.floor(common.top - 40);
        visuals.nugget = drawNugget(ctx, x, y);
    } else {
        visuals.nugget = undefined;
    }
    _collection_457 = widget.selection.prims;
    for (id in _collection_457) {
        type = _collection_457[id];
        if (type === 'free') {
            element = getFree(visuals, id);
            drawFreeCandies(widget, element, ctx);
        }
    }
    drawEars(visuals, ctx);
}
function drawFrontPlane(widget, ctx) {
    var _collection_460, element, visited, visuals;
    visuals = widget.visuals;
    visited = {};
    _collection_460 = visuals.free;
    for (element of _collection_460) {
        if (element.zIndex >= 0) {
            drawFreeIcon(widget, element, ctx, visited);
        }
    }
    ctx.setLineDash([]);
    clearShadow(ctx);
}
function drawHead(ctx, coords, head, color, iconBack, width) {
    var angle, first, second;
    if (head) {
        first = coords[coords.length - 2];
        second = coords[coords.length - 1];
        angle = findAngle(first.x, first.y, second.x, second.y);
        drawCap(ctx, head, second.x, second.y, angle, color, iconBack, width);
    }
}
function drawNugget(ctx, x, y) {
    var asize, bottom, left, midX, midY, padding, right, size, top;
    size = 30;
    ctx.fillStyle = '#90ff90';
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);
    padding = 4;
    asize = 5;
    left = x + padding;
    midY = y + size / 2;
    right = left + asize;
    top = midY - asize;
    bottom = midY + asize;
    fillTrigangle(ctx, left, midY, right, top, right, bottom, 'black');
    right = x + size - padding;
    left = right - asize;
    fillTrigangle(ctx, left, top, right, midY, left, bottom, 'black');
    midX = x + size / 2;
    left = midX - asize;
    right = midX + asize;
    top = y + padding;
    bottom = top + asize;
    fillTrigangle(ctx, left, bottom, midX, top, right, bottom, 'black');
    bottom = y + size - padding;
    top = bottom - asize;
    fillTrigangle(ctx, left, top, right, top, midX, bottom, 'black');
    return createBox(x, y, size, size);
}
function drawTail(ctx, coords, tail, color, iconBack, width) {
    var angle, first, second;
    if (tail) {
        first = coords[0];
        second = coords[1];
        angle = findAngle(first.x, first.y, second.x, second.y);
        drawCap(ctx, tail, first.x, first.y, angle + Math.PI, color, iconBack, width);
    }
}
function drawWatermark(widget, ctx, watermark, factor, zoom, width, height) {
    var box, left, margin, top, zm;
    zm = zoom * factor;
    ctx.save();
    ctx.resetTransform();
    ctx.scale(zm, zm);
    ctx.fillStyle = getWatermarkColor(widget, ctx);
    ctx.font = '16px Arial';
    box = ctx.measureText(watermark);
    margin = 18 / zoom;
    left = width / zoom - box.width - margin;
    top = 18;
    ctx.fillText(watermark, left, top);
    ctx.restore();
}
function end() {
    return 'End';
}
function ensureSelectedOne(widget, prim) {
    var nodes, primId;
    primId = prim.id;
    if (isSelected(widget, primId)) {
        nodes = getNodesFromSelection(widget);
        if (nodes.length > 1) {
            return false;
        } else {
            return true;
        }
    } else {
        selectPrim(widget, primId);
        showLianaSockets(widget, prim);
        return true;
    }
}
function extendVisualsBox(visuals, origin) {
    var box;
    box = visuals.box;
    if (origin.x < box.left) {
        box.left = origin.x;
        box.width = box.right - box.left;
    }
    if (origin.y < box.top) {
        box.top = origin.y;
        box.height = box.bottom - box.top;
    }
}
function fillTrigangle(ctx, x1, y1, x2, y2, x3, y3, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
}
function findEdgeLinks(visuals, startEdge, edge) {
    var _collection_462, itemId, link, prevEdge, source;
    source = edge.source;
    if (source) {
        if (source.type !== 'junction' || source.subtype === 'parbegin' || source.subtype === 'parend') {
            itemId = getEffectiveItemId(visuals, source);
            link = createLink(itemId, edge.vertical ? 0 : 1);
            startEdge.links.push(link);
        } else {
            _collection_462 = source.sources;
            for (prevEdge of _collection_462) {
                findEdgeLinks(visuals, startEdge, prevEdge);
            }
        }
    }
}
function findFreePos(widget, evt) {
    var config, leftPos, mousePos, visuals, x, y;
    visuals = widget.visuals;
    config = visuals.config;
    mousePos = toDiagram(widget, evt);
    leftPos = widgetToDiagram(widget, config.metre, 0);
    x = snapUp(config, leftPos.x);
    y = snapUp(config, mousePos.y);
    return {
        x: x,
        y: y
    };
}
function findLoopStart(visuals, end) {
    var depth, node;
    depth = 0;
    for (node = getUp(end); node; node = getUp(node)) {
        if (node.type === 'loopend') {
            depth++;
        } else {
            if (node.type === 'loopbegin') {
                if (depth === 0) {
                    node.loopEnd = end;
                    end.loopStart = node;
                    break;
                } else {
                    depth--;
                }
            }
        }
    }
}
function firstBranchNode(visuals) {
    var id;
    id = visuals.branches[0];
    return visuals.nodes[id];
}
function forType(visuals, type, action) {
    var node, nodeId, nodes;
    nodes = getCreateList(visuals.byType, type);
    for (nodeId of nodes) {
        node = visuals.nodes[nodeId];
        action(visuals, node);
    }
}
function forTypeTogether(visuals, type, action) {
    var ids, nodes;
    ids = getCreateList(visuals.byType, type);
    nodes = ids.map(function (id) {
        return getNode(visuals, id);
    });
    action(visuals, nodes);
}
function getBranchMargin(node) {
    var margin;
    margin = node.margin;
    if (margin || margin === 0) {
        return margin;
    } else {
        if (node.branchId === 1) {
            return 0;
        } else {
            return 1;
        }
    }
}
function getClipboardClone(widget) {
    var clipboard;
    clipboard = widget.visuals.config.getClipboard();
    return utils.deepClone(clipboard);
}
function getDefaultScrollLeft(widget) {
    var box, left, visuals, wwidth, zoom;
    visuals = widget.visuals;
    box = visuals.smallBox;
    zoom = widget.zoomFactor;
    if (widget.model.type === 'graf' || widget.model.type === 'free') {
        wwidth = widget.width / zoom;
        if (wwidth > box.width) {
            left = box.left - Math.floor((wwidth - box.width) / 2);
        } else {
            left = box.left;
        }
    } else {
        left = box.left;
    }
    return left;
}
function getDefaultScrollTop(widget) {
    var box, top, visuals, wheight, zoom;
    visuals = widget.visuals;
    box = visuals.smallBox;
    zoom = widget.zoomFactor;
    if (widget.model.type === 'free') {
        wheight = widget.height / zoom;
        if (wheight > box.height) {
            top = box.top - Math.floor((wheight - box.height) / 3);
        } else {
            top = box.top;
        }
    } else {
        top = box.top;
    }
    return top;
}
function getDiagramType(widget) {
    if (widget.model) {
        return widget.model.type;
    } else {
        return undefined;
    }
}
function getEffectiveItemId(visuals, node) {
    if (node.itemId && node.itemId !== 'header') {
        return node.itemId;
    } else {
        return firstBranchNode(visuals).itemId;
    }
}
function getFreeFromSelection(widget) {
    var _collection_464, elType, id, visuals;
    visuals = widget.visuals;
    _collection_464 = widget.selection.prims;
    for (id in _collection_464) {
        elType = _collection_464[id];
        if (elType === 'free') {
            return getFree(visuals, id);
        }
    }
    return undefined;
}
function getNextId(obj) {
    var id;
    id = obj.nextId.toString();
    obj.nextId++;
    return id;
}
function getNodeForItem(visuals, itemId) {
    var nodeId;
    nodeId = visuals.itemsToNodes[itemId];
    return visuals.nodes[nodeId];
}
function getSelectedPrims(widget) {
    var _collection_467, connection, elType, element, id, node, prim, prims, visuals;
    visuals = widget.visuals;
    prims = [];
    _collection_467 = widget.selection.prims;
    for (id in _collection_467) {
        elType = _collection_467[id];
        if (elType === 'node') {
            node = getNode(visuals, id);
            prim = nodeToVisualItem(widget, node);
            prims.push(prim);
        } else {
            if (elType === 'free') {
                element = getFree(visuals, id);
                prim = freeToVisualItem(widget, element);
                prims.push(prim);
            } else {
                if (elType === 'connection') {
                    connection = getConnection(visuals, id);
                    prim = connectionToVisualItem(widget, connection);
                    prims.push(prim);
                }
            }
        }
    }
    return prims;
}
function getTType(node) {
    if (node.treeType) {
        return node.treeType;
    } else {
        if (node.type === 'header') {
            return 'vertical';
        } else {
            return 'treeview';
        }
    }
}
function getWatermarkColor(widget, ctx) {
    var config;
    config = widget.visuals.config;
    if (isDarkColor(ctx, config.theme.background)) {
        return 'rgba(255, 255, 255, 0.5)';
    } else {
        return 'rgba(0, 0, 0, 0.5)';
    }
}
function getWidgetRect(widget) {
    var element, rect;
    element = widget.container;
    rect = element.getBoundingClientRect();
    return rect;
}
function handleRightClick(widget, pos, evt) {
    var callback, menu, prim;
    prim = findVisualItem(widget, pos);
    tracing.trace('handleRightClick', [
        pos,
        prim
    ]);
    if (!prim) {
        deselectAll(widget);
    }
    menu = buildContextMenuForPrim(widget, prim, evt);
    paint(widget);
    if (menu.length !== 0) {
        callback = widget.config.showContextMenu;
        if (callback) {
            callback(evt.clientX, evt.clientY, menu, prim);
        } else {
            console.error('showContextMenu is missing in config');
        }
    }
}
function hitNugget(visuals, pos) {
    if (visuals.nugget) {
        return hitBox(visuals.nugget, pos.x, pos.y);
    } else {
        return false;
    }
}
function initScrollPos(widget) {
    var height, left, savedOrigin, scroll, top, visuals, width, zoom;
    visuals = widget.visuals;
    zoom = widget.zoomFactor;
    savedOrigin = widget.origins[widget.diagramId];
    if (savedOrigin) {
        left = savedOrigin.x;
        top = savedOrigin.y;
    } else {
        left = getDefaultScrollLeft(widget);
        top = getDefaultScrollTop(widget);
    }
    scroll = setScroll(widget, left, top);
    width = calculateScrollableWidth(widget);
    height = calculateScrollableHeight(widget);
}
function isArrowLoop(node) {
    return node.type === 'arrow-loop';
}
function isDarkColor(ctx, color) {
    var average, blue, green, hexColor, old, red;
    old = ctx.fillStyle;
    ctx.fillStyle = color;
    hexColor = ctx.fillStyle;
    ctx.fillStyle = old;
    red = parseHex(hexColor, 1);
    green = parseHex(hexColor, 3);
    blue = parseHex(hexColor, 5);
    average = (red + green + blue) / 3;
    return average < 127;
}
function isDrakon(widget) {
    if (widget.model.type === 'drakon') {
        return true;
    } else {
        return false;
    }
}
function isLastBranch(widget, node) {
    var branches, last;
    branches = widget.visuals.branches;
    last = branches.length - 1;
    if (node.itemId === branches[last]) {
        return true;
    } else {
        return false;
    }
}
function isOnScrollbars(widget, evt) {
    var _branch_, diagramHeight, diagramWidth, rect, scrollBarWidth, x, y;
    _branch_ = 'Right scrollbar';
    while (true) {
        switch (_branch_) {
        case 'Right scrollbar':
            scrollBarWidth = 20;
            rect = evt.target.getBoundingClientRect();
            diagramWidth = widget.visuals.box.width;
            diagramHeight = widget.visuals.box.height;
            if (rect.height < diagramHeight) {
                x = evt.clientX - rect.left;
                if (rect.width - x <= scrollBarWidth) {
                    return true;
                } else {
                    _branch_ = 'Bottom scrollbar';
                }
            } else {
                _branch_ = 'Bottom scrollbar';
            }
            break;
        case 'Bottom scrollbar':
            if (rect.width < diagramWidth) {
                y = evt.clientY - rect.top;
                if (rect.height - y <= scrollBarWidth) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
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
function layoutPrimitive(visuals) {
    var branch, header;
    branch = firstBranchNode(visuals);
    header = visuals.header;
    header.next = branch.next;
    buildManhattan(visuals, header);
}
function layoutSilhouette(visuals) {
    var _collection_470, branch, branchId, first, firstId, leftDown, leftUp, lower, upper;
    leftUp = createJunction(visuals, undefined);
    leftDown = createJunction(visuals, undefined);
    createEdge(visuals, leftUp, leftDown, true);
    upper = leftUp;
    lower = leftDown;
    _collection_470 = visuals.branches;
    for (branchId of _collection_470) {
        branch = visuals.nodes[branchId];
        buildManhattan(visuals, branch);
        connectBranch(visuals, branch, upper, lower);
        upper = branch.topNode;
        lower = branch.bottomNode;
    }
    leftUp.right.role = 'rarrow';
    firstId = visuals.branches[0];
    first = visuals.nodes[firstId];
    createEdge(visuals, visuals.header, first.topNode, true);
    delete leftDown.right.role;
}
function line(ctx, x1, y1, x2, y2, color, width) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    if (width % 2 !== 0) {
        x1 += 0.5;
        x2 += 0.5;
        y1 += 0.5;
        y2 += 0.5;
    }
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}
function makePointToItem(widget, address, target, menu) {
    menu.push({
        hint: 'redirect',
        text: target.content,
        action: function () {
            redirectAddress(widget, address, target.itemId);
        }
    });
}
function makeRandomColor() {
    var b, g, r, rb, rg, rs;
    r = utils.random(200, 256);
    g = utils.random(200, 256);
    b = utils.random(200, 256);
    rs = utils.hexByteToString(r);
    rg = utils.hexByteToString(g);
    rb = utils.hexByteToString(b);
    return '#' + rs + rg + rb;
}
function markArrow(visuals, loop) {
    var arrow, bottom, downEdge, leftBottom, rightEdge, start, top, upEdge;
    arrow = loop.right;
    top = arrow.tail;
    upEdge = top.down;
    top.arrow = upEdge;
    arrow.arrow = upEdge;
    arrow.finalTarget = upEdge.finalTarget;
    arrow.links = upEdge.links;
    upEdge.arrow = upEdge;
    bottom = upEdge.tail;
    if (isLeftUp(bottom)) {
        bottom.arrow = upEdge;
        rightEdge = bottom.left;
        leftBottom = rightEdge.head;
        rightEdge.arrow = upEdge;
        if (isRightUp(leftBottom)) {
            leftBottom.arrow = upEdge;
            downEdge = leftBottom.up;
            start = downEdge.head;
            downEdge.arrow = upEdge;
            if (start.type !== 'junction') {
                start.arrow = upEdge;
            }
        } else {
        }
    } else {
    }
}
function multiline(config, ctx, coords, color, width, tail, head, iconBack) {
    var point, radius;
    if (coords.length === 2) {
        multilineSharp(ctx, coords, color, width);
    } else {
        radius = config.lineRadius || 0;
        if (radius) {
            if (width % 2 !== 0) {
                for (point of coords) {
                    point.x += 0.5;
                    point.y += 0.5;
                }
            }
            multilineRounded(ctx, coords, color, width, radius);
        } else {
            multilineSharp(ctx, coords, color, width);
        }
    }
    drawTail(ctx, coords, tail, color, iconBack, width);
    drawHead(ctx, coords, head, color, iconBack, width);
}
function multilineRounded(ctx, coords, color, width, radius) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    roundedLine(ctx, coords, radius);
    ctx.stroke();
}
function multilineSharp(ctx, coords, color, width) {
    var first, i, point, x, y;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    first = coords[0];
    if (width % 2 === 0) {
        x = first.x;
        y = first.y;
    } else {
        x = first.x + 0.5;
        y = first.y + 0.5;
    }
    ctx.moveTo(x, y);
    for (i = 1; i < coords.length; i++) {
        point = coords[i];
        if (width % 2 === 0) {
            x = point.x;
            y = point.y;
        } else {
            x = point.x + 0.5;
            y = point.y + 0.5;
        }
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}
function nextBox(box, left, top, right, bottom) {
    if (!isNaN(left)) {
        box.left = Math.min(box.left, left);
    }
    if (!isNaN(top)) {
        box.top = Math.min(box.top, top);
    }
    if (!isNaN(right)) {
        box.right = Math.max(box.right, right);
    }
    if (!isNaN(bottom)) {
        box.bottom = Math.max(box.bottom, bottom);
    }
}
function no() {
    return 'No';
}
function nodeFromItem(visuals, item) {
    var _selectValue_472, content, node;
    if (item.type === 'end') {
        content = visuals.config.end;
    } else {
        content = item.content || '';
    }
    node = createNode(visuals, item.id, item.type, content, item.id);
    _selectValue_472 = item.type;
    if (_selectValue_472 === 'parbegin') {
        node.type = 'junction';
        node.subtype = item.type;
    } else {
        if (_selectValue_472 === 'parend') {
            node.finalTarget = item.id;
            node.mountRight = node;
            node.type = 'junction';
            node.subtype = item.type;
        }
    }
    setNotNull(item, node, 'w');
    setNotNull(item, node, 'flag1');
    setNotNull(item, node, 'branchId');
    setNotNull(item, node, 'one');
    setNotNull(item, node, 'two');
    setNotNull(item, node, 'side');
    setNotNull(item, node, 'link');
    setNotNull(item, node, 'margin');
    setNotNull(item, node, 'secondary');
    setNotNull(item, node, 'parent');
    setNotNull(item, node, 'ordinal');
    setNotNull(item, node, 'treeType');
    setNotNull(item, node, 'collapsed');
    setNotNull(item, node, 'image');
    parseStyle(item, node);
    incrementImageRefCount(visuals, node.image);
    return node;
}
function onSelectionChanged(widget, prims) {
    if (widget.visuals) {
        if (widget.config.onSelectionChanged) {
            widget.config.onSelectionChanged(prims);
        }
        createResetEars(widget);
        createMindSockets(widget);
    }
}
function paint(widget) {
    var config, ctx, factor, height, scale, translate, tx, ty, visuals, width, zoom;
    zoom = widget.zoomFactor;
    factor = html.getRetinaFactor();
    visuals = widget.visuals;
    config = visuals.config;
    tx = visuals.scrollX;
    ty = visuals.scrollY;
    translate = 'translate(' + -tx + 'px, ' + -ty + 'px)';
    scale = 'scale(' + zoom + ', ' + zoom + ')';
    if (!config.canvasIcons) {
        widget.contentContainer.style.transformOrigin = 'top left';
        widget.contentContainer.style.transform = scale + ' ' + translate;
    }
    width = widget.width;
    height = widget.height;
    ctx = widget.canvas.getContext('2d');
    visuals.ctx = ctx;
    paintCore(widget, factor, zoom, -visuals.scrollX, -visuals.scrollY, width, height);
    if (config.watermark && config.editorWatermark) {
        drawWatermark(widget, ctx, config.watermark, factor, zoom, width, height);
    }
    drawScrollbars(widget);
}
function paintCore(widget, factor, zoom, translateX, translateY, width, height) {
    var _collection_474, _collection_477, _collection_480, _collection_483, _collection_486, _collection_488, config, ctx, edge, guide, id, node, padding, socket, type, visuals;
    visuals = widget.visuals;
    config = visuals.config;
    ctx = visuals.ctx;
    if (ctx.resetTransform) {
        ctx.resetTransform();
    }
    ctx.fillStyle = config.theme.background;
    ctx.fillRect(0, 0, width * factor, height * factor);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 4;
    if (widget.visuals.config.drawCross) {
        padding = 20;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(width * zoom - padding, height * zoom - padding);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width * zoom - padding, padding);
        ctx.lineTo(padding, height * zoom - padding);
        ctx.stroke();
    }
    ctx.scale(factor * zoom, factor * zoom);
    ctx.translate(translateX, translateY);
    if (widget.visuals.config.drawZones) {
        drawSubspaces(widget.visuals, ctx);
    }
    drawBackPlane(widget, ctx);
    ctx.setLineDash([]);
    _collection_474 = visuals.edges;
    for (id in _collection_474) {
        edge = _collection_474[id];
        drawEdge(widget, edge, ctx);
    }
    _collection_480 = widget.selection.prims;
    for (id in _collection_480) {
        type = _collection_480[id];
        if (type === 'edge') {
            drawEdgeCandy(visuals, id, ctx, config);
        }
    }
    _collection_477 = visuals.nodes;
    for (id in _collection_477) {
        node = _collection_477[id];
        if (isDrawableNode(node)) {
            drawIcon(visuals, node, ctx);
        }
    }
    ctx.setLineDash([]);
    _collection_483 = widget.selection.prims;
    for (id in _collection_483) {
        type = _collection_483[id];
        if (type === 'node') {
            drawNodeCandy(widget, id, ctx, config);
        }
    }
    drawFrontPlane(widget, ctx);
    drawFreeNuggetAndHandles(widget, ctx);
    _collection_486 = visuals.sockets;
    for (socket of _collection_486) {
        drawSocket(visuals, socket, ctx, config);
    }
    if (visuals.selectionFrame) {
        ctx.strokeStyle = visuals.config.theme.lines;
        ctx.lineWidth = 2;
        ctx.strokeRect(visuals.selectionFrame.left, visuals.selectionFrame.top, visuals.selectionFrame.width, visuals.selectionFrame.height);
    }
    if (visuals.guides.length > 0) {
        _collection_488 = visuals.guides;
        for (guide of _collection_488) {
            line(ctx, guide.x1, guide.y1, guide.x2, guide.y2, visuals.config.theme.guides, 1);
        }
        visuals.guides = [];
    }
}
function paintLater(widget) {
    requestAnimationFrame(function () {
        paint(widget);
    });
}
function parseCoords(item, node) {
    if (item.coords) {
        try {
            node.coords = JSON.parse(item.coords);
        } catch (ex) {
            console.error('Error parsing coords for item ' + item.id + ' ' + ex.message);
        }
    }
}
function parseHex(text, start) {
    var part;
    part = text.substring(start, start + 2);
    return parseInt(part, 16);
}
function parseStyle(item, node) {
    if (item.style) {
        try {
            node.style = JSON.parse(item.style);
        } catch (ex) {
            console.error('Error parsing style for item ' + item.id + ' ' + ex.message);
        }
    }
}
function positionDurations(visuals) {
    var _collection_490, dur, edge, id, metre, node, x;
    metre = visuals.config.metre;
    _collection_490 = visuals.nodes;
    for (id in _collection_490) {
        node = _collection_490[id];
        dur = node.duration;
        if (dur) {
            edge = createEdge(visuals, dur, node, false);
            edge.role = 'duration';
            x = node.skewer.coord - node.w - dur.w - metre;
            dur.skewer = createSkewer(visuals);
            dur.skewer.coord = x;
            dur.level = node.level;
        }
    }
}
function precacheEdgesLinks(visuals) {
    var _collection_493, edge, id;
    _collection_493 = visuals.edges;
    for (id in _collection_493) {
        edge = _collection_493[id];
        findEdgeLinks(visuals, edge, edge);
    }
}
function primToClient(widget, prim) {
    var pos, zoom;
    prim.diagramLeft = prim.left;
    prim.diagramTop = prim.top;
    prim.diagramWidth = prim.width;
    prim.diagramHeight = prim.height;
    pos = toClient(widget, prim.left, prim.top);
    prim.left = pos.x;
    prim.top = pos.y;
    zoom = widget.zoomFactor;
    prim.width *= zoom;
    prim.height *= zoom;
}
function pushMenuItem(hint, menu, text, icon, action) {
    var item;
    item = {
        hint: hint,
        type: 'item',
        text: text,
        icon: icon,
        action: action
    };
    menu.push(item);
}
function putCycleMark(visuals, address) {
    if (address.x >= address.branch.x) {
        address.mark = true;
        address.branch.mark = true;
    }
}
function putLoopsOnCases(visuals, select) {
    var _collection_496, caseIcon;
    _collection_496 = select.cases;
    for (caseIcon of _collection_496) {
        Object.assign(caseIcon.loops, select.loops);
    }
}
function reflowContent(visuals) {
    var _collection_498, id, node;
    _collection_498 = visuals.nodes;
    for (id in _collection_498) {
        node = _collection_498[id];
        reflowIcon(visuals, node);
    }
}
function resetContainer(widget) {
    if (!widget.config.canvasIcons) {
        html.clear(widget.contentContainer);
        widget.contentContainer.style.transform = '';
    }
}
function sanitizeScroll(widget, scrollX, scrollY) {
    var box, maxScrollX, maxScrollY, minScrollX, minScrollY, visuals, wheight, wwidth, zoom;
    visuals = widget.visuals;
    box = visuals.box;
    zoom = widget.zoomFactor;
    wwidth = widget.width / zoom;
    if (wwidth >= box.width) {
        minScrollX = -wwidth + box.right;
        maxScrollX = box.left;
    } else {
        minScrollX = box.left;
        maxScrollX = box.right - wwidth;
    }
    if (scrollX < minScrollX) {
        scrollX = minScrollX;
    }
    if (scrollX > maxScrollX) {
        scrollX = maxScrollX;
    }
    wheight = widget.height / zoom;
    if (wheight >= box.height) {
        minScrollY = -wheight + box.bottom;
        maxScrollY = box.top;
    } else {
        minScrollY = box.top;
        maxScrollY = box.bottom - wheight;
    }
    if (scrollY < minScrollY) {
        scrollY = minScrollY;
    }
    if (scrollY > maxScrollY) {
        scrollY = maxScrollY;
    }
    return {
        x: Math.round(scrollX),
        y: Math.round(scrollY)
    };
}
function setIconDefaultProps(icons, names, props) {
    var icon, key, name, value;
    for (name of names) {
        if (name in icons) {
            icon = icons[name];
        } else {
            icon = {};
            icons[name] = icon;
        }
        for (key in props) {
            value = props[key];
            if (!(key in icon)) {
                icon[key] = value;
            }
        }
    }
}
function setIconProps(icons, names, props) {
    var icon, key, name, value;
    for (name of names) {
        if (name in icons) {
            icon = icons[name];
        } else {
            icon = {};
            icons[name] = icon;
        }
        for (key in props) {
            value = props[key];
            icon[key] = value;
        }
    }
}
function setScroll(widget, x, y) {
    var scroll, visuals;
    scroll = sanitizeScroll(widget, x, y);
    visuals = widget.visuals;
    visuals.scrollX = scroll.x;
    visuals.scrollY = scroll.y;
    widget.origins[widget.diagramId] = {
        x: scroll.x,
        y: scroll.y
    };
    return scroll;
}
function setScrollFromMouseEvent(widget, x, y) {
    var norm;
    norm = sanitizeScroll(widget, x, y);
    setScroll(widget, norm.x, norm.y);
    paintLater(widget);
}
function tr(widget, text) {
    if (widget.config.translate) {
        return widget.config.translate(text);
    } else {
        return text;
    }
}
function traceLoop(visited, node, loopEnd) {
    var _collection_503, prev;
    if (!(node.id in visited)) {
        visited[node.id] = true;
        if (node.loopEnd !== loopEnd) {
            node.loops[loopEnd.id] = true;
            _collection_503 = node.prev;
            for (prev of _collection_503) {
                traceLoop(visited, prev, loopEnd);
            }
        }
    }
}
function traceLoops(visuals) {
    var trace;
    trace = function (vis, node) {
        traceLoop({}, node, node);
    };
    forType(visuals, 'loopend', trace);
    forType(visuals, 'select', putLoopsOnCases);
}
function updateExpandedBox(widget, visuals) {
    var wheight, wwidth, zoom;
    zoom = widget.zoomFactor;
    wheight = widget.height / zoom;
    wwidth = widget.width / zoom;
    visuals.box = addFreedomToBox(visuals.smallBox, wwidth, wheight);
}
function yes() {
    return 'Yes';
}
function addEditToSelection(widget, selection, edit, byId) {
    var fields, id;
    id = edit.id;
    fields = edit.fields;
    if (isFree(widget, fields)) {
        selection.prims[id] = 'free';
    } else {
        incrementCount(byId, fields.one);
        incrementCount(byId, fields.two);
        selection.prims[id] = 'node';
    }
}
function addOne(widget, headNode, node) {
    var selection;
    selection = widget.selection;
    if (node.id in selection.prims) {
        return headNode;
    } else {
        selection.prims[node.id] = 'node';
        if (node.side) {
            selection.prims[node.side] = 'node';
        }
        if (!headNode || node.y < headNode.y || node.y === headNode.y && node.x < headNode.x) {
            return node;
        } else {
            return headNode;
        }
    }
}
function addParBlockToSelection(widget, headNode, start) {
    var _, endId, id, node, result, visited;
    endId = getParTarget(start);
    visited = {};
    visited[endId] = true;
    scanTwoGraph(widget.model.items, visited, start.id);
    result = headNode;
    for (id in visited) {
        _ = visited[id];
        node = getNode(widget.visuals, id);
        result = addOne(widget, result, node);
    }
    return result;
}
function addToSelection(widget, node) {
    if (addToSelectionCore(widget, node)) {
        reportSelection(widget);
        return true;
    } else {
        return false;
    }
}
function addToSelectionCore(widget, node) {
    var head, selection, visuals, wayDown, wayUp;
    selection = widget.selection;
    visuals = widget.visuals;
    if (isMind(widget)) {
        return addToMindSelection(widget, node);
    } else {
        if (selection.head) {
            head = visuals.nodes[selection.head];
        } else {
            head = undefined;
        }
        wayUp = findWayUp(node, head);
        if (wayUp.length) {
            selectPath(widget, wayUp, head);
            return true;
        } else {
            wayDown = findWayUp(head, node);
            if (wayDown.length) {
                selectPath(widget, wayDown, head);
                return true;
            } else {
                return false;
            }
        }
    }
}
function blockSelect(widget) {
    var _branch_, _collection_506, id, node, prim, selection, selectionIds, snode, visuals;
    _branch_ = 'Any nodes in selection?';
    while (true) {
        switch (_branch_) {
        case 'Any nodes in selection?':
            selection = widget.selection;
            visuals = widget.visuals;
            selectionIds = Object.keys(selection.prims);
            if (selectionIds.length === 0) {
                if (tryAddFreeToBlock(widget)) {
                    reportSelection(widget);
                    _branch_ = 'Exit';
                } else {
                    _branch_ = 'Add nodes';
                }
            } else {
                id = selectionIds[0];
                prim = selection.prims[id];
                if (prim === 'node') {
                    snode = getNode(visuals, id);
                    if (canSelectNode(snode)) {
                        _branch_ = 'Add nodes';
                    } else {
                        _branch_ = 'Exit';
                    }
                } else {
                    if (prim === 'free' && tryAddFreeToBlock(widget)) {
                        reportSelection(widget);
                    }
                    _branch_ = 'Exit';
                }
            }
            break;
        case 'Add nodes':
            _collection_506 = visuals.nodes;
            for (id in _collection_506) {
                node = _collection_506[id];
                if (!isSelected(widget, id) && (canSelectNode(node) && boxesIntersect(visuals.selectionFrame, node.box))) {
                    addToSelection(widget, node);
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
function buildSelectionFromEdits(widget, edits) {
    var byId, edit, selected, selection;
    selected = [];
    for (edit of edits) {
        if (edit.op === 'insert') {
            if (edit.fields.type === 'branch') {
                selected = [edit];
                break;
            } else {
                if (!(edit.fields.type === 'image' || edit.fields.type === 'connection')) {
                    selected.push(edit);
                }
            }
        }
    }
    byId = {};
    for (edit of selected) {
        byId[edit.id] = {
            type: edit.fields.type,
            count: 0
        };
    }
    selection = { prims: {} };
    for (edit of selected) {
        addEditToSelection(widget, selection, edit, byId);
    }
    selection.head = findHead(selection, byId);
    return selection;
}
function canSelectNode(node) {
    var _selectValue_509;
    _selectValue_509 = node.type;
    if (_selectValue_509 === 'end' || _selectValue_509 === 'duration' || _selectValue_509 === 'header' || (_selectValue_509 === 'branch' || _selectValue_509 === 'address')) {
        return false;
    } else {
        if (_selectValue_509 === 'junction') {
            if (node.subtype === 'parbegin') {
                return true;
            } else {
                return false;
            }
        } else {
            if (_selectValue_509 === 'action' && node.id === 'params') {
                return false;
            } else {
                return true;
            }
        }
    }
}
function clusterComplete(context) {
    if (context.arrows === 0 && context.paths === 0) {
        return true;
    } else {
        return false;
    }
}
function connectionToVisualItem(widget, connection) {
    var prim;
    prim = {
        id: connection.id,
        primId: connection.id,
        type: connection.type,
        elType: 'connection',
        style: connection.style || '',
        begin: connection.begin,
        end: connection.end
    };
    Object.assign(prim, connection.boxes[0]);
    primToClient(widget, prim);
    return prim;
}
function deselectAll(widget) {
    clearSockets(widget.visuals);
    resetSelection(widget);
}
function diagramToWidgetX(widget, diaX) {
    var zoom;
    zoom = widget.zoomFactor;
    return (diaX - widget.visuals.scrollX) * zoom;
}
function diagramToWidgetY(widget, diaY) {
    var zoom;
    zoom = widget.zoomFactor;
    return (diaY - widget.visuals.scrollY) * zoom;
}
function findClosestNode(widget, filter, srcNode, vertical) {
    var _collection_511, best, current, distance, id, node;
    best = undefined;
    distance = 10000000000;
    _collection_511 = widget.visuals.nodes;
    for (id in _collection_511) {
        node = _collection_511[id];
        if (filter(node) && node.type !== 'junction' && node.type !== 'arrow-loop') {
            current = getDistance(node, srcNode, vertical);
            if (current < distance) {
                best = node;
                distance = current;
            }
        }
    }
    return best;
}
function findDraggable(visuals, x, y) {
}
function findEdge(visuals, pos) {
    return findElementAt(visuals.edges, pos.x, pos.y);
}
function findElementAt(elements, x, y) {
    var element, id;
    for (id in elements) {
        element = elements[id];
        if (element.box && hitBox(element.box, x, y)) {
            return element;
        }
    }
    return undefined;
}
function findHead(selection, byId) {
    var _collection_515, id, item, type;
    _collection_515 = selection.prims;
    for (id in _collection_515) {
        type = _collection_515[id];
        if (type !== 'node') {
            return undefined;
        }
        item = byId[id];
        if (item.count === 0 || item.count === 1 && item.type === 'arrow-loop') {
            return id;
        }
    }
    return undefined;
}
function findNeighbour(node, nodeProp, edgeProp) {
    var edge;
    while (true) {
        edge = node[nodeProp];
        if (edge) {
            node = edge[edgeProp];
            if (!(node.type === 'junction' || node.type === 'arrow-loop')) {
                return node;
            }
        } else {
            return undefined;
        }
    }
}
function findNode(visuals, pos) {
    return findElementAt(visuals.nodes, pos.x, pos.y);
}
function findVisualItem(widget, pos) {
    var edge, element, handle, node, scroll, visuals;
    visuals = widget.visuals;
    scroll = hitScrollBar(visuals, pos);
    if (scroll) {
        return scroll;
    } else {
        handle = findHandle(visuals, pos);
        if (handle) {
            return handle;
        } else {
            if (hitNugget(visuals, pos)) {
                return { elType: 'nugget' };
            } else {
                element = findFreeFront(widget, pos);
                if (element) {
                    return freeToVisualItemEx(widget, element);
                } else {
                    node = findNode(visuals, pos);
                    if (node) {
                        if (isDownStub(node)) {
                            edge = node.up;
                            return {
                                id: edge.id,
                                primId: edge.id,
                                type: edge.type,
                                role: edge.role,
                                elType: 'edge'
                            };
                        } else {
                            return nodeToVisualItem(widget, node);
                        }
                    } else {
                        edge = findEdge(visuals, pos);
                        if (edge) {
                            return {
                                id: edge.id,
                                primId: edge.id,
                                type: edge.type,
                                role: edge.role,
                                elType: 'edge'
                            };
                        } else {
                            element = findFreeBack(widget, pos);
                            if (element) {
                                return freeToVisualItemEx(widget, element);
                            } else {
                                return undefined;
                            }
                        }
                    }
                }
            }
        }
    }
}
function findWayUp(lowNode, highNode) {
    var context;
    if (highNode) {
        context = {
            visited: {},
            leak: false
        };
        findWayUpStep(context, lowNode, highNode);
        if (highNode.id in context.visited && !context.leak) {
            return utils.objectValues(context.visited);
        } else {
            return [];
        }
    } else {
        return [lowNode];
    }
}
function findWayUpStep(context, node, highNode) {
    var _collection_518, prev, visited;
    visited = context.visited;
    if (node.type === 'branch') {
        context.leak = true;
    } else {
        if (!(node.id in visited)) {
            visited[node.id] = node;
            if (node !== highNode) {
                if (node.type === 'case') {
                    findWayUpStep(context, node.select, highNode);
                } else {
                    _collection_518 = node.prev;
                    for (prev of _collection_518) {
                        findWayUpStep(context, prev, highNode);
                    }
                }
            }
        }
    }
}
function freeToVisualItem(widget, node) {
    return nodeToVisualItemCore(widget, node, 'free');
}
function freeToVisualItemEx(widget, element) {
    if (element.type === 'connection') {
        return connectionToVisualItem(widget, element);
    } else {
        return freeToVisualItem(widget, element);
    }
}
function getDistance(n1, n2, vertical) {
    var dx, dy;
    dx = n1.x - n2.x;
    dy = n1.y - n2.y;
    if (vertical) {
        dx *= 4;
    } else {
        dy *= 4;
    }
    return Math.sqrt(dx * dx + dy * dy);
}
function getNodeInfo(context, node) {
    var nodeInfo;
    if (node.id in context.nodes) {
        nodeInfo = context.nodes[node.id];
    } else {
        nodeInfo = {
            node: node,
            include: false,
            remaining: node.prev.length,
            aremaining: node.aprev.length
        };
        context.nodes[node.id] = nodeInfo;
    }
    return nodeInfo;
}
function getNodesFromSelection(widget) {
    var _collection_520, elType, id, node, result, visuals;
    visuals = widget.visuals;
    result = [];
    _collection_520 = widget.selection.prims;
    for (id in _collection_520) {
        elType = _collection_520[id];
        if (elType === 'node') {
            node = getNode(visuals, id);
            result.push(node);
        }
    }
    return result;
}
function getSelectedConnection(widget) {
    var id, prims, type, visuals;
    visuals = widget.visuals;
    prims = widget.selection.prims;
    for (id in prims) {
        type = prims[id];
        if (type === 'connection') {
            return getConnection(visuals, id);
        }
    }
    return undefined;
}
function getSelectedFree(widget) {
    var element, id, prims, result, type, visuals;
    visuals = widget.visuals;
    prims = widget.selection.prims;
    result = [];
    for (id in prims) {
        type = prims[id];
        if (type === 'free') {
            element = getFree(visuals, id);
            result.push(element);
        }
    }
    return result;
}
function incrementCount(byId, id) {
    var item;
    if (id) {
        item = byId[id];
        if (item) {
            item.count++;
        }
    }
}
function isDownStub(node) {
    if ((node.type === 'junction' || node.type === 'arrow-loop') && (node.up && node.up.role)) {
        return true;
    } else {
        return false;
    }
}
function isSelected(widget, id) {
    return id in widget.selection.prims;
}
function nodeToVisualItem(widget, node) {
    return nodeToVisualItemCore(widget, node, 'node');
}
function nodeToVisualItemCore(widget, node, elType) {
    var prim;
    prim = {
        id: node.id,
        primId: node.id,
        type: node.type,
        elType: elType,
        content: node.content || '',
        secondary: node.secondary || '',
        link: node.link || '',
        style: node.style || ''
    };
    setNotNull(node, prim, 'x');
    setNotNull(node, prim, 'y');
    setNotNull(node, prim, 'w');
    setNotNull(node, prim, 'h');
    setNotNull(node, prim, 'flag1');
    setNotNull(node, prim, 'branchId');
    setNotNull(node, prim, 'one');
    setNotNull(node, prim, 'two');
    setNotNull(node, prim, 'side');
    setNotNull(node, prim, 'margin');
    setNotNull(node, prim, 'begin');
    setNotNull(node, prim, 'end');
    setNotNull(node, prim, 'parent');
    setNotNull(node, prim, 'ordinal');
    setNotNull(node, prim, 'treeType');
    setNotNull(node, prim, 'collapsed');
    setNotNull(node, prim, 'image');
    setNotNull(node, prim, 'aux2');
    if (node.innerBox) {
        Object.assign(prim, node.innerBox);
    } else {
        if (node.box) {
            Object.assign(prim, node.box);
        }
    }
    primToClient(widget, prim);
    return prim;
}
function printPrim(visuals, prim) {
    var edge, node;
    if (prim.id in visuals.nodes) {
        node = visuals.nodes[prim.id];
        console.log(node);
    } else {
        if (prim.id in visuals.edges) {
            edge = visuals.edges[prim.id];
            console.log(edge);
        } else {
            console.log('Unknown primitive', prim);
        }
    }
}
function reportSelection(widget) {
    var prims;
    prims = getSelectedPrims(widget);
    onSelectionChanged(widget, prims);
}
function resetSelection(widget) {
    var oldSelection;
    oldSelection = widget.selection;
    resetSelectionCore(widget);
    if (oldSelection && Object.keys(oldSelection.prims) !== 0) {
        onSelectionChanged(widget, []);
    }
}
function resetSelectionCore(widget) {
    widget.selection = { prims: {} };
    if (widget.visuals) {
        widget.visuals.handles = [];
    }
}
function selectCluster(widget, headNode, node) {
    var _collection_527, _selectValue_525, context, id, included, info, inode, result, start;
    _selectValue_525 = node.type;
    if (_selectValue_525 === 'select') {
        start = node;
        context = {
            paths: 0,
            nodes: {},
            arrows: 0,
            loops: {}
        };
        info = getNodeInfo(context, start);
        selectClusterStepNext(widget, context, info);
        included = [];
        _collection_527 = context.nodes;
        for (id in _collection_527) {
            info = _collection_527[id];
            if (info.include) {
                included.push(info.node);
            }
        }
        result = headNode;
        for (inode of included) {
            result = addOne(widget, result, inode);
        }
        return result;
    } else {
        if (_selectValue_525 === 'case') {
            start = node.select;
            context = {
                paths: 0,
                nodes: {},
                arrows: 0,
                loops: {}
            };
            info = getNodeInfo(context, start);
            selectClusterStepNext(widget, context, info);
            included = [];
            _collection_527 = context.nodes;
            for (id in _collection_527) {
                info = _collection_527[id];
                if (info.include) {
                    included.push(info.node);
                }
            }
            result = headNode;
            for (inode of included) {
                result = addOne(widget, result, inode);
            }
            return result;
        } else {
            if (_selectValue_525 === 'loopbegin') {
                start = node;
                context = {
                    paths: 0,
                    nodes: {},
                    arrows: 0,
                    loops: {}
                };
                info = getNodeInfo(context, start);
                selectClusterStepNext(widget, context, info);
                included = [];
                _collection_527 = context.nodes;
                for (id in _collection_527) {
                    info = _collection_527[id];
                    if (info.include) {
                        included.push(info.node);
                    }
                }
                result = headNode;
                for (inode of included) {
                    result = addOne(widget, result, inode);
                }
                return result;
            } else {
                if (_selectValue_525 === 'loopend') {
                    start = node.loopStart;
                    context = {
                        paths: 0,
                        nodes: {},
                        arrows: 0,
                        loops: {}
                    };
                    info = getNodeInfo(context, start);
                    selectClusterStepNext(widget, context, info);
                    included = [];
                    _collection_527 = context.nodes;
                    for (id in _collection_527) {
                        info = _collection_527[id];
                        if (info.include) {
                            included.push(info.node);
                        }
                    }
                    result = headNode;
                    for (inode of included) {
                        result = addOne(widget, result, inode);
                    }
                    return result;
                } else {
                    if (_selectValue_525 === 'arrow-loop') {
                        start = node;
                        context = {
                            paths: 0,
                            nodes: {},
                            arrows: 0,
                            loops: {}
                        };
                        info = getNodeInfo(context, start);
                        selectClusterStepNext(widget, context, info);
                        included = [];
                        _collection_527 = context.nodes;
                        for (id in _collection_527) {
                            info = _collection_527[id];
                            if (info.include) {
                                included.push(info.node);
                            }
                        }
                        result = headNode;
                        for (inode of included) {
                            result = addOne(widget, result, inode);
                        }
                        return result;
                    } else {
                        if (_selectValue_525 === 'question') {
                            start = node;
                            context = {
                                paths: 0,
                                nodes: {},
                                arrows: 0,
                                loops: {}
                            };
                            info = getNodeInfo(context, start);
                            selectClusterStepNext(widget, context, info);
                            included = [];
                            _collection_527 = context.nodes;
                            for (id in _collection_527) {
                                info = _collection_527[id];
                                if (info.include) {
                                    included.push(info.node);
                                }
                            }
                            result = headNode;
                            for (inode of included) {
                                result = addOne(widget, result, inode);
                            }
                            return result;
                        } else {
                            if (_selectValue_525 === 'junction') {
                                start = goLeft(node);
                                return addParBlockToSelection(widget, headNode, start);
                            } else {
                                if (isSelected(widget, node.id)) {
                                    return headNode;
                                } else {
                                    return addOne(widget, headNode, node);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function selectClusterStep(widget, context, src, node) {
    var aprev, joins, nodeInfo, prev;
    if (!(node.type === 'end' || node.type === 'address')) {
        nodeInfo = getNodeInfo(context, node);
        if (isBackLink(src, node)) {
            aprev = nodeInfo.node.aprev.length;
            nodeInfo.aremaining--;
            if (nodeInfo.aremaining === 0) {
                context.paths -= aprev;
                selectClusterStepBack(widget, context, nodeInfo);
            }
        } else {
            prev = nodeInfo.node.prev.length;
            if (prev === 1) {
                selectClusterStepNext(widget, context, nodeInfo);
            } else {
                nodeInfo.remaining--;
                if (nodeInfo.remaining === 0) {
                    joins = prev - 1;
                    context.paths -= joins;
                    if (!clusterComplete(context)) {
                        selectClusterStepNext(widget, context, nodeInfo);
                    }
                }
            }
        }
    }
}
function selectClusterStepBack(widget, context, nodeInfo) {
    var node;
    if (nodeInfo.include) {
        context.arrows--;
    } else {
        context.arrows++;
        nodeInfo.include = true;
        node = nodeInfo.node;
        if (!clusterComplete(context)) {
            selectClusterStep(widget, context, node, node.next[0]);
        }
    }
}
function selectClusterStepNext(widget, context, nodeInfo) {
    var info, node;
    if (nodeInfo.include) {
        context.arrows--;
    } else {
        if (isArrowLoop(nodeInfo.node)) {
            context.arrows++;
        }
        nodeInfo.include = true;
        node = nodeInfo.node;
        if (node.next.length === 2) {
            context.paths++;
            selectClusterStep(widget, context, node, node.next[1]);
        } else {
            if (node.type === 'loopbegin') {
                context.loops[node.id] = true;
                context.arrows++;
            } else {
                if (node.type === 'loopend') {
                    if (node.loopStart.id in context.loops) {
                        context.arrows--;
                    } else {
                        info = getNodeInfo(context, node.loopStart);
                        selectClusterStepNext(widget, context, info);
                    }
                }
            }
        }
        if (!clusterComplete(context) || node.type == 'select') {
            selectClusterStep(widget, context, node, node.next[0]);
        }
    }
}
function selectPath(widget, path, head) {
    var newHead, step;
    newHead = head;
    for (step of path) {
        newHead = selectCluster(widget, newHead, step);
    }
    widget.selection.head = newHead.id;
}
function selectPrim(widget, id) {
    var connection, element, item, node, selection, visuals;
    clearSockets(widget.visuals);
    resetSelectionCore(widget);
    selection = widget.selection;
    visuals = widget.visuals;
    connection = getConnection(visuals, id);
    if (connection) {
        selection.prims[id] = 'connection';
        item = connectionToVisualItem(widget, connection);
        onSelectionChanged(widget, [item]);
    } else {
        element = getFree(visuals, id);
        if (element) {
            selection.prims[id] = 'free';
            item = freeToVisualItem(widget, element);
            onSelectionChanged(widget, [item]);
        } else {
            if (id in visuals.nodes) {
                selection.head = id;
                node = getNode(visuals, id);
                selection.prims[id] = 'node';
                item = nodeToVisualItem(widget, node);
                onSelectionChanged(widget, [item]);
            } else {
                if (id in visuals.edges) {
                    selection.prims[id] = 'edge';
                } else {
                    throw new Error('Can\'t select ' + id);
                }
            }
        }
    }
}
function toClient(widget, diaX, diaY) {
    var clientX, clientY, rect, visuals, widgetX, widgetY;
    visuals = widget.visuals;
    widgetX = diagramToWidgetX(widget, diaX);
    widgetY = diagramToWidgetY(widget, diaY);
    rect = getWidgetRect(widget);
    clientX = widgetX + rect.left;
    clientY = widgetY + rect.top;
    return {
        x: clientX,
        y: clientY
    };
}
function toDiagram(widget, evt) {
    var rect, widgetX, widgetY;
    rect = widget.canvas.getBoundingClientRect();
    widgetX = evt.clientX - rect.left;
    widgetY = evt.clientY - rect.top;
    return widgetToDiagram(widget, widgetX, widgetY);
}
function toWidget(element, x, y) {
    var rect, widgetX, widgetY;
    rect = element.getBoundingClientRect();
    widgetX = x - rect.left;
    widgetY = y - rect.top;
    return {
        x: widgetX,
        y: widgetY
    };
}
function tryAddFreeToBlock(widget) {
    var _collection_530, added, box, element, selection, visuals;
    visuals = widget.visuals;
    selection = widget.selection;
    added = false;
    _collection_530 = visuals.free;
    for (element of _collection_530) {
        if (!isSelected(widget, element.id)) {
            if (element.innerBox) {
                box = element.innerBox;
            } else {
                box = element.box;
            }
            if (boxesIntersect(visuals.selectionFrame, box) && (!element.boxes || intersectBoxes(element, visuals.selectionFrame))) {
                selection.prims[element.id] = 'free';
                added = true;
            }
        }
    }
    return added;
}
function updateSelectionFrame(widget, startX, startY, evt) {
    var current, evt0, height, left, start, top, visuals, width;
    visuals = widget.visuals;
    evt0 = {
        clientX: startX,
        clientY: startY,
        target: evt.target
    };
    start = toDiagram(widget, evt0);
    current = toDiagram(widget, evt);
    if (!visuals.selectionFrame) {
        visuals.selectionFrame = {};
    }
    if (start.x < current.x) {
        left = start.x;
        width = current.x - start.x;
    } else {
        left = current.x;
        width = start.x - current.x;
    }
    if (start.y < current.y) {
        top = start.y;
        height = current.y - start.y;
    } else {
        top = current.y;
        height = start.y - current.y;
    }
    visuals.selectionFrame.left = left;
    visuals.selectionFrame.top = top;
    visuals.selectionFrame.width = width;
    visuals.selectionFrame.height = height;
}
function widgetToDiagram(widget, widgetX, widgetY) {
    var x, y, zoom;
    zoom = widget.zoomFactor;
    x = widgetX / zoom + widget.visuals.scrollX;
    y = widgetY / zoom + widget.visuals.scrollY;
    return {
        x: Math.floor(x),
        y: Math.floor(y)
    };
}
function getBranch(visuals, ordinal) {
    var nodeId;
    nodeId = visuals.branches[ordinal];
    return getNode(visuals, nodeId);
}
function isSilhouette(visuals) {
    return visuals.branches.length > 1;
}
function redirectAddress(widget, address, targetId) {
    var edits;
    edits = [];
    redirectUpperItems(edits, address.up.links, targetId);
    return updateAndKeepSelection(widget, edits);
}
function redirectBranch(visuals, branchNodes, oldTargets, newTarget, edits) {
    var _, itemId, node;
    for (itemId in branchNodes) {
        _ = branchNodes[itemId];
        if (itemId in visuals.nodes) {
            node = getNode(visuals, itemId);
            if (node.one in oldTargets) {
                updateItem(edits, itemId, { one: newTarget });
            }
            if (node.two in oldTargets) {
                updateItem(edits, itemId, { two: newTarget });
            }
        }
    }
}
function scanBranchItems(node, visited) {
    var _collection_533, next;
    if (!(node.itemId in visited || node.type === 'address')) {
        visited[node.itemId] = node;
        _collection_533 = node.next;
        for (next of _collection_533) {
            scanBranchItems(next, visited);
        }
    }
}
function toPrimitive(widget) {
    var branches, ditch, edits, endId, first, firstId, i, rest, visuals;
    edits = [];
    visuals = widget.visuals;
    branches = visuals.branches;
    first = {};
    rest = {};
    firstId = branches[0];
    scanBranchItems(getBranch(visuals, 0), first);
    for (i = 1; i < branches.length; i++) {
        scanBranchItems(getBranch(visuals, i), rest);
    }
    if (visuals.end) {
        endId = visuals.end.itemId;
        delete rest[endId];
    } else {
        endId = createItem(widget.model, edits, { type: 'end' });
    }
    rest[firstId] = true;
    redirectBranch(visuals, first, rest, endId, edits);
    delete rest[firstId];
    ditch = function (itemId) {
        deleteWithDur(widget, itemId, edits);
    };
    Object.keys(rest).forEach(ditch);
    updateItem(edits, branches[0], {
        content: '',
        branchId: 0
    });
    return edits;
}
function toSilhouette(widget) {
    var b1, b2, b3, branch2, branch3, edits, end, fb, model, visuals;
    model = widget.model;
    visuals = widget.visuals;
    end = visuals.end;
    edits = [];
    b1 = visuals.config.branch + '1';
    b2 = visuals.config.branch + '2';
    b3 = visuals.config.exit;
    fb = firstBranchNode(visuals);
    branch3 = createItem(model, edits, {
        type: 'branch',
        content: b3,
        one: end.itemId,
        branchId: 3
    });
    branch2 = createItem(model, edits, {
        type: 'branch',
        content: b2,
        one: branch3,
        branchId: 2
    });
    updateItem(edits, fb.itemId, {
        content: b1,
        branchId: 1
    });
    redirectUpperItems(edits, end.up.links, branch2);
    return edits;
}
function addParameters(widget, prim) {
    prim = {
        id: 'params',
        content: '',
        left: prim.left,
        top: prim.top
    };
    startEditContent(widget, prim);
}
function changeLayout(widget, prim, layout) {
    var change, item;
    tracing.trace('changeLayout', prim.id + '-' + layout);
    item = widget.model.items[prim.id];
    if (item) {
        change = {
            id: prim.id,
            fields: { treeType: layout },
            op: 'update'
        };
    } else {
        change = {
            id: prim.id,
            fields: {
                treeType: layout,
                type: 'header'
            },
            op: 'insert'
        };
    }
    return updateAndKeepSelection(widget, [change]);
}
function clickedOnTop(widget, prim, pos) {
    var h2, node;
    node = getNode(widget.visuals, prim.id);
    if (canEditSecondary(node)) {
        h2 = getSecondaryHeightCore(widget.visuals, node);
        if (h2 && pos.y < prim.y - prim.h + h2) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
function doubleClick(widget, prim, pos, evt) {
    var _selectValue_535;
    tracing.trace('double click', prim);
    if (prim) {
        _selectValue_535 = prim.elType;
        if (_selectValue_535 === 'node') {
            if (evt.stopPropagation) {
                evt.stopPropagation();
                evt.preventDefault();
            }
            if (clickedOnTop(widget, prim, pos)) {
                startEditSecondary(widget, prim);
            } else {
                startEditContent(widget, prim);
            }
        } else {
            if (_selectValue_535 === 'free') {
                startEditContent(widget, prim);
            } else {
                if (_selectValue_535 === 'handle') {
                    doubleClickHandle(widget, prim);
                }
            }
        }
    }
}
function doubleClickHandle(widget, prim) {
    var vitem;
    vitem = getPrimById(widget, prim.id);
    if (vitem) {
        startEditContent(widget, vitem);
    }
}
function flipGroup(widget, prim) {
    var change, node;
    node = getFree(widget.visuals, prim.id);
    change = {
        id: prim.id,
        fields: {},
        op: 'update'
    };
    if (node.flag1) {
        change.fields.flag1 = 0;
    } else {
        change.fields.flag1 = 1;
    }
    change.fields.loX = -node.loX;
    change.fields.hiX = -node.hiX;
    return updateAndKeepSelection(widget, [change]);
}
function getCursorForItem(widget, prim, pos, evt) {
    var callback;
    if (prim.elType === 'nugget') {
        return 'move';
    } else {
        if (prim.elType === 'handle') {
            return prim.getCursor();
        } else {
            callback = widget.config.getCursorForItem;
            if (callback) {
                return callback(prim, pos, evt);
            } else {
                return 'grab';
            }
        }
    }
}
function getPrimById(widget, id) {
    var free, node, visuals, vitem;
    visuals = widget.visuals;
    node = getNode(visuals, id);
    if (node) {
        vitem = nodeToVisualItem(widget, node);
        return vitem;
    } else {
        free = getFree(visuals, id);
        if (free) {
            vitem = freeToVisualItem(widget, free);
            return vitem;
        } else {
            return undefined;
        }
    }
}
function insertBranch(widget, branchNode, left) {
    var socket;
    tracing.trace('insertBranch', branchNode.id + '-' + left);
    socket = {
        op: 'insert',
        type: 'branch',
        node: branchNode,
        left: left
    };
    runInsertAction(widget, socket);
}
function insertCase(widget, caseNode, left) {
    tracing.trace('insertCase', caseNode.id + '-' + left);
    insertCaseCore(widget, caseNode, left, 'insert');
}
function insertCaseCore(widget, caseNode, left, op) {
    var jun, node, socket;
    if (left) {
        jun = getUp(caseNode);
        if (jun.left) {
            node = getDown(getLeft(jun));
            socket = {
                op: op,
                type: 'case',
                node: node
            };
        } else {
            socket = {
                op: op,
                type: 'first-case',
                node: caseNode
            };
        }
    } else {
        socket = {
            op: op,
            type: 'case',
            node: caseNode
        };
    }
    runInsertAction(widget, socket);
}
function insertPath(widget, pathNode, left) {
    var socket;
    tracing.trace('insertPath', pathNode.id + '-' + left);
    if (left) {
        if (pathNode.left) {
            socket = {
                op: 'insert',
                type: 'par',
                edge: pathNode.left,
                links: []
            };
        } else {
            socket = {
                op: 'insert',
                type: 'firstpar',
                node: pathNode,
                links: []
            };
            utils.addRange(pathNode.up.links, socket.links);
        }
    } else {
        if (pathNode.right) {
            socket = {
                op: 'insert',
                type: 'par',
                edge: pathNode.right,
                links: []
            };
        } else {
            socket = {
                op: 'insert',
                type: 'par',
                node: pathNode,
                links: []
            };
        }
    }
    runInsertAction(widget, socket);
}
function mouseClick(widget, pos, evt) {
    var diff, doubleClickTime, lastClick, lastPrimId, now, prim, primId, visuals;
    doubleClickTime = 500;
    visuals = widget.visuals;
    now = utils.getNowMs();
    lastClick = widget.lastClick;
    lastPrimId = widget.lastPrimId;
    prim = findVisualItem(widget, pos);
    if (prim) {
        widget.lastPrimId = prim.id;
        primId = prim.id;
    } else {
        widget.lastPrimId = undefined;
        primId = undefined;
    }
    tracing.trace('mouseClick', [
        pos,
        prim
    ]);
    if (lastClick) {
        diff = now - lastClick;
        if (diff <= doubleClickTime && primId === lastPrimId) {
            widget.lastClick = undefined;
            doubleClick(widget, prim, pos, evt);
        } else {
            widget.lastClick = now;
            if (prim) {
                if (prim.elType !== 'handle') {
                    if (prim.id) {
                        if (!isSelected(widget, prim.id)) {
                            selectPrim(widget, prim.id);
                            showLianaSockets(widget, prim);
                        }
                        onItemClick(widget, prim, pos, evt);
                    }
                    paint(widget);
                }
            } else {
                deselectAll(widget);
                paint(widget);
            }
        }
    } else {
        widget.lastClick = now;
        if (prim) {
            if (!(prim.elType !== 'handle')) {
                if (prim.id) {
                    if (!isSelected(widget, prim.id)) {
                        selectPrim(widget, prim.id);
                        showLianaSockets(widget, prim);
                    }
                    onItemClick(widget, prim, pos, evt);
                }
                paint(widget);
            }
        } else {
            deselectAll(widget);
            paint(widget);
        }
    }
}
function onItemClick(widget, prim, pos, evt) {
    var callback;
    callback = widget.config.onItemClick;
    if (callback) {
        callback(prim, pos, evt);
    }
}
function pasteBranchBefore(widget, branchNode) {
    var socket;
    tracing.trace('pasteBranchBefore', branchNode.id);
    socket = {
        op: 'paste',
        type: 'branch',
        node: branchNode,
        left: true
    };
    runInsertAction(widget, socket);
}
function pasteCaseAfter(widget, caseNode) {
    tracing.trace('pasteCaseAfter', caseNode.id);
    insertCaseCore(widget, caseNode, false, 'paste');
}
function startChangeImage(widget, prim) {
    var callback, delayed;
    callback = widget.config.startChangeImage;
    if (callback) {
        delayed = function () {
            callback(prim);
        };
        setTimeout(delayed, 1);
    } else {
        console.error('startChangeImage is missing in config');
    }
}
function startEditAux2(widget, prim) {
    var callback, delayed, ro;
    if (isFree(widget, prim)) {
        callback = widget.config.startEditAux2;
        if (callback) {
            ro = isReadonly(widget);
            delayed = function () {
                callback(prim, ro);
            };
            setTimeout(delayed, 1);
        } else {
            console.error('startEditAux2 is missing in config');
        }
    }
}
function startEditContent(widget, prim) {
    var callback, delayed, ro;
    if (canEditNodeText(widget, prim)) {
        callback = widget.config.startEditContent;
        if (callback) {
            ro = isReadonly(widget);
            delayed = function () {
                callback(prim, ro);
            };
            tracing.trace('DrakonCanvas.startEditContent, will edit', prim);
            setTimeout(delayed, 1);
        } else {
            console.error('startEditContent is missing in config');
        }
    }
}
function startEditDiagramStyle(widget, x, y) {
    var callback, delayed, oldStyle;
    oldStyle = buildStyleFromDiagram(widget);
    callback = widget.config.startEditDiagramStyle;
    if (callback) {
        delayed = function () {
            callback(oldStyle, x, y);
        };
        setTimeout(delayed, 1);
    } else {
        console.error('startEditDiagramStyle is missing in config');
    }
}
function startEditLink(widget, prim) {
    var callback, delayed, ro;
    if (canEditNodeText(widget, prim)) {
        callback = widget.config.startEditLink;
        if (callback) {
            ro = isReadonly(widget);
            delayed = function () {
                callback(prim, ro);
            };
            setTimeout(delayed, 1);
        } else {
            console.error('startEditLink is missing in config');
        }
    }
}
function startEditSecondary(widget, prim) {
    var callback, delayed, ro;
    if (canEditNodeText(widget, prim)) {
        callback = widget.config.startEditSecondary;
        if (callback) {
            ro = isReadonly(widget);
            delayed = function () {
                callback(prim, ro);
            };
            setTimeout(delayed, 1);
        } else {
            console.error('startEditSecondary is missing in config');
        }
    }
}
function startEditStyle(widget) {
    var accepted, callback, delayed, ids, oldStyle, prims, x, y;
    prims = getSelectedPrims(widget);
    if (prims.length) {
        x = prims[0].left + prims[0].width;
        y = prims[0].top;
        ids = prims.map(function (prim) {
            return prim.id;
        });
        oldStyle = buildStyleFromPrims(widget.visuals, prims);
        accepted = getAcceptedStyleProps(widget, prims);
        callback = widget.config.startEditStyle;
        if (callback) {
            delayed = function () {
                callback(ids, oldStyle, x, y, accepted);
            };
            setTimeout(delayed, 1);
        } else {
            console.error('startEditStyle is missing in config');
        }
    }
}
function DrakonCanvas() {
    var self = { _type: 'DrakonCanvas' };
    function DrakonCanvas_arrowDown() {
        var first, node, nodes;
        tracing.trace('DrakonCanvas.arrowDown');
        if (self.visuals.config.canSelect) {
            nodes = getNodesFromSelection(self);
            if (nodes.length !== 0) {
                first = nodes[0];
                node = findNeighbour(first, 'down', 'tail');
                if (node) {
                    self.showItem(node.id);
                } else {
                    node = findClosestNode(self, function (n) {
                        return n.y > first.y;
                    }, first, true);
                    if (node) {
                        self.showItem(node.id);
                    }
                }
            }
        }
    }
    function DrakonCanvas_arrowLeft() {
        var first, node, nodes;
        tracing.trace('DrakonCanvas.arrowLeft');
        if (self.visuals.config.canSelect) {
            nodes = getNodesFromSelection(self);
            if (nodes.length !== 0) {
                first = nodes[0];
                node = findNeighbour(first, 'left', 'head');
                if (node) {
                    self.showItem(node.id);
                } else {
                    node = findClosestNode(self, function (n) {
                        return n.x < first.x;
                    }, first, false);
                    if (node) {
                        self.showItem(node.id);
                    }
                }
            }
        }
    }
    function DrakonCanvas_arrowRight() {
        var first, node, nodes;
        tracing.trace('DrakonCanvas.arrowRight');
        if (self.visuals.config.canSelect) {
            nodes = getNodesFromSelection(self);
            if (nodes.length !== 0) {
                first = nodes[0];
                node = findNeighbour(first, 'right', 'tail');
                if (node) {
                    self.showItem(node.id);
                } else {
                    node = findClosestNode(self, function (n) {
                        return n.x > first.x;
                    }, first, false);
                    if (node) {
                        self.showItem(node.id);
                    }
                }
            }
        }
    }
    function DrakonCanvas_arrowUp() {
        var first, node, nodes;
        tracing.trace('DrakonCanvas.arrowUp');
        if (self.visuals.config.canSelect) {
            nodes = getNodesFromSelection(self);
            if (nodes.length !== 0) {
                first = nodes[0];
                node = findNeighbour(first, 'up', 'head');
                if (node) {
                    self.showItem(node.id);
                } else {
                    node = findClosestNode(self, function (n) {
                        return n.y < first.y;
                    }, first, true);
                    if (node) {
                        self.showItem(node.id);
                    }
                }
            }
        }
    }
    function DrakonCanvas_copySelection() {
        tracing.trace('DrakonCanvas.copySelection');
        copy(self);
    }
    function DrakonCanvas_cutSelection() {
        tracing.trace('DrakonCanvas.cutSelection');
        if (!isReadonly(self)) {
            cut(self);
        }
    }
    function DrakonCanvas_deleteSelection() {
        tracing.trace('DrakonCanvas.deleteSelection');
        if (!isReadonly(self)) {
            deleteSelection(self);
        }
    }
    function DrakonCanvas_editContent() {
        var element, node, nodes, prim;
        tracing.trace('DrakonCanvas.editContent');
        element = getFreeFromSelection(self);
        if (element) {
            prim = freeToVisualItem(self, element);
            startEditContent(self, prim);
        } else {
            nodes = getNodesFromSelection(self);
            if (nodes.length === 1) {
                node = nodes[0];
                if (canEditNodeText(self, node)) {
                    prim = nodeToVisualItem(self, node);
                    startEditContent(self, prim);
                }
            }
        }
    }
    function DrakonCanvas_exportCanvas(zoom100, watermark) {
        var box, canvas, config, ctx, height, visuals, width, zoom;
        tracing.trace('DrakonCanvas.exportCanvas', zoom100);
        zoom = zoom100 / 10000;
        visuals = self.visuals;
        config = visuals.config;
        box = calculateDiagramBox(visuals, false);
        width = (box.right - box.left) * zoom;
        height = (box.bottom - box.top) * zoom;
        canvas = html.createElement('canvas', {
            width: width,
            height: height
        });
        ctx = canvas.getContext('2d');
        exportCore(self, box, zoom, ctx, watermark);
        return canvas;
    }
    function DrakonCanvas_exportJson() {
        var _collection_537, copy, diagram, id, item, src;
        tracing.trace('DrakonCanvas.exportJson');
        diagram = {
            items: {},
            type: self.model.type
        };
        src = self.edit.diagram;
        copyFieldsWithValue(diagram, src, [
            'name',
            'params',
            'style',
            'description'
        ]);
        _collection_537 = src.items;
        for (id in _collection_537) {
            item = _collection_537[id];
            copy = utils.clone(item);
            delete copy.id;
            diagram.items[id] = copy;
        }
        return JSON.stringify(diagram, null, 4);
    }
    function DrakonCanvas_exportToContext(box, zoom100, ctx) {
        var zoom;
        tracing.trace('DrakonCanvas.exportToContext', zoom100);
        zoom = zoom100 / 10000;
        self.visuals.svg = true;
        exportCore(self, box, zoom, ctx);
        self.visuals.svg = false;
    }
    function DrakonCanvas_getDiagramBox() {
        return calculateDiagramBox(self.visuals);
    }
    function DrakonCanvas_getDiagramProperties() {
        var result;
        result = { type: self.model.type };
        utils.copyFieldsWithValue(result, self.model.doc, [
            'name',
            'params',
            'description'
        ]);
        return result;
    }
    function DrakonCanvas_getLoadedImages() {
        var _collection_540, id, image, result;
        result = {};
        _collection_540 = self.images;
        for (id in _collection_540) {
            image = _collection_540[id];
            result[id] = { content: image.content };
        }
        return result;
    }
    function DrakonCanvas_getVersion() {
        return '1.5.1';
    }
    function DrakonCanvas_getZoom() {
        if (self.zoom) {
            return self.zoom;
        } else {
            return 10000;
        }
    }
    function DrakonCanvas_goHome() {
        tracing.trace('DrakonCanvas.goHome');
        delete self.origins[self.diagramId];
        calculateDiagramBoxForEdit(self, self.visuals);
        initScrollPos(self);
        paint(self);
    }
    function DrakonCanvas_init() {
        tracing.trace('DrakonCanvas.init');
        unit.noSmooth = {
            floor: true,
            parceiling: true,
            ceil: true,
            'case': true,
            parent: true
        };
        self.origins = {};
        self.mindIcons = {
            idea: true,
            ridea: true,
            conclusion: true,
            header: true,
            'graf-image': true
        };
        self.styleTag = html.createStyle();
        self.myStyleId = Math.floor(Math.random() * 100000);
        self.userMemory = { headStyle: 'arrow' };
        self.zoom = 10000;
        self.zoomFactor = 1;
        initInsertFunctions(self);
        initFreeFunctions(self);
    }
    async function DrakonCanvas_insertFree(type, evt, imageData) {
        var edits, elementActions, images, item, pos;
        tracing.trace('DrakonCanvas.insertFree', type);
        elementActions = self.freeIcons[type];
        if (elementActions) {
            if (evt) {
                pos = findFreePos(self, evt);
            } else {
                pos = getDiagramCenter(self);
            }
            item = elementActions.create(pos, edits);
            edits = [];
            insertFreeItem(self, edits, item);
            images = {};
            insertImageDataItem(imageData, edits, images);
            await loadCreatedImages(self, edits, images);
            resizeElementToImage(self, edits);
            return doEdit(self, edits);
        } else {
            console.error('Unknown free icon type', type);
        }
    }
    function DrakonCanvas_isReadonly() {
        return isReadonly(self);
    }
    function DrakonCanvas_onChange(change) {
        tracing.trace('DrakonCanvas.onChange', change);
        self.edit.forcedChange(change);
        self.redraw();
    }
    function DrakonCanvas_onContextMenu(evt) {
        evt.preventDefault();
        return false;
    }
    function DrakonCanvas_onMouseDown(evt) {
        if (evt.pointerType !== 'touch') {
            evt.target.setPointerCapture(evt.pointerId);
            evt.preventDefault();
            evt.stopPropagation();
            if (self.mouseEvents) {
                self.mouseEvents.mouseDown(evt);
            }
        }
    }
    function DrakonCanvas_onMouseLeave(evt) {
        if (evt.pointerType !== 'touch' && self.mouseEvents) {
            self.mouseEvents.mouseLeave(evt);
        }
    }
    function DrakonCanvas_onMouseMove(evt) {
        if (evt.pointerType !== 'touch' && self.mouseEvents) {
            evt.preventDefault();
            self.mouseEvents.mouseMove(evt);
        }
    }
    function DrakonCanvas_onMouseUp(evt) {
        if (evt.pointerType !== 'touch' && self.mouseEvents) {
            evt.preventDefault();
            self.mouseEvents.mouseUp(evt);
        }
    }
    function DrakonCanvas_onTouchEnd(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (self.touchEvents) {
            self.touchEvents.touchEnd(evt);
        }
    }
    function DrakonCanvas_onTouchMove(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (self.touchEvents) {
            self.touchEvents.touchMove(evt);
        }
    }
    function DrakonCanvas_onTouchStart(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (self.touchEvents) {
            self.touchEvents.touchStart(evt);
        }
    }
    function DrakonCanvas_patchDiagramStyle(style) {
        var change, newStyle, oldStyle, styleStr;
        tracing.trace('DrakonCanvas.patchDiagramStyle', style);
        if (!style) {
            style = {};
        }
        oldStyle = self.model.doc.style;
        newStyle = oldStyle || {};
        Object.assign(newStyle, style);
        styleStr = JSON.stringify(newStyle);
        change = {
            fields: { style: styleStr },
            op: 'update'
        };
        return updateAndKeepSelection(self, [change]);
    }
    async function DrakonCanvas_redo() {
        var selection;
        tracing.trace('DrakonCanvas.redo');
        if (!isReadonly(self) && self.edit) {
            selection = self.edit.redoEdit();
            if (selection) {
                await loadImages(self);
                onUndoRedo(self, selection);
            }
        }
    }
    function DrakonCanvas_redraw() {
        var fonts;
        buildDiagramModel(self, self.edit.diagram);
        fonts = buildVisualsForEdit(self);
        paint(self);
        return fonts;
    }
    function DrakonCanvas_render(width, height, config) {
        var canvas, container, factor, scrollable;
        container = div({
            display: 'inline-block',
            position: 'relative',
            left: '0px',
            top: '0px',
            width: '100%',
            height: '100%',
            overflow: 'hidden'
        });
        canvas = html.createElement('canvas');
        factor = html.getRetinaFactor();
        canvas.style.position = 'absolute';
        canvas.style.display = 'inline-block';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = width * factor;
        canvas.height = height * factor;
        self.width = width;
        self.height = height;
        self.canvas = canvas;
        self.container = container;
        html.add(container, canvas);
        self.config = buildConfig(config);
        createStyles(self);
        if (!config.canvasIcons) {
            self.contentContainer = div({
                display: 'inline-block',
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: '100vw',
                height: '100vh',
                'pointer-events': 'none'
            });
            html.add(container, self.contentContainer);
        }
        scrollable = 'drakon-scrollable-container' + self.myStyleId;
        self.scrollableContainer = div(scrollable);
        html.add(container, self.scrollableContainer);
        registerEvent(self.scrollableContainer, 'pointerdown', self.onMouseDown);
        registerEvent(self.scrollableContainer, 'pointermove', self.onMouseMove);
        registerEvent(self.scrollableContainer, 'pointerup', self.onMouseUp);
        registerEvent(self.scrollableContainer, 'pointerleave', self.onMouseLeave);
        registerEvent(self.scrollableContainer, 'contextmenu', self.onContextMenu);
        registerEvent(self.scrollableContainer, 'wheel', function (evt) {
            onMouseWheel(self, evt);
        });
        registerEvent(self.scrollableContainer, 'touchstart', self.onTouchStart);
        registerEvent(self.scrollableContainer, 'touchmove', self.onTouchMove);
        registerEvent(self.scrollableContainer, 'touchcancel', self.onTouchEnd);
        registerEvent(self.scrollableContainer, 'touchend', self.onTouchEnd);
        if (self.config.showLog) {
            unit.logDiv = div('full-screen', {
                'position': 'fixed',
                'width': '100vw',
                'heigh': '100vh',
                'left': '0px',
                'top': '0px',
                background: 'rgba(255, 200, 0, 0.5)',
                'pointer-events': 'none',
                'z-index': 5000
            });
            unit.debugLog = [];
            html.add(container, unit.logDiv);
        }
        return container;
    }
    function DrakonCanvas_setAux2(itemId, aux2) {
        var change;
        tracing.trace('DrakonCanvas.setAux2', [
            itemId,
            aux2
        ]);
        checkNotReadonly(self);
        change = {
            id: itemId,
            fields: { aux2: aux2 },
            op: 'update'
        };
        return updateAndKeepSelection(self, [change]);
    }
    function DrakonCanvas_setContent(itemId, content) {
        var change;
        tracing.trace('DrakonCanvas.setContent', [
            itemId,
            content
        ]);
        checkNotReadonly(self);
        if (itemId === 'header' || itemId === 'root') {
            change = {
                fields: { name: content },
                op: 'update'
            };
            doEditNoRender(self, [change]);
            return [];
        } else {
            if (itemId === 'params') {
                change = {
                    fields: { params: content },
                    op: 'update'
                };
                if (content) {
                    return updateAndKeepSelection(self, [change]);
                } else {
                    return doEdit(self, [change]);
                }
            } else {
                change = {
                    id: itemId,
                    fields: { content: content },
                    op: 'update'
                };
                return updateAndKeepSelection(self, [change]);
            }
        }
    }
    async function DrakonCanvas_setDiagram(diagramId, diagram, sender) {
        var fonts;
        stopMachine(self, 'mouseEvents');
        self.edit = edit_tools.createUndoEdit(diagram, sender);
        await loadImages(self);
        self.diagramId = diagramId;
        resetSelection(self);
        fonts = self.redraw();
        createEventBehavior(self);
        return fonts;
    }
    function DrakonCanvas_setDiagramProperty(name, value) {
        var change;
        tracing.trace('DrakonCanvas.setDiagramProperty', [
            name,
            value
        ]);
        checkNotReadonly(self);
        change = {
            fields: {},
            op: 'update'
        };
        change.fields[name] = value;
        if (name === 'name') {
            doEditNoRender(self, [change]);
        } else {
            if (name === 'params') {
                return doEdit(self, [change]);
            } else {
                updateAndKeepSelection(self, [change]);
            }
        }
    }
    function DrakonCanvas_setDiagramStyle(style) {
        var change, styleStr;
        tracing.trace('DrakonCanvas.setDiagramStyle', style);
        if (style) {
            styleStr = JSON.stringify(style);
        } else {
            styleStr = '';
        }
        change = {
            fields: { style: styleStr },
            op: 'update'
        };
        return updateAndKeepSelection(self, [change]);
    }
    async function DrakonCanvas_setImage(itemId, imageData) {
        var edits, fields, images, item, tempId;
        tracing.trace('DrakonCanvas.setImage', itemId);
        checkNotReadonly(self);
        fields = {};
        images = {};
        if (imageData.id) {
            item = self.model.items[itemId];
            if (item.image === imageData.id) {
                return [];
            } else {
                fields.image = imageData.id;
                edits = [{
                        id: itemId,
                        fields: fields,
                        op: 'update'
                    }];
                await loadCreatedImages(self, edits, images);
                return updateAndKeepSelection(self, edits);
            }
        } else {
            tempId = 'temp-image-id';
            images[tempId] = { content: imageData.content };
            fields.image = tempId;
            edits = [{
                    id: itemId,
                    fields: fields,
                    op: 'update'
                }];
            await loadCreatedImages(self, edits, images);
            return updateAndKeepSelection(self, edits);
        }
    }
    function DrakonCanvas_setLink(itemId, link) {
        var change;
        tracing.trace('DrakonCanvas.setLink', [
            itemId,
            link
        ]);
        checkNotReadonly(self);
        change = {
            id: itemId,
            fields: { link: link },
            op: 'update'
        };
        updateAndKeepSelection(self, [change]);
    }
    function DrakonCanvas_setSecondary(itemId, secondary) {
        var change;
        tracing.trace('DrakonCanvas.setSecondary', [
            itemId,
            secondary
        ]);
        checkNotReadonly(self);
        change = {
            id: itemId,
            fields: { secondary: secondary },
            op: 'update'
        };
        return updateAndKeepSelection(self, [change]);
    }
    function DrakonCanvas_setStyle(ids, style) {
        var edit, edits, id, item, styleStr, type;
        tracing.trace('DrakonCanvas.setStyle', [
            ids,
            style
        ]);
        if (style) {
            if ('headStyle' in style) {
                self.userMemory.headStyle = style.headStyle;
            }
            styleStr = JSON.stringify(style);
        } else {
            styleStr = '';
        }
        edits = [];
        for (id of ids) {
            if (id in self.model.items) {
                updateItem(edits, id, { style: styleStr });
            } else {
                if (id === 'header' || id === 'root') {
                    type = 'header';
                } else {
                    if (id !== 'params') {
                        throw new Error('Unexpected case value: ' + id);
                    }
                    type = 'params';
                }
                item = {
                    style: styleStr,
                    type: type,
                    id: id
                };
                edit = createInsert(item);
                edits.push(edit);
            }
        }
        return updateAndKeepSelection(self, edits);
    }
    function DrakonCanvas_setZoom(zoom) {
        var clientX, clientY, distX, distX2, distY, distY2, hover, oldScrollX, oldScrollY, oldZoom, scrollX, scrollY;
        tracing.trace('DrakonCanvas.setZoom', zoom);
        self.zoom = Math.max(2500, Math.min(40000, zoom));
        oldZoom = self.zoomFactor;
        self.zoomFactor = self.zoom / 10000;
        if (self.edit) {
            updateExpandedBox(self, self.visuals);
            oldScrollX = self.visuals.scrollX;
            oldScrollY = self.visuals.scrollY;
            hover = getHoverPos(self);
            clientX = hover.x;
            clientY = hover.y;
            distX = clientX / oldZoom;
            distY = clientY / oldZoom;
            distX2 = clientX / self.zoomFactor;
            distY2 = clientY / self.zoomFactor;
            scrollX = oldScrollX + Math.round(distX - distX2);
            scrollY = oldScrollY + Math.round(distY - distY2);
            setScroll(self, scrollX, scrollY);
            self.visuals.config.zoom = self.zoomFactor;
            initScrollPos(self);
            paintLater(self);
        }
    }
    function DrakonCanvas_showInsertionSockets(type, imageData) {
        var showInsert;
        tracing.trace('DrakonCanvas.showInsertionSockets', type);
        if (!isReadonly(self)) {
            clearSockets(self.visuals);
            if (type in self.mindIcons) {
                showMindInsertSockets(self, 'insert', type, imageData);
            } else {
                if (type === 'case') {
                    showInsert = function (visuals, node) {
                        showCaseSockets(visuals, node, 'insert');
                    };
                    forType(self.visuals, 'case', showInsert);
                } else {
                    if (type === 'branch') {
                        showAllBranchSockets(self.visuals, 'insert');
                    } else {
                        if (type === 'par') {
                            showAllParSockets(self.visuals, 'insert');
                        } else {
                            if (type === 'duration') {
                                showDurationSockets(self.visuals, 'insert');
                            } else {
                                showBlockInsertSockets(self.visuals, 'insert', type, imageData);
                            }
                        }
                    }
                }
            }
            paint(self);
        }
    }
    function DrakonCanvas_showItem(itemId) {
        var box, halfHeight, halfWidth, height, node, nodeBottom, nodeBox, nodeLeft, nodeRight, nodeTop, nodeX, nodeY, scroll, scrollX, scrollY, visuals, width, zoom;
        tracing.trace('DrakonCanvas.showItem', itemId);
        visuals = self.visuals;
        box = visuals.box;
        zoom = self.zoomFactor;
        width = self.width / zoom;
        height = self.height / zoom;
        node = getFree(visuals, itemId);
        if (!node) {
            node = getNode(visuals, itemId);
        }
        nodeBox = node.box;
        nodeLeft = diagramToWidgetX(self, nodeBox.left);
        nodeTop = diagramToWidgetY(self, nodeBox.top);
        nodeRight = diagramToWidgetX(self, nodeBox.left + nodeBox.width);
        nodeBottom = diagramToWidgetY(self, nodeBox.top + nodeBox.height);
        nodeX = nodeBox.left + nodeBox.width / 2;
        nodeY = nodeBox.top + nodeBox.height / 2;
        if (nodeLeft >= 0 && nodeRight < self.width) {
            scrollX = visuals.scrollX;
        } else {
            halfWidth = Math.floor(width / 2);
            scrollX = nodeX - halfWidth;
        }
        if (nodeTop >= 0 && nodeBottom < self.height) {
            scrollY = visuals.scrollY;
        } else {
            halfHeight = Math.floor(height / 2);
            scrollY = nodeY - halfHeight;
        }
        scroll = setScroll(self, scrollX, scrollY);
        selectPrim(self, itemId);
        paint(self);
    }
    function DrakonCanvas_showPaste() {
        var _selectValue_543, clipboard;
        tracing.trace('DrakonCanvas.showPaste');
        if (!isReadonly(self)) {
            clipboard = getClipboardClone(self);
            if (clipboard) {
                _selectValue_543 = clipboard.type;
                if (_selectValue_543 === 'case' || _selectValue_543 === 'branch' || _selectValue_543 === 'block' || _selectValue_543 === 'mind') {
                    self.showPasteSockets(clipboard.type);
                } else {
                    if (_selectValue_543 === 'free') {
                        pasteFree(self, clipboard);
                    }
                }
            }
        }
    }
    function DrakonCanvas_showPasteSockets(type) {
        var showInsert;
        tracing.trace('DrakonCanvas.showPasteSockets', type);
        if (!isReadonly(self)) {
            clearSockets(self.visuals);
            if (type) {
                deselectAll(self);
                if (type === 'case') {
                    showInsert = function (visuals, node) {
                        showCaseSockets(visuals, node, 'paste');
                    };
                    forType(self.visuals, 'case', showInsert);
                } else {
                    if (type === 'branch') {
                        showAllBranchSockets(self.visuals, 'paste');
                    } else {
                        if (type === 'block') {
                            showBlockInsertSockets(self.visuals, 'paste', type);
                        } else {
                            if (type === 'duration') {
                                showDurationSockets(self.visuals, 'paste');
                            } else {
                                if (type === 'mind' && isMind(self)) {
                                    showMindInsertSockets(self, 'paste', undefined);
                                }
                            }
                        }
                    }
                }
            }
            paint(self);
        }
    }
    function DrakonCanvas_swapYesNo(id) {
        var change, node;
        tracing.trace('swapYesNo', id);
        checkNotReadonly(self);
        node = getNode(self.visuals, id);
        change = {
            id: id,
            fields: {},
            op: 'update'
        };
        if (node.flag1) {
            change.fields.flag1 = 0;
        } else {
            change.fields.flag1 = 1;
        }
        return updateAndKeepSelection(self, [change]);
    }
    function DrakonCanvas_toggleSilhouette() {
        var edits;
        tracing.trace('DrakonCanvas.toggleSilhouette');
        if (!isReadonly(self)) {
            if (isSilhouette(self.visuals)) {
                edits = toPrimitive(self);
            } else {
                edits = toSilhouette(self);
            }
            return doEdit(self, edits);
        }
    }
    async function DrakonCanvas_undo() {
        var selection;
        tracing.trace('DrakonCanvas.undo');
        if (!isReadonly(self) && self.edit) {
            selection = self.edit.undoEdit();
            if (selection) {
                await loadImages(self);
                onUndoRedo(self, selection);
            }
        }
    }
    self.arrowDown = DrakonCanvas_arrowDown;
    self.arrowLeft = DrakonCanvas_arrowLeft;
    self.arrowRight = DrakonCanvas_arrowRight;
    self.arrowUp = DrakonCanvas_arrowUp;
    self.copySelection = DrakonCanvas_copySelection;
    self.cutSelection = DrakonCanvas_cutSelection;
    self.deleteSelection = DrakonCanvas_deleteSelection;
    self.editContent = DrakonCanvas_editContent;
    self.exportCanvas = DrakonCanvas_exportCanvas;
    self.exportJson = DrakonCanvas_exportJson;
    self.exportToContext = DrakonCanvas_exportToContext;
    self.getDiagramBox = DrakonCanvas_getDiagramBox;
    self.getDiagramProperties = DrakonCanvas_getDiagramProperties;
    self.getLoadedImages = DrakonCanvas_getLoadedImages;
    self.getVersion = DrakonCanvas_getVersion;
    self.getZoom = DrakonCanvas_getZoom;
    self.goHome = DrakonCanvas_goHome;
    self.init = DrakonCanvas_init;
    self.insertFree = DrakonCanvas_insertFree;
    self.isReadonly = DrakonCanvas_isReadonly;
    self.onChange = DrakonCanvas_onChange;
    self.onContextMenu = DrakonCanvas_onContextMenu;
    self.onMouseDown = DrakonCanvas_onMouseDown;
    self.onMouseLeave = DrakonCanvas_onMouseLeave;
    self.onMouseMove = DrakonCanvas_onMouseMove;
    self.onMouseUp = DrakonCanvas_onMouseUp;
    self.onTouchEnd = DrakonCanvas_onTouchEnd;
    self.onTouchMove = DrakonCanvas_onTouchMove;
    self.onTouchStart = DrakonCanvas_onTouchStart;
    self.patchDiagramStyle = DrakonCanvas_patchDiagramStyle;
    self.redo = DrakonCanvas_redo;
    self.redraw = DrakonCanvas_redraw;
    self.render = DrakonCanvas_render;
    self.setAux2 = DrakonCanvas_setAux2;
    self.setContent = DrakonCanvas_setContent;
    self.setDiagram = DrakonCanvas_setDiagram;
    self.setDiagramProperty = DrakonCanvas_setDiagramProperty;
    self.setDiagramStyle = DrakonCanvas_setDiagramStyle;
    self.setImage = DrakonCanvas_setImage;
    self.setLink = DrakonCanvas_setLink;
    self.setSecondary = DrakonCanvas_setSecondary;
    self.setStyle = DrakonCanvas_setStyle;
    self.setZoom = DrakonCanvas_setZoom;
    self.showInsertionSockets = DrakonCanvas_showInsertionSockets;
    self.showItem = DrakonCanvas_showItem;
    self.showPaste = DrakonCanvas_showPaste;
    self.showPasteSockets = DrakonCanvas_showPasteSockets;
    self.swapYesNo = DrakonCanvas_swapYesNo;
    self.toggleSilhouette = DrakonCanvas_toggleSilhouette;
    self.undo = DrakonCanvas_undo;
    return self;
}
function main() {
}
function Ears_create(widget, element) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'Ears',
        _busy: true,
        state: 'created'
    };
    function* Ears_main() {
        var _branch_, _eventType_, _event_, box, config, dx, dy, ear, evt, left, role, startBoxLeft, startBoxTop, startX, startY, top, zoom;
        _branch_ = 'Create boxes';
        while (true) {
            switch (_branch_) {
            case 'Create boxes':
                zoom = widget.zoomFactor;
                config = widget.visuals.config;
                me.element = element;
                setupEarBoxes(me, element, config.socketTouchRadius);
                _branch_ = 'Idle';
                break;
            case 'Idle':
                me.state = '28';
                me._busy = false;
                _event_ = yield;
                ear = _event_[1];
                evt = _event_[2];
                me.selected = ear;
                box = me.boxes[ear];
                startX = evt.clientX;
                startY = evt.clientY;
                startBoxLeft = box.left;
                startBoxTop = box.top;
                _branch_ = 'Dragging';
                break;
            case 'Dragging':
                me.state = '10';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onDrag') {
                    evt = _event_[1];
                    dx = snapUp(config, evt.clientX - startX);
                    dy = snapUp(config, evt.clientY - startY);
                    left = startBoxLeft + dx / zoom;
                    top = startBoxTop + dy / zoom;
                    if (!(left === box.left && top === box.top)) {
                        box.left = left;
                        box.top = top;
                        recalculateEarsVisuals(widget, evt, me);
                        paintLater(widget);
                    }
                    _branch_ = 'Dragging';
                } else {
                    if (_eventType_ !== 'complete') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    if (me.target) {
                        role = getEarRole(me);
                        createConnection(widget, element.id, me.target.id, role);
                    } else {
                        setupEarBoxes(me, element, config.socketTouchRadius);
                        widget.redraw();
                    }
                    _branch_ = 'Idle';
                }
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function Ears_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = Ears_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = Ears_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onDrag = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
            _args_ = [];
            _args_.push('onDrag');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.complete = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
            _args_ = [];
            _args_.push('complete');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.start = function (ear, evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '28':
            _args_ = [];
            _args_.push('start');
            _args_.push(ear);
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function InnerCrawler_create(visuals, sub) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'InnerCrawler',
        _busy: true,
        state: 'created'
    };
    function* InnerCrawler_main() {
        var _branch_, _eventType_, _event_, caseNode, edge, left, output, tail;
        _branch_ = 'Init';
        while (true) {
            switch (_branch_) {
            case 'Init':
                me.sub = sub;
                me.visuals = visuals;
                me.side = 'inner';
                me.plan = [];
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'down') {
                    _branch_ = 'down';
                } else {
                    if (_eventType_ !== 'right') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    _branch_ = 'right';
                }
                break;
            case 'down':
                me.state = '13';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                tail = edge.tail;
                if (tail.down) {
                    addInnerEdgeToSub(sub, edge);
                    if (tail.subtype === 'parbegin') {
                        output.next = skipParBlock(tail);
                        _branch_ = 'down';
                    } else {
                        if (tail.type === 'select') {
                            caseNode = getDown(getDown(tail));
                            output.next = caseNode.down;
                            _branch_ = 'down';
                        } else {
                            if (tail.type !== 'address' && (!tail.left || tail.left.role === 'duration')) {
                                output.next = tail.down;
                                _branch_ = 'down';
                            } else {
                                output.next = undefined;
                                _branch_ = 'Exit';
                            }
                        }
                    }
                } else {
                    if (tail.left) {
                        left = getLeft(tail);
                        if (left.type === 'question') {
                            addInnerEdgeToSub(sub, edge);
                            output.next = undefined;
                            _branch_ = 'Exit';
                        } else {
                            if (edge.role === 'up') {
                                addInnerEdgeToSub(sub, edge);
                            }
                            output.next = tail.left;
                            _branch_ = 'left';
                        }
                    } else {
                        addInnerEdgeToSub(sub, edge);
                        output.next = undefined;
                        _branch_ = 'Exit';
                    }
                }
                break;
            case 'left':
                me.state = '42';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                addInnerEdgeToSub(sub, edge);
                output.next = undefined;
                _branch_ = 'Exit';
                break;
            case 'right':
                me.state = '43';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                tail = edge.tail;
                if (tail.right) {
                    output.next = tail.right;
                    _branch_ = 'right';
                } else {
                    output.next = tail.down;
                    _branch_ = 'down';
                }
                break;
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function InnerCrawler_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = InnerCrawler_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = InnerCrawler_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.down = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('down');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.right = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('right');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onEdge = function (edge, output) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '13':
        case '42':
        case '43':
            _args_ = [];
            _args_.push('onEdge');
            _args_.push(edge);
            _args_.push(output);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function MarkDown_create(target) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'MarkDown',
        _busy: true,
        state: 'created'
    };
    function* MarkDown_main() {
        var _branch_, _eventType_, _event_, ch;
        _branch_ = 'Normal';
        while (true) {
            switch (_branch_) {
            case 'Normal':
                me.state = '19';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'under') {
                    _branch_ = 'Under';
                } else {
                    if (_eventType_ === 'next') {
                        ch = _event_[1];
                        target.next(ch);
                    } else {
                        if (_eventType_ === 'white') {
                            target.white();
                        } else {
                            if (_eventType_ !== 'line') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            target.line();
                        }
                    }
                    _branch_ = 'Normal';
                }
                break;
            case 'Under':
                me.state = '29';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'under') {
                    _branch_ = 'Under2';
                } else {
                    if (_eventType_ === 'next') {
                        ch = _event_[1];
                        target.em();
                        target.next(ch);
                        _branch_ = 'Em';
                    } else {
                        if (_eventType_ === 'white') {
                            target.next('_');
                            target.white();
                        } else {
                            if (_eventType_ !== 'line') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            target.next('_');
                            target.line();
                        }
                        _branch_ = 'Normal';
                    }
                }
                break;
            case 'Under2':
                me.state = '39';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'under') {
                    target.next('_');
                    _branch_ = 'Normal';
                } else {
                    if (_eventType_ === 'next') {
                        ch = _event_[1];
                        target.strong();
                        target.next(ch);
                        _branch_ = 'Strong';
                    } else {
                        if (_eventType_ === 'white') {
                            target.next('__');
                            target.white();
                        } else {
                            if (_eventType_ !== 'line') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            target.next('__');
                            target.line();
                        }
                        _branch_ = 'Normal';
                    }
                }
                break;
            case 'Strong':
                me.state = '48';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'under') {
                    _branch_ = 'After strong under';
                } else {
                    if (_eventType_ === 'next') {
                        ch = _event_[1];
                        target.next(ch);
                        _branch_ = 'Strong';
                    } else {
                        if (_eventType_ === 'white') {
                            target.white();
                            _branch_ = 'Strong';
                        } else {
                            if (_eventType_ !== 'line') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            target.line();
                            _branch_ = 'Normal';
                        }
                    }
                }
                break;
            case 'Em':
                me.state = '57';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'under') {
                    target.end();
                    _branch_ = 'Normal';
                } else {
                    if (_eventType_ === 'next') {
                        ch = _event_[1];
                        target.next(ch);
                        _branch_ = 'Em';
                    } else {
                        if (_eventType_ === 'white') {
                            target.white();
                            _branch_ = 'Em';
                        } else {
                            if (_eventType_ !== 'line') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            target.line();
                            _branch_ = 'Normal';
                        }
                    }
                }
                break;
            case 'After strong under':
                me.state = '66';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'under') {
                    target.end();
                    _branch_ = 'Normal';
                } else {
                    if (_eventType_ === 'next') {
                        ch = _event_[1];
                        target.next('_');
                        target.next(ch);
                        _branch_ = 'Strong';
                    } else {
                        if (_eventType_ === 'white') {
                            target.next('_');
                            target.white();
                            _branch_ = 'Strong';
                        } else {
                            if (_eventType_ !== 'line') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            target.next('_');
                            target.line();
                            _branch_ = 'Normal';
                        }
                    }
                }
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function MarkDown_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = MarkDown_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = MarkDown_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.under = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
        case '29':
        case '39':
        case '48':
        case '57':
        case '66':
            _args_ = [];
            _args_.push('under');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.next = function (ch) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
        case '29':
        case '39':
        case '48':
        case '57':
        case '66':
            _args_ = [];
            _args_.push('next');
            _args_.push(ch);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.white = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
        case '29':
        case '39':
        case '48':
        case '57':
        case '66':
            _args_ = [];
            _args_.push('white');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.line = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '19':
        case '29':
        case '39':
        case '48':
        case '57':
        case '66':
            _args_ = [];
            _args_.push('line');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function NoSelectBehavior_create(widget) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'NoSelectBehavior',
        _busy: true,
        state: 'created'
    };
    function* NoSelectBehavior_main() {
        var _branch_, _eventType_, _event_, dragTarget, evt, pos, scroll, scroller;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '16';
                me._busy = false;
                _event_ = yield;
                evt = _event_[1];
                pos = toDiagram(widget, evt);
                scroll = hitScrollBar(widget.visuals, pos);
                if (scroll) {
                    if (scroll.elType === 'hscroll') {
                        dragTarget = createHScrollDrag(widget, evt, scroll);
                    } else {
                        dragTarget = createVScrollDrag(widget, evt, scroll);
                    }
                    _branch_ = 'Drag';
                } else {
                    scroller = createMouseScroll(widget, evt);
                    _branch_ = 'Scroll';
                }
                break;
            case 'Scroll':
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    onMouseScroll(scroller, widget, evt);
                    _branch_ = 'Scroll';
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    _branch_ = 'Idle';
                }
                break;
            case 'Drag':
                me.state = '31';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    dragTarget.onDrag(evt);
                    _branch_ = 'Drag';
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    tracing.trace('drag complete');
                    dragTarget.complete();
                    _branch_ = 'Idle';
                }
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function NoSelectBehavior_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = NoSelectBehavior_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = NoSelectBehavior_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.mouseMove = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '31':
            _args_ = [];
            _args_.push('mouseMove');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.mouseUp = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '31':
            _args_ = [];
            _args_.push('mouseUp');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.mouseLeave = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '31':
            _args_ = [];
            _args_.push('mouseLeave');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.mouseDown = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '16':
            _args_ = [];
            _args_.push('mouseDown');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function OuterCrawler_create(visuals, sub) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'OuterCrawler',
        _busy: true,
        state: 'created'
    };
    function* OuterCrawler_main() {
        var _branch_, _event_, _selectValue_393, edge, head, leftMost, next, output, tail;
        _branch_ = 'Init';
        while (true) {
            switch (_branch_) {
            case 'Init':
                me.sub = sub;
                me.visuals = visuals;
                me.side = 'outer';
                me.plan = [];
                _branch_ = 'down';
                break;
            case 'down':
                me.state = '10';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                addArrowPad(sub, edge);
                tail = edge.tail;
                if (tail.subtype === 'parbegin') {
                    addEdgeToSub(sub, edge);
                    next = crawlParallel(visuals, tail);
                    output.next = next.down;
                    _branch_ = 'down';
                } else {
                    if (tail.type === 'select') {
                        addEdgeToSub(sub, edge);
                        next = crawlSelect(visuals, tail);
                        output.next = next.down;
                        _branch_ = 'down';
                    } else {
                        if (tail.right) {
                            _selectValue_393 = tail.type;
                            if (_selectValue_393 === 'arrow-loop') {
                                addEdgeToSub(sub, edge);
                                planSpace(me, tail);
                                output.next = tail.right;
                                _branch_ = 'rightLoop';
                            } else {
                                if (_selectValue_393 === 'question') {
                                    addEdgeToSub(sub, edge);
                                    planSpace(me, tail);
                                    output.next = tail.right;
                                    _branch_ = 'right';
                                } else {
                                    leftMost = goLeft(tail);
                                    if (leftMost.subtype === 'parend') {
                                        markParFloor(me, tail);
                                    }
                                    output.next = undefined;
                                    _branch_ = 'Exit';
                                }
                            }
                        } else {
                            if (tail.down) {
                                addEdgeToSub(sub, edge);
                                if (tail.type === 'address') {
                                    markFloor(me, tail);
                                    output.next = undefined;
                                    _branch_ = 'Exit';
                                } else {
                                    output.next = tail.down;
                                    _branch_ = 'down';
                                }
                            } else {
                                addEdgeToSub(sub, edge);
                                if (hasLeft(tail)) {
                                    addLowerCorner(sub, tail);
                                    leftMost = goLeft(tail);
                                    if (leftMost.subtype === 'parend') {
                                        output.next = undefined;
                                        _branch_ = 'Exit';
                                    } else {
                                        output.next = tail.left;
                                        _branch_ = 'left';
                                    }
                                } else {
                                    output.next = undefined;
                                    _branch_ = 'Exit';
                                }
                            }
                        }
                    }
                }
                break;
            case 'rightLoop':
                me.state = '40';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                output.next = edge.tail.down;
                _branch_ = 'downLoop';
                break;
            case 'downLoop':
                me.state = '42';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                tail = edge.tail;
                if (tail.down) {
                    output.next = tail.down;
                    _branch_ = 'downLoop';
                } else {
                    output.next = tail.left;
                    _branch_ = 'leftLoop';
                }
                break;
            case 'leftLoop':
                me.state = '47';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                head = edge.head;
                if (hasLeft(head)) {
                    output.next = head.left;
                    _branch_ = 'leftLoop';
                } else {
                    if (head.down) {
                        head.zoned = true;
                        edge.inner = sub;
                        output.next = head.down;
                    } else {
                        output.next = markInnerSide(me, head);
                    }
                    _branch_ = 'down';
                }
                break;
            case 'right':
                me.state = '55';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                tail = edge.tail;
                if (tail.up) {
                    output.next = undefined;
                    _branch_ = 'Exit';
                } else {
                    addUpperCorner(sub, tail);
                    output.next = tail.down;
                    _branch_ = 'down';
                }
                break;
            case 'left':
                me.state = '61';
                me._busy = false;
                _event_ = yield;
                edge = _event_[1];
                output = _event_[2];
                head = edge.head;
                if (head.down) {
                    output.next = head.down;
                    _branch_ = 'down';
                } else {
                    output.next = head.left;
                    _branch_ = 'left';
                }
                break;
            case 'Exit':
                _branch_ = undefined;
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function OuterCrawler_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = OuterCrawler_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = OuterCrawler_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onEdge = function (edge, output) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
        case '40':
        case '42':
        case '47':
        case '55':
        case '61':
            _args_ = [];
            _args_.push('onEdge');
            _args_.push(edge);
            _args_.push(output);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function SelectBehavior_create(widget) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'SelectBehavior',
        _busy: true,
        state: 'created'
    };
    function* SelectBehavior_main() {
        var _branch_, _eventType_, _event_, _selectValue_102, currentSocket, cursor, deltaX, deltaY, dragTarget, ear, evt, pos, prim, scroller, startX, startY;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '59';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseDown') {
                    evt = _event_[1];
                    clearMouseHover(widget);
                    _selectValue_102 = evt.button;
                    if (_selectValue_102 === 0) {
                        if (evt.ctrlKey) {
                            pos = toDiagram(widget, evt);
                            handleRightClick(widget, pos, evt);
                            _branch_ = 'Idle';
                        } else {
                            startX = evt.clientX;
                            startY = evt.clientY;
                            pos = toDiagram(widget, evt);
                            widget.visuals.currentSocket = findSocket(widget.visuals, pos.x, pos.y);
                            if (widget.visuals.currentSocket) {
                                tracing.trace('found socket', widget.visuals.currentSocket);
                                widget.visuals.onSocket = true;
                                setCursor(evt.target, 'pointer');
                                paint(widget);
                                _branch_ = 'OnSocket';
                            } else {
                                _branch_ = 'Choose';
                            }
                        }
                    } else {
                        if (_selectValue_102 === 1) {
                            scroller = createMouseScroll(widget, evt);
                            _branch_ = 'Scroll';
                        } else {
                            if (_selectValue_102 === 2) {
                                pos = toDiagram(widget, evt);
                                handleRightClick(widget, pos, evt);
                            }
                            _branch_ = 'Idle';
                        }
                    }
                } else {
                    if (_eventType_ === 'mouseMove') {
                        evt = _event_[1];
                        trackMouseHover(widget, evt);
                        pos = toDiagram(widget, evt);
                        currentSocket = findSocket(widget.visuals, pos.x, pos.y);
                        if (currentSocket) {
                            prim = { primId: 'socket-' + currentSocket };
                            updateHighlight(widget, prim);
                            setCursor(evt.target, 'pointer');
                        } else {
                            ear = hitEars(widget.visuals, pos);
                            if (ear) {
                                prim = { primId: ear };
                                updateHighlight(widget, prim);
                                setCursor(evt.target, 'grab');
                            } else {
                                prim = findVisualItem(widget, pos);
                                updateHighlight(widget, prim);
                                if (prim) {
                                    cursor = getCursorForItem(widget, prim, pos, evt);
                                    setCursor(evt.target, cursor);
                                } else {
                                    setCursor(evt.target, 'default');
                                }
                            }
                        }
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                        clearMouseHover(widget);
                        updateHighlight(widget, undefined);
                        setCursor(evt.target, 'default');
                    }
                }
                break;
            case 'OnSocket':
                me.state = '73';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    pos = toDiagram(widget, evt);
                    currentSocket = findSocket(widget.visuals, pos.x, pos.y);
                    if (currentSocket === widget.visuals.currentSocket) {
                        _branch_ = 'OnSocket';
                    } else {
                        widget.visuals.onSocket = false;
                        paintLater(widget);
                        _branch_ = 'OffSocket';
                    }
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    runCurrentSocket(widget);
                    _branch_ = 'Idle';
                }
                break;
            case 'OffSocket':
                me.state = '82';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    pos = toDiagram(widget, evt);
                    currentSocket = findSocket(widget.visuals, pos.x, pos.y);
                    if (currentSocket === widget.visuals.currentSocket) {
                        widget.visuals.onSocket = true;
                        paintLater(widget);
                        _branch_ = 'OnSocket';
                    } else {
                        _branch_ = 'OffSocket';
                    }
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    _branch_ = 'Idle';
                }
                break;
            case 'Scroll':
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    onMouseScroll(scroller, widget, evt);
                    _branch_ = 'Scroll';
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    _branch_ = 'Idle';
                }
                break;
            case 'Choose':
                me.state = '31';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    deltaX = evt.clientX - startX;
                    deltaY = evt.clientY - startY;
                    if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                        tracing.trace('drag start');
                        clearSockets(widget.visuals);
                        dragTarget = chooseDragTarget(widget, evt);
                        _branch_ = 'Drag';
                    } else {
                        _branch_ = 'Choose';
                    }
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                        pos = toDiagram(widget, evt);
                        if (evt.source === 'touch') {
                            if (widget.config.hasPopup()) {
                                widget.config.removePopups();
                                mouseClick(widget, pos, evt);
                            } else {
                                handleRightClick(widget, pos, evt);
                            }
                        } else {
                            mouseClick(widget, pos, evt);
                        }
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    _branch_ = 'Idle';
                }
                break;
            case 'Drag':
                me.state = '40';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'mouseMove') {
                    evt = _event_[1];
                    dragTarget.onDrag(evt);
                    _branch_ = 'Drag';
                } else {
                    if (_eventType_ === 'mouseUp') {
                        evt = _event_[1];
                    } else {
                        if (_eventType_ !== 'mouseLeave') {
                            throw new Error('Unexpected case value: ' + _eventType_);
                        }
                        evt = _event_[1];
                    }
                    tracing.trace('drag complete');
                    dragTarget.complete();
                    _branch_ = 'Idle';
                }
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function SelectBehavior_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = SelectBehavior_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = SelectBehavior_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.mouseMove = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '31':
        case '40':
        case '59':
        case '73':
        case '82':
            _args_ = [];
            _args_.push('mouseMove');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.mouseUp = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '31':
        case '40':
        case '73':
        case '82':
            _args_ = [];
            _args_.push('mouseUp');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.mouseLeave = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '31':
        case '40':
        case '59':
        case '73':
        case '82':
            _args_ = [];
            _args_.push('mouseLeave');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.mouseDown = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '59':
            _args_ = [];
            _args_.push('mouseDown');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function SpanBuilder_create() {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'SpanBuilder',
        _busy: true,
        state: 'created'
    };
    function* SpanBuilder_main() {
        var _branch_, _eventType_, _event_, ch, current, line, type;
        _branch_ = 'Init';
        while (true) {
            switch (_branch_) {
            case 'Init':
                current = {
                    text: '',
                    type: ''
                };
                type = '';
                line = { tokens: [] };
                me.lines = [];
                _branch_ = 'New line';
                break;
            case 'New line':
                me.state = '12';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'next') {
                    ch = _event_[1];
                    if (ch === '-') {
                        current.text += '\u2022';
                    } else {
                        current.text += ch;
                    }
                    _branch_ = 'Token';
                } else {
                    if (_eventType_ === 'white') {
                        _branch_ = 'New line';
                    } else {
                        if (_eventType_ === 'line') {
                            _branch_ = 'New line';
                        } else {
                            if (_eventType_ === 'em') {
                                type = 'em';
                                current = endToken(current, line, type);
                            } else {
                                if (_eventType_ !== 'strong') {
                                    throw new Error('Unexpected case value: ' + _eventType_);
                                }
                                type = 'strong';
                                current = endToken(current, line, type);
                            }
                            _branch_ = 'Token';
                        }
                    }
                }
                break;
            case 'Idle':
                me.state = '30';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'next') {
                    ch = _event_[1];
                    current.text += ch;
                    _branch_ = 'Token';
                } else {
                    if (_eventType_ === 'white') {
                        _branch_ = 'Space';
                    } else {
                        if (_eventType_ === 'line') {
                            type = '';
                            line = endLine(line, me.lines);
                            _branch_ = 'New line';
                        } else {
                            if (_eventType_ === 'end') {
                                type = '';
                                current = endToken(current, line, type);
                                _branch_ = 'Idle';
                            } else {
                                if (_eventType_ === 'em') {
                                    type = 'em';
                                    current = endToken(current, line, type);
                                } else {
                                    if (_eventType_ !== 'strong') {
                                        throw new Error('Unexpected case value: ' + _eventType_);
                                    }
                                    type = 'strong';
                                    current = endToken(current, line, type);
                                }
                                _branch_ = 'Token';
                            }
                        }
                    }
                }
                break;
            case 'Space':
                me.state = '39';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'next') {
                    ch = _event_[1];
                    pushSpace(line);
                    current.text += ch;
                    _branch_ = 'Token';
                } else {
                    if (_eventType_ === 'white') {
                        _branch_ = 'Space';
                    } else {
                        if (_eventType_ === 'line') {
                            type = '';
                            line = endLine(line, me.lines);
                            _branch_ = 'New line';
                        } else {
                            if (_eventType_ === 'end') {
                                type = '';
                                current = endToken(current, line, type);
                                _branch_ = 'Idle';
                            } else {
                                if (_eventType_ === 'em') {
                                    pushSpace(line);
                                    type = 'em';
                                    current = endToken(current, line, type);
                                } else {
                                    if (_eventType_ !== 'strong') {
                                        throw new Error('Unexpected case value: ' + _eventType_);
                                    }
                                    pushSpace(line);
                                    type = 'strong';
                                    current = endToken(current, line, type);
                                }
                                _branch_ = 'Token';
                            }
                        }
                    }
                }
                break;
            case 'Token':
                me.state = '49';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'next') {
                    ch = _event_[1];
                    current.text += ch;
                    _branch_ = 'Token';
                } else {
                    if (_eventType_ === 'white') {
                        current = endToken(current, line, type);
                        _branch_ = 'Space';
                    } else {
                        if (_eventType_ === 'line') {
                            current = endToken(current, line, type);
                            type = '';
                            line = endLine(line, me.lines);
                            _branch_ = 'New line';
                        } else {
                            if (_eventType_ === 'end') {
                                type = '';
                                current = endToken(current, line, type);
                                _branch_ = 'Idle';
                            } else {
                                if (_eventType_ === 'em') {
                                    type = 'em';
                                    current = endToken(current, line, type);
                                } else {
                                    if (_eventType_ !== 'strong') {
                                        throw new Error('Unexpected case value: ' + _eventType_);
                                    }
                                    type = 'strong';
                                    current = endToken(current, line, type);
                                }
                                _branch_ = 'Token';
                            }
                        }
                    }
                }
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function SpanBuilder_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = SpanBuilder_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = SpanBuilder_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.next = function (ch) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
        case '30':
        case '39':
        case '49':
            _args_ = [];
            _args_.push('next');
            _args_.push(ch);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.white = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
        case '30':
        case '39':
        case '49':
            _args_ = [];
            _args_.push('white');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.line = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
        case '30':
        case '39':
        case '49':
            _args_ = [];
            _args_.push('line');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.em = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
        case '30':
        case '39':
        case '49':
            _args_ = [];
            _args_.push('em');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.strong = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '12':
        case '30':
        case '39':
        case '49':
            _args_ = [];
            _args_.push('strong');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.end = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '30':
        case '39':
        case '49':
            _args_ = [];
            _args_.push('end');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function TouchBehavior_create(widget) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'TouchBehavior',
        _busy: true,
        state: 'created'
    };
    function* TouchBehavior_main() {
        var _branch_, _eventType_, _event_, dir, evt, evt2, pos, prim, scroller, startX, startX2, startY, startY2, timer, x, y, zoomer;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '10';
                me._busy = false;
                _event_ = yield;
                evt = _event_[1];
                startX = evt.touches[0].clientX;
                startY = evt.touches[0].clientY;
                evt2 = buildMouseEvent(startX, startY, 0, evt.target);
                scroller = createMouseScroll(widget, evt2);
                x = startX;
                y = startY;
                if (evt.touches.length >= 2) {
                    startX2 = evt.touches[1].clientX;
                    startY2 = evt.touches[1].clientY;
                    _branch_ = 'Zoom or scroll?';
                } else {
                    timer = setTimeout(me.decideOneTimeout, 500);
                    _branch_ = 'One or two or long press?';
                }
                break;
            case 'One or two or long press?':
                me.state = '20';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'touchStart') {
                    evt = _event_[1];
                    clearTimeout(timer);
                    startX2 = evt.touches[1].clientX;
                    startY2 = evt.touches[1].clientY;
                    _branch_ = 'Zoom or scroll?';
                } else {
                    if (_eventType_ === 'decideOneTimeout') {
                        evt = buildMouseEvent(startX, startY, 0, undefined);
                        pos = toDiagram(widget, evt);
                        prim = findVisualItem(widget, pos);
                        if (prim) {
                            ensureSelectedOne(widget, prim);
                            doubleClick(widget, prim, pos, evt);
                        } else {
                            deselectAll(widget);
                        }
                        paint(widget);
                        _branch_ = 'Idle';
                    } else {
                        if (_eventType_ === 'touchMove') {
                            evt = _event_[1];
                            x = evt.touches[0].clientX;
                            y = evt.touches[0].clientY;
                            if (wantedMove(startX, startY, x, y)) {
                                clearTimeout(timer);
                                widget.mouseEvents.mouseDown(buildMouseEvent(startX, startY, 0, evt.target));
                                widget.mouseEvents.mouseMove(makeMouseEventFromTouch(evt, 0));
                                _branch_ = 'One';
                            } else {
                                _branch_ = 'One or two or long press?';
                            }
                        } else {
                            if (_eventType_ !== 'touchEnd') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            evt = _event_[1];
                            clearTimeout(timer);
                            widget.config.removePopups();
                            widget.mouseEvents.mouseDown(buildMouseEvent(startX, startY, 0, evt.target));
                            widget.mouseEvents.mouseUp(buildMouseEvent(startX, startY, 0, evt.target));
                            _branch_ = 'Idle';
                        }
                    }
                }
                break;
            case 'Zoom or scroll?':
                me.state = '75';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'touchMove') {
                    evt = _event_[1];
                    dir = isZoom(startX, startY, startX2, startY2, evt);
                    if (dir === 'zoom') {
                        zoomer = createZoomer(widget, startX, startY, startX2, startY2);
                        _branch_ = 'Zoom';
                    } else {
                        if (dir === 'scroll') {
                            _branch_ = 'Scroll';
                        } else {
                            _branch_ = 'Zoom or scroll?';
                        }
                    }
                } else {
                    if (_eventType_ !== 'touchEnd') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    evt = _event_[1];
                    _branch_ = 'Idle';
                }
                break;
            case 'Zoom':
                me.state = '85';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'touchMove') {
                    evt = _event_[1];
                    onTouchZoom(zoomer, widget, evt);
                    _branch_ = 'Zoom';
                } else {
                    if (_eventType_ !== 'touchEnd') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    evt = _event_[1];
                    onTouchZoomEnd(widget);
                    _branch_ = 'Idle';
                }
                break;
            case 'Scroll':
                me.state = '88';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'touchMove') {
                    evt = _event_[1];
                    evt2 = makeMouseEventFromTouch(evt, 0);
                    onMouseScroll(scroller, widget, evt2);
                    _branch_ = 'Scroll';
                } else {
                    if (_eventType_ !== 'touchEnd') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    evt = _event_[1];
                    _branch_ = 'Idle';
                }
                break;
            case 'One':
                me.state = '27';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'touchMove') {
                    evt = _event_[1];
                    x = evt.touches[0].clientX;
                    y = evt.touches[0].clientY;
                    widget.mouseEvents.mouseMove(makeMouseEventFromTouch(evt, 0));
                    _branch_ = 'One';
                } else {
                    if (_eventType_ !== 'touchEnd') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    evt = _event_[1];
                    widget.mouseEvents.mouseUp(buildMouseEvent(x, y, 0, evt.target));
                    _branch_ = 'Idle';
                }
                break;
            default:
                return;
            }
        }
        _topResolve_();
    }
    function TouchBehavior_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = TouchBehavior_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = TouchBehavior_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.touchStart = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '10':
        case '20':
            _args_ = [];
            _args_.push('touchStart');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.decideOneTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '20':
            _args_ = [];
            _args_.push('decideOneTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.touchMove = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '20':
        case '27':
        case '75':
        case '85':
        case '88':
            _args_ = [];
            _args_.push('touchMove');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.touchEnd = function (evt) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '20':
        case '27':
        case '75':
        case '85':
        case '88':
            _args_ = [];
            _args_.push('touchEnd');
            _args_.push(evt);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function loadImage_create(image) {
    var _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'loadImage',
        _busy: true,
        state: 'created'
    };
    function* loadImage_main() {
        var _event_, imageObj;
        imageObj = new Image();
        imageObj.onload = me.imageLoaded;
        imageObj.src = image.content;
        me.state = '5';
        me._busy = false;
        _event_ = yield;
        image.imageObj = imageObj;
        _topResolve_();
    }
    function loadImage_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = loadImage_main();
        _topGen_.next();
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = loadImage_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.imageLoaded = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '5':
            _args_ = [];
            _args_.push('imageLoaded');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
unit.cssFontToString = cssFontToString;
unit.parseCssFont = parseCssFont;
unit.addHtmltoDom = addHtmltoDom;
unit.createDummyCanvas = createDummyCanvas;
unit.createTextBlock = createTextBlock;
unit.flowTextBlock = flowTextBlock;
unit.renderFlowBlock = renderFlowBlock;
unit.LeftDrakonResizeHandle = LeftDrakonResizeHandle;
unit.RightDrakonResizeHandle = RightDrakonResizeHandle;
unit.GroupBottomHandle = GroupBottomHandle;
unit.GroupTopHandle = GroupTopHandle;
unit.HScrollDrag = HScrollDrag;
unit.VScrollDrag = VScrollDrag;
unit.FrameDrag = FrameDrag;
unit.FreeMover = FreeMover;
unit.HandleDrag = HandleDrag;
unit.CalloutPointer = CalloutPointer;
unit.HandleEast = HandleEast;
unit.HandleNE = HandleNE;
unit.HandleNW = HandleNW;
unit.HandleNorth = HandleNorth;
unit.HandleSE = HandleSE;
unit.HandleSW = HandleSW;
unit.HandleSouth = HandleSouth;
unit.HandleWest = HandleWest;
unit.LineEnd = LineEnd;
unit.LineStart = LineStart;
unit.RoundedRadius = RoundedRadius;
unit.RoundedRadiusLeft = RoundedRadiusLeft;
unit.VertexHandle = VertexHandle;
unit.Callout = Callout;
unit.Cloud = Cloud;
unit.Combobox = Combobox;
unit.Database = Database;
unit.Frame = Frame;
unit.FreeImage = FreeImage;
unit.GlyphIcon = GlyphIcon;
unit.GroupDuration = GroupDuration;
unit.Line = Line;
unit.Polygon = Polygon;
unit.Polyline = Polyline;
unit.PtrLeft = PtrLeft;
unit.PtrRight = PtrRight;
unit.Rectangle = Rectangle;
unit.SimpleFree = SimpleFree;
unit.Text = Text;
unit.DefaultIconCore = DefaultIconCore;
unit.LeftMindResizeHandle = LeftMindResizeHandle;
unit.RightMindResizeHandle = RightMindResizeHandle;
unit.DrakonCanvas = DrakonCanvas;
unit.main = main;
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