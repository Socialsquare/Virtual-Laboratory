define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, Notifier, gameState, Imager) {

    var FermentorScreen = BaseViewController.extend({

// TODO is it problematic that the view-controllers FermentorScreen and FermentorChromatograph both exist?

        gameState: gameState,
        FermentorChromatograph: gameState.FermentorChromatograph,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('fermentorscreen');

        }
    });

    return FermentorScreen;
});


