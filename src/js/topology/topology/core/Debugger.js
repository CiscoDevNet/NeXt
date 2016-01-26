(function (nx, global) {


    var debug = {};
    var timer = debug.timer = {};
    var _timer = {};
    debug.inject = function (topo) {
        var startTime = new Date();

        timer.startTime = {cost: new Date() - startTime};

        topo.on('beforeSetData', function () {
            timer.beforeSetData = {cost: new Date() - startTime};
        });

        topo.on('afterSetData', function () {
            timer.afterSetData = {cost: new Date() - startTime};
        });

        topo.on('topologyGenerated', function () {
            timer.topologyGenerated = {cost: new Date() - startTime};
        });

        var graph = topo.graph();

        graph.on("setData", function (sender, data) {
            timer['graph-setData'] = {cost: new Date() - startTime};
        }, this);

        graph.on("startGenerate", function (sender, event) {
            timer['graph-startGenerate'] = {cost: new Date() - startTime};
        }, this);


        graph.on("endGenerate", function (sender, event) {
            timer['graph-endGenerate'] = {cost: new Date() - startTime};
        }, this);


        graph.on("insertData", function (sender, data) {
            timer['graph-insertData'] = {cost: new Date() - startTime};
        }, this);

        _timer.totoalVertexTime = 0;


        graph.on("clear", function (sender, event) {

        }, this);
        _timer.totoalVertices = 0;


        graph.on("addVertex", function (sender, vertex) {
            _timer.totoalVertexTime += new Date() - (_timer.vertexTime || new Date());
            _timer.totoalVertices += 1;
            _timer.vertexTime = new Date();
        }, this);

        _timer.totoalEdgeTime = 0;
        _timer.totoalEdges = 0;
        graph.on("addEdge", function (sender, edge) {
            _timer.totoalEdgeTime += new Date() - (_timer.edgeTime || new Date());
            _timer.totoalEdges += 1;
            _timer.edgeTime = new Date();
        }, this);


        _timer.totoalEdgeSetTime = 0;
        _timer.totoalEdgeSet = 0;

        graph.on("addEdgeSet", function (sender, edgeSet) {
            _timer.totoalEdgeSetTime += new Date() - (_timer.edgeSetTime || new Date());
            _timer.totoalEdgeSet += 1;
            _timer.edgeSetTime = new Date();
        }, this);

        _timer.totoalVertexSetTime = 0;
        _timer.totoalVertexSet = 0;

        graph.on("addVertexSet", function (sender, vertexSet) {
            _timer.totoalVertexSetTime += new Date() - (_timer.vertexSetTime || new Date());
            _timer.totoalVertexSet += 1;
            _timer.vertexSetTime = new Date();
        }, this);

        _timer.totoalEdgeSetCollectionTime = 0;
        _timer.totoalEdgeSetCollection = 0;
        graph.on("addEdgeSetCollection", function (sender, esc) {
            _timer.totoalEdgeSetCollectionTime += new Date() - (_timer.edgeSetCollectionTime || new Date());
            _timer.totoalEdgeSetCollection += 1;
            _timer.edgeSetCollectionTime = new Date();
        }, this);


        debug.topo = topo;

    };
    debug.print = function () {
        timer.perVertex = {cost: _timer.totoalVertexTime / ( _timer.totoalVertices - 1)};
        timer.perEdge = {cost: _timer.totoalEdgeTime / ( _timer.totoalEdges - 1)};
        timer.perEdgeSet = {cost: _timer.totoalEdgeSetTime / ( _timer.totoalEdgeSet - 1)};
        timer.perVertexSet = {cost: _timer.totoalVertexSetTime / ( _timer.totoalVertexSet - 1)};
        timer.perEdgeSetCollection = {cost: _timer.totoalEdgeSetCollectionTime / ( _timer.totoalEdgeSetCollection - 1)};

        console.table(timer);

    };
    window.topologyDebugger = debug;


})(nx, nx.global);