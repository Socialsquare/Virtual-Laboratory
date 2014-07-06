define([
    'base',
    'jquery',
    'knockout'
], function (Base, $, ko) {
    var Router = Base.extend({

        viewChangeHandler: null,

        constructor: function () {
            var self = this;

            $(window).on('hashchange', function () {
                if (self.viewChangeHandler) {
                    self.viewChangeHandler(window.location.hash.substring(1));
                }
            });
        },

    });

    return Router;
});
