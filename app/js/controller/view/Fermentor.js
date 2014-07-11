define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'controller/Notifier',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, Notifier, gameState, Imager) {

    var Fermentor = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fermentor');

            self.fermentor = self.gameState.fermentor;
        }
    });

    return Fermentor;
});
