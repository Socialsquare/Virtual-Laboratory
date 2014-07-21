define([
    'knockout',
    'model/Liquid',
    'model/ReactionCount',
    'model/type/Liquid',
    'model/type/ProteinCodingSequence'
], function (ko, LiquidModel, ReactionCount, LiquidType, PCSType) {

    var ProducedEnzyme = LiquidModel.extend({
        constructor: function (pcsType, parentGrowthAmount) {
//TODO: dna.name --> dna.PSCtype
            var self = this;

            self.pcsType = pcsType;
            self.amount = parentGrowthAmount;
            self.enzymeLiquidType = '';

            switch (pcsType) {  //TODO: change to OrganismProperty
                case PCSType.ANTIBODY_GOUT:
                    self.enzymeLiquidType = LiquidType.ANTIBODY_GOUT;
                    break;
                case PCSType.ANTIBODY_SMALLPOX:
                    self.enzymeLiquidType = LiquidType.ANTIBODY_SMALLPOX;
                    break;
                case PCSType.INSULIN_1:
                    self.enzymeLiquidType = LiquidType.INSULIN;
                    break;
                case PCSType.INSULIN_2:
                    self.enzymeLiquidType = LiquidType.INSULIN;
                    break;
                case PCSType.LIPASE_ENZYME: //TODO: Fix in database
                    self.enzymeLiquidType = LiquidType.LIPASE_ENZYME;
                    break;
                case PCSType.GFP:
                    self.enzymeLiquidType = LiquidType.GFP;
                    break;
                case PCSType.ANTIBIOTIC_RES_A:
                    self.enzymeLiquidType = LiquidType.ANTIBIOTIC;
                    break;
                case PCSType.ANTIBIOTIC_RES_B:
                    self.enzymeLiquidType = LiquidType.ANTIBIOTIC;
                    break;
                default:
                    throw 'Unknown type of enzyme: '+ pcsType;
                    break;
            }

            self.base(self.enzymeLiquidType, ReactionCount.NEVER);//TODO: change to OrganismProperty... hmm why?

            self.clone = function () {
                var clone = new ProducedEnzyme(self.pcsType, self.amount);

                clone.enzymeLiquidType = self.enzymeLiquidType;
                clone.hasReacted(self.hasReacted());

                return clone;
            };
        }
    });

    return ProducedEnzyme;
});
