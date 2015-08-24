import gameState = require('model/GameState');

import ContainerType = require('model/type/Container');
import ActivationType = require('model/type/Activation');

import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');
import experimentController = require('controller/Experiment');

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

    handleGelDrop(item) {
        if (item.type() !== ContainerType.GEL) return false;
        
        this.uvroom.gel(item);
    }

    viewGel() {
        experimentController.triggerActivation(ActivationType.GEL, this.uvroom.gel());
        this.popupController.gelInfo(this.uvroom.gel());
    }

    removeGel() {
        this.uvroom.gel(null);
    }
}

export = UvRoom;
