define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/Heater',
    'model/Electroporator'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerTypeModel, HeaterModel, ElectroporatorModel) {

    var Worktable1 = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpaceMicro = new MicroSpaceModel();
            self.tubeRack = new TubeRackModel();
            self.bunsenBurner = ko.observable(false);
            self.electroporator = new ElectroporatorModel();
            self.heater = new HeaterModel();
        }
    });

    return Worktable1;
});
