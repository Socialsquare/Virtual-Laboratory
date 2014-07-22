var path = require('path');

var process = function (grunt, cwd) {
    var tpls = '',
        wrap,
        files,
        index,
        model;

    wrap = function (name, content) {
        return '<script type="text/html" id="' + name + '">' +
            content/*.replace(/\s+/gi, ' ')*/ +
            '</script>';
    };

    files = grunt.file.expand(cwd + '/view/**/*.ko');

    files.forEach(function (file) {
        var name = path.basename(file, '.ko'),
            content = grunt.file.read(file);

        tpls += wrap(name, content);
    });

    index = grunt.file.read(cwd + '/index.html');
    model = {
        data: {
            tpls: tpls
        }
    };

    index = grunt.template.process(index, model);

    grunt.log.writeln('Processed ' + files.length.toString().cyan + ' templates');

    return index;
}

var middleware = function (grunt, path) {
    return function (req, res, next) {
        if (/^\/$/.test(req.originalUrl)) {
            res.end(process(grunt, path));
            return;
        }

        next();
    };
}

module.exports = {
    middleware: middleware,
    process: process
};
