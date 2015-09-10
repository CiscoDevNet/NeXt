(function (nx, global) {
    /**
     * Force layout processor
     * @class nx.data.ObservableGraph.QuickProcessor
     * @module nx.data
     */
    nx.define("nx.data.ObservableGraph.QuickProcessor", {
        methods: {
            process: function (data, key, model) {
                nx.each(data.nodes, function (node) {
                    node.x = Math.floor(Math.random() * model.width());
                    node.y = Math.floor(Math.random() * model.height());
//                    node.x = Math.floor(Math.random() * 100);
//                    node.y = Math.floor(Math.random() * 100);
                });
                return data;
            }
        }
    });

})(nx, nx.global);