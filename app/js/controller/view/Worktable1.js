define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'model/type/Container',
    'controller/SimpleContainer',
    'controller/CompositeContainer'
], function (ko, $, BaseViewController, ContainerType, SimpleContainerController, CompositeContainerController) {

    var Worktable1 = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('worktable1');

            self.worktable1 = self.gameState.worktable1;

            var tubeRackGuard = function () {// TODO: Fyr på hele worktable 1.
                if (!self.worktable1.bunsenBurner()) {
                    self.popupController.message('worktable1.bunsen_required.header', 'worktable1.bunsen_required.body');
                    return false;
                }
                return true;
            };

            self.tableSpacePetriController = new CompositeContainerController(self.worktable1.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.worktable1.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.worktable1.tubeRack);
            self.tubeRackController.dropGuard = tubeRackGuard;
            self.heaterController = new CompositeContainerController(self.worktable1.heater);
            self.electroporatorController = new SimpleContainerController(self.worktable1.electroporator); //TODO: simpleContainerController

            self.toggleBunsen = function () {
                self.worktable1.bunsenBurner.toggle();
                self.experimentController.triggerActivation(self.ActivationType.BUNSEN, self.worktable1.bunsenBurner());
            };

            self.toggleHeater = function () {
                self.worktable1.heater.status.toggle();
                self.experimentController.triggerActivation(self.ActivationType.HEATER, self.worktable1.heater);
            };

            self.activateElectroporator = function () {
                self.worktable1.electroporator.activate();
                self.experimentController.triggerActivation(self.ActivationType.ELECTROPORATOR, self.worktable1.electroporator);
            };
        }
    });

    return Worktable1;
});
