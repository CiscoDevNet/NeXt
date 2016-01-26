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


    nx.define('MyExtendNodeColorful', nx.graphic.Topology.Node, {
        view: function (view) {
            view.content.unshift({
                name: 'defs',
                tag: "svg:defs",
                content: {
                    tag: "svg:linearGradient",
                    props: {
                        id: "{#gradientid}"
                    },
                    content: [{
                        tag: "svg:stop",
                        props: {
                            offset: "0%",
                            "stop-color": "green"
                        }
                    }, {
                        tag: "svg:stop",
                        props: {
                            offset: "{#offset1}",
                            "stop-color": "green"
                        }
                    }, {
                        tag: "svg:stop",
                        props: {
                            offset: "{#offset1}",
                            "stop-color": "#99aa99"
                        }
                    }, {
                        tag: "svg:stop",
                        props: {
                            offset: "{#offset2}",
                            "stop-color": "#99aa99"
                        }
                    }, {
                        tag: "svg:stop",
                        props: {
                            offset: "{#offset2}",
                            "stop-color": "gray"
                        }
                    }, {
                        tag: "svg:stop",
                        props: {
                            offset: "100%",
                            "stop-color": "gray"
                        }
                    }]
                }
            });
            return view;
        },
        properties: {
            offset1: {},
            offset2: {},
            gradientid: {},
            refgradientid: {}
        },
        methods: {
            setModel: function (model) {
                var o1 = Math.floor(Math.random() * 100);
                var o2 = Math.floor(Math.random() * 100);
                this.offset1(Math.min(o1, o2) + "%");
                this.offset2(Math.max(o1, o2) + "%");
                this.gradientid("nodegradient" + model.id());
                this.refgradientid("url('#nodegradient" + model.id() + "')");
                this.view("icon").view("text").dom().setStyle("fill", this.refgradientid());
                this.inherited(model);
            }
        }

    });



    nx.define('Extend.NodeColorful', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    nodeInstanceClass: 'MyExtendNodeColorful',
                    showIcon: true,
                    data: topologyData
                }
            }
        }
    });


})(nx, nx.global);
