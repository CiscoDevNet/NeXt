(function (nx, global) {
    var util = nx.util;

    /**
     * Links layer
     Could use topo.getLayer('links') get this
     * @class nx.graphic.Topology.LinksLayer
     * @extend nx.graphic.Topology.Layer
     */

    var CLZ = nx.define('nx.graphic.Topology.LinksLayer', nx.graphic.Topology.Layer, {
        statics: {
            defaultConfig: {
                linkType: 'parallel',
                label: null,
                color: null,
                width: null,
                enable: true
            }
        },
        events: ['pressLink', 'clickLink', 'enterLink', 'leaveLink'],
        properties: {
            links: {
                get: function () {
                    return this.linkDictionary().values().toArray();
                }
            },
            linkMap: {
                get: function () {
                    return this.linkDictionary().toObject();
                }
            },
            linkDictionary: {
                value: function () {
                    return new nx.data.ObservableDictionary();
                }
            }
        },
        methods: {
            attach: function (args) {
                this.inherited(args);
                var topo = this.topology();
                topo.watch('stageScale', this.__watchStageScaleFN = function (prop, value) {
                    this.eachLink(function (link) {
                        link.stageScale(value);
                    });
                }, this);

                topo.watch('revisionScale', this.__watchRevisionScale = function (prop, value) {
                    this.eachLink(function (link) {
                        link.revisionScale(value);
                    });
                }, this);
            },
            /**
             * Add a link
             * @param edge
             * @method addLink
             */

            addLink: function (edge) {
                var id = edge.id();
                var link = this._generateLink(edge);
                this.linkDictionary().setItem(id, link);
                return link;
            },
            /**
             * Remove a link
             * @param id {String}
             */
            removeLink: function (id) {
                var linkDictionary = this.linkDictionary();
                var link = linkDictionary.getItem(id);
                if (link) {
                    link.dispose();
                    linkDictionary.removeItem(id);
                }
            },
            /**
             * Update link
             * @method updateLink
             * @param id {String}
             */
            updateLink: function (id) {
                this.linkDictionary().getItem(id).update();
            },

            //get link instance class
            _getLinkInstanceClass: function (edge) {
                var Clz;
                var topo = this.topology();
                var linkInstanceClass = topo.linkInstanceClass();
                if (nx.is(linkInstanceClass, 'Function')) {
                    Clz = linkInstanceClass.call(this, edge);
                    if (nx.is(Clz, 'String')) {
                        Clz = nx.path(global, Clz);
                    }
                } else {
                    Clz = nx.path(global, linkInstanceClass);
                }
                if (!Clz) {
                    throw "Error on instance link class";
                }
                return Clz;
            },


            _generateLink: function (edge) {
                var id = edge.id();
                var topo = this.topology();
                var Clz = this._getLinkInstanceClass(edge);
                var link = new Clz({
                    topology: topo
                });
                //set model
                link.setModel(edge, false);
                link.attach(this.view());

                link.view().sets({
                    'class': 'link',
                    'data-id': id
                });



//                setTimeout(function () {
                this.updateDefaultSetting(link);
//                }.bind(this), 0);

                return link;

            },
            updateDefaultSetting: function (link) {
                var topo = this.topology();
                //delegate link's events
                var superEvents = nx.graphic.Component.__events__;
                nx.each(link.__events__, function (e) {
                    if (superEvents.indexOf(e) == -1) {
                        link.on(e, function (sender, event) {
                            this.fire(e, link);
                        }, this);
                    }
                }, this);
                //set properties
                var linkConfig = nx.extend({}, CLZ.defaultConfig, topo.linkConfig());
                delete  linkConfig.__owner__;

                nx.each(linkConfig, function (value, key) {
                    util.setProperty(link, key, value, topo);
                }, this);

                if (nx.DEBUG) {
                    var edge = link.model();
                    link.view().sets({
                        'data-linkKey': edge.linkKey(),
                        'data-source-node-id': edge.source().id(),
                        'data-target-node-id': edge.target().id()
                    });
                }

                link.stageScale(topo.stageScale());

                link.update();
            },


            /**
             * Traverse all links
             * @param callback
             * @param context
             * @method eachLink
             */
            eachLink: function (callback, context) {
                this.linkDictionary().each(function (item, id) {
                    callback.call(context || this, item.value(), id);
                });
            },
            /**
             * Get link by id
             * @param id
             * @returns {*}
             */
            getLink: function (id) {
                return this.linkDictionary().getItem(id);
            },
            /**
             * Highlight links
             * @method highlightLinks
             * @param links {Array} links array
             */
            highlightLinks: function (links) {
                this.highlightedElements().addRange(links);
            },
            activeLinks: function (links) {
                this.activeElements().addRange(links);
            },
            /**
             * Clear links layer
             * @method clear
             */
            clear: function () {
                this.eachLink(function (link) {
                    link.dispose();
                });

                this.linkDictionary().clear();
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