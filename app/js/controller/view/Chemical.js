define([
    'knockout',
    'jquery',
    'lodash',

    'controller/view/Base',

    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'model/ChemicalItem',

    'factory/Liquid',

    'utils/utils'
], function (ko, $, _, BaseViewController, TubeModel, PetridishModel, MicrotiterplateModel, ChemicalItemModel, LiquidFactory, utils) {
    var Chemical = BaseViewController.extend({

        closetItems: ko.observableArray([]),
        drawerItems: ko.observableArray([]),
        fridgeItems: ko.observableArray([]),

        // TODO: remove app dep and use ko.postbox or similar
        constructor: function (app) {
            var self = this;
            self.base('chemical');

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

            // TODO: consider refactoring this to somewhere else
            ko.utils.arrayPushAll(self.closetItems, [
                new ChemicalItemModel('Antibiotikum', self.inTube(LiquidFactory.antibiotic.a()))
            ]);

            ko.utils.arrayPushAll(self.drawerItems, [
                //new ChemicalItemModel('Kanyle', new Syringe()),
                new ChemicalItemModel('Petriskål', new PetridishModel()),
                new ChemicalItemModel('Reagensglas', new TubeModel()),
                new ChemicalItemModel('Mikrotiterbakke', new MicrotiterplateModel()),
                //new ChemicalItemModel('Skalpel', new Scalpel()),
            ]);

            ko.utils.arrayPushAll(self.fridgeItems, [
                new ChemicalItemModel('Gærceller', self.inTube(LiquidFactory.microorganism.yeast())),
                new ChemicalItemModel('Myeloma', self.inTube(LiquidFactory.microorganism.myeloma())),
            ]);
	    },

        inTube: function (liquid) {
            var tube = new TubeModel();
            tube.add(liquid);
            return tube;
        }
    });

    return Chemical;
});
