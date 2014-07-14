define([
    'knockout',
    'base',
    'model/GameState',
    'model/type/ComputerScreen',
], function (ko, Base, gameState, ComputerScreenType) {

    var BaseComputer = Base.extend({

        constructor: function (templateName) {
            var self = this;

            self.gameState = gameState;

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
