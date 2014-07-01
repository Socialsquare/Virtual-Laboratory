/**
 * Backbone view controller for a popup that shows where to go from the door.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/popup-door.html'
], function($, _, Backbone, Globals, popupDoorViewTemplate) {
	var popupView = Backbone.View.extend({
		el: $('#popup-container'),
		template: _.template(popupDoorViewTemplate),
		initialize: function() {
			
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
			var variables = {};
			this.$el.html(this.template(variables));
		},
		bindEvents: function() {
			$('body').on('click', '.popup-cancel-btn', this, handleClose);
			$('body').on('click', '.popup-door a', this, handleLink);
		},
		unbindEvents: function() {
			$('body').off('click', '.popup-cancel-btn', handleClose);
			$('body').off('click', '.popup-door a', handleLink);
		},
		show: function() {
			this.render();
			$('#popup-container').show();
		},
		dismiss: function() {
			$('#popup-container').hide();
			this.unbindEvents();
		}
	});
	
	return popupView;
	
	/* !EVENT HANDLERS */
	function handleClose(event) {
		event.preventDefault();
		event.data.dismiss();
	}

	function handleLink(event) {
		event.data.dismiss();
	}
});