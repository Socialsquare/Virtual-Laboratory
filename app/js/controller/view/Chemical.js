define([
    'knockout',
    'jquery',
    'lodash',

    'controller/view/Base',
    'controller/Popup',

    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'model/ChemicalItem',
    'model/Syringe',
    'model/Scalpel',

    'factory/Liquid',

    'utils/utils'
], function (ko, $, _, BaseViewController, popupController, TubeModel, PetridishModel, MicrotiterplateModel, ChemicalItemModel, SyringeModel, ScalpelModel, LiquidFactory, utils) {
    var Chemical = BaseViewController.extend({

        closetItems: ko.observableArray([]),
        drawerItems: ko.observableArray([]),
        fridgeItems: ko.observableArray([]),

        // TODO: remove app dep and use ko.postbox or similar
        constructor: function () {
            var self = this;
            self.base('chemical');

            var groups = {
                closet: { name: 'supply.closet_header', items: self.closetItems },
                fridge: { name: 'supply.fridge_header', items: self.fridgeItems },
                drawer: { name: 'supply.drawer_header', items: self.drawerItems }
            };

            self.showList = function (name) {
                console.log(groups[name].items());
                popupController.show('popup-list', {
                    title: groups[name].name,
                    items: groups[name].items,
                    klone: utils.klone
                });
            };

            // TODO: consider refactoring this to somewhere else
            self.closetItems.pushAll([
                new ChemicalItemModel('item.name.antibiotic', self.inTube(LiquidFactory.antibiotic.a()))
            ]);

            self.drawerItems.pushAll([
                new ChemicalItemModel('item.name.syringe', new SyringeModel()),
                new ChemicalItemModel('item.name.scalpel', new ScalpelModel()),
                new ChemicalItemModel('item.name.petri_dish', new PetridishModel()),
                new ChemicalItemModel('item.name.tube', new TubeModel()),
                new ChemicalItemModel('item.name.microtiter', new MicrotiterplateModel())
            ]);

            self.fridgeItems.pushAll([
                new ChemicalItemModel('item.name.yeast', self.inTube(LiquidFactory.microorganism.yeast())),
                new ChemicalItemModel('item.name.myeloma', self.inTube(LiquidFactory.microorganism.myeloma()))
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
