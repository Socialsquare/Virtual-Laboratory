var allTestFiles = ['extensions/extensions'];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push('../../' + pathToModule(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    paths: {
        jquery: '../../bower_components/jquery/dist/jquery',
        jqueryui: '../../bower_components/jquery-ui/jquery-ui',
        flot: '../../bower_components/jquery-flot/jquery.flot',
        html5Loader: '../../bower_components/jquery.html5loader/src/jquery.html5Loader',
        lodash: '../../bower_components/lodash/dist/lodash.compat',
        knockout: '../../bower_components/knockout/dist/knockout.debug',
        mapping: '../../bower_components/knockout-mapping/knockout.mapping',
        jqueryuitouchpunch: '../../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch',
        fastclick: '../../bower_components/fastclick/lib/fastclick',
        screenfull: '../../bower_components/screenfull/dist/screenfull',
        text: '../../bower_components/requirejs-text/text',
        json: '../../bower_components/requirejs-plugins/src/json',

        base: 'libs/Base',

        datadir: '../../data',
        testdatadir: '../../test-data'
    },
    shim: {
        'html5Loader': ['jquery'],
        'jqueryui': ['jquery'],
        'jqueryuitouchpunch': ['jqueryui'],
        'flot': ['jquery'],
        'screenfull': { exports: 'screenfull' },
        'base': { exports: 'Base' }
    },

    baseUrl: '/base/dist/js',

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
