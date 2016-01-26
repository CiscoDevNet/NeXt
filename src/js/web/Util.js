(function (nx) {
    var global = nx.global,
        document = global.document,
        env = nx.Env;

    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style;
    var rsizeElement = /width|height|top|right|bottom|left|size|margin|padding/i,
        rHasUnit = /[c-x%]/,
        PX = 'px',
        rUpperCameCase = /(?:^|-)([a-z])/g,
        rDeCameCase = /([A-Z])/g;

    var cssNumber = {
        'lineHeight': true,
        'zIndex': true,
        'zoom': true
    };


    var styleHooks = {
        float: 'cssFloat'
    };

    var stylePropCache = {};
    var styleNameCache = {};

    nx.ready = function (clz) {
        var callback;
        if (typeof clz === "string") {
            clz = nx.path(global, clz);
        }
        if (typeof clz === "function") {
            if (clz.__classId__) {
                var App = nx.define(nx.ui.Application, {
                    properties: {
                        comp: {
                            value: function () {
                                return new clz();
                            }
                        }
                    },
                    methods: {
                        start: function () {
                            this.comp().attach(this);
                        },
                        stop: function () {
                            this.comp().detach(this);
                        }
                    }
                });
                callback = function () {
                    var app = new App();
                    app.start();
                };
            } else {
                callback = clz;
            }
            window.addEventListener("load", callback);
        }
    };

    /**
     * This is Util
     * @class nx.Util
     * @constructor
     */
    var util = nx.define('nx.Util', {
        static: true,
        methods: {
            /**
             * Get a string which is join by an style object.
             * @method getCssText
             * @param inStyles
             * @returns {string}
             */
            getCssText: function (inStyles) {
                var cssText = [''];
                nx.each(inStyles, function (styleValue, styleName) {
                    cssText.push(this.getStyleProperty(styleName, true) + ':' + this.getStyleValue(styleName, styleValue));
                }, this);
                return cssText.join(';');
            },
            /**
             * Get real value of the style name.
             * @method getStyleValue
             * @param inName
             * @param inValue
             * @returns {*}
             */
            getStyleValue: function (inName, inValue) {
                var property = this.getStyleProperty(inName);
                var value = inValue;
                if (rsizeElement.test(property)) {
                    if (!rHasUnit.test(inValue) && !cssNumber[property]) {
                        value += PX;
                    }
                }
                return value;
            },
            /**
             * Get compatible css property.
             * @method getStyleProperty
             * @param inName
             * @param isLowerCase
             * @returns {*}
             */
            getStyleProperty: function (inName, isLowerCase) {
                if (isLowerCase) {
                    if (inName in styleNameCache) {
                        return styleNameCache[inName];
                    }
                } else {
                    if (inName in stylePropCache) {
                        return stylePropCache[inName];
                    }
                }

                var property = styleHooks[inName] || this.lowerCamelCase(inName);
                if (property in tempStyle) {
                    if (isLowerCase) {
                        property = this.deCamelCase(inName);
                        styleNameCache[inName] = property;
                    }
                } else {
                    if (isLowerCase) {
                        property = env.prefix()[1] + inName;
                        styleNameCache[inName] = property;
                    } else {
                        property = env.prefix()[0] + this.upperCamelCase(inName);
                        stylePropCache[inName] = property;
                    }
                }
                return property;
            },
            /**
             * Lower camel case.
             * @method lowerCamelCase
             * @param inName
             * @returns {string}
             */
            lowerCamelCase: function (inName) {
                var _camelizeString = this.upperCamelCase(inName);
                return _camelizeString.charAt(0).toLowerCase() + _camelizeString.substring(1);
            },
            /**
             * Upper camel case.
             * @method upperCamelCase
             * @param inName
             * @returns {*|string|void}
             */
            upperCamelCase: function (inName) {
                return inName.replace(rUpperCameCase, function (match, group1) {
                    return group1.toUpperCase();
                });
            },
            /**
             * Decode camel case to '-' model.
             * @method deCamelCase
             * @param inName
             * @returns {*|string|void}
             */
            deCamelCase: function (inName) {
                return inName.replace(rDeCameCase, function (match, group1) {
                    return '-' + group1.toLowerCase();
                });
            },
            /**
             * Upper first word of a string.
             * @method capitalize
             * @param inString
             * @returns {string}
             */
            capitalize: function (inString) {
                return inString.charAt(0).toUpperCase() + inString.slice(1);
            }
        }
    });
})(nx);
