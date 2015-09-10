(function (nx) {

    var classId = 1,
        instanceId = 1,
        metaPrefix = '@',
        eventPrefix = 'on',
        classes = {},
        global = nx.global;

    /**
     * The base of any Classes defined in nx framework.
     * @class nx.Object
     * @constructor
     */
    function NXObject() {}

    var NXPrototype = NXObject.prototype = {
        constructor: NXObject,
        /**
         * Dispose current object.
         * @method dispose
         */
        dispose: function () {
            this.__listeners__ = {};
        },
        /**
         * Destroy current object.
         * @method destroy
         */
        destroy: function () {
            this.dispose();
        },
        /**
         * Call overridden method from super class
         * @method inherited
         */
        inherited: function () {
            var base = this.inherited.caller.__super__;
            if (base) {
                return base.apply(this, arguments);
            }
        },
        /**
         * Check whether current object is specified type.
         * @method is
         * @param type {String|Function}
         * @returns {Boolean}
         */
        is: function (type) {
            if (typeof type === 'string') {
                type = nx.path(global, type);
            }

            if (type) {
                if (this instanceof type) {
                    return true;
                } else {
                    var mixins = this.__mixins__;
                    for (var i = 0, len = mixins.length; i < len; i++) {
                        var mixin = mixins[i];
                        if (type === mixin) {
                            return true;
                        }
                    }
                }
            }

            return false;
        },
        /**
         * Check whether current object has specified property.
         * @method has
         * @param name {String}
         * @returns {Boolean}
         */
        has: function (name) {
            var member = this[name];
            return member && member.__type__ == 'property';
        },
        /**
         * Get specified property value.
         * @method get
         * @param name {String}
         * @returns {*}
         */
        get: function (name) {
            var member = this[name];
            if (member !== undefined) {
                if (member.__type__ == 'property') {
                    return member.call(this);
                } else {
                    return member;
                }
            }
        },
        /**
         * Set specified property value.
         * @method set
         * @param name {String}
         * @param value {*}
         */
        set: function (name, value) {
            var member = this[name];
            if (member !== undefined) {
                if (member.__type__ == 'property') {
                    return member.call(this, value);
                } else {
                    this[name] = value;
                }
            } else {
                this[name] = value;
            }
        },
        /**
         * Get all properties.
         * @method gets
         * @returns {Object}
         */
        gets: function () {
            var result = {};
            nx.each(this.__properties__, function (name) {
                result[name] = this.get(name);
            }, this);

            return result;
        },
        /**
         * Set a bunch of properties.
         * @method sets
         * @param dict {Object}
         */
        sets: function (dict) {
            if (dict) {
                for (var name in dict) {
                    if (dict.hasOwnProperty(name)) {
                        this.set(name, dict[name]);
                    }
                }
            }
        },
        /**
         * Check whether current object has specified event.
         * @method can
         * @param name {String}
         * @returns {Boolean}
         */
        can: function (name) {
            var member = this[eventPrefix + name];
            return member && member.__type__ == 'event';
        },
        /**
         * Add an event handler.
         * @method on
         * @param name {String}
         * @param handler {Function}
         * @param [context] {Object}
         */
        on: function (name, handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [{
                owner: null,
                handler: null,
                context: null
            }];
            var listener = {
                owner: this,
                handler: handler,
                context: context || this
            };

            listeners.push(listener);
            return {
                release: function () {
                    var idx = listeners.indexOf(listener);
                    if (idx >= 0) {
                        listeners.splice(idx, 1);
                    }
                }
            };
        },
        /**
         * Remove an event handler.
         * @method off
         * @param name {String}
         * @param [handler] {Function}
         * @param [context] {Object}
         */
        off: function (name, handler, context) {
            var listeners = this.__listeners__[name],
                listener;
            if (listeners) {
                if (handler) {
                    context = context || this;
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener.handler == handler && listener.context == context) {
                            listeners.splice(i, 1);
                            break;
                        }
                    }
                } else {
                    listeners.length = 1;
                }
            }
        },
        /**
         * Add a single event handler.
         * @method upon
         * @param name {String}
         * @param handler {Function}
         * @param [context] {Object}
         */
        upon: function (name, handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [{
                owner: null,
                handler: null,
                context: null
            }];

            listeners[0] = {
                owner: this,
                handler: handler,
                context: context
            };
        },
        /**
         * Trigger an event.
         * @method fire
         * @param name {String}
         * @param [data] {*}
         */
        fire: function (name, data) {
            var i, length, listener, result, calling, existing = this.__listeners__[name];
            calling = existing ? existing.slice() : [];
            for (i = 0, length = calling.length; i < length; i++) {
                listener = calling[i];
                if (listener && listener.handler && (existing[i] === listener || existing.indexOf(listener) >= 0)) {
                    result = listener.handler.call(listener.context, listener.owner, data);
                    if (result === false) {
                        return false;
                    }
                }
            }
        },
        __is__: function (type) {
            return this.is(type);
        },
        __has__: function (name) {
            return this.has(name);
        },
        __get__: function (name) {
            return this.get(name);
        },
        __set__: function (name, value) {
            return this.set(name, value);
        },
        __gets__: function () {
            return this.gets();
        },
        __sets__: function (dict) {
            return this.sets(dict);
        }
    };

    NXObject.__classId__ = NXPrototype.__classId__ = 0;
    NXObject.__className__ = NXPrototype.__className__ = 'nx.Object';
    NXObject.__events__ = NXPrototype.__events__ = [];
    NXObject.__properties__ = NXPrototype.__properties__ = [];
    NXObject.__methods__ = NXPrototype.__methods__ = [];
    NXObject.__defaults__ = NXPrototype.__defaults__ = {};
    NXObject.__mixins__ = NXPrototype.__mixins__ = [];
    NXObject.extendEvent = extendEvent;
    NXObject.extendProperty = extendProperty;
    NXObject.extendMethod = extendMethod;

    /**
     * Define an event and attach to target.
     * @method extendEvent
     * @static
     * @param target {Object}
     * @param name {String}
     */
    function extendEvent(target, name) {
        var eventName = eventPrefix + name;
        var exist = target[eventName] && target[eventName].__type__ == 'event';
        var fn = target[eventName] = function (handler, context) {
            var map = this.__listeners__;
            var listeners = map[name] = map[name] || [{
                owner: null,
                handler: null,
                context: null
            }];

            listeners[0] = {
                owner: this,
                handler: handler,
                context: context
            };
        };

        fn.__name__ = name;
        fn.__type__ = 'event';

        if (!exist) {
            target.__events__.push(name);
        }

        return fn;
    }

    /**
     * Define a property and attach to target.
     * @method extendProperty
     * @static
     * @param target {Object}
     * @param name {String}
     * @param meta {Object}
     */
    function extendProperty(target, name, meta) {
        if (nx.is(meta, nx.keyword.internal.Keyword) || !nx.is(meta, "Object")) {
            meta = {
                value: meta
            };
        }
        var defaultValue;
        var exist = target[name] && target[name].__type__ == 'property';
        if (meta.dependencies) {
            if (nx.is(meta.dependencies, "String")) {
                meta.dependencies = meta.dependencies.replace(/\s/g, "").split(",");
            }
            defaultValue = nx.keyword.binding({
                source: meta.dependencies,
                async: true,
                callback: function () {
                    var owner = this.owner;
                    if (meta.update) {
                        meta.update.apply(owner, arguments);
                    }
                    if (nx.is(meta.value, "Function")) {
                        owner.set(name, meta.value.apply(owner, arguments));
                    } else if (!meta.update && !meta.value) {
                        owner.set(name, arguments[0]);
                    }
                }
            });
        } else {
            defaultValue = meta.value;
        }

        if (target[name] && meta.inherits) {
            meta = nx.extend({}, target[name].__meta__, meta);
        }

        var fn = function (value, params) {
            if (value === undefined && arguments.length === 0) {
                return fn.__getter__.call(this, params);
            } else {
                return fn.__setter__.call(this, value, params);
            }
        };

        fn.__name__ = name;
        fn.__type__ = 'property';
        fn.__meta__ = meta;
        fn.__getter__ = meta.get || function () {
            return this['_' + name];
        };

        fn.__setter__ = meta.set || function (value) {
            this['_' + name] = value;
        };

        fn.getMeta = function (key) {
            return key ? fn.__meta__[key] : fn.__meta__;
        };

        if (nx.is(target, "Function") && target.__properties__ && !target.__static__) {
            target.prototype[name] = fn;
        } else {
            target[name] = fn;
        }

        if (defaultValue !== undefined) {
            target.__defaults__[name] = defaultValue;
        }

        if (!exist) {
            if (!nx.is(target, "Function") && target.__properties__ === target.constructor.__properties) {
                target.__properties__ = target.__properties__.slice();
            }
            target.__properties__.push(name);
        }

        return fn;
    }

    /**
     * Define a method and attach to target.
     * @method extendMethod
     * @static
     * @param target {Object}
     * @param name {String}
     * @param method {Function}
     */
    function extendMethod(target, name, method) {
        var exist = target[name] && target[name].__type__ == 'method';

        if (target[name] && target[name] !== method) {
            method.__super__ = target[name];
        }

        method.__name__ = name;
        method.__type__ = 'method';
        method.__meta__ = {};

        target[name] = method;

        if (!exist) {
            target.__methods__.push(name);
        }
    }

    /**
     * Define a class
     * @method define
     * @param [type] {String}
     * @param [parent] {Function}
     * @param [members] {Object}
     * @returns {Function}
     */
    function define(type, parent, members) {
        if (!members) {
            if (nx.is(parent, 'Object')) {
                members = parent;
                parent = null;

                if (nx.is(type, 'Function')) {
                    parent = type;
                    type = null;
                }
            } else if (!parent) {
                if (nx.is(type, 'Object')) {
                    members = type;
                    type = null;
                } else if (nx.is(type, 'Function')) {
                    parent = type;
                    type = null;
                }
            }
        }

        members = members || {};

        var sup = parent || NXObject;
        var mixins = members.mixins || [];
        var events = members.events || [];
        var props = members.properties || {};
        var methods = members.methods || {};
        var static = members.static || false;
        var statics = members.statics || {};
        var prototype;
        var key, i, length;
        var Class, SuperClass;

        if (nx.is(mixins, 'Function')) {
            mixins = [mixins];
        }

        if (sup.__static__) {
            throw new Error('Static class cannot be inherited.');
        }

        if (static) {
            Class = function () {
                throw new Error('Cannot instantiate static class.');
            };

            Class.__classId__ = classId++;
            Class.__className__ = type ? type : 'Anonymous';
            Class.__static__ = true;
            Class.__events__ = [];
            Class.__properties__ = [];
            Class.__methods__ = [];
            Class.__defaults__ = {};

            for (i = 0, length = events.length; i < length; i++) {
                extendEvent(Class, events[i]);
            }

            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    extendProperty(Class, key, props[key]);
                }
            }

            for (key in methods) {
                if (methods.hasOwnProperty(key)) {
                    extendMethod(Class, key, methods[key]);
                }
            }

            for (key in statics) {
                if (statics.hasOwnProperty(key)) {
                    Class[key] = statics[key];
                }
            }

            nx.each(Class.__defaults__, function (value, name) {
                if (nx.is(value, "Function")) {
                    this["_" + name] = value.call(this);
                } else if (nx.is(value, nx.keyword.internal.Keyword)) {
                    switch (value.type) {
                    case "binding":
                        // FIXME memory leak
                        value.apply(this, name);
                        break;
                    }
                } else {
                    this["_" + name] = value;
                }
            }, Class);

            if (methods.init) {
                methods.init.call(Class);
            }
        } else {
            Class = function () {
                // get the real arguments
                var args = arguments[0];
                if (Object.prototype.toString.call(args) !== "[object Arguments]") {
                    args = arguments;
                }

                var mixins = this.__mixins__;
                this.__id__ = instanceId++;
                this.__listeners__ = {};
                this.__bindings__ = this.__bindings__ || {};
                this.__watchers__ = this.__watchers__ || {};
                this.__keyword_bindings__ = this.__keyword_bindings__ || [];
                this.__keyword_watchers__ = this.__keyword_watchers__ || {};
                this.__keyword_init__ = this.__keyword_init__ || [];

                this.__initializing__ = true;

                for (var i = 0, length = mixins.length; i < length; i++) {
                    var ctor = mixins[i].__ctor__;
                    if (ctor) {
                        ctor.call(this);
                    }
                }

                nx.each(Class.__defaults__, function (value, name) {
                    if (nx.is(value, "Function")) {
                        this["_" + name] = value.call(this);
                    } else if (nx.is(value, nx.keyword.internal.Keyword)) {
                        // FIXME memory leak
                        // FIXME bind order
                        this.__keyword_bindings__.push({
                            name: name,
                            definition: value
                        });
                    } else {
                        this["_" + name] = value;
                    }
                }, this);

                nx.each(Class.__properties__, function (name) {
                    var prop = this[name];
                    if (!prop || prop.__type__ !== "property") {
                        return;
                    }
                    var meta = prop.__meta__,
                        watcher = meta.watcher,
                        init = meta.init;
                    if (watcher && this.watch) {
                        if (nx.is(watcher, "String")) {
                            watcher = this[watcher];
                        }
                        this.watch(name, watcher.bind(this));
                        this.__keyword_watchers__[name] = watcher;
                    }
                    if (init) {
                        this.__keyword_init__.push(init);
                    }
                }, this);

                nx.each(this.__keyword_bindings__, function (binding) {
                    binding.instance = binding.definition.apply(this, binding.name);
                }, this);

                nx.each(this.__keyword_init__, function (init) {
                    init.apply(this, args);
                }, this);

                if (this.__ctor__) {
                    this.__ctor__.apply(this, args);
                }

                nx.each(this.__keyword_watchers__, function (watcher, name) {
                    watcher.call(this, name, this[name].call(this));
                }, this);

                nx.each(this.__keyword_bindings__, function (binding) {
                    binding.instance.notify();
                }, this);

                this.__initializing__ = false;
            };

            SuperClass = function () {};

            SuperClass.prototype = sup.prototype;
            prototype = new SuperClass();
            prototype.constructor = Class;
            prototype.__events__ = sup.__events__.slice(0);
            prototype.__properties__ = sup.__properties__.slice(0);
            prototype.__methods__ = sup.__methods__.slice(0);
            prototype.__defaults__ = nx.clone(sup.__defaults__);
            prototype.__mixins__ = sup.__mixins__.concat(mixins);

            Class.__classId__ = classId++;
            Class.__className__ = prototype.__className__ = type ? type : 'Anonymous';
            Class.__super__ = prototype.__super__ = sup;
            Class.prototype = prototype;

            if (methods.init) {
                prototype.__ctor__ = methods.init;
            }

            for (key in members) {
                if (members.hasOwnProperty(key)) {
                    prototype[metaPrefix + key] = Class[metaPrefix + key] = members[key];
                }
            }

            nx.each(mixins, function (mixin) {
                var mixinPrototype = mixin.prototype;

                nx.each(mixin.__events__, function (name) {
                    extendEvent(prototype, name);
                });

                nx.each(mixin.__properties__, function (name) {
                    extendProperty(prototype, name, mixinPrototype[name].__meta__);
                });

                nx.each(mixin.__methods__, function (name) {
                    if (name !== 'init' && name !== 'dispose') {
                        extendMethod(prototype, name, mixinPrototype[name]);
                    }
                });
            });

            for (i = 0, length = events.length; i < length; i++) {
                extendEvent(prototype, events[i]);
            }

            for (key in props) {
                if (props.hasOwnProperty(key)) {
                    extendProperty(prototype, key, props[key]);
                }
            }

            for (key in methods) {
                if (methods.hasOwnProperty(key)) {
                    extendMethod(prototype, key, methods[key]);
                }
            }

            for (key in statics) {
                if (statics.hasOwnProperty(key)) {
                    Class[key] = statics[key];
                }
            }

            Class.__ctor__ = prototype.__ctor__;
            Class.__events__ = prototype.__events__;
            Class.__properties__ = prototype.__properties__;
            Class.__methods__ = prototype.__methods__;
            Class.__defaults__ = prototype.__defaults__;
            Class.__mixins__ = prototype.__mixins__;
        }

        if (type) {
            nx.path(global, type, Class);
        }

        classes[Class.__classId__] = Class;
        return Class;
    }

    nx.Object = NXObject;
    nx.define = define;
    nx.classes = classes;

})(nx);
