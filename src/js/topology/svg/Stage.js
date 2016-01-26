(function (nx, global) {

    /**
     * SVG root component
     * @class nx.graphic.Stage
     * @extend nx.ui.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Stage", nx.ui.Component, {
        events: ['dragStageStart', 'dragStage', 'dragStageEnd', 'stageTransitionEnd'],
        view: {
            tag: 'svg:svg',
            props: {
                'class': 'n-svg',
                version: '1.1',
                xmlns: "http://www.w3.org/2000/svg",
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                style: {
                    width: '{#width}',
                    height: '{#height}'
                }
            },
            content: [{
                name: 'defs',
                tag: 'svg:defs'
            }, {
                name: 'scalingLayer',
                type: 'nx.graphic.Group',
                props: {
                    'class': 'stage'
                },
                events: {
                    'transitionend': '{#_transitionend}'
                }
            }, {
                name: 'staticLayer',
                type: 'nx.graphic.Group'
            }],
            events: {
                'mousedown': '{#_mousedown}',
                'touchstart': '{#_mousedown}',
                'dragstart': '{#_dragstart}',
                'dragmove': '{#_drag}',
                'dragend': '{#_dragend}'
            }
        },
        properties: {
            /**
             * Is an animation in progress?
             * @property animating {Boolean}
             * @readOnly
             */
            animating: {},
            /**
             * Set/get topology's scalability
             * @property scalable {Boolean}
             */
            scalable: {
                value: true
            },
            /**
             * Get the viewbox of current stage position.
             * @property scalable {Boolean}
             * @readOnly
             */
            viewbox: {
                dependencies: "width, height, matrix",
                value: function (width, height, matrix) {
                    var inversion = nx.geometry.Matrix.inverse(matrix);
                    return [nx.geometry.Vector.transform([0, 0], inversion), nx.geometry.Vector.transform([width, height], inversion)];
                }
            },
            /**
             * set/get stage's width
             * @property width
             */
            width: {
                value: 300
            },
            /**
             * set/get stage's height
             * @property height
             */
            height: {
                value: 300
            },
            /**
             * Stage scale
             * @property stageScale {Number}
             */
            stageScale: {
                value: 1
            },
            /**
             * Stage padding
             * @property padding {number} 0
             */
            padding: {
                value: 0
            },
            /**
             * Topology max scaling
             * @property maxScale {Number}
             */
            maxZoomLevel: {
                value: 12
            },
            /**
             * Topology min scaling
             * @property minScale {Number}
             */
            minZoomLevel: {
                value: 0.25
            },
            zoomLevel: {
                value: 1
            },
            /**
             * Disable notify stageScale
             * @property disableUpdateStageScale {Boolean} false
             */
            disableUpdateStageScale: {
                value: false
            },
            /**
             * Stage transform matrix
             * @property matrix {nx.geometry.Math} nx.geometry.Matrix.I
             */
            matrix: {
                get: function () {
                    return this._matrix || nx.geometry.Matrix.I;
                },
                set: function (matrix) {
                    //dom.style.webkitTransform = matrixString;
                    var matrixObject = this.matrixObject();
                    var dom = this.scalingLayer().dom().$dom;
                    var matrixString = "matrix(" + nx.geometry.Matrix.stringify(matrix) + ")";
                    dom.style.transform = matrixString;
                    dom.setAttribute('transform', ' translate(' + matrixObject.x() + ', ' + matrixObject.y() + ') scale(' + matrixObject.scale() + ')');
                    this._matrix = matrix;
                }
            },
            /**
             * Matrix Object
             * @property matrixObject
             */
            matrixObject: {},
            /**
             * get content group element
             * @property stage
             */
            stage: {
                get: function () {
                    return this.view("scalingLayer");
                }
            },
            staticLayer: {
                get: function () {
                    return this.view("staticLayer");
                }
            },
            scalingLayer: {
                get: function () {
                    return this.view("scalingLayer");
                }
            },
            fitMatrixObject: {
                set: function (matrix) {
                    if (matrix) {
                        this.zoomLevel(this.stage().scale() / matrix.scale());
                    }
                    this._fitMatrixObject = matrix;
                }
            }
        },
        methods: {
            getContainer: function () {
                return this.view('scalingLayer').view().dom();
            },
            /**
             * Add svg def element into the stage
             * @method addDef
             * @param el {SVGDOM}
             */
            addDef: function (el) {
                this.view("defs").dom().$dom.appendChild(el);
            },
            /**
             * Add svg def element into the stage in string format
             * @method addDefString
             * @param str {String}
             */
            addDefString: function (str) {
                this.view("defs").dom().$dom.appendChild(new DOMParser().parseFromString(str, "text/xml").documentElement);
            },
            /**
             * Get content's relative bound
             * @method getContentBound
             * @returns {{left: number, top: number, width: Number, height: Number}}
             */
            getContentBound: function () {
                var stageBound = this.scalingLayer().getBound();
                var topoBound = this.view().dom().getBound();

                if (stageBound.left === 0 && stageBound.top === 0 && stageBound.width === 0 && stageBound.height === 0) {
                    var padding = this.padding();
                    return {
                        left: padding,
                        top: padding,
                        height: this.height() - padding * 2,
                        width: this.width() - padding * 2
                    };
                } else {
                    var bound = {
                        left: stageBound.left - topoBound.left,
                        top: stageBound.top - topoBound.top,
                        width: stageBound.width,
                        height: stageBound.height
                    };

                    if (bound.width < 300) {
                        bound.left -= (300 - bound.width) / 2;
                        bound.width = 300;
                    }

                    if (bound.height < 300) {
                        bound.top -= (300 - bound.height) / 2;
                        bound.height = 300;
                    }

                    return bound;

                }
            },
            fit: function (callback, context, isAnimated) {
                var watching = nx.keyword.internal.watch(this, "animating", function (animating) {
                    if (!animating) {
                        watching.release();
                        if (isAnimated) {
                            this.scalingLayer().on('transitionend', function fn() {
                                this.scalingLayer().dom().removeClass('n-topology-fit');
                                this.scalingLayer().off('transitionend', fn, this);
                                /* jslint -W030 */
                                callback && callback.call(context || this);
                                this.animating(false);
                            }, this);
                            var originalMatrix = this.matrix();
                            var newMatrix = this.fitMatrixObject().matrix();
                            if (!nx.geometry.Matrix.approximate(originalMatrix, newMatrix)) {
                                this.animating(true);
                                this.scalingLayer().dom().addClass('n-topology-fit');
                                this._setStageMatrix(this.fitMatrixObject().matrix());
                            } else {
                                /* jslint -W030 */
                                callback && callback.call(context || this);
                            }
                            this.zoomLevel(1);
                        } else {
                            this._setStageMatrix(this.fitMatrixObject().matrix());
                            this.zoomLevel(1);
                            /* jslint -W030 */
                            callback && callback.call(context || this);
                        }
                    }
                }.bind(this));
                watching.notify();
            },
            actualSize: function () {
                this.scalingLayer().setTransition(null, null, 0.6);
                this._setStageMatrix(nx.geometry.Matrix.I);
            },
            zoom: function (value, callback, context) {
                this.scalingLayer().setTransition(callback, context, 0.6);
                this.applyStageScale(value);
            },
            zoomByBound: function (inBound, callback, context, duration) {
                var padding = this.padding();
                var stageBound = {
                    left: padding,
                    top: padding,
                    height: this.height() - padding * 2,
                    width: this.width() - padding * 2
                };
                this.scalingLayer().setTransition(callback, context, duration);
                this.applyStageMatrix(this.calcRectZoomMatrix(stageBound, inBound));
            },
            calcRectZoomMatrix: function (graph, rect) {
                var s = (!rect.width && !rect.height) ? 1 : Math.min(graph.height / Math.abs(rect.height), graph.width / Math.abs(rect.width));
                var dx = (graph.left + graph.width / 2) - s * (rect.left + rect.width / 2);
                var dy = (graph.top + graph.height / 2) - s * (rect.top + rect.height / 2);
                return [
                    [s, 0, 0], [0, s, 0], [dx, dy, 1]
                ];
            },
            applyTranslate: function (x, y, duration) {
                var matrix = this.matrixObject();
                matrix.applyTranslate(x, y);
                if (duration) {
                    this.scalingLayer().setTransition(null, null, duration);
                }
                this.matrix(matrix.matrix());
                this.matrixObject(matrix);
                return matrix;
            },
            applyStageMatrix: function (matrix, according) {
                return this._setStageMatrix(nx.geometry.Matrix.multiply(this.matrix(), matrix), according);
            },
            applyStageScale: function (scale, according) {
                var _scale = scale || 1,
                    _according = according || [this.width() / 2, this.height() / 2];
                var matrix = nx.geometry.Matrix.multiply([
                    [1, 0, 0],
                    [0, 1, 0],
                    [-_according[0], -_according[1], 1]
                ], [
                    [_scale, 0, 0],
                    [0, _scale, 0],
                    [0, 0, 1]
                ], [
                    [1, 0, 0],
                    [0, 1, 0],
                    [_according[0], _according[1], 1]
                ]);
                return this.applyStageMatrix(matrix, _according);
            },
            resetStageMatrix: function () {
                var m = new nx.geometry.Matrix(this.matrix());
                this.disableUpdateStageScale(false);
                this.matrix(m.matrix());
                this.matrixObject(m);
                this.stageScale(1 / m.scale());
            },
            resetFitMatrix: function () {
                var watching = nx.keyword.internal.watch(this, "animating", function (animating) {
                    if (!animating) {
                        watching.release();
                        var contentBound, padding, stageBound, matrix;
                        // get transform matrix
                        contentBound = this.getContentBound();
                        padding = this.padding();
                        stageBound = {
                            left: padding,
                            top: padding,
                            height: this.height() - padding * 2,
                            width: this.width() - padding * 2
                        };
                        matrix = new nx.geometry.Matrix(this.calcRectZoomMatrix(stageBound, contentBound));
                        matrix.matrix(nx.geometry.Matrix.multiply(this.matrix(), matrix.matrix()));
                        this.fitMatrixObject(matrix);

                    }
                }.bind(this));
                watching.notify();
            },
            _setStageMatrix: function (matrix, according) {
                according = according || [this.width() / 2, this.height() / 2];
                var m = new nx.geometry.Matrix(matrix);
                var matrixFit = this.fitMatrixObject();
                var scaleFit = matrixFit.scale();
                var zoomMax = this.maxZoomLevel(),
                    zoomMin = this.minZoomLevel();
                if (m.scale() / scaleFit > zoomMax) {
                    m.applyScale(zoomMax * scaleFit / m.scale(), according);
                }
                if (m.scale() / scaleFit < zoomMin) {
                    m.applyScale(zoomMin * scaleFit / m.scale(), according);
                }
                if (!nx.geometry.Matrix.approximate(this.matrix(), m.matrix())) {
                    this.matrixObject(m);
                    this.matrix(m.matrix());
                    if (!this.disableUpdateStageScale()) {
                        this.stageScale(1 / m.scale());
                    }
                    this.zoomLevel(m.scale() / scaleFit);
                    return m;
                } else {
                    return this.matrixObject();
                }
            },
            hide: function () {
                this.view('scalingLayer').dom().setStyle('opacity', 0);
                this.view('staticLayer').dom().setStyle('opacity', 0);
            },
            show: function () {
                this.view('scalingLayer').dom().setStyle('opacity', 1);
                this.view('staticLayer').dom().setStyle('opacity', 1);
            },
            _transitionend: function (sender, event) {
                this.fire('stageTransitionEnd', event);
            },
            _mousedown: function (sender, event) {
                event.captureDrag(sender);
            },
            _dragstart: function (sender, event) {
                this.view("scalingLayer").dom().setStyle('pointer-events', 'none');
                this.fire('dragStageStart', event);
            },
            _drag: function (sender, event) {
                this.fire('dragStage', event);
            },
            _dragend: function (sender, event) {
                this.fire('dragStageEnd', event);
                this.view("scalingLayer").dom().setStyle('pointer-events', 'all');
            }
        }
    });


})(nx, nx.global);
