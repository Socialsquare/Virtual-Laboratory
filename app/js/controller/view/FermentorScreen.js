define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController, gameState) {

    var FermentorScreen = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fermentorscreen');

            self.plotData = ko.observable({});
            self.graphTimer = ko.observable(null);
            self.turnedOn = ko.observable(false);

            self.fermentor = self.gameState.fermentor;

            self.changeTemp = function(val) {
                self.fermentor.temperature(self.fermentor.temperature() + val);
            };

            self.changePh = function(val) {
                self.fermentor.ph(self.fermentor.ph() + val);
            };


            self.updatePlotData = function() {
                //TODO: convert data to PLOTdata (pair with an index)

                var biomassData =  _.map(_.range(0, 250), function (i) {
                    return [i, self.fermentor.biomassData()[i]];
                });
                var substrateData =  _.map(_.range(0, 250), function (i) {
                    return [i, self.fermentor.substrateData()[i]];
                });

                self.plotData({biomass: biomassData, substrate: substrateData, product: self.fermentor.productData()});
            };
            self.updatePlotData();

            self.activateFermentor = function () {
                self.popupController.notify('fermentor.start.header', 'fermentor.start.body');

                // User starts the run
                 if (!self.turnedOn()) {
                     var graphTimer = setInterval(self.nextTimeStep, 100);
                     self.graphTimer(graphTimer);
                     self.turnedOn(true);
                 } else {
                 // User stops the run
                     clearTimeout(self.graphTimer());
                     self.graphTimer(null);
                     self.turnedOn(false);
                 }
            };

            self.nextTimeStep = function() {
                if(self.fermentor.timer() >= 60 || self.fermentor.substrate() <= 0) { //If reaches ran for 48 hours
                    // TODO: reset fermentor
                     clearTimeout(self.graphTimer());
                     self.turnedOn(false);
                     self.graphTimer(null);
                     self.fermentor.timer(0);

                    debugger;

                     console.log('TODO: implement the Chromatograph');
                     return;
                 }

                self.fermentor.growOneHour();

                self.updatePlotData();
            };

        }
    });

    return FermentorScreen;
});
