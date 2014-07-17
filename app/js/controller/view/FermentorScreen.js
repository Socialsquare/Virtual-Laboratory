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

            var biomassData =_.map(_.range(0, 250), function (i) {
                return [i, 20];
            });

            var substrateData =_.map(_.range(0, 250), function (i) {
                return [i, 19];
            });

            var productData =_.map(_.range(0, 250), function (i) {
                return [i, 0.2];
            });

            self.plotData({biomass: biomassData, substrate: substrateData, product: productData});

            self.activateFermentor = function () {
                self.popupController.notify('fermentor.start.header', 'fermentor.start.body');
                /*self.fermentor.activate();*/

                // User starts the run
                 if (!self.turnedOn()) {
                     var graphTimer = setInterval(self.nextPlotStep, 100);
                     self.graphTimer(graphTimer);
                     self.turnedOn(true);
                 } else {
                 // User stops the run
                     clearTimeout(self.graphTimer());
                     self.graphTimer(null);
                     self.turnedOn(false);
                 }
            };



            self.nextPlotStep = function() {
                if(self.fermentor.timer() >= 48) { //If reaches ran for 48 hours
                 clearTimeout(self.graphTimer());
                 self.turnedOn(false);
                 self.graphTimer(null);
                 self.fermentor.timer(0);

                 console.log('TODO: implement the Chromatograph');
                 return;
                 }

                self.fermentor.growOneHour();

                //TODO: update plotData
                var biomassData =_.map(_.range(0, 250), function (i) {
                    return [i, 20];
                });

                var substrateData =_.map(_.range(0, 250), function (i) {
                    return [i, 19];
                });

                var productData =_.map(_.range(0, 250), function (i) {
                    return [i, 0.2];
                });

                self.plotData({biomass: biomassData, substrate: substrateData, product: productData});

                //TODO: when time is over 48 hours, kill it.
            };

        }
    });

    return FermentorScreen;
});
