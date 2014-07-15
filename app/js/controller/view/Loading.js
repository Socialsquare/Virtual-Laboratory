define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'controller/ExerciseSelector',
    'service/Localization'
], function (ko, $, BaseViewController, ExerciseSelectorController, localizationService) {

    var Loading = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('loading');
            self.hasMenu(false);

            self.percent = ko.observable(0);
            self.isLoaded = ko.observable(false);
            self.localizationService = localizationService;

            self.selectLang = function (langCode) {
                self.localizationService.setLanguage(langCode);
            };

            $.html5Loader({
                filesToLoad: '../../assets/preload.json',
                // debugMode: true,
                onUpdate: function (progress) { self.percent(progress); },
                onComplete: function () {
                    self.isLoaded(true);
                }
            });

            self.exerciseSelectorController = new ExerciseSelectorController();

            self.enter = function () {
                self.exerciseSelectorController.selected(null);
            };
        }


    });

    return Loading;
});
