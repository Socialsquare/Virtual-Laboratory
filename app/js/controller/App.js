define([
    'base',
    'knockout',
    'Router',

    // controllers
    'controller/Overview',
    //'controller/Computer',
  //  'controller/Chemical',
//    'controller/Mouse',
    'controller/Fumehood',
    'controller/Worktable1',
    'controller/Worktable2',
    'controller/Incubator',
    'controller/Menu',

    'model/GameState',

    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'factory/Liquid'
], function (Base, ko, Router, OverviewController, /* ComputerController, ChemicalController, MouseController*/  Fumehood, Worktable1, Worktable2, IncubatorController, MenuController, gameState, Tube, Petridish, Microtiterplate, LiquidFactory) {
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
                // computer: new ComputerController(),
                // 'chemical-closet': new ChemicalController(this),
                // mouse: new MouseController(),
                worktable1: new Worktable1Controller(),
                worktable2: new Worktable2Controller(),
                fumehood: new FumehoodController(),
                incubator: new IncubatorController(),
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
            window.location.hash = 'overview';
            self.viewChange('overview');



            //------------------------
            // dummy data
            //------------------------
            var tube = new Tube();
            var tubefull = new Tube();

            tubefull.add(LiquidFactory.microorganism.yeast());

            gameState.worktable1.tubeRack.addAt(0, tube);
            gameState.worktable1.tubeRack.addAt(5, tubefull);
            gameState.worktable1.heater.addAt(0, tube);
            gameState.worktable1.heater.addAt(2, tube);

            var petri = new Petridish();
            gameState.inventory.add(petri);

            var micro = new Microtiterplate();
            gameState.inventory.add(micro);

            var tube1 = new Tube();
            gameState.inventory.add(tube);

            gameState.worktable2.odMachine.addAt(0, tubefull);
            gameState.worktable2.tubeRack.addAt(0, tube);

            gameState.fumehood.tubeRack.addAt(0, tube);
            gameState.fumehood.tubeRack.addAt(5, tubefull);

            gameState.incubator.tubeRack.addAt(0, tube);
            gameState.incubator.tubeRack.addAt(1, tube);
            gameState.incubator.tubeRack.addAt(2, tube);
            gameState.incubator.tubeRack.addAt(4, tube);
            gameState.incubator.tubeRack.addAt(5, tube);
        }
    });

    return App;
});
