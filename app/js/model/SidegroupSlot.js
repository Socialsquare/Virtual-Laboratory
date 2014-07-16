define([
    'knockout',
    'base'
], function (ko, Base) {

    var SidegroupSlot = Base.extend({

        constructor: function (values) {
            var self = this;

            self.rotation = ko.observable(values.rotation);
            self.position = ko.observable(values.position);
            self.sidegroup = ko.observable(null);

            self.hasSidegroup = ko.computed(function () {
                return !!self.sidegroup();
            });
        }
    });

    return SidegroupSlot;
});
