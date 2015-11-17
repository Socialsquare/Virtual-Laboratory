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
        //this.router.navigate('overview');
        var iadd = this.gameState.inventory.add;
        var t = ContainerFactory.tube;

        // 1. As a user I want to see the units for the blood sample
        //iadd(SpecialItemFactory.healthyMouse());
        //iadd(SpecialItemFactory.syringe());
        
        // 2. As a user I would like to see a pop-up describing the glucose we give the mouse using the bottle
        // 3. As a user I want to be forced to change pipette tip when switching between DNA types.

        // 4. Pop-up message saying "Mouse in danger of developing diabetes if you give it too much juice" 
        // should not appear during clamp and mouse should not develop diabetes
        //iadd(SpecialItemFactory.healthyMouse());
        //iadd(SpecialItemFactory.healthyMouse());
        
        // 5. As a user I wanter to see graphics on the PCR machine
        //iadd(t());
        //iadd(t());
        //iadd(t());
        //iadd(t());

        // 6. As a user I wanter to see graphics on the gel electro 
        //iadd(t().add(LiquidFactory.freeFloatingDNA(MouseBloodType.DIABETIC)));
        //iadd(t().add(LiquidFactory.freeFloatingDNA(MouseBloodType.NORMAL)));
        //iadd(t().add(LiquidFactory.blueStain()));
        //iadd(SpecialItemFactory.gel());
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
            template: { require: 'text!tmpldir/components/vetmonitor.ko'},
        });

        ko.components.register('vetmonitor-export-popup-component', {
            viewModel: VetMonitorExportPopup,
            template: { require: 'text!tmpldir/components/vetmonitor-export-popup.ko'},
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
