(function (nx) {

    /**
     * @class SortedMap
     * @namespace nx.data
     * @uses nx.Observable
     * @param data The initial data of SortedMap, which is an array of objects with properties "key" and "value".
     */
    nx.define('nx.data.SortedMap', {
        mixins: nx.Observable,
        events: ['change'],
        properties: {
            /**
             * The length of SortedMap.
             * @property length
             */
            length: {
                get: function () {
                    return this._data.length;
                }
            }
        },
        methods: {
            init: function (data) {
                data = data || [];
                var b = this.__validateData(data);
                if (b) {
                    this._data = data;
                    this._map = {};

                    //init _map
                    var self = this;
                    nx.each(data, function (item) {
                        var map = self._map;
                        map[item.key] = item;
                    });

                } else {
                    throw Error('init data are invalid!');
                }
            },
            /**
             * validate the init args
             * @param data
             * @returns {boolean}
             * @private
             */
            __validateData: function (data) {
                var b = true;
                if (!nx.is(data, 'Array')) {
                    b = false;
                } else {
                    nx.each(data, function (item) {
                        if (item.key === undefined || item.value === undefined) {
                            b = false;
                            return false;
                        }
                    });
                }

                return b;
            },
            /**
             * Add or insert an value with specified key and index.
             * @method add
             * @param key Specified key.
             * @param value (Optional) The value, default undefined.
             * @param index (Optional) Specified index, default append.
             * @return The created entry.
             */
            add: function (key, value, index) {
                var item = {
                    key: key,
                    value: value
                };
                this._map[key] = item;
                if (index === undefined) {
                    index = this._data.length;
                }
                this._data.splice(index, 0, item);
                this.notify('length');
                this.fire('change', {
                    action: "add",
                    index: index,
                    key: key,
                    value: value
                });
                return value;
            },
            /**
             * Remove value(s) from SortedMap by key(s).
             * @method remove
             * @param key The key of value attempt to be removed.
             * @return Removed value.
             */
            remove: function (key) {
                var value, item;

                item = this._map[key];
                if (item !== undefined) {
                    var idx = this._data.indexOf(item);
                    if (idx > -1) {
                        value = item.value;
                        this._data.splice(idx, 1);
                        delete this._map[key];
                        this.notify('length');
                        this.fire('change', {
                            action: "remove",
                            index: idx,
                            key: key,
                            value: value
                        });
                    } else {
                        throw 'key:"' + key + '" has been found in the _map but not exists in the _data!';
                    }
                }

                return value;
            },
            /**
             * Remove value from SortedMap by index.
             * @method removeAt
             * @param index The index of value attempt to be removed.
             * @return Removed value.
             */
            removeAt: function (index) {
                var value, item = this.__getItemAt(index);

                if (item !== undefined) {
                    value = item.value;
                    this._data.splice(index, 1);
                    delete this._map[item.key];
                    this.notify('length');
                    this.fire('change', {
                        action: "remove",
                        index: index,
                        key: item.key,
                        value: value
                    });
                }

                return value;
            },
            /**
             * get the item of this._data by index
             * @param index Support negative number
             * @returns {Object} item
             * @private
             */
            __getItemAt: function (index) {
                var item = this._data[index > -1 ? index : this._data.length + index];

                return item;
            },
            /**
             * Get the key at specified index.
             * @method getKeyAt
             * @param index The index.
             * @return The key, null if not exists.
             */
            getKeyAt: function (index) {
                var item = this.__getItemAt(index), key;
                if (item) {
                    key = item.key;
                }
                return key;
            },
            /**
             * Get the index of specified key.
             * @method indexOf
             * @param key The key.
             * @return The index, -1 if not exists.
             */
            indexOf: function (key) {
                var item = this._map[key], idx = -1;
                if (item !== undefined) {
                    idx = this._data.indexOf(item);
                }
                return idx;
            },
            /**
             * Get a value with specified key.
             * @method getValue
             * @param key The value's key.
             * @return The value.
             */
            getValue: function (key) {
                var item = this._map[key], value;
                if (item !== undefined) {
                    value = item.value;
                }
                return value;
            },
            /**
             * Change value of specified key.
             * @method setValue
             * @param key The key attempt to be changed.
             * @param value The new value.
             * @return The new value.
             */
            setValue: function (key, value) {
                var item = this._map[key];
                if (item !== undefined) {
                    var oldValue = item.value;
                    var idx = this._data.indexOf(item);
                    item.value = value;
                    this.fire('change', {
                        action: "set",
                        index: idx,
                        key: key,
                        value: value,
                        oldValue: oldValue
                    });
                } else {
                    throw Error('the key:"' + key + '" dos not exists!');
                }

                return value;
            },
            /**
             * Get a value with speicifed index.
             * @method getValueAt
             * @param index The value's index.
             * @return The value.
             */
            getValueAt: function (index) {
                var value, item = this.__getItemAt(index);

                if (item !== undefined) {
                    value = item.value;
                }

                return value;
            },
            /**
             * Change value of speicifed index.
             * @method setValueAt
             * @param index The index attempt to be changed.
             * @param value The new value.
             * @return The new value.
             */
            setValueAt: function (index, value) {
                var item = this.__getItemAt(index);
                if (item !== undefined) {
                    var oldValue = item.value;
                    item.value = value;
                    this.fire('change', {
                        action: "set",
                        index: index,
                        key: item.key,
                        value: value,
                        oldValue: oldValue
                    });
                }
                return value;
            },
            /**
             * change the order of specific Item by key
             * @param key
             * @param index
             */
            setIndex: function (key, index) {
                var idx = this.indexOf(key), result = true;
                if (idx != -1 && index !== idx) {
                    var rtn = this._data.splice(idx, 1);
                    this._data.splice(index, 0, rtn[0]);
                    this.fire('change', {
                        action: 'reorder',
                        index: index,
                        oldIndex: idx,
                        key: key
                    });
                } else {
                    result = false;
                }

                return result;
            },
            /**
             * Sort the SortedMap with a comparer function.
             * @method sort
             * @param comparer A function expecting arguments: key1, value1, key2, value2
             */
            sort: function (comparer) {
                this._data.sort(function (item1, item2) {
                    return comparer.call(null, item1.key, item1.value, item2.key, item2.value);
                });
            },
            /**
             * Get array of key-value pairs of all entries.
             * @method toArray
             * @return An array, each item of which is an object with key and value property.
             */
            toArray: function () {
                var arr = this._data.slice(0);
                for (var i = 0, len = arr.length; i < len; i++) {
                    arr[i] = nx.clone(arr[i]);
                }
                return arr;
            },
            /**
             * support iterator for the callback which has three params:k,v,index
             * @param callback
             */
            each: function (callback) {
                var arr = this.toArray();
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    callback.call(this, item.key, item.value, i);
                }
            },
            /**
             * adapt to the nx.each, which has two params for the callback:k,v
             * @param callback
             * @private
             */
            __each__: function (callback) {
                var arr = this.toArray();
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    callback.call(this, item.key, item.value);
                }
            }
        }
    });
})(nx);
