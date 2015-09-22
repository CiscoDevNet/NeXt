(function (nx, global) {

    /**
     * Basic scene class
     * @class nx.graphic.Topology.Scene
     * @extend nx.data.ObservableObject
     */
    nx.define("nx.graphic.Topology.Scene", nx.data.ObservableObject, {
        properties: {
            topology: {
                value: null
            }
        },
        methods: {
            init: function (args) {
                this.sets(args);
            },
            /**
             * Factory function ,entry of a scene
             * @method activate
             */
            activate: function () {

            },
            /**
             * Deactivate a scene
             * @method deactivate
             */
            deactivate: function () {

            }
        }
    });

})(nx, nx.global);