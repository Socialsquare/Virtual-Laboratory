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

            self.worktable1 =  self.gameState.worktable1;

            self.tableSpacePetriController = new CompositeContainerController(self.worktable1.tableSpacePetri);
            self.tableSpaceMicroController = new CompositeContainerController(self.worktable1.tableSpaceMicro);
            self.tubeRackController = new CompositeContainerController(self.worktable1.tubeRack);

            self.toggleBunsen = function () {
                self.worktable1.bunsenBurner.toggle();
            };

            self.toggleHeater = function () {
                self.worktable1.heater.status.toggle();
            };

            self.activateElectroporator = function () {
                self.worktable1.electroporator.activate();
            };

            // self.handleTubeRackDrop = function (position, tube) {
            //     if (!self.worktable1.bunsenBurner()) {
            //         self.popupController.message('Hov hov du',
            //                                      'Du skal tænde bunsenbrænderen før du arbejder ved bordet.');
            //         return false;
            //     }

            //     self.worktable1.tubeRack.addAt(position, tube);
            // };

            self.handleHeaterDrop = function (position, plate) {
                self.worktable1.tableSpaceMicro.addAt(position, plate);
            };
        }
    });

    return Worktable1;
});
