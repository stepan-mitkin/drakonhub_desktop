function http_0_1() {
var unit = {};

function isNetworkError(ex) {
    var str;
    if (ex) {
        str = ex.toString();
        if (str.indexOf('NetworkError') === -1 && str.indexOf('HTTP error') === -1) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}
function isSuccess(response) {
    if (response.status === 200 || response.status === 204) {
        return true;
    } else {
        return false;
    }
}
async function main() {
}
function onDataWhenReady(self, request) {
    var result;
    if (request.readyState === 4) {
        result = {
            responseText: request.responseText,
            status: request.status
        };
        self.onDataReady(result);
    }
}
function sendRequest(method, url, body, headers) {
    var _obj_;
    _obj_ = sendRequest_create(method, url, body, headers);
    return _obj_.run();
}
function uploadFileToServer(url, name, file) {
    var _obj_;
    _obj_ = uploadFileToServer_create(url, name, file);
    return _obj_.run();
}
function sendRequest_create(method, url, body, headers) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'sendRequest',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* sendRequest_main() {
        var _event_, request, result, value;
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            onDataWhenReady(me, request);
        };
        request.open(method, url, true);
        if (headers) {
            for (header in headers) {
                value = headers[header];
                request.setRequestHeader(header, value);
            }
        }
        request.send(body);
        me.state = '25';
        me._busy = false;
        _event_ = yield;
        result = _event_[1];
        _topResolve_(result);
        return;
    }
    function sendRequest_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = sendRequest_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = sendRequest_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.onDataReady = function (result) {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '25':
            _args_ = [];
            _args_.push('onDataReady');
            _args_.push(result);
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
function uploadFileToServer_create(url, name, file) {
    var _earlyPromise_, _topGen_, _topReject_, _topResolve_, me;
    me = {
        _type: 'uploadFileToServer',
        _busy: true,
        state: 'created'
    };
    _topResolve_ = function (_value_) {
        _earlyPromise_ = Promise.resolve(_value_);
    };
    _topReject_ = function (_value_) {
        throw _value_;
    };
    function* uploadFileToServer_main() {
        var _event_, formData, request;
        request = new XMLHttpRequest();
        formData = new FormData();
        request.onreadystatechange = me.handleBasicStatusChange;
        formData.append(name, file);
        request.open('POST', url);
        request.send(formData);
        while (true) {
            me.state = '7';
            me._busy = false;
            _event_ = yield;
            if (request.readyState === 4) {
                break;
            }
        }
        if (request.status === 200 || request.status === 204) {
            _topResolve_(true);
            return;
        } else {
            widgets.showErrorSnack(tr('An error has occurred'));
            _topResolve_(false);
            return;
        }
        _topResolve_();
    }
    function uploadFileToServer_run() {
        if (me.state !== 'created') {
            throw new Error('run() can be called only once');
        }
        me.state = 'started';
        _topGen_ = uploadFileToServer_main();
        _topGen_.next();
        if (_earlyPromise_) {
            return _earlyPromise_;
        }
        return new Promise((resolve, reject) => {
            _topResolve_ = resolve;
            _topReject_ = reject;
        });
    }
    me.run = uploadFileToServer_run;
    me.stop = function () {
        me.state = undefined;
    };
    me.handleBasicStatusChange = function () {
        var _args_;
        if (me._busy) {
            throw new Error('Synchronous reentry is not allowed');
        }
        switch (me.state) {
        case '7':
            _args_ = [];
            _args_.push('handleBasicStatusChange');
            me._busy = true;
            _topGen_.next(_args_);
            break;
        default:
            break;
        }
    };
    return me;
}
unit.isNetworkError = isNetworkError;
unit.isSuccess = isSuccess;
unit.main = main;
unit.sendRequest = sendRequest;
unit.uploadFileToServer = uploadFileToServer;
unit.sendRequest_create = sendRequest_create;
unit.uploadFileToServer_create = uploadFileToServer_create;
return unit;
}