import LocalizationService = require('service/Localization');
import QuizHelper = require('utils/QuizHelper');

import popupController = require('controller/Popup');

import LiquidType = require('model/type/Liquid');
import MouseType = require('model/type/Mouse');
import AdministrationType = require('model/type/Administration');

import MouseCageViewController = require('controller/view/MouseCageViewController');

import TubeModel = require('model/Tube');

class TubeHandler {

    static handle(MC: MouseCageViewController, tube: TubeModel) {
        if (!MC.mousecage.hasMouse()) {
            return false;
        }

        var mouse = MC.mousecage.mouse();

        if (!mouse.alive())
            return false;

        // Is the mouse psoriasis or insomnia?
        if (!(mouse.mouseType() === MouseType.PSORIASIS || mouse.mouseType() === MouseType.INSOMNIA)) {
            popupController.notify('mouse.drug_not_correct_type.header', 'mouse.drug_not_correct_type.body');
            return false;
        }

        if (!tube.contains(LiquidType.DESIGNED_DRUG)) {
            popupController.message('mouse.no_drug.header', 'mouse.no_drug.header');
            return false;
        }

        // Are the contents allowed?
        if (!mouse.areContentsAllowed(tube)) {
            popupController.message('mouse.tube_not_allowed.header', 'mouse.tube_not_allowed.body');
            return false;
        }

        // May only contain ONE designed drug
        if (!(tube.liquids().length === 1 && tube.contains(LiquidType.DESIGNED_DRUG))) {
            popupController.message('mouse.tube_not_allowed.header', 'mouse.tube_not_allowed.body');
            return false;
        }

        var drug = tube.liquids()[0];

        // Choice based on mouse type
        if (mouse.mouseType() === MouseType.PSORIASIS) {
            var options = [
                { key: LocalizationService.text('mouse.drug_administration.injection_body'),
                  value: AdministrationType.INJECTION_BODY},
                { key: LocalizationService.text('mouse.drug_administration.pill'),
                  value: AdministrationType.PILL},
                { key: LocalizationService.text('mouse.drug_administration.cream'),
                  value: AdministrationType.CREAM}
            ];


            popupController.select<AdministrationType>('mouse.drug_administration.header', 'mouse.drug_administration.body', options)
                .then((selectedObject) => {
                    var administrationForm = selectedObject.value;

                    switch (administrationForm) {

                    case AdministrationType.INJECTION_BODY:
                        MC.videoController.play('psoriasis-injection', false).done(() => {

                            var values = QuizHelper.drugStepsBeforeCure.getPsoriasisBodyInjection(drug);

                            popupController.video(values.videos, true)
                                .done(() => {

                                    if (values.reachedTarget) {
                                        popupController.message('mouse.drug_cured.header', 'mouse.drug_cured.body');
                                        MC.experimentController.triggerMouse(mouse, tube);
                                        mouse.cureDesignedDrug();
                                    }else {
                                        popupController.message('mouse.drug_not_effective.header', 'mouse.drug_not_effective.body');
                                    }

                                    MC.runFromState();

                                });
                        });
                        break;

                    case AdministrationType.PILL:
                        console.log('TODO: not really a TODO - pill');
                        MC.videoController.play('psoriasis-pill', false).done(() => {
                            var values = QuizHelper.drugStepsBeforeCure.getPsoriasisPill(drug);

                            popupController.video(values.videos, true)
                                .done(() => {

                                    if (values.reachedTarget) {
                                        popupController.message('mouse.drug_cured.header', 'mouse.drug_cured.body');
                                        MC.experimentController.triggerMouse(mouse, tube);
                                        mouse.cureDesignedDrug();
                                    }else {
                                        popupController.message('mouse.drug_not_effective.header', 'mouse.drug_not_effective.body');
                                    }

                                    MC.runFromState();
                                });


                        });
                        break;

                    case AdministrationType.CREAM:
                        console.log('TODO: not really a TODO - cream');
                        MC.videoController.play('psoriasis-cream', false).done(() => {
                            var values = QuizHelper.drugStepsBeforeCure.getPsoriasisCream(drug);

                            popupController.video(values.videos, true)
                                .done(() => {

                                    if (values.reachedTarget) {
                                        popupController.message('mouse.drug_cured.header', 'mouse.drug_cured.body');
                                        MC.experimentController.triggerMouse(mouse, tube);
                                        mouse.cureDesignedDrug();
                                    } else {
                                        popupController.message('mouse.drug_not_effective.header', 'mouse.drug_not_effective.body');
                                    }

                                    MC.runFromState();
                                });
                        });
                        break;
                    }

                });
        }
    }
}

export = TubeHandler;
