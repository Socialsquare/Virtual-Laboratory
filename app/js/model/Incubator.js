define([
    'knockout',
    'lodash',
    'base',

    'controller/Experiment',

    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/type/Grower',
    'model/type/Location',
    'model/type/Activation'
], function(ko, _, Base, experimentController, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType, GrowerType, LocationType, ActivationType) {

    var Incubator = Base.extend({

        constructor: function () {
            var self = this;
            self.experimentController = experimentController;

            self.temperature = ko.observable(35.0);
            self.timer = ko.observable(48); // Time in hours
            self.turnedOn = ko.observable(false);
            self.timerID = ko.observable(null);
            self.hourResolution = ko.observable(10); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.INCUBATOR);

            self.tableSpacePetri = new PetriSpaceModel(6);
            self.tableSpacePetri.location(LocationType.INCUBATOR);
            self.tubeRack = new TubeRackModel();
            self.tubeRack.location(LocationType.INCUBATOR);

            self.temperatureText = ko.computed(function() {
                return '' + self.temperature().toFixed(1) + ' °C';
            });

            self.timerText = ko.computed(function() {
                return '' + Math.round(self.timer()) + ' h';
            });

            self.deactivate = function () {
                clearTimeout(self.timerID());
                self.turnedOn(false);
                self.timerID(null);

                self.experimentController.triggerActivation(ActivationType.INCUBATOR, self);
            };

            self.activate = function() {
                self.turnedOn.toggle();

                if (self.turnedOn()) {
                    var timerID = setInterval(self.growOneHour, 100);
                    self.timerID(timerID);
                } else {
                    self.deactivate();
                }
            };

            self.growOneHour = function() //Grows all containers one hour
            {// For-løkke med mindre steps?
                if(self.timer() < 1) {
                    self.deactivate();
                    self.timer(48);
                    return;
                }

                var deltaTime = 1.0 / self.hourResolution();

                for(var i = 0; i < self.hourResolution(); i++) {
                    self.tableSpacePetri.growContentsOnce(deltaTime, self.growerType(), 0, self.temperature());
                    self.tubeRack.growContentsOnce(deltaTime, self.growerType(), 0, self.temperature());
                }

                self.timer(self.timer() - 1);
            };
        }
    });

    return Incubator;
});
