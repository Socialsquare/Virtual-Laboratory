define([
    'knockout',
    'lodash',
    'base',

    'model/WashingTank',
    'model/TubeRack',

    'model/type/Liquid',

    'utils/utils'

], function(ko, _, Base, WashingTankModel, TubeRackModel, LiquidType, utils) {

    var Washing = Base.extend({

        constructor: function () {
            var self = this;

            self.washingTank = new WashingTankModel();

            self.action = function (concentration) {
                var liquids = self.washingTank.liquids();
                var result = 0;
                var feedback = '';

                // check if agents contain other stuff
                var indexOfOther = _.findIndex(liquids, function(liquid) {
                    return liquid.type() != LiquidType.LIPASE_ENZYME;
                });

                // if found other, bad result
                if (indexOfOther >= 0) {
                    result = 0.99;
                    feedback = 'washing.detergent_contaminated';

                } else {
                    var log = utils.math.getBaseLog(10, concentration);
                    if (log > 2) {
                        result = 0.01;
                    } else {
                        result = 1 - log / 2;
                    }
                }

                if (result === 0) result = 0.01;
                return { result: result, feedback: feedback };
            };

            self.tubeRack = new TubeRackModel();
        }
    });

    return Washing;
});
