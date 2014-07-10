define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/ContainerType',
    'model/GrowerType'
], function(ko, Base, TubeRackModel, TableSpaceModel, ContainerType, GrowerType) {

    var Incubator = Base.extend({

        constructor: function () {
            var self = this;

            self.temperature = ko.observable(30.0);
            self.timer = ko.observable(48);
            self.turnedOn = ko.observable(false);
            self.timerID = ko.observable(null);
            self.hourResolution = ko.observable(12); // This is used in the growth.
            self.growerType = ko.observable(GrowerType.INCUBATOR);

            self.tableSpacePetri = new TableSpaceModel(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpaceModel(ContainerType.MICROTITER);
            self.tubeRack = new TubeRackModel();

            self.temperatureText = ko.computed(function() {
                //TODO when displaying, use parseFloat("123.456").toFixed(2); (see answer #2 in http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript)
                return '' + self.temperature().toFixed(1) + ' °C'; // TODO
            });

            self.timerText = ko.computed(function() {
                return '' + Math.round(self.timer()) + ' h';
            });

            self.activate = function() {
                self.turnedOn(!self.turnedOn());// toggles self.turnedOn

                if(self.turnedOn()) // User starts the run
                {

                    var timerID = _.delay(self.growOneHour(), 100);
                    self.timerID(timerID);

                    // For-løkke med mindre steps?

                }else // User stops the run
                {
                    clearTimeout(self.timerID());
                    self.timerID(null);

                    // TODO stop current run
                }

                // TODO implement growth-caller


                throw 'JegErHerIkke, Derfor: Undtagelsestilstand';
            };

            self.growOneHour = function() //Grows all containers one hour
            {
                if(self.timer() < 1)
                {
                    clearTimeout(self.timerID());
                    self.turnedOn(false);
                    self.timerID(null);
                    return;
                }

                var deltaTime = 1.0 / self.hourResolution();

                for(var i = 0; i < self.hourResolution(); i++)
                {
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
