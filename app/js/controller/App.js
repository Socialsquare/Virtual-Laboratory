define([
    'base',
    'knockout',
    'Router',

    // controllers
    'controller/Overview',
    'controller/Computer',
    'controller/Chemical',
    'controller/Mouse',
    'controller/Menu'
], function (Base, ko, Router, OverviewController, ComputerController, ChemicalController, MouseController, MenuController) {
    var App = Base.extend({
        activeViewController: ko.observable(),
        activePopup: ko.observable(''),
        activePopupVM: ko.observable({}),

        hasActivePopup: ko.observable(false),

        menuController: new MenuController(),

        constructor: function (isWeb) {
            var self = this;

            var viewControllers = {
                overview: new OverviewController(),
                computer: new ComputerController(),
                'chemical-closet': new ChemicalController(this),
                mouse: new MouseController()
            };

            self.triggerPopup = function (popupName, vm) {
                self.activePopupVM(vm || {}),
                self.activePopup('popup-' + popupName);
                self.hasActivePopup(true);
            };

            self.hidePopup = function (popupName) {
                self.hasActivePopup(false);
            };

            self.viewChange = function (viewName) {
                // hide any potential active popup
                self.hidePopup();

                // exit current controller
                if (self.activeViewController()) {
                    self.activeViewController().exit();
                }

                // find new controller and enter it
                var viewController = viewControllers[viewName];
                self.activeViewController(viewController);
                self.activeViewController().enter();
            };

            // setup routing
            var router = new Router();
            router.viewChangeHandler = self.viewChange.bind(this);

            // bootstrap the app by going to 'overview'
            self.viewChange('overview');
        }
    });

    return App;
});
