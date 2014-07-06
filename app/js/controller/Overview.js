define([
    'controller/Base',
    'knockout'
], function (BaseVM, ko) {
    var Overview = BaseVM.extend({
        constructor: function () {
            this.base(1, 'overview');
        }
    });

    return Overview;
});
