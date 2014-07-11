define([
    'knockout',
    'base',
    'model/GameState',
    'utils/Imager',
    'model/ContainerType'
], function (ko, Base, gameState, Imager, ContainerType) {

    var MenuController = Base.extend({

        gameState: gameState,

        Imager: Imager,

        constructor: function () {
            var self = this;

            self.fullscreen = function () {
                console.log('TODO: Go fullscreen');
            };

            self.selectExperiment = function () {
                console.log('TODO: Select experiment');
            };

            self.inventoryDropHandler = function (item) {
                self.gameState.inventory.add(item);
            };

            self.trashDropHandler = function (item) {
                console.log('TODO: trash drop handler', item);
            };
        }
    });

    return MenuController;
});
