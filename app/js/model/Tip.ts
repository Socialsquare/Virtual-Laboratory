import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Tip extends SimpleContainerModel {

    constructor() {
        // TODO: Ved ikke om dette skal være mindre. Er ret sikker på
        // det er W/E, bare den ikke er for lille
        super(ContainerType.PIPETTE_TIP, Math.pow(10,13));
        this.contaminatedBy = ko.observable(null);
        this.microtiterWells = ko.observable(null);
    }
}

export = Tip;
