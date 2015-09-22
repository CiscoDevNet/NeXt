module("Element.js", {teardown: function () {
    var comps = app.content();
    var child;
    for (var i = 0; i < comps.count(); i++) {
        child = comps.getItem(i);
        child.destroy();
    }
}
});

nx.define('dom_test', nx.ui.Component, {
    view: {
        props: {
            'id': 'test'
        },
        content: [
            {
                name: "hiddenbutton",
                tag: "button",
                props: {style: {visibility: "hidden", width: "5px"}, id: 1}
            },
            {
                name: "button",
                tag: "button",
                props: {id: 2}
            },
            {
                name: "button1",
                tag: "button",
                props: {id: 3}
            },
            {
                name: "button2",
                tag: "button",
                props: {id: 4}
            }
        ]
    }
});

test('method getRoot', function () {
    var obj = new dom_test();
    obj.attach(app);
    var result = obj.view().dom().getRoot()
    if (result.getElementsByTagName("body")) {
        ok(true)
    }
    else ok(false)
    obj.destroy()
});

var User = null;

var Employee = nx.define('cisco.model.Employee', User, {
    statics: {
        NAME_SPLITTER: ' '                                  //define a static member
    },
    events: ['online', 'offline'],                          //define the events
    properties: {
        firstName: '',                                      //define a property with a default value
        lastName: {
            value: ''                                       //define a property with a default value
        },
        fullName: {                                         //define a property with accessor
            get: function () {                              //define the property getter
                var arr = [];
                arr[0] = this.firstName();                  //get a property value explicitly
                arr[1] = this.get('lastName');              //get a property value dynamically
                return arr.join(Employee.NAME_SPLITTER);
            },
            set: function (value) {                         //define the property setter
                if (value) {
                    var names = value.split(' ');
                    this.firstName(names[0]);               //set a property value explicitly
                    this.set('lastName', names[1]);         //set a property value dynamically
                }
            }
        },
        alias: {
            value: null,
            readonly: true                                  //define a readonly property
        }
    },
    methods: {
        init: function (firstName, lastName) {              //define the constructor
            this.firstName(firstName);
            this.lastName(lastName);
        },
        login: function () {
            this.inherited();                               //call the overridden method
            this.fire('online');                            //fire an event
        },
        logout: function () {
            this.inherited();
            this.fire('offline', {                          //fire an event with data
                timestamp: new Date()
            });
        }
    }
});

var e = new Employee();

test('method getDocument', function () {
    var obj = new dom_test();
    obj.attach(app);
    var result = obj.view().dom().getDocument()
    if (result)
        ok(true)
    else
        ok(false)
    obj.destroy()
});

test('method getWindow', function () {
    var obj = new dom_test();
    obj.attach(app);
    var result = obj.view().dom().getWindow()
    if (result)
        ok(true)
    else
        ok(false)
    obj.destroy()
});

test('method toggleClass', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button').dom().toggleClass('toggle');
    ok(obj.resolve('button').dom().hasClass('toggle'), 'toggle class not exists');
    equal(obj.resolve('button').dom().$dom.className, 'toggle', 'check dom after toogle')
    //obj.resolve('button').dom().$dom.cla
    obj.resolve('button').dom().toggleClass('toggle');
    ok(!obj.resolve('button').dom().hasClass('toggle'), 'toggle existing class');
    equal(obj.resolve('button').dom().$dom.className, '', 'check dom after toogle')
    obj.destroy();
});

test('method show', function () {

    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button').dom().show();
    ok(true)
    obj.destroy();
});

test('method hide', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button').dom().hide();
    ok(true)
    obj.destroy();
});

test('method set/get/remove/Attribute', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.view().dom().setAttribute('test', 'test');
    result = obj.view().dom().getAttribute('test')
    ok(result == 'test')
    obj.view().dom().removeAttribute('test')
    result = obj.view().dom().getAttribute('test')
    ok(result == null)
    obj.destroy();
});

test('method set/get/text', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button').dom().setText('text')
    result = obj.resolve('button').dom().getText('text')
    ok(result == 'text')
    obj.destroy();
});

test('method set/get/html', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button').dom().setHtml("<test>1</test>");
    result = obj.resolve('button').dom().getHtml()
    ok(result == '<test>1</test>')
    obj.destroy();
});

test('method has/add/delete/class', function () {
    var obj = new dom_test();
    obj.attach(app);

    ok(!obj.view().dom().hasClass('qw'))
    obj.view().dom().addClass('qw')
    ok(obj.view().dom().hasClass('qw'))
    obj.view().dom().removeClass('qw')
    ok(!obj.view().dom().hasClass('qw'))
    obj.destroy();
});

test('method toggle class', function () {
    var obj = new dom_test();
    obj.attach(app);
    if (obj.view().dom().hasClass('test')) {
        obj.view().dom().toggleClass('test')
        ok(!obj.view().dom().hasClass('test'))
    }

    if (!obj.view().dom().hasClass('test')) {
        obj.view().dom().toggleClass('test')
        ok(obj.view().dom().hasClass('test'))
    }

    if (obj.view().dom().hasClass('test')) {
        obj.view().dom().toggleClass('test')
        ok(!obj.view().dom().hasClass('test'))
    }
    obj.view().dom().removeClass('test')
    obj.destroy();
});


test('method set/getStyle', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button2').dom().setStyle('width', 100)

    equal(obj.resolve('button2').dom().getStyle('width', true), '100px')
    obj.destroy();
});

test('method set/getStyle(s)', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button2').dom().setStyle('width', 100)
    equal(obj.resolve('button2').dom().getStyle('width', true), '100px')
    obj.resolve('button2').dom().setStyles({"height": 30, "text-align": "left"})
    equal(obj.resolve('button2').dom().getStyle('height', true), '30px')
    console.log(obj.resolve('button2').dom().$dom);
    equal(obj.resolve('button2').dom().getStyle('text-align', true), 'left')
    obj.resolve('button2').dom().removeStyle("width")
    obj.resolve('button2').dom().removeStyle("height")
    obj.resolve('button2').dom().removeStyle("text-align")
    notEqual(obj.resolve('button2').dom().getStyle('width', true), '100px')
    obj.destroy();
});

test('method focus/blur', function () {
    var obj = new dom_test();
    obj.attach(app);
    obj.resolve('button').dom().focus()
    //new nx.dom.Element()
    strictEqual(document.activeElement, obj.resolve('button').dom().$dom)
    obj.resolve('button').dom().blur()
    strictEqual(document.activeElement, document.body)
    obj.destroy();
});