define([
    'knockout',
    'controller/view/Base'
], function (ko, BaseViewController) {

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
