var glob = require('glob'),
    _ = require('lodash'),
    path = require("path"),
    fs = require("fs");

function makeVideoEntry(name, size) {
    return {
        type: "VIDEO",
        sources: { webm: { source: name, size: size } }
    };
}
function makeImageEntry(name, size) {
    return {
        type: "IMAGE",
        source: name,
        size: size
    };
}

function size(file) {
    return fs.statSync(file)['size'];
}

module.exports = {
    generate: function (root, assetsDir, callback) {
        var assetsConfig = { files: [] };
        var distPath = '';

        _.each(glob.sync(root + '/' + assetsDir + '/**/*.webm'), function (file) {
            distPath = path.relative(root, file).replace('app/','');
            assetsConfig.files.push(makeVideoEntry(distPath, size(file)));
        });

        _.each(glob.sync(root + '/' + assetsDir + '/**/*.png'), function (file) {
            distPath = path.relative(root, file).replace('app/','');
            assetsConfig.files.push(makeImageEntry(distPath, size(file)));
        });

        return assetsConfig;
    }
};
