define([
    'knockout',
	'base',
	'model/TubeRack',
	'model/TableSpace',
    'model/ContainerType'
], function(ko, Base, TubeRack, TableSpace, ContainerType) {

	var Worktable1Model = Base.extend({
		tableSpacePetri: new TableSpace(ContainerType.PETRI_DISH),
		tableSpaceMicro: new TableSpace(ContainerType.MICROTITER),
		tubeRack: new TubeRack(),
		bunsenBurner: ko.observable(false),
		electroporator: new Container(),
		heater: {
			content: new Array(maxHeaterTubes),
			status: false //true = on, false = off
		},

        constructor: function () {
            var self = this;


        }
    });

    return Worktable1Model;
});
