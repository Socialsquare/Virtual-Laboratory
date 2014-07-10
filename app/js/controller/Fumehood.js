define([
    'knockout',
    'controller/BaseView',
    'model/GameState',
    'utils/Imager'
], function (ko, BaseViewController, gameState, Imager) {

    var Fumehood = BaseViewController.extend({

        gameState: gameState,
        fumehood: gameState.fumehood,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('fumehood');
        }

    });

    return Fumehood;
});
