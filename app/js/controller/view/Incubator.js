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
                var newVal = self.incubator.timer() + val;
                newVal = newVal < 0 ? 0 : newVal;
                self.incubator.timer(newVal);
            };
        },
    });

    return IncubatorController;
});
