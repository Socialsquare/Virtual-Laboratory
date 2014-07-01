/**
 * Backbone model that defines a DNA element.
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
			color: '',
			sequence: '',
			description: '',
			link: '',
			comment: '',
			type: 0 //0=Promoter, 1=Ribosome Binding Site, 2=Start Codon, 3=Proteinkodende Sekvens, 4=Stop Codon, 5=Terminator
		},
		parse: function(response) {
			response.type = parseInt(response.type, 10);
			return response;
		},
		equals: function(DNAElement) {
			return (this.attributes.type === DNAElement.attributes.type && this.attributes.sequence === DNAElement.attributes.sequence);
		}
	});
	
	return model;
});