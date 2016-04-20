import ko = require('knockout');
import _ = require('lodash');

import LiquidModel = require('model/Liquid');
import LiquidType = require('model/type/Liquid');
import ReactionCount = require('model/ReactionCount');

import utils = require('utils/utils');

class SaltWater extends LiquidModel {

    constructor() {
        super(LiquidType.SALT_WATER, ReactionCount.ONCE, false);

        ko.rebind(this);
    }

    react(container) {

        var clonedLiqs = _.invoke(container.liquids(), 'clone');
        var modifiedLiqs = utils.biology.dilute(5, clonedLiqs);
        container.liquids(modifiedLiqs);

        this._react(container, (liquid) => {
            //console.log('TODO: something.');
        });
    }
}

export = SaltWater;
