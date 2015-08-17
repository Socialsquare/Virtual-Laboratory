import ko = require('knockout');
import _ = require('lodash');
import $ = require('jquery');

import popupController = require('controller/Popup');
import routerController = require('controller/Router');
import experimentController = require('controller/Experiment');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import ActivationType = require('model/type/Activation');
import DragHelper = require('utils/DragHelper');

import SimpleContainerModel = require('model/SimpleContainer');
import GelModel = require('model/Gel');
import PipetteModel = require('model/Pipette');
import TubeModel = require('model/Tube');
import LaneModel = require('model/Lane');
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
        
        if (item.getTip().contains(LiquidType.BLUE_STAIN)) {
            this.gelElectroModel.gelSlot().isStained(true);
            item.getTip().clearContents();
            experimentController.triggerActivation(ActivationType.BLUE_STAIN, this.gelElectroModel.gelSlot());
        } else {
            var lane = this.gelElectroModel.gelSlot().getVacantLane();
            if (!lane) {
                popupController.message('gelelectro.no-empty-lanes.header',
                                        'gelelectro.no-empty-lanes.body');
                return false;
            } 

            experimentController.triggerAcquisition(lane);
            item.emptyPipetteInto(lane);
        } 
        
        return true;
    }

    viewGel() {
        popupController.gelInfo(this.gelElectroModel.gelSlot);
    }

    removeGel() {
        this.gelElectroModel.gelSlot(null);
    }

    finishActivate() {
        this.gelElectroModel.gelSlot().isElectrofied(true);
        this.gelElectroModel.status(false);
        experimentController.triggerActivation(ActivationType.GELELECTRO, this.gelElectroModel.gelSlot());
    }

    activate() {
        if (this.gelElectroModel.status())
            return;

        if (!this.gelElectroModel.hasGel())
            return;

        this.gelElectroModel.status(true);

        _.each(this.gelElectroModel.gelSlot().lanes(), function(lane, i) {
            lane.calculateValue();
            var laneElm = $('#lane'+i);
            laneElm.animate({ width: lane.value}, 2000);
        });

        _.delay(this.finishActivate, 2000);
    }
}

export = GelElectroController;
