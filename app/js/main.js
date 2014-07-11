/**
 * appOriginals app bootstrap.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

var requireConfig = {
	paths: {
		cordova: '../cordova',
		jquery: '../bower_components/jquery/dist/jquery',
		jqueryui: '../bower_components/jquery-ui/jquery-ui',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		knockout: '../bower_components/knockout/dist/knockout.debug',
		mapping: '../bower_components/knockout-mapping/knockout.mapping',
		base: 'libs/Base',

		flot: 'libs/jquery/jquery.flot.min'
	},
	shim: {
		'cordova': {
			exports: 'cordova'
		},

		'jquery': {
			exports: '$'
		},

		'jqueryui': {
			deps: ['jquery']
		},

		'base': {
			exports: 'Base'
		},

		'knockout': {
			deps: ['jquery'],
			exports: 'ko'
		},

		'flot': {
			deps: ['jquery'],
			exports: 'flot'
		}
	}
};

require.config(requireConfig);

require([
    'knockout',
	'controller/App',

    // self-registering jquery plugins
	'jqueryui',
	'flot',

    // register knockout bindings and extensions
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
