import ko = require('knockout');
import _ = require('lodash');

import GlucoseBagModel = require('model/GlucoseBag');

import hudController = require('controller/HUD');

class GlucoseBagController {

    public glucoseBag: GlucoseBagModel;

    constructor(glucoseBag: GlucoseBagModel) {
        this.glucoseBag = glucoseBag;

        ko.rebind(this);
    }

    activate() {
        this.glucoseBag.status(!this.glucoseBag.status());
        if (this.glucoseBag.status()) {
            hudController.flashTimePassing(60);
        } else {
            hudController.hideTimePassing();
        }
    }

    increaseRate() {
        this.glucoseBag.glucoseInfusionRate(this.glucoseBag.glucoseInfusionRate()+ 1);
        console.log(this.glucoseBag.glucoseInfusionRate());
    }

    decreaseRate() {
        var newRate = this.glucoseBag.glucoseInfusionRate() - 1;
        if (newRate < 0) newRate = 0;
        this.glucoseBag.glucoseInfusionRate(newRate)
        console.log(this.glucoseBag.glucoseInfusionRate());
    }
}

export = GlucoseBagController;
