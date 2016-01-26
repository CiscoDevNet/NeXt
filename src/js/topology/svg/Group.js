(function (nx, global) {

    /**
     * SVG group component
     * @class nx.graphic.Group
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Group", nx.graphic.Component, {
        properties: {
            'data-id': {
                set: function (value) {
                    nx.each(this.content(), function (item) {
                        item.set('data-id', value);
                    });
                    this.view().set('data-id', value);
                    this['_data-id'] = value;
                }
            }
        },
        view: {
            tag: 'svg:g'
        },
        methods: {
            move: function (x, y) {
                var translate = this.translate();
                this.setTransform(x + translate.x, y + translate.y);
            }
        }
    });
})(nx, nx.global);