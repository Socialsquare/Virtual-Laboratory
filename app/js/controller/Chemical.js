define([
    'knockout',
    'mapping',
    'jquery',
    'lodash',

    'controller/Base',

    'model/GameState',
    'model/InventoryItem',

    'service/Chemical',

    'utils/utils'
], function (ko, mapping, $, _, BaseController, gameState, InventoryItem, ChemicalService, utils) {
    var Chemical = BaseController.extend({

        closetItems: ko.observableArray([]),
        drawerItems: ko.observableArray([]),
        fridgeItems: ko.observableArray([]),

        chemicalService: new ChemicalService(),

        // TODO: remove app dep and use ko.postbox or similar
        constructor: function (app) {
            var self = this;

            var titles = {
                'closet': 'Kemikalie skabet',
                'fridge': 'Køleskabet',
                'drawer': 'Kemikalie skuffen'
            };

            var items = {
                'closet': self.closetItems,
                'fridge': self.fridgeItems,
                'drawer': self.drawerItems
            };

            self.showList = function (name) {
                console.log(items[name]());
                app.triggerPopup('list', {
                    title: titles[name],
                    items: items[name]
                });
            };

            self.chemicalService.getClosetItems().done(function (items) {
                self.closetItems(items);
            });

            self.chemicalService.getDrawerItems().done(function (items) {
                self.drawerItems(items);
            });

            self.chemicalService.getFridgeItems().done(function (items) {
                self.fridgeItems(items);
            });
	    }
    });

    return Chemical;
});
