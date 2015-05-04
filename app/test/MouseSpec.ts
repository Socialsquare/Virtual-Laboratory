import gameState = require('model/GameState');
import popupController = require('controller/Popup');

import ContainerFactory = require('factory/Container');
import LiquidFactory = require('factory/Liquid');

import LiquidType = require('model/type/Liquid');
import MouseBloodType = require('model/type/MouseBlood');

import MouseViewController = require('controller/view/Mouse');
import VideoController = require('controller/Video');
import DropOnMouseHelper = require('utils/mouse/DropOnMouseHelper');

describe('Mouse', () => {
    var mc: MouseViewController;

    beforeEach(() => {
        popupController.autoConfirm = true;
        VideoController.autoFinish = true;

        mc = new MouseViewController();
    });

    afterEach(() => {
        popupController.autoConfirm = false;
        VideoController.autoFinish = false;
    });

    describe('Blood sampling', () => {
        it('should draw blood when dropping an empty syring', () => {

            var syringe = ContainerFactory.syringe();

            expect(gameState.inventory.items().length).toBe(0);

            // Drop the syringe on the mouse
            DropOnMouseHelper.handleDrop(mc, syringe);

            expect(gameState.inventory.items().length).toBe(1);

            var tube = gameState.inventory.items()[0];

            expect(tube.contains(LiquidType.MOUSE_BLOOD)).toBeTruthy();
        });
    });
});
