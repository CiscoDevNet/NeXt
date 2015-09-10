#Define class

Learn how to define class, inherited class.
##Base
Use `nx.dfine` define a class..

    nx.define("ClassName", config);
Usually config include three basic attributes

    nx.define("ClassName", {
            events:[],
            properties: {},
            methods:{}
    });

-------
##Initialize class

Use `new` key work to initialize a class.

All functions in `methods` is APIs of this classm, can be directly called.

    nx.define("A",{
        methods: {
            foo: function() {
                console.log('foo')
            }
        }
    });
    var a = new A();
    a.foo();


####*Static class
Use `static: true` define a static class

    nx.define("A", {
        static: true,
        methods: {
            foo: function() {
                console.log('foo')
            }
        }
    });
    A.foo();

-------
##Inherit

Specify the second params as the parent class name (not string type).

Inherited class will overwrite/overtride three basic attributes

    nx.define("ClassName",ParentClassName,config);


Example:

    //define Class A
    nx.define("A", {
        properties: {
            cost:10
        },
        methods:{
            call:function(){
                console.log(this.cost());
            }
        }
    });

    //Define Class B, inhert Class A
    nx.define("B", A,{
        properties: {
            cost:20
        },
        methods:{
            call:function(){
                console.log("Cost:"+this.cost());
            }
        }
    });

    var b = new B();
    b.call();


-------
##Mixin class
In the config use `mixins` key word to mixin classes.

    nx.define("Foo", {
        methods:{
            log:function(){
              console.log('foo')
            }
        }
    });
    nx.define("Bar", {
        methods:{
            console:function(){
                console.log('bar')
            }
        }
    });
    nx.define("A", {
        mixins:[Foo,Bar]
    });

    var a = new A();
    a.log();
    a.console();



