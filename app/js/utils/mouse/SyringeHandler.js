define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType) {
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
                if (MC.mouse().mouseType() !== MouseType.HEALTHY)
                {
                    MC.popupController.notify('mouse.sick_no_killing.header', 'mouse.sick_no_killing.body', 3500);
                    return false;
                }

                MC.videoController.play('fast-injection-lethal', false)
                    .done(function () {
                        MC.mouse().alive(false);
                        MC.popupController.message('mouse.died.header', 'mouse.died.body');

                        MC.experimentController.triggerMouse('injection', item);
                    });
            }
// Insulin
            else if (item.contains(LiquidType.INSULIN)) {
                MC.injectionFromState().done(function () {
                    MC.mouse().givInsulin();

                    MC.runFromState();

                    MC.experimentController.triggerMouse('injection', item);
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

                    MC.experimentController.triggerMouse('injection', item);
                    MC.runFromState();
                });
            }
// Curing
            else if (item.contains(LiquidType.ANTIBODY_SMALLPOX) && MC.mouse().mouseType() === MouseType.SMALLPOX) {
                MC.videoController.play(['smallpox-injection', 'smallpox-cure'])
                    .done(function() {
                        MC.mouse().cure(LiquidType.ANTIBODY_SMALLPOX);
                        MC.popupController.message('mouse.cured_smallpox.header','mouse.cured_smallpox.body');

                        MC.experimentController.triggerMouse('injection', item);
                        MC.runFromState();
                    });
            }
// Curing
            else if (item.contains(LiquidType.ANTIBODY_GOUT) && MC.mouse().mouseType() === MouseType.GOUT) {
                MC.videoController.play(['slow-injection-body-gout', 'slow-cure-gout'], true)
                    .done(function() {
                        MC.mouse().cure(LiquidType.ANTIBODY_GOUT);
                        MC.popupController.message('mouse.cured_gout.header','mouse.cured_gout.body');

                        MC.experimentController.triggerMouse('injection', item);
                        MC.runFromState();
                    });
            }
            else {
                MC.injectionFromState().done(function () {
                    MC.runFromState();
                    MC.experimentController.triggerMouse('injection', item);
                });
            }

        }
    };
});


