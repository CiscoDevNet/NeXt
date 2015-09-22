module("base.js");
nx.define('test.Parent', {
    properties: {
        propparent: "parent"
    }
});

nx.define('test.Child1', test.Parent, {
    properties: {
        prop: "child1"
    }
});

nx.define('test.Child2', test.Parent, {
    properties: {
        prop: "child2",
        prop1: {
            value: function () {
                return new test.Child1
            }
        }
    }
});

nx.define('test.Child3', test.Child1, {
    properties: {
        prop3: "child3",
        prop2: {
            value: function () {
                return new test.Child2
            }
        }
    }
});

test("nx.extend", function () {
    var target = {}
    var arg = new Object;
    arg.x = 1;
    arg.y = 2;
    arg.func = function () {
        console.log("test")
    }
    var arg2 = new Object;
    arg2.x = 5;
    arg2.z = 2;
    var arg3 = {a: {b: 1, c: 2}, d: [1, 2, 3]}

    var result = nx.extend(target, arg, arg2, arg3)
    equal(5, target.x, "property override")
    deepEqual(target.func, arg.func, "extend function")
    deepEqual(target.d, arg3.d, "array function")
    deepEqual(target.a, arg3.a, "object function")
    target = {}
    result = nx.extend(target, {})
    deepEqual(target, {}, "empty object")
    target = {}
    result = nx.extend(target)
    deepEqual(target, {}, "empty object")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    }
    var func = {};
    func.__each__ = testfunc;
    nx.each(func, testfunc)
    equal(1, count, "object with each func")

});

test("nx.each", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    }
    var func = [];
    nx.each(func, testfunc)
    equal(0, count, "empty array")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    }
    var func = document.images;
    nx.each(func, testfunc)
    equal(0, count, "empty native collection")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function (i, j) {
        count += 1
    }
    var func = [101, 102];
    nx.each(func, testfunc)
    equal(2, count, "array * 2")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function (i, j) {
        count += 1
    }
    var arg2 = new Object;
    arg2.x = 5;
    arg2.z = 2;
    arg2.obj = {a: {b: 1, c: 2}, d: [1, 2, 3]}
    nx.each(arg2, testfunc)
    equal(3, count, "object")
});

test("nx.each", function () {
    var count = 0;
    testfunc = function (i, j) {
        count += 1
    }
    var arg2 = new Object;
    nx.each(arg2, testfunc)
    equal(0, count, "empty object")
});


test("nx.is", function () {
    var count = 0;
    testfunc = function () {
        count += 1
    }
    var func = {};
    func.__is__ = testfunc;
    nx.is(func, "String")
    equal(1, count, "object with is func")
});

test("nx.is", function () {
    var func = {};
    result = nx.is(func, "Object")
    ok(result, "check object")
    func = "";
    result = nx.is(func, "String")
    ok(result, "check string")
    func = []
    result = nx.is(func, "Array")
    ok(result, "check array")
    func = null
    result = nx.is(func, "Null")
    ok(result, "check null")
    func = undefined
    result = nx.is(func, "Undefined")
    ok(result, "check Undefined")
    func = 1
    result = nx.is(func, "Number")
    ok(result, "check Number")
    func = true
    result = nx.is(func, "Boolean")
    ok(result, "check Boolean")
    func = function () {
        console.log("1")
    }
    result = nx.is(func, "Function")
    ok(result, "check Function")

    func = document.createElement("div")
    result = nx.is(func, HTMLElement)
    ok(result, "other object")

    ok(!nx.is("", HTMLElement), "other object")
});

test("nx.path", function () {
    var jobj1={a:'1',b:{c:{d:"2"}},e:['3','4','5','6']}
    var jobj2=[{a:'1',b:'2',c:{d:{e:'3'}}},{a:'4',b:'5',c:{d:{e:'6'}}},'7',['8','9']]
    var testObj = new test.Child2
    equal(nx.path(testObj, "prop"),"child2","check prop")
    equal(nx.path(testObj, "propparent"),"parent", "check parent prop")
    nx.path(testObj, "propparent","newparent2")
    equal(nx.path(testObj, "propparent"),"newparent2", "set parent prop value")
    equal(nx.path(testObj, "prop1.prop"),"child1", "check object prop")
    equal(nx.path(testObj, "prop1.propparent"),"parent", "check object prop's parent")
    nx.path(testObj, "prop1.propparent", "newparent")
    equal(nx.path(testObj, "prop1.propparent"),"newparent", "set object prop's parent")

    var testObj2 = new test.Child3
    equal(nx.path(testObj2, "prop3"),"child3","check prop")
    equal(nx.path(testObj2, "prop"),"child1", "check parent prop")
    equal(nx.path(testObj2, "propparent"),"parent", "check parent's parent prop")

    // need json, array
    equal(nx.path(jobj1, "a"),"1","json check")
    equal(nx.path(jobj1, "b.c.d"),"2","json child check")
    equal(nx.path(jobj1, "e.1"),"4","json check array")
    deepEqual(nx.path(jobj1, "e"),['3','4','5','6'], "array")

    equal(nx.path(jobj2, "0.a"),"1","check prop")
    equal(nx.path(jobj2, "0.c.d.e"),"3","check prop")
    equal(nx.path(jobj2, "1.b"),"5","check prop")
    equal(nx.path(jobj2, "2"),"7","check prop")
    deepEqual(nx.path(jobj2, "3"),['8','9'],"check prop")
    nx.path(jobj2, "3",['10'])
    deepEqual(nx.path(jobj2, "3"),['10'])
    nx.path(jobj2, "4.new.net",['11'])
    deepEqual(nx.path(jobj2, "4.new.net"),['11'])
});
