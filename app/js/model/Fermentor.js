define([
    'knockout',
    'base',
    'utils/utils',
    'model/FermentorTank',
    'model/type/Grower'
], function(ko, Base, Utils, FermentorTankModel, GrowerType) {

    var Fermentor = Base.extend({
        constructor: function () {
            var self = this;
            self.fermentorTank = new FermentorTankModel();

            //TODO: fermentor-computer - should define the ph and temperature of the fermentor, and activate it.
            //TODO: chromatograph - should be able to get some contents from the fermentor
            //TODO: implement field on organisms: microOrganism.hasBeenInHighConcentration.JavaNamingConventions().

            self.temperature = ko.observable(30.0);
            self.ph = ko.observable(7.0);
            self.timer = ko.observable(0); // Time in hours
            /*self.turnedOn = ko.observable(false);
            self.timerID = ko.observable(null);*/
            self.hourResolution = ko.observable(10); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.FERMENTOR);
            self.substrate = ko.observable(20); //TODO: subtrate

            self.biomassData = ko.observableArray([]);
            self.substratData = ko.observableArray([]);
            self.productData = ko.observableArray([]);

            var biomassData =_.map(_.range(0, 250), function (i) {
                return [i, 20];
            });

            var substrateData =_.map(_.range(0, 250), function (i) {
                return [i, 19];
            });

            var productData =_.map(_.range(0, 250), function (i) {
                return [i, 0.2];
            });

            self.biomassData(biomassData);
            self.substratData(substrateData);
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

                return 'Tid: ' + Utils.formatter.leadingZeros(hours, 2) + ':' + Utils.formatter.leadingZeros(minutes, 2);
            });

            self.activate = function() {
                //TODO: Move to fermentorScreenControllerG

                /*// User starts the run
                if (!self.turnedOn()) {
                    var timerID = setInterval(self.growOneHour, 100);
                    self.timerID(timerID);
                    self.turnedOn(true);
                } else {
                    // User stops the run
                    clearTimeout(self.timerID());
                    self.timerID(null);
                    self.turnedOn(false);
                }*/
            };

            self.storeGrowthStep = function(){

            };

            /*self.storeBloodStep = function() {
                // TODO: use simulation
                var bloodData = self.bloodData();
                var first = bloodData.shift();

                bloodData.push(self.blodSukker());
                self.bloodData(bloodData);
            };*/

            self.growOneHour = function() //Grows all containers one hour
            {// For-løkke med mindre steps?
                /*if(self.timer() >= 48) { //If reaches ran for 48 hours
                    clearTimeout(self.timerID());
                    self.turnedOn(false);
                    self.timerID(null);
                    self.timer(0);

                    console.log('TODO: implement the Chromatograph');
                    return;
                }*/

                var deltaTime = 1.0 / self.hourResolution();

                console.log('Total concentration before: ' + self.fermentorTank.getTotalConcentration());

                for(var i = 0; i < self.hourResolution(); i++) {
                    self.fermentorTank.growContentsOnce(deltaTime, self.growerType(), self.ph(), self.temperature());
                }

                console.log('Total concentration after: ' + self.fermentorTank.getTotalConcentration());

                self.timer(self.timer() + 1);
            };
        }
    });

    return Fermentor;
});
