import HeaterModel = require('model/Heater');

import CF = require('factory/Container');
import LF = require('factory/Liquid');

import LiquidType = require('model/type/Liquid');

import MouseBloodType = require('model/type/MouseBlood');

describe('Heater machine', () => {
    var heater: HeaterModel;

    beforeEach(() => {
        heater = new HeaterModel();
    });

    it('should not be activated in initial state, and should toggle status', () => {
        expect(heater.status()).toBeFalsy();

        heater.toggle();

        expect(heater.status()).toBeTruthy();

        heater.toggle();

        expect(heater.status()).toBeFalsy();
    });

    it('should be able to form free floating DNA', () => {
        var bloodType = MouseBloodType.DIABETIC;
        var buffyCoat = LF.buffyCoat(bloodType);
        var lysis = LF.lysis();
        var saltWater = LF.saltWater();

        var tube = CF.tube();

        // Add the tube in the heater (not activated)
        expect(heater.status()).toBeFalsy();

        heater.addAt(0, tube);

        expect(tube.contains(LiquidType.FREE_FLOATING_DNA)).toBeFalsy();

        heater.toggle();

        expect(tube.contains(LiquidType.FREE_FLOATING_DNA)).toBeFalsy();

        tube.add(lysis);

        expect(tube.contains(LiquidType.FREE_FLOATING_DNA)).toBeFalsy();

        tube.add(saltWater);

        expect(tube.contains(LiquidType.FREE_FLOATING_DNA)).toBeFalsy();

        tube.add(buffyCoat);

        // The free floating DNA should now be formed and the other
        // liquids should have been consumed
        expect(tube.contains(LiquidType.FREE_FLOATING_DNA)).toBeTruthy();
        expect(tube.contains(LiquidType.BUFFY_COAT)).toBeFalsy();
        expect(tube.contains(LiquidType.SALT_WATER)).toBeFalsy();
        expect(tube.contains(LiquidType.LYSIS)).toBeFalsy();
    });
});
