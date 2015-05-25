import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class WashingTank extends SimpleContainerModel {

    constructor() {
        super(ContainerType.WASHING_TANK, Math.pow(10, 13));

        ko.rebind(this);
    }
}

export = WashingTank;
