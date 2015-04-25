import ko = require('knockout');
import BaseViewController = require('controller/view/Base');
import homescreen = require('homescreen');

// controllers
import MenuController = require('controller/Menu');
import tutorialController = require('controller/Tutorial');
import LoadingController = require('controller/view/Loading');
import OverviewController = require('controller/view/Overview');
import MouseController = require('controller/view/Mouse');
import ChemicalController = require('controller/view/Chemical');
import ComputerController = require('controller/view/Computer');
import FumehoodController = require('controller/view/Fumehood');
import Worktable1Controller = require('controller/view/Worktable1');
import Worktable2Controller = require('controller/view/Worktable2');
import IncubatorController = require('controller/view/Incubator');
import SpectroPMController = require('controller/view/SpectroPM');
import SpectroPMScreenController = require('controller/view/SpectroPMScreen');
import FermentorController = require('controller/view/Fermentor');
import FermentorScreenController = require('controller/view/FermentorScreen');
import UvRoomController = require('controller/view/UvRoom');
import WashingController = require('controller/view/Washing');
//TODO: remove, just for dummy-data
import DesignDNAController = require('controller/view/computer/DesignDNA');
import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');
import SpecialItemFactory = require('factory/SpecialItem');

class App extends BaseViewController {

    public activeViewController = ko.observable();

    public menuController = new MenuController();
    public tutorialController = tutorialController;

    private viewControllers;

    constructor(isWeb) {
        super()

        // encourage users on tablet to add the app to their homescreen
        homescreen();

        spectropmController = new SpectroPMController();
        this.viewControllers = {
            loading: new LoadingController(),
            overview: new OverviewController(),
            computer: new ComputerController(),
            chemical: new ChemicalController(),
            worktable1: new Worktable1Controller(),
            worktable2: new Worktable2Controller(),
            fumehood: new FumehoodController(),
            incubator: new IncubatorController(),
            mouse: new MouseController(),
            spectropm: spectropmController,
            spectropmscreen: new SpectroPMScreenController(spectropmController),
            fermentor: new FermentorController(),
            fermentorscreen: new FermentorScreenController(),
            uvroom: new UvRoomController(),
            washing: new WashingController(),
            designDNA: new DesignDNAController() //TODO: remove
        };

        // setup routing
        this.router.currentRoute.subscribe((routeName) => {
            this.viewChange(routeName);
        });

        // bootstrap the app by going to loading view
        //this.router.navigate('loading');
        this.router.navigate('overview');

    }

    public viewChange = (viewName) => {
        // hide any potential active popup
        this.popupController.hide();

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
