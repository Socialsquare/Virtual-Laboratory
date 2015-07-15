import ko = require('knockout');
import _ = require('lodash');

import popupController = require('controller/Popup');
import routerController = require('controller/Router');

import DragHelper = require('utils/DragHelper');

import PipetteModel = require('model/Pipette');
import GelModel = require('model/Gel');
import GelElectroModel = require('model/GelElectro');

class GelElectroController {

    public gelElectroModel: GelElectroModel;

    public gelDropAccepter = DragHelper.acceptGel;
    public pipetteDropAccepter = DragHelper.acceptPipette;

    constructor(gelElectroModel: GelElectroModel) {
        this.gelElectroModel = gelElectroModel;

        ko.rebind(this);
    }

    gelDropHandler(gel: GelModel) {
        if (this.gelElectroModel.gelSlot())
            return false;

        this.gelElectroModel.gelSlot(gel);
        return true;
    }

    pipetteDropHandler(pipette: PipetteModel) {
        if (!this.gelElectroModel.gelSlot())
            return false;
        var lane = this.gelElectroModel.gelSlot().getVacantLane();
        if (lane)
            pipette.emptyPipetteInto(lane)
        else
            popupController.message('gelelectro.no-empty-lanes.header',
                                    'gelelectro.no-empty-lanes.body');
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
