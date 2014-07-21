define([
    'model/type/Container',
    'model/type/Liquid',
    'model/type/Mouse',
    'model/type/MouseBlood',
    'model/type/SpecialItem',
    'model/type/Administration'
], function (ContainerType, LiquidType, MouseType, MouseBloodType, SpecialItemType, AdministrationType) {
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
                var options = [ //TODO: i18n localization
                    {key: 'Indsprøjtning i kroppen', administrationForm: AdministrationType.INJECTION_BODY},
                    {key: 'Pille', administrationForm: AdministrationType.PILL},
                    {key: 'Creme', administrationForm: AdministrationType.CREME}
                ];


                MC.popupController.select('washing.concentration', 'washing.concentration.choose', options)
                    .then(function (selectedObject) {
                        var administrationForm = selectedObject.administrationForm;
                        //TODO: var res = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                        switch(administrationForm) {

                            case AdministrationType.INJECTION_BODY: //TODO:
                                MC.videoController.play('psoriasis-injection', false).done(function() {
                                    var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                    MC.runFromState();
                                    MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                });
                                break;

                            case AdministrationType.PILL: //TODO:
                                MC.videoController.play('psoriasis-pill', false).done(function() {
                                    var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                    MC.runFromState();
                                    MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                });
                                break;

                            case AdministrationType.CREAM: //TODO:
                                MC.videoController.play('psoriasis-cream', false).done(function() {
                                    var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                    MC.runFromState();
                                    MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                });
                                break;
                        }

                    });



            }else if (MC.mouse().mouseType() === MouseType.INSOMNIA) {
                var options = [ //TODO: i18n localization
                    {key: 'Indsprøjtning i kraniet', administrationForm: AdministrationType.INJECTION_HEAD},
                    {key: 'Indsprøjtning i kroppen', administrationForm: AdministrationType.INJECTION_BODY},
                    {key: 'Pille', administrationForm: AdministrationType.PILL},
                    {key: 'Creme', administrationForm: AdministrationType.CREME}
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

                                case AdministrationType.INJECTION_BODY: //TODO:
                                    MC.videoController.play('slow-injection-body', false).done(function() {
                                        var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                        MC.runFromState();
                                        MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                    });
                                    break;

                                case AdministrationType.PILL: //TODO:
                                    MC.videoController.play('slow-pill', false).done(function() {
                                        var result = MC.mouse().giveDrug(tube.liquids()[0], administrationForm);

                                        MC.runFromState();
                                        MC.experimentController.triggerMouse('designed-drug', tube); //TODO: handling
                                    });
                                    break;

                                case AdministrationType.CREAM: //TODO:
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
