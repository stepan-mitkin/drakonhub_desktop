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
            output.push(node.textContent);
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

function drakonToPseudocode(drakonJson, name, filename, htmlToString, translate, options) {    
    var diagram = drakonToStruct(drakonJson, name, filename, translate, htmlToString, options)
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


function mindToTree(drakonJson, name, filename, htmlToString, outputToJson) {
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
    for (var id in nodes) {
        var node = nodes[id]
        node.id = id
        delete node.type
        delete node.treeType
        if (node.content) {
            node.content = htmlToString(node.content).join("\n")
        }
    }

    var text;
    if (outputToJson) {
        var root = createMindNode(name)
        root.name = root.content
        delete root.content
        nodes["root"] = root
        connectMindNodesToParent(nodes)
        sortMindChildren(nodes)
        for (var id in nodes) {
            var node = nodes[id]
            delete node.parent
            delete node.ordinal
        }
        text = JSON.stringify(root, null, 4)
    } else {
        var root = createMindNode("## " + name)
        nodes["root"] = root
        connectMindNodesToParent(nodes)
        sortMindChildren(nodes)
        var lines = []
        printMindNode(root, 0, lines, htmlToString, true)
        lines.push("")
        text = lines.join("\n")
    }
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
        "type": "graf",
        "content": name,
        "parent": undefined,
        "ordinal": 0
    }
}

