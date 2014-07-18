define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/Heater',
    'model/Electroporator',
    'model/type/Location'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerTypeModel, HeaterModel, ElectroporatorModel, LocationType) {

    var Worktable1 = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpacePetri.location(LocationType.WORKTABLE1);

            self.tableSpaceMicro = new MicroSpaceModel();
            self.tableSpaceMicro.location(LocationType.WORKTABLE1);

            self.tubeRack = new TubeRackModel();
            self.tubeRack.location(LocationType.WORKTABLE1);

            self.bunsenBurner = ko.observable(false);
            self.electroporator = new ElectroporatorModel();
            self.heater = new HeaterModel();
        }
    });

    return Worktable1;
});
