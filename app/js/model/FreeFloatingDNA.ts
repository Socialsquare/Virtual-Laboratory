import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class FreeFloatingDNA extends LiquidModel {

    public bloodType: KnockoutObservable<MouseBloodType>;

    constructor(bloodType: MouseBloodType) {
        super(LiquidType.FREE_FLOATING_DNA, ReactionCount.ALWAYS, true);

		this.bloodType = ko.observable(bloodType);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ":" + this.bloodType();
    }

    clone() {
        return new FreeFloatingDNA(this.bloodType());
    }
}

export = FreeFloatingDNA;
