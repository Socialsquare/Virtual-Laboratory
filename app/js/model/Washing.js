define([
    'knockout',
    'lodash',
    'base',

    'model/WashingTank',
    'model/TubeRack',

    'model/type/Liquid',

    'utils/utils',
    'model/type/Location'

], function(ko, _, Base, WashingTankModel, TubeRackModel, LiquidType, utils, LocationType) {

    var Washing = Base.extend({

        constructor: function () {
            var self = this;

            self.washingTank = new WashingTankModel();
            self.tubeRack = new TubeRackModel();
            self.tubeRack.location(LocationType.WASHING);

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

        }
    });

    return Washing;
});
