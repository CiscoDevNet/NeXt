(function (nx,global) {
    /**
     * SVG path component
     * @class nx.graphic.Path
     * @extend nx.graphic.Component
     * @module nx.graphic
     */

    nx.define("nx.graphic.Path", nx.graphic.Component, {
        view: {
            tag: 'svg:path'
        }
    });
})(nx, nx.global);