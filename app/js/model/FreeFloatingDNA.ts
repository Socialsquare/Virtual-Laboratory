import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class FreeFloatingDNA extends LiquidModel {

    public bloodType: KnockoutObservable<MouseBloodType>;
    public isCopied: KnockoutObservable<boolean>;

    constructor(bloodType: MouseBloodType, isCopied = false) {
        super(LiquidType.FREE_FLOATING_DNA, ReactionCount.ALWAYS, true);

        this.isCopied = ko.observable(isCopied);
		this.bloodType = ko.observable(bloodType);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ":" + this.bloodType() + ":" + this.isCopied();
    }

    clone() {
        var clone = new FreeFloatingDNA(this.bloodType(), this.isCopied());

        return clone;
    }
}

export = FreeFloatingDNA;
