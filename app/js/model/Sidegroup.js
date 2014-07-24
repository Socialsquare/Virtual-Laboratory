define([
    'knockout',
    'base',
    'model/type/SpecialItem'
], function (ko, Base, SpecialItemType) {

    var Sidegroup = Base.extend({

        constructor: function (values) {
            var self = this;

            self.type = ko.observable(SpecialItemType.SIDEGROUP);

            self.id = values.id;
            self.info = values.info;
            self.index = ko.observable(values.index);
            self.origin = ko.observable(values.origin);
            self.molarWeight = ko.observable(values.molarWeight);

            self.file = ko.computed(function () {
                return 'assets/svgs/sidegroup_' + self.id + '.svg';
            });
            // TODO: other field
        }
    });

    return Sidegroup;
});
