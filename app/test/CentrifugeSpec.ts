import popupController = require('controller/Popup');

import CF = require('factory/Container');
import LF = require('factory/Liquid');

import CentrifugeModel = require('model/Centrifuge');

describe('Centrifuge', () => {

    var centrifuge: CentrifugeModel;

    beforeEach(() => {
        //popupController.autoConfirm = true;
        centrifuge = new CentrifugeModel();
    });

    afterEach(() => {
        //popupController.autoConfirm = false;
        centrifuge = new CentrifugeModel();
    });

    it('should not be able to activate when unbalanced with empty tubes', () => {
        var emptyTube0 = CF.tube();
        var emptyTube1 = CF.tube();

        centrifuge.addAt(0, emptyTube0);

        centrifuge.activate();

        expect(centrifuge.status()).toBeFalsy();

        centrifuge.addAt(1, emptyTube1);

        expect(centrifuge.status()).toBeFalsy();
    });

    it('should not be able to activate when unbalanced with filled tubes', () => {
        var tube0 = CF.tube().add(LF.saltWater());
        var tube1 = CF.tube().add(LF.saltWater());

        centrifuge.addAt(0, tube0);

        centrifuge.activate();

        expect(centrifuge.status()).toBeFalsy();

        centrifuge.addAt(3, tube1);

        centrifuge.activate();

        expect(centrifuge.status()).toBeFalsy();
    });

    it('should be able activate when empty', () => {
        centrifuge.activate();

        expect(centrifuge.status()).toBeTruthy();
    });

    it('should be able activate when balanced with empty tubes', () => {
        var emptyTube0 = CF.tube();
        var emptyTube1 = CF.tube();

        centrifuge.addAt(0, emptyTube0);
        centrifuge.addAt(2, emptyTube1);

        centrifuge.activate();

        expect(centrifuge.status()).toBeTruthy();
    });

    it('should be able activate when balanced with filled tubes', () => {
        var tube0 = CF.tube().add(LF.saltWater());
        var tube1 = CF.tube().add(LF.saltWater());

        centrifuge.addAt(0, tube0);
        centrifuge.addAt(2, tube1);

        centrifuge.activate();

        expect(centrifuge.status()).toBeTruthy();
    });

    it('should not be able activate when unbalanced with empty and filled tubes slot 0 and 2', () => {
        var emptyTube = CF.tube();
        var tube = CF.tube().add(LF.saltWater());

        centrifuge.addAt(0, emptyTube);
        centrifuge.addAt(2, tube);

        centrifuge.activate();

        expect(centrifuge.status()).toBeFalsy();
    });

    it('should not be able activate when unbalanced with empty and filled tubes slot 1 and 3', () => {
        var emptyTube = CF.tube();
        var tube = CF.tube().add(LF.saltWater());

        centrifuge.addAt(1, emptyTube);
        centrifuge.addAt(3, tube);

        centrifuge.activate();

        expect(centrifuge.status()).toBeFalsy();
    });
});
