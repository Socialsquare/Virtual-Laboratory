define([
    'knockout',
    'lodash',
    'base'
], function (ko, _, Base) {
    var Inventory = Base.extend({

        items: ko.observableArray([]),

        constructor: function () {
            var self = this;

            self.add = function(item) {
                // TODO: validate that an item can be placed here
                self.items.push(item);
            };

            self.remove = function (item) {
                self.items.remove(item);
            };
        },

    });

    return Inventory;
});
