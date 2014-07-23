define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container',
    'model/type/Location'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType, LocationType) {

    var UvRoom = Base.extend({
        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel(3, ContainerType.UV_PETRI_SPACE);
            self.tableSpacePetri.location(LocationType.UVROOM);

            self.tableSpaceMicro = new MicroSpaceModel(ContainerType.UV_MICRO_SPACE);
            self.tableSpaceMicro.location(LocationType.UVROOM);

            self.tubeRack = new TubeRackModel(ContainerType.UV_TUBE_RACK);
            self.tubeRack.location(LocationType.UVROOM);

            self.reset = function () {
                self.tableSpacePetri.removeAll();
                self.tableSpaceMicro.removeAll();
                self.tubeRack.removeAll();
            };
        }
    });

    return UvRoom;
});
