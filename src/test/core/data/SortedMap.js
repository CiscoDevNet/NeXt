module("SortedMap");

test("init", function () {
    var smap = new nx.data.SortedMap();
    ok(smap.length() === 0, "Inital length.");
});

test("init with data", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    ok(smap.length() === 2, "Initial length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a", "Indices' values");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a", "Keys' values");
});

test("add", function () {
    var smap = new nx.data.SortedMap();
    var result;
    result = smap.add("A", "a");
    ok(result === "a", "Returned value at first time");
    ok(smap.length() === 1, "Length at first time");
    ok(smap.getValue("A") === "a");
    result = smap.add("a", "A", 0);
    ok(result === "A", "Returned value at second time");
    ok(smap.length() === 2, "Length at second time");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a", "Indices' values");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a", "Keys' values");
});

test("remove", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result = smap.remove("a");
    ok(result === "A", "Returned value");
    ok(smap.length() === 1, "Length");
    ok(smap.getKeyAt(0) === "A", "Key");
    ok(smap.indexOf("A") === 0, "Index");
    ok(smap.getValueAt(0) === "a", "Index's value");
    ok(smap.getValue("A") === "a", "Key's value");
});

test("removeAt", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result = smap.removeAt(0);
    ok(result === "A", "Returned value");
    ok(smap.length() === 1, "Length");
    ok(smap.getKeyAt(0) === "A", "Key");
    ok(smap.indexOf("A") === 0, "Index");
    ok(smap.getValueAt(0) === "a", "Index's value");
    ok(smap.getValue("A") === "a", "Key's value");
});

test("setIndex", function () {
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "a"
    }, {
        key: "a",
        value: "A"
    }]);
    smap.setIndex("a", 0);
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "A" && smap.getValueAt(1) === "a", "Indices' values");
    ok(smap.getValue("a") === "A" && smap.getValue("A") === "a", "Keys' values");
});

test("setValue", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result1 = smap.setValue("a", "a");
    var result2 = smap.setValue("A", "A");
    ok(result1 === "a" && result2 === "A", "Returned values");
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A", "Indices' values");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A", "Keys' values");
});

test("setValueAt", function () {
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    var result1 = smap.setValueAt(0, "a");
    var result2 = smap.setValueAt(1, "A");
    ok(result1 === "a" && result2 === "A", "Returned values");
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A", "Indices' values");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A", "Keys' values");
});

test("sort", function () {
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "a"
    }]);
    smap.setValue("A", "A");
    smap.add("a", "a");
    smap.sort(function (key1, val1, key2, val2) {
        return key1 < key2 ? 1 : (key1 > key2 ? -1 : 0);
    });
    ok(smap.length() === 2, "Length");
    ok(smap.getKeyAt(0) === "a" && smap.getKeyAt(1) === "A", "Keys");
    ok(smap.indexOf("a") === 0 && smap.indexOf("A") === 1, "Indices");
    ok(smap.getValueAt(0) === "a" && smap.getValueAt(1) === "A", "Indices' values");
    ok(smap.getValue("a") === "a" && smap.getValue("A") === "A", "Keys' values");
});

test("toArray", function () {
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "a"
    }]);
    smap.setValue("A", "A");
    smap.add("a", "a");
    smap.sort(function (key1, val1, key2, val2) {
        return key1 < key2 ? 1 : (key1 > key2 ? -1 : 0);
    });
    deepEqual(smap.toArray(), [{
        key: "a",
        value: "a"
    }, {
        key: "A",
        value: "A"
    }], "Returned array");
});

test("Value types", function () {
    var map = {
        Object1: {
            name: "obj1"
        },
        Object2: {
            name: "obj2"
        },
        Null: null,
        Undefined: undefined,
        String: "Hello",
        BlankString: "",
        Number: 10,
        NumberZero: 0,
        Array1: ["arr1"],
        Array2: ["arr2"],
        EmptyArray: []
    };
    var smap = new nx.data.SortedMap();
    nx.each(map, function (value, key) {
        smap.add(key, value);
        ok(smap.getValue(key) === value, "Value stored correctly with type: " + key);
    });
    nx.each(map, function (value, key) {
        var result = smap.remove(key);
        ok(result === value, "Value removed correctly with type: " + key);
    });
});

/*
test("Key types", function () {
    var keys = [null, undefined, "", "string", arguments.callee, 0, 10, [],
        [], {}, {}
    ];
    var values = [];
    nx.each(keys, function () {
        values.push(nx.uuid());
    });
    var smap = new nx.data.SortedMap();
    nx.each(keys, function (key, index) {
        smap.add(key, values[index]);
        ok(smap.getKeyAt(index) === key, "Key type supported: " + Object.prototype.toString.call(key) + " " + JSON.stringify(key));
    });
    nx.each(keys, function (key, index) {
        ok(smap.getValue(key) === values[index], "Value stored with key type: " + Object.prototype.toString.call(key) + " " + JSON.stringify(key));
    });
});
*/

/*
 * Properties tests start here
 */

test("property:length", function () {
    expect(3, "Expected operations once each: add/remove/removeAt");
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "A"
    }]);
    smap.watch("length", function (pname, pvalue) {
        ok(true);
    });
    smap.setValue("A", "a");
    smap.add("a", "a", 0);
    smap.setValueAt(0, "A");
    smap.remove("A");
    smap.removeAt(0);
    smap.sort(function (key1, val1, key2, val2) {
        return key1 < key2;
    });
});

/*
 * Events tests start here
 */

test("event:add", function () {
    var events = [];
    var smap = new nx.data.SortedMap();
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.add("A", "a");
    smap.add("a", "A", 0);
    deepEqual(events, [{
        action: "add",
        index: 0,
        key: "A",
        value: "a"
    }, {
        action: "add",
        index: 0,
        key: "a",
        value: "A"
    }], "Events happened");
});

test("event:remove", function () {
    var events = [];
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "A"
    }, {
        key: "A",
        value: "a"
    }]);
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.removeAt(0);
    smap.remove("A");
    deepEqual(events, [{
        action: "remove",
        index: 0,
        key: "a",
        value: "A"
    }, {
        action: "remove",
        index: 0,
        key: "A",
        value: "a"
    }], "Events happened");
});

test("event:set", function () {
    var events = [];
    var smap = new nx.data.SortedMap([{
        key: "a",
        value: "a"
    }, {
        key: "A",
        value: "A"
    }]);
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.setValueAt(0, "A");
    smap.setValue("A", "a");
    deepEqual(events, [{
        action: "set",
        index: 0,
        key: "a",
        value: "A",
        oldValue: "a"
    }, {
        action: "set",
        index: 1,
        key: "A",
        value: "a",
        oldValue: "A"
    }], "Events happened");
});

test("event:reorder", function () {
    var events = [];
    var smap = new nx.data.SortedMap([{
        key: "A",
        value: "a"
    }, {
        key: "a",
        value: "A"
    }]);
    smap.on("change", function (sender, evt) {
        events.push(evt);
    });
    smap.setIndex("A", 1);
    // since 'A' set its index to 1, 'a' automatically become index 0, so this operation will cause no event
    smap.setIndex("a", 0);
    deepEqual(events, [{
        action: "reorder",
        oldIndex: 0,
        index: 1,
        key: "A"
    }], "Events happened");
});
