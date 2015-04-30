import LocalizationService = require('service/Localization');
import DrugService = require('service/Drug');
import QuizHelper = require('utils/QuizHelper');

import popupController = require('controller/Popup');

import ContainerType = require('model/type/Container');
import LiquidType = require('model/type/Liquid');
import MouseType = require('model/type/Mouse');
import MouseBloodType = require('model/type/MouseBlood');
import SpecialItemType = require('model/type/SpecialItem');
import AdministrationType = require('model/type/Administration');

import MouseViewController = require('controller/view/Mouse');

class TubeHandler {

    static handle(MC: MouseViewController, tube) {

        if (!MC.mouse().alive())
            return false;

        // Is the mouse psoriasis or insomnia?
        if (!(MC.mouse().mouseType() === MouseType.PSORIASIS || MC.mouse().mouseType() === MouseType.INSOMNIA) ) {
            popupController.notify('mouse.drug_not_correct_type.header', 'mouse.drug_not_correct_type.body');
            return false;
        }

        if (!tube.contains(LiquidType.DESIGNED_DRUG)) {
            popupController.message('mouse.no_drug.header', -'mouse.no_drug.header');
            return false;
        }

        // Are the contents allowed?
        if (!MC.mouse().areContentsAllowed(tube)) {
            popupController.message('mouse.tube_not_allowed.header','mouse.tube_not_allowed.body');
            return false;
        }

        // May only contain ONE designed drug
        if (! (tube.liquids().length === 1 && tube.contains(LiquidType.DESIGNED_DRUG) )) {
            popupController.message('mouse.tube_not_allowed.header','mouse.tube_not_allowed.body');
            return false;
        }

        var drug = tube.liquids()[0];

        // Choice based on mouse type
        if (MC.mouse().mouseType() === MouseType.PSORIASIS) {
            var options = [
                {key: LocalizationService.text('mouse.drug_administration.injection_body'),
                 administrationForm: AdministrationType.INJECTION_BODY},
                {key: LocalizationService.text('mouse.drug_administration.pill'),
                 administrationForm: AdministrationType.PILL},
                {key: LocalizationService.text('mouse.drug_administration.cream'),
                 administrationForm: AdministrationType.CREAM}
            ];


            popupController.select('mouse.drug_administration.header', 'mouse.drug_administration.body', options)
                .then((selectedObject) => {
                    var administrationForm = selectedObject.administrationForm;

                    switch(administrationForm) {

                    case AdministrationType.INJECTION_BODY:
                        console.log('TODO: not really a TODO - injection-body');
                        MC.videoController.play('psoriasis-injection', false).done(() => {

                            var values = QuizHelper.drugStepsBeforeCure.getPsoriasisBodyInjection(drug);

                            popupController.video(values.videos, true)
                                .done(() => {

                                    if(values.reachedTarget) {
                                        popupController.message('mouse.drug_cured.header', 'mouse.drug_cured.body');
                                        MC.experimentController.triggerMouse(MC.mouse(), tube);
                                        MC.mouse().cureDesignedDrug();
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

                                    if(values.reachedTarget) {
                                        popupController.message('mouse.drug_cured.header', 'mouse.drug_cured.body');
                                        MC.experimentController.triggerMouse(MC.mouse(), tube);
                                        MC.mouse().cureDesignedDrug();
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
                                        MC.experimentController.triggerMouse(MC.mouse(), tube);
                                        MC.mouse().cureDesignedDrug();
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

//TODO: won't implement this, as it is nonsense to design ONE drug, but treat two diseases.
/*else if (MC.mouse().mouseType() === MouseType.INSOMNIA) {
  var options = [
  {
  key: LocalizationService.text('mouse.drug_administration.injection_body'),
  administrationForm: AdministrationType.INJECTION_BODY
  },
  {
  key: LocalizationService.text('mouse.drug_administration.injection_head'),
  administrationForm: AdministrationType.INJECTION_HEAD
  },
  {
  key: LocalizationService.text('mouse.drug_administration.pill'),
  administrationForm: AdministrationType.PILL
  },
  {
  key: LocalizationService.text('mouse.drug_administration.cream'),
  administrationForm: AdministrationType.CREAM
  }
  ];


  MC.popupController.select('washing.concentration', 'washing.concentration.choose', options)
  .then(function (selectedObject) {
  var administrationForm = selectedObject.administrationForm;
  //TODO: var res = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

  switch(administrationForm) {
  case AdministrationType.INJECTION_HEAD:
  MC.videoController.play('slow-injection-body-faint', false).done(function() {
  MC.videoController.play('slow-injection-head', false).done(function() {
  MC.videoController.play('slow-wake', false).done(function() {

  var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

  MC.runFromState();
  MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling

  });
  });
  });
  break;

  case AdministrationType.INJECTION_BODY:
  MC.videoController.play('slow-injection-body', false).done(function() {
  var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

  MC.runFromState();
  MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
  });
  break;

  case AdministrationType.PILL:
  MC.videoController.play('slow-pill', false).done(function() {
  var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

  MC.runFromState();
  MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
  });
  break;

  case AdministrationType.CREAM:
  MC.videoController.play('slow-cream', false).done(function() {
  var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

  MC.runFromState();
  MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
  });
  break;
  }

  });

  }*/
