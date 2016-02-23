(function (nx, global) {

    /**
     * Links mixin class
     * @class nx.graphic.Topology.LinkMixin
     * @module nx.graphic.Topology
     */
    nx.define("nx.graphic.Topology.LinkMixin", {
        events: ['addLink', 'deleteLink'],
        properties: {
            /**
             * Link instance class name, support function
             * @property nodeInstanceClass
             */
            linkInstanceClass: {
                value: 'nx.graphic.Topology.Link'
            },
            /**
             * LinkSet instance class name, support function
             * @property linkSetInstanceClass
             */
            linkSetInstanceClass: {
                value: 'nx.graphic.Topology.LinkSet'
            },
            /**
             * Is topology support Multiple link , is false will highly improve performance
             * @property supportMultipleLink {Boolean}
             */
            supportMultipleLink: {
                value: true
            },
            /**
             * All link's config. key is link's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {linkConfig}
             */
            linkConfig: {},
            /**
             * All linkSet's config. key is link's property, support super binding
             * value could be a single string eg: color:'#f00'
             * value could be a an expression eg: label :'{model.id}'
             * value could be a function eg iconType : function (model,instance){ return  'router'}
             * value could be a normal binding expression eg : label :'{#label}'
             * @property {linkSetConfig}
             */
            linkSetConfig: {}
        },
        methods: {

            /**
             * Add a link to topology
             * @method addLink
             * @param obj {JSON}
             * @param inOption {Config}
             * @returns {nx.graphic.Topology.Link}
             */
            addLink: function (obj, inOption) {
                if (obj.source == null || obj.target == null) {
                    return undefined;
                }
                var edge = this.graph().addEdge(obj, inOption);
                if (edge) {
                    var link = this.getLink(edge.id());
                    this.fire("addLink", link);
                    return link;
                } else {
                    return null;
                }

            },
            /**
             * Remove a link
             * @method removeLink
             * @param arg  {String}
             * @returns {boolean}
             */
            removeLink: function (arg) {
                this.deleteLink(arg);
            },

            deleteLink: function (arg) {
                var id = arg;
                if (nx.is(arg, nx.graphic.Topology.AbstractLink)) {
                    id = arg.id();
                }
                this.fire("deleteLink", this.getLink(id));
                this.graph().deleteEdge(id);
            },


            /**
             * Traverse each link
             * @method eachLink
             * @param callback <Function>
             * @param context {Object}
             */
            eachLink: function (callback, context) {
                this.getLayer("links").eachLink(callback, context || this);
            },

            /**
             * Get link by link id
             * @method getLink
             * @param id
             * @returns {*}
             */
            getLink: function (id) {
                return this.getLayer("links").getLink(id);
            },
            /**
             * get linkSet by node
             * @param sourceVertexID {String} source node's id
             * @param targetVertexID {String} target node's id
             * @returns  {nx.graphic.Topology.LinkSet}
             */
            getLinkSet: function (sourceVertexID, targetVertexID) {
                return this.getLayer("linkSet").getLinkSet(sourceVertexID, targetVertexID);
            },
            /**
             * Get linkSet by linkKey
             * @param linkKey {String} linkKey
             * @returns {nx.graphic.Topology.LinkSet}
             */
            getLinkSetByLinkKey: function (linkKey) {
                return this.getLayer("linkSet").getLinkSetByLinkKey(linkKey);
            },
            /**
             * Get links by node
             * @param sourceVertexID {String} source node's id
             * @param targetVertexID {String} target node's id
             * @returns {Array} links collection
             */
            getLinksByNode: function (sourceVertexID, targetVertexID) {
                var linkSet = this.getLinkSet(sourceVertexID, targetVertexID);
                if (linkSet) {
                    return linkSet.links();
                }
            }
        }
    });


})(nx, nx.global);