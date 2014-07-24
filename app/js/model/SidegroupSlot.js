define([
    'knockout',
    'base'
], function (ko, Base) {

    var SidegroupSlot = Base.extend({

        constructor: function (values) {
            var self = this;

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
