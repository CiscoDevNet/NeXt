#watch & binding

##watch
####watch single property's change'

Use `watch` to watch property's change

    nx.define("A", nx.Observable, {
        properties: {
            prop1: 'foo'
        }
    });

    var a = new A();
    a.watch('prop1', function(propName, propValue) {
        console.log(propName, propValue);
    });



    a.prop1('bar');


###watch all properties change

Use `*` to watch all

    nx.define("A", nx.Observable, {
        properties: {
            prop1: 'foo',
            prop2: 'bar'
        }
    });

    var a = new A();
    a.watch('*', function(propName, propValue) {
        console.log(propName, propValue);
    });



    a.prop1('bar');
    a.prop2('foo');

---
Use `nx.Observable.watch` to watch an object

    nx.define("A", nx.Observable, {
        properties: {
            prop1: 'foo',
            prop2: 'bar'
        }
    });

    var a = new A();
    var watcher = nx.Observable.watch(a, 'prop1', function(propName, propValue) {
        console.log(propName, propValue);
    });

    a.prop1('bar');


Can easily unwatch

    watcher.release()


---
watch/monitor mullit properties

    nx.define("A", nx.Observable, {
        properties: {
            prop1: 'foo',
            prop2: 'bar'
        }
    });

    var a = new A();
    var monitor = nx.Observable.monitor(a, ['prop1','prop2'], function(propName, propValue) {
        console.log(propName, propValue);
    });

    a.prop1('bar');
    a.prop2('foo');

Can easily unmonitor

    monitor.release()


---

binding
===




    nx.define("A", nx.Observable, {
        properties: {
            prop1: 'foo'
        }
    });

    nx.define("B",nx.Observable, {
        properties: {
            prop2: 'bar'
        }
    });

    var a = new A();
    var b = new B();


    var binding = new nx.Binding({
        source: a,
        sourcePath: 'prop1',
        target: b,
        targetPath: 'prop2'
    });


Class function

    nx.define("A", nx.Observable, {
        properties: {
            prop1: 'foo'
        }
    });

    nx.define("B",nx.Observable, {
        properties: {
            prop2: 'bar'
        }
    });

    var a = new A();
    var b = new B();


    a.setBinding('prop1','prop2',b);



###converter

###direction

###bindingType

###format



