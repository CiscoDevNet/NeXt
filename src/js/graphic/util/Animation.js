(function (nx, util) {
    /**
     * @link http://webstuff.nfshost.com/anim-timing/Overview.html
     * @link https://developer.mozilla.org/en/DOM/window.requestAnimationFrame
     * @link http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
     */
    var requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
    })(), cancelAnimationFrame = (function () {
        return window.cancelAnimationFrame ||
            window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.msCancelAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.clearTimeout;
    })();

    nx.define('nx.graphic.Animation', {
        statics: {
            requestAnimationFrame: requestAnimationFrame,
            cancelAnimationFrame: cancelAnimationFrame
        },
        events: ['complete'],
        properties: {
            callback: {
                set: function (value) {
                    this._callback = value;
                    this.createAnimation();
                    if (this.autoStart()) {
                        this.start();
                    }
                },
                get: function () {
                    return this._callback || function () {
                    };
                }
            },
            duration: {
                value: 1000
            },
            interval: {
                value: 1000 / 60
            },
            autoStart: {
                value: false
            },
            complete: {
                value: function () {
                    return function () {
                    };
                }
            },
            context: {
                value: this
            }
        },
        methods: {
            init: function (opts, args) {
                this.inherited(arguments);
                this.sets(opts);
            },

            createAnimation: function () {
                var self = this;
                var callback = this.callback();
                var duration = this.duration();
                var interval = this.interval();
                var startTime, progress, id, timestamp, lastTime = 0;
                this.fn = function () {
                    timestamp = +new Date();
                    if (!startTime) {
                        startTime = +new Date();
                        progress = 0;
                    } else {
                        if (!duration) {
                            progress = 0;
                        } else {
                            progress = (timestamp - startTime) / duration;
                        }
                    }
                    if (progress >= 1 || (timestamp - lastTime) >= interval) {
                        lastTime = timestamp;
                        if (progress > 1) {
                            progress = 1;
                        }
                        if (callback.call(self.context(), progress) === false) {
                            //break  when user return false
                            duration = 1;
                            self._completeFN();
                        }

                    }
                    if (progress < 1) {
                        self.ani_id = requestAnimationFrame(self.fn);
                    } else if (progress == 1) {
                        self._completeFN();
                    }
                };
            },

            start: function () {
                this.ani_id = requestAnimationFrame(this.fn);
            },
            stop: function () {
                cancelAnimationFrame(this.ani_id);
            },
            _completeFN: function () {
                this.complete().call(this.context());
                this.stop();
                this.fire("complete");
            }
        }
    });
})(nx, nx.util);


