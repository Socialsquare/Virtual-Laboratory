define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem',
    'model/type/Trigger',
    'controller/Experiment'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType, TriggerType, experimentController) {
    return {
        handle: function(MC, item) { //MC = MouseController

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
                .done(function() {
                    MC.popupController.message('mouse.spleen_extracted.header', 'mouse.spleen_extracted.body');

                    MC.mouse().isCut(true);
                    MC.mouse().isInteracting(false);

                    MC.gameState.inventory.add(MC.mouse().spleen.clone());
                });
        }
    };
});
