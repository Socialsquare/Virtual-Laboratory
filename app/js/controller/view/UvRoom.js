define([
    'knockout',
    'controller/view/Base',
    'controller/CompositeContainer'

], function (ko, BaseViewController, CompositeContainerController) {

    var UvRoom = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('uvroom');

            self.uvroom = self.gameState.uvroom;

            self.tableSpacePetriController = new CompositeContainerController(self.uvroom.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.uvroom.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.uvroom.tubeRack);
        }
    });

    return UvRoom;
});
