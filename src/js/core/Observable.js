(function (nx) {
    /**
     * @class Observable
     * @namespace nx
     */
    var Observable = nx.define('nx.Observable', {
        statics: {
            extendProperty: function extendProperty(target, name, meta) {
                var property = nx.Object.extendProperty(target, name, meta);
                if (property && property.__type__ == 'property') {
                    if (!property._watched) {
                        var setter = property.__setter__;
                        //var dependencies = property.getMeta('dependencies');
                        //nx.each(dependencies, function (dep) {
                        //    this.watch(dep, function () {
                        //        this.notify(name);
                        //    }, this);
                        //}, this);

                        property.__setter__ = function (value, params) {
                            var oldValue = this.get(name);
                            if (oldValue !== value) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(name, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }

                return property;
            },
            /**
             * This method in order to watch the change of specified path of specified target.
             * @static
             * @method watch
             * @param target The target observable object.
             * @param path The path to be watched.
             * @param callback The callback function accepting arguments list: (path, newvalue, oldvalue).
             * @param context (Optional) The context which the callback will be called with.
             * @return Resource stub object, with release and affect methods.
             *  <p>release: unwatch the current watching.</p>
             *  <p>affect: invoke the callback with current value immediately.</p>
             */
            watch: function (target, path, callback, context) {
                var keys = (typeof path === "string" ? path.split(".") : path);
                var iterate = function (parent, idx) {
                    if (parent && idx < keys.length) {
                        var key = keys[idx];
                        var child = nx.path(parent, key);
                        if (parent.watch) {
                            var rkeys = keys.slice(idx + 1);
                            var iter = iterate(child, idx + 1);
                            var watch = parent.watch(key, function (pname, pnewvalue, poldvalue) {
                                var newvalue = nx.path(pnewvalue, rkeys);
                                var oldvalue = nx.path(poldvalue, rkeys);
                                callback.call(context || target, path, newvalue, oldvalue);
                                if (pnewvalue !== child) {
                                    iter && iter.release();
                                    child = pnewvalue;
                                    iter = iterate(child, idx + 1);
                                }
                            });
                            return {
                                release: function () {
                                    iter && iter.release();
                                    watch.release();
                                }
                            };
                        } else if (child) {
                            return iterate(child, idx + 1);
                        }
                    }
                    return {
                        release: nx.idle
                    };
                };
                var iter = iterate(target, 0);
                return {
                    release: iter.release,
                    affect: function () {
                        var value = nx.path(target, path);
                        callback.call(context || target, path, value, value);
                    }
                };
            },
            /**
             * Monitor several paths of target at the same time, any value change of any path will trigger the callback with all values of all paths.
             * @static
             * @method monitor
             * @param target The target observable object.
             * @param pathlist The path list to be watched.
             * @param callback The callback function accepting arguments list: (value1, value2, value3, ..., changed_path, changed_old_value).
             * @return Resource stub object, with release and affect methods.
             *  <p>release: release the current monitoring.</p>
             *  <p>affect: invoke the callback with current values immediately.</p>
             */
            monitor: function (target, pathlist, callback) {
                if (!target || !pathlist || !callback) {
                    return;
                }
                // apply the cascading
                var i, paths, resources, values;
                paths = typeof pathlist === "string" ? pathlist.replace(/\s/g, "").split(",") : pathlist;
                resources = [];
                values = [];
                var affect = function (path, oldvalue) {
                    var args = values.slice();
                    args.push(path, oldvalue);
                    callback.apply(target, args);
                };
                for (i = 0; i < paths.length; i++) {
                    (function (idx) {
                        values[idx] = nx.path(target, paths[idx]);
                        var resource = Observable.watch(target, paths[idx], function (path, value) {
                            var oldvalue = values[idx];
                            values[idx] = value;
                            affect(paths[idx], oldvalue);
                        });
                        resources.push(resource);
                    })(i);
                }
                return {
                    affect: affect,
                    release: function () {
                        while (resources.length) {
                            resources.shift().release();
                        }
                    }
                };
            }
        },
        methods: {
            /**
             * @constructor
             */
            init: function () {
                this.__bindings__ = this.__bindings__ || {};
                this.__watchers__ = this.__watchers__ || {};
            },
            /**
             * Dispose current object.
             * @method dispose
             */
            dispose: function () {
                this.inherited();
                nx.each(this.__bindings__, function (binding) {
                    binding.dispose();
                });
                this.__bindings__ = {};
                this.__watchers__ = {};
            },
            /**
             * @method
             * @param names
             * @param handler
             * @param context
             */
            watch: function (names, handler, context) {
                var resources = [];
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
                    resources.push(this._watch(name, handler, context));
                }, this);
                return {
                    affect: function () {
                        nx.each(resources, function (resource) {
                            resource.affect();
                        });
                    },
                    release: function () {
                        nx.each(resources, function (resource) {
                            resource.release();
                        });
                    }
                };
            },
            /**
             * @method unwatch
             * @param names
             * @param handler
             * @param context
             */
            unwatch: function (names, handler, context) {
                nx.each(names == '*' ? this.__properties__ : (nx.is(names, 'Array') ? names : [names]), function (name) {
                    this._unwatch(name, handler, context);
                }, this);
            },
            /**
             * @method notify
             * @param names
             * @param oldValue
             */
            notify: function (names, oldValue) {
                if (names == '*') {
                    nx.each(this.__watchers__, function (value, name) {
                        this._notify(name, oldValue);
                    }, this);
                } else {
                    nx.each(nx.is(names, 'Array') ? names : [names], function (name) {
                        this._notify(name, oldValue);
                    }, this);
                }

            },
            /**
             * Get existing binding object for specified property.
             * @method getBinding
             * @param prop
             * @returns {*}
             */
            getBinding: function (prop) {
                return this.__bindings__[prop];
            },
            /**
             * Set binding for specified property.
             * @method setBinding
             * @param prop
             * @param expr
             * @param source
             */
            setBinding: function (prop, expr, source) {
                var binding = this.__bindings__[prop];
                var params = {};

                if (nx.is(expr, 'String')) {
                    var tokens = expr.split(',');
                    var path = tokens[0];
                    var i = 1,
                        length = tokens.length;

                    for (; i < length; i++) {
                        var pair = tokens[i].split('=');
                        params[pair[0]] = pair[1];
                    }

                    params.target = this;
                    params.targetPath = prop;
                    params.sourcePath = path;
                    params.source = source;
                    if (params.converter) {
                        params.converter = Binding.converters[params.converter] || nx.path(window, params.converter);
                    }

                } else {
                    params = nx.clone(expr);
                    params.target = this;
                    params.targetPath = prop;
                    params.source = params.source || this;
                }

                if (binding) {
                    binding.destroy();
                }

                this.__bindings__[prop] = new Binding(params);
            },
            /**
             * Clear binding for specified property.
             * @method clearBinding
             * @param prop
             */
            clearBinding: function (prop) {
                var binding = this.__bindings__[prop];
                if (binding) {
                    binding.destroy();
                    this.__bindings__[prop] = null;
                }
            },
            _watch: function (name, handler, context) {
                var map = this.__watchers__;
                var watchers = map[name] = map[name] || [];
                var property = this[name];
                var watcher = {
                    owner: this,
                    handler: handler,
                    context: context
                };

                watchers.push(watcher);

                if (property && property.__type__ == 'property') {
                    if (!property._watched) {
                        var setter = property.__setter__;
                        var dependencies = property.getMeta('dependencies');
                        var equalityCheck = property.getMeta('equalityCheck');
                        nx.each(dependencies, function (dep) {
                            this.watch(dep, function () {
                                this.notify(name);
                            }, this);
                        }, this);

                        property.__setter__ = function (value, params) {
                            var oldValue = this.get(name);
                            if (oldValue !== value || (params && params.force) || equalityCheck === false) {
                                if (setter.call(this, value, params) !== false) {
                                    return this.notify(name, oldValue);
                                }
                            }

                            return false;
                        };

                        property._watched = true;
                    }
                }
                return {
                    affect: function () {
                        var value = watcher.owner.get(name);
                        if (watcher && watcher.handler) {
                            watcher.handler.call(watcher.context || watcher.owner, name, value, value, watcher.owner);
                        }
                    },
                    release: function () {
                        var idx = watchers.indexOf(watcher);
                        if (idx >= 0) {
                            watchers.splice(idx, 1);
                        }
                    }
                };
            },
            _unwatch: function (name, handler, context) {
                var map = this.__watchers__;
                var watchers = map[name],
                    watcher;

                if (watchers) {
                    if (handler) {
                        for (var i = 0, length = watchers.length; i < length; i++) {
                            watcher = watchers[i];
                            if (watcher.handler == handler && watcher.context == context) {
                                watchers.splice(i, 1);
                                break;
                            }
                        }
                    } else {
                        watchers.length = 0;
                    }
                }
            },
            _notify: function (name, oldValue) {
                var i, watcher, calling, existing = this.__watchers__[name];
                calling = existing ? existing.slice() : [];
                for (i = 0; i < calling.length; i++) {
                    watcher = calling[i];
                    if (watcher && watcher.handler && (watcher === existing[i] || existing.indexOf(watcher) >= 0)) {
                        watcher.handler.call(watcher.context || watcher.owner, name, this.get(name), oldValue, watcher.owner);
                    }

                }
            }
        }
    });

    var Binding = nx.define('nx.Binding', Observable, {
        statics: {
            converters: {
                boolean: {
                    convert: function (value) {
                        return !!value;
                    },
                    convertBack: function (value) {
                        return !!value;
                    }
                },
                inverted: {
                    convert: function (value) {
                        return !value;
                    },
                    convertBack: function (value) {
                        return !value;
                    }
                },
                number: {
                    convert: function (value) {
                        return Number(value);
                    },
                    convertBack: function (value) {
                        return value;
                    }
                }
            },
            /**
             * @static
             */
            format: function (expr, target) {
                if (expr) {
                    return expr.replace('{0}', target);
                } else {
                    return '';
                }
            }
        },
        properties: {
            /**
             * Get the target object of current binding.
             */
            target: {
                value: null
            },
            /**
             * Get the target path of current binding.
             */
            targetPath: {
                value: ''
            },
            /**
             * Get the source path of current binding.
             */
            sourcePath: {
                value: ''
            },
            /**
             * Get or set the source of current binding.
             */
            source: {
                get: function () {
                    return this._source;
                },
                set: function (value) {
                    if (this._initialized && this._source !== value) {
                        this._rebind(0, value);
                        if (this._direction[0] == '<') {
                            this._updateTarget();
                        }
                        this._source = value;
                    }
                }
            },
            /**
             * Get or set the binding type.
             */
            bindingType: {
                value: 'auto'
            },
            /**
             * Get the direction for current binding.
             */
            direction: {
                value: 'auto'
            },
            /**
             * Get the trigger for current binding.
             */
            trigger: {
                value: 'auto'
            },
            /**
             * Get the format for current binding.
             */
            format: {
                value: 'auto'
            },
            /**
             * Get the converter for current binding.
             */
            converter: {
                value: 'auto'
            }
        },
        methods: {
            init: function (config) {
                this.sets(config);
                if (config.target) {
                    var target = this.target();
                    var targetPath = this.targetPath();
                    var sourcePath = this.sourcePath();
                    var bindingType = this.bindingType();
                    var direction = this.direction();
                    var format = this.format();
                    var converter = this.converter();
                    var targetMember = target[targetPath];
                    var watchers = this._watchers = [];
                    var keys = this._keys = sourcePath.split('.'),
                        key;
                    var i = 0,
                        length = keys.length;
                    var self = this;

                    if (targetMember) {
                        var bindingMeta = targetMember.__meta__.binding;

                        if (bindingType == 'auto') {
                            bindingType = targetMember.__type__;
                        }

                        if (direction == 'auto') {
                            direction = this._direction = (bindingMeta && bindingMeta.direction) || '<-';
                        }

                        if (format == 'auto') {
                            format = bindingMeta && bindingMeta.format;
                        }

                        if (converter == 'auto') {
                            converter = bindingMeta && bindingMeta.converter;
                        }
                    } else {
                        if (bindingType == 'auto') {
                            bindingType = target.can(targetPath) ? 'event' : 'property';
                        }

                        if (direction == 'auto') {
                            direction = this._direction = '<-';
                        }

                        if (format == 'auto') {
                            format = null;
                        }

                        if (converter == 'auto') {
                            converter = null;
                        }
                    }

                    if (converter) {
                        if (nx.is(converter, 'Function')) {
                            converter = {
                                convert: converter,
                                convertBack: function (value) {
                                    return value;
                                }
                            };
                        }
                    }

                    if (direction[0] == '<') {
                        for (; i < length; i++) {
                            watchers.push({
                                key: keys[i],
                                /*jshint -W083*/
                                handler: (function (index) {
                                    return function (property, value) {
                                        self._rebind(index, value);
                                        self._updateTarget();
                                    };
                                })(i + 1)
                            });
                        }
                    }

                    if (bindingType == 'event') {
                        key = watchers[length - 1].key;
                        watchers.length--;
                        this._updateTarget = function () {
                            var actualValue = this._actualValue;
                            if (actualValue) {
                                target.upon(targetPath, actualValue[key], actualValue);
                            }
                        };
                    } else {
                        this._updateTarget = function () {
                            var actualValue = this._actualValue;
                            if (converter) {
                                actualValue = converter.convert.call(this, actualValue);
                            }

                            if (format) {
                                actualValue = Binding.format(format, actualValue);
                            }

                            nx.path(target, targetPath, actualValue);
                        };
                    }

                    if (direction[1] == '>') {
                        if (target.watch && target.watch.__type__ === 'method') {
                            target.watch(targetPath, this._onTargetChanged = function (property, value) {
                                var actualValue = value;
                                if (converter) {
                                    actualValue = converter.convertBack.call(this, actualValue);
                                }
                                nx.path(this.source(), sourcePath, actualValue);
                            }, this);
                        }
                    }

                    this._initialized = true;
                    this.source(config.source);
                }
            },
            dispose: function () {
                var target = this._target;
                this._rebind(0, null);
            },
            _rebind: function (index, value) {
                var watchers = this._watchers;
                var newSource = value,
                    oldSource;

                for (var i = index, length = watchers.length; i < length; i++) {
                    var watcher = watchers[i];
                    var key = watcher.key;
                    var handler = watcher.handler;

                    oldSource = watcher.source;

                    if (oldSource && oldSource.unwatch && oldSource.unwatch.__type__ === 'method') {
                        oldSource.unwatch(key, handler, this);
                    }

                    watcher.source = newSource;

                    if (newSource) {
                        if (newSource.watch && newSource.watch.__type__ === 'method') {
                            newSource.watch(key, handler, this);
                        }

                        if (newSource.get) {
                            newSource = newSource.get(key);
                        } else {
                            newSource = newSource[key];
                        }
                    }
                }

                this._actualValue = newSource;
            }
        }
    });

})(nx);
