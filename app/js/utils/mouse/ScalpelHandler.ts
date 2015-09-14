import MouseType = require('model/type/Mouse');

import experimentController = require('controller/Experiment');

import MouseCageViewController = require('controller/view/MouseCageViewController');

class ScalpelHandler {

    static handle(MC: MouseCageViewController, item) {
        if (!MC.mousecage.hasMouse()) {
            return false;
        }

        var mouse = MC.mousecage.mouse();

        if (mouse.alive()) {
            MC.popupController.message('mouse.cut_alive.header', 'mouse.cut_alive.body');
            return false;
        }

        if (mouse.mouseType() !== MouseType.HEALTHY) {
            MC.popupController.message('mouse.cut_not_healthy.header', 'mouse.cut_not_healthy.body');
            return false;
        }

        mouse.isInteracting(true);
        MC.videoController.play('fast-dead-cut', false)
            .done(() => {
                MC.popupController.message('mouse.spleen_extracted.header', 'mouse.spleen_extracted.body');

                mouse.isCut(true);
                mouse.isInteracting(false);

                MC.gameState.inventory.add(mouse.spleen.clone());

                experimentController.triggerMouse(mouse, item);
            });
    }
}

export = ScalpelHandler;
