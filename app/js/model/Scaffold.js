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

            self.name = values.name;
            self.id = values.id;
            self.offset = values.offset;
            self.drugInfo = {};

            var slots = _.map(values.slots, function (sidegroupSlot) {
                return new SidegroupSlotModel(sidegroupSlot);
            });

            self.slots = ko.observableArray(slots);

            self.configurationString = ko.computed(function () {
                var sidegroups = _(self.slots())
                        .sort(function (slotA, slotB) {

                            return slotA.index > slotB.index;
                        })
                        .map(function (slot) {
                            return slot.sidegroup() ? slot.sidegroup().id : 'R';
                        });

                return self.id + '_' + sidegroups.join('_');
            });

            self.file = ko.computed(function () {
                return 'assets/svgs/scaffold_' + self.configurationString() + '.svg';
            });

            self.clone = function() {
                throw 'TODO: !';
            };
        }
    });

    return Scaffold;
});
