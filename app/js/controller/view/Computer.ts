import ko = require('knockout');

import BaseComputerViewController = require('controller/view/computer/Base');

import BaseViewController = require('controller/view/Base');
import MenuScreen = require('controller/view/computer/Menu');
import DesignDNAScreen = require('controller/view/computer/DesignDNA');
import DesignDrugScreen = require('controller/view/computer/DesignDrug');
import OrderMouseScreen = require('controller/view/computer/OrderMouse');
import SequencingScreen = require('controller/view/computer/Sequencing');
import ProteinScreen = require('controller/view/computer/Protein');
import gameState = require('model/GameState');
import ComputerScreenType = require('model/type/ComputerScreen');

class Computer extends BaseViewController {

    public activeScreenController: KnockoutObservable<BaseComputerViewController>;
    public hasHeader: KnockoutComputed<boolean>;

    constructor() {
        super('computer');

        this.activeScreenController = ko.observable(null);
        gameState.pipette.active(false);

        var screenControllers = {};
        screenControllers[ComputerScreenType.MENU] = new MenuScreen();
        screenControllers[ComputerScreenType.DESIGN_DNA] = new DesignDNAScreen();
        screenControllers[ComputerScreenType.DESIGN_DRUG] = new DesignDrugScreen();
        screenControllers[ComputerScreenType.ORDER_MOUSE] = new OrderMouseScreen();
        screenControllers[ComputerScreenType.SEQUENCING] = new SequencingScreen();
        screenControllers[ComputerScreenType.PROTEIN] = new ProteinScreen();

        // TODO: subscription seemed to fail
        this.activeScreenController = ko.pureComputed(() => {
            return screenControllers[gameState.activeComputerScreen()];
        });

        this.hasHeader = ko.pureComputed(() => {
            return gameState.activeComputerScreen() !== ComputerScreenType.MENU;
        });

        ko.rebind(this);
    }

    goToMenu() {
        gameState.activeComputerScreen(ComputerScreenType.MENU);
    }
}

export = Computer;
