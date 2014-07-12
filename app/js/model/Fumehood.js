define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/type/Container'
], function(ko, Base, TubeRackModel, TableSpaceModel, ContainerType) {

    var Fumehood = Base.extend({
        constructor: function () {
            var self = this;

            self.tableSpacePetri = new TableSpaceModel(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpaceModel(ContainerType.MICROTITER);
            self.tubeRack = new TubeRackModel();
        }
    });

    return Fumehood;
});
