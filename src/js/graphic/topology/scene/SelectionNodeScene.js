(function(nx, global) {

    /**
     * Selection node scene
     * @class nx.graphic.Topology.SelectionNodeScene
     * @extend nx.graphic.Topology.SelectionScene
     */

    nx.define('nx.graphic.Topology.SelectionNodeScene', nx.graphic.Topology.SelectionScene, {
        properties: {
            /**
             * Get all selected nodes
             * @property selectedNodes
             */
            selectedNodes: {
                get: function() {
                    return this.topology().selectedNodes();
                }
            }
        },
        methods: {

            activate: function() {
                this.inherited();
                var tooltipManager = this._tooltipManager;
                tooltipManager.activated(false);
            },
            deactivate: function() {
                this.inherited();
                var tooltipManager = this._tooltipManager;
                tooltipManager.activated(true);
            },

            pressStage: function(sender, event) {
                var selectedNodes = this.selectedNodes();
                var multi = this._multi = event.metaKey || event.ctrlKey || event.shiftKey;
                if (!multi) {
                    selectedNodes.clear();
                }

                event.captureDrag(sender.stage().view(), this.topology().stage());
            },
            enterNode: function() {

            },
            clickNode: function(sender, node) {},
            dragStageStart: function(sender, event) {
                this.inherited(sender, event);
                var selectedNodes = this.selectedNodes();
                var multi = this._multi = event.metaKey || event.ctrlKey || event.shiftKey;
                if (!multi) {
                    selectedNodes.clear();
                }
                this._prevSelectedNodes = this.selectedNodes().toArray().slice();
            },
            dragStage: function(sender, event) {
                this.inherited(sender, event);
                this.selectNodeByRect(this.rect.getBound());
            },
            selectNode: function(sender, node) {
                if (node.selected()) {
                    this._topo.selectedNodes().add(node);
                } else {
                    this._topo.selectedNodes().remove(node);
                }
            },
            selectNodeSet: function(sender, nodeset) {
                if (nodeset.selected()) {
                    this._topo.selectedNodes().add(nodeset);
                } else {
                    this._topo.selectedNodes().remove(nodeset);
                }
            },


            pressNode: function(sender, node) {
                if (node.enable()) {
                    var selectedNodes = this.selectedNodes();
                    this._multi = event.metaKey || event.ctrlKey || event.shiftKey;
                    if (!this._multi) {
                        selectedNodes.clear();
                    }
                    node.selected(!node.selected());
                }
            },
            pressNodeSet: function(sender, nodeSet) {
                if (nodeSet.enable()) {
                    var selectedNodes = this.selectedNodes();
                    this._multi = event.metaKey || event.ctrlKey || event.shiftKey;
                    if (!this._multi) {
                        selectedNodes.clear();
                    }
                    nodeSet.selected(!nodeSet.selected());
                }
            },
            selectNodeByRect: function(bound) {
                this.topology().eachNode(function(node) {
                    if (node.model().type() == 'vertexSet' && !node.collapsed()) {
                        return;
                    }
                    var nodeBound = node.getBound();
                    // FIXME for firefox bug with g.getBoundingClientRect
                    if (nx.util.isFirefox()) {
                        var position = [node.x(), node.y()];
                        var svgbound = this.topology().stage().dom().getBound();
                        var matrix = this.topology().stage().matrix();
                        position = nx.geometry.Vector.transform(position, matrix);
                        nodeBound.x = nodeBound.left = position[0] + svgbound.left - nodeBound.width / 2;
                        nodeBound.right = nodeBound.left + nodeBound.width;
                        nodeBound.y = nodeBound.top = position[1] + svgbound.top - nodeBound.height / 2;
                        nodeBound.bottom = nodeBound.top + nodeBound.height;
                    }
                    var nodeSelected = node.selected();
                    if (this._hittest(bound, nodeBound)) {
                        if (!nodeSelected) {
                            node.selected(true);
                        }
                    } else {
                        if (this._multi) {
                            if (this._prevSelectedNodes.indexOf(node) == -1) {
                                if (nodeSelected) {
                                    node.selected(false);
                                }
                            }
                        } else {
                            if (nodeSelected) {
                                node.selected(false);
                            }
                        }
                    }
                }, this);
            },
            collapseNodeSetGroup: function(sender, group) {

            },
            enterGroup: function(sender, group) {

            },
            _hittest: function(sourceBound, targetBound) {
                var t = targetBound.top >= sourceBound.top && targetBound.top <= ((sourceBound.top + sourceBound.height)),
                    l = targetBound.left >= sourceBound.left && targetBound.left <= (sourceBound.left + sourceBound.width),
                    b = (sourceBound.top + sourceBound.height) >= (targetBound.top + targetBound.height) && (targetBound.top + targetBound.height) >= sourceBound.top,
                    r = (sourceBound.left + sourceBound.width) >= (targetBound.left + targetBound.width) && (targetBound.left + targetBound.width) >= sourceBound.left,
                    hm = sourceBound.top >= targetBound.top && (sourceBound.top + sourceBound.height) <= (targetBound.top + targetBound.height),
                    vm = sourceBound.left >= targetBound.left && (sourceBound.left + sourceBound.width) <= (targetBound.left + targetBound.width);

                return (t && l) || (b && r) || (t && r) || (b && l) || (t && vm) || (b && vm) || (l && hm) || (r && hm);
            }
        }
    });

})(nx, nx.global);