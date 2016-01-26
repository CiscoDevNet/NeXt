(function (nx, global) {
    /**
     * Basic tooltip class for topology
     * @class nx.graphic.Topology.Tooltip
     * @extend nx.ui.Popover
     */
    nx.define("nx.graphic.Topology.Tooltip", nx.ui.Popover, {
        properties: {
            /**
             * Lazy closing a tooltip
             * @type Boolean
             * @property lazyClose
             */
            lazyClose: {
                value: false
            },
            /**
             * Pin a tooltip
             * @type Boolean
             * @property pin
             */
            pin: {
                value: false
            },
            /**
             * Is tooltip response to resize event
             * @type Boolean
             * @property listenWindow
             */
            listenWindow: {
                value: true
            }
        }
    });
})(nx, nx.global);