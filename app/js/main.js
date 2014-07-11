require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        jqueryui: '../bower_components/jquery-ui/jquery-ui',
        flot: '../bower_components/jquery-flot/jquery.flot',
        html5Loader: '../bower_components/jquery.html5loader/src/jquery.html5Loader',
        lodash: '../bower_components/lodash/dist/lodash.compat',
        knockout: '../bower_components/knockout/dist/knockout.debug',
        mapping: '../bower_components/knockout-mapping/knockout.mapping',
        jqueryuitouchpunch: '../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        screenfull: '../bower_components/screenfull/dist/screenfull',

        base: 'libs/Base'
    },
    shim: {
        'html5Loader': ['jquery'],
        'jqueryui': ['jquery'],
        'jqueryuitouchpunch': ['jqueryui'],
        'flot': ['jquery'],
        'screenfull': { exports: 'screenfull' },

        'base': { exports: 'Base' }
    }
});

require([
    'knockout',
    'fastclick',

    'controller/App',

    // self-registering jquery plugins
    'jqueryui',
    'jqueryuitouchpunch',
    'flot',
    'html5Loader',

    // self-registering knockout bindings and extensions
    'bindings/dragging',
    'bindings/video',
    'bindings/plotting',
    'bindings/routing',
    'extensions/extensions'
], function(ko, FastClick, App) {

    FastClick.attach(document.body);

    var isWeb = document.URL.match(/^https?:/);

    var app = new App(isWeb);

    var appElement = document.getElementById('#app');

    ko.applyBindings(app, appElement);
});
