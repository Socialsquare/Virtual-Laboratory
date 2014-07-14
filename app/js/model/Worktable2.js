define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/ODMachine',
    'model/Blender'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType, ODMachineModel, BlenderModel) {

    var Worktable2 = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpaceMicro = new MicroSpaceModel();
            self.tubeRack = new TubeRackModel();
            self.odMachine = new ODMachineModel();
            self.blender = new BlenderModel();
        }
    });

    return Worktable2;
});
