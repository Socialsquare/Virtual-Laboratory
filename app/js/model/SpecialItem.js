define([
    'knockout',
    'base'
], function (ko, Base) {

    var SpecialItem = Base.extend({

        constructor: function (type) {
            var self = this;
            self.type = ko.observable(type);
        }
    });

    return SpecialItem;
});
