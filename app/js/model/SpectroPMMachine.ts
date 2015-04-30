import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');


class SpectroPMMachine extends CompositeContainerModel {

    constructor() {
        super(1, ContainerType.MICROTITER, ContainerType.SPECTROPM_MACHINE);
    }

    //TODO all the things!
    public hasMicrotiter = () => {
        return this.hasContainerAt(0);
    }
}

export = SpectroPMMachine;
