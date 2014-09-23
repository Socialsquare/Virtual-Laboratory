define([
    'knockout',
    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',
], function(ko, LiquidModel, LiquidType, ReactionCount) {

    var OrganismProperty = LiquidModel.extend({
        constructor: function (promoter, proteinCodingSequence) {
            var self = this;
            self.base(LiquidType.ORGANISM_PROPERTY, ReactionCount.NEVER, false);
            self.promoter = ko.observable(promoter); // is a DNAelement
            self.proteinCodingSequenceType = ko.observable(proteinCodingSequence.proteinCodingSequence()); //Is of PCSType
            self.proteinCodingSequence = ko.observable(proteinCodingSequence); //is a DNAelement

            self.hashCode = function () {
                return self._hashCode() + ':' + self.promoter().hashCode() + ':' + self.proteinCodingSequence().hashCode();
            };


            self.clone = function () {
                var clone = new OrganismProperty(self.promoter(), self.proteinCodingSequence());

                clone.hasReacted(self.hasReacted());

                return clone;
            };

        }
    });

    return OrganismProperty;
});
