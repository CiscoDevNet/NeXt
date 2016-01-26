module("Query.js");
var col = new nx.data.Collection([
    {id:1,"name": "sfc", "ipaddress": "29.29.29.29", "site": "sfc", "y": 550.31264292335, "protected": false, "active": "T", "x": -1021.91217850693},
    {id:2,"name": "sea", "ipaddress": "28.28.28.28", "site": "sea", "y": -9.8292223022888, "protected": false, "active": "T", "x": -552.893870303646},
    {id:3,"name": "hst", "ipaddress": "20.20.20.20", "site": "hst", "y": 1185.49743746152, "protected": true, "active": "T", "x": 93.011342707737},
    {id:4,"name": "chi", "ipaddress": "19.19.19.19", "site": "chi", "y": -1.78890844737532, "protected": false, "active": "T", "x": 347.621281446664},
    {id:5,"name": "atl", "ipaddress": "17.17.17.17", "site": "atl", "y": 1188.17754207982, "protected": true, "active": "T", "x": 476.26630312528},
    {id:6,"name": "min", "ipaddress": "24.24.24.24", "site": "min", "y": -4.46901306567981, "protected": true, "active": "T", "x": -67.7949343905326},
    {id:7,"name": "lax", "ipaddress": "22.22.22.22", "site": "lax", "y": 941.607917195807, "protected": true, "active": "T", "x": -702.979728928698},
    {id:8,"name": "kcy", "ipaddress": "21.21.21.21", "site": "kcy", "y": 539.592224450132, "protected": false, "active": "T", "x": -65.1148297722282},
    {id:9,"name": "nyc", "ipaddress": "25.25.25.25", "site": "nyc", "y": 378.785947351863, "protected": false, "active": "T", "x": 679.954254116421},
    {id:10,"name": "wdc", "ipaddress": "31.31.31.31", "site": "wdc", "y": 767.401117006014, "protected": true, "active": "T", "x": 599.551115567286},
    {id:11,"name": "por", "ipaddress": "26.26.26.26", "site": "por", "y": -15.1894315388978, "protected": false, "active": "T", "x": -1016.55196927032},
    {id:12,"name": "alb", "ipaddress": "16.16.16.16", "site": "alb", "y": 0.891196170929173, "protected": false, "active": "T", "x": 1041.76837758753},
    {id:13,"name": "mia", "ipaddress": "23.23.23.23", "site": "mia", "y": 1177.4571236066, "protected": true, "active": "T", "x": 1023.0076452594},
    {id:14,"name": "san", "ipaddress": "27.27.27.27", "site": "san", "y": 1180.13722822491, "protected": true, "active": "T", "x": -400.12790706029},
    {id:15,"name": "bos", "ipaddress": "18.18.18.18", "site": "bos", "y": 378.785947351863, "protected": false, "active": "T", "x": 1341.94009483763},
    {id:16,"name": "sjc", "ipaddress": "30.30.30.30", "site": "sjc", "y": 547.632538305046, "protected": true, "active": "T", "x": -558.254079540255}
]);

test('init a Query', function () {
    var col = new nx.data.Collection([1, 2, 3, 4]);
    var q1 = new nx.data.Query();
    var q2 = new nx.data.Query([1, 2, 3]);
    var q3 = new nx.data.Query(col);
    var q4 = new nx.data.Query(q2);

    ok(q1.count() === 0, 'init an empty Query');
    ok(q2.count() === 3, 'init a Query by Array');
    ok(q3.count() === 4, 'init a Query by Collection');
    ok(q4.count() === 3, 'init a Query by Query');
});


test('basic query', function () {
    var col = new nx.data.Collection([3, 6, 4, 5, 1, 8, 7, 2]);
    var q1 = new nx.data.Query(col);
    var q2 = new nx.data.Query(col);

    deepEqual(q1.select(), [3, 6, 4, 5, 1, 8, 7, 2], 'simple select');
    equal(q1.first(), 3, 'simple first');
    equal(q1.first(function (item) {
        return item < 3;
    }), 1, 'conditional first');
    equal(q1.last(), 2, 'simple last');
    equal(q1.last(function (item) {
        return item > 3;
    }), 7, 'conditional last');
    equal(q1.max(), 8, 'simple max');
    equal(q1.min(), 1, 'simple min');
    equal(q1.sum(), 36, 'simple sum');
    equal(q1.average(), 4.5, 'simple average');

    deepEqual(q2.where(function (item) {
        return item > 5;
    }).select(), [6, 8, 7], 'simple where');

    deepEqual(q2.orderBy('').select(), [1, 2, 3, 4, 5, 6, 7, 8], 'simple orderBy');
    deepEqual(q2.where(function (item) {
        return item > 4;
    }).orderBy('', true).select(), [8, 7, 6, 5], 'where and orderBy');
    deepEqual(q2.skip(2).take(3).select(), [4, 5, 1], 'simple skip take');
});

