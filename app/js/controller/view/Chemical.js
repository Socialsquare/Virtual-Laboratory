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

    'model/type/Activation',

    'factory/Liquid',

    'utils/utils'

], function (ko, $, _, BaseViewController, popupController, TubeModel,
             PetridishModel, MicrotiterplateModel, ChemicalItemModel,
             SyringeModel, ScalpelModel, ActivationType, LiquidFactory, utils) {

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

            self.itemTaken = function(item) {
                //self.experimentController.triggerActivation(self.ActivationType.SUPPLY, item);
            };

            self.showList = function (name) {
                popupController.show('popup-list', {
                    title: groups[name].name,
                    items: groups[name].items,
                    itemTaken: self.itemTaken
                });
            };

            // TODO: consider refactoring this to somewhere else
            self.closetItems.pushAll([
                new ChemicalItemModel('item.name.deadly', function () { return self.inTube(LiquidFactory.deadly()); }),
                new ChemicalItemModel('item.name.growth_medium', function () { return self.inTube(LiquidFactory.growthMedium()); }),
                new ChemicalItemModel('item.name.growth_medium', function () { return self.inPetridish(LiquidFactory.growthMedium()); }),
                new ChemicalItemModel('item.name.salt_water', function () { return self.specialItemFactory.washBottle(); }),
                new ChemicalItemModel('item.name.buffer', function () { return self.specialItemFactory.buffer(); }),
                new ChemicalItemModel('item.name.hybridoma_medium', function () { return self.inTube(LiquidFactory.hybridomaMedium()); })
            ]);

            self.drawerItems.pushAll([
                new ChemicalItemModel('item.name.syringe', function () { return new SyringeModel(); }),
                new ChemicalItemModel('item.name.scalpel', function () { return new ScalpelModel(); }),
                new ChemicalItemModel('item.name.petri_dish', function () { return new PetridishModel(); }),
                new ChemicalItemModel('item.name.tube', function () { return new TubeModel(); }),
                new ChemicalItemModel('item.name.microtiter', function () { return new MicrotiterplateModel(); })
            ]);

            self.fridgeItems.pushAll([
                new ChemicalItemModel('item.name.yeast', function () { return self.inTube(LiquidFactory.microorganism.yeast()); }),
                new ChemicalItemModel('item.name.myeloma', function () { return self.inTube(LiquidFactory.microorganism.myeloma()); }),
                new ChemicalItemModel('item.name.antibiotic_a', function () { return self.inTube(LiquidFactory.antibiotic.a()); }),
                new ChemicalItemModel('item.name.antibiotic_b', function () { return self.inTube(LiquidFactory.antibiotic.b()); }),
                new ChemicalItemModel('item.name.adjuvans', function () { return self.inTube(LiquidFactory.adjuvans()); }),
                new ChemicalItemModel('item.name.antigen_gout', function () { return self.inTube(LiquidFactory.antigenGout()); }),
                new ChemicalItemModel('item.name.antigen_smallpox', function () { return self.inTube(LiquidFactory.antigenSmallpox()); })
            ]);
        },

        inTube: function (liquid) {
            return new TubeModel().add(liquid, true);
        },

        inPetridish: function (liquid) {
            return new PetridishModel().add(liquid, true);
        }
    });

    return Chemical;
});
