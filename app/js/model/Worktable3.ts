import ko = require('knockout');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');

import TubeRackModel = require('model/TubeRack');
import IceBathModel = require('model/IceBath');
import PCRMachineModel = require('model/PCRMachine');
import GelElectroModel = require('model/GelElectro');

class Worktable3 {

    public tubeRack: TubeRackModel;
    public iceBath: IceBathModel;
    public pcrMachine: PCRMachineModel;
    public gelElectro: GelElectroModel;

    constructor() {
        this.iceBath = new IceBathModel();
        this.iceBath.location(LocationType.WORKTABLE3);

        this.tubeRack = new TubeRackModel(ContainerType.WORK3_TUBE_RACK);
        this.tubeRack.location(LocationType.WORKTABLE3);

        this.pcrMachine = new PCRMachineModel();
        this.pcrMachine.location(LocationType.WORKTABLE3);

        this.gelElectro = new GelElectroModel();

        ko.rebind(this);
    }

    reset() {
        this.tubeRack.removeAll();
        this.iceBath.removeAll();
        this.pcrMachine.removeAll();
    }
}

export = Worktable3;
