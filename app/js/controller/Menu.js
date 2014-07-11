define([
    'knockout',
    'base',
    'screenfull',
    'model/GameState',
    'utils/Imager',
    'model/ContainerType',
    'controller/Popup'
], function (ko, Base, screenfull, gameState, Imager, ContainerType, popupController) {

    var MenuController = Base.extend({

        gameState: gameState,

        Imager: Imager,

        constructor: function () {
            var self = this;
            /*self.isFullscreen = ko.observable(false);*/

            self.popupController = popupController;

            self.fullscreen = function () {
                //As per http://updates.html5rocks.com/2011/10/Let-Your-Content-Do-the-Talking-Fullscreen-API
                //var el = document.getElementById('view-container');
                var body = document.getElementsByTagName('body')[0];

                debugger;

                if (screenfull.enabled) {
                    screenfull.toggle(body);
                }

                /*if(self.isFullscreen()) {
                    debugger;
                    self.isFullscreen(false);

                    *//*document.webkitExitFullscreen();
                    document.mozCancelFullscreen();
                    document.exitFullscreen();*//*
                }
                else {
                    *//*debugger;
                    self.isFullscreen(true);
                    body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    body.mozRequestFullScreen();
                    body.requestFullscreen(); // Opera*//*
                }*/

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
