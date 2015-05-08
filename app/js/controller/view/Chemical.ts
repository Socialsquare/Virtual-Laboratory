import ko = require('knockout');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');
import popupController = require('controller/Popup');

import TubeModel = require('model/Tube');
import PetridishModel = require('model/Petridish');
import MicrotiterplateModel = require('model/Microtiterplate');
import ChemicalItemModel = require('model/ChemicalItem');
import SyringeModel = require('model/Syringe');
import ScalpelModel = require('model/Scalpel');

import ActivationType = require('model/type/Activation');

import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');

import utils = require('utils/utils');

class Chemical extends BaseViewController {

    public closetItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);
    public drawerItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);
    public fridgeItems: KnockoutObservableArray<ChemicalItemModel> = ko.observableArray([]);

    private groups: {
        closet: { name: string, items: KnockoutObservableArray<ChemicalItemModel> },
        fridge: { name: string, items: KnockoutObservableArray<ChemicalItemModel> },
        drawer: { name: string, items: KnockoutObservableArray<ChemicalItemModel> }
    }

    // TODO: remove app dep and use ko.postbox or similar
    constructor() {
        super('chemical');

        this.shouldHidePipette(true);

        this.groups = {
            closet: { name: 'supply.closet_header', items: this.closetItems },
            fridge: { name: 'supply.fridge_header', items: this.fridgeItems },
            drawer: { name: 'supply.drawer_header', items: this.drawerItems }
        };

        this.closetItems.pushAll([
            new ChemicalItemModel('item.name.deadly', () => this.inSyringe(LiquidFactory.deadly())),
            new ChemicalItemModel('item.name.growth_medium', () => this.inTube(LiquidFactory.growthMedium())),
            new ChemicalItemModel('item.name.growth_medium', () => this.inPetridish(LiquidFactory.growthMedium())),
            new ChemicalItemModel('item.name.salt_water', () => this.specialItemFactory.washBottle()),
            new ChemicalItemModel('item.name.buffer', () => this.specialItemFactory.buffer()),
            new ChemicalItemModel('item.name.hybridoma_medium', () => this.inTube(LiquidFactory.hybridomaMedium())),
        ]);

        this.drawerItems.pushAll([
            new ChemicalItemModel('item.name.syringe', () => ContainerFactory.syringe()),
            new ChemicalItemModel('item.name.scalpel', () => new ScalpelModel()),
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
            new ChemicalItemModel('item.name.pcr_polymerase', () => this.inTube(LiquidFactory.pcrPolymerase())),
        ]);
    }

    public inTube = (liquid) => {
        return new TubeModel().add(liquid, true);
    }

    public inPetridish = (liquid) => {
        return new PetridishModel().add(liquid, true);
    }

    public inSyringe = (liquid) => {
        return ContainerFactory.syringe().add(liquid, true);
    }

    public itemTaken = (item) => {
        //this.experimentController.triggerActivation(ActivationType.SUPPLY, item);
    }

    public showList = (name) => {
        this.popupController.show('popup-list', {
            title: this.groups[name].name,
            items: this.groups[name].items,
            itemTaken: this.itemTaken
        });
    }
}

export = Chemical;
