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
            self.base('computer-order-protein');

            self.TextHelper = TextHelper;

            self.availableProteins = ko.observableArray([
                LiquidType.INSULIN,
                LiquidType.LIPASE_ENZYME,
                LiquidType.ANTIBODY_GOUT,
                LiquidType.ANTIBODY_SMALLPOX
            ]);

            self.orderProtein = function (type) {
                var liquid = null;

                switch (type) {
                case LiquidType.INSULIN:
                    liquid = LiquidFactory.insulin();
                case LiquidType.LIPASE_ENZYME:
                    liquid = LiquidFactory.lipase();
                case LiquidType.ANTIBODY_GOUT:
                    liquid = LiquidFactory.antibodyGout();
                case LiquidType.ANTIBODY_SMALLPOX:
                    liquid = LiquidFactory.antibodySmallpox();
                }

                var item = ContainerFactory.tube().add(liquid);
                self.gameState.inventory.add(item);
            };
        }
    });

    return Protein;
});
