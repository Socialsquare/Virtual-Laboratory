import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class DiabetesPrimer extends LiquidModel {

    public isCopied: KnockoutObservable<boolean>;

    constructor(isCopied = false) {
        super(LiquidType.DIABETES_PRIMER, ReactionCount.NEVER, true);

        this.isCopied(isCopied);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ":" + this.isCopied();
    }

    clone() {
        return new DiabetesPrimer(this.isCopied());
    }
}

export = DiabetesPrimer;
