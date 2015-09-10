(function (nx, global) {

    /**
     * Zoom by selection scene
     * @class nx.graphic.Topology.ZoomBySelection
     * @extend nx.graphic.Topology.SelectionScene
     */
    nx.define("nx.graphic.Topology.ZoomBySelection", nx.graphic.Topology.SelectionScene, {
        events: ['finish'],
        properties: {
        },
        methods: {
            activate: function (args) {
                this.inherited(args);
                nx.dom.Document.html().addClass('n-zoomInCursor');
            },
            deactivate: function () {
                this.inherited();
                nx.dom.Document.html().removeClass('n-zoomInCursor');
            },
            dragStageEnd: function (sender, event) {
                var bound = this.rect.getBound();
                this.inherited(sender, event);

                this.fire('finish', bound);
            },
            esc: function () {
                this.fire('finish');
            }
        }
    });


})(nx, nx.global);