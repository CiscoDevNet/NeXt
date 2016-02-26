(function(nx) {
    var Element = nx.dom.Element;
    var Fragment = nx.dom.Fragment;
    var Text = nx.dom.Text,
        global = nx.global,
        document = global.document,
        util = nx.Util;

    var readyModel = {
        topFrame: null,
        hasReady: false,
        queue: [],
    };

    var readyService = {
        setHasReady: function(inValue) {
            readyModel.hasReady = inValue;
        },
        getHasReady: function() {
            return readyModel.hasReady;
        },
        addQueue: function(inHandler) {
            readyModel.queue.push(inHandler);
        },
        clearQueue: function() {
            readyModel.queue.length = 0;
        },
        execQueue: function() {
            var i = 0,
                length = readyModel.queue.length;
            for (; i < length; i++) {
                readyModel.queue[i]();
            }
        },
        setTopFrame: function(inValue) {
            readyModel.topFrame = inValue;
        },
        getTopFrame: function() {
            return readyModel.topFrame;
        }
    };

    var readyController = {
        initReady: function(inHandler) {
            readyService.addQueue(inHandler); //save the event
            return readyController.isReady();
        },
        fireReady: function() {
            readyService.execQueue();
            readyService.clearQueue();
        },
        setTopFrame: function() {
            // If IE and not a frame
            // continually check to see if the document is ready
            try {
                readyService.setTopFrame(global.frameElement === null && document.documentElement);
            } catch (e) {}
        },
        doScrollCheck: function() {
            var topFrame = readyService.getTopFrame();
            if (topFrame && topFrame.doScroll) {
                try {
                    // Use the trick by Diego Perini
                    // http://javascript.nwbox.com/IEContentLoaded/
                    topFrame.doScroll("left");
                } catch (e) {
                    return setTimeout(readyController.doScrollCheck, 50);
                }

                // and execute any waiting functions
                readyController.fireReady();
            }
        },
        isOnLoad: function(inEvent) {
            return (inEvent || global.event).type === 'load';
        },
        isReady: function() {
            return readyService.getHasReady() || document.readyState === "complete";
        },
        detach: function() {
            if (document.addEventListener) {
                document.removeEventListener("DOMContentLoaded", readyController.completed, false);
                global.removeEventListener("load", readyController.completed, false);
            } else {
                document.detachEvent("onreadystatechange", readyController.completed);
                global.detachEvent("onload", readyController.completed);
            }
        },
        w3cReady: function() {
            document.addEventListener('DOMContentLoaded', readyController.completed, false);
            global.addEventListener('load', readyController.completed, false);
        },
        ieReady: function() {
            document.attachEvent("onreadystatechange", readyController.completed);
            global.attachEvent("onload", readyController.completed);
            readyController.setTopFrame();
            readyController.doScrollCheck();
        },
        readyMain: function() {
            if (document.readyState === "complete") {
                return setTimeout(readyController.readyMain);
            } else {
                if (document.addEventListener) {
                    //w3c
                    readyController.w3cReady();
                } else {
                    //old ie
                    readyController.ieReady();
                }
            }
        },
        completed: function(inEvent) {
            if (readyController.isReady() || readyController.isOnLoad(inEvent)) {
                readyService.setHasReady(true);
                readyController.detach();
                readyController.fireReady();
            }
        }
    };

    var nsMap = {
        svg: "http://www.w3.org/2000/svg",
        xlink: "http://www.w3.org/1999/xlink",
        xhtml: "http://www.w3.org/1999/xhtml"
    };

    /**
     * Document Element
     * @class nx.dom.Document
     * @constructor
     */
    var Document = nx.define('nx.dom.Document', {
        static: true,
        properties: {
            /**
             * Get/set next cssStyle sheet
             * @property cssStyleSheet
             * @type {Object}
             * @default {}
             */
            cssStyleSheet: {
                get: function() {
                    var nxCssStyleSheet = this._cssStyleSheet;
                    if (!nxCssStyleSheet) {
                        var styleNode = document.getElementById('nx-style') || this._createStyleNode();
                        nxCssStyleSheet = this._cssStyleSheet = this._getCSSStyleSheetInstance(styleNode);
                    }
                    return nxCssStyleSheet;
                }
            },
            /**
             * Get document root element
             * @property root
             * @type {Object}
             * @default {}
             */
            root: {
                get: function() {
                    return document.documentElement;
                }
            },
            /**
             * Get next body element
             * @property body
             * @type {Object}
             * @default {}
             */
            body: {
                get: function() {
                    return new Element(document.body);
                }
            },
            html: {
                get: function() {
                    return new Element(document.getElementsByTagName('html')[0]);
                }
            }
        },
        methods: {
            init: function() {
                this.__listeners__ = {};
                this._documentListeners = {};
            },
            /**
             * Add an event handler.
             * @method on
             * @param name {String}
             * @param handler {Function}
             * @param [context] {Object}
             */
            on: function(name, handler, context) {
                var map = this.__listeners__;
                var listeners = map[name] = map[name] || [{
                    owner: null,
                    handler: null,
                    context: null
                }];

                listeners.push({
                    owner: this,
                    handler: handler,
                    context: context || this
                });

                this._attachDocumentListeners(name);

                var self;
                return {
                    release: function() {
                        self.off(name, handler, context);
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
            off: function(name, handler, context) {
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
            upon: function(name, handler, context) {
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

                this._attachDocumentListeners(name);
            },
            /**
             * Trigger an event.
             * @method fire
             * @param name {String}
             * @param [data] {*}
             */
            fire: function(name, data) {
                var listeners = this.__listeners__[name],
                    listener, result;
                if (listeners) {
                    listeners = listeners.slice();
                    for (var i = 0, length = listeners.length; i < length; i++) {
                        listener = listeners[i];
                        if (listener && listener.handler) {
                            result = listener.handler.call(listener.context, listener.owner, data);
                            if (result === false) {
                                return false;
                            }
                        }
                    }
                }
            },
            /**
             * Register html tag namespace
             * @method registerNS
             * @param key
             * @param value
             */
            registerNS: function(key, value) {
                nsMap[key] = value;
            },
            /**
             * Get a tag namespace value
             * @method resolveNS
             * @param key
             * @returns {*}
             */
            resolveNS: function(key) {
                return nsMap[key];
            },
            /**
             * Create document fragment
             * @method createFragment
             * @returns {nx.dom.Fragment}
             */
            createFragment: function() {
                return new Fragment(document.createDocumentFragment());
            },
            /**
             * Create element
             * @method createElement
             * @param tag
             * @returns {nx.dom.Element}
             */
            createElement: function(tag) {
                return new Element(document.createElement(tag));
            },
            /**
             * Create text node.
             * @method createText
             * @param text
             * @returns {nx.dom.Text}
             */
            createText: function(text) {
                return new Text(document.createTextNode(text));
            },
            /**
             * Create element by namespace
             * @method createElementNS
             * @param ns
             * @param tag
             * @returns {nx.dom.Element}
             */
            createElementNS: function(ns, tag) {
                var uri = Document.resolveNS(ns);
                if (uri) {
                    return new Element(document.createElementNS(uri, tag));
                } else {
                    throw new Error('The namespace ' + ns + ' is not registered.');
                }
            },
            /**
             * Wrap dom element to next element
             * @method wrap
             * @param dom
             * @returns {*}
             */
            wrap: function(dom) {
                if (nx.is(dom, Node)) {
                    return dom;
                } else {

                }
            },
            /**
             * Get document position information
             * @method docRect
             * @returns {{width: (Function|number), height: (Function|number), scrollWidth: *, scrollHeight: *, scrollX: *, scrollY: *}}
             */
            docRect: function() {
                var root = this.root(),
                    height = global.innerHeight || 0,
                    width = global.innerWidth || 0,
                    scrollW = root.scrollWidth,
                    scrollH = root.scrollHeight,
                    scrollXY = {
                        left: Math.max((global.pageXOffset || 0), root.scrollLeft),
                        top: Math.max((global.pageYOffset || 0), root.scrollTop)
                    };
                scrollW = Math.max(scrollW, width);
                scrollH = Math.max(scrollH, height);
                return {
                    width: width,
                    height: height,
                    scrollWidth: scrollW,
                    scrollHeight: scrollH,
                    scrollX: scrollXY.left,
                    scrollY: scrollXY.top
                };
            },
            /**
             * Dom ready
             * @method ready
             * @param inHandler
             */
            ready: function(inHandler) {
                //add handler to queue:
                if (readyController.initReady(inHandler)) {
                    setTimeout(readyController.fireReady, 1);
                } else {
                    readyController.readyMain();
                }
            },
            /**
             * Add a rule to next style sheet
             * @method addRule
             * @param inSelector
             * @param inCssText
             * @param inIndex
             * @returns {*}
             */
            addRule: function(inSelector, inCssText, inIndex) {
                var cssText = inSelector + "{" + inCssText + "}";
                return this._ruleAction('insert', [cssText, inIndex]);
            },
            /**
             * insert a rule to next style sheet
             * @method insertRule
             * @param inFullCssText
             * @param inIndex
             * @returns {*}
             */
            insertRule: function(inFullCssText, inIndex) {
                return this._ruleAction('insert', [inFullCssText, inIndex]);
            },
            /**
             * Delete a rule from next style sheet at last line
             * @method deleteRule
             * @param inIndex
             * @returns {*}
             */
            deleteRule: function(inIndex) {
                return this._ruleAction('delete', [inIndex]);
            },
            /**
             * Remove a rule from next style sheet
             * @method removeRule
             * @param inSelector
             * @param inIndex
             * @returns {*}
             */
            removeRule: function(inSelector, inIndex) {
                return this._ruleAction('remove', [inSelector, inIndex]);
            },
            /**
             * Add multi rules
             * @method addRules
             * @param inRules
             */
            addRules: function(inRules) {
                nx.each(inRules, function(rule, selector) {
                    this.addRule(selector, util.getCssText(rule), null);
                }, this);
            },
            /**
             * Delete all rules
             * @method deleteRules
             */
            deleteRules: function() {
                var defLength = this.cssStyleSheet().rules.length;
                while (defLength--) {
                    this.deleteRule(0);
                }
            },
            _ruleAction: function(inAction, inArgs) {
                var styleSheet = this.cssStyleSheet();
                var lastIndex = inArgs.length - 1;
                //set default index
                inArgs[lastIndex] = this._defRuleIndex(styleSheet, inArgs[lastIndex]);
                styleSheet[inAction + 'Rule'].apply(styleSheet, inArgs);
                return this._defRuleIndex(styleSheet, null);
            },
            _defRuleIndex: function(inStyleSheet, inIndex) {
                var rules = inStyleSheet.rules ||inStyleSheet.cssRules;
                return inIndex == null ? rules.length : inIndex;
            },
            _createStyleNode: function() {
                var styleNode = document.createElement("style");
                styleNode.type = "text/css";
                styleNode.id = "nx-style";
                (document.head || document.getElementsByTagName("head")[0] || document.documentElement).appendChild(styleNode);
                return styleNode;
            },
            _getCSSStyleSheetInstance: function(inStyleNode) {
                var styleSheets = document.styleSheets,
                    key,
                    sheet = null;
                for (key in styleSheets) {
                    sheet = styleSheets[key];
                    if (sheet.ownerNode === inStyleNode) {
                        break;
                    }
                }
                return sheet;
            },
            _attachDocumentListeners: function(name) {
                var documentListeners = this._documentListeners;
                if (!(name in documentListeners)) {
                    var self = this;
                    var listener = documentListeners[name] = function(event) {
                        self.fire(name, event);
                    };

                    document.addEventListener(name, listener);
                }
            }
        }
    });
})(nx);