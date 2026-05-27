function edit_tools() {
var unit = {};
var utils;
function UndoEdit() {
    var self = { _type: 'UndoEdit' };
    function forcedChange(changedFields) {
        var action, edit, name, value;
        action = {
            op: 'update',
            fields: {}
        };
        for (name in changedFields) {
            value = changedFields[name];
            if (!(name === 'id')) {
                action.fields[name] = value;
            }
        }
        edit = { changes: [action] };
        applyEdit(self.diagram, edit);
    }
    function redoEdit() {
        var edit;
        if (self.currentUndo < self.undo.length - 1) {
            self.currentUndo++;
            edit = self.undo[self.currentUndo];
            applyEdit(self.diagram, edit.redo);
            sendEditToServer(self, edit.redo);
            return edit.after;
        } else {
            return undefined;
        }
    }
    function save(changesToSave) {
        var change;
        for (change of changesToSave) {
            sendEditToServer(self, change);
        }
    }
    function setEditSink(sender) {
        self.edit = sender;
    }
    function undoEdit() {
        var edit;
        if (self.currentUndo >= 0 && self.currentUndo < self.undo.length) {
            edit = self.undo[self.currentUndo];
            self.currentUndo--;
            applyEdit(self.diagram, edit.undo);
            sendEditToServer(self, edit.undo);
            return edit.before;
        } else {
            return undefined;
        }
    }
    function updateDocument(changes, before, after) {
        var _collection_21, change, changesToSave, initial, undoRecord;
        changesToSave = [];
        initial = createInitialEdit(self.diagram);
        if (initial) {
            _collection_21 = initial.changes;
            for (change of _collection_21) {
                applyChange(self.diagram, change);
            }
            changesToSave.push(initial);
        }
        undoRecord = createEdit(self, changes);
        undoRecord.before = before;
        undoRecord.after = after;
        changesToSave.push(undoRecord.redo);
        return changesToSave;
    }
    self.forcedChange = forcedChange;
    self.redoEdit = redoEdit;
    self.save = save;
    self.setEditSink = setEditSink;
    self.undoEdit = undoEdit;
    self.updateDocument = updateDocument;
    return self;
}
function addChangeToEdit(diagram, change, undo, redo) {
    var undoChange;
    undoChange = createUndoChange(diagram, change);
    redo.changes.push(change);
    undo.changes.push(undoChange);
    applyChange(diagram, change);
}
function applyChange(diagram, change) {
    var _selectValue_23, item;
    if (change.id) {
        _selectValue_23 = change.op;
        if (_selectValue_23 === 'insert') {
            item = utils.clone(change.fields);
            diagram.items[change.id] = item;
        } else {
            if (_selectValue_23 === 'update') {
                item = diagram.items[change.id];
                Object.assign(item, change.fields);
            } else {
                if (!(_selectValue_23 === 'delete')) {
                    throw new Error('Unexpected case value: ' + _selectValue_23);
                }
                delete diagram.items[change.id];
            }
        }
    } else {
        Object.assign(diagram, change.fields);
    }
}
function applyEdit(diagram, edit) {
    var _collection_25, changes;
    _collection_25 = edit.changes;
    for (changes of _collection_25) {
        applyChange(diagram, changes);
    }
}
function createEdit(obj, changes) {
    var MaxUndo, change, diagram, edit, redo, undo;
    diagram = obj.diagram;
    undo = createEditStep(diagram.id);
    redo = createEditStep(diagram.id);
    for (change of changes) {
        addChangeToEdit(diagram, change, undo, redo);
    }
    undo.changes.reverse();
    edit = {
        undo: undo,
        redo: redo
    };
    if (obj.currentUndo >= 0) {
        if (obj.currentUndo < obj.undo.length) {
            obj.currentUndo++;
        }
        obj.undo = obj.undo.slice(0, obj.currentUndo);
    } else {
        obj.undo = [];
        obj.currentUndo = 0;
    }
    obj.undo.push(edit);
    MaxUndo = 50;
    while (true) {
        if (obj.undo.length > MaxUndo) {
            obj.undo.shift();
        } else {
            break;
        }
    }
    return edit;
}
function createEditStep(diagramId) {
    return {
        id: diagramId,
        changes: []
    };
}
function createInitialEdit(diagram) {
    var step;
    if (diagram.initial && !(diagram.initial.length === 0)) {
        step = createEditStep(diagram.id);
        step.changes = diagram.initial;
        diagram.initial = undefined;
        return step;
    } else {
        return undefined;
    }
}
function createUndoChange(diagram, change) {
    var _selectValue_27, item, undoChange;
    if (change.id) {
        _selectValue_27 = change.op;
        if (_selectValue_27 === 'insert') {
            undoChange = {
                id: change.id,
                op: 'delete'
            };
        } else {
            if (_selectValue_27 === 'update') {
                undoChange = {
                    id: change.id,
                    op: 'update',
                    fields: {}
                };
                item = diagram.items[change.id];
                getOldValues(item, change.fields, undoChange.fields);
            } else {
                if (!(_selectValue_27 === 'delete')) {
                    throw new Error('Unexpected case value: ' + _selectValue_27);
                }
                item = diagram.items[change.id];
                undoChange = {
                    id: change.id,
                    op: 'insert',
                    fields: utils.clone(item)
                };
            }
        }
        return undoChange;
    } else {
        undoChange = { fields: {} };
        getOldValues(diagram, change.fields, undoChange.fields);
        return undoChange;
    }
}
function createUndoEdit(diagram, sender) {
    var self;
    self = UndoEdit();
    self.diagram = diagram;
    self.edit = sender;
    self.currentUndo = -1;
    self.undo = [];
    return self;
}
function getOldValues(obj, changedFields, output) {
    var name, oldValue, value;
    for (name in changedFields) {
        value = changedFields[name];
        if (name in obj) {
            oldValue = obj[name];
        } else {
            oldValue = '';
        }
        output[name] = oldValue;
    }
}
function sendEditToServer(obj, edit) {
    obj.edit.pushEdit(edit);
}
unit.UndoEdit = UndoEdit;
unit.createUndoEdit = createUndoEdit;
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