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

            // TODO: These are special cases, as they have another view (with an additional case too! (empty, full and glowing))
            self.tubeRack = new TubeRackModel();
        }
    });

    return UvRoom;
});
