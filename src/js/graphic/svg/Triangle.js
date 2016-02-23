(function (nx,global) {
    /**
     * SVG triangle component
     * @class nx.graphic.Triangle
     * @extend nx.graphic.Path
     * @module nx.graphic
     */
    nx.define("nx.graphic.Triangle", nx.graphic.Path, {
        properties: {
            width: {
                get: function () {
                    return this._width !== undefined ? this._width : 0;
                },
                set: function (value) {
                    if (this._width !== value) {
                        this._width = value;
                        this._draw();
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            height: {
                get: function () {
                    return this._height !== undefined ? this._height : 0;
                },
                set: function (value) {
                    if (this._height !== value) {
                        this._height = value;
                        this._draw();
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        methods: {
            _draw: function () {
                if (this._width && this._height) {
                    var path = [];
                    path.push('M ', this._width / 2, ' ', 0);
                    path.push(' L ', this._width, ' ', this._height);
                    path.push(' L ', 0, ' ', this._height);
                    path.push(' Z');
                    this.set("d", path.join(''));
                }


            }
        }
    });
})(nx, nx.global);