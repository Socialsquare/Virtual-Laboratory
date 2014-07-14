define([
    'knockout',
    'controller/view/computer/Base',
    'model/type/ComputerScreen'
], function (ko, BaseComputer, ComputerScreenType) {

    var Menu = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-menu');

            self.Screens = ComputerScreenType;

            self.screenChanger = function (screenName) {
                return function () {
                    self.changeScreen(screenName);
                };
            };
        }
    });

    return Menu;
});
