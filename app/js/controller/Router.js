define([
    'base',
    'jquery',
    'knockout'
], function (Base, $, ko) {

    var Router = Base.extend({

        constructor: function () {
            var self = this;

            self.currentRoute = ko.observable(null);

            self.viewHistory = ko.observableArray([]);

            self.navigate = function (name) {
                // ignore loading screen from history
                if (!!self.currentRoute()
                    && self.currentRoute() !== 'loading'
                    && self.currentRoute() !== name)
                    self.viewHistory.push(self.currentRoute());

                self.currentRoute(name);
            };

            self.back = function () {
                var view = self.viewHistory.pop();
                if (!view) return;

                self.currentRoute(view);
            };

            self.hasBack = ko.computed(function () {
                return !self.viewHistory.isEmpty();
            });
        }
    });

    return new Router();
});
