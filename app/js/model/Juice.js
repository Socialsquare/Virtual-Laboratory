define([
    'knockout',
    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount'
], function (ko, LiquidModel, LiquidType, ReactionCount) {

    var Juice = LiquidModel.extend({

        constructor: function () {
            var self = this;
            self.base(LiquidType.JUICE, ReactionCount.ALWAYS);

            self.react = function (container) {
                // TODO: implement
                throw 'JegErHerIKKE... maaske';
            };

            self.clone = function () {
                var clone = new Juice();

                clone.hasReacted(self.hasReacted());

                return clone;
            };
        }
    });

    return Juice;
});
