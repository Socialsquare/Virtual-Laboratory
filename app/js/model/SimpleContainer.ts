/* tslint:disable: align */
import ko = require('knockout');
import _ = require('lodash');

import InventoryItem = require('model/InventoryItem');
import ProducedEnzymeModel = require('model/ProducedEnzyme');
import LiquidModel = require('model/Liquid');
import MicroorganismModel = require('model/Microorganism');

import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');
import GrowerType = require('model/type/Grower');
import PCSType = require('model/type/ProteinCodingSequence');
import LocationType = require('model/type/Location');

import lh = require('utils/LiquidHelper');

import experimentController = require('controller/Experiment');

import signals = require('signals');

class SimpleContainer extends InventoryItem {

    public type: KnockoutObservable<any>;
    public subtype: KnockoutObservable<any>;
    public maxConcentration: KnockoutObservable<number>;
    public liquids: KnockoutObservableArray<LiquidModel>;
    public label: KnockoutObservable<string>;
    public acquired: KnockoutObservable<boolean>;
    public location: KnockoutObservable<LocationType>;

    public liquidsAdded: Signal;

    constructor(type, maxConcentration) {
        super('simpleContainer');

        this.type = ko.observable(type);
        this.subtype = ko.observable(); // defaults to no subtype
        this.maxConcentration = ko.observable(maxConcentration);
        this.liquids = ko.observableArray([]);
        this.label = ko.observable('');
        this.acquired = ko.observable(false);
        this.liquidsAdded = new signals.Signal();

        // Used for location-checking
        this.location = ko.observable(null);

        ko.rebind(this);
    }

    getMicroorganisms(): MicroorganismModel[] {
        return lh.mos(this.liquids());
    }

    protected _addAll(liquids: LiquidModel[], preventTrigger = false) {
        if (!this.canAddLiquids(liquids))
            return;

        var task = experimentController.activeTask();
        // merge in new liquids
        _.each(liquids, (liquid) => {
            if (task && task.trigger().liquidsOrdered) {
                // make sure the order of liquids isn't broken
                var pos = this.liquids().length;
                var taskLiquids = task.trigger().liquids;
                var taskLiquid = taskLiquids[pos];
                if (taskLiquid.type !== liquid.type()) {
                    //todo: should we return liquids to its original state?
                    return false;
                }
            }
            
            var exists = false;
            _.each(this.liquids(), (_liquid) => {
                if (_liquid.hashCode() === liquid.hashCode()) {
                    exists = true;

                    // sum microorganism's concentration
                    if (_liquid.type() === LiquidType.MICROORGANISM) {
                        var _mt = <MicroorganismModel>_liquid;
                        var mt = <MicroorganismModel>liquid;
                        _mt.concentration(_mt.concentration() + mt.concentration());
                    }
                }
            });
       

            if (!exists)
                this.liquids.push(liquid);
        });

        // react
        _.each(_.union(this.liquids(), liquids), (liquid) => {
            liquid.react(this);
        });


        if (!preventTrigger)
            experimentController.triggerMix(liquids, this);

        this.liquidsAdded.dispatch();
    }

    addAll(liquids: LiquidModel[], preventTrigger = false) {
        this._addAll(liquids, preventTrigger);
        return this;
    }

    add(liquid, preventTrigger = false) {
        this._addAll([liquid], preventTrigger);
        return this;
    }

    canAddLiquids(liquids: LiquidModel[]) {
        // stupid edge-case
        var containsSaltWater = _.any(liquids, (liquid) => {
            return liquid.type() === LiquidType.SALT_WATER;
        });

        if (liquids.length === 1 && containsSaltWater)
            return true;

        var concentrationToBeAdded = 0; //Such javaNamingConventions. Wow.
        _.each(lh.mos(liquids), (mo) => {
            concentrationToBeAdded += mo.concentration();
        });

        return this.getTotalConcentration() + concentrationToBeAdded < this.maxConcentration();
    }

    clearContents() {
        this.liquids.removeAll();
    }

    contains(liquidType: LiquidType) {
        return _.any(this.liquids(), (liquid) => {
            return liquid.type() === liquidType;
        });
    }

    containsMicroorganism(microorganismType: MicroorganismType) {
        return _.any(this.getMicroorganisms(), (microorganism) => {
            return microorganism.microorganismType() === microorganismType;
        });
    }

    findByType(type: LiquidType) {
        return _.find(this.liquids(), (l) => l.type() === type);
    }

    containsAll(liquidTypes: LiquidType[]) {
        return _.all(liquidTypes, (liquidType) => {
            return this.contains(liquidType);
        });
    }

    containsAllStrict(liquidTypes: LiquidType[]) {
        if (this.liquids().length !== liquidTypes.length)
            return false;

        var containedTypes = _.map(this.liquids(), l => l.type());

        return _.isEmpty(_.difference(containedTypes, liquidTypes));
    }

    getTotalConcentration() {
        return _.sum(this.getMicroorganisms(), mo => mo.concentration());
    }

    isEmpty() {
        return this.liquids.isEmpty();
    }

    cloneLiquids() {
        return _.invoke(this.liquids(), 'clone');
    }

    isFluorescent() {
        return _.any(this.liquids(), (liquid) => {
            if (liquid.type() === LiquidType.MICROORGANISM) {
                var mo = <MicroorganismModel>liquid;
                return _.any(mo.extraProperties(), (extraProperty) => {
                    return extraProperty.proteinCodingSequenceType() === PCSType.GFP;
                });
            }

            return liquid.type() === LiquidType.FLUORESCENT_2ND_ANTIBODY;
        });
    }

    growContentsOnce(deltaTime: number, growerType: GrowerType, ph: number, temperature: number) {
        // deltaTime is in hours!
        var producedEnzymes = [];
        var totalConc = this.getTotalConcentration();

        if (this.getTotalConcentration() >= this.maxConcentration())
            return producedEnzymes;

        _.forEach(this.getMicroorganisms(), (organism) => {

            var growthAmount = 0;

            if (growerType === GrowerType.FERMENTOR) {
                //TODO: produce enzymes
                growthAmount = organism.getGrowthStep(deltaTime, this.maxConcentration(), totalConc, ph, temperature);

                if (organism.producedEnzymes().length === 0) {

                    var extraLen = organism.extraProperties().length;
                    //For-each
                    _.each(organism.extraProperties(), (extraProperty) => {
                        var productGrowthRatio = 7.654321; //Magic number, but it corresponds to the ratio Growth:Production per organism
                        var productAmount = growthAmount / extraLen / productGrowthRatio;

                        //TODO: implement sugar-concentration and promoter-check
                        var product = new ProducedEnzymeModel(extraProperty.proteinCodingSequence().proteinCodingSequence(), productAmount);

                        organism.producedEnzymes.push(product);

                    });

                } else {
                    throw 'Error. The point is that organism.producedEnzymes() should always be reset when read.';
                }

            } else if (growerType === GrowerType.INCUBATOR) {
                // Always choose the optimal ph
                ph = organism.optimalPh();
                growthAmount = organism.getGrowthStep(deltaTime, this.maxConcentration(), totalConc, ph, temperature);
            } else {
                throw 'Unknown grower type: ' + growerType;
            }

            organism.grow(growthAmount);
        });

        return producedEnzymes;
    }
}

export = SimpleContainer;
