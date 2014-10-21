define([
    'knockout',
    'lodash',

    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
    'model/type/Antibiotic',
    'model/type/ProteinCodingSequence'
], function (ko, _, LiquidModel, LiquidType, ReactionCount, AntibioticType, PCSType) {

    var Antibiotic = LiquidModel.extend({
        constructor: function (antibioticType) {
            var self = this;
            self.base(LiquidType.ANTIBIOTIC, ReactionCount.ALWAYS, false);

            self.antibioticType = ko.observable(antibioticType);
            self.subtype = self.antibioticType;

//This kills microorganisms without resistance
            self.react = function (container) {

                _.each(container.liquids(), function(organism){
                    if (organism.type() !== LiquidType.MICROORGANISM)
                        return;

                    var resistance =_.any(organism.extraProperties(), function(extraProperty){

                        switch(self.antibioticType()){
                            case AntibioticType.A:
                                return extraProperty.proteinCodingSequenceType() === PCSType.ANTIBIOTIC_RES_A;
                            case AntibioticType.B:
                                return extraProperty.proteinCodingSequenceType() === PCSType.ANTIBIOTIC_RES_B;
                            default:
                                throw 'Unknown antibioticType: ' + self.antibioticType();
                        }
                    });

                    if(!resistance) {
                        organism.living(false);
                    }
                });
            };

            self.hashCode = function () {
                return self._hashCode() + ":" + self.antibioticType();
            };

            self.clone = function () {
                var clone = new Antibiotic(self.antibioticType());

                clone.hasReacted(self.hasReacted());

                return clone;
            };
        }
    });

    return Antibiotic;
});
