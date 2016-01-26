(function (nx) {

    /**
     * @class ObservableObject
     * @namespace nx.data
     * @extends nx.Observable
     */
    nx.define('nx.data.ObservableObject', nx.Observable, {
        methods: {
            init: function (data) {
                this.inherited();
                this._data = data || {};
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function () {
                this.inherited();
                this._data = null;
            },
            /**
             * Check whether current object has specified property.
             * @method has
             * @param name {String}
             * @returns {Boolean}
             */
            has: function (name) {
                var member = this[name];
                return (member && member.__type__ == 'property') || (name in this._data);
            },
            /**
             * Get specified property value.
             * @method get
             * @param name {String}
             * @returns {*}
             */
            get: function (name) {
                var member = this[name];
                if (member === undefined) {
                    return this._data[name];
                }
                else if (member.__type__ == 'property') {
                    return member.call(this);
                }
            },
            /**
             * Set specified property value.
             * @method set
             * @param name {String}
             * @param value {*}
             */
            set: function (name, value) {
                var member = this[name];
                if (member === undefined) {
                    if (this._data[name] !== value) {
                        this._data[name] = value;
                        this.notify(name);
                        return true;
                    }
                }
                else if (member.__type__ == 'property') {
                    return member.call(this, value);
                }
            },
            /**
             * Get all properties.
             * @method gets
             * @returns {Object}
             */
            gets: function () {
                var result = nx.clone(this._data);
                nx.each(this.__properties__, function (name) {
                    result[name] = this.get(name);
                }, this);

                return result;
            }
        }
    });
})(nx);