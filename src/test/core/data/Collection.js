module("nx.data.Collection");

var MyCollection = nx.define(nx.data.Collection, {});

test('init a collection', function () {
    var col1 = new nx.data.Collection();
    var col2 = new nx.data.Collection([1, 2]);
    var col3 = new nx.data.Collection(col2);
    //    var dict = new nx.data.Dictionary({x: 1, y: 2, z: 3});
    //    var col4 = new nx.data.Collection(dict);

    var col5 = new nx.data.Collection(new MyCollection([1, 2, 3, 4]));
    var col6 = new MyCollection(col2);

    ok(col1.count() === 0, 'init an empty Collection');
    ok(col2.count() === 2, 'init an Collection by Array');
    ok(col3.count() === 2, 'init an Collection by Collection');
    //    ok(col4.count() === 3, 'init an Collection by Dictionary');
    ok(col5.count() === 4, 'init an Collection by custom Collection');
    ok(col6.count() === 2, 'init a custom Collection by Collection');
});

test('func add', function () {
    var col1 = new nx.data.Collection();
    col1.add(1)
    equal(col1.getItem(0), 1, "add number")
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
    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    equal(col1.getItem(2), obj, "add collection")
});

test('func addRange', function () {
    var col1 = new nx.data.Collection([1, 2])
    col1.addRange([3, 4])
    equal(col1.getItem(2), 3, "add array")
    col1.clear()
    var col2 = new nx.data.Collection([5, 6])
    col1.addRange(col2)
    equal(col1.getItem(0), 5, "add collection")
    col1.clear()
    //    var dict = new nx.data.Dictionary({x: 7, y: 8, z: 9});
    //    var col3 = new nx.data.Collection(dict);
    //    col1.addRange(col3)
    //    deepEqual(col1.getItem(0),{"key": "x","value": 7},"add dict")
});

test('func remove', function () {
    var col1 = new nx.data.Collection([1, 2])
    equal(col1.remove(2), 1, "remove")
    equal(col1.getItem(0), 1, "verify data")
    col1.clear()
    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    equal(col1.remove(obj), 0, "verify remove obj")
    // remove more
    col1.addRange([1, 2, 3, 4]);
    deepEqual(col1.remove(1, 3, 4), [0, 2, 3], "verify removed indices");
    ok(col1.length() === 1 && col1.contains(2), "verify removed result");
});

test('func insert', function () {
    var col1 = new nx.data.Collection([1, 2, 3, 4])

    var obj = function () {
        console.log(1)
    }
    col1.insert(obj, 1)
    deepEqual(col1.getItem(1), obj, "verify insert obj")
    deepEqual(col1.getItem(2), 2, "verify next obj")

    var data = col1.count()
    col1.insert(data, data)
    deepEqual(data, data, "verify append obj")
});

test('func insertRange', function () {
    var col1 = new nx.data.Collection([1, 2, 3, 4])
    col1.insertRange(['a1', 'a2', 'a3'], 2)
    equal(col1.getItem(2), 'a1', "insert range array")
    equal(col1.count(), 7, "insert range array")

    col1.clear()
    col1.addRange([1, 2, 3, 4])

    var col2 = new nx.data.Collection(['a1', 'a2', 'a3', 'a4'])
    col1.insertRange(col2, 2)
    equal(col1.getItem(2), 'a1', "insert range collection")
    equal(col1.count(), 8, "insert range collection")
});

test('func getRange', function () {
    var col1 = new nx.data.Collection([1, 2, 3, 4])
    var result = col1.getRange(1, 2)
    deepEqual(result.toArray(), [2, 3], "happy path")

    result = col1.getRange(1, 20)
    deepEqual(result.toArray(), [2, 3, 4], "greater than count")

    result = col1.getRange(1, 1)
    deepEqual(result.toArray(), [2], "count=0")

    var col2 = new nx.data.Collection(col1)
    var result = col1.getRange(1, 2)
    deepEqual(result.toArray(), [2, 3], "happy path, create by collection")
});


test('func indexof', function () {
    var col1 = new nx.data.Collection([1, 2, 3, 4])
    equal(col1.indexOf(2), 1, "index of number")
    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    equal(col1.indexOf(obj), 4, "index of obj")

    var col2 = new nx.data.Collection(col1)
    equal(col2.indexOf(2), 1, "index of number,create from collection")
    //var obj =  function(){console.log(1)}
    col2.add(obj)
    equal(col2.indexOf(obj), 4, "index of obj")

});

test('func lastindexof', function () {
    var col1 = new nx.data.Collection([1, 2, 3, 4, 1, 2])
    equal(col1.lastIndexOf(2), 5, "index of number")
    var obj = function () {
        console.log(1)
    }
    col1.add(obj)
    equal(col1.lastIndexOf(obj), 6, "index of obj")

    var col2 = new nx.data.Collection(col1)
    equal(col2.lastIndexOf(2), 5, "index of number,create from collection")
    col2.add(obj)
    equal(col2.lastIndexOf(obj), 7, "index of obj")
});

test('func toArray', function () {
    var col1 = new nx.data.Collection([1, 2, 3, 4])
    deepEqual(col1.toArray(), [1, 2, 3, 4], "toArray")
    var col2 = new nx.data.Collection(col1)
    deepEqual(col2.toArray(), [1, 2, 3, 4], "toArray,create from collection")
    //col2.add(function(){console.log(1)})
    //deepEqual(col2.toArray(),[1, 2, 3, 4,function(){console.log(1)}],"toArray")
});

test("unique", function () {
    var coll = new nx.data.Collection([1, 2, 3, 3]);

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
});
