(function (nx, global) {
    /**
     * @class Vector
     * @namespace nx.geometry
     */
    var Vector = nx.define("nx.geometry.Vector", nx.Observable, {
        statics: {
            approximate: function (v1, v2) {
                if (!v1 || !v2 || v1.length != v2.length) {
                    return false;
                }
                var i;
                for (i = 0; i < v1.length; i++) {
                    if (!nx.geometry.Math.approximate(v1[i], v2[i])) {
                        return false;
                    }
                }
                return true;
            },
            equal: function (v1, v2) {
                if (!v1 || !v2 || v1.length != v2.length) {
                    return false;
                }
                var i;
                for (i = 0; i < v1.length; i++) {
                    if (v1[i] !== v2[i]) {
                        return false;
                    }
                }
                return true;
            },
            plus: function (v1, v2) {
                return [v1[0] + v2[0], v1[1] + v2[1]];
            },
            transform: function (v, m) {
                var matrices = [
                    [v.concat([1])]
                ].concat(Array.prototype.slice.call(arguments, 1));
                return nx.geometry.Matrix.multiply.apply(nx.geometry.Matrix, matrices)[0].slice(0, 2);
            },
            multiply: function (v, k) {
                return Vector.transform(v, [
                    [k, 0, 0],
                    [0, k, 0],
                    [0, 0, 1]
                ]);
            },
            abs: function (v, len) {
                if (arguments.length == 1) {
                    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
                }
                var weight = len / Vector.abs(v);
                return Vector.transform(v, [
                    [weight, 0, 0],
                    [0, weight, 0],
                    [0, 0, 1]
                ]);
            },
            reverse: function (v) {
                return Vector.transform(v, [
                    [-1, 0, 0],
                    [0, -1, 0],
                    [0, 0, 1]
                ]);
            },
            rotate: function (v, a) {
                var sin = nx.geometry.Math.sin(a),
                    cos = nx.geometry.Math.cos(a);
                return Vector.transform(v, [
                    [cos, sin, 0],
                    [-sin, cos, 0],
                    [0, 0, 1]
                ]);
            },
            length: function (v) {
                return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
            },
            angleCosine: function (v1, v2) {
                return (v1[0] * v2[0] + v1[1] * v2[1]) / Vector.length(v1) / Vector.length(v2);
            }
        },
        methods: {
            init: function (x, y) {
                this.x = x || 0;
                this.y = y || 0;
            },
            /**
             * @method equals
             * @param v {nx.geometry.Vector}
             * @returns {boolean}
             */
            equals: function (v) {
                return this.x === v.x && this.y === v.y;
            },
            /**
             * @method length
             * @returns {number}
             */
            length: function () {
                return Math.sqrt(this.squaredLength());
            },
            /**
             * @method squaredLength
             * @returns {number}
             */
            squaredLength: function () {
                var x = this.x,
                    y = this.y;

                return x * x + y * y;
            },
            /**
             * @method angle
             * @returns {number}
             */
            angle: function () {
                var l = this.length(),
                    a = l && Math.acos(this.x / l);
                a = a * 180 / Math.PI;
                a = this.y > 0 ? a : -a;

                return a;
            },
            /**
             * @method circumferentialAngle
             * @returns {number}
             */
            circumferentialAngle: function () {
                var angle = this.angle();
                if (angle < 0) {
                    angle += 360;
                }
                return angle;

            },
            /**
             * @method slope
             * @returns {number}
             */
            slope: function () {
                return this.y / this.x;
            },
            /**
             * @method add
             * @param v {nx.geometry.Vector}
             * @returns {nx.geometry.Vector}
             */
            add: function (v) {
                return new Vector(this.x + v.x, this.y + v.y);
            },
            /**
             * @method subtract
             * @param v {nx.geometry.Vector}
             * @returns {nx.geometry.Vector}
             */
            subtract: function (v) {
                return new Vector(this.x - v.x, this.y - v.y);
            },
            /**
             * @method multiply
             * @param k {Number}
             * @returns {nx.geometry.Vector}
             */
            multiply: function (k) {
                return new Vector(this.x * k, this.y * k);
            },
            /**
             * @method divide
             * @param k {Number}
             * @returns {nx.geometry.Vector}
             */
            divide: function (k) {
                return new Vector(this.x / k, this.y / k);
            },
            /**
             * @method rotate
             * @param a {Number}
             * @returns {nx.geometry.Vector}
             */
            rotate: function (a) {
                var x = this.x,
                    y = this.y,
                    sinA = Math.sin(a / 180 * Math.PI),
                    cosA = Math.cos(a / 180 * Math.PI);

                return new Vector(x * cosA - y * sinA, x * sinA + y * cosA);
            },
            /**
             * @method negate
             * @returns {nx.geometry.Vector}
             */
            negate: function () {
                return new Vector(-this.x, -this.y);
            },
            /**
             * @method normal
             * @returns {nx.geometry.Vector}
             */
            normal: function () {
                var l = this.length() || 1;
                return new Vector(-this.y / l, this.x / l);
            },
            /**
             * @method normalize
             * @returns {nx.geometry.Vector}
             */
            normalize: function () {
                var l = this.length() || 1;
                return new Vector(this.x / l, this.y / l);
            },
            /**
             * @method clone
             * @returns {nx.geometry.Vector}
             */
            clone: function () {
                return new Vector(this.x, this.y);
            }
        }
    });
})(nx, window);
