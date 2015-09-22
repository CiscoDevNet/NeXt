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
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 4, "target": 1},
            {"source": 2, "target": 3},
            {"source": 2, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]
    };


    nx.define('MyNode', nx.graphic.Topology.AbstractNode, {
        view: {
            type: 'nx.graphic.Group',
            props: {
                translate: '{#position}'
            },
            content: [
                {
                    type: 'nx.graphic.Triangle',
                    props: {
                        width: 30,
                        height: 30,
                        translateX: -15,
                        translateY: -15,
                        fill: '#FFEB00'
                    }
                },
                {
                    type: 'nx.graphic.Image',
                    props: {
                        width: 16,
                        height: 16,
                        x: 15,
                        y: -5,
                        src: 'https://cdn1.iconfinder.com/data/icons/freeapplication/png/24x24/OK.png',
                        visible: '{#selected}'
                    }
                },
                {
                    type: 'nx.graphic.Text',
                    props: {
                        y: 30,
                        text:'{name}'
                    }
                }
            ]
        }
    });


    nx.define('Extend.AbstractNode', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    nodeInstanceClass: 'MyNode',
                    data: topologyData
                }
            }
        }
    });


})(nx, nx.global);