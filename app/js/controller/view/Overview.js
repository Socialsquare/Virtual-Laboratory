define([
    'controller/view/Base',
    'knockout'
], function (BaseViewController, ko) {
    var Overview = BaseViewController.extend({
        constructor: function () {
            this.base('overview');
        }
    });

    return Overview;
});
