define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'model/ContainerType'
], function (ko, $, BaseViewController, ContainerType) {

    var Worktable1 = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('worktable1');

            self.worktable1 =  self.gameState.worktable1;

            self.toggleBunsen = function () {
                self.worktable1.bunsenBurner.toggle();
            };

            self.toggleHeater = function () {
                self.worktable1.heater.status.toggle();
            };

            self.activateElectroporator = function () {
                self.worktable1.electroporator.activate();
            };

            self.handleTubeRackDrop = function (position, tube) {
                self.worktable1.tubeRack.addAt(position, tube);
            };
        }
    });

    return Worktable1;
});
