(function (nx, global) {

    nx.define('nx.data.ObservableGraph.Edges', nx.data.ObservableObject, {
        events: ['addEdge', 'removeEdge', 'deleteEdge', 'updateEdge', 'updateEdgeCoordinate'],
        properties: {
            links: {
                get: function () {
                    return this._links || [];
                },
                set: function (value) {

                    if (this._links && nx.is(this._links, nx.data.ObservableCollection)) {
                        this._links.off('change', this._linksCollectionProcessor, this);
                    }

                    this.edgeSetCollections().clear();

                    this.edgeSets().clear();

                    this.edges().clear();


                    if (nx.is(value, nx.data.ObservableCollection)) {
                        value.on('change', this._linksCollectionProcessor, this);
                        value.each(function (value) {
                            this._addEdge(value);
                        }, this);
                        this._links = value;
                    } else if (value) {
                        nx.each(value, this._addEdge, this);
                        this._links = value.slice();
                    }


                }
            },
            edgeFilter: {},
            edges: {
                value: function () {
                    var edges = new nx.data.ObservableDictionary();
                    edges.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (item) {
                                this.deleteEdge(item.key());
                            }, this);
                        }
                    }, this);
                    return edges;
                }
            }
        },
        methods: {
            /**
             * Add edge to Graph
             * @method addEdge
             * @param {JSON} data Vertex original data
             * @param {Object} [config] Config object
             * @returns {nx.data.Edge}
             */
            addEdge: function (data, config) {
                var links = this.links();
                var edges = this.edges();
                var edge;

                if (data.source === null || data.target === null) {
                    return undefined;
                }


                if (nx.is(links, nx.data.ObservableCollection)) {
                    links.add(data);
                    // todo, handler when the data error,
                    edge = edges.getItem(edges.count() - 1);
                }
                else {
                    edge = this._addEdge(data);
                    if (edge) {
                        links.push(data);
                    }
                }

                if (!edge) {
                    return null;
                }

                if (config) {
                    edge.sets(config);
                }

                //update edgeSet
                var edgeSet = edge.parentEdgeSet();
                if (!edgeSet.generated()) {
                    this.generateEdgeSet(edgeSet);
                }
                else {
                    this.updateEdgeSet(edgeSet);
                }

                return edge;
            },
            _addEdge: function (data) {
                var edges = this.edges();
                var identityKey = this.identityKey();
                var source, target, sourceID, targetID;


                if (data.source === null || data.target === null) {
                    return undefined;
                }


                sourceID = nx.path(data, 'source') !== null ? nx.path(data, 'source') : data.source;
                source = this.vertices().getItem(sourceID); // || this.vertexSets().getItem(sourceID);


                targetID = nx.path(data, 'target') !== null ? nx.path(data, 'target') : data.source;
                target = this.vertices().getItem(targetID); // || this.vertexSets().getItem(targetID);


                if (source && target) {
                    var edge = new nx.data.Edge(data);
                    var id = nx.path(data, 'id') !== null ? nx.path(data, 'id') : edge.__id__;

                    if (edges.getItem(id)) {
                        return null;
                    }


                    edge.sets({
                        id: id,
                        source: source,
                        target: target,
                        sourceID: sourceID,
                        targetID: targetID,
                        graph: this
                    });

                    edge.attachEvent();

                    edges.setItem(id, edge);

                    var edgeSet = this.getEdgeSetBySourceAndTarget(sourceID, targetID);
                    if (!edgeSet) {
                        edgeSet = this._addEdgeSet({
                            source: source,
                            target: target,
                            sourceID: sourceID,
                            targetID: targetID
                        });
                    }
                    else {
                        edgeSet.updated(true);
                    }

                    edge.sets({
                        linkKey: edgeSet.linkKey(),
                        reverseLinkKey: edgeSet.reverseLinkKey()
                    });

                    edgeSet.addEdge(edge);
                    edge.parentEdgeSet(edgeSet);
                    edge.reverse(sourceID !== edgeSet.sourceID());


                    var edgeFilter = this.edgeFilter();
                    if (edgeFilter && nx.is(edgeFilter, Function)) {
                        var result = edgeFilter.call(this, data, edge);
                        edge.visible(result === false);
                    }

                    return edge;

                }
                else {
                    if (console) {
                        console.warn('source node or target node is not defined, or linkMappingKey value error', data, source, target);
                    }
                    return undefined;
                }
            },
            generateEdge: function (edge) {
                if (!edge.generated()) { //&& edge.source().generated() && edge.target().generated()
                    edge.on('updateCoordinate', this._updateEdgeCoordinate, this);

                    /**
                     * @event addEdge
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.Edge} edge Edge object
                     */
                    this.fire('addEdge', edge);
                    edge.generated(true);
                }
            },
            /**
             * Remove edge from Graph
             * @method removeEdge
             * @param id {String} edge id
             * @param isUpdateEdgeSet {Boolean}
             */
            removeEdge: function (id, isUpdateEdgeSet) {
                var edge = this.edges().getItem(id);
                if (!edge) {
                    return false;
                }
                edge.generated(false);
                edge.off('updateCoordinate', this._updateEdgeCoordinate, this);
                /**
                 * @event removeEdge
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.Edge} edge Edge object
                 */
                this.fire('removeEdge', edge);

                if (isUpdateEdgeSet !== false) {
                    var edgeSet = edge.parentEdgeSet();
                    this.updateEdgeSet(edgeSet);
                }
            },
            deleteEdge: function (id, isUpdateEdgeSet) {

                var edge = this.getEdge(id);
                if (!edge) {
                    return false;
                }

                var links = this.links();
                if (nx.is(links, nx.data.ObservableCollection)) {
                    links.removeAt(edge.getData());
                }
                else {
                    var index = links.indexOf(edge.getData());
                    if (index != -1) {
                        links.splice(index, 1);
                    }
                    this._deleteEdge(id, isUpdateEdgeSet);
                }

            },
            _deleteEdge: function (id, isUpdateEdgeSet) {
                var edge = this.getEdge(id);
                if (!edge) {
                    return false;
                }
                edge.off('updateCoordinate', this._updateEdgeCoordinate, this);

                //update parent
                if (isUpdateEdgeSet !== false) {
                    var edgeSet = edge.parentEdgeSet();
                    edgeSet.removeEdge(id);
                    this.updateEdgeSet(edgeSet);
                }

                /**
                 * @event deleteEdge
                 * @param sender {Object} Trigger instance
                 * @param {nx.data.Edge} edge Edge object
                 */
                this.fire('deleteEdge', edge);

                this.edges().removeItem(id);

                edge.dispose();

            },
            _updateEdgeCoordinate: function (sender, args) {
                this.fire('updateEdgeCoordinate', sender);
            },
            getEdge: function (id) {
                return this.edges().getItem(id);
            },
            /**
             * Get edges by source vertex id and target vertex id
             * @method getEdgesBySourceAndTarget
             * @param source {nx.data.Vertex|Number|String} could be vertex object or id
             * @param target {nx.data.Vertex|Number|String} could be vertex object or id
             * @returns {Array}
             */
            getEdgesBySourceAndTarget: function (source, target) {
                var edgeSet = this.getEdgeSetBySourceAndTarget(source, target);
                return edgeSet && edgeSet.getEdges();
            },
            /**
             * Get edges which are connected to passed vertices
             * @method getEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */
            getEdgesByVertices: function (inVertices) {
                //                var edges = [];
                //                nx.each(inVertices, function (vertex) {
                //                    edges = edges.concat(vertex.edges);
                //                    edges = edges.concat(vertex.reverseEdges);
                //                });
                //
                //
                //                return util.uniq(edges);
            },

            /**
             * Get edges which's source and target vertex are both in the passed vertices
             * @method getInternalEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */

            getInternalEdgesByVertices: function (inVertices) {
                //                var edges = [];
                //                var verticesMap = {};
                //                var internalEdges = [];
                //                nx.each(inVertices, function (vertex) {
                //                    edges = edges.concat(vertex.edges);
                //                    edges = edges.concat(vertex.reverseEdges);
                //                    verticesMap[vertex.id()] = vertex;
                //                });
                //
                //                nx.each(edges, function (edge) {
                //                    if (verticesMap[edge.sourceID()] !== undefined && verticesMap[edge.targetID()] !== undefined) {
                //                        internalEdges.push(edge);
                //                    }
                //                });
                //
                //
                //                return internalEdges;

            },
            /**
             * Get edges which's  just one of source or target vertex in the passed vertices. All edges connected ourside of passed vertices
             * @method getInternalEdgesByVertices
             * @param inVertices
             * @returns {Array}
             */
            getExternalEdgesByVertices: function (inVertices) {
                //                var edges = [];
                //                var verticesMap = {};
                //                var externalEdges = [];
                //                nx.each(inVertices, function (vertex) {
                //                    edges = edges.concat(vertex.edges);
                //                    edges = edges.concat(vertex.reverseEdges);
                //                    verticesMap[vertex.id()] = vertex;
                //                });
                //
                //                nx.each(edges, function (edge) {
                //                    if (verticesMap[edge.sourceID()] === undefined || verticesMap[edge.targetID()] === undefined) {
                //                        externalEdges.push(edge);
                //                    }
                //                });
                //
                //
                //                return externalEdges;

            },
            _linksCollectionProcessor: function (sender, args) {
                var items = args.items;
                var action = args.action;
                if (action == 'add') {
                    nx.each(items, function (data) {
                        var edge = this._addEdge(data);
                        //update edgeSet
                        var edgeSet = edge.parentEdgeSet();
                        if (!edgeSet.generated()) {
                            this.generateEdgeSet(edgeSet);
                        }
                        else {
                            this.updateEdgeSet(edgeSet);
                        }
                    }, this);
                }
                else if (action == 'remove') {
                    var ids = [];
                    // get all edges should be delete
                    this.edges().each(function (item, id) {
                        var edge = item.value();
                        if (items.indexOf(edge.getData()) != -1) {
                            ids.push(edge.id());
                        }
                    }, this);
                    nx.each(ids, function (id) {
                        this._deleteEdge(id);
                    }, this);

                }
                else if (action == 'clear') {
                    this.edges().clear();
                }
            }
        }
    });


})(nx, nx.global);
