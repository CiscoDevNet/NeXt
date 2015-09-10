(function (nx, global) {
    var Vector = nx.geometry.Vector;
    var Line = nx.geometry.Line;

    /**
     * Abstract link class
     * @class nx.graphic.Topology.AbstractLink
     * @extend nx.graphic.Group
     * @module nx.graphic.Topology
     */
    nx.define('nx.graphic.Topology.AbstractLink', nx.graphic.Group, {
        events: ['hide', 'show', 'remove'],
        properties: {
            /**
             * Get source node's instance
             * @property  sourceNode
             */
            sourceNode: {
                get: function () {
                    var topo = this.topology();
                    var id = this.model().source().id();
                    return topo.getNode(id);
                }
            },
            /**
             * Get target node's instance
             * @property targetNode
             */
            targetNode: {
                get: function () {
                    var topo = this.topology();
                    var id = this.model().target().id();
                    return topo.getNode(id);
                }
            },
            /**
             * Get source node's position
             * @property sourcePosition
             */
            sourcePosition: {
                get: function () {
                    return this.sourceNode().position();
                }
            },
            /**
             * Get target node's position
             * @property targetPosition
             */
            targetPosition: {
                get: function () {
                    return this.targetNode().position();
                }
            },
            /**
             * Get source node's id
             * @property sourceNodeID
             */
            sourceNodeID: {
                get: function () {
                    return this.model().source().id();
                }
            },
            /**
             * Get target node's id
             * @property targetNodeID
             */
            targetNodeID: {
                get: function () {
                    return this.model().target().id();
                }
            },
            /**
             * Get source node's x position
             * @property sourceX
             */
            sourceX: {
                get: function () {
                    return this.sourceNode().x();
                }
            },
            /**
             * Get source node's y position
             * @property sourceY
             */
            sourceY: {
                get: function () {
                    return this.sourceNode().y();
                }
            },
            /**
             * Get target node's x position
             * @property targetX
             */
            targetX: {
                get: function () {
                    return this.targetNode().x();
                }
            },
            /**
             * Get target node's x position
             * @property targetY
             */
            targetY: {
                get: function () {
                    return this.targetNode().y();
                }
            },
            /**
             * Get source node's vector
             * @property sourceVector
             */
            sourceVector: {
                get: function () {
                    return this.sourceNode().vector();
                }
            },
            /**
             * Get target node's vector
             * @property targetVector
             */
            targetVector: {
                get: function () {
                    if (this.targetNode()) {
                        return this.targetNode().vector();
                    }
                }
            },
            position: {
                get: function () {
                    var sourceNode = this.sourceNode().position();
                    var targetNode = this.targetNode().position();
                    return {
                        x1: sourceNode.x || 0,
                        x2: sourceNode.y || 0,
                        y1: targetNode.x || 0,
                        y2: targetNode.y || 0
                    };
                }
            },
            /**
             * Get link's line object
             * @property line
             */
            line: {
                get: function () {
                    return  new Line(this.sourceVector(), this.targetVector());
                }
            },
            /**
             * Get topology instance
             * @property topology
             */
            topology: {
                value: null
            },
            /**
             * Get link's id
             * @property id
             */
            id: {
                get: function () {
                    return this.model().id();
                }
            },
            /**
             * Get link's linkKey
             * @property linkKey
             */
            linkKey: {
                get: function () {
                    return this.model().linkKey();
                }
            },
            /**
             * Get is link is reverse link
             * @property reverse
             */
            reverse: {
                get: function () {
                    return this.model().reverse();
                }
            },
            /**
             * Get this center point's position
             * @property centerPoint
             */
            centerPoint: {
                get: function () {
                    return this.line().center();
                }
            },
            /**
             * Get/set link's usability
             * @property enable
             */
            enable: {
                value: true
            }

        },
        methods: {
            /**
             * Factory function , will be call when set model
             * @method setModel
             */
            setModel: function (model, isUpdate) {
                //
                this.model(model);
                //

                //updateCoordinate

//                model.source().on('updateCoordinate', this._watchS = function () {
//                    this.notify('sourcePosition');
//                    this.update();
//                }, this);
//
//                model.target().on('updateCoordinate', this._watchS = function (prop, value) {
//                    this.notify('sourcePosition');
//                    this.update();
//                }, this);

//                model.source().watch('position', this._watchS = function (prop, value) {
//                    this.notify('sourcePosition');
//                    this.update();
//                }, this);
//
//                model.target().watch('position', this._watchT = function () {
//                    this.notify('targetPosition');
//                    this.update();
//                }, this);


                //bind model's visible with element's visible
                this.setBinding('visible', 'model.visible,direction=<>', this);

                if (isUpdate !== false) {
                    this.update();
                }
            },


            /**
             * Factory function , will be call when relate data updated
             * @method update
             */
            update: function () {
//                this.notify('centerPoint');
//                this.notify('line');
//                this.notify('position');
//                this.notify('targetVector');
//                this.notify('sourceVector');
            },
            dispose: function () {
//                var model = this.model();
//                if (model) {
//                    model.source().unwatch('position', this._watchS, this);
//                    model.target().unwatch('position', this._watchT, this);
//                }
                this.fire('remove');
                this.inherited();
            }
        }
    });


})(nx, nx.global);