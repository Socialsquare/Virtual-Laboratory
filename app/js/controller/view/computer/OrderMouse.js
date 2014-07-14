define([
    'knockout',

    'controller/view/computer/Base',

    'model/GameState',
    'model/Mouse',

    'model/type/MouseBlood',
    'model/type/ComputerScreen',

    'utils/utils'
], function (ko, BaseComputer, gameState, MouseModel, MouseBloodType, ComputerScreenType, utils) {

    var OrderMouse = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-order-mouse');

            self.selectedMouse = ko.observable(new MouseModel(MouseBloodType.DIABETIC));

            self.availableMice = ko.observableArray([
                new MouseModel(MouseBloodType.DIABETIC),
                new MouseModel(MouseBloodType.NORMAL)
            ]);

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
