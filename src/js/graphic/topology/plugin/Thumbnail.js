(function (nx, global) {
    var d = 500;

    /**
     * Thumbnail for topology
     * @class nx.graphic.Topology.Thumbnail
     * @extend nx.ui.Component
     */

    nx.define("nx.graphic.Topology.Thumbnail", nx.ui.Component, {
        events: [],
        view: {
            props: {
                'class': 'n-topology-thumbnail'
            },
            content: {
                props: {
                    'class': 'n-topology-container'
                },
                content: [
                    {
                        name: 'win',
                        props: {
                            'class': 'n-topology-thumbnail-win'
                        }
                    },
                    {
                        name: 'canvas',
                        tag: 'canvas',
                        props: {
                            'class': 'n-topology-thumbnail-canvas'
                        }
                    }
                ]
            }

        },
        properties: {
            topology: {},
            width: {
                set: function (value) {
                    this.view().dom().setStyles({
                        width: value * 0.2,
                        left: value * 0.8
                    });

                    this.view('canvas').dom().setStyle('width', value * 0.2);
                    this._drawWin();
                }
            },
            height: {
                set: function (value) {
                    this.view().dom().setStyles({
                        height: value * 0.2,
                        top: value * 0.8
                    });

                    this.view('canvas').dom().setStyle('height', value * 0.2);
                    this._drawWin();
                }
            }
        },
        methods: {
            attach: function (parent, index) {
                this.inherited(parent, index);
                var topo = parent.owner();
                this.topology(topo);


                topo.on('dragStage', this._drawWin, this);
//                topo.on('dragStage', this._drawTopo, this);
                topo.stage().watch('zoomLevel', this._drawWin, this);


                topo.on('topologyGenerated', function () {
                    var graph = topo.graph();
                    graph.on('addVertex', this._drawTopo, this);
                    graph.on('removeVertex', this._drawTopo, this);
                    graph.on('updateVertexCoordinate', this._drawTopo, this);

                    this._drawTopo();
                }, this);


            },
            _drawWin: function () {
                var topo = this.topology();
                if (!topo) {
                    return;
                }


                var width = topo.width() * 0.2;
                var height = topo.height() * 0.2;
                var zoomLevel = topo.stage().zoomLevel();
                var stageBound = topo.stage().scalingLayer().getBound();
                this.view('win').dom().setStyles({
                    width: width / zoomLevel,
                    height: height / zoomLevel,
                    top: (stageBound.top - (topo.height() - stageBound.height) / 2) * 0.2,
                    left: (stageBound.left - (topo.width() - stageBound.width) / 2) * 0.2
                });


                if (zoomLevel >= 1) {

                }

            },
            _drawTopo: function () {
                var topo = this.topology();
                if (!topo) {
                    return;
                }


                var width = topo.width() * 0.2;
                var height = topo.height() * 0.2;
                var translateX = 0;
                var translateY = 0;
                var canvas = this.view('canvas').dom().$dom;
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, width * 2, height * 2);

                topo.eachNode(function (node) {
                    ctx.fillStyle = '#26A1C5';
                    ctx.fillRect(node.x() * 0.2 + translateX, node.y() * 0.2 + translateY, 3, 3);
                });


            }
        }
    });


})(nx, nx.global);