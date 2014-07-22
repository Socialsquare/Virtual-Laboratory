define([
    'knockout',
    'controller/view/Base',
    'utils/FeatureHelper'

], function (ko, BaseViewController, FeatureHelper) {

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
        },
    });

    return Overview;
});
