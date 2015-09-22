module("ObservableCollection.js");



test('func add', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection();
    col1.on("change", function () {
        changeCount += 1;
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.add(1)
    equal(col1.getItem(0), 1, "add number")
    equal(changeCount, 1)
    equal(notifyCount, 1)

    col1.add({
        x: 1,
        y: 2,
        z: 3
    })
    deepEqual(col1.getItem(1), {
        x: 1,
        y: 2,
        z: 3
    }, "add object")
    equal(changeCount, 2)
    equal(notifyCount, 2)

    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    equal(col1.getItem(2), obj, "add collection")
    equal(changeCount, 3)
    equal(notifyCount, 3)
});

test('func addRange', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.addRange([3, 4])
    equal(col1.getItem(2), 3, "add array")
    equal(changeCount, 1)
    equal(notifyCount, 1)
    col1.clear()

    var col2 = new nx.data.Collection([5, 6])
    col1.addRange(col2)
    equal(col1.getItem(0), 5, "add collection")
    equal(changeCount, 1)
    equal(notifyCount, 1)
    col1.clear()
        //    var dict = new nx.data.Dictionary({x: 7, y: 8, z: 9});
        //    var col3 = new nx.data.Collection(dict);
        //    col1.addRange(col3)
        //    deepEqual(col1.getItem(0),{"key": "x","value": 7},"add dict")
});
//
test('func remove', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })

    col1.remove(2)
    equal(col1.getItem(0), 1, "verify data")
    equal(changeCount, 1)
    equal(notifyCount, 1)
    col1.clear()

    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    col1.remove(obj)
    equal(changeCount, 2)
    equal(notifyCount, 2)
        // remove more
    col1.addRange([1, 2, 3, 4]);
    deepEqual(col1.remove(1, 3, 4), [0, 2, 3], "verify removed indices");
    ok(col1.length() === 1 && col1.contains(2), "verify removed result");
    equal(changeCount, 4);
    equal(notifyCount, 4);
});

test('func insert', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2, 3, 4]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })

    var obj = function () {
        console.log(1)
    }
    col1.insert(obj, 1)
    deepEqual(col1.getItem(1), obj, "verify insert obj")
    deepEqual(col1.getItem(2), 2, "verify next obj")
    equal(changeCount, 1)
    equal(notifyCount, 1)

    var data = col1.count()
    col1.insert(data, data)
    deepEqual(data, data, "verify append obj")
    equal(changeCount, 2)
    equal(notifyCount, 2)
});

test('func insertRange', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([1, 2, 3, 4]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.insertRange(['a1', 'a2', 'a3'], 2)
    equal(col1.getItem(2), 'a1', "insert range array")
    equal(col1.count(), 7, "insert range array")
    equal(changeCount, 1)
    equal(notifyCount, 1)

    col1.clear()
    col1.addRange([1, 2, 3, 4])
    equal(changeCount, 1)
    equal(notifyCount, 1)

    var col2 = new nx.data.Collection(['a1', 'a2', 'a3', 'a4'])
    col1.insertRange(col2, 2)
    equal(col1.getItem(2), 'a1', "insert range collection")
    equal(col1.count(), 8, "insert range collection")
    equal(changeCount, 2)
    equal(notifyCount, 2)
});

test('sort', function () {
    var changeCount = 0;
    var notifyCount = 0;
    var col1 = new nx.data.ObservableCollection([2, 5, 1, 3]);
    col1.on("change", function (sender, data) {
        changeCount += 1;
        if (data.action == 'clear') {
            changeCount = 0;
            notifyCount = 0;
        }
    })
    col1.watch("count", function () {
        notifyCount += 1;
    })
    col1.sort()
    equal(changeCount, 1)
    equal(notifyCount, 1)
    deepEqual(col1.toArray(), [1, 2, 3, 5], "verfy sort result")
});

