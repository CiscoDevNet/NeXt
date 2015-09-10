(function(nx, global) {


    nx.define("nx.graphic.Topology.Nav", nx.ui.Component, {
        properties: {
            topology: {
                get: function() {
                    return this.owner();
                }
            },
            scale: {},
            showIcon: {
                value: false
            },
            visible: {
                get: function() {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function(value) {
                    this.view().dom().setStyle("display", value ? "" : "none");
                    this.view().dom().setStyle("pointer-events", value ? "all" : "none");
                    this._visible = value;
                }
            }
        },

        view: {
            props: {
                'class': 'n-topology-nav'
            },
            content: [{
                name: 'icons',
                tag: "ul",
                content: [{
                        tag: 'li',
                        content: {
                            name: 'mode',
                            tag: 'ul',
                            props: {
                                'class': 'n-topology-nav-mode'
                            },
                            content: [{
                                name: 'selectionMode',
                                tag: 'li',
                                content: {
                                    props: {
                                        'class': 'n-icon-selectnode',
                                        title: "Select node mode"
                                    },
                                    tag: 'span'
                                },
                                events: {
                                    'mousedown': '{#_switchSelectionMode}',
                                    'touchstart': '{#_switchSelectionMode}'
                                }

                            }, {
                                name: 'moveMode',
                                tag: 'li',
                                props: {
                                    'class': 'n-topology-nav-mode-selected'
                                },
                                content: {
                                    props: {
                                        'class': 'n-icon-movemode',
                                        title: "Move mode"

                                    },
                                    tag: 'span'
                                },
                                events: {
                                    'mousedown': '{#_switchMoveMode}',
                                    'touchstart': '{#_switchMoveMode}'
                                }

                            }]
                        }
                    }, {
                        tag: 'li',
                        props: {
                            'class': 'n-topology-nav-zoom'
                        },
                        content: [{
                                name: 'zoomin',
                                tag: 'span',
                                props: {
                                    'class': 'n-topology-nav-zoom-in n-icon-zoomin-plus',
                                    title: "Zoom out"
                                },
                                events: {
                                    //'click': '{#_in}',
                                    'touchend': '{#_in}'
                                }
                            }, {
                                name: 'zoomout',
                                tag: 'span',
                                props: {
                                    'class': 'n-topology-nav-zoom-out n-icon-zoomout-minus',
                                    title: "Zoom in"
                                },
                                events: {
                                    //'click': '{#_out}',
                                    'touchend': '{#_out}'
                                }
                            }

                        ]
                    }, {
                        tag: 'li',
                        name: 'zoomselection',
                        props: {
                            'class': 'n-topology-nav-zoom-selection n-icon-zoombyselection',
                            title: "Zoom by selection"
                        },
                        events: {
                            'click': '{#_zoombyselection}',
                            'touchend': '{#_zoombyselection}'
                        }
                    }, {
                        tag: 'li',
                        name: 'fit',
                        props: {
                            'class': 'n-topology-nav-fit n-icon-fitstage',
                            title: "Fit stage"
                        },
                        events: {
                            'click': '{#_fit}',
                            'touchend': '{#_fit}'
                        }
                    },
                    //                        {
                    //                            tag: 'li',
                    //                            name: 'agr',
                    //                            props: {
                    //                                'class': 'n-topology-nav-agr',
                    //                                title: "Aggregation"
                    //                            },
                    //                            content: [
                    //                                {
                    //                                    tag: 'span',
                    //                                    props: {
                    //                                        'class': 'glyphicon glyphicon-certificate   agr-icon'
                    //                                    }
                    //                                },
                    //                                {
                    //                                    tag: 'span',
                    //                                    content: 'A',
                    //                                    props: {
                    //                                        'class': 'agr-text'
                    //                                    }
                    //                                }
                    //                            ],
                    //                            events: {
                    //                                'click': '{#_agr}'
                    //                            }
                    //                        },



                    {
                        tag: 'li',
                        name: 'agr',
                        props: {
                            'class': 'n-topology-nav-agr n-icon-aggregation',
                            title: 'Aggregation'
                        },
                        events: {
                            'click': '{#_agr}',
                            'touchend': '{#_agr}'
                        }
                    }, {
                        tag: 'li',
                        name: 'fullscreen',
                        props: {
                            'class': 'n-topology-nav-full n-icon-fullscreen',
                            title: 'Enter full screen mode'
                        },
                        events: {
                            'click': '{#_full}',
                            'touchend': '{#_full}'
                        }
                    }, {
                        tag: 'li',
                        name: 'setting',
                        content: [{
                            name: 'icon',
                            tag: 'span',
                            props: {
                                'class': 'n-topology-nav-setting-icon n-icon-viewsetting'
                            },
                            events: {
                                mouseenter: "{#_openPopover}",
                                mouseleave: "{#_closePopover}",
                                //touchend: "{#_togglePopover}"
                            }
                        }, {
                            name: 'settingPopover',
                            type: 'nx.ui.Popover',
                            props: {
                                title: 'Topology Setting',
                                direction: "right",
                                lazyClose: true
                            },
                            content: [{
                                tag: 'h5',
                                content: "Display icons as dots :"
                            }, {
                                tag: 'label',
                                content: [{
                                    tag: 'input',
                                    props: {
                                        type: 'radio',
                                        checked: '{#showIcon,converter=inverted,direction=<>}'
                                    }
                                }, {
                                    tag: 'span',
                                    content: "Always"
                                }],
                                props: {
                                    'class': 'radio-inline'
                                }
                            }, {
                                tag: 'label',
                                content: [{
                                    tag: 'input',
                                    props: {
                                        type: 'radio',
                                        checked: '{#showIcon,direction=<>}'
                                    }
                                }, {
                                    tag: 'span',
                                    content: "Auto-resize"
                                }],
                                props: {
                                    'class': 'radio-inline'
                                }
                            }, {
                                name: 'displayLabelSetting',
                                tag: 'h5',
                                content: [{
                                    tag: 'span',
                                    content: 'Display Label : '
                                }, {
                                    tag: 'input',
                                    props: {
                                        'class': 'toggleLabelCheckBox',
                                        type: 'checkbox',
                                        checked: true
                                    },
                                    events: {
                                        click: '{#_toggleNodeLabel}',
                                        touchend: '{#_toggleNodeLabel}'
                                    }
                                }]
                            }, {
                                tag: 'h5',
                                content: "Theme :"
                            }, {

                                props: {
                                    'class': 'btn-group'
                                },
                                content: [{
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default',
                                            value: 'blue'
                                        },
                                        content: "Blue"
                                    }, {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default',
                                            value: 'green'
                                        },
                                        content: "Green"
                                    }, {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default',
                                            value: 'dark'
                                        },
                                        content: "Dark"
                                    }, {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default',
                                            value: 'slate'
                                        },
                                        content: "Slate"
                                    }, {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default',
                                            value: 'yellow'
                                        },
                                        content: "Yellow"
                                    }

                                ],
                                events: {
                                    'click': '{#_switchTheme}',
                                    'touchend': '{#_switchTheme}'
                                }
                            }, {
                                name: 'customize'
                            }],
                            events: {
                                'open': '{#_openSettingPanel}',
                                'close': '{#_closeSettingPanel}'
                            }
                        }],
                        props: {
                            'class': 'n-topology-nav-setting'
                        }
                    }
                ]
            }]
        },
        methods: {
            init: function(args) {
                this.inherited(args);


                this.view('settingPopover').view().dom().addClass('n-topology-setting-panel');


                if (window.top.frames.length) {
                    this.view("fullscreen").style().set("display", 'none');
                }
            },
            attach: function(args) {
                this.inherited(args);
                var topo = this.topology();
                topo.watch('scale', function(prop, scale) {
                    var maxScale = topo.maxScale();
                    var minScale = topo.minScale();
                    var navBall = this.view("zoomball").view();
                    var step = 65 / (maxScale - minScale);
                    navBall.setStyles({
                        top: 72 - (scale - minScale) * step + 14
                    });
                }, this);

                topo.selectedNodes().watch('count', function(prop, value) {
                    this.view('agr').dom().setStyle('display', value > 1 ? 'block' : 'none');
                }, this);

                topo.watch('currentSceneName', function(prop, currentSceneName) {
                    if (currentSceneName == 'selection') {
                        this.view("selectionMode").dom().addClass("n-topology-nav-mode-selected");
                        this.view("moveMode").dom().removeClass("n-topology-nav-mode-selected");
                    } else {
                        this.view("selectionMode").dom().removeClass("n-topology-nav-mode-selected");
                        this.view("moveMode").dom().addClass("n-topology-nav-mode-selected");
                    }
                }, this);


                this.view('agr').dom().setStyle('display', 'none');

            },
            _switchSelectionMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'selection') {
                    topo.activateScene('selection');
                    this._prevSceneName = currentSceneName;
                }
            },
            _switchMoveMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName == 'selection') {
                    topo.activateScene(this._prevSceneName || 'default');
                    this._prevSceneName = null;
                }
            },
            _fit: function(sender, event) {
                if (!this._fitTimer) {
                    this.topology().fit();

                    sender.dom().setStyle('opacity', '0.1');
                    this._fitTimer = true;
                    setTimeout(function() {
                        sender.dom().setStyle('opacity', '1');
                        this._fitTimer = false;
                    }.bind(this), 1200);
                }
            },
            _zoombyselection: function(sender, event) {
                var icon = sender;
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();

                if (currentSceneName == 'zoomBySelection') {
                    icon.dom().removeClass('n-topology-nav-zoom-selection-selected');
                    topo.activateScene('default');
                } else {
                    var scene = topo.activateScene('zoomBySelection');
                    scene.upon('finish', function fn(sender, bound) {
                        if (bound) {
                            topo.zoomByBound(topo.getInsideBound(bound));
                        }
                        topo.activateScene(currentSceneName);
                        icon.dom().removeClass('n-topology-nav-zoom-selection-selected');
                        scene.off('finish', fn, this);
                    }, this);
                    icon.dom().addClass('n-topology-nav-zoom-selection-selected');
                }
            },
            _in: function(sender, event) {
                var topo = this.topology();
                topo.stage().zoom(1.2, topo.adjustLayout, topo);
                event.preventDefault();
            },
            _out: function(sender, event) {
                var topo = this.topology();
                topo.stage().zoom(0.8, topo.adjustLayout, topo);
                event.preventDefault();
            },
            _full: function(sender, event) {
                this.toggleFull(event.target);
            },
            _enterSetting: function(event) {
                this.view("setting").addClass("n-topology-nav-setting-open");
            },
            _leaveSetting: function(event) {
                this.view("setting").removeClass("n-topology-nav-setting-open");
            },
            cancelFullScreen: function(el) {
                var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen;
                if (requestMethod) { // cancel full screen.
                    requestMethod.call(el);
                } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript !== null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            },
            requestFullScreen: function(el) {
                document.body.webkitRequestFullscreen.call(document.body);
                return false;
            },
            toggleFull: function(el) {
                var elem = document.body; // Make the body go full screen.
                var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) || (document.mozFullScreen || document.webkitIsFullScreen);

                if (isInFullScreen) {
                    this.cancelFullScreen(document);
                    this.fire("leaveFullScreen");
                } else {
                    this.requestFullScreen(elem);
                    this.fire("enterFullScreen");
                }
                return false;
            },

            _openPopover: function(sender, event) {
                this.view("settingPopover").open({
                    target: sender.dom(),
                    offsetY: 3
                });
                this.view('icon').dom().addClass('n-topology-nav-setting-icon-selected');
            },
            _closePopover: function() {
                this.view("settingPopover").close();
            },
            _closeSettingPanel: function() {
                this.view('icon').dom().removeClass('n-topology-nav-setting-icon-selected');
            },
            _togglePopover: function() {
                var popover = this.view("settingPopover");
                if (popover._closed) {
                    popover.open();
                }else{
                    popover.close();
                }
            },
            _switchTheme: function(sender, event) {
                this.topology().theme(event.target.value);
            },

            _toggleNodeLabel: function(sender, events) {
                var checked = sender.get('checked');
                this.topology().eachNode(function(node) {
                    node.labelVisibility(checked);
                });

                nx.graphic.Topology.NodesLayer.defaultConfig.labelVisibility = checked;
                nx.graphic.Topology.NodeSetLayer.defaultConfig.labelVisibility = checked;
            },
            _agr: function() {
                var topo = this.topology();
                var nodes = topo.selectedNodes().toArray();
                topo.selectedNodes().clear();
                topo.aggregationNodes(nodes);
            }
        }
    });


})(nx, nx.global);