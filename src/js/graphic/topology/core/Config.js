(function (nx, global) {

    /**
     * Topology's base config
     * @class nx.graphic.Topology.Config
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.Config", {
        events: [],
        properties: {
            /**
             * Topology status, it could be  initializing/appended/ready
             * @property status {String}
             */
            status: {
                value: 'initializing',
                binding: {
                    direction: "<>"
                }
            },
            /**
             * topology's theme, it could be blue/green/dark/slate/yellow
             * @property theme {String}
             */
            theme: {
                get: function () {
                    return this._theme || 'blue';
                },
                set: function (value) {
                    this._theme = value;
                    this.notify('themeClass');
                }
            },
            themeClass: {
                get: function () {
                    return 'n-topology-' + this.theme();
                }
            },
            /**
             * Set the navigation visibility
             * @property showNavigation {Boolean}
             */
            showNavigation: {
                value: true
            },
            showThumbnail: {
                value: false
            },
            /**
             * Get the setting panel component instance for extend user setting
             * @property viewSettingPanel {nx.ui.Component}
             * @readonly
             */
            viewSettingPanel: {
                get: function () {
                    return this.view("nav").view("customize");
                }
            },
            viewSettingPopover: {
                get: function () {
                    return this.view("nav").view("settingPopover");
                }
            }
        },
        methods: {
        }
    });

})(nx, nx.global);