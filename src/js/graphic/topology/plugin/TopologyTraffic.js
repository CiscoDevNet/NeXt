(function (nx, ui, util) {
    ui.define('nx.graphic.TopologyTraffic', {
        events: ['showPath'],
        view: {
            props: {
                style: {
                    'padding': '3px 15px'
                }
            },
            content: [
                {
                    tag: 'span',
                    content: 'Show Traffic:'
                },
                {
                    tag: 'label',
                    props: {
                        'class': 'radio-inline',
                        style: {
                            'padding-left': '5px'
                        }
                    },
                    content: {
                        tag: 'input',
                        props: {
                            'type': 'checkbox',
                            checked: '{#show}'
                        },
                        events: {
                            'click': "{#_click}"
                        }
                    }
                },
                {
                    name: 'note',
                    props: {
                        visible: '{#showNote}',
                        style: {
                            position: 'fixed',
                            left: '30px',
                            bottom: '10px'
                        }
                    },
                    content: [
                        {
                            "props": {
                                "class": "row"
                            },
                            "content": [
                                {
                                    "tag": "span",
                                    "content": "Traffic:"
                                }
                            ]
                        },
                        {
                            "props": {
                                "class": "row"
                            },
                            "content": [
                                {
                                    "tag": "span",
                                    "props": {
                                        "class": "box box-green"
                                    },
                                    "content": ""
                                },
                                {
                                    "tag": "span",
                                    "content": " < 40% < "
                                },
                                {
                                    "tag": "span",
                                    "props": {
                                        "class": "box box-yellow"
                                    },
                                    "content": ""
                                },
                                {
                                    "tag": "span",
                                    "content": " < 80% < "
                                },
                                {
                                    "tag": "span",
                                    "props": {
                                        "class": "box box-red"
                                    }
                                }
                            ]
                        },
                        {
                            props: {
                                'class': 'row',
                                style: {
                                    'margin-top': '10px'
                                }
                            },
                            content: {
                                props: {
                                    'class': 'btn-group'
                                },
                                content: [
                                    {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default {#measBtnClass}',
                                            model: {value: 'Meas'}
                                        },
                                        content: 'Current',
                                        events: {
                                            click: '{#_modeBtnClick}'
                                        }
                                    },
                                    {
                                        tag: 'button',
                                        props: {
                                            'class': 'btn btn-default {#simBtnClass}',
                                            model: {value: 'Sim'}
                                        },
                                        content: 'Rebalanced',
                                        events: {
                                            click: '{#_modeBtnClick}'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        properties: {
            topo: {
                set: function (value) {
                    var topo = value;
                    this._topo = topo;
                    this.topo().view('nav').view('settingPopover').appendChild(this);
                    var self = this;
                    this.topo().watch('showIcon', function (watchName, showIcon, topo) {
                        var padding = self.padding();
                        var width = self.width();
                        if (!showIcon) {
                            padding = 8;
                            width = 8;
                        }
                        var _redraw = function (path) {
                            var oldPadding = path.pathPadding();
                            oldPadding = typeof oldPadding == 'object' ? [padding, oldPadding[1]] : padding;
                            path.pathPadding(oldPadding);
                            path.pathWidth(width);
                            path.draw();
                        }
                        self.topo().eachLink(function (link) {
                            if (link._sourceTrafficPath) {
                                _redraw(link._sourceTrafficPath);
                            }
                            if (link._targetTrafficPath) {
                                _redraw(link._targetTrafficPath);
                            }
                        });
                    });
                    topo.on('afterSetData', function () {
                        if (self.show()) {
                            self.hideAll();
                            self.showAll();
                        }
                    });

                    topo.on("updating", function () {
                        if (self.show()) {
                            self.updateAll();
                        }
                    }, this);
                    topo.on("zoomend", function () {
                        if (self.show()) {
                            self.updateAll();
                        }
                    }, this);
                }
            },
            padding: {
                value: 18
            },
            width: {
                value: 10
            },
            show: {
                set: function (value) {
                    if (value) {
                        this.showAll();
                    } else {
                        this.hideAll();
                    }
                    this._show = value;
                }
            },
            showNote: {
                get: function () {
                    return this._showNote === undefined ? this.show() : this._showNote;
                },
                set: function (value) {
                    if (value && !this.showNote()) {
                        var note = this.view('note');
                        this.topo().view().appendChild(this.view('note'));
                    }

                    this._showNote = value;
                }
            },
            mode: {
                get: function () {
                    return this._mode || "Meas";
                },
                set: function (value) {
                    this._mode = value;
                    this.notify("measBtnClass");
                    this.notify("simBtnClass");
                    this.updateAll();
                }
            },
            measBtnClass: {
                dependencies: ['mode'],
                get: function () {
                    return this.mode() == 'Meas' ? "active" : '';
                }
            },
            simBtnClass: {
                dependencies: ['mode'],
                get: function () {
                    return this.mode() == 'Sim' ? "active" : '';
                }
            }
        },
        methods: {
            init: function () {
                this.inherited();
                this.on('showPath', function () {
                    this.showNote(true);
                });
            },
            _modeBtnClick: function (sender, evt) {
                var model = sender.model();
                this.mode(model.value);
            },
            showPath: function (link, type, len, forceMake) {
                var self = this;
                if (!forceMake && (link._sourceTrafficPath || link._targetTrafficPath)) {
                    link._sourceTrafficPath && link._sourceTrafficPath.show();
                    link._targetTrafficPath && link._targetTrafficPath.show();
                } else {
                    var pathLayer = self.topo().getLayer("pathLayer");
                    if (!type || type.toLowerCase() == 'source') {
                        var oldShow = false;
                        link._sourceTrafficPath && (oldShow = (link._sourceTrafficPath.getStyle('display') != 'none' ? true : false));
                        forceMake && link._sourceTrafficPath && pathLayer.removePath(link._sourceTrafficPath);
                        var sourcePath = link._sourceTrafficPath = self._makePath(link, 'source', len);
                        forceMake && !oldShow && sourcePath.hide();
                        pathLayer.addPath(sourcePath);
                    }
                    if (!type || type.toLowerCase() == 'target') {
                        var oldShow = false;
                        link._targetTrafficPath && (oldShow = (link._targetTrafficPath.getStyle('display') != 'none' ? true : false));
                        forceMake && link._targetTrafficPath && pathLayer.removePath(link._targetTrafficPath);
                        var targetPath = link._targetTrafficPath = (link.model().get('targetTraffic' + self.mode()) !== undefined && self._makePath(link, 'target', len));
                        forceMake && !oldShow && targetPath.hide();
                        pathLayer.addPath(targetPath);
                    }
                    this.fire('showPath');
                }
            },
            showAll: function () {
                var self = this;
                this.topo().eachLink(function (link) {
                    self.showPath.call(self, link);
                });
                this.showNote(true);
            },
            updateAll: function () {
                var self = this;
                if (this.topo().getData().links[0]['sourceTraffic' + this.mode()] === undefined) {
                    console.log('not support ' + this.mode() + 'Traffic view');
                    return;
                }
                this.topo().eachLink(function (link) {
                    self.showPath.call(self, link, null, '50%', true);
                });
            },
            hidePath: function (link) {
                link._sourceTrafficPath && link._sourceTrafficPath.hide();
                link._targetTrafficPath && link._targetTrafficPath.hide();
            },
            hideAll: function () {
                var self = this;
                this.topo().eachLink(function (link) {
                    self.hidePath.call(self, link);
                });
                this.showNote(false);
            },
            _click: function (sender, evt) {
                this.show(sender.get('checked'));
            },
            _makePath: function (link, type, len) {
                var self = this;
                var color = this.getPathColor(link, type);
                var pathStyle = {
                    fill: color
//                    ,stroke:color
                };
                var pathOpt = {
                    pathWidth: this.topo().showIcon() ? this.width() : 8,
                    pathStyle: pathStyle,
                    pathWidth: 5,
                    links: [link],
                    arrow: 'end',
                    reverse: type == 'target' ? true : false
                };
                var padding = this.topo().showIcon() ? this.padding() : 8;
                len === undefined && (len = '50%');
                pathOpt.pathPadding = (len == '100%' || (!len && link.model().get('targetTraffic' + this.mode()) === undefined)) ? padding : [padding, len];

                var path = new nx.graphic.Topology.Path(pathOpt);
                path.on('mouseover', function (sender, evt) {
                    var tip = sender._tip = sender._tip || new nx.ui.Popover();
                    var links = sender.links();
                    var linkData = links[0].model();
                    var percent = linkData.get(type + 'Traffic' + self.mode()) * 100 / linkData.get(type + 'Capacity');
                    var content = 'Bandwidth: ' + linkData.get(type + 'Capacity') + "<br/>Load: " + percent.toFixed(1) + "%";
                    tip.setContent(content);
                    var position = nx.eventObject.getPageXY();
                    tip.open({
                        target: {
                            x: position.x,
                            y: position.y
                        },
                        offset: 4
                    });
                });
                path.on('mouseleave', function (sender, evt) {
                    var tip = sender._tip;
                    if (tip) {
                        tip.close();
                    }
                });

                var originalDraw = path.draw;
                var self = this;
                path.draw = function () {
                    var oldArrow = path.arrow();
                    var oldWidth = path.pathWidth();
                    var links = path.links();
                    var link = links[0];
                    var length = link.getLine().length();
                    if (length < (self.topo().showIcon() ? 71 : 35) && oldArrow == "end") {
                        path.arrow('none');
                        path.pathWidth(oldWidth - 2);
                    }
                    originalDraw.call(path);
                    path.arrow(oldArrow);
                    path.pathWidth(oldWidth);
                }

                return path;
            },
            getPathColor: function (link, type) {
                var model = link.model();
                var percent = Math.floor(model.get(type + 'Traffic' + this.mode()) * 100 / model.get(type + 'Capacity'));
                var color = "#5cb85c";
                if (model.get('failed') == 'T') {
                    color = '#aaa';
                } else if (percent > 40 && percent <= 80) {
                    color = "#f2ad4e";
                } else if (percent > 80) {
                    color = "#da534f";
                }
                return color;
            },
            highlightPath: function (linkToHighlight) {
                this.topo().eachLink(function (link) {
                    if (link != linkToHighlight) {
                        link.fadeOut();
                    }
                });
                this.topo().eachNode(function (node) {
                    if (linkToHighlight.getSourceNode() != node && linkToHighlight.getTargetNode() != node) {
                        node.fadeOut();
                    }
                });
                this.showPath(linkToHighlight);
            },
            recover: function (force) {
                this.topo().recover(force);
                if (!this.show()) {
                    this.hideAll();
                }
            }
        }
    });
})(nx, nx.ui, nx.util);