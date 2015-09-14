import ko = require('knockout');
import _ = require('lodash');

import GlucoseBagModel = require('model/GlucoseBag');

import hudController = require('controller/HUD');

class GlucoseBagController {

    public glucoseBag: GlucoseBagModel;
    private STEP: number;

    constructor(glucoseBag: GlucoseBagModel) {
        this.glucoseBag = glucoseBag;
        this.STEP = 5;

        ko.rebind(this);
    }

    activate() {
        this.glucoseBag.activate();
        if (this.glucoseBag.status()) {
            hudController.flashTimePassing(60);
        } else {
            hudController.hideTimePassing();
        }
    }

    increaseRate() {
        if (this.glucoseBag.status()) {
            this.glucoseBag.glucoseInfusionRate(this.glucoseBag.glucoseInfusionRate()+ this.STEP);
        }
    }

    decreaseRate() {
        if (this.glucoseBag.status()) {
            var newRate = this.glucoseBag.glucoseInfusionRate() - this.STEP;
            if (newRate < 0) newRate = 0;
            this.glucoseBag.glucoseInfusionRate(newRate)
        }
    }
}

export = GlucoseBagController;
