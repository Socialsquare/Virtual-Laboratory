define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container'

], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType) {

    var UvRoom = Base.extend({
        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel(3, ContainerType.UV_PETRI_SPACE);
            self.tableSpaceMicro = new MicroSpaceModel(ContainerType.UV_MICRO_SPACE);
            self.tubeRack = new TubeRackModel(ContainerType.UV_TUBE_RACK);
        }
    });

    return UvRoom;
});
