define([
    'knockout',
    'controller/view/Base',
    'controller/Tutorial',
    'utils/FeatureHelper'

], function (ko, BaseViewController, tutorialController, FeatureHelper) {

    var Overview = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('overview');

            self.handleDoorClick = function () {
                var vm = self.popupController.show('popup-door', {
                    goto: function (name) {
                        self.popupController.hide(vm);
                        self.router.navigate(name);
                    }
                });
            };

            self.enter = function () {
                if (self.gameState.askTutorial()) {
                    self.gameState.askTutorial(false);

                    self.popupController.confirm('popup.ask_tutorial.header', 'popup.ask_tutorial.body')
                        .done(function () {
                            tutorialController.startTutorial();
                        });
                }
            };
        }
    });

    return Overview;
});
