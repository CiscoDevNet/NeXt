(function (nx, global) {

    var DataProcessor = nx.define("nx.data.ObservableGraph.DataProcessor", {
        statics: {
            dataProcessor: {
                'nextforce': new nx.data.ObservableGraph.NeXtForceProcessor(),
                'force': new nx.data.ObservableGraph.ForceProcessor(),
                'quick': new nx.data.ObservableGraph.QuickProcessor()
            },
            /**
             * Register graph data processor,
             * @static
             * @method registerDataProcessor
             * @param {String} name data processor name
             * @param {Object} cls processor instance, instance should have a process method
             */
            registerDataProcessor: function (name, cls) {
                GRAPH.dataProcessor[name] = cls;
            }
        },
        properties: {
            /**
             * Set pre data processor,it could be 'force'/'quick'
             * @property dataProcessor
             * @default undefined
             */
            dataProcessor: {},
            width: {
                value: 100
            },
            height: {
                value: 100
            }
        },
        methods: {
            processData: function (data) {
                var identityKey = this._identityKey;
                var dataProcessor = this._dataProcessor;

                //TODO data validation

                if (dataProcessor) {
                    var processor = DataProcessor.dataProcessor[dataProcessor];
                    if (processor) {
                        return processor.process(data, identityKey, this);
                    } else {
                        return data;
                    }
                } else {
                    return data;
                }
            }
        }
    });

})(nx, nx.global);