var fs = require("fs");
var getopt = require("node-getopt").create([
    ["r", "root=ROOT", "root directory"],
    ["h", "help", "display this help"]
]).setHelp(
    "Usage: node next-project.js -r ROOT_PATH MODULE_PATH" +
    "\n" +
    "[[OPTIONS]]\n"
).bindHelp();

var opt = getopt.parseSystem();

var root = opt.options.root || process.cwd();

var list = function (path) {
    
};
