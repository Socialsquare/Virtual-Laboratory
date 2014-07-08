define([
    'knockout',
    'model/Liquid',
    'model/LiquidType',
    'model/ReactionCount',
    'model/MicroorganismType'
], function(ko, LiquidModel, LiquidType, ReactionCount, MicroorganismType) {

    var Microorganism = LiquidModel.extend({
        constructor: function (microorganismType) {
            var self = this;
            self.base(LiquidType.MICROORGANISM, ReactionCount.NEVER);

            self.type = ko.observable(microorganismType);
            self.living = ko.observable(true);
		    self.name = ko.observable('');
		    self.extraGenes = ko.observable(null);
            self.extraProperties = ko.observable(null);
		    self.optimalpH = ko.observable(0);
		    self.maxpH = ko.observable(0);
		    self.minpH = ko.observable(0);
		    self.optimalTemp = ko.observable(0);
		    self.minTemp = ko.observable(0);
		    self.maxTemp = ko.observable(0);
		    self.logConcentration = ko.observable(0);
        }
    });

    return Microorganism;
});
