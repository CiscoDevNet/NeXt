(function (nx) {
    /**
     * @class Serializable
     * @namespace nx
     */
    var Serializable = nx.define('nx.Serializable', {
        methods: {
            /**
             * @method serialize
             * @returns {any}
             */
            serialize: function () {
                var result = {};
                nx.each(this.__properties__, function (name) {
                    var prop = this[name];
                    var value = prop.call(this);

                    if (prop.getMeta('serializable') !== false) {
                        if (nx.is(value, Serializable)) {
                            result[name] = value.serialize();
                        }
                        else {
                            result[name] = value;
                        }
                    }
                }, this);

                return result;
            }
        }
    });
})(nx);