define([
    'knockout',
    'lodash',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/ContainerType',
    'model/GrowerType'
], function(ko, _, Base, TubeRackModel, TableSpaceModel, ContainerType, GrowerType) {

    var Incubator = Base.extend({

        constructor: function () {
            var self = this;

            self.temperature = ko.observable(35.0);
            self.timer = ko.observable(48); // Time in hours
            self.turnedOn = ko.observable(false);
            self.timerID = ko.observable(null);
            self.hourResolution = ko.observable(10); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.INCUBATOR);

            self.tableSpacePetri = new TableSpaceModel(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpaceModel(ContainerType.MICROTITER);
            self.tubeRack = new TubeRackModel();

            self.temperatureText = ko.computed(function() {
                return '' + self.temperature().toFixed(1) + ' °C';
            });

            self.timerText = ko.computed(function() {
                return '' + Math.round(self.timer()) + ' h';
            });

            self.activate = function() {
                self.turnedOn.toggle();// toggles self.turnedOn

                // User starts the run
                if (self.turnedOn()) {
                    var timerID = setInterval(self.growOneHour, 100);
                    self.timerID(timerID);
                } else {
                    // User stops the run
                    clearTimeout(self.timerID());
                    self.timerID(null);

                    // TODO: stop current run
                }

                // TODO: implement growth-caller
            };

            self.growOneHour = function() //Grows all containers one hour
            {// For-løkke med mindre steps?
                if(self.timer() < 1) { // If reaches 0-hours left
                    clearTimeout(self.timerID());
                    self.turnedOn(false);
                    self.timerID(null);
                    self.timer(48);
                    return;
                }

                var deltaTime = 1.0 / self.hourResolution();

                for(var i = 0; i < self.hourResolution(); i++) {
                    self.tableSpaceMicro.growContentsOnce(deltaTime, self.growerType(), 0, self.temperature());
                    self.tableSpacePetri.growContentsOnce(deltaTime, self.growerType(), 0, self.temperature());
                    self.tubeRack.growContentsOnce(deltaTime, self.growerType(), 0, self.temperature());
                }

                self.timer(self.timer() - 1);
            };
        }
    });

    return Incubator;
});
