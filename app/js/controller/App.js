define([
    'base',
    'knockout',
    'Router',

    // controllers
    'controller/Overview',
    'controller/Computer',
    'controller/Chemical',
    'controller/Mouse',
    'controller/Worktable1',
    'controller/Worktable2',
    'controller/Menu',

    'model/GameState',

    'factory/Item'
], function (Base, ko, Router, OverviewController, ComputerController, ChemicalController, MouseController, Worktable1, Worktable2, MenuController, gameState, itemFactory) {
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
                mouse: new MouseController(),
                worktable1: new Worktable1(),
                worktable2: new Worktable2()
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

            // add some initial items (dummy)
            gameState.inventory.add(itemFactory.createTube());
        }
    });

    return App;
});
