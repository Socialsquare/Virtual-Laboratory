define([
    'knockout',
    'jquery',
    'base',
    'screenfull',
    'model/GameState',
    'utils/Imager',
    'model/ContainerType',
    'controller/Popup'
], function (ko, $, Base, screenfull, gameState, Imager, ContainerType, popupController) {

    var MenuController = Base.extend({

        gameState: gameState,

        Imager: Imager,

        constructor: function () {
            var self = this;
            /*self.isFullscreen = ko.observable(false);*/

            self.popupController = popupController;

            self.fullscreen = function () {
                var body = document.getElementsByTagName('body')[0];

                if (screenfull.enabled) {

                    screenfull.toggle(body);

                    if(screenfull.isFullscreen) {
                        $(body).addClass('fixed');
                    }else {
                        $(body).removeClass('fixed');
                    }
                }else {
                    alert('Full screen is not supported on your decide :( - let me guess, it is an Apple device?');
                }
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
