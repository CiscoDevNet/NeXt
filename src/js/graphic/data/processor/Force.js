(function (nx, global, logger) {
    /**
     * Force layout processor
     * @class nx.data.ObservableGraph.ForceProcessor
     * @module nx.data
     */
    nx.define("nx.data.ObservableGraph.ForceProcessor", {
        methods: {
            /**
             * Process graph data
             * @param data {JSON} standard graph data
             * @param [key]
             * @param [model]
             * @returns {JSON} {JSON} standard graph data
             */
            process: function (data, key, model) {
                var forceStartDate = new Date();
                var _data;

                _data = {nodes: data.nodes, links: []};
                var nodeIndexMap = {};
                nx.each(data.nodes, function (node, index) {
                    nodeIndexMap[node[key]] = index;
                });


                // if source and target is not number, force will search node
                nx.each(data.links, function (link) {
                    if (!nx.is(link.source, 'Object') && nodeIndexMap[link.source] !== undefined && !nx.is(link.target, 'Object') && nodeIndexMap[link.target] !== undefined) {
                        if (key == 'ixd') {
                            _data.links.push({
                                source: link.source,
                                target: link.target
                            });
                        } else {
                            _data.links.push({
                                source: nodeIndexMap[link.source],
                                target: nodeIndexMap[link.target]
                            });
                        }

                    }
                });
                var force = new nx.data.Force();
                force.nodes(_data.nodes);
                force.links(_data.links);
                force.start();
                while (force.alpha()) {
                    force.tick();
                }
                force.stop();

                return data;
            }
        }
    });

})(nx, nx.global, nx.logger);