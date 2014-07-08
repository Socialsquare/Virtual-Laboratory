var path = require('path');
var fs = require('fs');
var glob = require("glob");
var _ = require("lodash");

var wrap = function(name, content) {
    return '<script type="text/html" id="' + name + '">' + content + '</script>';
};

glob("**/*.ko", function (er, files) {
    var tpls =_.reduce(files, function (acc, file) {
        return acc +  wrap(path.basename(file, '.ko'), fs.readFileSync(file, 'utf8'));
    }, '');

    var index = fs.readFileSync('index.html', 'utf8');

    process.stdout.write(index + tpls);
});
