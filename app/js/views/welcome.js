/**
 * Backbone view controller for the welcome view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'text!../../templates/welcome.html'
], function($, _, Backbone, welcomeViewTemplate) {
	var welcomeView = Backbone.View.extend({
		el: $('#view-container'),
		template: _.template(welcomeViewTemplate),
		initialize: function(options) {
			this.viewID = options.viewID;
			location.href = '#main';
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
			var variables = {
				title: "Welcome"
			};
			this.$el.html(this.template(variables));
		},
		bindEvents: function() {
		},
		unbindEvents: function() {
		}
	});
	
	return welcomeView;
});