import CF = require('factory/Container');
import LF = require('factory/Liquid');
import LiquidType = require('model/type/Liquid');
import MicroorganismType = require('model/type/Microorganism');

describe('Simple container', () => {
    var tube;

    beforeEach(() => {
        tube = CF.tube();
    });

    it('should add and contain a liquid', () => {
        tube.add(LF.deadly());

        expect(tube.liquids().length).toBe(1);
        expect(tube.contains(LiquidType.DEADLY)).toBeTruthy();
    });

    it('should not contain a liquid that is not added', () => {
        expect(tube.contains(LiquidType.DEADLY)).toBeFalsy();
    });

    it('should not contain duplicate liquids', () => {
        tube.add(LF.antibiotic.a());
        expect(tube.liquids().length).toBe(1);

        tube.add(LF.antibiotic.a());
        expect(tube.liquids().length).toBe(1);

        expect(tube.contains(LiquidType.ANTIBIOTIC)).toBeTruthy();

        tube.add(LF.antibiotic.b());
        expect(tube.liquids().length).toBe(2);

        tube.add(LF.antibiotic.b());
        expect(tube.liquids().length).toBe(2);
    });

    it('should clear contents', () => {
        tube.add(LF.deadly());
        tube.add(LF.insulin());

        expect(tube.contains(LiquidType.DEADLY)).toBeTruthy();
        expect(tube.contains(LiquidType.INSULIN)).toBeTruthy();

        tube.clearContents();

        expect(tube.contains(LiquidType.DEADLY)).toBeFalsy();
        expect(tube.contains(LiquidType.INSULIN)).toBeFalsy();
    });

    it('should merge equal microorganisms and sum their concentration', () => {
        var yeast1 = LF.microorganism.yeast(),
        yeast2 = LF.microorganism.yeast(),
        myeloma = LF.microorganism.myeloma();

        yeast1.concentration(1);
        yeast2.concentration(2);
        myeloma.concentration(3);

        tube.add(yeast1);

        expect(tube.getTotalConcentration()).toEqual(1);

        tube.add(yeast2);

        expect(tube.getTotalConcentration()).toEqual(3);
        expect(tube.liquids().length).toEqual(1);

        tube.add(myeloma);

        expect(tube.getTotalConcentration()).toEqual(6);
        expect(tube.liquids().length).toEqual(2);
    });

    it('should test whether it contains microorganism', () => {
        var yeast = LF.microorganism.yeast(),
        myeloma = LF.microorganism.myeloma();

        expect(tube.containsMicroorganism(MicroorganismType.YEAST)).toBeFalsy();
        expect(tube.containsMicroorganism(MicroorganismType.MYELOMA)).toBeFalsy();

        tube.add(yeast);

        expect(tube.containsMicroorganism(MicroorganismType.YEAST)).toBeTruthy();
        expect(tube.containsMicroorganism(MicroorganismType.MYELOMA)).toBeFalsy();

        tube.add(myeloma);

        expect(tube.containsMicroorganism(MicroorganismType.YEAST)).toBeTruthy();
        expect(tube.containsMicroorganism(MicroorganismType.MYELOMA)).toBeTruthy();
    });

    it('should test whether it contains multiple liquids', () => {
        tube.add(LF.deadly());

        expect(tube.containsAll([LiquidType.DEADLY, LiquidType.INSULIN])).toBeFalsy();

        tube.add(LF.insulin());

        expect(tube.containsAll([LiquidType.DEADLY, LiquidType.INSULIN])).toBeTruthy();
    });

    it('should strictly check liquid sets', () => {
        tube.add(LF.gfp());
        tube.add(LF.adjuvans());

        expect(tube.containsAllStrict([LiquidType.GFP, LiquidType.ADJUVANS])).toBeTruthy();

        expect(tube.containsAllStrict([LiquidType.ADJUVANS, LiquidType.GFP])).toBeTruthy();

        expect(tube.containsAllStrict([LiquidType.ADJUVANS, LiquidType.ADJUVANS, LiquidType.GFP])).toBeFalsy();

        expect(tube.containsAllStrict([LiquidType.JUICE, LiquidType.ADJUVANS, LiquidType.GFP])).toBeFalsy();

        expect(tube.containsAllStrict([LiquidType.GFP])).toBeFalsy();
    });
});
