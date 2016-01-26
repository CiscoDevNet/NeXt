(function (nx) {

    /**
     * @class Counter
     * @namespace nx.data
     * @uses nx.Observable
     */
    var EXPORT = nx.define("nx.data.Counter", {
        events: [
            /**
             * An event which notifies the happening of a count change of item.
             * @event change
             * @param {Object} evt The event object with item, count, previousCount.
             */
            'change',
            /**
             * Same as change event but only happens on count increasing.
             * @event increase
             * @param {Object} evt The event object with item, count, previousCount.
             */
            'increase',
            /**
             * Same as change event but only happens on count decreasing.
             * @event decrease
             * @param {Object} evt The event object with item, count, previousCount.
             */
            'decrease'
        ],
        methods: {
            init: function () {
                this._nummap = {};
                this._strmap = {};
                this._objmap = [];
                this._nxomap = {};
                this._null = 0;
                this._true = 0;
                this._false = 0;
                this._undefined = 0;
            },
            /**
             * Get count of specified item.
             *
             * @method getCount
             * @param {Any} item The counting item.
             * @return Count of the item.
             */
            getCount: function (item) {
                // XXX PhantomJS bug
                if (Object.prototype.toString.call(null) !== "[object Null]") {
                    if (item === null) {
                        return this._null;
                    } else if (item === undefined) {
                        return this._undefined;
                    }
                }
                // check the type
                switch (Object.prototype.toString.call(item)) {
                case "[object Null]":
                    return this._null;
                case "[object Boolean]":
                    return item ? this._true : this._false;
                case "[object Undefined]":
                    return this._undefined;
                case "[object Number]":
                    return this._nummap[item] || 0;
                case "[object String]":
                    return this._strmap[item] || 0;
                default:
                    if (item.__id__) {
                        return this._nxomap[item.__id__] || 0;
                    } else {
                        return EXPORT.getArrayMapValue(this._objmap, item) || 0;
                    }
                }
            },
            /**
             * Set count of specified item.
             *
             * @method setCount
             * @param {Any} item The counting item.
             * @param {Number} count The count to be set.
             * @return Set result count.
             */
            setCount: function (item, count) {
                // XXX PhantomJS bug
                if (Object.prototype.toString.call(null) !== "[object Null]") {
                    if (item === null) {
                        this._null = count;
                    } else if (item === undefined) {
                        this._undefined = count;
                    }
                }
                // XXX optimizable for obj-map
                var previousCount = this.getCount(item);
                // check if change happening
                if (previousCount === count) {
                    return count;
                }
                // change count
                switch (Object.prototype.toString.call(item)) {
                case "[object Null]":
                    this._null = count;
                    break;
                case "[object Boolean]":
                    if (item) {
                        this._true = count;
                    } else {
                        this._false = count;
                    }
                    break;
                case "[object Undefined]":
                    this._undefined = count;
                    break;
                case "[object Number]":
                    this._nummap[item] = count;
                    break;
                case "[object String]":
                    this._strmap[item] = count;
                    break;
                default:
                    if (item.__id__) {
                        this._nxomap[item.__id__] = count;
                    } else {
                        EXPORT.setArrayMapValue(this._objmap, item, count);
                    }
                    break;
                }
                // trigger events
                var event = {
                    item: item,
                    previousCount: previousCount,
                    count: count
                };
                if (previousCount > count) {
                    this.fire('decrease', event);
                } else {
                    this.fire('increase', event);
                }
                this.fire('change', event);
                return count;
            },
            /**
             * Increase the count of given item.
             *
             * @method increase
             * @param {Any} item The item to count.
             * @param {Number} increment The increment, default 1.
             * @return The increasing result
             */
            increase: function (inItem, i) {
                i = arguments.length > 1 ? Math.floor(i * 1 || 0) : 1;
                return this.setCount(inItem, this.getCount(inItem) + i);
            },
            /**
             * Decrease the count of given item.
             *
             * @method decrease
             * @param {Any} item The item to count.
             * @param {Number} decrement The decrement, default 1.
             * @return The decreasing result
             */
            decrease: function (inItem, i) {
                i = arguments.length > 1 ? Math.floor(i * 1 || 0) : 1;
                return this.setCount(inItem, this.getCount(inItem) - i);
            },
            __addArrayItem: function (inItem) {
                this._arrcache.push(inItem);
            },
            __removeArrayItem: function (inItem) {
                var index = this._arrcache.indexOf(inItem);
                this._arrcache.splice(index, 1);
            },
            __getArrayCounter: function (inItem) {
                var counter = 0;
                nx.each(this._arrcache, function (item) {
                    if (inItem === item) {
                        counter++;
                    }
                });
                return counter;
            }
        },
        statics: {
            _getArrayMapItem: function (map, key) {
                return map.filter(function (item) {
                    return item.key === key;
                })[0];
            },
            getArrayMapValue: function (map, key) {
                return (EXPORT._getArrayMapItem(map, key) || {}).value;
            },
            setArrayMapValue: function (map, key, value) {
                var item = EXPORT._getArrayMapItem(map, key);
                if (!item) {
                    map.push({
                        key: key,
                        value: value
                    });
                } else {
                    item.value = value;
                }
                return value;
            }
        }
    });

})(nx);
