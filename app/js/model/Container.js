/*
define([
    'knockout',
    'base',
	'lodash',
	'model/ContainerContent',
    'utils/utils'
], function(ko, Base, _, ContainerContent, utils) {

    var Container = Base.extend({

        constructor: function () {
            var self = this;

            self.content = ko.observable(vals.content || new ContainerContent());
            //Can be 'petridish', 'testtube', 'microtiterplate'
		    self.type = ko.observable(vals.type || '');
		    self.maxConcentration = ko.observable(vals.maxConcentration || 11);
		    self.maxBiomass = ko.observable(vals.maxBiomass || 10.1);
        }
    });

    return Container;
});
*/
