(function (nx, global) {

    nx.define("nx.util", {
        static: true,
        methods: {
            uuid: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                }).toUpperCase();
            },
            without: function (array, item) {
                var index;
                while ((index = array.indexOf(item)) != -1) {
                    array.splice(index, 1);
                }
                return array;
            },
            find: function (array, iterator, context) {
                var result;
                array.some(function (value, index, list) {
                    if (iterator.call(context || this, value, index, list)) {
                        result = value;
                        return true;
                    }
                });
                return result;
            },
            uniq: function (array, iterator, context) {
                var initial = iterator ? array.map(iterator.bind(context || this)) : array;
                var results = [];
                nx.each(initial, function (value, index) {
                    if (results.indexOf(value) == -1) {
                        results.push(array[index]);
                    }
                });
                return results;
            },
            indexOf: function (array, item) {
                return array.indexOf(item);
            },
            setProperty: function (source, key, value, owner) {
                if (value !== undefined) {
                    if (nx.is(value, 'String')) {
                        if (value.substr(0, 5) == 'model') { // directly target'bind model
                            source.setBinding(key, value + ',direction=<>', source);
                        } else if (value.substr(0, 2) == '{#') { // bind owner's property
                            source.setBinding(key, 'owner.' + value.substring(2, value.length - 1) + ',direction=<>', owner);
                        } else if (value.substr(0, 1) == '{') { // bind owner's model
                            source.setBinding(key, 'owner.model.' + value.substring(1, value.length - 1), owner);
                        } else {
                            source.set(key, value);
                        }
                    } else {
                        source.set(key, value);
                    }
                }
            },
            loadScript: function (url, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";

                if (script.readyState) { //IE
                    script.onreadystatechange = function () {
                        if (script.readyState == "loaded" ||
                            script.readyState == "complete") {
                            script.onreadystatechange = null;
                            callback();
                        }
                    };
                } else { //Others
                    script.onload = function () {
                        callback();
                    };
                }
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            },
            parseURL: function (url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    source: url,
                    protocol: a.protocol.replace(':', ''),
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    params: (function () {
                        var ret = {},
                            seg = a.search.replace(/^\?/, '').split('&'),
                            len = seg.length,
                            i = 0,
                            s;
                        for (; i < len; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            s = seg[i].split('=');
                            ret[s[0]] = s[1];
                        }
                        return ret;
                    })(),
                    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                    hash: a.hash.replace('#', ''),
                    path: a.pathname.replace(/^([^\/])/, '/$1'),
                    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                    segments: a.pathname.replace(/^\//, '').split('/')
                };
            },
            keys: function (obj) {
                return Object.keys(obj);
            },
            values: function (obj) {
                var values = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        values.push(obj[key]);
                    }
                }
                return values;
            },
            boundHitTest: function (sourceBound, targetBound) {
                var t = targetBound.top >= sourceBound.top && targetBound.top <= ((sourceBound.top + sourceBound.height)),
                    l = targetBound.left >= sourceBound.left && targetBound.left <= (sourceBound.left + sourceBound.width),
                    b = (sourceBound.top + sourceBound.height) >= (targetBound.top + targetBound.height) && (targetBound.top + targetBound.height) >= sourceBound.top,
                    r = (sourceBound.left + sourceBound.width) >= (targetBound.left + targetBound.width) && (targetBound.left + targetBound.width) >= sourceBound.left,
                    hm = sourceBound.top >= targetBound.top && (sourceBound.top + sourceBound.height) <= (targetBound.top + targetBound.height),
                    vm = sourceBound.left >= targetBound.left && (sourceBound.left + sourceBound.width) <= (targetBound.left + targetBound.width);

                return (t && l) || (b && r) || (t && r) || (b && l) || (t && vm) || (b && vm) || (l && hm) || (r && hm);
            },
            isFirefox: function () {
                return navigator.userAgent.indexOf("Firefox") > 0;
            }
        }
    });


})(nx, nx.global);
