define([
    'knockout',
    'jquery',
    'controller/view/Base',
    'controller/ExerciseSelector'
], function (ko, $, BaseViewController, ExerciseSelectorController) {

    var Loading = BaseViewController.extend({
        constructor: function () {
            var self = this;
            self.base('loading');
            self.hasMenu(false);

            self.percent = ko.observable(0);
            self.isLoaded = ko.observable(false);

            $.html5Loader({
                filesToLoad: '../../assets/preload.json',
                // debugMode: true,
                onUpdate: function (progress) { self.percent(progress); },
                onComplete: function () {
                    self.isLoaded(true);
                }
            });

            self.exerciseSelectorController = new ExerciseSelectorController();
        }
    });

    return Loading;
});
