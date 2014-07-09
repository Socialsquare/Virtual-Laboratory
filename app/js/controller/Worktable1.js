define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, Notifier, gameState, Imager) {

    var Worktable1 = BaseViewController.extend({

        gameState: gameState,
        worktable1: gameState.worktable1,
        Imager: Imager,

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

            self.handleDrop = function () {

            };
        }
    });

    return Worktable1;
});
