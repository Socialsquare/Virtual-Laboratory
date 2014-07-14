define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'screenfull',
    'model/type/Container',
    'controller/Popup',
    'utils/ImageHelper'
], function (ko, $, BaseViewController, screenfull, ContainerType, popupController, ImageHelper) {

    var MenuController = BaseViewController.extend({

        ImageHelper: ImageHelper,

        constructor: function () {
            var self = this;
            /*self.isFullscreen = ko.observable(false);*/

            self.popupController = popupController;

            self.selectExperiment = function () {
                console.log('TODO: Select experiment');
            };

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

            self.inventoryDropHandler = function (item) {
                if (self.gameState.inventory.hasItem(item))
                    return false;

                self.gameState.inventory.add(item);
            };

            self.togglePipette = function (activeViewController) {
                var acceptedViews = [
                    'worktable1',
                    'worktable2',
                    'fumehood'
                ];

                if (acceptedViews.indexOf(activeViewController.templateName) < 0) {
                    console.log('Can\'t use pipette here, dumdum');
                    return;
                }

                console.log('TODO: pipette');
            };

            self.trashDropHandler = function (item, consume) {
                self.popupController.confirm("Bekreft", "Er du sikker på du vil slette?",
                                             function (answer) { if (answer) consume(); });
                return false;
            };

            self.showItemDetails = function (item) {
                self.popupController.message(item.type(), 'Jeg er beskrivelsen. Ret sygt alligevel.');
            };
        }
    });

    return MenuController;
});
