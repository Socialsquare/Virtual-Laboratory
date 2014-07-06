define([
	'knockout',
    'lodash',
    'base',
	'model/DNAElement'
], function(ko, _, Base, DNAElement) {

    var Gene = Base.extend({
        constructor: function (elements) {
            this.dnaElements = ko.observableArray(elements || []);
        },

		equals: function (other) {
            return _(this.dnaElements)
                .zip(other.dnaElements)
                .reduce(function (same, dnaPair) {
                    return same && dnaPair[0].equals(dnaPair[1]);
                }, true)
                .value();
	    },

		clone: function clone() {
		    var dnaElements = [],
			    cloned, i;
		    for(i = 0; i < this.dnaElements; i++) {
			    dnaElements.push(this.dnaElements[i].clone());
		    }
		    cloned = new Gene(dnaElements);
		    return cloned;
	    }
    });

	return Gene;
});
