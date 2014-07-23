define([
    'knockout',
    'lodash',
    'base',

    'controller/Experiment',

    'utils/TextHelper'
], function (ko, _, Base, experimentController, TextHelper) {
    var Inventory = Base.extend({

        constructor: function () {
            var self = this;

            self.items = ko.observableArray([]);

            self.add = function(item) {
                // TODO: validate that an item can be placed here (via `accept`)


                // generate default label
                if (!item.acquired() && item.label) {
                    item.label(TextHelper.label(item));
                }

                if (!item.acquired()) {
                    experimentController.triggerAcquisition(item);
                }

                item.acquired(true);

                self.items.push(item);
            };

            self.hasItem = function(item) {
                return _.contains(self.items(), item);
            };

            self.remove = function (item) {
                self.items.remove(item);
            };

            self.reset = function () {
                self.items.removeAll();
            };
        }
    });

    return Inventory;
});
