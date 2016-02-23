(function (nx, global) {

    /**
     * Topology graph model class
     * @class nx.graphic.Topology.Graph
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Graph", {
        events: ['beforeSetData', 'afterSetData', 'insertData', 'topologyGenerated'],
        properties: {
            /**
             * Identity the node and link mapping key, default is index
             * @property identityKey {String}
             */
            identityKey: {
                get: function () {
                    return this._identiyKey || 'index';
                },
                set: function (value) {
                    this._identiyKey = value;
                    this.graph().set('identityKey', value);
                }
            },
            /**
             * set/get the topology' data, data should follow Common Topology Data Definition
             * @property data {JSON}
             */
            data: {
                get: function () {
                    return this.graph().getData();
                },
                set: function (value) {
                    if (value == null || !nx.is(value, Object) || value.nodes == null) {
                        return;
                    }

                    var fn = function (data) {

                        /**
                         * Fired before start process data
                         * @event beforeSetData
                         * @param sender {Object} Trigger instance
                         * @param data {JSON}  event object
                         */
                        this.fire("beforeSetData", data);
                        this.clear();
                        this.graph().sets({
                            width: this.width(),
                            height: this.height()
                        });
                        // set Data;
                        this.graph().setData(data);
                        //
                        /**
                         * Fired after process data
                         * @event afterSetData
                         * @param sender{Object} trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire("afterSetData", data);
                    };


                    if (this.status() === 'appended' || this.status() == 'generated') {
                        fn.call(this, value);
                    } else {
                        this.on('ready', function () {
                            fn.call(this, value);
                        }, this);
                    }
                }
            },
            /**
             * Set the use force layout, recommand use dataProcessor:'force'
             * @property autoLayout {Boolean}
             */
            autoLayout: {
                get: function () {
                    return this._autoLayout || false;
                },
                set: function (value) {
                    this._autoLayout = value;
                    if (value) {
                        this.graph().dataProcessor("force");
                    } else {
                        this.graph().dataProcessor("");
                    }
                }
            },
            vertexPositionGetter: {
                get: function () {
                    return this._vertexPositionGetter;
                },
                set: function (value) {
                    this._vertexPositionGetter = value;
                    this.graph().set('vertexPositionGetter', value);
                }
            },
            vertexPositionSetter: {
                get: function () {
                    return this._vertexPositionSetter;
                },
                set: function (value) {
                    this._vertexPositionSetter = value;
                    this.graph().set('vertexPositionSetter', value);
                }
            },
            /**
             * Pre data processor, it could be 'force'/'quick'. It could also support register a new processor
             * @property dataProcessor {String}
             */
            dataProcessor: {
                get: function () {
                    return this._dataProcessor;
                },
                set: function (value) {
                    this._dataProcessor = value;
                    this.graph().set('dataProcessor', value);
                }
            },
            /**
             * Topology graph object
             * @property graph {nx.data.ObservableGraph}
             * @readonly
             */
            graph: {
                value: function () {
                    return new nx.data.ObservableGraph();
                }
            }
        },
        methods: {
            initGraph: function () {
                var graph = this.graph();
                graph.sets({
                    vertexPositionGetter: this.vertexPositionGetter(),
                    vertexPositionSetter: this.vertexPositionSetter(),
                    identityKey: this.identityKey(),
                    dataProcessor: this.dataProcessor()
                });

                if (this.autoLayout()) {
                    graph.dataProcessor("force");
                }


                var nodesLayer = this.getLayer("nodes");
                var linksLayer = this.getLayer("links");
                var nodeSetLayer = this.getLayer("nodeSet");
                var linkSetLayer = this.getLayer("linkSet");

                /**
                 * Vertex
                 */
                graph.on("addVertex", function (sender, vertex) {
                    nodesLayer.addNode(vertex);
                }, this);

                graph.on("removeVertex", function (sender, vertex) {
                    nodesLayer.removeNode(vertex.id());
                }, this);


                graph.on("deleteVertex", function (sender, vertex) {
                    nodesLayer.removeNode(vertex.id());
                }, this);

                graph.on("updateVertex", function (sender, vertex) {
                    nodesLayer.updateNode(vertex.id());
                }, this);

                graph.on("updateVertexCoordinate", function (sender, vertex) {

                }, this);


                /**
                 * Edge
                 */
                graph.on("addEdge", function (sender, edge) {
                    var link = linksLayer.addLink(edge);
                    // add parent linkset
//                    if (edge.parentEdgeSet()) {
//                        var linkSet = this.getLinkSetByLinkKey(edge.linkKey());
//                        link.set('parentLinkSet', linkSet);
//                    }
                }, this);

                graph.on("removeEdge", function (sender, edge) {
                    linksLayer.removeLink(edge.id());
                }, this);
                graph.on("deleteEdge", function (sender, edge) {
                    linksLayer.removeLink(edge.id());
                }, this);
                graph.on("updateEdge", function (sender, edge) {
                    linksLayer.updateLink(edge.id());
                }, this);
                graph.on("updateEdgeCoordinate", function (sender, edge) {
                    linksLayer.updateLink(edge.id());
                }, this);


                /**
                 * EdgeSet
                 */
                graph.on("addEdgeSet", function (sender, edgeSet) {
                    if (this.supportMultipleLink()) {
                        linkSetLayer.addLinkSet(edgeSet);
                    } else {
                        edgeSet.activated(false);
                    }
                }, this);

                graph.on("removeEdgeSet", function (sender, edgeSet) {
                    linkSetLayer.removeLinkSet(edgeSet.linkKey());
                }, this);

                graph.on("deleteEdgeSet", function (sender, edgeSet) {
                    linkSetLayer.removeLinkSet(edgeSet.linkKey());
                }, this);

                graph.on("updateEdgeSet", function (sender, edgeSet) {
                    linkSetLayer.updateLinkSet(edgeSet.linkKey());
                }, this);
                graph.on("updateEdgeSetCoordinate", function (sender, edgeSet) {
                    if (this.supportMultipleLink()) {
                        linkSetLayer.updateLinkSet(edgeSet.linkKey());
                    }
                }, this);


                /**
                 * VertexSet
                 */
                graph.on("addVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.addNodeSet(vertexSet);
                }, this);

                graph.on("removeVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.removeNodeSet(vertexSet.id());
                }, this);
                graph.on("deleteVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.removeNodeSet(vertexSet.id());
                }, this);

                graph.on("updateVertexSet", function (sender, vertexSet) {
                    nodeSetLayer.updateNodeSet(vertexSet.id());
                }, this);

                graph.on("updateVertexSetCoordinate", function (sender, vertexSet) {

                }, this);

                /**
                 * EdgeSetCollection
                 */
                graph.on("addEdgeSetCollection", function (sender, esc) {
                    linkSetLayer.addLinkSet(esc);
                }, this);

                graph.on("removeEdgeSetCollection", function (sender, esc) {
                    linkSetLayer.removeLinkSet(esc.linkKey());
                }, this);
                graph.on("deleteEdgeSetCollection", function (sender, esc) {
                    linkSetLayer.removeLinkSet(esc.linkKey());
                }, this);
                graph.on("updateEdgeSetCollection", function (sender, esc) {
                    linkSetLayer.updateLinkSet(esc.linkKey());
                }, this);
                graph.on("updateEdgeSetCollectionCoordinate", function (sender, esc) {
                    linkSetLayer.updateLinkSet(esc.linkKey());
                }, this);


                /**
                 * Data
                 */
                graph.on("setData", function (sender, data) {

                }, this);


                graph.on("insertData", function (sender, data) {
                    //this.showLoading();
                }, this);


                graph.on("clear", function (sender, event) {

                }, this);


                graph.on("startGenerate", function (sender, event) {
                    this.showLoading();
                    this.stage().hide();
                }, this);
                graph.on("endGenerate", function (sender, event) {
                    this._endGenerate();
                }, this);


            },
            /**
             * Set data to topology, recommend use topo.data(data)
             * @method setData
             * @param data {JSON} should be {nodes:[],links:[]}
             * @param [callback]
             * @param [context]
             */
            setData: function (data, callback, context) {
                if (callback) {
                    this.on('topologyGenerated', function fn() {
                        callback.call(context || this, this);
                        this.off('topologyGenerated', fn, this);
                    }, this);
                }
                if (data == null || !nx.is(data, Object) || data.nodes == null) {
                    return;
                }
                this.data(data);
            },
            /**
             * Insert data to topology
             * @method insertData
             * @param data {JSON}  should be {nodes:[],links:[]}
             */
            insertData: function (data) {
                if (data == null || !nx.is(data, Object)) {
                    return;
                }
                this.graph().insertData(data);
                /**
                 * Fired after insert data
                 * @event insertData
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire("insertData", data);
            },


            /**
             * Get topology data, recommend use topo.data()
             * @method getData
             * @returns {JSON}
             */
            getData: function () {
                return this.data();
            },


            _saveData: function () {
                var data = this.graph().getData();

                if (Object.prototype.toString.call(window.localStorage) === "[object Storage]") {
                    localStorage.setItem("topologyData", JSON.stringify(data));
                }

            },
            _loadLastData: function () {
                if (Object.prototype.toString.call(window.localStorage) === "[object Storage]") {
                    var data = JSON.parse(localStorage.getItem("topologyData"));
                    this.setData(data);
                }
            },
            start: function () {
            },
            _endGenerate: function () {

                this.stage().resetFitMatrix();

                /**
                 * Fired when all topology elements generated
                 * @event topologyGenerated
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                var layoutType = this.layoutType();
                if (layoutType) {
                    this.activateLayout(layoutType, null, function () {
                        this.__fit();
                        this.status('generated');
                        this.fire('topologyGenerated');
                    });
                } else {
                    this.__fit();
                    this.status('generated');
                    this.fire('topologyGenerated');
                }
            },
            __fit: function () {
                this.stage().show();
                if (this.autoFit()) {
                    this.stage().fit(null, null, false);
                    this.stage().resetFitMatrix();
                    this.stage().fit(null, null, false);
                    this.stage().resetFitMatrix();
                    this.stage().fit(null, null, false);
                }
                this.hideLoading();
            }
        }
    });


})(nx, nx.global);