(function (nx, global) {

    /**
     * Tooltip mixin class
     * @class nx.graphic.Topology.TooltipMixin
     *
     */

    nx.define("nx.graphic.Topology.TooltipMixin", {
        events: [],
        properties: {
            /**
             * Set/get the tooltip manager config
             * @property tooltipManagerConfig
             */
            tooltipManagerConfig: {
                get: function () {
                    return this._tooltipManagerConfig || {};
                },
                set: function (value) {
                    var tooltipManager = this.tooltipManager();
                    if (tooltipManager) {
                        tooltipManager.sets(value);
                    }
                    this._tooltipManagerConfig = value;
                }
            },
            /**
             * get tooltip manager
             * @property tooltipManager
             */
            tooltipManager: {
                value: function () {
                    var config = this.tooltipManagerConfig();
                    return new nx.graphic.Topology.TooltipManager(nx.extend({}, {topology: this}, config));
                }
            }
        },
        methods: {

        }
    });


})(nx, nx.global);