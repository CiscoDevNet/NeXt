(function(nx, global) {
    /**
     * Topology base class

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
     nx.define('MyTopology', nx.ui.Component, {
        view: {
            content: {
                type: 'nx.graphic.Topology',
                props: {
                    width: 800,
                    height: 800,
                    nodeConfig: {
                        label: 'model.id'
                    },
                    showIcon: true,
                    data: topologyData
                }
            }
        }
     });
     var app = new nx.ui.Application();
     var comp = new MyTopology();
     comp.attach(app);


     * @class nx.graphic.Topology
     * @extend nx.ui.Component
     * @module nx.graphic.Topology
     * @uses nx.graphic.Topology.Config
     * @uses nx.graphic.Topology.Projection
     * @uses nx.graphic.Topology.Graph
     * @uses nx.graphic.Topology.Event
     * @uses nx.graphic.Topology.StageMixin
     * @uses nx.graphic.Topology.NodeMixin
     * @uses nx.graphic.Topology.LinkMixin
     * @uses nx.graphic.Topology.LayerMixin
     * @uses nx.graphic.Topology.TooltipMixin
     * @uses nx.graphic.Topology.SceneMixin
     *
     */
    var extendEvent = nx.Object.extendEvent;
    var extendProperty = nx.Object.extendProperty;
    var extendMethod = nx.Object.extendMethod;
    var Topology = nx.define("nx.graphic.Topology", nx.ui.Component, {
        statics: {
            i18n: {
                'cantAggregateExtraNode': 'Can\'t aggregate extra node',
                'cantAggregateNodesInDifferentNodeSet': 'Can\'t aggregate nodes in different nodeSet'
            },
            extensions: [],
            registerExtension: function(cls) {
                var prototype = Topology.prototype;
                var classPrototype = cls.prototype;

                Topology.extensions.push(cls);

                nx.each(cls.__events__, function(name) {
                    extendEvent(prototype, name);
                });

                nx.each(cls.__properties__, function(name) {
                    extendProperty(prototype, name, classPrototype[name].__meta__);
                });

                nx.each(cls.__methods__, function(name) {
                    if (name !== 'init') {
                        extendMethod(prototype, name, classPrototype[name]);
                    }
                });
            },
            layouts: {}
        },
        mixins: [
            nx.graphic.Topology.Config,
            nx.graphic.Topology.Graph,
            nx.graphic.Topology.Event,
            nx.graphic.Topology.StageMixin,
            nx.graphic.Topology.NodeMixin,
            nx.graphic.Topology.LinkMixin,
            nx.graphic.Topology.LayerMixin,
            nx.graphic.Topology.LayoutMixin,
            nx.graphic.Topology.TooltipMixin,
            nx.graphic.Topology.SceneMixin,
            nx.graphic.Topology.Categories
        ],
        events: ['clear'],
        view: {
            props: {
                'class': ['n-topology', '{#themeClass}'],
                tabindex: '0',
                style: {
                    width: "{#width}",
                    height: "{#height}"
                }
            },
            content: [{
                    name: "stage",
                    type: "nx.graphic.Stage",
                    props: {
                        width: "{#width}",
                        height: "{#height}",
                        padding: '{#padding}',
                        matrixObject: '{#matrix,direction=<>}',
                        stageScale: '{#stageScale,direction=<>}'
                    },
                    events: {
                        ':mousedown': '{#_pressStage}',
                        ':touchstart': '{#_pressStage}',
                        'click': '{#_clickStage}',
                        'touchend': '{#_clickStage}',
                        'mousewheel': '{#_mousewheel}',
                        'DOMMouseScroll': '{#_mousewheel}',
                        'dragStageStart': '{#_dragStageStart}',
                        'dragStage': '{#_dragStage}',
                        'dragStageEnd': '{#_dragStageEnd}',
                        'stageTransitionEnd': '{#_stageTransitionEnd}'

                    }
                }, {
                    name: 'nav',
                    type: 'nx.graphic.Topology.Nav',
                    props: {
                        visible: '{#showNavigation}',
                        showIcon: '{#showIcon,direction=<>}'
                    }
                }, {
                    name: 'loading',
                    props: {
                        'class': 'n-topology-loading'
                    },
                    content: {
                        tag: 'ul',
                        props: {
                            items: new Array(10),
                            template: {
                                tag: 'li'
                            }
                        }
                    }
                },
                //                {
                //                    type: 'nx.graphic.Topology.Thumbnail',
                //                    props: {
                //                        width: "{#width}",
                //                        height: "{#height}"
                //                    }
                //                },
                {
                    name: 'img',
                    tag: 'img',
                    props: {
                        style: {
                            'display': 'none'
                        }
                    }
                }, {
                    name: 'canvas',
                    tag: 'canvas',
                    props: {
                        width: "{#width}",
                        height: "{#height}",
                        style: {
                            'display': 'none'
                        }
                    }
                }

            ],
            events: {
                'contextmenu': '{#_contextmenu}',
                'keydown': '{#_key}'
            }
        },
        properties: {},
        methods: {
            init: function(args) {
                this.inherited(args);
                this.sets(args);

                this.initStage();
                this.initLayer();
                this.initGraph();
                this.initNode();
                this.initScene();
                this.initLayout();


                nx.each(Topology.extensions, function(cls) {
                    var ctor = cls.__ctor__;
                    if (ctor) {
                        ctor.call(this);
                    }
                }, this);


            },
            attach: function(args) {
                this.inherited(args);
                this._adaptiveTimer();
            },
            /**
             * Clear all layer's content
             * @method clear
             */
            clear: function() {
                this.status('cleared');
                if (this._nodesAnimation) {
                    this._nodesAnimation.stop();
                }
                this.graph().clear();
                this.tooltipManager().closeAll();
                nx.each(this.layers(), function(layer, name) {
                    layer.clear();
                });
                this.blockEvent(false);
                this.fire('clear');
                if (this.width() && this.height()) {
                    this.status('appended');
                }
            },
            dispose: function() {
                this.status('disposed');
                this.tooltipManager().dispose();
                this.graph().dispose();

                nx.each(this.layers(), function(layer) {
                    layer.dispose();
                });
                this.blockEvent(false);
                this.inherited();
            }
        }
    });
})(nx, nx.global);