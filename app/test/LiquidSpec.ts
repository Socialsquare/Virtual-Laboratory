import _ = require('lodash');

import LiquidType = require('model/type/Liquid');

import TextHelper = require('utils/TextHelper');

describe('Liquid', () => {

    it('should have a pretty name', () => {

        for (var v in LiquidType) {
            if (!_.isFinite(+v))
                continue;

            expect(TextHelper.prettyNameFromType(+v)).not.toBeNull();
        }
    });
});
