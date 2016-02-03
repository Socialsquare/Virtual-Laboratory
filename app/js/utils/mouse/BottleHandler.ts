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
            MC.popupController.notify('mouse.sick_no_bloodsugar.header', 
                    'mouse.sick_no_bloodsugar.body', 3500);
            return false;
        }

        MC.mouseDrinking(true);
      
        if (MC.apparatusEnabled('MOUSE_CAGE_BOTTLE', 'FF_BOTTLE')
                && !MC.juiceClampMessageToggle()) {
            MC.juiceClampMessageToggle(true);
            MC.popupController.message('popup.mouse.juice_during_clamp.title', 
                    'popup.mouse.juice_during_clamp.message', 6000);
        }

        mouse.giveJuice();
        mouse.isInteracting(true);
        var videoName = MC.apparatusEnabled('MOUSE_CAGE_BOTTLE', 'FF_BOTTLE') ? 'fast-force-feed' : 'fast-drink-spawn';
        MC.videoController.play(videoName, false)
            .done(() => {
                MC.mouseDrinking(false);
                mouse.isInteracting(false);

                MC.runFromState();

                MC.experimentController.triggerMouse(mouse, item);
            });
    }
}

export = BottleHandler;
