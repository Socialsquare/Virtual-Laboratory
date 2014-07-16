define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController, gameState) {

    var FermentorScreen = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fermentorscreen');

            self.fermentor = self.gameState.fermentor;

            self.changeTemp = function(val) {
                self.fermentor.temperature(self.fermentor.temperature() + val);
            };

            self.changePh = function(val) {
                self.fermentor.ph(self.fermentor.ph() + val);
            };

            self.activateFermentor = function () {
                self.fermentor.activate();
            };

        }
    });

    return FermentorScreen;
});
