(function (nx, global) {
    var xlink = "http://www.w3.org/1999/xlink";
    /**
     * Topology device icons collection
     * @class nx.graphic.Icons
     * @static
     */
    var ICONS = nx.define("nx.graphic.Icons", {
        static: true,
        statics: {
            /**
             * Get icons collection
             * @static
             * @property icons
             */
            icons: {}
        },
        methods: {
            /**
             * Get icon by type
             * @param type {String}
             * @returns {element}
             * @method get
             */
            get: function (type) {
                return ICONS.icons[type] || ICONS.icons.switch;
            },
            /**
             * Get icon"s svg string
             * @param type {String}
             * @returns {element}
             * @method getSVGString
             */
            getSVGString: function (type) {
                return topology_icon[type].icon;
            },
            /**
             * Get all types list
             * @returns {Array}
             * @method getTypeList
             */
            getTypeList: function () {
                return Object.keys(topology_icon);
            },
            /**
             * Register a new icon to this collection
             * @method registerIcon
             * @param name {String} icon"s name
             * @param url {URL} icon"s url
             * @param width {Number} icon"s width
             * @param height {Number} icon"s height
             */
            registerIcon: function (name, url, width, height) {
                var icon1 = document.createElementNS(NS, "image");
                icon1.setAttributeNS(XLINK, "href", url);
                ICONS.icons[name] = {
                    size: {
                        width: width,
                        height: height
                    },
                    icon: icon1.cloneNode(true),
                    name: name
                };
            },
            /**
             * Iterate all icons
             * @param inCallback {Function}
             * @param [inContext] {Object}
             * @private
             */
            __each__: function (inCallback, inContext) {
                var callback = inCallback || function () {
                };
                nx.each(topology_icon, function (obj, name) {
                    var icon = obj.icon;
                    callback.call(inContext || this, icon, name, topology_icon);
                });
            }
        }
    });


    var XLINK = "http://www.w3.org/1999/xlink";
    var NS = "http://www.w3.org/2000/svg";


    var topology_icon = {
        switch: {
            width: 32,
            height: 32,
            name: "Switch",
            font: ["\ue618", "\ue619"]
        },
        router: {
            width: 32,
            height: 32,
            name: "Router",
            font: ["\ue61c", "\ue61d"]
        },
        wlc: {
            width: 32,
            height: 32,
            font: ["\ue60f", "\ue610"]
        },
        unknown: {
            width: 32,
            height: 32,
            font: ["\ue612", "\ue611"]
        },
        server: {
            width: 32,
            height: 32,
            font: ["\ue61b", "\ue61a"]
        },
        phone: {
            width: 32,
            height: 32,
            font: ["\ue61e", "\ue61f"]
        },
        nexus5000: {
            width: 32,
            height: 32,
            font: ["\ue620", "\ue621"]
        },
        ipphone: {
            width: 32,
            height: 32,
            font: ["\ue622", "\ue623"]
        },
        host: {
            width: 32,
            height: 32,
            font: ["\ue624", "\ue625"]
        },
        camera: {
            width: 32,
            height: 32,
            font: ["\ue626", "\ue627"]
        },
        accesspoint: {
            width: 32,
            height: 32,
            font: ["\ue628", "\ue629"]
        },
        groups: {
            width: 32,
            height: 32,
            font: ["\ue615", "\ue62f"]
        },
        groupm: {
            width: 32,
            height: 32,
            font: ["\ue616", "\ue630"]
        },
        groupl: {
            width: 32,
            height: 32,
            font: ["\ue617", "\ue631"]
        },
        collapse: {
            width: 16,
            height: 16,
            font: ["\ue62e", "\ue61d"]
        },
        expand: {
            width: 14,
            height: 14,
            font: ["\ue62d", "\ue61d"]
        },
        //nodeset: {
        //    width: 32,
        //    height: 32,
        //    font: ["\ue617", "\ue63a"]
        //},
        cloud: {
            width: 48,
            height: 48,
            font: ["\ue633", "\ue633"]
        },
        unlinked:{
            width: 32,
            height: 32,
            font: ["\ue646", "\ue61d"]
        },
        firewall:{
            width: 32,
            height: 32,
            font: ["\ue647", "\ue648"]
        },
        hostgroup:{
            width: 32,
            height: 32,
            font: ["\ue64d", "\ue64c"]
        },
        wirelesshost:{
            width: 32,
            height: 32,
            font: ["\ue64e", "\ue64c"]
        }
    };


    nx.each(topology_icon, function (icon, key) {
        var i = ICONS.icons[key] = {
            size: {width: icon.width, height: icon.height},
            name: key
        };

        if (icon.font) {
            i.font = icon.font;
        } else if (icon.icon) {
            i.icon = new DOMParser().parseFromString(icon.icon, "text/xml").documentElement.cloneNode(true);
        }
    });

})(nx, nx.global);
