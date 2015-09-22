(function (nx, global) {
    var statusIconMap = {
        'normal': 'https://cdn1.iconfinder.com/data/icons/blueberry/32/radio-button_on.png',
        'warning': 'https://cdn1.iconfinder.com/data/icons/blueberry/32/attention.png',
        'error': 'https://cdn1.iconfinder.com/data/icons/blueberry/32/stop.png'
    }


    var topologyData = {
        nodes: [{
            "id": 0,
            "x": 410,
            "y": 100,
            "name": "12K-1",
            status: 'warning'
        }, {
            "id": 1,
            "x": 410,
            "y": 280,
            "name": "12K-2",
            status: 'normal'
        }, {
            "id": 2,
            "x": 660,
            "y": 280,
            "name": "Of-9k-03",
            status: 'normal'
        }, {
            "id": 3,
            "x": 660,
            "y": 100,
            "name": "Of-9k-02",
            status: 'error'
        }, {
            "id": 4,
            "x": 180,
            "y": 190,
            "name": "Of-9k-01",
            status: 'warning'
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
        }]
    };


    nx.define('MyExtendNode', nx.graphic.Topology.Node, {
        view: function (view) {
            view.content.push({
                name: 'status',
                type: 'nx.graphic.Image',
                props: {
                    width: 16,
                    height: 16,
                    x: 20,
                    y: -5
                }
            });
            return view;
        },
        methods: {
            init: function (options) {
                this.inherited(options);
                this.view("icon").watch("scale", this._updateScale, this);
                this._updateScale("scale", this.view("icon").scale());
            },
            dispose: function () {
                this.view("icon").unwatch("scale", this._updateScale, this);
                this.inherited();
            },
            _updateScale: function (pname, pvalue) {
                pvalue = pvalue || 1;
                var statusIcon = this.view("status");
                statusIcon.sets({
                    width: 16 * pvalue,
                    height: 16 * pvalue,
                    x: 20 * pvalue,
                    y: -5 * pvalue
                });
            },
            setModel: function (model) {
                this.inherited(model);
                var status = model.get('status') || 'normal';
                this.view('status').set('src', statusIconMap[status]);
            }
        }

    });



    nx.define('Extend.Node', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    nodeInstanceClass: 'MyExtendNode',
                    showIcon: true,
                    data: topologyData
                }
            }
        }
    });


})(nx, nx.global);
