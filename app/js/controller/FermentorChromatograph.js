define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, Notifier, gameState, Imager) {

    var FermentorChromatograph = BaseViewController.extend({

        gameState: gameState,
        FermentorChromatograph: gameState.FermentorChromatograph,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('fermentorchromatograph');

        }
    });

    return FermentorChromatograph;
});

