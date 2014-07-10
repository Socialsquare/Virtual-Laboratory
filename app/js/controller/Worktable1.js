define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager',
    'utils/DragHelper',
    'model/ContainerType'
], function (ko, $, BaseViewController, Notifier, gameState, Imager, DragHelper, ContainerType) {

    var Worktable1 = BaseViewController.extend({

        gameState: gameState,
        worktable1: gameState.worktable1,
        Imager: Imager,
        DragHelper: DragHelper,

        constructor: function () {
            var self = this;
            self.base('worktable1');

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
                gameState.inventory.remove(tube);
                self.worktable1.tubeRack.addAt(position, tube);
            };

            self.acceptDrop = function (item) {
                return item.type() === ContainerType.TUBE;
            };
        }
    });

    return Worktable1;
});
