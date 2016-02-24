(function(nx, global) {
    /**
     * SVG Arc component
     * @class nx.graphic.Arc
     * @extend nx.graphic.Component
     * @module nx.graphic
     */
    nx.define("nx.graphic.Arc", nx.graphic.Component, {
        view: {
            name: 'path',
            tag: 'svg:path',
            props: {
                'class': 'n-svg-arc'
            }

        },
        properties: {
            innerRadius: 0,
            outerRadius: 0,
            startAngle: 0,
            endAngle: 0,
            clockwies: false,
            stoke: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (value !== this._stoke) {
                        this._stoke = value;
                        this.view().dom().setStyle('stroke', value);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            fill: {
                set: function(inValue) {
                    var value = this._processPropertyValue(inValue);
                    if (value !== this._stoke) {
                        this._fill = value;
                        this.view().dom().setStyle('fill', value);
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            innerStartPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            outerStartPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            innerEndPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            outerEndPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            innerCenterPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            outerCenterPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            },
            thickness: {
                value: null
            },
            centerPoint: {
                value: function() {
                    return {
                        x: 0,
                        y: 0
                    };
                }
            }
        },
        methods: {
            init: function(args) {
                this.inherited(args);
                this.watch(['innerRadius', 'outerRadius', 'startAngle', 'endAngle', 'clockwies', 'thickness'], function(prop, value) {
                    if (this._outerRadius && (this._startAngle || this._endAngle)) {
                        this._updates();
                    }
                }, this);
            },
            _updates: function() {
                var delta = Math.PI / 180 * (this._clockwies ? -1 : 1);
                var thickness = this._thickness;
                var innerRadius = this._innerRadius;
                var outerRadius = this._outerRadius || innerRadius + thickness;
                var startAngle = Math.min(this._startAngle, this._endAngle) * delta;
                var endAngle = Math.max(this._startAngle, this._endAngle) * delta;
                var gapRadius = outerRadius - innerRadius;
                var gapAngle = Math.abs(this._endAngle - this._startAngle);

                if (gapAngle >= 360) {

                    return;
                    //startAngle = 0;
                    //endAngle = (Math.PI * 2 + startAngle) * (this._clockwies ? -1 : 1);
                    //gapAngle = 360;
                }


                var i_s_x = innerRadius * Math.cos(startAngle);
                var i_s_y = innerRadius * Math.sin(startAngle);

                var o_s_x = outerRadius * Math.cos(startAngle);
                var o_s_y = outerRadius * Math.sin(startAngle);


                var i_e_x = innerRadius * Math.cos(endAngle);
                var i_e_y = innerRadius * Math.sin(endAngle);

                var o_e_x = outerRadius * Math.cos(endAngle);
                var o_e_y = outerRadius * Math.sin(endAngle);

                var d = [];

                d.push('M', o_s_x, o_s_y);
                d.push('A', outerRadius, outerRadius, '0,');
                d.push(gapAngle > 180 ? '1' : '0', ',');
                d.push(this._clockwies ? '0' : '1');
                d.push(o_e_x, o_e_y);
                d.push('L', i_e_x, i_e_y);
                d.push('A', innerRadius, innerRadius, '0,');
                d.push(gapAngle > 180 ? '1' : '0', ',');
                d.push(this._clockwies ? '1' : '0');
                d.push(i_s_x, i_s_y);

                d.push('Z');

                this.view().set('d', d.join(' '));


                this.innerStartPoint({
                    x: i_s_x,
                    y: i_s_y
                });

                this.outerStartPoint({
                    x: o_s_x,
                    y: o_s_y
                });

                this.innerEndPoint({
                    x: i_e_x,
                    y: i_e_y
                });


                this.outerEndPoint({
                    x: o_e_x,
                    y: o_e_y
                });

                var absGap = endAngle - startAngle;

                this.innerCenterPoint({
                    x: innerRadius * Math.cos(startAngle + absGap / 2),
                    y: innerRadius * Math.sin(startAngle + absGap / 2)
                });

                this.outerCenterPoint({
                    x: outerRadius * Math.cos(startAngle + absGap / 2),
                    y: outerRadius * Math.sin(startAngle + absGap / 2)
                });


                this.centerPoint({
                    x: (innerRadius + gapRadius / 2) * Math.cos(startAngle + absGap / 2),
                    y: (innerRadius + gapRadius / 2) * Math.sin(startAngle + absGap / 2)
                });

            }
        }
    });
})(nx, nx.global);