(function (nx, global) {
    /**
     * Default Scene for topology
     * @class nx.graphic.Topology.DefaultScene
     * @extend nx.graphic.Topology.Scene
     */

    nx.define('nx.graphic.Topology.DefaultScene', nx.graphic.Topology.Scene, {
        events: [],
        methods: {
            /**
             * active scene
             * @method activate
             */

            activate: function () {
                this._topo = this.topology();
                this._nodesLayer = this._topo.getLayer('nodes');
                this._nodeSetLayer = this._topo.getLayer('nodeSet');
                this._linksLayer = this._topo.getLayer('links');
                this._linkSetLayer = this._topo.getLayer('linkSet');
                this._groupsLayer = this._topo.getLayer('groups');
                this._tooltipManager = this._topo.tooltipManager();
                this._nodeDragging = false;
                this._sceneTimer = null;
                this._interval = 600;
            },
            deactivate: function () {
                this._tooltipManager.closeAll();
            },
            dispatch: function (eventName, sender, data) {
                this._tooltipManager.executeAction(eventName, data);
            },
            pressStage: function (sender, event) {
            },
            clickStage: function (sender, event) {
                if (event.target == this._topo.stage().view().dom().$dom && !event.shiftKey) {
                    this._topo.selectedNodes().clear();
                }
            },
            dragStageStart: function (sender, event) {
                var nodes = this._nodesLayer.nodes().length;
                if (nodes > 300) {
                    this._linksLayer.hide();
                }
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-moveCursor');
            },
            dragStage: function (sender, event) {
                var stage = this._topo.stage();
                stage.applyTranslate(event.drag.delta[0], event.drag.delta[1]);
            },
            dragStageEnd: function (sender, event) {
                this._linksLayer.show();
                this._blockEvent(false);
                nx.dom.Document.html().removeClass('n-moveCursor');
            },
            projectionChange: function () {

            },

            zoomstart: function () {
                var nodes = this._nodesLayer.nodes().length;
                if (nodes > 300) {
                    this._linksLayer.setStyle('display', 'none');
                }
                this._recover();
                //this._topo.adjustLayout();
            },
            zooming: function () {

            },
            zoomend: function () {
                this._linksLayer.setStyle('display', 'block');
                this._topo.adjustLayout();
            },

            beforeSetData: function () {

            },

            afterSetData: function () {

            },


            insertData: function () {

            },


            ready: function () {

            },
            enterNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._sceneTimer = setTimeout(function () {
                        if (!this._nodeDragging) {
                            this._topo.activeRelatedNode(node);
                        }
                    }.bind(this), this._interval);
                    this._recover();
                }
                nx.dom.Document.body().addClass('n-dragCursor');
            },
            leaveNode: function (sender, node) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._recover();
                }
                nx.dom.Document.body().removeClass('n-dragCursor');
            },

            hideNode: function (sender, node) {

            },
            dragNodeStart: function (sender, node) {
                this._nodeDragging = true;
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-dragCursor');
                setTimeout(this._recover.bind(this), 0);
            },
            dragNode: function (sender, node) {
                this._topo._moveSelectionNodes(event, node);
            },
            dragNodeEnd: function () {
                this._nodeDragging = false;
                this._blockEvent(false);
                this._topo.stage().resetFitMatrix();
                nx.dom.Document.html().removeClass('n-dragCursor');
            },

            pressNode: function (sender, node) {
            },
            clickNode: function (sender, node) {
                if (!this._nodeDragging) {
                    if (!event.shiftKey) {
                        this._topo.selectedNodes().clear();
                    }
                    node.selected(!node.selected());
                }
            },
            selectNode: function (sender, node) {
                var selectedNodes = this._topo.selectedNodes();
                if (node.selected()) {
                    if (selectedNodes.indexOf(node) == -1) {
                        this._topo.selectedNodes().add(node);
                    }
                } else {
                    if (selectedNodes.indexOf(node) !== -1) {
                        this._topo.selectedNodes().remove(node);
                    }
                }
            },

            updateNodeCoordinate: function () {

            },


            enterLink: function (sender, events) {
            },

            pressNodeSet: function (sender, nodeSet) {
            },
            clickNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                this._recover();
                if (event.shiftKey) {
                    nodeSet.selected(!nodeSet.selected());
                } else {
                    nodeSet.collapsed(false);
                }
            },

            enterNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._sceneTimer = setTimeout(function () {
                        this._topo.activeRelatedNode(nodeSet);
                    }.bind(this), this._interval);
                }
            },
            leaveNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                if (!this._nodeDragging) {
                    this._recover();
                }
            },
            beforeExpandNodeSet: function (sender, nodeSet) {

                this._blockEvent(true);
                //update parent group
                var parentNodeSet = nodeSet.parentNodeSet();
                while (parentNodeSet && parentNodeSet.group) {
                    var group = parentNodeSet.group;
                    group.clear();
                    group.nodes(nx.util.values(parentNodeSet.nodes()));
                    group.draw();
                    parentNodeSet = parentNodeSet.parentNodeSet();
                }
                this._recover();
            },
            expandNodeSet: function (sender, nodeSet) {
                clearTimeout(this._sceneTimer);
                this._recover();
                this._topo.stage().resetFitMatrix();
                this._topo.fit(function () {
                    nodeSet.group = this._groupsLayer.addGroup({
                        shapeType: 'nodeSetPolygon',
                        nodeSet: nodeSet,
                        nodes: nx.util.values(nodeSet.nodes()),
                        label: nodeSet.label(),
                        color: '#9BB150',
                        id: nodeSet.id()
                    });
                    var parentNodeSet = nodeSet.parentNodeSet();
                    while (parentNodeSet && parentNodeSet.group) {
                        parentNodeSet.group.draw();
                        parentNodeSet = parentNodeSet.parentNodeSet();
                    }

                    this._blockEvent(false);
                    this._topo.adjustLayout();

                }, this, nodeSet.animation() ? 1.5 : false);

                //
            },
            beforeCollapseNodeSet: function (sender, nodeSet) {
                this._blockEvent(true);
                if (nodeSet.group) {
                    this._groupsLayer.removeGroup(nodeSet.id());
                    delete nodeSet.group;
                }

                nx.each(nodeSet.nodeSets(), function (ns, id) {
                    if (ns.group) {
                        this._groupsLayer.removeGroup(ns.id());
                        delete ns.group;
                    }
                }, this);

                this._topo.fadeIn();
                this._recover();
            },
            collapseNodeSet: function (sender, nodeSet) {
                var parentNodeSet = nodeSet.parentNodeSet();
                while (parentNodeSet && parentNodeSet.group) {
                    var group = parentNodeSet.group;
                    group.clear();
                    group.nodes(nx.util.values(parentNodeSet.nodes()));
                    parentNodeSet = parentNodeSet.parentNodeSet();
                }

                this._topo.stage().resetFitMatrix();
                this._topo.fit(function () {
                    this._blockEvent(false);
                }, this, nodeSet.animation() ? 1.5 : false);
            },
            removeNodeSet: function (sender, nodeSet) {
                if (nodeSet.group) {
                    this._groupsLayer.removeGroup(nodeSet.id());
                    delete nodeSet.group;
                }
                this._topo.stage().resetFitMatrix();
            },
            updateNodeSet: function (sender, nodeSet) {
                if (nodeSet.group) {
                    nodeSet.group.clear();
                    nodeSet.group.nodes(nx.util.values(nodeSet.nodes()));
                }

            },
            dragNodeSetStart: function (sender, nodeSet) {
                this._nodeDragging = true;
                this._recover();
                this._blockEvent(true);
                nx.dom.Document.html().addClass('n-dragCursor');
            },
            dragNodeSet: function (sender, nodeSet) {
                this._topo._moveSelectionNodes(event, nodeSet);
            },
            dragNodeSetEnd: function () {
                this._nodeDragging = false;
                this._blockEvent(false);
                nx.dom.Document.html().removeClass('n-dragCursor');
                this._topo.stage().resetFitMatrix();
            },
            selectNodeSet: function (sender, nodeSet) {
                var selectedNodes = this._topo.selectedNodes();
                if (nodeSet.selected()) {
                    if (selectedNodes.indexOf(nodeSet) == -1) {
                        this._topo.selectedNodes().add(nodeSet);
                    }
                } else {
                    if (selectedNodes.indexOf(nodeSet) !== -1) {
                        this._topo.selectedNodes().remove(nodeSet);
                    }
                }
            },

            addNode: function () {
                this._topo.stage().resetFitMatrix();
                this._topo.adjustLayout();
            },
            addNodeSet: function () {
                this._topo.stage().resetFitMatrix();
//                this._topo.fit();
                this._topo.adjustLayout();

            },
            removeNode: function () {
                this._topo.adjustLayout();
            },

            dragGroupStart: function (sender, group) {
            },

            dragGroup: function (sender, group) {
                if (event) {
                    var stageScale = this._topo.stageScale();
                    group.updateNodesPosition(event.drag.delta[0], event.drag.delta[1]);
                    group.move(event.drag.delta[0] * stageScale, event.drag.delta[1] * stageScale);
                }
            },

            dragGroupEnd: function (sender, group) {
            },
            clickGroupLabel: function (sender, group) {

            },
            collapseNodeSetGroup: function (sender, group) {
                var nodeSet = group.nodeSet();
                if (nodeSet) {
                    nodeSet.collapsed(true);
                }
            },

            enterGroup: function (sender, group) {
                if (nx.is(group, 'nx.graphic.Topology.NodeSetPolygonGroup')) {
                    var ns = group.nodeSet();
                    this._topo.activeNodes(nx.util.values(ns.nodes()));
                    this._topo.fadeOut();
                    this._groupsLayer.fadeOut();

                    group.view().dom().addClass('fade-active-item');
                }
            },
            leaveGroup: function (sender, group) {
                group.view().dom().removeClass('fade-active-item');
                this._topo.fadeIn();
                this._topo.recoverActive();
            },


            right: function (sender, events) {
                this._topo.move(30, null, 0.5);
            },
            left: function (sender, events) {
                this._topo.move(-30, null, 0.5);
            },
            up: function () {
                this._topo.move(null, -30, 0.5);
            },
            down: function () {
                this._topo.move(null, 30, 0.5);
            },
            pressR: function () {
                if (nx.DEBUG) {
                    this._topo.activateLayout('force');
                }
            },
            pressA: function () {
                if (nx.DEBUG) {
                    var nodes = this._topo.selectedNodes().toArray();
                    this._topo.selectedNodes().clear();
                    this._topo.aggregationNodes(nodes);
                }
            },
            pressS: function () {
                if (nx.DEBUG) {
                    this._topo.activateScene('selection');
                }
            },
            pressM: function () {
                if (nx.DEBUG) {
                    this._topo.activateScene('default');
                }
            },
            pressF: function () {
                if (nx.DEBUG) {
                    this._topo.fit();
                }
            },
            topologyGenerated: function () {
                this._topo.adjustLayout();
            },
            _recover: function () {
                this._topo.fadeIn();
                this._topo.recoverActive();
            },
            _blockEvent: function (value) {
                this._topo.blockEvent(value);
            }
        }
    });
})(nx, nx.global);
