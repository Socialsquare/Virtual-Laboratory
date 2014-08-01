define([
    'knockout',
    'lodash',
    'model/Microorganism',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/type/Microorganism',
], function(ko, _, MicroorganismModel, LiquidType, ReactionCount, MicroorganismType) {

    var Myeloma = MicroorganismModel.extend({
        constructor: function () {

            var self = this;
            self.base(MicroorganismType.MYELOMA);

            self.living(true);
            self.extraGenes([]);
            self.extraProperties([]);
            self.optimalPh(7.25); // http://en.wikipedia.org/wiki/Blood#Narrow_range_of_pH_values
            self.optimalTemp(37);
            self.concentration(Math.pow(10, 8));
        }
    });

    return Myeloma;
});

