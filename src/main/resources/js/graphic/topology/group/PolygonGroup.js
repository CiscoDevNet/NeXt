(function (nx, global) {


    /**
     * Polygon shape group class
     * @class nx.graphic.Topology.PolygonGroup
     * @extend nx.graphic.Topology.GroupItem
     * @module nx.graphic.Topology
     *
     */

    nx.define('nx.graphic.Topology.PolygonGroup', nx.graphic.Topology.GroupItem, {
        events: ['dragGroupStart', 'dragGroup', 'dragGroupEnd', 'clickGroupLabel', 'enterGroup', 'leaveGroup'],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group'
            },
            content: [
                {
                    name: 'shape',
                    type: 'nx.graphic.Polygon',
                    props: {
                        'class': 'bg'
                    },
                    events: {
                        'mousedown': '{#_mousedown}',
                        'dragstart': '{#_dragstart}',
                        'dragmove': '{#_drag}',
                        'dragend': '{#_dragend}'
                    }
                },
                {
                    name: 'text',
                    type: 'nx.graphic.Group',
                    content: {
                        name: 'label',
                        type: 'nx.graphic.Text',
                        props: {
                            'class': 'nodeSetGroupLabel',
                            text: '{#label}',
                            style: {
                                'alignment-baseline': 'central',
                                'text-anchor': 'middle',
                                'font-size': 12
                            }
                        },
                        events: {
                            'click': '{#_clickLabel}'
                        }
                    }
                }
            ],
            events: {
                'mouseenter': '{#_mouseenter}',
                'mouseleave': '{#_mouseleave}'
            }
        },
        properties: {
            shape: {
                get: function () {
                    return this.view('shape');
                }
            }
        },
        methods: {

            draw: function () {

                this.inherited();
                this.setTransform(0, 0);


                var topo = this.topology();
                var stageScale = topo.stageScale();
                var revisionScale = topo.revisionScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };
                var vectorArray = [];
                nx.each(this.getNodes(), function (node) {
                    if (node.visible()) {
                        vectorArray.push({x: node.model().x(), y: node.model().y()});
                    }
                });
                var shape = this.view('shape');

                shape.sets({
                    fill: this.color()
                });
                shape.dom().setStyle('stroke', this.color());
                shape.dom().setStyle('stroke-width', 60 * stageScale * revisionScale);
                shape.nodes(vectorArray);


                var bound = topo.getInsideBound(shape.getBound());
                bound.left -= translate.x;
                bound.top -= translate.y;
                bound.left *= stageScale;
                bound.top *= stageScale;
                bound.width *= stageScale;
                bound.height *= stageScale;


                var text = this.view('text');
                text.setTransform(bound.left + bound.width / 2, bound.top - 40 * stageScale * revisionScale, stageScale);

                this.view('label').view().dom().setStyle('font-size', 11);

                text.view().dom().setStyle('fill', this.color());
            },
            _clickLabel: function (sender, event) {
                this.fire('clickGroupLabel');
            },
            _mousedown: function (sender, event) {
                event.captureDrag(this.view('shape'),this.topology().stage());
            },
            _dragstart: function (sender, event) {
                this.blockDrawing(true);
                this.fire('dragGroupStart', event);
            },
            _drag: function (sender, event) {
                this.fire('dragGroup', event);
            },
            _dragend: function (sender, event) {
                this.blockDrawing(false);
                this.fire('dragGroupEnd', event);
            }
        }
    });


})(nx, nx.global);