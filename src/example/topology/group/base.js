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

    nx.define('Group.Base', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    nodeConfig: {
                        label: 'model.id'
                    },
                    showIcon: true,
                    data: topologyData
                },
                events: {
                    'topologyGenerated': '{#_group}'
                }
            }
        },
        methods: {
            _group: function (sender, event) {
                var groupsLayer = sender.getLayer('groups');
                var nodes1 = [sender.getNode(0), sender.getNode(1)];
                var group1 = groupsLayer.addGroup({
                    nodes: nodes1,
                    label: 'Rect',
                    color: '#f00'
                });


                var nodes2 = [sender.getNode(0), sender.getNode(4)];
                var group2 = groupsLayer.addGroup({
                    nodes: nodes2,
                    shapeType: 'circle',
                    label: 'Circle'
                    // color: '#f00'
                });

                group2.on('clickGroupLabel', function (sender, events) {
                    console.log(group2.nodes().toArray());
                }, this);


                var nodes3 = [sender.getNode(1), sender.getNode(2), sender.getNode(3)];
                var group3 = groupsLayer.addGroup({
                    nodes: nodes3,
                    shapeType: 'polygon',
                    label: 'Polygon'
                    // color: '#f00'
                });

            }
        }
    });

})(nx, nx.global);