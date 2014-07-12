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
                // TODO: validate that an item can be placed here (via `accept`)
                self.items.push(item);
            };

            self.hasItem = function(item) {
                return _.contains(self.items(), item);
            };

            self.remove = function (item) {
                self.items.remove(item);
            };
        },

    });

    return Inventory;
});
