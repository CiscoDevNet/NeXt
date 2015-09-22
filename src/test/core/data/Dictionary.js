module("Dictionary.js");

var MyDictionary = nx.define(nx.data.Dictionary, {});

test('init dict', function () {
    var dict1 = new nx.data.Dictionary();
    var dict2 = new nx.data.Dictionary({
        a: 1,
        b: 2
    });
    var dict3 = new nx.data.Dictionary(dict2);
    var dict5 = new nx.data.Dictionary(new MyDictionary({
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

test('change dict', function () {
    var dict1 = new nx.data.Dictionary({
        a: 1,
        b: 2
    });
    // add
    var item = dict1.setItem("map", {
        x: 1,
        y: 2,
        z: 3
    });
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
    // remove
    item = dict1.removeItem("b");
    equal(dict1.getItem("b"), undefined, "removed successful");
    equal(item.key(), "b", "removed item key");
    equal(item.value(), 2, "removed item value");
    equal(item._dict, null, "removed item references nothing");
    // set
    item = dict1.setItem("a", 3);
    equal(dict1.getItem("a"), 3, "set value");
    equal(item.value(), 3, "set item value");
    // clear
    var items = dict1.clear();
    equal(items.length, 2, "item count");
    equal(items[0]._dict, null, "cleared item references nothing");
    equal(items[0].key(), "a", "cleared item key");
    equal(items[0].value(), 3, "cleared item value");
    equal(dict1.count(), 0, "clear successful");
});
