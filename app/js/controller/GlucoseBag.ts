import ko = require('knockout');
import _ = require('lodash');

import vetMonitorLog = require('service/VetMonitorLog');
import MouseCageModel = require('model/MouseCage');
import GlucoseBagModel = require('model/GlucoseBag');
import ActivationType = require('model/type/Activation');
import experimentController = require('controller/Experiment');
import hudController = require('controller/HUD');

class GlucoseBag {

    public mouseCage: MouseCageModel;
    public glucoseBag: GlucoseBagModel;
    private STEP: number;

    constructor(mouseCage: MouseCageModel) {
        this.mouseCage = mouseCage;
        var gb = mouseCage.glucoseBag;
        this.glucoseBag = gb;
        this.STEP = 5;

        ko.rebind(this);
    }

    activate() {
        this.glucoseBag.activate();
        if (this.glucoseBag.status()) {
            hudController.flashTimePassing(60);
        } else {
            hudController.hideTimePassing();
            // update logId when bag is deactivated
            vetMonitorLog.updateLogId();
        }
        experimentController.triggerActivation(ActivationType.GLUCOSE_BAG, this);
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

export = GlucoseBag;
