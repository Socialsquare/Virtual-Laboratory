import ko = require('knockout');

import LocationType = require('model/type/Location');

import TubeRackModel = require('model/TubeRack');
import IceBathModel = require('model/IceBath');
import PCRMachineModel = require('model/PCRMachine');

class Worktable3 {

    public tubeRack: TubeRackModel;
    public iceBath: IceBathModel;
    public pcrMachine: PCRMachineModel;

    constructor() {
        this.iceBath = new IceBathModel();
        this.iceBath.location(LocationType.WORKTABLE3);

        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.WORKTABLE3);

        this.pcrMachine = new PCRMachineModel();
        this.pcrMachine.location(LocationType.WORKTABLE3);

        ko.rebind(this);
    }

    reset() {
        this.tubeRack.removeAll();
        this.iceBath.removeAll();
        this.pcrMachine.removeAll();
    }
}

export = Worktable3;
