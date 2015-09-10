(function(nx, global) {
    var Vector = nx.geometry.Vector;
    var Line = nx.geometry.Line;
    /**
     * Link class
     * @class nx.graphic.Topology.Link
     * @extend nx.graphic.Topology.AbstractLink
     * @module nx.graphic.Topology
     */

    var offsetRadix = 5;

    nx.define('nx.graphic.Topology.Link', nx.graphic.Topology.AbstractLink, {
        events: ['pressLink', 'clickLink', 'enterLink', 'leaveLink'],
        properties: {
            /**
             * Get link type 'curve' / 'parallel'
             * @property linkType {String}
             */
            linkType: {
                get: function() {
                    return this._linkType !== undefined ? this._linkType : 'parallel';
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (this._linkType !== value) {
                        this._linkType = value;
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            /**
             * Get/set link's offset percentage
             * @property offset {Float}
             */
            offsetPercentage: {
                value: 0
            },
            /**
             * Get/set link's offset step
             * @property offsetRadix {Number}
             */
            offsetRadix: {
                value: 5
            },
            /**
             * Get/set link's label, it is shown at the center point
             * @property label {String}
             */
            label: {
                set: function(inValue) {
                    var label = this._processPropertyValue(inValue);
                    var el = this.view('label');
                    if (label != null) {
                        el.append();
                    } else {
                        el.remove();
                    }
                    this._label = label;
                }
            },
            /**
             * Set/get link's color
             * @property color {Color}
             */
            color: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this.view('line').dom().setStyle('stroke', value);
                    this.view('path').dom().setStyle('stroke', value);
                    this._color = value;
                }
            },
            /**
             * Set/get link's width
             * @property width {Number}
             */
            width: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    var width = (this._stageScale || 1) * value;
                    this.view('line').dom().setStyle('stroke-width', width);
                    this.view('path').dom().setStyle('stroke-width', width);
                    this._width = value;
                }
            },
            stageScale: {
                set: function(value) {
                    var width = (this._width || 1) * value;
                    this.view('line').dom().setStyle('stroke-width', width);
                    this.view('path').dom().setStyle('stroke-width', width);
                    //                    this.view('disableLabel').scale(value);
                    this._stageScale = value;
                    this.update();
                }
            },
            /**
             * Set/get is link dotted
             * @property dotted {Boolean}
             */
            dotted: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (value) {
                        this.view('path').dom().setStyle('stroke-dasharray', '2, 5');
                    } else {
                        this.view('path').dom().setStyle('stroke-dasharray', '');
                    }
                    this._dotted = value;
                }
            },
            /**
             * Set link's style
             * @property style {Object}
             */
            style: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this.view('line').dom().setStyles(value);
                    this.view('path').dom().setStyles(value);
                }
            },
            /**
             * Get link's parent linkSet
             * @property parentLinkSet
             */
            parentLinkSet: {

            },
            ///**
            // * Get link's source interface point position
            // * @property sourcePoint
            // */
            //sourcePoint: {
            //    get: function () {
            //        var line = this.getPaddingLine();
            //        return line.start;
            //    }
            //},
            ///**
            // * Get link's target interface point position
            // * @property targetPoint
            // */
            //targetPoint: {
            //    get: function () {
            //        var line = this.getPaddingLine();
            //        return line.end;
            //    }
            //},
            /**
             * Set/get link's usability
             * @property enable {Boolean}
             */
            enable: {
                get: function() {
                    return this._enable != null ? this._enable : true;
                },
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    this._enable = value;
                    this.dom().setClass("disable", !value);
                    this.update();
                }
            },
            /**
             * Set the link's draw function, after set this property please call update function
             * @property drawMethod {Function}
             */
            drawMethod: {

            },
            revisionScale: {}

        },
        view: {
            type: 'nx.graphic.Group',
            props: {
                'class': 'link'
            },
            content: [{
                type: 'nx.graphic.Group',
                content: [{
                    name: 'path',
                    type: 'nx.graphic.Path',
                    props: {
                        'class': 'link'
                    }
                }, {
                    name: 'line_bg',
                    type: 'nx.graphic.Line',
                    props: {
                        'class': 'link_bg'
                    }
                }, {
                    name: 'line',
                    type: 'nx.graphic.Line',
                    props: {
                        'class': 'link'
                    }
                }],
                events: {
                    'mouseenter': '{#_mouseenter}',
                    'mouseleave': '{#_mouseleave}',
                    'mousedown': '{#_mousedown}',
                    'touchstart': '{#_mousedown}',
                    'mouseup': '{#_mouseup}',
                    'touchend': '{#_mouseup}'
                }
            }, {
                name: 'label',
                type: 'nx.graphic.Group',
                content: {
                    name: 'labelText',
                    type: 'nx.graphic.Text',
                    props: {
                        'alignment-baseline': 'text-before-edge',
                        'text-anchor': 'middle',
                        'class': 'link-label'
                    }
                }
            }]
        },
        methods: {

            /**
             * Update link's path
             * @method update
             */
            update: function() {

                this.inherited();

                var _offset = this.getOffset();
                var offset = new Vector(0, _offset);
                var width = (this._width || 1) * (this._stageScale || 1);
                var line = this.reverse() ? this.line().negate() : this.line();
                var d;
                var pathEL = this.view('path');
                var lineEl = this.view('line');
                var lineBGEl = this.view('line_bg');

                if (this.drawMethod()) {
                    d = this.drawMethod().call(this, this.model(), this);
                    pathEL.setStyle('display', 'block');
                    pathEL.set('d', d);
                    pathEL.dom().setStyle('stroke-width', width);
                    lineEl.setStyle('display', 'none');
                    lineBGEl.setStyle('display', 'none');
                } else if (this.linkType() == 'curve') {
                    var path = [];
                    var n, point;
                    n = line.normal().multiply(_offset * 3);
                    point = line.center().add(n);
                    path.push('M', line.start.x, line.start.y);
                    path.push('Q', point.x, point.y, line.end.x, line.end.y);
                    d = path.join(' ');

                    pathEL.setStyle('display', 'block');
                    pathEL.set('d', d);
                    pathEL.dom().setStyle('stroke-width', width);
                    lineEl.setStyle('display', 'none');
                    lineBGEl.setStyle('display', 'none');
                } else {
                    var newLine = line.translate(offset);
                    lineEl.sets({
                        x1: newLine.start.x,
                        y1: newLine.start.y,
                        x2: newLine.end.x,
                        y2: newLine.end.y
                    });
                    lineBGEl.sets({
                        x1: newLine.start.x,
                        y1: newLine.start.y,
                        x2: newLine.end.x,
                        y2: newLine.end.y
                    });
                    pathEL.setStyle('display', 'none');
                    lineEl.setStyle('display', 'block');
                    lineBGEl.setStyle('display', 'block');
                    lineEl.setStyle('stroke-width', width);
                    lineBGEl.setStyle('stroke-width', width * 4);

                }


                this._updateLabel();
            },
            /**
             * Get link's padding Line
             * @method getPaddingLine
             * @returns {*}
             */
            getPaddingLine: function() {
                var _offset = this.offset() * offsetRadix;
                var sourceSize = this.sourceNode().getBound(true);
                var sourceRadius = Math.max(sourceSize.width, sourceSize.height) / 1.3;
                var targetSize = this.targetNode().getBound(true);
                var targetRadius = Math.max(targetSize.width, targetSize.height) / 1.3;
                var line = this.line().pad(sourceRadius, targetRadius);
                var n = line.normal().multiply(_offset);
                return line.translate(n);
            },
            /**
             * Get calculated offset number
             * @method getoffset
             * @returns {number}
             */
            getOffset: function() {
                if (this.linkType() == 'parallel') {
                    return this.offsetPercentage() * this.offsetRadix() * this._stageScale;
                } else {
                    return this.offsetPercentage() * this.offsetRadix(); //* this._stageScale;
                }

            },
            _updateLabel: function() {
                var el, point;
                var _offset = this.getOffset();
                var line = this.line();
                var n = line.normal().multiply(_offset);
                if (this._label != null) {
                    el = this.view('label');
                    point = line.center().add(n);
                    el.setTransform(point.x, point.y, this.stageScale());
                    this.view('labelText').set('text', this._label);
                }
            },
            _mousedown: function() {
                if (this.enable()) {
                    /**
                     * Fired when mouse down on link
                     * @event pressLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('pressLink');
                }
            },
            _mouseup: function() {
                if (this.enable()) {
                    /**
                     * Fired when click link
                     * @event clickLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('clickLink');
                }
            },
            _mouseleave: function() {
                if (this.enable()) {
                    /**
                     * Fired when mouse leave link
                     * @event leaveLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('leaveLink');
                }
            },
            _mouseenter: function() {
                if (this.enable()) {
                    /**
                     * Fired when mouse enter link
                     * @event enterLink
                     * @param sender{Object} trigger instance
                     * @param event {Object} original event object
                     */
                    this.fire('enterLink');
                }
            }
        }
    });


})(nx, nx.global);