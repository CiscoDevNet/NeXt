(function (nx, global) {

    nx.define("nx.data.UniqObservableCollection", nx.data.ObservableCollection, {
        methods: {
            add: function (item) {
                if (item === null || this.contains(item)) {
                    return false;
                }
                return this.inherited(item);
            },
            addRange: function (iter) {
                if (nx.is(iter, Array)) {
                    var items = nx.util.uniq(iter.slice());
                    var i = 0;
                    while (i < items.length) {
                        var item = items[i];
                        if (item === null || this.contains(item)) {
                            items.splice(i, 1);
                        }
                        i++;
                    }
                    return this.inherited(items);
                } else {
                    return this.inherited(iter);
                }


            },
            insert: function (item, index) {
                if (item === null || this.contains(item)) {
                    return false;
                }
                return this.inherited(item, index);
            },
            insertRange: function (iter, index) {
                if (nx.is(iter, Array)) {
                    var items = iter.slice();
                    var i = 0;
                    while (i < items.length) {
                        var item = items[i];
                        if (item === null || this.contains(item)) {
                            items.splice(i, 1);
                        }
                        i++;
                    }
                    return this.inherited(items);
                } else {
                    return this.inherited(iter);
                }
            }
        }
    });


})(nx, nx.global);