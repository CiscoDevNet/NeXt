(function (nx, global) {

    nx.util.query = (function () {
        var i,
            internal = {
                publics: {
                    select: function (array, selector) {
                        var rslt = [];
                        if ($.isArray(array) && $.isFunction(selector)) {
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
                        if ($.isFunction(grouper)) {
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
                        } else {
                            map = array;
                        }
                        return map;
                    },
                    aggregate: function (array, aggregater) {
                        var rslt = null, key;
                        if ($.isFunction(aggregater)) {
                            if ($.isArray(array)) {
                                rslt = aggregater(array);
                            } else {
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
                        var rslt, grouper = null, aggregater = null;
                        // get original identfier and aggregater
                        if ($.isArray(args)) {
                            if (typeof args[args.length - 1] === "function") {
                                aggregater = args.pop();
                            }
                            grouper = (args.length > 1 ? args : args[0]);
                        } else {
                            grouper = args.map;
                            aggregater = args.aggregate;
                        }
                        // translate grouper into function if possible
                        if (typeof grouper === "string") {
                            grouper = grouper.replace(/\s/g, "").split(",");
                        }
                        if ($.isArray(grouper) && grouper[0] && typeof grouper[0] === "string") {
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
                        } else if ($.isFunction(mapper)) {
                            if ($.isArray(array)) {
                                rslt = [];
                                for (i = 0; i < array.length; i++) {
                                    rslt.push(mapper(array[i], i));
                                }
                            } else {
                                rslt = mapper(array, 0);
                            }
                        } else {
                            if ($.isArray(array)) {
                                rslt = array.slice();
                            } else {
                                rslt = array;
                            }
                        }
                        return rslt;
                    },
                    orderby: function (array, comparer) {
                        if (typeof comparer === "string") {
                            comparer = comparer.replace(/^\s*(.*)$/, "$1").replace(/\s*$/, "").replace(/\s*,\s*/g, ",").split(",");
                        }
                        if ($.isArray(comparer) && comparer[0] && typeof comparer[0] === "string") {
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
                                        } else if (o2[key] > o1[key]) {
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
    })();
})(nx, nx.global);