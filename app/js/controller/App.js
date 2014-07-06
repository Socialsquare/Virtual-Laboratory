define([
    'base',
    'knockout',
    'Router',

    // controllers
    'controller/Overview',
    'controller/Computer',
    'controller/Menu',

    // require knockout bindings to register them
    'bindings/dragging'
], function (Base, ko, Router, OverviewController, ComputerController, MenuController) {
    var App = Base.extend({
        activeView: ko.observable('overview'),
        activePopup: ko.observable(''),
        hasActivePopup: ko.observable(false),

        menuController: new MenuController(),

        constructor: function (isWeb) {
            var self = this;

            var router = new Router();
            router.viewChangeHandler = this.viewChange.bind(this);

            var controllers = {
                overview: new OverviewController(),
                computer: new ComputerController()
            };

            self.currentViewController = ko.computed(function () {
                return controllers[self.activeView()];
            });

            self.triggerPopup = function (popupName) {
                console.log(popupName);
                self.activePopup('popup-' + popupName);
                self.hasActivePopup(true);
            };

            self.hidePopup = function (popupName) {
                self.hasActivePopup(false);
            };
        },

        viewChange: function (viewName) {
            // hide any potential active popup
            this.hidePopup();

            this.activeView(viewName);
        },

    });

    return App;
});
