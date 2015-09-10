(function (nx, global) {
    /**
     * @class nx.graphic.LinkTooltipContent
     * @extend nx.ui.Component
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.LinkTooltipContent", nx.ui.Component, {
        properties: {
            link: {
                set: function (value) {
                    var model = value.model();
                    this.view('list').set('items', new nx.data.Dictionary(model.getData()));
                }
            },
            topology: {},
            tooltipmanager: {}
        },
        view: {
            content: {
                props: {
                    'class': 'n-topology-tooltip-content n-list'
                },
                content: [
                    {
                        name: 'list',
                        tag: 'ul',
                        props: {
                            'class': 'n-list-wrap',
                            template: {
                                tag: 'li',
                                props: {
                                    'class': 'n-list-item-i',
                                    role: 'listitem'
                                },
                                content: [
                                    {
                                        tag: 'label',
                                        content: '{key}: '
                                    },
                                    {
                                        tag: 'span',
                                        content: '{value}'
                                    }
                                ]

                            }
                        }
                    }
                ]
            }
        }
    });


})(nx, nx.global);