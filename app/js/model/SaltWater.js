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
            self.base(LiquidType.SALT_WATER, ReactionCount.ONCE, false);

            self.react = function (container) {

                var clonedLiqs = _.invoke(container.liquids(), 'clone');
                var modifiedLiqs = utils.biology.dilute(5, clonedLiqs);
                container.liquids(modifiedLiqs);

                self._react(container, function (liquid) {
                    //console.log('TODO: something.');
                });
            };
        }
    });

    return SaltWater;
});
