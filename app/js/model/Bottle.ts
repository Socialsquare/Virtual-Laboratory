import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Bottle extends SimpleContainerModel {

    constructor() {
        super(ContainerType.BOTTLE, 10);
    }
}

export = Bottle;
