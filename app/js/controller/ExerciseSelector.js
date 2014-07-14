define([
    'knockout',
    'controller/view/Base',
    'controller/Popup',
    'service/Exercise'
], function (ko, BaseViewController, popupController, exerciseService) {

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
                if (self.gameState.currentExercise()) {
                    popupController.confirm('Skift øvelse', 'Er du sikker?', function (answer) {
                        if (answer) self.gameState.currentExercise(self.selected());
                    });

                    return;
                }

                self.gameState.currentExercise(self.selected());

                self.router.navigate('overview');
            };
        },
    });

    return ExerciseSelector;
});
