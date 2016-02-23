(function(nx, global) {
    /**
     * Global drag manager

     var Component = nx.define(nx.ui.Component, {
        view: {
            content: {
                name: "stage",
                type: 'nx.graphic.TopologyStage',
                props: {
                    width: 600,
                    height: 600
                },
                content: {
                    name: 'a',
                    type: 'nx.graphic.Rect',
                    props: {
                        x: 100,
                        y: 10,
                        width: 100,
                        height: 100,
                        fill: '#f0f'
                    },
                    events: {
                        'mousedown': '{#_mousedown}',
                        'dragmove': '{#_dragmove}'
                    }
                }
            }
        },
        properties: {
            positionX: {
                value: 150
            }
        },
        methods: {
            _mousedown: function (sender, event) {
                event.captureDrag(sender.owner());
            },
            _dragmove: function (sender, event) {
                sender.set("x", sender.get("x") * 1 + event.drag.delta[0]);
                sender.set("y", sender.get("y") * 1 + event.drag.delta[1]);
            }

        }
     });


     var app = new nx.ui.Application();
     var comp = new Component();
     comp.attach(app);


     * @class nx.graphic.DragManager
     * @static
     * @extend nx.Observable
     */

    nx.define("nx.graphic.DragManager", nx.Observable, {
        static: true,
        properties: {
            /**
             * activated component.
             * @property node {nx.graphic.Component}
             */
            node: {},
            /**
             * All coordinate will reference to this element.
             * @property referrer {DOMELement}
             */
            referrer: {},
            /**
             * drag track
             * @property track {Array}
             */
            track: {},
            /**
             * Dragging indicator
             * @property dragging
             * @type Boolean
             */
            dragging: {
                value: false
            }
        },
        methods: {
            init: function() {
                window.addEventListener('mousedown', this._capture_mousedown.bind(this), true);
                window.addEventListener('mousemove', this._capture_mousemove.bind(this), true);
                window.addEventListener('mouseup', this._capture_mouseup.bind(this), true);
                window.addEventListener('touchstart', this._capture_mousedown.bind(this), true);
                window.addEventListener('touchmove', this._capture_mousemove.bind(this), true);
                window.addEventListener('touchend', this._capture_mouseup.bind(this), true);

            },
            /**
             * Start drag event capture
             * @method start
             * @param evt {Event} original dom event
             * @returns {function(this:nx.graphic.DragManager)}
             */
            start: function(evt) {
                return function(node, referrer) {
                    // make sure only one node can capture the "drag" event
                    if (node && !this.node()) {
                        // FIXME may not be right on global
                        referrer = (referrer === window || referrer === document || referrer === document.body) ? document.body : (referrer || node);
                        referrer = (typeof referrer.dom === "function") ? referrer.dom().$dom : referrer;
                        this.node(node);
                        this.referrer(referrer);
                        // track and data
                        var bound, track = [];
                        bound = referrer.getBoundingClientRect();
                        this.track(track);
                        var pageX = (evt.touches && evt.touches.length) ? evt.touches[0].pageX : evt.pageX;
                        var pageY = (evt.touches && evt.touches.length) ? evt.touches[0].pageY : evt.pageY;
                        var current = [pageX - document.body.scrollLeft - bound.left, pageY - document.body.scrollTop - bound.top];
                        track.push(current);
                        track[0].time = evt.timeStamp;
                        evt.dragCapture = function() {};
                        return true;
                    }
                }.bind(this);
            },
            /**
             * Drag move handler
             * @method move
             * @param evt {Event} original dom event
             */
            move: function(evt) {
                var node = this.node();
                if (node) {
                    // attach to the event
                    evt.drag = this._makeDragData(evt);
                    if (!this.dragging()) {
                        this.dragging(true);
                        node.fire("dragstart", evt);
                    }
                    // fire events
                    node.fire("dragmove", evt);
                }
            },
            /**
             * Drag end
             * @method end
             * @param evt {Event} original dom event
             */
            end: function(evt) {
                var node = this.node();
                if (node) {
                    // attach to the event
                    evt.drag = this._makeDragData(evt);
                    // fire events
                    if (this.dragging()) {
                        node.fire("dragend", evt);
                    }
                    // clear status
                    this.node(null);
                    this.track(null);
                    this.dragging(false);
                }
            },
            _makeDragData: function(evt) {
                var track = this.track();
                var bound = this.referrer().getBoundingClientRect();
                var pageX = (evt.touches && evt.touches.length) ? evt.touches[0].pageX : evt.pageX;
                var pageY = (evt.touches && evt.touches.length) ? evt.touches[0].pageY : evt.pageY;
                var current = [pageX - document.body.scrollLeft - bound.left, pageY - document.body.scrollTop - bound.top],
                    origin = track[0],
                    last = track[track.length - 1];
                current.time = evt.timeStamp;
                track.push(current);
                // FIXME optimize if track too large
                if (track.length > 20) {
                    track.splice(1, track.length - 20);
                }
                // TODO make sure the data is correct when target applied a matrix
                return {
                    target: this.node(),
                    accord: this.referrer(),
                    origin: origin,
                    current: current,
                    offset: [current[0] - origin[0], current[1] - origin[1]],
                    delta: [current[0] - last[0], current[1] - last[1]],
                    track: track
                };
            },
            _capture_mousedown: function(evt) {
                if (evt.captureDrag) {
                    this._lastDragCapture = evt.captureDrag;
                }
                if (evt.type === "mousedown" || evt.type === "touchstart") {
                    evt.captureDrag = this.start(evt);
                } else {
                    evt.captureDrag = function() {};
                }
            },
            _capture_mousemove: function(evt) {
                this.move(evt);
                var node = this.node();
                if (node) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    return false;
                }
            },
            _capture_mouseup: function(evt) {
                this.end(evt);
            }
        }
    });

})(nx, nx.global);