module.exports = { drakonToPseudocode, mindToTree };
},{"./drakonToStruct":3,"./printPseudo":7,"./tools":10}],3:[function(require,module,exports){
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
  var firstNodeId = findStartNode(nodes, filename, branches, htmlToString);
  var params = decodeContent(drakonGraph.params, htmlToString);
  var description = decodeContent(drakonGraph.description, htmlToString);

  var result = {
    name: name,
    type: "drakon",
    params:  params,
    description: description,
    branches: []
  };

  if (!firstNodeId) {
    return result
  }

  handleParallel(nodes, undefined, firstNodeId, {}, undefined);
  buildTwoWayConnections(nodes, firstNodeId);

  rewireSelectsMarkLoops(nodes, filename);
  branches.forEach((branch) =>
    checkBranchIsReferenced(
      branch,
      firstNodeId,
      filename,
      options
    ),
  );
  rewireShortcircuit(nodes, filename);
  branches.forEach((branch) => cutOffBranch(nodes, branch));
  var branchTrees = structFlow(nodes, branches, filename, translate, options);

  result.branches = branchTrees
  result.secondary = findSecondary(branchTrees, options)
  return result
}

function findSecondary(branchTrees, options) {
  if (!options || !options.secondary) {
    return undefined;
  }
  var ordinal = 0;
  for (var branch of branchTrees) {
    var name = branch.name;
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
  options  
) {
  if (branch.id === firstNodeId) {
    return;
  }
  if (options) {
    var branchName = branch.content;
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

function buildTwoWayConnections(nodes, firstNodeId) {
  for (var id in nodes) {
    var node = nodes[id];
    node.id = id;
    node.prev = [];
  }

  var visitor = function (nodes, node) {
    return connectBack(nodes, node);
  };

  traverse(nodes, firstNodeId, {}, visitor);
}

function findStartNode(nodes, filename, branches, htmlToString) {
  var firstNodeId = undefined;
  var minBranchId = 10000;
  for (var id in nodes) {
    var node = nodes[id];
    decodeNodeContent(node, htmlToString);
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
    } else if (node.final) {
      delete node.one
      delete node.two
    }
  }

  return firstNodeId;
}

function decodeNodeContent(node, htmlToString) {
  if (node.content && typeof node.content === "string") {
    node.content = decodeContent(node.content, htmlToString);
  }

  if (node.secondary && typeof node.secondary === "string") {
    node.secondary = decodeContent(node.secondary, htmlToString);
  }
}

function decodeContent(content, htmlToString) {
  if (!content) {
    return ""
  }
  var lines = htmlToString(content);
  return lines.join("\n");
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

function connectBack(nodes, node) {
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
      node.side = decodeSide(side);
    } else {
      delete node.side;
    }
  }
}

function decodeSide(content) {
  if (content.indexOf("=") === -1) {
    return translate("Do for") + " " + content;
  } else {
    return translate("Start at") + " " + content;
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

},{"./structFlow":8,"./tools":10}],4:[function(require,module,exports){
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
    var result = mindToTree(mindJson, name, filename, htmlToString, false);
    return result.text;
  },

  toMindTreeJson: function (mindJson, name, filename, language) {
    setUpLanguage(language);
    var result = mindToTree(mindJson, name, filename, htmlToString, true);
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

},{"./browserTools":1,"./drakonToPromptStruct":2,"./drakonToStruct":3,"./free":5,"./translate":11}],5:[function(require,module,exports){
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
},{"./tools":10}],6:[function(require,module,exports){
function decrement_arrow_count(context, node) {
    var algonode;
    algonode = context.nodes[node.arrow];
    algonode.branching--;
}
function decrement_if_count(context, node) {
    var _collection_12, if_id, if_node;
    _collection_12 = node.stack;
    for (if_id of _collection_12) {
        if_node = context.nodes[if_id];
        if_node.branching--;
    }
}
function flow_no_loop(nodes, start_node_id) {
    var context;
    context = { nodes: nodes };
    traverse_node(context, start_node_id, []);
}
function group_stack_by_id(stack) {
    var counts_by_id, element, existing;
    counts_by_id = {};
    for (element of stack) {
        if (element in counts_by_id) {
            existing = counts_by_id[element];
        } else {
            existing = 0;
        }
        counts_by_id[element] = existing + 1;
    }
    return counts_by_id;
}
function increment_if_count(context, node) {
    var _collection_14, if_id, if_node;
    _collection_14 = node.stack;
    for (if_id of _collection_14) {
        if_node = context.nodes[if_id];
        if_node.branching++;
    }
}
function is_in_map(map, key) {
    if (map) {
        return key in map;
    } else {
        return false;
    }
}
function merge_converging_branches(context, node_id, node, stack) {
    var algonode, algonode_id, common, count, counts_by_id, processed_stack, stub;
    common = node.stack.concat(stack);
    counts_by_id = group_stack_by_id(common);
    for (algonode_id in counts_by_id) {
        count = counts_by_id[algonode_id];
        algonode = context.nodes[algonode_id];
        if (!algonode.next && algonode.type == 'arrow-loop') {
            algonode.branching -= count - 1;
            if (!(algonode.branching > 1 || is_in_map(node.astack, algonode_id))) {
                stub = context.nodes[algonode.stub];
                decrement_if_count(context, stub);
                stub.one = node_id;
                algonode.next = node_id;
            }
        }
    }
    processed_stack = [];
    for (algonode_id in counts_by_id) {
        count = counts_by_id[algonode_id];
        algonode = context.nodes[algonode_id];
        if (!algonode.next) {
            if (algonode.type == 'question') {
                algonode.branching -= count - 1;
                if (algonode.branching > 1) {
                    processed_stack.push(algonode_id);
                } else {
                    algonode.next = node_id;
                }
            } else {
                processed_stack.push(algonode_id);
            }
        }
    }
    node.stack = processed_stack;
}
function recurse_traversal(context, node_id, node) {
    var _collection_20, _selectValue_18, proc, stack1, stack2;
    _selectValue_18 = node.type;
    if (_selectValue_18 === 'question') {
        increment_if_count(context, node);
        stack1 = node.stack.slice();
        stack1.push(node_id);
        stack2 = node.stack.slice();
        stack2.push(node_id);
        traverse_node(context, node.two, stack2);
        traverse_node(context, node.one, stack1);
    } else {
        if (_selectValue_18 === 'arrow-loop') {
            stack1 = node.stack.slice();
            stack1.push(node_id);
            traverse_node(context, node.one, stack1);
        } else {
            if (_selectValue_18 === 'arrow-stub') {
                decrement_arrow_count(context, node);
            } else {
                if (_selectValue_18 === 'parbegin') {
                    _collection_20 = node.procs;
                    for (proc of _collection_20) {
                        flow_no_loop(context.nodes, proc.start);
                    }
                } else {
                    if (node.final) {
                        decrement_if_count(context, node);
                    } else {
                        stack1 = node.stack.slice();
                        traverse_node(context, node.one, stack1);
                    }
                }
            }
        }
    }
}
function traverse_node(context, node_id, stack) {
    var node;
    if (node_id) {
        node = context.nodes[node_id];
        if (!node.stack) {
            node.stack = [];
            node.refs = node.prev.length;
        }
        node.refs--;
        merge_converging_branches(context, node_id, node, stack);
        if (!(node.refs > 0)) {
            recurse_traversal(context, node_id, node);
        }
    }
}
module.exports = { flow_no_loop };
},{}],7:[function(require,module,exports){
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
},{"./tools":10}],8:[function(require,module,exports){
var { buildTree } = require("./technicalTree");
const { createError, sortByProperty } = require("./tools");
const { optimizeTree } = require("./treeTools");
const { flow_no_loop } = require("./noloop")

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

function structFlow(nodes, branches, filename, translate, options) {

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

  function onError(message, nodeId) {
    throw createError(
      translate(message),
      filename,
      nodeId
    );
  }

  function structMain() {
    rewireArrows(nodes, branches);
    prepareQuestions(nodes);
    var result = [];

    for (var branch of branches) {
      flow_no_loop(nodes, branch.next, []);
    }

    for (var branch of branches) {
      var body = [];
      buildTree(nodes, branch.next, body, "<dummy id>", undefined, onError);

      result.push({
        name: branch.content,
        branchId: branch.branchId,
        id: branch.id,        
        refs: branch.prev.length,
        body: optimizeTree(body),
      });
    }

    return sortByProperty(result, "branchId");
  }

  return structMain();
}
module.exports = { structFlow, redirectNode };

},{"./noloop":6,"./technicalTree":9,"./tools":10,"./treeTools":12}],9:[function(require,module,exports){
function buildTree(nodes, nodeId, body, stopId, afterLoop, onError) {
    while (nodeId) {
        if (nodeId === afterLoop) {
            body.push({type: "break"}) 
            return
        }
        if (nodeId === stopId) {
            return;
        }
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

            buildTree(nodes, yesNodeId, transformed.yes, node.next, afterLoop, onError);
            buildTree(nodes, noNodeId, transformed.no, node.next, afterLoop, onError);
            if (next === afterLoop) {
                next = undefined
            }
        } else if (node.type == "loopbegin") {
            transformed = {
                id: node.id,
                type: "loopbegin",
                content: node.content,
                end: node.end,
                body: []
            };
            var end = nodes[node.end]
            buildTree(nodes, node.one, transformed.body, node.end, end.one, onError)
            next = node.next;   
        } else if (node.type == "loopend") {
            if (stopId !== afterLoop) {
                onError(
                    "An exit from the loop must lead to the point right after the loop end",
                    node.id
                )
            }
            return            
        } else if (node.type === "arrow-loop") {
            transformed = {
                id: node.id,
                type: "loopbegin",
                content: "",
                end: node.stub,
                body: []
            };
            var end = nodes[node.stub]
            buildTree(nodes, node.one, transformed.body, node.stub, end.one, onError)
            next = node.next;  
        } else if (node.type === "arrow-stub") {
            return
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
                buildTree(nodes, proc.start, childProc.body, undefined, undefined, buildTree)
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
            if (node.final) {
                next = undefined
            }
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
    if (!node.next) {
        return undefined
    }
    const target = nodes[node.next];
    if (target.targetTaken) {
        return undefined;
    } else {
        target.targetTaken = true;
        return node.next;
    }    
}

module.exports = {buildTree}

},{}],10:[function(require,module,exports){

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
},{}],11:[function(require,module,exports){
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

var translationsFr = {
    error: 'Erreur',
    not: 'non',
    break: 'quitter la boucle',
    and: 'et',
    or: 'ou',
    if: 'Si',
    else: 'Sinon',
    empty: 'Vide',
    'loop forever': 'Boucler indéfiniment',
    pass: 'Ignorer',
    'Only the rightmost Case icon can be empty': "Seule l'icône Case la plus à droite peut être vide",
    'Error parsing JSON': "Erreur lors de l'analyse du JSON",
    'A Loop begin icon must have content': "Une icône de début de boucle doit avoir un contenu",
    'A Question icon must have content': "Une icône Question doit avoir un contenu",
    'A Select icon must have content': "Une icône Select doit avoir un contenu",
    'Unexpected case value': 'Valeur de cas inattendue',
    'Loop end expected here': 'Fin de boucle attendue ici',
    'An exit from the loop must lead to the point right after the loop end': 'Une sortie de boucle doit mener au point situé juste après la fin de la boucle',
    'A silhouette branch is not referenced': "Une branche de silhouette n'est pas référencée",
    'Call subroutine': 'Appeler la sous-routine',
    Procedure: 'Procédure',
    'End of procedure': 'Fin de la procédure',
    Subroutine: 'Sous-routine',
    'End of subroutine': 'Fin de la sous-routine',
    Description: 'Description',
    Algorithm: 'Algorithme',
    Remarks: 'Remarques',
    Parameters: 'Paramètres',
    'Group of parallel processes': 'Groupe de processus parallèles',
    'Parallel process': 'Processus parallèle',
    'Start at': 'Commencer à',
    'Do for': 'Exécuter pendant',
    'Pause': 'Pause',
    'Start timer': 'Démarrer le minuteur'
};

var translationsDe = {
    error: 'Fehler',
    not: 'nicht',
    break: 'Schleife beenden',
    and: 'und',
    or: 'oder',
    if: 'Wenn',
    else: 'Sonst',
    empty: 'Leer',
    'loop forever': 'Endlos wiederholen',
    pass: 'Überspringen',
    'Only the rightmost Case icon can be empty': 'Nur das äußerste rechte Case-Symbol darf leer sein',
    'Error parsing JSON': 'Fehler beim Parsen von JSON',
    'A Loop begin icon must have content': 'Ein Schleifenstart-Symbol muss Inhalt haben',
    'A Question icon must have content': 'Ein Frage-Symbol muss Inhalt haben',
    'A Select icon must have content': 'Ein Auswahl-Symbol muss Inhalt haben',
    'Unexpected case value': 'Unerwarteter Fallwert',
    'Loop end expected here': 'Schleifenende wird hier erwartet',
    'An exit from the loop must lead to the point right after the loop end': 'Ein Ausgang aus der Schleife muss direkt hinter das Schleifenende führen',
    'A silhouette branch is not referenced': 'Ein Silhouettenzweig wird nicht referenziert',
    'Call subroutine': 'Unterprogramm aufrufen',
    Procedure: 'Prozedur',
    'End of procedure': 'Ende der Prozedur',
    Subroutine: 'Unterprogramm',
    'End of subroutine': 'Ende des Unterprogramms',
    Description: 'Beschreibung',
    Algorithm: 'Algorithmus',
    Remarks: 'Bemerkungen',
    Parameters: 'Parameter',
    'Group of parallel processes': 'Gruppe paralleler Prozesse',
    'Parallel process': 'Paralleler Prozess',
    'Start at': 'Starten bei',
    'Do for': 'Ausführen für',
    'Pause': 'Pause',
    'Start timer': 'Timer starten'
};

var translationsEs = {
    error: 'Error',
    not: 'no',
    break: 'salir del bucle',
    and: 'y',
    or: 'o',
    if: 'Si',
    else: 'De lo contrario',
    empty: 'Vacío',
    'loop forever': 'Repetir para siempre',
    pass: 'Omitir',
    'Only the rightmost Case icon can be empty': 'Solo el icono Case más a la derecha puede estar vacío',
    'Error parsing JSON': 'Error al analizar JSON',
    'A Loop begin icon must have content': 'Un icono de inicio de bucle debe tener contenido',
    'A Question icon must have content': 'Un icono de Pregunta debe tener contenido',
    'A Select icon must have content': 'Un icono de Selección debe tener contenido',
    'Unexpected case value': 'Valor de caso inesperado',
    'Loop end expected here': 'Se esperaba el final del bucle aquí',
    'An exit from the loop must lead to the point right after the loop end': 'Una salida del bucle debe conducir al punto inmediatamente después del final del bucle',
    'A silhouette branch is not referenced': 'Una rama de silueta no está referenciada',
    'Call subroutine': 'Llamar subrutina',
    Procedure: 'Procedimiento',
    'End of procedure': 'Fin del procedimiento',
    Subroutine: 'Subrutina',
    'End of subroutine': 'Fin de la subrutina',
    Description: 'Descripción',
    Algorithm: 'Algoritmo',
    Remarks: 'Observaciones',
    Parameters: 'Parámetros',
    'Group of parallel processes': 'Grupo de procesos paralelos',
    'Parallel process': 'Proceso paralelo',
    'Start at': 'Comenzar en',
    'Do for': 'Ejecutar durante',
    'Pause': 'Pausa',
    'Start timer': 'Iniciar temporizador'
};

var translationsLt = {
    error: 'Klaida',
    not: 'ne',
    break: 'nutraukti ciklą',
    and: 'ir',
    or: 'arba',
    if: 'Jei',
    else: 'Kitaip',
    empty: 'Tuščias',
    'loop forever': 'Kartoti amžinai',
    pass: 'Praleisti',
    'Only the rightmost Case icon can be empty': 'Tik dešiniausia Case piktograma gali būti tuščia',
    'Error parsing JSON': 'Klaida analizuojant JSON',
    'A Loop begin icon must have content': 'Ciklo pradžios piktograma turi turėti turinį',
    'A Question icon must have content': 'Klausimo piktograma turi turėti turinį',
    'A Select icon must have content': 'Pasirinkimo piktograma turi turėti turinį',
    'Unexpected case value': 'Netikėta atvejo reikšmė',
    'Loop end expected here': 'Čia tikimasi ciklo pabaigos',
    'An exit from the loop must lead to the point right after the loop end': 'Išėjimas iš ciklo turi vesti į tašką iškart po ciklo pabaigos',
    'A silhouette branch is not referenced': 'Silueto šaka nėra susieta',
    'Call subroutine': 'Kviesti paprogramę',
    Procedure: 'Procedūra',
    'End of procedure': 'Procedūros pabaiga',
    Subroutine: 'Paprogramė',
    'End of subroutine': 'Paprogramės pabaiga',
    Description: 'Aprašymas',
    Algorithm: 'Algoritmas',
    Remarks: 'Pastabos',
    Parameters: 'Parametrai',
    'Group of parallel processes': 'Lygiagrečių procesų grupė',
    'Parallel process': 'Lygiagretus procesas',
    'Start at': 'Pradėti nuo',
    'Do for': 'Vykdyti',
    'Pause': 'Pauzė',
    'Start timer': 'Paleisti laikmatį'
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
    } else if (language === "fr") {
        translations = translationsFr
    } else if (language === "de") {
        translations = translationsDe
    } else if (language === "es") {
        translations = translationsEs
    } else if (language === "lt") {
        translations = translationsLt
    } else {
        translations = {}
    }
}

module.exports = { setUpLanguage, translate };
},{}],12:[function(require,module,exports){

function optimizeTree(steps) {
    var result = []

    for (var step of steps) {
        if (step.type === "end" || step.type === "branch" || step.type === "loopend") { continue }
        if ((step.type === "action" || step.type === "comment") && !step.content) { continue }
        if (step.type === "question") {
            optimizeQuestion(step, result)
        } else if (step.type === "parbegin") {
            optimizeParbegin(step, result)
        } else if (step.type === "loop" || step.type === "loopbegin") {
            optimizeLoop(step, result)
        } else {
            result.push(step)
        }
    }

    return result
}

function optimizeParbegin(step, output) {
    var procs = []
    for (var proc of step.procs) {
        var procCopy = {
            ordinal: proc.ordinal,
            body: optimizeTree(proc.body)
        }
        procs.push(procCopy)
    }
    output.push({
        id: step.id,
        type: step.type,
        procs: procs
    })
}

function optimizeLoop(step, output) {
    output.push({
        id: step.id,
        type: "loop",
        content: step.content,
        body: optimizeTree(step.body)
    })
}

function endsWithBreak(body) {
    if (body.length === 0) {
        return false
    }
    var lastId = body.length - 1
    return body[lastId].type === "break"
}

function optimizeQuestion(step, output) {
    var yes = optimizeTree(step.yes)
    var no = optimizeTree(step.no)
    var breakYes = endsWithBreak(yes)
    var breakNo = endsWithBreak(no)

    var result = {
        id: step.id,
        side: step.side,
        type: step.type
    }
    if (breakYes && breakNo) {
        yes.pop()
        no.pop()
    }    
    if (yes.length === 0 && no.length === 0) {
        result.content = step.content
        result.yes = []
        result.no = []
    } else if (yes.length === 0) {
        result.content = {operator:"not",operand:step.content}
        result.yes = no
        result.no = []
    } else {
        result.content = step.content,
        result.yes = yes,
        result.no = no
    }
    output.push(result)
    if (breakYes && breakNo) {
        output.push({type: "break"})
    }
}


module.exports = {optimizeTree}
},{}]},{},[4]);
