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
            {"source": 0, "target": 1, id: 0},
            {"source": 0, "target": 1, id: 1},
            {"source": 1, "target": 0, id: 2},
            {"source": 1, "target": 2, id: 3},
            {"source": 1, "target": 3, id: 4},
            {"source": 4, "target": 1, id: 5},
            {"source": 4, "target": 1, id: 6},
            {"source": 2, "target": 3, id: 7},
            {"source": 2, "target": 3, id: 8},
            {"source": 2, "target": 0, id: 9},
            {"source": 0, "target": 4, id: 10},
            {"source": 0, "target": 4, id: 11},
            {"source": 0, "target": 3, id: 12},
            {"source": 0, "target": 1, id: 13},
        ]
    };
    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];

    nx.define('Path.Base', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    width: 800,
                    height: 800,
                    nodeConfig: {
                        label: 'model.id'
                    },
                    showIcon: true,
                    data: topologyData
                },
                events: {
                    'topologyGenerated': '{#_path}'
                }
            }
        },
        methods: {
            _path: function (sender, events) {
                var pathLayer = sender.getLayer("paths");


                var links1 = [sender.getLink(2)];

                var path1 = new nx.graphic.Topology.Path({
                    links: links1,
//		    pathWidth:5,
                    arrow: 'cap'
                });

                pathLayer.addPath(path1);
            }
        }
    });

})(nx, nx.global);
