(function (nx, global) {


    var shapeMap = {
        'rect': 'nx.graphic.Topology.RectGroup',
        'circle': 'nx.graphic.Topology.CircleGroup',
        'polygon': 'nx.graphic.Topology.PolygonGroup',
        'nodeSetPolygon': 'nx.graphic.Topology.NodeSetPolygonGroup'
    };


    var colorTable = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#ACAEB1 ', '#2CC86F'];
    //    var colorTable = ['#75C6EF', '#75C6EF', '#75C6EF', '#75C6EF ', '#75C6EF'];


    /**
     * Topology group layer class

     var groupsLayer = topo.getLayer('groups');
     var nodes1 = [0, 1];
     var group1 = groupsLayer.addGroup({
                    nodes: nodes1,
                    label: 'Rect',
                    color: '#f00'
                });
     group1.on('clickGroupLabel', function (sender, events) {
                    console.log(group1.nodes());
                }, this);

     *
     * @class nx.graphic.Topology.GroupsLayer
     * @extend nx.graphic.Topology.Layer
     * @module nx.graphic.Topology
     */

    nx.define('nx.graphic.Topology.GroupsLayer', nx.graphic.Topology.Layer, {
        statics: {
            /**
             * Default color table, with 5 colors
             * @property colorTable
             * @static
             */
            colorTable: colorTable
        },
        events: ['dragGroupStart', 'dragGroup', 'dragGroupEnd', 'clickGroupLabel', 'enterGroup', 'leaveGroup', 'collapseNodeSetGroup'],
        properties: {
            shapeType: 'polygon',
            /**
             * Groups elements
             * @property groupItems {nx.data.ObservableDictionary}
             */
            groupItems: {
                value: function () {
                    var dict = new nx.data.ObservableDictionary();
                    dict.on('change', function (sender, args) {
                        var action = args.action;
                        var items = args.items;
                        if (action == 'clear') {
                            nx.each(items, function (item) {
                                var group = item.value();
                                if (group) {
                                    group.dispose();
                                }

                            });
                        }
                    }, this);
                    return dict;
                }
            },
            /**
             * groups data
             * @property groups {Array}
             */
            groups: {
                get: function () {
                    return this._groups || [];
                },
                set: function (value) {
                    if (nx.is(value, Array)) {
                        nx.each(value, function (item) {
                            this.addGroup(item);
                        }, this);
                        this._groups = value;
                    }
                }
            }
        },
        methods: {

            /**
             * Register a group item class
             * @param name {String} group items' name
             * @param className {Object} which should extend nx.graphic.Topology.GroupItem
             */
            registerGroupItem: function (name, className) {
                shapeMap[name] = className;
            },


            attach: function (args) {
                this.inherited(args);
                var topo = this.topology();
                topo.on('afterFitStage', this._redraw.bind(this), this);
                topo.on('zoomend', this._redraw.bind(this), this);
                topo.on('collapseNode', this._redraw.bind(this), this);
                topo.on('expandNode', this._redraw.bind(this), this);
                topo.watch('revisionScale', this._redraw.bind(this), this);
                topo.watch('showIcon', this._redraw.bind(this), this);
            },
            /**
             * Add a group to group layer
             * @param obj {Object} config of a group
             */
            addGroup: function (obj) {
                var groupItems = this.groupItems();
                var shape = obj.shapeType || this.shapeType();
                var nodes = obj.nodes;

                var GroupClass = nx.path(global, shapeMap[shape]);
                var group = new GroupClass({
                    'topology': this.topology()
                });

                var config = nx.clone(obj);

                if (!config.color) {
                    config.color = colorTable[groupItems.count() % 5];
                }
                delete config.nodes;
                delete config.shapeType;

                group.sets(config);
                group.attach(this);


                group.nodes(nodes);

                var id = config.id || group.__id__;

                groupItems.setItem(id, group);

                var events = ['dragGroupStart', 'dragGroup', 'dragGroupEnd', 'clickGroupLabel', 'enterGroup', 'leaveGroup', 'collapseNodeSetGroup'];

                nx.each(events, function (e) {
                    group.on(e, function (sender, event) {
                        if (event instanceof MouseEvent) {
                            window.event = event;
                        }
                        this.fire(e, group);
                    }, this);
                }, this);


                return group;

            },
            _redraw: function () {
                this.groupItems().each(function (item) {
                    item.value()._draw();
                }, this);
            },
            /**
             * Remove a group
             * @method removeGroup
             * @param id
             */
            removeGroup: function (id) {
                var groupItems = this.groupItems();
                var group = groupItems.getItem(id);
                if (group) {
                    group.dispose();
                    groupItems.removeItem(id);
                }
            },
            /**
             * Get a group by id
             * @method getGroup
             * @param id
             * @returns {*}
             */
            getGroup: function (id) {
                return this.groupItems().getItem(id);
            },
            /**
             * Iterate all group
             * @method eachGroupItem
             * @param callBack
             * @param context
             */
            eachGroupItem: function (callBack, context) {
                this.groupItems().each(function (item) {
                    callBack.call(context || this, item.value(), item.key());
                }, this);
            },
            /**
             * clear all group
             * @clear
             */
            clear: function () {
                this.groupItems().clear();
                this.inherited();
            },
            dispose: function () {
                this.clear();
                var topo = this.topology();
                topo.off('collapseNode', this._redraw.bind(this), this);
                topo.off('expandNode', this._redraw.bind(this), this);
                topo.off('zoomend', this._redraw.bind(this), this);
                topo.off('fitStage', this._redraw.bind(this), this);
                topo.unwatch('revisionScale', this._redraw.bind(this), this);
                topo.unwatch('showIcon', this._redraw.bind(this), this);
                this.inherited();
            }

        }
    });


})(nx, nx.global);
