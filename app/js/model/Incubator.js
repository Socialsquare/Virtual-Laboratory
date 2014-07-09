define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/ContainerType'
], function(ko, Base, TubeRack, TableSpace, ContainerType) {

    var IncubatorModel = Base.extend({

        constructor: function () {
            var self = this;

            self.temperature = ko.observable(30.0);

            self.tableSpacePetri = new TableSpace(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpace(ContainerType.MICROTITER);
            self.tubeRack = new TubeRack();

            self.activate = function() {
                // TODO implement
                throw 'JegErHerIkke, Derfor: Undtagelsestilstand';
            };

            self.increaseTemp = function() {
                self.temperature(self.temperature() + 0.5);
            };

            self.decreaseTemp = function() {
                self.temperature(self.temperature() - 0.5);
            }

            //TODO when displaying, use parseFloat("123.456").toFixed(2); (see answer #2 in http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript)


        }


    });

    return IncubatorModel;
});