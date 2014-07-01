/**
 * Backbone view controller for the washing machine view.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'jquery',
	'underscore',
	'backbone',
	'globals',
	'text!../../templates/washingmachine.html'
], function($, _, Backbone, Globals, washingMachineViewTemplate) {
	var washingMachineView = Backbone.View.extend({
		template: _.template(washingMachineViewTemplate),
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
				title: 'Vaskemaskinen'
			};
			this.$el.html(this.template(variables));

			Globals.topMenuView.toggleBackLink(true);
		},
		bindEvents: function() {
		},
		unbindEvents: function() {
		}
	});
	
	return washingMachineView;
	
	/* !EVENT HANDLERS */
});