define([
    'knockout',
    'base',
    'lodash',
    'model/ProducedEnzyme',
    'model/type/Liquid',
    'model/type/Grower',
    'controller/Experiment'
], function(ko, Base, _, ProducedEnzymeModel, LiquidType, GrowerType, experimentController) {

    var SimpleContainer = Base.extend({
        constructor: function (type, maxConcentration) {
            var self = this;

            self.type = ko.observable(type);
            self.maxConcentration = ko.observable(maxConcentration);
            self.liquids = ko.observableArray([]);
            self.label = ko.observable('');
            self.acquired = ko.observable(false);
            self.location = ko.observable(null); // Used for location-checking

            self._addAll = function (liquids, preventTrigger) {
                if(! self.canAddLiquids(liquids))
                    return;

                _.each(liquids, function (liquid) {
                    var exists = false;

                    _.each(self.liquids(), function (_liquid) {
                        if (_liquid.hashCode() === liquid.hashCode()) {
                            exists = true;

                            // sum microorganism's concentration
                            if (_liquid.type() === LiquidType.MICROORGANISM) {
                                _liquid.concentration(_liquid.concentration() + liquid.concentration());
                            }
                        }
                    });

                    if (!exists)
                        self.liquids.push(liquid);
                });

                if (!preventTrigger)
                    experimentController.triggerMix(liquids, self);
            };

            self.addAll = function (liquids, preventTrigger) {
                self._addAll(liquids, preventTrigger);
            };

            self.add = function (liquid, preventTrigger) {
                self._addAll([liquid], preventTrigger);
                return self;
            };

            self.canAddLiquids = function (liquids) {
                //TODO: check if self.maxConcentration is reached, and if liquids contains microorganisms.
                var concentrationToBeAdded = 0; //Such javaNamingConventions. Wow.
                _.each(liquids, function(liquid) {
                    if(liquid.type() !== LiquidType.MICROORGANISM) {     return;   }

                    concentrationToBeAdded += liquid.concentration();
                });

                return self.getTotalConcentration() + concentrationToBeAdded < self.maxConcentration();
            };

            self.clearContents = function() {
                self.liquids.removeAll();
            };

            self.contains = function (liquidType) {
                return _.any(self.liquids(), function (liquid) {
                    return liquid.type() === liquidType;
                });
            };

            self.containsMicroorganism = function (microorganismType) {
                return _(self.liquids())
                    .filter(function (liquid) {
                        return liquid.type() === LiquidType.MICROORGANISM;
                    })
                    .any(function (microorganism) {
                        return microorganism.microorganismType() === microorganismType;
                    });
            };

            self.containsAll = function (liquidTypes) {
                return _.all(liquidTypes, function (liquidType) {
                    return self.contains(liquidType);
                });
            };

            self.getTotalConcentration = function() {
                var concSum = 0;

                _.each(self.liquids(), function(liquid){
                    if(liquid.type() === LiquidType.MICROORGANISM) {
                        concSum += liquid.concentration();
                    }
                });

                return concSum;
            };

            self.isEmpty = function () {
                return self.liquids.isEmpty();
            };

            self.cloneLiquids = function () {
                return _.invoke(self.liquids(), 'clone');
            };

            // TODO: implement
            self.isFluorescent = function () {
                return true;
            };

            self.growContentsOnce = function(deltaTime, growerType, ph, temperature) {
                // deltaTime is in hours!
                var producedEnzymes = [];
                var totalConc = self.getTotalConcentration();

                if(self.getTotalConcentration() >= self.maxConcentration())
                { return producedEnzymes; }

                _.forEach(self.liquids(), function(organism){
                    if (organism.type() !== LiquidType.MICROORGANISM)
                    { return; }

                    var growthAmount = 0;

                    if(growerType === GrowerType.FERMENTOR)
                    {
                        //TODO: produce enzymes
                        growthAmount = organism.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, ph, temperature);

                        if(organism.producedEnzymes().length == 0) {

                            var extraLen = organism.extraProperties().length;
                            //For-each
                            _.each(organism.extraProperties(), function(extraProperty) {
                                var productGrowthRatio = 7.654321; //Magic number, but it corresponds to the ratio Growth:Production per organism
                                var productAmount = growthAmount / extraLen / productGrowthRatio;

                                //TODO: implement sugar-concentration and promoter-check
                                var product = new ProducedEnzymeModel(extraProperty.proteinCodingSequence().name(), productAmount);

                                organism.producedEnzymes.push(product);

                            });

                        }else {
                            throw 'Error. The point is that organism.producedEnzymes() should always be reset when read.';
                        }

                    }else if(growerType === GrowerType.INCUBATOR)
                    { // Always choose the optimal ph
                        ph = organism.optimalPh();
                        growthAmount = organism.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, ph, temperature);
                    }else {
                        throw 'Unknown grower type: ' + growerType;
                    }

                    organism.grow(growthAmount);
                });

                return producedEnzymes;
            };
        }
    });

    return SimpleContainer;
});
