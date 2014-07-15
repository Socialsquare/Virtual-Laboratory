define([
    'knockout',
    'controller/view/Base',

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

    'factory/Liquid',
    'factory/Container',
    'factory/SpecialItem'

], function (ko, BaseViewController, LoadingController,
             OverviewController, MouseController, ChemicalController,
             ComputerController, FumehoodController, Worktable1Controller,
             Worktable2Controller, IncubatorController, SpectroPMController,
             FermentorController, FermentorScreenController, UvRoomController,
             WashingController, popupController, MenuController,
             LiquidFactory, ContainerFactory, SpecialItemFactory) {


    var App = BaseViewController.extend({

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
            self.router.currentRoute.subscribe(function (routeName) {
                self.viewChange(routeName);
            });

            // bootstrap the app by going to loading view
            self.router.navigate('loading');


            //------------------------
            // dummy data
            //------------------------

            /*self.gameState.inventory.add(SpecialItemFactory.spleen());
            self.gameState.inventory.add(ContainerFactory.tube());
            self.gameState.inventory.add(ContainerFactory.petri());
            self.gameState.inventory.add(ContainerFactory.micro());*/
            self.gameState.inventory.add(SpecialItemFactory.scalpel());
            self.gameState.inventory.add(SpecialItemFactory.syringe().add(LiquidFactory.deadly()));
            self.gameState.inventory.add(SpecialItemFactory.syringe().add(LiquidFactory.adjuvans()).add(LiquidFactory.antigen_smallpox()));

            self.gameState.worktable1.tubeRack.addAt(0, ContainerFactory.tube());
            self.gameState.worktable1.tubeRack.addAt(5, ContainerFactory.tube().add(LiquidFactory.microorganism.yeast()).add(LiquidFactory.insulin()));
            self.gameState.worktable1.heater.addAt(0, ContainerFactory.tube().add(LiquidFactory.microorganism.yeast()).add(LiquidFactory.insulin()));
            self.gameState.worktable1.heater.addAt(2, ContainerFactory.tube());
            self.gameState.worktable1.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.worktable1.tableSpaceMicro.addAt(1, ContainerFactory.micro());
            self.gameState.worktable1.tableSpaceMicro.addAt(2, ContainerFactory.micro());
            self.gameState.worktable1.tableSpacePetri.addAt(0, ContainerFactory.petri());
            self.gameState.worktable1.tableSpacePetri.addAt(2, ContainerFactory.petri());

            self.gameState.worktable2.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.worktable2.tableSpaceMicro.addAt(2, ContainerFactory.micro());
            self.gameState.worktable2.tableSpacePetri.addAt(0, ContainerFactory.petri());
            self.gameState.worktable2.tableSpacePetri.addAt(2, ContainerFactory.petri());
            self.gameState.worktable2.tubeRack.addAt(0, ContainerFactory.tube().add(LiquidFactory.microorganism.yeast()));
            self.gameState.worktable2.tubeRack.addAt(0, ContainerFactory.tube());


            self.gameState.fumehood.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.fumehood.tableSpaceMicro.addAt(2, ContainerFactory.micro());
            self.gameState.fumehood.tableSpacePetri.addAt(0, ContainerFactory.petri());
            self.gameState.fumehood.tableSpacePetri.addAt(2, ContainerFactory.petri());
            self.gameState.fumehood.tubeRack.addAt(0, ContainerFactory.tube());
            self.gameState.fumehood.tubeRack.addAt(5, ContainerFactory.tube().add(LiquidFactory.microorganism.yeast()));

            self.gameState.spectroPM.spectroPMMachine.addAt(0, ContainerFactory.micro());

            self.gameState.uvroom.tubeRack.addAt(0, ContainerFactory.tube().add(LiquidFactory.microorganism.yeast()));
            self.gameState.uvroom.tubeRack.addAt(5, ContainerFactory.tube());
            self.gameState.uvroom.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.uvroom.tableSpaceMicro.addAt(2, ContainerFactory.micro());
            self.gameState.uvroom.tableSpacePetri.addAt(0, ContainerFactory.petri());
            self.gameState.uvroom.tableSpacePetri.addAt(2, ContainerFactory.petri());

            self.gameState.washing.tubeRack.addAt(0, ContainerFactory.tube().add(LiquidFactory.lipase()));
            self.gameState.washing.tubeRack.addAt(3, ContainerFactory.tube().add(LiquidFactory.microorganism.yeast()));
            self.gameState.washing.tubeRack.addAt(5, ContainerFactory.tube());
        }
    });

    return App;
});
