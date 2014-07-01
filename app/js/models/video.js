/**
 * Backbone model that defines a video.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone'],
function(_, Backbone) {
	var model = Backbone.Model.extend({
		defaults: {
			id: null,
			name: '',
			file: ''
		}
	});
	
	return model;
});