import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');

import CompositeContainerController = require('controller/CompositeContainer');

import PCRMachineModel = require('model/PCRMachine');
import TubeModel = require('model/Tube');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class PCRMachine extends CompositeContainerController {

    public compContainer: PCRMachineModel;

    constructor(pcrMachineModel: PCRMachineModel) {
        super(pcrMachineModel);

        ko.rebind(this);
    }

    handleContainerDrop(position: number, item) {
        // Prevent mixing when tubes are in the PCR machine
        return;
    }

    tryCopyDNA(tube: TubeModel) {
        if (!tube)
            return;

        // copy diabetes dna if diabetes primers is present
        var ffd = <FreeFloatingDNAModel>tube.findByType(LiquidType.FREE_FLOATING_DNA);

        if (!ffd)
            return;

        var required = [LiquidType.DIABETES_PRIMER, LiquidType.FREE_FLOATING_DNA];

        if (ffd.bloodType() === MouseBloodType.DIABETIC && tube.containsAllStrict(required)) {
            ffd.isCopied(true);
            popupController.video('electroporator1', false);
        }
        // TODO-PCR: message if nothing happens?
        // TODO-PCR: correct video
        //popup.message('pcr.dna-copied.header', 'pcr.dna-copied.body');
    }

    performPCR() {
        _.each(this.compContainer.containers(), this.tryCopyDNA);

        this.compContainer.status(false);
    }

    activate() {
        this.compContainer.status(true);

        _.delay(this.performPCR, 2000);
    }
}

export = PCRMachine;
