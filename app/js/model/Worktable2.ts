import ko = require('knockout');

import LocationType = require('model/type/Location');

import TubeRackModel = require('model/TubeRack');
import PetriSpaceModel = require('model/PetriSpace');
import MicroSpaceModel = require('model/MicroSpace');
import ODMachineModel = require('model/ODMachine');
import BlenderModel = require('model/Blender');
import CentrifugeModel = require('model/Centrifuge');
import GelElectroModel = require('model/GelElectro');

class Worktable2 {

    public tableSpacePetri: PetriSpaceModel;
    public tableSpaceMicro: MicroSpaceModel;
    public tubeRack: TubeRackModel;

    public odMachine: ODMachineModel;
    public blender: BlenderModel;
    public centrifuge: CentrifugeModel;
    public gelElectro: GelElectroModel;

    constructor() {
        this.tableSpacePetri = new PetriSpaceModel();
        this.tableSpacePetri.location(LocationType.WORKTABLE2);

        this.tableSpaceMicro = new MicroSpaceModel();
        this.tableSpaceMicro.location(LocationType.WORKTABLE2);

        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.WORKTABLE2);

        this.odMachine = new ODMachineModel();
        this.blender = new BlenderModel();
        this.centrifuge = new CentrifugeModel();
        this.gelElectro = new GelElectroModel();

        ko.rebind(this);
    }

    reset() {
        this.tableSpacePetri.removeAll();
        this.tableSpaceMicro.removeAll();
        this.tubeRack.removeAll();

        this.odMachine.removeAll();
        this.blender.status(false);
        this.centrifuge.removeAll();
        this.centrifuge.status(false);
    }
}

export = Worktable2;
