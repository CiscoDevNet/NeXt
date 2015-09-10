module("ObservableDictionary.js");

var MyDictionary = nx.define(nx.data.ObservableDictionary, {});

test('init a dict', function () {
    var dict1 = new nx.data.ObservableDictionary();
    var dict2 = new nx.data.ObservableDictionary({
        a: 1,
        b: 2
    });
    var dict3 = new nx.data.ObservableDictionary(dict2);
    var dict5 = new nx.data.ObservableDictionary(new MyDictionary({
        x: "x",
        y: "y",
        z: "z"
    }));
    var dict6 = new MyDictionary(dict2);

    ok(dict1.count() === 0, 'init an empty Dictionary');
    ok(dict2.count() === 2, 'init a Dictionary by object');
    ok(dict3.count() === 2, 'init a Dictionary by Dictionary');
    ok(dict5.count() === 3, 'init a Dictionary by custom Dictionary');
    ok(dict6.count() === 2, 'init a custom Dictionary by Dictionary');
});

test('handle dict events', function () {
    var dict1 = new nx.data.ObservableDictionary({
        a: 1,
        b: 2
    });
    dict1.on("change", function (target, event) {
        var items = event.items;
        var item = items[0];
        switch (event.action) {
        case 'add':
            deepEqual(dict1.getItem("map"), {
                x: 1,
                y: 2,
                z: 3
            }, "add value");
            deepEqual(item.value(), {
                x: 1,
                y: 2,
                z: 3
            }, "add item value");
            break;
        case "remove":
            equal(dict1.getItem("b"), undefined, "removed successful");
            equal(item.key(), "b", "removed item key");
            equal(item.value(), 2, "removed item value");
            equal(item._dict, null, "removed item references nothing");
            break;
        case "replace":
            equal(dict1.getItem("a"), 3, "set value");
            equal(item.value(), 3, "set item value");
            break;
        case "clear":
            equal(items.length, 2, "item count");
            equal(items[0]._dict, null, "cleared item references nothing");
            equal(items[0].key(), "a", "cleared item key");
            equal(items[0].value(), 3, "cleared item value");
            equal(dict1.count(), 0, "clear successful");
            break;
        }
    });
    // add
    dict1.setItem("map", {
        x: 1,
        y: 2,
        z: 3
    });
    dict1.removeItem("b");
    dict1.setItem("a", 3);
    dict1.clear();
});


test("monitor", function () {
    expect(5);
    var dict = new nx.data.ObservableDictionary();
    var dict1 = new nx.data.ObservableDictionary();
    var dict2 = new nx.data.ObservableDictionary();
    dict.setItem("dict1", dict1);
    var watcher = dict.monitor(function (key, value) {
        ok(key === "dict1" && value === dict1, "Exist pair processed");
        var res = value.monitor(function (key, value) {
            ok(key === "dict2" && value === dict2, "New pair processed");
            return function () {
                ok(true, "inner released");
            };
        });
        return function () {
            res.release();
            ok(true, "outer released");
        };
    });
    dict1.setItem("dict2", dict2);
    watcher.release();
    ok(dict.getItem("dict1") === dict1 && dict1.getItem("dict2") === dict2);
    // not notify anything from here
    dict.setItem("dict2", dict2);
    dict1.removeItem("dict1");
    dict2.setItem("dict", dict);
});

test("monitor key", function () {
    var dict = new nx.data.ObservableDictionary();
    var dict1 = new nx.data.ObservableDictionary();
    var dict2 = new nx.data.ObservableDictionary();
    var watcher = dict.monitor("dict1", function (value) {
        ok(value === dict1, "Exist pair processed");
    });
    dict.setItem("dict1", dict1);
    dict.setItem("dict2", dict2);
    watcher.release();
    // not notify anything from here
    dict.setItem("dict1", dict2);
});

test("monitor keys", function () {
    var dict = new nx.data.ObservableDictionary({
        a: 1,
        b: 2
    });
    var sum, count = 0;
    var watcher = dict.monitor(["a", "b"], function (a, b) {
        sum = a + b;
        count++;
    });
    ok(!sum && count === 0);
    watcher.affect();
    ok(sum === 3 && count === 1);
    dict.setItem("a", 10);
    ok(sum === 12 && count === 2);
    dict.setItem("b", 22);
    ok(sum === 32 && count === 3);
    dict.setItems({
        a: -1,
        b: 1
    });
    // FIXME is better to call only once
    ok(sum === 0);
    watcher.release();
    // not notify anything from here
    dict.setItem("a", 11);
    ok(sum === 0);
});
