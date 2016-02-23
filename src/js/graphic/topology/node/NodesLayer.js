(function (nx, global) {
    var util = nx.util;
    /**
     * Nodes layer
     Could use topo.getLayer('nodes') get this
     * @class nx.graphic.Topology.NodesLayer
     * @extend nx.graphic.Topology.Layer
     *
     */
    var CLZ = nx.define('nx.graphic.Topology.NodesLayer', nx.graphic.Topology.Layer, {
        statics: {
            defaultConfig: {}
        },
        events: ['clickNode', 'enterNode', 'leaveNode', 'dragNodeStart', 'dragNode', 'dragNodeEnd', 'hideNode', 'pressNode', 'selectNode', 'updateNodeCoordinate'],
        properties: {
            /**
             * Get all nodes instance
             * @property nodes {Array}
             */
            nodes: {
                get: function () {
                    return this.nodeDictionary().values().toArray();
                }
            },
            /**
             * Get all nodes instance map
             * @property nodesMap {Object}
             */
            nodesMap: {
                get: function () {
                    return this.nodeDictionary().toObject();
                }
            },
            /**
             * Nodes observable dictionary
             * @property nodeDictionary {nx.data.ObservableDictionary}
             */
            nodeDictionary: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {
            attach: function (args) {
                this.inherited(args);

                var topo = this.topology();
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.nodeDictionary().each(function (item) {
                        item.value().stageScale(value);
                    });
                }, this);

                topo.watch('revisionScale', this.__watchRevisionScale = function (prop, value) {
                    this.nodeDictionary().each(function (item) {
                        item.value().revisionScale(value);
                    }, this);
                }, this);
            },
            /**
             * Add node a nodes layer
             * @param vertex
             * @method addNode
             */
            addNode: function (vertex) {
                var id = vertex.id();
                var node = this._generateNode(vertex);
                this.nodeDictionary().setItem(id, node);
                return node;
            },

            /**
             * Remove node
             * @method removeNode
             * @param id
             */
            removeNode: function (id) {
                var nodeDictionary = this.nodeDictionary();
                var node = nodeDictionary.getItem(id);
                if (node) {
                    node.dispose();
                    nodeDictionary.removeItem(id);
                }
            },
            updateNode: function (id) {
                var nodeDictionary = this.nodeDictionary();
                var node = nodeDictionary.getItem(id);
                if (node) {
                    node.update();
                }
            },
            //get node instance class
            _getNodeInstanceClass: function (vertex) {
                var Clz;
                var topo = this.topology();
                var nodeInstanceClass = topo.nodeInstanceClass();
                if (nx.is(nodeInstanceClass, 'Function')) {
                    Clz = nodeInstanceClass.call(this, vertex);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeInstanceClass);
                }
                if (!Clz) {
                    throw "Error on instance node class";
                }
                return Clz;
            },

            _generateNode: function (vertex) {
                var id = vertex.id();
                var topo = this.topology();
                var stageScale = topo.stageScale();
                var Clz = this._getNodeInstanceClass(vertex);
                var node = new Clz({
                    topology: topo
                });
                node.setModel(vertex);
                node.attach(this.view());

                node.sets({
                    'class': 'node',
                    'data-id': id,
                    'stageScale': stageScale
                });


                this.updateDefaultSetting(node);
                //                setTimeout(function () {
                //                    this.updateDefaultSetting(node);
                //                }.bind(this), 0);
                return node;
            },


            updateDefaultSetting: function (node) {
                var topo = this.topology();
                // delegate events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(node.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        node.on(e, function (sender, event) {
                            if (event instanceof MouseEvent) {
                                window.event = event;
                            }
                            this.fire(e, node);
                        }, this);
                    }
                }, this);

                //properties
                var nodeConfig = this.nodeConfig = nx.extend({
                    enableSmartLabel: topo.enableSmartLabel()
                }, CLZ.defaultConfig, topo.nodeConfig());
                delete nodeConfig.__owner__;
                nx.each(nodeConfig, function (value, key) {
                    util.setProperty(node, key, value, topo);
                }, this);

                util.setProperty(node, 'showIcon', topo.showIcon());

                if (topo.revisionScale() !== 1) {
                    node.revisionScale(topo.revisionScale());
                }


            },

            /**
             * Iterate all nodes
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNode: function (callback, context) {
                this.nodeDictionary().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNode
             */
            getNode: function (id) {
                return this.nodeDictionary().getItem(id);
            },
            clear: function () {
                this.eachNode(function (node) {
                    node.dispose();
                });
                this.nodeDictionary().clear();
                this.inherited();

            },
            dispose: function () {
                this.clear();
                var topo = this.topology();
                if (topo) {
                    this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                    this.topology().unwatch('revisionScale', this.__watchRevisionScale, this);
                    if (topo._activeNodesWatcher) {
                        topo._activeNodesWatcher.dispose();
                    }
                    if (topo._highlightedNodesWatcher) {
                        topo._highlightedNodesWatcher.dispose();
                    }

                }


                this.inherited();
            }
        }
    });


})(nx, nx.global);
