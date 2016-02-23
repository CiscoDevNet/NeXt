(function (nx, global) {

    var D3URL = 'http://d3js.org/d3.v3.min.js';
    var D3TOPOJSON = 'http://d3js.org/topojson.v1.min.js';
    var WORLDMAPTopoJSON = 'http://bl.ocks.org/mbostock/raw/4090846/world-50m.json';
    var width = 500,
        height = 400;
    var projection;
    var util = nx.util;


    /**
     * World map layout, this require d3.js and d3 topojsonv1.js

     files:
     http://d3js.org/d3.v3.min.js
     http://d3js.org/topojson.v1.min.js

     * example

     var topo = new nx.graphic.Topology({
        adaptive: true,
        nodeConfig: {
                        label: 'model.name'
                    },
        showIcon: false,
        identityKey: 'name',
        layoutType: 'WorldMap',
        layoutConfig: {
            longitude: 'model.longitude',
            latitude: 'model.latitude',
            worldTopoJson: 'lib/world-50m.json'
        },
        data: topologyData
     })

     * @class nx.graphic.Topology.WorldMapLayout
     * @module nx.graphic.Topology
     */
    /**
     * Map's longitude attribute
     * @property longitude
     */
    /**
     * Map's latitude attribute
     * @property latitude
     */
    /**
     * world topo json file url, this should be under the same domain.
     * Could download from here : http://bl.ocks.org/mbostock/raw/4090846/world-50m.json
     * @property worldTopoJson
     */
    nx.define("nx.graphic.Topology.WorldMapLayout", {
        properties: {
            topology: {},
            projection: {}
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                if (!projection && typeof(d3) !== "undefined") {
                    projection = d3.geo.equirectangular().translate([width / 2, height / 2]).precision(0.1);
                    this.projection(projection);
                }
            },
            process: function (graph, config, callback) {
                // load d3

                if (!config.worldTopoJson) {
                    console.log('Please idenity world topo json url, download from:http://bl.ocks.org/mbostock/raw/4090846/world-50m.json');
                    return;
                }

                WORLDMAPTopoJSON = config.worldTopoJson;


                this._loadD3(function () {
                    this._loadTopoJSON(function () {
                        this._process(graph, config, callback);
                    }.bind(this));
                }.bind(this));
            },
            _loadD3: function (fn) {
                if (typeof (d3) === "undefined") {
                    util.loadScript(D3TOPOJSON, function () {
                        fn.call(this);
                    }.bind(this));
                } else {
                    fn.call(this);
                }
            },
            _loadTopoJSON: function (fn) {
                if (typeof (topojson) === "undefined") {
                    util.loadScript(D3TOPOJSON, function () {
                        fn.call(this);
                    }.bind(this));
                } else {
                    fn.call(this);
                }
            },
            _process: function (graph, config, callback) {
                var topo = this.topology();
                topo.prependLayer('worldMap', 'nx.graphic.Topology.WorldMapLayer');


                projection = d3.geo.equirectangular().translate([width / 2, height / 2]).precision(0.1);

                var longitude = config.longitude || 'model.longitude',
                    latitude = config.latitude || 'model.latitude';

                var _longitude = longitude.split(".").pop(),
                    _latitude = latitude.split(".").pop();

                topo.graph().eachVertexSet(function (vertex) {
                    vertex.positionGetter(function () {
                        var p = projection([nx.path(vertex, _longitude), nx.path(vertex, _latitude)]);
                        return {
                            x: p[0],
                            y: p[1]
                        };
                    });
                    vertex.positionSetter(function (position) {
                        var p = projection.invert([position.x, position.y]);
                        vertex.set(_longitude, p[0]);
                        vertex.set(_latitude, p[1]);
                    });

                    vertex.position(vertex.positionGetter().call(vertex));
                });

                topo.graph().eachVertex(function (vertex) {
                    vertex.positionGetter(function () {
                        var p = projection([nx.path(vertex, _longitude), nx.path(vertex, _latitude)]);
                        return {
                            x: p[0],
                            y: p[1]
                        };
                    });
                    vertex.positionSetter(function (position) {
                        var p = projection.invert([position.x, position.y]);
                        vertex.set(_longitude, p[0]);
                        vertex.set(_latitude, p[1]);
                    });

                    vertex.position(vertex.positionGetter().call(vertex));
                });

                this.projection(projection);

                if (callback) {
                    topo.getLayer("worldMap").complete(function () {
                        callback.call(topo);
                    });
                }
            }

        }
    });


    //

    nx.define("nx.graphic.Topology.WorldMapLayer", nx.graphic.Topology.Layer, {
        properties: {
            complete: {}
        },
        view: {
            type: 'nx.graphic.Group',
            content: {
                name: 'map',
                type: 'nx.graphic.Group'
            }
        },
        methods: {
            draw: function () {

                var map = this.view('map');
                var topo = this.topology();
                var group = d3.select(map.view().dom().$dom);

                var path = d3.geo.path().projection(projection);

                d3.json(WORLDMAPTopoJSON, function (error, world) {
                    group.insert("path", ".graticule")
                        .datum(topojson.feature(world, world.objects.land))
                        .attr("class", "land mapPath")
                        .attr("d", path);

                    group.insert("path", ".graticule")
                        .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
                            return a !== b;
                        }))
                        .attr("class", "boundary mapBoundary")
                        .attr("d", path);


                    topo.stage().resetFitMatrix();
                    topo.fit(null, null, false);
                    if (this.complete()) {
                        this.complete().call();
                    }

                }.bind(this));

            },
            updateMap: function () {
                //                var topo = this.topology();
                //                var g = this.view('map');
                //                var width = 960, height = 500;
                //                var containerWidth = topo._width - topo._padding * 2, containerHeight = topo._height - topo._padding * 2;
                //                var scale = Math.min(containerWidth / width, containerHeight / height);
                //                var translateX = (containerWidth - width * scale) / 2;
                //                var translateY = (containerHeight - height * scale) / 2;
                //                g.setTransform(translateX, translateY, scale);
            },
            update: function () {
                var topo = this.topology();
                this.set("scale", topo.scale());
            }
        }
    });


})(nx, nx.global);
