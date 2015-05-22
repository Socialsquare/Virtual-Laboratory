import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import TextHelper = require('utils/TextHelper');
import CompositeContainerController = require('controller/CompositeContainer');

import gameState = require('model/GameState');
import PCRMachineModel = require('model/PCRMachine');

import TubeModel = require('model/Tube');

import DNAType = require('model/type/DNA');

import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');

class PCRMachine extends CompositeContainerController {

    public compContainer: PCRMachineModel;

    constructor(pcrMachineModel: PCRMachineModel) {
        super(pcrMachineModel);

        ko.rebind(this);
    }

    activate() {
        console.log(this.compContainer.containers());
    }
}

export = PCRMachine;
