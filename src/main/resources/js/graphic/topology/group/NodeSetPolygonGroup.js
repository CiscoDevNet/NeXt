(function(nx, global) {


    /**
     * Polygon shape group class
     * @class nx.graphic.Topology.PolygonGroup
     * @extend nx.graphic.Topology.GroupItem
     * @module nx.graphic.Topology
     *
     */

    nx.define('nx.graphic.Topology.NodeSetPolygonGroup', nx.graphic.Topology.GroupItem, {
        events: ['dragGroupStart', 'dragGroup', 'dragGroupEnd', 'clickGroupLabel', 'enterGroup', 'leaveGroup', 'collapseNodeSetGroup'],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group aggregationGroup'
            },
            content: [{
                    name: 'shape',
                    type: 'nx.graphic.Polygon',
                    props: {
                        'class': 'bg'
                    }
                }, {
                    name: 'icons',
                    type: 'nx.graphic.Group',
                    content: [{
                        name: 'minus',
                        type: 'nx.graphic.Group',
                        content: {
                            name: 'minusIcon',
                            type: 'nx.graphic.Icon',
                            props: {
                                iconType: 'collapse'
                            }
                        },
                        events: {
                            'click': '{#_collapse}'
                        }
                    }, {
                        name: 'nodeIcon',
                        type: 'nx.graphic.Group',
                        content: {
                            name: 'nodeIconImg',
                            type: 'nx.graphic.Icon',
                            props: {
                                iconType: 'nodeSet',
                                scale: 1
                            }
                        }
                    }, {
                        name: 'labelContainer',
                        type: 'nx.graphic.Group',
                        content: {
                            name: 'label',
                            type: 'nx.graphic.Text',
                            props: {
                                'class': 'nodeSetGroupLabel',
                                text: '{#label}',
                                style: {
                                    'alignment-baseline': 'central',
                                    'text-anchor': 'start',
                                    'font-size': 12
                                },
                                visible: false
                            },
                            events: {
                                'click': '{#_clickLabel}'
                            }
                        },
                        events: {

                        }
                    }],
                    events: {
                        'mouseenter': '{#_mouseenter}',
                        'mouseleave': '{#_mouseleave}',
                        'mousedown': '{#_mousedown}',
                        'touchstart': '{#_mousedown}',
                        'dragstart': '{#_dragstart}',
                        'dragmove': '{#_drag}',
                        'dragend': '{#_dragend}'
                    }
                },
                //                {
                //                    name: 'bg',
                //                    type: 'nx.graphic.Rect',
                //                    props: {
                //                        fill: '#f00',
                //                        'opacity': '0.1'
                //                    }
                //                }

            ]
        },
        properties: {
            nodeSet: {},
            topology: {},
            opacity: {
                set: function(value) {
                    var opacity = Math.max(value, 0.1);
                    //                    this.view('shape').dom().setStyle('opacity', opacity);
                    //                    this.view('minus').dom().setStyle('opacity', opacity);
                    //                    this.view('nodeIcon').dom().setStyle('opacity', opacity);
                    //                    this.view('labelContainer').dom().setStyle('opacity', opacity);
                    this._opacity = value;
                }
            },
            shape: {
                get: function() {
                    return this.view('shape');
                }
            }
            //            color: {
            //                set: function (value) {
            //                    var text = this.view('labelContainer');
            //                    text.view().dom().setStyle('fill', value);
            //                    var shape = this.view('shape');
            //                    shape.sets({
            //                        fill: value
            //                    });
            //                    shape.dom().setStyle('stroke', value);
            //                    this._color = value;
            //                }
            //            }
        },
        methods: {
            getNodes: function() {
                return nx.util.values(this.nodeSet().nodes());
            },
            draw: function() {
                this.inherited();
                this.setTransform(0, 0);

                var topo = this.topology();
                var stageScale = topo.stageScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };


                var vectorArray = [];
                nx.each(this.getNodes(), function(node) {
                    if (node.visible()) {
                        vectorArray.push({
                            x: node.model().x(),
                            y: node.model().y()
                        });
                    }
                });
                var shape = this.view('shape');
                //                shape.sets({
                //                    fill: this.color()
                //                });
                //                shape.dom().setStyle('stroke', this.color());
                //
                shape.nodes(vectorArray);

                var bound = topo.getInsideBound(shape.getBound());
                bound.left -= translate.x;
                bound.top -= translate.y;
                bound.left *= stageScale;
                bound.top *= stageScale;
                bound.width *= stageScale;
                bound.height *= stageScale;

                //                this.view('bg').sets({
                //                    x: bound.left,
                //                    y: bound.top,
                //                    width: bound.width,
                //                    height: bound.height
                //                });

                var minus = this.view('minus');
                var label = this.view('label');
                var nodeIcon = this.view('nodeIcon');
                var nodeIconImg = this.view('nodeIconImg');
                var labelContainer = this.view('labelContainer');


                if (topo.showIcon() && topo.revisionScale() > 0.6) {

                    shape.dom().setStyle('stroke-width', 60 * stageScale);


                    nodeIconImg.set('iconType', this.nodeSet().iconType());
                    //                    nodeIconImg.set('color', this.color());

                    var iconSize = nodeIconImg.size();

                    nodeIcon.visible(true);

                    if (nx.util.isFirefox()) {
                        minus.setTransform(bound.left + bound.width / 2, bound.top - iconSize.height * stageScale / 2 + 8 * stageScale, 1 * stageScale);
                        nodeIcon.setTransform(bound.left + bound.width / 2 + 3 * stageScale + iconSize.width * stageScale / 2, bound.top - iconSize.height * stageScale / 2 - 0 * stageScale, 0.5 * stageScale);


                    } else {
                        minus.setTransform(bound.left + bound.width / 2, bound.top - iconSize.height * stageScale / 2 - 22 * stageScale, 1 * stageScale);
                        nodeIcon.setTransform(bound.left + bound.width / 2 + 3 * stageScale + iconSize.width * stageScale / 2, bound.top - iconSize.height * stageScale / 2 - 22 * stageScale, 0.5 * stageScale);
                    }




                    label.sets({
                        x: bound.left + bound.width / 2 - 3 * stageScale + iconSize.width * stageScale,
                        y: bound.top - iconSize.height * stageScale / 2 - 22 * stageScale
                    });
                    label.view().dom().setStyle('font-size', 16 * stageScale);
                    //                    labelContainer.view().dom().setStyle('fill', this.color());

                } else {

                    shape.dom().setStyle('stroke-width', 30 * stageScale);

                    if (nx.util.isFirefox()) {
                        minus.setTransform(bound.left + bound.width / 2, bound.top - 29 * stageScale / 2, stageScale);
                    } else {
                        minus.setTransform(bound.left + bound.width / 2, bound.top - 45 * stageScale / 2, stageScale);
                    }

                    nodeIcon.visible(false);

                    label.sets({
                        x: bound.left + bound.width / 2 + 12 * stageScale,
                        y: bound.top - 45 * stageScale / 2
                    });
                    label.view().dom().setStyle('font-size', 16 * stageScale);

                }


                //                this.view('minusIcon').color(this.color());

            },
            _clickLabel: function(sender, event) {
                this.fire('clickGroupLabel');
            },
            _mousedown: function(sender, event) {
                event.captureDrag(this.view('icons'), this.topology().stage());
            },
            _dragstart: function(sender, event) {
                this.blockDrawing(true);
                this.fire('dragGroupStart', event);
            },
            _drag: function(sender, event) {
                this.fire('dragGroup', event);
                if (!this.view('minus').dom().$dom.contains(event.srcElement)) {
                    this._dragMinusIcon = true;
                }
            },
            _dragend: function(sender, event) {
                this.blockDrawing(false);
                this.fire('dragGroupEnd', event);

            },
            _collapse: function() {
                if(!this._dragMinusIcon){
                    this.fire('collapseNodeSetGroup', event);
                }
                this._dragMinusIcon = false;
            },
            _mouseenter: function(sender, event) {
                this.fire('enterGroup');
            },
            _mouseleave: function(sender, event) {
                this.fire('leaveGroup');
            }
        }
    });


})(nx, nx.global);