(function (nx, global) {

    var util = nx.util;

    /** Links layer
     Could use topo.getLayer('linkSet') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    var CLZ = nx.define('nx.graphic.Topology.LinkSetLayer', nx.graphic.Topology.Layer, {
        statics: {
            defaultConfig: {
                label: null,
                sourceLabel: null,
                targetLabel: null,
                color: null,
                width: null,
                dotted: false,
                style: null,
                enable: true,
                collapsedRule: function (model) {
                    if (model.type() == 'edgeSetCollection') {
                        return true;
                    }
                    var linkType = this.linkType();
                    var edges = Object.keys(model.edges());
                    var maxLinkNumber = linkType === 'curve' ? 9 : 5;
                    return edges.length > maxLinkNumber;
                }
            }
        },
        events: ['pressLinkSetNumber', 'clickLinkSetNumber', 'enterLinkSetNumber', 'leaveLinkSetNumber', 'collapseLinkSet', 'expandLinkSet'],
        properties: {
            linkSets: {
                get: function () {
                    return this.linkSetDictionary().values().toArray();
                }
            },
            linkSetMap: {
                get: function () {
                    return this.linkSetDictionary().toObject();
                }
            },
            linkSetDictionary: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {
            attach: function (args) {
                this.inherited(args);

                var topo = this.topology();
                //watch stageScale
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.eachLinkSet(function (linkSet) {
                        linkSet.stageScale(value);
                    });
                }, this);
                topo.watch('revisionScale', this.__watchRevisionScale = function (prop, value) {
                    this.eachLinkSet(function (linkSet) {
                        linkSet.revisionScale(value);
                    });
                }, this);

            },
            addLinkSet: function (edgeSet) {
                var linkSetDictionary = this.linkSetDictionary();
                var linkSet = this._generateLinkSet(edgeSet);
                linkSetDictionary.setItem(edgeSet.linkKey(), linkSet);
                return linkSet;
            },
            updateLinkSet: function (linkKey) {
                this.linkSetDictionary().getItem(linkKey).updateLinkSet();

            },
            removeLinkSet: function (linkKey) {
                var linkSetDictionary = this.linkSetDictionary();
                var linkSet = linkSetDictionary.getItem(linkKey);
                if (linkSet) {
                    linkSet.dispose();
                    linkSetDictionary.removeItem(linkKey);
                    return true;
                } else {
                    return false;
                }
            },

            _getLinkSetInstanceClass: function (edgeSet) {
                var Clz;
                var topo = this.topology();
                var nodeSetInstanceClass = topo.linkSetInstanceClass();
                if (nx.is(nodeSetInstanceClass, 'Function')) {
                    Clz = nodeSetInstanceClass.call(this, edgeSet);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, nodeSetInstanceClass);
                }

                if (!Clz) {
                    throw "Error on instance linkSet class";
                }
                return Clz;

            },

            _generateLinkSet: function (edgeSet) {
                var topo = this.topology();
                var Clz = this._getLinkSetInstanceClass(edgeSet);
                var linkSet = new Clz({
                    topology: topo
                });
                //set model
                linkSet.setModel(edgeSet, false);
                linkSet.attach(this.view());


//                setTimeout(function () {
                this.updateDefaultSetting(linkSet);
//                }.bind(this), 0);

                return linkSet;


            },
            updateDefaultSetting: function (linkSet) {
                var topo = this.topology();


                //delegate elements events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(linkSet.__events__, function (e) {
                    //exclude basic events
                    if (superEvents.indexOf(e) == -1) {
                        linkSet.on(e, function (sender, event) {
                            this.fire(e, linkSet);
                        }, this);
                    }
                }, this);

                //set properties
                var linkSetConfig = nx.extend({}, CLZ.defaultConfig, topo.linkSetConfig());
                delete linkSetConfig.__owner__; //fix bug


                linkSetConfig.linkType = (topo.linkConfig() && topo.linkConfig().linkType) || nx.graphic.Topology.LinksLayer.defaultConfig.linkType;


                nx.each(linkSetConfig, function (value, key) {
                    util.setProperty(linkSet, key, value, topo);
                }, this);

                linkSet.stageScale(topo.stageScale());


                if (nx.DEBUG) {
                    var edgeSet = linkSet.model();
                    //set element attribute
                    linkSet.view().sets({
                        'data-nx-type': 'nx.graphic.Topology.LinkSet',
                        'data-linkKey': edgeSet.linkKey(),
                        'data-source-node-id': edgeSet.source().id(),
                        'data-target-node-id': edgeSet.target().id()

                    });

                }

                linkSet.updateLinkSet();
                return linkSet;

            },
            /**
             * Iterate all linkSet
             * @method eachLinkSet
             * @param callback {Function}
             * @param context {Object}
             */
            eachLinkSet: function (callback, context) {
                this.linkSetDictionary().each(function (item, linkKey) {
                    callback.call(context || this, item.value(), linkKey);
                });
            },
            /**
             * Get linkSet by source node id and target node id
             * @method getLinkSet
             * @param sourceVertexID {String}
             * @param targetVertexID {String}
             * @returns {nx.graphic.LinkSet}
             */
            getLinkSet: function (sourceVertexID, targetVertexID) {
                var topo = this.topology();
                var graph = topo.graph();
                var edgeSet = graph.getEdgeSetBySourceAndTarget(sourceVertexID, targetVertexID) || graph.getEdgeSetCollectionBySourceAndTarget(sourceVertexID, targetVertexID);
                if (edgeSet) {
                    return this.getLinkSetByLinkKey(edgeSet.linkKey());
                } else {
                    return null;
                }
            },
            /**
             * Get linkSet by linkKey
             * @method getLinkSetByLinkKey
             * @param linkKey {String} linkKey
             * @returns {nx.graphic.Topology.LinkSet}
             */
            getLinkSetByLinkKey: function (linkKey) {
                return this.linkSetDictionary().getItem(linkKey);
            },
            /**
             * Highlight linkSet
             * @method highlightlinkSets
             * @param linkSets {Array} linkSet array
             */
            highlightLinkSets: function (linkSets) {
                this.highlightedElements().addRange(linkSets);
            },
            /**
             * Active linkSet
             * @method highlightlinkSets
             * @param linkSets {Array} linkSet array
             */
            activeLinkSets: function (linkSets) {
                this.activeElements().addRange(linkSets);
            },
            /**
             * Clear links layer
             * @method clear
             */
            clear: function () {
                this.eachLinkSet(function (linkSet) {
                    linkSet.dispose();
                });
                this.linkSetDictionary().clear();
                this.inherited();
            },
            dispose: function () {
                this.clear();
                this.topology().unwatch('stageScale', this.__watchStageScaleFN, this);
                this.inherited();
            }
        }
    });


})(nx, nx.global);