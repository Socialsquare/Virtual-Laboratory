define([
    'base'
], function (Base) {
    var BaseViewController = Base.extend({
        constructor: function (id, name) {
            this.id = id;
            this.name = name;
        },

        // Use to con- and destruct the view
        enter: function () {},
        exit: function () {}
    });

    return BaseViewController;
});
