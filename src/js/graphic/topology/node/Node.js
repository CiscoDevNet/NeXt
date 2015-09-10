(function(nx, global) {
    /**
     * Node class
     * @class nx.graphic.Topology.Node
     * @extend nx.graphic.Topology.AbstractNode
     * @module nx.graphic.Topology
     */
    nx.define('nx.graphic.Topology.Node', nx.graphic.Topology.AbstractNode, {
        events: ['pressNode', 'clickNode', 'enterNode', 'leaveNode', 'dragNodeStart', 'dragNode', 'dragNodeEnd', 'selectNode'],
        properties: {
            /**
             * Get node's label
             * @property label
             */
            label: {
                set: function(inValue) {
                    var label = this._processPropertyValue(inValue);
                    var el = this.view('label');
                    el.set('text', label);
                    if (label != null) {
                        this.calcLabelPosition();
                    }
                    this._label = label;
                }
            },
            /**
             * Node icon's type
             * @method iconType {String}
             */
            iconType: {
                get: function() {
                    return this.view('icon').get('iconType');
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (value && this._iconType !== value) {
                        this._iconType = value;
                        this.view('icon').set('iconType', value);
                        return true;
                    } else {
                        return false;
                    }
                }
            },

            /**
             * Show/hide node's icon
             * @property showIcon
             */
            showIcon: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this._showIcon = value;

                    this.view('icon').set('showIcon', value);

                    if (this._label != null) {
                        this.calcLabelPosition();
                    }
                    if (this._selected) {
                        this.view('selectedBG').set('r', this.selectedRingRadius());
                    }
                }
            },
            enableSmartLabel: {
                value: true
            },
            /**
             * Set label's angle
             * @property labelAngle
             */
            labelAngle: {
                get: function() {
                    return this._labelAngle || 90;
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this._labelAngle = value;
                }
            },
            /**
             * Set node's label visible
             * @property labelVisibility {Boolean} true
             */
            labelVisibility: {
                value: true,
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    var el = this.view('label');
                    el.visible(value);
                    this._labelVisibility = value;
                }
            },
            revisionScale: {
                set: function(value) {
                    var topo = this.topology();
                    var icon = this.view('icon');
                    icon.set('scale', value);
                    if (topo.showIcon()) {
                        icon.showIcon(value > 0.2);
                    } else {
                        icon.showIcon(false);
                    }

                    if (value > 0.4) {
                        this.view('label').set('visible', this._labelVisibility == null ? true : this._labelVisibility);
                    } else {
                        this.view('label').set('visible', false);
                    }

                    if (this._label != null) {
                        this.calcLabelPosition();
                    }
                    if (this._selected) {
                        this.view('selectedBG').set('r', this.selectedRingRadius());
                    }

                }
            },
            /**
             * Set the node's color
             * @property color
             */
            color: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    //                    this.view('graphic').dom().setStyle('fill', value);
                    this.view('label').dom().setStyle('fill', value);
                    this.view('icon').set('color', value);
                    this._color = value;
                }
            },

            /**
             * Set node's scale
             * @property scale {Number}
             */
            scale: {
                get: function() {
                    return this.view('graphic').scale();
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this.view('graphic').setTransform(null, null, value);
                    this.calcLabelPosition(true);
                }
            },


            selectedRingRadius: {
                get: function() {
                    var bound = this.getBound(true);
                    var radius = Math.max(bound.height, bound.width) / 2;
                    return radius + (this.selected() ? 10 : -4);
                }
            },
            /**
             * Get/set node's selected statues
             * @property selected
             */
            selected: {
                get: function() {
                    return this._selected || false;
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (this._selected == value) {
                        return false;
                    }
                    this._selected = value;
                    this.dom().setClass("node-selected", !!value);
                    if (value) {
                        this.view('selectedBG').set('r', this.selectedRingRadius());
                    }
                    return true;
                }
            },
            enable: {
                get: function() {
                    return this._enable != null ? this._enable : true;
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this._enable = value;
                    if (value) {
                        this.dom().removeClass('disable');
                    } else {
                        this.dom().addClass('disable');
                    }
                }
            },
            parentNodeSet: {
                get: function() {
                    var vertexSet = this.model().parentVertexSet();
                    if (vertexSet) {
                        return this.topology().getNode(vertexSet.id());
                    } else {
                        return null;
                    }
                }
            },
            rootNodeSet: {
                get: function() {
                    var model = this.model();
                    if (model.rootVertexSet()) {
                        return this.topology().getNode(model.rootVertexSet().id());
                    } {
                        return null;
                    }
                }
            }
        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'node'
            },
            content: [{
                    name: 'label',
                    type: 'nx.graphic.Text',
                    props: {
                        'class': 'node-label',
                        'alignment-baseline': 'central',
                        y: 12
                    }
                }, {
                    name: 'selectedBG',
                    type: 'nx.graphic.Circle',
                    props: {
                        'class': 'selectedBG',
                        'r': 26
                    }
                }, {
                    type: 'nx.graphic.Group',
                    name: 'graphic',
                    content: [{
                        name: 'icon',
                        type: 'nx.graphic.Icon',
                        props: {
                            'class': 'icon',
                            'iconType': 'unknown',
                            'showIcon': false,
                            scale: 1
                        }
                    }],
                    events: {
                        'mousedown': '{#_mousedown}',
                        'touchstart': '{#_mousedown}',
                        'mouseup': '{#_mouseup}',

                        'mouseenter': '{#_mouseenter}',
                        'mouseleave': '{#_mouseleave}',

                        'dragstart': '{#_dragstart}',
                        'dragmove': '{#_drag}',
                        'dragend': '{#_dragend}'
                    }
                }


            ]
        },
        methods: {
            translateTo: function(x, y, callback, context) {
                var el = this.view();
                var position = this.position();
                el.setTransition(function() {
                    this.position({
                        x: x,
                        y: y
                    });
                    this.calcLabelPosition(true);

                    if (callback) {
                        callback.call(context || this);
                    }
                }, this, 0.5);
                if (position.x == x && position.y == y && callback) {
                    callback.call(context || this);
                } else {
                    el.setTransform(x, y, null, 0.9);
                }

            },
            /**
             * Get node bound
             * @param onlyGraphic {Boolean} is is TRUE, will only get graphic's bound
             * @returns {*}
             */
            getBound: function(onlyGraphic) {
                if (onlyGraphic) {
                    return this.view('graphic').getBound();
                } else {
                    return this.view().getBound();
                }
            },
            _mousedown: function(sender, event) {
                if (this.enable()) {
                    this._prevPosition = this.position();
                    event.captureDrag(this.view('graphic'), this.topology().stage());
                    this.fire('pressNode', event);
                }
            },
            _mouseup: function(sender, event) {
                if (this.enable()) {
                    var _position = this.position();
                    if (this._prevPosition && _position.x === this._prevPosition.x && _position.y === this._prevPosition.y) {
                        /**
                         * Fired when click a node
                         * @event clickNode
                         * @param sender{Object} trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('clickNode', event);
                    }
                }
            },
            _mouseenter: function(sender, event) {
                if (this.enable()) {
                    if (!this.__enter && !this._nodeDragging) {
                        /**
                         * Fired when mouse enter a node
                         * @event enterNode
                         * @param sender{Object} trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('enterNode', event);
                        this.__enter = true;
                    }
                }


            },
            _mouseleave: function(sender, event) {
                if (this.enable()) {
                    if (this.__enter && !this._nodeDragging) {
                        /**
                         * Fired when mouse leave a node
                         * @event leaveNode
                         * @param sender{Object} trigger instance
                         * @param event {Object} original event object
                         */
                        this.fire('leaveNode', event);
                        this.__enter = false;
                    }
                }
            },
            _dragstart: function(sender, event) {
                window.event = event;
                this._nodeDragging = true;
                if (this.enable()) {
                    /**
                     * Fired when start drag a node
                     * @event dragNodeStart
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('dragNodeStart', event);
                }
            },
            _drag: function(sender, event) {
                window.event = event;
                if (this.enable()) {
                    /**
                     * Fired when drag a node
                     * @event dragNode
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('dragNode', event);
                }
            },
            _dragend: function(sender, event) {
                window.event = event;
                this._nodeDragging = false;
                if (this.enable()) {
                    /**
                     * Fired when finish a node
                     * @event dragNodeEnd
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('dragNodeEnd', event);
                    this.updateConnectedNodeLabelPosition();
                }
            },

            updateConnectedNodeLabelPosition: function() {
                this.calcLabelPosition(true);
                this.eachConnectedNode(function(node) {
                    node.calcLabelPosition();
                }, this);
            },
            /**
             * Set label to a node
             * @method calcLabelPosition
             */
            calcLabelPosition: function(force) {
                if (this.enableSmartLabel()) {

                    if (force) {
                        this._centralizedText();
                    } else {
                        //                        clearTimeout(this._centralizedTextTimer || 0);
                        //                        this._centralizedTextTimer = setTimeout(function () {
                        this._centralizedText();
                        //                        }.bind(this), 100);
                    }

                } else {
                    this.updateByMaxObtuseAngle(this.labelAngle());
                }
            },
            _centralizedText: function() {


                //
                var vertex = this.model();

                if (vertex === undefined) {
                    return;
                }

                var vertexID = vertex.id();
                var vectors = [];


                nx.each(vertex.edgeSets(), function(edgeSet) {
                    if (edgeSet.sourceID() !== vertexID) {
                        vectors.push(edgeSet.line().dir.negate());
                    } else {
                        vectors.push(edgeSet.line().dir);
                    }
                }, this);

                nx.each(vertex.edgeSetCollections(), function(esc) {
                    if (esc.sourceID() !== vertexID) {
                        vectors.push(esc.line().dir.negate());
                    } else {
                        vectors.push(esc.line().dir);
                    }
                }, this);


                //sort line by angle;
                vectors = vectors.sort(function(a, b) {
                    return a.circumferentialAngle() - b.circumferentialAngle();
                });


                // get the min incline angle

                var startVector = new nx.geometry.Vector(1, 0);
                var maxAngle = 0,
                    labelAngle;

                if (vectors.length === 0) {
                    labelAngle = 90;
                } else {
                    //add first item to vectors, for compare last item with first

                    vectors.push(vectors[0].rotate(359.9));

                    //find out the max incline angle
                    for (var i = 0; i < vectors.length - 1; i++) {
                        var inclinedAngle = vectors[i + 1].circumferentialAngle() - vectors[i].circumferentialAngle();
                        if (inclinedAngle < 0) {
                            inclinedAngle += 360;
                        }
                        if (inclinedAngle > maxAngle) {
                            maxAngle = inclinedAngle;
                            startVector = vectors[i];
                        }
                    }

                    // bisector angle
                    labelAngle = maxAngle / 2 + startVector.circumferentialAngle();

                    // if max that 360, reduce 360
                    labelAngle %= 360;
                }


                this.updateByMaxObtuseAngle(labelAngle);
            },
            /**
             * @method updateByMaxObtuseAngle
             * @method updateByMaxObtuseAngle
             * @param angle
             */
            updateByMaxObtuseAngle: function(angle) {

                var el = this.view('label');

                // find out the quadrant
                var quadrant = Math.floor(angle / 60);
                var anchor = 'middle';
                if (quadrant === 5 || quadrant === 0) {
                    anchor = 'start';
                } else if (quadrant === 2 || quadrant === 3) {
                    anchor = 'end';
                }

                //
                var size = this.getBound(true);
                var radius = Math.max(size.width / 2, size.height / 2) + (this.showIcon() ? 12 : 8);
                var labelVector = new nx.geometry.Vector(radius, 0).rotate(angle);


                el.set('x', labelVector.x);
                el.set('y', labelVector.y);
                //

                el.set('text-anchor', anchor);

                this._labelAngle = angle;

            },
            dispose: function() {
                clearTimeout(this._centralizedTextTimer);
                this.inherited();
            }
        }
    });
})(nx, nx.global);