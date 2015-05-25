import ko = require('knockout');
import _ = require('lodash');

import TextHelper = require('utils/TextHelper');

import popupController = require('controller/Popup');
import gameState = require('model/GameState');

import CompositeContainerController = require('controller/CompositeContainer');

import PCRMachineModel = require('model/PCRMachine');
import TubeModel = require('model/Tube');
import DiabetesPrimerModel = require('model/DiabetesPrimer');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');

class PCRMachine extends CompositeContainerController {

    public compContainer: PCRMachineModel;

    constructor(pcrMachineModel: PCRMachineModel) {
        super(pcrMachineModel);

        ko.rebind(this);
    }

    tryCopyDNA(tube: TubeModel) {
        // copy diabetes dna if diabetes primers is present
        var ffd = <FreeFloatingDNAModel>tube.findByType(LiquidType.FREE_FLOATING_DNA);

        if (!ffd)
            return;

        var required = [LiquidType.DIABETES_PRIMER, LiquidType.FREE_FLOATING_DNA];

        if (ffd.bloodType() === MouseBloodType.DIABETIC && tube.containsAllStrict(required))
            ffd.isCopied(true);

        popupController.message('pcr.dna-copied.header', 'pcr.dna-copied.body');
    }

    activate() {
        this.compContainer.status(true);

        _.delay(() => {
            _.each(this.compContainer.containers(), this.tryCopyDNA);

            this.compContainer.status(false);
        }, 2000);
    }
}

export = PCRMachine;
