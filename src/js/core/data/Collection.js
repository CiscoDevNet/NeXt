(function (nx) {
    var Iterable = nx.Iterable;

    /**
     * @class Collection
     * @namespace nx.data
     * @extends nx.Iterable
     * @module nx.data
     * @constructor
     * @param iter
     */
    var Collection = nx.define('nx.data.Collection', Iterable, {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this._data.length;
                },
                set: function () {
                    throw new Error("Unable to set count of Collection");
                }
            },
            /**
             * @property length
             * @type {Number}
             */
            length: {
                get: function () {
                    return this._data.length;
                },
                set: function () {
                    throw new Error("Unable to set length of Collection");
                }
            },
            unique: {
                set: function (unique) {
                    // check if the unique status is change
                    /* jshint -W018 */
                    if ( !! this._unique === !! unique) {
                        return;
                    }
                    this._unique = !! unique;
                    if (unique) {
                        // remove duplicated items
                        var data = this._data;
                        var i, len = data.length;
                        for (i = len - 1; i > 0; i--) {
                            if (this.indexOf(data[i]) < i) {
                                this.removeAt(i);
                            }
                        }
                    }
                }
            }
        },
        methods: {
            init: function (iter) {
                var data = this._data = [];
                if (nx.is(iter, Iterable)) {
                    this._data = iter.toArray();
                } else {
                    Iterable.getIterator(iter)(function (item) {
                        data.push(item);
                    });
                }
            },
            /**
             * Add an item.
             *
             * @method add
             * @param item
             * @return added item. Null if fail to add, e.g. duplicated add into unique collection.
             */
            add: function (item) {
                if (!this._unique || this.indexOf(item) == -1) {
                    this._data.push(item);
                    return item;
                }
                return null;
            },
            /**
             * Add multiple items. Will avoid duplicated items for unique collection.
             *
             * @method addRange
             * @param iter
             * @returns array of added items.
             */
            addRange: function (iter) {
                var data = this._data;
                var i, items = Iterable.toArray(iter).slice();
                // check for unique
                if (this._unique) {
                    for (i = items.length - 1; i >= 0; i--) {
                        if (this.indexOf(items[i]) >= 0 || items.indexOf(items[i]) < i) {
                            items.splice(i, 1);
                        }
                    }
                }
                data.splice.apply(data, [data.length, 0].concat(items));
                return items;
            },
            /**
             * @method remove
             * @param item
             * @returns Removed item's index, -1 if not found.
             */
            remove: function (item) {
                var self = this;
                var remove = function (item) {
                    var index = self.indexOf(item);
                    if (index >= 0) {
                        self._data.splice(index, 1);
                        return index;
                    } else {
                        return -1;
                    }
                };
                if (arguments.length > 1) {
                    var i, indices = [];
                    for (i = arguments.length - 1; i >= 0; i--) {
                        indices.unshift(remove(arguments[i]));
                    }
                    return indices;
                } else {
                    return remove(item);
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns Removed item.
             */
            removeAt: function (index) {
                return this._data.splice(index, 1)[0];
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                if (!this._unique || this.indexOf(item) == -1) {
                    this._data.splice(index, 0, item);
                    return item;
                }
                return null;
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function (iter, index) {
                var data = this._data;
                var i, items = Iterable.toArray(iter).slice();
                // check for unique
                if (this._unique) {
                    for (i = items.length - 1; i >= 0; i--) {
                        if (this.indexOf(items[i]) >= 0 || items.indexOf(items[i]) < i) {
                            items.splice(i, 1);
                        }
                    }
                }
                data.splice.apply(data, [index, 0].concat(items));
                return items;
            },
            /**
             * @method clear
             * @returns {*}
             */
            clear: function () {
                var items = this._data.slice();
                this._data.length = 0;
                return items;
            },
            /**
             * @method getItem
             * @param index
             * @returns {*}
             */
            getItem: function (index) {
                return this._data[index];
            },
            /**
             * @method getRange
             * @param index
             * @param count
             * @returns {Collection}
             */
            getRange: function (index, count) {
                return new Collection(this._data.slice(index, index + count));
            },
            /**
             * Get the first index the given item appears in the collection, -1 if not found.
             *
             * @method indexOf
             * @param item
             * @returns {*}
             */
            indexOf: function (item) {
                var data = this._data;
                if (data.indexOf) {
                    return data.indexOf(item);
                } else {
                    for (var i = 0, length = data.length; i < length; i++) {
                        if (nx.compare(data[i], item) === 0) {
                            return i;
                        }
                    }
                    return -1;
                }
            },
            /**
             * @method lastIndexOf
             * @param item
             * @returns {*}
             */
            lastIndexOf: function (item) {
                var data = this._data;
                if (data.lastIndexOf) {
                    return data.lastIndexOf(item);
                } else {
                    for (var i = data.length - 1; i >= 0; i--) {
                        if (nx.compare(data[i], item) === 0) {
                            return i;
                        }
                    }

                    return -1;
                }
            },
            /**
             * @method contains
             * @param item
             * @returns {boolean}
             */
            contains: function (item) {
                return this.indexOf(item) >= 0;
            },
            /**
             * Toggle item's existence.
             * @method toggle
             * @param item
             */
            toggle: function (item, existence) {
                if (arguments.length <= 1) {
                    if (this.contains(item)) {
                        this.remove(item);
                    } else {
                        this.add(item);
                    }
                } else if (existence) {
                    this.add(item);
                } else {
                    this.remove(item);
                }
            },
            /**
             * @method sort
             * @param comp
             * @returns {Array}
             */
            sort: function (comp) {
                return this._data.sort(comp);
            },
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                nx.each(this._data, callback, context);
            },
            /**
             * @method  toArray
             * @returns {Array}
             */
            toArray: function () {
                return this._data.slice(0);
            }
        }
    });
})(nx);
