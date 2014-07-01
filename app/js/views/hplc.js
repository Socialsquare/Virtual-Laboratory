/**
 * Backbone view controller for the HPLC view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/hplc.html',
], function($, _, Backbone, Globals, HPLCViewTemplate) {
	var HPLCView = Backbone.View.extend({
		template: _.template(HPLCViewTemplate),
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
				title: 'HPLC'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
		},
		bindEvents: function() {
		},
		unbindEvents: function() {
		}
	});
	
	return HPLCView;
	
	/* !EVENT HANDLERS */
});