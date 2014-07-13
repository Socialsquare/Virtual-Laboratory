define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'model/type/Container',
    'controller/CompositeContainer'
], function (ko, $, BaseViewController, ContainerType, CompositeContainerController) {

    var Worktable1 = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('worktable1');

            self.worktable1 = self.gameState.worktable1;

            var tubeRackGuard = function () {
                if (!self.worktable1.bunsenBurner()) {
                    self.popupController.message('Hov hov du', 'Du skal tænde bunsenbrænderen før du arbejder ved bordet.');
                    return false;
                }

                return true;
            };

            self.tableSpacePetriController = new CompositeContainerController(self.worktable1.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.worktable1.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.worktable1.tubeRack);
            self.tubeRackController.dropGuard = tubeRackGuard;
            self.heaterController = new CompositeContainerController(self.worktable1.heater);

            self.toggleBunsen = function () {
                self.worktable1.bunsenBurner.toggle();
            };

            self.toggleHeater = function () {
                self.worktable1.heater.status.toggle();
            };

            self.activateElectroporator = function () {
                self.worktable1.electroporator.activate();
            };
        }
    });

    return Worktable1;
});
