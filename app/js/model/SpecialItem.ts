import ko = require('knockout');

import LiquidType = require('model/type/Liquid');
import Item = require('model/Item');

class SpecialItem extends Item {

    public type: KnockoutObservable<LiquidType>;
    public acquired: KnockoutObservable<boolean>;

    constructor(type) {
        super("special");

        this.type = ko.observable(type);
        this.acquired = ko.observable(false);
    }
}

export = SpecialItem;
