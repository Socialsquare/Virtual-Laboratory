require.config({

    deps: ['main'],
    baseUrl: '..',

    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        jqueryui: '../bower_components/jquery-ui/jquery-ui',
        flot: '../bower_components/jquery-flot/jquery.flot',
        html5Loader: '../bower_components/jquery.html5loader/src/jquery.html5Loader',
        lodash: '../bower_components/lodash/lodash',
        // NOTE: using non-debug knockout
        knockout: '../bower_components/knockout/dist/knockout',
        mapping: '../bower_components/knockout-mapping/knockout.mapping',
        'knockout.mapping': '../bower_components/knockout-mapping/knockout.mapping',
        'knockout.postbox': '../bower_components/knockout-postbox/build/knockout-postbox.min',
        jqueryuitouchpunch: '../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        screenfull: '../bower_components/screenfull/dist/screenfull',
        text: '../bower_components/requirejs-text/text',
        json: '../bower_components/requirejs-plugins/src/json',
        snapsvg: '../bower_components/snap.svg/dist/snap.svg',
        homescreen: '../bower_components/add-to-homescreen/src/addtohomescreen',
        signals: '../bower_components/js-signals/dist/signals',

        base: 'libs/Base',

        datadir: '../data',
        tmpldir: '../view'
    },
    shim: {
        'html5Loader': ['jquery'],
        'jqueryui': ['jquery'],
        'jqueryuitouchpunch': ['jqueryui'],
        'flot': ['jquery'],
        'knockout.postbox': ['knockout'],
        'screenfull': { exports: 'screenfull' },
        'base': { exports: 'Base' },
        'homescreen': { exports: 'addToHomescreen' }
    }
});
