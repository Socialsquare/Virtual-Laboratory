import ko = require('knockout');
import _ = require('lodash');
import $ = require('jquery');

import popupController = require('controller/Popup');
import experimentController = require('controller/Experiment');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');
import DragHelper = require('utils/DragHelper');

import GelModel = require('model/Gel');
import GelElectroModel = require('model/GelElectro');

class GelElectroController {

    public gelElectroModel: GelElectroModel;

    public trayDropAccepter = DragHelper.acceptGel;
    public gelDropAccepter = DragHelper.acceptedByGel;

    constructor(gelElectroModel: GelElectroModel) {
        this.gelElectroModel = gelElectroModel;

        ko.rebind(this);
    }

    trayDropHandler(gel: GelModel) {
        if (this.gelElectroModel.hasGel())
            return false;

        this.gelElectroModel.gelSlot(gel);
        return true;
    }

    gelDropHandler(item) {
        if (!this.gelElectroModel.hasGel())
            return false;

        if (item.type() !== ContainerType.PIPETTE) return false;
        
        var tip = item.getTip();
        var lane;
        if (tip.contains(LiquidType.FREE_FLOATING_DNA)) {
            lane = this.gelElectroModel.gelSlot().getVacantLane(); 
        } else if (tip.contains(LiquidType.BLUE_STAIN)) {
            lane = this.gelElectroModel.gelSlot().getUnstainedLane(); 
        }

        if (!lane) {
            return false;
        }

        item.emptyPipetteInto(lane);
        experimentController.triggerAcquisition(lane);
        return true;
    }

    viewGel() {
        popupController.gelInfo(this.gelElectroModel.gelSlot);
    }

    removeGel() {
        this.gelElectroModel.gelSlot(null);
    }

    finishActivate() {
        this.gelElectroModel.status(false);
        experimentController.triggerActivation(ActivationType.GELELECTRO, this.gelElectroModel.gelSlot());
    }

    activate() {
        if (this.gelElectroModel.status())
            return;
        
        this.gelElectroModel.status(true);

        if (this.gelElectroModel.hasGel()) {
            _.each(this.gelElectroModel.gelSlot().lanes(), (l) => l.electrofy());
            this.gelElectroModel.gelSlot().isElectrofied(true);
        }

        _.delay(this.finishActivate, 6000);
    }
}

export = GelElectroController;
