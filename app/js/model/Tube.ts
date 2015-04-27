import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Tube extends SimpleContainerModel {

    constructor() {
        super(ContainerType.TUBE, Math.pow(10,13));
    }
}

export = Tube;
