import ko = require('knockout');

import SimpleContainerModel = require('model/SimpleContainer');
import WellModel = require('model/Well');

import ContainerType = require('model/type/Container');

class Tube extends SimpleContainerModel {

    public well: WellModel;

    constructor() {
        super(ContainerType.TUBE, Math.pow(10, 13));

        ko.rebind(this);
    }

    // `add` is wrapped to return the correct type of container
    add(liquid, preventTrigger = false) {
        super.add(liquid, preventTrigger);
        return this;
    }
}

export = Tube;
