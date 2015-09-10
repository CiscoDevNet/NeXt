(function (nx, global) {

    var Container = nx.ui.PopupContainer;

    /**
     * Base popup class
     * @class nx.ui.Popup
     * @extend nx.ui.Component
     */
    nx.define("nx.ui.Popup", nx.ui.Component, {
        events: ['open', 'close'],
        view: {
            props: {
                style: "position:absolute",
                tabindex: -1
            },
            events: {
                blur: function (sender, evt) {
                    // this.close();
                }
            }
        },
        properties: {
            /**
             * @property target
             */
            target: {
                value: document
            },
            /**
             * [bottom,top,left,right]
             * @property direction
             */
            direction: {
                value: "auto" //[bottom,top,left,right]
            },
            /**
             * @property width
             */
            width: {
                value: null
            },
            /**
             * @property height
             */
            height: {
                value: null
            },
            /**
             * @property offset
             */
            offset: {
                value: 0
            },
            /**
             * @property offsetX
             */
            offsetX: {
                value: 0
            },
            /**
             * @property offsetY
             */
            offsetY: {
                value: 0
            },
            /**
             * @property align
             */
            align: {
                value: false
            },
            /**
             * @property position
             */
            position: {
                value: 'absolute'
            },
            /**
             * @property location
             */
            location: {
                value: "outer" // outer inner
            },
            /**
             * @property listenResize
             */
            listenResize: {
                value: false
            },
            /**
             * @property lazyClose
             */
            lazyClose: {
                value: false
            },
            /**
             * @property pin
             */
            pin: {
                value: false
            },
            /**
             * @property registeredPositionMap
             */
            registeredPositionMap: {
                value: function () {
                    return {};
                }
            },
            scrollClose: {
                value: false
            }
        },
        methods: {

            init: function (inPros) {
                this.inherited(inPros);
                this.sets(inPros);
                this._defaultConfig = this.gets();
            },
            attach: function (args) {
                this.inherited(args);
                this.appendToPopupContainer();
            },
            appendToPopupContainer: function () {
                if (!this._appended) {
                    Container.addPopup(this);
                    this._delayCloseEvent();
                    this._listenResizeEvent();
                    this._appended = true;
                    this._closed = false;
                }
            },
            /**
             * Open popup
             * @method open
             * @param args {Object} config
             */
            open: function (args) {
                this._clearTimeout();


                var left = 0;
                var top = 0;

                var root = this.view().dom();

                this.sets(args || {});


                this._resetOffset(args);
                var prevPosition = root.get("data-nx-popup-direction");
                if (prevPosition) {
                    root.removeClass(prevPosition);
                }
                this.appendToPopupContainer();


                //process target

                var target = this.target();
                var targetSize = {
                    width: 0,
                    height: 0
                };

                if (target.resolve && target.view) {
                    target = target.view();
                }

                // if target is a point {x:Number,y:Number}
                if (target.x !== undefined && target.y !== undefined) {
                    left = target.x;
                    top = target.y;
                } else if (target != document) {
                    var elOffset = target.getOffset();
                    left = elOffset.left;
                    top = elOffset.top;
                    targetSize = target.getBound();
                } else {
                    left = 0;
                    top = 0;
                }


                //process
                var width = this.width();
                var height = this.height();
                if (this.align()) {
                    width = targetSize.width || 0;
                }

                if (width) {
                    root.setStyle('width', width);
                    root.setStyle("max-width", width);
                    this.width(width);
                }

                if (height) {
                    root.setStyle('height', height);
                }

                root.setStyle("display", "block");


                //process position

                left += this.offsetX();
                top += this.offsetY();


                var popupSize = this._popupSize = root.getBound();
                var offset = this.offset();
                var innerPositionMap = {
                    "outer": {
                        bottom: {
                            left: left,
                            top: top + targetSize.height + offset
                        },
                        top: {
                            left: left,
                            top: top - popupSize.height - offset
                        },
                        right: {
                            left: left + targetSize.width + offset,
                            top: top
                        },
                        left: {
                            left: left - popupSize.width - offset,
                            top: top
                        }

                    },
                    "inner": {
                        bottom: {
                            left: left + targetSize.width / 2 - popupSize.width / 2 + offset,
                            top: top
                        },
                        top: {
                            left: left + targetSize.width / 2 - popupSize.width / 2,
                            top: top + targetSize.height - popupSize.height - offset
                        },
                        left: {
                            left: left + targetSize.width - popupSize.width - offset,
                            top: top + targetSize.height / 2 - popupSize.height / 2
                        },
                        right: {
                            left: left + offset,
                            top: top + targetSize.height / 2 - popupSize.height / 2
                        }

                    },
                    "tooltip": {
                        "bottom": {
                            left: left + targetSize.width / 2 - popupSize.width / 2,
                            top: top + targetSize.height + offset + 2
                        },
                        "bottom-left": {
                            left: left - 22,
                            top: top + targetSize.height + offset + 2
                        },
                        "bottom-right": {
                            left: left + targetSize.width - popupSize.width + 22,
                            top: top + targetSize.height + offset + 2
                        },
                        "top": {
                            left: left + targetSize.width / 2 - popupSize.width / 2,
                            top: top - popupSize.height - offset - 2
                        },
                        "top-left": {
                            left: left - 22,
                            top: top - popupSize.height - offset - 2
                        },
                        "top-right": {
                            left: left + targetSize.width / 2 - popupSize.width / 2 + 22,
                            top: top - popupSize.height - offset - 2
                        },
                        "right": {
                            left: left + targetSize.width + offset + 2,
                            top: top + targetSize.height / 2 - popupSize.height / 2
                        },
                        "right-top": {
                            left: left + targetSize.width + offset + 2,
                            top: top <= 0 ? 0 : top - 22
                        },
                        "right-bottom": {
                            left: left + targetSize.width + offset + 2,
                            top: top + targetSize.height - popupSize.height
                        },
                        "left": {
                            left: left - popupSize.width - offset - 2,
                            top: top + targetSize.height / 2 - popupSize.height / 2
                        },
                        "left-top": {
                            left: left - popupSize.width - offset - 2,
                            top: top <= 0 ? 0 : top - 22
                        },
                        "left-bottom": {
                            left: left - popupSize.width - offset - 2,
                            top: top + targetSize.height - popupSize.height
                        }
                    }
                };


                var location = this.location();
                this._directionMap = innerPositionMap[location];


                var direction = this.direction();
                if (direction == null || direction == "auto") {
                    direction = this._hitTest();
                }
                if (!direction) {
                    direction = "bottom";
                }
                var positionObj = this._directionMap[direction];
                root.setStyles({
                    "top": positionObj.top,
                    "left": positionObj.left,
                    "position": "position",
                    "z-index": nx.widget.ZIndexManager.getIndex(),
                    'display': 'block'

                });
                //position.setSize(this,popupSize);

                root.set("data-nx-popup-direction", direction);
                root.addClass("popup");
                root.addClass(direction);
                root.addClass("in");
                this.fire("open");
                this.dom().$dom.focus();
            },
            /**
             * close popup
             * @method close
             * @param force
             */
            close: function (force) {

                this._clearTimeout();

                var root = this.view().dom();

                if (this.pin()) {
                    return;
                }

                if (force || !this.lazyClose()) {
                    this._closed = true;
                    root.removeClass('in');
                    root.setStyle("display", "none");
                    this.fire("close");
                } else {
                    this._delayClose();
                }
            },
            _clearTimeout: function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            },
            _delayClose: function () {
                var self = this;
                this._clearTimeout();
                this.timer = setTimeout(function () {
                    self.close(true);
                }, 500);
            },
            _delayCloseEvent: function () {

                if (this.lazyClose()) {
                    //                    this.on("mouseover", function () {
                    //                        var element = this.view().dom().$dom;
                    //                        var target = event.target;
                    //                        var related = event.relatedTarget;
                    //                        if (target && !element.contains(related) && target !== related) {
                    //                            if (this.timer) {
                    //                                clearTimeout(this.timer);
                    //                            }
                    //                        }
                    //                    }, this);
                    //
                    //                    this.on("mouseout", function () {
                    //                        var element = this.view().dom().$dom;
                    //                        var target = event.target;
                    //                        var related = event.relatedTarget;
                    //                        if (!element.contains(related) && target !== related) {
                    //                            clearTimeout(this.timer);
                    //                            this.close(true);
                    //                        }
                    //                    }, this);


                    this.on("mouseenter", function () {
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                    }, this);

                    this.on("mouseleave", function () {
                        clearTimeout(this.timer);
                        this.close(true);
                    }, this);
                }
            },
            _listenResizeEvent: function () {
                var self = this;
                var timer;
                if (this.listenResize()) {
                    //                    nx.app.on('resize', function () {
                    //                        if (!this._closed) {
                    //                            if (timer) {
                    //                                clearTimeout(timer)
                    //                            }
                    //                            timer = setTimeout(function () {
                    //                                self.open();
                    //                            }, 22);
                    //                        }
                    //
                    //                    }, this);
                    //
                    //
                    //                    nx.app.on('scroll', function () {
                    //                        if (timer) {
                    //                            clearTimeout(timer)
                    //                        }
                    //                        if (!this._closed) {
                    //                            timer = setTimeout(function () {
                    //                                self.open();
                    //                            }, 22);
                    //                        }
                    //                    }, this);

                }


                if (this.scrollClose()) {
                    //                    nx.app.on('scroll', function () {
                    //                        if (timer) {
                    //                            clearTimeout(timer)
                    //                        }
                    //                        self.close(true);
                    //                    }, this);
                }
            },
            _hitTest: function () {
                var docRect = nx.dom.Document.docRect();

                var keys = Object.keys(this._directionMap);
                var testDirection = keys[0];
                keys.some(function (direction) {
                    var elementRect = {
                        left: this._directionMap[direction].left,
                        top: this._directionMap[direction].top,
                        width: this._popupSize.width,
                        height: this._popupSize.height

                    };
                    //make sure it visible
                    var resulte = elementRect.left >= docRect.scrollX &&
                        elementRect.top >= docRect.scrollY &&
                        elementRect.left + elementRect.width <= docRect.width + docRect.scrollX &&
                        elementRect.top + elementRect.height <= docRect.height + docRect.scrollY;

                    if (resulte) {
                        testDirection = direction;
                        return true;
                    }
                }, this);
                return testDirection;
            },
            _resetOffset: function (args) {
                if (args) {
                    //                    if (!args.offset) {
                    //                        this.offset(this.offset.defaultValue);
                    //                    }
                    //
                    //
                    //                    if (!args.offsetX) {
                    //                        this.offsetX(this.offsetX.defaultValue);
                    //                    }
                    //
                    //
                    //                    if (!args.offsetY) {
                    //                        this.offsetY(this.offsetY.defaultValue);
                    //                    }
                }
            }
        }
    });


})(nx, nx.global);
