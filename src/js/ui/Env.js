(function (nx) {
    //@https://github.com/yui/yui3/blob/master/src/yui/js/yui-ua.js
    var window = nx.global,
        document = window.document,
        documentMode = document.documentMode || 0,
        compatMode = document.compatMode,
        navigator = window.navigator,
        location = window.location,
        userAgent = navigator.userAgent.toLowerCase(),
        protocol = location.protocol.toLowerCase();
    var tempElement = document.createElement('div'),
        tempStyle = tempElement.style,
        result,
        ie = (result = userAgent.match(/msie (\d+)\./)) && result[1];

    //test opacity:
    tempStyle.cssText = "opacity:.55";

    var vendorPrefixMap = {
        'webkit': ['webkit', '-webkit-'],
        'gecko': ['Moz', '-moz-'],
        'presto': ['O', '-o-'],
        'trident': ['ms', '-ms-']
    };

    var osPatternMap = {
        'windows': /windows|win32/,
        'macintosh': /macintosh|mac_powerpc/,
        'linux': /linux/
    };

    var supportMap = {
        addEventListener: !! document.addEventListener,
        dispatchEvent: !! document.dispatchEvent,
        getBoundingClientRect: !! document.documentElement.getBoundingClientRect,
        onmousewheel: 'onmousewheel' in document,
        XDomainRequest: !! window.XDomainRequest,
        crossDomain: !! (window.XDomainRequest || window.XMLHttpRequest),
        getComputedStyle: 'getComputedStyle' in window,
        iePropertyChange: !! (ie && ie < 9),
        w3cChange: !ie || ie > 8,
        w3cFocus: !ie || ie > 8,
        w3cInput: !ie || ie > 9,
        innerText: 'innerText' in tempElement,
        firstElementChild: 'firstElementChild' in tempElement,
        cssFloat: 'cssFloat' in tempStyle,
        opacity: (/^0.55$/).test(tempStyle.opacity),
        filter: 'filter' in tempStyle,
        classList: !! tempElement.classList,
        removeProperty: 'removeProperty' in tempStyle,
        touch:'ontouchstart' in document.documentElement
    };

    var engineMap = {
        firefox: function () {
            return {
                name: 'gecko',
                version: getVersion('rv:')
            };
        },
        opera: function () {
            var version = getVersion('presto\\/');
            var engineName = 'presto';
            if (!version) {
                engineName = 'webkit';
                version = getVersion('webkit\\/');
            }
            return {
                name: engineName,
                version: version
            };
        },
        ie: function () {
            return {
                name: 'trident',
                version: getVersion('trident\\/') || 4
            };
        },
        'default': function () {
            return {
                name: 'webkit',
                version: getVersion('webkit\\/')
            };
        }
    };

    function getVersion(pattern) {
        var regexp = new RegExp(pattern + '(\\d+\\.\\d+)');
        var regexResult;
        return (regexResult = regexp.exec(userAgent)) ? parseFloat(regexResult[1]) : 0;
    }

    var os = (function () {
        var osName;
        for (osName in osPatternMap) {
            if (osPatternMap[osName].test(userAgent)) {
                break;
            }
        }
        return {
            name: osName
        };
    })();

    var browser = (function () {
        var browserName,
            item,
            checkIs,
            checkExclude,
            browserVersion = 0;

        for (browserName in browserPatternMap) {
            item = browserPatternMap[browserName];
            checkIs = (new RegExp(item.is)).test(userAgent);
            checkExclude = (new RegExp(item.exclude)).test(userAgent);
            if (checkIs && !checkExclude) {
                if (userAgent.indexOf('opr/') > -1) {
                    browserName = 'opera';
                    item.version = '\\bopr\/';
                }
                browserVersion = getVersion(item.version);
                break;
            }
        }

        return {
            name: browserName,
            version: browserVersion
        };
    })();

    var browserPatternMap = {
        ie: {
            is: 'msie',
            exclude: 'opera',
            version: 'msie '
        },
        firefox: {
            is: 'gecko',
            exclude: 'webkit',
            version: '\\bfirefox\/'
        },
        chrome: {
            is: '\\bchrome\\b',
            exclude: null,
            version: '\\bchrome\/'
        },
        safari: {
            is: 'safari',
            exclude: '\\bchrome\\b',
            version: 'version\/'
        },
        opera: {
            is: 'opera',
            exclude: null,
            version: 'version\/'
        }
    };


    var keyMap = {
        BACKSPACE: 8,
        TAB: 9,
        CLEAR: 12,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        META: (browser.name === "chrome" || browser.name === "webkit" || browser.name === "safari") ? 91 : 224, // the apple key on macs
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT_ARROW: 37,
        UP_ARROW: 38,
        RIGHT_ARROW: 39,
        DOWN_ARROW: 40,
        INSERT: 45,
        DELETE: 46,
        HELP: 47,
        LEFT_WINDOW: 91,
        RIGHT_WINDOW: 92,
        SELECT: 93,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_PLUS: 107,
        NUMPAD_ENTER: 108,
        NUMPAD_MINUS: 109,
        NUMPAD_PERIOD: 110,
        NUMPAD_DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        F13: 124,
        F14: 125,
        F15: 126,
        NUM_LOCK: 144,
        SCROLL_LOCK: 145
    };


    var engine = (engineMap[browser] || engineMap['default'])();

    /**
     * Environment and check behavior support
     * @class nx.Env
     * @namespace nx.ui
     * @module nx.ui
     * @constructor
     */
    nx.define('nx.Env', {
        static: true,
        properties: {
            /**
             * Document mode
             * @property documentMode
             * @type {Number}
             * @default 0
             */
            documentMode: {
                value: documentMode
            },
            /**
             * Document compatMode
             * @property compatMode
             * @type {String}
             * @default "CSS1Compat"
             */
            compatMode: {
                value: compatMode
            },
            /**
             * User agent string
             * @property userAgent
             * @type {String}
             * @default ""
             */
            userAgent: {
                value: userAgent
            },
            /**
             * Browser render model CSS1Compat
             * @property strict
             * @type {Boolean}
             * @default true
             */
            strict: {
                value: compatMode === 'CSS1Compat'
            },
            /**
             * If it is secure
             * @property strict
             * @type {Boolean}
             * @default false
             */
            secure: {
                value: protocol.indexOf('https') === 0
            },
            /**
             * Get operating system information
             * @property os
             * @type {Object}
             * @default {}
             */
            os: {
                value: os
            },
            /**
             * Get specific prefix
             * @property prefix
             * @type {Array}
             * @default ['webkit','-webkit-']
             */
            prefix: {
                value: vendorPrefixMap[engine.name]
            },
            /**
             * Get browser's render engine information
             * @property engine
             * @type {Object}
             * @default {}
             */
            engine: {
                value: engine
            },
            /**
             * Get basic browser information
             * @property browser
             * @type {Object}
             * @default {}
             */
            browser: {
                value: browser
            },
            /**
             * Get keyboard key code map.
             * @property keyMap
             * @type {Object}
             * @default {}
             */
            keyMap: {
                value: keyMap
            }
        },
        methods: {
            /**
             * Whether the property is support
             * @method support
             * @param inName
             * @returns {*}
             */
            support: function (inName) {
                return supportMap[inName];
            },
            /**
             * Support map for debug
             * @method getSupportMap
             * @returns {{addEventListener: boolean, dispatchEvent: boolean, getBoundingClientRect: boolean, onmousewheel: boolean, XDomainRequest: boolean, crossDomain: boolean, getComputedStyle: boolean, iePropertyChange: boolean, w3cChange: boolean, w3cFocus: boolean, w3cInput: boolean, innerText: boolean, firstElementChild: boolean, cssFloat: boolean, opacity: boolean, filter: boolean, removeProperty: boolean}}
             */
            getSupportMap: function () {
                return supportMap;
            },
            /**
             * Register a support item
             * @method registerSupport
             * @param inName
             * @param inValue
             */
            registerSupport: function (inName, inValue) {
                if (!(inName in supportMap)) {
                    supportMap[inName] = inValue;
                }
            }
        }
    });

})(nx);
