module("nx.Observable", {
    setup: function () {

    }
});


nx.define('observeObj1', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        },
        b0: {
            value: "hahah"
        },
        b1: {
            value: "hahah"
        },
        b4: {
            value: "12"
                //binding:{direction:"<>"}
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        },
        b2: function () {
            return "testMethod"
        },
        b3: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj11', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj12', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj13', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj14', nx.Observable, {
    properties: {
        prop1: {
            value: "hahah"
        },
        prop2: {
            value: "hahah"
        }
    },
    methods: {
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj2', nx.Observable, {
    properties: {
        prop1: {
            value: "hahaha"
        },
        prop2: {
            value: "hahaha"
        }
    },
    methods: {
        init: function (indata) {
            this.inherited(indata);
            this.prop1("override_init")
        },
        set: function (value) {
            this.prop1(value)
        },
        get: function () {
            return this.prop1()
        },
        testMethod: function () {
            return "testMethod"
        }

    }
});

nx.define('observeObj3', nx.Observable, {
    properties: {
        prop1: {
            value: "hahaha"
        },
        prop2: {
            value: "hahaha"
        }
    },
    methods: {
        init: function (indata) {
            this.inherited(indata);
            this.prop1("override_init")
        },
        testMethod: function () {
            return "testMethod"
        }

    }
});


test('method get', function () {
    var testObj1 = new observeObj1;
    equal(testObj1.get("prop1"), "hahah")

    testObj1.set("prop1", "test")
    equal(testObj1.get("prop1"), "test")
});

test('method override get', function () {
    var testObj1 = new observeObj2;
    equal(testObj1.get("prop1"), "override_init")

});

test('method set', function () {
    var testObj1 = new observeObj1;
    equal(testObj1.set("prop1", null), undefined);
    equal(testObj1.get("prop1"), null)

    equal(testObj1.set("prop1", "test"), undefined)
    equal(testObj1.get("prop1"), "test")

    equal(testObj1.set("prop1", {
        test: true
    }), undefined)
    deepEqual(testObj1.get("prop1"), {
        test: true
    })
});

test('method override set', function () {
    var testObj1 = new observeObj2;
    testObj1.set("override_get")
    equal(testObj1.prop1(), "override_get")

    testObj1.set(null)
    equal(testObj1.prop1(), null)

    testObj1.set({
        test: true
    })
    deepEqual(testObj1.prop1(), {
        test: true
    })
});

test('method watch/unwatch', function () {
    var handler1 = 0;
    var handler2 = 0;
    var testObj1 = new observeObj11;
    //add 2 watch for prop1
    var watchh1, watchh2
    testObj1.watch("prop1", watchh1 = function (name, value) {
        handler1 += 1;
    });
    ok(testObj1.prop1._watched)
    equal(testObj1.__watchers__.prop1.length, 1)

    testObj1.watch("prop1", watchh2 = function (name, value) {
        handler2 += 1;
    });
    equal(testObj1.__watchers__.prop1.length, 2)

    //set prop1 to notify
    testObj1.set("prop1", "test2")
    equal(handler2, 1)
    equal(handler1, 1)

    //unwatch
    testObj1.unwatch("prop1", watchh1)
    equal(testObj1.__watchers__.prop1.length, 1)
    testObj1.unwatch("prop1", watchh2);
    equal(testObj1.__watchers__.prop1.length, 0)

    //set prop1 again, no notify
    handler1 = 0;
    handler2 = 0;
    testObj1.set("prop1", "test3")
    equal(handler2, 0)
    equal(handler1, 0)
});

test("method watch returns unwatcher", function () {
    expect(8);
    var o = new observeObj1();
    var unwatcher;
    unwatcher = o.watch("prop1", function () {
        ok(true, "Notified single property");
    });
    o.prop1(nx.uuid());
    unwatcher.affect();
    unwatcher.release();
    o.prop1(nx.uuid());
    unwatcher = o.watch(["prop1", "prop2"], function () {
        ok(true, "Notified multiple property");
    });
    unwatcher.affect();
    o.prop1(nx.uuid());
    o.prop2(nx.uuid());
    unwatcher.release();
    o.prop1(nx.uuid());
    o.prop2(nx.uuid());
    unwatcher = o.watch("*", function () {
        ok(true, "Notified all property");
    });
    o.prop1(nx.uuid());
    o.prop2(nx.uuid());
    unwatcher.release();
    o.prop1(nx.uuid());
    o.prop2(nx.uuid());
});

test('method notify with unwatch', function () {
    expect(1);
    var o = new observeObj1();
    o.prop1(true);
    o.watch("prop1", function (pname, pvalue) {
        if (!pvalue) {
            o.unwatch("prop1");
            o = null;
        }
    });
    o.watch("prop1", function (pname, pvalue) {
        ok(o.prop1());
    });
    o.prop1(false);
    ok(!o, "No error");
});

