import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');
import Utils = require('utils/utils');

describe('Dilution', () => {
    it('should dilute liquid', () => {

        var factor = 2;

        var yea = LiquidFactory.microorganism.yeast();
        var mye = LiquidFactory.microorganism.myeloma();
        var tube = ContainerFactory.tube().add(yea).add(mye);

        var conc = tube.getTotalConcentration();

        var diluted = Utils.biology.dilute(factor, tube.liquids());

        tube.liquids(diluted);

        expect(tube.getTotalConcentration()).toBe(conc / factor);
    });
});
