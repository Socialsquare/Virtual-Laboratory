var allTestFiles = ['extensions/extensions', 'rebind'];
var TEST_REGEXP = /Spec\.js$/;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        var tfile = "../../" + pathToModule(file);
        console.log("adding test file: " + tfile);
        allTestFiles.push(tfile);
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    paths: {
        jquery: '../../bower_components/jquery/dist/jquery',
        jqueryui: '../../bower_components/jquery-ui/jquery-ui',
        flot: '../../bower_components/jquery-flot/jquery.flot',
        html5Loader: '../../bower_components/jquery.html5loader/src/jquery.html5Loader',
        is: '../bower_components/is_js/is',
        lodash: '../../bower_components/lodash/lodash',
        knockout: '../../bower_components/knockout/dist/knockout.debug',
        mapping: '../../bower_components/knockout-mapping/knockout.mapping',
        'knockout.mapping': '../../bower_components/knockout-mapping/knockout.mapping',
        postbox: '../../bower_components/knockout-postbox/build/knockout-postbox',
        'knockout.postbox': '../../bower_components/knockout-postbox/build/knockout-postbox',
        jqueryuitouchpunch: '../../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch',
        fastclick: '../../bower_components/fastclick/lib/fastclick',
        screenfull: '../../bower_components/screenfull/dist/screenfull',
        text: '../../bower_components/requirejs-text/text',
        json: '../../bower_components/requirejs-plugins/src/json',
        signals: '../../bower_components/js-signals/dist/signals',

        datadir: '../../data',
        testdatadir: '../../test-data'
    },
    shim: {
        'html5Loader': ['jquery'],
        'jqueryui': ['jquery'],
        'jqueryuitouchpunch': ['jquery', 'jqueryui'],
        'flot': ['jquery'],
        'knockout.postbox': ['knockout'],
        'screenfull': { exports: 'screenfull' },
        'homescreen': { exports: 'addToHomescreen' }
    },

    baseUrl: '/base/dist/js',

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
