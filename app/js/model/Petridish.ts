import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Petridish extends SimpleContainerModel {

    constructor() {
        super(ContainerType.PETRI_DISH, Math.pow(10,12));

        ko.rebind(this);
    }
}

export = Petridish;
