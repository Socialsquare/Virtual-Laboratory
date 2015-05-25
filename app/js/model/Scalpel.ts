import ko = require('knockout');

import SpecialItemModel = require('model/SpecialItem');
import SpecialItemType = require('model/type/SpecialItem');

class Scalpel extends SpecialItemModel {

    constructor() {
        super(SpecialItemType.SCALPEL);

        ko.rebind(this);
    }
}

export = Scalpel;
