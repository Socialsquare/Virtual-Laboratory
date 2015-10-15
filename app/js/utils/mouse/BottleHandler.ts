import MouseType = require('model/type/Mouse');

import MouseCageController = require('controller/view/MouseCage');

class BottleHandler {

    static handle(MC: MouseCageController, item) {
        if (!MC.mousecage.hasMouse()) {
            return false;
        }

        var mouse = MC.mousecage.mouse();

        if (!mouse.alive())
            return false;

        if (mouse.mouseType() !== MouseType.HEALTHY) {
            MC.popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
            return false;
        }

        MC.mouseDrinking(true);
        mouse.giveJuice();
        mouse.isInteracting(true);
        MC.videoController.play('fast-drink-spawn', false)
            .done(() => {
                MC.mouseDrinking(false);
                mouse.isInteracting(false);

                MC.runFromState();

                MC.experimentController.triggerMouse(mouse, item);
            });
    }
}

export = BottleHandler;
