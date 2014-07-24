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
        text: '../bower_components/requirejs-text/text',
        json: '../bower_components/requirejs-plugins/src/json',
        snapsvg: '../bower_components/snap.svg/dist/snap.svg',
        homescreen: '../bower_components/add-to-homescreen/src/addtohomescreen',

        base: 'libs/Base',

        datadir: '../data'
    },
    shim: {
        'html5Loader': ['jquery'],
        'jqueryui': ['jquery'],
        'jqueryuitouchpunch': ['jqueryui'],
        'flot': ['jquery'],
        'screenfull': { exports: 'screenfull' },
        'base': { exports: 'Base' },
        'homescreen': { exports: 'addToHomescreen' }
    }
});

require([
    'knockout',
    'extensions/extensions',
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
    'bindings/localization',
    'bindings/svg',
    'bindings/common'

], function(ko, ext, FastClick, App) {

    FastClick.attach(document.body);

    // Confirm before navigating away
    // window.onbeforeunload = function (e) {
    //     e = e || window.event;
    //     var message = 'Spillet gemmes ikke hvis du navigerer væk';
    //     if (e) e.returnValue = message;
    //     return message;
    // };

    var isWeb = document.URL.match(/^https?:/);

    var app = new App(isWeb);

    var appElement = document.getElementById('#app');

    ko.applyBindings(app, appElement);
});
