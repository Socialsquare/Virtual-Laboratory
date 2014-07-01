/**
 * Backbone view controller for the spectrophotometer view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/spectrophotometer.html'
], function($, _, Backbone, Globals, SpectrophotometerViewTemplate) {
	var view = Backbone.View.extend({
		template: _.template(SpectrophotometerViewTemplate),
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
				title: 'SpectrophotometerViewTemplate'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
		},
		bindEvents: function() {
		},
		unbindEvents: function() {
		}
	});
	
	return view;
	
	/* !EVENT HANDLERS */
});