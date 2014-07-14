define([
    'knockout',
    'controller/view/computer/Base',
    'model/type/ComputerScreen'
], function (ko, BaseComputer, ComputerScreenType) {

    var OrderMouse = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-order-mouse');
        }
    });

    return OrderMouse;
});
