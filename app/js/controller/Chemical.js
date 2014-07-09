define([
    'knockout',
    'mapping',
    'jquery',
    'lodash',

    'controller/BaseView',

    'model/GameState',

    'service/Chemical',

    'utils/utils'
], function (ko, mapping, $, _, BaseViewController, gameState, ChemicalService, utils) {
    var Chemical = BaseViewController.extend({

        closetItems: ko.observableArray([]),
        drawerItems: ko.observableArray([]),
        fridgeItems: ko.observableArray([]),

        chemicalService: new ChemicalService(),

        // TODO: remove app dep and use ko.postbox or similar
        constructor: function (app) {
            var self = this;
            self.base('chemical-closet');

            var groups = {
                closet: { name: 'Kemikalie skabet', items: self.closetItems },
                fridge: { name: 'Køleskabet', items: self.fridgeItems },
                drawer: { name: 'Kemikalie skuffen', items: self.drawerItems }
            };

            self.showList = function (name) {
                app.triggerPopup('list', {
                    title: groups[name].name,
                    items: groups[name].items
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
