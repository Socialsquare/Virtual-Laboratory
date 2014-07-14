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

            self.tubeRackController = new CompositeContainerController(self.washing.tubeRack);
        }
    });

    return Washing;
});
