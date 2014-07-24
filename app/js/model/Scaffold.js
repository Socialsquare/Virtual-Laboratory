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
            self.id = ko.observable(values.id);

            var slots = _.map(values.slots, function (sidegroupSlot) {
                return new SidegroupSlotModel(sidegroupSlot);
            });

            self.slots = ko.observableArray(slots);
            console.log(_.pluck(self.slots(), 'index'));
            self.file = ko.computed(function () {
                var sidegroups = _(self.slots())
                        .sort(function (slotA, slotB) {

                            return slotA.index > slotB.index;;
                        })
                        .map(function (slot) {
                            return slot.sidegroup() ? slot.sidegroup().id : 'R';
                        });

                return 'assets/svgs/scaffold_' + self.id() + '_' + sidegroups.join('_') + '.svg';
            });

            self.clone = function() {
                throw 'TODO: !';
            };
        }
    });

    return Scaffold;
});
