import ko = require('knockout');

import ContainerType = require('model/type/Container');
import LocationType = require('model/type/Location');

import CompositeContainerModel = require('model/CompositeContainer');

class IceBath extends CompositeContainerModel {

    constructor() {
        super(6, ContainerType.TUBE, ContainerType.ICE_BATH);

        this.location(LocationType.ICE_BATH);

        ko.rebind(this);
    }
}

export = IceBath;
