define([
    'base'
], function (Base) {
    var BaseViewController = Base.extend({
        // Use to con- and destruct the view
        constructor: function (templateName) {
            this.templateName = templateName;
        },
        enter: function () {},
        exit: function () {}
    });

    return BaseViewController;
});
