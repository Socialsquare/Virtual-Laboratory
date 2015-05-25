import MouseType = require('model/type/Mouse');

import experimentController = require('controller/Experiment');

import MouseViewController = require('controller/view/Mouse');

class ScalpelHandler {

    static handle(MC: MouseViewController, item) {

        if (MC.mouse().alive()) {
            MC.popupController.message('mouse.cut_alive.header', 'mouse.cut_alive.body');
            return false;
        }

        if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
            MC.popupController.message('mouse.cut_not_healthy.header', 'mouse.cut_not_healthy.body');
            return false;
        }

        MC.mouse().isInteracting(true);
        MC.videoController.play('fast-dead-cut', false)
            .done(() => {
                MC.popupController.message('mouse.spleen_extracted.header', 'mouse.spleen_extracted.body');

                MC.mouse().isCut(true);
                MC.mouse().isInteracting(false);

                MC.gameState.inventory.add(MC.mouse().spleen.clone());

                experimentController.triggerMouse(MC.mouse(), item);
            });
    }
}

export = ScalpelHandler;
