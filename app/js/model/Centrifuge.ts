import ko = require('knockout');

import CompositeContainerModel = require('model/CompositeContainer');

import ContainerType = require('model/type/Container');

class CentrifugeModel extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;

    constructor() {
        super(2, ContainerType.TUBE, ContainerType.CENTRIFUGE);

        this.status = ko.observable(false);

        ko.rebind(this);
    }
}

export = CentrifugeModel;
