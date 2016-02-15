(function(nx, global) {

    var util = nx.util;


    /**
     * Node mixin class
     * @class nx.graphic.Topology.NodeMixin
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.NodeMixin", {
        events: ['addNode', 'deleteNode', 'addNodeSet', 'deleteNodeSet', 'expandAll'],
        properties: {
            /**
             * Node instance class name, support function
             * @property nodeInstanceClass
             */
            nodeInstanceClass: {
                value: 'nx.graphic.Topology.Node'
            },
            /**
             * NodeSet instance class name, support function
             * @property nodeSetInstanceClass
             */
            nodeSetInstanceClass: {
                value: 'nx.graphic.Topology.NodeSet'
            },
            /**
             * Set node's draggable
             * @property nodeDraggable
             */
            nodeDraggable: {
                value: true
            },
            /**
             * Enable smart label
             * @property enableSmartLabel
             */
            enableSmartLabel: {
                value: true
            },
            /**
             * Show or hide node's icon
             * @property showIcon
             */
            showIcon: {
                get: function() {
                    return this._showIcon !== undefined ? this._showIcon : false;
                },
                set: function(value) {
                    if (this._showIcon !== value) {
                        this._showIcon = value;
                        if (this.status() !== "initializing") {
                            this.eachNode(function(node) {
                                node.showIcon(value);
                            });
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            /**
             * All node's config. key is node's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {nodeConfig}
             */
            nodeConfig: {},
            /**
             * All nodeSet's config. key is node's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {nodeSetConfig}
             */
            nodeSetConfig: {},
            /**
             * All selected nodes, could direct add/remove nodes to this collection
             * @property selectedNodes {nx.data.ObservableCollection}
             */
            selectedNodes: {
                value: function() {
                    return new nx.data.UniqObservableCollection();
                }
            },
            activeNodes: {
                set: function(value) {
                    var nodesLayer = this.getLayer("nodes");
                    var nodeSetLayer = this.getLayer("nodeSet");
                    var watcher = this._activeNodesWatcher;
                    if (!watcher) {
                        watcher = this._activeNodesWatcher = new nx.graphic.Topology.NodeWatcher();
                        watcher.topology(this);
                        watcher.updater(function() {
                            var nodes = watcher.getNodes();
                            nx.each(nodes, function(node) {
                                if (node.model().type() == 'vertex') {
                                    nodesLayer.activeElements().add(node);
                                } else {
                                    nodeSetLayer.activeElements().add(node);
                                }
                            }, this);
                        }.bind(this));


                    }
                    nodesLayer.activeElements().clear();
                    nodeSetLayer.activeElements().clear();
                    watcher.nodes(value);
                    this._activeNodes = value;
                }
            },
            highlightedNodes: {
                set: function(value) {
                    var nodesLayer = this.getLayer("nodes");
                    var nodeSetLayer = this.getLayer("nodeSet");
                    var watcher = this._highlightedNodesWatcher;
                    if (!watcher) {
                        watcher = this._highlightedNodesWatcher = new nx.graphic.Topology.NodeWatcher();
                        watcher.topology(this);
                        watcher.updater(function() {
                            nx.each(watcher.getNodes(), function(node) {
                                if (node.model().type() == 'vertex') {
                                    nodesLayer.highlightedElements().add(node);
                                } else {
                                    nodeSetLayer.highlightedElements().add(node);
                                }
                            }, this);
                        }.bind(this));
                    }

                    nodesLayer.highlightedElements().clear();
                    nodeSetLayer.highlightedElements().clear();
                    watcher.nodes(value);
                    this._highlightedNodes = value;
                }
            },
            enableNodeSetAnimation: {
                value: true
            },
            aggregationRule: {}
        },
        methods: {
            initNode: function() {
                var selectedNodes = this.selectedNodes();
                selectedNodes.on('change', function(sender, args) {
                    if (args.action == 'add') {
                        nx.each(args.items, function(node) {
                            node.selected(true);
                            node.on('remove', this._removeSelectedNode = function() {
                                selectedNodes.remove(node);
                            }, this);
                        }, this);
                    } else if (args.action == 'remove') {
                        nx.each(args.items, function(node) {
                            node.selected(false);
                            node.off('remove', this._removeSelectedNode, this);
                        }, this);
                    } else if (args.action == "clear") {
                        nx.each(args.items, function(node) {
                            node.selected(false);
                            node.off('remove', this._removeSelectedNode, this);
                        }, this);
                    }
                });
            },
            /**
             * Add a node to topology
             * @method addNode
             * @param obj
             * @param inOption
             * @returns {*}
             */
            addNode: function(obj, inOption) {
                var vertex = this.graph().addVertex(obj, inOption);
                if (vertex) {
                    var node = this.getNode(vertex.id());
                    this.fire("addNode", node);
                    return node;
                } else {
                    return null;
                }

            },

            /**
             * Remove a node
             * @method removeNode
             * @param arg
             * @returns {boolean}
             */
            removeNode: function(arg, callback, context) {
                this.deleteNode(arg);
            },
            deleteNode: function(arg, callback, context) {
                var id = arg;
                if (nx.is(arg, nx.graphic.Topology.AbstractNode)) {
                    id = arg.id();
                }
                var vertex = this.graph().getVertex(id);
                if (vertex) {
                    var node = this.getNode(id);
                    this.fire("deleteNode", node);
                    this.graph().deleteVertex(id);
                    if (callback) {
                        callback.call(context || this);
                    }
                }
            },
            _getAggregationTargets: function(vertices) {
                var graph = this.graph();
                var mark, marks, markmap = {},
                    NONE = nx.util.uuid();
                var i, v, vp, vpid, changed, vs = vertices.slice();
                // iterate unless the aggregation successful
                do {
                    changed = false;
                    for (i = vs.length - 1; i >= 0; i--) {
                        v = vs[i];
                        // get the parent vertex and its ID
                        vp = v.parentVertexSet();
                        vpid = (vp ? vp.id() : NONE);
                        // check if same parent vertex marked
                        if (!markmap.hasOwnProperty(vpid)) {
                            // create mark for the parent vertex
                            markmap[vpid] = {
                                vertex: vp || graph,
                                finding: graph.subordinates(vp),
                                found: []
                            };
                        }
                        // get parent mark
                        mark = markmap[vpid];
                        // check if child vertex marked already
                        if (mark === false || mark.found.indexOf(v) >= 0) {
                            // duplicated vertex appears, unable to aggregate
                            throw "wrong input";
                        }
                        // mark child vertex to its parent vertex
                        mark.found.push(v);
                        // remove child vertex from the pool
                        vs.splice(i, 1);
                        // set the vertex array changed
                        changed = true;
                        // check if the parent vertex is fully matched
                        if (mark.finding.length === mark.found.length && mark.vertex !== graph) {
                            // add parent vertex from the pool
                            vs.push(mark.vertex);
                            // mark the parent vertex as fully matched
                            markmap[vpid] = false;
                        }
                    }
                } while (changed);
                // clear fully matched marks from mark map
                for (mark in markmap) {
                    if (!markmap[mark]) {
                        delete markmap[mark];
                    }
                }
                // get remain marks of parent vertices
                marks = nx.util.values(markmap);
                // check if the number of parent not fully matched
                if (marks.length !== 1) {
                    // it should be at most & least one
                    throw nx.graphic.Topology.i18n.cantAggregateNodesInDifferentNodeSet;
                }
                // get the only parent's mark
                mark = marks[0];
                return mark.found;
            },
            aggregationNodes: function(inNodes, inConfig) {
                // transform nodes or node ids into vertices
                var nodes = [],
                    vertices = [];
                nx.each(inNodes, function(node) {
                    if (!nx.is(node, nx.graphic.Topology.AbstractNode)) {
                        node = this.getNode(node);
                    }
                    if (!nx.is(node, nx.graphic.Topology.AbstractNode)) {
                        throw "wrong input";
                    }
                    nodes.push(node);
                    vertices.push(node.model());
                }.bind(this));
                // get aggregate target vertices and ids
                var aggregateVertices, aggregateIds;
                // FIXME catch or not
                aggregateVertices = this._getAggregationTargets(vertices);
                if (aggregateVertices.length < 2) {
                    throw "wrong input. unable to aggregate.";
                }
                aggregateIds = [];
                nx.each(aggregateVertices, function(vertex) {
                    aggregateIds.push(vertex.id());
                });
                // check the user rule
                var aggregationRule = this.aggregationRule();
                if (aggregationRule && nx.is(aggregationRule, 'Function')) {
                    var result = aggregationRule.call(this, nodes, inConfig);
                    if (result === false) {
                        return;
                    }
                }
                // make up data, config and parent
                var data, parent, pn = null,
                    config = {};
                data = {
                    nodes: aggregateIds,
                    x: (inConfig && typeof inConfig.x === "number" ? inConfig.x : aggregateVertices[0].x()),
                    y: (inConfig && typeof inConfig.y === "number" ? inConfig.y : aggregateVertices[0].y()),
                    label: (inConfig && inConfig.label || [nodes[0].label(), nodes[nodes.length - 1].label()].sort().join("-"))
                };
                parent = aggregateVertices[0].parentVertexSet();
                if (parent) {
                    config.parentVertexSetID = parent.id();
                    pn = this.getNode(parent.id());
                }
                var nodeSet = this.addNodeSet(data, config, pn);
                this.stage().resetFitMatrix();
                return nodeSet;
            },
            /**
             * Add a nodeSet
             * @method addNodeSet
             * @param obj
             * @param [inOption]
             * @param [parentNodeSet]
             * @returns {*}
             */
            addNodeSet: function(obj, inOption, parentNodeSet) {
                var vertex = this.graph().addVertexSet(obj, inOption);
                if (vertex) {
                    var nodeSet = this.getNode(vertex.id());
                    if (parentNodeSet) {
                        nodeSet.parentNodeSet(parentNodeSet);
                    }
                    this.fire("addNodeSet", nodeSet);
                    return nodeSet;
                } else {
                    return null;
                }

            },
            removeNodeSet: function(arg, callback, context) {
                this.deleteNodeSet(arg);
            },

            deleteNodeSet: function(arg, callback, context) {
                if (!arg) {
                    return;
                }
                var id = arg;
                if (nx.is(arg, nx.graphic.Topology.AbstractNode)) {
                    id = arg.id();
                }
                var nodeSet = this.getLayer("nodeSet").getNodeSet(id);
                if (nodeSet) {
                    if (nodeSet.collapsed()) {
                        nodeSet.activated(false);
                        nodeSet.expandNodes(function() {
                            this.fire("deleteNodeSet", nodeSet);
                            this.graph().deleteVertexSet(id);
                            if (callback) {
                                callback.call(context || this);
                            }
                        }, this);
                    } else {
                        this.fire("deleteNodeSet", nodeSet);
                        this.graph().deleteVertexSet(id);
                        if (callback) {
                            callback.call(context || this);
                        }
                    }

                } else {
                    this.graph().deleteVertexSet(id);
                    if (callback) {
                        callback.call(context || this);
                    }
                }
            },


            /**
             * Traverse each node
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNode: function(callback, context) {
                this.getLayer("nodes").eachNode(callback, context || this);
                this.getLayer("nodeSet").eachNodeSet(callback, context || this);
            },
            /**
             * Get node by node id
             * @method getNode
             * @param id
             * @returns {*}
             */
            getNode: function(id) {
                return this.getLayer("nodes").getNode(id) || this.getLayer("nodeSet").getNodeSet(id);
            },
            /**
             * Get all visible nodes
             * @returns {Array}
             */
            getNodes: function() {
                var nodes = this.getLayer("nodes").nodes();
                var nodeSets = this.getLayer("nodeSet").nodeSets();
                if (nodeSets && nodeSets.length !== 0) {
                    return nodes.concat(nodeSets);
                } else {
                    return nodes;
                }
            },
            /**
             * Register a customize icon
             * @param name {String}
             * @param url {URL}
             * @param width {Number}
             * @param height {Number}
             */
            registerIcon: function(name, url, width, height) {
                var XLINK = 'http://www.w3.org/1999/xlink';
                var NS = "http://www.w3.org/2000/svg";
                var icon1 = document.createElementNS(NS, "image");
                icon1.setAttributeNS(XLINK, 'href', url);
                nx.graphic.Icons.icons[name] = {
                    size: {
                        width: width,
                        height: height
                    },
                    icon: icon1.cloneNode(true),
                    name: name
                };

                var icon = icon1.cloneNode(true);
                icon.setAttribute("height", height);
                icon.setAttribute("width", width);
                icon.setAttribute("data-device-type", name);
                icon.setAttribute("id", name);
                icon.setAttribute("class", 'deviceIcon');
                this.stage().addDef(icon);
            },
            /**
             * Batch action, highlight node and related nodes and connected links.
             * @param inNode
             */
            highlightRelatedNode: function(inNode) {
                var node;
                if (inNode == null) {
                    return;
                }

                if (nx.is(inNode, nx.graphic.Topology.AbstractNode)) {
                    node = inNode;
                } else {
                    node = this.getNode(inNode);
                }
                if (!node) {
                    return;
                }


                var nodeSetLayer = this.getLayer('nodeSet');
                var nodeLayer = this.getLayer('nodes');

                //highlight node
                if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                    nodeSetLayer.highlightedElements().add(node);
                } else {
                    nodeLayer.highlightedElements().add(node);
                }


                // highlight connected nodes and nodeSets
                node.eachConnectedNode(function(n) {
                    if (nx.is(n, 'nx.graphic.Topology.NodeSet')) {
                        nodeSetLayer.highlightedElements().add(n);
                    } else {
                        nodeLayer.highlightedElements().add(n);
                    }
                }, this);


                // highlight connected links and linkSets
                this.getLayer('linkSet').highlightLinkSets(util.values(node.linkSets()));
                this.getLayer('links').highlightLinks(util.values(node.links()));

                this.fadeOut(true);

            },
            /**
             * Batch action, highlight node and related nodes and connected links.
             * @param inNode
             */
            activeRelatedNode: function(inNode) {

                var node;
                if (!inNode) {
                    return;
                }

                if (nx.is(inNode, nx.graphic.Topology.AbstractNode)) {
                    node = inNode;
                } else {
                    node = this.getNode(inNode);
                }
                if (!node) {
                    return;
                }


                var nodeSetLayer = this.getLayer('nodeSet');
                var nodeLayer = this.getLayer('nodes');

                // active node
                if (nx.is(node, 'nx.graphic.Topology.NodeSet')) {
                    nodeSetLayer.activeElements().add(node);
                } else {
                    nodeLayer.activeElements().add(node);
                }


                // highlight connected nodes and nodeSets
                node.eachConnectedNode(function(n) {
                    if (nx.is(n, 'nx.graphic.Topology.NodeSet')) {
                        nodeSetLayer.activeElements().add(n);
                    } else {
                        nodeLayer.activeElements().add(n);
                    }
                }, this);


                // highlight connected links and linkSets
                this.getLayer('linkSet').activeLinkSets(util.values(node.linkSets()));
                this.getLayer('links').activeLinks(util.values(node.links()));

                this.fadeOut();

            },
            /**
             * Zoom topology to let the passing nodes just visible at the screen
             * @method zoomByNodes
             * @param [callback] {Function} callback function
             * @param [context] {Object} callback context
             * @param nodes {Array} nodes collection
             */
            zoomByNodes: function(nodes, callback, context, boundScale) {
                // TODO more overload about nodes
                if (!nx.is(nodes, Array)) {
                    nodes = [nodes];
                }
                // get bound of the selected nodes' models
                var stage = this.stage();
                var p0, p1, center, bound = this.getModelBoundByNodes(nodes);
                var delta, limitscale = stage.maxZoomLevel() * stage.fitMatrixObject().scale();

                if (!bound) {
                    return;
                }

                // check if the nodes are too close to zoom
                if (bound.width * limitscale < 1 && bound.height * limitscale < 1) {
                    // just centralize them instead of zoom
                    center = nx.geometry.Vector.transform(bound.center, stage.matrix());
                    delta = [stage.width() / 2 - center[0], stage.height() / 2 - center[1]];
                    stage.scalingLayer().setTransition(function() {
                        this.adjustLayout();
                        /* jshint -W030 */
                        callback && callback.call(context || this);
                        this.fire('zoomend');
                    }, this, 0.6);
                    stage.applyTranslate(delta[0], delta[1]);
                    stage.applyStageScale(stage.maxZoomLevel() / stage.zoomLevel() * boundScale);
                } else {
                    p0 = nx.geometry.Vector.transform([bound.left, bound.top], stage.matrix());
                    p1 = nx.geometry.Vector.transform([bound.right, bound.bottom], stage.matrix());
                    bound = {
                        left: p0[0],
                        top: p0[1],
                        width: Math.max(1, p1[0] - p0[0]),
                        height: Math.max(1, p1[1] - p0[1])
                    };

                    boundScale = 1 / (boundScale || 1);
                    bound.left += bound.width * (1 - boundScale) / 2;
                    bound.top += bound.height * (1 - boundScale) / 2;
                    bound.height *= boundScale;
                    bound.width *= boundScale;

                    this.zoomByBound(bound, function() {
                        this.adjustLayout();
                        /* jshint -W030 */
                        callback && callback.call(context || this);
                        this.fire('zoomend');
                    }, this);
                }
            },
            getModelBoundByNodes: function(nodes, isIncludeInvisibleNodes) {
                var xmin, xmax, ymin, ymax;
                nx.each(nodes, function(inNode) {
                    var vertex;
                    if (nx.is(inNode, nx.graphic.Topology.AbstractNode)) {
                        vertex = inNode.model();
                    } else {
                        if (isIncludeInvisibleNodes) {
                            vertex = this.graph().getVertex(inNode) || this.graph().getVertexSet(inNode);
                        } else {
                            var node = this.getNode(inNode);
                            vertex = node && node.model();
                        }
                    }
                    if (!vertex) {
                        return;
                    }


                    var x = vertex.x(),
                        y = vertex.y();
                    xmin = (xmin < x ? xmin : x);
                    ymin = (ymin < y ? ymin : y);
                    xmax = (xmax > x ? xmax : x);
                    ymax = (ymax > y ? ymax : y);
                }, this);
                if (xmin === undefined || ymin === undefined) {
                    return undefined;
                }
                return {
                    left: xmin,
                    top: ymin,
                    right: xmax,
                    bottom: ymax,
                    center: [(xmax + xmin) / 2, (ymax + ymin) / 2],
                    width: xmax - xmin,
                    height: ymax - ymin
                };
            },
            /**
             * Get the bound of passing node's
             * @param inNodes {Array}
             * @param isNotIncludeLabel {Boolean}
             * @returns {Array}
             */

            getBoundByNodes: function(inNodes, isNotIncludeLabel) {

                if (inNodes == null || inNodes.length === 0) {
                    inNodes = this.getNodes();
                }

                var bound = {
                    left: 0,
                    top: 0,
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    maxX: 0,
                    maxY: 0
                };

                var boundAry = [];


                nx.each(inNodes, function(inNode) {
                    var node;
                    if (nx.is(inNode, nx.graphic.Topology.AbstractNode)) {
                        node = inNode;
                    } else {
                        node = this.getNode(inNode);
                    }

                    if (!node) {
                        return;
                    }


                    if (node.visible()) {
                        if (isNotIncludeLabel) {
                            boundAry.push(this.getInsideBound(node.getBound(true)));
                        } else {
                            boundAry.push(this.getInsideBound(node.getBound()));
                        }
                    }
                }, this);


                var lastIndex = boundAry.length - 1;

                //
                boundAry.sort(function(a, b) {
                    return a.left - b.left;
                });

                bound.x = bound.left = boundAry[0].left;
                bound.maxX = boundAry[lastIndex].left;

                boundAry.sort(function(a, b) {
                    return (a.left + a.width) - (b.left + b.width);
                });

                bound.width = boundAry[lastIndex].left + boundAry[lastIndex].width - bound.x;


                //
                boundAry.sort(function(a, b) {
                    return a.top - b.top;
                });

                bound.y = bound.top = boundAry[0].top;
                bound.maxY = boundAry[lastIndex].top;

                boundAry.sort(function(a, b) {
                    return (a.top + a.height) - (b.top + b.height);
                });

                bound.height = boundAry[lastIndex].top + boundAry[lastIndex].height - bound.y;

                return bound;


            },
            _moveSelectionNodes: function(event, node) {
                if (this.nodeDraggable()) {
                    var nodes = this.selectedNodes().toArray();
                    var stageScale = this.stageScale();
                    if (nodes.indexOf(node) === -1) {
                        node.move(event.drag.delta[0] * stageScale, event.drag.delta[1] * stageScale);
                    } else {
                        nx.each(nodes, function(node) {
                            node.move(event.drag.delta[0] * stageScale, event.drag.delta[1] * stageScale);
                        });
                    }
                }
            },
            /**
             * Expand nodes from a source position, If nodes number more than 150, will ignore animation.
             * @method expandNodes
             * @param nodes {Array} ids of nodes to expand
             * @param sourcePosition
             * @param callback
             * @param context
             * @param isAnimate
             */
            expandNodes: function(nodes, sourcePosition, callback, context, isAnimate) {

                var nodesLength = nx.is(nodes, Array) ? nodes.length : nx.util.keys(nodes).length;
                callback = callback || function() {};


                if (nodesLength > 150 || nodesLength === 0 || isAnimate === false) {
                    callback.call(context || this, this);
                } else {
                    var positionMap = [];
                    nx.each(nodes, function(node) {
                        positionMap.push({
                            id: node.id(),
                            position: node.position(),
                            node: node
                        });
                        node.position(sourcePosition);
                    }, this);

                    if (this._nodesAnimation) {
                        this._nodesAnimation.stop();
                    }

                    var ani = this._nodesAnimation = new nx.graphic.Animation({
                        duration: 600
                    });
                    ani.callback(function(progress) {
                        nx.each(positionMap, function(item) {
                            var _position = item.position;
                            var node = item.node;
                            if (node && node.model()) {
                                node.position({
                                    x: sourcePosition.x + (_position.x - sourcePosition.x) * progress,
                                    y: sourcePosition.y + (_position.y - sourcePosition.y) * progress
                                });
                            }
                        });
                    }.bind(this));

                    ani.complete(function() {
                        callback.call(context || this, this);
                    }.bind(this));
                    ani.start();
                }
            },
            /**
             * To collapse nodes to a target position. If nodes number more than 150, will ignore animation.
             * @method collapseNodes
             * @param nodes nodes {Array} nodes to collape
             * @param targetPosition
             * @param callback
             * @param context
             * @param isAnimate
             */
            collapseNodes: function(nodes, targetPosition, callback, context, isAnimate) {
                var nodesLength = nx.is(nodes, Array) ? nodes.length : nx.util.keys(nodes).length;
                callback = callback || function() {};


                if (nodesLength > 150 || nodesLength === 0 || isAnimate === false) {
                    callback.call(context || this, this);
                } else {
                    var positionMap = [];
                    nx.each(nodes, function(node) {
                        positionMap.push({
                            id: node.id(),
                            position: node.position(),
                            node: node,
                            vertex: node.model(),
                            vertexPosition: node.model().position()
                        });
                    }, this);

                    if (this._nodesAnimation) {
                        this._nodesAnimation.stop();
                    }


                    var ani = this._nodesAnimation = new nx.graphic.Animation({
                        duration: 600
                    });
                    ani.callback(function(progress) {
                        nx.each(positionMap, function(item) {
                            var _position = item.position;
                            var node = item.node;
                            if (node && node.model()) {
                                node.position({
                                    x: _position.x - (_position.x - targetPosition.x) * progress,
                                    y: _position.y - (_position.y - targetPosition.y) * progress
                                });
                            }
                        });
                    }.bind(this));

                    ani.complete(function() {
                        nx.each(positionMap, function(item) {
                            item.vertex.position(item.vertexPosition);
                        });
                        callback.call(context || this, this);
                    }.bind(this));
                    ani.start();
                }
            },
            /**
             * Expand all nodeSets
             * @method expandAll
             */
            expandAll: function() {
                var nodeSetLayer = this.getLayer('nodeSet');
                //console.time('expandAll');
                var fn = function(callback) {
                    var isFinished = true;
                    nodeSetLayer.eachNodeSet(function(nodeSet) {
                        if (nodeSet.visible()) {
                            nodeSet.animation(false);
                            nodeSet.collapsed(false);
                            isFinished = false;
                        }
                    });
                    if (!isFinished) {
                        fn(callback);
                    } else {
                        callback();
                    }
                };

                this.showLoading();

                setTimeout(function() {
                    fn(function() {

                        nodeSetLayer.eachNodeSet(function(nodeSet) {
                            nodeSet.animation(true);
                        });
                        this.stage().resetFitMatrix();
                        this.hideLoading();
                        this.fit(function() {
                            this.blockEvent(false);
                            this.fire('expandAll');
                        }, this);
                    }.bind(this));
                }.bind(this), 100);
            },
            /**
             * Collpase all nodeSets
             * @method collapseAll
             */
            collapseAll: function() {
                var graph = this.graph();
                var rootVertexSets = {};
                graph.eachVertexSet(function(vertexSet, id) {
                    if (!vertexSet.rootVertexSet()) {
                        rootVertexSets[id] = vertexSet
                    }
                });

                this.showLoading();



                nx.each(rootVertexSets, function(vertex, id) {
                    var nodeSet = this.getNode(id);
                    if (nodeSet) {
                        nodeSet.animation(false);
                        nodeSet.collapsed(true);
                    }
                }, this);


                var nodeSetLayer = this.getLayer('nodeSet');
                setTimeout(function() {
                    nodeSetLayer.eachNodeSet(function(nodeSet) {
                        nodeSet.animation(true);
                    });
                    this.stage().resetFitMatrix();
                    this.hideLoading();
                    this.fit(function() {
                        this.blockEvent(false);
                        this.fire('collapseAll');
                    }, this);
                }.bind(this), 100);
            }
        }
    });


})(nx, nx.global);