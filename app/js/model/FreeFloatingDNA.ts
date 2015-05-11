import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');
import DNAType = require('model/type/DNA');

class FreeFloatingDNA extends LiquidModel {

    public DNAType: KnockoutObservable<DNAType>;

    constructor(dnaType: DNAType) {
        super(LiquidType.FREE_FLOATING_DNA, ReactionCount.ALWAYS, true);

		this.DNAType = ko.observable(dnaType);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ":" + this.DNAType();
    }

    clone() {
        return new FreeFloatingDNA(this.DNAType());
    }
}

export = FreeFloatingDNA;
