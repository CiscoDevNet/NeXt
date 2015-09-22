(function (nx) {

    var Collection = nx.data.Collection;
    /**
     * Dom Fragment
     * @class nx.dom.Fragment
     * @namespace nx.ui
     * @extend nx.dom.Node
     * @module nx.ui
     * @constructor
     */
    nx.define('nx.dom.Fragment', nx.dom.Node, {
        methods: {
            /**
             * Get collection child nodes.
             * @returns {nx.data.Collection}
             */
            children: function () {
                var result = new Collection();
                nx.each(this.$dom.childNodes, function (child) {
                    result.add(new this.constructor(child));
                }, this);
                return result;
            }
        }
    });
})(nx);