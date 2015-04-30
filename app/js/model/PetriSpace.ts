import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');

class PetriSpace extends CompositeContainerModel {

    constructor(capacity = 3, type = ContainerType.PETRI_SPACE) {
        super(capacity, ContainerType.PETRI_DISH, type);
    }
}

export = PetriSpace;
