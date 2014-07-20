define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem',
    'controller/Experiment'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType, experimentController) {
    return {
        handle: function(MC, item) { //MC = MouseController

            if (!MC.mouse().alive()) {
                return false;
            }

            if (!MC.mouse().isSyringeGenerallyAllowed(item)) {
                MC.popupController.message('mouse.syringe_not_allowed.header','mouse.syringe_not_allowed.body');
                return false;
            }

// Killing
            else if (item.contains(LiquidType.DEADLY)) {
                if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
                    MC.popupController.notify('mouse.sick_no_killing.header', 'mouse.sick_no_killing.body', 3500);
                    return false;
                }

                MC.videoController.play('fast-injection-lethal', false)
                    .done(function () {
                        MC.mouse().alive(false);
                        MC.popupController.message('mouse.died.header', 'mouse.died.body');

                        experimentController.triggerMouse(MC.mouse(), item);
                    });
            }
// Insulin
            else if (item.contains(LiquidType.INSULIN)) {
                if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
                    MC.popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
                    return false;
                }

                MC.injectionFromState().done(function () {
                    MC.mouse().givInsulin();

                    MC.runFromState();

                    experimentController.triggerMouse(MC.mouse(), item);
                });
            }
// Vaccination
            else if (item.contains(LiquidType.ADJUVANS) &&
                (item.contains(LiquidType.ANTIGEN_GOUT) || item.contains(LiquidType.ANTIGEN_SMALLPOX))) {
                MC.injectionFromState().done(function () {
                    if (item.contains(LiquidType.ANTIGEN_GOUT)) {
                        MC.mouse().vaccinate(LiquidType.ANTIGEN_GOUT);
                        MC.popupController.message('mouse.vaccinated_gout.header','mouse.vaccinated_gout.body');
                    }

                    if (item.contains(LiquidType.ANTIGEN_SMALLPOX)) {
                        MC.mouse().vaccinate(LiquidType.ANTIGEN_SMALLPOX);
                        MC.popupController.message('mouse.vaccinated_smallpox.header','mouse.vaccinated_smallpox.body');
                    }

                    experimentController.triggerMouse(MC.mouse(), item);
                    MC.runFromState();
                });
            }
// Curing
            else if (item.contains(LiquidType.ANTIBODY_SMALLPOX) && MC.mouse().mouseType() === MouseType.SMALLPOX) {
                MC.videoController.play(['smallpox-injection', 'smallpox-cure'])
                    .done(function() {
                        MC.mouse().cure(LiquidType.ANTIBODY_SMALLPOX);
                        MC.popupController.message('mouse.cured_smallpox.header','mouse.cured_smallpox.body');

                        experimentController.triggerMouse(MC.mouse(), item);
                        MC.runFromState();
                    });
            }
// Curing
            else if (item.contains(LiquidType.ANTIBODY_GOUT) && MC.mouse().mouseType() === MouseType.GOUT) {
                MC.videoController.play(['slow-injection-body-gout', 'slow-cure-gout'], true)
                    .done(function() {
                        MC.mouse().cure(LiquidType.ANTIBODY_GOUT);
                        MC.popupController.message('mouse.cured_gout.header','mouse.cured_gout.body');

                        experimentController.triggerMouse(MC.mouse(), item);
                        MC.runFromState();
                    });
            }
            else {
                MC.injectionFromState().done(function () {
                    MC.runFromState();
                    experimentController.triggerMouse(MC.mouse(), item);
                });
            }
        }
    };
});
