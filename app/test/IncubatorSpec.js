define([
    'utils/utils',
    'factory/Container',
    'factory/Liquid',
    'model/Incubator',
    'model/Pipette',
    'model/Tip',
    'model/type/Liquid',
    'model/type/Microorganism',
    'extensions/extensions' //TODO: have this as the _last_ requirement
], function (utils, CF, LF, IncubatorModel, PipetteModel, TipModel, LiquidType, MicroorganismType) {

    describe('Simple container', function() {
        var tubeYeast, tube;
        var incubator;

        beforeEach(function () {
            tubeYeast = CF.tube().add(LF.microorganism.yeast());
            tube = CF.tube();
            incubator = new IncubatorModel();
        });

        it('Should grow', function () {
            incubator.tubeRack.addAt(1, tubeYeast);

            var concBefore = tubeYeast.getTotalConcentration();

            incubator.growOneHour();

            expect(concBefore < incubator.tubeRack.get(1).getTotalConcentration()).toBeTruthy();
            expect(concBefore < tubeYeast.getTotalConcentration()).toBeTruthy();
        });


        it('Grow orignal and klone', function () {
            var kloned = utils.klone(tubeYeast);
            incubator.tubeRack.addAt(1, tubeYeast);
            incubator.tubeRack.addAt(3, kloned);

            var concBefore = tubeYeast.getTotalConcentration();
            var concBeforeKlone = kloned.getTotalConcentration();

            incubator.growOneHour();
            console.log('Total conc: ' + tubeYeast.getTotalConcentration());

            expect(concBefore < incubator.tubeRack.get(1).getTotalConcentration()).toBeTruthy();
            expect(concBefore < tubeYeast.getTotalConcentration()).toBeTruthy();
            expect(concBeforeKlone < incubator.tubeRack.get(3).getTotalConcentration()).toBeTruthy();
            expect(concBeforeKlone < kloned.getTotalConcentration()).toBeTruthy();
        });

        it('Grow orignal and klone by pipette', function () {
            console.log('Grow original and klone by pipette');
            var pipette = new PipetteModel();
            console.log('yo dawg');
            pipette.addAt(0, new TipModel());

            pipette.fillPipette(tubeYeast);
            pipette.emptyPipetteInto(tube);

            incubator.tubeRack.addAt(1, tubeYeast); //TODO: fill pipette after placing. Just to be sure!
            incubator.tubeRack.addAt(3, tube);

            var concBefore = tubeYeast.getTotalConcentration();
            var concBeforeKlone = tube.getTotalConcentration();

            incubator.growOneHour();
            console.log('Total conc: ' + tubeYeast.getTotalConcentration());

            expect(concBefore < incubator.tubeRack.get(1).getTotalConcentration()).toBeTruthy();
            expect(concBefore < tubeYeast.getTotalConcentration()).toBeTruthy();
            expect(concBeforeKlone < incubator.tubeRack.get(3).getTotalConcentration()).toBeTruthy();
            expect(concBeforeKlone < tube.getTotalConcentration()).toBeTruthy();
        });


        it('Do not grow much beyond limit', function () {
            incubator.tubeRack.addAt(1, tubeYeast);

            var concBefore = tubeYeast.getTotalConcentration();

            for(var i = 0; i < 48; i++) {
                incubator.growOneHour();
                console.log('Total conc: ' + tubeYeast.getTotalConcentration());
            }

            expect(concBefore < incubator.tubeRack.get(1).getTotalConcentration()).toBeTruthy();
            expect(tubeYeast.getTotalConcentration() < tubeYeast.maxConcentration() * 1.01).toBeTruthy();
        });
    });

});

