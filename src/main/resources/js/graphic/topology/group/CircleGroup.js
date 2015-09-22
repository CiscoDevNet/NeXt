(function (nx, global) {
    /**
     * Circle shape group class
     * @class nx.graphic.Topology.CircleGroup
     * @extend nx.graphic.Topology.GroupItem
     * @module nx.graphic.Topology
     *
     */
    nx.define('nx.graphic.Topology.CircleGroup', nx.graphic.Topology.GroupItem, {
        events: ['dragGroupStart', 'dragGroup', 'dragGroupEnd', 'clickGroupLabel', 'enterGroup', 'leaveGroup'],
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'group'
            },
            content: [
                {
                    name: 'shape',
                    type: 'nx.graphic.Circle',
                    props: {
                        'class': 'bg'
                    },
                    events: {
                        'mousedown': '{#_mousedown}',
                        'touchstart': '{#_mousedown}',
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
        methods: {

            draw: function () {


                this.inherited();
                this.setTransform(0, 0);

                var topo = this.topology();
                var revisionScale = topo.revisionScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };
                var bound = topo.getBoundByNodes(this.getNodes());
                if (bound === null) {
                    return;
                }
                var radius = Math.sqrt(Math.pow(bound.width / 2, 2) + Math.pow(bound.height / 2, 2));

                var shape = this.view('shape');
                shape.sets({
                    cx: bound.left - translate.x + bound.width / 2,
                    cy: bound.top - translate.y + bound.height / 2,
                    r: radius,
                    fill: this.color(),
                    stroke: this.color(),
                    scale: topo.stageScale()
                });


                var text = this.view('text');
                var stageScale = topo.stageScale();
                bound.left -= translate.x;
                bound.top -= translate.y;

                text.setTransform((bound.left + bound.width / 2) * stageScale, (bound.top + bound.height / 2 - radius - 12) * stageScale, stageScale);
                text.view().dom().setStyle('fill', this.color());

                this.view('label').view().dom().setStyle('font-size', 11);


                this.setTransform(0, 0);
            },
            _clickLabel: function (sender, event) {
                this.fire('clickGroupLabel');
            },
            _mousedown: function (sender, event) {
                event.captureDrag(this.view('shape'), this.topology().stage());
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