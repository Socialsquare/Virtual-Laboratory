define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType) {
    return {
        handle: function(MC, item) { //MC = MouseController

            if (!MC.mouse().alive())
                return false;

            if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
                MC.popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
                return false;
            }

            MC.mouseDrinking(true);
            MC.mouse().giveJuice();
            MC.videoController.play('fast-drink-spawn', false)
                .done(function () {
                    MC.mouseDrinking(false);

                    MC.runFromState();

                    MC.experimentController.triggerMouse(MC.mouse(), item);
                });
        }
    };
});