test('method watch*/unwatch', function () {
    var handler1 = 0;
    var handler2 = 0;
    var watchh1, watchh2
    var testObj1 = new observeObj12;
    testObj1.watch("prop1", watchh1 = function (name, value) {
        handler1 += 1;
    });
    testObj1.watch("*", watchh2 = function (name, value) {
        handler2 += 1;
    });
    testObj1.set("prop1", "test2")
    equal(handler2, 1)
    equal(handler1, 1)

    //unwatch prop1
    testObj1.unwatch("prop1", watchh1);

    //set prop1 again, * will notify
    handler1 = 0;
    handler2 = 0;
    testObj1.set("prop1", "test3")
    equal(handler2, 1)
    equal(handler1, 0)

    //unwatch *
    testObj1.unwatch("*", watchh2);

    //set prop1 again, no notify
    handler1 = 0;
    handler2 = 0;
    testObj1.set("prop1", "test4")
    equal(handler2, 0)
    equal(handler1, 0)
});

test('method watch*/unwatch', function () {
    var handler2 = 0;
    var watchh2
    var testObj1 = new observeObj13;

    testObj1.watch("*", watchh2 = function (name, value) {
        handler2 += 1;
    });
    testObj1.set("prop1", "test2")
    equal(handler2, 1)

    testObj1.unwatch("*", watchh2)
    handler2 = 0;
    testObj1.set("prop1", "test4")
    equal(handler2, 0)
});

test("static watch", function () {
    var expected = [{
        test: "Change inner value",
        path: "prop1.prop1",
        nv: "hello",
        ov: "hahah"
    }, {
        test: "Change outer value",
        path: "prop1.prop1",
        nv: "yeah",
        ov: "hello"
    }];
    expect(expected.length);
    var o = new observeObj1;
    var prop1 = new observeObj1;
    o.prop1(prop1);
    var watch = nx.Observable.watch(o, "prop1.prop1", function (path, nv, ov) {
        ok(path === expected[0].path && nv === expected[0].nv && ov === expected[0].ov, expected[0].test);
        expected.shift();
    });
    // change inner value
    prop1.prop1("hello");
    // change outer value
    prop1 = new observeObj1;
    prop1.prop1("yeah");
    o.prop1(prop1);
    // release
    watch.release();
    prop1.prop1("Nothing happened");
    o.prop1("Nothing happened either");
});

test("static monitor", function () {
    var expected = [{
        test: "Change inner value",
        values: ["hello", "hahah", "hahah", "hahah", "prop1.prop1"]
    }, {
        test: "Change outer value",
        values: ["hahah", "hahah", "hahah", "hahah", "prop1.prop1"]
    }, {
        test: "Change outer value",
        values: ["hahah", "hahah", "hahah", "hahah", "prop1.prop2"]
    }, {
        test: "Change another inner value",
        values: ["hahah", "hahah", "hahah", "yes", "prop2.prop2"]
    }];
    expect(expected.length);
    var o = new observeObj1;
    var prop1 = new observeObj1;
    var prop2 = new observeObj1;
    o.prop1(prop1);
    o.prop2(prop2);
    var monitor = nx.Observable.monitor(o, "prop1.prop1, prop1.prop2, prop2.prop1, prop2.prop2", function (v11, v12, v21, v22, path) {
        deepEqual([v11, v12, v21, v22, path], expected[0].values, expected[0].test);
        expected.shift();
    });
    // change inner value
    prop1.prop1("hello");
    o.prop1(new observeObj1);
    prop2.prop2("yes");
    // release
    monitor.release();
    prop1.prop1("Nothing happened");
    o.prop1("Nothing happened either");
});

test('method notify*', function () {
    var handler1 = 0;
    var handler2 = 0;
    var watchh1, watchh2
    var testObj1 = new observeObj14;
    testObj1.watch("prop1", watchh1 = function (name, value) {
        handler1 += 1;
    });
    testObj1.watch("prop1", watchh2 = function (name, value) {
        handler2 += 1;
    });
    testObj1.notify("*")
    equal(handler2, 1)
    equal(handler1, 1)
    testObj1.unwatch("prop1", watchh1);
    testObj1.unwatch("prop1", watchh2);
    handler1 = 0;
    handler2 = 0;
    testObj1.notify("*")
    equal(handler2, 0)
    equal(handler1, 0)
});

test('method setBinding', function () {
    var testObj1 = new observeObj1;
    testObj1.setBinding("b1", "1,test=b1")
    equal("1", testObj1.getBinding("b1")._sourcePath)
    equal("b1", testObj1.getBinding("b1").test)

    testObj1.clearBinding("b1")
    testObj1.clearBinding("b2")
    testObj1.clearBinding("b3")
    equal(null, testObj1.__bindings__.b1, "remove Binding")

    var testObj2 = new observeObj3;
    testObj1.setBinding("b4", "prop1,direction=<>", testObj2)
    equal("override_init", testObj1.b4(), "binding <>,init value")

    testObj1.b4("testReverseBinding")
    equal(testObj2.prop1(), "testReverseBinding", "binding <>,target->source")
    equal(testObj1.b4(), "testReverseBinding", "binding <>, target->source")

    testObj2.prop1("testBindings")
    equal("testBindings", testObj2.prop1(), "binding <>, source->target")
    equal("testBindings", testObj1.b4(), "binding <>, source->source")
});
