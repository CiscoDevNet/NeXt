(function (global, document, undefined) {

    var ln, scriptSrc, match;
    var path = '', xPath;
    var scripts = document.getElementsByTagName('script');
    for (i = 0, ln = scripts.length; i < ln; i++) {
        scriptSrc = scripts[i].src;
        match = scriptSrc.match('next-graphic.js');
        if (match) {
            path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
            break;
        }
    }


    var files = [
        "src/js/util/util.js",
        "src/js/util/query.js",
        "src/js/util/Animation.js",


        "src/js/ui/ZIndexManager.js",
        "src/js/ui/PopupContainer.js",
        "src/js/ui/Popup.js",
        "src/js/ui/Popover.js",


        "src/js/core/DragManager.js",
        "src/js/core/Component.js",


        "src/js/svg/Group.js",
        "src/js/svg/ICON.js",
        "src/js/svg/Icons.js",
        "src/js/svg/Circle.js",
        "src/js/svg/Image.js",
        "src/js/svg/Line.js",
        "src/js/svg/Path.js",
        "src/js/svg/Polygon.js",
        "src/js/svg/Rect.js",
        "src/js/svg/Stage.js",
        "src/js/svg/Text.js",
        "src/js/svg/Triangle.js",
        "src/js/svg/BezierCurves.js",
        "src/js/svg/Arc.js",

        "src/js/geometry/MatrixSupport.js",
        "src/js/geometry/Matrix.js",
        "src/js/geometry/Math.js",
        "src/js/geometry/BezierCurve.js",
        "src/js/geometry/Vector.js",
        "src/js/geometry/Vector.js",
        "src/js/geometry/Line.js",

        "src/js/data/QuadTree.js",
        "src/js/data/NeXtForce.js",
        "src/js/data/Force.js",
        "src/js/data/Convex.js",


        "src/js/data/Vertex.js",
        "src/js/data/Edge.js",
        "src/js/data/VertexSet.js",
        "src/js/data/EdgeSet.js",
        "src/js/data/EdgeSetCollection.js",

        "src/js/data/Vertices.js",
        "src/js/data/VertexSets.js",
        "src/js/data/Edges.js",
        "src/js/data/EdgeSets.js",
        "src/js/data/EdgeSetCollections.js",


        "src/js/data/processor/NeXtForce.js",
        "src/js/data/processor/Force.js",
        "src/js/data/processor/Quick.js",
        "src/js/data/processor/Circle.js",
        "src/js/data/DataProcessor.js",
        "src/js/data/ObservableGraph.js",
        "src/js/data/UniqObservableCollection.js",


        "src/js/topology/core/Config.js",
        "src/js/topology/core/Graph.js",
        "src/js/topology/core/Event.js",
        "src/js/topology/node/NodeMixin.js",
        "src/js/topology/link/LinkMixin.js",
        "src/js/topology/layer/LayerMixin.js",
        "src/js/topology/core/StageMixin.js",
        "src/js/topology/tooltip/TooltipMixin.js",
        "src/js/topology/scene/SceneMixin.js",
        "src/js/topology/layout/LayoutMixin.js",
        "src/js/topology/core/Categories.js",
        "src/js/topology/core/Topology.js",

        "src/js/topology/layer/Layer.js",

        "src/js/topology/node/NodeWatcher.js",
        "src/js/topology/node/AbstractNode.js",
        "src/js/topology/node/Node.js",
        "src/js/topology/node/NodesLayer.js",
        "src/js/topology/node/NodeSet.js",
        "src/js/topology/node/NodeSetLayer.js",

        "src/js/topology/link/AbstractLink.js",

        "src/js/topology/link/Link.js",
        "src/js/topology/link/LinksLayer.js",
        "src/js/topology/link/LinkSet.js",
        "src/js/topology/link/LinkSetLayer.js",


        "src/js/topology/layout/HierarchicalLayout.js",
        "src/js/topology/layout/EnterpriseNetworkLayout.js",
        "src/js/topology/layout/NeXtForceLayout.js",
        "src/js/topology/layout/USMapLayout.js",
        "src/js/topology/layout/WorldMapLayout.js",

        "src/js/topology/tooltip/TooltipPolicy.js",
        "src/js/topology/tooltip/TopologyTooltip.js",
        "src/js/topology/tooltip/NodeTooltip.js",
        "src/js/topology/tooltip/LinkTooltip.js",
        "src/js/topology/tooltip/LinkSetTooltip.js",
        "src/js/topology/tooltip/TooltipManager.js",

        "src/js/topology/scene/Scene.js",
        "src/js/topology/scene/DefaultScene.js",
        "src/js/topology/scene/SelectionScene.js",
        "src/js/topology/scene/SelectionNodeScene.js",
        "src/js/topology/scene/ZoomBySelection.js",

        "src/js/topology/group/GroupsLayer.js",
        "src/js/topology/group/GroupItem.js",
        "src/js/topology/group/RectGroup.js",
        "src/js/topology/group/CircleGroup.js",
        "src/js/topology/group/PolygonGroup.js",
        "src/js/topology/group/NodeSetPolygonGroup.js",


        "src/js/topology/path/Path.js",
        "src/js/topology/path/BasePath.js",
        "src/js/topology/path/PathLayer.js",

        "src/js/topology/plugin/Nav.js",
        "src/js/topology/plugin/Thumbnail.js",

        "src/js/topology/extension/graphic/OptimizeLabel.js",
        "src/js/topology/extension/graphic/FillStage.js"
    ];

    xPath = path + "../../";

    for (var h = 0; h < files.length; h++) {
        document.write("<script type='text/javascript' src='" + xPath + files[h] + "'></script>");
    }


}(window, document, undefined));