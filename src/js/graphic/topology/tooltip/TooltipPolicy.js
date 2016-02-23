(function (nx, global) {
    /**
     * Topology tooltip policy
     * @class nx.graphic.Topology.TooltipPolicy
     */

    nx.define("nx.graphic.Topology.TooltipPolicy", {
        events: [],
        properties: {
            topology: {},
            tooltipManager: {}
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);
                this._tm = this.tooltipManager();
            },
            pressStage: function () {
                this._tm.closeAll();
            },
            zoomstart: function () {
                this._tm.closeAll();
            },
            clickNode: function (node) {
                this._tm.openNodeTooltip(node);
            },
            clickLinkSetNumber: function (linkSet) {
                this._tm.openLinkSetTooltip(linkSet);
            },
            dragStageStart: function () {
                this._tm.closeAll();
            },
            clickLink: function (link) {
                this._tm.openLinkTooltip(link);
            },
            resizeStage: function () {
                this._tm.closeAll();
            },
            fitStage: function () {
                this._tm.closeAll();
            },
            deleteNode: function () {
                this._tm.closeAll();
            },
            deleteNodeSet: function () {
                this._tm.closeAll();
            }
        }
    });

})(nx, nx.global);