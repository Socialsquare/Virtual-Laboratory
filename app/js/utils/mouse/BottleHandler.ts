import MouseType = require('model/type/Mouse');

import MouseViewController = require('controller/view/Mouse');

class BottleHandler {

    static handle(MC: MouseViewController, item) {

        if (!MC.mouse().alive())
            return false;

        if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
            MC.popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
            return false;
        }

        MC.mouseDrinking(true);
        MC.mouse().giveJuice();
        MC.mouse().isInteracting(true);
        MC.videoController.play('fast-drink-spawn', false)
            .done(() => {
                MC.mouseDrinking(false);
                MC.mouse().isInteracting(false);

                MC.runFromState();

                MC.experimentController.triggerMouse(MC.mouse(), item);
            });
    }
}

export = BottleHandler;
