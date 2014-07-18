define([
    'factory/Container',
    'factory/Liquid',
    'model/type/Liquid',
    'model/type/Microorganism'
], function (CF, LF, LiquidType, MicroorganismType) {

    describe('Simple container', function() {
        var tube;

        beforeEach(function () {
            tube = CF.tube();
        });

        it('should add and contain a liquid', function () {
            tube.add(LF.deadly());

            expect(tube.liquids().length).toBe(1);
            expect(tube.contains(LiquidType.DEADLY)).toBeTruthy();
        });

        it('should not contain a liquid that is not added', function () {
            expect(tube.contains(LiquidType.DEADLY)).toBeFalsy();
        });

        it('should not contain duplicate liquids', function() {
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

        it('should clear contents', function() {
            tube.add(LF.deadly());
            tube.add(LF.insulin());

            expect(tube.contains(LiquidType.DEADLY)).toBeTruthy();
            expect(tube.contains(LiquidType.INSULIN)).toBeTruthy();

            tube.clearContents();

            expect(tube.contains(LiquidType.DEADLY)).toBeFalsy();
            expect(tube.contains(LiquidType.INSULIN)).toBeFalsy();
        });

        it('should merge equal microorganisms and sum their concentration', function () {
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

        it('should test whether it contains microorganism', function () {
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


        it('should test whether it contains multiple liquids', function () {
            tube.add(LF.deadly());

            expect(tube.containsAll([LiquidType.DEADLY, LiquidType.INSULIN])).toBeFalsy();

            tube.add(LF.insulin());

            expect(tube.containsAll([LiquidType.DEADLY, LiquidType.INSULIN])).toBeTruthy();
        });
    });

});
