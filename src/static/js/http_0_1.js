function http_0_1() {
    var unit = {};
    function onDataWhenReady(self, request) {
        var result;
        var __state = '25';
        while (true) {
            switch (__state) {
            case '1':
                return;
            case '25':
                if (request.readyState === 4) {
                    result = {
                        responseText: request.responseText,
                        status: request.status
                    };
                    self.onDataReady(result);
                    __state = '1';
                } else {
                    __state = '1';
                }
                break;
            default:
                return;
            }
        }
    }
    function main() {
        return;
    }
    function uploadFileToServer_create(url, name, file) {
        var request, formData, _var2;
        var me = {
            state: '2',
            type: 'uploadFileToServer'
        };
        function _main_uploadFileToServer(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        request = new XMLHttpRequest();
                        formData = new FormData();
                        request.onreadystatechange = me.handleBasicStatusChange;
                        formData.append(name, file);
                        request.open('POST', url);
                        request.send(formData);
                        me.state = '9';
                        break;
                    case '8':
                        if (request.readyState === 4) {
                            if (request.status === 200) {
                                me.state = '11';
                            } else {
                                if (request.status === 204) {
                                    me.state = '11';
                                } else {
                                    _var2 = tr('An error has occurred');
                                    widgets.showErrorSnack(_var2);
                                    me.state = undefined;
                                    __resolve(false);
                                    return;
                                }
                            }
                        } else {
                            me.state = '9';
                        }
                        break;
                    case '9':
                        me.state = '7';
                        return;
                    case '11':
                        me.state = undefined;
                        __resolve(true);
                        return;
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
                me.handleBasicStatusChange = function () {
                    switch (me.state) {
                    case '7':
                        me.state = '8';
                        _main_uploadFileToServer(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_uploadFileToServer(__resolve, __reject);
            });
        };
        return me;
    }
    function uploadFileToServer(url, name, file) {
        var __obj = uploadFileToServer_create(url, name, file);
        return __obj.run();
    }
    function isNetworkError(ex) {
        var str, _var2, _var3;
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (ex) {
                    str = ex.toString();
                    _var2 = str.indexOf('NetworkError');
                    if (_var2 === -1) {
                        _var3 = str.indexOf('HTTP error');
                        if (_var3 === -1) {
                            __state = '8';
                        } else {
                            __state = '9';
                        }
                    } else {
                        __state = '9';
                    }
                } else {
                    __state = '8';
                }
                break;
            case '8':
                return false;
            case '9':
                return true;
            default:
                return;
            }
        }
    }
    function isSuccess(response) {
        var __state = '2';
        while (true) {
            switch (__state) {
            case '2':
                if (response.status === 200) {
                    __state = '3';
                } else {
                    if (response.status === 204) {
                        __state = '3';
                    } else {
                        return false;
                    }
                }
                break;
            case '3':
                return true;
            default:
                return;
            }
        }
    }
    function sendRequest_create(method, url, body, headers) {
        var request, _var3, _var2, _var4, header, value, result;
        var me = {
            state: '2',
            type: 'sendRequest'
        };
        function _main_sendRequest(__resolve, __reject) {
            try {
                while (true) {
                    switch (me.state) {
                    case '2':
                        request = new XMLHttpRequest();
                        request.onreadystatechange = function () {
                            onDataWhenReady(me, request);
                        };
                        request.open(method, url, true);
                        me.state = '17';
                        break;
                    case '16':
                        me.state = '25';
                        return;
                    case '17':
                        if (headers) {
                            _var3 = headers;
                            _var2 = Object.keys(_var3);
                            _var4 = 0;
                            me.state = '20';
                        } else {
                            me.state = '18';
                        }
                        break;
                    case '18':
                        request.send(body);
                        me.state = '16';
                        break;
                    case '20':
                        if (_var4 < _var2.length) {
                            header = _var2[_var4];
                            value = _var3[header];
                            request.setRequestHeader(header, value);
                            _var4++;
                            me.state = '20';
                        } else {
                            me.state = '18';
                        }
                        break;
                    case '26':
                        me.state = undefined;
                        __resolve(result);
                        return;
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
                me.onDataReady = function (_result_) {
                    result = _result_;
                    switch (me.state) {
                    case '25':
                        me.state = '26';
                        _main_sendRequest(__resolve, __reject);
                        break;
                    default:
                        return;
                    }
                };
                _main_sendRequest(__resolve, __reject);
            });
        };
        return me;
    }
    function sendRequest(method, url, body, headers) {
        var __obj = sendRequest_create(method, url, body, headers);
        return __obj.run();
    }
    unit.main = main;
    unit.uploadFileToServer_create = uploadFileToServer_create;
    unit.uploadFileToServer = uploadFileToServer;
    unit.isNetworkError = isNetworkError;
    unit.isSuccess = isSuccess;
    unit.sendRequest_create = sendRequest_create;
    unit.sendRequest = sendRequest;
    return unit;
}
if (typeof module != 'undefined') {
    module.exports = http_0_1;
}