/**
 * Backbone view controller for the hood view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/hood.html',
], function($, _, Backbone, Globals, hoodViewTemplate) {
	var hoodView = Backbone.View.extend({
		template: _.template(hoodViewTemplate),
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
				title: 'Stinkskabet'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
		},
		bindEvents: function() {
		},
		unbindEvents: function() {
		}
	});
	
	return hoodView;
	
	/* !EVENT HANDLERS */
});