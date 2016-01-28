import CF = require('factory/Container');
import LF = require('factory/Liquid');
import PipetteModel = require('model/Pipette');
import LiquidType = require('model/type/Liquid');

describe('Pipette', () => {

    var pipette: PipetteModel;

    beforeEach(() => {
        pipette = new PipetteModel();
    });

    it('should be initialized without tip', () => {
        expect(pipette.hasTip()).toBeFalsy();

        // add a tip
        pipette.newTip();

    });

    it('should be filled from one tube and emptied into another', () => {
        var deadlyTube = CF.tube().add(LF.deadly());
        pipette.newTip();

        pipette.fillPipette(deadlyTube);

        expect(pipette.getTip().contains(LiquidType.DEADLY)).toBeTruthy();
        // The container should still have the content as well
        expect(deadlyTube.contains(LiquidType.DEADLY)).toBeTruthy();

        var emptyTube = CF.tube();
        pipette.emptyPipetteInto(emptyTube);

        expect(emptyTube.contains(LiquidType.DEADLY)).toBeTruthy();
    });

    it('should not be allowed to use the same tip twice for different liquids', () => {
        var emptyTube = CF.tube();
        var deadlyTube = CF.tube().add(LF.deadly());
        var lysisTube = CF.tube().add(LF.lysis());

        pipette.newTip();

        pipette.fillPipette(deadlyTube);
        expect(pipette.getTip().contains(LiquidType.DEADLY)).toBeTruthy();
        pipette.emptyPipetteInto(deadlyTube);

        // The pipette should now be contaminated with deadly liquid
        // and thus should not be able to be filled from the lysis
        // tube
        pipette.fillPipette(lysisTube);
        expect(pipette.getTip().contains(LiquidType.LYSIS)).toBeFalsy();

        // It should however be possible to fill it with deadly liquid
        // again, from any container (i.e. not only the same instance
        // from which it was filled initially)
        pipette.fillPipette(deadlyTube);
        expect(pipette.getTip().contains(LiquidType.DEADLY)).toBeTruthy();
        pipette.emptyPipetteInto(deadlyTube);

        var deadlyTube2 = CF.tube().add(LF.deadly());
        pipette.fillPipette(deadlyTube2);
        expect(pipette.getTip().contains(LiquidType.DEADLY)).toBeTruthy();
    });
});
