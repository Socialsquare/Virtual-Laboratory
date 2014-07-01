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
		backbone: 'libs/backbone.js/backbone-min',
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
	'jquery',
	'underscore',
	'backbone',
	'virtueltlaboratorium'
], function($, _, Backbone, app) {
	var isWeb = false;
	var browser = document.URL.match(/^https?:/);
	if(browser) {
		isWeb = true;
	}
	app.initialize(isWeb);
});