test('order by', function () {
    var q1 = new nx.data.Query(col);
    var result = q1.orderBy("ipaddress",true).select()
    equal(result[result.length-1].ipaddress,"16.16.16.16", "order by fields desc");
    result = q1.orderBy("ipaddress",false).select()
    equal(result[0].ipaddress,"16.16.16.16", "order by fields asc");

    var func = function(a,b){
        if (a.ipaddress > b.ipaddress)
        {
            return 1;
        }
        return -1;
    }
    result = q1.orderBy(func,true).select();
    equal(result[result.length-1].ipaddress,"16.16.16.16", "order by func asc");

    result = q1.orderBy(func,false).select();
    equal(result[0].ipaddress,"16.16.16.16", "order by func desc");
});

test('where', function () {
    var q1 = new nx.data.Query(col);
    var result = q1.where(function(item){return item.protected == true}).select();
    equal(result.length, 8, "where query")

});

test('select', function () {
    var q1 = new nx.data.Query(col);
    func = function(item){
        return item.site+"test";
    }
    var result = q1.select(func);
    equal(16, result.length,"select a field using function")
    equal(result[0],"sfctest")
    result = q1.select("site");
    equal(16, result.length,"select a field using function")
    equal(result[0],"sfc")

    result = q1.select(["site","ipaddress","xxx"]);
    equal(undefined, result[0].name, "select not exists multiple field")
    equal("sfc", result[0].site, "select multiple field")
    result = q1.select("xxx");
});

test('first', function () {
    var q1 = new nx.data.Query(col);
    func = function(item){
        return item.id==16;
    }
    var result = q1.first(func)
    equal(result.ipaddress,"30.30.30.30", "top with func input")
    result = q1.first()
    equal(result.ipaddress,"29.29.29.29", "top with no input")
});

test('last', function () {
    var q1 = new nx.data.Query(col);
    func = function(item){
        return item.id<3;
    }
    var result = q1.last(func)
    equal(result.ipaddress,"28.28.28.28", "top with func input")
    result = q1.last()
    equal(result.ipaddress,"30.30.30.30", "top with no input")
});

test('any', function () {
    var q1 = new nx.data.Query(col);
    func = function(item){
        return item.id==16;
    }
    equal(q1.any(func), true,"any func")

});

test('all', function () {
    var q1 = new nx.data.Query(col);
    func = function(item){
        return item.id<100;
    }
    equal(q1.any(func), true,"all func")
});

test('max', function () {
    var q1 = new nx.data.Query(col);
    var result = q1.max("ipaddress")
    equal(result, "31.31.31.31","max function path input")

});

test('min', function () {
    var q1 = new nx.data.Query(col);
    var result =q1.min("ipaddress")
    equal(result, "16.16.16.16","max function func input")
});

test('sum', function () {
    var q1 = new nx.data.Query(col);
    var result = q1.sum("id")
    equal(result, 36,"sum path input")
});

test('average', function () {
    var q1 = new nx.data.Query(col);
    var result = q1.min("id")
    equal(result, 1,"max function path input")
});

test('skipTake', function () {
    var col = new nx.data.Collection([1, 2, 3, 4]);
    var q1 = new nx.data.Query(col);
    deepEqual(q1.skip(1).take(2).select(),[2,3],"test skip and take" )
    deepEqual(q1.skip(4).take(2).select(),[],"test skip and take" )
    deepEqual(q1.skip(1).take(10).select(),[2,3,4],"test skip and take")
    deepEqual(q1.skip(1).take(1).select(),[2],"test skip and take")
    deepEqual(q1.skip(1).take(2).select(),q1.take(2).skip(1).select(),"test sequence of skip and take")
});


test('Mix Test', function () {
    var q1 = new nx.data.Query(col);
    var whereFunc = function (item){
        return item.x <0  && item.y < 0
    }
    result = q1.where(whereFunc).orderBy("ipaddress",false).skip(1).take(1).select("name")
    equal(result[0],"por", "test mix query")

});