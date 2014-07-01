/**
 * Backbone view controller for the top menu view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/top-menu.html',
	'views/popup-selectexperiment',
], function($, _, Backbone, Globals, topMenuViewTemplate, popupSelectExperimentView) {
	var menuView = Backbone.View.extend({
		el: '#top-menu',
		template: _.template(topMenuViewTemplate),
		popupSelectExperiment: new popupSelectExperimentView(),
		fullscreen: false,
		initialize: function(options) {
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
		},
		render: function() {
			this.renderTemplate();
			this.bindEvents();
			return this;
		},
		renderTemplate: function() {
			this.$el.html(this.template());
		},
		bindEvents: function() {
			$('body').on('click', '#view-back-link', goBackToMain);
			$('body').on('click', '#menu-newexperiment-link', this, showSelectExperiment);
			$('body').on('click', '#menu-fullscreen-link', this, goFullscreen);
		},
		unbindEvents: function() {
			$('body').off('click', '#view-back-link', goBackToMain);
			$('body').off('click', '#menu-newexperiment-link', showSelectExperiment);
			$('body').off('click', '#menu-fullscreen-link', goFullscreen);
		},
		toggleBackLink: function(show) {
			var backLink = $('#view-back-link');
			if(show === true) {
				backLink.removeClass('hidden');
			}
			else {
				if(!backLink.hasClass('hidden')) {
					backLink.addClass('hidden');
				}
			}
		}
	});
	
	return menuView;
	
	/* !EVENT HANDLERS */
	
	function showSelectExperiment(event) {
		event.preventDefault();
		event.data.popupSelectExperiment.show();
	}
	
	function goFullscreen(event) {
		event.preventDefault();
				
		//As per http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API
		//var el = document.getElementById('view-container');
		var el = document.getElementsByTagName('body')[0];
		if(menuView.fullscreen) {
			menuView.fullscreen = false;
			document.webkitExitFullscreen();
			document.mozCancelFullscreen();
			document.exitFullscreen();
		}
		else {
			menuView.fullscreen = true;
			el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			el.mozRequestFullScreen();
			el.requestFullscreen(); // Opera
		}
	}

	function goBackToMain(event) {
		event.preventDefault();
		Globals.router.back();
	}
});