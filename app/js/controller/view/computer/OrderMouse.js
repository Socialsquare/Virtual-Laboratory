define([
    'knockout',

    'controller/view/computer/Base',

    'model/GameState',
    'model/Mouse',

    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/ComputerScreen',

    'utils/utils'
], function (ko, BaseComputer, gameState, MouseModel, MouseType, MouseBloodType, ComputerScreenType, utils) {

    var OrderMouse = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-order-mouse');

            self.availableMice = ko.observableArray([
                new MouseModel(MouseType.HEALTHY,  MouseBloodType.DIABETIC),
                new MouseModel(MouseType.HEALTHY,  MouseBloodType.NORMAL),
                new MouseModel(MouseType.GOUT,     MouseBloodType.NORMAL),
                new MouseModel(MouseType.SMALLPOX, MouseBloodType.NORMAL),
                new MouseModel(MouseType.INSOMNIA, MouseBloodType.NORMAL)
            ]);

            self.selectedMouse = ko.observable(self.availableMice()[0]);

            self.selectMouse = function (mouse) {
                self.selectedMouse(mouse);
            };

            self.orderMouse = function () {
                var mouse = self.selectedMouse();
                self.gameState.mouse(utils.klone(mouse));

                self.goToMenu();
            };
        }
    });

    return OrderMouse;
});
