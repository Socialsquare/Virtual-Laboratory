define([
    'base',
    'knockout',
    'Router',

    // controllers
    'controller/view/Overview',
    'controller/view/Mouse',
    'controller/view/Chemical',
    'controller/view/Computer',
    'controller/view/Fumehood',
    'controller/view/Worktable1',
    'controller/view/Worktable2',
    'controller/view/Incubator',
    'controller/view/SpectroPM',
    'controller/view/Fermentor',
    'controller/view/FermentorScreen',

    'controller/Menu',

    'model/GameState',
    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',

    'factory/Liquid'

], function (Base, ko, Router, OverviewController, MouseController,
             ChemicalController, ComputerController,
             FumehoodController, Worktable1Controller, Worktable2Controller,
             IncubatorController, SpectroPMController, FermentorController,
             FermentorScreenController, MenuController, gameState, Tube,
             Petridish, Microtiterplate, LiquidFactory) {
    var App = Base.extend({
        activeViewController: ko.observable(),
        activePopup: ko.observable(''),
        activePopupVM: ko.observable({}),

        hasActivePopup: ko.observable(false),

        menuController: new MenuController(),

        constructor: function (isWeb) {
            var self = this;

            var viewControllers = {
                // Patrick's bane: these fields will be matched with the hashes from the URL

                overview: new OverviewController(),
                computer: new ComputerController(),
                chemical: new ChemicalController(this),
                worktable1: new Worktable1Controller(),
                worktable2: new Worktable2Controller(),
                fumehood: new FumehoodController(),
                incubator: new IncubatorController(),
                mouse: new MouseController(),
                spectropm: new SpectroPMController(),
                fermentor: new FermentorController(), // TODO is it problematic that the view-controllers FermentorScreen and Fermentor both exist?
                fermentorscreen: new FermentorScreenController()
            };

            self.triggerPopup = function (popupName, vm) {
                self.activePopupVM(vm || {});
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
            var microtiter = new Microtiterplate();

            var tubefull = new Tube();
            tubefull.add(LiquidFactory.microorganism.yeast());

            var tube1 = new Tube();
            gameState.inventory.add(tube);

            var petri = new Petridish();
            gameState.inventory.add(petri);

            var micro = new Microtiterplate();
            gameState.inventory.add(micro);

            gameState.worktable1.tubeRack.addAt(0, tube);
            gameState.worktable1.tubeRack.addAt(5, tubefull);
            gameState.worktable1.heater.addAt(0, tube);
            gameState.worktable1.heater.addAt(2, tube);
            gameState.worktable1.tableSpaceMicro.addAt(2, micro);
            gameState.worktable1.tableSpacePetri.addAt(0, petri);
            gameState.worktable1.tableSpacePetri.addAt(2, petri);

            gameState.worktable2.tableSpaceMicro.addAt(0, micro);
            gameState.worktable2.tableSpaceMicro.addAt(2, micro);
            gameState.worktable2.tableSpacePetri.addAt(0, petri);
            gameState.worktable2.tableSpacePetri.addAt(2, petri);
            gameState.worktable2.odMachine.addAt(0, tubefull);
            gameState.worktable2.tubeRack.addAt(0, tube);

            gameState.fumehood.tableSpaceMicro.addAt(0, micro);
            gameState.fumehood.tableSpaceMicro.addAt(2, micro);
            gameState.fumehood.tableSpacePetri.addAt(0, petri);
            gameState.fumehood.tableSpacePetri.addAt(2, petri);
            gameState.fumehood.tubeRack.addAt(0, tube);
            gameState.fumehood.tubeRack.addAt(5, tubefull);

            gameState.incubator.tubeRack.addAt(0, tube);
            gameState.incubator.tubeRack.addAt(1, tube);
            gameState.incubator.tubeRack.addAt(2, tube);
            gameState.incubator.tubeRack.addAt(4, tube);
            gameState.incubator.tubeRack.addAt(5, tube);

            gameState.spectroPM.spectroPMMachine.addAt(0, microtiter);
        }
    });

    return App;
});
