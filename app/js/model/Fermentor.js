define([
    'knockout',
    'base',
    'utils/utils',
    'model/FermentorTank',
    'model/type/Grower',
    'model/type/Liquid',
    'model/type/Location'
], function(ko, Base, utils, FermentorTankModel, GrowerType, LiquidType, LocationType) {

    var Fermentor = Base.extend({
        constructor: function () {
            var self = this;
            self.fermentorTank = new FermentorTankModel();
            self.fermentorTank.location(LocationType.FERMENTOR);

            //TODO: implement field on organisms: microOrganism.hasBeenInHighConcentration.JavaNamingConventions().

            self.temperature = ko.observable(30.0);
            self.ph = ko.observable(7.0);
            self.timer = ko.observable(0); // Time in hours
            self.hourResolution = ko.observable(10); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.FERMENTOR);
            self.products = ko.observableArray([]);

            self.substrate = ko.observable(19.0);

            self.biomassData = ko.observableArray([]);
            self.substrateData = ko.observableArray([]);
            self.productData = ko.observableArray([]);

            self.initalizeData = function() {
                var biomassData =_.map(_.range(0, 250), function (i) {
                    return utils.math.getBiomassFromConcentration(self.fermentorTank.getTotalConcentration());
                });

                var substrateData =_.map(_.range(0, 250), function (i) {
                    return self.substrate();
                });

                var productData =_.map(_.range(0, 250), function (i) {
                    return 0.0;
                });

                self.biomassData(biomassData);
                self.substrateData(substrateData);
                self.productData(productData);
            };

            self.initalizeData();

            self.temperatureText = ko.computed(function() {
                return 'Temperatur: ' + self.temperature().toFixed(1) + ' °C';
            });

            self.phText = ko.computed(function() {
                return 'pH: ' + self.ph().toFixed(1);
            });

            self.timerText = ko.computed(function() {
                var hours = Math.floor(self.timer());
                var minutes = Math.round((self.timer() - hours) * 60);

                return 'Tid: ' + utils.formatter.leadingZeros(hours, 2) + ':' + utils.formatter.leadingZeros(minutes, 2);
            });

            self.activate = function() {
                //TODO: config-file
            };

            self.resetContents = function() {
                var dilutionFactor = self.fermentorTank.getTotalConcentration() / Math.pow(10,7);
                var clonedLiqs = self.fermentorTank.cloneLiquids();
                clonedLiqs = utils.biology.dilute(dilutionFactor, clonedLiqs);
                self.fermentorTank.clearContents();
                self.fermentorTank.addAll(clonedLiqs,true);

                self.products([]);

                self.substrate(19.0);

                self.initalizeData();
            };

            self.storeGrowthStep = function() {
// Biomass
                var biomassData = self.biomassData();
                var first = biomassData.shift();
                biomassData.push(utils.math.getBiomassFromConcentration(self.fermentorTank.getTotalConcentration()));
                self.biomassData(biomassData);

// Substrate
                var substrateData = self.substrateData();
                first = substrateData.shift();
                substrateData.push(self.substrate());
                self.substrateData(substrateData);

// Products //TODO:
                var productData = self.productData();
                var productConcentration = 0;
                _.each(self.products(), function(producedEnzyme) {
                    productConcentration += producedEnzyme.amount;
                });
                first = productData.shift();
                productData.push(utils.math.getBiomassFromConcentration(productConcentration));
                self.productData(productData);
            };

            self.growOneHour = function() //Grows all containers one hour
            {// For-løkke med mindre steps
                var sugarConsumption = 1.87;  //Magic number, but it corresponds to the amount of sugar an organism consumes per unit of growth.
                var deltaTime = 1.0 / self.hourResolution();

                var concBefore = self.fermentorTank.getTotalConcentration();

                for(var i = 0; i < self.hourResolution(); i++) {
                    self.fermentorTank.growContentsOnce(deltaTime, self.growerType(), self.ph(), self.temperature());

                    _.each(self.fermentorTank.liquids(), function(organism) {
                        if(! (organism.type() === LiquidType.MICROORGANISM))
                        { return; }


                        // 1) find products and add to fermentor
                        _.each(organism.producedEnzymes(), function(producedEnzyme) {

                            var match = _.find(self.products(), function(product) { return product.enzymeLiquidType === producedEnzyme.enzymeLiquidType });


                            if(!match) {
                                self.products.push(producedEnzyme);
                            }else { //if in fermentorProducts --> update concentration
                                match.amount += producedEnzyme.amount;
                            }
                        });

                        // 2) Set products to []
                        organism.producedEnzymes([]);

                    });
                }

                var concAfter = self.fermentorTank.getTotalConcentration();
                var biomassDiff = utils.math.getBiomassFromConcentration(concAfter - concBefore);
                self.substrate(self.substrate() - biomassDiff * sugarConsumption);

                self.timer(self.timer() + 1);

                self.storeGrowthStep();
            };

            self.reset = function () {
                self.fermentorTank.clearContents();

                self.temperature(30.0);
                self.ph(7.0);
                self.timer(0);
                self.hourResolution(10);
                self.growerType(GrowerType.FERMENTOR);
                self.products([]);
                self.substrate(19.0);

                self.biomassData([]);
                self.substrateData([]);
                self.productData([]);
            };
        }
    });

    return Fermentor;
});
