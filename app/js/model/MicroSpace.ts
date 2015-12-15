import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');

class MicroSpace extends CompositeContainerModel {

    constructor(capacity = 3, type = ContainerType.MICRO_SPACE) {
        super(capacity, ContainerType.MICROTITER, type);

        ko.rebind(this);
    }
}

export = MicroSpace;