test("unique", function () {
    var events = [];
    var coll = new nx.data.ObservableCollection([1, 2, 3, 3]);
    coll.on("change", function (coll, evt) {
        events.push(evt);
    });

    coll.unique(true);
    ok(coll.count() === 3, "Removed duplicated items");

    ok(coll.add(4) === 4, "Add item success");
    ok(coll.length() === 4, "Add item result correct");
    ok(coll.add(4) === null, "Add duplicated item failed");
    ok(coll.length() === 4, "Add duplicated item result correct");
    ok(JSON.stringify(coll.addRange([4, 5, 6])) === JSON.stringify([5, 6]), "Duplicated item removed when adding range");
    ok(coll.length() === 6, "Add range result correct");

    ok(coll.insert(0, 0) === 0, "Insert item success");
    ok(coll.length() === 7, "Insert item result correct");
    ok(coll.insert(0, 0) === null, "Insert duplicated item failed");
    ok(coll.length() === 7, "Insert duplicated item result correct");
    ok(JSON.stringify(coll.insertRange([-1, -2, 0], 0)) === JSON.stringify([-1, -2]), "Duplicated item removed when inserting range");
    ok(coll.length() === 9, "Insert range result correct");

    ok(JSON.stringify(events) === JSON.stringify([{
        action: "remove",
        items: [3],
        index: 3
    }, {
        action: "add",
        items: [4]
    }, {
        action: "add",
        items: [5, 6]
    }, {
        action: "add",
        items: [0],
        index: 0
    }, {
        action: "add",
        items: [-1, -2],
        index: 0
    }]), "Events notified correct");
});

test("monitor", function () {
    expect(2);
    var coll = new nx.data.ObservableCollection();
    var coll1 = new nx.data.ObservableCollection();
    var coll2 = new nx.data.ObservableCollection();
    coll.add(coll1);
    var watcher = coll.monitor(function (item) {
        ok(item === coll1, "Exist item processed");
        var res = item.monitor(function (item) {
            ok(item === 1, "New item processed");
        });
        return res.release;
    });
    coll1.add(1);
    watcher.release();
    // not notify anything from here
    coll.add(coll2);
    coll1.add(2);
    coll2.add(2);
});

////////////////////////////////////////////////////////////////////////////////
// test cases about collection calculation

function checkContainment(coll, e) {
    if (!coll) {
        return false;
    }
    // e is array
    if (Object.prototype.toString.call(e) === "[object Array]") {
        if (coll.length() !== e.length) {
            return false;
        }
        var i, item;
        for (i = 0; i < e.length && coll.contains(e[i]); i++);
        return i == e.length;
    }
    return coll.length() === 1 && coll.contains(e);
}

test("func select", function () {
    var Item = nx.define(nx.Observable, {
        properties: {
            a: null,
            b: null
        }
    });
    var x = {};
    var a = new Item();
    var b = new Item();
    var ab = new Item();
    var o = new Item();
    a.a(true);
    b.b(true);
    ab.a(true);
    ab.b(true);
    var resource;
    var collection = new nx.data.ObservableCollection([a, b, ab, o]);
    var sub = new nx.data.ObservableCollection([1]);
    // with key only
    resource = sub.select(collection, "a");
    ok(checkContainment(sub, [a, ab]), "Select with key only");
    o.a(a);
    ok(checkContainment(sub, [a, ab, o]), "Observely select with key only")
    o.a(null);
    ok(checkContainment(sub, [a, ab]), "Observely unselect with key only");
    collection.remove(a);
    ok(checkContainment(sub, [ab]), "Monitorly select with key only")
    collection.add(a);
    ok(checkContainment(sub, [a, ab]), "Monitorly unselect with key only");
    resource.release();
    ok(checkContainment(sub, []), "Release select with key only");
    // with determinator only
    resource = sub.select(collection, nx.identity);
    ok(checkContainment(sub, [a, b, ab, o]), "Select with determinator only");
    collection.add(x);
    ok(checkContainment(sub, [a, b, ab, o, x]), "Monitorly select with determinator only");
    collection.remove(ab);
    ok(checkContainment(sub, [a, b, o, x]), "Monitorly unselect with determinator only");
    resource.release();
    ok(checkContainment(sub, []), "Release select with determinator only");
    // with both key and determinator
    x.a = true;
    resource = sub.select(collection, "a", function (a) {
        return !a;
    });
    ok(checkContainment(sub, [b, o]), "Select");
    collection.remove(b);
    ok(checkContainment(sub, [o]), "Monitorly UnSelect");
    collection.add(b);
    ok(checkContainment(sub, [b, o]), "Monitorly Select");
    a.a(false);
    ok(checkContainment(sub, [a, b, o]), "Observely Select");
    a.a(true);
    ok(checkContainment(sub, [b, o]), "Observely UnSelect");
    resource.release();
    ok(checkContainment(sub, []), "Release select");
});

