define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType) {
    return {
        handleDrop: function(MC, item) { //MC = MouseController
            //TODO: decision tree based on 1st item, 2nd mouseType
            switch(item.type()) {
                case ContainerType.BOTTLE:
                    if (!MC.mouse().alive())
                        return false;

                    if (MC.mouse().mouseType() !== MouseType.HEALTHY)
                    {
                        MC.popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
                        return false;
                    }


                    MC.mouseDrinking(true);
                    MC.videoController.play('fast-drink-spawn', false)
                        .done(function () {
                            //MC.experimentController.triggerMouse(MouseEvent.)
                            MC.mouseDrinking(false);
                            MC.runFromState();
                            MC.experimentController.triggerMouse('drink', item);
                        });
                    MC.mouse().givJuice();
                    break;

                case SpecialItemType.SCALPEL:
                    if (MC.mouse().alive()) {
                        MC.popupController.message('mouse.cut_alive.header', 'mouse.cut_alive.body');
                        return false;
                    } else {
                        MC.videoController.play('fast-dead-cut', false)
                            .done(function() {
                                MC.popupController.message('mouse.spleen_extracted.header', 'mouse.spleen_extracted.body');
                                MC.mouse().isCut(true);

                                var clonedSpleen = MC.mouse().spleen.clone(); //TODO: test
                                MC.gameState.inventory.add(clonedSpleen); //Is a reference to the spleen in the mouse, but it is only used once anyways

                                MC.experimentController.triggerMouse('cut');
                            });


                    }
                    break;

                case ContainerType.SYRINGE:
                    if (!MC.mouse().alive()) {
                        return false;
                    }
                    else if (item.contains(LiquidType.DEADLY)) {
                        MC.videoController.play('fast-injection-lethal', false)
                            .done(function () {
                                MC.mouse().alive(false);
                                MC.popupController.message('mouse.died.header', 'mouse.died.body');

                                MC.experimentController.triggerMouse('injection', item);
                            });
                    }
                    else if (item.contains(LiquidType.INSULIN)) {
                        MC.injectionFromState().done(function () {
                            MC.mouse().givInsulin();

                            MC.runFromState();

                            MC.experimentController.triggerMouse('injection', item);
                        });
                    }
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
                    else if (item.contains(LiquidType.ANTIBODY_SMALLPOX) && MC.mouse().mouseType() === MouseType.SMALLPOX) {
                        MC.videoController.play(['smallpox-injection', 'smallpox-cure'])
                            .done(function() {
                                MC.mouse().cure(LiquidType.ANTIBODY_SMALLPOX);
                                MC.popupController.message('mouse.cured_smallpox.header','mouse.cured_smallpox.body');

                                MC.experimentController.triggerMouse('injection', item);
                                MC.runFromState();
                            });
                    }
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
                    break;
            }
        }
    };
});
