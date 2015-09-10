(function (nx, global) {


    /**
     * Tooltip manager for topology
     * @class nx.graphic.Topology.TooltipManager
     * @extend nx.data.ObservableObject
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.TooltipManager", {
        events: ['openNodeToolTip', 'closeNodeToolTip', 'openLinkToolTip', 'closeLinkToolTip', 'openLinkSetTooltip', 'closeLinkSetToolTip'],
        properties: {
            /**
             * Get topology
             * @property  topology
             */
            topology: {
                value: null
            },
            /**
             * All tooltip's instance array
             */
            tooltips: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            },
            /**
             * Get node's tooltip
             * @property nodeTooltip
             */
            nodeTooltip: {},
            /**
             * Get link's tooltip
             * @property linkTooltip
             */
            linkTooltip: {},
            /**
             * Get linkSet tooltip
             * @method linkSetTooltip
             */
            linkSetTooltip: {},
            nodeSetTooltip: {},

            /**
             * node tooltip class
             * @property nodeTooltipClass
             */
            nodeTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },

            /**
             * link tooltip class
             * @property linkTooltipClass
             */
            linkTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },
            /**
             * linkSet tooltip class
             * @property linkSetTooltipClass
             */
            linkSetTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },
            nodeSetTooltipClass: {
                value: 'nx.graphic.Topology.Tooltip'
            },
            /**
             * @property nodeTooltipContentClass
             */
            nodeTooltipContentClass: {
                value: 'nx.graphic.Topology.NodeTooltipContent'
            },
            /**
             * @property linkTooltipContentClass
             */
            linkTooltipContentClass: {
                value: 'nx.graphic.Topology.LinkTooltipContent'
            },
            /**
             * @property linkSetTooltipContentClass
             */
            linkSetTooltipContentClass: {
                value: 'nx.graphic.Topology.LinkSetTooltipContent'
            },

            nodeSetTooltipContentClass: {
                value: 'nx.graphic.Topology.NodeSetTooltipContent'
            },
            /**
             * Show/hide node's tooltip
             * @type Boolean
             * @property showNodeTooltip
             */
            showNodeTooltip: {
                value: true
            },
            /**
             * Show/hide link's tooltip
             * @type Boolean
             * @property showLinkTooltip
             */
            showLinkTooltip: {
                value: true
            },
            /**
             * Show/hide linkSet's tooltip
             * @type Boolean
             * @property showLinkSetTooltip
             */
            showLinkSetTooltip: {
                value: true
            },
            showNodeSetTooltip: {
                value: true
            },
            /**
             * Tooltip policy class
             * @property tooltipPolicyClass
             */
            tooltipPolicyClass: {
                get: function () {
                    return this._tooltipPolicyClass !== undefined ? this._tooltipPolicyClass : 'nx.graphic.Topology.TooltipPolicy';
                },
                set: function (value) {
                    if (this._tooltipPolicyClass !== value) {
                        this._tooltipPolicyClass = value;
                        var topology = this.topology();
                        var tooltipPolicyClass = nx.path(global, this.tooltipPolicyClass());
                        if (tooltipPolicyClass) {
                            var tooltipPolicy = new tooltipPolicyClass({
                                topology: topology,
                                tooltipManager: this
                            });
                            this.tooltipPolicy(tooltipPolicy);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            tooltipPolicy: {
                value: function () {
                    var topology = this.topology();
                    return new nx.graphic.Topology.TooltipPolicy({
                        topology: topology,
                        tooltipManager: this
                    });
                }
            },
            /**
             * Set/get tooltip's activate statues
             * @property activated
             */
            activated: {
                get: function () {
                    return this._activated !== undefined ? this._activated : true;
                },
                set: function (value) {
                    if (this._activated !== value) {
                        this._activated = value;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        methods: {

            init: function (args) {

                this.inherited(args);

                this.sets(args);

                this.registerTooltip('nodeTooltip', this.nodeTooltipClass());
                this.registerTooltip('linkTooltip', this.linkTooltipClass());
                this.registerTooltip('linkSetTooltip', this.linkSetTooltipClass());
                this.registerTooltip('nodeSetTooltip', this.nodeSetTooltipClass());


                //build in tooltips


                var nodeTooltip = this.getTooltip('nodeTooltip');
                nodeTooltip.on("close", function () {
                    this.fire("closeNodeToolTip");
                }, this);
                nodeTooltip.view().dom().addClass('n-topology-tooltip');
                this.nodeTooltip(nodeTooltip);


                var linkTooltip = this.getTooltip('linkTooltip');
                linkTooltip.on("close", function () {
                    this.fire("closeLinkToolTip", linkTooltip);
                }, this);
                linkTooltip.view().dom().addClass('n-topology-tooltip');
                this.linkTooltip(linkTooltip);


                var linkSetTooltip = this.getTooltip('linkSetTooltip');
                linkSetTooltip.on("close", function () {
                    this.fire("closeLinkSetToolTip", linkSetTooltip);
                }, this);
                linkSetTooltip.view().dom().addClass('n-topology-tooltip');
                this.linkSetTooltip(linkSetTooltip);


                var nodeSetTooltip = this.getTooltip('nodeSetTooltip');
                nodeSetTooltip.on("close", function () {
                    this.fire("closeNodeSetToolTip");
                }, this);
                nodeSetTooltip.view().dom().addClass('n-topology-tooltip');
                this.nodeSetTooltip(nodeSetTooltip);


                var topology = this.topology();
                var tooltipPolicyClass = nx.path(global, this.tooltipPolicyClass());
                if (tooltipPolicyClass) {
                    var tooltipPolicy = new tooltipPolicyClass({
                        topology: topology,
                        tooltipManager: this
                    });
                    this.tooltipPolicy(tooltipPolicy);
                }
            },
            /**
             * Register tooltip class
             * @param name {String}
             * @param tooltipClass {nx.ui.Component}
             */
            registerTooltip: function (name, tooltipClass) {
                var tooltips = this.tooltips();
                var topology = this.topology();
                var clz = tooltipClass;
                if (nx.is(clz, 'String')) {
                    clz = nx.path(global, tooltipClass);
                }
                var instance = new clz();
                instance.sets({
                    topology: topology,
                    tooltipManager: this,
                    model: topology.graph(),
                    'data-tooltip-type': name
                });
                tooltips.setItem(name, instance);
            },
            /**
             * Get tooltip instance by name
             * @param name {String}
             * @returns {nx.ui.Component}
             */
            getTooltip: function (name) {
                var tooltips = this.tooltips();
                return tooltips.getItem(name);
            },

            executeAction: function (action, data) {
                if (this.activated()) {
                    var tooltipPolicy = this.tooltipPolicy();
                    if (tooltipPolicy && tooltipPolicy[action]) {
                        tooltipPolicy[action].call(tooltipPolicy, data);
                    }
                }
            },
            /**
             * Open a node's tooltip
             * @param node {nx.graphic.Topology.Node}
             * @param position {Object}
             * @method openNodeTooltip
             */
            openNodeTooltip: function (node, position) {
                var topo = this.topology();
                var nodeTooltip = this.nodeTooltip();
                var content;

                nodeTooltip.close(true);

                if (this.showNodeTooltip() === false) {
                    return;
                }


                var pos = position || topo.getAbsolutePosition(node.position());

                var contentClass = nx.path(global, this.nodeTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        node: node,
                        model: topo.model()
                    });
                }

                if (content) {
                    nodeTooltip.content(null);
                    content.attach(nodeTooltip);
                }

                var size = node.getBound(true);

                nodeTooltip.open({
                    target: pos,
                    offset: Math.max(size.height, size.width) / 2
                });

                this.fire("openNodeToolTip", node);
            },
            /**
             * Open a nodeSet's tooltip
             * @param nodeSet {nx.graphic.Topology.NodeSet}
             * @param position {Object}
             * @method openNodeSetTooltip
             */
            openNodeSetTooltip: function (nodeSet, position) {
                var topo = this.topology();
                var nodeSetTooltip = this.nodeSetTooltip();
                var content;

                nodeSetTooltip.close(true);

                if (this.showNodeSetTooltip() === false) {
                    return;
                }


                var pos = position || topo.getAbsolutePosition(nodeSet.position());

                var contentClass = nx.path(global, this.nodeSetTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        nodeSet: nodeSet,
                        model: topo.model()
                    });
                }

                if (content) {
                    nodeSetTooltip.content(null);
                    content.attach(nodeSetTooltip);
                }

                var size = nodeSet.getBound(true);

                nodeSetTooltip.open({
                    target: pos,
                    offset: Math.max(size.height, size.width) / 2
                });

                this.fire("openNodeSetToolTip", nodeSet);
            },
            /**
             * open a link's tooltip
             * @param link
             * @param position
             * @method openLinkTooltip
             */
            openLinkTooltip: function (link, position) {
                var topo = this.topology();
                var linkTooltip = this.linkTooltip();
                var content;

                linkTooltip.close(true);

                if (this.showLinkTooltip() === false) {
                    return;
                }

                var pos = position || topo.getAbsolutePosition(link.centerPoint());

                var contentClass = nx.path(global, this.linkTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        link: link,
                        model: topo.model()
                    });
                }

                if (content) {
                    linkTooltip.content(null);
                    content.attach(linkTooltip);
                }

                linkTooltip.open({
                    target: pos,
                    offset: 4
                });

                this.fire("openLinkToolTip", link);
            },
            /**
             * Open linkSet tooltip
             * @method openLinkSetTooltip
             * @param linkSet
             * @param position
             */
            openLinkSetTooltip: function (linkSet, position) {
                var topo = this.topology();
                var linkSetTooltip = this.linkSetTooltip();
                var content;

                linkSetTooltip.close(true);

                if (this.showLinkSetTooltip() === false) {
                    return;
                }

                var pos = position || topo.getAbsolutePosition(linkSet.centerPoint());
                var contentClass = nx.path(global, this.linkSetTooltipContentClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        linkSet: linkSet,
                        model: topo.model()
                    });
                }

                if (content) {
                    linkSetTooltip.content(null);
                    content.attach(linkSetTooltip);
                }

                linkSetTooltip.open({
                    target: pos,
                    offsetX: 0,
                    offsetY: 8
                });

                this.fire("openLinkSetToolTip", linkSet);
            },
            /**
             * Close all tooltip
             * @method closeAll
             */
            closeAll: function () {
                this.tooltips().each(function (obj, name) {
                    obj.value().close(true);
                }, this);
            },
            dispose: function () {
                this.tooltips().each(function (obj, name) {
                    obj.value().close(true);
                    obj.value().dispose();
                }, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);