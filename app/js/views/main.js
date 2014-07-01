/**
 * Backbone view controller for the main lab view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/main.html',
	'views/popup-door',
], function($, _, Backbone, Globals, mainViewTemplate, popupDoorView) {
	var mainView = Backbone.View.extend({
		template: _.template(mainViewTemplate),
		popupDoor: new popupDoorView(),
		initialize: function(options) {
			this.viewID = options.viewID;
		},
		close: function() {
			this.unbindEvents();
			this.$el.html('');
		},
		updateSubviewElements: function() {
		},
		render: function() {
			this.renderTemplate();
			this.bindEvents();
			return this;
		},
		renderTemplate: function() {
			var variables = {
				title: "Virtuelt Laboratorium"
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(false);
		},
		bindEvents: function() {
			$('body').on('click', '#overview-door-link', this, handleDoor);
		},
		unbindEvents: function() {
			$('body').off('click', '#overview-door-link', this, handleDoor);
		},
		viewDidLoad: function() {
			if(Globals.mail) {
				mailAnimation();
			}
		}
	});
	
	return mainView;

	function mailAnimation() {
		$viewCover = $('.view-cover');
		
		$viewCover.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(event) {
			$viewCover.removeClass('nightmode');
			var $letter = $('#letter');
			$letter.removeClass('hidden');
			$letter.addClass('foreground-transition');
			$letter.addClass('foreground');
			Globals.mail = false;
		});
		
		$viewCover.addClass('nightmode');
	}

	function handleDoor(event) {
		event.data.popupDoor.show();
	}
	
});
