import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import LiquidType = require('model/type/Liquid');
import ReactionCount = require('model/ReactionCount');


class HomogenizedSpleen extends LiquidModel {

    public antibodiesFor: KnockoutObservableArray<string>;

    constructor() {
        super(LiquidType.HOMO_SPLEEN, ReactionCount.NEVER, true);

        this.antibodiesFor = ko.observableArray([]);
    }

    public hashCode = () => {
        return this._hashCode() + ":" + this.antibodiesFor().join(',');
    }

    public clone = () => {
        var clone = new HomogenizedSpleen();

        clone.hasReacted(this.hasReacted());
        clone.antibodiesFor(this.antibodiesFor());

        return clone;
    }
}

export = HomogenizedSpleen;
