import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import SpecialItemType = require('model/type/SpecialItem');

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
            .done(function () {
                MC.mouseDrinking(false);
                MC.mouse().isInteracting(false);

                MC.runFromState();

                MC.experimentController.triggerMouse(MC.mouse(), item);
            });
    }
}

export = BottleHandler;
