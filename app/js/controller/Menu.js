define([
    'knockout',

    'controller/Base',

    'model/GameState'
], function (ko, BaseController, gameState) {

    var MenuController = BaseController.extend({

        gameState: gameState,

        fullscreen: function () {
            console.log('TODO: Go fullscreen');
        },

        selectExperiment: function () {
            console.log('TODO: Select experiment');
        }
    });

    return MenuController;
});
