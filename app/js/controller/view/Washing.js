define([
    'knockout',
    'controller/view/Base',
    'controller/CompositeContainer'
], function (ko, BaseViewController, CompositeContainerController) {

    var Washing = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('washing');

            self.washing = self.gameState.washing;

            // TODO: This is a special case, as the tubes are not allowed to leave the room
            /*self.tubeRackController = new CompositeContainerController(self.fumehood.tubeRack);*/
        }

    });

    return Washing;
});

