define([
    'knockout',
    'controller/view/Base',
    'controller/Router',
    'service/Exercise'
], function (ko, BaseViewController, router, exerciseService) {

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
                router.navigate('overview');
            };
        },
    });

    return ExerciseSelector;
});
