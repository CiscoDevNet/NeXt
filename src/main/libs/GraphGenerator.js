(function () {
    var MIN_GROUPS = 2,
        MAX_GROUPS = 10;

    var groupIndex = 0;


    function GraphGenerator(groupLevel) {
        this.nodes = [];
        this.links = [];
        this.strategies = [];
        this.groupIndex = groupLevel || 10;
        this.registerLinkStrategy(generateCircleLinks);
        this.registerLinkStrategy(generateTreeLinks);
        this.registerLinkStrategy(generateLineLinks);
    }

    GraphGenerator.prototype = {
        constructor: GraphGenerator,
        generate: function (size) {
            size = size || 32;
            this._initNodes(size);
            this._processNodes(0, size - 1, 1);
        },
        registerLinkStrategy: function (strategy) {
            this.strategies.push(strategy);
        },
        _initNodes: function (size) {
            var i = 0,
                nodes = this.nodes;
            //todo
            if (size.length > 0) {
                this.nodes = size;
            }
            else {
                for (; i < size; i++) {
                    nodes.push({
                        id: i
                    });
                }
            }
        },
        _processNodes: function (startIndex, endIndex, level) {
            var nodes = this.nodes, node;

//            if (level == this.groupIndex) {
//                groupIndex++;
//                for (i = startIndex; i <= endIndex; i++) {
//                    node = nodes[i];
//                    if (!node.group) {
//                        node.group = groupIndex;
//                    }
//                }
//            }


            if ((endIndex - startIndex) < MIN_GROUPS) {
                for (i = startIndex; i <= endIndex; i++) {
                    node = nodes[i];
                    if (!node.level) {
                        node.level = level;
                    }
                }

                this.links = this.links.concat(this._generateLinks(this._rangeArray(startIndex, endIndex)));
            }
            else {
                var indices = this._randomArray(startIndex, endIndex)
                    .slice(0, this._randomNumber(MIN_GROUPS, MAX_GROUPS))
                    .sort(function (a, b) {
                        return a - b;
                    });


                var length = indices.length,
                    i;

                if (startIndex < indices[0]) {
                    indices.unshift(startIndex);
                    length = indices.length;
                }

                if (endIndex > indices[length - 1]) {
                    indices.push(endIndex);
                    length = indices.length;
                }

                for (i = 0; i < length; i++) {
                    node = nodes[indices[i]];
                    if (!node.level) {
                        node.level = level;
                    }
                }
                this.links = this.links.concat(this._generateLinks(indices));

                //recursion
                if (length > 1) {
                    this._processNodes(indices[0], indices[1], level + 1);
                }
                for (i = 1; i < length - 1; i++) {
                    this._processNodes(indices[i] + 1, indices[i + 1], level + 1);
                }
            }
        },
        _rangeArray: function (from, to) {
            var result = [];
            for (var i = from; i <= to; i++) {
                result.push(i);
            }

            return result;
        },
        _randomNumber: function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        _randomArray: function randomArray(min, max) {
            var numbers = [],
                result = [],
                index,
                i;
            for (i = min; i <= max; i++) {
                numbers.push(i);
            }

            for (i = numbers.length - 1; i >= 0; i--) {
                index = this._randomNumber(0, i);
                result = result.concat(numbers.splice(index, 1));
            }
            return result;
        },
        _generateLinks: function (indices) {
            var strategyIndex = this._randomNumber(0, this.strategies.length - 1);
            var strategy = this.strategies[strategyIndex];

            if (typeof strategy == 'function') {
                return strategy.call(this, indices);
            }
        }
    }

    function generateTreeLinks(indices) {
        var links = [];

        for (var i = 1, length = indices.length; i < length; i++) {
            links.push({
                source: indices[0],
                target: indices[i]
            });
        }

        return links;
    }

    function generateCircleLinks(indices) {
        var links = [],
            length = indices.length;

        for (var i = 0; i < length - 1; i++) {
            if (indices[i + 1] === undefined) {
                debugger;
            }
            links.push({
                source: indices[i],
                target: indices[i + 1]
            });
        }

        if (length > 2) {
            links.push({
                source: indices[i],
                target: indices[0]
            });
        }

        return links;
    }

    function generateLineLinks(indices) {
        var links = [],
            length = indices.length;

        for (var i = 0; i < length - 1; i++) {
            if (indices[i + 1] === undefined) {
                debugger;
            }
            links.push({
                source: indices[i],
                target: indices[i + 1]
            });
        }

        return links;
    }

    window.GraphGenerator = GraphGenerator;
})();