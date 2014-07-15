define([
    'knockout',
    'controller/view/Base',
    'model/type/ComputerScreen'

], function (ko, BaseViewController, ComputerScreenType) {

    var BaseComputer = BaseViewController.extend({

        constructor: function (templateName) {
            var self = this;

            self.computer = self.gameState.computer;

            self.templateName = ko.observable(templateName);

            self.changeScreen = function (name) {
                self.gameState.activeComputerScreen(name);
            };

            self.goToMenu = function () {
                self.gameState.activeComputerScreen(ComputerScreenType.MENU);
            };
        }
    });

    return BaseComputer;
});
