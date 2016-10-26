import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');
import gameState = require('model/GameState');

import CompositeContainerController = require('controller/CompositeContainer');

import PCRMachineModel = require('model/PCRMachine');
import TubeModel = require('model/Tube');
import FreeFloatingDNAModel = require('model/FreeFloatingDNA');

import ActivationType = require('model/type/Activation');
import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import ContainerFactory = require('factory/Container');

class PCRMachine extends CompositeContainerController {

    public compContainer: PCRMachineModel;

    constructor(pcrMachineModel: PCRMachineModel) {
        super(pcrMachineModel);

        ko.rebind(this);
    }

    handleContainerDrop(position: number, item) {
        // Prevent mixing when tubes are in the PCR machine
        return false;
    }

    tryCopyDNA(tube: TubeModel) {
        if (!tube) {
            return;
        }

        // copy diabetes dna if diabetes primers is present
        var ffd = <FreeFloatingDNAModel>tube.findByType(LiquidType.FREE_FLOATING_DNA);

        if (!ffd) {
            return;
        }

        var required = [LiquidType.DIABETES_PRIMER, LiquidType.FREE_FLOATING_DNA,
            LiquidType.DNA_POLYMERASE, LiquidType.NUCLEOTIDES];
        var tubeIsCopyable = tube.containsAllStrict(required);

        if ((ffd.bloodType() === MouseBloodType.DIABETIC) && tubeIsCopyable)
            ffd.isCopied(true);

        // When the PCR machine successfully runs on mouse blood,
        // provide the user with the result of the opposite blood type
        if (tubeIsCopyable) {
            var clone = ffd.clone();
            var bloodType = ffd.bloodType() === MouseBloodType.NORMAL ? MouseBloodType.DIABETIC : MouseBloodType.NORMAL;
            clone.bloodType(bloodType);
            clone.isCopied(ffd.bloodType() === MouseBloodType.DIABETIC);

            gameState.inventory.add(ContainerFactory.tube().add(clone));

            popupController.message('pcr.acquired-other.header', 'pcr.acquired-other.body');
        }
    }

    performPCR() {
        _.each(this.compContainer.containers(), this.tryCopyDNA);

        this.compContainer.status(false);
    }

    activate() {
        var doActivation = () => {
            this.compContainer.status(true);
            _.delay(this.performPCR, 2000);
            experimentController.triggerActivation(ActivationType.PCR, this.compContainer);
        };

        popupController
            .offer('pcr.ask-video.header', 'pcr.ask-video.body')
            .then(() => popupController.video('pcrmachine', false, true))
            .always(doActivation);
    }
}

export = PCRMachine;
