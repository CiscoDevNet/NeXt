(function (nx, global) {

    nx.define('nx.data.ObservableGraph.VertexSets', nx.data.ObservableObject, {
        events: ['addVertexSet', 'removeVertexSet', 'updateVertexSet', 'updateVertexSetCoordinate'],
        properties: {
            nodeSet: {
                get: function () {
                    return this._nodeSet || [];
                },
                set: function (value) {

                    if (this._nodeSet && nx.is(this._nodeSet, nx.data.ObservableCollection)) {
                        this._nodeSet.off('change', this._nodeSetCollectionProcessor, this);
                    }

                    this.vertexSets().clear();

                    if (nx.is(value, nx.data.ObservableCollection)) {
                        value.on('change', this._nodeSetCollectionProcessor, this);
                        value.each(function (value) {
                            this._addVertexSet(value);
                        }, this);
                        this._nodeSet = value;
                    } else if (value) {
                        nx.each(value, this._addVertexSet, this);
                        this._nodeSet = value.slice();
                    }

                    this.eachVertexSet(this.initVertexSet, this);


                }
            },
            vertexSets: {
                value: function () {
                    var vertexSets = new nx.data.ObservableDictionary();
                    vertexSets.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (item) {
                                this.removeVertexSet(item.key());
                            }, this);
                        }
                    }, this);
                    return vertexSets;
                }
            },
            visibleVertexSets: {
                get: function () {
                    var vertexSets = {};
                    this.eachVertexSet(function (vertexSet, id) {
                        if (vertexSet.visible()) {
                            vertexSets[id] = vertexSet;
                        }
                    });
                    return vertexSets;
                }
            }
        },
        methods: {
            /**
             * Add vertex set to Graph
             * @method addVertexSet
             * @param {JSON} data Vertex set original data, which include nodes(Array) attribute. That is node's ID collection.  e.g. {nodes:[id1,id2,id3]}
             * @param {Object} [config] Config object
             * @returns {nx.data.VertexSet}
             */
            addVertexSet: function (data, config) {


                var vertexSet;
                var nodeSet = this.nodeSet();
                var vertexSets = this.vertexSets();
                if (nx.is(nodeSet, nx.data.ObservableCollection)) {
                    nodeSet.add(data);
                    vertexSet = vertexSets.getItem(vertexSets.count() - 1);
                } else {
                    nodeSet.push(data);
                    vertexSet = this._addVertexSet(data);
                }

                if (!vertexSet) {
                    return null;
                }

                if (config) {
                    vertexSet.sets(config);
                }


                if (config.parentVertexSetID !== null) {
                    var parentVertexSet = this.getVertexSet(config.parentVertexSetID);
                    if (parentVertexSet) {
                        parentVertexSet.addVertex(vertexSet);
                    }
                }

                this.initVertexSet(vertexSet);


                this.generateVertexSet(vertexSet);

                vertexSet.activated(true, {
                    force: true
                });
                this.updateVertexSet(vertexSet);

                return vertexSet;
            },
            _addVertexSet: function (data) {
                var identityKey = this.identityKey();
                var vertexSets = this.vertexSets();
                //
                if (typeof (data) == 'string' || typeof (data) == 'number') {
                    data = {
                        data: data
                    };
                }
                var id = nx.path(data, identityKey);
                id = id !== undefined ? id : this.vertexSets().count() + this.vertices().count();

                if (vertexSets.getItem(id)) {
                    return null;
                }

                var vertexSet = new nx.data.VertexSet(data);


                var vertexPositionGetter = this.vertexPositionGetter();
                var vertexPositionSetter = this.vertexPositionSetter();
                if (vertexPositionGetter && vertexPositionSetter) {
                    vertexSet.positionGetter(vertexPositionGetter);
                    vertexSet.positionSetter(vertexPositionSetter);
                }

                //
                vertexSet.sets({
                    graph: this,
                    type: 'vertexSet',
                    id: id
                });


                //delegate synchronize
                if (nx.is(data, nx.data.ObservableObject)) {
                    var fn = data.set;
                    data.set = function (key, value) {
                        fn.call(data, key, value);
                        //
                        if (vertexSet.__properties__.indexOf(key) == -1) {
                            if (vertexSet.has(key)) {
                                vertexSet[key].call(vertexSet, value);
                            } else {
                                vertexSet.notify(key);
                            }
                        }
                    };
                }


                vertexSet.position(vertexSet.positionGetter().call(vertexSet));

                this.vertexSets().setItem(id, vertexSet);

                return vertexSet;
            },
            initVertexSet: function (vertexSet) {
                vertexSet.initNodes();
            },
            generateVertexSet: function (vertexSet) {
                if (vertexSet.visible() && !vertexSet.generated()) {
                    vertexSet.generated(true);
                    vertexSet.on('updateCoordinate', this._updateVertexSetCoordinateFN, this);
                    this.fire('addVertexSet', vertexSet);
                }
            },
            _updateVertexSetCoordinateFN: function (vertexSet, args) {
                /**
                 * @event updateVertexSetCoordinate
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.VertexSet} vertexSet VertexSet object
                 */
                this.fire('updateVertexSetCoordinate', vertexSet);
            },
            updateVertexSet: function (vertexSet) {
                if (vertexSet.generated()) {
                    vertexSet.updated(false);
                    /**
                     * @event updateVertexSet
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.VertexSet} vertexSet VertexSet object
                     */
                    this.fire('updateVertexSet', vertexSet);
                }
            },

            /**
             * Remove a vertex set from Graph
             * @method removeVertexSet
             * @param {String} id
             * @returns {Boolean}
             */
            removeVertexSet: function (id) {

                var vertexSet = this.vertexSets().getItem(id);
                if (!vertexSet) {
                    return false;
                }


                vertexSet.activated(true);

                nx.each(vertexSet.edgeSets(), function (edgeSet, linkKey) {
                    this.removeEdgeSet(linkKey);
                }, this);

                nx.each(vertexSet.edgeSetCollections(), function (esc, linkKey) {
                    this.deleteEdgeSetCollection(linkKey);
                }, this);

                vertexSet.generated(false);
                vertexSet.off('updateCoordinate', this._updateVertexSetCoordinateFN, this);
                this.fire('removeVertexSet', vertexSet);

            },
            deleteVertexSet: function (id) {
                var nodeSet = this.nodeSet();
                var vertexSet = this.getVertexSet(id);
                if (vertexSet) {
                    if (nx.is(nodeSet, nx.data.ObservableCollection)) {
                        var data = vertexSet.getData();
                        nodeSet.remove(data);
                    } else {
                        var index = this.nodeSet().indexOf(vertexSet.getData());
                        if (index != -1) {
                            this.nodeSet().splice(index, 1);
                        }
                        this._deleteVertexSet(id);
                    }
                }
            },
            _deleteVertexSet: function (id) {
                var vertexSet = this.vertexSets().getItem(id);
                if (!vertexSet) {
                    return false;
                }
                if (vertexSet.generated()) {
                    vertexSet.activated(false);
                }


                var parentVertexSet = vertexSet.parentVertexSet();
                if (parentVertexSet) {
                    parentVertexSet.removeVertex(id);

                }

                nx.each(vertexSet.vertices(), function (vertex) {
                    if (parentVertexSet) {
                        parentVertexSet.addVertex(vertex);
                    } else {
                        vertex.parentVertexSet(null);
                    }
                });
                nx.each(vertexSet.vertexSet(), function (vertexSet) {
                    if (parentVertexSet) {
                        parentVertexSet.addVertex(vertexSet);
                    } else {
                        vertexSet.parentVertexSet(null);
                    }
                });

                vertexSet.off('updateCoordinate', this._updateVertexCoordinateFN, this);
                vertexSet.generated(false);
                this.vertexSets().removeItem(id);
                this.fire('deleteVertexSet', vertexSet);

                vertexSet.dispose();
            },

            eachVertexSet: function (callback, context) {
                this.vertexSets().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            getVertexSet: function (id) {
                return this.vertexSets().getItem(id);
            },
            _nodeSetCollectionProcessor: function (sender, args) {
                var items = args.items;
                var action = args.action;
                var identityKey = this.identityKey();
                if (action == 'add') {
                    nx.each(items, function (data) {
                        var vertexSet = this._addVertexSet(data);
                        this.generateVertexSet(vertexSet);

                    }, this);
                } else if (action == 'remove') {
                    nx.each(items, function (data) {
                        var id = nx.path(data, identityKey);
                        this._deleteVertexSet(id);
                    }, this);
                } else if (action == 'clear') {
                    this.vertexSets().clear();
                }
            }
        }
    });


})(nx, nx.global);
