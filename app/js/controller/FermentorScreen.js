define([
    'knockout',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, BaseViewController, Notifier, gameState, Imager) {

    var FermentorScreen = BaseViewController.extend({

        gameState: gameState,
        fermentor: gameState.fermentor,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('fermentorscreen');



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


