#Property
This a most important concept in NeXt!

It has these attributes, we will go though them


    propertyName: {
        value:function(){
        },
        get: function() {
        },
        set: function(args) {
        },
        wather:function(prop,value){
        },
        dependencies:[],
        init:function(){
        },
        binding:{

        }
    }

#Base

###Deifne a property.
use this syntex to define a property.

    propertyName: {
        value: function() {
            return property 's value
        }
    }

Example:

    nx.define("A", {
        properties: {
            prop1: {
                value:function() {
                  return "foo"
              }
            }
        }
    });

For the basic **Data types** (numbers, strings,boolean) you can use shortcut

    nx.define("A", {
        properties: {
            prop1: {
                value:"foo"
            }
        }
    });

---

###Get/set property's value

1. Directly use `a.prop1()` to get value, use `a.prop1(newValue)` to set value
2. Use `a.get('prop1)` and `a.set(prop1,newvalue)`.
3. Use `a.gets()` and `a.sets(objects)`

Example 1:


    nx.define("A", {
        properties: {
             prop1: {
                value:"foo"
            }
        }
    });
    var a = new A();

    //get property value;
    console.log(a.prop1());

    //set property value
    a.prop1('bar');

    //verify setting
    console.log(a.prop1());


Example 2 :

    nx.define("A", {
        properties: {
            prop1: {
                value: "foo"
            },
            prop2: {
                value: "bar"
            }
        }
    });
    var a = new A();

    console.log(a.get('prop1'));

    a.set('prop1', "F00");

    console.log(a.gets());

    a.sets({
        prop1:"hello",
        prop2:"world"
    });


---
###Property setter and getter

Use `set` and `get` to define complex properties.

    nx.define("A", {
        properties: {
            prop1: {
                get: function() {
                    console.log('call getter');
                    return this._prop1 || 'foo'
                },
                set: function(args) {
                    console.log('call setter',args);
                    this._prop1 = args;
                }
            }
        }
    });
    var a = new A();
    //get property value;
    console.log(a.prop1());
    //set property value
    a.prop1('bar');
    //verify setting
    console.log(a.prop1());


---
#Advance Usage of property
You should inherited from `nx.Observable` to enable advantage usage of property

###watcher

    nx.define("A", nx.Observable, {
        properties: {
            prop1: {
                value: "foo",
                watcher: function(prop, value) {
                    console.log("Change to", value)
                }
            }
        }
    });
    var a = new A();

    //get property value;
    console.log(a.prop1());

    //set property value
    a.prop1('bar');

---
###Dependencies

One property's value is depen on other properties, then you can use dependencies

Like:

`dependencies: ['property1Name', 'property2Name'],`

`value: function(property1Name, property2Name)`

Example:


    nx.define("A", nx.Observable, {
        properties: {
            prop1: {
                value: "foo"
            },
            prop2: {
                value: "bar"
            },
            prop3: {
                dependencies: ['prop1', 'prop2'],
                value: function(prop1, prop2) {
                    return prop1 + " " + prop2;
                }
            }
        }
    });
    var a = new A();

    //get prop3 value;
    console.log(a.prop3());

    //set prop1 a new value
    a.prop1('Foo');

    //get prop3 value;
    console.log(a.prop3());

    //set prop1 a new value
    a.prop2('Bar');

    //get prop3 value;
    console.log(a.prop3());

---

###init

    nx.define("A", nx.Observable, {
        properties: {
            prop1: {
                value: "foo",
                init: function() {
                    console.log('init prop1');
                }
            }
        }
    });
    var a = new A();


---

###binding

    nx.define("A", nx.Observable, {
        properties: {
            prop1: {
                value: "foo",
                binding: {
                    converter: 'number',
                    direction: "<>"
                }
            }
        }
    });
    var a = new A();

