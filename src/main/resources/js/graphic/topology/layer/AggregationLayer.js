(function (nx, global) {



    nx.graphic.define("nx.graphic.Topology.AggregationItem", {
        properties: {
            nodeSet: {},
            topology: {},
            activeNodeSet: {},
            x: {
                get: function () {
                    var index = this.iteratorIndex();
                    return index * 120;
                }
            }
        },
        view: {
            type: "nx.graphic.Group",
            props: {
                'class': 'aggregationGroup'
            },
            content: [
                {
                    name: 'labels',
                    props: {
                        translateY: -20,
                        translateX: 15,
                        template: {
                            type: "nx.graphic.Group",
                            props: {
                                translateX: '{#x}'
                            },
                            content: [
                                {
                                    name: 'icon',
                                    content: {
                                        type: "nx.graphic.Topology.NodeIcon",
                                        props: {
                                            'class': 'icon',
                                            iconType: 'collapse'
                                        }
                                    }
                                },
                                {
                                    type: "nx.graphic.Group",
                                    props: {
                                        translateY: 6,
                                        translateX: 28
                                    },
                                    content: {
                                        type: "nx.graphic.Topology.NodeIcon",
                                        props: {
                                            'class': 'icon',
                                            iconType: '{icon}',
                                            width: 24,
                                            height: 24
                                        }
                                    }
                                },
                                {

                                    name: 'text',
                                    type: 'nx.graphic.Text',
                                    props: {
                                        translateY: 4,
                                        translateX: 36,
                                        'class': 'aggregationText',
                                        text: "{label}"
                                    }
                                },
                                {
                                    name: 'arrow',
                                    type: "nx.graphic.Group",
                                    content: {
                                        type: "nx.graphic.Topology.NodeIcon",
                                        props: {
                                            'class': 'icon',
                                            iconType: 'arrow'
                                        }
                                    }
                                }
                            ],
                            events: {
                                'mousedown': '{#_mousedown}',
                                'touchstart': '{#_mousedown}'
                            }
                        }
                    }
                },
                {
                    name: 'rect',
                    type: 'nx.graphic.Rect',
                    props: {
                        //translateY: -10,
                        'class': 'aggregationRect'
                    }
                }
            ]


        },
        methods: {
            onInit: function () {
                var labels = this.view("labels");

                labels.on("itemsGenerated", function () {
                    var x = 0;
                    var children = labels.children();
                    nx.each(children, function (child) {
                        var bound = child.getBound();
                        child.set("translateX", x);
                        child.view("arrow").set("translateX", bound.width + 1);

                        x += bound.width + 18;
                    });

                    children[children.length - 1].view("arrow").visible(false);
                }, this);
            },
            update: function (activeNodeSet) {


                var parentNodeSet = activeNodeSet.parentNodeSet();
//
                var items = [
                    {
                        icon: activeNodeSet.iconType(),
                        label: activeNodeSet.label(),
                        nodeSet: activeNodeSet
                    }
                ];

                while (parentNodeSet && parentNodeSet.parentNodeSet()) {
                    items.push({
                        icon: parentNodeSet.iconType(),
                        label: parentNodeSet.label(),
                        nodeSet: parentNodeSet
                    });
                    parentNodeSet = parentNodeSet.parentNodeSet();
                }


                var topParentNodeSet = activeNodeSet.getTopParentNodeSet();

                //close all items
                if (topParentNodeSet) {

                    items.push({
                        icon: topParentNodeSet.iconType(),
                        label: topParentNodeSet.label(),
                        nodeSet: topParentNodeSet
                    });
                    topParentNodeSet.collapsed(true);
                }


                activeNodeSet.collapsed(false);

                this.iteratorIndex(0);


                this.view("labels").empty();

                this.view("labels").items(items.reverse());


                this.view("arrows").empty();

//                var arrows = [];
//
//                for (var i = 1; i < items.length; i++) {
//                    arrows.push({x: i * 120});
//                }
//
//                this.view("arrows").items(arrows);
//
                this.draw();

                this.activeNodeSet(activeNodeSet);


            },

            draw: function () {

                var nodeSet = this.nodeSet();

                var topo = this.topology();
                var stage = topo.stage();
                var translateX = stage.translateX(), translateY = stage.translateY();

                var gap = 10;
                var nodes = nodeSet.getVisibleNodes();

                var firstItem = nodes[0];


                var bound = firstItem.getBound();


                var minX = bound.left,
                    maxX = bound.left + bound.width,
                    minY = bound.top,
                    maxY = bound.top + bound.height;


                nx.each(nodes, function (node) {
                    bound = node.getBound();
                    minX = Math.min(minX, bound.left);
                    maxX = Math.max(maxX, bound.left + bound.width);
                    minY = Math.min(minY, bound.top);
                    maxY = Math.max(maxY, bound.top + bound.height);
                });

                this.view().set("translateX", minX - translateX - gap);
                this.view().set("translateY", minY - translateY - gap);


                this.view("rect").set("width", maxX - minX + gap * 2);

                this.view("rect").set("height", maxY - minY + gap * 2);

            },


            _mousedown: function (sender, event) {
                var model = sender.graph();
                var nodeSet = model.nodeSet;
                nodeSet.collapse();

                event.stop();
            }
        }

    });


    nx.graphic.define("nx.graphic.Topology.AggregationLayer", nx.graphic.Topology.Layer, {
        events: ['openAggregatedGroup', 'closeAggregatedGroup'],

        properties: {
            nodeSetItemMap: {
                value: function () {
                    return {};
                }
            }
        },
        methods: {
            draw: function () {

                this.nodeSetItemMap({});

                var topo = this.topology();
                topo.on("updating", this._draw, this);
                topo.on("zoomend", this._draw, this);
            },
            openItem: function (inNodeSet) {

                var nodeSetItemMap = this.nodeSetItemMap();

                var parentNodeSet = inNodeSet.parentNodeSet();

                var topParentNodeSet = inNodeSet.getTopParentNodeSet();
                var parentNodeSetItem;

                // nodeset has no parent node or nodest root parent item not created

                if ((!parentNodeSet && !nodeSetItemMap[inNodeSet.id()]) || (topParentNodeSet && nodeSetItemMap[topParentNodeSet.id()] === null)) {
                    var rootNode = topParentNodeSet || inNodeSet;
                    parentNodeSetItem = new nx.graphic.Topology.AggregationItem({
                        nodeSet: rootNode,
                        topology: this.topology()
                    });

                    this.appendChild(parentNodeSetItem);
                    nodeSetItemMap[rootNode.id()] = parentNodeSetItem;
                } else {
                    parentNodeSetItem = topParentNodeSet ? nodeSetItemMap[topParentNodeSet.id()] : nodeSetItemMap[inNodeSet.id()]
                }


                parentNodeSetItem.update(inNodeSet);

                this.fire("openAggregatedGroup");

            },
            closeItem: function (inNodeSet) {

                var nodeSetItemMap = this.nodeSetItemMap();
                var id = inNodeSet.graph().id();
                if (nodeSetItemMap[id]) {
                    nodeSetItemMap[id].destroy();
                    delete nodeSetItemMap[id];

                } else {
                    inNodeSet.parentNodeSet().expand();
                }

                this.fire("closeAggregatedGroup");
            },

            _draw: function () {
                nx.each(this.nodeSetItemMap(), function (item) {

                    item.draw();

                }, this);
            },
            clear: function () {

                nx.each(this.nodeSetItemMap(), function (item) {

                    item.destroy();

                }, this);

                this.nodeSetItemMap({});
                var topo = this.topology();
                topo.off("updating", this._draw, this);
                topo.off("zoomend", this._draw, this);

                this.inherited();
            }
        }



    });
})(nx, nx.global);