(function (nx, global) {

    /**
     * Base path class.
     * @class nx.graphic.Topology.BasePath
     * @extend nx.graphic.BasePath
     * @module nx.graphic.Topology
     */

    nx.define("nx.graphic.Topology.BasePath", nx.graphic.Component, {
        events: [],
        properties: {
            /**
             * nodes to over path
             * @property nodes
             */
            nodes: {},
            /**
             * path 'd' generator function
             * @property pathGenerator
             */
            pathGenerator: {
                value: function () {
                    return function () {

                    };
                }
            },
            /**
             * path style object
             * @property path style
             *
             */
            pathStyle: {
                value: function () {
                    return {
                        'stroke': '#666',
                        'stroke-width': 2,
                        fill: 'none'
                    };
                }
            },
            /**
             * topology reference
             * @property topology
             */
            topology: {}
        },
        view: {
            type: 'nx.graphic.Group',
            content: {
                name: 'path',
                type: 'nx.graphic.Path',
                props: {

                }
            }
        },
        methods: {
            attach: function (parent) {
                this.inherited(parent);
                var watcher = this._nodesWatcher = new nx.graphic.Topology.NodeWatcher();
                watcher.observePosition(true);
                watcher.topology(this.topology());
                watcher.updater(this._draw.bind(this));
                watcher.nodes(this.nodes());

                //watcher
                this.view("path").dom().setStyles(this.pathStyle());
            },
            _draw: function () {
                var pathEL = this.view('path');
                var nodes = this._nodesWatcher.getNodes();
                if (nodes.length == this.nodes().length) {
                    var topo = this.topology();
                    var pathStyle = this.pathStyle();
                    var d = this.pathGenerator().call(this);
                    if (d) {
                        pathEL.set('d', d);
                        pathEL.visible(true);
                        var strokeWidth = parseInt(pathStyle['stroke-width'], 10) || 1;
                        pathEL.dom().setStyle('stroke-width', strokeWidth * topo.stageScale());
                    }
                } else {
                    pathEL.visible(false);
                }


            },
            draw: function () {
                this._draw();
            }
        }
    });
})(nx, nx.global);