define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/ODMachine',
    'model/Blender',
    'model/type/Location'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType, ODMachineModel, BlenderModel, LocationType) {

    var Worktable2 = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpacePetri.location(LocationType.WORKTABLE2);

            self.tableSpaceMicro = new MicroSpaceModel();
            self.tableSpaceMicro.location(LocationType.WORKTABLE2);

            self.tubeRack = new TubeRackModel();
            self.tubeRack.location(LocationType.WORKTABLE2);

            self.odMachine = new ODMachineModel();
            self.blender = new BlenderModel();
        }
    });

    return Worktable2;
});
