import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import routerController = require('controller/Router');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
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
    public gelDropAccepter = DragHelper.acceptedByGelElectro;

    constructor(gelElectroModel: GelElectroModel) {
        this.gelElectroModel = gelElectroModel;

        ko.rebind(this);
    }

    trayDropHandler(gel: GelModel) {
        if (this.gelElectroModel.gelSlot())
            return false;

        this.gelElectroModel.gelSlot(gel);
        return true;
    }

    gelDropHandler(item) {
        if (!this.gelElectroModel.gelSlot())
            return false;
        
        var lane = this.gelElectroModel.gelSlot().getVacantLane();
        if (!lane) {
            popupController.message('gelelectro.no-empty-lanes.header',
                                    'gelelectro.no-empty-lanes.body');
            return;
        } 
        
        if (item.type() === ContainerType.PIPETTE) {
            item.emptyPipetteInto(lane);
        } else if (item.type() === ContainerType.TUBE && item.contains(LiquidType.BLUE_STAIN)) {
            this.gelElectroModel.gelSlot().isStained(true);
            item.clearContents();
        } else {
            return false;
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
        this.gelElectroModel.status(false);
    }

    activate() {
        if (this.gelElectroModel.status())
            return;

        this.gelElectroModel.status(true);

        _.delay(this.finishActivate, 2000);
    }
}

export = GelElectroController;
