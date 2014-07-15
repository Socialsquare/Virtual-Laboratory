define([
    'knockout',
    'mapping',
    'lodash',

    'controller/view/Base',
    'controller/view/computer/Menu',
    'controller/view/computer/DesignDNA',
    'controller/view/computer/DesignDrug',
    'controller/view/computer/OrderMouse',

    'model/type/ComputerScreen'

], function (ko, mapping, _, BaseViewController, MenuScreen,
             DesignDNAScreen, DesignDrugScreen, OrderMouseScreen,
             ComputerScreenType) {

    var Computer = BaseViewController.extend({

        constructor: function () {
            var self = this;
            self.base('computer');

            self.activeScreenController = ko.observable(null);

            var screenControllers = {};
            screenControllers[ComputerScreenType.MENU] = new MenuScreen();
            screenControllers[ComputerScreenType.DESIGN_DNA] = new DesignDNAScreen();
            screenControllers[ComputerScreenType.DESIGN_DRUG] = new DesignDrugScreen();
            screenControllers[ComputerScreenType.ORDER_MOUSE] = new OrderMouseScreen();

            // TODO: subscription seemed to fail
            self.activeScreenController = ko.computed(function () {
                return screenControllers[self.gameState.activeComputerScreen()];
            });
        }
    });

    return Computer;
});
