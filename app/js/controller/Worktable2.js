define([
    'knockout',
    'controller/BaseView',
    'model/GameState',
    'utils/Imager'
], function (ko, BaseViewController, gameState, Imager) {

    var Worktable2 = BaseViewController.extend({

        gameState: gameState,
        worktable2: gameState.worktable2,
        Imager: Imager,

        constructor: function () {
            var self = this;
            self.base('worktable2');

        }

    });

    return Worktable2;
});
