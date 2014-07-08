define([
    'knockout',
    'lodash',
    'base'
], function (ko, _, Base) {
    var Inventory = Base.extend({

        items: ko.observableArray([]),

        add: function(item) {
            this.items.push(item);
        },

        get: function(id) {
            id = parseInt(id, 10);
            return _.find(this.items(), function (item) {
                return item.uid() === id;
            });
        }
    });

    return Inventory;
});
