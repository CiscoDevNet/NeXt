(function (nx) {
    var Vector = nx.geometry.Vector;

    /**
     * Mathematics Line class
     * @class nx.geometry.Line
     * @module nx.math
     */

    /**
     * Line class constructor function
     * @param start {nx.geometry.Vector}
     * @param end {nx.geometry.Vector}
     * @constructor
     */
    function Line(start, end) {
        this.start = start || new Vector();
        this.end = end || new Vector();
        this.dir = this.end.subtract(this.start);
    }

    Line.prototype = {
        constructor: Line,
        /**
         * @method length
         * @returns {*}
         */
        length: function () {
            return this.dir.length();
        },
        /**
         * @method squaredLength
         * @returns {*}
         */
        squaredLength: function () {
            return this.dir.squaredLength();
        },
        /**
         * @method angle
         * @returns {*}
         */
        angle: function () {
            return this.dir.angle();
        },
        /**
         * @methid intersection
         * @returns {*}
         */
        circumferentialAngle: function () {
            var angle = this.angle();
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        },
        /**
         * @method center
         * @returns {nx.geometry.Vector}
         */
        center: function () {
            return this.start.add(this.end).divide(2);
        },
        /**
         * @method slope
         * @returns {*}
         */
        slope: function () {
            return this.dir.slope();
        },
        /**
         * @method general
         * @returns {Array}
         */
        general: function () {
            var k = this.slope(),
                start = this.start;
            if (isFinite(k)) {
                return [k, -1, start.y - k * start.x];
            }
            else {
                return [1, 0, -start.x];
            }
        },
        /**
         * @method intersection
         * @param l {nx.geometry.Line}
         * @returns {nx.geometry.Vector}
         */
        intersection: function (l) {
            var g0 = this.general(),
                g1 = l.general();

            return new Vector(
                (g0[1] * g1[2] - g1[1] * g0[2]) / (g0[0] * g1[1] - g1[0] * g0[1]),
                (g0[0] * g1[2] - g1[0] * g0[2]) / (g1[0] * g0[1] - g0[0] * g1[1]));
        },
        /**
         * @method pedal
         * @param v {nx.geometry.Vector}
         * @returns {nx.geometry.Vector}
         */
        pedal: function (v) {
            var dir = this.dir,
                g0 = this.general(),
                g1 = [dir.x, dir.y, -v.x * dir.x - v.y * dir.y];

            return new Vector(
                (g0[1] * g1[2] - g1[1] * g0[2]) / (g0[0] * g1[1] - g1[0] * g0[1]),
                (g0[0] * g1[2] - g1[0] * g0[2]) / (g1[0] * g0[1] - g0[0] * g1[1]));
        },
        /**
         * @method translate
         * @param v {nx.geometry.Vector}
         * @returns {mx.math.Line}
         */
        translate: function (v) {
            v = v.rotate(this.angle());
            return new Line(this.start.add(v), this.end.add(v));
        },
        /**
         * @method rotate
         * @param a {Number}
         * @returns {nx.geometry.Line}
         */
        rotate: function (a) {
            return new Line(this.start.rotate(a), this.end.rotate(a));
        },
        /**
         * @method negate
         * @returns {nx.geometry.Line}
         */
        negate: function () {
            return new Line(this.end, this.start);
        },
        /**
         * @method normal
         * @returns {nx.geometry.Vector}
         */
        normal: function () {
            var dir = this.dir, l = this.dir.length();
            return new Vector(-dir.y / l, dir.x / l);
        },
        /**
         * @method pad
         * @param a {nx.geometry.Vector}
         * @param b {nx.geometry.Vector}
         * @returns {nx.geometry.Line}
         */
        pad: function (a, b) {
            var n = this.dir.normalize();
            return new Line(this.start.add(n.multiply(a)), this.end.add(n.multiply(-b)));
        },
        /**
         * @method clone
         * @returns {nx.geometry.Line}
         */
        clone: function () {
            return new Line(this.start, this.end);
        }
    };

    nx.geometry.Line = Line;
})(nx);