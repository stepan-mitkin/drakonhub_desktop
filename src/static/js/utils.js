function utils() {
    var unit = {};
    function hasValue(value) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (value === undefined) {
                    __state = '8';
                } else {
                    if (value === '') {
                        __state = '8';
                    } else {
                        if (value === null) {
                            __state = '8';
                        } else {
                            return true;
                        }
                    }
                }
                break;
            case '8':
                return false;
            default:
                return;
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
    function debounce_create(action, delay) {
        var tobj, msg;
        var me = {
            state: '2',
            type: 'debounce'
        };
        function _main_debounce(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '6';
                        return;
                    case '5':
                        tobj = setTimeout(function () {
                            me.onTimeout();
                        }, delay);
                        me.state = '11';
                        return;
                    case '12':
                        clearTimeout(tobj);
                        me.state = '5';
                        break;
                    case '13':
                        action(msg);
                        me.state = '2';
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
                me.onInput = function (_msg_) {
                    msg = _msg_;
                    switch (me.state) {
                    case '6':
                        me.state = '5';
                        _main_debounce(__resolve, __reject);
                        break;
                    case '11':
                        me.state = '12';
                        _main_debounce(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.onTimeout = function () {
                    switch (me.state) {
                    case '11':
                        me.state = '13';
                        _main_debounce(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_debounce(__resolve, __reject);
            });
        };
        return me;
    }
    function debounce(action, delay) {
        var __obj = debounce_create(action, delay);
        return __obj.run();
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
    function sanitizeFilename(raw) {
        var ch, code, result, checker, i, _var2, _var3, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                checker = createFilenameChecker();
                result = '';
                i = 0;
                __state = '5';
                break;
            case '4':
                i++;
                __state = '5';
                break;
            case '5':
                if (i < raw.length) {
                    ch = raw[i];
                    code = raw.charCodeAt(i);
                    _var2 = isSpace(code);
                    if (_var2) {
                        result += ' ';
                        __state = '4';
                    } else {
                        if (code > 32) {
                            _var3 = checker.isGoodChar(ch);
                            if (_var3) {
                                result += ch;
                                __state = '4';
                            } else {
                                result += ' ';
                                __state = '4';
                            }
                        } else {
                            __state = '4';
                        }
                    }
                } else {
                    _var4 = result.trim();
                    return _var4;
                }
                break;
            default:
                return;
            }
        }
    }
    function hexByteToString(value) {
        var _var2, _var3;
        _var3 = value.toString(16);
        _var2 = ('00' + _var3).substr(-2);
        return _var2;
    }
    function findBy(array, property, value) {
        var _var2, _var3, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                array = array || [];
                _var2 = array;
                _var3 = 0;
                __state = '6';
                break;
            case '6':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    if (item[property] === value) {
                        return item;
                    } else {
                        _var3++;
                        __state = '6';
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
    function isSpace(code) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (code === 9) {
                    __state = '15';
                } else {
                    if (code === 10) {
                        __state = '15';
                    } else {
                        if (code === 32) {
                            __state = '15';
                        } else {
                            if (code === 160) {
                                __state = '15';
                            } else {
                                if (code === 133) {
                                    __state = '15';
                                } else {
                                    if (code === 32) {
                                        __state = '15';
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case '15':
                return true;
            default:
                return;
            }
        }
    }
    function removeBy(array, property, value) {
        var index;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                index = findIndex(array, property, value);
                if (index === -1) {
                    __state = '1';
                } else {
                    array.splice(index, 1);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function deepCloneCore(visited, obj) {
        var array, copy, _var2, _var3, _var4, item, _var6, _var5, _var7, key, value, _var8, _var9, _var10;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (obj === undefined) {
                    __state = '3';
                } else {
                    if (obj === null) {
                        __state = '3';
                    } else {
                        _var2 = typeof obj;
                        if (_var2 === 'number') {
                            __state = '36';
                        } else {
                            if (_var2 === 'boolean') {
                                __state = '36';
                            } else {
                                if (_var2 === 'string') {
                                    __state = '36';
                                } else {
                                    if (_var2 === 'bigint') {
                                        __state = '36';
                                    } else {
                                        if (_var2 === 'function') {
                                            __state = '36';
                                        } else {
                                            if (_var2 === 'symbol') {
                                                __state = '36';
                                            } else {
                                                if (obj instanceof RegExp) {
                                                    __state = '36';
                                                } else {
                                                    if (obj instanceof Date) {
                                                        __state = '36';
                                                    } else {
                                                        _var10 = visited.has(obj);
                                                        if (_var10) {
                                                            throw new Error('deepClone: cycle detected');
                                                        } else {
                                                            visited.add(obj);
                                                            _var8 = Array.isArray(obj);
                                                            if (_var8) {
                                                                array = [];
                                                                _var3 = obj;
                                                                _var4 = 0;
                                                                __state = '32';
                                                            } else {
                                                                copy = {};
                                                                _var6 = obj;
                                                                _var5 = Object.keys(_var6);
                                                                _var7 = 0;
                                                                __state = '43';
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
                break;
            case '3':
                return undefined;
            case '32':
                if (_var4 < _var3.length) {
                    item = _var3[_var4];
                    _var9 = deepCloneCore(visited, item);
                    array.push(_var9);
                    _var4++;
                    __state = '32';
                } else {
                    return array;
                }
                break;
            case '36':
                return obj;
            case '43':
                if (_var7 < _var5.length) {
                    key = _var5[_var7];
                    value = _var6[key];
                    copy[key] = deepCloneCore(visited, value);
                    _var7++;
                    __state = '43';
                } else {
                    return copy;
                }
                break;
            default:
                return;
            }
        }
    }
    function comparerAsc(property, left, right) {
        var leftValue, rightValue;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                leftValue = left[property];
                rightValue = right[property];
                if (typeof leftValue === 'string') {
                    if (typeof rightValue === 'string') {
                        leftValue = leftValue.toLowerCase();
                        rightValue = rightValue.toLowerCase();
                        __state = '4';
                    } else {
                        __state = '4';
                    }
                } else {
                    __state = '4';
                }
                break;
            case '4':
                if (leftValue < rightValue) {
                    return -1;
                } else {
                    if (leftValue > rightValue) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            default:
                return;
            }
        }
    }
    function comparerDesc(property, left, right) {
        var comp;
        comp = comparerAsc(property, left, right);
        return -1 * comp;
    }
    function debounceAsync_create(action, delay) {
        var tobj, nextRequested, msg, _var2;
        var me = {
            state: '2',
            type: 'debounceAsync'
        };
        function _main_debounceAsync(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '6';
                        return;
                    case '5':
                        tobj = setTimeout(me.onTimeout, delay);
                        me.state = '11';
                        return;
                    case '12':
                        clearTimeout(tobj);
                        me.state = '5';
                        break;
                    case '14':
                        me.state = '15';
                        return;
                    case '20':
                        if (nextRequested) {
                            me.state = '5';
                        } else {
                            me.state = '2';
                        }
                        break;
                    case '21':
                        nextRequested = true;
                        me.state = '14';
                        break;
                    case '23':
                        nextRequested = false;
                        _var2 = action();
                        _var2.then(me.done);
                        me.state = '14';
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
                me.onInput = function (_msg_) {
                    msg = _msg_;
                    switch (me.state) {
                    case '6':
                        me.state = '5';
                        _main_debounceAsync(__resolve, __reject);
                        break;
                    case '11':
                        me.state = '12';
                        _main_debounceAsync(__resolve, __reject);
                        break;
                    case '15':
                        me.state = '21';
                        _main_debounceAsync(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.onTimeout = function () {
                    switch (me.state) {
                    case '11':
                        me.state = '23';
                        _main_debounceAsync(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.done = function () {
                    switch (me.state) {
                    case '15':
                        me.state = '20';
                        _main_debounceAsync(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_debounceAsync(__resolve, __reject);
            });
        };
        return me;
    }
    function debounceAsync(action, delay) {
        var __obj = debounceAsync_create(action, delay);
        return __obj.run();
    }
    function remove(array, item) {
        var index;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                index = array.indexOf(item);
                if (index === -1) {
                    __state = '1';
                } else {
                    array.splice(index, 1);
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function multiMapAdd(map, key, value) {
        var bucket;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                bucket = map[key];
                if (bucket) {
                    __state = '8';
                } else {
                    bucket = [];
                    map[key] = bucket;
                    __state = '8';
                }
                break;
            case '8':
                bucket.push(value);
                return;
            default:
                return;
            }
        }
    }
    function addRange(from, to) {
        var _var2, _var3, item;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (from) {
                    _var2 = from;
                    _var3 = 0;
                    __state = '6';
                } else {
                    __state = '1';
                }
                break;
            case '6':
                if (_var3 < _var2.length) {
                    item = _var2[_var3];
                    to.push(item);
                    _var3++;
                    __state = '6';
                } else {
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function subtract(from, what) {
        var result, _var3, _var2, _var4, key, value;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                result = {};
                _var3 = from;
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
                    key = _var2[_var4];
                    value = _var3[key];
                    if (key in what) {
                        __state = '5';
                    } else {
                        result[key] = value;
                        __state = '5';
                    }
                } else {
                    return result;
                }
                break;
            default:
                return;
            }
        }
    }
    function getNowMs() {
        var date, _var2;
        date = new Date();
        _var2 = date.getTime();
        return _var2;
    }
    function subtractArrays(left, right) {
        var _var2, _var3;
        _var2 = left.filter(function (item) {
            _var3 = right.indexOf(item);
            return _var3 === -1;
        });
        return _var2;
    }
    function sortBy(array, property, direction) {
        var sorter, _var2;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '2':
                if (array) {
                    direction = direction || 'asc';
                    direction = direction.toLowerCase();
                    if (direction === 'asc') {
                        sorter = comparerAsc;
                        __state = '7';
                    } else {
                        sorter = comparerDesc;
                        __state = '7';
                    }
                } else {
                    __state = '1';
                }
                break;
            case '7':
                array.sort(function (left, right) {
                    _var2 = sorter(property, left, right);
                    return _var2;
                });
                __state = '1';
                break;
            default:
                return;
            }
        }
    }
    function deepClone(obj) {
        var visited, _var2;
        visited = new Set();
        _var2 = deepCloneCore(visited, obj);
        return _var2;
    }
    function findIndex(array, property, value) {
        var item, length, i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                array = array || [];
                length = array.length;
                i = 0;
                __state = '6';
                break;
            case '6':
                if (i < length) {
                    item = array[i];
                    if (item[property] === value) {
                        return i;
                    } else {
                        i++;
                        __state = '6';
                    }
                } else {
                    return -1;
                }
                break;
            default:
                return;
            }
        }
    }
    function startDebounce(action, delay) {
        var runner;
        runner = debounce_create(action, delay);
        runner.run();
        return runner.onInput;
    }
    function random(min, max) {
        var _var2;
        _var2 = Math.random();
        return _var2 * (max - min) + min;
    }
    function findFromEnd(text, needle, start) {
        var i;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                i = text.length - start - 1;
                __state = '5';
                break;
            case '5':
                if (i >= 0) {
                    if (text[i] === needle) {
                        return i;
                    } else {
                        i--;
                        __state = '5';
                    }
                } else {
                    return -1;
                }
                break;
            default:
                return;
            }
        }
    }
    function take(array, count) {
        var _var2;
        _var2 = array.slice(0, count);
        return _var2;
    }
    function contains(array, element) {
        var _var2;
        _var2 = array.indexOf(element);
        if (_var2 === -1) {
            return false;
        } else {
            return true;
        }
    }
    function forceDebounce_create(action, delay) {
        var tobj, msg;
        var me = {
            state: '2',
            type: 'forceDebounce'
        };
        function _main_forceDebounce(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        me.state = '14';
                        return;
                    case '5':
                        tobj = setTimeout(function () {
                            me.onTimeout();
                        }, delay);
                        me.state = '11';
                        return;
                    case '12':
                        clearTimeout(tobj);
                        me.state = '5';
                        break;
                    case '17':
                        action(msg);
                        me.state = '2';
                        break;
                    case '19':
                        clearTimeout(tobj);
                        me.state = '20';
                        break;
                    case '20':
                        action(msg);
                        me.state = '2';
                        break;
                    case '22':
                        clearTimeout(tobj);
                        me.state = '2';
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
                me.onInput = function (_msg_) {
                    msg = _msg_;
                    switch (me.state) {
                    case '11':
                        me.state = '12';
                        _main_forceDebounce(__resolve, __reject);
                        break;
                    case '14':
                        me.state = '5';
                        _main_forceDebounce(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.force = function (_msg_) {
                    msg = _msg_;
                    switch (me.state) {
                    case '11':
                        me.state = '19';
                        _main_forceDebounce(__resolve, __reject);
                        break;
                    case '14':
                        me.state = '17';
                        _main_forceDebounce(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.onTimeout = function () {
                    switch (me.state) {
                    case '11':
                        me.state = '20';
                        _main_forceDebounce(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                me.reset = function () {
                    switch (me.state) {
                    case '11':
                        me.state = '22';
                        _main_forceDebounce(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_forceDebounce(__resolve, __reject);
            });
        };
        return me;
    }
    function forceDebounce(action, delay) {
        var __obj = forceDebounce_create(action, delay);
        return __obj.run();
    }
    function isSubset(larger, smaller) {
        var _var3, _var2, _var4, smallKey, _;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (larger) {
                    _var3 = smaller;
                    _var2 = Object.keys(_var3);
                    _var4 = 0;
                    __state = '7';
                } else {
                    __state = '5';
                }
                break;
            case '5':
                return false;
            case '7':
                if (_var4 < _var2.length) {
                    smallKey = _var2[_var4];
                    _ = _var3[smallKey];
                    if (smallKey in larger) {
                        _var4++;
                        __state = '7';
                    } else {
                        __state = '5';
                    }
                } else {
                    return true;
                }
                break;
            default:
                return;
            }
        }
    }
    function copyFieldsWithValue(dst, src, fields) {
        var value, _var2, _var3, field, _var4;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                _var2 = fields;
                _var3 = 0;
                __state = '5';
                break;
            case '4':
                _var3++;
                __state = '5';
                break;
            case '5':
                if (_var3 < _var2.length) {
                    field = _var2[_var3];
                    value = src[field];
                    _var4 = hasValue(value);
                    if (_var4) {
                        dst[field] = value;
                        __state = '4';
                    } else {
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
    function objectValues(obj) {
        var result, _var3, _var2, _var4, key, value;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                result = [];
                _var3 = obj;
                _var2 = Object.keys(_var3);
                _var4 = 0;
                __state = '6';
                break;
            case '6':
                if (_var4 < _var2.length) {
                    key = _var2[_var4];
                    value = _var3[key];
                    result.push(value);
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
    function FilenameChecker_isGoodChar(self, ch) {
        if (ch in self.bad) {
            return false;
        } else {
            return true;
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
    function FilenameChecker() {
        var self = {};
        self.isGoodChar = function (ch) {
            return FilenameChecker_isGoodChar(self, ch);
        };
        return self;
    }
    unit.hasValue = hasValue;
    unit.createFilenameChecker = createFilenameChecker;
    unit.debounce_create = debounce_create;
    unit.debounce = debounce;
    unit.clone = clone;
    unit.sanitizeFilename = sanitizeFilename;
    unit.hexByteToString = hexByteToString;
    unit.findBy = findBy;
    unit.isSpace = isSpace;
    unit.removeBy = removeBy;
    unit.debounceAsync_create = debounceAsync_create;
    unit.debounceAsync = debounceAsync;
    unit.remove = remove;
    unit.multiMapAdd = multiMapAdd;
    unit.addRange = addRange;
    unit.subtract = subtract;
    unit.getNowMs = getNowMs;
    unit.subtractArrays = subtractArrays;
    unit.sortBy = sortBy;
    unit.deepClone = deepClone;
    unit.findIndex = findIndex;
    unit.startDebounce = startDebounce;
    unit.random = random;
    unit.findFromEnd = findFromEnd;
    unit.take = take;
    unit.contains = contains;
    unit.forceDebounce_create = forceDebounce_create;
    unit.forceDebounce = forceDebounce;
    unit.isSubset = isSubset;
    unit.copyFieldsWithValue = copyFieldsWithValue;
    unit.objectValues = objectValues;
    unit.last = last;
    unit.FilenameChecker = FilenameChecker;
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = utils;
}