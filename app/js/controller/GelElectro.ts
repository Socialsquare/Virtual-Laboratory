import ko = require('knockout');
import _ = require('lodash');

import DragHelper = require('utils/DragHelper');

import GelModel = require('model/Gel');
import GelElectroModel = require('model/GelElectro');

class GelElectroController {

    public gelElectroModel: GelElectroModel;

    public dropAccepter = DragHelper.acceptGel;

    constructor(gelElectroModel: GelElectroModel) {
        this.gelElectroModel = gelElectroModel;

        ko.rebind(this);
    }

    dropHandler(gel: GelModel) {
        if (this.gelElectroModel.gelSlot())
            return false;

        this.gelElectroModel.gelSlot(gel);

        return true;
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
