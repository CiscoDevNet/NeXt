(function (nx, global) {

    /**
     * UI popover class
     * @class nx.ui.Popover
     * @extend nx.ui.Popup
     */
    nx.define("nx.ui.Popover", nx.ui.Popup, {
        properties: {
            /**
             * Popover's title
             */
            title: {
                get: function () {
                    return this._title;
                },
                set: function (value) {
                    if (value) {
                        this.view("title").dom().setStyle("display", "block");

                    } else {
                        this.view("title").dom().setStyle("display", "none");
                    }
                    if (this._title != value) {
                        this._title = value;
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            location: {
                value: "tooltip"
            }
        },
        view: {
            props: {
                'class': 'popover fade',
                style: {
                    outline: "none"
                },
                tabindex: -1
            },
            events: {
                blur: function (sender, evt) {
                    // this.close();
                }
            },
            content: [{
                props: {
                    'class': 'arrow'
                }
            }, {
                tag: 'h3',
                name: 'title',
                props: {
                    'class': 'popover-title',
                    style: {
                        display: 'none'
                    }
                },
                content: "{#title}"
            }, {
                name: 'body',
                props: {
                    'class': 'popover-content'
                }
            }]
        },
        methods: {
            getContainer: function () {
                return this.view('body').dom();
            }
        }
    });


})(nx, nx.global);
