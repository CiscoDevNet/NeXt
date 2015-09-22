(function (nx) {

    var REGEXP_CHECK = /^(&&|\|\||&|\||\^|-|\(|\)|[a-zA-Z\_][a-zA-Z\d\_]*|\s)*$/;
    var REGEXP_TOKENS = /&&|\|\||&|\||\^|-|\(|\)|[a-zA-Z\_][a-zA-Z\d\_]*/g;
    var REGEXP_OPN = /[a-zA-Z\_][a-zA-Z\d\_]*/;
    var REGEXP_OPR = /&&|\|\||&|\||\^|-|\(|\)/;
    var OPERATORNAMES = {
        "-": "complement",
        "&": "cross",
        "^": "delta",
        "|": "union",
        "&&": "and",
        "||": "or"
    };

    /**
     * @class ObservableCollection
     * @namespace nx.data
     * @extends nx.data.Collection
     * @uses nx.Observable
     */
    var EXPORT = nx.define('nx.data.ObservableCollection', nx.data.Collection, {
        mixins: nx.Observable,
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                item = this.inherited(item);
                if (!this._unique || item !== null) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: [item]
                    });
                }
                return item;
            },
            /**
             * @method addRange
             * @param iter
             */
            addRange: function (iter) {
                var items = this.inherited(iter);
                if (items.length) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: items
                    });
                }
                return items;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                item = this.inherited(item, index);
                if (!this._unique || item !== null) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: [item],
                        index: index
                    });
                }
                return item;
            },
            /**
             * @method insertRange
             * @param iter
             * @param index
             */
            insertRange: function (iter, index) {
                var items = this.inherited(iter, index);
                if (items.length) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'add',
                        items: items,
                        index: index
                    });
                }
                return items;
            },
            /**
             * @method remove
             * @param item
             */
            remove: function (item) {
                var result;
                if (arguments.length > 1) {
                    item = Array.prototype.slice.call(arguments);
                    result = this.inherited.apply(this, item);
                    if (result.length) {
                        this.notify('count');
                        this.notify('length');
                        this.fire('change', {
                            action: 'remove',
                            items: item,
                            indices: result
                        });
                    }
                    return result;
                }
                result = this.inherited(item);
                if (result >= 0) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'remove',
                        items: [item],
                        index: result,
                        indices: [result]
                    });
                }
                return result;
            },
            /**
             * @method removeAt
             * @param index
             */
            removeAt: function (index) {
                var result = this.inherited(index);
                if (result !== undefined) {
                    this.notify('count');
                    this.notify('length');
                    this.fire('change', {
                        action: 'remove',
                        items: [result],
                        index: index
                    });
                }
                return result;
            },
            /**
             * @method clear
             */
            clear: function () {
                var result = this.inherited();
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'clear',
                    items: result
                });
            },
            /**
             * @method sort
             * @param comp
             */
            sort: function (comp) {
                var result = this.inherited(comp);
                this.notify('count');
                this.notify('length');
                this.fire('change', {
                    action: 'sort',
                    comparator: comp || function (a, b) {
                        if (a > b) {
                            return 1;
                        } else if (a < b) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                });
                return result;
            },
            /**
             * Apply a diff watcher, which handles each item in the collection, to the collection.
             *
             * @method monitor
             * @param handler lambda(item) returning a rollback method
             * @return unwatcher A Object with unwatch method.
             */
            monitor: function (handler) {
                var collection = this;
                // resource (aka. rollback-methods) manager
                var resmgr = {
                    // retains item-vs-rollback-method pairs
                    objcache: [],
                    // since NEXT objects have identified ID, map is used more often
                    idcache: {},
                    // find pair index of indicated item in obj-cache
                    findPair: function (item) {
                        var i;
                        for (i = 0; i < resmgr.objcache.length; i++) {
                            if (item === resmgr.objcache[i][0]) {
                                return i;
                            }
                        }
                        return -1;
                    },
                    // get the rollback method of given item
                    get: function (item) {
                        if (item.__id__) {
                            return resmgr.idcache[item.__id__];
                        } else {
                            var pair = resmgr.objcache[resmgr.findPair(item)];
                            return pair && pair[1];
                        }
                    },
                    // set or remove(with null value) rollback method, will call the old rollback method if exists
                    set: function (item, res) {
                        if (item.__id__) {
                            if (resmgr.idcache[item.__id__]) {
                                resmgr.idcache[item.__id__].call(collection);
                            }
                            if (res) {
                                resmgr.idcache[item.__id__] = res;
                            } else {
                                delete resmgr.idcache[item.__id__];
                            }
                        } else {
                            var pairidx = resmgr.findPair(item);
                            var pair = resmgr.objcache[pairidx];
                            if (pair) {
                                if (pair[1] === res) {
                                    return;
                                }
                                pair[1].call(collection);
                                if (!res) {
                                    resmgr.objcache.splice(pairidx, 1);
                                } else {
                                    pair[1] = res;
                                }
                            } else if (res) {
                                pair = [item, res];
                                resmgr.objcache.push(pair);
                            }
                        }
                    },
                    // call all rollback methods
                    release: function () {
                        nx.each(resmgr.idcache, function (res, key) {
                            res();
                        });
                        nx.each(resmgr.objcache, function (pair) {
                            pair[1]();
                        });
                    }
                };
                // watch the further change of the collection
                var listener = collection.on("change", function (sender, evt) {
                    switch (evt.action) {
                    case "add":
                        nx.each(evt.items, function (item) {
                            var res = handler(item);
                            if (res) {
                                resmgr.set(item, res);
                            }
                        });
                        break;
                    case "remove":
                    case "clear":
                        nx.each(evt.items, function (item) {
                            resmgr.set(item, null);
                        });
                        break;
                    }
                });
                // and don't forget the existing items in the collection
                nx.each(collection, function (item) {
                    var res = handler(item);
                    if (res) {
                        resmgr.set(item, res);
                    }
                });
                // return unwatcher
                return {
                    release: function () {
                        resmgr.release();
                        listener.release();
                    }
                };
            },
            /**
             * Select a sub-collection from a source collection.
             * Usage:
             * <pre>
             * // select all items from collection with property active==true
             * resource = subCollection.select(collection, "active")
             * // select all items from collection with path owner.name=="Knly"
             * resource = subCollection.select(collection, "owner.name", function(name){
             *     return name==="Knly";
             * });
             * // select all string item from collection
             * resource = subCollection.select(collection, function(item){
             *     return typeof item === "string";
             * });
             * </pre>
             * 
             * @method select
             * @param {nx.data.ObservableCollection} source
             * @param {String} conditions
             * @param {Function} determinator
             * @return resource for release the binding
             */
            select: function (source, conditions, determinator) {
                if (!nx.is(source, EXPORT)) {
                    return null;
                }
                if (typeof conditions === "function") {
                    determinator = conditions;
                    conditions = null;
                }
                if (!determinator) {
                    determinator = nx.identity;
                }
                var self = this;
                this.clear();
                var resource = source.monitor(function (item) {
                    var resource;
                    if (conditions) {
                        if (nx.is(item, nx.Observable)) {
                            // monitor the specified conditions
                            resource = nx.Observable.monitor(item, conditions, function () {
                                self.toggle(item, determinator.apply(self, arguments));
                            });
                            resource.affect();
                        } else {
                            // determine the specified conditions if unable to monitor
                            self.toggle(item, determinator.call(self, nx.path(item, conditions)));
                        }
                    } else {
                        // no condition specified means determine item itself
                        self.toggle(item, determinator.call(self, item));
                    }
                    return function () {
                        resource && resource.release();
                        self.toggle(item, false);
                    };
                });
                return resource;
            },
            /**
             * Calculate and synchronize collection with a collection calculation.
             *
             * @method calculate
             * @param experssion
             * @param sources
             * @return resource for release the binding
             */
            calculate: function (expression, sources) {
                var calculation = new EXPORT.Calculation(sources);
                return calculation.calculate(this, expression);
            }
        },
        statics: {
            /**
             * Prepare a calculation provider for a map of collections.
             *
             * @class CollectionRelation
             * @namespace nx.data
             * @constructor
             * @param map {Object/Map} A map indicates names of the collection for calculation.
             */
            Calculation: nx.define({
                properties: {
                    map: {
                        value: function () {
                            return new nx.data.ObservableDictionary();
                        }
                    }
                },
                methods: {
                    init: function (map) {
                        this.map().setItems(map);
                    },
                    /**
                     * Apply a inter-collection releation to a collection.
                     * Supported operators:<br/>
                     * <table>
                     * <tr><th>Operator</th><th>Calculation</th><th>Method</th></tr>
                     * <tr><td>&amp;</td><td>Sets cross</td><td>cross</td></tr>
                     * <tr><td>|</td><td>Sets union</td><td>union</td></tr>
                     * <tr><td>^</td><td>Sets symmetric difference</td><td>delta</td></tr>
                     * <tr><td>-</td><td>Sets complement</td><td>complement</td></tr>
                     * <tr><td>&amp;&amp;</td><td>Sets logical and</td><td>and</td></tr>
                     * <tr><td>||</td><td>Sets logical or</td><td>or</td></tr>
                     * </table>
                     * Tips:
                     * <ul>
                     * <li>Logical and means 'first empty collection or last collection'</li>
                     * <li>Logical or means 'first non-empty collection or last collection'</li>
                     * </ul>
                     *
                     * @method calculate
                     * @param target {Collection} The target collection.
                     * @param expression {String} The relation expression.
                     * @return An object with release method.
                     */
                    calculate: function (target, expression) {
                        // TODO more validation on the expression
                        if (!expression.match(REGEXP_CHECK)) {
                            throw new Error("Bad expression.");
                        }
                        var self = this;
                        var map = this.map();
                        var tokens = expression.match(REGEXP_TOKENS);
                        var requirements = tokens.filter(RegExp.prototype.test.bind(REGEXP_OPN));
                        var tree = EXPORT.buildExpressionTree(tokens);
                        // sync with the collection existence
                        var res, monitor;
                        var reqmgr = {
                            count: 0,
                            map: {},
                            sync: function () {
                                res && (res.release(), res = null);
                                if (reqmgr.count === requirements.length) {
                                    target.clear();
                                    if (typeof tree === "string") {
                                        // need not to calculate
                                        res = self.map().getItem(tree).monitor(EXPORT.getCollectionSyncMonitor(target));
                                    } else {
                                        res = self._calculate(target, tree);
                                    }
                                }
                            },
                            monitor: function (key, value) {
                                if (requirements.indexOf(key) >= 0) {
                                    /*
                                    if (map[key] && !value) {
                                        reqmgr.count--;
                                    } else if (!map[key] && value) {
                                        reqmgr.count++;
                                    }*/
                                    reqmgr.count += ((!reqmgr.map[key]) * 1 + (!!value) * 1 - 1);
                                    reqmgr.map[key] = value;
                                    reqmgr.sync();
                                }
                            }
                        };
                        monitor = map.monitor(reqmgr.monitor);
                        return {
                            release: function () {
                                res && res.release();
                                monitor.release();
                            }
                        };
                    },
                    _calculate: function (target, tree) {
                        var self = this;
                        var res, iterate, opr = tree[0];
                        // short-circuit for logical operatiors (&& and ||)
                        switch (opr) {
                        case "&&":
                            iterate = function (idx) {
                                var coll, calc, watch, itr;
                                if (typeof tree[idx] === "string") {
                                    coll = self.map().getItem(tree[idx]);
                                } else {
                                    coll = new nx.data.ObservableCollection();
                                    calc = self._calculate(coll, tree[idx]);
                                }
                                if (idx >= tree.length - 1) {
                                    watch = coll.monitor(function (item) {
                                        target.add(item);
                                        return function () {
                                            target.remove(item);
                                        };
                                    });
                                } else {
                                    watch = coll.watch("length", function (n, v) {
                                        if (v) {
                                            itr = iterate(idx + 1);
                                        } else if (itr) {
                                            itr.release();
                                            itr = null;
                                        }
                                    });
                                    watch.affect();
                                }
                                return {
                                    release: function () {
                                        itr && itr.release();
                                        watch && watch.release();
                                        calc && calc.release();
                                    }
                                };
                            };
                            res = iterate(1);
                            break;
                        case "||":
                            iterate = function (idx) {
                                var coll, calc, watch, itr;
                                if (typeof tree[idx] === "string") {
                                    coll = self.map().getItem(tree[idx]);
                                } else {
                                    coll = new nx.data.ObservableCollection();
                                    calc = self._calculate(coll, tree[idx]);
                                }
                                if (idx >= tree.length - 1) {
                                    watch = coll.monitor(EXPORT.getCollectionSyncMonitor(target));
                                } else {
                                    watch = coll.watch("length", function (n, v) {
                                        if (itr) {
                                            itr.release();
                                        }
                                        if (!v) {
                                            itr = iterate(idx + 1);
                                        } else {
                                            itr = coll.monitor(EXPORT.getCollectionSyncMonitor(target));
                                        }
                                    });
                                    watch.affect();
                                }
                                return {
                                    release: function () {
                                        itr && itr.release();
                                        watch && watch.release();
                                        calc && calc.release();
                                    }
                                };
                            };
                            res = iterate(1);
                            break;
                        default:
                            iterate = function () {
                                var i, coll, colls = [];
                                var calc, calcs = [];
                                for (i = 1; i < tree.length; i++) {
                                    if (typeof tree[i] === "string") {
                                        coll = self.map().getItem(tree[i]);
                                    } else {
                                        coll = new nx.data.ObservableCollection();
                                        calc = self._calculate(coll, tree[i]);
                                    }
                                    colls.push(coll);
                                    calcs.push(calc);
                                }
                                calc = EXPORT[OPERATORNAMES[opr]](target, colls);
                                return {
                                    release: function () {
                                        nx.each(calcs, function (calc) {
                                            calc && calc.release();
                                        });
                                        calc.release();
                                    }
                                };
                            };
                            res = iterate();
                            break;
                        }
                        return res;
                    }
                }
            }),
            /**
             * This util returns a monitor function of ObservableCollection, which is used to synchronize item existance between 2 collections.
             *
             * @method getCollectionSyncMonitor
             * @param collection The target collection to be synchronized.
             * @param sync
             *  <ul>
             *  <li>If true, make sure target collection will have all items as source collection has;</li>
             *  <li>If false, make sure target collection will not have any item as source collection has.</li>
             *  </ul>
             *  Default true.
             * @return {function&lt;item&gt;}
             *  The monitor function.
             */
            getCollectionSyncMonitor: function (coll, sync) {
                if (sync !== false) {
                    return function (item) {
                        coll.add(item);
                        return function () {
                            coll.remove(item);
                        };
                    };
                } else {
                    return function (item) {
                        coll.remove(item);
                        return function () {
                            coll.add(item);
                        };
                    };
                }
            },
            /**
             * Affect target to be the cross collection of sources collections.
             * Release object could stop the dependencies.
             *
             * @method cross
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            cross: function (target, sources) {
                target.clear();
                var counter = new nx.data.Counter();
                var monitors = [];
                var increaseHandler = counter.on("increase", function (o, evt) {
                    if (evt.count == sources.length) {
                        target.add(evt.item);
                    }
                });
                var decreaseHandler = counter.on("decrease", function (o, evt) {
                    if (evt.count == sources.length - 1) {
                        target.remove(evt.item);
                    }
                });

                nx.each(sources, function (coll) {
                    var monitor = coll.monitor(function (item) {
                        counter.increase(item, 1);
                        return function () {
                            counter.decrease(item, 1);
                        };
                    });
                    monitors.push(monitor);
                });
                return {
                    release: function () {
                        increaseHandler.release();
                        decreaseHandler.release();
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the union collection of sources collections.
             * Release object could stop the dependencies.
             *
             * @method union
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            union: function (target, sources) {
                target.clear();
                var counter = new nx.data.Counter();
                var monitors = [];
                var increaseHandler = counter.on("increase", function (o, evt) {
                    if (evt.count === 1) {
                        target.add(evt.item);
                    }
                });
                var decreaseHandler = counter.on("decrease", function (o, evt) {
                    if (evt.count === 0) {
                        target.remove(evt.item);
                    }
                });

                nx.each(sources, function (coll) {
                    var monitor = coll.monitor(function (item) {
                        counter.increase(item, 1);
                        return function () {
                            counter.decrease(item, 1);
                        };
                    });
                    monitors.push(monitor);
                });
                return {
                    release: function () {
                        increaseHandler.release();
                        decreaseHandler.release();
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the complement collection of sources collections.
             * Release object could stop the dependencies.
             *
             * @method complement
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            complement: function (target, sources) {
                target.clear();
                var counter = new nx.data.Counter();
                var monitors = [];
                var length = sources.length;
                var changeHandler = counter.on("change", function (o, evt) {
                    var previous = evt.previousCount,
                        count = evt.count;
                    if (previous < length && count >= length) {
                        target.add(evt.item);
                    }
                    if (previous >= length && count < length) {
                        target.remove(evt.item);
                    }
                });
                var globalMonitor = sources[0].monitor(function (item) {
                    counter.increase(item, length);
                    return function () {
                        counter.decrease(item, length);
                    };
                });
                monitors.push(globalMonitor);
                nx.each(sources, function (coll, index) {
                    if (index > 0) {
                        var monitor = coll.monitor(function (item) {
                            counter.decrease(item);
                            return function () {
                                counter.increase(item);
                            };
                        });
                        monitors.push(monitor);
                    }
                });
                return {
                    release: function () {
                        changeHandler.release();
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the symmetric difference collection of sources collections.
             * Release object could stop the dependencies.
             * The name 'delta' is the symbol of this calculation in mathematics.
             * @reference {http://en.wikipedia.org/wiki/Symmetric_difference}
             * @method delta
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            delta: function (target, sources) {
                target.clear();
                var bound = true;
                var monitors = [];
                nx.each(sources, function (coll) {
                    var monitor = coll.monitor(function (item) {
                        target.toggle(item);
                        return function () {
                            if (bound) {
                                target.toggle(item);
                            }
                        };
                    });
                    monitors.push(monitor);
                });
                return {
                    release: function () {
                        bound = false;
                        nx.each(monitors, function (monitor) {
                            monitor.release();
                        });
                    }
                };
            },
            /**
             * Affect target to be the equivalent collection of the first non-empty collection.
             * Release object could stop the dependencies.
             *
             * @method or
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            or: function (target, sources) {
                target.clear();
                var res, bound = true;
                var iterator = function (index) {
                    var watch, res, coll = sources[index];
                    watch = coll.watch('length', function (name, value) {
                        res && res.release();
                        if (index < sources.length - 1 && !value) {
                            res = iterator(index + 1);
                        } else {
                            res = coll.monitor(function (item) {
                                target.add(item);
                                return function () {
                                    if (bound) {
                                        target.remove(item);
                                    }
                                };
                            });
                        }
                    });
                    watch.affect();
                    return {
                        release: function () {
                            res && res.release();
                            watch && watch.release();
                        }
                    };
                };
                res = iterator(0);
                return {
                    release: function () {
                        bound = false;
                        res.release();
                    }
                };
            },
            /**
             * Affect target to be the equivalent collection of the first empty collection or the last collection.
             * Release object could stop the dependencies.
             *
             * @method and
             * @param target {Collection}
             * @param sources {Array of Collection}
             * @return an object with release method
             * @static
             */
            and: function (target, sources) {
                target.clear();
                var bound = true;
                var iterate = function (idx) {
                    var watcher, resource, coll = sources[idx];
                    if (idx === sources.length - 1) {
                        return coll.monitor(function (item) {
                            target.add(item);
                            return function () {
                                if (bound) {
                                    target.remove(item);
                                }
                            };
                        });
                    }
                    watcher = coll.watch("length", function (n, v) {
                        if (v) {
                            resource = iterate(idx + 1);
                        } else if (resource) {
                            resource.release();
                            resource = null;
                        }
                    });
                    watcher.affect();
                    return {
                        release: function () {
                            if (resource) {
                                resource.release();
                            }
                            watcher.release();
                        }
                    };
                };
                var resource = iterate(0);
                return {
                    release: function () {
                        bound = false;
                        resource.release();
                    }
                };
            },
            /**
             * Build a tree of expresson syntax with the expression tokens.
             * e.g. tokens ["A", "|", "B", "&", "(", "C", "&", "D", ")"], which was separated from expression "A | B & (C | D)",
             * will be separated into [|, A, [&, B, [|, C, D]]], because '&' has higher priority than '|',
             * and braced "C | D" has higher priority than &. <br/>
             * <br/>
             * Similar to the priorities in JavaScript:<br/>
             * <table>
             * <tr><th>operator</th><th>functionality</th></tr>
             * <tr><td>()</td><td>braces</td></tr>
             * <tr><td>-</td><td>complement</td></tr>
             * <tr><td>&</td><td>cross</td></tr>
             * <tr><td>^</td><td>symmetric difference</td></tr>
             * <tr><td>|</td><td>union</td></tr>
             * <tr><td>&&</td><td>and (the first empty collection or the last collection)</td></tr>
             * <tr><td>||</td><td>or (the first non-empty collection)</td></tr>
             * </table>
             *
             * @method buildExpressionTree
             * @param {Array of token} tokens
             * @return {Array tree} Parsed syntax tree of the expression tokens.
             * @static
             */
            buildExpressionTree: (function () {
                var PRIORITIES = [
                    ["-"],
                    ["&"],
                    ["^"],
                    ["|"],
                    ["&&"],
                    ["||"]
                ];
                var getPriority = function (opr) {
                    for (var i = 0; i < PRIORITIES.length; i++) {
                        if (PRIORITIES[i].indexOf(opr) >= 0) {
                            return i;
                        }
                    }
                };
                var buildExpressionNode = function (opr, opn1, opn2) {
                    if (Object.prototype.toString.call(opn1) === "[object Array]" && opn1[0] === opr) {
                        opn1.push(opn2);
                        return opn1;
                    }
                    return [opr, opn1, opn2];
                };
                return function (tokens) {
                    if (typeof tokens === "string") {
                        tokens = tokens.match(REGEXP_TOKENS);
                    }
                    tokens = tokens.concat([")"]);
                    var token, opr, oprstack = [];
                    var opn, opnstack = [];
                    var operands = [];
                    while (tokens.length) {
                        token = tokens.shift();
                        if (token === ")") {
                            while ((opr = oprstack.pop())) {
                                if (opr === "(") {
                                    break;
                                }
                                opn = opnstack.pop();
                                opnstack.push(buildExpressionNode(opr, opnstack.pop(), opn));
                            }
                        } else if (token === "(") {
                            oprstack.push(token);
                        } else if (token.match(REGEXP_OPN)) {
                            opnstack.push(token);
                            if (operands.indexOf(token) == -1) {
                                operands.push(token);
                            }
                        } else if (token.match(REGEXP_OPR)) {
                            while (oprstack.length) {
                                opr = oprstack.pop();
                                if (opr === "(" || getPriority(opr) > getPriority(token)) {
                                    oprstack.push(opr);
                                    break;
                                }
                                opn = opnstack.pop();
                                opnstack.push(buildExpressionNode(opr, opnstack.pop(), opn));
                            }
                            oprstack.push(token);
                        }
                    }
                    if (opnstack[0]) {
                        opnstack[0].operands = operands;
                    }
                    return opnstack[0];
                };
            })()
        }
    });
})(nx);
