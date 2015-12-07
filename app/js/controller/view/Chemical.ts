import ko = require('knockout');

import BaseViewController = require('controller/view/Base');

import ChemicalItemModel = require('model/ChemicalItem');

import ActivationType = require('model/type/Activation');

import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');
import SpecialItemFactory = require('factory/SpecialItem');

class Chemical extends BaseViewController {

    public closetItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);
    public drawerItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);
    public fridgeItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);
    public freezerItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);

    private groups: {
        closet: { name: string, items: KnockoutObservableArray<ChemicalItemModel> },
        fridge: { name: string, items: KnockoutObservableArray<ChemicalItemModel> },
        freezer: { name: string, items: KnockoutObservableArray<ChemicalItemModel> },
        drawer: { name: string, items: KnockoutObservableArray<ChemicalItemModel> }
    };

    // TODO: remove app dep and use ko.postbox or similar
    constructor() {
        super('chemical');

        this.shouldHidePipette(true);

        this.groups = {
            closet: { name: 'supply.closet_header', items: this.closetItems },
            fridge: { name: 'supply.fridge_header', items: this.fridgeItems },
            freezer: { name: 'supply.freezer_header', items: this.freezerItems },
            drawer: { name: 'supply.drawer_header', items: this.drawerItems }
        };

        this.closetItems.pushAll([
            new ChemicalItemModel('item.name.deadly', () => this.inSyringe(LiquidFactory.deadly())),
            new ChemicalItemModel('item.name.growth_medium', () => this.inTube(LiquidFactory.growthMedium())),
            new ChemicalItemModel('item.name.growth_medium', () => this.inPetridish(LiquidFactory.growthMedium())),
            new ChemicalItemModel('item.name.salt_water', () => SpecialItemFactory.washBottle()),
            new ChemicalItemModel('item.name.buffer', () => SpecialItemFactory.buffer()),
            new ChemicalItemModel('item.name.hybridoma_medium', () => this.inTube(LiquidFactory.hybridomaMedium())),
            new ChemicalItemModel('item.name.fusion_medium', () => this.inTube(LiquidFactory.fusionMedium())),
            new ChemicalItemModel('item.name.water', () => this.inTube(LiquidFactory.water())),
            new ChemicalItemModel('item.name.gel', () => SpecialItemFactory.gel()),
        ]);

        this.drawerItems.pushAll([
            new ChemicalItemModel('item.name.syringe', () => ContainerFactory.syringe()),
            new ChemicalItemModel('item.name.scalpel', () => SpecialItemFactory.scalpel()),
            new ChemicalItemModel('item.name.petri_dish', () => ContainerFactory.petri()),
            new ChemicalItemModel('item.name.tube', () => ContainerFactory.tube()),
            new ChemicalItemModel('item.name.microtiter', () => ContainerFactory.micro()),
            new ChemicalItemModel('item.name.microtiter_antigen_coated_gout', () => ContainerFactory.microAntigenCoated()),
            new ChemicalItemModel('item.name.microtiter_antigen_coated_smallpox', () => ContainerFactory.microAntigenCoated()),
        ]);

        this.fridgeItems.pushAll([
            new ChemicalItemModel('item.name.yeast', () => this.inTube(LiquidFactory.microorganism.yeast())),
            new ChemicalItemModel('item.name.mammalian', () => this.inTube(LiquidFactory.microorganism.yeast())),
            new ChemicalItemModel('item.name.myeloma', () => this.inTube(LiquidFactory.microorganism.myeloma())),
            //(TODO: not used) new ChemicalItemModel('item.name.antibiotic_a', () => this.inTube(LiquidFactory.antibiotic.a())),
            new ChemicalItemModel('item.name.antibiotic_b', () => this.inTube(LiquidFactory.antibiotic.b())),
            new ChemicalItemModel('item.name.adjuvans', () => this.inTube(LiquidFactory.adjuvans())),
            new ChemicalItemModel('item.name.antigen_gout', () => this.inTube(LiquidFactory.antigenGout())),
            new ChemicalItemModel('item.name.cyp_enzyme', () => this.inTube(LiquidFactory.cypEnzyme())),
            new ChemicalItemModel('item.name.target_receptor', () => this.inTube(LiquidFactory.targetRecptor())),
            new ChemicalItemModel('item.name.fluorescent_2nd_antibody', () => this.inTube(LiquidFactory.fluorescentSecondaryAntibody())),
            new ChemicalItemModel('item.name.antigen_smallpox', () => this.inTube(LiquidFactory.antigenSmallpox())),

            new ChemicalItemModel('item.name.diabetes_primer', () => this.inTube(LiquidFactory.diabetesPrimer())),
            new ChemicalItemModel('item.name.nucleotides', () => this.inTube(LiquidFactory.nucleotides())),
            new ChemicalItemModel('item.name.dna_polymerase', () => this.inTube(LiquidFactory.dnaPolymerase())),
            new ChemicalItemModel('item.name.blue_stain', () => this.inTube(LiquidFactory.blueStain())),
            new ChemicalItemModel('item.name.lysis', () => this.inTube(LiquidFactory.lysis())),
            new ChemicalItemModel('item.name.salt_water', () => this.inTube(LiquidFactory.saltWater())),
        ]);


        this.freezerItems.pushAll([]);

        ko.rebind(this);
    }

    inTube(liquid) {
        return ContainerFactory.tube().add(liquid, true);
    }

    inPetridish(liquid) {
        return ContainerFactory.petri().add(liquid, true);
    }

    inSyringe(liquid) {
        return ContainerFactory.syringe().add(liquid, true);
    }

    itemTakenCallback(item) {
        this.experimentController.triggerActivation(ActivationType.SUPPLY, item);
    }

    showList(name) {
        this.popupController.chemicalList<ChemicalItemModel>(
            this.groups[name].name,
            this.groups[name].items(),
            this.itemTakenCallback
        );
    }
}

export = Chemical;
