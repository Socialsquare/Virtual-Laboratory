import ko = require('knockout');
import homescreen = require('homescreen');
import $ = require('jquery');

import tutorialController = require('controller/Tutorial');
import hudController = require('controller/HUD');

// view controllers
import BaseViewController = require('controller/view/Base');
import MenuController = require('controller/Menu');
import LoadingController = require('controller/view/Loading');
import OverviewController = require('controller/view/Overview');
import MouseCageViewController = require('controller/view/MouseCageViewController');
import VetMonitorViewController = require('controller/view/VetMonitorViewController');
import VetMonitorWithGirViewController = require('controller/view/VetMonitorWithGirViewController');
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
            mousecage       : new MouseCageViewController(),
            spectropm       : spectropmController,
            spectropmscreen : new SpectroPMScreenController(spectropmController),
            fermentor       : new FermentorController(),
            fermentorscreen : new FermentorScreenController(),
            uvroom          : new UvRoomController(),
            washing         : new WashingController(),
        };
        
        this.registerComponents();
        
        // setup routing
        this.router.currentRoute.subscribe((routeName) => {
            this.viewChange(routeName);
        });

        // bootstrap the app by going to loading view
        this.router.navigate('loading');
        //this.router.navigate('overview');

        ko.rebind(this);
    }
    
    public registerComponents = () => {
        ko.components.register('vetmonitor-component', {
            viewModel: { 
                createViewModel: (params, componentInfo) => {
                    var vetmon = new VetMonitorViewController(params);
                    vetmon.enter();
                    return vetmon;
                }
            },
            template: { require: 'text!tmpldir/components/vetmonitor.ko'},
        });
        ko.components.register('vetmonitorwithgir-component', {
            viewModel: { 
                createViewModel: (params, componentInfo) => {
                    var vetmon = new VetMonitorWithGirViewController(params);
                    vetmon.enter();
                    return vetmon;
                }
            },
            template: { require: 'text!tmpldir/components/vetmonitorwithgir.ko'},
        });
    }

    viewChange(viewName: string) {
        if (window['BUILD'] !== 'production') console.log(viewName);

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
