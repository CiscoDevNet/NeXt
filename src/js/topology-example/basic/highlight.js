(function (nx, global) {

    var g = new GraphGenerator();
    g.generate(50);

    var topologyData = {nodes: g.nodes, links: g.links};

    nx.define('Base.Highlight', nx.ui.Component, {
        view: {
            content: {
                name: 'topo',
                type: 'nx.graphic.Topology',
                props: {
                    adaptive: true,
                    dataProcessor: 'force',
                    nodeConfig: {
                        label: 'model.id'
                    },
                    showIcon: false,
                    data: topologyData
                },
                events: {
                    topologyGenerated: '{#_main}'
                }
            }
        },
        methods: {
            _main: function (sender, event) {
                var topo = sender;


                //fade out all layer
                nx.each(topo.layers(), function (layer) {
                    layer.fadeOut(true);
                }, this);


                //highlight related node
                topo.highlightRelatedNode(topo.getNode(1));

                //highlight single node or nodes
                var nodeLayer = topo.getLayer('nodes');
                var nodeLayerHighlightElements = nodeLayer.highlightedElements();
                nodeLayerHighlightElements.add(topo.getNode(30));
                nodeLayerHighlightElements.add(topo.getNode(20));

                //highlight links
                var linksLayer = topo.getLayer('links');
                var linksLayerHighlightElements = linksLayer.highlightedElements();
                linksLayerHighlightElements.addRange(nx.util.values(topo.getNode(40).links()));


            }
        }
    });

})(nx, nx.global);


