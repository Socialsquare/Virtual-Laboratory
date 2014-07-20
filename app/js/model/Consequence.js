define([
    'knockout',
    'base',
], function (ko, Base) {
    var Consequence = Base.extend({
        constructor: function (type) {
            var self = this;

            self.type = ko.observable(type);
        }
    });

    return Consequence;
});
