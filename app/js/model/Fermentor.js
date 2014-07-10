define([
    'knockout',
    'base',
    'utils/utils',
    'controller/Notifier',
    'model/FermentorTank',
    'model/GrowerType'
], function(ko, Base, Utils, Notifier, FermentorTankModel, GrowerType) {

    var Fermentor = Base.extend({


        constructor: function () {
            var self = this;

            self.fermentorTank = new FermentorTankModel();
            // TODO fermentor-computer - should define the ph and temperature of the fermentor, and activate it.
            // TODO chromatograph - should be able to get some contents from the fermentor

            self.temperature = ko.observable(30.0);
            self.ph = ko.observable(7.0);
            self.timer = ko.observable(0); // Time in hours
            self.turnedOn = ko.observable(false);
            self.timerID = ko.observable(null);
            self.hourResolution = ko.observable(10); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.FERMENTOR);

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

            self.activate = function() { //TODO: implement
                Notifier.pop('TODO','Such TODO');
            }
        }
    });

    return Fermentor;
});
