/**
 * @module nx
 */

var nx = {
    VERSION: '0.8',
    DEBUG: false,
    global: (function () {
        return this;
    }).call(null)
};


// prepare for cross browser
(function () {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (context) {
            var f = this;
            return function () {
                return f.apply(context, arguments);
            };
        };
    }
})();


(function (nx) {
    /**
     * @class nx
     * @static
     */


    var isArray = Array.isArray || function (target) {
        return target && target.constructor === Array;
    };
    var isPojo = function (obj) {
        var hasown = Object.prototype.hasOwnProperty;
        if (!obj || Object.prototype.toString(obj) !== "[object Object]" || obj.nodeType || obj === window) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasown.call(obj, "constructor") && !hasown.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        var key;
        for (key in obj) {}
        return key === undefined || hasown.call(obj, key);
    };

    /**
     * Extend target with properties from sources.
     * @method extend
     * @param target {Object} The target object to be extended.
     * @param source* {Object} The source objects.
     * @returns {Object}
     */
    nx.extend = function (target) {
        for (var i = 1, length = arguments.length; i < length; i++) {
            var arg = arguments[i];
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    target[key] = arg[key];
                }
            }
        }

        return target;
    };

    /**
     * Iterate over target and execute the callback with context.
     * @method each
     * @param target {Object|Array|Iterable} The target object to be iterate over.
     * @param callback {Function} The callback function to execute.
     * @param context {Object} The context object which act as 'this'.
     */
    nx.each = function (target, callback, context) {
        /* jshint -W014 */
        if (target && callback) {
            if (target.__each__) {
                target.__each__(callback, context);
            } else {
                // FIXME maybe some other array-like things missed here
                if (isArray(target) // normal Array
                    || Object.prototype.toString.call(target) === "[object Arguments]" // array-like: arguments
                    || nx.global.NodeList && target instanceof NodeList // array-like: NodeList
                    || nx.global.HTMLCollection && target instanceof HTMLCollection // array-like: HTMLCollection
                ) {
                    for (var i = 0, length = target.length; i < length; i++) {
                        if (callback.call(context, target[i], i) === false) {
                            break;
                        }
                    }
                } else {
                    for (var key in target) {
                        if (target.hasOwnProperty(key)) {
                            if (callback.call(context, target[key], key) === false) {
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    /**
     * Shallow clone target object.
     * @method clone
     * @param target {Object|Array} The target object to be cloned.
     * @returns {Object} The cloned object.
     */

    nx.clone = (function () {
        var deepclone = (function () {
            var get, put, top, keys, clone;
            get = function (map, key) {
                for (var i = 0; i < map.length; i++) {
                    if (map[i].key === key) {
                        return map[i].value;
                    }
                }
                return null;
            };
            put = function (map, key, value) {
                var i;
                for (i = 0; i < map.length; i++) {
                    if (map[i].key === key) {
                        map[i].value = value;
                        return;
                    }
                }
                map[i] = {
                    key: key,
                    value: value
                };
            };
            top = function (stack) {
                if (stack.length === 0) {
                    return null;
                }
                return stack[stack.length - 1];
            };
            keys = function (obj) {
                var keys = [];
                if (Object.prototype.toString.call(obj) == '[object Array]') {
                    for (var i = 0; i < obj.length; i++) {
                        keys.push(i);
                    }
                } else {
                    for (var key in obj) {
                        keys.push(key);
                    }
                }
                return keys;
            };
            clone = function (self) {
                // TODO clone DOM object
                if (window === self || document === self) {
                    // window and document cannot be clone
                    return null;
                }
                if (["null", "undefined", "number", "string", "boolean", "function"].indexOf(typeof self) >= 0) {
                    return self;
                }
                if (!isArray(self) && !isPojo(self)) {
                    return self;
                }
                var map = [],
                    stack = [],
                    origin = self,
                    dest = (isArray(self) ? [] : {});
                var stacktop, key, cached;
                // initialize the map and stack
                put(map, origin, dest);
                stack.push({
                    origin: origin,
                    dest: dest,
                    keys: keys(origin),
                    idx: 0
                });
                while (true) {
                    stacktop = top(stack);
                    if (!stacktop) {
                        // the whole object is cloned
                        break;
                    }
                    origin = stacktop.origin;
                    dest = stacktop.dest;
                    if (stacktop.keys.length <= stacktop.idx) {
                        // object on the stack top is cloned
                        stack.pop();
                        continue;
                    }
                    key = stacktop.keys[stacktop.idx++];
                    // clone an object
                    if (isArray(origin[key])) {
                        dest[key] = [];
                    } else if (isPojo(origin[key])) {
                        dest[key] = {};
                    } else {
                        dest[key] = origin[key];
                        continue;
                    }
                    // check if needn't deep into or cloned already
                    cached = get(map, origin[key]);
                    if (cached) {
                        dest[key] = cached;
                        continue;
                    }
                    // deep into the object
                    put(map, origin[key], dest[key]);
                    stack.push({
                        origin: origin[key],
                        dest: dest[key],
                        keys: keys(origin[key]),
                        idx: 0
                    });
                }
                return dest;
            };
            return clone;
        })();
        return function (target, cfg) {
            if (target) {
                if (target.__clone__) {
                    return target.__clone__(cfg);
                } else if (!cfg) {
                    if (nx.is(target, 'Array')) {
                        return target.slice(0);
                    } else {
                        var result = {};
                        for (var key in target) {
                            if (target.hasOwnProperty(key)) {
                                result[key] = target[key];
                            }
                        }

                        return result;
                    }
                } else {
                    // TODO more config options
                    return deepclone(target);
                }
            } else {
                return target;
            }
        };
    })();

    /**
     * Check whether target is specified type.
     * @method is
     * @param target {Object} The target object to be checked.
     * @param type {String|Function} The type could either be a string or a class object.
     * @returns {Boolean}
     */
    nx.is = function (target, type) {
        if (target && target.__is__) {
            return target.__is__(type);
        } else {
            switch (type) {
            case 'Undefined':
                return target === undefined;
            case 'Null':
                return target === null;
            case 'Object':
                return target && (typeof target === 'object');
            case 'String':
            case 'Boolean':
            case 'Number':
            case 'Function':
                return typeof target === type.toLowerCase();
            case 'Array':
                return isArray(target);
            case 'POJO':
                return isPojo(target);
            default:
                return target instanceof type;
            }
        }
    };

    /**
     * Get the specified property value of target.
     * @method get
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {*} The value.
     */
    nx.get = function (target, name) {
        if (target) {
            if (target.__get__) {
                return target.__get__(name);
            } else {
                return target[name];
            }
        }
    };

    /**
     * Set the specified property of target with value.
     * @method set
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @param value {*} The value to be set.
     */
    nx.set = function (target, name, value) {
        if (target) {
            if (target.__set__) {
                target.__set__(name);
            } else {
                target[name] = value;
            }
        }
    };

    /**
     * Get all properties of target.
     * @method gets
     * @param target {Object} The target Object.
     * @returns {Object} An object contains all keys and values of target.
     */
    nx.gets = function (target) {
        if (target) {
            if (target.__gets__) {
                return target.__gets__();
            } else {
                var result = {};
                for (var key in target) {
                    if (target.hasOwnProperty(key)) {
                        result[key] = target[key];
                    }
                }
                return result;
            }
        }
    };

    /**
     * Set a bunch of properties for target.
     * @method sets
     * @param target {Object} The target object.
     * @param dict {Object} An object contains all keys and values to be set.
     */
    nx.sets = function (target, dict) {
        if (target && dict) {
            if (target.__sets__) {
                target.__sets__(dict);
            } else {
                for (var key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        target[key] = dict[key];
                    }
                }
            }
        }
    };

    /**
     * Check whether target has specified property.
     * @method has
     * @param target {Object} The target object.
     * @param name {String} The property name.
     * @returns {Boolean}
     */
    nx.has = function (target, name) {
        if (target) {
            if (target.__has__) {
                return target.__has__(name);
            } else {
                return name in target;
            }
        } else {
            return false;
        }
    };

    /**
     * Compare target and source.
     * @method compare
     * @param target {Object} The target object.
     * @param source {Object} The source object.
     * @returns {Number} The result could be -1,0,1 which indicates the comparison result.
     */
    nx.compare = function (target, source) {
        if (target && target.__compare__) {
            return target.__compare__(source);
        } else {
            if (target === source) {
                return 0;
            } else if (target > source) {
                return 1;
            } else if (target < source) {
                return -1;
            }

            return 1;
        }
    };

    /**
     * Get value from target specified by a path and optionally set a value for it.
     * @method path
     * @param target {Object} The target object.
     * @param path {String} The path.
     * @param [value] {*} The value to be set.
     * @returns {*}
     */
    nx.path = function (target, path, value) {
        var result = target;
        if (path) {
            var tokens, token, length, i = 0;
            if (typeof path === "string") {
                tokens = path.split(".");
            } else if (isArray(path)) {
                tokens = path;
            } else {
                return target;
            }
            length = tokens.length;

            if (value === undefined) {
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    } else {
                        result = result[token];
                    }
                }
            } else {
                length -= 1;
                for (; result && i < length; i++) {
                    token = tokens[i];
                    if (result.__get__) {
                        result = result.__get__(token);
                    } else {
                        result = result[token] = result[token] || {};
                    }
                }

                token = tokens[i];
                if (result) {
                    if (result.__set__) {
                        result.__set__(token, value);
                    } else {
                        result[token] = value;
                    }

                    result = value;
                }
            }
        }

        return result;
    };

    nx.idle = function () {};

    nx.identity = function (i) {
        return i;
    };

    nx.uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    };


})(nx);
