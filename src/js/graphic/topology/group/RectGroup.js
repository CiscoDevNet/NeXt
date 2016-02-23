(function (nx, global) {

    /**
     * Rectangle shape group class
     * @class nx.graphic.Topology.RectGroup
     * @extend nx.graphic.Topology.GroupItem
     * @module nx.graphic.Topology.Group
     *
     */


    nx.define('nx.graphic.Topology.RectGroup', nx.graphic.Topology.GroupItem, {
        events: ['dragGroupStart', 'dragGroup', 'dragGroupEnd', 'clickGroupLabel', 'enterGroup', 'leaveGroup'],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group'
            },
            content: [
                {
                    name: 'shape',
                    type: 'nx.graphic.Rect',
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
                            'class': 'groupLabel',
                            text: '{#label}'
                        },
                        events: {
                            'click': '{#_clickLabel}'
                        }
                    }
                }
            ]
        },
        properties: {
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
                var bound = topo.getBoundByNodes(this.getNodes());
                if (bound == null) {
                    return;
                }
                bound.left -= translate.x;
                bound.top -= translate.y;
                var shape = this.view('shape');
                shape.sets({
                    x: bound.left,
                    y: bound.top,
                    width: bound.width,
                    height: bound.height,
                    fill: this.color(),
                    stroke: this.color(),
                    scale: topo.stageScale()
                });


                var text = this.view('text');


                text.setTransform((bound.left + bound.width / 2) * stageScale, (bound.top - 12) * stageScale, stageScale);
                text.view().dom().setStyle('fill', this.color());

                this.view('label').view().dom().setStyle('font-size', 11);
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