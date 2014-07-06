define([
    'knockout',

    'controller/Base',

    'model/GameState'
], function (ko, BaseController, gameState) {

    var MenuController = BaseController.extend({

        gameState: gameState,

        back: function () {
            console.log('TODO: Go back');
        },

        fullscreen: function () {
            console.log('TODO: Go fullscreen');
        },

        selectExperiment: function () {
            console.log('TODO: Select experiment');
        }
    });

    return MenuController;
});
