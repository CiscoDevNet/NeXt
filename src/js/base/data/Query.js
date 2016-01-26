(function (nx) {
    var Iterable = nx.Iterable;
    var ArrayPrototype = Array.prototype;
    var every = ArrayPrototype.every;
    var some = ArrayPrototype.some;
    var filter = ArrayPrototype.filter;
    var map = ArrayPrototype.map;
    var reduce = ArrayPrototype.reduce;

    /**
     * @class Query
     * @namespace nx.data
     * @extend nx.Iterable
     */
    var Query = nx.define('nx.data.Query', nx.Iterable, {
        methods: {
            /**
             * @constructor
             * @param iter
             */
            init: function (iter) {
                this._iter = iter;
                this.reset();
            },
            /**
             * Reset the query.
             * @method reset
             */
            reset: function () {
                this._where = null;
                this._orderBy = null;
                this._unions = [];
                this._joins = [];
                this._begin = 0;
                this._end = null;
            },
            /**
             * @method where
             * @param expr
             * @chainable
             */
            where: function (expr) {
                this._where = expr;
                return this;
            },
            /**
             * method orderBy
             * @param expr
             * @param desc
             * @chainable
             */
            orderBy: function (expr, desc) {
                if (nx.is(expr, 'Function')) {
                    this._orderBy = desc ? function (a, b) {
                        return expr(b, a);
                    } : expr;
                }
                else {
                    this._orderBy = desc ? function (a, b) {
                        return nx.compare(nx.path(b, expr), nx.path(a, expr));
                    } : function (a, b) {
                        return nx.compare(nx.path(a, expr), nx.path(b, expr));
                    };
                }

                return this;
            },
            /**
             * @method groupBy
             * @param expr
             * @chainable
             */
            groupBy: function (expr) {
                throw new Error('Not Implemented');
            },
            /**
             * @method distinct
             * @param expr
             * @chainable
             */
            distinct: function (expr) {
                throw new Error('Not Implemented');
            },
            /**
             * @method skip
             * @param count
             * @chainable
             */
            skip: function (count) {
                this._begin = count;

                if (this._end) {
                    this._end += count;
                }

                return this;
            },
            /**
             * @method take
             * @param count
             * @chainable
             */
            take: function (count) {
                this._end = this._begin + count;

                return this;
            },
            /**
             * @method join
             * @param iter
             * @param on
             * @chainable
             */
            join: function (iter, on) {
                this._join = function () {

                };
                throw new Error('Not Implemented');
            },
            /**
             * @method select
             * @param expr
             * @returns {Array}
             */
            select: function (expr) {
                var arr = this.toArray();
                if (nx.is(expr, 'Function')) {
                    return map.call(arr, expr);
                }
                else if (nx.is(expr, 'String')) {
                    return map.call(arr, function (item) {
                        return nx.path(item, expr);
                    });
                }
                else if (nx.is(expr, 'Array')) {
                    return map.call(arr, function (item) {
                        var result = {};
                        nx.each(expr, function (path) {
                            nx.path(result, path, nx.path(item, path));
                        });

                        return result;
                    });
                }
                else {
                    return arr;
                }
            },
            /**
             * @method first
             * @param expr
             * @returns {any}
             */
            first: function (expr) {
                var arr = this.toArray();
                if (expr) {
                    for (var i = 0, length = arr.length; i < length; i++) {
                        var item = arr[i];
                        if (expr(item)) {
                            return item;
                        }
                    }
                }
                else {
                    return arr[0];
                }
            },
            /**
             * @method last
             * @param expr
             * @returns {any}
             */
            last: function (expr) {
                var arr = this.toArray();
                if (expr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        var item = arr[i];
                        if (expr(item)) {
                            return item;
                        }
                    }
                }
                else {
                    return arr[arr.length - 1];
                }
            },
            /**
             * @method all
             * @param expr
             * @returns {Boolean}
             */
            all: function (expr) {
                return every.call(this.toArray(), expr);
            },
            /**
             * @method any
             * @param expr
             * @returns {Boolean}
             */
            any: function (expr) {
                return some.call(this.toArray(), expr);
            },
            /**
             * @method max
             * @param expr
             * @returns {Number}
             */
            max: function (expr) {
                return reduce.call(this.toArray(), function (pre, cur, index, arr) {
                    return pre > cur ? pre : cur;
                });
            },
            /**
             * @method min
             * @param expr
             * @returns {Number}
             */
            min: function (expr) {
                return reduce.call(this.toArray(), function (pre, cur, index, arr) {
                    return pre < cur ? pre : cur;
                });
            },
            /**
             * @method sum
             * @param expr
             * @returns {Number}
             */
            sum: function (expr) {
                return reduce.call(this.toArray(), function (pre, cur, index, arr) {
                    return pre + cur;
                });
            },
            /**
             * @method average
             * @param expr
             * @returns {Number}
             */
            average: function (expr) {
                var arr = this.toArray();
                return reduce.call(arr, function (pre, cur, index, arr) {
                    return pre + cur;
                }) / arr.length;
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                var arr = Iterable.toArray(this._iter);

                nx.each(this._unions, function (union) {
                    arr.concat(Iterable.toArray(union));
                });

                if (this._where) {
                    arr = filter.call(arr, this._where);
                }

                if (this._orderBy) {
                    arr = arr.sort(this._orderBy);
                }

                if (this._end > 0) {
                    arr = arr.slice(this._begin, this._end);
                }
                else {
                    arr = arr.slice(this._begin);
                }

                this.reset();
                return arr;
            }
        },
        statics: {
            query: (function () {
                var i, internal = {
                        publics: {
                            select: function (array, selector) {
                                var rslt = [];
                                if (nx.is(array, "Array") && nx.is(selector, "Function")) {
                                    var i, item;
                                    for (i = 0; i < array.length; i++) {
                                        item = array[i];
                                        if (selector(item)) {
                                            rslt.push(item);
                                        }
                                    }
                                }
                                return rslt;
                            },
                            group: function (array, grouper) {
                                var map;
                                if (nx.is(grouper, "Function")) {
                                    map = {};
                                    var i, id, group;
                                    for (i = 0; i < array.length; i++) {
                                        id = grouper(array[i]);
                                        if (!id || typeof id !== "string") {
                                            continue;
                                        }
                                        group = map[id] = map[id] || [];
                                        group.push(array[i]);
                                    }
                                }
                                else {
                                    map = array;
                                }
                                return map;
                            },
                            aggregate: function (array, aggregater) {
                                var rslt = null,
                                    key;
                                if (nx.is(aggregater, "Function")) {
                                    if (nx.is(array, "Array")) {
                                        rslt = aggregater(array);
                                    }
                                    else {
                                        rslt = [];
                                        for (key in array) {
                                            rslt.push(aggregater(array[key], key));
                                        }
                                    }
                                }
                                return rslt;
                            }
                        },
                        privates: {
                            aggregate: function (array, args) {
                                var rslt, grouper = null,
                                    aggregater = null;
                                // get original identfier and aggregater
                                if (nx.is(args, "Array")) {
                                    if (typeof args[args.length - 1] === "function") {
                                        aggregater = args.pop();
                                    }
                                    grouper = (args.length > 1 ? args : args[0]);
                                }
                                else {
                                    grouper = args.map;
                                    aggregater = args.aggregate;
                                }
                                // translate grouper into function if possible
                                if (typeof grouper === "string") {
                                    grouper = grouper.replace(/\s/g, "").split(",");
                                }
                                if (nx.is(grouper, "Array") && grouper[0] && typeof grouper[0] === "string") {
                                    grouper = (function (keys) {
                                        return function (obj) {
                                            var i, o = {};
                                            for (i = 0; i < keys.length; i++) {
                                                o[keys[i]] = obj[keys[i]];
                                            }
                                            return JSON.stringify(o);
                                        };
                                    })(grouper);
                                }
                                // do map aggregate
                                rslt = internal.publics.aggregate(internal.publics.group(array, grouper), aggregater);
                                return rslt;
                            },
                            mapping: function (array, mapper) {
                                var i, rslt;
                                if (mapper === true) {
                                    rslt = EXPORT.clone(array);
                                }
                                else if (nx.is(mapper, "Function")) {
                                    if (nx.is(array, "Array")) {
                                        rslt = [];
                                        for (i = 0; i < array.length; i++) {
                                            rslt.push(mapper(array[i], i));
                                        }
                                    }
                                    else {
                                        rslt = mapper(array, 0);
                                    }
                                }
                                else {
                                    if (nx.is(array, "Array")) {
                                        rslt = array.slice();
                                    }
                                    else {
                                        rslt = array;
                                    }
                                }
                                return rslt;
                            },
                            orderby: function (array, comparer) {
                                if (typeof comparer === "string") {
                                    comparer = comparer.replace(/^\s*(.*)$/, "$1").replace(/\s*$/, "").replace(/\s*,\s*/g, ",").split(",");
                                }
                                if (nx.is(comparer, "Array") && comparer[0] && typeof comparer[0] === "string") {
                                    comparer = (function (keys) {
                                        return function (o1, o2) {
                                            var i, key, desc;
                                            if (!o1 && !o2) {
                                                return 0;
                                            }
                                            for (i = 0; i < keys.length; i++) {
                                                key = keys[i];
                                                desc = /\sdesc$/.test(key);
                                                key = key.replace(/(\s+desc|\s+asc)$/, "");
                                                if (o1[key] > o2[key]) {
                                                    return desc ? -1 : 1;
                                                }
                                                else if (o2[key] > o1[key]) {
                                                    return desc ? 1 : -1;
                                                }
                                            }
                                            return 0;
                                        };
                                    })(comparer);
                                }
                                if (comparer && typeof comparer === "function") {
                                    array.sort(comparer);
                                }
                                return array;
                            }
                        },
                        query: function (array, options) {
                            /**
                             * @doctype MarkDown
                             * options:
                             * - options.array [any*]
                             *   - the target array
                             * - options.select: function(any){return boolean;}
                             *   - *optional*
                             *   - pre-filter of the array
                             * - options.aggregate: {grouper:grouper,aggregater:aggregater} or [proplist, aggregater] or [prop, prop, ..., aggregater]
                             *   - *optional*
                             *   - proplist: "prop,prop,..."
                             *   - prop: property name on array items
                             *   - grouper: map an array item into a string key
                             *   - aggregater: function(mapped){return aggregated}
                             * - options.mapping: function(item){return newitem}
                             *   - *optional*
                             * - options.orderby: proplist or [prop, prop, ...]
                             *   - *optional*
                             */
                            if (arguments.length == 1) {
                                options = array;
                                array = options.array;
                            }
                            if (!array) {
                                return array;
                            }
                            if (options.select) {
                                array = internal.publics.select(array, options.select);
                            }
                            if (options.aggregate) {
                                array = internal.privates.aggregate(array, options.aggregate);
                            }
                            if (options.mapping) {
                                array = internal.privates.mapping(array, options.mapping);
                            }
                            if (options.orderby) {
                                array = internal.privates.orderby(array, options.orderby);
                            }
                            return array;
                        }
                    };
                for (i in internal.publics) {
                    internal.query[i] = internal.publics[i];
                }
                return internal.query;
            })()
        }
    });
})(nx);
