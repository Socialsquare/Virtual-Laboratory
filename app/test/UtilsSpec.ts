$ = require('jquery');
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

describe('pickRandomValue', () => {
    it('should return random value from an array', () => {
        var someValsArr = [1, 2, 3, 4, 5];
        var actual = Utils.math.pickRandomValue(someValsArr);
        var expVal = $.inArray(actual, someValsArr); 
        expect(expVal > -1).toBe(true);
    });
    it('should return undefined from an empty array', () => {
        var someValsArr = [];
        var actual = Utils.math.pickRandomValue(someValsArr);
        expect(actual === undefined).toBe(true);
    });
    it('should return the value from one item array', () => {
        var someValsArr = [13];
        var actual = Utils.math.pickRandomValue(someValsArr);
        expect(actual === 13).toBe(true);
    });
    it('should throw an exception if first argument is not an Array', () => {
        var someVals = {spam: "eggs"};
        var expectedMsg = "TypeError: Utils.math.pickRandomValue takes Array as a first and only argument";
        expect(function(){Utils.math.pickRandomValue(someVals);}).toThrow(new Error(expectedMsg));
    });
});
