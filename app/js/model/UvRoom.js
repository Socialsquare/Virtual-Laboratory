define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/TableSpace',
    'model/type/Container'
], function(ko, Base, TubeRackModel, TableSpaceModel, ContainerType) {

    var UvRoom = Base.extend({
        constructor: function () {
            var self = this;

            // TODO: These are special cases, as they have another view (with an additional case too! (empty, full and glowing))
            /*self.tableSpacePetri = new TableSpaceModel(ContainerType.PETRI_DISH);
            self.tableSpaceMicro = new TableSpaceModel(ContainerType.MICROTITER);
            self.tubeRack = new TubeRackModel();*/
        }
    });

    return UvRoom;
});
