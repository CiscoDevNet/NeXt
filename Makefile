FILES_SRC = \
	src/js/base/base.js \
	src/js/base/class.js \
	src/js/base/keyword.js \
	src/js/base/Comparable.js \
	src/js/base/Iterable.js \
	src/js/base/Observable.js \
	src/js/base/Serializable.js \
	src/js/base/data/Counter.js \
	src/js/base/data/Collection.js \
	src/js/base/data/Dictionary.js \
	src/js/base/data/ObservableObject.js \
	src/js/base/data/ObservableCollection.js \
	src/js/base/data/ObservableDictionary.js \
	src/js/base/data/Query.js \
	src/js/base/data/SortedMap.js \
	src/js/web/Env.js \
	src/js/web/Util.js \
	src/js/web/HttpClient.js \
	src/js/web/dom/Node.js \
	src/js/web/dom/Text.js \
	src/js/web/dom/Element.js \
	src/js/web/dom/Fragment.js \
	src/js/web/dom/Document.js \
	src/js/web/ui/SimpleComponent.js \
	src/js/web/ui/AbstractComponent.js \
	src/js/web/ui/Component.js \
	src/js/web/ui/Application.js \
	src/js/topology/util/util.js \
	src/js/topology/util/query.js \
	src/js/topology/util/Animation.js \
	src/js/topology/ui/ZIndexManager.js \
	src/js/topology/ui/PopupContainer.js \
	src/js/topology/ui/Popup.js \
	src/js/topology/ui/Popover.js \
	src/js/topology/core/DragManager.js \
	src/js/topology/core/Component.js \
	src/js/topology/svg/Group.js \
	src/js/topology/svg/ICON.js \
	src/js/topology/svg/Icons.js \
	src/js/topology/svg/Circle.js \
	src/js/topology/svg/Image.js \
	src/js/topology/svg/Line.js \
	src/js/topology/svg/Path.js \
	src/js/topology/svg/Polygon.js \
	src/js/topology/svg/Rect.js \
	src/js/topology/svg/Stage.js \
	src/js/topology/svg/Text.js \
	src/js/topology/svg/Triangle.js \
	src/js/topology/svg/BezierCurves.js \
	src/js/topology/geometry/MatrixSupport.js \
	src/js/topology/geometry/Matrix.js \
	src/js/topology/geometry/Math.js \
	src/js/topology/geometry/BezierCurve.js \
	src/js/topology/geometry/Vector.js \
	src/js/topology/geometry/Vector.js \
	src/js/topology/geometry/Line.js \
	src/js/topology/data/QuadTree.js \
	src/js/topology/data/NeXtForce.js \
	src/js/topology/data/Force.js \
	src/js/topology/data/Convex.js \
	src/js/topology/data/Vertex.js \
	src/js/topology/data/Edge.js \
	src/js/topology/data/VertexSet.js \
	src/js/topology/data/EdgeSet.js \
	src/js/topology/data/EdgeSetCollection.js \
	src/js/topology/data/Vertices.js \
	src/js/topology/data/VertexSets.js \
	src/js/topology/data/Edges.js \
	src/js/topology/data/EdgeSets.js \
	src/js/topology/data/EdgeSetCollections.js \
	src/js/topology/data/processor/NeXtForce.js \
	src/js/topology/data/processor/Force.js \
	src/js/topology/data/processor/Quick.js \
	src/js/topology/data/processor/Circle.js \
	src/js/topology/data/DataProcessor.js \
	src/js/topology/data/ObservableGraph.js \
	src/js/topology/data/UniqObservableCollection.js \
	src/js/topology/topology/core/Config.js \
	src/js/topology/topology/core/Graph.js \
	src/js/topology/topology/core/Event.js \
	src/js/topology/topology/node/NodeMixin.js \
	src/js/topology/topology/link/LinkMixin.js \
	src/js/topology/topology/layer/LayerMixin.js \
	src/js/topology/topology/core/StageMixin.js \
	src/js/topology/topology/tooltip/TooltipMixin.js \
	src/js/topology/topology/scene/SceneMixin.js \
	src/js/topology/topology/layout/LayoutMixin.js \
	src/js/topology/topology/core/Categories.js \
	src/js/topology/topology/core/Topology.js \
	src/js/topology/topology/layer/Layer.js \
	src/js/topology/topology/node/NodeWatcher.js \
	src/js/topology/topology/node/AbstractNode.js \
	src/js/topology/topology/node/Node.js \
	src/js/topology/topology/node/NodesLayer.js \
	src/js/topology/topology/node/NodeSet.js \
	src/js/topology/topology/node/NodeSetLayer.js \
	src/js/topology/topology/link/AbstractLink.js \
	src/js/topology/topology/link/Link.js \
	src/js/topology/topology/link/LinksLayer.js \
	src/js/topology/topology/link/LinkSet.js \
	src/js/topology/topology/link/LinkSetLayer.js \
	src/js/topology/topology/layout/HierarchicalLayout.js \
	src/js/topology/topology/layout/EnterpriseNetworkLayout.js \
	src/js/topology/topology/layout/NeXtForceLayout.js \
	src/js/topology/topology/layout/USMapLayout.js \
	src/js/topology/topology/layout/WorldMapLayout.js \
	src/js/topology/topology/tooltip/TooltipPolicy.js \
	src/js/topology/topology/tooltip/TopologyTooltip.js \
	src/js/topology/topology/tooltip/NodeTooltip.js \
	src/js/topology/topology/tooltip/LinkTooltip.js \
	src/js/topology/topology/tooltip/LinkSetTooltip.js \
	src/js/topology/topology/tooltip/TooltipManager.js \
	src/js/topology/topology/scene/Scene.js \
	src/js/topology/topology/scene/DefaultScene.js \
	src/js/topology/topology/scene/SelectionScene.js \
	src/js/topology/topology/scene/SelectionNodeScene.js \
	src/js/topology/topology/scene/ZoomBySelection.js \
	src/js/topology/topology/group/GroupsLayer.js \
	src/js/topology/topology/group/GroupItem.js \
	src/js/topology/topology/group/RectGroup.js \
	src/js/topology/topology/group/CircleGroup.js \
	src/js/topology/topology/group/PolygonGroup.js \
	src/js/topology/topology/group/NodeSetPolygonGroup.js \
	src/js/topology/topology/path/Path.js \
	src/js/topology/topology/path/BasePath.js \
	src/js/topology/topology/path/PathLayer.js \
	src/js/topology/topology/plugin/Nav.js \
	src/js/topology/topology/plugin/Thumbnail.js \
	src/js/topology/topology/extension/graphic/OptimizeLabel.js \
	src/js/topology/topology/extension/graphic/FillStage.js



