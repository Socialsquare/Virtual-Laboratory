import ko = require('knockout');

import TubeRackModel = require('model/TubeRack');
import PetriSpaceModel = require('model/PetriSpace');
import MicroSpaceModel = require('model/MicroSpace');
import ContainerTypeModel = require('model/type/Container');
import HeaterModel = require('model/Heater');
import ElectroporatorModel = require('model/Electroporator');

import LocationType = require('model/type/Location');

class Worktable1 {

    public tableSpacePetri: PetriSpaceModel;
    public tableSpaceMicro: MicroSpaceModel;
    public tubeRack: TubeRackModel;
    public electroporator: ElectroporatorModel;
    public heater: HeaterModel;

    public bunsenBurner: KnockoutObservable<boolean>;

    constructor() {
        this.tableSpacePetri = new PetriSpaceModel();
        this.tableSpacePetri.location(LocationType.WORKTABLE1);

        this.tableSpaceMicro = new MicroSpaceModel();
        this.tableSpaceMicro.location(LocationType.WORKTABLE1);

        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.WORKTABLE1);

        this.electroporator = new ElectroporatorModel();
        this.heater = new HeaterModel();

        this.bunsenBurner = ko.observable(false);

        ko.rebind(this);
    }

    reset() {
        this.tableSpacePetri.removeAll();
        this.tableSpaceMicro.removeAll();
        this.tubeRack.removeAll();

        this.bunsenBurner(false);
        this.electroporator.clearContents();
        this.heater.removeAll();
    }
}

export = Worktable1;
