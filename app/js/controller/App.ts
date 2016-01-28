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
import MouseCageController = require('controller/view/MouseCage');
import VetMonitorController = require('controller/view/VetMonitor');
import VetMonitorExportPopup = require('controller/view/VetMonitorExportPopup');
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
import gameState = require('model/GameState');
import LiquidType = require('model/type/Liquid');

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
            mousecage       : new MouseCageController(),
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

        // function shortcuts for testing
        var iadd = gameState.inventory.add;
        var t = ContainerFactory.tube;
        var t1 = t();

        //iadd(t().add(LiquidFactory.buffyCoat(MouseBloodType.NORMAL)));
        //iadd(t().add(LiquidFactory.lysis()));
        //iadd(t().add(LiquidFactory.saltWater()));

        iadd(SpecialItemFactory.healthyMouse());
        iadd(SpecialItemFactory.diabeticMouse());
        iadd(SpecialItemFactory.syringe());
        iadd(SpecialItemFactory.syringe());

        //t1.add(LiquidFactory.homoSpleen(LiquidType.ANTIBODY_SMALLPOX));
        //t1.add(LiquidFactory.hybridomaMedium());
        //t1.add(LiquidFactory.microorganism.myeloma());
        //iadd(t1);
        //iadd(t().add(LiquidFactory.fusionMedium()));
        //t1.add(LiquidFactory.antigenSmallpox());
        //t1.add(LiquidFactory.adjuvans());
        //t1.add(LiquidFactory.buffer());
        //iadd(t1);
        
        //iadd(SpecialItemFactory.gel());
        //iadd(t().add(LiquidFactory.freeFloatingDNA(MouseBloodType.NORMAL)).add(LiquidFactory.blueStain()));
        //iadd(t().add(LiquidFactory.freeFloatingDNA(MouseBloodType.DIABETIC)).add(LiquidFactory.blueStain()));
        //iadd(t().add(LiquidFactory.mouseBlood(MouseBloodType.DIABETIC)));
        //iadd(t().add(LiquidFactory.clumpedCells()));
        //iadd(t().add(LiquidFactory.water()));
        ko.rebind(this);
    }
    
    public registerComponents = () => {
        ko.components.register('vetmonitor-component', {
            viewModel: { 
                createViewModel: (params, componentInfo) => {
                    var vetmon = new VetMonitorController(params);
                    vetmon.enter();
                    return vetmon;
                }
            },
            template: { element: 'vetmonitor' },
        });

        ko.components.register('vetmonitor-export-popup-component', {
            viewModel: VetMonitorExportPopup,
            template: { element: 'vetmonitor-export-popup' },
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
