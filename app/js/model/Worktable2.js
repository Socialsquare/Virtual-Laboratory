define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/ContainerType',
    'model/ODMachine'
], function(ko, Base, TubeRack, TableSpace, ContainerType, ODMachine) {

    var Worktable2Model = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new TableSpace(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpace(ContainerType.MICROTITER);
            self.tubeRack = new TubeRack();
            self.odMachine = new ODMachine();

            // TODO blender

        }
/*
        id: null,
		tableItems: new Array(maxPetridishNum),
		testTubes: new Array(maxTestTubeNum),
		centrifugeTubes: new Array(maxCentrifugeTubeNum),
		blender: {
			dirty: false,
			content: null
		},
		OD: null,
*/

    });

    return Worktable2Model;
});
