define([
    'knockout',
    'controller/view/Base',

    // controllers
    'controller/Menu',
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
    'controller/view/computer/DesignDNA', //TODO: remove, just for dummy-data
    'factory/Container', //TODO: remove, just for dummy-data
    'factory/Liquid' //TODO: remove, just for dummy-data

], function (ko, BaseViewController, MenuController, LoadingController,
             OverviewController, MouseController, ChemicalController,
             ComputerController, FumehoodController, Worktable1Controller,
             Worktable2Controller, IncubatorController, SpectroPMController,
             FermentorController, FermentorScreenController, UvRoomController,
             WashingController, DesignDNAController, ContainerFactory, LiquidFactory) {


    var App = BaseViewController.extend({

        activeViewController: ko.observable(),

        menuController: new MenuController(),

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
                washing: new WashingController(),
                designDNA: new DesignDNAController() //TODO: remove
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

            var mye = LiquidFactory.microorganism.myeloma();
            mye.concentration(5);
            var yea = LiquidFactory.microorganism.yeast();
            yea.concentration(5);

            self.gameState.inventory.add(ContainerFactory.tube()
                                         .add(LiquidFactory.antibodyGout())
                                         .add(mye));

            self.gameState.inventory.add(ContainerFactory.tube()
                                         .add(LiquidFactory.antibodySmallpox())
                                         .add(yea));

            self.gameState.worktable1.tubeRack.addAt(0, ContainerFactory.tube());
            self.gameState.worktable1.heater.addAt(2, ContainerFactory.tube());
            self.gameState.worktable1.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.worktable1.tableSpacePetri.addAt(0, ContainerFactory.petri());

            self.gameState.worktable2.tableSpaceMicro.addAt(2, ContainerFactory.micro());
            self.gameState.worktable2.tableSpacePetri.addAt(2, ContainerFactory.petri());
            self.gameState.worktable2.tubeRack.addAt(0, ContainerFactory.tube()
                                                     .add(LiquidFactory.microorganism.yeast()));


            self.gameState.fumehood.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.fumehood.tableSpacePetri.addAt(0, ContainerFactory.petri());
            self.gameState.fumehood.tubeRack.addAt(5, ContainerFactory.tube()
                                                   .add(LiquidFactory.microorganism.yeast()));

            self.gameState.spectroPM.spectroPMMachine.addAt(0, ContainerFactory.micro());

            self.gameState.uvroom.tubeRack.addAt(0, ContainerFactory.tube()
                                                 .add(LiquidFactory.microorganism.yeast()));
            self.gameState.uvroom.tubeRack.addAt(5, ContainerFactory.tube());
            self.gameState.uvroom.tableSpaceMicro.addAt(0, ContainerFactory.micro());
            self.gameState.uvroom.tableSpacePetri.addAt(2, ContainerFactory.petri());

            self.gameState.washing.tubeRack.addAt(0, ContainerFactory.tube()
                                                  .add(LiquidFactory.lipase()));
            self.gameState.washing.tubeRack.addAt(3, ContainerFactory.tube()
                                                  .add(LiquidFactory.microorganism.yeast()));
            self.gameState.washing.tubeRack.addAt(5, ContainerFactory.tube());


// Dummy-data with DNA. Much shaky.

            var dnaDesign = viewControllers['designDNA'];
            dnaDesign.dnaService.getDNAElements()
                .done(function(elements) {
                    dnaDesign.handleDrop(elements[8]);
                    dnaDesign.handleDrop(elements[3]);
                    dnaDesign.handleDrop(elements[1]);
                    dnaDesign.handleDrop(elements[5]);
                    dnaDesign.handleDrop(elements[4]);
                    dnaDesign.handleDrop(elements[7]);
                    dnaDesign.handleDrop(elements[2]);
                    dnaDesign.handleDrop(elements[0]);
                    dnaDesign.handleDrop(elements[0]);

                    dnaDesign.orderDNA();

                    var len = self.gameState.inventory.items().length;
                    var dnaTube = self.gameState.inventory.items()[len-1];

                    self.gameState.worktable1.electroporator.addAll(dnaTube.liquids());
                    var yeastbeast =self.liquidFactory.microorganism.yeast();
                    yeastbeast.concentration(Math.pow(10,9));
                    self.gameState.worktable1.electroporator.add(yeastbeast);

                    self.gameState.worktable1.electroporator.activate();

                    var electro_contents = self.gameState.worktable1.electroporator.liquids(); //TODO:
                    self.gameState.fermentor.fermentorTank.addAll(electro_contents);

                    self.gameState.inventory.remove(self.gameState.inventory.items()[len-1]);
                });
        }
    });

    return App;
});
