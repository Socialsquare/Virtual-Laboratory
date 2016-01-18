import gameState = require('model/GameState');
import popupController = require('controller/Popup');

import CF = require('factory/Container');
import LF = require('factory/Liquid');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import PCRMachineController = require('controller/PCRMachine');

import PCRMachineModel = require('model/PCRMachine');

describe('PCR Machine', () => {
    var pcr: PCRMachineController;

    beforeEach(() => {
        popupController.autoConfirm = true;

        pcr = new PCRMachineController(new PCRMachineModel());
    });

    afterEach(() => {
        popupController.autoConfirm = false;
    });

    describe('DNA copying', () => {
        it('should copy DNA when diabetes primer and diabetic DNA is present', () => {
            var diabetesDNA = LF.freeFloatingDNA(MouseBloodType.DIABETIC);
            var allStuff = [LF.diabetesPrimer(), LF.dnaPolymerase(),
                LF.nucleotides(), diabetesDNA]
            var tube = CF.tube().addAll(allStuff);

            expect(diabetesDNA.isCopied()).toBeFalsy();

            pcr.tryCopyDNA(tube);

            expect(diabetesDNA.isCopied()).toBeTruthy();
        });

        it('should NOT copy DNA when diabetes primer and normal DNA are not present', () => {
            var diabetesDNA = LF.freeFloatingDNA(MouseBloodType.NORMAL);
            var tube = CF.tube().addAll([LF.diabetesPrimer(), diabetesDNA]);

            expect(diabetesDNA.isCopied()).toBeFalsy();

            pcr.tryCopyDNA(tube);

            expect(diabetesDNA.isCopied()).toBeFalsy();
        });

        it('should NOT copy DNA when only DNA is present', () => {
            var diabetesDNA = LF.freeFloatingDNA(MouseBloodType.NORMAL);
            var tube = CF.tube().add(diabetesDNA);

            expect(diabetesDNA.isCopied()).toBeFalsy();

            pcr.tryCopyDNA(tube);

            expect(diabetesDNA.isCopied()).toBeFalsy();
        });
    });
});
