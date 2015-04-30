import ko = require('knockout');
import _ = require('lodash');

import WashingTankModel = require('model/WashingTank');
import TubeRackModel = require('model/TubeRack');

import LiquidType = require('model/type/Liquid');
import LocationType = require('model/type/Location');

import utils = require('utils/utils');


class Washing extends Base {

    public washingTank: WashingTankModel;
    public tubeRack: TubeRackModel;

    constructor() {
        this.washingTank = new WashingTankModel();
        this.washingTank.location(LocationType.WASHING);

        this.tubeRack = new TubeRackModel();
        this.tubeRack.location(LocationType.WASHING);
    }

    public action = (concentration) => {
        var liquids = this.washingTank.liquids();
        var result = 0;
        var feedback = '';

        // check if agents contain other stuff
        var indexOfOther = _.findIndex(liquids, (liquid) => {
            return liquid.type() != LiquidType.LIPASE_ENZYME;
        });

        // if found other, bad result
        if (indexOfOther >= 0) {
            result = 0.99;
            feedback = 'washing.detergent_contaminated';

        } else {
            var log = utils.math.getBaseLog(10, concentration);
            if (log > 2) {
                result = 0.01;
            } else {
                result = 1 - log / 2;
            }
        }

        if (result === 0)
            result = 0.01;

        return { result: result, feedback: feedback };
    }

    public reset = () => {
        this.tubeRack.removeAll();
        this.washingTank.clearContents();
    }
}

export = Washing;
