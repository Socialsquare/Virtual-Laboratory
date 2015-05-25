import ko = require('knockout');

import LocationType = require('model/type/Location');

import TubeRackModel = require('model/TubeRack');
import PetriSpaceModel = require('model/PetriSpace');
import MicroSpaceModel = require('model/MicroSpace');

class Fumehood {

    public tableSpacePetri: PetriSpaceModel;
    public tableSpaceMicro: MicroSpaceModel;
    public tubeRack: TubeRackModel;

    constructor() {
        this.tableSpacePetri = new PetriSpaceModel();
        this.tableSpacePetri.location(LocationType.FUMEHOOD);

        this.tableSpaceMicro = new MicroSpaceModel();
        this.tableSpaceMicro.location(LocationType.FUMEHOOD);

        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.FUMEHOOD);

        ko.rebind(this);
    }

    reset() {
        this.tableSpacePetri.removeAll();
        this.tableSpaceMicro.removeAll();
        this.tubeRack.removeAll();
    }
}

export = Fumehood;
