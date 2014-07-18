define([
    'knockout',
    'base',
    'model/TubeRack',
    'model/PetriSpace',
    'model/MicroSpace',
    'model/type/Location'
], function(ko, Base, TubeRackModel, PetriSpaceModel, MicroSpaceModel, LocationType) {

    var Fumehood = Base.extend({
        constructor: function () {
            var self = this;

            self.tableSpacePetri = new PetriSpaceModel();
            self.tableSpacePetri.location(LocationType.FUMEHOOD);

            self.tableSpaceMicro = new MicroSpaceModel();
            self.tableSpaceMicro.location(LocationType.FUMEHOOD);

            self.tubeRack = new TubeRackModel();
            self.tubeRack.location(LocationType.FUMEHOOD);
        }
    });

    return Fumehood;
});
