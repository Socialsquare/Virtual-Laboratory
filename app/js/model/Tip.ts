import ko = require('knockout');

import ContainerType = require('model/type/Container');

import SimpleContainerModel = require('model/SimpleContainer');
import MicrotiterWellsModel = require('model/MicrotiterWells');


class Tip extends SimpleContainerModel {

    public contaminatedBy: KnockoutObservable<SimpleContainerModel>;
    public microtiterWells: KnockoutObservable<MicrotiterWellsModel>;

    constructor() {
        // TODO: Ved ikke om dette skal være mindre. Er ret sikker på
        // det er W/E, bare den ikke er for lille
        super(ContainerType.PIPETTE_TIP, Math.pow(10, 13));

        this.contaminatedBy = ko.observable(null);
        this.microtiterWells = ko.observable(null);

        ko.rebind(this);
    }
}

export = Tip;
