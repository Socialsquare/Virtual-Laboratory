define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController) {

    var IncubatorController = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('incubator');

            self.incubator = self.gameState.incubator;

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
