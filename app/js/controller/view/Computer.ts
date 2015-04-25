import ko = require('knockout');
import mapping = require('mapping');
import _ = require('lodash');

import BaseViewController = require('controller/view/Base');
import MenuScreen = require('controller/view/computer/Menu');
import DesignDNAScreen = require('controller/view/computer/DesignDNA');
import DesignDrugScreen = require('controller/view/computer/DesignDrug');
import OrderMouseScreen = require('controller/view/computer/OrderMouse');
import SequencingScreen = require('controller/view/computer/Sequencing');
import ProteinScreen = require('controller/view/computer/Protein');

import ComputerScreenType = require('model/type/ComputerScreen');

class Computer extends BaseViewController {

    public activeScreenController;
    public hadHeader;

    constructor() {
        super('computer');

        this.activeScreenController = ko.observable(null);
        this.shouldHidePipette(true);

        var screenControllers = {};
        screenControllers[ComputerScreenType.MENU] = new MenuScreen();
        screenControllers[ComputerScreenType.DESIGN_DNA] = new DesignDNAScreen();
        screenControllers[ComputerScreenType.DESIGN_DRUG] = new DesignDrugScreen();
        screenControllers[ComputerScreenType.ORDER_MOUSE] = new OrderMouseScreen();
        screenControllers[ComputerScreenType.SEQUENCING] = new SequencingScreen();
        screenControllers[ComputerScreenType.PROTEIN] = new ProteinScreen();

        // TODO: subscription seemed to fail
        this.activeScreenController = ko.computed(() => {
            return screenControllers[this.gameState.activeComputerScreen()];
        });

        this.hasHeader = ko.computed(() => {
            return this.gameState.activeComputerScreen() !== ComputerScreenType.MENU;
        });
    }

    public goToMenu = () => {
        this.gameState.activeComputerScreen(ComputerScreenType.MENU);
    }
}

export = Computer;
