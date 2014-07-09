var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});



// require({

//     // Determine the baseUrl if we are in Karma or not.
//     baseUrl: window.__karma__ ? 'base/http-pub/app' : '../../app'
// }, ['config'], function() {
//     // Load all specs.
//     require(specs, function() {

//         if (window.__karma__) {
//             // This will start Karma if it exists.
//             window.__karma__.start();
//         } else {
//             // Set up the jasmine reporters once each spec has been loaded.
//             jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
//             jasmine.getEnv().execute();
//         }

//     });
// });




require.config({
    // Karma serves files under /base, which is the basePath from your config file

    paths: {
		cordova: '../cordova',
		text: 'libs/requirejs/text',
		jquery: 'libs/jquery/jquery-2.0.3.min',
		underscore: 'libs/underscore.js/underscore-min',
		lodash: 'libs/lodash.compat',
		knockout: 'libs/knockout.js/knockout-3.1.0',
		mapping: 'libs/knockout.mapping',
		base: 'libs/Base',

		chcdraggable: 'libs/jquery/plugins/jquery.chcdraggable',
		chcdraggablespawner: 'libs/jquery/plugins/jquery.chcdraggablespawner',
		chcdroppable: 'libs/jquery/plugins/jquery.chcdroppable',
		flot: 'libs/jquery/plugins/jquery.flot.min'
	},
	shim: {
		'cordova': {
			exports: 'cordova'
		},
		'jquery': {
			exports: '$'
		},
		'underscore': {
			deps: ['jquery'],
			exports: '_',
			init: function() {
				//Tell Underscore template engine to use {{...}} for inserting values
				this._.templateSettings = {
					interpolate: /\{\{(.+?)\}\}/g
				};
				return _;
			}
		},
		'backbone': {
			deps: ['underscore'],
			exports: 'Backbone'
		},

		'base': {
			exports: 'Base'
		},

		'knockout': {
			deps: ['jquery'],
			exports: 'ko'
		},

		'chcdraggable': {
			deps: ['jquery'],
			exports: 'chcdraggable'
		},
		'chcdraggablespawner': {
			deps: ['jquery', 'chcdraggable'],
			exports: 'chcdraggablespawner'
		},
		'chcdroppable': {
			deps: ['jquery'],
			exports: 'chcdroppable'
		},
		'flot': {
			deps: ['jquery'],
			exports: 'flot'
		}
	},

    baseUrl: '/base',
    //baseUrl: '/home/simon/dev/vlab/app/js',

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
