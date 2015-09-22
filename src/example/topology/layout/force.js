(function (nx, global) {

    nx.define('Layout.Force', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    nodeConfig: {
                        label: 'model.id'
                    },
                    dataProcessor: 'quick',
                    showIcon: false,
                    enableSmartLabel: false,
                    enableGradualScaling: false,
                    layoutType: 'force'
                },
                events: {
                    'ready': '{#_ready}'
                }
            }
        },
        methods: {
            _ready: function (sender, event) {
                start = new Date();

                var g = new GraphGenerator();
                g.generate(100);

                var topologyData = {nodes: g.nodes, links: g.links};
                start = new Date();
                console.log(new Date() - start);
                sender.setData(topologyData);

                console.log(new Date() - start);
            }
        }
    });

})(nx, nx.global);