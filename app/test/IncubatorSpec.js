define([
    'factory/Container',
    'factory/Liquid',
    'model/Incubator',
    'model/type/Liquid',
    'model/type/Microorganism',
    'extensions/extensions' //TODO: have this as the _last_ requirement
], function (CF, LF, IncubatorModel, LiquidType, MicroorganismType) {

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

