(function (nx, global) {

    var model = [
        {
            text: 'Enterprise Network Layout',
            url: '../../test/enterpriselayout.html'
        },
        {
            text: 'Hierarchical Layout',
            url: '../../test/hierarchicalLayout.html'
        },
        {
            text: 'Search Topology',
            url: '../../test/highight.html'
        },
        {
            text: 'Topology editor',
            url: '../../test/add&remove.html'
        },
        {
            text: 'Insert data and re-layout',
            url: '../../test/insertData.html'
        }


    ]

    nx.define("Base.Cool", nx.ui.Component, {
        events: [],
        properties: {
        },
        view: {
            content: {
                props: {
                    style: {
                        'padding': '20'
                    }
                },
                content: {
                    tag: 'ul',
                    props: {
                        'class': 'list-group',
                        items: model,
                        template: {
                            tag: 'li',
                            props: {
                                'class': 'list-group-item',
                            },
                            content: {
                                tag: 'a',
                                props: {

                                    'href': '{url}',
                                    'target': '_black'
                                },
                                content: '{text}'
                            }
                        }
                    }
                }
            }
        },
        methods: {

        }
    });


})(nx, nx.global);