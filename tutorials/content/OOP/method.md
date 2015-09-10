#Methods#

##constructor

`init` is the constructor of each class, it will automatically called by framework.

    nx.define("A", {
        methods:{
            init:function(args){
                console.log(args)
            }
        }
    });

    var a = new A(123);



#Inherit - overwrite
Define a same name function call overwrite parent's methods

    //define Class A
    nx.define("A", {
        methods: {
            call: function(str) {
                console.log(str);
            }
        }
    });

    //Define Class B, inhert Class A
    nx.define("B", A, {
        methods: {
            call: function(str) {
                console.log("Argument is", str);
            }
        }
    });

    var b = new B();
    b.call(123);
    //Argument is 123

#Inherit - override
Call `this.inherited` to call parent's method, call pass paramrers to this function;

    //define Class A
    nx.define("A", {
        methods: {
            call: function(str) {
                console.log(str);
            }
        }
    });

    //Define Class B, inhert Class A
    nx.define("B", A, {
        methods: {
            call: function(str) {
                this.inherited(str);
                console.log("Argument is", str);
            }
        }
    });

    var b = new B();
    b.call(123);
    123
    Argument is 123

