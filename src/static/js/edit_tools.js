function edit_tools() {
    var unit = {};
    var utils;
    function createUndoEdit(diagram, sender) {
        var self;
        self = UndoEdit();
        self.diagram = diagram;
        self.edit = sender;
        self.currentUndo = -1;
        self.undo = [];
        return self;
    }
    function createEditStep(diagramId) {
        return {
            id: diagramId,
            changes: []
        };
    }
    function sendEditToServer(obj, edit) {
        obj.edit.pushEdit(edit);
        return;
    }
    function applyChange(diagram, change) {
        var item, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (change.id) {
                    _var2 = change.op;
                    if (_var2 === 'insert') {
                        item = utils.clone(change.fields);
                        diagram.items[change.id] = item;
                        __state = '1';
                    } else {
                        if (_var2 === 'update') {
                            item = diagram.items[change.id];
                            Object.assign(item, change.fields);
                            __state = '1';
                        } else {
                            if (_var2 === 'delete') {
                                delete diagram.items[change.id];
                                __state = '1';
                            } else {
                                throw new Error('Unexpected case value: ' + _var2);
                            }
                        }
                    }
                } else {
                    Object.assign(diagram, change.fields);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function applyEdit(diagram, edit) {
        var _var2, _var3, changes;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = edit.changes;
                _var3 = 0;
                __state = '13';
                break;
            case '13':
                if (_var3 < _var2.length) {
                    changes = _var2[_var3];
                    applyChange(diagram, changes);
                    _var3++;
                    __state = '13';
                } else {
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function getOldValues(obj, changedFields, output) {
        var oldValue, _var3, _var2, _var4, name, value;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var3 = changedFields;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '5';
                break;
            case '5':
                if (_var4 < _var2.length) {
                    name = _var2[_var4];
                    value = _var3[name];
                    if (name in obj) {
                        oldValue = obj[name];
                        __state = '7';
                    } else {
                        oldValue = '';
                        __state = '7';
                    }
                } else {
                    return;
                }
                break;
            case '7':
                output[name] = oldValue;
                _var4++;
                __state = '5';
                break;
            default:
                return;
            }
        }
    }
    function addChangeToEdit(diagram, change, undo, redo) {
        var undoChange;
        undoChange = createUndoChange(diagram, change);
        redo.changes.push(change);
        undo.changes.push(undoChange);
        applyChange(diagram, change);
        return;
    }
    function createUndoChange(diagram, change) {
        var undoChange, item, _var2, _var3;
        var __state = '19';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = change.op;
                if (_var2 === 'insert') {
                    undoChange = {
                        id: change.id,
                        op: 'delete'
                    };
                    __state = '17';
                } else {
                    if (_var2 === 'update') {
                        undoChange = {
                            id: change.id,
                            op: 'update',
                            fields: {}
                        };
                        item = diagram.items[change.id];
                        getOldValues(item, change.fields, undoChange.fields);
                        __state = '17';
                    } else {
                        if (_var2 === 'delete') {
                            item = diagram.items[change.id];
                            _var3 = utils.clone(item);
                            undoChange = {
                                id: change.id,
                                op: 'insert',
                                fields: _var3
                            };
                            __state = '17';
                        } else {
                            throw new Error('Unexpected case value: ' + _var2);
                        }
                    }
                }
                break;
            case '17':
                return undoChange;
            case '18':
                undoChange = { fields: {} };
                getOldValues(diagram, change.fields, undoChange.fields);
                __state = '17';
                break;
            case '19':
                if (change.id) {
                    __state = '2';
                } else {
                    __state = '18';
                }
                break;
            default:
                return;
            }
        }
    }
    function createEdit(obj, changes) {
        var diagram, undo, redo, edit, _var2, _var3, change;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                diagram = obj.diagram;
                undo = createEditStep(diagram.id);
                redo = createEditStep(diagram.id);
                _var2 = changes;
                _var3 = 0;
                __state = '46';
                break;
            case '10':
                return edit;
            case '23':
                if (obj.currentUndo >= 0) {
                    if (obj.currentUndo < obj.undo.length) {
                        obj.currentUndo++;
                        __state = '26';
                    } else {
                        __state = '26';
                    }
                } else {
                    obj.undo = [];
                    obj.currentUndo = 0;
                    __state = '29';
                }
                break;
            case '26':
                obj.undo = obj.undo.slice(0, obj.currentUndo);
                __state = '29';
                break;
            case '29':
                obj.undo.push(edit);
                __state = '10';
                break;
            case '46':
                if (_var3 < _var2.length) {
                    change = _var2[_var3];
                    addChangeToEdit(diagram, change, undo, redo);
                    _var3++;
                    __state = '46';
                } else {
                    undo.changes.reverse();
                    edit = {
                        undo: undo,
                        redo: redo
                    };
                    __state = '23';
                }
                break;
            default:
                return;
            }
        }
    }
    function createInitialEdit(diagram) {
        var step;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (diagram.initial) {
                    if (diagram.initial.length === 0) {
                        __state = '7';
                    } else {
                        step = createEditStep(diagram.id);
                        step.changes = diagram.initial;
                        diagram.initial = undefined;
                        return step;
                    }
                } else {
                    __state = '7';
                }
                break;
            case '7':
                return undefined;
            default:
                return;
            }
        }
    }
    function UndoEdit_save(self, changesToSave) {
        var _var2, _var3, change;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = changesToSave;
                _var3 = 0;
                __state = '5';
                break;
            case '5':
                if (_var3 < _var2.length) {
                    change = _var2[_var3];
                    sendEditToServer(self, change);
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
    function UndoEdit_forcedChange(self, changedFields) {
        var action, edit, _var3, _var2, _var4, name, value;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                action = {
                    op: 'update',
                    fields: {}
                };
                _var3 = changedFields;
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
                    name = _var2[_var4];
                    value = _var3[name];
                    if (name === 'id') {
                        __state = '5';
                    } else {
                        action.fields[name] = value;
                        __state = '5';
                    }
                } else {
                    edit = { changes: [action] };
                    applyEdit(self.diagram, edit);
                    return;
                }
                break;
            default:
                return;
            }
        }
    }
    function UndoEdit_redoEdit(self) {
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
    function UndoEdit_updateDocument(self, changes, before, after) {
        var undoRecord, initial, changesToSave, _var2, _var3, change;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                changesToSave = [];
                initial = createInitialEdit(self.diagram);
                if (initial) {
                    _var2 = initial.changes;
                    _var3 = 0;
                    __state = '18';
                } else {
                    __state = '12';
                }
                break;
            case '12':
                undoRecord = createEdit(self, changes);
                undoRecord.before = before;
                undoRecord.after = after;
                changesToSave.push(undoRecord.redo);
                return changesToSave;
            case '18':
                if (_var3 < _var2.length) {
                    change = _var2[_var3];
                    applyChange(self.diagram, change);
                    _var3++;
                    __state = '18';
                } else {
                    changesToSave.push(initial);
                    __state = '12';
                }
                break;
            default:
                return;
            }
        }
    }
    function UndoEdit_undoEdit(self) {
        var edit;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (self.currentUndo >= 0) {
                    if (self.currentUndo < self.undo.length) {
                        edit = self.undo[self.currentUndo];
                        self.currentUndo--;
                        applyEdit(self.diagram, edit.undo);
                        sendEditToServer(self, edit.undo);
                        return edit.before;
                    } else {
                        __state = '19';
                    }
                } else {
                    __state = '19';
                }
                break;
            case '19':
                return undefined;
            default:
                return;
            }
        }
    }
    function UndoEdit() {
        var self = {};
        self.save = function (changesToSave) {
            return UndoEdit_save(self, changesToSave);
        };
        self.forcedChange = function (changedFields) {
            return UndoEdit_forcedChange(self, changedFields);
        };
        self.redoEdit = function () {
            return UndoEdit_redoEdit(self);
        };
        self.updateDocument = function (changes, before, after) {
            return UndoEdit_updateDocument(self, changes, before, after);
        };
        self.undoEdit = function () {
            return UndoEdit_undoEdit(self);
        };
        return self;
    }
    unit.createUndoEdit = createUndoEdit;
    unit.UndoEdit = UndoEdit;
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
if (typeof module != 'undefined') {
    module.exports = edit_tools;
}