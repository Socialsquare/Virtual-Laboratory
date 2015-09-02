import ko = require('knockout');
import _ = require('lodash');

import GlucoseBagModel = require('model/GlucoseBag');

class GlucoseBagController {

    public glucoseBagModel: GlucoseBagModel;

    constructor(glucoseBagModel: GlucoseBagModel) {
        this.glucoseBagModel = glucoseBagModel;

        ko.rebind(this);
    }

    activate() {
        this.glucoseBagModel.status(!this.glucoseBagModel.status());
    }
}

export = GlucoseBagController;
