(function(nx, global) {

    var Vector = nx.geometry.Vector;
    var Line = nx.geometry.Line;
    var colorIndex = 0;
    var colorTable = ['#b2e47f', '#e4e47f', '#bec2f9', '#b6def7', '#89f0de'];
    /**
     * A topology path class
     Path's background colors : ['#b2e47f', '#e4e47f', '#bec2f9', '#b6def7', '#89f0de']
     * @class nx.graphic.Topology.Path
     * @extend nx.graphic.Component
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.Path", nx.graphic.Component, {
        view: {
            type: 'nx.graphic.Group',
            content: {
                name: 'path',
                type: 'nx.graphic.Path'
            }
        },
        properties: {
            /**
             * get/set links's style ,default value is
             value: {
                    'stroke': '#666',
                    'stroke-width': '1px'
                }

             * @property pathStyle
             */
            pathStyle: {
                value: {
                    'stroke': '#666',
                    'stroke-width': '0px'
                }
            },
            /**
             * Get/set a path's width
             * @property pathWidth
             */
            pathWidth: {
                value: "auto"
            },
            /**
             * Get/set a path's offset
             * @property pathGutter
             */
            pathGutter: {
                value: 13
            },
            /**
             * Get/set a path's padding to a node
             * @property pathPadding
             */
            pathPadding: {
                value: "auto"
            },
            /**
             * Get/set path arrow type , 'none'/'cap'/'full'/'end'
             * @property
             */
            arrow: {
                value: 'none'
            },
            /**
             * Get/set links to draw a path pver it
             * @property links
             */
            links: {
                value: [],
                set: function(value) {
                    this._links = value;
                    this.edgeIdCollection().clear();
                    var edges = [];
                    if (nx.is(value, "Array") || nx.is(value, nx.data.Collection)) {
                        nx.each(value, function(item) {
                            edges.push(item.model().id());
                        }.bind(this));
                        this.edgeIdCollection().addRange(edges);
                    }
                    this.draw();
                }
            },
            edgeIdCollection: {
                value: function() {
                    var allEdges, verticesIdCollection, collection = new nx.data.ObservableCollection();
                    var watcher = function(pname, pvalue) {
                        this.draw();
                    }.bind(this);
                    collection.on("change", function(sender, evt) {
                        var waitForTopology = function(pname, pvalue) {
                            if (!pvalue) {
                                return;
                            }
                            this.unwatch("topology", waitForTopology);
                            allEdges = allEdges || nx.path(this, "topology.graph.edges");
                            verticesIdCollection = this.verticesIdCollection();
                            var diff = [];
                            if (evt.action === "add") {
                                nx.each(evt.items, function(item) {
                                    var edge = allEdges.getItem(item);
                                    edge.watch("generated", watcher);
                                    diff.push(edge.sourceID());
                                    diff.push(edge.targetID());
                                }.bind(this));
                                // update vertices
                                nx.each(diff, function(id) {
                                    if (!verticesIdCollection.contains(id)) {
                                        verticesIdCollection.add(id);
                                    }
                                });
                            } else {
                                nx.each(evt.items, function(item) {
                                    var edge = allEdges.getItem(item);
                                    if (edge) {
                                        edge.unwatch("generated", watcher);
                                    }
                                }.bind(this));
                                // update vertices
                                // TODO improve this algorithm
                                verticesIdCollection.clear();
                                nx.each(collection, function(id) {
                                    var edge = allEdges.getItem(id);
                                    if (edge && verticesIdCollection.contains(edge.sourceID())) {
                                        verticesIdCollection.add(edge.sourceID());
                                    }
                                    if (edge && verticesIdCollection.contains(edge.targetID())) {
                                        verticesIdCollection.add(edge.targetID());
                                    }
                                }.bind(this));
                            }
                        }.bind(this);
                        if (!this.topology()) {
                            this.watch("topology", waitForTopology);
                        } else {
                            waitForTopology("topology", this.topology());
                        }
                    }.bind(this));
                    return collection;
                }
            },
            verticesIdCollection: {
                value: function() {
                    var allVertices, collection = new nx.data.ObservableCollection();
                    var watcher = function(pname, pvalue) {
                        this.draw();
                    }.bind(this);
                    collection.on("change", function(sender, evt) {
                        allVertices = allVertices || nx.path(this, "topology.graph.vertices");
                        if (evt.action === "add") {
                            nx.each(evt.items, function(item) {
                                var vertex = allVertices.getItem(item);
                                if (vertex) {
                                    vertex.watch("position", watcher);
                                }
                            }.bind(this));
                        } else {
                            nx.each(evt.items, function(item) {
                                var vertex = allVertices.getItem(item);
                                if (vertex) {
                                    vertex.unwatch("position", watcher);
                                }
                            }.bind(this));
                        }
                    }.bind(this));
                    return collection;
                }
            },
            /**
             * Reverse path direction
             * @property reverse
             */
            reverse: {
                value: false
            },
            owner: {

            },
            topology: {}
        },
        methods: {
            init: function(props) {
                this.inherited(props);
                var pathStyle = this.pathStyle();
                this.view("path").sets(pathStyle);

                if (!pathStyle.fill) {
                    this.view("path").setStyle("fill", colorTable[colorIndex++ % 5]);
                }

            },
            /**
             * Draw a path,internal
             * @method draw
             */
            draw: function() {
                if (!this.topology()) {
                    return;
                }
                var generated = true,
                    topo = this.topology(),
                    allEdges = nx.path(this, "topology.graph.edges"),
                    allVertices = nx.path(this, "topology.graph.vertices");
                nx.each(this.verticesIdCollection(), function(id) {
                    var item = allVertices.getItem(id);
                    if (!item.generated()) {
                        generated = false;
                        return false;
                    }
                }.bind(this));
                nx.each(this.edgeIdCollection(), function(id) {
                    var item = allEdges.getItem(id);
                    if (!item.generated()) {
                        generated = false;
                        return false;
                    }
                }.bind(this));
                if (!generated) {
                    this.view("path").set('d', "M0 0");
                    return;
                }

                var link, line1, line2, pt, d1 = [],
                    d2 = [];
                var stageScale = this.topology().stageScale();
                var pathWidth = this.pathWidth();
                var pathPadding = this.pathPadding();
                var paddingStart, paddingEnd;
                var arrow = this.arrow();
                var v1, v2;


                var edgeIds = this.edgeIdCollection();
                var links = [];
                nx.each(edgeIds, function(id) {
                    links.push(topo.getLink(id));
                });
                var linksSequentialArray = this._serializeLinks(links);
                var count = links.length;

                //first
                var firstLink = links[0];

                var offset = firstLink.getOffset();
                if (firstLink.reverse()) {
                    offset *= -1;
                }

                offset = new Vector(0, this.reverse() ? offset * -1 : offset);

                line1 = linksSequentialArray[0].translate(offset);


                if (pathPadding === "auto") {
                    paddingStart = Math.min(firstLink.sourceNode().showIcon() ? 24 : 4, line1.length() / 4 / stageScale);
                    paddingEnd = Math.min(firstLink.targetNode().showIcon() ? 24 : 4, line1.length() / 4 / stageScale);
                } else if (nx.is(pathPadding, 'Array')) {
                    paddingStart = pathPadding[0];
                    paddingEnd = pathPadding[1];
                } else {
                    paddingStart = paddingEnd = pathPadding;
                }
                if (typeof paddingStart == 'string' && paddingStart.indexOf('%') > 0) {
                    paddingStart = line1.length() * stageScale * parseInt(paddingStart, 10) / 100 / stageScale;
                }

                if (pathWidth === "auto") {
                    pathWidth = Math.min(10, Math.max(3, Math.round(3 / stageScale))); //3/stageScale
                }
                pathWidth *= 1.5 * stageScale;
                v1 = new Vector(0, pathWidth / 2);
                v2 = new Vector(0, -pathWidth / 2);

                paddingStart *= stageScale;

                pt = line1.translate(v1).pad(paddingStart, 0).start;
                d1.push('M', pt.x, pt.y);
                pt = line1.translate(v2).pad(paddingStart, 0).start;
                d2.unshift('L', pt.x, pt.y, 'Z');

                if (links.length > 1) {
                    for (var i = 1; i < count; i++) {
                        link = links[i];
                        line2 = linksSequentialArray[i].translate(new Vector(0, link.getOffset()));
                        pt = line1.translate(v1).intersection(line2.translate(v1));

                        if (isFinite(pt.x) && isFinite(pt.y)) {
                            d1.push('L', pt.x, pt.y);
                        }
                        pt = line1.translate(v2).intersection(line2.translate(v2));
                        if (isFinite(pt.x) && isFinite(pt.y)) {
                            d2.unshift('L', pt.x, pt.y);
                        }
                        line1 = line2;
                    }
                } else {
                    line2 = line1;
                }

                if (typeof paddingEnd == 'string' && paddingEnd.indexOf('%') > 0) {
                    paddingEnd = line2.length() * parseInt(paddingEnd, 10) / 100 / stageScale;
                }

                paddingEnd *= stageScale;

                if (arrow == 'cap') {
                    pt = line2.translate(v1).pad(0, 2.5 * pathWidth + paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                    pt = pt.add(line2.normal().multiply(pathWidth / 2));
                    d1.push('L', pt.x, pt.y);

                    pt = line2.translate(v2).pad(0, 2.5 * pathWidth + paddingEnd).end;
                    d2.unshift('L', pt.x, pt.y);
                    pt = pt.add(line2.normal().multiply(-pathWidth / 2));
                    d2.unshift('L', pt.x, pt.y);

                    pt = line2.pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                } else if (arrow == 'end') {
                    pt = line2.translate(v1).pad(0, 2 * pathWidth + paddingEnd).end;
                    d1.push('L', pt.x, pt.y);

                    pt = line2.translate(v2).pad(0, 2 * pathWidth + paddingEnd).end;
                    d2.unshift('L', pt.x, pt.y);

                    pt = line2.pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                } else if (arrow == 'full') {
                    pt = line2.pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                } else {
                    pt = line2.translate(v1).pad(0, paddingEnd).end;
                    d1.push('L', pt.x, pt.y);
                    pt = line2.translate(v2).pad(0, paddingEnd).end;
                    d2.unshift('L', pt.x, pt.y);
                }

                this.view("path").set('d', d1.concat(d2).join(' '));
                //this.view("path").setTransform(null, null, this.topology().stageScale());

                //todo
                //                if (links.length == 1) {
                //                    firstLink.view().watch("opacity", function (prop, value) {
                //                        if (this.$ && this.view("path") && this.view("path").opacity) {
                //                            this.view("path").opacity(value);
                //                        }
                //                    }, this);
                //                }
            },

            _serializeLinks: function(links) {
                var linksSequentialArray = [];
                var len = links.length;

                if (this.reverse()) {
                    linksSequentialArray.push(new Line(links[0].targetVector(), links[0].sourceVector()));
                } else {
                    linksSequentialArray.push(new Line(links[0].sourceVector(), links[0].targetVector()));
                }

                for (var i = 1; i < len; i++) {
                    var firstLink = links[i - 1];
                    var secondLink = links[i];
                    var firstLinkSourceVector = firstLink.sourceVector();
                    var firstLinkTargetVector = firstLink.targetVector();
                    var secondLinkSourceVector = secondLink.sourceVector();
                    var secondLinkTargetVector = secondLink.targetVector();

                    if (firstLink.targetNodeID() == secondLink.sourceNodeID()) {
                        linksSequentialArray.push(new Line(secondLinkSourceVector, secondLinkTargetVector));
                    } else if (firstLink.targetNodeID() == secondLink.targetNodeID()) {
                        linksSequentialArray.push(new Line(secondLinkTargetVector, secondLinkSourceVector));
                    } else if (firstLink.sourceNodeID() == secondLink.sourceNodeID()) {
                        linksSequentialArray.pop();
                        linksSequentialArray.push(new Line(firstLinkTargetVector, firstLinkSourceVector));
                        linksSequentialArray.push(new Line(secondLinkSourceVector, secondLinkTargetVector));
                    } else {
                        linksSequentialArray.pop();
                        linksSequentialArray.push(new Line(firstLinkTargetVector, firstLinkSourceVector));
                        linksSequentialArray.push(new Line(secondLinkTargetVector, secondLinkSourceVector));
                    }
                }

                if (this.reverse()) {
                    linksSequentialArray.reverse();
                }

                return linksSequentialArray;
            },
            isEqual: function(pos1, pos2) {
                return pos1.x == pos2.x && pos1.y == pos2.y;
            },
            dispose: function() {
                this.edgeIdCollection().clear();
                nx.each(this.nodes, function(node) {
                    node.off('updateNodeCoordinate', this.draw, this);
                }, this);
                this.inherited();
            }
        }
    });
})(nx, nx.global);