(function (nx) {
    var AbstractComponent = nx.ui.AbstractComponent;

    /**
     * @class nx.ui.Component
     * @namespace nx.ui
     * @module nx.ui
     * @extends nx.ui.AbstractComponent
     */
    nx.define('nx.ui.Component', AbstractComponent, {
        properties: {
            model: {
                get: function () {
                    return this._model === undefined ? this._inheritedModel : this._model;
                },
                set: function (value, inherited) {
                    if (inherited) {
                        this._inheritedModel = value;
                    } else {
                        this._model = value;
                    }

                    var view = this.view();
                    if (view) {
                        view.model(value, true);
                    }

                    var content = this._content;
                    if (content) {
                        content.each(function (c) {
                            if (!nx.is(c, 'String')) {
                                c.model(value, true);
                            }
                        });
                    }
                }
            },
            'class': {
                get: function () {
                    return this.view().get('class');
                },
                set: function (value) {
                    this.view().set('class', value);
                }
            },
            style: {
                get: function () {
                    return this.view().style();
                },
                set: function (value) {
                    this.view().style(value);
                }
            },
            dom: {
                get: function () {
                    return this.resolve('@root');
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                var view = this['@view'];
                if (nx.is(view, 'Function')) {
                    var cls = this.constructor;
                    var superView;
                    while (cls) {
                        cls = cls.__super__;
                        superView = cls['@view'];
                        if (superView) {
                            break;
                        }
                    }
                    view = view.call(this, nx.clone(superView, true));
                }

                if (view) {
                    var comp = AbstractComponent.createComponent(view, this);
                    this.register('@root', comp.resolve('@root'));
                    this.register('@tag', comp.resolve('@tag'));
                    this.register('@comp', comp);
                }
            },
            view: function (name) {
                return this.resolve(name || '@comp');
            },
            get: function (name) {
                if (this.has(name)) {
                    return this.inherited(name);
                } else {
                    return this.view().get(name);
                }
            },
            set: function (name, value) {
                if (this.has(name)) {
                    this.inherited(name, value);
                } else {
                    this.view().set(name, value);
                    this.notify(name);
                }
            },
            onAttach: function (parent, index) {
                this.view().onAttach(parent, index);
            },
            onDetach: function () {
                this.view().onDetach(this.parent());
            },
            on: function (name, handler, context) {
                if (this.can(name)) {
                    return this.inherited(name, handler, context);
                } else {
                    return this.view().on(name, handler, context);
                }
            },
            upon: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                } else {
                    this.view().upon(name, handler, context);
                }
            },
            off: function (name, handler, context) {
                if (this.can(name)) {
                    this.inherited(name, handler, context);
                } else {
                    this.view().off(name, handler, context);
                }
            },
            dispose: function () {
                var comp = this.view();
                if (comp) {
                    comp.dispose();
                }

                this.inherited();
            }
        }
    });
})(nx);
