define([
    'knockout',
    'jquery',
    'lodash',
    'screenfull',

    'controller/view/Base',
    'controller/Popup',
    'controller/Quiz',

    'model/GameState',
    'model/Tip',
    'model/type/Container',
    'model/type/SpecialItem',
    'model/Quiz',

    'utils/ImageHelper',
    'utils/TextHelper'
], function (ko, $, _, screenfull, BaseViewController, popupController, quizController, gameState,
             TipModel, ContainerType, SpecialItemType, QuizModel, ImageHelper, TextHelper) {

    var MenuController = BaseViewController.extend({

        constructor: function () {
            var self = this;

            self.ImageHelper = ImageHelper;
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
                var diff = self.scrollRight ? -3 : 3;
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

            self.inventoryItemsWidth = ko.computed(function () {
                return self.gameState.inventory.items().length * 91;
            });

            self.canScroll = ko.computed(function () {
                return self.inventoryItemsWidth() > self.inventoryWidth;
            });

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
                    $("#app").toggleClass('fullscreen', screenfull.isFullscreen);
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

            self.testQuiz = function () {
                var quiz = {
                    "dk": {
                        "id": 0,
                        "name": "Fodbold quizzen",
                        "video": "fast-loop",
                        "question": "Hvor god er Messi til fodbold?",
                        "correct": 1,
                        "answers": [
                            {
                                "id": 0,
                                "answer": "Ret god",
                                "message": "Det er ikke helt korrekt fordi den her besked er lidt lang og det er jo fint nok kan man sige, men sjovt nok helt der ude."
                            },
                            {
                                "id": 1,
                                "answer": "Den bedste af dem alle",
                                "message": "Ja nemlig ja"
                            },
                            {
                                "id": 2,
                                "answer": "Ikke vildt god, men stadig okay",
                                "message": "Helt forkert svar du gav"
                            }
                        ]
                    }
                };

                self.quizController.startQuiz(new QuizModel(quiz.dk));
            };

            self.togglePipette = function (activeViewController) {
                self.gameState.pipette.active.toggle();
            };

            self.trashDropHandler = function (item, consume) {
                if (item.type() === ContainerType.PIPETTE) {
                    self.gameState.pipette.removeTip();
                } else {
                    self.popupController.confirm('popup.confirm_delete_header', 'popup.confirm_delete_body', function (answer) {
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
