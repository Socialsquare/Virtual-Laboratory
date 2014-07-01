/**
 * Backbone collection of lab tasks.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
define([
	'underscore',
	'backbone',
	'globals',
	'models/task'],
function(_, Backbone, Globals, Task) {
	var collection = Backbone.Collection.extend({
		model: Task
	});
	
	return collection;
});