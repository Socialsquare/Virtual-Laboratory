require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        jqueryui: '../bower_components/jquery-ui/jquery-ui',
        flot: '../bower_components/jquery-flot/jquery.flot',
        lodash: '../bower_components/lodash/dist/lodash.compat',
        knockout: '../bower_components/knockout/dist/knockout.debug',
        mapping: '../bower_components/knockout-mapping/knockout.mapping',
        jqueryuitouchpunch: '../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch',

        base: 'libs/Base'
    },
    shim: {
        'jqueryui': ['jquery'],
        'jqueryuitouchpunch': ['jqueryui'],
        'flot': ['jquery'],

        'base': { exports: 'Base' }
    }
});

require([
    'knockout',
    'controller/App',

    // self-registering jquery plugins
    'jqueryui',
    'jqueryuitouchpunch',
    'flot',

    // self-registering knockout bindings and extensions
    'bindings/dragging',
    'bindings/video',
    'bindings/plotting',
    'bindings/routing',
    'extensions/extensions'
], function(ko, App) {
    var isWeb = document.URL.match(/^https?:/);

    var app = new App(isWeb);

    var appElement = document.getElementById('#app');

    ko.applyBindings(app, appElement);
});
