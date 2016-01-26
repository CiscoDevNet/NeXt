(function (nx) {
    /**
     * XHR: XmlHttpRequest
     * @class nx.http.XHR
     * @constructor
     */
    var XHR = nx.define('nx.http.XHR',{
        properties: {
            url: '',
            data: {
                value: '',
                set: function (value){
                    this._data = value;
                },
                get: function (){
                    return nx.is(this._data,'Object') ? JSON.stringify(this._data) : this._data;
                }
            },
            method: 'GET',
            asyns: true,
            username: null,
            password: null,
            requestHeader: {
                value: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-type': 'application/json'
                },
                get: function(){
                    return this._requestHeader;
                },
                set: function (value){
                    this._requestHeader = value;
                }
            },
            timeoutTime: 2e4,
            isRunning: {
                value: false,
                get: function (){ return this._isRunning; }
            },
            timeoutID: null,
            XMLHttpRequest: {
                value: null,
                get: function(){
                    if (this._XMLHttpRequest){ return this._XMLHttpRequest; }
                    if (!nx.global.ActiveXObject){ return this._XMLHttpRequest= new XMLHttpRequest(); }
                    var e = "MSXML2.XMLHTTP", t = ["Microsoft.XMLHTTP", e, e + ".3.0", e + ".4.0", e + ".5.0", e + ".6.0"], _len = t.length;
                    for (var n = _len - 1; n > -1; n--) { try { return this._XMLHttpRequest = new ActiveXObject(t[n]); } catch (r) { continue; }; };
                }
            }
        },
        events: ['before', 'after', 'success', 'error', 'complete', 'timeout' ],
        methods: {
            _onStateChange: function (){
                var _XHR = this.XMLHttpRequest();
                if (_XHR.readyState == 4) {
                    var e = _XHR.status, t = _XHR.responseText, _ct = _XHR.getResponseHeader('Content-Type');
                    if (e >= 400 && e < 500) { this.fire('error', 'Client Error Code: '+e); return; }
                    if (e >= 500) { this.fire('error', 'Server Error code: '+e); return; }
                    t = (_ct&&_ct.indexOf('application/json')>=0)?JSON.parse(t):t;
                    if (e == 200) {
                        this.fire('success', t);
                    } else {
                        this.fire('error', t);
                    }
                    this._onComplete(_XHR);
                    return t;
                }
            },
            _onComplete: function(data){
                clearTimeout(this.timeoutID());
                this._isRunning = false;
                this.fire('complete', data);
            },
            _exec: function (f, context, args){ return function () { return f.apply(context, args); }; },
            _initRequestHeader: function (RH, args){ for(var k in args){ RH.setRequestHeader(k, args[k]); }; },
            resetEvents: function(){
                this.off('before');
                this.off('after');
                this.off('success');
                this.off('error');
                this.off('complete');
                this.off('timeout');
            },
            default: function(config){
                this.sets(config);
            },
            send: function (config){
                if (this.isRunning()){ return; }
                this._isRunning = true;
                this.default(config);
                var _XHR = this.XMLHttpRequest(), _self = this;
                this.timeoutID(setTimeout(function(){
                    if(_self.isRunning()){
                        _XHR.abort();
                        _self.fire('timeout', this);
                        _self._onComplete('timeout');
                    }
                }, this.timeoutTime()));
                if (this.fire('before', this)!=false&&this.url()){
                    if (this._method == 'POST') {
                        _XHR.open("POST", this.url(), this.asyns());
                        _XHR.onreadystatechange = this._exec(this._onStateChange, _self);
                        this._initRequestHeader(_XHR, this.requestHeader());
                        _XHR.send(this.data());
                    } else {
                        _XHR.open(this._method, this.url() + "?" + this.data(), this.asyns());
                        _XHR.onreadystatechange = this._exec(this._onStateChange, _self);
                        _XHR.send(null);
                    }
                    if(!this.asyns()){
                        this._onComplete(_XHR);
                    }
                }else {
                    this._onComplete(_XHR);
                }
            },
            abort: function (){
                if(this.XMLHttpRequest()){
                    this.XMLHttpRequest().abort();
                }
            }
        }
    });

    /**
     * XHRPool: XmlHttpRequestPool
     * @class nx.http.XHRPool
     * @constructor
     */
    var XHRPool = nx.define('nx.http.XHRPool',{
        static: true,
        properties: {
            max: 3,
            count: {
                get: function (){ return this._data.length;  }
            }
        },
        methods: {
            init: function (){
                this._data = [];
            },
            getInstance: function (){
                for(var i= 0, _len = this._data.length; i<_len; i++){
                    if(!this._data[i].isRunning()){ return this._data[i].resetEvents(), this._data[i]; }
                }
                if(this.count()>=this.max()){
                    return null;
                }else {
                    return (function(context){ var _xhr = new nx.http.XHR(); context._data.push(_xhr); return _xhr; })(this);
                }
            }
        }
    });


    /**
     * HttpClient: HttpClient
     * @class nx.http.HttpClient
     * @namespace nx.task
     */
    var HttpClient = nx.define('nx.http.HttpClient', nx.task.TaskList, {
        properties: {
            timeoutTime: 1000
        },
        methods: {
            init: function(config){
                this.sets(config);
                this.inherited();
            },
            request: function (value, callback){
                var _xhr = XHRPool.getInstance();
                if (_xhr){
                    nx.each(value, function(v, k){
                        if(typeof v=='function'){
                            _xhr.on(k, v, this);
                        }
                    }, this);
                    callback?callback(_xhr):void(0);
                    _xhr.send(value);
                }else {
                    var _self = this;
                    setTimeout(function (){ _self.request(value, callback); }, _self.timeoutTime());
                }
            },
            push: function (value){
                var _task = value, _self = this;
                if (typeof value === 'object'&&!value.isQueue){
                    this.request(value);
                }else {
                    if(!(value instanceof nx.task.Task)&&typeof value === 'object') {
                        _task = new nx.task.Task({
                            action: function (){
                                _self.request(value, function (XHR){
                                    XHR.upon('complete', function (sender, data){
                                        setTimeout(function(){_task.taskList().next();},1000);
                                    }, this);
                                });
                            }
                        });
                    }
                    if(_task instanceof nx.task.Task){
                        _task.taskList(this);
                        var _lt = this.lastTask();
                        if(_lt){ _lt.next(_task); }
                        this.lastTask(_task);
                        _task.pre(_lt);
                        this._data.push(_task);
                    }else {
                        throw new Error('Error Parameter');
                    }
                }
                return this;
            },
            get: function (value){
                return value.method = 'GET', this.push(value);
            },
            post: function (value){
                return value.method = 'POST', this.push(value);
            },
            put: function (value){
                return value.method = 'PUT', this.push(value);
            },
            delete: function (value){
                return value.method = 'DELETE', this.push(value);
            }
        }
    });




    var hc = new HttpClient();
    hc.on('running', function(){ console.log('run'); });

    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success-1');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });

    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });


    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });


    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });

    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success-1');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });

    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });


    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });


    hc.get({
        url:'data.json',
        data: '',
        //isQueue: true,
        success: function (sender, data){
            console.log('success');
        },
        error: function (sender, data){
            console.log('error');
        },
        complete: function(sender, data){
            console.log('complete');
        },
        timeout: function (){
            console.log('timeout');
        }
    });


})(nx);