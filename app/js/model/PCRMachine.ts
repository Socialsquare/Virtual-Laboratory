import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');

class PCRMachine extends CompositeContainerModel {

    constructor() {
        super(2, ContainerType.TUBE, ContainerType.PCR_MACHINE);
    }
}

export = PCRMachine;
