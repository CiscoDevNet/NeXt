(function (nx, global) {

    var Vector = nx.geometry.Vector;
    /**
     * Abstract node class
     * @class nx.graphic.Topology.AbstractNode
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.AbstractNode", nx.graphic.Group, {
        events: ['updateNodeCoordinate', 'selectNode', 'remove'],
        properties: {
            /**
             * Get  node's absolute position
             * @property  position
             */
            position: {
                get: function () {
                    return {
                        x: this._x || 0,
                        y: this._y || 0
                    };
                },
                set: function (obj) {
                    var isModified = false;
                    if (obj.x != null && obj.x !== this._x && !this._lockXAxle) {
                        this._x = obj.x;
                        this.notify("x");
                        isModified = true;
                    }

                    if (obj.y != null && obj.y !== this._y && !this._lockYAxle) {
                        this._y = obj.y;
                        this.notify("y");
                        isModified = true;
                    }

                    if (isModified) {
                        var model = this.model();
                        model.position({
                            x: this._x,
                            y: this._y
                        });

                        this.view().setTransform(this._x, this._y);
                    }
                }
            },
            absolutePosition: {
                //dependencies: ['position'],
                get: function () {
                    var position = this.position();
                    var topoMatrix = this.topology().matrix();
                    var stageScale = topoMatrix.scale();
                    return {
                        x: position.x * stageScale + topoMatrix.x(),
                        y: position.y * stageScale + topoMatrix.y()
                    };
                },
                set: function (position) {
                    if (position == null || position.x == null || position.y == null) {
                        return false;
                    }
                    var topoMatrix = this.topology().matrix();
                    var stageScale = topoMatrix.scale();

                    this.position({
                        x: (position.x - topoMatrix.x()) / stageScale,
                        y: (position.y - topoMatrix.y()) / stageScale
                    });
                }
            },
            matrix: {
                //dependencies: ['position'],
                get: function () {
                    var position = this.position();
                    var stageScale = this.stageScale();
                    return [
                        [stageScale, 0, 0],
                        [0, stageScale, 0],
                        [position.x, position.y, 1]
                    ];
                }
            },
            /**
             * Get  node's vector
             * @property  vector
             */
            vector: {
                //dependencies: ['position'],
                get: function () {
                    return new Vector(this.x(), this.y());
                }
            },
            /**
             * Get/set  node's x position, suggest use position
             * @property  x
             */
            x: {
                ////dependencies: ['position'],
                get: function () {
                    return this._x || 0;
                },
                set: function (value) {
                    return this.position({x: parseFloat(value)});
                }
            },
            /**
             * Get/set  node's y position, suggest use position
             * @property  y
             */
            y: {
                ////dependencies: ['position'],
                get: function () {
                    return this._y || 0;
                },
                set: function (value) {
                    return this.position({y: parseFloat(value)});
                }
            },
            /**
             * Lock x axle, node only can move at y axle
             * @property lockXAxle {Boolean}
             */
            lockXAxle: {
                value: false
            },
            /**
             * Lock y axle, node only can move at x axle
             * @property lockYAxle
             */
            lockYAxle: {
                value: false
            },
            /**
             * Get topology stage scale
             * @property scale
             */
            stageScale: {
                set: function (value) {
                    this.view().setTransform(null, null, value);
                }
            },
            /**
             * Get topology instance
             * @property  topology
             */
            topology: {},
            /**
             * Get node's id
             * @property id
             */
            id: {
                get: function () {
                    return this.model().id();
                }
            },
            /**
             * Node is been selected statues
             * @property selected
             */
            selected: {
                value: false
            },
            /**
             * Get/set node's usablity
             * @property enable
             */
            enable: {
                value: true
            },
            /**
             * Get node self reference
             * @property node
             */
            node: {
                get: function () {
                    return this;
                }
            },
            showIcon: {
                value: true
            },
            links: {
                get: function () {
                    var links = {};
                    this.eachLink(function (link, id) {
                        links[id] = link;
                    });
                    return links;
                }
            },
            linkSets: {
                get: function () {
                    var linkSets = {};
                    this.eachLinkSet(function (linkSet, linkKey) {
                        linkSets[linkKey] = linkSet;
                    });
                    return linkSets;
                }
            },
            connectedNodes: {
                get: function () {
                    var nodes = {};
                    this.eachConnectedNode(function (node, id) {
                        nodes[id] = node;
                    });
                    return nodes;
                }
            }
        },
        view: {
            type: 'nx.graphic.Group'
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.watch('selected', function (prop, value) {
                    /**
                     * Fired when node been selected or cancel selected
                     * @event selectNode
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('selectNode', value);
                }, this);
            },
            /**
             * Factory function , will be call when set model
             */
            setModel: function (model) {
                this.model(model);
                model.upon('updateCoordinate', function (sender, args) {
                    this.position({
                        x: args.newPosition.x,
                        y: args.newPosition.y
                    });
                    /**
                     * Fired when node update coordinate
                     * @event updateNodeCoordinate
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('updateNodeCoordinate');
                }, this);


                this.setBinding('visible', 'model.visible,direction=<>', this);
                this.setBinding('selected', 'model.selected,direction=<>', this);

                //initialize position
                this.position(model.position());
            },
            update: function () {

            },
            /**
             * Move node certain distance
             * @method move
             * @param x {Number}
             * @param y {Number}
             */
            move: function (x, y) {
                var position = this.position();
                this.position({x: position.x + x || 0, y: position.y + y || 0});
            },
            /**
             * Move to a position
             * @method moveTo
             * @param x {Number}
             * @param y {Number}
             * @param callback {Function}
             * @param isAnimated {Boolean}
             * @param duration {Number}
             */
            moveTo: function (x, y, callback, isAnimated, duration) {
                if (isAnimated !== false) {
                    var obj = {to: {}, duration: duration || 400};
                    obj.to.x = x;
                    obj.to.y = y;

                    if (callback) {
                        obj.complete = callback;
                    }
                    this.animate(obj);
                } else {
                    this.position({x: x, y: y});
                }
            },
            /**
             * Use css translate to move node for high performance, when use this method, related link can't recive notification. Could hide links during transition.
             * @method translateTo
             * @param x {Number}
             * @param y {Number}
             * @param callback {Function}
             */
            translateTo: function (x, y, callback) {

            },
            /**
             * Iterate  all connected links to this node
             * @method eachLink
             * @param callback
             * @param context
             */
            eachLink: function (callback, context) {
                var model = this.model();
                var topo = this.topology();
                //todo

                this.eachLinkSet(function (linkSet) {
                    linkSet.eachLink(callback, context || this);
                });

            },
            eachLinkSet: function (callback, context) {
                var model = this.model();
                var topo = this.topology();
                nx.each(model.edgeSets(), function (edgeSet, linkKey) {
                    var linkSet = topo.getLinkSetByLinkKey(linkKey);
                    if (linkSet) {
                        callback.call(context || this, linkSet, linkKey);
                    }
                }, this);
                nx.each(model.edgeSetCollections(), function (edgeSetCollection, linkKey) {
                    var linkSet = topo.getLinkSetByLinkKey(linkKey);
                    if (linkSet) {
                        callback.call(context || this, linkSet, linkKey);
                    }
                }, this);
            },
            /**
             * Iterate all connected node
             * @method eachConnectedNode
             * @param callback {Function}
             * @param context {Object}
             */
            eachConnectedNode: function (callback, context) {
                var topo = this.topology();
                this.model().eachConnectedVertex(function (vertex, id) {
                    var node = topo.getNode(id);
                    if (node) {
                        callback.call(context || this, node, id);
                    }
                });
            },
            dispose: function () {
                var model = this.model();
                if (model) {
                    model.upon('updateCoordinate', null);
                }
                this.fire('remove');
                this.inherited();
            }
        }
    });


})(nx, nx.global);