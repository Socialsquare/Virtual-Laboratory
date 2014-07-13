define([
    'knockout',
    'controller/view/Base',
    'service/Exercise'
], function (ko, BaseViewController, exerciseService) {

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

            self.start = function () {
                self.gameState.currentExercise(self.selected());
                self.router.navigate('overview');
            };
        },
    });

    return ExerciseSelector;
});
