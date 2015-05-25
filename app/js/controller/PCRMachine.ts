import ko = require('knockout');
import _ = require('lodash');

import TextHelper = require('utils/TextHelper');

import popupController = require('controller/Popup');
import gameState = require('model/GameState');

import CompositeContainerController = require('controller/CompositeContainer');

import PCRMachineModel = require('model/PCRMachine');
import TubeModel = require('model/Tube');
import DiabetesPrimerModel = require('model/DiabetesPrimer');

import LiquidType = require('model/type/Liquid');

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
        var diabetesDNA = <DiabetesPrimerModel>tube.findByType(LiquidType.FREE_FLOATING_DNA);
        var required = [LiquidType.DIABETES_PRIMER, LiquidType.FREE_FLOATING_DNA];

        if (tube.containsAllStrict(required) && diabetesDNA)
            diabetesDNA.isCopied(true);

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
