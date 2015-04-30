import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');

class TubeRack extends CompositeContainerModel {

    constructor(type = ContainerType.TUBE_RACK) {
        super(6, ContainerType.TUBE, type);
    }
}

export = TubeRack;
