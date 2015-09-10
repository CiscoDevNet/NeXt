(function (nx, global) {

    nx.define("nx.graphic.Topology.HierarchicalLayout", {
        properties: {
            topology: {},
            levelBy: {
                value: function () {
                    return function (inNode) {
                        return inNode.model().get("role");
                    };
                }
            },
            sortOrder: {
                value: function () {
                    return [];
                }
            },
            direction: { // horizontal,vertical
                value: 'vertical'
            },
            order: {

            },
            nodesPositionObject: {

            },
            groups: {}
        },
        methods: {

            process: function (graph, config, callback) {
                var groups = this._group(graph, config || {});
                var nodesPositionObject = this._calc(groups, config || {});

                this._layout(nodesPositionObject, callback);
            },
            _group: function (graph, config) {
                var groups = {'__other__': []};
                var topo = this.topology();
                var levelBy = config.levelBy || this.levelBy();
                topo.eachNode(function (node) {
                    var key;
                    if (nx.is(levelBy, 'String') && levelBy.substr(5) == 'model') {
                        key = node.model().get(levelBy.substring(6));
                    } else {
                        key = levelBy.call(topo, node, node.model());
                    }

                    if (key) {
                        var group = groups[key] = groups[key] || [];
                        group.push(node);
                    } else {
                        groups.__other__.push(node);
                    }

                });
                return groups;
            },
            _calc: function (groups, config) {
                var nodesPositionObject = {}, keys = Object.keys(groups);
                var topo = this.topology();
                var sortOrder = config.sortOrder || this.sortOrder() || [];

                //build order array, and move __other__ to the last

                var order = [];
                nx.each(sortOrder, function (v) {
                    var index = keys.indexOf(v);
                    if (index !== -1) {
                        order.push(v);
                        keys.splice(index, 1);
                    }
                });
                keys.splice(keys.indexOf('__other__'), 1);
                order = order.concat(keys, ['__other__']);
                groups = this._sort(groups, order);

                //var y = 0;

                var padding = topo.padding();
                var width = topo.width() - padding * 2;
                var height = topo.height() - padding * 2;

                var direction = this.direction();


                var perY = height / (order.length + 1);
                var perX = width / (order.length + 1);
                var x = perX, y = perY;

                //'vertical'

                nx.each(order, function (key) {
                    if (groups[key]) {

                        if (direction == 'vertical') {
                            //build nodes position map
                            perX = width / (groups[key].length + 1);
                            nx.each(groups[key], function (node, i) {
                                nodesPositionObject[node.id()] = {
                                    x: perX * (i + 1),
                                    y: y
                                };
                            });
                            y += perY;
                        } else {
                            //build nodes position map
                            perY = height / (groups[key].length + 1);
                            nx.each(groups[key], function (node, i) {
                                nodesPositionObject[node.id()] = {
                                    x: x,
                                    y: perY * (i + 1)
                                };
                            });
                            x += perX;
                        }


                        delete groups[key];
                    }
                });

                this.order(order);


                return nodesPositionObject;

            },
            _sort: function (groups, order) {
                var topo = this.topology();
                var graph = topo.graph();

                groups[order[0]].sort(function (a, b) {
                    return Object.keys(b.model().edgeSets()).length - Object.keys(a.model().edgeSets()).length;
                });

                for (var i = 0; i < order.length - 1; i++) {
                    var firstGroup = groups[order[i]];
                    var secondGroup = groups[order[i + 1]];
                    var ary = [], indexs = [];
                    /* jshint -W083 */
                    nx.each(firstGroup, function (fNode) {
                        var temp = [];
                        nx.each(secondGroup, function (sNode, i) {
                            if (graph.getEdgesBySourceAndTarget(fNode, sNode) != null && temp.indexOf(sNode) != -1) {
                                temp.push(sNode);
                                indexs.push(i);
                            }
                        });
                        temp.sort(function (a, b) {
                            return Object.keys(b.model().edgeSets()).length - Object.keys(a.model().edgeSets()).length;
                        });

                        ary = ary.concat(temp);
                    });

                    /* jshint -W083 */
                    nx.each(ary, function (node, i) {
                        var index = secondGroup.indexOf(node);
                        if (index !== -1) {
                            secondGroup.splice(index, 1);
                        }
                    });
                    groups[order[i + 1]] = ary.concat(secondGroup);
                }

                this.groups(nx.extend({}, groups));
                return groups;
            },
            _layout: function (nodesPositionObject, callback) {
                var topo = this.topology();


                var queueCounter = 0;
                var nodeLength = 0;
                var finish = function () {
                    if (queueCounter == nodeLength) {
                        setTimeout(function () {
                            topo.getLayer('links').show();
                            topo.getLayer('linkSet').show();
                            topo.stage().resetFitMatrix();
                            topo.fit(function () {

                                if (callback) {
                                    callback.call(topo);
                                }
                            });
                        }, 0);

                    }
                }.bind(this);

                //
                topo.getLayer('links').hide();
                topo.getLayer('linkSet').hide();
                nx.each(nodesPositionObject, function (n, id) {
                    var node = topo.getNode(id);
                    if (node) {
                        node.translateTo(n.x, n.y, function () {
                            queueCounter++;
                            finish();
                        });
                        nodeLength++;
                    }
                });
            }
        }
    });


})(nx, nx.global);