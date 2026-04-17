function utils() {
var unit = {};

function comparerAsc(property, left, right) {
    var leftValue, rightValue;
    leftValue = left[property];
    rightValue = right[property];
    if (typeof leftValue === 'string' && typeof rightValue === 'string') {
        leftValue = leftValue.toLowerCase();
        rightValue = rightValue.toLowerCase();
    }
    if (leftValue < rightValue) {
        return -1;
    } else {
        if (leftValue > rightValue) {
            return 1;
        } else {
            return 0;
        }
    }
}
function comparerDesc(property, left, right) {
    var comp;
    comp = comparerAsc(property, left, right);
    return -1 * comp;
}
function deepCloneCore(visited, obj) {
    var _selectValue_38, array, copy, item, key, value;
    if (obj === undefined || obj === null) {
        return undefined;
    } else {
        _selectValue_38 = typeof obj;
        if (_selectValue_38 === 'number' || (_selectValue_38 === 'boolean' || _selectValue_38 === 'string' || _selectValue_38 === 'bigint' || _selectValue_38 === 'function' || _selectValue_38 === 'symbol' || obj instanceof RegExp || obj instanceof Date)) {
            return obj;
        } else {
            if (visited.has(obj)) {
                throw new Error('deepClone: cycle detected');
            } else {
                visited.add(obj);
                if (Array.isArray(obj)) {
                    array = [];
                    for (item of obj) {
                        array.push(deepCloneCore(visited, item));
                    }
                    return array;
                } else {
                    copy = {};
                    for (key in obj) {
                        value = obj[key];
                        copy[key] = deepCloneCore(visited, value);
                    }
                    return copy;
                }
            }
        }
    }
}
function addRange(from, to) {
    var item;
    if (from) {
        for (item of from) {
            to.push(item);
        }
    }
}
function FilenameChecker() {
    var self = { _type: 'FilenameChecker' };
    function isGoodChar(ch) {
        if (ch in self.bad) {
            return false;
        } else {
            return true;
        }
    }
    self.isGoodChar = isGoodChar;
    return self;
}
function clone(src) {
    var dst;
    if (src) {
        dst = {};
        Object.assign(dst, src);
        return dst;
    } else {
        return src;
    }
}
function contains(array, element) {
    if (array.indexOf(element) === -1) {
        return false;
    } else {
        return true;
    }
}
function copyFieldsWithValue(dst, src, fields) {
    var field, value;
    for (field of fields) {
        value = src[field];
        if (hasValue(value)) {
            dst[field] = value;
        }
    }
}
function copyNotNull(dst, src, fields) {
    var field, value;
    for (field of fields) {
        value = src[field];
        if (!(value === undefined || value === null)) {
            dst[field] = value;
        }
    }
}
function createFilenameChecker() {
    var bad, self;
    bad = {};
    bad['#'] = true;
    bad['%'] = true;
    bad['&'] = true;
    bad['{'] = true;
    bad['}'] = true;
    bad['/'] = true;
    bad['\\'] = true;
    bad[':'] = true;
    bad['"'] = true;
    bad['\''] = true;
    bad['?'] = true;
    bad['<'] = true;
    bad['>'] = true;
    bad['|'] = true;
    bad['`'] = true;
    bad['$'] = true;
    bad['='] = true;
    bad['!'] = true;
    bad['@'] = true;
    bad['+'] = true;
    bad['*'] = true;
    self = FilenameChecker();
    self.bad = bad;
    return self;
}
function debounce(action, delay) {
    var _obj_;
    _obj_ = debounce_create(action, delay);
    return _obj_.run();
}
function debounceAsync(action, delay) {
    var _obj_;
    _obj_ = debounceAsync_create(action, delay);
    return _obj_.run();
}
function deepClone(obj) {
    var visited;
    visited = new Set();
    return deepCloneCore(visited, obj);
}
function findBy(array, property, value) {
    var item;
    array = array || [];
    for (item of array) {
        if (item[property] === value) {
            return item;
        }
    }
    return undefined;
}
function findFromEnd(text, needle, start) {
    var i;
    for (i = text.length - start - 1; i >= 0; i--) {
        if (text[i] === needle) {
            return i;
        }
    }
    return -1;
}
function findIndex(array, property, value) {
    var i, item, length;
    array = array || [];
    length = array.length;
    for (i = 0; i < length; i++) {
        item = array[i];
        if (item[property] === value) {
            return i;
        }
    }
    return -1;
}
function forceDebounce(action, delay) {
    var _obj_;
    _obj_ = forceDebounce_create(action, delay);
    return _obj_.run();
}
function getNowMs() {
    var date;
    date = new Date();
    return date.getTime();
}
function hasValue(value) {
    if (value === undefined || value === '' || value === null) {
        return false;
    } else {
        return true;
    }
}
function hexByteToString(value) {
    return ('00' + value.toString(16)).substr(-2);
}
function isSpace(code) {
    if (code === 9 || code === 10 || code === 32 || code === 160 || code === 133 || code === 32) {
        return true;
    } else {
        return false;
    }
}
function isSubset(larger, smaller) {
    var _, smallKey;
    if (larger) {
        for (smallKey in smaller) {
            _ = smaller[smallKey];
            if (!(smallKey in larger)) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}
function last(array) {
    var length;
    length = array.length;
    if (length === 0) {
        return undefined;
    } else {
        return array[length - 1];
    }
}
function multiMapAdd(map, key, value) {
    var bucket;
    bucket = map[key];
    if (!bucket) {
        bucket = [];
        map[key] = bucket;
    }
    bucket.push(value);
}
function objectValues(obj) {
    var key, result, value;
    result = [];
    for (key in obj) {
        value = obj[key];
        result.push(value);
    }
    return result;
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function remove(array, item) {
    var index;
    index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
function removeBy(array, property, value) {
    var index;
    index = findIndex(array, property, value);
    if (index !== -1) {
        array.splice(index, 1);
    }
}
function sanitizeFilename(raw) {
    var ch, checker, code, i, result;
    checker = createFilenameChecker();
    result = '';
    for (i = 0; i < raw.length; i++) {
        ch = raw[i];
        code = raw.charCodeAt(i);
        if (isSpace(code)) {
            result += ' ';
        } else {
            if (code > 32) {
                if (checker.isGoodChar(ch)) {
                    result += ch;
                } else {
                    result += ' ';
                }
            }
        }
    }
    return result.trim();
}
function sortBy(array, property, direction) {
    var sorter;
    if (array) {
        direction = direction || 'asc';
        direction = direction.toLowerCase();
        if (direction === 'asc') {
            sorter = comparerAsc;
        } else {
            sorter = comparerDesc;
        }
        array.sort(function (left, right) {
            return sorter(property, left, right);
        });
    }
}
function startDebounce(action, delay) {
    var runner;
    runner = debounce_create(action, delay);
    runner.run();
    return runner.onInput;
}
function subtract(from, what) {
    var key, result, value;
    result = {};
    for (key in from) {
        value = from[key];
        if (!(key in what)) {
            result[key] = value;
        }
    }
    return result;
}
function subtractArrays(left, right) {
    return left.filter(function (item) {
        return right.indexOf(item) === -1;
    });
}
function take(array, count) {
    return array.slice(0, count);
}
function debounce_create(action, delay) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'debounce',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* debounce_main() {
        var _branch_, _eventType_, _event_, msg, tobj;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '6';
                me._busy = false;
                _event_ = yield;
                msg = _event_[1];
                _branch_ = 'Waiting';
                break;
            case 'Waiting':
                tobj = setTimeout(function () {
                    me.onTimeout();
                }, delay);
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onInput') {
                    msg = _event_[1];
                    clearTimeout(tobj);
                    _branch_ = 'Waiting';
                } else {
                    if (_eventType_ !== 'onTimeout') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    action(msg);
                    _branch_ = 'Idle';
                }
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function debounce_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = debounce_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = debounce_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onInput = function (msg) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '6':
        case '11':
            _args_ = [];
            _args_.push('onInput');
            _args_.push(msg);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function debounceAsync_create(action, delay) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'debounceAsync',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* debounceAsync_main() {
        var _branch_, _eventType_, _event_, msg, nextRequested, tobj;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '6';
                me._busy = false;
                _event_ = yield;
                msg = _event_[1];
                _branch_ = 'Waiting';
                break;
            case 'Waiting':
                tobj = setTimeout(me.onTimeout, delay);
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onInput') {
                    msg = _event_[1];
                    clearTimeout(tobj);
                    _branch_ = 'Waiting';
                } else {
                    if (_eventType_ !== 'onTimeout') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    _branch_ = 'Start process';
                }
                break;
            case 'Start process':
                nextRequested = false;
                action().then(me.done);
                _branch_ = 'Working';
                break;
            case 'Working':
                me.state = '15';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onInput') {
                    msg = _event_[1];
                    nextRequested = true;
                    _branch_ = 'Working';
                } else {
                    if (_eventType_ !== 'done') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    if (nextRequested) {
                        _branch_ = 'Waiting';
                    } else {
                        _branch_ = 'Idle';
                    }
                }
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function debounceAsync_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = debounceAsync_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = debounceAsync_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onInput = function (msg) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '6':
        case '11':
        case '15':
            _args_ = [];
            _args_.push('onInput');
            _args_.push(msg);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.done = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '15':
            _args_ = [];
            _args_.push('done');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function forceDebounce_create(action, delay) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'forceDebounce',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* forceDebounce_main() {
        var _branch_, _eventType_, _event_, msg, tobj;
        _branch_ = 'Idle';
        while (true) {
            switch (_branch_) {
            case 'Idle':
                me.state = '14';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onInput') {
                    msg = _event_[1];
                    _branch_ = 'Waiting';
                } else {
                    if (_eventType_ !== 'force') {
                        throw new Error('Unexpected case value: ' + _eventType_);
                    }
                    msg = _event_[1];
                    action(msg);
                    _branch_ = 'Idle';
                }
                break;
            case 'Waiting':
                tobj = setTimeout(function () {
                    me.onTimeout();
                }, delay);
                me.state = '11';
                me._busy = false;
                _event_ = yield;
                _eventType_ = _event_[0];
                if (_eventType_ === 'onInput') {
                    msg = _event_[1];
                    clearTimeout(tobj);
                    _branch_ = 'Waiting';
                } else {
                    if (_eventType_ === 'force') {
                        msg = _event_[1];
                        clearTimeout(tobj);
                        action(msg);
                    } else {
                        if (_eventType_ === 'onTimeout') {
                            action(msg);
                        } else {
                            if (_eventType_ !== 'reset') {
                                throw new Error('Unexpected case value: ' + _eventType_);
                            }
                            clearTimeout(tobj);
                        }
                    }
                    _branch_ = 'Idle';
                }
                break;
            default:
                _topResolve_();
                return;
            }
        }
        _topResolve_();
    }
    function forceDebounce_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = forceDebounce_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = forceDebounce_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onInput = function (msg) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '14':
            _args_ = [];
            _args_.push('onInput');
            _args_.push(msg);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.force = function (msg) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
        case '14':
            _args_ = [];
            _args_.push('force');
            _args_.push(msg);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.onTimeout = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('onTimeout');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    me.reset = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '11':
            _args_ = [];
            _args_.push('reset');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
unit.addRange = addRange;
unit.FilenameChecker = FilenameChecker;
unit.clone = clone;
unit.contains = contains;
unit.copyFieldsWithValue = copyFieldsWithValue;
unit.copyNotNull = copyNotNull;
unit.createFilenameChecker = createFilenameChecker;
unit.debounce = debounce;
unit.debounceAsync = debounceAsync;
unit.deepClone = deepClone;
unit.findBy = findBy;
unit.findFromEnd = findFromEnd;
unit.findIndex = findIndex;
unit.forceDebounce = forceDebounce;
unit.getNowMs = getNowMs;
unit.hasValue = hasValue;
unit.hexByteToString = hexByteToString;
unit.isSpace = isSpace;
unit.isSubset = isSubset;
unit.last = last;
unit.multiMapAdd = multiMapAdd;
unit.objectValues = objectValues;
unit.random = random;
unit.remove = remove;
unit.removeBy = removeBy;
unit.sanitizeFilename = sanitizeFilename;
unit.sortBy = sortBy;
unit.startDebounce = startDebounce;
unit.subtract = subtract;
unit.subtractArrays = subtractArrays;
unit.take = take;
unit.debounce_create = debounce_create;
unit.debounceAsync_create = debounceAsync_create;
unit.forceDebounce_create = forceDebounce_create;
return unit;
}