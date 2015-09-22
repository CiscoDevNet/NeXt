(function (nx, global, logger) {
    /**
     * Force layout processor
     * @class nx.data.ObservableGraph.NeXtForceProcessor
     * @module nx.data
     */
    nx.define("nx.data.ObservableGraph.NeXtForceProcessor", {
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

                var _data = {nodes: data.nodes, links: []};
                var nodeIndexMap = {};
                nx.each(data.nodes, function (node, index) {
                    nodeIndexMap[node[key]] = index;
                });

                _data.links = [];
                nx.each(data.links, function (link) {
                    if (!nx.is(link.source, 'Object') && nodeIndexMap[link.source] !== undefined && !nx.is(link.target, 'Object') && nodeIndexMap[link.target] !== undefined) {
                        _data.links.push({
                            source: nodeIndexMap[link.source],
                            target: nodeIndexMap[link.target]
                        });
                    }
                });

                // force
                var force = new nx.data.NextForce();
                force.setData(data);
                console.log(_data.nodes.length);
                if (_data.nodes.length < 50) {
                    while (true) {
                        force.tick();
                        if (force.maxEnergy < _data.nodes.length * 0.1) {
                            break;
                        }
                    }
                } else {
                    var step = 0;
                    while (++step < 900) {
                        force.tick();
                    }
                }

                console.log(force.maxEnergy);

                return data;
            }
        }
    });

})(nx, nx.global, nx.logger);