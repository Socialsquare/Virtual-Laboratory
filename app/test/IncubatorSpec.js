define([
    'utils/utils',
    'factory/Container',
    'factory/Liquid',
    'model/Incubator',
    'model/Pipette',
    'model/Tip',
    'model/type/Liquid',
    'model/type/Microorganism'
], function (utils, CF, LF, IncubatorModel, PipetteModel, TipModel, LiquidType, MicroorganismType) {

    describe('Simple container', function() {
        var tubeYeast, tube;
        var incubator;

        beforeEach(function () {
            tubeYeast = CF.tube().add(LF.microorganism.yeast());
            tube = CF.tube();
            incubator = new IncubatorModel();
        });

        it('should grow', function () {
            incubator.tubeRack.addAt(1, tubeYeast);

            var concBefore = tubeYeast.getTotalConcentration();

            incubator.growOneHour();

            expect(concBefore < incubator.tubeRack.get(1).getTotalConcentration()).toBeTruthy();
            expect(concBefore < tubeYeast.getTotalConcentration()).toBeTruthy();
        });


        it('should grow orignal and klone', function () {
            var cloned = CF.tube();
            cloned.addAll(tubeYeast.cloneLiquids());
            incubator.tubeRack.addAt(1, tubeYeast);
            incubator.tubeRack.addAt(3, cloned);

            var concBefore = tubeYeast.getTotalConcentration();
            var concBeforeClone = cloned.getTotalConcentration();

            incubator.growOneHour();

            expect(concBefore).toBeLessThan(incubator.tubeRack.get(1).getTotalConcentration());
            expect(concBefore).toBeLessThan(tubeYeast.getTotalConcentration());
            expect(concBeforeClone).toBeLessThan(incubator.tubeRack.get(3).getTotalConcentration());
            expect(concBeforeClone).toBeLessThan(cloned.getTotalConcentration());
        });

        it('should grow orignal and klone by pipette', function () {
            var pipette = new PipetteModel();
            pipette.addAt(0, new TipModel());

            pipette.fillPipette(tubeYeast);
            pipette.emptyPipetteInto(tube);

            incubator.tubeRack.addAt(1, tubeYeast); //TODO: fill pipette after placing. Just to be sure!
            incubator.tubeRack.addAt(3, tube);

            var concBefore = tubeYeast.getTotalConcentration();
            var concBeforeKlone = tube.getTotalConcentration();

            incubator.growOneHour();

            expect(concBefore).toBeLessThan(incubator.tubeRack.get(1).getTotalConcentration());
            expect(concBefore).toBeLessThan(tubeYeast.getTotalConcentration());
            expect(concBeforeKlone).toBeLessThan(incubator.tubeRack.get(3).getTotalConcentration());
            expect(concBeforeKlone).toBeLessThan(tube.getTotalConcentration());
            expect(tube.getTotalConcentration()).toBeLessThan(10 * tubeYeast.getTotalConcentration());
        });


        it('should not grow much beyond limit', function () {
            incubator.tubeRack.addAt(1, tubeYeast);

            var concBefore = tubeYeast.getTotalConcentration();

            for(var i = 0; i < 48; i++) {
                incubator.growOneHour();
            }

            expect(concBefore < incubator.tubeRack.get(1).getTotalConcentration()).toBeTruthy();
            expect(tubeYeast.getTotalConcentration() < tubeYeast.maxConcentration() * 1.01).toBeTruthy();
        });
    });

});
