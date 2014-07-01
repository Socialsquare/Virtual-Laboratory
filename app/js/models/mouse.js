/**
 * Backbone model that defines a lab mouse.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
 
define([
	'underscore',
	'backbone'],
function(_, Backbone) {
	var HEALTHY = 1;
	var DIABETES = 2;
	var DEAD = 3;
	var model = Backbone.Model.extend({
		defaults: {
			id: null,
			type: null,
			alive: true,
			cut: false,
			spleen: true
		}
	});
	
	return model;
});