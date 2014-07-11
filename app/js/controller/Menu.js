define([
    'knockout',
    'base',
    'model/GameState',
    'utils/Imager',
    'model/ContainerType',
    'controller/Popup'
], function (ko, Base, gameState, Imager, ContainerType, popupController) {

    var MenuController = Base.extend({

        gameState: gameState,

        Imager: Imager,

        constructor: function () {
            var self = this;

            self.popupController = popupController;

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

            self.showItemDetails = function (item) {
                self.popupController.message(item.type(), 'Jeg er beskrivelsen. Ret sygt alligevel.');
            };
        }
    });

    return MenuController;
});
