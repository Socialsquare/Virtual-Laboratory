import ko = require('knockout');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');

import TubeRackModel = require('model/TubeRack');
import IceBathModel = require('model/IceBath');

class Worktable3 {

    public tubeRack: TubeRackModel;
    public iceBath: IceBathModel;

    constructor() {
        this.iceBath = new IceBathModel();
        this.iceBath.location(LocationType.WORKTABLE3);

        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.WORKTABLE3);

        ko.rebind(this);
    }

    reset() {
        this.tubeRack.removeAll();
        this.iceBath.removeAll();
    }
}

export = Worktable3;
