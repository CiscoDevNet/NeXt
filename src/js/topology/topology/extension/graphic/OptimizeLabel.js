(function (nx, global) {

    var OptimizeLabel = nx.define({
        events: [],
        properties: {
        },
        methods: {
            init: function () {
                console.log();
            },
            optimizeLabel: function (sender, args) {

                if (console) {
                    console.time('optimizeLabel');
                }


                var topo = this;
                var stageScale = topo.stageScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };

                topo.eachNode(function (node) {
                    node.enableSmartLabel(true);
                    node.calcLabelPosition(true);
                });


                var boundCollection = {};
                topo.eachNode(function (node, id) {
                    if (node.view().visible()) {
                        var bound = topo.getInsideBound(node.getBound());
                        var nodeBound = {
                            left: bound.left * stageScale - translate.x * stageScale,
                            top: bound.top * stageScale - translate.y * stageScale,
                            width: bound.width * stageScale,
                            height: bound.height * stageScale
                        };
                        boundCollection[id] = nodeBound;

                        //test
//                        var rect = new nx.graphic.Rect(nodeBound);
//                        rect.sets({
//                            stroke: '#f00',
//                            fill: 'none',
//                            x: nodeBound.left,
//                            y: nodeBound.top
//                        });
//
//                        rect.attach(topo.stage());
                    }

                });

                var boundHitTest = nx.util.boundHitTest;

                topo.eachNode(function (node) {
                    if (node.view().visible()) {
                        var bound = topo.getInsideBound(node.view('label').getBound());
                        var labelBound = {
                            left: bound.left * stageScale - translate.x * stageScale,
                            top: bound.top * stageScale - translate.y * stageScale,
                            width: bound.width * stageScale,
                            height: bound.height * stageScale
                        };

//                        var labelrect = new nx.graphic.Rect(labelBound);
//                        labelrect.sets({
//                            stroke: '#f50',
//                            fill: 'none',
//                            x: labelBound.left,
//                            y: labelBound.top
//                        });
//                        labelrect.attach(topo.stage());


                        var labelOverlap = false;
                        nx.each(boundCollection, function (nodeBound, id) {
                            if (id == node.id()) {
                                return;
                            }
//                            if (rect) {
//                                rect.dispose();
//                            }
//                            var rect = new nx.graphic.Rect(nodeBound);
//                            rect.sets({
//                                stroke: '#f00',
//                                fill: 'none',
//                                x: nodeBound.left,
//                                y: nodeBound.top
//                            });
//
//                            rect.attach(topo.stage());
                            if (boundHitTest(labelBound, nodeBound)) {
                                labelOverlap = true;
                            }
//                            console.log(boundHitTest(labelBound, nodeBound), node.label());
                        });

                        if (labelOverlap) {
                            node.labelAngle(90);
                            node.enableSmartLabel(false);
                            node.calcLabelPosition(true);
                        }
                    }

                });


                if (console) {
                    console.timeEnd('optimizeLabel');
                }

            }
        }
    });


    nx.graphic.Topology.registerExtension(OptimizeLabel);


})(nx, nx.global);