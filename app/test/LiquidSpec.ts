import _ = require('lodash');

import LiquidType = require('model/type/Liquid');
import LiquidModel = require('model/Liquid');
import ReactionCount = require('model/ReactionCount');
import MouseBloodType = require('model/type/MouseBlood')

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

    it('can be cloned', () => {
        const liquid = new LiquidModel(
            LiquidType.MOUSE_BLOOD,
            ReactionCount.ONCE
        )
        liquid.subtype(MouseBloodType.DIABETIC)

        const clone = liquid.clone()
        expect(clone.type()).toBe(LiquidType.MOUSE_BLOOD)
        expect(clone.subtype()).toBe(MouseBloodType.DIABETIC)
        expect(clone.reactionCount()).toBe(ReactionCount.ONCE)
    });
});
