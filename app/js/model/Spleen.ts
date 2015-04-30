import ko = require('knockout');

import SpecialItemType = require('model/type/SpecialItem');
import LiquidType = require('model/type/Liquid');

import SpecialItemModel = require('model/SpecialItem');

class Spleen extends SpecialItemModel {

    public antibodiesFor: KnockoutObservableArray<LiquidType>;

    constructor() {
        super(SpecialItemType.SPLEEN);

        this.antibodiesFor = ko.observableArray([]);
    }

    public clone = () => {
        var clone = new Spleen();
        clone.antibodiesFor(this.antibodiesFor());

        return clone;
    }
}

export = Spleen;
