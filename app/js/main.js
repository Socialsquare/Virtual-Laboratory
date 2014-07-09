/**
 * appOriginals app bootstrap.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

var requireConfig = {
	paths: {
		cordova: '../cordova',
		jquery: '../bower_components/jquery/dist/jquery',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		knockout: '../bower_components/knockout/dist/knockout.debug',
		mapping: '../bower_components/knockout-mapping/knockout.mapping',
		base: 'libs/Base',

		chcdraggable: 'libs/jquery/jquery.chcdraggable',
		chcdraggablespawner: 'libs/jquery/jquery.chcdraggablespawner',
		chcdroppable: 'libs/jquery/jquery.chcdroppable',
		flot: 'libs/jquery/jquery.flot.min'
	},
	shim: {
		'cordova': {
			exports: 'cordova'
		},

		'jquery': {
			exports: '$'
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
	}
};

require.config(requireConfig);

require([
    'knockout',
    'Router',
	'controller/App',

    // self-registering jquery plugins
	'chcdraggable',
	'chcdraggablespawner',
	'chcdroppable',
	'flot',

    // register knockout bindings and extensions
    'bindings/dragging',
    'bindings/video',
    'bindings/plotting',
    'extensions/extensions'
], function(ko, Router, App) {
	var isWeb = document.URL.match(/^https?:/);

    var app = new App(isWeb);

    var appElement = document.getElementById('#app');

	ko.applyBindings(app, appElement);
});
