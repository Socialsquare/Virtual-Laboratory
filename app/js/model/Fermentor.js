define([
    'knockout',
    'base',
    'utils/utils',
    'model/FermentorTank',
    'model/type/Grower'
], function(ko, Base, utils, FermentorTankModel, GrowerType) {

    var Fermentor = Base.extend({
        constructor: function () {
            var self = this;
            self.fermentorTank = new FermentorTankModel();

            //TODO: chromatograph - should be able to get some contents from the fermentor
            //TODO: implement field on organisms: microOrganism.hasBeenInHighConcentration.JavaNamingConventions().

            self.temperature = ko.observable(30.0);
            self.ph = ko.observable(7.0);
            self.timer = ko.observable(0); // Time in hours
            /*self.turnedOn = ko.observable(false);
            self.timerID = ko.observable(null);*/
            self.hourResolution = ko.observable(10); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.FERMENTOR);

            self.substrate = ko.observable(19.0);

            self.biomassData = ko.observableArray([]);
            self.substrateData = ko.observableArray([]);
            self.productData = ko.observableArray([]);

            var biomassData =_.map(_.range(0, 250), function (i) {
                return utils.math.getBiomassFromConcentration(self.fermentorTank.getTotalConcentration());
            });

            var substrateData =_.map(_.range(0, 250), function (i) {
                return self.substrate();
            });

            var productData =_.map(_.range(0, 250), function (i) {
                return [i, 0.0];
            });

            self.biomassData(biomassData);
            self.substrateData(substrateData);
            self.productData(productData);

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

            self.storeGrowthStep = function() { //TODO:
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
            };

            self.growOneHour = function() //Grows all containers one hour
            {// For-løkke med mindre steps
                var sugarConsumption = 1.8;
                var deltaTime = 1.0 / self.hourResolution();

                var concBefore = self.fermentorTank.getTotalConcentration();

                for(var i = 0; i < self.hourResolution(); i++) {
                    self.fermentorTank.growContentsOnce(deltaTime, self.growerType(), self.ph(), self.temperature());
                }

                var concAfter = self.fermentorTank.getTotalConcentration();
                var biomassDiff = utils.math.getBiomassFromConcentration(concAfter - concBefore);
                self.substrate(self.substrate() - biomassDiff * sugarConsumption);

                self.timer(self.timer() + 1);

                self.storeGrowthStep();
            };
        }
    });

    return Fermentor;
});
