(function (nx, global) {
    /**
     * Edge set collection class
     * @class nx.data.EdgeSetCollection
     * @extend nx.data.Edge
     * @module nx.data
     */

    nx.define('nx.data.EdgeSetCollection', nx.data.Edge, {
        properties: {
            /**
             * All child edgeset
             * @property edgeSets {Object}
             */
            edgeSets: {
                value: function () {
                    return {};
                }
            },
            edges: {
                get: function () {
                    var edges = {};
                    nx.each(this.edgeSets(), function (edgeSet) {
                        nx.extend(edges, edgeSet.edges());
                    });
                    return edges;
                }
            },
            /**
             * Edge's type
             * @property type {String}
             * @default 'edgeSet'
             */
            type: {
                value: 'edgeSetCollection'
            },
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    var graph = this.graph();
                    nx.each(this.edgeSets(),function(edgeSet){
                        edgeSet.activated(value, {
                            force: true
                        });
                    });
                    //this.eachEdge(function (edge) {
                    //    if (edge.type() == 'edge') {
                    //        if (value) {
                    //            graph.fire('removeEdge', edge);
                    //        } else {
                    //            graph.fire('addEdge', edge);
                    //        }
                    //    } else if (edge.type() == 'edgeSet') {
                    //        if (value) {
                    //            graph.fire('removeEdgeSet', edge);
                    //        } else {
                    //            graph.fire('addEdgeSet', edge);
                    //        }
                    //    }
                    //}, this);
                    this._activated = value;
                }
            }
        },
        methods: {
            /**
             * Add child edgeSet
             * @method addEdgeSet
             * @param edgeSet {nx.data.EdgeSet}
             */
            addEdgeSet: function (edgeSet) {
                var edgeSets = this.edgeSets();
                edgeSets[edgeSet.linkKey()] = edgeSet;
            },
            /**
             * Remove child edgeSet
             * @method removeEdgeSet
             * @param linkKey {String}
             */
            removeEdgeSet: function (linkKey) {
                var edgeSets = this.edgeSets();
                delete  edgeSets[linkKey];
            }
        }

    });
})(nx, nx.global);