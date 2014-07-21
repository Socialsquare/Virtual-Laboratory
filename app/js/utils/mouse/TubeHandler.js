define([
    'service/Localization',

    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem',
    'model/type/Administration'
], function (LocalizationService, ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType, AdministrationType) {
    return {
        handle: function(MC, tube) { //MC = MouseController

            if (!MC.mouse().alive())
                return false;

            // Is the mouse psoriasis or insomnia?
            if (! (MC.mouse().mouseType() === MouseType.PSORIASIS || MC.mouse().mouseType() === MouseType.INSOMNIA) ) {
                MC.popupController.notify('mouse.drug_not_correct_type.header', 'mouse.drug_not_correct_type.body');
                return false;
            }

            // Are the contents allowed?
            if (!MC.mouse().areContentsAllowed(tube)) {
                MC.popupController.message('mouse.tube_not_allowed.header','mouse.tube_not_allowed.body');
                return false;
            }

            // May only contain ONE designed drug
            if (! (tube.liquids().length === 1 && tube.contains(LiquidType.DESIGNED_DRUG) )) {
                MC.popupController.message('mouse.tube_not_allowed.header','mouse.tube_not_allowed.body');
                return false;
            }

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


                MC.popupController.select('mouse.drug_administration.header', 'mouse.drug_administration.body', options)
                    .then(function (selectedObject) {
                        var administrationForm = selectedObject.administrationForm;
                        //TODO: var res = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                        switch(administrationForm) {

                            case AdministrationType.INJECTION_BODY:
                                MC.videoController.play('psoriasis-injection', false).done(function() {
                                    var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                    MC.runFromState();
                                    MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                });
                                break;

                            case AdministrationType.PILL:
                                MC.videoController.play('psoriasis-pill', false).done(function() {
                                    var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                    MC.runFromState();
                                    MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                });
                                break;

                            case AdministrationType.CREAM:
                                MC.videoController.play('psoriasis-cream', false).done(function() {
                                    var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                    MC.runFromState();
                                    MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                });
                                break;
                        }

                    });



            }else if (MC.mouse().mouseType() === MouseType.INSOMNIA) {
                var options = [
                    {key: LocalizationService.text('mouse.drug_administration.injection_body'),
                        administrationForm: AdministrationType.INJECTION_BODY},
                    {key: LocalizationService.text('mouse.drug_administration.injection_head'),
                        administrationForm: AdministrationType.INJECTION_HEAD},
                    {key: LocalizationService.text('mouse.drug_administration.pill'),
                        administrationForm: AdministrationType.PILL},
                    {key: LocalizationService.text('mouse.drug_administration.cream'),
                        administrationForm: AdministrationType.CREAM}
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

            }







        }
    };
});
