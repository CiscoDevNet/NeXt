(function (nx, global) {

    /**
     * Topology basic layer class
     * @class nx.graphic.Topology.Layer
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Layer", nx.graphic.Group, {
        view: {
            type: 'nx.graphic.Group',
            props: {
                class: "layer"
            }
        },
        properties: {
            /**
             * Get topology
             * @property topology
             */
            topology: {
                value: null
            },
            highlightedElements: {
                value: function () {
                    return new nx.data.UniqObservableCollection();
                }
            },
            activeElements: {
                value: function () {
                    return new nx.data.UniqObservableCollection();
                }
            },
            /**
             * Get fade status.
             * @property fade
             * @readOnly
             */
            fade: {
                dependencies: "forceFade",
                value: function (forceFade) {
                    return (forceFade === true || forceFade === false) ? forceFade : this._fade;
                }
            },
            fadeUpdater_internal_: {
                dependencies: "fade",
                update: function (fade) {
                    if (fade) {
                        this.dom().addClass("fade-layer");
                    } else {
                        this.dom().removeClass("fade-layer");
                    }
                }
            },
            /**
             * Force layer fade.
             * @property forceFade
             */
            forceFade: {}
        },
        methods: {
            init: function (args) {
                this.inherited(args);
                this.view().set("data-nx-type", this.__className__);

                var highlightedElements = this.highlightedElements();
                var activeElements = this.activeElements();

                highlightedElements.on('change', function (sender, args) {
                    if (args.action == 'add') {
                        nx.each(args.items, function (el) {
                            el.dom().addClass("fade-highlight-item");
                        });
                    } else if (args.action == 'remove' || args.action == "clear") {
                        nx.each(args.items, function (el) {
                            /* jslint -W030 */
                            el.dom() && el.dom().removeClass("fade-highlight-item");
                        });
                    }
                    if (highlightedElements.count() === 0 && activeElements.count() === 0) {
                        this.fadeIn();
                    } else {
                        this.fadeOut();
                    }
                }, this);


                activeElements.on('change', function (sender, args) {
                    if (args.action == 'add') {
                        nx.each(args.items, function (el) {
                            el.dom().addClass("fade-active-item");
                        });
                    } else if (args.action == 'remove' || args.action == "clear") {
                        nx.each(args.items, function (el) {
                            /* jslint -W030 */
                            el.dom() && el.dom().removeClass("fade-active-item");
                        });
                    }
                    if (highlightedElements.count() === 0 && activeElements.count() === 0) {
                        this.fadeIn();
                    } else {
                        this.fadeOut();
                    }
                }, this);

            },
            /**
             * Factory function, draw group
             */
            draw: function () {

            },
            /**
             * Show layer
             * @method show
             */
            show: function () {
                this.visible(true);
            },
            /**
             * Hide layer
             * @method hide
             */
            hide: function () {
                this.visible(false);
            },
            /**
             * fade out layer
             * @method fadeOut
             * @param [force] {Boolean} force layer fade out and can't fade in
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            fadeOut: function (force, callback, context) {
                if (force) {
                    this.forceFade(true);
                } else if (!this.forceFade()) {
                    this.fade(true);
                }
            },
            /**
             * FadeIn layer's fade statues
             * @param force {Boolean} force recover all items
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            fadeIn: function (force, callback, context) {
                if (this.forceFade() === true) {
                    if (force) {
                        this.forceFade(null);
                        this.fade(false);
                    }
                } else {
                    this.fade(false);
                }
            },
            /**
             * Fade in layer
             * @method fadeIn
             * @param force {Boolean} force recover all items
             * @param [callback] {Function} callback after fade out
             * @param [context] {Object} callback context
             */
            recover: function (force, callback, context) {
                this.fadeIn(force, callback, context);
            },
            /**
             * clear layer's content
             * @method clear
             */
            clear: function () {
                this.highlightedElements().clear();
                this.activeElements().clear();
                this.view().dom().empty();
            },
            dispose: function () {
                this.clear();
                this.highlightedElements().clear();
                this.activeElements().clear();
                this.inherited();
            }
        }
    });
})(nx, nx.global);
