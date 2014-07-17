define([
    'knockout',
    'base',
    'lodash',
    'model/type/Liquid',
    'model/type/Grower'
], function(ko, Base, _, LiquidType, GrowerType) {

    var SimpleContainer = Base.extend({
        constructor: function (type, maxConcentration) {
            var self = this;

            self.type = ko.observable(type);
            self.maxConcentration = ko.observable(maxConcentration);
            self.liquids = ko.observableArray([]);
            self.label = ko.observable('');

            self._addAll = function (liquids) {
                self.liquids.pushAll(liquids);
            };

            self.addAll = function (liquids) {
                self._addAll(liquids);
            };

            self.add = function (liquid) {
                self._addAll([liquid]);
                return self;
            };

            self.clearContents = function() {
                self.liquids = ko.observableArray([]);
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
                return _.reduce(liquidTypes, function (hasAll, liquidType) {
                    return hasAll && self.contains(liquidType);
                }, true);
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

            // TODO: implement
            self.isFluorescent = function () {
                return true;
            };

            self.growContentsOnce = function(deltaTime, growerType, ph, temperature) {
                // TODO return whether growth is performed. False = max is reached, True = grew once
                // deltaTime is in hours!


                if(self.getTotalConcentration() >= self.maxConcentration())
                { return false; }


// TODO limit when reaches maxConcentration

                var totalConc = self.getTotalConcentration();


                _.forEach(self.liquids(), function(liquid){
                    if(! (liquid.type() === LiquidType.MICROORGANISM))
                    { return; }

                    //TODO check if null?

                    var growthAmount = 0;

                    if(growerType === GrowerType.FERMENTOR)
                    {
                        growthAmount = liquid.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, ph, temperature);
                    }else if(growerType === GrowerType.INCUBATOR)
                    { // Always choose the optimal ph
                        ph = liquid.optimalPh();
                        growthAmount = liquid.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, ph, temperature);
                    }else
                    {
                        throw 'wtf are you doing, developer-dude?';
                    }

                    liquid.grow(growthAmount);
                });

                return true;
            };
        }
    });

    return SimpleContainer;
});
