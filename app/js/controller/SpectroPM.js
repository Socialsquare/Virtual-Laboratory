define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, Notifier, gameState, Imager) {

    var SpectroPM = BaseViewController.extend({

        gameState: gameState,
        spectroPM: gameState.spectroPM,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('spectropm');

        }
    });

    return SpectroPM;
});

