import gameState = require('model/GameState');
import popupController = require('controller/Popup');

import FermentorTankController = require('controller/FermentorTank');

import FermentorModel = require('model/Fermentor');

import containerFactory = require('factory/Container');
import liquidFactory = require('factory/Liquid');

describe('Fermentor', () => {

    beforeEach(() => popupController.autoConfirm = true)
    afterEach(() => popupController.autoConfirm = false)

    it('should fill fermentor tank when dropping a filled syringe', () => {
        var fermentorTankController = new FermentorTankController(gameState.fermentor.fermentorTank);

        expect(gameState.fermentor.fermentorTank.isEmpty()).toBeTruthy();

        var syringe = containerFactory.syringe();

        fermentorTankController.handleContainerDrop(syringe);

        expect(gameState.fermentor.fermentorTank.isEmpty()).toBeTruthy();

        syringe.add(liquidFactory.microorganism.myeloma());

        fermentorTankController.handleContainerDrop(syringe);

        expect(gameState.fermentor.fermentorTank.isEmpty()).toBeFalsy();
    });
});
