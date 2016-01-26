var TIMEOUT = 10000;

var fs = require('fs');
var phantom = require('phantom');
var getopt = require('node-getopt');

var opt = getopt.create([
    ['s', 'screenshot=ARG', 'Screen shot.'],
    ['r', 'report=ARG', 'option with argument'],
    ['h', 'help', 'display this help'],
    ['v', 'version', 'show version']
]).parseSystem();

var screenshot = opt.options.screenshot;
var url = opt.argv[0];
var fdReport = opt.options.report && fs.openSync(opt.options.report, "w");
phantom.create(function(ph) {
    ph.createPage(function(page) {
        page.set('viewportSize', {
            width: 1600,
            height: 1000
        });
        console.log(url);
        page.open(url, function(status) {
            if (status !== "success") {
                console.log(status);
                console.log("Unable to access network");
                process.exit(1);
            } else {
                var tic = 0,
                    TIC = 100;
                var interval = setInterval(function() {
                    tic += TIC;
                    page.evaluate(function() {
                        return document.getElementById('qunit-testresult').innerText.match('completed');
                    }, function(completed) {
                        if (completed) {
                            page.evaluate(function() {
                                try {
                                    return {
                                        total: document.getElementById('qunit-testresult').getElementsByClassName("total")[0].innerHTML * 1,
                                        passed: document.getElementById('qunit-testresult').getElementsByClassName("passed")[0].innerHTML * 1,
                                        failed: document.getElementById('qunit-testresult').getElementsByClassName("failed")[0].innerHTML * 1
                                    }
                                } catch (e) {};
                                return 1;
                            }, function(result) {
                                page.evaluate(function() {
                                    return window.report;
                                }, function(xml) {
                                    if (result && !result.failed) {
                                        screenshot && page.render(screenshot);
                                        fdReport && fs.writeSync(fdReport, xml);
                                        console.log(result.passed + "/" + result.total + " test passed.");
                                        process.exit(0);
                                    } else {
                                        screenshot && page.render(screenshot);
                                        fdReport && fs.writeSync(fdReport, xml);
                                        console.error(result.failed + "/" + result.total + " test failed.");
                                        process.exit(1);
                                    }
                                });
                            });
                        } else if (tic > TIMEOUT) {
                            // If condition still not fulfilled (timeout but condition is 'false')
                            console.error("Page timeout");
                            process.exit(1);
                        }
                    });
                }, TIC);
            }
        });
    });
});