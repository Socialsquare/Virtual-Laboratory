define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/ODMachine'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType, ODMachineModel) {

    var Worktable2 = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpaceMicro = new MicroSpaceModel();
            self.tubeRack = new TubeRackModel();
            self.odMachine = new ODMachineModel();

            // TODO: blender
        }
    });

    return Worktable2;
});
