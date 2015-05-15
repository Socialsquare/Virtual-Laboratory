import ko = require('knockout');

import CompositeContainerModel = require('model/CompositeContainer');

import ContainerType = require('model/type/Container');

// The slots are modelled in a circle, so for instance: slot0 = top,
// slot1 = right, slot2 = bottom, slot3 = left, or something to that
// effect.

class CentrifugeModel extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;

    constructor() {
        super(4, ContainerType.TUBE, ContainerType.HEATER);

        this.status = ko.observable(false);

        ko.rebind(this);
    }
}

export = CentrifugeModel;
