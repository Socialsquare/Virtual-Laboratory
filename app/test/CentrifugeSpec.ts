import gameState = require('model/GameState');

import popupController = require('controller/Popup');

import CF = require('factory/Container');
import LF = require('factory/Liquid');

import CentrifugeModel = require('model/Centrifuge');

import CentrifugeController = require('controller/Centrifuge');

import MouseBloodType = require('model/type/MouseBlood');

describe('Centrifuge', () => {

    var centrifuge: CentrifugeModel;
    var centrifugeCtrl: CentrifugeController;

    beforeEach(() => {
        //popupController.autoConfirm = true;
        centrifuge = new CentrifugeModel();
        centrifugeCtrl = new CentrifugeController(centrifuge);
    });

    afterEach(() => {
        //popupController.autoConfirm = false;
    });

    it('should not be able to activate when unbalanced with empty tubes', () => {
        var emptyTube0 = CF.tube();
        var emptyTube1 = CF.tube();

        centrifugeCtrl.compContainer.addAt(0, emptyTube0);

        centrifugeCtrl.activate();

        expect(centrifugeCtrl.compContainer.status()).toBeFalsy();

        centrifugeCtrl.compContainer.addAt(1, emptyTube1);

        // not activated -> Falsy
        expect(centrifugeCtrl.compContainer.status()).toBeFalsy();
    });

    it('should not be able to activate when unbalanced with filled tubes', () => {
        var tube0 = CF.tube().add(LF.saltWater());
        var tube1 = CF.tube().add(LF.saltWater());

        centrifugeCtrl.compContainer.addAt(0, tube0);

        centrifugeCtrl.activate();

        expect(centrifugeCtrl.compContainer.status()).toBeFalsy();

        centrifugeCtrl.compContainer.addAt(1, tube1);

        // not activated -> Falsy
        expect(centrifugeCtrl.compContainer.status()).toBeFalsy();
    });

    it('should be able to activate when empty', () => {
        centrifugeCtrl.activate();

        expect(centrifugeCtrl.compContainer.status()).toBeTruthy();
    });

    it('should be able to activate when balanced with empty tubes', () => {
        var emptyTube0 = CF.tube();
        var emptyTube1 = CF.tube();

        centrifugeCtrl.compContainer.addAt(0, emptyTube0);
        centrifugeCtrl.compContainer.addAt(1, emptyTube1);

        centrifugeCtrl.activate();

        expect(centrifugeCtrl.compContainer.status()).toBeTruthy();
    });

    it('should be able to activate when balanced with filled tubes', () => {
        var tube0 = CF.tube().add(LF.saltWater());
        var tube1 = CF.tube().add(LF.saltWater());

        centrifugeCtrl.compContainer.addAt(0, tube0);
        centrifugeCtrl.compContainer.addAt(1, tube1);

        centrifugeCtrl.activate();

        expect(centrifugeCtrl.compContainer.status()).toBeTruthy();
    });
});
