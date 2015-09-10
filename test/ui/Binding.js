module("Component.js", {teardown: function () {
    var comps = app.content();
    var child;
    for (var i = 0; i < comps.count(); i++) {
        child = comps.getItem(i);
        child.destroy();
    }
}
});


nx.define("wq.button", nx.ui.Component, {
    events:['aclick','bclick'],
    view: {
        tag: 'button',
        content: '{test}'

    },
    properties: {
        aclickflag: false,
        bclickflag: false,
        count: 0
    },
    methods: {
        init: function () {
            this.inherited();
            this.watch("aclickflag", function () {
                this.count(1);
            }, this);
        },
        getInnerComp: function () {
            return this._innerComp;
        },
        bclick: function () {
            this.bclickflag(true);
        }

    }
});


test('type logic', function () {
    ok(true)
    ok(true)

})
