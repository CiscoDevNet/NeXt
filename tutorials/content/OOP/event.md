#Events

[Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern)

### register and fire event



    nx.define("A", {
        events: ['spark'],
        methods: {
            foo: function() {
                this.fire('spark');
            }
        }
    });

    var a = new A();

    a.on('spark', function() {
        console.log('Hooooola 1');
    });


    a.on('spark', function() {
        console.log('Hooooola 2');
    });

    a.upon('spark', function() {
        console.log('Always first! Hooooola');
    });

    a.foo();


### unregister event

    nx.define("A", {
        events: ['spark'],
        methods: {
            foo: function() {
                this.fire('spark');
            }
        }
    });

    var a = new A();

    a.on('spark', function() {
        console.log('Hooooola 1');
    });

    var fn = function(){
        console.log('Hooooola 2');
    };

    a.on('spark',fn);

    a.foo();

    a.off('spark',fn);

    a.foo();

    a.off('spark');

    a.foo();


 ![](https://upload.wikimedia.org/wikipedia/commons/8/8d/Observer.svg)

