(function (nx, ui, util) {
    ui.define('nx.graphic.TopologySearchInput', {
        events: ['search', 'select', 'itemHover'],
        view: {
            props: {
                style: {
                    position: 'absolute',
                    left: 50,
                    top: 30
                }
            },
            content: {
                name: 'searchIpt',
                type: 'nx.ui.AutoComplete',
                props: {
                    placeholder: '{#placeholder}'
                }
            }
        },
        properties: {
            topo: {
                set: function (value) {
                    var topo = value;
                    this._topo = topo;
                    topo.appendChild(this);
                }
            },
            searchKey: {
                set: function (value) {
                    this.view('searchIpt').key(value);
                },
                get: function () {
                    return this.view('searchIpt').key();
                }
            },
            placeholder: {
                get: function () {
                    return this._placeholder || 'search node';
                },
                set: function (value) {
                    this._placeholder = value;
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                var autoComplete = this.view('searchIpt');
                var self = this;
                autoComplete.on('filter', function (autocomp) {
                    if (self.__listeners__['search']) {
                        self.fire('search', autocomp);
                    } else {
                        var topo = self.topo();
                        var nodes = [];
                        var searchKey = self.searchKey();
                        topo.recover(true);
                        var items = [], i = 0;
                        topo.eachNode(function (node) {
                            var model = node.model();
                            if ((model.get('label') || '').indexOf(searchKey) >= 0
                                || (model.get('site') || '').indexOf(searchKey) >= 0
                                || (model.get('name') || '').indexOf(searchKey) >= 0
                                || (model.get('ipAddress') || '').indexOf(searchKey) >= 0) {
                                nodes.push(node);
                                var ip =  model.get('ipAddress')?("<span>" + model.get('ipAddress')+"</span>"):"";
                                var text = "<span style='width: 50px;display: inline-block'>"+(model.get('name')||model.get('site')) + "</span>" + ip;
                                items.push({
                                    node: node,
                                    text: text,
                                    href: '#', $index: i++});
                            }
                        });
                        autocomp.items(items);
                        self.topo().selectedNodes().forEach(function (node) {
                            node.selected(false);
                        });
                        topo.highlightNodes(nodes);
                    }
                });
                autoComplete.on('select', function (autoComp, item) {
                    self.topo().recover(true);
                    if (self.__listeners__['select']) {
                        self.fire('select', this);
                    } else {
                        var model = item.model();
                        var node = model.node;
                        var site = node.model().get('site');
                        self.searchKey(site);
                        self.topo().selectedNodes().forEach(function (node) {
                            node.selected(false);
                        });
                        node.selected(true);
                    }
                });
                autoComplete.on('itemHover', function (autoComp, item) {
                    if (self.__listeners__['itemHover']) {
                        self.fire('itemHover', this);
                    } else {
                        var model = item.model();
                        var node = model.node;
                        node.selected(true);
                    }
                });
                autoComplete.on('itemUnhover', function (autoComp, item) {
                    if (self.__listeners__['select']) {
                        self.fire('itemUnhover', this);
                    } else {
                        var model = item.model();
                        var node = model.node;
                        node.selected(false);
                    }
                });
            },
            onInit: function () {
                var icon = this.view('searchIpt').view('icon');
                var input = this.view('searchIpt').view('input');
                icon.addClass('glyphicon glyphicon-search');
                icon.setStyles({
                    position: 'absolute',
                    padding: '8px'
                });
                input.setStyle('padding-left', '27px');
            }
        }
    });
})(nx, nx.ui, nx.util);