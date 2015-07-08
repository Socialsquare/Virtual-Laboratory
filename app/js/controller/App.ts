import ko = require('knockout');
import homescreen = require('homescreen');

import tutorialController = require('controller/Tutorial');
import hudController = require('controller/HUD');

// view controllers
import BaseViewController = require('controller/view/Base');
import MenuController = require('controller/Menu');
import LoadingController = require('controller/view/Loading');
import OverviewController = require('controller/view/Overview');
import MouseController = require('controller/view/Mouse');
import ChemicalController = require('controller/view/Chemical');
import ComputerController = require('controller/view/Computer');
import FumehoodController = require('controller/view/Fumehood');
import Worktable1Controller = require('controller/view/Worktable1');
import Worktable2Controller = require('controller/view/Worktable2');
import Worktable3Controller = require('controller/view/Worktable3');
import IncubatorController = require('controller/view/Incubator');
import SpectroPMController = require('controller/view/SpectroPM');
import SpectroPMScreenController = require('controller/view/SpectroPMScreen');
import FermentorController = require('controller/view/Fermentor');
import FermentorScreenController = require('controller/view/FermentorScreen');
import UvRoomController = require('controller/view/UvRoom');
import WashingController = require('controller/view/Washing');
import GelElectroController = require('controller/view/GelElectro');

//TODO: remove, just for dummy-data
import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');
import SpecialItemFactory = require('factory/SpecialItem');
import MouseBloodType = require('model/type/MouseBlood');

class App extends BaseViewController {

    public activeViewController: KnockoutObservable<BaseViewController>;

    public tutorialController = tutorialController;
    public hudController = hudController;
    public menuController: MenuController;

    private viewControllers;

    constructor(isWeb) {
        super('app');

        this.activeViewController = ko.observable(null);

        this.menuController = new MenuController();

        // encourage users on tablet to add the app to their homescreen
        homescreen();

        var spectropmController = new SpectroPMController();

        this.viewControllers = {
            loading         : new LoadingController(),
            overview        : new OverviewController(),
            computer        : new ComputerController(),
            chemical        : new ChemicalController(),
            worktable1      : new Worktable1Controller(),
            worktable2      : new Worktable2Controller(),
            worktable3      : new Worktable3Controller(),
            fumehood        : new FumehoodController(),
            incubator       : new IncubatorController(),
            mouse           : new MouseController(),
            spectropm       : spectropmController,
            spectropmscreen : new SpectroPMScreenController(spectropmController),
            fermentor       : new FermentorController(),
            fermentorscreen : new FermentorScreenController(),
            uvroom          : new UvRoomController(),
            washing         : new WashingController(),
            gelelectro      : new GelElectroController(),
        };

        // setup routing
        this.router.currentRoute.subscribe((routeName) => {
            this.viewChange(routeName);
        });

        // this.gameState.inventory.add(ContainerFactory.tube().add(LiquidFactory.buffyCoat(MouseBloodType.DIABETIC)));
        // this.gameState.inventory.add(ContainerFactory.tube().add(LiquidFactory.lysis()));
        // this.gameState.inventory.add(ContainerFactory.tube().add(LiquidFactory.mouseBlood(MouseBloodType.DIABETIC)));
        // this.gameState.inventory.add(ContainerFactory.tube().add(LiquidFactory.saltWater()));
        // this.gameState.inventory.add(ContainerFactory.tube().add(LiquidFactory.freeFloatingDNA(MouseBloodType.DIABETIC)));

        // this.gameState.inventory.add(ContainerFactory.tube().add(LiquidFactory.clumpedCells(MouseBloodType.DIABETIC)));

        this.gameState.inventory.add(SpecialItemFactory.gel());

        // bootstrap the app by going to loading view
        // TODO-release: switch to loading
        //this.router.navigate('loading');
        this.router.navigate('overview');

        ko.rebind(this);
    }

    viewChange(viewName: string) {
        // exit current controller
        if (this.activeViewController()) {
            this.activeViewController().exit();
        }

        // find new controller and enter it
        var viewController = this.viewControllers[viewName];
        this.activeViewController(viewController);
        this.activeViewController().enter();
    }
}

export = App;
