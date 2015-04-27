import ko = require('knockout');
import _ = require('lodash');
import ProducedEnzymeModel = require('model/ProducedEnzyme');
import LiquidType = require('model/type/Liquid');
import GrowerType = require('model/type/Grower');
import PCSType = require('model/type/ProteinCodingSequence');

import experimentController = require('controller/Experiment');

class SimpleContainer {

    constructor(type, maxConcentration) {

        this.type = ko.observable(type);
        this.subtype = ko.observable(); // defaults to no subtype
        this.maxConcentration = ko.observable(maxConcentration);
        this.liquids = ko.observableArray([]);
        this.label = ko.observable('');
        this.acquired = ko.observable(false);

        // Used for location-checking
        this.location = ko.observable(null);
    }

    public _addAll = (liquids, preventTrigger) => {
        if (!this.canAddLiquids(liquids))
            return;

        // merge in new liquids
        _.each(liquids, (liquid) => {
            var exists = false;

            _.each(this.liquids(), (_liquid) => {
                if (_liquid.hashCode() === liquid.hashCode()) {
                    exists = true;

                    // sum microorganism's concentration
                    if (_liquid.type() === LiquidType.MICROORGANISM) {
                        _liquid.concentration(_liquid.concentration() + liquid.concentration());
                    }
                }
            });

            if (!exists)
                this.liquids.push(liquid);
        });

        // react
        _(this.liquids())
            .union(liquids)
            .each((liquid) => {

                liquid.react(this);
            });


        if (!preventTrigger)
            experimentController.triggerMix(liquids, this);
    }

    public addAll = (liquids, preventTrigger) => {
        this._addAll(liquids, preventTrigger);
        return this;
    }

    public add = (liquid, preventTrigger) => {
        this._addAll([liquid], preventTrigger);
        return this;
    }

    public canAddLiquids = (liquids) => {
        // stupid edge-case
        var containsSaltWater = _.any(liquids, (liquid) => {
            return liquid.type() === LiquidType.SALT_WATER;
        });
        if (liquids.length == 1 && containsSaltWater)
            return true;


        var concentrationToBeAdded = 0; //Such javaNamingConventions. Wow.
        _.each(liquids, (liquid) => {
            if (liquid.type() !== LiquidType.MICROORGANISM) {     return;   }

            concentrationToBeAdded += liquid.concentration();
        });

        return this.getTotalConcentration() + concentrationToBeAdded < this.maxConcentration();
    }

    public clearContents = () => {
        this.liquids.removeAll();
    }

    public contains = (liquidType) => {
        return _.any(this.liquids(), (liquid) => {
            return liquid.type() === liquidType;
        });
    }

    public containsMicroorganism = (microorganismType) => {
        return _(this.liquids())
            .filter((liquid) => {
                return liquid.type() === LiquidType.MICROORGANISM;
            })
            .any((microorganism) => {
                return microorganism.microorganismType() === microorganismType;
            });
    }

    public containsAll = (liquidTypes) => {
        return _.all(liquidTypes, (liquidType) => {
            return this.contains(liquidType);
        });
    }

    public getTotalConcentration = () => {
        var concSum = 0;

        _.each(this.liquids(), (liquid) => {
            if (liquid.type() === LiquidType.MICROORGANISM) {
                concSum += liquid.concentration();
            }
        });

        return concSum;
    }

    public isEmpty = () => {
        return this.liquids.isEmpty();
    }

    public cloneLiquids = () => {
        return _.invoke(this.liquids(), 'clone');
    }

    public isFluorescent = () => {
        return _.any(this.liquids(), (liquid) => {
            if (liquid.type() === LiquidType.MICROORGANISM) {
                return _.any(liquid.extraProperties(), (extraProperty) => {
                    return extraProperty.proteinCodingSequenceType() === PCSType.GFP;
                })
            }

            if (liquid.type() === LiquidType.FLUORESCENT_2ND_ANTIBODY)
                return true;

            return false;
        });
    }

    public growContentsOnce = (deltaTime, growerType, ph, temperature) => {
        // deltaTime is in hours!
        var producedEnzymes = [];
        var totalConc = this.getTotalConcentration();

        if (this.getTotalConcentration() >= this.maxConcentration())
            return producedEnzymes;

        _.forEach(this.liquids(), (organism) => {
            if (organism.type() !== LiquidType.MICROORGANISM)
                return;

            var growthAmount = 0;

            if (growerType === GrowerType.FERMENTOR) {
                //TODO: produce enzymes
                growthAmount = organism.getGrowthStep(deltaTime, this.maxConcentration(), totalConc, ph, temperature);

                if (organism.producedEnzymes().length == 0) {

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
