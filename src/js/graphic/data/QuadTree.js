(function (nx, global) {


    /*
     0|1
     ---
     2|3
     */

    nx.data.QuadTree = function (inPoints, inWidth, inHeight, inCharge) {
        var width = inWidth || 800;
        var height = inHeight || 600;
        var charge = inCharge || 200;
        var points = inPoints;
        var x1 = 0, y1 = 0, x2 = 0, y2 = 0;
        this.root = null;
        this.alpha = 0;

        if (points) {
            var i = 0, length = points.length;
            var point, px, py;
            for (; i < length; i++) {
                point = points[i];
                point.dx = 0;
                point.dy = 0;
                px = point.x;
                py = point.y;
                if (isNaN(px)) {
                    px = point.x = Math.random() * width;
                }
                if (isNaN(py)) {
                    py = point.y = Math.random() * height;
                }
                if (px < x1) {
                    x1 = px;
                } else if (px > x2) {
                    x2 = px;
                }
                if (py < y1) {
                    y1 = py;
                } else if (py > y2) {
                    y2 = py;
                }
            }

            //square
            var dx = x2 - x1, dy = y2 - y1;
            if (dx > dy) {
                y2 = y1 + dx;
            } else {
                x2 = x1 + dy;
            }

            var root = this.root = new QuadTreeNode(this, x1, y1, x2, y2);
            for (i = 0; i < length; i++) {
                root.insert(points[i]);
            }
        }
    };

    var QuadTreeNode = function (inQuadTree, inX1, inY1, inX2, inY2) {
        var x1 = this.x1 = inX1, y1 = this.y1 = inY1, x2 = this.x2 = inX2, y2 = this.y2 = inY2;
        var cx = (x1 + x2) * 0.5, cy = (y1 + y2) * 0.5;
        var dx = (inX2 - inX1) * 0.5;
        var dy = (inY2 - inY1) * 0.5;
        this.point = null;
        this.nodes = null;
        this.insert = function (inPoint) {
            var point = this.point;
            var nodes = this.nodes;
            if (!point && !nodes) {
                this.point = inPoint;
                return;
            }
            if (point) {
                if (Math.abs(point.x - inPoint.x) + Math.abs(point.y - inPoint.y) < 0.01) {
                    this._insert(inPoint);
                } else {
                    this.point = null;
                    this._insert(point);
                    this._insert(inPoint);
                }
            } else {
                this._insert(inPoint);
            }
        };

        this._insert = function (inPoint) {
            var right = inPoint.x >= cx, bottom = inPoint.y >= cy, i = (bottom << 1) + right;
            var index = (bottom << 1) + right;
            var x = x1 + dx * right;
            var y = y1 + dy * bottom;
            var nodes = this.nodes || (this.nodes = []);
            var node = nodes[index] || (nodes[index] = new QuadTreeNode(inQuadTree, x, y, x + dx, y + dy));
            node.insert(inPoint);
        };
    };

})(nx, nx.global);