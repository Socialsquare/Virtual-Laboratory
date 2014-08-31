define([
    'knockout',
    'jquery',
    'lodash',
    'screenfull',

    'controller/view/Base',
    'controller/Popup',
    'controller/Quiz',
    'controller/Experiment',

    'model/GameState',
    'model/Tip',
    'model/type/Container',
    'model/type/SpecialItem',
    'model/Quiz',

    'utils/ImageHelper',
    'utils/TextHelper',
    'utils/DragHelper'
], function (ko, $, _, screenfull, BaseViewController, popupController, quizController, experimentController, gameState,
             TipModel, ContainerType, SpecialItemType, QuizModel, ImageHelper, TextHelper, DragHelper) {

    var MenuController = BaseViewController.extend({

        constructor: function () {
            var self = this;

            self.ImageHelper = ImageHelper;
            self.DragHelper = DragHelper;
            self.popupController = popupController;
            self.quizController = quizController;
            self.gameState = gameState;

            // TODO: hardcoded width :*(
            self.inventoryWidth = 462;
            self.scrollInterval = null;
            self.scrollRight = false;
            self.scrollValue = ko.observable(0);

            self.scrollInventory = function (scrollRight) {
                self.stopScroll();

                if (!self.canScroll())
                    return;

                self.scrollRight = scrollRight;
                self.scrollInterval = window.setInterval(self.scrollStep, 20);
            };

            self.scrollStep = function () {
                var diff = self.scrollRight ? -7 : 7;
                self.scrollValue(self.scrollValue() + diff);

                self.boundScroll();
            };

            self.boundScroll = function () {
                if (!self.canScroll()) {
                    self.scrollValue(0);
                    self.stopScroll();
                    return;
                }

                if (self.scrollValue() > 0) {
                    self.scrollValue(0);
                    self.stopScroll();
                }

                var maxVal = self.inventoryWidth - self.inventoryItemsWidth();
                if (self.scrollValue() < maxVal) {
                    self.scrollValue(maxVal);
                    self.stopScroll();
                }
            };

            self.gameState.inventory.items.subscribe(function () {
                self.boundScroll();
            });

            self.inventoryItemsWidth = function () {
                return self.gameState.inventory.items().length * 91;
            };

            self.canScroll = ko.computed(function () {
                return self.inventoryItemsWidth() > self.inventoryWidth;
            });

            self.stopScroll = function () {
                window.clearInterval(self.scrollInterval);
            };

            self.showInformation = function() {
                self.popupController.show('popup-instruments');
            };

            self.selectExperiment = function () {
                self.router.navigate('loading');
            };

            self.fullscreen = function () {
                var body = document.getElementsByTagName('body')[0];
                if (screenfull.enabled) {
                    screenfull.toggle(body);
                    $("#app").toggleClass('fullscreen', screenfull.isFullscreen);
                } else {
                    alert('Full screen is not supported on your device :(');
                }
            };

            self.inventoryDropHandler = function (item) {
                if (self.gameState.inventory.hasItem(item))
                    return false;

                self.gameState.inventory.add(item);
            };

            self.showGuide = function () {
                self.popupController.showGuide(experimentController);
            };

            self.togglePipette = function (activeViewController) {
                self.gameState.pipette.active.toggle();
            };

            self.tipDropHandler = function (pipette) {
                if (!self.gameState.pipette.hasTip()) {
                    self.gameState.pipette.addAt(0, new TipModel());
                } else {
                    self.popupController.notify('pipette.existing_tip.header', 'pipette.existing_tip.body');
                }
                return false;
            };

            self.trashDropHandler = function (item, consume) {
                if (item.type() === ContainerType.PIPETTE) {
                    self.gameState.pipette.removeTip();
                } else {
                    self.popupController.confirm('popup.confirm_delete.header', 'popup.confirm_delete.body')
                        .then(consume);
                }
                return false;
            };

            self.showItemDetails = function (item) {
                var nonWriteables = [SpecialItemType.SCALPEL, SpecialItemType.SPLEEN,
                    SpecialItemType.WASH_BOTTLE, SpecialItemType.BUFFER];

                if (_.contains(nonWriteables, item.type()))
                    self.popupController.message(TextHelper.prettyName(item), TextHelper.description(item));
                else
                    self.popupController.itemDetail(item);
            };
        }
    });

    return MenuController;
});
