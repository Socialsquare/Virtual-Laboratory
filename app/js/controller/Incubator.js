define([
    'knockout',
    'controller/BaseView',
    'model/GameState',
    'utils/Imager'
], function (ko, BaseViewController, gameState, Imager) {

    var IncubatorController = BaseViewController.extend({

        gameState: gameState,
        incubator: gameState.incubator,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('incubator');

            self.toggleState = function () {
                self.incubator.turnedOn.toggle();
            };

            self.changeTemp = function(val) {
                self.incubator.temperature(self.incubator.temperature() + val);
            };

            self.changeTimer = function(val) {
                if (self.incubator.timer() + val < 0) {
                    self.incubator.timer(0);
                } else {
                    self.incubator.timer(self.incubator.timer() + val);
                }
            };
        },
    });

    return IncubatorController;
});
