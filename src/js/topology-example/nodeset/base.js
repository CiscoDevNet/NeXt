(function (nx, global) {

    var topologyData = {
        nodes: [{
            "id": 0,
            "x": 410,
            "y": 100,
            "name": "12K-1"
        }, {
            "id": 1,
            "x": 410,
            "y": 280,
            "name": "12K-2"
        }, {
            "id": 2,
            "x": 660,
            "y": 280,
            "name": "Of-9k-03"
        }, {
            "id": 3,
            "x": 660,
            "y": 100,
            "name": "Of-9k-02"
        }, {
            "id": 4,
            "x": 180,
            "y": 190,
            "name": "Of-9k-01"
        }],
        links: [{
            "source": 0,
            "target": 1
        }, {
            "source": 1,
            "target": 2
        }, {
            "source": 1,
            "target": 3
        }, {
            "source": 4,
            "target": 1
        }, {
            "source": 2,
            "target": 3
        }, {
            "source": 2,
            "target": 0
        }, {
            "source": 0,
            "target": 4
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }],
        nodeSet: [{
            id: 5,
            type: 'nodeSet',
            nodes: [2, 3],
            root: '2',
            "x": 660,
            "y": 190,
            "name": "Node set 1",
            iconType: 'router'
        }, {
            id: 6,
            type: 'nodeSet',
            nodes: [1, 5],
            root: '1',
            "x": 410,
            "y": 190,
            "name": "Node set 2",
            iconType: 'groupS'
        }, {
            id: 7,
            type: 'nodeSet',
            nodes: [6, 0],
            root: '0',
            "x": 410,
            "y": 280,
            "name": "Node set 3",
            iconType: 'groupM'
        }, {
            id: 8,
            type: 'nodeSet',
            nodes: [7, 4],
            root: '4',
            "x": 410,
            "y": 280,
            "name": "Node set 4",
            iconType: 'groupL'
        }]
    };

    nx.define("MyLinkSet", nx.graphic.Topology.LinkSet, {
        properties: {
            color: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    this.view('numBg').dom().setStyle('stroke', value);
                    this.view('path').dom().setStyle('stroke', value);
                    this._color = value;
                }
            },
            width: {
                set: function (inValue) {
                    var value = this._processPropertyValue(inValue);
                    var width = (this._stageScale || 1) * value;
                    this.view('path').dom().setStyle('stroke-width', width);
                    this._width = value;
                }
            },
            stageScale: {
                set: function (value) {
                    var width = (this._width || 1) * value;
                    this.view('path').dom().setStyle('stroke-width', width);
                    this.view('number').setTransform(null, null, value);
                    /* jshint -W030 */
                    this.model() && this._updateLinksOffset();
                    this._stageScale = value;
                }
            }
        }
    })


    nx.define('NodeSet.Base', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    identityKey: 'id',
                    nodeConfig: {
                        label: 'model.name',
                        iconType: 'model.iconType'
                    },
                    nodeSetConfig: {
                        label: 'model.id',
                        iconType: 'model.iconType'
                    },
                    linkConfig: {
                        color: "red",
                        width: 4
                    },
                    linkSetInstanceClass: "MyLinkSet",
                    linkSetConfig: {
                        color: "red",
                        width: 4
                    },
                    showIcon: true,
                    data: topologyData
                }
            }
        }
    });

})(nx, nx.global);
