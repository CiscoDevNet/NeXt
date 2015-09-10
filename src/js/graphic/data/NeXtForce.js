(function (nx, global) {

    /**
     * NeXt force layout algorithm class
     * @class nx.data.Force
     */

    /**
     * Force layout algorithm class constructor function
     * @param inWidth {Number} force stage width, default 800
     * @param inHeight {Number} force stage height, default 800
     * @constructor
     */

    nx.data.NextForce = function (inWidth, inHeight) {
        var width = inWidth || 800;
        var height = inHeight || 800;
        var strength = 4;
        var distance = 100;
        var gravity = 0.1;
        this.charge = 1200;
        this.alpha = 1;

        this.totalEnergy = Infinity;
        this.maxEnergy = Infinity;

        var threshold = 2;
        var theta = 0.8;
        this.nodes = null;
        this.links = null;
        this.quadTree = null;
        /**
         * Set data to this algorithm
         * @method setData
         * @param inJson {Object} Follow Common Topology Data Definition
         */
        this.setData = function (inJson) {
            var nodes = this.nodes = inJson.nodes;
            var links = this.links = inJson.links;
            var nodeMap = this.nodeMap = {};
            var weightMap = this.weightMap = {};
            var maxWeight = this.maxWeight = 1;
            var node, link, i = 0, length = nodes.length, id, weight;
            for (; i < length; i++) {
                node = nodes[i];
                id = node.id;
                nodeMap[id] = node;
                weightMap[id] = 0;
            }
            if (links) {
                length = links.length;
                for (i = 0; i < length; ++i) {
                    link = links[i];
                    id = link.source;
                    weight = ++weightMap[id];
                    if (weight > maxWeight) {
                        this.maxWeight = weight;
                    }
                    id = link.target;
                    weight = ++weightMap[id];
                    if (weight > maxWeight) {
                        this.maxWeight = weight;
                    }
                }
            }
        };
        /**
         * Start processing
         * @method start
         */
        this.start = function () {
            var totalEnergyThreshold = threshold * this.nodes.length;
            while (true) {
                this.tick();
                if (this.maxEnergy < threshold * 5 && this.totalEnergy < totalEnergyThreshold) {
                    break;
                }
            }
        };
        /**
         * Tick whole force stage
         * @method tick
         */
        this.tick = function () {
            var nodes = this.nodes;
            var quadTree = this.quadTree = new nx.data.QuadTree(nodes, width, height);
            this._calculateLinkEffect();
            this._calculateCenterGravitation();

            var root = quadTree.root;
            this._calculateQuadTreeCharge(root);
//            var chargeCallback = this.chargeCallback;
//            if (chargeCallback) {
//                chargeCallback.call(scope, root);
//            }
            var i, length = nodes.length, node;
            for (i = 0; i < length; i++) {
                node = nodes[i];
                this._calculateChargeEffect(root, node);
            }
            this._changePosition();
        };
        this._changePosition = function () {
            var totalEnergy = 0;
            var maxEnergy = 0;
            var nodes = this.nodes;
            var i, node, length = nodes.length, x1 = 0, y1 = 0, x2 = 0, y2 = 0, x, y, energy, dx, dy, allFixed = true;
            for (i = 0; i < length; i++) {
                node = nodes[i];
                dx = node.dx * 0.5;
                dy = node.dy * 0.5;
                energy = Math.abs(dx) + Math.abs(dy);

                if (!node.fixed) {

                    totalEnergy += energy;

                    if (energy > maxEnergy) {
                        maxEnergy = energy;
                    }
                }


                if (!node.fixed) {
                    x = node.x += dx;
                    y = node.y += dy;
                    allFixed = false;
                } else {
                    x = node.x;
                    y = node.y;
                }
                if (x < x1) {
                    x1 = x;
                } else if (x > x2) {
                    x2 = x;
                }
                if (y < y1) {
                    y1 = y;
                } else if (y > y2) {
                    y2 = y;
                }
            }
            this.totalEnergy = allFixed ? 0 : totalEnergy;
            this.maxEnergy = allFixed ? 0 : maxEnergy;
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        };
        this._calculateCenterGravitation = function () {
            var nodes = this.nodes;
            var node, x, y;
            var length = nodes.length;

            var k = 0.5 * gravity;
            x = width / 2;
            y = height / 2;
            for (var i = 0; i < length; i++) {
                node = nodes[i];
                node.dx += (x - node.x) * k;
                node.dy += (y - node.y) * k;
            }
        };
        this._calculateLinkEffect = function () {
            var links = this.links;
            var nodeMap = this.nodeMap;
            var weightMap = this.weightMap;
            var i, length , link, source, target, dx, dy, d2, d, dk, k, sWeight, tWeight, totalWeight;
            if (links) {
                length = links.length;
                for (i = 0; i < length; ++i) {
                    link = links[i];
                    source = nodeMap[link.source];
                    target = nodeMap[link.target];
                    dx = target.x - source.x;
                    dy = target.y - source.y;
                    if (dx === 0 && dy === 0) {
                        target.x += Math.random() * 5;
                        target.y += Math.random() * 5;
                        dx = target.x - source.x;
                        dy = target.y - source.y;
                    }
                    d2 = dx * dx + dy * dy;
                    d = Math.sqrt(d2);
                    if (d2) {
                        var maxWeight = this.maxWeight;
                        dk = strength * (d - distance) / d;
                        dx *= dk;
                        dy *= dk;
                        sWeight = weightMap[source.id];
                        tWeight = weightMap[target.id];
                        totalWeight = sWeight + tWeight;
                        k = sWeight / totalWeight;
                        target.dx -= (dx * k) / maxWeight;
                        target.dy -= (dy * k) / maxWeight;
                        k = 1 - k;
                        source.dx += (dx * k) / maxWeight;
                        source.dy += (dy * k) / maxWeight;
                    }
                }
            }
        };
        this._calculateQuadTreeCharge = function (inNode) {
            if (inNode.fixed) {
                return;
            }
            var nodes = inNode.nodes;
            var point = inNode.point;
            var chargeX = 0, chargeY = 0, charge = 0;
            if (!nodes) {
                inNode.charge = inNode.pointCharge = this.charge;
                inNode.chargeX = point.x;
                inNode.chargeY = point.y;
                return;
            }
            if (nodes) {
                var i = 0, length = nodes.length, node, nodeCharge;
                for (; i < length; i++) {
                    node = nodes[i];
                    if (node) {
                        this._calculateQuadTreeCharge(node);
                        nodeCharge = node.charge;
                        charge += nodeCharge;
                        chargeX += nodeCharge * node.chargeX;
                        chargeY += nodeCharge * node.chargeY;
                    }
                }
            }
            if (point) {
                var thisCharge = this.charge;
                charge += thisCharge;
                chargeX += thisCharge * point.x;
                chargeY += thisCharge * point.y;
            }
            inNode.charge = charge;
            inNode.chargeX = chargeX / charge;
            inNode.chargeY = chargeY / charge;
        };
        this._calculateChargeEffect = function (inNode, inPoint) {
            if (this.__calculateChargeEffect(inNode, inPoint)) {
                var nodes = inNode.nodes;
                if (nodes) {
                    var node, i = 0, length = nodes.length;
                    for (; i < length; i++) {
                        node = nodes[i];
                        if (node) {
                            this._calculateChargeEffect(node, inPoint);
                        }
                    }
                }

            }
        };

        this.__calculateChargeEffect = function (inNode, inPoint) {
            if (inNode.point != inPoint) {
                var dx = inNode.chargeX - inPoint.x;
                var dy = inNode.chargeY - inPoint.y;
                var d2 = dx * dx + dy * dy;
                var d = Math.sqrt(d2);
                var dk = 1 / d;
                var k;
                if ((inNode.x2 - inNode.x1) * dk < theta) {
                    k = inNode.charge * dk * dk;
                    inPoint.dx -= dx * k;
                    inPoint.dy -= dy * k;
                    return false;
                } else {
                    if (inNode.point) {
                        if (!isFinite(dk)) {
                            inPoint.dx -= Math.random() * 10;
                            inPoint.dy -= Math.random() * 10;
                        } else if (inNode.pointCharge) {
                            k = inNode.pointCharge * dk * dk;
                            inPoint.dx -= dx * k;
                            inPoint.dy -= dy * k;
                        }
                    }
                }
            }
            return true;
        };
    };
})(nx, nx.global);