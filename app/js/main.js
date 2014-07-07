/**
 * appOriginals app bootstrap.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

var requireConfig = {
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

    // register knockout bindings
    'bindings/dragging',
    'bindings/video',
    'bindings/plotting'
], function(ko, Router, App) {
	var isWeb = document.URL.match(/^https?:/);

    var app = new App(isWeb);

    var appElement = document.getElementById('#app');

	ko.applyBindings(app, appElement);
});
