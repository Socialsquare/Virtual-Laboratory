define([
    'knockout',
    'controller/view/Base',
    'model/GameState',
    'utils/Imager'
], function (ko, BaseViewController, gameState, Imager) {

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
        }
    });

    return FermentorScreen;
});
