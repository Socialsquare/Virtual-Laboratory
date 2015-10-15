import LiquidType = require('model/type/Liquid');
import MouseType = require('model/type/Mouse');

import experimentController = require('controller/Experiment');
import popupController = require('controller/Popup');
import gameState = require('model/GameState');

import SyringeModel = require('model/Syringe');

import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');

import MouseCageController = require('controller/view/MouseCage');

class SyringeHandler {

    static handle(MC: MouseCageController, syringe: SyringeModel) {
        if (!MC.mousecage.hasMouse()) {
            return false;
        }

        var mouse = MC.mousecage.mouse();

        if (!mouse.alive()) {
            return false;
        }

        // Drawing blood
        if (syringe.isEmpty()) {
            popupController.confirm('mouse.ask_draw_blood.header', 'mouse.ask_draw_blood.body')
                .then(() => MC.videoController.play('fast-draw-blood'))
                .then(() => {
                    // consume the syringe
                    gameState.inventory.remove(syringe);

                    popupController.message('mouse.blood_drawn.header', 'mouse.blood_drawn.body');

                    var blood = LiquidFactory.mouseBlood(mouse.mouseBloodType());
                    var bloodLevels = { 
                        'Glucose' : mouse.meanBloodSugar(), 
                        'Insulin': mouse.insulinProduction() 
                    };
                    var tube = ContainerFactory.tube().add(blood);
                    gameState.inventory.add(tube, '', bloodLevels);

                    MC.runFromState();
                });
            return false;
        }

        // Disallowed contents
        else if (!mouse.areContentsAllowed(syringe)) {
            popupController.message('mouse.syringe_not_allowed.header', 'mouse.syringe_not_allowed.body');
            return false;
        }

        // Killing
        else if (syringe.contains(LiquidType.DEADLY)) {
            if (mouse.mouseType() !== MouseType.HEALTHY) {
                popupController.notify('mouse.sick_no_killing.header', 'mouse.sick_no_killing.body', 3500);
                return false;
            }

            mouse.isInteracting(true);
            MC.videoController.play('fast-injection-lethal', false)
                .done(() => {
                    mouse.alive(false);
                    mouse.isInteracting(false);
                    popupController.message('mouse.died.header', 'mouse.died.body');

                    experimentController.triggerMouse(mouse, syringe);
                });
        }
        // Insulin
        else if (syringe.contains(LiquidType.INSULIN)) {
            if (mouse.mouseType() !== MouseType.HEALTHY) {
                popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
                return false;
            }

            mouse.isInteracting(true);
            MC.injectionFromState().done(() => {
                mouse.giveInsulin();
                mouse.isInteracting(false);

                MC.runFromState();

                experimentController.triggerMouse(mouse, syringe);
            });
        }
        // Vaccination
        else if (syringe.contains(LiquidType.ADJUVANS) &&
                 (syringe.contains(LiquidType.ANTIGEN_GOUT) || syringe.contains(LiquidType.ANTIGEN_SMALLPOX))) {
            mouse.isInteracting(true);
            MC.injectionFromState().done(() => {
                if (syringe.contains(LiquidType.ANTIGEN_GOUT)) {
                    mouse.vaccinate(LiquidType.ANTIGEN_GOUT);
                    popupController.message('mouse.vaccinated_gout.header', 'mouse.vaccinated_gout.body');
                }

                if (syringe.contains(LiquidType.ANTIGEN_SMALLPOX)) {
                    mouse.vaccinate(LiquidType.ANTIGEN_SMALLPOX);
                    popupController.message('mouse.vaccinated_smallpox.header', 'mouse.vaccinated_smallpox.body');
                }

                experimentController.triggerMouse(mouse, syringe);
                MC.runFromState();
                mouse.isInteracting(false);
            });
        }
        // Curing
        else if (syringe.contains(LiquidType.ANTIBODY_SMALLPOX) && mouse.mouseType() === MouseType.SMALLPOX) {
            mouse.isInteracting(true);
            MC.videoController.play(['smallpox-injection', 'smallpox-cure'])
                .done(() => {
                    experimentController.triggerMouse(mouse, syringe);

                    mouse.cure(LiquidType.ANTIBODY_SMALLPOX);
                    popupController.message('mouse.cured_smallpox.header', 'mouse.cured_smallpox.body');

                    MC.runFromState();
                    mouse.isInteracting(false);
                });
        }
        // Curing
        else if (syringe.contains(LiquidType.ANTIBODY_GOUT) && mouse.mouseType() === MouseType.GOUT) {
            mouse.isInteracting(true);
            MC.videoController.play(['slow-injection-body-gout', 'slow-cure-gout'], true)
                .done(() => {
                    experimentController.triggerMouse(mouse, syringe);

                    mouse.cure(LiquidType.ANTIBODY_GOUT);
                    popupController.message('mouse.cured_gout.header', 'mouse.cured_gout.body');
                    MC.runFromState();
                    mouse.isInteracting(false);
                });
        }
        else {
            console.log('TODO: generic warning "indholdet i kanylen bør vist ikke sprøjtes ind i musen"');
            return false;
            /*mouse.isInteracting(true);
              MC.injectionFromState().done(function () {
              MC.runFromState();
              mouse.isInteracting(false);
              experimentController.triggerMouse(mouse, syringe);
              });*/
        }

        return true;
    }
};

export = SyringeHandler;
