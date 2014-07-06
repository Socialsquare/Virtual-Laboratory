define([
    'base'
], function (Base) {
    var BaseController = Base.extend({
        constructor: function (id, name) {
            this.id = id;
            this.name = name;
        },

        // Called when navigating away, use to reset content if needed
        leave: function () {}
    });

    return BaseController;
});
