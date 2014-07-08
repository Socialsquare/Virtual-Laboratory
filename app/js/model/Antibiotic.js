define([
    'knockout',
    'model/Liquid',
    'model/LiquidType',
    'model/ReactionCount',
    'model/AntibioticType'
], function (ko, LiquidModel, LiquidType, ReactionCount, AntibioticType) {

    var AntibioticModel = LiquidModel.extend({
        constructor: function (antibioticType) {
            var self = this;
            self.base(LiquidType.ANTIBIOTIC, ReactionCount.ALWAYS);

            self.antibioticType = ko.observable(antibioticType);

            self.react = function (container) {
                // TODO: implement
                throw 'JegErHerIKKE... maaske';
            };
        }
    });

    return AntibioticModel;
});
