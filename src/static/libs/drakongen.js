(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

function htmlToString(html) {
    if (!html) return '';
    if (!html.startsWith('<') || !html.endsWith('>')) {
        return html.split("\n")
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");    

    const root = doc.body
    const output = [];

    root.childNodes.forEach((node) => {
        if (node.tagName === 'P') {
            output.push(node.textContent.trim());
        } else if (node.tagName === 'UL') {
            node.childNodes.forEach((item) => {
                if (item.tagName === 'LI') {
                    output.push(`- ${item.textContent.trim()}`);
                }
            });
        } else if (node.tagName === 'OL') {
            node.childNodes.forEach((item, index) => {
                if (item.tagName === 'LI') {
                    output.push(`${index + 1}. ${item.textContent.trim()}`);
                }
            });
        }
    });

    return output;
}

module.exports = {htmlToString}
},{}],2:[function(require,module,exports){
const {drakonToStruct} = require("./drakonToStruct");
const {printPseudo, printWithIndent, makeIndent} = require('./printPseudo');
const {addRange, sortByProperty} = require("./tools")

function drakonToPseudocode(drakonJson, name, filename, htmlToString, translate) {    
    var diagram = drakonToStruct(drakonJson, name, filename, translate, htmlToString)
    var lines = []

    lines.push("## " + translate("Procedure") + " \"" + diagram.name + "\"")
    lines.push("")
    if (diagram.params) {
        lines.push(translate("Parameters") + ":")
        addRange(lines, htmlToString(diagram.params))
        lines.push("")
    }    
    lines.push(translate("Algorithm") + ":")    
    
    if (diagram.branches.length === 0) {
        lines.push(translate("Empty"))
    } else if (diagram.branches.length === 1) {
        var first = diagram.branches[0]
        printPseudo(first, translate, lines, htmlToString)
    } else {
        var first = diagram.branches[0]
        lines.push(translate("Call subroutine") + ": \"" + htmlToString(first.name) + "\"")
        diagram.branches.forEach(branch => {
            lines.push("")
            lines.push(translate("Subroutine") + ": \"" + htmlToString(branch.name) + "\"")
            printPseudo(branch, translate, lines, htmlToString)
            lines.push(translate("End of subroutine"))
        })
    }  
    lines.push("")
    lines.push(translate("End of procedure"))
    if (diagram.description) {
        lines.push("")       
        addRange(lines, htmlToString(diagram.description))
        lines.push("")       
    }      
    var text = lines.join("\n")
    
    var str = JSON.stringify(diagram, null, 4)
    return {text:text,json:str}
}


function mindToTree(drakonJson, name, filename, htmlToString) {
    let drakonGraph;
    try {
        drakonJson = drakonJson || ""
        drakonJson = drakonJson.trim()
        drakonJson = drakonJson || "{}"
        drakonGraph = JSON.parse(drakonJson);
    } catch (error) {
        var message = translate("Error parsing JSON") + ": " + error.message
        throw createError(message, filename)
    }

    const nodes = drakonGraph.items || {};
    var root = createMindNode("## " + name)
    nodes["root"] = root
    connectMindNodesToParent(nodes)
    sortMindChildren(nodes)
    var lines = []
    printMindNode(root, 0, lines, htmlToString, true)
    lines.push("")
    var text = lines.join("\n")
    return {text:text}
}

function connectMindNodesToParent(nodes) {
    for (var id in nodes) {
        var node = nodes[id]
        if (node.parent) {
            var parent = nodes[node.parent]
            if (!parent.children) {
                parent.children = []
            }
            parent.children.push(node)
        }
    }
}

function sortMindChildren(nodes) {
    for (var id in nodes) {
        var node = nodes[id]
        if (node.children) {
            sortByProperty(node.children, "ordinal")
        }
    }
}

function printMindNode(node, depth, lines, htmlToString, first) {
    var printed = htmlToString(node.content)
    const indent = makeIndent(depth)
    printWithIndent(printed, indent, lines)
    var childDepth = depth + 1
    if (first) {
        lines.push("")
        childDepth = 0
    }
    if (node.children) {
        for (var child of node.children) {
            printMindNode(child, childDepth, lines, htmlToString, false)
        }
    }
}

function createMindNode(name) {
    return {
        "type": "idea",
        "content": "<p>" + name + "</p>",
        "parent": undefined,
        "treeType": "treeview",
        "ordinal": 0
    }
}

module.exports = { drakonToPseudocode, mindToTree };
},{"./drakonToStruct":3,"./printPseudo":6,"./tools":9}],3:[function(require,module,exports){
const { structFlow, redirectNode } = require("./structFlow");
const { createError, remove } = require("./tools");

var translate;

function drakonToStruct(
  drakonJson,
  name,
  filename,
  translateFunction,
  htmlToString,
  options,
) {
  options = options || {};
  translate = translateFunction;
  let drakonGraph;
  try {
    drakonJson = drakonJson || "";
    drakonJson = drakonJson.trim();
    drakonJson = drakonJson || "{}";
    drakonGraph = JSON.parse(drakonJson);
  } catch (error) {
    var message = translate("Error parsing JSON") + ": " + error.message;
    throw createError(message, filename);
  }

  const nodes = drakonGraph.items || {};

  var branches = [];
  var firstNodeId = findStartNode(nodes, filename, branches);

  if (!firstNodeId) {
    return {
      name: name,
      params: drakonGraph.params || "",
      description: drakonGraph.description || "",
      branches: [],
    };
  }

  handleParallel(nodes, undefined, firstNodeId, {}, undefined);
  buildTwoWayConnections(nodes, firstNodeId, htmlToString);

  rewireSelectsMarkLoops(nodes, filename);
  branches.forEach((branch) =>
    checkBranchIsReferenced(
      branch,
      firstNodeId,
      filename,
      options,
      htmlToString,
    ),
  );
  rewireShortcircuit(nodes, filename);
  branches.forEach((branch) => cutOffBranch(nodes, branch));
  var branchTrees = structFlow(nodes, branches, filename, translate);
  return {
    name: name,
    params: drakonGraph.params || "",
    description: drakonGraph.description || "",
    branches: branchTrees,
    secondary: findSecondary(branchTrees, options, htmlToString),
  };
}

function findSecondary(branchTrees, options, htmlToString) {
  if (!options || !options.secondary) {
    return undefined;
  }
  var ordinal = 0;
  for (var branch of branchTrees) {
    var name = htmlToString(branch.name)[0];
    if (name === options.secondary) {
      return ordinal;
    }
    ordinal++;
  }
  return undefined;
}

function handleParallel(nodes, prevNode, nodeId, visited, proc) {
  if (!nodeId) {
    return;
  }
  var node = nodes[nodeId];
  if (node.type === "parend") {
    if (!proc) {
      throw new Error("handleParallel: no proc for parend");
    }
    var endId = proc.end;
    var end;
    if (endId) {
      end = nodes[endId];
    } else {
      end = {
        type: "end",
        id: proc.id + "-" + proc.ordinal + "-end",
        prev: [],
      };
      nodes[end.id] = end;
      proc.end = end.id;
      proc.next = node.one;
    }
    redirectNode(nodes, prevNode, nodeId, end.id);
    return;
  }
  if (nodeId in visited) {
    return;
  }
  visited[nodeId] = true;
  if (node.type === "parbegin") {
    node.procs = [];
    var ordinal = 0;
    var current = node;
    while (true) {
      var start = {
        id: nodeId + "-" + ordinal + "-start",
        type: "action",
        prev: [],
        one: current.one,
      };
      nodes[start.id] = start;
      var childProc = {
        id: nodeId,
        ordinal: ordinal,
        start: start.id,
      };
      var next = current.two;
      node.procs.push(childProc);
      handleParallel(nodes, start, start.one, {}, childProc);
      delete current.one;
      delete current.two;
      if (!next) {
        break;
      }
      current = nodes[next];
      ordinal++;
    }
    node.one = node.procs[0].next;
    handleParallel(nodes, node, node.one, visited, proc);
  } else {
    handleParallel(nodes, node, node.one, visited, proc);
    handleParallel(nodes, node, node.two, visited, proc);
  }
}

function drakonToGraph(drakonJson, name, filename, translateFunction) {
  translate = translateFunction;
  let drakonGraph;
  try {
    drakonGraph = JSON.parse(drakonJson);
  } catch (error) {
    var message = translate("Error parsing JSON") + ": " + error.message;
    throw createError(message, filename);
  }

  const nodes = drakonGraph.items || {};

  var branches = [];
  var firstNodeId = findStartNode(nodes, filename, branches);

  if (!firstNodeId) {
    return undefined;
  }

  buildTwoWayConnections(nodes, firstNodeId);

  rewireSelectsMarkLoops(nodes, filename);
  rewireShortcircuit(nodes, filename);
  branches.forEach((branch) =>
    checkBranchIsReferenced(
      branch,
      firstNodeId,
      filename,
      undefined,
      undefined,
    ),
  );
  branches.forEach((branch) => cutOffBranch(nodes, branch));

  var branchTrees = structFlow(nodes, branches, filename, translate);

  return {
    name: name,
    params: drakonGraph.params || "",
    description: drakonGraph.description || "",
    branches: branchTrees,
  };
}

function checkBranchIsReferenced(
  branch,
  firstNodeId,
  filename,
  options,
  htmlToString,
) {
  if (branch.id === firstNodeId) {
    return;
  }
  if (options && htmlToString) {
    var branchName = htmlToString(branch.content)[0];
    if (branchName === options.secondary) {
      if (branch.prev.length > 0) {
        throw createError(
          translate("A secondary branch is referenced"),
          filename,
          branch.id,
        );
      }
    } else {
      if (branch.prev.length === 0) {
        throw createError(
          translate("A silhouette branch is not referenced"),
          filename,
          branch.id,
        );
      }
    }
  }
}

function cutOffBranch(nodes, branch) {
  var end = {
    type: "end",
    id: branch.id + "-end",
    prev: [],
  };
  nodes[end.id] = end;
  branch.next = branch.one;
  var addresses = [];
  traverseToHitBranch(nodes, branch.id, {}, (prev, node) =>
    addFakeEnd(nodes, prev, node, end, addresses),
  );
}

function traverseToHitBranch(nodes, nodeId, visited, action) {
  if (!nodeId) {
    return;
  }
  if (nodeId in visited) {
    return;
  }
  visited[nodeId] = true;
  var node = nodes[nodeId];
  if (!node) {
    return;
  }
  if (node.one) {
    var one = nodes[node.one];
    if (one.type === "branch") {
      action(node, one);
    } else {
      traverseToHitBranch(nodes, node.one, visited, action);
    }
  }
  if (node.two) {
    var two = nodes[node.two];
    if (two.type === "branch") {
      action(node, two);
    } else {
      traverseToHitBranch(nodes, node.two, visited, action);
    }
  }
}

var idCounter = 1000;
function addFakeEnd(nodes, prev, node, end, addresses) {
  var lastAddress = undefined;
  if (addresses.length > 0) {
    lastAddress = addresses[addresses.length - 1];
  }
  var address;
  if (lastAddress && lastAddress.branch === node.id) {
    address = lastAddress;
  } else {
    address = {
      type: "address",
      content: node.content,
      id: "ad-" + idCounter,
      branch: node.id,
      one: end.id,
      prev: [],
    };
    idCounter++;
    nodes[address.id] = address;
    end.prev.push(address.id);
    addresses.push(address);
    node.prev.push(address.id);
  }
  redirectNode(nodes, prev, node.id, address.id);
  address.prev.push(prev.id);
  node.prev = remove(node.prev, prev.id);
}

function buildTwoWayConnections(nodes, firstNodeId, htmlToString) {
  for (var id in nodes) {
    var node = nodes[id];
    node.id = id;
    node.prev = [];
  }

  var visitor = function (nodes, node) {
    return connectBack(nodes, node, htmlToString);
  };

  traverse(nodes, firstNodeId, {}, visitor);
}

function findStartNode(nodes, filename, branches) {
  var firstNodeId = undefined;
  var minBranchId = 10000;
  for (var id in nodes) {
    var node = nodes[id];
    if (node.type === "branch") {
      if (node.branchId < minBranchId) {
        firstNodeId = id;
        minBranchId = node.branchId;
      }
      branches.push(node);
    } else if (node.type === "select") {
      if (!node.content) {
        throw createError(
          translate("A Select icon must have content"),
          filename,
          id,
        );
      }
      node.cases = [];
    } else if (node.type === "loopbegin") {
      if (!node.content) {
        throw createError(
          translate("A Loop begin icon must have content"),
          filename,
          id,
        );
      }
    } else if (node.type === "question") {
      if (!node.content) {
        throw createError(
          translate("A Question icon must have content"),
          filename,
          id,
        );
      }
    }
  }

  return firstNodeId;
}

function rewireSelectsMarkLoops(nodes, filename) {
  for (var id of Object.keys(nodes)) {
    var node = nodes[id];
    if (!node) {
      continue;
    }
    if (node.type === "select") {
      rewireSelect(nodes, node, filename);
    } else if (node.type === "loopbegin") {
      markLoopBody(nodes, node, filename);
    }
  }
}

function rewireSelect(nodes, selectNode, filename) {
  var caseNodeId = selectNode.one;
  var caseNode0 = nodes[caseNodeId];
  while (caseNodeId) {
    var caseNode = nodes[caseNodeId];
    caseNodeId = caseNode.two;
    if (caseNode.content) {
      caseNode.type = "question";
      caseNode.flag1 = 1;
      caseNode.content = {
        operator: "equal",
        left: selectNode.content,
        right: caseNode.content,
      };
      if (!caseNode.two) {
        var errorId = caseNode.id + "-unexpected";
        var errorAction = insertIcon(
          nodes,
          "error",
          errorId,
          selectNode.content,
        );
        errorAction.message = translate("Unexpected case value");

        caseNode.two = errorId;
        errorAction.prev.push(caseNode.id);
        errorAction.one = caseNode.one;

        var next = nodes[caseNode.one];
        next.prev.push(errorId);
      }
    } else {
      if (caseNode.two) {
        throw createError(
          translate("Only the rightmost Case icon can be empty"),
          filename,
          caseNode.id,
        );
      }
      removeNodeOne(nodes, caseNode.id);
    }
  }
  caseNode0.side = selectNode.side;
  removeNodeOne(nodes, selectNode.id);
}

function insertIcon(nodes, type, id, content) {
  var node = {
    type: type,
    id: id,
    content: content,
    prev: [],
  };
  nodes[id] = node;
  return node;
}

function removeNodeOne(nodes, nodeId) {
  var node = nodes[nodeId];
  redirectPrev(nodes, node, node.one);
  redirectNext(nodes, node, node.one);
  delete nodes[nodeId];
}

function removeFromNext(node, next) {
  next.prev = next.prev.filter((prevId) => prevId !== node.id);
}

function redirectPrev(nodes, node, newTarget) {
  for (var prevId of node.prev) {
    var prev = nodes[prevId];
    if (prev.one === node.id) {
      prev.one = newTarget;
    }
    if (prev.two === node.id) {
      prev.two = newTarget;
    }
  }
}

function redirectNext(nodes, node, newTarget) {
  var target = nodes[newTarget];
  removeFromNext(node, target);
  for (var prevId of node.prev) {
    target.prev.push(prevId);
  }
}

function rewireShortcircuit(nodes) {
  while (findShortcusts(nodes)) {}
}

function findShortcusts(nodes) {
  for (var id in nodes) {
    var node = nodes[id];
    if (node.type === "question") {
      var andOperand = findAndOperand(nodes, node);
      if (andOperand) {
        writeAndShortcut(nodes, node, andOperand);
        return true;
      }
      var orOperand = findOrOperand(nodes, node);
      if (orOperand) {
        writeOrShortcut(nodes, node, orOperand);
        return true;
      }
    }
  }
  return false;
}

function findAndOperand(nodes, node) {
  var below = nodes[node.one];
  if (below.type === "question") {
    if (below.prev.length === 1 && below.two === node.two) {
      return below;
    }
  }
  return undefined;
}

function findOrOperand(nodes, node) {
  var right = nodes[node.two];
  if (right.type === "question") {
    if (right.prev.length === 1 && right.one === node.one) {
      return right;
    }
  }
  return undefined;
}

function writeAndShortcut(nodes, node, andOperand) {
  var right = nodes[node.two];
  var down = nodes[andOperand.one];
  removeFromNext(andOperand, right);
  removeFromNext(andOperand, down);
  node.content = {
    operator: "and",
    left: normalizeContent(node),
    right: normalizeContent(andOperand),
  };
  node.one = down.id;
  node.flag1 = 1;
  normalizeAnd(node);
  down.prev.push(node.id);
  delete nodes[andOperand.id];
}

function writeOrShortcut(nodes, node, orOperand) {
  var right = nodes[orOperand.two];
  var down = nodes[orOperand.one];
  removeFromNext(orOperand, right);
  removeFromNext(orOperand, down);
  node.content = {
    operator: "or",
    left: normalizeContent(node),
    right: normalizeContent(orOperand),
  };
  node.two = right.id;
  node.flag1 = 1;
  normalizeOr(node);
  right.prev.push(node.id);
  delete nodes[orOperand.id];
}

function normalizeAnd(node) {
  var op = node.content;
  var left = op.left;
  var right = op.right;
  if (left.operator === "not" && right.operator === "not") {
    node.content = {
      operator: "or",
      left: left.operand,
      right: right.operand,
    };
    node.flag1 = 0;
  }
}

function normalizeOr(node) {
  var op = node.content;
  var left = op.left;
  var right = op.right;
  if (left.operator === "not" && right.operator === "not") {
    node.content = {
      operator: "and",
      left: left.operand,
      right: right.operand,
    };
    node.flag1 = 0;
  }
}

function normalizeContent(question) {
  if (question.flag1 === 1) {
    return question.content;
  }

  return {
    operator: "not",
    operand: question.content,
  };
}

function traverse(nodes, nodeId, visited, action) {
  if (!nodeId) {
    return;
  }

  if (nodeId in visited) {
    return;
  }
  visited[nodeId] = true;
  var node = nodes[nodeId];
  action(nodes, node);
  traverse(nodes, node.one, visited, action);
  traverse(nodes, node.two, visited, action);
  if (node.procs) {
    for (var proc of node.procs) {
      traverse(nodes, proc.start, visited, action);
    }
  }
}

function connectBack(nodes, node, htmlToString) {
  if (node.one) {
    var one = nodes[node.one];
    one.prev.push(node.id);
  }
  if (node.two) {
    var two = nodes[node.two];
    two.prev.push(node.id);
  }

  if (node.side) {
    var side = nodes[node.side].content;
    if (side) {
      node.side = decodeSide(side, htmlToString);
    } else {
      delete node.side;
    }
  }
}

function decodeSide(content, htmlToString) {
  var text = htmlToString(content);
  var oneLine = text.join(" ");
  if (oneLine.indexOf("=") === -1) {
    return translate("Do for") + " " + oneLine;
  } else {
    return translate("Start at") + " " + oneLine;
  }
}

function markLoopBody(nodes, start, filename) {
  var nextNodeId = start.one;
  while (nextNodeId) {
    var current = nodes[nextNodeId];
    nextNodeId = current.one;
    current.parentLoopId = start.id;
    if (current.type === "loopbegin") {
      nextNodeId = markLoopBody(nodes, current, filename);
    } else if (current.type === "loopend") {
      start.end = current.id;
      start.next = current.one;
      current.start = start.id;
      return nextNodeId;
    }
  }
  throw createError(translate("Loop end expected here"), filename, start.one);
}

module.exports = { drakonToStruct, drakonToGraph };

},{"./structFlow":7,"./tools":9}],4:[function(require,module,exports){
const { drakonToPseudocode, mindToTree } = require("./drakonToPromptStruct");
const { htmlToString } = require("./browserTools");
const { setUpLanguage, translate } = require("./translate");
const { drakonToStruct } = require("./drakonToStruct");
const { freeDiagramToText } = require("./free");

window.drakongen = {
  toPseudocode: function (drakonJson, name, filename, language) {
    setUpLanguage(language);
    return drakonToPseudocode(
      drakonJson,
      name,
      filename,
      htmlToString,
      translate,
    ).text;
  },

  toMindTree: function (mindJson, name, filename, language) {
    setUpLanguage(language);
    var result = mindToTree(mindJson, name, filename, htmlToString);
    return result.text;
  },

  freeToText: function (freeJson, name, filename, language) {
    setUpLanguage(language);
    var result = freeDiagramToText(
      freeJson,
      name,
      filename,
      translate,
      htmlToString,
    );
    return result.text;
  },

  toTree: function (drakonJson, name, filename, language, options) {
    setUpLanguage(language);
    var result = drakonToStruct(
      drakonJson,
      name,
      filename,
      translate,
      htmlToString,
      options,
    );
    return JSON.stringify(result, null, 4);
  },
};

},{"./browserTools":1,"./drakonToPromptStruct":2,"./drakonToStruct":3,"./free":5,"./translate":10}],5:[function(require,module,exports){
var {addRange} = require("./tools")
const { createError } = require("./tools");

var translate

function compareVertically(box1, box2) {
  if (box1.top + box1.height <= box2.top) return -1;
  if (box2.top + box2.height <= box1.top) return 1;
  return 0;
}

function compareHorizontally(box1, box2) {
  if (box1.left + box1.width <= box2.left) return -1;
  if (box2.left + box2.width <= box1.left) return 1;
  return 0;
}

function byTopLeft(box1, box2) {
    var vertical = compareVertically(box1, box2)
    if (vertical == 0) {
        return compareHorizontally(box1, box2)
    }
    return vertical
}

function parseDiagram(freeJson, filename) {
    let diagram;
    try {
        freeJson = freeJson || ""
        freeJson = freeJson.trim()
        freeJson = freeJson || "{}"
        diagram = JSON.parse(freeJson);
    } catch (error) {
        var message = translate("Error parsing JSON") + ": " + error.message
        throw createError(message, filename)
    }    
    return diagram
}

function sortedItems(diagram) {    
    var items = diagram.items || {};
    var result = [];
    for (var id in items) {
        var item = items[id];
        if (item.content && item.top && item.left && item.width && item.height) {
            result.push(item);
        }
    }
    result.sort(byTopLeft);
    return result;
}

function freeDiagramToText(freeJson, name, filename, translateFunction, htmlToString) {
    translate = translateFunction
    var diagram = parseDiagram(freeJson, filename)
    var sorted = sortedItems(diagram)
    var lines = []
    lines.push("## " + name)
    lines.push("")
    for (var item of sorted) {
        var content = htmlToString(item.content)
        addRange(lines, content)
        lines.push("")
    }
    var text = lines.join("\n")
    return {text:text}
}

module.exports = {freeDiagramToText}
},{"./tools":9}],6:[function(require,module,exports){
var {addRange} = require("./tools")

function makeIndent(depth) {
    return " ".repeat(depth * 4); 
}

function printWithIndent(lines, indent, output) {
    if (!lines) {return}
    lines.forEach(line => output.push(indent + line))
}

function printPseudo(algorithm, translate, output, htmlToString) {
    function printStructuredContent(content, indent, output, side) {
        var lines = printStructuredContentNoIdent(content)
        if (side) {
            lines[0] = side + ": " + lines[0]
        }
        printWithIndent(lines, indent, output)
    }

    function printStructuredContentNoIdent(content) {
        var lines = []

        if (typeof content === "string") {
            return htmlToString(content);
        } else if (content.operator === "not") {
            lines = printStructuredContentNoIdent(content.operand)
            if (lines.length > 0) {
                lines[0] = translate("not") + " (" + lines[0] + ")"
            }
        } else if (content.operator === "and" || content.operator === "or") {
            var operator = translate(content.operator)
            printBinary(content, operator, lines)
        } else if (content.operator === "equal") {
            var operator = "=="
            printBinary(content, operator, lines)
        }

        return lines;
    }

    function printBinary(content, operator, lines) {
        const leftLines = printOperand(content.left);
        const rightLines = printOperand(content.right);
        if (leftLines.length === 1 && rightLines.length === 1) {
            lines.push(leftLines[0] + " " + operator + " " + rightLines[0])
        } else {
            addRange(lines, leftLines)
            lines.push(operator);
            addRange(lines, rightLines)
        }
    }

    function printOperand(content) {
        var lines = printStructuredContentNoIdent(content)
        if (typeof content === "string" || content.operator === "not") {
            return lines
        }
        if (lines.length > 0) {
            lines[0] = "(" + lines[0]
            last = lines.length - 1
            lines[last] = lines[last] + ")"
        }
        return lines
    }

    function printSteps(steps, depth, output) {
        const indent = makeIndent(depth)
        for (var step of steps) {
            if (step.type === "end" || step.type === "branch") { continue }
            if (step.type === "question") {
                printQuestion(step, depth, output)
            } else if (step.type === "loop") {
                printLoop(step, depth, output)    
            } else if (step.type === "address") {
                printAddress(step, indent, output)                                      
            } else if (step.type === "error") {
                printError(step, indent, output)
            } else if (step.type === "break") {
                output.push(indent + translate("break"))
            } else if (step.type === "parbegin") {
                printParbegin(step, depth, output)
            } else {
                printOther(step, indent, output)
            }
        }
    }

    function printParbegin(step, depth, output) {
        const indent2 = makeIndent(depth + 1)
        const indent = makeIndent(depth)
        printWithIndent([translate("Group of parallel processes")], indent, output)
        for (var proc of step.procs) {
            printWithIndent([translate("Parallel process") + " " + (proc.ordinal + 1)], indent2, output)
            printSteps(proc.body, depth + 2, output)
        }
    }
    
    function printOther(step, indent, output) {
        var side = step.side
        if (!step.content && !step.secondary) {return}
        if (step.secondary) {            
            printStructuredContent(step.secondary, indent, output, side)
            side = undefined
        }
        if (step.content) {
            var content = step.content
            if (step.type === "pause") {
                content = translate("Pause") + " " + htmlToString(content).join(" ")
            } else if (step.type === "timer") {
                content = translate("Start timer") + " " + htmlToString(content).join(" ")
            }
            printStructuredContent(content, indent, output, side)
        }
    }

    function printAddress(step, indent, output) {
        var label
        if (step.content) {
            label = htmlToString(step.content);
        } else {
            label = translate("Subroutine") + " " + step.branch 
        }
        output.push(indent + translate("Call subroutine") + " \"" + label + "\"")
    }

    function printError(step, indent, output) {
        output.push(indent + translate("error") + ":")
        var ind2 = indent + makeIndent(1)
        output.push(ind2 + step.message)
        if (step.content) {
            var ind3 = indent + makeIndent(2)
            printStructuredContent(step.content, ind3, output)
        }        
    }    

    function empty(array) {
        return array.length === 0
    }

    function printQuestion(step, depth, output) {
        const indent = makeIndent(depth)
        const indent2 = makeIndent(depth + 1)
        var yesBody = []
        printSteps(step.yes, depth + 1, yesBody)
        var noBody = []
        printSteps(step.no, depth + 1, noBody)        
        if (empty(yesBody) && empty(noBody)) {
            yesBody.push(indent2 + translate("pass"))
        }
        var content = step.content
        var lines = printStructuredContentNoIdent(content)
        lines[0] = translate("if") + " " + lines[0]
        if (step.side) {
            lines[0] = step.side + ": " + lines[0]
        }
        printWithIndent(lines, indent, output)
        addRange(output, yesBody)            
        if (!empty(noBody)) {
            output.push(indent + translate("else"))
            addRange(output, noBody)
        }
    }      

    function printLoop(step, depth, output) {
        const indent2 = makeIndent(depth + 1)
        const indent = makeIndent(depth)
        var body = []
        printSteps(step.body, depth + 1, body)
        if (empty(body)) {
            body.push(indent2 + translate("pass"))
        }
        var content = step.content
        if (!content) {
            content = translate("loop forever")
        }
        printStructuredContent(content, indent, output)
        addRange(output, body)
    }      

    printSteps(algorithm.body, 0, output)
}

module.exports = {printPseudo, printWithIndent, makeIndent}
},{"./tools":9}],7:[function(require,module,exports){
var { buildTree } = require("./technicalTree");
const { createError, sortByProperty } = require("./tools");
const { optimizeTree } = require("./treeTools");

function redirectNode(nodes, node, from, to) {
  if (node.one === from) {
    node.one = to;
  }
  if (node.two === from) {
    node.two = to;
  }
  if (node.next === from) {
    node.next = to;
  }
  if (node.start && node.type === "loopend") {
    start = nodes[node.start];
    if (start.next === from) {
      start.next = to;
    }
  }
}

function structFlow(nodes, branches, filename, translate) {
  function flowGraph(nodes, nodeId, branchingStack) {
    if (!nodeId) {
      return;
    }

    const node = nodes[nodeId];

    if (!node.stack) {
      node.stack = [];
      node.remaining = node.prev.length;
    }
    node.remaining--;

    mergeBranchingStack(nodes, node, branchingStack);
    if (node.remaining > 0) {
      return;
    }

    if (node.type === "question") {
      for (let i = 0; i < node.stack.length; i++) {
        const questionId = node.stack[i];
        const question = nodes[questionId];
        question.branching++;
      }

      const stackOne = node.stack.slice();
      const stackTwo = node.stack.slice();
      stackOne.push(nodeId);
      stackTwo.push(nodeId);

      flowGraph(nodes, node.two, stackTwo);
      flowGraph(nodes, node.one, stackOne);
    } else if (node.type === "arrow-loop") {
      const stackOne = node.stack.slice();
      stackOne.push(nodeId);
      flowGraph(nodes, node.one, stackOne);
    } else if (node.type === "arrow-stub") {
      decrementBranchingForArrow(nodes, node);
    } else if (node.type === "parbegin") {
      for (var proc of node.procs) {
        flowGraph(nodes, proc.start, []);
      }
      flowGraph(nodes, node.one, node.stack);
    } else {
      flowGraph(nodes, node.one, node.stack);
    }
  }

  function decrementBranchingForArrow(nodes, node) {
    var algonode = nodes[node.arrow];
    algonode.branching--;
  }

  function decrementQuestions(nodes, algonode, dictionary) {
    var stub = nodes[algonode.stub];
    for (var id of stub.stack) {
      var snode = nodes[id];
      if (id !== algonode.id) {
        if (id in dictionary) {
          snode.branching--;
        }
      }
    }
    return stub;
  }

  function mergeBranchingStack(nodes, node, branchingStack) {
    // Append all elements of the branching stack to node.stack
    addRange(node.stack, branchingStack);

    // Build a dictionary of occurrences
    const dictionary = buildDictionaryOfOccurences(node);

    // Merge all nodes
    mergeAll(nodes, node, dictionary);

    // Rebuild the stack
    node.stack = buildStackFromDictionary(dictionary);
  }

  function addRange(dst, src) {
    for (let i = 0; i < src.length; i++) {
      dst.push(src[i]);
    }
  }

  function buildStackFromDictionary(dictionary) {
    const rebuiltStack = [];
    for (const id in dictionary) {
      if (dictionary[id] > 0) {
        rebuiltStack.push(id);
      }
    }
    return rebuiltStack;
  }

  function buildDictionaryOfOccurences(node) {
    const dictionary = {};
    for (let i = 0; i < node.stack.length; i++) {
      const id = node.stack[i];
      dictionary[id] = (dictionary[id] || 0) + 1;
    }
    return dictionary;
  }

  function mergeAll(nodes, node, dictionary) {
    for (const id in dictionary) {
      const occurrences = dictionary[id];
      const algonode = nodes[id];
      if (occurrences > 1) {
        algonode.branching--;
        dictionary[id] = occurrences - 1;
      }
      if (algonode.branching === 1) {
        if (algonode.type === "arrow-loop" && !algonode.next) {
          if (!isInMap(node.astack, id)) {
            algonode.next = node.id;
            dictionary[algonode.id] = 0;
            var stub = decrementQuestions(nodes, algonode, dictionary);
            stub.one = node.id;
          }
        }
      }
    }

    for (const id in dictionary) {
      const algonode = nodes[id];
      if (algonode.branching === 1) {
        if (algonode.type === "question") {
          algonode.next = node.id;
          dictionary[algonode.id] = 0;
        }
      }
    }
  }
  function isInMap(map, key) {
    if (!map) {
      return false;
    }
    return key in map;
  }

  function prepareQuestions(nodes) {
    for (const nodeId in nodes) {
      const node = nodes[nodeId];
      if (node.type === "question") {
        node.branching = 2;
      } else if (node.type === "arrow-loop") {
        node.branching = 1;
      }
    }
  }

  function rewireArrows(nodes, branches) {
    branches.forEach((branch) =>
      rewireArrowsInBranch(nodes, branch.id, branch.next, []),
    );
    for (var id in nodes) {
      var node = nodes[id];
      if (node.type === "arrow-loop") {
        var stub = insertArrowStub(nodes, node);
        var visited = {};
        fillAStack(nodes, stub, stub.arrow, visited);
      }
    }
  }

  function fillAStack(nodes, node, arrowId, visited) {
    if (node.id in visited) {
      return;
    }
    visited[node.id] = true;
    if (!node.astack) {
      node.astack = {};
    }
    node.astack[arrowId] = true;
    if (node.id === arrowId) {
      return;
    }
    for (var prevId of node.prev) {
      var prev = nodes[prevId];
      fillAStack(nodes, prev, arrowId, visited);
    }
  }

  function rewireArrowsInBranch(nodes, prevNodeId, nodeId, arrowStack) {
    if (!nodeId) {
      return;
    }
    var node = nodes[nodeId];
    if (node.type === "branch") {
      return;
    }
    if (node.type === "arrow-loop") {
      if (!node.noloop) {
        node.noloop = {};
      }
      if (arrowStack.includes(nodeId)) {
        return;
      }
      node.noloop[prevNodeId] = true;
      arrowStack = arrowStack.slice();
      arrowStack.push(nodeId);
      rewireArrowsInBranch(nodes, nodeId, node.one, arrowStack);
    } else if (node.type === "question") {
      var left = arrowStack.slice();
      var right = arrowStack.slice();
      rewireArrowsInBranch(nodes, nodeId, node.one, left);
      rewireArrowsInBranch(nodes, nodeId, node.two, right);
    } else if (node.type === "parbegin") {
      for (var proc of node.procs) {
        rewireArrowsInBranch(nodes, undefined, proc.start, []);
      }
      rewireArrowsInBranch(nodes, nodeId, node.one, arrowStack);
    } else {
      rewireArrowsInBranch(nodes, nodeId, node.one, arrowStack);
    }
  }

  function insertArrowStub(nodes, node) {
    var stub = {
      type: "arrow-stub",
      id: "arrow-stub-" + node.id,
      arrow: node.id,
      prev: [],
    };
    nodes[stub.id] = stub;
    node.stub = stub.id;
    var prev2 = [];
    for (var prevId of node.prev) {
      if (prevId in node.noloop) {
        prev2.push(prevId);
      } else {
        stub.prev.push(prevId);
        var prev = nodes[prevId];
        redirectNode(nodes, prev, node.id, stub.id);
      }
    }
    node.prev = prev2;
    return stub;
  }

  function copySide(dst, src) {
    if (src.side) {
      dst.side = src.side;
    }
  }

  function rewriteTree(body, index, endId, output) {
    while (index < body.length) {
      var node = body[index];
      index++;
      if (endId && node.id === endId) {
        return index;
      }
      if (node.type === "question") {
        var transformed = rewriteQuestionTree(node, output);
        copySide(transformed, node);
        if (endId) {
          var breakYes = findLoopEnd(transformed.yes, endId);
          var breakNo = findLoopEnd(transformed.no, endId);
          if (breakYes || breakNo) {
            var toBreak = [];
            findPlacesToBreak(transformed.yes, endId, toBreak);
            findPlacesToBreak(transformed.no, endId, toBreak);
            addBreaks(toBreak);
            return index;
          }
        }
      } else if (node.type === "loopbegin") {
        var body2 = [];
        index = rewriteTree(body, index, node.end, body2);
        output.push({
          id: node.id,
          type: "loop",
          content: node.content,
          body: body2,
        });
      } else if (node.type === "parbegin") {
        var copy = {
          id: node.id,
          type: node.type,
          procs: [],
        };
        for (var proc of node.procs) {
          var procCopy = {
            ordinal: proc.ordinal,
            body: [],
          };
          copy.procs.push(procCopy);
          rewriteTree(proc.body, 0, undefined, procCopy.body);
        }
        output.push(copy);
      } else {
        output.push(node);
      }
    }
  }

  function findPlacesToBreak(body, endId, output) {
    if (body.length === 0) {
      output.push(body);
      return;
    }
    var last = body[body.length - 1];
    if (last.id === endId) {
      return;
    }
    if (last.type === "question") {
      var qends = [];
      findPlacesToBreak(last.yes, endId, qends);
      findPlacesToBreak(last.no, endId, qends);
      if (qends.length === 2 && qends[0] === last.yes && qends[1] === last.no) {
        output.push(body);
      } else {
        addRange(output, qends);
      }
    } else {
      output.push(body);
    }
  }

  function findLoopEnd(body, endId) {
    for (var i = 0; i < body.length; i++) {
      var node = body[i];
      if (node.id === endId) {
        if (i === body.length - 1) {
          return true;
        } else {
          throw createError(
            translate(
              "An exit from the loop must lead to the point right after the loop end",
            ),
            filename,
            node.id,
          );
        }
      }
      if (node.type === "question") {
        if (findLoopEnd(node.yes, endId)) {
          return true;
        }
        if (findLoopEnd(node.no, endId)) {
          return true;
        }
      }
    }
    return false;
  }

  function addBreaks(toBreak) {
    for (var body of toBreak) {
      body.push({
        type: "break",
      });
    }
  }

  function rewriteQuestionTree(question, output) {
    var yes = [];
    var no = [];
    rewriteTree(question.yes, 0, undefined, yes);
    rewriteTree(question.no, 0, undefined, no);
    var transformed = {
      type: "question",
      id: question.id,
      content: question.content,
      yes: yes,
      no: no,
    };
    output.push(transformed);
    return transformed;
  }

  function structMain() {
    rewireArrows(nodes, branches);
    prepareQuestions(nodes);
    var result = [];
    for (var branch of branches) {
      flowGraph(nodes, branch.next, []);
    }

    for (var branch of branches) {
      var body = [];
      buildTree(nodes, branch.next, body, "<dummy id>");
      var body2 = [];
      rewriteTree(body, 0, undefined, body2);
      result.push({
        name: branch.content,
        branchId: branch.branchId,
        start: branch.next,
        refs: branch.prev.length,
        body: optimizeTree(body2),
      });
    }

    return sortByProperty(result, "branchId");
  }

  return structMain();
}
module.exports = { structFlow, redirectNode };

},{"./technicalTree":8,"./tools":9,"./treeTools":11}],8:[function(require,module,exports){
function buildTree(nodes, nodeId, body, stopId) {
    while (nodeId) {
        if (nodeId === stopId) {return;}
        const node = nodes[nodeId];
        let transformed;
        let next;

        if (node.type === "question") {
            next = reserveNext(nodes, node)

            transformed = {
                id: node.id,
                type: "question",
                content: node.content || "",
                yes: [],
                no: []
            };

            const yesNodeId = node.flag1 === 1 ? node.one : node.two;
            const noNodeId = node.flag1 === 1 ? node.two : node.one;

            buildTree(nodes, yesNodeId, transformed.yes, node.next);
            buildTree(nodes, noNodeId, transformed.no, node.next);
        } else if (node.type === "arrow-loop") {
            transformed = {
                id: node.id,
                type: "loopbegin",
                content: "",
                end: node.stub
            };

            next = node.one;
        } else if (node.type === "arrow-stub") {
            transformed = {
                id: node.id,
                type: "loopend",
                start: node.arrow
            };

            next = node.one;
        } else if (node.type === "parbegin") {
            transformed = {
                id: node.id,
                type: node.type,
                procs: []
            }            
            for (var proc of node.procs) {
                var childProc = {
                    ordinal: proc.ordinal,
                    body: []
                }
                transformed.procs.push(childProc)
                buildTree(nodes, proc.start, childProc.body, undefined)
            }
            next = node.one;
        } else {
            transformed = {
                id: node.id,
                type: node.type,
            }
            copyFields(
                transformed,
                node,
                [
                    "content",
                    "secondary",
                    "start",
                    "message",
                    "end"
                ]
            )
            next = node.one;
        }
        if (node.side) {
            transformed.side = node.side
        }
        body.push(transformed);
        nodeId = next;
    }
}

function copyFields(dst, src, fields) {
    for (var field of fields) {
        var value = src[field]
        if (value !== "" && value !== undefined && value !== null) {
            dst[field] = value
        }
    }
}

function reserveNext(nodes, node) {
    const target = nodes[node.next];
    if (target.targetTaken) {
        return undefined;
    } else {
        target.targetTaken = true;
        return node.next;
    }    
}

module.exports = {buildTree}

},{}],9:[function(require,module,exports){

function createError(message, filename, nodeId) {
    var error = new Error(message)
    error.nodeId = nodeId
    error.filename = filename
    return error
}

function remove(array, element) {
    return array.filter(item => item != element)
}

function sortByProperty(array, property, order = "asc") {
    if (!Array.isArray(array)) {
        throw new Error("First argument must be an array");
    }

    return array.slice().sort((a, b) => {
        const valA = a[property];
        const valB = b[property];

        if (valA === null || valB === null || valA === undefined || valB === undefined) {
            return 0; // Handle null or undefined values
        }

        if (valA < valB) {
            return order === "asc" ? -1 : 1;
        }
        if (valA > valB) {
            return order === "asc" ? 1 : -1;
        }
        return 0; // Values are equal
    });
}
function addRange(to, from) {
    for (var item of from) {
        to.push(item)
    }
}
module.exports = { createError, sortByProperty, addRange, remove }
},{}],10:[function(require,module,exports){
var translationsRu = {
    "error": "ОШИБКА",
    "not": "не",
    break: 'выход из цикла',
    "and": "и",
    "or": "или",
    "if": "Если",
    "else": "Иначе",
    "empty": "ПУСТОЙ",
    "loop forever": "Бесконечный цикл",
    "pass": "Пропустить",
    "Only the rightmost Case icon can be empty": "Только самая правая икона Вариант может быть пустой",
    "Error parsing JSON": "Ошибка парсинга JSON",
    "A Loop begin icon must have content": "Икона начала цикла ДЛЯ должна содержать данные",
    "A Question icon must have content": "Икона Вопрос должна содержать данные",
    "A Select icon must have content": "Икона Выбор должна содержать данные",
    "Unexpected case value": "Неожиданное значение иконы Вариант",
    "Loop end expected here": "Здесь ожидается конец цикла",
    "An exit from the loop must lead to the point right after the loop end": "Выход из цикла должен вести в точку сразу за его концом",
    "A silhouette branch is not referenced": "Нет ссылок на ветку силуэта",
    "Call subroutine": "Вызвать подпрограмму",
    "Procedure": "Процедура",
    "End of procedure": "Конец процедуры",
    "Subroutine": "Подпрограмма",
    "End of subroutine": "Конец подпрограммы",
    "Description": "Описание",
    "Algorithm": "Алгоритм",
    Remarks: "Замечания",
    Parameters: "Параметры",
    "Group of parallel processes": "Группа параллельных процессов",
    "Parallel process": "Параллельный процесс",
    "Start at": "Начать в",
    "Do for": "Делать в течение",
    "Pause": "Пауза",
    "Start timer": "Запустить таймер"    
}

var translationsEn = {
    error: 'Error',
    not: 'not',
    break: 'break',
    and: 'and',
    or: 'or',
    if: 'If',
    else: 'Else',
    empty: 'Empty',
    'loop forever': 'Loop forever',
    pass: 'Pass',
    'Only the rightmost Case icon can be empty': 'Only the rightmost Case icon can be empty',
    'Error parsing JSON': 'Error parsing JSON',
    'A Loop begin icon must have content': 'A Loop begin icon must have content',
    'A Question icon must have content': 'A Question icon must have content',
    'A Select icon must have content': 'A Select icon must have content',
    "Unexpected case value": "Unexpected case value",
    'Loop end expected here': 'Loop end expected here',
    'An exit from the loop must lead to the point right after the loop end': 'An exit from the loop must lead to the point right after the loop end',
    'A silhouette branch is not referenced': 'A silhouette branch is not referenced',
    'Call subroutine': 'Call subroutine',
    Procedure: 'Procedure',
    'End of procedure': 'End of procedure',
    Subroutine: 'Subroutine',
    'End of subroutine': 'End of subroutine',
    Description: 'Description',
    Algorithm: 'Algorithm',
    Remarks: "Remarks",
    Parameters: "Parameters",
    "Group of parallel processes": "Group of parallel processes",
    "Parallel process": "Parallel process",
    "Start at": "Start at",
    "Do for": "Do for",
    "Pause": "Pause",
    "Start timer": "Start timer",
}

var translationsNo = {
    error: 'Feil',
    not: 'ikke',
    break: 'avslutt løkken',
    and: 'og',
    or: 'eller',
    if: 'Hvis',
    else: 'Ellers',
    empty: 'Tom',
    'loop forever': 'Gjør evig',
    pass: 'Hopp over',
    'Only the rightmost Case icon can be empty': 'Bare den ytterste høyre Case-ikonet kan være tomt',
    'Error parsing JSON': 'Feil ved parsing av JSON',
    'A Loop begin icon must have content': 'Et Loop-startikon må ha innhold',
    'A Question icon must have content': 'Et Spørsmål-ikon må ha innhold',
    'A Select icon must have content': 'Et Velg-ikon må ha innhold',
    "Unexpected case value": "Uventet tilfelle verdi",
    'Loop end expected here': 'Slutt på løkke forventet her',
    'An exit from the loop must lead to the point right after the loop end': 'En utgang fra løkken må føre til punktet rett etter løkkens slutt',
    'A silhouette branch is not referenced': 'En silhuettgren er ikke referert',
    'Call subroutine': 'Kall delprosedyre',
    Procedure: 'Prosedyre',
    'End of procedure': 'Slutt på prosedyre',
    Subroutine: 'Delprosedyre',
    'End of subroutine': 'Slutt på delprosedyre',
    Description: 'Beskrivelse',
    Algorithm: 'Algoritme',
    Remarks: "Bemerkninger",
    Parameters: "Parametere",
    "Group of parallel processes": "Gruppe av parallelle prosesser",
    "Parallel process": "Parallell prosess",
    "Start at": "Start ved",
    "Do for": "Gjør i",
    "Pause": "Pause",
    "Start timer": "Start tidtaker"
};


var translations = translationsEn

function translate(text) {
    return translations[text] || text;
}

function setUpLanguage(language) {
    if (language === "ru") {
        translations = translationsRu
    } else if (language === "no") {
        translations = translationsNo
    } else if (language === "en") {
        translations = translationsEn
    } else {
        translations = {}
    }
}


module.exports = { setUpLanguage, translate };
},{}],11:[function(require,module,exports){

function optimizeTree(steps) {
    var result = []

    for (var step of steps) {
        if (step.type === "end" || step.type === "branch" || step.type === "loopend") { continue }
        if ((step.type === "action" || step.type === "comment") && !step.content) { continue }
        var copy
        if (step.type === "question") {
            copy = optimizeQuestion(step)
        } else if (step.type === "parbegin") {
            copy = optimizeParbegin(step)
        } else if (step.type === "loop") {
            copy = optimizeLoop(step)
        } else {
            copy = step
        }
        result.push(copy)
    }

    return result
}

function optimizeParbegin(step) {
    var procs = []
    for (var proc of step.procs) {
        var procCopy = {
            ordinal: proc.ordinal,
            body: optimizeTree(proc.body)
        }
        procs.push(procCopy)
    }
    return {
        id: step.id,
        type: step.type,
        procs: procs
    }
}

function optimizeLoop(step) {
    return {
        id: step.id,
        type: step.type,
        content: step.content,
        body: optimizeTree(step.body)
    }
}

function optimizeQuestion(step) {
    var yes = optimizeTree(step.yes)
    var no = optimizeTree(step.no)
    if (yes.length === 0 && no.length === 0) {
        return {
            side: step.side,
            type: step.type,
            content: step.content,
            yes: [],
            no: []
        }    
    }
    if (yes.length === 0) {
        return {
            side: step.side,
            type: step.type,
            content: {operator:"not",operand:step.content},
            yes: no,
            no: []
        }
    }
    return {
        side: step.side,
        type: step.type,
        content: step.content,
        yes: yes,
        no: no
    }    
}


module.exports = {optimizeTree}
},{}]},{},[4]);
