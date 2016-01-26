(function (nx) {
    var global = nx.global;
    var Binding = nx.Binding;
    var Collection = nx.data.Collection;
    var Document = nx.dom.Document;

    function extractBindingExpression(value) {
        if (nx.is(value, 'String')) {
            var start = value.indexOf('{');
            var end = value.indexOf('}');

            if (start >= 0 && end > start) {
                return value.slice(start + 1, end);
            }
        }

        return null;
    }

    function setProperty(target, name, value, source, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, nx.extend(value.gets(), {
                bindingType: 'property'
            }));
        } else {
            var expr = extractBindingExpression(value);
            if (expr !== null) {
                if (expr[0] === '#') {
                    target.setBinding(name, expr.slice(1) + ',bindingType=property', owner || target);
                } else {
                    target.setBinding(name, (expr ? 'model.' + expr : 'model') + ',bindingType=property', source || target);
                }
            } else {
                target.set(name, value);
            }
        }
    }

    function setEvent(target, name, value, source, owner) {
        if (nx.is(value, Binding)) {
            target.setBinding(name, value.gets());
        } else {
            var expr = extractBindingExpression(value);
            if (expr !== null) {
                if (expr[0] === '#') {
                    target.setBinding(name, expr.slice(1) + ',bindingType=event', owner || target);
                } else {
                    target.setBinding(name, (expr ? 'model.' + expr : 'model') + ',bindingType=event', source || target);
                }
            } else {
                target.on(name, value, owner || target);
            }
        }
    }

    function createComponent(view, owner) {
        if (view || view === 0) {
            var comp;
            if (nx.is(view, 'Array')) {
                comp = new DOMComponent('fragment');

                nx.each(view, function (child) {
                    createComponent(child, owner).attach(comp);
                });
            } else if (nx.is(view, 'Object')) {
                var type = view.type;
                if (type) {
                    var clazz = nx.is(type, 'String') ? nx.path(global, type) : type;
                    if (nx.is(clazz, 'Function')) {
                        comp = new clazz();
                    } else {
                        throw new Error('Component "' + type + '" is not defined.');
                    }
                } else {
                    comp = new DOMComponent(view.tag || 'div');
                }

                var name = view.name;
                var props = view.props;
                var events = view.events;
                var content = view.content;

                if (name) {
                    comp.register('@name', name);
                }

                if (owner) {
                    comp.owner(owner);
                }

                nx.each(events, function (value, name) {
                    setEvent(comp, name, value, comp, owner);
                });

                nx.each(props, function (value, name) {
                    if (nx.is(value, 'Array')) {
                        nx.each(value, function (item) {
                            if (nx.is(item, 'Object')) {
                                item.__owner__ = owner;
                            }
                        });
                    }

                    if (nx.is(value, 'Object')) {
                        value.__owner__ = owner;
                    }

                    setProperty(comp, name, value, comp, owner);
                });

                if (content !== undefined) {
                    setProperty(comp, 'content', content, comp, owner);
                }
            } else {
                comp = new DOMComponent('text', view);
            }

            return comp;
        }

        return null;
    }

    /**
     * @class Collection
     * @namespace nx.ui
     * @extends nx.Observable
     */
    var AbstractComponent = nx.define('nx.ui.AbstractComponent', nx.Observable, {
        abstract: true,
        statics: {
            /**
             * Create component by json view.
             * @method createComponent
             * @static
             */
            createComponent: createComponent
        },
        events: ['enter', 'leave', 'contententer', 'contentleave'],
        properties: {
            /**
             * @property count
             * @type {nx.data.Collection}
             */
            content: {
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    nx.each(this._content.toArray(), function (c) {
                        c.destroy();
                    });
                    if (nx.is(value, AbstractComponent)) {
                        value.attach(this);
                    } else if (nx.is(value, 'Array')) {
                        nx.each(value, function (v) {
                            createComponent(v, this.owner()).attach(this);
                        }, this);
                    } else if (value || value === 0) {
                        createComponent(value, this.owner()).attach(this);
                    }
                }
            },
            /**
             * @property model
             * @type {Any}
             */
            model: {
                get: function () {
                    return this._model_was_set ? this._model : this._inheritedModel;
                },
                set: function (value, inherited) {
                    if (inherited && this._model_was_set) {
                        return false;
                    }

                    if (inherited) {
                        this._inheritedModel = value;
                    } else {
                        this._model = value;
                        this._model_was_set = true;
                    }

                    this._content.each(function (c) {
                        if (!nx.is(c, 'String')) {
                            c.model(value, true);
                        }
                    });
                }
            },
            /**
             * @property owner
             * @type {nx.ui.AbstractComponent}
             */
            owner: {
                value: null
            },
            /**
             * @property parent
             * @type {nx.ui.AbstractComponent}
             */
            parent: {
                value: null
            }
        },
        methods: {
            init: function () {
                this.inherited();
                this._resources = {};
                this._content = new Collection();
            },
            /**
             * Attach the component to parent.
             * @method attach
             * @param parent
             * @param index
             */
            attach: function (parent, index) {
                this.detach();

                if (nx.is(parent, AbstractComponent)) {
                    var name = this.resolve('@name');
                    var owner = this.owner() || parent;

                    if (name) {
                        owner.register(name, this);
                    }

                    this.onAttach(parent, index);
                    parent.onChildAttach(this, index);

                    if (index >= 0) {
                        parent.content().insert(this, index);
                    } else {
                        parent.content().add(this);
                    }

                    this.parent(parent);
                    this.owner(owner);
                    parent.fire('contententer', {
                        content: this,
                        owner: owner
                    });
                    this.fire('enter', {
                        parent: parent,
                        owner: owner
                    });

                    this._attached = true;
                }
            },
            /**
             * Detach the component from parent.
             * @method detach
             */
            detach: function () {
                if (this._attached) {
                    var name = this.resolve('@name');
                    var owner = this.owner();
                    var parent = this.parent();

                    if (name) {
                        owner.unregister(name);
                    }

                    this.onDetach(parent);
                    parent.onChildDetach(this);
                    parent.content().remove(this);
                    this.parent(null);
                    this.owner(null);
                    parent.fire('contentleave', {
                        content: this,
                        owner: owner
                    });
                    this.fire('leave', {
                        parent: parent,
                        owner: owner
                    });
                    this._attached = false;
                }
            },
            /**
             * Register a resource.
             * @method register
             * @param name
             * @param value
             * @param force
             */
            register: function (name, value, force) {
                var resources = this._resources;
                if (resources && !(name in resources) || force) {
                    resources[name] = value;
                }
            },
            /**
             * Unregister a resource.
             * @method unregister
             * @param name
             */
            unregister: function (name) {
                var resources = this._resources;
                if (resources && name in resources) {
                    delete resources[name];
                }
            },
            /**
             * Resolve a resource.
             * @method resolve
             * @param name
             * @returns {Any}
             */
            resolve: function (name) {
                var resources = this._resources;
                if (resources && name in resources) {
                    return resources[name];
                }
            },
            /**
             * Get the container for component.
             * @method getContainer
             * @param comp
             * @returns {nx.dom.Element}
             */
            getContainer: function (comp) {
                if (this.resolve('@tag') === 'fragment') {
                    var parent = this.parent();
                    if (parent) {
                        return parent.getContainer(comp);
                    }
                }

                return this.resolve('@root');
            },
            /**
             * Dispose the component.
             * @method dispose
             */
            dispose: function () {
                this.inherited();
                if (this._content) {
                    this._content.each(function (content) {
                        content.dispose();
                    });
                }

                this._resources = null;
                this._content = null;
                this._model = null;
                this._inheritedModel = null;
                this.dispose = function () {};
            },
            /**
             * Destroy the component.
             * @method destroy
             */
            destroy: function () {
                this.detach();
                this.inherited();
            },
            /**
             * Template method for component attach.
             * @method onAttach
             */
            onAttach: function (parent, index) {},
            /**
             * Template method for component detach.
             * @method onDetach
             */
            onDetach: function (parent) {},
            /**
             * Template method for child component attach.
             * @method onChildAttach
             */
            onChildAttach: function (child, index) {},
            /**
             * Template method for child component detach.
             * @method onChildDetach
             */
            onChildDetach: function (child) {}
        }
    });

    /**
     * @class CssClass
     * @extends nx.Observable
     * @internal
     */
    var CssClass = nx.define(nx.Observable, {
        methods: {
            init: function (comp) {
                this.inherited();
                this._comp = comp;
                this._classList = [];
            },
            has: function (name) {
                return name in this._classList;
            },
            get: function (name) {
                return this._classList[name];
            },
            set: function (name, value) {
                this._classList[name] = value;
                this._comp.resolve('@root').set('class', this._classList.join(' '));
            },
            hasClass: function (name) {
                return this._classList.indexOf(name) >= 0;
            },
            addClass: function (name) {
                if (!this.hasClass(name)) {
                    this._classList.push(name);
                    this._comp.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            removeClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                    this._comp.resolve('@root').set('class', this._classList.join(' '));
                }
            },
            toggleClass: function (name) {
                var index = this._classList.indexOf(name);
                if (index >= 0) {
                    this._classList.splice(index, 1);
                } else {
                    this._classList.push(name);
                }

                this._comp.resolve('@root').set('class', this._classList.join(' '));
            },
            dispose: function () {
                this.inherited();
                this._comp = null;
                this._classList = null;
            }
        }
    });

    /**
     * @class CssStyle
     * @extends nx.Observable
     * @internal
     */
    var CssStyle = nx.define(nx.Observable, {
        methods: {
            init: function (comp) {
                this.inherited();
                this._comp = comp;
            },
            get: function (name) {
                return this._comp.resolve('@root').getStyle(name);
            },
            set: function (name, value) {
                this._comp.resolve('@root').setStyle(name, value);
            },
            dispose: function () {
                this.inherited();
                this._comp = null;
            }
        }
    });

    /**
     * @class DOMComponent
     * @extends nx.ui.AbstractComponent
     * @internal
     */
    var DOMComponent = nx.define(AbstractComponent, {
        final: true,
        events: ['generated'],
        properties: {
            /**
             * @property class
             * @type {CssClass}
             */
            'class': {
                get: function () {
                    return this._class;
                },
                set: function (value) {
                    var cssClass = this._class;
                    if (nx.is(value, 'Array')) {
                        nx.each(value, function (item, index) {
                            setProperty(cssClass, '' + index, item, this, value.__owner__ || this.owner());
                        }, this);
                    } else if (nx.is(value, 'Object')) {
                        if (value.add) {
                            this._class.addClass(value.add);
                        }
                        if (value.remove) {
                            this._class.addClass(value.remove);
                        }
                        if (value.toggle) {
                            this._class.addClass(value.toggle);
                        }
                    } else {
                        this.resolve('@root').set('class', value);
                    }
                }
            },
            /**
             * @property style
             * @type {CssStyle}
             */
            style: {
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (nx.is(value, 'Object')) {
                        var cssStyle = this._style;
                        nx.each(value, function (v, k) {
                            setProperty(cssStyle, k, v, this, value.__owner__ || this.owner());
                        }, this);
                    } else {
                        this.resolve('@root').set('style', value);
                    }
                }
            },
            /**
             * @property template
             */
            template: {
                get: function () {
                    return this._template;
                },
                set: function (value) {
                    this._template = value;
                    this._generateContent();
                }
            },
            /**
             * @property items
             */
            items: {
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    var items = this._items;
                    if (items && items.off) {
                        items.off('change', this._onItemsChange, this);
                    }
                    items = this._items = value;
                    if (items && items.on) {
                        items.on('change', this._onItemsChange, this);
                    }

                    this._generateContent();
                }
            },
            /**
             * @property value
             */
            value: {
                get: function () {
                    return this.resolve('@root').get('value');
                },
                set: function (value) {
                    return this.resolve('@root').set('value', value);
                },
                binding: {
                    direction: '<>'
                }
            },
            /**
             * @property states
             */
            states: {
                value: null
            },
            /**
             * @property dom
             */
            dom: {
                get: function () {
                    return this.resolve('@root');
                }
            }
        },
        methods: {
            init: function (tag, text) {
                this.inherited();
                this._domListeners = {};
                this._resources = {};
                this._content = new Collection();
                this._class = new CssClass(this);
                this._style = new CssStyle(this);

                if (tag) {
                    var tokens = tag.split(':');
                    if (tokens.length === 2) {
                        var ns = tokens[0];
                        tag = tokens[1];
                        this.register('@ns', ns);
                        this.register('@root', Document.createElementNS(ns, tag));
                    } else if (tag === 'text') {
                        this.register('@root', Document.createText(text));
                    } else if (tag === 'fragment') {
                        this.register('@root', Document.createFragment());
                    } else {
                        this.register('@root', Document.createElement(tag));
                    }

                    this.register('@tag', tag);
                }

                //Temp
                switch (tag) {
                case 'input':
                case 'textarea':
                    this.on('change', function (sender, event) {
                        switch (event.target.type) {
                        case 'checkbox':
                        case 'radio':
                            this.notify('checked');
                            break;
                        default:
                            this.notify('value');
                            break;
                        }
                    }, this);
                    this.on('input', function (sender, event) {
                        this.notify('value');
                    }, this);
                    break;
                case 'select':
                    this.on('change', function (sender, event) {
                        this.notify('selectedIndex');
                        this.notify('value');
                    }, this);
                    break;
                }
            },
            get: function (name) {
                if (this.has(name) || name.indexOf(':') >= 0) {
                    return this.inherited(name);
                } else {
                    return this.resolve('@root').get(name);
                }
            },
            set: function (name, value) {
                if (this.has(name) || name.indexOf(':') >= 0) {
                    this.inherited(name, value);
                } else {
                    this.resolve('@root').set(name, value);
                    this.notify(name);
                }
            },
            on: function (name, handler, context) {
                this._attachDomListener(name);
                return this.inherited(name, handler, context);
            },
            upon: function (name, handler, context) {
                this._attachDomListener(name);
                return this.inherited(name, handler, context);
            },
            dispose: function () {
                var root = this.resolve('@root');
                if (root) {
                    nx.each(this._domListeners, function (listener, name) {
                        if (name.charAt(0) === ':') {
                            root.removeEventListener(name.slice(1), listener, true);
                        } else {
                            root.removeEventListener(name, listener);
                        }
                    });
                }
                this.items(null);
                this._class.dispose();
                this._style.dispose();
                this.inherited();
                this._domListeners = null;
            },
            onAttach: function (parent, index) {
                var root = this.resolve('@root');
                if (root) {
                    var container = parent.getContainer(this);

                    if (index >= 0) {
                        var ref = parent.content().getItem(index);

                        if (ref && ref.resolve('@tag') === 'fragment') {
                            ref = ref.content().getItem(0);
                        }

                        if (ref) {
                            container.insertBefore(root, ref.resolve('@root'));
                        } else {
                            container.appendChild(root);
                        }
                    } else {
                        container.appendChild(root);
                    }

                    var states = this.states();
                    var enterState = null;
                    if (states) {
                        enterState = states.enter;
                    }

                    if (enterState) {
                        var cssText = root.$dom.style.cssText;
                        var transition = 'all ' + (enterState.duration || 500) + 'ms';
                        root.setStyles(nx.extend({
                            transition: transition
                        }, enterState));
                        this.upon('transitionend', function () {
                            root.removeStyle('transition');
                        });
                        setTimeout(function () {
                            root.$dom.style.cssText = cssText + ';transition: ' + transition;
                        }, 10);
                    }
                }
            },
            onDetach: function (parent) {
                var root = this.resolve('@root');
                if (root) {
                    var tag = this.resolve('@tag');
                    var self = this;

                    if (tag === 'fragment') {
                        nx.each(self.content(), function (child) {
                            root.appendChild(child.resolve('@root'));
                        });
                    } else {
                        var states = this.states();
                        var leaveState = null;
                        if (states) {
                            leaveState = states.leave;
                        }

                        if (leaveState) {
                            var cssText = root.$dom.style.cssText;
                            var transition = 'all ' + (leaveState.duration || 500) + 'ms';
                            root.setStyle('transition', transition);
                            setTimeout(function () {
                                root.setStyles(leaveState);
                            }, 10);
                            this.upon('transitionend', function () {
                                root.$dom.style.cssText = cssText;
                                parent.getContainer(this).removeChild(root);
                            });
                        } else {
                            parent.getContainer(this).removeChild(root);
                        }
                    }
                }
            },
            _attachDomListener: function (name) {
                var domListeners = this._domListeners;
                if (!(name in domListeners)) {
                    var self = this;
                    var root = this.resolve('@root');
                    var listener = domListeners[name] = function (event) {
                        self.fire(name, event);
                    };

                    if (name.charAt(0) === ':') {
                        root.addEventListener(name.slice(1), listener, true);
                    } else {
                        root.addEventListener(name, listener);
                    }
                }
            },
            _generateContent: function () {
                var template = this._template;
                var items = this._items;
                nx.each(this._content.toArray(), function (c) {
                    c.detach();
                    setTimeout(function () {
                        c.dispose();
                    }, 600);
                });

                if (template && items) {
                    nx.each(items, function (item) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this);
                    }, this);

                    this.fire('generated');
                }
            },
            _onItemsChange: function (sender, event) {
                var template = this._template;
                var action = event.action;
                var index = event.index;
                index = index >= 0 ? index : -1;
                if (action === 'add') {
                    nx.each(event.items, function (item, i) {
                        var comp = createComponent(template, this.owner());
                        comp.model(item);
                        comp.attach(this, index + i);
                    }, this);
                } else if (action === 'remove') {
                    nx.each(event.items, function (item) {
                        nx.each(this.content().toArray(), function (comp) {
                            if (comp.model() === item) {
                                comp.detach();
                            }
                        }, this);
                    }, this);
                } else if (action === 'replace') {
                    // XXX no need to handle if bind to model.value
                } else if (action === 'sort') {
                    var comparator = event.comparator;
                    var sortedContent = this.content().toArray().sort(function (a, b) {
                        return comparator(a.model(), b.model());
                    });

                    nx.each(sortedContent, function (comp) {
                        comp.attach(this);
                    }, this);
                } else {
                    this._generateContent();
                }
            }
        }
    });
})(nx);
