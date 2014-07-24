define([
    'knockout',
    'base',
    'model/type/SpecialItem'
], function (ko, Base, SpecialItemType) {

    var Sidegroup = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = values.id;
            self.file = ko.computed(function () {
                return 'assets/svgs/sidegroup_' + self.id + '.svg';
            });
            self.type = ko.observable(SpecialItemType.SIDEGROUP);
            self.index = ko.observable(values.index);
            self.origin = ko.observable(values.origin);
            self.molarWeight = ko.observable(values.molarWeight);
            // TODO: other field
        }
    });

    return Sidegroup;
});
