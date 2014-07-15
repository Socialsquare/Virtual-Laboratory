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
    'controller/view/computer/DesignDNA' //TODO: remove, just for dummy-data

], function (ko, BaseViewController, MenuController, LoadingController,
             OverviewController, MouseController, ChemicalController,
             ComputerController, FumehoodController, Worktable1Controller,
             Worktable2Controller, IncubatorController, SpectroPMController,
             FermentorController, FermentorScreenController, UvRoomController,
             WashingController, DesignDNAController) {


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

            /*self.gameState.inventory.add(self.specialItemFactory.spleen());
            self.gameState.inventory.add(self.containerFactory.tube());
            self.gameState.inventory.add(self.containerFactory.petri());
            self.gameState.inventory.add(self.containerFactory.micro());*/
            self.gameState.inventory.add(self.specialItemFactory.scalpel());
            self.gameState.inventory.add(self.specialItemFactory.syringe()
                                         .add(self.liquidFactory.deadly()));
            self.gameState.inventory.add(self.specialItemFactory.syringe()
                                         .add(self.liquidFactory.adjuvans())
                                         .add(self.liquidFactory.antigen_smallpox()));

            self.gameState.worktable1.tubeRack.addAt(0, self.containerFactory.tube());
            self.gameState.worktable1.tubeRack.addAt(5, self.containerFactory.tube()
                                                     .add(self.liquidFactory.microorganism.yeast())
                                                     .add(self.liquidFactory.insulin()));
            self.gameState.worktable1.heater.addAt(0, self.containerFactory.tube()
                                                   .add(self.liquidFactory.microorganism.yeast())
                                                   .add(self.liquidFactory.insulin()));
            self.gameState.worktable1.heater.addAt(2, self.containerFactory.tube());
            self.gameState.worktable1.tableSpaceMicro.addAt(0, self.containerFactory.micro());
            self.gameState.worktable1.tableSpaceMicro.addAt(1, self.containerFactory.micro());
            self.gameState.worktable1.tableSpaceMicro.addAt(2, self.containerFactory.micro());
            self.gameState.worktable1.tableSpacePetri.addAt(0, self.containerFactory.petri());
            self.gameState.worktable1.tableSpacePetri.addAt(2, self.containerFactory.petri());

            self.gameState.worktable2.tableSpaceMicro.addAt(0, self.containerFactory.micro());
            self.gameState.worktable2.tableSpaceMicro.addAt(2, self.containerFactory.micro());
            self.gameState.worktable2.tableSpacePetri.addAt(0, self.containerFactory.petri());
            self.gameState.worktable2.tableSpacePetri.addAt(2, self.containerFactory.petri());
            self.gameState.worktable2.tubeRack.addAt(0, self.containerFactory.tube()
                                                     .add(self.liquidFactory.microorganism.yeast()));
            self.gameState.worktable2.tubeRack.addAt(0, self.containerFactory.tube());


            self.gameState.fumehood.tableSpaceMicro.addAt(0, self.containerFactory.micro());
            self.gameState.fumehood.tableSpaceMicro.addAt(2, self.containerFactory.micro());
            self.gameState.fumehood.tableSpacePetri.addAt(0, self.containerFactory.petri());
            self.gameState.fumehood.tableSpacePetri.addAt(2, self.containerFactory.petri());
            self.gameState.fumehood.tubeRack.addAt(0, self.containerFactory.tube());
            self.gameState.fumehood.tubeRack.addAt(5, self.containerFactory.tube()
                                                   .add(self.liquidFactory.microorganism.yeast()));

            self.gameState.spectroPM.spectroPMMachine.addAt(0, self.containerFactory.micro());

            self.gameState.uvroom.tubeRack.addAt(0, self.containerFactory.tube()
                                                 .add(self.liquidFactory.microorganism.yeast()));
            self.gameState.uvroom.tubeRack.addAt(5, self.containerFactory.tube());
            self.gameState.uvroom.tableSpaceMicro.addAt(0, self.containerFactory.micro());
            self.gameState.uvroom.tableSpaceMicro.addAt(2, self.containerFactory.micro());
            self.gameState.uvroom.tableSpacePetri.addAt(0, self.containerFactory.petri());
            self.gameState.uvroom.tableSpacePetri.addAt(2, self.containerFactory.petri());

            self.gameState.washing.tubeRack.addAt(0, self.containerFactory.tube()
                                                  .add(self.liquidFactory.lipase()));
            self.gameState.washing.tubeRack.addAt(3, self.containerFactory.tube()
                                                  .add(self.liquidFactory.microorganism.yeast()));
            self.gameState.washing.tubeRack.addAt(5, self.containerFactory.tube());

            // Dummy-data with DNA. Much shaky.
            var dnaDesign = viewControllers['designDNA'];
            dnaDesign.dnaService.getDNAElements()
                .done(function(){
                    console.log('shit should be loaded, but it ain\'t... Therefore: delay. Much shaky');
                    _.delay(function(dnaDesign, self){
                        console.log('Delayed function..');
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[8]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[3]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[1]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[5]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[4]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[7]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[2]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[0]);
                        dnaDesign.handleDrop(dnaDesign.availableDNA()[0]);

                        dnaDesign.orderDNA();

                        var len = self.gameState.inventory.items().length;
                        var dnaTube = self.gameState.inventory.items()[len-1];

                        self.gameState.worktable1.electroporator.addAll(dnaTube.liquids());
                        self.gameState.worktable1.electroporator.add(self.liquidFactory.microorganism.yeast());
                    }, 3500, dnaDesign, self);
                });

        }
    });

    return App;
});
