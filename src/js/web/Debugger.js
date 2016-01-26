(function (nx) {

    var Debugger = nx.Debugger = nx.define({
        static: true,
        methods: {
            log: function () {
                console.log(arguments);
            },
            warn: function () {
                console.warn(arguments);
            },
            error: function () {
                console.error(arguments);
            },
            diagnose: function () {
                nx.each(nx.classes, function (c) {
                    var id = c.__classId__;
                    var p = c.prototype;
                    var n = c.__className__;
                    var s = c.__super__;

                    if (s === nx.ui.Component && p.init && p.init.toString().indexOf('this.inherited') === -1) {
                        console.warn('The constructor(init) of UI Component [' + id + ']' + n + ' is missing "this.inherited()" calling.');
                    }

                });
            }
        }
    });

})(nx);