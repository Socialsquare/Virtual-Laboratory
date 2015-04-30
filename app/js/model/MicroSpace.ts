import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');

class MicroSpace extends CompositeContainerModel {

    constructor(type = ContainerType.MICRO_SPACE) {
        super(3, ContainerType.MICROTITER, type);
    }
}

export = MicroSpace;
