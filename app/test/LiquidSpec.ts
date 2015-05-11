import _ = require('lodash');

import LiquidType = require('model/type/Liquid');

import TextHelper = require('utils/TextHelper');
import S2T = require('utils/S2T');

describe('Liquid', () => {

    it('should have a pretty name', () => {

        for (var v in LiquidType) {
            if (!_.isFinite(+v))
                continue;

            expect(TextHelper.prettyNameFromType(+v)).not.toBeNull();
        }
    });

    it('should be decoded from string by S2T', () => {

        for (var v in LiquidType) {
            if (!_.isFinite(+v))
                continue;

            var name = "LiquidType." + LiquidType[v];
            expect(S2T.liquid(name)).not.toBeNull();
        }
    });
});
