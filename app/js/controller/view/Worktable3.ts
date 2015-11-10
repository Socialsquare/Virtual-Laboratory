import ko = require('knockout');

import BaseViewController = require('controller/view/Base');

import CompositeContainerController = require('controller/CompositeContainer');
import PCRMachineController = require('controller/PCRMachine');
import IceBathController = require('controller/IceBath');
import GelElectroController = require('controller/GelElectro');

import Worktable3Model = require('model/Worktable3');

class Worktable3 extends BaseViewController {

    public worktable3: Worktable3Model;

    public tubeRackController: CompositeContainerController;
    public iceBathController: CompositeContainerController;
    public pcrMachineController: PCRMachineController;
    public gelElectroController: GelElectroController;

    constructor() {
        super('worktable3');

        this.worktable3 = this.gameState.worktable3;

        this.tubeRackController = new CompositeContainerController(this.worktable3.tubeRack);
        this.iceBathController = new IceBathController(this.worktable3.iceBath);
        this.pcrMachineController = new PCRMachineController(this.worktable3.pcrMachine);
        this.gelElectroController = new GelElectroController(this.worktable3.gelElectro);

        ko.rebind(this);
    }

    activatePCRMachine() {
        this.pcrMachineController.activate();
    }
}

export = Worktable3;
