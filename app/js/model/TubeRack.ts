import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');


class TubeRack extends CompositeContainerModel {

    constructor(type, location) {
        super(6, ContainerType.TUBE, type || ContainerType.TUBE_RACK);
    }
}

export = TubeRack;
