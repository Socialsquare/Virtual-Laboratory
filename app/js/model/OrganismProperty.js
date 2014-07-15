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
            self.promoter = promoter;
            self.proteinCodingSequence = proteinCodingSequence;
        }
    });

    return OrganismProperty;
});

