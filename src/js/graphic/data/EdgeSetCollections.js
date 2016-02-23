(function (nx, global) {

    nx.define('nx.data.ObservableGraph.EdgeSetCollections', nx.data.ObservableObject, {
        events: ['addEdgeSetCollection', 'removeEdgeSetCollection', 'deleteEdgeSetCollection', 'updateEdgeSetCollection', 'updateEdgeSetCollectionCoordinate'],
        properties: {
            edgeSetCollections: {
                value: function () {
                    var edgeSetCollections = new nx.data.ObservableDictionary();
                    edgeSetCollections.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (item) {
                                //[TODO] DEBUG
                                if(item.value()){
                                    this.deleteEdgeSetCollection(item.value().linkKey());
                                }
                            }, this);
                        }
                    }, this);
                    return edgeSetCollections;
                }
            }
        },
        methods: {
            _addEdgeSetCollection: function (data) {
                var esc = new nx.data.EdgeSetCollection();
                var id = esc.__id__;
                var linkKey = data.sourceID + '_' + data.targetID;
                var reverseLinkKey = data.targetID + '_' + data.sourceID;


                esc.sets(data);
                esc.sets({
                    graph: this,
                    linkKey: linkKey,
                    reverseLinkKey: reverseLinkKey,
                    id: id
                });

                esc.source().addEdgeSetCollection(esc, linkKey);
                esc.target().addEdgeSetCollection(esc, linkKey);

                esc.attachEvent();

                this.edgeSetCollections().setItem(linkKey, esc);
                return esc;
            },
            generateEdgeSetCollection: function (esc) {
                esc.generated(true);
                esc.on('updateCoordinate', this._updateEdgeSetCollectionCoordinate, this);
                this.fire('addEdgeSetCollection', esc);
            },
            updateEdgeSetCollection: function (esc) {
                esc.updated(true);
                this.fire('updateEdgeSetCollection', esc);
            },
            removeEdgeSetCollection: function (linkKey) {

                var esc = this.edgeSetCollections().getItem(linkKey);
                if (!esc) {
                    return false;
                }

                esc.generated(false);
                esc.off('updateCoordinate', this._updateEdgeSetCollectionCoordinate, this);

                /**
                 * @event removeEdgeSet
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                 */
                this.fire('removeEdgeSetCollection', esc);
            },

            deleteEdgeSetCollection: function (linkKey) {

                var esc = this.edgeSetCollections().getItem(linkKey);
                if (!esc) {
                    return false;
                }
                esc.off('updateCoordinate', this._updateEdgeSetCollectionCoordinate, this);
                esc.source().removeEdgeSetCollection(linkKey);
                esc.target().removeEdgeSetCollection(linkKey);

                /**
                 * @event removeEdgeSet
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                 */
                this.fire('deleteEdgeSetCollection', esc);

                this.edgeSetCollections().removeItem(linkKey);

                esc.dispose();
            },
            getEdgeSetCollectionBySourceAndTarget: function (source, target) {
                var edgeSetCollections = this.edgeSetCollections();

                var sourceID = nx.is(source, nx.data.Vertex) ? source.id() : source;
                var targetID = nx.is(target, nx.data.Vertex) ? target.id() : target;

                var linkKey = sourceID + '_' + targetID;
                var reverseLinkKey = targetID + '_' + sourceID;

                return edgeSetCollections.getItem(linkKey) || edgeSetCollections.getItem(reverseLinkKey);
            },
            _updateEdgeSetCollectionCoordinate: function (sender, args) {
                this.fire('updateEdgeSetCollectionCoordinate', sender);
            },
            eachEdgeCollections: function (callback, context) {
                this.edgeSetCollections().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            _generateConnection: function (edgeSet) {

                if (!edgeSet.source().visible() || !edgeSet.target().visible()) {
                    return;
                }

                var obj = this._getGeneratedRootVertexSetOfEdgeSet(edgeSet);

                if (!obj.source || !obj.target) {
                    return;
                }

                if (obj.source == obj.target) {
                    return;
                }

                if (!obj.source.visible() || !obj.target.visible()) {
                    return;
                }


                if (obj.source.id() == edgeSet.sourceID() && obj.target.id() == edgeSet.targetID()) {
                    this.generateEdgeSet(edgeSet);
                } else {
                    var esc = this.getEdgeSetCollectionBySourceAndTarget(obj.source.id(), obj.target.id());
                    if (!esc) {
                        esc = this._addEdgeSetCollection({
                            source: obj.source,
                            target: obj.target,
                            sourceID: obj.source.id(),
                            targetID: obj.target.id()
                        });
                        this.generateEdgeSetCollection(esc);
                    }
                    esc.addEdgeSet(edgeSet);
                    this.updateEdgeSetCollection(esc);
                }
            },
            _getGeneratedRootVertexSetOfEdgeSet: function (edgeSet) {
                var source = edgeSet.source();
                if (!source.generated()) {
                    source = source.generatedRootVertexSet();
                }
                var target = edgeSet.target();
                if (!target.generated()) {
                    target = target.generatedRootVertexSet();
                }
                return {
                    source: source,
                    target: target
                };
            }
        }
    });


})(nx, nx.global);