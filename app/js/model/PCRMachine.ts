import ko = require('knockout');

import ContainerType = require('model/type/Container');
import CompositeContainerModel = require('model/CompositeContainer');

class PCRMachine extends CompositeContainerModel {

    public status: KnockoutObservable<boolean>;

    constructor() {
        super(2, ContainerType.TUBE, ContainerType.PCR_MACHINE);

        this.status = ko.observable(false);
    }
}

export = PCRMachine;
