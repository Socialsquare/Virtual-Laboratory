define([
    'knockout',
    'base'
], function (ko, Base) {

    var Sidegroup = Base.extend({

        constructor: function (values) {
            var self = this;

            self.name = ko.observable(values.name);
            self.index = ko.observable(values.index);
            self.origin = ko.observable(values.origin);
            self.molarWeight = ko.observable(values.molarWeight);
            // TODO: other field
        }
    });

    return Sidegroup;
});
