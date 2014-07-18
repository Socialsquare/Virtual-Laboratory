define([
    'knockout',
    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
], function(ko, LiquidModel, LiquidType, ReactionCount) {

    var OrganismProperty = LiquidModel.extend({
        constructor: function (promoter, proteinCodingSequence) {
            var self = this;
            self.base(LiquidType.ORGANISM_PROPERTY, ReactionCount.NEVER);
            self.promoter = promoter; // is a DNAelement
            self.proteinCodingSequence = proteinCodingSequence; //is a DNAelement

            self.hashCode = function () {
                return self._hashCode() + ':' + self.promoter.hashCode() + ':' + self.proteinCodingSequence.hashCode();
            };

        }
    });

    return OrganismProperty;
});
