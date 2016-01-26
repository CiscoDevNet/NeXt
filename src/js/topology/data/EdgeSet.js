(function (nx, global) {

    /**
     * Edge set clas
     * @class nx.data.EdgeSet
     * @extend nx.data.Edge
     * @module nx.data
     */

    nx.define('nx.data.EdgeSet', nx.data.Edge, {
        properties: {
            /**
             * All child edges
             * @property edges {Object}
             */
            edges: {
                value: function () {
                    return {};
                }
            },
            /**
             * Edge's type
             * @property type {String}
             * @default 'edgeSet'
             */
            type: {
                value: 'edgeSet'
            },
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    var graph = this.graph();
                    nx.each(this.edges(), function (edge,id) {
                        if (value) {
                            graph.removeEdge(id, false);
                        } else {
                            graph.generateEdge(edge);
                        }
                    }, this);
                    this._activated = value;
                }
            }
        },
        methods: {
            /**
             * Add child edge
             * @method addEdge
             * @param edge {nx.data.Edge}
             */
            addEdge: function (edge) {
                var edges = this.edges();
                edges[edge.id()] = edge;
            },
            /**
             * Remove child edge
             * @method removeEdge
             * @param id {String}
             */
            removeEdge: function (id) {
                var edges = this.edges();
                delete  edges[id];
            }
        }

    });
})(nx, nx.global);