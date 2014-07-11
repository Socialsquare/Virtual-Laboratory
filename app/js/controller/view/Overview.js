define([
    'controller/view/Base',
    'knockout'
], function (BaseViewController, ko) {
    var Overview = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('overview');

            self.handleDoorClick = function () {
                self.popupController.show('popup-door');
            };
        },
    });

    return Overview;
});