test("func calculate", function () {
    var resource;
    var a = new nx.data.ObservableCollection();
    var b = new nx.data.ObservableCollection([100]);
    var c = new nx.data.ObservableCollection([1, 2, 3]);
    var d = new nx.data.ObservableCollection([2, 3, 4]);
    var e = new nx.data.ObservableCollection([3, 4, 5, 6]);
    var f = new nx.data.ObservableCollection([3, 4, 6, 7, 8, 9]);
    var g = new nx.data.ObservableCollection([7, 8, 10]);
    var coll = new nx.data.ObservableCollection([1000]);
    // check a calculation
    resource = coll.calculate("a || b && c | d ^ e & f - g", {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        g: g
    });
    ok(checkContainment(coll, [1, 2, 3, 6]), "Calculation initialize correct.");
    resource.release();
    ok(checkContainment(coll, []), "Calculation release correct.");
    // check calculation again
    resource = coll.calculate("a || b && c | d ^ e & f - g", {
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        g: g
    });
    ok(checkContainment(coll, [1, 2, 3, 6]), "Calculation initialize again.");
    resource.release();
    ok(checkContainment(coll, []), "Calculation release correct.");

});

test("static cross", function () {
    var a = new nx.data.ObservableCollection([1, 2, 3, 4]);
    var b = new nx.data.ObservableCollection([2, 3, 4]);
    var c = new nx.data.ObservableCollection([1, 3, 6]);
    // target tests
    var target = new nx.data.ObservableCollection([{}]);
    var resource = nx.data.ObservableCollection.cross(target, [a, b, c]);
    ok(checkContainment(target, 3), "On init, result correct.");
    b.add(1);
    ok(checkContainment(target, [1, 3]), "On add, result correct.");
    a.remove(3);
    ok(checkContainment(target, 1), "On remove, result correct.");
    resource.release();
    ok(checkContainment(target, 1), "On release, result not effected correct.");
    c.add(5);
    ok(checkContainment(target, 1), "On add after release, result not effected correct.");
    c.remove(1);
    ok(checkContainment(target, 1), "On remove after release, result not effected correct.");
});
test("static union", function () {
    var a = new nx.data.ObservableCollection([1, 2, 3, 4]);
    var b = new nx.data.ObservableCollection([2, 3, 4]);
    var c = new nx.data.ObservableCollection([1, 3, 5]);
    // target tests
    var target = new nx.data.ObservableCollection([{}]);
    var resource = nx.data.ObservableCollection.union(target, [a, b, c]);
    ok(checkContainment(target, [1, 2, 3, 4, 5]), "On init, result correct.");
    b.add(6);
    ok(checkContainment(target, [1, 2, 3, 4, 5, 6]), "On add, result correct.");
    a.remove(2);
    ok(checkContainment(target, [1, 2, 3, 4, 5, 6]), "On remove, result not effected correct.");
    b.remove(2);
    ok(checkContainment(target, [1, 3, 4, 5, 6]), "On remove, result correct.");
    resource.release();
    ok(checkContainment(target, [1, 3, 4, 5, 6]), "On release, result not effected correct.");
    c.add(7);
    ok(checkContainment(target, [1, 3, 4, 5, 6]), "On add after release, result not effected correct.");
    b.remove(5, 6);
    ok(checkContainment(target, [1, 3, 4, 5, 6]), "On remove after release, result not effected correct.");
});
test("static complement", function () {
    var a = new nx.data.ObservableCollection([1, 2, 3, 4]);
    var b = new nx.data.ObservableCollection([2, 3, 5]);
    var c = new nx.data.ObservableCollection([4]);
    // target tests
    var target = new nx.data.ObservableCollection([{}]);
    var resource = nx.data.ObservableCollection.complement(target, [a, b, c]);
    ok(checkContainment(target, [1]), "On init, result correct.");
    a.addRange([6, 7, 8]);
    ok(checkContainment(target, [1, 6, 7, 8]), "On add, result correct.");
    a.remove(2);
    ok(checkContainment(target, [1, 6, 7, 8]), "On remove, result not effected correct.");
    b.add(6);
    ok(checkContainment(target, [1, 7, 8]), "On remove, result not effected correct.");
    c.add(8);
    ok(checkContainment(target, [1, 7]), "On remove, result not effected correct.");
    a.remove(1);
    ok(checkContainment(target, [7]), "On remove, result correct.");
    resource.release();
    ok(checkContainment(target, [7]), "On release, result not effected correct.");
    a.add(9);
    ok(checkContainment(target, [7]), "On add after release, result not effected correct.");
    b.remove(5, 6);
    ok(checkContainment(target, [7]), "On remove after release, result not effected correct.");
});
test("static symmetric difference", function () {
    var a = new nx.data.ObservableCollection([1, 2, 10, 11, 12]);
    var b = new nx.data.ObservableCollection([2, 3, 10, 11]);
    var c = new nx.data.ObservableCollection([3, 1, 10]);
    // target tests
    var target = new nx.data.ObservableCollection([{}]);
    var resource = nx.data.ObservableCollection.delta(target, [a, b, c]);
    ok(checkContainment(target, [10, 12]), "On init, result correct.");
    a.remove(10);
    ok(checkContainment(target, [12]), "On remove, result correct.");
    b.remove(10);
    ok(checkContainment(target, [10, 12]), "On remove again, result correct.");
    c.remove(10);
    ok(checkContainment(target, [12]), "On remove third-time, result correct.");
    c.add(21);
    ok(checkContainment(target, [12, 21]), "On add, result correct.");
    b.add(21);
    ok(checkContainment(target, [12]), "On add again, result correct.");
    a.add(21);
    ok(checkContainment(target, [12, 21]), "On add third-time, result correct.");
    resource.release();
    ok(checkContainment(target, [12, 21]), "On release, result not effected correct.");
    a.add(9);
    ok(checkContainment(target, [12, 21]), "On add after release, result not effected correct.");
    b.remove(2, 10);
    ok(checkContainment(target, [12, 21]), "On remove after release, result not effected correct.");
});
test("static and", function () {
    var a = new nx.data.ObservableCollection([]);
    var b = new nx.data.ObservableCollection([1, 2]);
    var c = new nx.data.ObservableCollection([11, 12]);
    // target tests
    var target = new nx.data.ObservableCollection([{}]);
    var resource = nx.data.ObservableCollection.and(target, [a, b, c]);
    ok(checkContainment(target, []), "On init, result correct.");
    a.add(100);
    ok(checkContainment(target, [11, 12]), "On add to short-circuit collection, result correct.");
    c.add(13);
    ok(checkContainment(target, [11, 12, 13]), "On add to hit collection, result correct.");
    b.remove(1, 2);
    ok(checkContainment(target, []), "On remove to short-circuit collection, result correct.");
    b.add(1);
    ok(checkContainment(target, [11, 12, 13]), "On add to second short-circuit collection, result correct.");
    c.remove(11);
    ok(checkContainment(target, [12, 13]), "On remove to hit collection, result correct.");
    a.remove(100);
    ok(checkContainment(target, []), "On remove to first short-circuit collection, result of correct.");
    resource.release();
    ok(checkContainment(target, []), "On release, result not effected correct.");
    a.add(201);
    ok(checkContainment(target, []), "On add after release, result not effected correct.");
    c.remove(11, 12, 13);
    ok(checkContainment(target, []), "On remove after release, result not effected correct.");
});
test("static or", function () {
    var a = new nx.data.ObservableCollection([]);
    var b = new nx.data.ObservableCollection([1, 2]);
    var c = new nx.data.ObservableCollection([11, 12]);
    // target tests
    var target = new nx.data.ObservableCollection([{}]);
    var resource = nx.data.ObservableCollection.or(target, [a, b, c]);
    ok(checkContainment(target, [1, 2]), "On init, result correct.");
    a.add(100);
    ok(checkContainment(target, [100]), "On add to short-circuit collection, result of correct.");
    a.remove(100);
    ok(checkContainment(target, [1, 2]), "On remove to short-circuit collection, result of correct.");
    b.add(3);
    ok(checkContainment(target, [1, 2, 3]), "On add to hit collection, result correct.");
    b.remove(1, 3);
    ok(checkContainment(target, [2]), "On remove to hit collection, result correct.");
    b.remove(2);
    ok(checkContainment(target, [11, 12]), "On remove last one to hit collection, result correct.");
    c.add(13);
    ok(checkContainment(target, [11, 12, 13]), "On add to last hit collection, result correct.");
    c.remove(11);
    ok(checkContainment(target, [12, 13]), "On remove to last hit collection, result correct.");
    a.add(200);
    ok(checkContainment(target, [200]), "On add to short-circuit again, result correct.");
    resource.release();
    ok(checkContainment(target, [200]), "On release, result not effected correct.");
    a.add(201);
    ok(checkContainment(target, [200]), "On add after release, result not effected correct.");
    c.remove(11, 12, 13);
    ok(checkContainment(target, [200]), "On remove after release, result not effected correct.");
});

