import ko = require('knockout');
import _ = require('lodash');

import GlucoseBagModel = require('model/GlucoseBag');

class GlucoseBagController {

    public glucoseBag: GlucoseBagModel;

    constructor(glucoseBag: GlucoseBagModel) {
        this.glucoseBag = glucoseBag;

        ko.rebind(this);
    }

    activate() {
        this.glucoseBag.status(!this.glucoseBag.status());
    }
}

export = GlucoseBagController;
