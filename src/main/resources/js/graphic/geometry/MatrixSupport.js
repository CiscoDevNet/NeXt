(function (nx, ui, global) {
    nx.define("nx.geometry.MatrixSupport", {
        properties: {
            matrix: {
                value: function () {
                    return nx.geometry.Matrix.I;
                }
            },
            /**
             * @property matrixInversion
             * @type {Number[3][3]}
             * @readOnly
             */
            matrixInversion: {
                dependencies: ["matrix"],
                value: function (matrix) {
                    if (!matrix) {
                        return null;
                    }
                    return nx.geometry.Matrix.inverse(matrix);
                }
            },
            transform_internal_: {
                dependencies: ["matrix"],
                value: function (matrix) {
                    if (matrix) {
                        var scale = NaN,
                            rotate = NaN;
                        if (nx.geometry.Matrix.isometric(matrix)) {
                            scale = Math.sqrt(matrix[0][0] * matrix[0][0] + matrix[0][1] * matrix[0][1]);
                            rotate = matrix[0][1] > 0 ? Math.acos(matrix[0][0] / scale) : -Math.acos(matrix[0][0] / scale);
                        }
                        return {
                            x: matrix[2][0],
                            y: matrix[2][1],
                            scale: scale,
                            rotate: rotate
                        };
                    } else {
                        return {
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotate: 0
                        };
                    }
                }
            },
            x: {
                get: function () {
                    return this._x !== undefined ? this._x : this.transform_internal_().x;
                },
                set: function (value) {
                    this._applyTransform("x", value);
                    if (!isNaN(this.transform_internal_().x) && this._x !== this.transform_internal_().x) {
                        this._x = this.transform_internal_().x;
                        return true;
                    }
                    return false;
                }
            },
            y: {
                get: function () {
                    return this._y !== undefined ? this._y : this.transform_internal_().y;
                },
                set: function (value) {
                    this._applyTransform("y", value);
                    if (!isNaN(this.transform_internal_().y) && this._y !== this.transform_internal_().y) {
                        this._y = this.transform_internal_().y;
                        return true;
                    }
                    return false;
                }
            },
            scale: {
                get: function () {
                    return this._scale !== undefined ? this._scale : this.transform_internal_().scale;
                },
                set: function (v) {
                    this._applyTransform("scale", v);
                    if (!isNaN(this.transform_internal_().scale) && this._scale !== this.transform_internal_().scale) {
                        this._scale = this.transform_internal_().scale;
                        return true;
                    }
                    return false;
                }
            },
            rotate: {
                get: function () {
                    return this._rotate !== undefined ? this._rotate : this.transform_internal_().rotate;
                },
                set: function (v) {
                    this._applyTransform("rotate", v);
                    if (!isNaN(this.transform_internal_().rotate) && this._rotate !== this.transform_internal_().rotate) {
                        this._rotate = this.transform_internal_().rotate;
                        return true;
                    }
                    return false;
                }
            }
        },
        methods: {
            applyTranslate: function (x, y) {
                this.matrix(nx.geometry.Matrix.multiply(this.matrix(), [
                    [1, 0, 0],
                    [0, 1, 0],
                    [x, y, 1]
                ]));
            },
            applyScale: function (s, accord) {
                if (accord) {
                    this.matrix(nx.geometry.Matrix.multiply(this.matrix(), [
                        [1, 0, 0],
                        [0, 1, 0],
                        [-accord[0], -accord[1], 1]
                    ], [
                        [s, 0, 0],
                        [0, s, 0],
                        [0, 0, 1]
                    ], [
                        [1, 0, 0],
                        [0, 1, 0],
                        [accord[0], accord[1], 1]
                    ]));
                } else {
                    this.matrix(nx.geometry.Matrix.multiply(this.matrix(), [
                        [s, 0, 0],
                        [0, s, 0],
                        [0, 0, 1]
                    ]));
                }
            },
            applyRotate: function (r, accord) {
                var x = this.x(),
                    y = this.y(),
                    sinr = sin(r),
                    cosr = cos(r);
                if (accord) {
                    this.matrix(nx.geometry.Matrix.multiply(this.matrix(), [
                        [1, 0, 0],
                        [0, 1, 0],
                        [-accord[0], -accord[1], 1]
                    ], [
                        [cos, sin, 0],
                        [-sin, cos, 0],
                        [0, 0, 1]
                    ], [
                        [1, 0, 0],
                        [0, 1, 0],
                        [accord[0], accord[1], 1]
                    ]));
                } else {
                    this.matrix(nx.geometry.Matrix.multiply(this.matrix(), [
                        [cos, sin, 0],
                        [-sin, cos, 0],
                        [0, 0, 1]
                    ]));
                }
            },
            applyMatrix: function () {
                var matrices = Array.prototype.slice.call(arguments);
                matrices = nx.util.query({
                    array: matrices,
                    mapping: function (matrix) {
                        return nx.is(matrix, nx.geometry.Matrix) ? matrix.matrix() : matrix;
                    }
                });
                matrices.unshift(this.matrix());
                this.matrix(nx.geometry.Matrix.multiply.apply(this, matrices));
            },
            _applyTransform: function (key, value) {
                if (this["_" + key] === value || isNaN(value)) {
                    return;
                }
                if (value === this.transform_internal_()[key]) {
                    this["_" + key] = value;
                    this.notify(key);
                } else {
                    switch (key) {
                    case "x":
                        this.applyTranslate(value - this.transform_internal_().x, 0);
                        break;
                    case "y":
                        this.applyTranslate(0, value - this.transform_internal_().y);
                        break;
                    case "scale":
                        this.applyScale(value / this.transform_internal_().scale, [this.transform_internal_().x, this.transform_internal_().y]);
                        break;
                    case "rotate":
                        this.applyRotate(value - this.transform_internal_().rotate, [this.transform_internal_().x, this.transform_internal_().y]);
                        break;
                    }
                }
            },
            toString: function () {
                return nx.geometry.Matrix.stringify(this.matrix());
            }
        }
    });
})(nx, nx.ui, window);
