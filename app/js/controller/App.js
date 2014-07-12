define([
    'base',
    'knockout',

    // controllers
    'controller/view/Loading',
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
    'controller/view/UvRoom',
    'controller/view/Washing',

    'controller/Popup',
    'controller/Menu',
    'controller/Router',

    'model/GameState',
    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',

    'factory/Liquid'

], function (Base, ko, LoadingController, OverviewController,
             MouseController, ChemicalController, ComputerController,
             FumehoodController, Worktable1Controller, Worktable2Controller,
             IncubatorController, SpectroPMController, FermentorController,
             FermentorScreenController, UvRoomController, WashingController,
             popupController, MenuController, router, gameState, Tube,
             Petridish, Microtiterplate, LiquidFactory) {

    var App = Base.extend({

        activeViewController: ko.observable(),

        menuController: new MenuController(),
        popupController: popupController,

        constructor: function (isWeb) {
            var self = this;

            var viewControllers = {
                loading: new LoadingController(),
                overview: new OverviewController(),
                computer: new ComputerController(),
                chemical: new ChemicalController(),
                worktable1: new Worktable1Controller(),
                worktable2: new Worktable2Controller(),
                fumehood: new FumehoodController(),
                incubator: new IncubatorController(),
                mouse: new MouseController(),
                spectropm: new SpectroPMController(),
                fermentor: new FermentorController(),
                fermentorscreen: new FermentorScreenController(),
                uvroom: new UvRoomController(),
                washing: new WashingController()
            };

            self.viewChange = function (viewName) {
                // hide any potential active popup
                self.popupController.hide();

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
            router.currentRoute.subscribe(function (routeName) {
                self.viewChange(routeName);
            });

            // bootstrap the app by going to loading view
            router.navigate('loading');


            //------------------------
            // dummy data
            //------------------------
            var tube = new Tube();

            var tubeYeast = new Tube();
            tubeYeast.add(LiquidFactory.microorganism.yeast());

            gameState.inventory.add(tube);

            var petri = new Petridish();
            gameState.inventory.add(petri);

            var micro = new Microtiterplate();
            gameState.inventory.add(micro);

            gameState.worktable1.tubeRack.addAt(0, tube);
            gameState.worktable1.tubeRack.addAt(5, tubeYeast);
            gameState.worktable1.heater.addAt(0, tube);
            gameState.worktable1.heater.addAt(2, tube);
            gameState.worktable1.tableSpaceMicro.addAt(0, new Microtiterplate());
            gameState.worktable1.tableSpaceMicro.addAt(1, new Microtiterplate());
            gameState.worktable1.tableSpaceMicro.addAt(2, new Microtiterplate());
            gameState.worktable1.tableSpacePetri.addAt(0, new Petridish());
            gameState.worktable1.tableSpacePetri.addAt(2, new Petridish());

            gameState.worktable2.tableSpaceMicro.addAt(0, micro);
            gameState.worktable2.tableSpaceMicro.addAt(2, micro);
            gameState.worktable2.tableSpacePetri.addAt(0, petri);
            gameState.worktable2.tableSpacePetri.addAt(2, petri);
            gameState.worktable2.odMachine.addAt(0, tubeYeast);
            gameState.worktable2.tubeRack.addAt(0, tube);

            gameState.fumehood.tableSpaceMicro.addAt(0, micro);
            gameState.fumehood.tableSpaceMicro.addAt(2, micro);
            gameState.fumehood.tableSpacePetri.addAt(0, petri);
            gameState.fumehood.tableSpacePetri.addAt(2, petri);
            gameState.fumehood.tubeRack.addAt(0, tube);
            gameState.fumehood.tubeRack.addAt(5, tubeYeast);

            gameState.incubator.tubeRack.addAt(0, tubeYeast);
            /*gameState.incubator.tubeRack.addAt(1, tube);
            gameState.incubator.tubeRack.addAt(2, tube);
            gameState.incubator.tubeRack.addAt(4, tube);
            gameState.incubator.tubeRack.addAt(5, tube);*/

            gameState.spectroPM.spectroPMMachine.addAt(0, micro);

        }
    });

    return App;
});
