import _ = require('lodash');

import LiquidModel = require('model/Liquid');
import MicroorganismModel = require('model/Microorganism');
import HomogenizedSpleenModel = require('model/HomogenizedSpleen');
import GeneModel = require('model/Gene');
import MyelomaModel = require('model/Myeloma');

import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');

class LiquidHelper {

    static filter<T extends LiquidModel>(liquids: LiquidModel[], type: LiquidType): T[] {
        return <T[]>_.filter(liquids, (liquid) => liquid.type() === type);
    }

    static mos(liquids) {
        return LiquidHelper.filter<MicroorganismModel>(liquids, LiquidType.MICROORGANISM);
    }

    static myelomas(liquids) {
        var micros = LiquidHelper.mos(liquids);
        return <MyelomaModel[]>_.filter(micros, (m) => m.microorganismType() === MicroorganismType.MYELOMA);
    }

    static homospleens(liquids) {
        return LiquidHelper.filter<HomogenizedSpleenModel>(liquids, LiquidType.HOMO_SPLEEN);
    }

    static genes(liquids) {
        return LiquidHelper.filter<GeneModel>(liquids, LiquidType.GENE);
    }
}

export = LiquidHelper;
