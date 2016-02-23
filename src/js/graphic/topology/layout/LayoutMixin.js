(function(nx, global) {
    /**
     * Layout mixin class
     * @class nx.graphic.Topology.LayoutMixin
     * @module nx.graphic.Topology
     */


    var __layouts = {
        'force': 'nx.graphic.Topology.NeXtForceLayout',
        'USMap': 'nx.graphic.Topology.USMapLayout',
        //'WorldMap': nx.graphic.Topology.WorldMapLayout,
        'hierarchicalLayout': 'nx.graphic.Topology.HierarchicalLayout',
        'enterpriseNetworkLayout': 'nx.graphic.Topology.EnterpriseNetworkLayout'
    };


    var CLS = nx.define("nx.graphic.Topology.LayoutMixin", {
        events: [],
        properties: {
            /**
             * Layout map
             * @property  layoutMap
             */
            layoutMap: {
                value: function() {
                    return {};
                }
            },
            /**
             * Current layout type
             * @property layoutType
             */
            layoutType: {
                value: null
            },
            /**
             * Current layout config
             * @property layoutConfig
             */
            layoutConfig: {
                value: null
            }
        },
        methods: {
            initLayout: function() {

                var layouts = nx.extend({},__layouts,nx.graphic.Topology.layouts);

                nx.each(layouts, function(cls, name) {
                    var instance;
                    if (nx.is(cls, 'Function')) {
                        instance = new cls();
                    } else {
                        var clz = nx.path(global, cls);
                        if (!clz) {
                            throw "Error on instance node class";
                        } else {
                            instance = new clz();
                        }
                    }

                    this.registerLayout(name, instance);

                }, this);
            },
            /**
             * Register a layout
             * @method registerLayout
             * @param name {String} layout name
             * @param cls {Object} layout class instance
             */
            registerLayout: function(name, cls) {
                var layoutMap = this.layoutMap();
                layoutMap[name] = cls;

                if (cls.topology) {
                    cls.topology(this);
                }
            },
            /**
             * Get layout instance by name
             * @method getLayout
             * @param name {String}
             * @returns {*}
             */
            getLayout: function(name) {
                var layoutMap = this.layoutMap();
                return layoutMap[name];
            },
            /**
             * Activate a layout
             * @param inName {String} layout name
             * @param inConfig {Object} layout config object
             * @param callback {Function} callback for after apply a layout
             */
            activateLayout: function(inName, inConfig, callback) {
                var layoutMap = this.layoutMap();
                var name = inName || this.layoutType();
                var config = inConfig || this.layoutConfig();
                if (layoutMap[name] && layoutMap[name].process) {
                    layoutMap[name].process(this.graph(), config, callback);
                    this.layoutType(name);
                }
            },
            deactivateLayout: function(name) {

            }
        }
    });


})(nx, nx.global);