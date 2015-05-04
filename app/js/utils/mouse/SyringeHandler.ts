import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import SpecialItemType = require('model/type/SpecialItem');

import experimentController = require('controller/Experiment');
import popupController = require('controller/Popup');
import gameState = require('model/GameState');

import SyringeModel = require('model/Syringe');

import LiquidFactory = require('factory/Liquid');
import ContainerFactory = require('factory/Container');

import MouseViewController = require('controller/view/Mouse');

class SyringeHandler {

    static handle(MC: MouseViewController, syringe: SyringeModel) {

        if (!MC.mouse().alive()) {
            return false;
        }

        // Drawing blood
        else if (syringe.isEmpty()) {
            popupController.confirm("mouse.ask_draw_blood.header", "mouse.ask_draw_blood.body").then(() => {

                // consume the syringe
                gameState.inventory.remove(syringe);

                MC.videoController.play('fast-injection', false).done(() => {
                    popupController.message('mouse.blood_drawn.header','mouse.blood_drawn.body');

                    var blood = LiquidFactory.mouseBlood(MC.mouse().mouseBloodType());
                    var tube = ContainerFactory.tube().add(blood);
                    gameState.inventory.add(tube);

                    MC.runFromState();
                })
            });
            return false;
        }

        // Disallowed contents
        else if (!MC.mouse().areContentsAllowed(syringe)) {
            popupController.message('mouse.syringe_not_allowed.header','mouse.syringe_not_allowed.body');
            return false;
        }

        // Killing
        else if (syringe.contains(LiquidType.DEADLY)) {
            if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
                popupController.notify('mouse.sick_no_killing.header', 'mouse.sick_no_killing.body', 3500);
                return false;
            }

            MC.mouse().isInteracting(true);
            MC.videoController.play('fast-injection-lethal', false)
                .done(() => {
                    MC.mouse().alive(false);
                    MC.mouse().isInteracting(false);
                    popupController.message('mouse.died.header', 'mouse.died.body');

                    experimentController.triggerMouse(MC.mouse(), syringe);
                });
        }
        // Insulin
        else if (syringe.contains(LiquidType.INSULIN)) {
            if (MC.mouse().mouseType() !== MouseType.HEALTHY) {
                popupController.notify('mouse.sick_no_bloodsugar.header', 'mouse.sick_no_bloodsugar.body', 3500);
                return false;
            }

            MC.mouse().isInteracting(true);
            MC.injectionFromState().done(() => {
                MC.mouse().givInsulin();
                MC.mouse().isInteracting(false);

                MC.runFromState();

                experimentController.triggerMouse(MC.mouse(), syringe);
            });
        }
        // Vaccination
        else if (syringe.contains(LiquidType.ADJUVANS) &&
                 (syringe.contains(LiquidType.ANTIGEN_GOUT) || syringe.contains(LiquidType.ANTIGEN_SMALLPOX))) {
            MC.mouse().isInteracting(true);
            MC.injectionFromState().done(() => {
                if (syringe.contains(LiquidType.ANTIGEN_GOUT)) {
                    MC.mouse().vaccinate(LiquidType.ANTIGEN_GOUT);
                    popupController.message('mouse.vaccinated_gout.header','mouse.vaccinated_gout.body');
                }

                if (syringe.contains(LiquidType.ANTIGEN_SMALLPOX)) {
                    MC.mouse().vaccinate(LiquidType.ANTIGEN_SMALLPOX);
                    popupController.message('mouse.vaccinated_smallpox.header','mouse.vaccinated_smallpox.body');
                }

                experimentController.triggerMouse(MC.mouse(), syringe);
                MC.runFromState();
                MC.mouse().isInteracting(false);
            });
        }
        // Curing
        else if (syringe.contains(LiquidType.ANTIBODY_SMALLPOX) && MC.mouse().mouseType() === MouseType.SMALLPOX) {
            MC.mouse().isInteracting(true);
            MC.videoController.play(['smallpox-injection', 'smallpox-cure'])
                .done(() => {
                    experimentController.triggerMouse(MC.mouse(), syringe);

                    MC.mouse().cure(LiquidType.ANTIBODY_SMALLPOX);
                    popupController.message('mouse.cured_smallpox.header','mouse.cured_smallpox.body');

                    MC.runFromState();
                    MC.mouse().isInteracting(false);
                });
        }
        // Curing
        else if (syringe.contains(LiquidType.ANTIBODY_GOUT) && MC.mouse().mouseType() === MouseType.GOUT) {
            MC.mouse().isInteracting(true);
            MC.videoController.play(['slow-injection-body-gout', 'slow-cure-gout'], true)
                .done(() => {
                    experimentController.triggerMouse(MC.mouse(), syringe);

                    MC.mouse().cure(LiquidType.ANTIBODY_GOUT);
                    popupController.message('mouse.cured_gout.header','mouse.cured_gout.body');
                    MC.runFromState();
                    MC.mouse().isInteracting(false);
                });
        }
        else {
            console.log('TODO: generic warning "indholdet i kanylen bør vist ikke sprøjtes ind i musen"');
            return false;
            /*MC.mouse().isInteracting(true);
              MC.injectionFromState().done(function () {
              MC.runFromState();
              MC.mouse().isInteracting(false);
              experimentController.triggerMouse(MC.mouse(), syringe);
              });*/
        }
    }
};

export = SyringeHandler;
