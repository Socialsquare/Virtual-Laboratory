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
    'factory/Container',

    'utils/utils'

], function (ko, $, _, BaseViewController, popupController, TubeModel,
             PetridishModel, MicrotiterplateModel, ChemicalItemModel,
             SyringeModel, ScalpelModel, ActivationType, LiquidFactory, ContainerFactory,utils) {

    var Chemical = BaseViewController.extend({

        closetItems: ko.observableArray([]),
        drawerItems: ko.observableArray([]),
        fridgeItems: ko.observableArray([]),

        // TODO: remove app dep and use ko.postbox or similar
        constructor: function () {
            var self = this;
            self.base('chemical');
            self.shouldHidePipette(true);

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

            self.closetItems.pushAll([
                new ChemicalItemModel('item.name.deadly', function () { return self.inSyringe(LiquidFactory.deadly()); }),
                new ChemicalItemModel('item.name.growth_medium', function () { return self.inTube(LiquidFactory.growthMedium()); }),
                new ChemicalItemModel('item.name.growth_medium', function () { return self.inPetridish(LiquidFactory.growthMedium()); }),
                new ChemicalItemModel('item.name.salt_water', function () { return self.specialItemFactory.washBottle(); }),
                new ChemicalItemModel('item.name.buffer', function () { return self.specialItemFactory.buffer(); }),
                new ChemicalItemModel('item.name.hybridoma_medium', function () { return self.inTube(LiquidFactory.hybridomaMedium()); })
            ]);

            self.drawerItems.pushAll([
                new ChemicalItemModel('item.name.syringe', function () { return new ContainerFactory.syringe(); }),
                new ChemicalItemModel('item.name.scalpel', function () { return new ScalpelModel(); }),
                new ChemicalItemModel('item.name.petri_dish', function () { return new ContainerFactory.petri(); }),
                new ChemicalItemModel('item.name.tube', function () { return new ContainerFactory.tube(); }),
                new ChemicalItemModel('item.name.microtiter', function () { return new ContainerFactory.micro(); }),
                new ChemicalItemModel('item.name.microtiter_antigen_coated_gout', function () { return new ContainerFactory.microAntigenCoated(); }),
                new ChemicalItemModel('item.name.microtiter_antigen_coated_smallpox', function () { return new ContainerFactory.microAntigenCoated(); })
            ]);

            self.fridgeItems.pushAll([
                new ChemicalItemModel('item.name.yeast', function () { return self.inTube(LiquidFactory.microorganism.yeast()); }),
                new ChemicalItemModel('item.name.mammalian', function () { return self.inTube(LiquidFactory.microorganism.yeast()); }),
                new ChemicalItemModel('item.name.myeloma', function () { return self.inTube(LiquidFactory.microorganism.myeloma()); }),
                //(TODO: not used) new ChemicalItemModel('item.name.antibiotic_a', function () { return self.inTube(LiquidFactory.antibiotic.a()); }),
                new ChemicalItemModel('item.name.antibiotic_b', function () { return self.inTube(LiquidFactory.antibiotic.b()); }),
                new ChemicalItemModel('item.name.adjuvans', function () { return self.inTube(LiquidFactory.adjuvans()); }),
                new ChemicalItemModel('item.name.antigen_gout', function () { return self.inTube(LiquidFactory.antigenGout()); }),
                new ChemicalItemModel('item.name.cyp_enzyme', function () { return self.inTube(LiquidFactory.cypEnzyme())}),
                new ChemicalItemModel('item.name.target_receptor', function () { return self.inTube(LiquidFactory.targetRecptor())}),
                new ChemicalItemModel('item.name.fluorescent_2nd_antibody', function () { return self.inTube(LiquidFactory.fluorescentSecondaryAntibody()); }),
                new ChemicalItemModel('item.name.antigen_smallpox', function () { return self.inTube(LiquidFactory.antigenSmallpox()); })
            ]);
        },

        inTube: function (liquid) {
            return new TubeModel().add(liquid, true);
        },

        inPetridish: function (liquid) {
            return new PetridishModel().add(liquid, true);
        },

        inSyringe: function (liquid) {
            return new ContainerFactory.syringe().add(liquid, true);
        }
    });

    return Chemical;
});
