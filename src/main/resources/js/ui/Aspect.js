(function (nx) {

    var slice = Array.prototype.slice;

    var Aspect = nx.Aspect = nx.define({
        static: true,
        methods: {
            before: function (target, name, func) {
                Aspect.around(target, name, function (origFunc, origArgs) {
                    func.apply(this, origArgs);
                    origFunc.apply(this, origArgs);
                });
            },
            after: function (target, name, func) {
                Aspect.around(target, name, function (origFunc, origArgs) {
                    origFunc.apply(this, origArgs);
                    func.apply(this, origArgs);
                });
            },
            around: function (target, name, func) {
                var context = target;

                if (nx.is(target, 'Function')) {
                    context = target.prototype;
                }

                if (context && nx.is(context[name], 'Function')) {
                    var origFunc = context[name];

                    context[name] = function () {
                        func.call(context, origFunc, slice.call(arguments));
                    }
                }
                else {
                    throw new Error('Method "' + name + '" is not found.');
                }
            }
        }
    });
})(nx);