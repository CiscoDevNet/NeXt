(function (nx) {
    var Iterable = nx.Iterable;

    var DictionaryItem = nx.define({
        properties: {
            key: {},
            value: {
                set: function (value) {
                    if (this._dict) {
                        this._dict.setItem(this._key, value);
                    } else {
                        this._value = value;
                    }
                }
            }
        },
        methods: {
            init: function (dict, key) {
                this._dict = dict;
                this._key = key;
            }
        }
    });

    var KeyIterator = nx.define(Iterable, {
        methods: {
            init: function (dict) {
                this._dict = dict;
            },
            each: function (callback, context) {
                this._dict.each(function (item) {
                    callback.call(context, item.key());
                });
            }
        }
    });

    var ValueIterator = nx.define(Iterable, {
        methods: {
            init: function (dict) {
                this._dict = dict;
            },
            each: function (callback, context) {
                this._dict.each(function (item) {
                    callback.call(context, item.value());
                });
            }
        }
    });

    /**
     * @class Dictionary
     * @namespace nx.data
     * @extends nx.Iterable
     * @constructor
     * @param dict
     */
    var Dictionary = nx.define('nx.data.Dictionary', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this._items.length;
                }
            },
            /**
             * @property keys
             * @type {Iterable}
             */
            keys: {
                get: function () {
                    return this._keys;
                }
            },
            /**
             * @property values
             * @type {Iterable}
             */
            values: {
                get: function () {
                    return this._values;
                }
            }
        },
        methods: {
            init: function (dict) {
                var map = this._map = {};
                var items = this._items = [];
                this.setItems(dict);
                this._keys = new KeyIterator(this);
                this._values = new ValueIterator(this);
            },
            /**
             * @method contains
             * @param key {String}
             * @returns {Boolean}
             */
            contains: function (key) {
                return key in this._map;
            },
            /**
             * @method getItem
             * @param key {String}
             * @returns {*}
             */
            getItem: function (key) {
                var item = this._map[key];
                return item && item._value;
            },
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function (key, value) {
                var item = this._map[key];
                if (!item) {
                    item = this._map[key] = new DictionaryItem(this, '' + key);
                    this._items.push(item);
                }
                item._value = value;
                return item;
            },
            /**
             * @method setItems
             * @param dict {Dictionary|Object}
             */
            setItems: function (dict) {
                if (dict) {
                    nx.each(dict, function (value, key) {
                        this.setItem(key, value);
                    }, this);
                }
            },
            /**
             * @method removeItem
             * @param key {String}
             */
            removeItem: function (key) {
                var map = this._map;
                if (!(key in map)) {
                    return;
                }
                var item = map[key];
                var idx = this._items.indexOf(item);
                delete map[key];
                if (idx >= 0) {
                    this._items.splice(idx, 1);
                }
                item._dict = null;
                return item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this._items.slice();
                this._map = {};
                this._items = [];
                nx.each(items, function (item) {
                    item._dict = null;
                });
                return items;
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function (callback, context) {
                context = context || this;
                nx.each(this._map, function (item, key) {
                    callback.call(context, item, key);
                });
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                return this._items.slice();
            },
            /**
             * @method toObject
             * @returns {Object}
             */
            toObject: function () {
                var result = {};
                this.each(function (item) {
                    result[item.key()] = item.value();
                });
                return result;
            }
        }
    });
})(nx);
