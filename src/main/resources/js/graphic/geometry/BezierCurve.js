(function(nx, ui, global) {
    /**
     * @class BezierCurve
     * @namespace nx.geometry
     */
    var EXPORT = nx.define("nx.geometry.BezierCurve", nx.Observable, {
        statics: (function() {
            function transformBezierToPolyline(bezier) {
                var i, polyline = [];
                for (i = 0; i < bezier.length - 1; i++) {
                    polyline.push([bezier[i], bezier[i + 1]]);
                }
                return polyline;
            }

            function transformPolylineToBezier(polyline) {
                var i, bezier = [polyline[0][0]];
                for (i = 0; i < polyline.length; i++) {
                    bezier.push(polyline[i][1]);
                }
                return bezier;
            }

            function transformRecursiveSeparatePoints(points) {
                var i = 0,
                    last = 0,
                    result = [];
                for (i = 0; i < points.length; i++) {
                    if (typeof points[i] !== "number" || points[i] <= last || points[i] > 1) {
                        throw "Invalid bread point list: " + points.join(",");
                    }
                    result.push((points[i] - last) / (1 - last));
                    last = points[i];
                }
                return result;
            }

            function quadLength(t, start, control_1, control_2, end) {
                /* Formula from Wikipedia article on Bezier curves. */
                return start * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * control_1 * (1.0 - t) * (1.0 - t) * t + 3.0 * control_2 * (1.0 - t) * t * t + end * t * t * t;
            }


            return {
                slice: function(bezier, from, to) {
                    if (from === 0) {
                        if (to === 0) {
                            return null;
                        }
                        return EXPORT.breakdown(bezier, to).beziers[0];
                    } else if (!to) {
                        return EXPORT.breakdown(bezier, from).beziers[1];
                    } else {
                        return EXPORT.breakdown(bezier, from, to).beziers[1];
                    }
                },
                breakdown: function(bezier) {
                    // get the rest arguments
                    var rates = Array.prototype.slice.call(arguments, 1);
                    if (!rates.length) {
                        throw "Invalid argument length: " + arguments.length;
                    }
                    rates = transformRecursiveSeparatePoints(rates);
                    var rate, polyline, sep, points = [bezier[0]],
                        beziers = [];
                    // transform bezier points into lines
                    polyline = transformBezierToPolyline(bezier);
                    // iterate all rates
                    while (rates.length) {
                        // get the separate ratio
                        rate = rates.shift();
                        // separate the rest bezier
                        sep = EXPORT.separate(polyline, rate);
                        // mark the points and beziers
                        points.push(sep.point);
                        beziers.push(transformPolylineToBezier(sep.left));
                        // get the rest
                        polyline = sep.right;
                    }
                    // append the rest bezier
                    points.push(bezier[bezier.length - 1]);
                    beziers.push(transformPolylineToBezier(polyline));
                    return {
                        points: points,
                        beziers: beziers
                    };
                },
                /**
                 * @method separate
                 * @param polyline List of intervals (interval=[point-from, point-to], point=[x, y]).
                 * @param rate The rate to separate.
                 * @return {point:[x, y], left: leftPolyline, right: rightPolyline}
                 */
                separate: function separate(polyline, rate) {
                    var rest = 1 - rate;
                    var intervalSeparatePoint = function(interval) {
                        return [interval[0][0] * rest + interval[1][0] * rate, interval[0][1] * rest + interval[1][1] * rate];
                    };
                    var intervalInter = function(i1, i2) {
                        return [intervalSeparatePoint([i1[0], i2[0]]), intervalSeparatePoint([i1[1], i2[1]])];
                    };
                    var polylineLower = function(polyline) {
                        var i, rslt = [];
                        for (i = 0; i < polyline.length - 1; i++) {
                            rslt.push(intervalInter(polyline[i], polyline[i + 1]));
                        }
                        return rslt;
                    };
                    // start iterate
                    var point, left = [],
                        right = [];
                    var intervals = polyline,
                        interval;
                    while (intervals.length) {
                        interval = intervals[0];
                        left.push([interval[0], intervalSeparatePoint(interval)]);
                        interval = intervals[intervals.length - 1];
                        right.unshift([intervalSeparatePoint(interval), interval[1]]);
                        if (intervals.length == 1) {
                            point = intervalSeparatePoint(intervals[0]);
                        }
                        intervals = polylineLower(intervals);
                    }
                    return {
                        point: point,
                        left: left,
                        right: right
                    };
                },
                through: function(points, grade) {
                    // get default grade
                    if (grade === undefined) {
                        grade = points.length - 1;
                    }
                    // check if grade is too low
                    if (grade < 2) {
                        return null;
                    }
                    // TODO generalized algorithm for all grade
                    var anchors = [];
                    if (grade === 2) {
                        var A = points[0];
                        var B = points[2];
                        var X = points[1];
                        var O = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
                        var XX = [X[0] * 2 - O[0], X[1] * 2 - O[1]];
                        anchors.push(A, XX, B);
                    }
                    return anchors;
                },
                locationAlongCurve: function(bezier, distance) {
                    var t;
                    var steps = 1000;
                    var length = 0.0;
                    var previous_dot = [];
                    var start = bezier[0];
                    if (!distance) {
                        return 0;
                    }
                    for (var i = 0; i <= steps; i++) {
                        t = i / steps;
                        var x = quadLength(t, start[0], bezier[1][0], bezier[2][0], bezier[3][0]);
                        var y = quadLength(t, start[1], bezier[1][1], bezier[2][1], bezier[3][1]);
                        if (i > 0) {
                            var x_diff = x - previous_dot[0];
                            var y_diff = y - previous_dot[1];
                            var gap = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
                            if (length < distance && distance < length + gap) {
                                return i / steps;
                            } else {
                                length += gap;
                            }
                        }
                        previous_dot = [x, y];
                    }
                    return NaN;
                },
                positionAlongCurve: function(bezier, distance) {
                    var t;
                    var steps = 1000;
                    var length = 0.0;
                    var previous_dot = null;
                    var start = bezier[0];
                    if (!distance) {
                        return 0;
                    }
                    for (var i = 0; i <= steps; i++) {
                        t = i / steps;
                        var x = quadLength(t, start[0], bezier[1][0], bezier[2][0], bezier[3][0]);
                        var y = quadLength(t, start[1], bezier[1][1], bezier[2][1], bezier[3][1]);
                        if (i > 0) {
                            var x_diff = x - previous_dot[0];
                            var y_diff = y - previous_dot[1];
                            var gap = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
                            if (length < distance && distance < length + gap) {
                                return [x, y];
                            } else {
                                length += gap;
                            }
                        }
                        previous_dot = [x, y];
                    }
                    return NaN;
                },
                getLength: function(bezier) {
                    var t;
                    var steps = 1000;
                    var length = 0.0;
                    var previous_dot = [];
                    var start = bezier[0];
                    for (var i = 0; i <= steps; i++) {
                        t = i / steps;
                        var x = quadLength(t, start[0], bezier[1][0], bezier[2][0], bezier[3][0]);
                        var y = quadLength(t, start[1], bezier[1][1], bezier[2][1], bezier[3][1]);
                        if (i > 0) {
                            var x_diff = x - previous_dot[0];
                            var y_diff = y - previous_dot[1];

                            length += Math.sqrt(x_diff * x_diff + y_diff * y_diff);
                        }
                        previous_dot = [x, y];
                    }
                    return length;
                },
                splines: function(points) {
                    var x = this._splines(points.map(function(item) {
                        return item[0];
                    }));
                    var y = this._splines(points.map(function(item) {
                        return item[1];
                    }));

                    return x.map(function(item, index) {
                        return [index, y[index]];
                    });
                },
                _splines: function(ary) {
                    var p1 = [];
                    var p2 = [];
                    var n = ary.length - 1;

                    /*rhs vector*/
                    var a = [];
                    var b = [];
                    var c = [];
                    var r = [];

                    /*left most segment*/
                    a[0] = 0;
                    b[0] = 2;
                    c[0] = 1;
                    r[0] = ary[0] + 2 * ary[1];

                    /*internal segments*/
                    for (i = 1; i < n - 1; i++) {
                        a[i] = 1;
                        b[i] = 4;
                        c[i] = 1;
                        r[i] = 4 * ary[i] + 2 * ary[i + 1];
                    }

                    /*right segment*/
                    a[n - 1] = 2;
                    b[n - 1] = 7;
                    c[n - 1] = 0;
                    r[n - 1] = 8 * ary[n - 1] + ary[n];

                    /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
                    for (var i = 1; i < n; i++) {
                        var m = a[i] / b[i - 1];
                        b[i] = b[i] - m * c[i - 1];
                        r[i] = r[i] - m * r[i - 1];
                    }

                    p1[n - 1] = r[n - 1] / b[n - 1];
                    for (i = n - 2; i >= 0; --i)
                        p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];

                    /*we have p1, now compute p2*/
                    for (i = 0; i < n - 1; i++)
                        p2[i] = 2 * ary[i + 1] - p1[i + 1];

                    p2[n - 1] = 0.5 * (ary[n] + p1[n - 1]);

                    return {
                        p1: p1,
                        p2: p2
                    };
                }
            };
        })()
    });
})(nx, nx.ui, window);