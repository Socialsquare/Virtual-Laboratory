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
            self.base('computer-order-mouse', 'computer.screen.mouse');

            self.availableMice = ko.observableArray([
                new MouseModel(MouseType.HEALTHY,  MouseBloodType.DIABETIC),
                new MouseModel(MouseType.HEALTHY,  MouseBloodType.NORMAL),
                new MouseModel(MouseType.GOUT,     MouseBloodType.NORMAL),
                new MouseModel(MouseType.SMALLPOX, MouseBloodType.NORMAL),
                /*new MouseModel(MouseType.INSOMNIA, MouseBloodType.NORMAL),*/
                new MouseModel(MouseType.PSORIASIS,MouseBloodType.NORMAL)
            ]);

            self.selectedIndex = ko.observable(0);
            self.selectedMouse = ko.computed(function () {
                return self.availableMice()[self.selectedIndex()];
            });

            self.orderMouse = function () {

                self.popupController.confirm('computer.screen.mouse_confirm.header', 'computer.screen.mouse_confirm.body')
                    .then(function () {
                        var mouse = self.selectedMouse();
                        self.gameState.mouse(mouse.clone());
                        //TODO: not enough with setting mouse on gameState it seems?

                        self.changeScreen(self.Screens.MENU);

                        self.experimentController.triggerActivation(self.ActivationType.COMPUTER_ORDER_MOUSE, mouse);
                    });
            };
        }
    });

    return OrderMouse;
});
