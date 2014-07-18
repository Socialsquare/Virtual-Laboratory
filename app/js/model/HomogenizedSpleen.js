define([
    'knockout',

    'model/Liquid',
    'model/type/Liquid',
    'model/ReactionCount'
], function (ko, LiquidModel, LiquidType, ReactionCount) {

    var HomogenizedSpleen = LiquidModel.extend({
        constructor: function () {
            var self = this;
            self.base(LiquidType.HOMO_SPLEEN, ReactionCount.NEVER);

            self.antibodiesFor = ko.observableArray([]);

            self.react = function (container) {
                // TODO: implement
                throw 'JegErHerIKKE... maaske';
            };

            self.hashCode = function () {
                return self._hashCode() + ":" + self.antibodiesFor().join(',');
            };
        }
    });

    return HomogenizedSpleen;
});
