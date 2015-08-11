import ko = require('knockout');
import gameState = require('model/GameState');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import SpecialItemType = require('model/type/SpecialItem');

import BaseViewController = require('controller/view/Base');
import CompositeContainerController = require('controller/CompositeContainer');

import UvRoomModel = require('model/UvRoom');
import GelModel = require('model/Gel');

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
        switch (item.type()) {
            case SpecialItemType.GEL:
                this.uvroom.gel(item);
                break;
            case ContainerType.TUBE:
                if (item.contains(LiquidType.BLUE_STAIN) && this.uvroom.gel().isElectrofied()) {
                    this.uvroom.gel().isStained(true);
                }
                break;
        }
    }

    viewGel() {
        if (this.uvroom.gel().isStained()) {
            this.popupController.gelInfo(this.uvroom.gel());
        }
    }

    removeGel() {
        this.uvroom.gel(null);
    }
}

export = UvRoom;
