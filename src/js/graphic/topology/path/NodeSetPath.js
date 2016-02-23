(function(nx, global) {
    var Vector = nx.geometry.Vector;
    var Line = nx.geometry.Line;

    /**
     * Path over nodeset, has limited use scene
     * @class nx.graphic.Topology.NodeSetPath
     * @extend nx.graphic.BasePath
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.NodeSetPath", nx.graphic.Topology.BasePath, {
        properties: {
            /**
             * arrow style, could be null, cap, end
             * @property {String}
             */
            arrow: {
                value: null
            },
            pathGenerator: {
                value: function() {
                    return function() {
                        var nodes = this.nodes();
                        var topo = this.topology();
                        if (!topo || !nodes) {
                            return;
                        }
                        var graph = topo.graph();
                        var visibleNodes = [];
                        nodes.forEach(function(id) {
                            var vertex = graph.getVertex(id);
                            if (!vertex.generated()) {
                                vertex = vertex.generatedRootVertexSet();
                            }
                            var node = topo.getNode(vertex.id());
                            if (visibleNodes.indexOf(node) == -1) {
                                visibleNodes.push(node);
                            }
                        });
                        var arrow = this.arrow();
                        var pathStyle = this.pathStyle();
                        var stageScale = topo.stageScale();
                        var revisionScale = topo.revisionScale();
                        var padding = (topo.showIcon() ? 20 : 8) * stageScale * revisionScale;
                        var strokeWidth = (parseInt(pathStyle['stroke-width'], 10) || 1) * stageScale;
                        var visibleNodesLength = visibleNodes.length;
                        var d = this._dArray = [];

                        for (var i = 0; i < visibleNodesLength - 1; i++) {
                            var sourceNode = visibleNodes[i];
                            var targetNode = visibleNodes[i + 1];
                            var line = new Line(sourceNode.vector(), targetNode.vector());
                            // padding start
                            if (i == 0) {
                                line = line.pad(padding, 0);
                                d.push('M', line.start.x, line.start.y);
                            } else if (i == visibleNodesLength - 2) {
                                line = line.pad(0, arrow ? padding + strokeWidth : padding );
                                d.push('L', line.start.x, line.start.y);
                                d.push('L', line.end.x, line.end.y);
                            } else {
                                d.push('L', line.start.x, line.start.y);
                            }
                        }

                        this._drawArrow();
                        return d.join(" ");
                    };
                }
            }
        },
        methods: {
            attach: function(parent) {
                this.inherited(parent);
                var el = this._arrowEL = new nx.graphic.Path();
                el.attach(this);

            },
            _drawArrow: function() {
                var arrow = this.arrow();

                if (!this._arrowEL || !arrow) {
                    return;
                }
                var arrowD = [];
                var d = this._dArray;
                var len = d.length;
                var topo = this.topology();
                var pathStyle = this.pathStyle();
                var stageScale = topo.stageScale();
                var revisionScale = topo.revisionScale();
                var strokeWidth = (parseInt(pathStyle['stroke-width'], 10) || 1) * stageScale;
                var line = new Line(new Vector(d[len - 5], d[len - 4]), new Vector(d[len - 2], d[len - 1]));
                var v1, v2, v3;

                if (arrow == 'cap') {
                    v1 = new Vector(0, -strokeWidth);
                    v2 = new Vector(strokeWidth, strokeWidth);
                    v3 = new Vector(-strokeWidth, strokeWidth);
                    arrowD.push('M', line.end.x, line.end.y);
                    line = line.translate(v1);
                    arrowD.push('L', line.end.x, line.end.y);
                    line = line.translate(v2);
                    arrowD.push('L', line.end.x, line.end.y);
                    line = line.translate(v3);
                    arrowD.push('L', line.end.x, line.end.y);
                    arrowD.push('Z');
                    this._arrowEL.set('d', arrowD.join(" "));
                    this._arrowEL.dom().setStyle('stroke-width', 1 * stageScale);
                    this._arrowEL.dom().setStyle('fill', pathStyle['stroke']);
                    this._arrowEL.dom().setStyle('stroke', pathStyle['stroke']);

                } else if (arrow == 'end') {
                    v1 = new Vector(0, -strokeWidth/2);
                    v2 = new Vector(strokeWidth, strokeWidth/2);
                    v3 = new Vector(-strokeWidth, strokeWidth/2);
                    arrowD.push('M', line.end.x, line.end.y);
                    line = line.translate(v1);
                    arrowD.push('L', line.end.x, line.end.y);
                    line = line.translate(v2);
                    arrowD.push('L', line.end.x, line.end.y);
                    line = line.translate(v3);
                    arrowD.push('L', line.end.x, line.end.y);
                    arrowD.push('Z');
                    this._arrowEL.set('d', arrowD.join(" "));
                    this._arrowEL.dom().setStyle('stroke-width', 1 * stageScale);
                    this._arrowEL.dom().setStyle('fill', pathStyle['stroke']);
                    this._arrowEL.dom().setStyle('stroke', pathStyle['stroke']);
                }

            }

        }

    });
})(nx, window);