import ko = require('knockout');
import SpecialItemModel = require('model/SpecialItem');
import SpecialItemType = require('model/type/SpecialItem');


class Spleen extends SpecialItemModel {

    public antibodiesFor: KnockoutObservableArray<string>;

    constructor(type) {
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
