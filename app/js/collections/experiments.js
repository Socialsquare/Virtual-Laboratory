/**
 * Backbone collection of lab experiments.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
define([
	'underscore',
	'backbone',
	'globals',
	'models/experiment'],
function(_, Backbone, Globals, Experiment) {
	var collection = Backbone.Collection.extend({
		url: Globals.API_URL + 'experiments',
		model: Experiment
	});
	
	return collection;
});