define([
    'knockout',
    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/type/Antibiotic'
], function (ko, LiquidModel, LiquidType, ReactionCount, AntibioticType) {

    var Antibiotic = LiquidModel.extend({
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

    return Antibiotic;
});
