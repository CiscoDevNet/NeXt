var fs = require("fs");
var path = require("path");
var less = require("less");
var getopt = require("node-getopt").create([
    ["h", "help", "display this help"]
]).setHelp(
    "Usage: node next-less.js source.less\n" +
    "\n" +
    "[[OPTIONS]]\n"
).bindHelp();

var opt = getopt.parseSystem();
var source = opt.argv[0].toString();

less.render(fs.readFileSync(source).toString(), {
    filename: path.resolve(source)
}, function (e, output) {
    console.log(output.css);
});
