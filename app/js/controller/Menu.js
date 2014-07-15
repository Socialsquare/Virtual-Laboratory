define([
    'knockout',
    'jquery',
    'screenfull',

    'controller/view/Base',
    'controller/Popup',
    'controller/Router',

    'model/GameState',
    'model/Tip',
    'model/type/Container',
    'model/type/SpecialItem',

    'utils/ImageHelper',
    'utils/TextHelper'
], function (ko, $, screenfull, BaseViewController, popupController, router,
             gameState, TipModel, ContainerType, SpecialItemType, ImageHelper, TextHelper) {

    var MenuController = BaseViewController.extend({

        constructor: function () {
            var self = this;

            self.ImageHelper = ImageHelper;
            self.popupController = popupController;
            self.gameState = gameState;
            self.router = router;

            self.scrollInterval = null;
            self.scrollRight = false;

            self.scrollInventory = function (scrollRight) {
                self.scrollRight = scrollRight;
                self.scrollInterval = window.setInterval(self.doScroll, 20);
            };

            self.doScroll = function () {
                var pos = parseInt($('.hud .inventory ul').css('left'), 10);
                var width = parseInt($('.hud .inventory ul').width(), 10);
                var containerWidth = parseInt($('.hud .inventory').width(), 10);
                if (self.scrollRight && pos > -width)
                    $('.hud .inventory ul').css('left', '-=3');
                if (!self.scrollRight && pos < 0)
                    $('.hud .inventory ul').css('left', '+=3');
                // && $('.hud .inventory ul').css('left') < 0
                // && $('.hud .inventory ul').css('left') > $('.hud .inventory ul').width()
            };

            self.stopScroll = function () {
                window.clearInterval(self.scrollInterval);
            };

            self.selectExperiment = function () {
                self.router.navigate('loading');
            };

            self.fullscreen = function () {
                var body = document.getElementsByTagName('body')[0];

                if (screenfull.enabled) {
                    screenfull.toggle(body);

                    $(body).toggleClass('fixed', screenfull.isFullscreen);
                } else {
                    alert('Full screen is not supported on your device :( - let me guess, it is an Apple device?');
                }
            };

            self.inventoryDropHandler = function (item) {
                if (self.gameState.inventory.hasItem(item))
                    return false;

                self.gameState.inventory.add(item);
            };

            self.handlePipetteTip = function () {
                if (!self.gameState.pipette.hasTip()) {
                    self.gameState.pipette.addAt(0, new TipModel());
                }
            };

            self.togglePipette = function (activeViewController) {
                // var acceptedViews = [
                //     'worktable1',
                //     'worktable2',
                //     'fumehood'
                // ];

                // if (acceptedViews.indexOf(activeViewController.templateName) < 0) {
                //     console.log('Can\'t use pipette here, dumdum');
                //     return;
                // }

                self.gameState.pipette.active.toggle();
            };

            self.trashDropHandler = function (item, consume) {
                if (item.type() === ContainerType.PIPETTE) {
                    self.popupController.confirm("Bekræft", "Vil du fjerne pipette spidsen?", function (answer) {
                        self.gameState.pipette.removeTip();
                    });
                } else {
                    self.popupController.confirm("Bekræft", "Er du sikker på du vil slette?", function (answer) {
                        if (answer) consume();
                    });
                }
                return false;
            };

            self.showItemDetails = function (item) {
                var accepted = [SpecialItemType.SCALPEL, SpecialItemType.SPLEEN];

                if (_.contains(accepted, item.type()))
                    self.popupController.message(TextHelper.prettyName(item), TextHelper.description(item));
                else
                    self.popupController.itemDetail(item);
            };
        }
    });

    return MenuController;
});
