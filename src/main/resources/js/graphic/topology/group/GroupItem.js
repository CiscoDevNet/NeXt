(function (nx, global) {

    /**
     *
     * Base group shape class
     * @class nx.graphic.Topology.GroupItem
     * @extend nx.graphic.Component
     * @module nx.graphic.Topology
     *
     */


    nx.define("nx.graphic.Topology.GroupItem", nx.graphic.Group, {
        events: [],
        properties: {
            /**
             * Topology
             * @property topology
             * @readyOnly
             */
            topology: {

            },
            /**
             * Node array in the shape
             * @property nodes {Array}
             */
            nodes: {
                get: function () {
                    return this._nodes || [];
                },
                set: function (value) {
                    var topo = this.topology();
                    var graph = topo.graph();
                    var vertices = this.vertices();
                    if (nx.is(value, Array) || nx.is(value, nx.data.ObservableCollection)) {

                        //
                        nx.each(value, function (value) {
                            var vertex;
                            if (nx.is(value, nx.graphic.Topology.AbstractNode)) {
                                vertex = value.model();
                            } else if (graph.getVertex(value)) {
                                vertex = graph.getVertex(value);
                            }

                            if (vertex && vertices.indexOf(vertex) == -1) {
                                vertices.push(vertex);
                            }

                        }, this);

                        //
                        nx.each(vertices, function (vertex) {
                            this.attachEvent(vertex);
                        }, this);

                        this.draw();


                    }
                    this._nodes = value;
                }
            },
            vertices: {
                value: function () {
                    return [];
                }
            },
            /**
             * Shape's color
             * @property color
             */
            color: {

            },
            /**
             * Group's label
             * @property label
             */
            label: {

            },
            blockDrawing: {
                value: false
            }
        },
        view: {

        },
        methods: {
            attachEvent: function (vertex) {
                vertex.watch('generated', this._draw, this);
                vertex.on('updateCoordinate', this._draw, this);
            },
            detachEvent: function (vertex) {
                vertex.unwatch('generated', this._draw, this);
                vertex.off('updateCoordinate', this._draw, this);
            },
            getNodes: function () {
                var nodes = [];
                var topo = this.topology();
                nx.each(this.vertices(), function (vertex) {
                    if (vertex.generated()) {
                        var node = topo.getNode(vertex.id());
                        if (node) {
                            nodes.push(node);
                        }
                    }
                });
                return nodes;
            },
            addNode: function (value) {
                var vertex;
                var topo = this.topology();
                var graph = topo.graph();
                var vertices = this.vertices();

                if (nx.is(value, nx.graphic.Topology.AbstractNode)) {
                    vertex = value.model();
                } else if (graph.getVertex(value)) {
                    vertex = graph.getVertex(value);
                }

                if (vertex && vertices.indexOf(vertex) == -1) {
                    vertices.push(vertex);
                    this.attachEvent(vertex);
                    this.draw();
                }

            },
            removeNode: function (value) {
                var vertex;
                var topo = this.topology();
                var graph = topo.graph();
                var vertices = this.vertices();
                var nodes = this.nodes();

                if (nx.is(value, nx.graphic.Topology.AbstractNode)) {
                    vertex = value.model();
                } else if (graph.getVertex(value)) {
                    vertex = graph.getVertex(value);
                }

                if (vertex && vertices.indexOf(vertex) != -1) {
                    vertices.splice(vertices.indexOf(vertex), 1);
                    this.detachEvent(vertex);
                    if (nx.is(nodes, Array)) {
                        var id = vertex.id();
                        var node = topo.getNode(id);
                        if (nodes.indexOf(id) !== -1) {
                            nodes.splice(nodes.indexOf(id), 1);
                        } else if (node && nodes.indexOf(node) !== -1) {
                            nodes.splice(nodes.indexOf(node), 1);
                        } else {
                            //todo throw error
                        }

                    }

                    this.draw();

                }


            },
            _draw: function () {
                if (!this.blockDrawing()) {
                    this.draw();
                }
            },
            draw: function () {
                if (this.getNodes().length === 0) {
                    this.hide();
                } else {
                    this.show();
                }
            },
            updateNodesPosition: function (x, y) {
                var stageScale = this.topology().stageScale();
                nx.each(this.getNodes(), function (node) {
                    node.move(x * stageScale, y * stageScale);
                });
            },
            clear: function () {
                nx.each(this.vertices(), function (vertex) {
                    this.detachEvent(vertex);
                }, this);
                this.vertices([]);
                this.nodes([]);
            },
            dispose: function () {
                this.clear();
                this.inherited();
            }
        }
    });


})(nx, nx.global);