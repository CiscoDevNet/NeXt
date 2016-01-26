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

    // register icon globally
    nx.graphic.Icons.registerIcon("icon1", "http://10.75.161.96/trunk/next/css/futurama/img/gif/progress.gif", 32, 32);


    nx.define('Base.Icon', nx.ui.Component, {
        properties: {
            currentNode: {

            },
            iconType: {
                get: function () {
                    return Math.round(Math.random()) ? 'icon1' : 'icon2';
                }
            }
        },
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    nodeConfig: {
                        label: 'model.id',
                        iconType: '{#iconType}'
                    },
                    showIcon: true,
                    data: topologyData
                },
                events: {
                    'ready': '{#_ready}'
                }
            }
        },
        methods: {
            _ready: function (sender, event) {
                var topo = this.view('topo');
                //register icon to instance
                topo.registerIcon("icon2", "https://www.google.com/images/srpr/logo11w.png", 80, 32);
            }
        }
    });

})(nx, nx.global);