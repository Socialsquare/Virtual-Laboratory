define([
    'knockout',

    'controller/view/Base',
    'controller/Experiment',

    'model/type/Activation',
    'model/type/ComputerScreen'
], function (ko, BaseViewController, experimentController, ActivationType, ComputerScreenType) {

    var BaseComputer = BaseViewController.extend({

        constructor: function (templateName, title) {
            var self = this;

            self.computer = self.gameState.computer;
            self.experimentController = experimentController;
            self.ActivationType = ActivationType;
            self.Screens = ComputerScreenType;

            self.templateName = ko.observable(templateName);
            self.title =  ko.observable(title);

            self.changeScreen = function (name) {
                self.gameState.activeComputerScreen(name);
            };
        }
    });

    return BaseComputer;
});
