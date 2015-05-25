import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');

class DiabetesPrimer extends LiquidModel {

    constructor() {
        super(LiquidType.DIABETES_PRIMER, ReactionCount.NEVER, true);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode();
    }

    clone() {
        return new DiabetesPrimer();
    }
}

export = DiabetesPrimer;
