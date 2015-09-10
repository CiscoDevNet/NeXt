(function (nx, global) {
    var util = nx.util;
    /**
     * Path layer class
     Could use topo.getLayer("pathLayer") get this
     * @class nx.graphic.Topology.PathLayer
     * @extend nx.graphic.Topology.Layer
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.PathLayer", nx.graphic.Topology.Layer, {
        properties: {

            /**
             * Path array
             * @property paths
             */
            paths: {
                value: function () {
                    return [];
                }
            }
        },
        methods: {
            attach: function (args) {
                this.attach.__super__.apply(this, arguments);
                var topo = this.topology();
                topo.on('zoomend', this._draw, this);
                topo.watch('revisionScale', this._draw, this);

            },
            _draw: function () {
                nx.each(this.paths(), function (path) {
                    path.draw();
                });
            },
            /**
             * Add a path to topology
             * @param path {nx.graphic.Topology.Path}
             * @method addPath
             */
            addPath: function (path) {
                this.paths().push(path);
                path.topology(this.topology());
                path.attach(this);
                path.draw();
            },
            /**
             * Remove a path
             * @method removePath
             * @param path
             */
            removePath: function (path) {
                this.paths().splice(this.paths().indexOf(path), 1);
                path.dispose();
            },
            clear: function () {
                nx.each(this.paths(), function (path) {
                    path.dispose();
                });
                this.paths([]);
                this.inherited();
            },
            dispose: function () {
                this.clear();
                var topo = this.topology();
                topo.off('zoomend', this._draw, this);
                topo.unwatch('revisionScale', this._draw, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);
