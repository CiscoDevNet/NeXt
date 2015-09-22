(function(nx, global) {

    /**
     * ObservableGraph class
     * @extend nx.data.ObservableObject
     * @class nx.data.ObservableGraph
     * @module nx.data
     */
    nx.define('nx.data.ObservableGraph', nx.data.ObservableObject, {
        mixins: [
            nx.data.ObservableGraph.DataProcessor,
            nx.data.ObservableGraph.Vertices,
            nx.data.ObservableGraph.VertexSets,
            nx.data.ObservableGraph.Edges,
            nx.data.ObservableGraph.EdgeSets,
            nx.data.ObservableGraph.EdgeSetCollections
        ],
        event: ['setData', 'insertData', 'clear', 'startGenerate', 'endGenerate'],
        properties: {
            /**
             * Use this attribute of original data as vertex's id and link's mapping key
             * default is index, if not set use array's index as id
             * @property identityKey {String}
             * @default 'index'
             */
            identityKey: {
                value: 'index'
            },
            filter: {},
            groupBy: {}
        },
        methods: {
            init: function(args) {
                this.inherited(args);
                this.nodeSet([]);
                this.nodes([]);
                this.links([]);

                this.sets(args);

                if (args && args.data) {
                    this.setData(args.data);
                }

            },
            /**
             * Set data, data should follow Common Topology Data Definition
             * @method setData
             * @param {Object} inData
             */
            setData: function(inData) {

                var data = this.processData(this.getJSON(inData));
                //
                this.clear();

                //generate
                this._generate(inData);
                /**
                 * Trigger when set data to ObservableGraph
                 * @event setData
                 * @param sender {Object}  event trigger
                 * @param {Object} data data, which been processed by data processor
                 */
                this.fire('setData', inData);
            },
            subordinates: function(vertex, callback) {
                // argument type overload
                if (typeof vertex === "function") {
                    callback = vertex;
                    vertex = null;
                }
                // check the vertex children
                var result;
                if (vertex) {
                    result = nx.util.values(vertex.vertices()).concat(nx.util.values(vertex.vertexSet()));
                } else {
                    result = [];
                    nx.each(this.vertices(), function(pair) {
                        var vertex = pair.value();
                        if (!vertex.parentVertexSet()) {
                            result.push(vertex);
                        }
                    }.bind(this));
                    nx.each(this.vertexSets(), function(pair) {
                        var vertex = pair.value();
                        if (!vertex.parentVertexSet()) {
                            result.push(vertex);
                        }
                    }.bind(this));
                }
                // callback if given
                if (callback) {
                    nx.each(result, callback);
                }
                return result;
            },
            /**
             * Insert data, data should follow Common Topology Data Definition
             * @method insertData
             * @param {Object} inData
             */
            insertData: function(inData) {

                //                var data = this.processData(inData);
                var data = inData;
                nx.each(inData.nodes, function(node) {
                    this.addVertex(node);
                }, this);

                nx.each(inData.links, function(link) {
                    this.addEdge(link);
                }, this);

                nx.each(inData.nodeSet, function(nodeSet) {
                    this.addVertexSet(nodeSet);
                }, this);

                /**
                 * Trigger when insert data to ObservableGraph
                 * @event insertData
                 * @param sender {Object}  event trigger
                 * @param {Object} data data, which been processed by data processor
                 */

                this.fire('insertData', data);

            },
            _generate: function(data) {
                //
                this.nodes(data.nodes);
                this.links(data.links);
                this.nodeSet(data.nodeSet);

                var filter = this.filter();
                if (filter) {
                    filter.call(this, this);
                }

                /**
                 * Fired when start generate topology elements
                 * @event startGenerate
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('startGenerate');


                //                console.time('vertex');
                this.eachVertex(this.generateVertex, this);
                //                console.timeEnd('vertex');

                this.eachVertexSet(this.generateVertexSet, this);

                //                console.time('edgeSet');
                this.eachEdgeSet(this.generateEdgeSet, this);
                //                console.timeEnd('edgeSet');


                this.eachVertexSet(function(vertexSet) {
                    vertexSet.activated(true, {
                        force: true
                    });
                    this.updateVertexSet(vertexSet);
                }, this);


                /**
                 * Fired when finish generate topology elements
                 * @event endGenerate
                 * @param sender{Object} trigger instance
                 * @param event {Object} original event object
                 */
                this.fire('endGenerate');

            },


            /**
             * Get original data
             * @method getData
             * @returns {Object}
             */

            getData: function() {
                return {
                    nodes: this.nodes(),
                    links: this.links(),
                    nodeSet: this.nodeSet()
                };
            },

            /**
             * Get original json object
             * @method getJSON
             * @param [inData]
             * @returns {{nodes: Array, links: Array,nodeSet:Array}}
             */
            getJSON: function(inData) {
                var data = inData || this.getData();
                var obj = {
                    nodes: [],
                    links: []
                };


                if (nx.is(data.nodes, nx.data.ObservableCollection)) {
                    nx.each(data.nodes, function(n) {
                        if (nx.is(n, nx.data.ObservableObject)) {
                            obj.nodes.push(n.gets());
                        } else {
                            obj.nodes.push(n);
                        }
                    });
                } else {
                    obj.nodes = data.nodes;
                }


                if (nx.is(data.links, nx.data.ObservableCollection)) {
                    nx.each(data.links, function(n) {
                        if (nx.is(n, nx.data.ObservableObject)) {
                            obj.links.push(n.gets());
                        } else {
                            obj.links.push(n);
                        }
                    });
                } else {
                    obj.links = data.links;
                }

                if (data.nodeSet) {
                    if (nx.is(data.nodeSet, nx.data.ObservableCollection)) {
                        obj.nodeSet = [];
                        nx.each(data.nodeSet, function(n) {
                            if (nx.is(n, nx.data.ObservableObject)) {
                                obj.nodeSet.push(n.gets());
                            } else {
                                obj.nodeSet.push(n);
                            }
                        });
                    } else {
                        obj.nodeSet = data.nodeSet;
                    }
                }

                return obj;

            },
            /**
             * Get visible vertices data bound
             * @method getBound
             * @returns {{x: number, y: number, width: number, height: number, maxX: number, maxY: number}}
             */

            getBound: function(invertices) {

                var min_x, max_x, min_y, max_y;

                var vertices = invertices || nx.util.values(this.visibleVertices()).concat(nx.util.values(this.visibleVertexSets()));
                var firstItem = vertices[0];
                var x, y;

                if (firstItem) {
                    x = firstItem.get ? firstItem.get('x') : firstItem.x;
                    y = firstItem.get ? firstItem.get('y') : firstItem.y;
                    min_x = max_x = x || 0;
                    min_y = max_y = y || 0;
                } else {
                    min_x = max_x = 0;
                    min_y = max_y = 0;
                }


                nx.each(vertices, function(vertex, index) {
                    x = vertex.get ? vertex.get('x') : vertex.x;
                    y = vertex.get ? vertex.get('y') : vertex.y;
                    min_x = Math.min(min_x, x || 0);
                    max_x = Math.max(max_x, x || 0);
                    min_y = Math.min(min_y, y || 0);
                    max_y = Math.max(max_y, y || 0);
                });

                return {
                    x: min_x,
                    y: min_y,
                    left: min_x,
                    top: min_y,
                    width: max_x - min_x,
                    height: max_y - min_y,
                    maxX: max_x,
                    maxY: max_y
                };
            },

            getHierarchicalStructure: function() {
                var json = this.getJSON();
                var tree = {};
                var hierarchical = [];
                var identityKey = this.identityKey();

                nx.each(json.nodes, function(node, index) {
                    var id = nx.path(node, identityKey);
                    var obj = {
                        id: id,
                        children: []
                    };
                    hierarchical.push(obj);
                    tree[id] = obj;
                });

                nx.each(json.nodeSet, function(ns, index) {
                    var id = nx.path(ns, identityKey);
                    var obj = {
                        id: id,
                        children: []
                    };
                    ns.nodes.forEach(function(nodeID) {
                        if (tree[nodeID]) {
                            if (~(index = hierarchical.indexOf(tree[nodeID]))) {
                                hierarchical.splice(index, 1);
                            }
                            obj.children.push(tree[nodeID]);
                        } else {
                            obj.children.push({
                                id: nodeID,
                                children: []
                            });

                        }
                    });

                    hierarchical.push(obj);
                    tree[id] = obj;
                });
                return hierarchical;
            },

            /**
             * Clear graph data
             * @method clear
             */
            clear: function() {

                this.nodeSet([]);
                this.links([]);
                this.nodes([]);

                this.fire('clear');
            },
            dispose: function() {
                this.clear();
                this.inherited();
            }

        }
    });

})(nx, nx.global);