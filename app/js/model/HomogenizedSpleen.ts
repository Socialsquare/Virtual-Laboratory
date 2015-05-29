import ko = require('knockout');

import LiquidType = require('model/type/Liquid');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

class HomogenizedSpleen extends LiquidModel {

    public antibodiesFor: KnockoutObservableArray<LiquidType>;

    constructor() {
        super(LiquidType.HOMO_SPLEEN, ReactionCount.NEVER, true);

        this.antibodiesFor = ko.observableArray([]);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ':' + this.antibodiesFor().join(',');
    }

    clone() {
        var clone = new HomogenizedSpleen();

        clone.hasReacted(this.hasReacted());
        clone.antibodiesFor(this.antibodiesFor());

        return clone;
    }
}

export = HomogenizedSpleen;
