import ko = require('knockout');

import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

class ClumpedCells extends LiquidModel {

    public bloodType: KnockoutObservable<MouseBloodType>;

    constructor(bloodType: MouseBloodType) {
        super(LiquidType.CLUMPED_CELLS, ReactionCount.ALWAYS, true);

        this.bloodType = ko.observable(bloodType);

        ko.rebind(this);
    }

    hashCode() {
        return this._hashCode() + ':' + this.bloodType();
    }

    clone() {
        var clone = new ClumpedCells(this.bloodType());

        return clone;
    }
}

export = ClumpedCells;
