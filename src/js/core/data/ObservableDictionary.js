(function (nx) {

    var Observable = nx.Observable;
    var Dictionary = nx.data.Dictionary;

    var ObservableDictionaryItem = nx.define(Observable, {
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

    /**
     * @class ObservableDictionary
     * @namespace nx.data
     * @extends nx.data.Dictionary
     * @constructor
     * @param dict
     */
    nx.define('nx.data.ObservableDictionary', Dictionary, {
        mixins: Observable,
        events: ['change'],
        methods: {
            /**
             * @method setItem
             * @param key {String}
             * @param value {any}
             */
            setItem: function (key, value) {
                var map = this._map,
                    items = this._items;
                var item = map[key],
                    ov;
                if (item) {
                    ov = item.value;
                    item._value = value;
                    item.notify("value");
                    this.fire('change', {
                        action: 'replace',
                        items: [item],
                        oldValue: ov,
                        newValue: value,
                        // FIXME actually unnecessary
                        oldItem: item,
                        newItem: item
                    });
                } else {
                    item = map[key] = new ObservableDictionaryItem(this, key);
                    items.push(item);
                    item._dict = this;
                    item._value = value;
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
                        index: items.length - 1,
                        items: [item]
                    });
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
                this.notify('count');
                this.fire('change', {
                    action: 'remove',
                    items: [item]
                });
                return item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var items = this.inherited();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: items
                });
            },
            /**
             * Apply a diff watcher, which handles each key-item-pair in the collection, to the dictionary.
             *
             * @method monitor
             * @param handler lambda(key, item) returning a rollback method
             * @return unwatcher A Object with unwatch method.
             */
            monitor: function (keys, callback) {
                // check parameter list
                if (typeof keys === "string" && keys.indexOf(",") >= 0 || Object.prototype.toString.call(keys) === "[object Array]") {
                    if (typeof keys === "string") {
                        keys = keys.replace(/\s/g, "").split(",");
                    }
                    return this._monitor(keys, callback);
                }
                if (typeof keys === "function") {
                    callback = keys;
                    keys = null;
                }
                var dict = this;
                var resmgr = {
                    map: {},
                    get: function (key) {
                        return resmgr.map[key];
                    },
                    set: function (key, res) {
                        if (keys && keys !== key) {
                            return;
                        }
                        var old = resmgr.get(key);
                        old && old();
                        if (res) {
                            resmgr.map[key] = res;
                        } else {
                            delete resmgr.map[key];
                        }
                    },
                    release: function () {
                        var key, map = resmgr.map;
                        for (key in map) {
                            map[key]();
                        }
                    },
                    callback: function (key, value) {
                        if (keys) {
                            if (keys === key) {
                                return callback(value);
                            }
                        } else {
                            return callback(key, value);
                        }
                    }
                };
                var listener = dict.on("change", function (target, evt) {
                    var i, item, key, res;
                    switch (evt.action) {
                    case "replace":
                    case "add":
                        for (i = 0; i < evt.items.length; i++) {
                            item = evt.items[i];
                            key = item.key();
                            res = resmgr.callback(key, item.value());
                            resmgr.set(key, res);
                        }
                        break;
                    case "remove":
                    case "clear":
                        for (i = 0; i < evt.items.length; i++) {
                            resmgr.set(evt.items[i].key(), null);
                        }
                        break;
                    }
                });
                dict.each(function (item, key) {
                    var res = resmgr.callback(key, item.value());
                    resmgr.set(key, res);
                });
                return {
                    release: function () {
                        resmgr.release();
                        listener.release();
                    }
                };
            },
            _monitor: function (keys, callback) {
                var self = this;
                var resmgr = {
                    values: keys.map(function (key) {
                        return self.getItem(key);
                    }),
                    affect: function () {
                        callback.apply(self, resmgr.values);
                    }
                };
                var listener = this.on("change", function (dict, evt) {
                    var idx, affect = false;
                    for (i = 0; i < evt.items.length; i++) {
                        item = evt.items[i];
                        key = item.key();
                        idx = keys.indexOf(key);
                        if (idx >= 0) {
                            resmgr.values[idx] = item.value();
                            affect = true;
                        }
                    }
                    affect && resmgr.affect();
                });
                return {
                    affect: resmgr.affect,
                    release: listener.release
                };
            }
        }
    });
})(nx);
