(function (nx, global) {

    /**
     * Topology force layout
     * @class nx.graphic.Topology.NeXtForceLayout
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.NeXtForceLayout", {
        properties: {
            topology: {},
            bound: {}
        },
        methods: {
            process: function (graph, config, callback) {
                var topo = this.topology();
                var selectedNodes = topo.selectedNodes().toArray();
                this._layoutTopology(graph, config, callback);
//                if (selectedNodes.length !== 0) {
//                    this._layoutNodes(graph, config, callback);
//                } else {
//                    this._layoutTopology(graph, config, callback);
//                }
            },
            _layoutNodes: function (graph, config, callback) {

            },
            _layoutTopology: function (graph, config, callback) {
                var topo = this.topology();
                var stage = topo.stage();
                var linksLayer = topo.getLayer('links');
                var linkSetLayer = topo.getLayer('linkSet');
                var transform = nx.geometry.Vector.transform;
                var data = {nodes: [], links: []};
                var nodeMap = {}, linkMap = {};

                topo.eachNode(function (node) {
                    nodeMap[node.id()] = data.nodes.length;
                    data.nodes.push({
                        id: node.id()
                    });
                });


                if (topo.supportMultipleLink()) {
                    linkSetLayer.eachLinkSet(function (linkSet) {
                        if (!linkMap[linkSet.linkKey()] && nodeMap[linkSet.sourceNodeID()] && nodeMap[linkSet.targetNodeID()]) {
                            data.links.push({
                                source: nodeMap[linkSet.sourceNodeID()],
                                target: nodeMap[linkSet.targetNodeID()]
                            });
                            linkMap[linkSet.linkKey()] = linkSet;
                        }

                    });
                } else {
                    linksLayer.eachLink(function (link) {
                        if (!linkMap[link.id()] && nodeMap[link.sourceNodeID()] && nodeMap[link.targetNodeID()]) {
                            data.links.push({
                                source: nodeMap[link.sourceNodeID()],
                                target: nodeMap[link.targetNodeID()]
                            });
                            linkMap[link.id()] = link;
                        }
                    });
                }

                topo.hideLoading();
                topo.stage().fit();
                topo.stage().show();

                //force
                var force = new nx.data.Force();
                force.nodes(data.nodes);
                force.links(data.links);
                force.start();
                while (force.alpha()) {
                    force.tick();
                }
                force.stop();

                var bound = this._getBound(data.nodes);
                var matrix = stage.calcRectZoomMatrix(topo.graph().getBound(), bound);


                topo.getLayer('links').hide();


                nx.each(data.nodes, function (n, i) {
                    var node = topo.getNode(n.id);
                    if (node) {
                        var p = transform([n.x, n.y], matrix);
                        node.translateTo(p[0], p[1]);
                    }
                }, this);

                if (this._timer) {
                    clearTimeout(this._timer);
                }

                this._timer = setTimeout(function () {
                    topo.getLayer('links').show();
                    topo.adjustLayout();
                    if (callback) {
                        callback.call(topo);
                    }
                }, 2000);
            },
            _getBound: function (nodes) {
                var lastIndex = nodes.length - 1;
                var bound = {
                    left: 0,
                    x: 0,
                    top: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    maxX: 0,
                    maxY: 0
                };


                //
                nodes.sort(function (a, b) {
                    return a.x - b.x;
                });

                bound.x = bound.left = nodes[0].x;
                bound.maxX = nodes[lastIndex].x;
                bound.width = bound.maxX - bound.x;


                //
                nodes.sort(function (a, b) {
                    return a.y - b.y;
                });

                bound.y = bound.top = nodes[0].y;
                bound.maxY = nodes[lastIndex].y;
                bound.height = bound.maxY - bound.x;
                return bound;
            }
        }
    });


    //                    console.log(JSON.stringify(data));

//                    var force = new nx.data.NextForce(100, 100);
//                    force.setData(data);
//                    if (data.nodes.length < 50) {
//                        while (true) {
//                            force.tick();
//                            if (force.maxEnergy < data.nodes.length * 0.1) {
//                                break;
//                            }
//                        }
//                    } else {
//                        var step = 0;
//                        while (++step < 900) {
//                            force.tick();
//                        }
//                    }
})(nx, nx.global);