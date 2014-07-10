define([
    'knockout',
    'base',
    'lodash',
    'model/LiquidType',
    'model/GrowerType'
], function(ko, Base, _, LiquidType, GrowerType) {

    var SimpleContainer = Base.extend({
        constructor: function (type, maxConcentration) {
            var self = this;

            self.type = ko.observable(type);
            self.maxConcentration = ko.observable(maxConcentration);
            self.liquids = ko.observableArray([]);

            //self.inventoryConfig = ko.observable(null);

            self._addAll = function (liquids) {
                ko.utils.arrayPushAll(self.liquids, liquids);
            };

            self.addAll = function (liquids) {
                self._addAll(liquids);
            };

            self.add = function (liquid) {
                self._addAll([liquid]);
            };

            self.containsAll = function (liquidTypes) {
                // TODO: LiquidType.WHATEVER_TYPE

                throw 'NotYetImplementedException';
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



            self.growContentsOnce = function(deltaTime, growerType, pH, temperature) {
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
                        growthAmount = liquid.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, pH, temperature);
                    }else if(growerType === GrowerType.INCUBATOR)
                    { // Always choose the optimal pH
                        pH = liquid.optimalpH();
                        growthAmount = liquid.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, pH, temperature);
                    }else
                    {
                        throw 'wtf are you doing, developer-dude?';
                    }

                    liquid.grow(growthAmount);
                });

                return true;

            };

            /*self.growContents = function(deltaTime, growerType, pH, temperature) {
                // deltaTime is in hours!

// TODO limit when reaches maxConcentration

                while(self.getTotalConcentration() < self.maxConcentration())
                {
                    var totalConc = self.getTotalConcentration();


                    _.forEach(self.liquids(), function(liquid){
                        if(! (liquid.type() === LiquidType.MICROORGANISM))
                        { return; }

                        var growthAmount = 0;

                        if(growerType === GrowerType.FERMENTOR)
                        {
                            growthAmount = liquid.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, pH, temperature);
                        }else if(growerType === GrowerType.INCUBATOR)
                        { // Always choose the optimal pH
                            pH = liquid.optimalpH();
                            growthAmount = liquid.getGrowthStep(deltaTime, self.maxConcentration(), totalConc, pH, temperature);
                        }else
                        {
                            throw 'wtf are you doing, developer-dude?';
                        }

                        liquid.grow(growthAmount);
                    });
                }

            };*/
        }
    });

    return SimpleContainer;
});
