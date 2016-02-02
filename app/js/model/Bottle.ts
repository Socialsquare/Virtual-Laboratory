import ko = require('knockout');
import SimpleContainerModel = require('model/SimpleContainer');
import ContainerType = require('model/type/Container');

class Bottle extends SimpleContainerModel {

    constructor(isForceFeedBottle) {
        var ct = isForceFeedBottle ? ContainerType.FF_BOTTLE : ContainerType.BOTTLE;
        console.log(ct);
        super(ct, 10);

        ko.rebind(this);
    }
}

export = Bottle;
