/**
 * Model that defines a container.
 * Containers are represented by petridishes, test tubes and microtiterplates.
 * @author: Chris Hjorth, www.chrishjorth.com
 */

define([
    'knockout',
    'base',
	'lodash',
	'model/ContainerContent',
    'utils/utils'
], function(ko, Base, _, ContainerContent, utils) {

    var Container = Base.extend({

        constructor: function (vals) {
            var self = this;

            if (typeof vals === 'undefined')
                vals = {};

            self.content = ko.observable(vals.content || null);
            //Can be 'petridish', 'testtube', 'microtiterplate'
		    self.type = ko.observable(vals.type || '');
		    self.maxConcentration = ko.observable(vals.maxConcentration || 11);
		    self.maxBiomass = ko.observable(vals.maxBiomass || 10.1);
        },

	    addContent: function (content) {
		    this.content.addContent(content);
	    },

	    getContent: function () {
		    return this.content;
	    },

	    isFull: function () {
		    return this.content.totalLogConcentration >= this.maxConcentration;
	    },

	    isEmpty: function () {
		    return (this.content === null || this.content.isEmpty());
	    },

	    hasContent: function () {
		    return (this.content.genes.length > 0 || (this.content.microorganisms.length > 0 && this.content.totalLogConcentration > 0) || this.content.other.length > 0);
	    },

	    hasPlaceFor: function (content) {
		    var contentTotalConcentration = 0;
		    for(i = 0; i < content.microorganisms.length; i++) {
			    contentTotalConcentration += content.microorganisms[i].logConcentration;
		    }
		    return (contentTotalConcentration + this.content.totalLogConcentration <= this.maxConcentration);
	    },

	    clone: function () {
		  return utils.klone(this);
	    },
    });

    return Container;
});
