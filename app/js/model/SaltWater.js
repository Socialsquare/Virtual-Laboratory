define([
    'knockout',

    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount',

    'utils/utils'

], function (ko, LiquidModel, LiquidType, ReactionCount, utils) {

    var SaltWater = LiquidModel.extend({

        constructor: function () {
            var self = this;
            self.base(LiquidType.SALT_WATER, ReactionCount.ONCE);

            self.react = function (container) {
                self._react(container, function (liquid) {
                    console.log('Total concentration before: ' + container.getTotalConcentration());

                    var clonedLiqs = _.invoke(container.liquids(), 'clone');
                    var modifiedLiqs = utils.biology.dilute(50, clonedLiqs);
                    container.liquids(modifiedLiqs);

                    console.log('Total concentration after: ' + container.getTotalConcentration());
                });
            };
        }
    });

    return SaltWater;
});
