import ko = require('knockout');

import LiquidType = require('model/type/Liquid');
import InventoryItem = require('model/InventoryItem');

class SpecialItem extends InventoryItem {

    public type: KnockoutObservable<LiquidType>;

    constructor(type) {
        super("special");

        this.type = ko.observable(type);
    }
}

export = SpecialItem;
