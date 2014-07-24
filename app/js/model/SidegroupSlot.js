define([
    'knockout',
    'base',
    'model/type/SpecialItem'
], function (ko, Base, SpecialItemType) {

    var SidegroupSlot = Base.extend({

        constructor: function (values) {
            var self = this;

            self.type = ko.observable(SpecialItemType.SIDEGROUP_SLOT);
            self.position = values.position;
            self.index = values.index;
            self.sidegroup = ko.observable(null);

            self.hasSidegroup = ko.computed(function () {
                return !!self.sidegroup();
            });
        }
    });

    return SidegroupSlot;
});
