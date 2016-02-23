(function (nx, global) {


    /**
     * Selection scene
     * @class nx.graphic.Topology.SelectionScene
     * @extend nx.graphic.Topology.Scene
     */
    nx.define("nx.graphic.Topology.SelectionScene", nx.graphic.Topology.DefaultScene, {
        methods: {
            /**
             * Entry
             * @method activate
             */

            activate: function (args) {
                this.appendRect();
                this.inherited(args);
                this.topology().dom().addClass('n-crosshairCursor');

            },
            deactivate: function () {
                this.inherited();
                this.rect.dispose();
                delete this.rect;
                this.topology().dom().removeClass('n-crosshairCursor');
                nx.dom.Document.html().removeClass('n-crosshairCursor');
            },
            _dispatch: function (eventName, sender, data) {
                if (this[eventName]) {
                    this[eventName].call(this, sender, data);
                }
            },
            appendRect: function () {
                var topo = this.topology();
                if (!this.rect) {
                    this.rect = new nx.graphic.Rect({
                        'class': 'selectionRect'
                    });
                    this.rect.attach(topo.stage().staticLayer());
                }
                this.rect.sets({
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                });
            },
            dragStageStart: function (sender, event) {
                this.rect.set('visible', true);
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-crosshairCursor');
            },
            dragStage: function (sender, event) {
                var rect = this.rect;
                var origin = event.drag.origin;
                var size = event.drag.offset;
                // check if width negative
                if (size[0] < 0) {
                    rect.set('x', origin[0] + size[0]);
                    rect.set('width', -size[0]);
                } else {
                    rect.set('x', origin[0]);
                    rect.set('width', size[0]);
                }
                if (size[1] < 0) {
                    rect.set('y', origin[1] + size[1]);
                    rect.set('height', -size[1]);
                } else {
                    rect.set('y', origin[1]);
                    rect.set('height', size[1]);
                }
            },
            dragStageEnd: function (sender, event) {
                this._stageTranslate = null;
                this.rect.set('visible', false);
                this._blockEvent(false);
                nx.dom.Document.html().removeClass('n-crosshairCursor');
            },
            _getRectBound: function () {
                var rectbound = this.rect.getBoundingClientRect();
                var topoBound = this.topology().getBound();
                return {
                    top: rectbound.top - topoBound.top,
                    left: rectbound.left - topoBound.left,
                    width: rectbound.width,
                    height: rectbound.height,
                    bottom: rectbound.bottom - topoBound.top,
                    right: rectbound.right - topoBound.left
                };
            },
            esc: {

            },
            clickNodeSet: function (sender, nodeSet) {},
            dragNode: function () {

            },
            dragNodeSet: function () {

            },
            _blockEvent: function (value) {
                if (value) {
                    this.topology().scalable(false);
                    nx.dom.Document.body().addClass('n-userselect n-blockEvent');
                } else {
                    this.topology().scalable(true);
                    nx.dom.Document.body().removeClass('n-userselect');
                    nx.dom.Document.body().removeClass('n-blockEvent');
                }
            }
        }
    });


})(nx, nx.global);
