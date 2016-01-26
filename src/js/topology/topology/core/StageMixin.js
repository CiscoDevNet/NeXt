(function (nx, global) {
    /**
     * Topology stage class
     * @class nx.graphic.Topology.StageMixin
     * @module nx.graphic.Topology
     */
    nx.define('nx.graphic.Topology.StageMixin', {
        events: ['fitStage', 'ready', 'resizeStage', 'afterFitStage'],
        properties: {
            /**
             * Set/get topology's width.
             * @property width {Number}
             */
            width: {
                get: function () {
                    return this._width || 300 + this.padding() * 2;
                },
                set: function (value) {
                    return this.resize(value);
                }
            },
            /**
             * height Set/get topology's height.
             * @property height {Number}
             */
            height: {
                get: function () {
                    return this._height || 300 + this.padding() * 2;
                },
                set: function (value) {
                    this.resize(null, value);
                }
            },
            /**
             * Set/get stage's padding.
             * @property padding {Number}
             */
            padding: {
                value: 100
            },
            /**
             * Set/get topology's scalability
             * @property scalable {Boolean}
             */
            scalable: {
                value: true
            },
            stageScale: {
                value: 1
            },
            revisionScale: {
                value: 1
            },
            matrix: {
                value: function () {
                    return new nx.geometry.Matrix(nx.geometry.Matrix.I);
                }
            },
            /**
             * Set to true will adapt to topology's outside container, set to ture will ignore width/height
             * @property adaptive {Boolean}
             */
            adaptive: {
                value: false
            },
            /**
             * Get the topology's stage component
             * @property stage {nx.graphic.Component}
             */
            stage: {
                get: function () {
                    return this.view('stage');
                }
            },
            /**
             * Enabling the smart node feature, set to false will improve the performance
             * @property enableSmartNode {Boolean}
             */
            enableSmartNode: {
                value: true
            },
            autoFit: {
                value: true
            }
        },

        methods: {
            initStage: function () {
                nx.each(nx.graphic.Icons.icons, function (iconObj, key) {
                    if (iconObj.icon) {
                        var icon = iconObj.icon.cloneNode(true);
                        icon.setAttribute("height", iconObj.size.height);
                        icon.setAttribute("width", iconObj.size.width);
                        icon.setAttribute("data-device-type", key);
                        icon.setAttribute("id", key);
                        icon.setAttribute("class", 'deviceIcon');
                        this.stage().addDef(icon);
                    }
                }, this);
            },
            _adaptiveTimer: function () {
                var self = this;
                if (!this.adaptive() && (this.width() !== 0 && this.height() !== 0)) {
                    this.status('appended');
                    /**
                     * Fired when topology appended to container with with& height
                     * @event ready
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    setTimeout(function () {
                        this.fire('ready');
                    }.bind(this), 0);

                } else {
                    var timer = setInterval(function () {
                        if (self.dom() && nx.dom.Document.body().contains(self.dom())) {
                            clearInterval(timer);
                            this._adaptToContainer();
                            this.status('appended');
                            this.fire('ready');
                        }
                    }.bind(this), 10);
                }
            },
            _adaptToContainer: function () {
                var bound = this.view().dom().parentNode().getBound();
                if (bound.width === 0 || bound.height === 0) {
                    if (console) {
                        console.warn("Please set height*width to topology's parent container");
                    }
                    return;
                }
                if (this._width !== bound.width || this._height !== bound.height) {
                    this.resize(bound.width, bound.height);
                }
            },
            /**
             * Make topology adapt to container,container should set width/height
             * @method adaptToContainer
             */
            adaptToContainer: function (callback) {
                if (!this.adaptive()) {
                    return;
                }
                this._adaptToContainer();
                this.fit();
            },


            /**
             * Get the passing bound's relative inside bound,if not passing param will return the topology graphic's bound
             * @param bound {JSON}
             * @returns {{left: number, top: number, width: number, height: number}}
             */
            getInsideBound: function (bound) {
                var _bound = bound || this.stage().view('stage').getBound();
                var topoBound = this.view().dom().getBound();

                return {
                    left: _bound.left - topoBound.left,
                    top: _bound.top - topoBound.top,
                    width: _bound.width,
                    height: _bound.height
                };
            },
            getAbsolutePosition: function (obj) {
                var topoMatrix = this.matrix();
                var stageScale = topoMatrix.scale();
                var topoOffset = this.view().dom().getOffset();
                return {
                    x: obj.x * stageScale + topoMatrix.x() + topoOffset.left,
                    y: obj.y * stageScale + topoMatrix.y() + topoOffset.top
                };
            },
            /**
             * Make topology graphic fit stage
             * @method fit
             */
            fit: function (callback, context, isAnimated) {
                this.stage().fit(function () {
                    this.adjustLayout();
                    /* jshint -W030 */
                    callback && callback.call(context || this);
                    this.fire('afterFitStage');
                }, this, isAnimated == null ? true : isAnimated);
                /**
                 * Fired when  after topology fit to stage
                 * @event fit
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('fitStage');

            },
            /**
             * Zoom topology
             * @param value {Number}
             * @method zoom
             */
            zoom: function (value) {

            },
            /**
             * Zoom topology by a bound
             * @method zoomByBound
             * @param inBound {Object} e.g {left:Number,top:Number,width:Number,height:Number}
             * @param [callback] {Function} callback function
             * @param [context] {Object} callback context
             * @param [duration] {Number} set the transition time, unit is second
             */
            zoomByBound: function (inBound, callback, context, duration) {
                this.stage().zoomByBound(inBound, function () {
                    this.adjustLayout();
                    /* jshint -W030 */
                    callback && callback.call(context || this);
                    this.fire('zoomend');
                }, this, duration !== undefined ? duration : 0.9);
            },
            /**
             * Move topology
             * @method move
             * @param x {Number}
             * @param y {Number}
             * @param [duration] {Number} default is 0
             */
            move: function (x, y, duration) {
                var stage = this.stage();
                stage.applyTranslate(x || 0, y || 0, duration);
            },
            /**
             * Resize topology
             * @method resize
             * @param width {Number}
             * @param height {Number}
             */
            resize: function (width, height) {
                var modified = false;
                if (width != null && width != this._width) {
                    var _width = Math.max(width, 300 + this.padding() * 2);
                    if (_width != this._width) {
                        this._width = _width;
                        modified = true;
                    }
                }
                if (height != null) {
                    var _height = Math.max(height, 300 + this.padding() * 2);
                    if (_height != this._height) {
                        this._height = _height;
                    }
                }

                if (modified) {
                    this.notify('width');
                    this.notify('height');
                    this.stage().resetFitMatrix();
                    /**
                     * Fired when topology's stage changed
                     * @event resizeStage
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('resizeStage');
                }
                return modified;
            },
            /**
             * If enable enableSmartNode, this function will auto adjust the node's overlapping and set the nodes to right size
             * @method adjustLayout
             */
            adjustLayout: function () {


                if (!this.enableSmartNode()) {
                    return;
                }

                if (this._adjustLayoutTimer) {
                    clearTimeout(this._adjustLayoutTimer);
                }
                this._adjustLayoutTimer = setTimeout(function () {
                    var graph = this.graph();
                    if (graph) {
                        var startTime = new Date();
                        var topoMatrix = this.matrix();
                        var stageScale = topoMatrix.scale();
                        var positionAry = [];
                        this.eachNode(function (node) {
                            if (node.activated && !node.activated()) {
                                return;
                            }
                            var position = node.position();
                            positionAry[positionAry.length] = {
                                x: position.x * stageScale + topoMatrix.x(),
                                y: position.y * stageScale + topoMatrix.y()
                            };
                        });
                        var calc = function (positionAry) {
                            var length = positionAry.length;
                            var iconRadius = 36 * 36;
                            var dotRadius = 32 * 32;

                            var testOverlap = function (sourcePosition, targetPosition) {
                                var distance = Math.pow(Math.abs(sourcePosition.x - targetPosition.x), 2) + Math.pow(Math.abs(sourcePosition.y - targetPosition.y), 2);
                                return {
                                    iconOverlap: distance < iconRadius,
                                    dotOverlap: distance < dotRadius
                                };
                            };

                            var iconOverlapCounter = 0;
                            var dotOverlapCounter = 0;

                            for (var i = 0; i < length; i++) {
                                var sourcePosition = positionAry[i];
                                var iconIsOverlap = false;
                                var dotIsOverlap = false;
                                for (var j = 0; j < length; j++) {
                                    var targetPosition = positionAry[j];
                                    if (i !== j) {
                                        var result = testOverlap(sourcePosition, targetPosition);
                                        /* jshint -W030 */
                                        result.iconOverlap && (iconIsOverlap = true);
                                        /* jshint -W030 */
                                        result.dotOverlap && (dotIsOverlap = true);
                                    }
                                }
                                /* jshint -W030 */
                                iconIsOverlap && iconOverlapCounter++;
                                /* jshint -W030 */
                                dotIsOverlap && dotOverlapCounter++;
                            }

                            //0.2,0.4,0.6.0.8,1
                            var overlapPercent = 1;
                            if (iconOverlapCounter / length > 0.2) {
                                overlapPercent = 0.8;
                                if (dotOverlapCounter / length > 0.8) {
                                    overlapPercent = 0.2;
                                } else if (dotOverlapCounter / length > 0.5) {
                                    overlapPercent = 0.4;
                                } else if (dotOverlapCounter / length > 0.15) {
                                    overlapPercent = 0.6;
                                }
                            }
                            return overlapPercent;
                        };

                        if (window.Blob && window.Worker) {
                            var fn = "onmessage = function(e) { self.postMessage(calc(e.data)); };";
                            fn += "var calc = " + calc.toString();

                            if (!this.adjustWorker) {
                                var blob = new Blob([fn]);
                                // Obtain a blob URL reference to our worker 'file'.
                                var blobURL = window.URL.createObjectURL(blob);
                                var worker = this.adjustWorker = new Worker(blobURL);
                                worker.onmessage = function (e) {
                                    var overlapPercent = e.data;
                                    this.revisionScale(overlapPercent);
                                }.bind(this);
                            }
                            this.adjustWorker.postMessage(positionAry); // Start the worker.
                        }


                        //                        var overlapPercent = calc(positionAry);
                        //                        this.revisionScale(overlapPercent);
                        //                        nodesLayer.updateNodeRevisionScale(overlapPercent);

                    }
                }.bind(this), 200);
            }
        }
    });
})
(nx, nx.global);
