define([
    'knockout',
    'lodash',
    'base',

    'controller/Experiment',

    'utils/TextHelper',
    'model/type/Location'
], function (ko, _, Base, experimentController, TextHelper, LocationType) {
    var Inventory = Base.extend({

        constructor: function () {
            var self = this;

            self.items = ko.observableArray([]);

            self.add = function(item, alternativeLabel) {

                // generate default label
                if (!item.acquired() && item.label) {
                    if (alternativeLabel) {
                        item.label(alternativeLabel);
                    }else {
                        item.label(TextHelper.label(item));
                    }
                }

                if (!item.acquired()) {
                    experimentController.triggerAcquisition(item);
                }

                item.acquired(true);

                if(item.hasOwnProperty('location')) {
                    item.location(LocationType.INVENTORY);
                }

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
