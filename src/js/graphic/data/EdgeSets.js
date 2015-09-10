(function (nx, global) {

    nx.define('nx.data.ObservableGraph.EdgeSets', nx.data.ObservableObject, {
        events: ['addEdgeSet', 'updateEdgeSet', 'removeEdgeSet', 'deleteEdgeSet', 'updateEdgeSetCoordinate'],
        properties: {
            edgeSets: {
                value: function () {
                    var edgeSets = new nx.data.ObservableDictionary();
                    edgeSets.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (item) {
                                this.deleteEdgeSet(item.key());
                            }, this);
                        }
                    }, this);
                    return edgeSets;
                }
            }
        },
        methods: {
            _addEdgeSet: function (data) {
                var edgeSet = new nx.data.EdgeSet();
                var id = edgeSet.__id__;
                var linkKey = data.sourceID + '_' + data.targetID;
                var reverseLinkKey = data.targetID + '_' + data.sourceID;


                edgeSet.sets(data);
                edgeSet.sets({
                    graph: this,
                    linkKey: linkKey,
                    reverseLinkKey: reverseLinkKey,
                    id: id
                });

                edgeSet.source().addEdgeSet(edgeSet, linkKey);
                edgeSet.target().addEdgeSet(edgeSet, linkKey);

                edgeSet.attachEvent();

                this.edgeSets().setItem(linkKey, edgeSet);
                return edgeSet;
            },
            generateEdgeSet: function (edgeSet) {
                if (!edgeSet.generated() && edgeSet.source().generated() && edgeSet.target().generated()) {
                    edgeSet.generated(true);
                    edgeSet.on('updateCoordinate', this._updateEdgeSetCoordinate, this);
                    /**
                     * @event addEdgeSet
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                     */
                    this.fire('addEdgeSet', edgeSet);
                }
            },
            updateEdgeSet: function (edgeSet) {
                if (edgeSet.generated() && edgeSet.source().generated() && edgeSet.target().generated()) {
                    edgeSet.updated(false);
                    /**
                     * @event updateEdgeSet
                     * @param sender {Object}  Trigger instance
                     * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                     */
                    this.fire('updateEdgeSet', edgeSet);
                }
            },
            removeEdgeSet: function (linkKey) {

                var edgeSet = this.edgeSets().getItem(linkKey);
                if (!edgeSet) {
                    return false;
                }

                edgeSet.off('updateCoordinate', this._updateEdgeSetCoordinate, this);

                nx.each(edgeSet.edges(), function (edge, id) {
                    this.removeEdge(id, false);
                }, this);
                edgeSet.generated(false);
                edgeSet._activated = true;
                /**
                 * @event removeEdgeSet
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                 */
                this.fire('removeEdgeSet', edgeSet);
            },
            deleteEdgeSet: function (linkKey) {
                var edgeSet = this.edgeSets().getItem(linkKey);
                if (!edgeSet) {
                    return false;
                }

                edgeSet.off('updateCoordinate', this._updateEdgeSetCoordinate, this);

                nx.each(edgeSet.edges(), function (edge, id) {
                    this.deleteEdge(id, false);
                }, this);

                edgeSet.source().removeEdgeSet(linkKey);
                edgeSet.target().removeEdgeSet(linkKey);

                /**
                 * @event removeEdgeSet
                 * @param sender {Object}  Trigger instance
                 * @param {nx.data.EdgeSet} edgeSet EdgeSet object
                 */
                this.fire('deleteEdgeSet', edgeSet);

                this.edgeSets().removeItem(linkKey);

                edgeSet.dispose();
            },
            _updateEdgeSetCoordinate: function (sender, args) {
                this.fire('updateEdgeSetCoordinate', sender);
            },
            /**
             * Get edgeSet by source vertex id and target vertex id
             * @method getEdgeSetBySourceAndTarget
             * @param source {nx.data.Vertex|Number|String} could be vertex object or id
             * @param target {nx.data.Vertex|Number|String} could be vertex object or id
             * @returns {nx.data.EdgeSet}
             */
            getEdgeSetBySourceAndTarget: function (source, target) {
                var edgeSets = this.edgeSets();

                var sourceID = nx.is(source, nx.data.Vertex) ? source.id() : source;
                var targetID = nx.is(target, nx.data.Vertex) ? target.id() : target;

                var linkKey = sourceID + '_' + targetID;
                var reverseLinkKey = targetID + '_' + sourceID;

                return edgeSets.getItem(linkKey) || edgeSets.getItem(reverseLinkKey);
            },
            eachEdgeSet: function (callback, context) {
                this.edgeSets().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            }
        }
    });


})(nx, nx.global);