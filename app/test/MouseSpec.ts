import MouseCageViewController = require('controller/view/MouseCageViewController');
import popupController = require('controller/Popup');

import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');
import SpecialItem = require('factory/SpecialItem');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import VideoController = require('controller/Video');
import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

describe('Mouse', () => {
    var mc: MouseCageViewController;
    mc = new MouseCageViewController();
    mc.gameState.reset();
    mc.gameState.mousecage.mouse(SpecialItem.healthyMouse());

    beforeEach(() => {
        mc.gameState.reset();
        mc.gameState.mousecage.mouse(SpecialItem.healthyMouse());
        popupController.autoConfirm = true;
        VideoController.autoFinish = true;

    });

    afterEach(() => {
        popupController.autoConfirm = false;
        VideoController.autoFinish = false;
    });

    describe('Blood sampling', () => {
        it('should draw blood when dropping an empty syring', () => {

            var syringe = ContainerFactory.syringe();

            expect(mc.gameState.inventory.items().length).toBe(0);

            // Drop the syringe on the mouse
            DropOnMouseHelper.handleDrop(mc, syringe);

            expect(mc.gameState.inventory.items().length).toBe(1);

            var tube = mc.gameState.inventory.items()[0];

            expect(tube.contains(LiquidType.MOUSE_BLOOD)).toBeTruthy();
        });
    });

    describe('Injections', () => {
        it('should not allow random injections', () => {

            var syringe = ContainerFactory.syringe();

            syringe.add(LiquidFactory.gfp());

            expect(DropOnMouseHelper.handleDrop(mc, syringe)).toBeFalsy();

            syringe.clearContents();
            syringe.addAll([LiquidFactory.adjuvans(), LiquidFactory.antigenSmallpox()]);

            expect(DropOnMouseHelper.handleDrop(mc, syringe)).toBeTruthy();

            syringe.clearContents();
            syringe.add(LiquidFactory.deadly());

            expect(DropOnMouseHelper.handleDrop(mc, syringe)).toBeTruthy();

        });
    });
});
