define([
    'knockout',
    'lodash',
    'base',
    'model/ReactionCount',
    'model/type/Liquid',
    'model/Liquid',
    'model/SidegroupSlot'
], function (ko, _, Base, ReactionCount, LiquidType, LiquidModel, SidegroupSlotModel) {

    var Scaffold = LiquidModel.extend({

        constructor: function (values) {
            var self = this;
            self.base(LiquidType.DESIGNED_DRUG, ReactionCount.NEVER);

            self.name = ko.observable(values.name);

            var slots = _.map(values.slots, function (sidegroupSlot) {
                return new SidegroupSlotModel(sidegroupSlot);
            });
            self.slots = ko.observableArray(slots);

            self.clone = function() {
                throw 'TODO: !';
            }
        }
    });

    return Scaffold;
});
