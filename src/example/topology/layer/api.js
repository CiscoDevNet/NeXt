(function (nx, global) {

    var topologyData = {
        nodes: [
            {"id": 0, "x": 410, "y": 100, "name": "12K-1"},
            {"id": 1, "x": 410, "y": 280, "name": "12K-2"},
            {"id": 2, "x": 660, "y": 280, "name": "Of-9k-03"},
            {"id": 3, "x": 660, "y": 100, "name": "Of-9k-02"},
            {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
        ],
        links: [
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 4, "target": 1},
            {"source": 2, "target": 3},
            {"source": 2, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]
    };
    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];


    //DEFINE A LAYER
    nx.define("NodeStatus", nx.graphic.Topology.Layer, {
        methods: {
            draw: function () {
                var topo = this.topology();
                topo.eachNode(function (node) {
                    var dot = new nx.graphic.Circle({
                        r: 6,
                        cx: -20,
                        cy: -20
                    });
                    var color = "#f00";
                    if (node.model().get("id") > 2) {
                        color = "#0f0";
                    }
                    dot.set("fill", color);
                    dot.attach(node);
                    node.dot = dot;
                }, this);
            },
            turnGreen: function () {
                var topo = this.topology();
                topo.eachNode(function (node) {
                    node.dot.set("fill", "#0f0");

                })
            },
            random: function () {
                var topo = this.topology();
                topo.eachNode(function (node) {
                    node.dot.set("fill", colorTable[Math.floor(Math.random() * 5)]);

                })
            }
        }
    });


    nx.define('Layer.API', nx.ui.Component, {
        view: {
            content: [
                {
                    tag: 'button',
                    props: {
                        'class': 'btn btn-default'
                    },
                    content: 'Turn Green',
                    events: {
                        'click': '{#_click}'
                    }
                },
                {
                    tag: 'button',
                    props: {
                        'class': 'btn btn-default'
                    },
                    content: ' Random',
                    events: {
                        'click': '{#_random}'
                    }
                },
                {
                    name: 'topo',
                    type: 'nx.graphic.Topology',
                    props: {
                        width: 800,
                        height: 800,
                        nodeConfig: {
                            label: 'model.id'
                        },
                        nodeIconType: 'switch',
                        showIcon: true,
                        data: topologyData
                    },
                    events: {
                        'topologyGenerated': '{#_main}'
                    }
                }
            ]
        },
        methods: {
            _main: function (sender, events) {
                sender.attachLayer("status", "NodeStatus");
            },
            _click: function (sender, events) {
                var topo = this.view('topo');
                // get layer
                var statusLayer = topo.getLayer("status")
                // call layer API
                statusLayer.turnGreen()
            },
            _random: function (sender, events) {
                var topo = this.view('topo');
                // get layer
                var statusLayer = topo.getLayer("status")
                // call layer API
                statusLayer.random()
            }
        }
    });

})(nx, nx.global);