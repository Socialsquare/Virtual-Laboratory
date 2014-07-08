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
		tableSpacePetri: new TableSpace(ContainerType.PETRI_DISH),
		tableSpaceMicro: new TableSpace(ContainerType.MICROTITER),
		tubeRack: new TubeRack(),
		bunsenBurner: ko.observable(false),
		electroporator: new Electroporator(),
		heater: new Heater(),

        constructor: function () {
            var self = this;

        }
    });

    return Worktable1Model;
});
