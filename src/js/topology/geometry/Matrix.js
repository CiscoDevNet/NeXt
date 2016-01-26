(function (nx, ui, global) {
    /**
     * @class Matrix
     * @namespace nx.geometry
     */
    var EXPORT = nx.define("nx.geometry.Matrix", nx.Observable, {
        mixins: [nx.geometry.MatrixSupport],
        methods: {
            init: function (matrix) {
                this.inherited();
                this.matrix(matrix);
            },
            equal: function (matrix) {
                return EXPORT.equal(this.matrix(), (nx.is(matrix, EXPORT) ? matrix.matrix() : matrix));
            }
        },
        statics: {
            I: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ],
            isometric: function (m) {
                return m && (m[0][0] || m[0][1]) && m[0][0] === m[1][1] && m[0][1] === -m[1][0];
            },
            approximate: function (m1, m2) {
                if (!m1 || !m2 || m1.length != m2.length) {
                    return false;
                }
                var i;
                for (i = 0; i < m1.length; i++) {
                    if (!nx.geometry.Vector.approximate(m1[i], m2[i])) {
                        return false;
                    }
                }
                return true;
            },
            equal: function (m1, m2) {
                if (!m1 || !m2 || m1.length != m2.length) {
                    return false;
                }
                var i;
                for (i = 0; i < m1.length; i++) {
                    if (!nx.geometry.Vector.equal(m1[i], m2[i])) {
                        return false;
                    }
                }
                return true;
            },
            multiply: function () {
                var matrixes = Array.prototype.slice.call(arguments);
                var m1, m2, m, mr, mc, r, c, n, row, col, num;
                var i, j, k;
                while (matrixes.length > 1) {
                    /* jshint -W030 */
                    m1 = matrixes[0], m2 = matrixes[1];
                    if (m1[0].length != m2.length) {
                        return null;
                    }
                    /* jshint -W030 */
                    row = m1.length, col = m2[0].length, num = m2.length;
                    m = [];
                    for (r = 0; r < row; r++) {
                        mr = [];
                        for (c = 0; c < col; c++) {
                            mc = 0;
                            for (n = 0; n < num; n++) {
                                mc += m1[r][n] * m2[n][c];
                            }
                            mr.push(mc);
                        }
                        m.push(mr);
                    }
                    matrixes.splice(0, 2, m);
                }
                return matrixes[0];
            },
            transpose: function (m) {
                var t = [],
                    r, c, row = m.length,
                    col = m[0].length;
                for (c = 0; c < col; c++) {
                    t[c] = [];
                    for (r = 0; r < row; r++) {
                        t[c].push(m[r][c]);
                    }
                }
                return t;
            },
            inverse: function (m) {
                // FIXME just for 2D 3x3 Matrix
                var a = m[0][0],
                    b = m[0][1],
                    c = m[1][0],
                    d = m[1][1],
                    e = m[2][0],
                    f = m[2][1];
                var rslt = [],
                    deno = a * d - b * c;
                if (deno === 0) {
                    return null;
                }
                return [
                    [d / deno, -b / deno, 0], [-c / deno, a / deno, 0], [(c * f - d * e) / deno, (b * e - a * f) / deno, 1]
                ];
            },
            stringify: function (matrix) {
                return [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]].join(",").replace(/-?\d+e[+-]?\d+/g, "0");
            }
        }
    });
})(nx, nx.ui, window);
