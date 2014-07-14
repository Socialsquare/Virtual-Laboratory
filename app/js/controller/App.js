define([
    'knockout',
    'controller/view/Base',

    // controllers
    'controller/view/Loading',
    'controller/view/Welcome',
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

    'model/Tube',
    'model/Petridish',
    'model/Microtiterplate',
    'model/Scalpel',
    'model/Syringe',

    'factory/Liquid'

], function (ko, BaseViewController, LoadingController, WelcomeController,
             OverviewController, MouseController, ChemicalController,
             ComputerController, FumehoodController, Worktable1Controller,
             Worktable2Controller, IncubatorController, SpectroPMController,
             FermentorController, FermentorScreenController, UvRoomController,
             WashingController, popupController, MenuController, Tube,
             Petridish, Microtiterplate, Scalpel, Syringe, LiquidFactory) {


    var App = BaseViewController.extend({

        activeViewController: ko.observable(),

        menuController: new MenuController(),
        popupController: popupController,

        constructor: function (isWeb) {
            var self = this;

            var viewControllers = {
                loading: new LoadingController(),
                welcome: new WelcomeController(),
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
            self.router.currentRoute.subscribe(function (routeName) {
                self.viewChange(routeName);
            });

            // bootstrap the app by going to loading view
            self.router.navigate('loading');


            //------------------------
            // dummy data
            //------------------------

            var tubeYeast = new Tube();
            tubeYeast.add(LiquidFactory.microorganism.yeast());

            self.gameState.inventory.add(new Tube());
            self.gameState.inventory.add(new Petridish());
            self.gameState.inventory.add(new Microtiterplate());
            self.gameState.inventory.add(new Scalpel());

            var syringe = new Syringe();
            syringe.add(LiquidFactory.deadly());
            self.gameState.inventory.add(syringe);

            self.gameState.worktable1.tubeRack.addAt(0, new Tube());
            self.gameState.worktable1.tubeRack.addAt(5, tubeYeast);
            self.gameState.worktable1.heater.addAt(0, new Tube());
            self.gameState.worktable1.heater.addAt(2, new Tube());
            self.gameState.worktable1.tableSpaceMicro.addAt(0, new Microtiterplate());
            self.gameState.worktable1.tableSpaceMicro.addAt(1, new Microtiterplate());
            self.gameState.worktable1.tableSpaceMicro.addAt(2, new Microtiterplate());
            self.gameState.worktable1.tableSpacePetri.addAt(0, new Petridish());
            self.gameState.worktable1.tableSpacePetri.addAt(2, new Petridish());

            self.gameState.worktable2.tableSpaceMicro.addAt(0, new Microtiterplate());
            self.gameState.worktable2.tableSpaceMicro.addAt(2, new Microtiterplate());
            self.gameState.worktable2.tableSpacePetri.addAt(0, new Petridish());
            self.gameState.worktable2.tableSpacePetri.addAt(2, new Petridish());
            tubeYeast = new Tube();
            tubeYeast.add(LiquidFactory.microorganism.yeast());
            self.gameState.worktable2.tubeRack.addAt(0, tubeYeast);
            self.gameState.worktable2.tubeRack.addAt(0, new Tube());


            self.gameState.fumehood.tableSpaceMicro.addAt(0, new Microtiterplate());
            self.gameState.fumehood.tableSpaceMicro.addAt(2, new Microtiterplate());
            self.gameState.fumehood.tableSpacePetri.addAt(0, new Petridish());
            self.gameState.fumehood.tableSpacePetri.addAt(2, new Petridish());
            self.gameState.fumehood.tubeRack.addAt(0, new Tube());
            tubeYeast = new Tube();
            tubeYeast.add(LiquidFactory.microorganism.yeast());
            self.gameState.fumehood.tubeRack.addAt(5, tubeYeast);

            self.gameState.spectroPM.spectroPMMachine.addAt(0, new Microtiterplate());

            self.gameState.uvroom.tubeRack.addAt(0, new Tube());
            self.gameState.uvroom.tubeRack.addAt(1, new Tube());
            self.gameState.uvroom.tubeRack.addAt(2, new Tube());
            self.gameState.uvroom.tubeRack.addAt(3, new Tube());
            self.gameState.uvroom.tubeRack.addAt(4, new Tube());
            self.gameState.uvroom.tubeRack.addAt(5, new Tube());
        }
    });

    return App;
});
