/**
 * Backbone collection of videos.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
define([
	'underscore',
	'backbone',
	'globals',
	'models/video'],
function(_, Backbone, Globals, Video) {
	var collection = Backbone.Collection.extend({
		url: Globals.API_URL + 'videos',
		model: Video
	});
	
	return collection;
});