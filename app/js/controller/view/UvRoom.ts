import ko = require('knockout');
import gameState = require('model/GameState');

import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');

import UvRoomModel = require('model/UvRoom');

class UvRoom extends BaseViewController {

    public uvroom: UvRoomModel;

    public tableSpacePetriController: CompositeContainerController;
    public tableSpaceMicroController: CompositeContainerController;
    public tubeRackController: CompositeContainerController;

    constructor() {
        super('uvroom');

        this.uvroom = gameState.uvroom;

        this.tableSpacePetriController = new CompositeContainerController(this.uvroom.tableSpacePetri);
        this.tableSpaceMicroController = new CompositeContainerController(this.uvroom.tableSpaceMicro);
        this.tubeRackController = new CompositeContainerController(this.uvroom.tubeRack);
    }

    handleGelDrop(gel) {
        this.uvroom.gel(gel);
    }

    viewGel() {
        if (this.uvroom.gel.isStained()) {
            this.popupController.gelInfo(this.uvroom.gel);
        }
    }

    removeGel() {
        this.uvroom.gel(null);
    }
}

export = UvRoom;
