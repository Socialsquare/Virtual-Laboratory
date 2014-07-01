/**
 * Backbone view controller for a general popup view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/popup-ok.html'
], function($, _, Backbone, Globals, popupViewTemplate) {
	var popupView = Backbone.View.extend({
		el: $('#popup-container'),
		template: _.template(popupViewTemplate),
		title: 'TITLE',
		text: 'TESTING',
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
			var variables = {
				title: this.title,
				text: this.text
			}
			this.$el.html(this.template(variables));
		},
		bindEvents: function() {
			$('body').on('click', '#popup-ok-btn', this, handleOK);
		},
		unbindEvents: function() {
			$('body').off('click', '#popup-ok-btn', handleOK);
		},
		show: function(title, text) {
			this.title = title;
			this.text = text;
			this.render();
			$('#popup-container').show();
		},
		dismiss: function() {
			$('#popup-container').hide();
		}
	});
	
	return popupView;
	
	/* !EVENT HANDLERS */
	function handleOK(event) {
		event.data.dismiss();
	}
});