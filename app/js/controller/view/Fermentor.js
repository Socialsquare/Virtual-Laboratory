define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'model/GameState',
    'utils/Imager'
], function (ko, $, BaseViewController, gameState, Imager) {

    var Fermentor = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('fermentor');

            self.fermentor = self.gameState.fermentor;
        }
    });

    return Fermentor;
});
