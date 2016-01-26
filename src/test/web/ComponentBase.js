module("AbstractComponent.js",{teardown: function() {
    var comps = app.content()
    var child
    for(var i=0;i<comps.count();i++)
    {
        child = comps.getItem(i)
        child.destroy()
    }
}
});

nx.define('newComp', nx.ui.AbstractComponent, {
    methods: {
        createComponent: function (view) {
            nx.ui.AbstractComponent.createComponent(view, this)
        }
    }
});

test('createComponent1', function () {
    var obj = nx.ui.AbstractComponent;
    var view = {
        name: 'case1',
        tag: 'p',
        props: {style: 'color: green;', id: 'case1'}
    }
    var result = obj.createComponent(view, app)

    //check attach
    result.attach(app);
    equal(result.parent(), result.owner(), 'check parent is set')
    equal(result.resolve("@tag"), 'p', 'check tag')
    equal(result.owner().__className__, 'nx.ui.Application', 'check owner')
    deepEqual(app.resolve("case1"), result, 'check the obj append to parent')
    var result2 = document.getElementById("case1")
    ok(result2, 'check dom: id')
    equal(result2.tagName.toLowerCase(), 'p', 'check dom: tag name')
    equal(result2.style.cssText.trim(), 'color: green;', 'check dom: style')

    //check detach
    result.detach(app)
    equal(result.parent(), undefined, 'check parent is unset')
    result2 = document.getElementById("case1")
    ok(!result2, 'test detach')
    equal(app.resolve("case1"), undefined, 'check name after deatch')

    //check attach again
    result.attach(app);
    equal(result.parent(), result.owner(), 'check parent is set')
    equal(result.resolve("@tag"), 'p', 'check tag')
    equal(result.owner().__className__, 'nx.ui.Application', 'check owner')
    deepEqual(app.resolve("case1"), result, 'check the obj append to parent')
    result2 = document.getElementById("case1")
    ok(result2, 'check dom: id')
    equal(result2.tagName.toLowerCase(), 'p', 'check dom: tag name')
    equal(result2.style.cssText.trim(), 'color: green;', 'check dom: style')

    //check destroy
    result.destroy()
    result2 = document.getElementById("case1")
    ok(!result2, 'test detach', 'get dom after destory')
    equal(app.resolve("case1"), undefined, 'check name after destory')
    equal(result._resources, null, 'check name after destory')
});


test('getContainer', function () {
    var obj = nx.ui.AbstractComponent;
    var view = [
        {
            name: 'case1',
            tag: 'p',
            props: {style: 'color: green;', id: 'case1'}
        }
    ]
    var result = obj.createComponent(view, result)
    equal(result.getContainer().$dom.nodeName, '#document-fragment', 'container before attach')

    result.attach(app)
    equal(nx.compare(app.getContainer(), result.getContainer()), 0, "verify getContainer after attach")

    result.detach()
    equal(result.getContainer().$dom.nodeName, '#document-fragment', 'container after detach')

    result.destroy()
    equal(result._resources, null, 'container after detach')
});


test('attach', function () {
    var supclass = nx.ui.AbstractComponent;

    var view1 = {
        name: 'case1',
        tag: 'p',
        props: {style: 'color: black;', id: 'case1'}
    }
    var view2 = [
        {
            name: 'case2',
            tag: 'p',
            props: {style: 'color: green;', id: 'case2'}
        },
        {
            name: 'case3',
            tag: 'p',
            props: {style: 'color: yellow;', id: 'case3'}
        },
        {
            name: 'case4',
            tag: 'p',
            props: {style: 'color: red;', id: 'case4'}
        }
    ]
    var view3 = {
        name: 'case5',
        tag: 'p',
        props: {style: 'color: blue;', id: 'case5'}
    }
    var obj1 = supclass.createComponent(view1, app)
    var obj2 = supclass.createComponent(view2, app)
    var obj3 = supclass.createComponent(view3, app)
    obj1.attach(app)
    obj2.attach(app)
    equal(obj2.resolve("@root").$dom.childNodes.length, 0, "attach will clear fragment")
    obj3.attach(app, 2)
    equal(nx.compare(app.content().getItem(2), obj3), 0)
    deepEqual(obj3.resolve("@root").previousSibling().$dom, obj2.content().getItem(2).resolve("@root").$dom)

    obj3.detach()
    obj3.attach(app, 1)
    equal(nx.compare(app.content().getItem(1), obj3), 0)
    deepEqual(obj3.resolve("@root").nextSibling().$dom, obj2.content().getItem(0).resolve("@root").$dom)

    obj3.detach()
    obj3.attach(app, 10)
    equal(nx.compare(app.content().getItem(2), obj3), 0)
    deepEqual(obj3.resolve("@root").previousSibling().$dom, obj2.content().getItem(2).resolve("@root").$dom)
    equal(app.content().count(), 3, 'check content length')

    deepEqual(document.getElementById('case1').nextElementSibling, document.getElementById('case2'))
    deepEqual(document.getElementById('case2').nextElementSibling, document.getElementById('case3'))
    deepEqual(document.getElementById('case3').nextElementSibling, document.getElementById('case4'))
    deepEqual(document.getElementById('case4').nextElementSibling, document.getElementById('case5'))

    obj1.destroy()
    obj2.destroy()
    obj3.destroy()
});


test('detach', function () {
    var supclass = nx.ui.AbstractComponent;

    var view1 = {
        name: 'case1',
        tag: 'p',
        props: {style: 'color: black;', id: 'case1'}
    }
    var view2 = [
        {
            name: 'case2',
            tag: 'p',
            props: {style: 'color: green;', id: 'case2'}
        },
        {
            name: 'case3',
            tag: 'p',
            props: {style: 'color: yellow;', id: 'case3'}
        },
        {
            name: 'case4',
            tag: 'p',
            props: {style: 'color: red;', id: 'case4'}
        }
    ]
    var view3 = {
        name: 'case5',
        tag: 'p',
        props: {style: 'color: blue;', id: 'case5'}
    }
    var obj1 = supclass.createComponent(view1, app)
    var obj2 = supclass.createComponent(view2, app)
    var obj3 = supclass.createComponent(view3, app)
    obj1.attach(app)
    obj2.attach(app)
    obj3.attach(app)
    obj2.detach()
    //strictEqual(1,2)
    strictEqual(document.getElementById('case1').nextElementSibling, document.getElementById('case5'))
    strictEqual(obj2.resolve("@root").children().getItem(0).$dom, obj2.content().getItem(0).resolve("@root").$dom)
    strictEqual(obj2.resolve("@root").children().getItem(1).$dom, obj2.content().getItem(1).resolve("@root").$dom)
    strictEqual(obj2.resolve("@root").children().getItem(2).$dom, obj2.content().getItem(2).resolve("@root").$dom)
    obj1.destroy()
    obj2.destroy()
    obj3.destroy()
})
