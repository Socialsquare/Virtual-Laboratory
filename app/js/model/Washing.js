define([
    'knockout',
    'model/CompositeContainer',
    'model/WashingTank',
    'model/type/Container'
], function(ko, CompositeContainerModel, WashingTankModel, ContainerType) {
    var Washing = CompositeContainerModel.extend({
        constructor: function () {
            var self = this;
            self.base(1, ContainerType.WASHING_TANK, ContainerType.WASHING);
            self.addAt(0, new WashingTankModel());
            // TODO: This is a special case, as the tubes are not allowed to leave the room
            /*self.tubeRack = new TubeRackModel();*/
        }
    });

    return Washing;
});

