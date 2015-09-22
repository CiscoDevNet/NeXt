var topo;


var ln, scriptSrc, match;
var path = '';
var scripts = document.getElementsByTagName('script');
for (i = 0, ln = scripts.length; i < ln; i++) {
    scriptSrc = scripts[i].src;
    match = scriptSrc.match('demo.js');
    if (match) {
        path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
        break;
    }
}

var Demo = nx.define(nx.ui.Component, {
    properties: {
        categories: {
            value: function() {
                return new nx.data.ObservableDictionary();
            }
        },
        currentItem: null,
        currentConfig: null,
        jsfiles: {
            value: function() {
                return new nx.data.ObservableDictionary();
            }
        },
        currentTab: {
            get: function() {
                return this._currentTab
            },
            set: function(value) {
                if (this._currentTab !== value) {
                    if (this._currentTab) {
                        this._currentTab.removeClass('active');
                    }

                    value.addClass('active');

                    this._currentTab = value;

                    return true;
                } else {
                    return false;
                }
            }
        },
    },
    view: {
        props: {
            'class': 'row'
        },
        content: [{
            //                props: {
            //                    items: '{#jsfiles}',
            //                    template: {
            //                        tag: 'script',
            //                        props: {
            //                            'type': 'text/javascript',
            //                            'data-demo-name': '{key}',
            //                            src: '{value}'
            //                        }
            //                    }
            //                }
        }, {
            props: {
                'class': 'col-md-3 itemsList'
            },
            content: {

                props: {
                    items: '{#categories}',
                    template: {
                        props: {
                            'class': 'panel panel-default'
                        },
                        content: [{
                            props: {
                                'class': 'panel-heading'
                            },
                            content: '{key}'

                        }, {
                            props: {
                                'class': 'list-group',
                                items: '{value}',
                                template: {
                                    tag: 'a',
                                    props: {
                                        'class': 'list-group-item'
                                    },
                                    content: '{itemLabel}',
                                    events: {
                                        'click': '{#_load}'
                                    }
                                }
                            }
                        }]
                    }
                }
            }
        }, {
            name: 'prev',
            props: {
                'class': 'col-md-9 prev'
            },
            content: [{
                name: 'tab',
                tag: 'ul',
                props: {
                    'class': 'nav nav-tabs nav-justified',
                    items: [{
                        key: 'demo'
                    }, {
                        key: 'code'
                    }],
                    template: {
                        tag: 'li',
                        props: {
                            'class': ''
                        },
                        content: {
                            tag: 'a',
                            content: '{key}'
                        },
                        events: {
                            'click': '{#_switchClick}'
                        }
                    }
                }
            }, {
                name: 'demo',
                props: {
                    'class': 'demoContainer'
                }
            }, {
                name: 'code',
                props: {
                    'class': 'codeContainer'
                },
                content: {
                    name: 'codePre',
                    tag: 'pre',
                    props: {
                        'class': 'prettyprint lang-js'
                    }
                }
            }]
        }]
    },
    methods: {
        init: function(args) {
            this.inherited(args);
            this.addItem({
                categoryName: 'Basic',
                itemKey: 'base',
                itemLabel: 'Base',
                files: ['basic/base.js'],
                itemClass: 'Base.Base'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'autolayout',
                itemLabel: 'Auto Layout',
                files: ['basic/autolayout.js'],
                itemClass: 'Base.AutoLayout'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'highlight',
                itemLabel: 'Highlight Link and Node',
                files: ['basic/highlight.js'],
                itemClass: 'Base.Highlight'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'icons',
                itemLabel: 'Topology Icons',
                files: ['basic/icons.js'],
                itemClass: 'Base.ICONS'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'nodeconfig',
                itemLabel: 'Set node\'s label and icon',
                files: ['basic/config.js'],
                itemClass: 'Base.NodeConfig'
            });


            this.addItem({
                categoryName: 'Basic',
                itemKey: 'disable',
                itemLabel: 'Disable node or link',
                files: ['basic/disable.js'],
                itemClass: 'Base.Disable'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'theme',
                itemLabel: 'Topology theme',
                files: ['basic/theme.js'],
                itemClass: 'Base.Theme'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'customize',
                itemLabel: 'Customize Node and Link style',
                files: ['basic/customize.js'],
                itemClass: 'Base.Customize'
            });

            this.addItem({
                categoryName: 'Basic',
                itemKey: 'customize',
                itemLabel: 'Register new icon',
                files: ['basic/icon.js'],
                itemClass: 'Base.Icon'
            });

            //                    this.addItem({
            //                        categoryName: 'Basic',
            //                        itemKey: 'cool',
            //                        itemLabel: 'Cool feature',
            //                        files: ['basic/cool.js'],
            //                        itemClass: 'Base.Cool'
            //                    });

            this.addItem({
                categoryName: 'NodeSet',
                itemKey: 'base',
                itemLabel: 'NodeSet',
                files: ['nodeset/base.js'],
                itemClass: 'NodeSet.Base'
            });


            this.addItem({
                categoryName: 'NodeSet',
                itemKey: 'hierarchy',
                itemLabel: 'Hierarchy NodeSet (issue)',
                files: ['nodeset/hierarchy.js'],
                itemClass: 'NodeSet.Hierarchy'
            });

            this.addItem({
                categoryName: 'NodeSet',
                itemKey: 'aggregation',
                itemLabel: 'Aggregation NodeSet (issue)',
                files: ['nodeset/aggregation.js'],
                itemClass: 'NodeSet.Aggregation'
            });

            this.addItem({
                categoryName: 'Group',
                itemKey: 'base',
                itemLabel: 'Add group',
                files: ['group/base.js'],
                itemClass: 'Group.Base'
            });

            this.addItem({
                categoryName: 'Layer',
                itemKey: 'define',
                itemLabel: 'Define a customised Layer',
                files: ['layer/define.js'],
                itemClass: 'Layer.Define'
            });

            this.addItem({
                categoryName: 'Layer',
                itemKey: 'api',
                itemLabel: 'Interaction with layer',
                files: ['layer/api.js'],
                itemClass: 'Layer.API'
            });


            this.addItem({
                categoryName: 'Scene',
                itemKey: 'extend',
                itemLabel: 'Define customize scene',
                files: ['scene/extend.js'],
                itemClass: 'Scene.Extend'
            });

            this.addItem({
                categoryName: 'Path',
                itemKey: 'base',
                itemLabel: 'Add path',
                files: ['path/base.js'],
                itemClass: 'Path.Base'
            });

            this.addItem({
                categoryName: 'Path',
                itemKey: 'multiple',
                itemLabel: 'Add multiple path',
                files: ['path/multiple.js'],
                itemClass: 'Path.Multiple'
            });

            this.addItem({
                categoryName: 'Path',
                itemKey: 'traffic',
                itemLabel: 'Add traffic path',
                files: ['path/traffic.js'],
                itemClass: 'Path.Traffic'
            });

            this.addItem({
                categoryName: 'Map',
                itemKey: 'us',
                itemLabel: 'US Map',
                files: ['map/us.js'],
                itemClass: 'Map.US'
            });

            //                    this.addItem({
            //                        categoryName: 'Map',
            //                        itemKey: 'world',
            //                        itemLabel: 'World Map',
            //                        files: ['map/world.js'],
            //                        itemClass: 'Map.World'
            //                    });

            this.addItem({
                categoryName: 'Tooltip',
                itemKey: 'node',
                itemLabel: 'Node tooltip',
                files: ['tooltip/node.js'],
                itemClass: 'Tooltip.Node'
            });


            this.addItem({
                categoryName: 'Tooltip',
                itemKey: 'link',
                itemLabel: 'Link tooltip',
                files: ['tooltip/link.js'],
                itemClass: 'Tooltip.Link'
            });

            //                    this.addItem({
            //                        categoryName: 'Layout',
            //                        itemKey: 'force',
            //                        itemLabel: 'Force Layout',
            //                        files: ['layout/force.js'],
            //                        itemClass: 'Layout.Force'
            //                    });

            //                    this.addItem({
            //                        categoryName: 'Model',
            //                        itemKey: 'edit',
            //                        itemLabel: 'Edit Node',
            //                        files: ['model/editNode.js'],
            //                        itemClass: 'Model.EditNode'
            //                    });

            this.addItem({
                categoryName: 'Extend',
                itemKey: 'node',
                itemLabel: 'Extend Node',
                files: ['extend/node.js'],
                itemClass: 'Extend.Node'
            });

            this.addItem({
                categoryName: 'Extend',
                itemKey: 'nodecolorful',
                itemLabel: 'Extend Node Colorful',
                files: ['extend/node-colorful.js'],
                itemClass: 'Extend.NodeColorful'
            });

            this.addItem({
                categoryName: 'Extend',
                itemKey: 'abstract',
                itemLabel: 'Extend Abstract Node',
                files: ['extend/abstractNode.js'],
                itemClass: 'Extend.AbstractNode'
            });


            this.addItem({
                categoryName: 'Extend',
                itemKey: 'link',
                itemLabel: 'Extend Link',
                files: ['extend/link.js'],
                itemClass: 'Extend.Link'
            });

            //                    this.addItem({
            //                        categoryName: 'Extend',
            //                        itemKey: 'icon',
            //                        itemLabel: 'Add node icon',
            //                        files: ['extend/icon.js'],
            //                        itemClass: 'Extend.Icon'
            //                    });


            this.currentTab(this.view('tab').dom().childAt(0));


            setTimeout(function() {
                this._parseURL();
            }.bind(this), 200);

        },
        _switchClick: function(sender, event) {
            this.currentTab(sender.dom());
            var model = sender.model();
            if (model.key == 'demo') {
                this.view('demo').dom().setStyle('display', 'block');
                this.view('code').dom().setStyle('display', 'none');
            } else {
                this.view('demo').dom().setStyle('display', 'none');
                this.view('code').dom().setStyle('display', 'block');
            }

        },
        switchTab: function() {
            this.view('demo').dom().setStyle('display', 'block');
            this.view('code').dom().setStyle('display', 'none');
        },
        _parseURL: function() {
            var url = window.location.href.split("#");
            if (url[1]) {
                var params = url[1].split("/");
                var category = params[0];
                var itemkey = params[1];

                if (category && itemkey) {

                    var items;
                    this.categories().each(function(c, key) {
                        if (key == category) {
                            items = c.value();
                        }
                    });

                    items.each(function(item) {
                        if (item.itemKey == itemkey) {
                            this.loadDemo(item);
                        }
                    }, this);
                }
            }
        },
        addItem: function(config) {
            //category, name, url, className
            var categories = this.categories();
            if (!categories.contains(config.categoryName)) {
                categories.setItem(config.categoryName, new nx.data.ObservableCollection());
            }
            var items = categories.getItem(config.categoryName);
            items.add(config);

            var files = config.files;
            nx.each(nx.is(files, 'Array') ? files : [files], function(u) {
                this.jsfiles().setItem(config.categoryName + '-' + config.itemKey, u);
            }, this);
        },
        _load: function(sender, event) {
            this.switchTab();
            this.loadDemo(sender.model());
        },
        loadDemo: function(config) {



            try {


                nx.util.loadScript(path + config.files[0], function() {
                    var clz = config.itemClass;
                    if (nx.is(config.itemClass, 'String')) {
                        clz = nx.path(nx.global, clz);
                    }
                    if (this.currentItem()) {
                        this.currentItem().dispose();
                        topo && topo.dispose();
                    }

                    var demo = new clz();
                    demo.attach(this.resolve('demo'));

                    if (demo.resolve('topo')) {
                        topo = demo.resolve('topo');
                    }

                    this.currentItem(demo);
                    this.currentConfig(config);


                    var siteRootUrl = window.location.href.split("#").shift();
                    window.location.href = siteRootUrl + '#' + '' + config.categoryName + '/' + config.itemKey;


                    this._loadCode();
                }.bind(this));
            } catch (e) {

            }
        },
        _loadCode: function() {
            var config = this.currentConfig();
            var file = config.files[0];
            $.get(path + file, function(d) {
                var c = js_beautify(d, {
                    preserve_newlines: false
                });

                this.view('codePre').dom().$dom.innerHTML = c;
                //this.view('code').dom().$dom.appendChild(c);
                prettyPrint();
            }.bind(this));
            //
        }
    }
});


var App = nx.define(nx.ui.Application, {
    methods: {
        getContainer: function() {
            return new nx.dom.Element(document.getElementById('demos'));
        },
        start: function() {
            demo = new Demo();
            demo.attach(this);


        }
    }
});

var app = new App();
app.on('resize', function() {
    topo && topo.adaptToContainer();
});
app.start();