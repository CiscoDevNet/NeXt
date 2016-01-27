(function (nx, global) {

    nx.define('nx.graphic.Topology.NodeWatcher', nx.Observable, {
        properties: {
            nodes: {
                get: function () {
                    return this._nodes || [];
                },
                set: function (inNodes) {
                    var updater = this.updater();
                    var vertices = this.vertices();

                    if (vertices.length !== 0) {
                        nx.each(vertices, function (vertex) {
                            vertex.unwatch('generated', updater, this);
                        }, this);
                        vertices.length = 0;
                    }

                    if (!inNodes) {
                        return;
                    }

                    var nodes = inNodes;
                    if (!nx.is(nodes, Array) && !nx.is(nodes, nx.data.ObservableCollection)) {
                        nodes = [nodes];
                    }
                    nx.each(nodes, function (item) {
                        var vertex = this._getVertex(item);
                        if (vertex && vertices.indexOf(vertex) == -1) {
                            vertices.push(vertex);
                        }
                    }, this);


                    //todo
                    if (nx.is(nodes, nx.data.ObservableCollection)) {
                        nodes.on('change', function (sender, args) {
                            var action = args.action;
                            var items = args.items;
                            if (action == 'add') {

                            } else if (action == 'remove') {

                            } else if (action == 'clear') {

                            }
                        });
                    }

                    var observePosition = this.observePosition();
                    nx.each(vertices, function (vertex) {
                        vertex.watch('generated', updater, this);
                        if (observePosition) {
                            vertex.on('updateCoordinate', updater, this);
                        }
                    }, this);

                    updater();
                    this._nodes = nodes;
                }
            },
            updater: {
                value: function () {
                    return function () {

                    };
                }
            },
            topology: {
                set: function (topo) {
                    if (topo && topo.graph()) {
                        var graph = topo.graph();
                        graph.on("addVertexSet", this.update, this);
                        graph.on("removeVertexSet", this.update, this);
                        graph.on("deleteVertexSet", this.update, this);
                        graph.on("updateVertexSet", this.update, this);
                    }
                    this._topology = topo;
                }
            },
            vertices: {
                value: function () {
                    return [];
                }
            },
            observePosition: {
                value: false
            }
        },
        methods: {
            _getVertex: function (value) {
                var vertex;
                var topo = this.topology();
                if (topo && topo.graph()) {
                    var graph = topo.graph();
                    if (nx.is(value, nx.graphic.Topology.AbstractNode)) {
                        vertex = value.model();
                    } else if (graph.getVertex(value)) {
                        vertex = graph.getVertex(value);
                    }
                }
                return vertex;
            },
            getNodes: function (includeParent) {
                var nodes = [];
                var topo = this.topology();
                var vertices = this.vertices();
                nx.each(vertices, function (vertex) {
                    var id = vertex.id();
                    var node = topo.getNode(id);
                    if (includeParent !== false && (!node || vertex.generated() === false)) {
                        var generatedRootVertexSet = vertex.generatedRootVertexSet();
                        if (generatedRootVertexSet) {
                            node = topo.getNode(generatedRootVertexSet.id());
                        }
                    }

                    if (node && nodes.indexOf(node)) {
                        nodes.push(node);
                    }
                });

                return nodes;
            },
            update: function () {
                var updater = this.updater();
                var vertices = this.vertices();
                if (vertices.length !== 0) {
                    updater();
                }
            },
            dispose: function () {
                var topo = this.topology();
                if (topo && topo.graph()) {
                    var graph = topo.graph();
                    graph.off("addVertexSet", this.update, this);
                    graph.off("removeVertexSet", this.update, this);
                    graph.off("deleteVertexSet", this.update, this);
                    graph.off("updateVertexSet", this.update, this);
                }
                this.inherited();
            }

        }
    });
})(nx, nx.global);