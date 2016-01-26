var fs = require("fs");
var getopt = require("node-getopt").create([
    ["c", "codes=CODES", "codes to be referenced"],
    ["t", "tests=TESTS", "tests to be referenced"],
    ["h", "help", "display this help"]
]).setHelp(
    "Usage: node next-template.js template.html [-c codes] [-t tests] \n" +
    "\n" +
    "[[OPTIONS]]\n"
).bindHelp();

var opt = getopt.parseSystem();

var template = fs.readFileSync(opt.argv[0]).toString();
var codes = opt.options.codes.split(/\s+/).map(function (v) {
    return v && ('<script type="text/javascript" src="../../' + v + '"></script>');
});
var tests = opt.options.tests.split(/\s+/).map(function (v) {
    return v && ('<script type="text/javascript" src="../../' + v + '"></script>');
});

template = template.replace(/\{CODES\}/, codes.join(""));
template = template.replace(/\{TESTS\}/, tests.join(""));

process.stdout.write(template);
