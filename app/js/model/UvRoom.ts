import ko = require('knockout');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');

import TubeRackModel = require('model/TubeRack');
import PetriSpaceModel = require('model/PetriSpace');
import MicroSpaceModel = require('model/MicroSpace');


class UvRoom {

    public tableSpacePetri: PetriSpaceModel;
    public tableSpaceMicro: MicroSpaceModel;
    public tubeRack: TubeRackModel;

    constructor() {
        this.tableSpacePetri = new PetriSpaceModel(3, ContainerType.UV_PETRI_SPACE);
        this.tableSpacePetri.location(LocationType.UVROOM);

        this.tableSpaceMicro = new MicroSpaceModel(ContainerType.UV_MICRO_SPACE);
        this.tableSpaceMicro.location(LocationType.UVROOM);

        this.tubeRack = new TubeRackModel(ContainerType.UV_TUBE_RACK);
        this.tubeRack.location(LocationType.UVROOM);

        ko.rebind(this);
    }

    reset() {
        this.tableSpacePetri.removeAll();
        this.tableSpaceMicro.removeAll();
        this.tubeRack.removeAll();
    }
}

export = UvRoom;
