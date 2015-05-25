import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');


class SpectroPMMachine extends CompositeContainerModel {

    constructor() {
        super(1, ContainerType.MICROTITER, ContainerType.SPECTROPM_MACHINE);

        ko.rebind(this);
    }

    //TODO all the things!
    hasMicrotiter() {
        return this.hasContainerAt(0);
    }
}

export = SpectroPMMachine;
