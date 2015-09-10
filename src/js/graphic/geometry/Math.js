(function (nx, ui, global) {
    /**
     * @class Math
     * @namespace nx.geometry
     */
    var EXPORT = nx.define("nx.geometry.Math", nx.Observable, {
        statics: (function () {
            function precised(f) {
                return function (param) {
                    var v = f(param);
                    return EXPORT.approximate(v, 0) ? 0 : v;
                };
            }

            return {
                approximate: function (a, b) {
                    var v = a - b;
                    return v < 1e-10 && v > -1e-10;
                },
                sin: precised(Math.sin),
                cos: precised(Math.cos),
                tan: precised(Math.tan),
                cot: function (a) {
                    var tan = Math.tan(a);
                    if (tan > 1e10 || tan < -1e10) {
                        return 0;
                    }
                    return 1 / tan;
                }
            };
        })()
    });
})(nx, nx.ui, window);
