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
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 3, "target": 0},
            {"source": 0, "target": 4},
            {"source": 0, "target": 4},
            {"source": 0, "target": 3}
        ]
    };


    nx.define("Model.EditNode", nx.ui.Component, {
        view: {
            props: {
                'class': 'row'
            },
            content: [
                {
                    props: {
                        'class': 'col-md-7'
                    },
                    content: {
                        name: 'topo',
                        type: 'nx.graphic.Topology',
                        props: {
                            width: 800,
                            height: 800,
                            nodeConfig: {
                                label: 'model.name'
                            },
                            linkConfig: {
                                linkType: 'curve'
                            },
                            showIcon: true,
                            data: topologyData
                        },
                        events: {
                            'clickNode': '{#_clickNode}'
                        }
                    }
                },
                {
                    props: {
                        'class': 'col-md-3'
                    },
                    content: [
                        {
                            tag: 'h3',
                            content: 'Node model data'
                        },
                        {
                            name: 'nodeModelForm',
                            props: {
                                template: {
                                    props: {
                                        'class': 'form-group'
                                    },
                                    content: [

                                        {
                                            tag: 'label',
                                            content: '{key}'
                                        },
                                        {
                                            tag: 'input',
                                            props: {
                                                'class': 'form-control',
                                                value: '{value}'
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            tag: 'h3',
                            content: 'Node properties'
                        },
                        {
                            name: 'nodePropertiesForm',
                            props: {
                                template: {
                                    props: {
                                        'class': 'form-group'
                                    },
                                    content: [
                                        {
                                            tag: 'label',
                                            content: '{key}'
                                        },
                                        {
                                            tag: 'input',
                                            props: {
                                                'class': 'form-control',
                                                value: '{value}'
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        },
        methods: {
            _clickNode: function (sender, node) {

                // node model

                if (this._nodeModel) {
                    this._nodeModel.upon("change", null);
                }

                var data = node.model().getData();
                var model = this._nodeModel = new nx.data.ObservableDictionary(data);
                //remove unnecessary items;
                model.removeItem("id");
                // register sync event
                model.upon("change", function (sender, data) {
                    var newItem = data.newItem;
                    node.model().set(newItem.key(), newItem.value());
                });
                // set model
                this.view('nodeModelForm').set('items', model);


                // node properties

                if (this._nodePropertiesModel) {
                    this._nodePropertiesModel.upon("change", null);
                }


                var propertiesModel = this._nodeProperties = new nx.data.ObservableDictionary(node.gets());


                propertiesModel.each(function (item, key) {
                    var value = item.value();
                    if (!(nx.is(value, "String") || nx.is(value, "Number"))) {
                        propertiesModel.removeItem(key);
                    }
                });


                propertiesModel.upon("change", function (sender, data) {
                    var newItem = data.newItem;
                    node.set(newItem.key(), newItem.value());
                });
                // set model
                this.view('nodePropertiesForm').set('items', propertiesModel);


            }
        }
    })


})(nx, nx.global);