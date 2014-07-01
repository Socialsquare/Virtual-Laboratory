/**
 * Backbone collection of lab tasks.
 * @author: Chris Hjorth, www.chrishjorth.com
 */
define([
	'underscore',
	'backbone',
	'globals',
	'models/dnaelement'],
function(_, Backbone, Globals, DNAElement) {
	var collection = Backbone.Collection.extend({
		url: Globals.API_URL + 'dna_elements',
		model: DNAElement
	});
	
	return collection;
});