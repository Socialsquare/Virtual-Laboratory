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

            // TODO: These are special cases, as they have another view (with an additional case too! (empty, full and glowing))
            self.tubeRackController = new CompositeContainerController(self.uvroom.tubeRack);
        }

    });

    return UvRoom;
});
