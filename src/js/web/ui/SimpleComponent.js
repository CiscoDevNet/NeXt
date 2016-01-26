(function (nx) {

    var Document = nx.dom.Document;

    function createElement(tag, text) {
        var tokens = tag.split(':');
        if (tokens.length === 2) {
            var ns = tokens[0];
            tag = tokens[1];
            return Document.createElementNS(ns, tag);
        }
        else if (tag === 'text') {
            return Document.createText(text);
        }
        else if (tag === 'fragment') {
            return  Document.createFragment();
        }
        else {
            return Document.createElement(tag);
        }
    }

    function createComponent(view, owner) {
        var comp = null;
        if (view) {
            if (nx.is(view, 'Array')) {
                comp = createElement('fragment');

                nx.each(view, function (v) {
                    comp.appendChild(createComponent(v, owner));
                });
            }
            else if (nx.is(view, 'Object')) {
                comp = createElement(view.tag || 'div');
            }
            else if (nx.is(view, 'String')) {
                comp = createElement('text', view);
            }

            nx.each(view.events, function (value, name) {
                comp.addEventListener(name, function (e) {
                    value.call(owner, comp, e);
                });
            });

            nx.each(view.props, function (value, name) {
                comp.set(name, value);
            });

            if (view.content !== undefined) {
                comp.appendChild(createComponent(view.content, owner));
            }
        }

        return comp;
    }

    var SimpleComponent = nx.define('nx.ui.SimpleComponent', {
        properties: {
            owner: null,
            dom: null
        },
        methods: {
            init: function () {
                var view = this['@view'];
                if (view) {
                    this.dom(createComponent(view, this));
                }
            },
            attach: function (parent, index) {
                var container = parent.getContainer(this);
                var dom = this.dom();
                if (container && dom) {
                    if (index >= 0) {
                        container.insertChild(dom);
                    }
                    else {
                        container.appendChild(dom);
                    }
                }
            },
            detach: function () {
                var container = parent.getContainer(this);
                var dom = this.dom();
                if (container && dom) {
                    container.removeChild(dom);
                }
            }
        }
    });
})(nx);