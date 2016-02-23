(function (nx, global) {
    /**
     * SVG text component
     * @class nx.graphic.Text
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Text", nx.graphic.Component, {
        properties: {
            /**
             * Set/get text
             * @property text
             */
            text: {
                get: function () {
                    return this._text !== undefined ? this._text : 0;
                },
                set: function (value) {
                    if (this._text !== value && value !== undefined) {
                        this._text = value;
                        var el = this.view().dom().$dom;
                        if (el.firstChild) {
                            el.removeChild(el.firstChild);
                        }
                        el.appendChild(document.createTextNode(value));
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        view: {
            tag: 'svg:text'
        }
    });
})(nx, nx.global);