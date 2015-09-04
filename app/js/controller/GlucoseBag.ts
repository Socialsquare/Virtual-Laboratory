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
}

export = GlucoseBagController;
