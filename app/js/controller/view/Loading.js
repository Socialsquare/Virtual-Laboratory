define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'controller/ExperimentSelector',
    'service/Localization'
], function (ko, $, BaseViewController, ExperimentSelectorController, localizationService) {

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

            self.experimentSelectorController = new ExperimentSelectorController();

            self.enter = function () {
                self.experimentSelectorController.selected(null);
            };
        }


    });

    return Loading;
});