all: clean folder resource contact yuidoc uglify test copy

dev: clean folder resource contact copy

clean:
	@rm -rf target/*

folder:
	@mkdir -p target

resource:
	@printf "Less..."

	@mkdir -p target/css

	@lessc src/style/topology/next-topology.less  target/css/next.css

	@lessc src/style/topology/next-topology-componentized.less target/css/next-componentized.css

	@printf "Fonts..."

	@mkdir -p target/fonts

	@cp -R src/style/fonts/* target/fonts

	@echo "Done."

contact:
	@printf "Package ... "
	@mkdir -p target/js
	@cat ${FILES_SRC} > target/js/next.js
	@echo "Done."

yuidoc:
	@printf "Generate docs ... "
	@yuidoc target/js/ -q -c src/bin/yuidoc.json -o target/docs
	@echo "Done."

uglify:
	@printf "Uglify ... "
	@uglify -s target/js/next.js -o target/js/next.min.js > /dev/null
	@echo "Done."

test:
	@mkdir -p target/test

	@printf "Base: test ... "
	@node src/bin/phantom-autotest.js src/test/base/index.html -s target/test/next-base-test-report.png -r target/test/next-base-test-report.xml

	@printf "Web: test ... "
	@node src/bin/phantom-autotest.js src/test/web/index.html -s target/test/next-web-test-report.png -r target/test/next-web-test-report.xml

	@printf "Topology: test ... "
	@node src/bin/phantom-autotest.js src/test/topology/index.html -s target/test/next-topology-test-report.png -r target/test/next-topology-test-report.xml

copy:
	@rm -rf src/dist/*
	@cp -R target/fonts src/dist/fonts
	@cp -R target/css src/dist/css
	@cp -R target/js src/dist/js