import _ = require('lodash');

import LiquidModel = require('model/Liquid');
import MicroorganismModel = require('model/Microorganism');
import HomogenizedSpleenModel = require('model/HomogenizedSpleen');

import LiquidType = require('model/type/Liquid');

class LiquidHelper {

    static filter<T extends LiquidModel>(liquids: LiquidModel[], type: LiquidType): T[] {
        return <T[]>_.filter(liquids, (liquid) => liquid.type() === type);
    }

    static mos(liquids) {
        return LiquidHelper.filter<MicroorganismModel>(liquids, LiquidType.MICROORGANISM);
    }

    static homospleens(liquids) {
        return LiquidHelper.filter<HomogenizedSpleenModel>(liquids, LiquidType.HOMO_SPLEEN);
    }
}

export = LiquidHelper;
