(function (nx) {
    var keyword = nx.keyword = nx.keyword || {
        binding: function (source, callback, async) {
            var context = false;
            if (typeof source !== "string") {
                context = !! source.context;
                callback = source.callback;
                async = source.async;
                source = source.source;
            }
            return new nx.keyword.internal.Keyword({
                type: "binding",
                context: context,
                source: source,
                async: async,
                callback: callback
            });
        },
        internal: {
            idle: function () {},
            watch: (function () {
                var single = function (o, path, listener, context) {
                    var keys = path.split(".");

                    function level(parent, idx) {
                        if (parent && idx < keys.length) {
                            var key = keys[idx];
                            // watch on the collection changes
                            if (key == "*" || key == "%") {
                                // TODO handler watching on collection changes
                            } else {
                                var child = nx.path(parent, key);
                                if (parent.watch) {
                                    var pathRest = keys.slice(idx + 1).join("."),
                                        childUnwatch = level(child, idx + 1);
                                    var watcher = function (pname, pnewvalue, poldvalue) {
                                        var newvalue = pathRest ? nx.path(pnewvalue, pathRest) : pnewvalue;
                                        var oldvalue = pathRest ? nx.path(poldvalue, pathRest) : poldvalue;
                                        listener.call(context || o, path, newvalue, oldvalue);
                                        if (pnewvalue !== child) {
                                            childUnwatch();
                                            child = pnewvalue;
                                            childUnwatch = level(child, idx + 1);
                                        }
                                    };
                                    parent.watch(key, watcher, parent);
                                    return function () {
                                        childUnwatch();
                                        parent.unwatch(key, watcher, parent);
                                    };
                                } else if (child) {
                                    return level(child, idx + 1);
                                }
                            }
                        }
                        return keyword.internal.idle;
                    }
                    var unwatch = level(o, 0);
                    return {
                        unwatch: unwatch,
                        notify: function () {
                            var value = nx.path(o, path);
                            listener.call(context || o, path, value, value);
                        }
                    };
                };

                var singleWithCollection = function (o, path, listener, context) {
                    var collman = {
                        collection: null,
                        unlistener: null,
                        listener: function (collection, evt) {
                            listener.call(context || o, path, collection, evt);
                        },
                        update: function (value) {
                            if (collman.collection === value) {
                                return;
                            }
                            /* jslint -W030 */
                            collman.unlistener && collman.unlistener();
                            if (value && value.is && value.is(nx.data.ObservableCollection)) {
                                value.on("change", collman.listener, o);
                                collman.unlistener = function () {
                                    value.off("change", collman.listener, o);
                                };
                            } else {
                                collman.unlistener = null;
                            }
                            collman.collection = value;
                        }
                    };
                    collman.update(nx.path(o, path));
                    var unwatcher = single(o, path, function (path, value) {
                        collman.update(value);
                        listener.call(context || o, path, value);
                    }, context);
                    return {
                        unwatch: function () {
                            unwatcher.unwatch();
                            /* jslint -W030 */
                            collman.unlistener && collman.unlistener();
                        },
                        notify: unwatcher.notify
                    };
                };

                return function (target, paths, update) {
                    if (!target || !paths || !update) {
                        return;
                    }
                    // apply the watching
                    var deps;
                    if (nx.is(paths, "String")) {
                        deps = paths.replace(/\s/g, "").split(",");
                    } else {
                        deps = paths;
                    }
                    nx.each(deps, function (v, i) {
                        if (/^\d+$/.test(v)) {
                            deps[i] = v * 1;
                        }
                    });
                    var unwatchers = [],
                        vals = [];
                    var notify = function (key, diff) {
                        var values = vals.slice();
                        values.push(key);
                        /* jslint -W030 */
                        diff && values.push(diff);
                        update.apply(target, values);
                    };
                    for (i = 0; i < deps.length; i++) {
                        /* jslint -W083 */
                        (function (idx) {
                            vals[idx] = nx.path(target, deps[idx]);
                            var unwatcher = singleWithCollection(target, deps[idx], function (path, value, diff) {
                                vals[idx] = value;
                                notify(deps[idx], diff);
                            });
                            unwatchers.push(unwatcher);
                        })(i);
                    }
                    return {
                        notify: notify,
                        release: function () {
                            while (unwatchers.length) {
                                unwatchers.shift().unwatch();
                            }
                        }
                    };
                };
            })(),
            Keyword: (function () {
                var Keyword = function (options) {
                    nx.sets(this, options);
                };
                Keyword.prototype = {
                    apply: function (o, pname) {
                        var binding = {
                            owner: o,
                            property: pname,
                            set: o && pname && function (v) {
                                o.set(pname, v);
                                return o.get(pname);
                            }
                        };
                        var watching = nx.keyword.internal.watch(o, this.source, function () {
                            var rslt;
                            if (this.callback) {
                                rslt = this.callback.apply(this.context ? binding.owner : binding, arguments);
                            } else {
                                rslt = arguments[0];
                            }
                            if (!this.async) {
                                binding.set(rslt);
                            }
                        }.bind(this));
                        return watching;
                    }
                };
                return Keyword;
            })()
        }
    };
})(nx);
