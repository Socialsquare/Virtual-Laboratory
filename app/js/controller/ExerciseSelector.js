define([
    'knockout',
    'controller/view/Base',
    'controller/Popup',
    'controller/Experiment',
    'service/Exercise'
], function (ko, BaseViewController, popupController, experimentController, exerciseService) {

    var ExerciseSelector = BaseViewController.extend({

        constructor: function () {
            var self = this;

            self.exercises = ko.observableArray([]);
            self.selected = ko.observable();

            exerciseService.getExercises().done(function (exercises) {
                self.exercises(exercises);
            });

            self.select = function (exercise) {
                self.selected(exercise);
            };

            self.goBack = function () {
                self.router.back();
            };

            self.start = function () {
                if (self.experimentController.hasExperiment()) {
                    popupController.confirm('Skift øvelse', 'Er du sikker?', function (answer) {
                        if (answer) self.gameState.currentExercise(self.selected());
                    });

                    return;
                }

                self.experimentController.startExperiment(self.selected());

                self.router.navigate('overview');
            };
        },
    });

    return ExerciseSelector;
});
