define([
    'knockout',
    'controller/view/computer/Base'
], function (ko, BaseComputer, ComputerScreenType) {

    var Menu = BaseComputer.extend({

        constructor: function () {
            var self = this;
            self.base('computer-menu', 'computer.menu');

            self.screenChanger = function (screenName) {
                return function () {
                    self.changeScreen(screenName);
                };
            };
        }
    });

    return Menu;
});
