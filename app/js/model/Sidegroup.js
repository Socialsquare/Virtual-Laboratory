define([
    'knockout',
    'base',
    'model/type/Liquid'
], function (ko, Base, LiquidType) {

    var Sidegroup = Base.extend({

        constructor: function (values) {
            var self = this;

            self.id = values.id;
            self.file = ko.computed(function () {
                return 'assets/svgs/sidegroup_' + self.id + '.svg';
            });
            self.type = ko.observable(LiquidType.SIDEGROUP); // TODO: this is a dirty because the accepter functions need a type
            self.index = ko.observable(values.index);
            self.origin = ko.observable(values.origin);
            self.molarWeight = ko.observable(values.molarWeight);
            // TODO: other field
        }
    });

    return Sidegroup;
});
