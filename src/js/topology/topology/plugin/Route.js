(function (nx, global) {
    var util = nx.util;
    /**
     * Path layer class
     Could use topo.getLayer("pathLayer") get this
     * @class nx.graphic.Topology.PathLayer
     * @extend nx.graphic.Topology.Layer
     * @module nx.graphic.Topology
     */
    var EXPORT = nx.define("nx.graphic.Topology.plugin.RoutePlugin", {
        properties: {
            topology: {},
            routes: {
                value: function () {
                    return new nx.data.ObservableCollection();
                },
                set: function (v) {
                    var i, coll = this._routes;
                    // TODO better diff instead of clear and add
                    coll.clear();
                    if (nx.is(v, nx.data.ObservableCollection)) {
                        v = v.toArray();
                    }
                    if (nx.is(v, "Array")) {
                        coll.addRange(v);
                    }
                }
            },
            resource_internal_: {
                value: function () {
                    return {};
                }
            },
            routes_visible_internal_: {
                value: nx.keyword.binding("topology, routes", function (topology, routes, changepath, changediff) {
                    if (changepath === "topology") {
                        // release all recent resources
                        nx.each(this.resource_internal_(), function (resource) {
                            resource.release();
                        });
                        // bind to the new topology
                        if (topology) {
                            var resources = this.resource_internal_();
                            nx.each(routes, function (route) {
                                // TODO make sure it's a Route
                                var resource = this._resourceOfOneRoute(topology, route);
                                resources[route.id()] = resource;
                            }.bind(this));
                        }
                    } else {
                        switch (changediff.action) {
                        case "add":
                            nx.each(changediff.items, function (route) {
                                var resource = this._resourceOfOneRoute(topology, route);
                                resources[route.id()] = resource;
                            }.bind(this));
                            break;
                        case "remove":
                        case "clear":
                            nx.each(changediff.items, function (route) {
                                delete resources[route.id()];
                            }.bind(this));
                            break;
                        default:
                            // TODO warning
                            break;
                        }
                    }
                })
            }
        },
        methods: {
            attach: function (topo) {
                this.topology(topo);
            },
            detach: function () {
                this.topology(null);
            },
            _resourceOfOneRoute: function (topology, route) {
                if (!topology && !nx.is(route, EXPORT.Route)) {
                    return null;
                }

            },
            _parseRoute: function (topology, route) {
                var graph = topology.graph();
                var vertices = graph.vertices(),
                    edges = graph.edges();
                var recent, result = {
                        vertices: [],
                        edges: []
                    };
                // get all edges
                nx.each(route.edges(), function (edgeId) {
                    result.edges.push(edges.getItem(edgeId));
                });
                // get all vertices
                var recent = route.start();
                result.vertices.push(vertices.getItem(recent));
                nx.each(result.edges, function (edge) {
                    if (edge.sourceId() === recent) {
                        recent = edge.targetId();
                    } else if (edge.targetId() === recent) {
                        recent = edge.sourceId();
                    } else {
                        throw new Error("Bad route setting");
                    }
                    result.vertices.push(vertices.getItem(recent));
                });
                return result;
            },
            _draw: function (topology, route) {
		
            }
        },
        statics: {
            Route: nx.define({
                properties: {
                    id: {
                        value: nx.util.uuid
                    },
                    start: {},
                    edges: {
                        value: function () {
                            return new nx.data.ObservableCollection();
                        },
                        set: function () {
                            var coll = this._routes;
                            // TODO better diff instead of clear and add
                            coll.clear();
                            if (nx.is(v, nx.data.ObservableCollection)) {
                                v = v.toArray();
                            }
                            if (nx.is(v, "Array")) {
                                coll.addRange(v);
                            }
                        }
                    },
                    collapsible: false
                }
            }),
            Layer: nx.define({

            })
        }
    });
})(nx, nx.global);
