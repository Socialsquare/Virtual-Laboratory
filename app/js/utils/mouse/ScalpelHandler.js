define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType) {
    return {
        handle: function(MC, item) { //MC = MouseController

            if (MC.mouse().alive()) {
                MC.popupController.message('mouse.cut_alive.header', 'mouse.cut_alive.body');
                return false;
            }

            if (MC.mouse().mouseType !== MouseType.HEALTHY) {
                MC.popupController.message('mouse.cut_not_healthy.header', 'mouse.cut_not_healthy.body');
                return false;
            }

            MC.videoController.play('fast-dead-cut', false)
                .done(function() {
                    MC.popupController.message('mouse.spleen_extracted.header', 'mouse.spleen_extracted.body');
                    MC.mouse().isCut(true);

                    var clonedSpleen = MC.mouse().spleen.clone(); //TODO: test
                    MC.gameState.inventory.add(clonedSpleen); //Is a reference to the spleen in the mouse, but it is only used once anyways

                    MC.experimentController.triggerMouse('cut');
                });

        }
    };
});


