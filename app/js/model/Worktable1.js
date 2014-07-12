define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/ContainerType',
    'model/Heater',
    'model/Electroporator'
], function(ko, Base, TubeRackModel, TableSpaceModel,
            ContainerTypeModel, HeaterModel, ElectroporatorModel) {

    var Worktable1 = Base.extend({

        constructor: function () {
            var self = this;

            self.tableSpacePetri = new TableSpaceModel(ContainerTypeModel.PETRI_DISH);
            self.tableSpaceMicro = new TableSpaceModel(ContainerTypeModel.MICROTITER);
            self.tubeRack = new TubeRackModel();
            self.bunsenBurner = ko.observable(false);
            self.electroporator = new ElectroporatorModel();
            self.heater = new HeaterModel();
        }
    });

    return Worktable1;
});
