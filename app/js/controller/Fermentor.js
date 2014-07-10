define([
    'knockout',
    'jquery',
    'controller/BaseView',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, Notifier, gameState, Imager) {

    var Fermentor = BaseViewController.extend({

        gameState: gameState,
        fermentor: gameState.fermentor,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('fermentor');

        }
    });

    return Fermentor;
});

