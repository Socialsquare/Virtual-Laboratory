define([
    'knockout',
    'controller/view/Base',
    'controller/CompositeContainer'
], function (ko, BaseViewController, CompositeContainerController) {

    var Fumehood = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fumehood');

            self.fumehood = self.gameState.fumehood;

            self.tableSpacePetriController = new CompositeContainerController(self.fumehood.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.fumehood.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.fumehood.tubeRack);
        }

    });

    return Fumehood;
});
