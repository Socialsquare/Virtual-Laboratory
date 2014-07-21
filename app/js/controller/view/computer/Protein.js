define([
    'knockout',

    'controller/view/computer/Base',
    'controller/Popup',

    'model/GameState',
    'model/type/Liquid',

    'factory/Liquid',
    'factory/Container',

    'utils/TextHelper'
], function (ko, BaseComputer, popupController, gameState, LiquidType, LiquidFactory, ContainerFactory, TextHelper) {

    var Protein = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-order-protein', 'computer.screen.protein');

            self.TextHelper = TextHelper;

            self.availableProteins = ko.observableArray([
                LiquidFactory.insulin(),
                LiquidFactory.lipase(),
                LiquidFactory.antibodyGout(),
                LiquidFactory.antibodySmallpox()
            ]);

            self.selectedIndex = ko.observable(0);
            self.selectedProtein = ko.computed(function () {
               return self.availableProteins()[self.selectedIndex()];
            });

            self.orderProtein = function () {
                var liquid = null;

                switch (self.selectedProtein().type()) {
                case LiquidType.INSULIN:
                    liquid = LiquidFactory.insulin();
                    break;
                case LiquidType.LIPASE_ENZYME:
                    liquid = LiquidFactory.lipase();
                    break;
                case LiquidType.ANTIBODY_GOUT:
                    liquid = LiquidFactory.antibodyGout();
                    break;
                case LiquidType.ANTIBODY_SMALLPOX:
                    liquid = LiquidFactory.antibodySmallpox();
                    break;
                }

                var item = ContainerFactory.tube().add(liquid, true);
                self.gameState.inventory.add(item);
            };
        }
    });

    return Protein;
});
