(function (nx, global) {
    var xlink = 'http://www.w3.org/1999/xlink';
    /**
     * SVG icon component, which icon's define in nx framework
     * @class nx.graphic.Icon
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Icon", nx.graphic.Component, {
        view: {
            tag: 'svg:g',
            content: [{
                name: 'bgtext',
                tag: 'svg:text'
            }, {
                name: 'text',
                tag: 'svg:text'
            }, {
                tag: 'svg:g',
                name: 'image',
                content: {
                    name: 'use',
                    tag: 'svg:use'
                }
            }]
        },
        properties: {
            imageType: {
                value: "font"
            },
            /**
             * set/get icon's type
             * @property iconType
             */
            iconType: {
                get: function () {
                    return this._iconType;
                },
                set: function (value) {
                    var icon = nx.graphic.Icons.get(value.toLowerCase());
                    var size = icon.size;
                    var img = this.view('image').dom();
                    var shapeEL = this.view('text').dom();
                    var bgEL = this.view('bgtext').dom();
                    var useEL = this.view('use').dom();


                    if (icon.font) {

                        shapeEL.setStyle('display', 'block');
                        useEL.setStyle('display', 'none');

                        // front font
                        if (shapeEL.$dom.firstChild) {
                            shapeEL.$dom.removeChild(shapeEL.$dom.firstChild);
                        }
                        shapeEL.$dom.appendChild(document.createTextNode(icon.font[0]));
                        shapeEL.addClass('fontIcon iconShape');
                        //

                        //background font

                        if (bgEL.$dom.firstChild) {
                            bgEL.$dom.removeChild(bgEL.$dom.firstChild);
                        }
                        bgEL.$dom.appendChild(document.createTextNode(icon.font[1]));
                        bgEL.addClass('fontIcon iconBG');


                        this.imageType('font');

                    } else {

                        shapeEL.setStyle('display', 'none');
                        useEL.setStyle('display', 'block');

                        if (bgEL.$dom.firstChild) {
                            bgEL.$dom.removeChild(bgEL.$dom.firstChild);
                        }
                        bgEL.$dom.appendChild(document.createTextNode('\ue61d'));
                        bgEL.addClass('fontIcon iconBG');

                        //compatible with before
                        useEL.$dom.setAttributeNS(xlink, 'xlink:href', '#' + value);
                        img.setStyle('transform', 'translate(' + size.width / -2 + 'px, ' + size.height / -2 + 'px)');

                        this.imageType('image');
                    }


                    this.view().set('icontype', value);
                    this.view().dom().addClass('n-topology-icon');


                    this.size(size);
                    this._iconType = icon.name;


                }
            },
            /**
             * set/get icon size
             * @property size
             */
            size: {
                value: function () {
                    return {
                        width: 36,
                        height: 36
                    };
                }
            },
            color: {
                set: function (value) {
                    if (this.imageType() == 'font') {
                        this.view('text').dom().setStyle('fill', value);
                    }
                    this.view('bgtext').dom().setStyle('fill', this.showIcon() ? '' : value);
                    this.view('image').dom().set('color', value);
                    this._color = value;
                }
            },
            scale: {
                set: function (value) {
                    var shapeEL = this.view('text').dom();
                    var bgEL = this.view('bgtext').dom();
                    var img = this.view('image').dom();
                    var size = this.size();
                    var fontSize = Math.max(size.width, size.height);
                    var _size = this.showIcon() ? fontSize * value : 4 + value * 8;
                    shapeEL.setStyle('font-size', _size);
                    bgEL.setStyle('font-size', _size);

                    if (this.imageType() == 'image' && value) {
                        img.setStyle('transform', 'translate(' + size.width / -2 + 'px, ' + size.height / -2 + 'px) scale(' + value + ')');
                    }

                    // FIXME for firefox bug with g.getBoundingClientRect
                    if (nx.util.isFirefox()) {
                        shapeEL.$dom.setAttribute('transform', ' translate(0, ' + _size / 2 + ')');
                        bgEL.$dom.setAttribute('transform', ' translate(0, ' + _size / 2 + ')');
                    }


                    this._scale = value;
                }
            },
            showIcon: {
                get: function () {
                    return this._showIcon !== undefined ? this._showIcon : true;
                },
                set: function (value) {
                    var shapeEL = this.view('text').dom();
                    var bgEL = this.view('bgtext').dom();
                    var img = this.view('image').dom();
                    if (value) {
                        if (this.imageType() == 'font') {
                            shapeEL.setStyle('display', 'block');
                            bgEL.setStyle('display', 'block');
                        } else {
                            img.setStyle('display', 'block');
                            bgEL.setStyle('display', 'none');
                        }

                        bgEL.removeClass('iconBGActive');

                        this.view().dom().addClass('showIcon');

                    } else {
                        if (this.imageType() == 'font') {
                            shapeEL.setStyle('display', 'none');
                        } else {
                            img.setStyle('display', 'none');
                        }
                        bgEL.setStyle('display', 'block');
                        bgEL.addClass('iconBGActive');

                        this.view().dom().removeClass('showIcon');
                    }

                    this._showIcon = value;

                    if (this._color) {
                        this.color(this._color, {
                            force: true
                        });
                    }

                    if (this._scale) {
                        this.scale(this._scale, {
                            force: true
                        });
                    }
                }
            }
        }
    });
})(nx, nx.global);
