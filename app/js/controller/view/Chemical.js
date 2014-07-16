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
                new ChemicalItemModel('item.name.deadly', self.inTube(LiquidFactory.deadly())),
                new ChemicalItemModel('item.name.growth_medium', self.inTube(LiquidFactory.growthMedium())),
                new ChemicalItemModel('item.name.growth_medium', self.inPetridish(LiquidFactory.growthMedium()))
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
                new ChemicalItemModel('item.name.myeloma', self.inTube(LiquidFactory.microorganism.myeloma())),

                new ChemicalItemModel('item.name.antibiotic_a', self.inTube(LiquidFactory.antibiotic.a())),
                new ChemicalItemModel('item.name.antibiotic_b', self.inTube(LiquidFactory.antibiotic.b())),

                new ChemicalItemModel('item.name.adjuvans', self.inTube(LiquidFactory.adjuvans())),
                new ChemicalItemModel('item.name.antigen_gout', self.inTube(LiquidFactory.antigenGout())),
                new ChemicalItemModel('item.name.antigen_smallpox', self.inTube(LiquidFactory.antigenSmallpox()))

            ]);
	    },

        inTube: function (liquid) {
            return new TubeModel().add(liquid);
        },

        inPetridish: function (liquid) {
            return new PetridishModel().add(liquid);
        }
    });

    return Chemical;
});
