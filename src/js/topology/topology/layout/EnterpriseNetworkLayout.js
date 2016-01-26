(function (nx, global) {

    nx.define("nx.graphic.Topology.EnterpriseNetworkLayout", nx.graphic.Topology.HierarchicalLayout, {
        properties: {
        },
        methods: {

            process: function (graph, config, callback) {
                this.inherited(graph, config, function () {
                    this._appendGroupElements();
                    if (callback) {
                        callback();
                    }
                }.bind(this));
            },
            _appendGroupElements: function () {
                var topo = this.topology();
                var matrix = topo.matrix();
                var layer = topo.prependLayer('ENLLayer', new Layer());
                var stage = topo.stage();
                var padding = topo.padding();
                var width = topo.width() - padding * 2;
                var height = topo.height() - padding * 2;
                var groups = this.groups();
                var order = this.order();
                var perHeight = height / (order.length);
                var y = padding;
                var items = [];
                var gap = 0;
                nx.each(groups, function (nodes, key) {
                    var label = key !== '__other__' ? key : '';
                    var firstNode = nodes[0];
                    items.push({
                        left: (padding - matrix.x()) / matrix.scale(),
                        top: firstNode.y() - 30 / matrix.scale(),
                        width: width / matrix.scale(),
                        height: 65 / matrix.scale(),
                        label: label,
                        stroke: '#b2e47f'
                    });
                    y += perHeight;
                }, this);

                console.log(items);

                layer.items(items);

            }
        }
    });

    var GroupItem = nx.define(nx.graphic.Group, {
        properties: {
            scale: {},
            top: {},
            left: {},
            label: {},
            width: {},
            height: {},
            stroke: {}
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                translateY: '{#top}',
                translateX: '{#left}',
                scale: '{#scale}'
            },

            content: [
                {
                    type: 'nx.graphic.Text',
                    props: {
                        text: '{#label}',
                        fill: '{#stroke}',
                        'style': 'font-size:19px',
                        y: -5
                    }
                },
                {
                    type: 'nx.graphic.Rect',
                    props: {
                        width: '{#width}',
                        height: '{#height}',
                        stroke: '{#stroke}'
                    }
                }
            ]
        }
    });

    var Layer = nx.define(nx.graphic.Topology.Layer, {
        properties: {
            items: {}
        },
        view: {
            type: 'nx.graphic.Group',
            content: [
                {
                    type: 'nx.graphic.Group',
                    props: {
                        items: '{#items}',
                        template: {
                            type: GroupItem,
                            props: {
                                top: '{top}',
                                left: '{left}',
                                label: '{label}',
                                width: '{width}',
                                height: '{height}',
                                scale: '{scale}',
                                stroke: '{stroke}',
                                fill: 'none'
                            }
                        }
                    }
                }
            ]
        }
    });

})(nx, nx.global);