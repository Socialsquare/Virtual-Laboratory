define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Container'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, ContainerType) {

    var Fumehood = Base.extend({
        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpaceMicro = new MicroSpaceModel();
            self.tubeRack = new TubeRackModel();
        }
    });

    return Fumehood;
});
