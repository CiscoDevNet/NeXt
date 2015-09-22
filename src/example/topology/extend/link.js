(function (nx, global) {
    var Vector = nx.geometry.Vector;
    var Line = nx.geometry.Line;

    var topologyData = {
        "nodes": [
            {"id": 0, "x": 269.2, "y": -29.599999999999994, "name": "12K-1"},
            {"id": 1, "x": 513.2, "y": 298.4, "name": "12K-2"},
            {"id": 2, "x": 364, "y": 472, "name": "Of-9k-03"},
            {"id": 3, "x": 655.2, "y": -31.200000000000017, "name": "Of-9k-02"},
            {"id": 4, "x": 180, "y": 190, "name": "Of-9k-01"}
        ],
        "links": [
            {"source": 0, "target": 1},
            {"source": 0, "target": 1},
            {"source": 1, "target": 2},
            {"source": 1, "target": 3},
            {"source": 4, "target": 1},
            {"source": 2, "target": 3},
            {"source": 2, "target": 0},
            {"source": 3, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]};
    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];

    nx.define('Extend.Link', nx.ui.Component, {
        properties: {
            drawLink: {
                value: function () {
                    return function () {
                        var line = this.line();
                        var n, point;
                        var path = [];
//                        if (link.reverse()) {
//                            line = line.negate();
//                        }
                        n = line.normal().multiply(3);
                        point = line.center().add(n);
                        path.push('M', line.start.x, line.start.y);
                        path.push('C', line.start.x - 100, line.start.y + 10, line.end.x + 150, line.end.y + 30, line.end.x, line.end.y);
                        path.push('T', line.end.x, line.end.y, line.end.x + 150, line.end.y + 30, line.start.x, line.start.y);
                        path.push('Z');


//                        var line = this.line();
//                        var path = [];
//                        path.push('M', line.start.x, line.start.y);
//                        path.push('L', line.end.x, line.start.y);
//                        path.push('L', line.end.x, line.end.y);

                        return path.join(' ');

                    }
                }
            }
        },
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
                    linkConfig: {
                        drawMethod: '{#drawLink}'
                    },
                    data: topologyData
                }
            }
        }
    });


})(nx, nx.global);