test("static expression priority", function () {
    var expression = "A && B || C && DA ^ DB | DC & ( DC1 & DC2 & DC3)";
    var tree = nx.data.ObservableCollection.buildExpressionTree(expression);
    deepEqual(tree, ["||", ["&&", "A", "B"],
        ["&&", "C", ["|", ["^", "DA", "DB"],
            ["&", "DC", ["&", "DC1", "DC2", "DC3"]]
        ]]
    ]);
});

test("static Calculation expression syntax", function () {
    var err;
    var a = new nx.data.ObservableCollection();
    var b = new nx.data.ObservableCollection();
    var c = new nx.data.ObservableCollection();
    var d = new nx.data.ObservableCollection();
    var calc = new nx.data.ObservableCollection.Calculation({
        a: a,
        b: b,
        c: c,
        d: d
    });
    var coll, relation;
    coll = new nx.data.ObservableCollection();
    try {
        relation = calc.calculate(coll, "a && c + b");
    } catch (e) {
        err = e;
    }
    ok(err, "Unsupported operation of collection causes error.");
    // TODO more syntax check
});

test("static Calculation", function () {
    var a = new nx.data.ObservableCollection();
    var b = new nx.data.ObservableCollection([100]);
    var c = new nx.data.ObservableCollection([1, 2, 3]);
    var d = new nx.data.ObservableCollection([2, 3, 4]);
    var e = new nx.data.ObservableCollection([3, 4, 5, 6]);
    var f = new nx.data.ObservableCollection([3, 4, 6, 7, 8, 9]);
    var g = new nx.data.ObservableCollection([7, 8, 10]);
    var calc = new nx.data.ObservableCollection.Calculation({
        a: a,
        b: b,
        c: c,
        d: d,
        e: e,
        f: f,
        g: g
    });
    var coll, relation;
    coll = new nx.data.ObservableCollection();
    relation = calc.calculate(coll, "a || b && c | d ^ e & f - g");
    ok(checkContainment(coll, [1, 2, 3, 6]), "Expression initialize correct.");
    relation.release();
    relation = calc.calculate(coll, "a || b && c | d ^ e & f - g");
    ok(checkContainment(coll, [1, 2, 3, 6]), "Expression initialize again correct.");
});
