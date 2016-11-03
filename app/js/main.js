require.config({
    paths: {

        jquery: '../bower_components/jquery/dist/jquery',
        jqueryui: '../bower_components/jquery-ui/jquery-ui',
        flot: '../bower_components/jquery-flot/jquery.flot',
        html5Loader: '../bower_components/jquery.html5loader/src/jquery.html5Loader',
        lodash: '../bower_components/lodash/lodash',
        knockout: '../bower_components/knockout/dist/knockout.debug',
        mapping: '../bower_components/knockout-mapping/knockout.mapping',
        'knockout.mapping': '../bower_components/knockout-mapping/knockout.mapping',
        postbox: '../bower_components/knockout-postbox/build/knockout-postbox',
        'knockout.postbox': '../bower_components/knockout-postbox/build/knockout-postbox',
        jqueryuitouchpunch: '../bower_components/jquery.ui.touch-punch.dk/jquery.ui.touch-punch.dk',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        screenfull: '../bower_components/screenfull/dist/screenfull',
        text: '../bower_components/requirejs-text/text',
        json: '../bower_components/requirejs-plugins/src/json',
        snapsvg: '../bower_components/snap.svg/dist/snap.svg',
        homescreen: '../bower_components/add-to-homescreen/src/addtohomescreen',
        signals: '../bower_components/js-signals/dist/signals',

        datadir: '../data',
        tmpldir: '../view'
    },
    shim: {
        'html5Loader': ['jquery'],
        'flot': ['jquery'],
        'knockout.postbox': ['knockout'],
        'screenfull': { exports: 'screenfull' },
        'homescreen': { exports: 'addToHomescreen' }
    }
});

require([
    'knockout',
    'knockout.postbox',
    'extensions/extensions',
    'fastclick',

    'rebind',
    'controller/App',
    // self-registering jquery plugins
    'jquery',
    'jqueryui',
    'jqueryuitouchpunch',
    'flot',
    'html5Loader',

    // global modules
    'screenfull',

    // self-registering knockout bindings and extensions
    'bindings/dragging',
    'bindings/video',
    'bindings/plotting',
    'bindings/routing',
    'bindings/localization',
    'bindings/svg',
    'bindings/common'

], function(ko, postbox, ext, FastClick, rebind, App) {

    FastClick.attach(document.body);

    var isWeb = document.URL.match(/^https?:/);

    var app = new App(isWeb);

    var appElement = document.getElementById('#app');

    ko.applyBindings(app, appElement);

});
