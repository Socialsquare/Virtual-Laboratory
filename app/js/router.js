/**
 * Backbone router module for appOriginals.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
define([
	'jquery',
	'underscore',
	'backbone',
	'viewloader'
], function($, _, Backbone, ViewLoader) {
	var Router = Backbone.Router.extend({
		routes: {
			'': 'showWelcome',
			'welcome': 'showWelcome',
			'main': 'showMain',
			'worktable2': 'showWorktable2',
			'fermentor': 'showFermentor',
			'chromatograph-screen': 'showChromatographScreen',
			'hplc': 'showHPLC',
			'worktable1': 'showWorktable1',
			'hood': 'showHood',
			'chemical-closet': 'showChemicalcloset',
			'mouse': 'showMouse',
			'washingmachine': 'showWashingMachine',
			'computer': 'showComputer',
			'incubator': 'showIncubator',
			'uv': 'showUV',
			'spectrophotometer': 'showSpectrophotometer',
			'*action': 'defaultAction' //Default
		},
		
		back: function() {
			window.history.back();
		},
		
		showWelcome: function() {
			ViewLoader.changeView('welcome');
		},
		
		showMain: function() {
			ViewLoader.changeView('main');
		},
		
		showWorktable2: function() {
			ViewLoader.changeView('worktable2');
		},
		
		showFermentor: function() {
			ViewLoader.changeView('fermentor');
		},

		showChromatographScreen: function() {
			ViewLoader.changeView('chromatograph-screen');
		},
		
		showHPLC: function() {
			ViewLoader.changeView('hplc');
		},
		
		showWorktable1: function() {
			ViewLoader.changeView('worktable1');
		},
		
		showHood: function() {
			ViewLoader.changeView('hood');
		},
		
		showChemicalcloset: function() {
			ViewLoader.changeView('chemicalcloset');
		},
		
		showMouse: function() {
			ViewLoader.changeView('mouse');
		},
		
		showWashingMachine: function() {
			ViewLoader.changeView('washingmachine');
		},
		
		showComputer: function() {
			ViewLoader.changeView('computer');
		},
		
		showIncubator: function() {
			ViewLoader.changeView('incubator');
		},

		showUV: function() {
			ViewLoader.changeView('uv');
		},

		showSpectrophotometer: function() {
			ViewLoader.changeView('spectrophotometer');
		},
		
		defaultAction: function(actions) {
			console.log('Router: No route matched. Default action: ' + actions);
		}
	});
	
	var router = new Router();
	Backbone.history.start({silent: true});
	
	return router;
});