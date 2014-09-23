define([
    'knockout',

    'model/Liquid',
    'model/type/Liquid',
    'model/type/Container',
    'model/ReactionCount'
], function (ko, LiquidModel, LiquidType, ContainerType, ReactionCount) {

    var FlourescentSecondaryAntibody = LiquidModel.extend({
        constructor: function () {
            var self = this;
            self.base(LiquidType.FLUORESCENT_2ND_ANTIBODY, ReactionCount.ALWAYS, true);

            self.react = function (container) {
                if (container.type() === ContainerType.MICROTITER) {
                    container.microtiterWells().addFluorescentSecondaryAntibodies();
                }
            };

            self.clone = function () {
                var clone = new FlourescentSecondaryAntibody();

                clone.hasReacted(self.hasReacted());

                return clone;
            };
        }
    });

    return FlourescentSecondaryAntibody;
});
