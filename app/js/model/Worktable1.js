define([
    'knockout',
	'base',
	'model/TubeRack',
	'model/TableSpace',
    'model/ContainerType',
    'model/Heater',
    'model/Electroporator'
], function(ko, Base, TubeRack, TableSpace, ContainerType, Heater, Electroporator) {

	var Worktable1Model = Base.extend({


        constructor: function () {
            var self = this;

            self.tableSpacePetri = new TableSpace(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpace(ContainerType.MICROTITER);
            self.tubeRack = new TubeRack();
            self.bunsenBurner = ko.observable(false);
            self.electroporator = new Electroporator();
            self.heater = new Heater();
        }
    });

    return Worktable1Model;
});
