define([
    'base',
    'jquery',
    'knockout'
], function (Base, $, ko) {
    var Router = Base.extend({

        currentRoute: ko.observable(''),

        constructor: function () {
            var self = this;

            self.navigate = function (name) {
                self.currentRoute(name);
            };
        },

    });

    return new Router();
});
