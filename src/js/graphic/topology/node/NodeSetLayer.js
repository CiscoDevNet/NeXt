(function (nx, global) {
    var util = nx.util;
    var CLZ = nx.define('nx.graphic.Topology.NodeSetLayer', nx.graphic.Topology.Layer, {
        statics: {
            defaultConfig: {
                iconType: 'nodeSet',
                label: 'model.label'
            }
        },
        events: ['clickNodeSet', 'enterNodeSet', 'leaveNodeSet', 'dragNodeSetStart', 'dragNodeSet', 'dragNodeSetEnd', 'hideNodeSet', 'pressNodeSet', 'selectNodeSet', 'updateNodeSetCoordinate', 'expandNodeSet', 'collapseNodeSet', 'beforeExpandNodeSet', 'beforeCollapseNodeSet', 'updateNodeSet', 'removeNodeSet'],
        properties: {
            nodeSets: {
                get: function () {
                    return this.nodeSetDictionary().values().toArray();
                }
            },
            nodeSetMap: {
                get: function () {
                    return this.nodeSetDictionary().toObject();
                }
            },
            nodeSetDictionary: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {
            attach: function (args, index) {
                this.inherited(args, index);
                var topo = this.topology();
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.eachNodeSet(function (nodeSet) {
                        nodeSet.stageScale(value);
                    });
                }, this);

                topo.watch('revisionScale', this.__watchRevisionScale = function (prop, value) {
                    this.eachNodeSet(function (nodeSet) {
                        nodeSet.revisionScale(value);
                    }, this);
                }, this);

            },
            addNodeSet: function (vertexSet) {
                var id = vertexSet.id();
                var nodeSet = this._generateNodeSet(vertexSet);
                this.nodeSetDictionary().setItem(id, nodeSet);
                return nodeSet;
            },

            removeNodeSet: function (id) {
                var nodeSetDictionary = this.nodeSetDictionary();
                var nodeSet = nodeSetDictionary.getItem(id);
                if (nodeSet) {
                    this.fire('removeNodeSet', nodeSet);
                    nodeSet.dispose();
                    nodeSetDictionary.removeItem(id);
                }
            },
            updateNodeSet: function (id) {
                var nodeSetDictionary = this.nodeSetDictionary();
                var nodeSet = nodeSetDictionary.getItem(id);
                if (nodeSet) {
                    nodeSet.update();
                    this.fire('updateNodeSet', nodeSet);
                }
            },
            _getNodeSetInstanceClass: function (vertexSet) {
                var Clz;
                var topo = this.topology();
                var nodeSetInstanceClass = topo.nodeSetInstanceClass();
                if (nx.is(nodeSetInstanceClass, 'Function')) {
                    Clz = nodeSetInstanceClass.call(this, vertexSet);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeSetInstanceClass);
                }

                if (!Clz) {
                    throw "Error on instance node set class";
                }
                return Clz;

            },
            _generateNodeSet: function (vertexSet) {
                var id = vertexSet.id();
                var topo = this.topology();
                var stageScale = topo.stageScale();
                var Clz = this._getNodeSetInstanceClass(vertexSet);

                var nodeSet = new Clz({
                    topology: topo
                });
                nodeSet.setModel(vertexSet);
                nodeSet.attach(this.view());

                nodeSet.sets({
                    'data-id': id,
                    'class': 'node nodeset',
                    stageScale: stageScale
                }, topo);

//                setTimeout(function () {
                this.updateDefaultSetting(nodeSet);
//                }.bind(this), 0);
                return nodeSet;


            },
            updateDefaultSetting: function (nodeSet) {
                var topo = this.topology();


                //register events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(nodeSet.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        nodeSet.on(e, function (sender, event) {
                            if (event instanceof MouseEvent) {
                                window.event = event;
                            }
                            this.fire(e.replace('Node', 'NodeSet'), nodeSet);
                        }, this);
                    }
                }, this);


                var nodeSetConfig = nx.extend({enableSmartLabel: topo.enableSmartLabel()}, CLZ.defaultConfig, topo.nodeSetConfig());
                delete nodeSetConfig.__owner__;

                nx.each(nodeSetConfig, function (value, key) {
                    util.setProperty(nodeSet, key, value, topo);
                }, this);

                util.setProperty(nodeSet, 'showIcon', topo.showIcon());

                if (topo.revisionScale() !== 1) {
                    nodeSet.revisionScale(topo.revisionScale());
                }

            },
            /**
             * Get node by id
             * @param id
             * @returns {*}
             * @method getNodeSet
             */
            getNodeSet: function (id) {
                return this.nodeSetDictionary().getItem(id);
            },
            /**
             * Iterate all nodeSet
             * @method eachNode
             * @param callback
             * @param context
             */
            eachNodeSet: function (callback, context) {
                this.nodeSetDictionary().each(function (item, id) {
                    var nodeSet = item.value();
                    callback.call(context || this, nodeSet, id);
                }, this);
            },
            clear: function () {
                this.eachNodeSet(function (nodeSet) {
                    nodeSet.dispose();
                });
                this.nodeSetDictionary().clear();
                this.inherited();
            },
            dispose: function () {
                this.clear();
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.topology().unwatch('revisionScale', this.__watchRevisionScale, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);
