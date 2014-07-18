define([
    'knockout',
    'model/Liquid',
    'model/ReactionCount',
    'model/type/Liquid'
], function (ko, LiquidModel, ReactionCount, LiquidType) {

    /*var Juice = LiquidModel.extend({

        constructor: function (antibioticType) {
            var self = this;
            self.base(LiquidType.JUICE, ReactionCount.ALWAYS);*/

    var ProducedEnzyme = LiquidModel.extend({
        constructor: function (dnaName, parentGrowthAmount) {

            var self = this;

            switch (dnaName) {  //TODO: change to OrganismProperty
                case 'TODO: ANTIBODY_GOUT':
                    self.enzymeType = LiquidType.ANTIBODY_GOUT;
                    break;
                case 'TODO: ANTIBODY_POX':
                    self.enzymeType = LiquidType.ANTIBODY_SMALLPOX;
                    break;
                case 'Insulin analog 1':
                    self.enzymeType = LiquidType.INSULIN;
                    break;
                case 'Insulin analog 2':
                    self.enzymeType = LiquidType.INSULIN;
                    break;
                case 'Lipase vaskeenzym': //TODO: Fix in database
                    self.enzymeType = LiquidType.LIPASE_ENZYME;
                    break;
                case 'Grønt flourescerende protein (GFP)':
                    self.enzymeType = LiquidType.GFP;
                    break;
                default:
                    throw 'Unknown type of enzyme';
                    break;
            }

            self.base(self.enzymeType, ReactionCount.NEVER);//TODO: change to OrganismProperty

            self.amount = parentGrowthAmount; //TODO: modify by a factor of X?
        }
    });

    return ProducedEnzyme;
});
