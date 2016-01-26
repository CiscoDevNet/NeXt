(function (nx) {

    /**
     * TaskList: tasklist
     * @class nx.task.TaskList
     * @namespace nx.task
     */
    var TaskList = nx.define('nx.task.TaskList', {
        events: ['init','running'],
        properties: {
            count: {
                value: null,
                get: function () { return this._data.length; }
            },
            status: {
                value: '',
                get: function () { return this._status; }
            },
            activeTask: null,
            lastTask: null,
            scanDelay: 2000
        },
        methods: {
            init: function (config) {
                this.sets(config);
                this._data = [];
                this.start();
                this.fire('init', this);
            },
            reset: function (){
                if(this._data){
                    this._data.clear();
                }else {
                    this._data = [];
                }
            },
            start: function (){
                this._status = 'started';
                this.run();
            },
            run: function (){
                if (this._status!=='started'){ return; }
                this.fire('running', this);
                this.next();
            },
            next: function (){
                if (this.count()){
                    this._activeTask = this._data.shift();
                    if(this._activeTask){
                        this._activeTask.start();
                    }
                }else {
                    var _self = this;
                    setTimeout(function (){ _self.run(); }, this.scanDelay());
                }
            },
            add: function (value){
                if(!(value instanceof nx.task.Task)&&typeof value === 'object') {
                    value = new nx.task.Task(value);
                }
                if(value instanceof nx.task.Task){
                    value.taskList(this);
                    this._data.push(value);
                }else {
                    throw new Error('Error Parameter');
                }
            },
            stop: function (){
                this._status = 'stoped';
            },
            restart: function (){
                if (this._status!=='started'){
                    this.start();
                }
            }
        }
    });

    /**
     * Task
     * @class nx.task.Task
     * @namespace nx.task
     */
    var Task = nx.define('nx.task.Task', {
        events: [ 'init', 'start', 'stop', 'cancle', 'goNext', 'goPre' ],
        properties: {
            pre: null,
            next: null,
            delay: null,
            action: null,
            args: [],
            context: this,
            taskList: null,
            status: {
                value: '',
                get: function () { return this._status; }
            }
        },
        methods: {
            init: function (config) {
                this.sets(config);
                this.fire('init', this);
            },
            start: function (){
                if (this._status=='started'){ return; }
                if (this.action()){
                    this.action().apply(this.context(), this.args());
                    this._status = 'started';
                }else {
                    this.goNext();
                }
                this.fire('start', this);
            },
            stop: function (){
                this._status = 'stoped';
                this.fire('stop', this);
            },
            cancle: function (){
                this._status = 'cancle';
                this.fire('cancle', this);
            },
            goNext: function (){
                if (this.next()){
                    this.next().start();
                }
                this.fire('goNext', this);
            },
            goPre: function (){
                if (this.pre()){
                    this.pre().start();
                }
                this.fire('goPre', this);
            }
        }
    });

})(nx);