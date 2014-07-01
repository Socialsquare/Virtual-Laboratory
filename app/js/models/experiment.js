/**
 * Backbone model that defines a lab task.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone',
	'globals',
	'collections/tasks'
], function(_, Backbone, Globals, Tasks) {
	var model = Backbone.Model.extend({
		urlRoot: Globals.API_URL + 'experiments', //This allows calling fetch on a single model, independent of the collection
		defaults: {
			id: null,
			title: '',
			description: '',
			tasks: null
		},
		parse: function(response) {
			var tasks = null;
			if(response.tasks && response.tasks !== null) {
				tasks = new Tasks();
				for(var i = 0; i < response.tasks.length; i++) {
					tasks.add(response.tasks[i]);
				}
			}

			var experiment = {
				id: response.id,
				title: response.title,
				description: response.description,
				tasks: tasks
			};
			return experiment;
		}
	});
	
	return model;
});