define([
    'knockout',
    'lodash',
    'base'
], function (ko, _, Base) {
    var Inventory = Base.extend({

        items: ko.observableArray([]),

        add: function(item) {
            // TODO: validate that an item can be placed here
            this.items.push(item);
        },

        remove: function (item) {
            this.items.remove(item);
        }
    });

    return Inventory;
});
