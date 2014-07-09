define([
	'knockout',
    'lodash',
    'base',
	'model/DNAElement'
], function(ko, _, Base, DNAElementModel) {

    var Gene = Base.extend({
        constructor: function (elements) {
            this.dnaElements = ko.observableArray(elements || []);
        }
    });

	return Gene;
});
