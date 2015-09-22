(function (nx, global) {

    nx.Object.delegateEvent = function (source, sourceEvent, target, targetEvent) {
        if (!target.can(targetEvent)) {
            source.on(sourceEvent, function (sender, event) {
                target.fire(targetEvent, event);
            });
            nx.Object.extendEvent(target, targetEvent);
        }
    };


    //http://www.timotheegroleau.com/Flash/experiments/easing_function_generator.htm

    var ease = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (-0.6475 * tc * ts + 0.7975 * ts * ts + -2.3 * tc + 3.2 * ts + -0.05 * t);
    };

    var cssHook = {
        transform: 'webkitTransform'
    };


    /**
     * Base class of graphic component
     * @class nx.graphic.Component
     * @extend nx.ui.Component
     * @module nx.graphic
     */

    nx.define('nx.graphic.Component', nx.ui.Component, {
        /**
         * Fire when drag start
         * @event dragstart
         * @param sender {Object}  Trigger instance
         * @param event {Object} original event object
         */
        /**
         * Fire when drag move
         * @event dragmove
         * @param sender {Object}  Trigger instance
         * @param event {Object} original event object , include delta[x,y] for the shift
         */
        /**
         * Fire when drag end
         * @event dragend
         * @param sender {Object}  Trigger instance
         * @param event {Object} original event object
         */
        events: ['dragstart', 'dragmove', 'dragend'],
        properties: {
            /**
             * Set/get x translate
             * @property translateX
             */
            translateX: {
                set: function (value) {
                    this.setTransform(value);
                }
            },
            /**
             * Set/get y translate
             * @property translateY
             */
            translateY: {
                set: function (value) {
                    this.setTransform(null, value);
                }
            },
            /**
             * Set/get scale
             * @property scale
             */
            scale: {
                set: function (value) {
                    this.setTransform(null, null, value);
                }
            },
            /**
             * Set/get translate, it set/get as {x:number,y:number}
             * @property translate
             */
            translate: {
                get: function () {
                    return {
                        x: this._translateX || 0,
                        y: this._translateY || 0
                    };
                },
                set: function (value) {
                    this.setTransform(value.x, value.y);
                }
            },
            /**
             * Set/get element's visibility
             * @property visible
             */
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    if (this.view()) {
                        if (value) {
                            this.view().dom().removeClass('n-hidden');
                        } else {
                            this.view().dom().addClass('n-hidden');
                        }

                    }
                    this._visible = value;
                }
            },
            /**
             * Set/get css class
             * @property class
             */
            'class': {
                get: function () {
                    return this._class !== undefined ? this._class : '';
                },
                set: function (value) {
                    if (this._class !== value) {
                        this._class = value;
                        this.dom().addClass(value);
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        view: {},
        methods: {
            init: function (args) {
                this.inherited(args);
                this.sets(args);
            },
            /**
             * Set component's transform
             * @method setTransform
             * @param [translateX] {Number} x axle translate
             * @param [translateY] {Number} y axle translate
             * @param [scale] {Number} element's scale
             * @param [duration=0] {Number} transition time, unite is second
             */
            setTransform: function (translateX, translateY, scale, duration) {

                var tx = parseFloat(translateX !== null ? translateX : this._translateX || 0);
                var ty = parseFloat(translateY !== null ? translateY : this._translateY || 0);
                var scl = parseFloat(scale !== null ? scale : this._scale || 1);

                this.setStyle('transform', ' matrix(' + scl + ',' + 0 + ',' + 0 + ',' + scl + ',' + tx + ', ' + ty + ')', duration);
                //this.setStyle('transform', ' translate(' + tx + 'px, ' + ty + 'px) scale(' + scl + ')', duration);

                this.dom().$dom.setAttribute('transform', ' translate(' + tx + ', ' + ty + ') scale(' + scl + ')');

                this._translateX = tx;
                this._translateY = ty;
                this._scale = scl;
            },
            /**
             * Set component's css style
             * @method setStyle
             * @param key {String} css key
             * @param value {*} css value
             * @param [duration=0] {Number} set transition time
             * @param [callback]
             * @param [context]
             */
            setStyle: function (key, value, duration, callback, context) {
                if (duration) {
                    this.setTransition(callback, context, duration);
                } else if (callback) {
                    setTimeout(function () {
                        callback.call(context || this);
                    }, 0);
                }


                //todo optimize
                var dom = this.dom().$dom;
                dom.style[key] = value;

                if (cssHook[key]) {
                    dom.style[cssHook[key]] = value;
                }
            },
            setTransition: function (callback, context, duration) {
                var el = this.dom();
                if (duration) {
                    el.setStyle('transition', 'all ' + duration + 's ease');
                    this.on('transitionend', function fn() {
                        if (callback) {
                            callback.call(context || this);
                        }
                        el.setStyle('transition', '');
                        this.off('transitionend', fn, this);
                    }, this);
                } else {
                    el.setStyle('transition', '');
                    if (callback) {
                        setTimeout(function () {
                            callback.call(context || this);
                        }, 0);
                    }
                }
            },
            /**
             * Append component's element to parent node or other dom element
             * @param [parent] {nx.graphic.Component}
             * @method append
             */
            append: function (parent) {
                var parentElement;
                if (parent) {
                    parentElement = this._parentElement = parent.view().dom();
                } else {
                    parentElement = this._parentElement = this._parentElement || this.view().dom().parentNode(); //|| this.parent().view();
                }
                if (parentElement && parentElement.$dom && this._resources && this.view() && !parentElement.contains(this.view().dom())) {
                    parentElement.appendChild(this.view().dom());
                }
            },
            /**
             * Remove component's element from dom tree
             * @method remove
             */
            remove: function () {
                var parentElement = this._parentElement = this._parentElement || this.view().dom().parentNode();
                if (parentElement && this._resources && this.view()) {
                    parentElement.removeChild(this.view().dom());
                }
            },
            /**
             * Get component's bound, delegate element's getBoundingClientRect function
             * @method getBound
             * @returns {*|ClientRect}
             */
            getBound: function () {

                //console.log(this.dom().$dom.getBoundingClientRect())
                //debugger;
                return this.dom().$dom.getBoundingClientRect();
            },
            /**
             * Hide component
             * @method hide
             */
            hide: function () {
                this.visible(false);
            },
            /**
             * Show component
             * @method show
             */
            show: function () {
                this.visible(true);
            },
            /**
             * Set animation for element,pass a config to this function
             * {
             *      to :{
             *          attr1:value,
             *          attr2:value,
             *          ...
             *      },
             *      duration:Number,
             *      complete:Function
             * }
             * @method animate
             * @param config {JSON}
             */
            animate: function (config) {
                var self = this;
                var aniMap = [];
                var el = this.view();
                nx.each(config.to, function (value, key) {
                    var oldValue = this.has(key) ? this.get(key) : el.getStyle(key);
                    aniMap.push({
                        key: key,
                        oldValue: oldValue,
                        newValue: value
                    });
                }, this);

                if (this._ani) {
                    this._ani.stop();
                    this._ani.dispose();
                    delete this._ani;
                }

                var ani = this._ani = new nx.graphic.Animation({
                    duration: config.duration || 1000,
                    context: config.context || this
                });
                ani.callback(function (progress) {
                    nx.each(aniMap, function (item) {
                        var value = item.oldValue + (item.newValue - item.oldValue) * progress;
                        //                        var value = ease(progress, item.oldValue, item.newValue - item.oldValue, 1);
                        self.set(item.key, value);
                    });
                    //console.log(progress);
                });

                if (config.complete) {
                    ani.complete(config.complete);
                }
                ani.on("complete", function fn() {
                    /**
                     * Fired when animation completed
                     * @event animationCompleted
                     * @param sender {Object}  Trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire("animationCompleted");
                    ani.dispose();
                    delete this._ani;
                }, this);
                ani.start();
            },
            _processPropertyValue: function (propertyValue) {
                var value = propertyValue;
                if (nx.is(propertyValue, 'Function')) {
                    value = propertyValue.call(this, this.model(), this);
                }
                return value;
            },
            dispose: function () {
                if (this._resources && this._resources['@root']) {
                    this.view().dom().$dom.remove();
                }
                this.inherited();
            }
        }
    });

})(nx, nx.global);
